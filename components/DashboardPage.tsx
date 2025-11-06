import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../services/firebase';
import { useAuth } from './auth/AuthProvider';
import { Website, Page, Industry, HeroSection } from '../types'; // FIX: Import HeroSection
import { Logo, Icon, INDUSTRY_TEMPLATES, useLanguage, LANGUAGES, resetImageIndexMap } from '../constants'; // Import useLanguage and resetImageIndexMap
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

    // Reset fixed image indices for a new website creation session
    resetImageIndexMap();

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
              className="bg-primary text-black font-bold py-2 px-6 rounded-lg shadow-md hover:bg-primary-dark transition-all transform hover:scale-105 flex items-center gap-2"
            >
              <Icon name="Plus" className="w-5 h-5" /> {t('createNewWebsite')}
            </button>
          </div>

          {websites.length === 0 && !isLoading && (
            <div className="text-center p-12 bg-dark-surface rounded-lg">
              <h2 className="text-xl font-semibold mb-4">{t('noWebsitesYet')}</h2>
              <p className="text-dark-text-secondary">{t('clickButtonCreateFirst')}</p>
            </div>
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {websites.map(website => (
              <div key={website.id} className="bg-dark-surface rounded-lg shadow-xl overflow-hidden group">
                <div className="relative h-48 bg-gray-700 flex items-center justify-center text-gray-400 overflow-hidden">
                  {/* Display a placeholder or a preview of the website (e.g., first section image) */}
                  {website.pages[0]?.sections[0]?.type === 'Hero' && (
                    <img
                      src={(website.pages[0].sections[0] as HeroSection).backgroundImage || 'https://via.placeholder.com/600x400?text=Website+Preview'}
                      alt={`${website.name[currentUILanguage] || website.name[website.defaultLanguage]} preview`}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onEditWebsite(website)}
                      className="bg-primary text-black font-bold py-2 px-6 rounded-lg hover:bg-primary-dark transition-all transform hover:scale-110"
                    >
                      {t('editSite')}
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-bold mb-1">{website.name[currentUILanguage] || website.name[website.defaultLanguage]}</h3>
                  <p className="text-sm text-dark-text-secondary">{website.industry}</p>
                </div>
              </div>
            ))}
          </div>
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