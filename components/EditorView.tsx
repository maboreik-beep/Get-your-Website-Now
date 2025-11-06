import React, { useContext, useState, useMemo, useEffect } from 'react';
import { WebsiteContext } from '../App';
import { Page, Section, Industry, Website } from '../types';
import { THEME_COLORS, Icon, ICONS, PAGE_TEMPLATES, Logo, generateId, useLanguage, LANGUAGES } from '../constants';
import WebsiteComponent from './WebsiteComponent';
import { useAuth } from './auth/AuthProvider';
import SectionFormRenderer from './SectionFormRenderer';
import ChatBot from './ChatBot';
import VoiceAssistant from './VoiceAssistant'; // FIX: Changed to default import
import { extractTranslatableContent, translateContentWithAI, applyTranslatedContent } from '../services/geminiService';
import { createDefaultSection } from '../constants'; // Import the updated helper

const ColorPicker: React.FC<{ value: string; onChange: (color: string) => void }> = ({ value, onChange }) => (
    <div className="flex flex-wrap gap-2">
        {THEME_COLORS.map(color => (
            <button
                key={color.name}
                title={color.name}
                onClick={() => onChange(color.value)}
                className={`w-8 h-8 rounded-full border-2 transition-transform transform hover:scale-110 ${value === color.value ? 'border-white ring-2 ring-offset-2 ring-offset-dark-surface ring-white' : 'border-transparent'}`}
                style={{ backgroundColor: color.value }}
                aria-label={`Select ${color.name} theme color`}
            />
        ))}
    </div>
);

interface AccordionProps {
    title: string;
    iconName: keyof typeof ICONS;
    children: React.ReactNode;
    isOpen: boolean;
    onToggle: () => void;
    isSectionEnabled?: boolean;
    onToggleSectionEnabled?: () => void;
    onDeleteSection?: () => void; // Added for section deletion
    onMoveSectionUp?: () => void;   // Added for moving section up
    onMoveSectionDown?: () => void; // Added for moving section down
    canMoveUp?: boolean;            // Added for disabling move up button
    canMoveDown?: boolean;          // Added for disabling move down button
}

