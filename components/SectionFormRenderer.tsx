import React, { useContext } from 'react';
import { WebsiteContext } from '../App';
import { Section, Page, Website } from '../types';
import ImageGenerator from './ImageGenerator';
import { Icon, generateId, ICONS, useLanguage } from '../constants'; // Import useLanguage

const isListSection = (section: Section): section is Section & { items: any[] } | Section & { members: any[] } | Section & { timeline: any[] } => {
    return 'items' in section || 'members' in section || 'timeline' in section;
};

const getListKey = (section: Section): 'items' | 'members' | 'timeline' | null => {
    if ('items' in section) return 'items';
    if ('members' in section) return 'members';
    if ('timeline' in section) return 'timeline';
    return null;
}

// FIX: Updated createNewListItem to accept defaultLang and t
const createNewListItem = (sectionType: Section['type'], defaultLang: string, t: (key: string) => string): object => {
    const id = generateId('item');
    switch (sectionType) {
        // FIX: Wrapped string literals and t(...) calls in Record<string, string> for multilingual fields
        case 'Services': return { id, icon: 'Briefcase', name: { [defaultLang]: t('serviceName') }, description: { [defaultLang]: t('briefDescription') } };
        case 'Products': return { id, name: { [defaultLang]: t('newProduct') }, description: { [defaultLang]: t('productDetails') }, price: '$0.00', image: 'https://picsum.photos/seed/newproduct/400/300' };
        case 'Features': return { id, name: { [defaultLang]: t('newFeature') }, description: { [defaultLang]: t('featureDetails') }, image: 'https://picsum.photos/seed/newfeature/600/400' };
        case 'Pricing': return { id, plan: { [defaultLang]: t('newPlan') }, price: '0', period: { [defaultLang]: 'month' }, features: [{ [defaultLang]: t('feature1') }], featured: false };
        case 'Clients': return { id, name: { [defaultLang]: t('newClient') }, logo: 'https://picsum.photos/seed/newclient/200/100' };
        case 'Team': return { id, name: { [defaultLang]: t('newMember') }, title: { [defaultLang]: t('jobTitle') }, image: 'https://picsum.photos/seed/newmember/400/400', social: { twitter: '#', linkedin: '#', facebook: '#', instagram: '#' } };
        case 'Gallery': return { id, image: 'https://picsum.photos/seed/newgallery/500/500', title: { [defaultLang]: t('newImage') }, category: { [defaultLang]: t('default') } };
        case 'Testimonials': return { id, text: { [defaultLang]: t('glowingReview') }, author: { [defaultLang]: t('customer') }, role: { [defaultLang]: t('role') }, avatar: 'https://picsum.photos/seed/newavatar/100/100' };
        case 'FAQ': return { id, question: { [defaultLang]: t('newQuestion') }, answer: { [defaultLang]: t('answerToNewQuestion') } };
        case 'Blog': return { id, title: { [defaultLang]: t('newBlogPost') }, excerpt: { [defaultLang]: t('briefSummary') }, author: { [defaultLang]: t('author') }, date: new Date().toISOString().split('T')[0], image: 'https://picsum.photos/seed/newpost/400/300' };
        case 'Story': return { id: generateId('timeline-item'), year: '2024', event: { [defaultLang]: t('newEvent') } }; // Added ID for timeline item
        default: return { id };
    }
};

