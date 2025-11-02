import React, { useState, useRef, useCallback } from 'react';
import { Icon } from '../constants';
import { generateImage } from '../services/geminiService';

interface ImageGeneratorProps {
    value: string;
    onChange: (value: string) => void;
    promptContext: string;
}

const ImageGenerator: React.FC<ImageGeneratorProps> = ({ value, onChange, promptContext }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [showGenerator, setShowGenerator] = useState(false);
    const [prompt, setPrompt] = useState('');
    const [aspectRatio, setAspectRatio] = useState('16:9');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                onChange(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleGenerate = useCallback(async () => {
        if (!prompt) return;
        setIsLoading(true);
        try {
            const fullPrompt = `${prompt}, ${promptContext}. cinematic, professional photography, high detail.`;
            const imageUrl = await generateImage(fullPrompt, aspectRatio);
            onChange(imageUrl);
            // Optionally close generator after successful generation
            // setShowGenerator(false); 
        } catch (error) {
            console.error("Image generation failed", error);
        } finally {
            setIsLoading(false);
        }
    }, [prompt, aspectRatio, onChange, promptContext]);


    return (
        <div>
            <div className="w-full aspect-video bg-dark-bg rounded-md flex items-center justify-center overflow-hidden border border-dark-border">
                {value ? <img src={value} alt="Current selection" className="w-full h-full object-cover" /> : <span className="text-dark-text-secondary text-sm">No Image</span>}
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2">
                <button onClick={() => fileInputRef.current?.click()} className="text-sm w-full px-3 py-1.5 border border-dark-border rounded-md hover:bg-dark-border">Change Image</button>
                <button onClick={() => setShowGenerator(s => !s)} className="text-sm w-full flex items-center justify-center gap-2 px-3 py-1.5 border border-dark-border rounded-md hover:bg-dark-border">
                    <Icon name="Wand" className="w-4 h-4 text-primary" /> Suggest with AI
                </button>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
            </div>
            {showGenerator && (
                <div className="mt-2 p-3 bg-dark-bg rounded-md border border-dark-border space-y-2">
                    <textarea 
                        value={prompt}
                        onChange={e => setPrompt(e.target.value)}
                        placeholder="Describe the image you want..." 
                        className="w-full bg-gray-900 border border-dark-border rounded-md px-3 py-1.5 text-sm" rows={2}/>
                    <select value={aspectRatio} onChange={e => setAspectRatio(e.target.value)} className="w-full bg-gray-900 border border-dark-border rounded-md px-3 py-1.5 text-sm">
                        <option value="16:9">16:9 (Landscape)</option>
                        <option value="9:16">9:16 (Portrait)</option>
                        <option value="1:1">1:1 (Square)</option>
                        <option value="4:3">4:3</option>
                        <option value="3:4">3:4</option>
                    </select>
                    <button onClick={handleGenerate} disabled={isLoading || !prompt} className="w-full bg-primary text-black font-bold py-1.5 rounded-md hover:bg-primary-dark disabled:bg-gray-500 text-sm">
                        {isLoading ? 'Generating...' : 'Generate'}
                    </button>
                </div>
            )}
            <p className="text-xs text-dark-text-secondary mt-1 text-center">PNG, JPG, GIF up to 5MB</p>
        </div>
    );
}

export default ImageGenerator;