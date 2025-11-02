import React, { useState } from 'react';
import { Industry } from '../types';
import { Icon, INDUSTRIES, useLanguage, LANGUAGES } from '../constants'; // Import useLanguage and LANGUAGES

interface InitialSetupModalProps {
  onStart: (options: {
    companyName: string;
    industry: Industry;
    theme: 'light' | 'dark';
    method: 'template' | 'ai';
    brochureImage?: string;
    textPromptInput?: string; // Added text prompt input
    defaultLanguage: string; // NEW: Added defaultLanguage
  }) => Promise<void>;
  onClose: () => void;
}

// FIX: Export the InitialSetupModal component
export const InitialSetupModal: React.FC<InitialSetupModalProps> = ({ onStart, onClose }) => {
  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState<Industry | ''>('');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [brochureImage, setBrochureImage] = useState<string | undefined>();
  const [textPromptInput, setTextPromptInput] = useState<string>(''); // New state for AI text prompt
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('AI is building your site...');
  const [error, setError] = useState<string | null>(null);
  const { t, currentUILanguage } = useLanguage(); // Use useLanguage hook for translations
  const [defaultLanguage, setDefaultLanguage] = useState<string>(currentUILanguage); // Default content language to current UI language


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setBrochureImage(reader.result as string);
        };
        reader.readAsDataURL(file);
    }
  };

  const handleStartBuilding = async (method: 'template' | 'ai') => {
    if (!companyName || !industry) {
      setError(t('errorCompanyNameIndustryRequired'));
      return;
    }
    
    setLoadingText(
      method === 'ai' 
        ? (brochureImage ? t('generatingFromBrochure') : (textPromptInput ? t('generatingFromDescription') : t('generatingWithAI')))
        : t('craftingFromTemplate'));
    setIsLoading(true);
    setError(null); // Clear previous errors

    try {
      await onStart({ companyName, industry, theme, method, brochureImage, textPromptInput, defaultLanguage });
      // If onStart succeeds, explicitly close the modal.
      onClose();
    } catch (e: any) {
      console.error("Website generation failed:", e);
      let errorMessage = t('errorWebsiteGenerationFailed');
      
      // Try to extract more specific error from Gemini service if available
      if (e.message && e.message.includes("Gemini API error details:")) {
        errorMessage = e.message; // Use the more detailed message from geminiService
      } else if (e.message) {
        errorMessage = `${t('errorWebsiteGenerationFailed')}: ${e.message}`;
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false); // Ensure loading state is always reset
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-dark-surface rounded-lg p-6 md:p-8 w-full max-w-2xl text-white relative shadow-2xl max-h-[90vh] flex flex-col">
        <button onClick={onClose} className="absolute top-4 right-4 text-dark-text-secondary hover:text-white transition-colors z-20" aria-label={t('closeModal')}>
          <Icon name="Close" />
        </button>
        <div className="text-center mb-6 flex-shrink-0">
          <h2 className="text-2xl md:text-3xl font-bold">{t('createWebsite')}</h2>
          <p className="text-dark-text-secondary mt-2 text-sm md:text-base">{t('provideDetails')}</p>
        </div>
        
        {isLoading && (
            <div className="absolute inset-0 bg-dark-surface bg-opacity-90 flex flex-col items-center justify-center z-10 rounded-lg">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-lg">{loadingText}</p>
            </div>
        )}

        <div className="flex-grow overflow-y-auto -mr-4 pr-4">
            {error && <p className="text-red-400 bg-red-900/50 p-3 rounded-md text-center mb-4">{error}</p>}
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder={t('companyName')}
                  className="w-full bg-dark-bg border border-dark-border rounded-md px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary transition"
                  aria-label={t('companyName')}
                />
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value as Industry)}
                  className="w-full bg-dark-bg border border-dark-border rounded-md px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary transition"
                  aria-label={t('selectIndustry')}
                >
                  <option value="" disabled>{t('selectIndustry')}</option>
                  {INDUSTRIES.map(ind => <option key={ind} value={ind}>{ind}</option>)}
                </select>
              </div>
               <div>
                <label htmlFor="text-prompt" className="block text-sm font-medium text-dark-text-secondary mb-2 text-center">{t('describeWebsiteAI')}</label>
                <textarea
                    id="text-prompt"
                    value={textPromptInput}
                    onChange={(e) => setTextPromptInput(e.target.value)}
                    placeholder={t('aiPromptPlaceholder')}
                    rows={3}
                    className="w-full bg-dark-bg border border-dark-border rounded-md px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary transition"
                    aria-label={t('describeWebsiteAI')}
                />
              </div>
               <div>
                <label className="block text-sm font-medium text-dark-text-secondary mb-2 text-center">{t('uploadBrochureOptional')}</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dark-border border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                        <Icon name="DocumentText" className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                            <label htmlFor="file-upload" className="relative cursor-pointer bg-dark-bg rounded-md font-medium text-primary hover:text-primary-dark focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary">
                                <span>{t('uploadFile')}</span>
                                <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*"/>
                            </label>
                            <p className="pl-1">{t('dragAndDrop')}</p>
                        </div>
                        <p className="text-xs text-gray-500">{ brochureImage ? t('imageSelected') : t('imageFormats')}</p>
                    </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-text-secondary mb-2 text-center">{t('chooseTheme')}</label>
                <div className="flex justify-center gap-4">
                    <button onClick={() => setTheme('light')} className={`px-6 py-2 rounded-md font-semibold transition ${theme === 'light' ? 'bg-primary text-black' : 'bg-dark-bg hover:bg-dark-border'}`}>{t('light')}</button>
                    <button onClick={() => setTheme('dark')} className={`px-6 py-2 rounded-md font-semibold transition ${theme === 'dark' ? 'bg-primary text-black' : 'bg-dark-bg hover:bg-dark-border'}`}>{t('dark')}</button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-text-secondary mb-2 text-center">{t('defaultContentLanguage')}</label>
                <select
                    value={defaultLanguage}
                    onChange={(e) => setDefaultLanguage(e.target.value)}
                    className="w-full bg-dark-bg border border-dark-border rounded-md px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary transition"
                    aria-label={t('defaultContentLanguage')}
                >
                    {LANGUAGES.map(lang => (
                        <option key={lang.code} value={lang.code}>{lang.name}</option>
                    ))}
                </select>
              </div>
            </div>
        </div>

        <div className="mt-8 flex flex-col md:flex-row gap-4 flex-shrink-0 justify-center">
          <button 
              onClick={() => handleStartBuilding('ai')}
              disabled={isLoading}
              className="w-full flex-1 bg-primary text-black font-bold py-3 px-4 rounded-md hover:bg-primary-dark disabled:bg-gray-600 transition-all flex items-center justify-center"
          >
              <Icon name="Wand" className="w-5 h-5 mr-2"/> {t('generateWithAI')}
          </button>
          <button 
              onClick={() => handleStartBuilding('template')}
              disabled={isLoading}
              className="w-full flex-1 bg-dark-bg border border-dark-border text-white font-bold py-3 px-4 rounded-md hover:bg-dark-border disabled:bg-gray-600 transition-all flex items-center justify-center"
          >
              <Icon name="DocumentText" className="w-5 h-5 mr-2"/> {t('startWithTemplate')}
          </button>
        </div>
      </div>
    </div>
  );
};