import React from 'react';
import { WebsiteContext } from '../App';
import { useLanguage } from '../constants'; // Import useLanguage for translations
import { WebsiteComponent } from './WebsiteComponent'; // Assuming this is also a component
import SectionFormRenderer from './SectionFormRenderer'; // Assuming this is also a component
import { Website, HeroSection, AboutSection, StorySection, ServicesSection, ProductsSection, FeaturesSection, PricingSection, ClientsSection, TeamSection, GallerySection, TestimonialsSection, FAQSection, CTASection, BlogSection, ContactSection, FooterSection } from '../types'; // Import Website type, and all section types for full context

interface EditorViewProps {
  onExit: () => void;
  onSave: () => Promise<'success' | 'auth_required' | 'error'>;
}

const EditorView: React.FC<EditorViewProps> = ({ onExit, onSave }) => {
  const context = React.useContext(WebsiteContext);
  const { t } = useLanguage();
  const [isSaving, setIsSaving] = React.useState(false);
  const [saveStatus, setSaveStatus] = React.useState<'idle' | 'success' | 'auth_required' | 'error'>('idle');

  if (!context || !context.website) {
    return <div className="text-white">Loading editor...</div>;
  }

  const { website, setWebsite, activePageId, setActivePageId, currentContentLanguage, setCurrentContentLanguage } = context;

  const activePage = website.pages.find(p => p.id === activePageId);
  // For a minimal representation, let's assume we are editing the first section of the active page
  const activeSection = activePage?.sections[0]; 

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus('idle');
    try {
      const status = await onSave();
      setSaveStatus(status);
    } catch (error) {
      console.error("Error during save:", error);
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex h-screen bg-dark-bg text-white">
      {/* Sidebar (left) for Page/Section selection */}
      <div className="w-64 bg-dark-surface p-4 overflow-y-auto border-r border-dark-border">
        <h2 className="text-xl font-bold mb-4">{t('pages')}</h2>
        {website.pages.map(page => (
          <button
            key={page.id}
            onClick={() => setActivePageId(page.id)}
            className={`block w-full text-left py-2 px-3 rounded-md mb-2 transition-colors ${
              activePageId === page.id ? 'bg-primary text-black' : 'hover:bg-dark-border'
            }`}
          >
            {page.name[currentContentLanguage] || page.name[website.defaultLanguage]}
          </button>
        ))}
        {activePage && (
          <>
            <h2 className="text-xl font-bold mt-6 mb-4">{t('sections')}</h2>
            {activePage.sections.map(section => (
                <div key={section.id} className="py-2 px-3 rounded-md mb-2 hover:bg-dark-border">
                    {section.type}
                </div>
            ))}
          </>
        )}
      </div>

      {/* Main content area (center) for website preview */}
      <div className="flex-1 overflow-y-auto relative">
        <div className="absolute top-0 left-0 right-0 p-4 bg-dark-bg border-b border-dark-border flex items-center justify-between z-10">
            <button onClick={onExit} className="bg-dark-border text-white px-4 py-2 rounded-md hover:bg-gray-700">{t('exit')}</button>
            <h3 className="text-lg font-semibold">{website.name[currentContentLanguage] || website.name[website.defaultLanguage]}</h3>
            <div className="flex items-center gap-2">
                <select
                    value={currentContentLanguage}
                    onChange={(e) => setCurrentContentLanguage(e.target.value)}
                    className="bg-dark-border text-white text-sm py-2 px-3 rounded-md"
                >
                    {website.supportedLanguages.map(langCode => (
                        <option key={langCode} value={langCode}>
                            {langCode.toUpperCase()}
                        </option>
                    ))}
                </select>
                <button 
                  onClick={handleSave} 
                  disabled={isSaving}
                  className="bg-primary text-black px-4 py-2 rounded-md hover:bg-primary-dark disabled:opacity-50"
                >
                  {isSaving ? t('saving') : t('save')}
                </button>
                {saveStatus === 'success' && <span className="text-green-500">{t('saved')}</span>}
                {saveStatus === 'error' && <span className="text-red-500">{t('saveError')}</span>}
                {saveStatus === 'auth_required' && <span className="text-yellow-500">{t('loginToSave')}</span>}
            </div>
        </div>
        <div className="pt-20"> {/* Offset for fixed header */}
          <WebsiteComponent website={website} currentContentLanguage={currentContentLanguage} />
        </div>
      </div>

      {/* Right sidebar for Section editing */}
      <div className="w-96 bg-dark-surface p-4 overflow-y-auto border-l border-dark-border">
        <h2 className="text-xl font-bold mb-4">{t('editSection')}</h2>
        {activeSection ? (
          <SectionFormRenderer section={activeSection} />
        ) : (
          <p className="text-dark-text-secondary">{t('selectSectionToEdit')}</p>
        )}
      </div>
    </div>
  );
};

export default EditorView;