const SectionFormRenderer: React.FC<{ section: Section }> = ({ section }) => {
    const context = useContext(WebsiteContext);
    const { t } = useLanguage(); // Get t from useLanguage
    if (!context) return null;
    const { website, setWebsite, activePageId } = context;

    const updateWebsite = (updater: (draft: Website) => void) => {
        setWebsite(prev => {
            if (!prev) return prev;
            const draft = JSON.parse(JSON.stringify(prev));
            updater(draft);
            return draft;
        });
    };

    const updateField = (sectionId: string, field: string, value: any) => {
        updateWebsite(draft => {
            const page = draft.pages.find((p: Page) => p.id === activePageId);
            if (page) {
                const sec = page.sections.find((s: Section) => s.id === sectionId);
                if (sec) { 
                    // FIX: Ensure multilingual fields are updated as Record<string, string>
                    // Only update the default language property if it's a multilingual object
                    if (typeof (sec as any)[field] === 'object' && (sec as any)[field] !== null && website.defaultLanguage in (sec as any)[field]) {
                        (sec as any)[field][website.defaultLanguage] = value;
                    } else {
                        (sec as any)[field] = value; 
                    }
                }
            }
        });
    };
    
    const updateListItem = (sectionId: string, listKey: string, itemIndex: number, itemField: string, value: any) => {
        updateWebsite(draft => {
            const page = draft.pages.find(p => p.id === activePageId);
            if (page) {
                const sec = page.sections.find(s => s.id === sectionId);
                if (sec && (sec as any)[listKey]) {
                    // FIX: Ensure multilingual fields within items are updated as Record<string, string>
                    // Only update the default language property if it's a multilingual object
                    if (typeof (sec as any)[listKey][itemIndex][itemField] === 'object' && (sec as any)[listKey][itemIndex][itemField] !== null && website.defaultLanguage in (sec as any)[listKey][itemIndex][itemField]) {
                        (sec as any)[listKey][itemIndex][itemField][website.defaultLanguage] = value;
                    } else {
                        (sec as any)[listKey][itemIndex][itemField] = value;
                    }
                }
            }
        });
    };

    const addListItem = (sectionId: string, listKey: string) => {
         updateWebsite(draft => {
            const page = draft.pages.find(p => p.id === activePageId);
            if (page) {
                const sec = page.sections.find(s => s.id === sectionId);
                if (sec && (sec as any)[listKey]) {
                    // FIX: Pass defaultLang and t to createNewListItem
                    (sec as any)[listKey].push(createNewListItem(sec.type, website.defaultLanguage, t));
                }
            }
        });
    };

    const removeListItem = (sectionId: string, listKey: string, itemIndex: number) => {
        updateWebsite(draft => {
            const page = draft.pages.find(p => p.id === activePageId);
            if (page) {
                const sec = page.sections.find(s => s.id === sectionId);
                if (sec && (sec as any)[listKey]) {
                    (sec as any)[listKey].splice(itemIndex, 1);
                }
            }
        });
    };

    const getFieldValue = (fieldKey: string, value: any) => {
        if (typeof value === 'object' && value !== null && website.defaultLanguage in value) {
            return value[website.defaultLanguage];
        }
        return value;
    };

    const renderField = (label: string, value: any, onChange: (val: any) => void) => {
        const displayValue = getFieldValue(label, value);
        const isLongText = typeof displayValue === 'string' && displayValue.length > 80;
         if (isLongText) {
            return (
                <textarea
                    value={displayValue}
                    onChange={e => onChange(e.target.value)}
                    className="w-full bg-dark-bg border border-dark-border rounded-md px-3 py-2 text-sm focus:ring-primary focus:border-primary"
                    rows={4}
                />
            );
         }
         return (
            <input
                type="text"
                value={displayValue}
                onChange={e => onChange(e.target.value)}
                className="w-full bg-dark-bg border border-dark-border rounded-md px-3 py-2 text-sm focus:ring-primary focus:border-primary"
            />
        );
    }
    
    const listKey = getListKey(section);
    const listItems = listKey ? (section as any)[listKey] : [];

    return (
        <div className="space-y-4">
            {Object.entries(section)
                .filter(([key]) => !['id', 'type', 'enabled', 'items', 'members', 'timeline'].includes(key))
                .map(([key, value]) => (
                <div key={key}>
                    <label className="capitalize block text-sm font-medium text-dark-text-secondary mb-1">{key.replace(/([A-Z])/g, ' $1')}</label>
                    {key.toLowerCase().includes('image') || key.toLowerCase().includes('logo') || key.toLowerCase().includes('avatar') ? (
                        <ImageGenerator 
                            value={getFieldValue(key, value) as string} // Pass the default language value
                            onChange={(newValue) => updateField(section.id, key, newValue)}
                            promptContext={`${website.industry}, ${section.type}, ${key}`}
                        />
                    ) : key === 'theme' || key === 'layout' ? ( // Handle select for theme and layout
                         <select 
                            value={value as string || ''} // Ensure default value is empty string or valid option
                            onChange={e => updateField(section.id, key, e.target.value)}
                            className="w-full bg-dark-bg border border-dark-border rounded-md px-3 py-2 text-sm focus:ring-primary focus:border-primary">
                            {key === 'theme' && (
                                <>
                                    <option value="light">{t('light')}</option>
                                    <option value="dark">{t('dark')}</option>
                                </>
                            )}
                            {key === 'layout' && (
                                <>
                                    <option value="">{t('default')}</option> {/* Default/unset option */}
                                    {section.type === 'Hero' && (
                                        <>
                                            <option value="left-aligned">Left Aligned</option>
                                            <option value="centered">Centered</option>
                                            <option value="split">Split</option>
                                        </>
                                    )}
                                    {section.type === 'About' && (
                                        <>
                                            <option value="image-left">Image Left</option>
                                            <option value="image-right">Image Right</option>
                                        </>
                                    )}
                                     {section.type === 'Services' && (
                                        <>
                                            <option value="grid-icon-top">Grid Icon Top</option>
                                            <option value="list-icon-left">List Icon Left</option>
                                        </>
                                    )}
                                    {section.type === 'Products' && (
                                        <>
                                            <option value="grid">Grid</option>
                                            <option value="carousel">Carousel</option>
                                        </>
                                    )}
                                    {section.type === 'Features' && (
                                        <>
                                            <option value="image-right-text-left">Image Right, Text Left</option>
                                            <option value="image-left-text-right">Image Left, Text Right</option>
                                        </>
                                    )}
                                    {section.type === 'Team' && (
                                        <>
                                            <option value="grid">Grid</option>
                                            <option value="carousel">Carousel</option>
                                        </F>
                                    )}
                                    {section.type === 'Gallery' && (
                                        <>
                                            <option value="grid">Grid</option>
                                            <option value="masonry">Masonry</option>
                                        </>
                                    )}
                                    {section.type === 'Testimonials' && (
                                        <>
                                            <option value="grid">Grid</option>
                                            <option value="carousel">Carousel</option>
                                        </>
                                    )}
                                    {section.type === 'Blog' && (
                                        <>
                                            <option value="grid">Grid</option>
                                            <option value="list">List</option>
                                        </>
                                    )}
                                    {section.type === 'Contact' && (
                                        <>
                                            <option value="address-left-form-right">Address Left, Form Right</option>
                                            <option value="form-left-address-right">Form Left, Address Right</option>
                                        </>
                                    )}
                                </>
                            )}
                        </select>
                    ) : (
                       renderField(key, value, (val) => updateField(section.id, key, val))
                    )}
                </div>
            ))}
            
            {isListSection(section) && listKey && (
                <div>
                    <h4 className="font-semibold text-lg mb-2 capitalize">{listKey}</h4>
                    <div className="space-y-4">
                        {listItems.map((item: any, index: number) => (
                             <div key={item.id || index} className="p-3 bg-dark-bg border border-dark-border rounded-md relative">
                                <button onClick={() => removeListItem(section.id, listKey, index)} className="absolute top-2 right-2 p-1 text-red-500 hover:bg-red-500/20 rounded-full">
                                    <Icon name="Trash" className="w-4 h-4" />
                                </button>
                                {Object.entries(item).filter(([itemKey]) => itemKey !== 'id').map(([itemKey, itemValue]) => (
                                    <div key={itemKey} className="mb-2">
                                        <label className="capitalize block text-xs font-medium text-dark-text-secondary mb-1">{itemKey.replace(/([A-Z])/g, ' $1')}</label>
                                         {itemKey.toLowerCase().includes('image') || itemKey.toLowerCase().includes('logo') || itemKey.toLowerCase().includes('avatar') ? (
                                            <ImageGenerator 
                                                value={getFieldValue(itemKey, itemValue) as string} 
                                                onChange={(newValue) => updateListItem(section.id, listKey, index, itemKey, newValue)}
                                                promptContext={`${website.industry}, ${section.type}, ${listKey} item`}
                                            />
                                        ) : itemKey === 'icon' ? (
                                             <select 
                                                value={getFieldValue(itemKey, itemValue) as string} // Display value
                                                onChange={e => updateListItem(section.id, listKey, index, itemKey, e.target.value)}
                                                className="w-full bg-gray-900 border border-dark-border rounded-md px-3 py-1.5 text-sm"
                                             >
                                                {Object.keys(ICONS).map(iconName => <option key={iconName} value={iconName}>{iconName}</option>)}
                                             </select>
                                        ) : itemKey === 'featured' ? (
                                            <input
                                                type="checkbox"
                                                checked={itemValue as boolean}
                                                onChange={e => updateListItem(section.id, listKey, index, itemKey, e.target.checked)}
                                                className="h-4 w-4 text-primary-dark rounded focus:ring-primary-dark border-gray-600"
                                            />
                                        ) : (
                                            renderField(itemKey, itemValue, (val) => updateListItem(section.id, listKey, index, itemKey, val))
                                        )}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                     <button onClick={() => addListItem(section.id, listKey)} className="w-full mt-4 text-sm flex items-center justify-center gap-2 px-3 py-1.5 border border-dashed border-dark-border rounded-md hover:bg-dark-border transition-colors">
                        <Icon name="Plus" className="w-4 h-4"/> Add New {listKey.slice(0, -1)}
                    </button>
                </div>
            )}
        </div>
    );
};

export default SectionFormRenderer;