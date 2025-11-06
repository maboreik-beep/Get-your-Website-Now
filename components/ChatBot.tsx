import React, { useState, useRef, useEffect, useCallback, useContext } from 'react';
import { GoogleGenAI, Chat, FunctionDeclaration, Tool, Part, GenerateContentResponse, GenerateContentParameters } from '@google/genai';
import { Icon } from '../constants';
import { WebsiteContext } from '../App';
import { tools } from '../services/aiFunctions';
import { Page, Section } from '../types';

interface Message {
  sender: 'user' | 'bot';
  text: string;
}

const ChatBot: React.FC = () => {
  const context = useContext(WebsiteContext);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);
  
  const initializeChat = useCallback(() => {
    if (process.env.API_KEY) {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      chatRef.current = ai.chats.create({
        model: 'gemini-2.5-pro', // Using pro for better function calling
        config: {
          systemInstruction: 'You are a friendly and helpful AI assistant for a user building their website. Your primary goal is to help them modify their site content. When a user asks for a change, use the provided tools. When they ask for advice, provide concise tips on web design, content strategy, and marketing. Confirm when you have completed an,action.',
          tools: tools as Tool[],
        },
      });
      setMessages([{ sender: 'bot', text: "Hi! I'm your AI co-pilot. You can ask me to edit your site directly, like 'change the headline to...'." }]);
    }
  }, []);

  useEffect(() => {
    if (isOpen && !chatRef.current) {
      initializeChat();
    }
  }, [isOpen, initializeChat]);
  
  const handleFunctionCall = async (functionCalls: any[]) => {
      if (!context || !chatRef.current) return;
      const { setWebsite, activePageId } = context;

      let toolResponses: Part[] = [];

      for (const call of functionCalls) {
        const { name, args } = call;
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
                           if (item) item[itemField] = value;
                           result = { success: true, message: `Updated item ${itemField} in section ${section.type}.`};
                       } else if (itemId && (section as any).members?.length) { // For Team members
                           const member = (section as any).members.find((m: any) => m.id === itemId);
                           if(member) member[itemField] = value;
                           result = { success: true, message: `Updated member ${itemField} in section ${section.type}.`};
                       } else if (itemId && (section as any).timeline?.length) { // For Story timeline
                           const timelineItem = (section as any).timeline.find((t: any) => t.id === itemId); // Assuming timeline items have IDs
                           if(timelineItem) timelineItem[itemField] = value;
                           result = { success: true, message: `Updated timeline item ${itemField} in section ${section.type}.`};
                       } else {
                           (section as any)[field] = value;
                           result = { success: true, message: `Updated ${field} in section ${section.type}.`};
                       }
                    } else { result.message = "Section not found." }
                } else { result.message = "Page not found." }
                return draft;
            });
        }
        // TODO: Add handlers for other functions like addListItem, removeListItem etc.
        
        toolResponses.push({
            functionResponse: {
                name: call.name,
                response: result,
            }
        });
      }
      
      // Send tool responses back to the model
      // FIX: Pass toolResponses directly as the contents, as it's an array of Part objects.
      const response: GenerateContentResponse = await chatRef.current.sendMessage({ contents: toolResponses });

      // The model's response to the tool execution could be another function call or a text message.
      // FIX: Access functionCalls directly from the response object as per guidelines
      if (response.functionCalls && response.functionCalls.length > 0) {
          await handleFunctionCall(response.functionCalls);
      } else {
        // Access response.text directly
        const botMessageText = response.text;
        if (botMessageText) {
            const botMessage: Message = { sender: 'bot', text: botMessageText };
            setMessages(prev => [...prev, botMessage]);
        }
      }
  };


  const handleSend = async () => {
    if (!input.trim() || !chatRef.current || isLoading || !context) return;
    const { website } = context;
    const userMessage: Message = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Provide context of the current website structure
      const contextPrompt = `CONTEXT: The user is currently editing a website. Here is the JSON structure of the current site: ${JSON.stringify(website, null, 2)}. The user's current page is '${website.pages.find(p => p.id === context.activePageId)?.name}'.
      The user's request is: "${userMessage.text}"`;
      
      // FIX: Pass the contextPrompt directly as the message string in contents.
      const response: GenerateContentResponse = await chatRef.current.sendMessage({ contents: [{ text: contextPrompt }] });
      
      // FIX: Access functionCalls directly from the response object as per guidelines
      if (response.functionCalls && response.functionCalls.length > 0) {
          await handleFunctionCall(response.functionCalls);
      } else {
          // Access response.text directly
          const botMessageText = response.text;
          if (botMessageText) {
              const botMessage: Message = { sender: 'bot', text: botMessageText };
              setMessages(prev => [...prev, botMessage]);
          }
      }

    } catch (error) {
      console.error('Gemini chat error:', error);
      const errorMessage: Message = { sender: 'bot', text: "Sorry, I'm having trouble connecting. Please try again later." };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className="fixed bottom-20 right-5 md:bottom-5 md:right-5 bg-primary text-black rounded-full p-4 shadow-lg hover:bg-primary-dark transition transform hover:scale-110 z-40"
        aria-label="Open AI Co-pilot chat"
      >
        <Icon name="Message" className="w-8 h-8" />
      </button>

      {isOpen && (
        <div className="fixed bottom-20 right-5 w-80 h-96 bg-dark-surface rounded-lg shadow-2xl flex flex-col z-50 md:bottom-5 md:right-5 animate-fade-in-up">
          <header className="bg-dark-border p-3 flex justify-between items-center rounded-t-lg">
            <h3 className="text-white font-bold">AI Co-pilot</h3>
            <button onClick={() => setIsOpen(false)} className="text-dark-text-secondary hover:text-white" aria-label="Close chat">
              <Icon name="Close" />
            </button>
          </header>
          <div className="flex-1 p-3 overflow-y-auto">
            {messages.map((msg, index) => (
              <div key={index} className={`flex mb-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`rounded-lg px-3 py-2 max-w-[80%] ${msg.sender === 'user' ? 'bg-primary text-black' : 'bg-dark-border text-white'}`}>
                  <p className="text-sm">{msg.text}</p>
                </div>
              </div>
            ))}
             {isLoading && (
                <div className="flex justify-start mb-2">
                     <div className="rounded-lg px-3 py-2 bg-dark-border text-white">
                        <div className="flex items-center space-x-1">
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-75"></span>
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-150"></span>
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-300"></span>
                        </div>
                    </div>
                </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="p-3 border-t border-dark-border">
            <div className="flex items-center bg-dark-bg rounded-lg">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && handleSend()}
                placeholder="e.g., Change my headline..."
                className="flex-1 bg-transparent text-white px-3 py-2 focus:outline-none text-sm"
                aria-label="Chat input"
              />
              <button onClick={handleSend} className="p-2 text-primary disabled:text-gray-500" disabled={isLoading || !input.trim()} aria-label="Send message">
                <Icon name="Send" className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;