const Accordion: React.FC<AccordionProps> = ({ title, iconName, children, isOpen, onToggle, isSectionEnabled, onToggleSectionEnabled, onDeleteSection, onMoveSectionUp, onMoveSectionDown, canMoveUp, canMoveDown }) => {
    const { t } = useLanguage();
    return (
        <div className="border-b border-dark-border">
            <div className="flex justify-between items-center p-4 hover:bg-gray-800 transition-colors">
                <button onClick={onToggle} className="flex-1 flex items-center gap-3 text-left" aria-expanded={isOpen} aria-controls={`accordion-content-${title.replace(/\s/g, '-')}`}>
                    <Icon name={iconName} className="w-5 h-5 text-dark-text-secondary"/>
                    <span className="font-semibold">{title}</span>
                </button>
                <div className="flex items-center gap-2"> {/* Wrapper for delete, toggle and move buttons */}
                    {onMoveSectionUp && (
                        <button onClick={(e) => { e.stopPropagation(); onMoveSectionUp(); }} disabled={!canMoveUp} className="p-1 text-dark-text-secondary hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed hover:bg-dark-border rounded-md transition-colors" aria-label={t('moveUp')}>
                            <Icon name="ArrowUp" className="w-4 h-4" />
                        </button>
                    )}
                     {onMoveSectionDown && (
                        <button onClick={(e) => { e.stopPropagation(); onMoveSectionDown(); }} disabled={!canMoveDown} className="p-1 text-dark-text-secondary hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed hover:bg-dark-border rounded-md transition-colors" aria-label={t('moveDown')}>
                            <Icon name="ArrowDown" className="w-4 h-4" />
                        </button>
                    )}
                    {onDeleteSection && (
                        <button onClick={(e) => { e.stopPropagation(); onDeleteSection(); }} className="p-1 text-red-400 hover:text-red-500 hover:bg-red-500/20 rounded-md transition-colors" aria-label={t('deleteSectionConfirm')}>
                            <Icon name="Trash" className="w-4 h-4" />
                        </button>
                    )}
                    {onToggleSectionEnabled && isSectionEnabled !== undefined && (
                        <label htmlFor={`toggle-${title.replace(/\s/g, '-')}`} className="flex items-center cursor-pointer">
                            <div className="relative">
                                <input type="checkbox" id={`toggle-${title.replace(/\s/g, '-')}`} className="sr-only" checked={isSectionEnabled} onChange={onToggleSectionEnabled} />
                                <div className={`block w-10 h-6 rounded-full transition-colors ${isSectionEnabled ? 'bg-primary' : 'bg-gray-600'}`}></div>
                                <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${isSectionEnabled ? 'transform translate-x-4' : ''}`}></div>
                            </div>
                        </label>
                    )}
                </div>
                <button onClick={onToggle} className="ml-2 p-1">
                    <Icon name={isOpen ? 'ChevronUp' : 'ChevronDown'} className="w-5 h-5"/>
                </button>
            </div>
            {isOpen && <div id={`accordion-content-${title.replace(/\s/g, '-')}`} role="region" className="p-4 bg-dark-bg animate-fade-in-down">{children}</div>}
        </div>
    );
};

interface AddPageModalProps {
  onAdd: (page: Page) => void;
  onClose: () => void;
  companyName: Record<string, string>; // Changed to Record<string, string>
  industry: Industry;
  theme: 'light' | 'dark';
  defaultLang: string; // New: pass default content language
}

const AddPageModal: React.FC<AddPageModalProps> = ({ onAdd, onClose, companyName, industry, theme, defaultLang }) => {
    const [pageName, setPageName] = useState('');
    const [selectedTemplate, setSelectedTemplate] = useState<keyof typeof PAGE_TEMPLATES | ''>('');
    const { t } = useLanguage();

    const handleCreatePage = () => {
        if (!pageName && !selectedTemplate) return;
        let newPage: Page;
        if (selectedTemplate) {
            // Pass the `t` function to the template for proper footer section generation
            newPage = PAGE_TEMPLATES[selectedTemplate](companyName, industry, theme, defaultLang, t); 
            // Override ID and name if custom name provided
            // newPage.name = { [defaultLang]: pageName || newPage.name[defaultLang] }; // Ensure name is multilingual object
            newPage = {
              ...newPage,
              name: { [defaultLang]: pageName || newPage.name[defaultLang] },
              id: (pageName || newPage.name[defaultLang]).toLowerCase().replace(/\s+/g, '-'),
            };

        } else {
            // Default empty page
            newPage = {
                id: (pageName || generateId('page')).toLowerCase().replace(/\s/g, '-'),
                name: { [defaultLang]: pageName || t('newPage') }, // Ensure name is multilingual object
                sections: [
                    // A minimal default section for a blank page
                    // Use the new createDefaultSection helper
                    createDefaultSection(companyName, theme, defaultLang, t, 'Hero')
                ],
            };
        }
        onAdd(newPage);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true" aria-labelledby="add-page-modal-title">
            <div className="bg-dark-surface rounded-lg p-6 w-full max-w-lg text-white">
                <h3 id="add-page-modal-title" className="text-xl font-bold mb-4">{t('addANewPage')}</h3>
                <input
                    type="text"
                    value={pageName}
                    onChange={(e) => setPageName(e.target.value)}
                    placeholder={t('enterCustomPageNameOptional')}
                    className="w-full bg-dark-bg border border-dark-border rounded-md px-4 py-2 mb-4 focus:ring-primary focus:border-primary"
                    aria-label={t('newPageName')}
                />
                <select
                    value={selectedTemplate}
                    onChange={(e) => setSelectedTemplate(e.target.value as keyof typeof PAGE_TEMPLATES)}
                    className="w-full bg-dark-bg border border-dark-border rounded-md px-4 py-2 mb-4 focus:ring-primary focus:border-primary"
                    aria-label={t('orSelectAPageTemplate')}
                >
                    <option value="" disabled>{t('orSelectAPageTemplate')}</option>
                    {Object.keys(PAGE_TEMPLATES).map(templateName => (
                        // Pass the `t` function to the template for proper display of template names
                        <option key={templateName} value={templateName}>{PAGE_TEMPLATES[templateName](companyName, industry, theme, defaultLang, t).name[defaultLang]}</option>
                    ))}
                </select>
                <div className="flex justify-end space-x-2">
                    <button onClick={onClose} className="px-4 py-2 rounded-md bg-dark-border hover:bg-gray-600">{t('cancel')}</button>
                    <button onClick={handleCreatePage} disabled={!pageName && !selectedTemplate} className="px-4 py-2 rounded-md bg-primary text-black font-bold hover:bg-primary-dark disabled:bg-gray-500">{t('createPage')}</button>
                </div>
            </div>
        </div>
    );
};


interface AddSectionModalProps {
  onAdd: (section: Section) => void;
  onClose: () => void;
  companyName: Record<string, string>; // Changed to Record<string, string>
  theme: 'light' | 'dark';
  defaultLang: string; // New: pass default content language
}

const AddSectionModal: React.FC<AddSectionModalProps> = ({ onAdd, onClose, companyName, theme, defaultLang }) => {
    const { t } = useLanguage();
    // Dynamically get all possible section types from the union type
    const sectionTypes: Section['type'][] = [
        'Hero', 'About', 'Story', 'Services', 'Products', 'Features', 'Pricing', 'Clients',
        'Team', 'Gallery', 'Testimonials', 'FAQ', 'CTA', 'Blog', 'Contact', 'Footer'
    ];

    const handleSelectSection = (type: Section['type']) => {
        // Use the createDefaultSection helper here
        onAdd(createDefaultSection(companyName, theme, defaultLang, t, type));
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true" aria-labelledby="add-section-modal-title">
            <div className="bg-dark-surface rounded-lg p-6 w-full max-w-lg text-white max-h-[80vh] overflow-y-auto">
                <h3 id="add-section-modal-title" className="text-xl font-bold mb-4">{t('addANewSection')}</h3>
                <div className="grid grid-cols-2 gap-4">
                    {sectionTypes.map(type => (
                        <button
                            key={type}
                            onClick={() => handleSelectSection(type)}
                            className="bg-dark-bg border border-dark-border rounded-md px-4 py-3 text-sm hover:bg-dark-border-hover transition-colors text-left"
                        >
                            {type}
                        </button>
                    ))}
                </div>
                <div className="flex justify-end space-x-2 mt-6">
                    <button onClick={onClose} className="px-4 py-2 rounded-md bg-dark-border hover:bg-gray-600">{t('cancel')}</button>
                </div>
            </div>
        </div>
    );
};

interface ApplyPageTemplateModalProps {
  onApply: (template: Page) => void;
  onClose: () => void;
  companyName: Record<string, string>; // Changed to Record<string, string>
  industry: Industry;
  theme: 'light' | 'dark';
  defaultLang: string; // New: pass default content language
}

const ApplyPageTemplateModal: React.FC<ApplyPageTemplateModalProps> = ({ onApply, onClose, companyName, industry, theme, defaultLang }) => {
    const { t } = useLanguage();
    const handleSelectTemplate = (templateName: keyof typeof PAGE_TEMPLATES) => {
        // Pass the `t` function to the template for proper footer section generation
        const newPageContent = PAGE_TEMPLATES[templateName](companyName, industry, theme, defaultLang, t);
        onApply(newPageContent);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true" aria-labelledby="apply-template-modal-title">
            <div className="bg-dark-surface rounded-lg p-6 w-full max-w-lg text-white max-h-[80vh] overflow-y-auto">
                <h3 id="apply-template-modal-title" className="text-xl font-bold mb-4">{t('applyPageTemplateModal')}</h3>
                <p className="text-dark-text-secondary mb-4">{t('applyTemplateWarning')}</p>
                <div className="grid grid-cols-1 gap-4">
                    {Object.keys(PAGE_TEMPLATES).map(templateName => (
                        <button
                            key={templateName}
                            onClick={() => handleSelectTemplate(templateName as keyof typeof PAGE_TEMPLATES)}
                            className="bg-dark-bg border border-dark-border rounded-md px-4 py-3 text-sm hover:bg-dark-border-hover transition-colors text-left"
                        >
                            {/* Pass the `t` function to the template for proper display of template names */}
                            {PAGE_TEMPLATES[templateName](companyName, industry, theme, defaultLang, t).name[defaultLang]}
                        </button>
                    ))}
                </div>
                <div className="flex justify-end space-x-2 mt-6">
                    <button onClick={onClose} className="px-4 py-2 rounded-md bg-dark-border hover:bg-gray-600">{t('cancel')}</button>
                </div>
            </div>
        </div>
    );
};


interface EditorPanelProps {
    activePage: Page;
    isMobile: boolean;
    onSave: () => Promise<string>; // Changed from Promise<void> to Promise<string>
    isSaving: boolean;
}

const EditorPanel: React.FC<EditorPanelProps> = ({ activePage, isMobile, onSave, isSaving }) => {
    const context = useContext(WebsiteContext);
    const { user } = useAuth();
    const { t, currentUILanguage, setUILanguage } = useLanguage();

    if (!context) return null;
    const { website, setWebsite, activePageId, setActivePageId, currentContentLanguage, setCurrentContentLanguage } = context;

    const [openAccordion, setOpenAccordion] = useState<string>('project-settings');
    const [showAddPageModal, setShowAddPageModal] = useState(false);
    const [showAddSectionModal, setShowAddSectionModal] = useState(false);
    const [showApplyPageTemplateModal, setShowApplyPageTemplateModal] = useState(false);
    const [isTranslating, setIsTranslating] = useState(false);
    const [translationStatus, setTranslationStatus] = useState<'idle' | 'success' | 'error'>('idle');


    const updateWebsite = (updater: (draft: Website) => void) => {
        setWebsite(prev => {
            if (!prev) return prev;
            const draft = JSON.parse(JSON.stringify(prev));
            updater(draft);
            return draft;
        });
    };

    const handleAddPage = (newPage: Page) => {
        updateWebsite(draft => {
            draft.pages.push(newPage);
            setActivePageId(newPage.id);
        });
    };

    const handleAddSection = (newSection: Section) => {
        updateWebsite(draft => {
            const page = draft.pages.find((p: Page) => p.id === activePageId);
            if (page) {
                page.sections.push(newSection);
            }
        });
    };

    const handleDeleteSection = (sectionId: string) => {
        if (!window.confirm(t('deleteSectionConfirm'))) {
            return;
        }
        updateWebsite(draft => {
            const page = draft.pages.find((p: Page) => p.id === activePageId);
            if (page) {
                page.sections = page.sections.filter(s => s.id !== sectionId);
            }
        });
    };

    const handleMoveSection = (sectionId: string, direction: 'up' | 'down') => {
        updateWebsite(draft => {
            const page = draft.pages.find((p: Page) => p.id === activePageId);
            if (page) {
                const index = page.sections.findIndex(s => s.id === sectionId);
                if (index === -1) return;

                const newSections = [...page.sections];
                if (direction === 'up' && index > 0) {
                    [newSections[index - 1], newSections[index]] = [newSections[index], newSections[index - 1]];
                } else if (direction === 'down' && index < newSections.length - 1) {
                    [newSections[index + 1], newSections[index]] = [newSections[index], newSections[index + 1]];
                }
                page.sections = newSections;
            }
        });
    };

    const handleApplyPageTemplate = (newPageContent: Page) => {
        updateWebsite(draft => {
            const pageIndex = draft.pages.findIndex((p: Page) => p.id === activePageId);
            if (pageIndex !== -1) {
                draft.pages[pageIndex].sections = newPageContent.sections;
            }
        });
    };

    const handleToggleSupportedLanguage = (langCode: string) => {
        updateWebsite(draft => {
            if (!draft.supportedLanguages) draft.supportedLanguages = [];
            
            // Only allow removing if not default language
            if (draft.supportedLanguages.includes(langCode) && langCode !== draft.defaultLanguage) {
                draft.supportedLanguages = draft.supportedLanguages.filter(lang => lang !== langCode);
                // If the removed language was the current preview language, switch to default
                if (langCode === currentContentLanguage) {
                    setCurrentContentLanguage(draft.defaultLanguage);
                }
                if (draft.contentTranslations && draft.contentTranslations[langCode]) {
                    delete draft.contentTranslations[langCode]; // Clear translations for removed language
                }
            } else if (!draft.supportedLanguages.includes(langCode)) {
                // Add language
                draft.supportedLanguages.push(langCode);
            }
        });
    };

    const handleTranslateContent = async (targetLang: string) => {
        if (!website.defaultLanguage || !website.supportedLanguages.includes(targetLang) || targetLang === website.defaultLanguage) {
            console.error("Invalid target language for translation.");
            setTranslationStatus('error');
            setTimeout(() => setTranslationStatus('idle'), 3000);
            return;
        }
        
        const langName = LANGUAGES.find(l => l.code === targetLang)?.name || targetLang;
        const confirmMessage = t('translateContentConfirm', {langName: langName}); // Passed langName as a variable
        if (!window.confirm(confirmMessage)) {
            return;
        }

        setIsTranslating(true);
        setTranslationStatus('idle'); // Reset status
        try {
            // Step 1: Extract translatable content from the default language
            const contentMap = extractTranslatableContent(website, website.defaultLanguage);
            console.log("Extracted content map for translation:", contentMap);

            // Step 2: Use AI to translate the extracted content
            const translatedMap = await translateContentWithAI(contentMap, targetLang);
            console.log("Received translated map:", translatedMap);

            // Step 3: Apply the translated content back to the website object
            updateWebsite(draft => {
                const updatedWebsite = applyTranslatedContent(draft, translatedMap, targetLang);
                // Directly update the draft object
                draft.contentTranslations = updatedWebsite.contentTranslations;
                draft.supportedLanguages = updatedWebsite.supportedLanguages;
            });
            setCurrentContentLanguage(targetLang); // Switch preview to the newly translated language
            setTranslationStatus('success');
        } catch (error) {
            console.error("AI translation failed:", error);
            setTranslationStatus('error');
        } finally {
            setTimeout(() => {
                setIsTranslating(false);
                setTranslationStatus('idle');
            }, 3000);
        }
    };

    const sectionIds = useMemo(() => activePage.sections.map(s => s.id), [activePage.sections]);
    const isSectionsAccordionOpen = openAccordion === 'sections' || sectionIds.includes(openAccordion);


    return (
        <div className={`w-full md:w-80 lg:w-96 bg-dark-surface text-dark-text flex-shrink-0 h-screen flex flex-col ${isMobile ? 'absolute top-0 left-0 z-20' : ''}`}>
            <div className="p-4 border-b border-dark-border flex justify-between items-center flex-shrink-0">
                <Logo className="h-8" />
                <button
                  onClick={onSave}
                  disabled={isSaving}
                  className="bg-primary text-black font-bold py-2 px-5 rounded-md hover:bg-primary-dark disabled:bg-gray-600 transition-all text-sm"
                >
                  {isSaving ? t('saving') : (user ? t('saveAndPublish') : t('save'))}
                </button>
            </div>

            <div className="flex-grow overflow-y-auto">
                <Accordion title={t('projectSettings')} iconName="Wand" isOpen={openAccordion === 'project-settings'} onToggle={() => setOpenAccordion(openAccordion === 'project-settings' ? '' : 'project-settings')}>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-dark-text-secondary mb-2">{t('companyName')}</label>
                            <input
                              type="text"
                              value={website.name[website.defaultLanguage] || ''} // Edit default language name
                              onChange={(e) => updateWebsite(draft => {
                                draft.name = { ...draft.name, [draft.defaultLanguage]: e.target.value }
                              })}
                              className="w-full bg-dark-bg border border-dark-border rounded-md px-3 py-2 text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-dark-text-secondary mb-2">{t('globalTheme')}</label>
                            <select
                                value={website.theme}
                                onChange={(e) => updateWebsite(draft => { draft.theme = e.target.value as 'light' | 'dark' })}
                                className="w-full bg-dark-bg border border-dark-border rounded-md px-3 py-2 text-sm focus:ring-primary focus:border-primary"
                            >
                                <option value="light">{t('light')}</option>
                                <option value="dark">{t('dark')}</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-dark-text-secondary mb-2">{t('themeColor')}</label>
                            <ColorPicker value={website.themeColor} onChange={(color) => updateWebsite(draft => { draft.themeColor = color })}/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-dark-text-secondary mb-2">{t('uiLanguage')}</label>
                            <select
                                value={currentUILanguage}
                                onChange={(e) => setUILanguage(e.target.value)}
                                className="w-full bg-dark-bg border border-dark-border rounded-md px-3 py-2 text-sm focus:ring-primary focus:border-primary"
                            >
                                {LANGUAGES.map(lang => (
                                    <option key={lang.code} value={lang.code}>{lang.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="border-t border-dark-border pt-4 mt-4">
                            <h4 className="text-md font-semibold text-white mb-3">{t('websiteContentLanguages')}</h4>
                            <div>
                                <label className="block text-sm font-medium text-dark-text-secondary mb-2">{t('defaultContentLanguage')}</label>
                                <select
                                    value={website.defaultLanguage}
                                    onChange={(e) => updateWebsite(draft => { 
                                        draft.defaultLanguage = e.target.value;
                                        // Ensure default language is always in supported languages
                                        if (!draft.supportedLanguages.includes(e.target.value)) {
                                            draft.supportedLanguages.push(e.target.value);
                                        }
                                        setCurrentContentLanguage(e.target.value); // Switch preview to new default
                                     })}
                                    className="w-full bg-dark-bg border border-dark-border rounded-md px-3 py-2 text-sm focus:ring-primary focus:border-primary"
                                >
                                    {LANGUAGES.map(lang => (
                                        <option key={lang.code} value={lang.code}>{lang.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="mt-4">
                                <label className="block text-sm font-medium text-dark-text-secondary mb-2">{t('supportedContentLanguages')}</label>
                                <div className="space-y-2">
                                    {LANGUAGES.map(lang => (
                                        <div key={lang.code} className="flex items-center">
                                            <input
                                                type="checkbox"
                                                id={`lang-toggle-${lang.code}`}
                                                checked={website.supportedLanguages.includes(lang.code)}
                                                onChange={() => handleToggleSupportedLanguage(lang.code)}
                                                disabled={lang.code === website.defaultLanguage} // Cannot disable default language
                                                className="h-4 w-4 text-primary-dark rounded focus:ring-primary-dark border-gray-600"
                                            />
                                            <label htmlFor={`lang-toggle-${lang.code}`} className="ml-2 text-sm text-white">
                                                {lang.name} {lang.code === website.defaultLanguage && `(${t('default')})`}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {website.supportedLanguages.length > 1 && (
                                <div className="mt-4">
                                    <label className="block text-sm font-medium text-dark-text-secondary mb-2">{t('currentPreviewLanguage')}</label>
                                    <select
                                        value={currentContentLanguage}
                                        onChange={(e) => setCurrentContentLanguage(e.target.value)}
                                        className="w-full bg-dark-bg border border-dark-border rounded-md px-3 py-2 text-sm focus:ring-primary focus:border-primary"
                                    >
                                        {website.supportedLanguages.map(langCode => (
                                            <option key={langCode} value={langCode}>{LANGUAGES.find(l => l.code === langCode)?.name || langCode}</option>
                                        ))}
                                    </select>
                                    {currentContentLanguage !== website.defaultLanguage && (
                                        <button
                                            onClick={() => handleTranslateContent(currentContentLanguage)}
                                            disabled={isTranslating}
                                            className="w-full mt-3 bg-blue-600 text-white font-bold py-2 px-3 rounded-md hover:bg-blue-700 disabled:bg-gray-600 text-sm flex items-center justify-center"
                                        >
                                            {isTranslating ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                                    {t('translating')}...
                                                </>
                                            ) : (
                                                t('translateContent')
                                            )}
                                        </button>
                                    )}
                                    {translationStatus === 'success' && <p className="text-green-400 text-sm mt-2 text-center">{t('translatedSuccess')}</p>}
                                    {translationStatus === 'error' && <p className="text-red-400 text-sm mt-2 text-center">{t('translationFailed')}</p>}
                                </div>
                            )}
                        </div>
                    </div>
                </Accordion>
                <Accordion title={t('pages')} iconName="DocumentText" isOpen={openAccordion === 'pages'} onToggle={() => setOpenAccordion(openAccordion === 'pages' ? '' : 'pages')}>
                    <div className="space-y-2">
                        {website.pages.map(page => (
                            <div key={page.id} className="flex items-center justify-between group">
                                <button
                                    onClick={() => setActivePageId(page.id)}
                                    className={`flex-1 text-left px-3 py-2 rounded-md transition-colors text-sm ${activePageId === page.id ? 'bg-primary text-black font-semibold' : 'hover:bg-dark-border'}`}
                                >
                                    {page.name[currentContentLanguage] || page.name[website.defaultLanguage]}
                                </button>
                                {activePageId === page.id && (
                                    <button
                                        onClick={() => setShowApplyPageTemplateModal(true)}
                                        className="ml-2 px-3 py-1.5 text-xs bg-dark-border rounded-md hover:bg-gray-600 transition-colors"
                                        title={t('applyPageTemplate')}
                                    >
                                        {t('applyTemplate')}
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                    <button onClick={() => setShowAddPageModal(true)} className="w-full mt-4 text-sm flex items-center justify-center gap-2 px-3 py-1.5 border border-dashed border-dark-border rounded-md hover:bg-dark-border transition-colors">
                        <Icon name="Plus" className="w-4 h-4"/> {t('addNewPage')}
                    </button>
                </Accordion>
                <Accordion title={t('sections')} iconName="Chart" isOpen={isSectionsAccordionOpen} onToggle={() => setOpenAccordion(isSectionsAccordionOpen && openAccordion !== 'sections' ? 'sections' : isSectionsAccordionOpen ? '' : 'sections')}>
                   {activePage.sections.map((section, index) => (
                        <Accordion
                            key={section.id}
                            title={section.type}
                            iconName="Code" // Generic icon for sections
                            isOpen={openAccordion === section.id}
                            onToggle={() => setOpenAccordion(openAccordion === section.id ? 'sections' : section.id)}
                            isSectionEnabled={section.enabled}
                            onToggleSectionEnabled={() => {
                                setWebsite(prev => {
                                    if (!prev) return prev;
                                    const newWebsite = JSON.parse(JSON.stringify(prev));
                                    const page = newWebsite.pages.find((p: Page) => p.id === activePageId);
                                    if (page) {
                                        const sec = page.sections.find((s: Section) => s.id === section.id);
                                        if (sec) sec.enabled = !sec.enabled;
                                    }
                                    return newWebsite;
                                });
                            }}
                            onDeleteSection={() => handleDeleteSection(section.id)}
                            onMoveSectionUp={() => handleMoveSection(section.id, 'up')}
                            onMoveSectionDown={() => handleMoveSection(section.id, 'down')}
                            canMoveUp={index > 0}
                            canMoveDown={index < activePage.sections.length - 1}
                        >
                            <SectionFormRenderer section={section} />
                        </Accordion>
                   ))}
                    <button onClick={() => setShowAddSectionModal(true)} className="w-full mt-4 text-sm flex items-center justify-center gap-2 px-3 py-1.5 border border-dashed border-dark-border rounded-md hover:bg-dark-border transition-colors">
                        <Icon name="Plus" className="w-4 h-4"/> {t('addNewSection')}
                    </button>
                </Accordion>
            </div>
            {showAddPageModal && <AddPageModal onAdd={handleAddPage} onClose={() => setShowAddPageModal(false)} companyName={website.name} industry={website.industry} theme={website.theme} defaultLang={website.defaultLanguage} />}
            {showAddSectionModal && <AddSectionModal onAdd={handleAddSection} onClose={() => setShowAddSectionModal(false)} companyName={website.name} theme={website.theme} defaultLang={website.defaultLanguage} />}
            {showApplyPageTemplateModal && <ApplyPageTemplateModal onApply={handleApplyPageTemplate} onClose={() => setShowApplyPageTemplateModal(false)} companyName={website.name} industry={website.industry} theme={website.theme} defaultLang={website.defaultLanguage} />}
        </div>
    );
};

export const EditorView: React.FC<{ onExit: () => void; onSave: () => Promise<string>; }> = ({ onExit, onSave }) => {
    const context = useContext(WebsiteContext);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [showEditorPanel, setShowEditorPanel] = useState(!isMobile); // Editor panel hidden on mobile by default
    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error' | 'auth_required' | 'published'>('idle'); // Added 'published'
    const { t } = useLanguage();

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            // On desktop, always show panel unless user explicitly hides it
            // On mobile, keep it hidden by default
            if (!mobile && !showEditorPanel) { // If desktop and panel was hidden, show it
                setShowEditorPanel(true);
            } else if (mobile && showEditorPanel) { // If mobile and panel was shown, hide it
                // setShowEditorPanel(false); // Let mobile user explicitly close
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [showEditorPanel]);

    if (!context) return null;
    const { website, activePageId, setWebsite, setActivePageId, currentContentLanguage } = context;

    // FIX: Changed handleSaveClick to return a Promise<string> to match EditorPanelProps
    const handleSaveClick = async (): Promise<string> => {
        setIsSaving(true);
        setSaveStatus('idle');
        let finalResult: string = 'error'; // Initialize with error
        try {
            const result = await onSave();
            finalResult = result; // Store the result
            if (result === 'success') {
                setSaveStatus('published'); // Indicate publishing success for logged-in users
            } else {
                setSaveStatus(result as any);
            }
            return result; // Return the result
        } catch (error) {
            console.error("Error saving website:", error);
            setSaveStatus('error');
            finalResult = 'error';
            return 'error'; // Return 'error' on failure
        } finally {
            setIsSaving(false);
            // Only hide status if it's not prompting for auth
            if (finalResult !== 'auth_required') { // Check the actual result of the save operation
               setTimeout(() => setSaveStatus('idle'), 2000);
            }
        }
    };

    const activePage = useMemo(() => {
        return website.pages.find(p => p.id === activePageId) || website.pages[0];
    }, [website.pages, activePageId]);

    const previewButtonText = showEditorPanel ? t('preview') : t('edit');
    const previewButtonIcon = showEditorPanel ? 'Eye' : 'Pencil';

    return (
        <div className="flex h-screen bg-dark-bg">
            {showEditorPanel && <EditorPanel activePage={activePage} isMobile={isMobile} onSave={handleSaveClick} isSaving={isSaving} />}
            <div className={`flex-1 flex flex-col h-screen overflow-y-auto relative ${showEditorPanel ? 'md:w-[calc(100%-320px)] lg:w-[calc(100%-384px)]' : 'w-full'}`}>
                <header className="bg-dark-surface p-2 flex justify-between items-center sticky top-0 z-30 shadow-md">
                     <button
                        onClick={() => setShowEditorPanel(s => !s)}
                        className="p-2 text-white mr-auto md:hidden"
                        aria-label={t('toggleEditorPanel')}
                    >
                        <Icon name={showEditorPanel ? 'XMark' : 'Bars3'} />
                    </button>
                     <div className="flex-1 text-center text-sm text-dark-text-secondary">
                        {activePage.name[currentContentLanguage] || activePage.name[website.defaultLanguage]}
                    </div>
                     {saveStatus === 'published' && <span className="text-green-400 text-sm">{t('publishedSuccess')}</span>}
                     {saveStatus === 'success' && <span className="text-green-400 text-sm">{t('saved')}</span>}
                     {saveStatus === 'error' && <span className="text-red-400 text-sm">{t('error')}</span>}

                    {!isMobile && (
                        <button
                            onClick={() => setShowEditorPanel(s => !s)}
                            className="p-2 text-white flex items-center gap-2 ml-4 mr-2 bg-dark-border rounded-md hover:bg-gray-600 transition-colors text-sm"
                            aria-label={previewButtonText}
                        >
                            <Icon name={previewButtonIcon} className="w-5 h-5" /> {previewButtonText}
                        </button>
                    )}
                     <button onClick={onExit} className="p-2 text-white ml-auto md:ml-0" aria-label={t('exitEditor')}>
                        <Icon name="Close" />
                    </button>
                </header>
                {/* Apply global theme class to the website preview container */}
                <div className={`${website.theme === 'dark' ? 'dark-theme' : 'light-theme'}`}>
                    <WebsiteComponent activePage={activePage} website={website} />
                </div>
                <ChatBot />
                <VoiceAssistant />
            </div>
        </div>
    );
};

export default EditorView;