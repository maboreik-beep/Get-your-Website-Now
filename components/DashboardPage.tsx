
import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../services/firebase';
import { useAuth } from './auth/AuthProvider';
import { Website, Page, Industry } from '../types';
import { Logo, Icon, INDUSTRY_TEMPLATES, useLanguage, LANGUAGES } from '../constants'; // Import useLanguage
import { InitialSetupModal } from './InitialSetupModal';
import { generateWebsiteWithAI } from '../services/geminiService';

interface DashboardPageProps {
  onEditWebsite: (website: Website) => void;
  onGoToMyWebsites: () => void; // Added for consistent navigation prop if needed (though not directly used here)
}

const DashboardPage: React.FC<DashboardPageProps> = ({ onEditWebsite }) => {
  const { user } = useAuth();
  const [websites, setWebsites] = useState<Website[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { t, currentUILanguage, setUILanguage } = useLanguage(); // Use useLanguage hook

  useEffect(() => {
    const fetchWebsites = async () => {
      if (!user) return;
      setIsLoading(true);
      try {
        const q = query(collection(db, "websites"), where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);
        const userWebsites: Website[] = [];
        querySnapshot.forEach((doc) => {
          userWebsites.push({ id: doc.id, ...doc.data() } as Website);
        });
        setWebsites(userWebsites);
      } catch (error) {
        console.error("Error fetching websites:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWebsites();
  }, [user]);

  const handleStart = async (options: { companyName: string; industry: Industry; theme: 'light' | 'dark'; method: 'template' | 'ai', brochureImage?: string, textPromptInput?: string, defaultLanguage: string }) => {
    const { companyName, industry, theme, method, brochureImage, textPromptInput, defaultLanguage } = options;

    const createWebsiteObject = (
      name: string,
      ind: Industry,
      thm: 'light' | 'dark',
      defLang: string,
      generatedData?: { pages: Page[] },
      aiTextPrompt?: string,
      brochureImg?: string
    ): Website => {
      let template = INDUSTRY_TEMPLATES[ind];
      if (!template) template = INDUSTRY_TEMPLATES['Business Services'];

      const multiLangName: Record<string, string> = { [defLang]: name };
      // Pass the `t` function to the template for proper footer section generation
      const generatedPages = generatedData?.pages || template.template(thm, multiLangName, defLang, t);
      const pagesToUse = Array.isArray(generatedPages) ? generatedPages : [];

      return {
        userId: user?.uid, // Add userId for logged-in user
        name: multiLangName,
        industry: ind,
        themeColor: template.defaultThemeColor,
        theme: thm,
        brochureImage: brochureImg,
        textPromptInput: aiTextPrompt,
        defaultLanguage: defLang,
        supportedLanguages: [defLang],
        pages: pagesToUse.map(page => ({
            ...page,
            sections: Array.isArray(page.sections) ? page.sections.map(section => {
              if (section.type === 'Footer') {
                return { ...section, text: { [defLang]: `© ${new Date().getFullYear()} ${name}. ${t('allRightsReserved')}.`}};
              }
              return section;
            }) : []
        }))
      };
    };

    let newWebsiteData;
    if (method === 'ai') {
      const generatedData = await generateWebsiteWithAI(
        { [defaultLanguage]: companyName },
        industry,
        theme,
        defaultLanguage,
        textPromptInput,
        brochureImage
      );
      newWebsiteData = createWebsiteObject(companyName, industry, theme, defaultLanguage, generatedData, textPromptInput, brochureImage);
    } else {
      newWebsiteData = createWebsiteObject(companyName, industry, theme, defaultLanguage, undefined, textPromptInput, brochureImage);
    }
    
    // Save to Firestore
    try {
      const docRef = await addDoc(collection(db, "websites"), { ...newWebsiteData, createdAt: serverTimestamp() });
      const savedWebsite: Website = { ...newWebsiteData, id: docRef.id };
      setWebsites(prev => [...prev, savedWebsite]); // Update local state
      onEditWebsite(savedWebsite); // Go to editor
    } catch (error) {
      console.error("Error saving new website:", error);
      // Handle error for UI, e.g., show a toast
    }
  };

  const handleLogout = async () => {
    await auth.signOut();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-dark-bg text-white flex flex-col items-center p-4 relative">
        <header className="fixed top-0 left-0 p-6 md:p-8 z-10 flex justify-between w-full bg-dark-bg border-b border-dark-border">
          <Logo className="h-12 md:h-16 w-auto" />
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
              onClick={handleLogout}
              className="bg-dark-surface text-white font-bold text-base py-2 px-6 rounded-lg shadow-md hover:bg-dark-border transition-all transform hover:scale-105"
            >
              {t('logout')}
            </button>
          </div>
        </header>

        <main className="flex-1 w-full max-w-7xl pt-32 pb-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl md:text-4xl font-extrabold">{t('yourWebsites')}</h1>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-primary text-black font-bold py-2 px-5 rounded-lg shadow-md hover:bg-primary-dark transition-all transform hover:scale-105 flex items-center gap-2"
            >
              <Icon name="Plus" className="w-5 h-5" /> {t('createNewWebsite')}
            </button>
          </div>

          {websites.length === 0 ? (
            <div className="text-center p-10 bg-dark-surface rounded-lg shadow-xl">
              <p className="text-lg text-dark-text-secondary mb-4">{t('noWebsitesYet')}</p>
              <p className="text-dark-text-secondary">{t('clickButtonCreateFirst')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {websites.map((website) => (
                <div key={website.id} className="bg-dark-surface rounded-lg shadow-xl overflow-hidden group hover:shadow-primary/30 transition-shadow duration-300">
                  <div className="p-6">
                    <h2 className="text-xl font-bold text-white">
                      {website.name[website.defaultLanguage]}
                    </h2>
                    <p className="text-dark-text-secondary text-sm">
                      {website.industry} &bull; {website.theme} theme
                    </p>
                    {/* Placeholder for a website thumbnail or preview */}
                    <div className="w-full h-32 bg-dark-bg rounded-md mt-4 flex items-center justify-center text-dark-text-secondary text-sm">
                        Website Preview Here
                    </div>
                    <button
                      onClick={() => onEditWebsite(website)}
                      className="mt-6 w-full bg-primary text-black font-bold py-2 px-4 rounded-md hover:bg-primary-dark transition-all transform hover:scale-105"
                    >
                      {t('editSite')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {showCreateModal && (
        <InitialSetupModal
          onClose={() => setShowCreateModal(false)}
          onStart={handleStart}
        />
      )}
    </>
  );
};

export default DashboardPage;