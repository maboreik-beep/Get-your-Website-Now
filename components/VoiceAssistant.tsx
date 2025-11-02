import React, { useState, useRef, useEffect, useCallback, useContext } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality, Blob, FunctionDeclaration, Tool, FunctionCall, Session } from '@google/genai';
import { Icon } from '../constants';
import { WebsiteContext } from '../App';
import { tools } from '../services/aiFunctions';
import { Page, Section } from '../types';

// --- Audio decoding/encoding helpers ---
function decode(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

function encode(bytes: Uint8Array): string {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function createBlob(data: Float32Array): Blob {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}


const VoiceAssistant: React.FC = () => {
    const context = useContext(WebsiteContext);
    const [isActive, setIsActive] = useState(false);
    const [status, setStatus] = useState<'idle' | 'connecting' | 'listening' | 'speaking' | 'error'>('idle');
    const [transcriptions, setTranscriptions] = useState<{user: string, model: string}[]>([]);
    const [currentTranscription, setCurrentTranscription] = useState({ user: '', model: ''});
    
    // FIX: Replaced non-exported 'LiveSession' type with `Session` from @google/genai
    const sessionPromiseRef = useRef<Promise<Session> | null>(null);
    const mediaStreamRef = useRef<MediaStream | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
    const mediaStreamSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
    
    const outputAudioContextRef = useRef<AudioContext | null>(null);
    const nextStartTimeRef = useRef<number>(0);
    const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

    const stopConversation = useCallback(() => {
        if (sessionPromiseRef.current) {
            // FIX: Explicitly type 'session' in the .then() callback
            sessionPromiseRef.current.then((session: Session) => session.close()).catch(e => console.error("Error closing session:", e));
            sessionPromiseRef.current = null;
        }
        if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach(track => track.stop());
            mediaStreamRef.current = null;
        }
        if (scriptProcessorRef.current) {
            scriptProcessorRef.current.disconnect();
            scriptProcessorRef.current = null;
        }
        if (mediaStreamSourceRef.current) {
            mediaStreamSourceRef.current.disconnect();
            mediaStreamSourceRef.current = null;
        }
        if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
            audioContextRef.current.close().catch(e => console.error("Error closing input audio context:", e));
            audioContextRef.current = null;
        }
        if (outputAudioContextRef.current && outputAudioContextRef.current.state !== 'closed') {
            sourcesRef.current.forEach(source => source.stop());
            sourcesRef.current.clear();
            outputAudioContextRef.current.close().catch(e => console.error("Error closing output audio context:", e));
            outputAudioContextRef.current = null;
        }
        setIsActive(false);
        setStatus('idle');
    }, []);

    const handleFunctionCall = useCallback(async (functionCalls: FunctionCall[]) => {
        if (!context || !sessionPromiseRef.current) return;
        const { setWebsite, activePageId } = context;
  
        for (const call of functionCalls) {
          const { name, args, id } = call;
          let result: any = { success: false, message: "Function not found or failed." };
          
          console.log(`AI wants to call function "${name}" with args:`, args);
  
          if (name === 'updateSectionContent') {
              const { pageId, sectionId, field, value, itemId, itemField } = args;
              const targetPageId = pageId || activePageId;
  
              setWebsite(prev => {
                  if (!prev) return prev;
                  const draft = JSON.parse(JSON.stringify(prev));
                  const page = draft.pages.find((p: Page) => p.id === targetPageId);
                  if (page) {
                      const section = page.sections.find((s: Section) => s.id === sectionId);
                      if (section) {
                         if (itemId && (section as any).items?.length) {
                             const item = (section as any).items.find((i: any) => i.id === itemId);
                             // FIX: Cast itemField to string for object indexing
                             if (item) item[itemField as string] = value;
                             result = { success: true, message: `Updated item ${itemField} in section ${section.type}.`};
                         } else if (itemId && (section as any).members?.length) {
                             const member = (section as any).members.find((m: any) => m.id === itemId);
                             // FIX: Cast itemField to string for object indexing
                             if(member) member[itemField as string] = value;
                             result = { success: true, message: `Updated member ${itemField} in section ${section.type}.`};
                         } else if (itemId && (section as any).timeline?.length) {
                             const timelineItem = (section as any).timeline.find((t: any) => t.id === itemId);
                             // FIX: Cast itemField to string for object indexing
                             if(timelineItem) timelineItem[itemField as string] = value;
                             result = { success: true, message: `Updated timeline item ${itemField} in section ${section.type}.`};
                         }
                         else {
                             // FIX: Cast field to string for object indexing
                             (section as any)[field as string] = value;
                             result = { success: true, message: `Updated ${field} in section ${section.type}.`};
                         }
                      } else { result.message = "Section not found." }
                  } else { result.message = "Page not found." }
                  return draft;
              });
          }
          // After executing the function call, you must send the response back to the model
          // FIX: Explicitly type 'session' in the .then() callback
          sessionPromiseRef.current.then((session: Session) => {
            session.sendToolResponse({
                functionResponses: {
                    id : id,
                    name: name,
                    response: { result: result.message }, // Send back result message
                }
            })
          });
        }
    }, [context, sessionPromiseRef]);
    
    const startConversation = useCallback(async () => {
        if (isActive || !process.env.API_KEY || !context) return;
        
        setIsActive(true);
        setStatus('connecting');
        setCurrentTranscription({ user: '', model: '' });
        setTranscriptions([]);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaStreamRef.current = stream;

            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
            outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
            nextStartTimeRef.current = 0;

            // Provide current website structure as system instruction context
            const websiteContextInstruction = `You are a voice assistant helping a user build a website. Be friendly, concise, and helpful. The user's current website data is: ${JSON.stringify(context.website, null, 2)}. The current active page is '${context.website.pages.find(p => p.id === context.activePageId)?.name}'. Use this context to answer questions and fulfill edit requests using your tools.`;
            
            // FIX: sessionPromiseRef.current is already Promise<Session>, so direct assignment is correct.
            // The previous error was a misleading type inference issue.
            sessionPromiseRef.current = ai.live.connect({
                model: 'gemini-2.5-flash-native-audio-preview-09-2025',
                config: {
                    responseModalities: [Modality.AUDIO],
                    inputAudioTranscription: {},
                    outputAudioTranscription: {},
                    systemInstruction: websiteContextInstruction,
                    tools: tools as Tool[], // Include tools for function calling
                },
                callbacks: {
                    onopen: () => {
                        setStatus('listening');
                        const source = audioContextRef.current!.createMediaStreamSource(stream);
                        mediaStreamSourceRef.current = source;
                        const scriptProcessor = audioContextRef.current!.createScriptProcessor(4096, 1, 1);
                        scriptProcessorRef.current = scriptProcessor;

                        scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
                            const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
                            const pcmBlob = createBlob(inputData);
                            if (sessionPromiseRef.current) {
                                // FIX: Explicitly type 'session' in the .then() callback
                                sessionPromiseRef.current.then((session: Session) => {
                                    session.sendRealtimeInput({ media: pcmBlob });
                                });
                            }
                        };
                        source.connect(scriptProcessor);
                        scriptProcessor.connect(audioContextRef.current!.destination);
                    },
                    onmessage: async (message: LiveServerMessage) => {
                        // Handle transcription
                        if (message.serverContent?.outputTranscription) {
                            setCurrentTranscription(prev => ({ ...prev, model: prev.model + message.serverContent!.outputTranscription.text }));
                        }
                        if (message.serverContent?.inputTranscription) {
                            setCurrentTranscription(prev => ({ ...prev, user: prev.user + message.serverContent!.inputTranscription.text }));
                        }

                        if (message.serverContent?.turnComplete) {
                            setTranscriptions(prevHistory => {
                                // Only add if there was actual user or model speech in this turn
                                if (currentTranscription.user || currentTranscription.model) {
                                    return [...prevHistory, currentTranscription];
                                }
                                return prevHistory;
                            });
                            setCurrentTranscription({ user: '', model: '' }); // Reset for the next turn
                        }

                        // Handle function calls
                        if (message.toolCall && message.toolCall.functionCalls) {
                            await handleFunctionCall(message.toolCall.functionCalls);
                        }

                        // Handle audio output
                        const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
                        if (base64Audio && outputAudioContextRef.current) {
                            setStatus('speaking');
                            const audioBuffer = await decodeAudioData(decode(base64Audio), outputAudioContextRef.current, 24000, 1);
                            nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputAudioContextRef.current.currentTime);
                            
                            const source = outputAudioContextRef.current.createBufferSource();
                            source.buffer = audioBuffer;
                            source.connect(outputAudioContextRef.current.destination);
                            
                            source.onended = () => {
                                sourcesRef.current.delete(source);
                                // FIX: Only set status to listening if no other audio sources are still playing and assistant is active
                                if (sourcesRef.current.size === 0 && isActive) {
                                    setStatus('listening');
                                }
                            };
                            
                            source.start(nextStartTimeRef.current);
                            nextStartTimeRef.current += audioBuffer.duration;
                            sourcesRef.current.add(source);
                        }
                    },
                    onerror: (e) => {
                        console.error('Live API Error:', e);
                        setStatus('error');
                        stopConversation();
                    },
                    onclose: () => {
                        console.log('Live API connection closed.');
                        stopConversation();
                    }
                }
            });
        } catch (err) {
            console.error('Failed to start voice assistant', err);
            setStatus('error');
            stopConversation();
        }
    }, [isActive, stopConversation, currentTranscription, handleFunctionCall, context]);


    return (
      <>
        <button
            onClick={isActive ? stopConversation : startConversation}
            className={`fixed bottom-20 right-24 md:bottom-5 md:right-24 bg-dark-surface border-2 ${isActive ? 'border-red-500' : 'border-primary'} text-white rounded-full p-4 shadow-lg hover:scale-110 transition z-40`}
            aria-label={isActive ? 'Stop voice assistant' : 'Start voice assistant'}
        >
            <Icon name={isActive ? 'MicOff' : 'Mic'} className={`w-8 h-8 ${isActive ? 'text-red-500' : 'text-primary'}`} />
        </button>
        {isActive && (
            <div className="fixed bottom-20 right-5 w-80 h-auto max-h-96 bg-dark-surface rounded-lg shadow-2xl flex flex-col z-50 md:bottom-24 md:right-5 animate-fade-in-up">
                <header className="bg-dark-border p-3 flex justify-between items-center rounded-t-lg">
                    <h3 className="text-white font-bold">Voice Assistant</h3>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-dark-text-secondary capitalize">{status}</span>
                        <div className={`w-3 h-3 rounded-full ${status === 'listening' ? 'bg-green-500 animate-pulse' : status === 'speaking' ? 'bg-blue-500 animate-pulse' : 'bg-gray-500'}`}></div>
                    </div>
                </header>
                <div className="flex-1 p-3 overflow-y-auto text-white text-sm">
                   {transcriptions.map((t, i) => (
                       <div key={i}>
                           <p><strong className="text-primary">You:</strong> {t.user}</p>
                           <p className="mt-1 mb-3"><strong className="text-blue-400">AI:</strong> {t.model}</p>
                       </div>
                   ))}
                   { (currentTranscription.user || currentTranscription.model) && (
                       <div>
                           <p className="text-gray-400"><strong className="text-primary">You:</strong> {currentTranscription.user}</p>
                           <p className="text-gray-400 mt-1 mb-3"><strong className="text-blue-400">AI:</strong> {currentTranscription.model}</p>
                       </div>
                   )}
                </div>
            </div>
        )}
      </>
    );
};

export default VoiceAssistant;