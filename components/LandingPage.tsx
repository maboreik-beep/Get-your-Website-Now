
import React, { useState } from 'react';
import { Logo, INDUSTRY_TEMPLATES, useLanguage, LANGUAGES, resetImageIndexMap } from '../constants';
import { Website, Industry, Page } from '../types';
import { InitialSetupModal } from './InitialSetupModal';
import { generateWebsiteWithAI } from '../services/geminiService';
import { useAuth } from './auth/AuthProvider';


interface LandingPageProps {
  onStartBuilding: (website: Website) => void;
  onGoToMyWebsites: () => void; // New prop for navigation to auth/dashboard
}

const LandingPage: React.FC<LandingPageProps> = ({ onStartBuilding, onGoToMyWebsites }) => {
  const [showSetupModal, setShowSetupModal] = useState(false);
  const { t, currentUILanguage, setUILanguage } = useLanguage();
  const { user } = useAuth(); // Use auth context to check if user is logged in

  const handleStart = async (options: { companyName: string; industry: Industry; theme: 'light' | 'dark'; method: 'template' | 'ai', brochureImage?: string, textPromptInput?: string, defaultLanguage: string }) => {
      const { companyName, industry, theme, method, brochureImage, textPromptInput, defaultLanguage } = options;

      // Reset fixed image indices for a new website creation session
      resetImageIndexMap();

      const createWebsiteObject = (
        name: string,
        ind: Industry,
        thm: 'light' | 'dark',
        defLang: string, // New parameter for default content language
        generatedData?: { pages: Page[] },
        aiTextPrompt?: string,
        brochureImg?: string
      ): Website => {
        let template = INDUSTRY_TEMPLATES[ind];
        if (!template) template = INDUSTRY_TEMPLATES['Business Services'];

        // `name` is now expected to be an object `Record<string, string>`
        const multiLangName: Record<string, string> = { [defLang]: name };

        // Pass companyName as Record<string,string> and defaultLang to the template function
        // Pass the `t` function to the template for proper footer section generation
        const generatedPages = generatedData?.pages || template.template(thm, multiLangName, defLang, t);
        const pagesToUse = Array.isArray(generatedPages) ? generatedPages : [];

        return {
          id: `guest-${Date.now()}`,
          name: multiLangName, // Use the multilingual name object
          industry: ind,
          themeColor: template.defaultThemeColor,
          theme: thm,
          brochureImage: brochureImg,
          textPromptInput: aiTextPrompt,
          defaultLanguage: defLang, // Set default language
          supportedLanguages: [defLang], // Initially support only the default language
          pages: pagesToUse.map(page => ({
              ...page,
              sections: Array.isArray(page.sections) ? page.sections.map(section => {
                if (section.type === 'Footer') {
                  // Text fields are now Record<string, string>
                  return { ...section, text: { [defLang]: `© ${new Date().getFullYear()} ${name}. ${t('allRightsReserved')}.`}};
                }
                return section;
              }) : []
          }))
        };
      };

      let newWebsite;
      if (method === 'ai') {
        // Pass defaultLanguage to generateWebsiteWithAI
        const generatedData = await generateWebsiteWithAI(
          { [defaultLanguage]: companyName }, // Pass as Record<string, string>
          industry,
          theme,
          defaultLanguage, // Pass defaultLanguage
          textPromptInput,
          brochureImage
        );
        newWebsite = createWebsiteObject(companyName, industry, theme, defaultLanguage, generatedData, textPromptInput, brochureImage);
      } else {
        // Pass defaultLanguage to createWebsiteObject (template generation)
        newWebsite = createWebsiteObject(companyName, industry, theme, defaultLanguage, undefined, textPromptInput, brochureImage);
      }
      
      onStartBuilding(newWebsite);
  };

  return (
    <>
      <div className="min-h-screen bg-dark-bg text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-dark-bg via-dark-surface to-dark-bg z-0"></div>
        <header className="absolute top-0 left-0 p-6 md:p-8 z-10 flex justify-between w-full">
          <Logo className="h-20 w-auto" /> {/* Adjusted logo size for prominence */}
          <div className="flex items-center gap-4">
            <select
              value={currentUILanguage}
              onChange={(e) => setUILanguage(e.target.value)}
              className="bg-dark-surface text-white text-sm py-2 px-3 rounded-lg border border-dark-border focus:ring-primary focus:border-primary"
              aria-label={t('uiLanguage')}
            >
              {LANGUAGES.map(lang => (
                <option key={lang.code} value={lang.code}>{lang.name}</option>
              ))}
            </select>
            <button
                onClick={onGoToMyWebsites}
                className="bg-dark-surface text-white font-bold text-base py-2 px-6 rounded-lg shadow-md hover:bg-dark-border transition-all transform hover:scale-105"
            >
                {t('myWebsites')}
            </button>
          </div>
        </header>
        <main className="text-center z-10">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight">
            {t('buildStunningWebsite')} <br /> {t('inMinutes')}.
          </h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto mb-8"> {/* Changed text-dark-text-secondary to text-gray-200 */}
            {t('effortlesslyCreate')}
          </p>
          <button
            onClick={() => setShowSetupModal(true)}
            className="bg-primary text-black font-bold text-lg py-4 px-10 rounded-lg shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all transform hover:scale-105 hover:shadow-2xl hover:shadow-primary/30"
          >
            {t('getStartedForFree')}
          </button>
          <p className="text-sm text-gray-400 mt-4"> {/* Added 14 days free trial */}
            {t('fourteenDayFreeTrial')}
          </p>
        </main>
      </div>
      {showSetupModal && (
        <InitialSetupModal
          onClose={() => setShowSetupModal(false)}
          onStart={handleStart}
        />
      )}
    </>
  );
};

export default LandingPage;