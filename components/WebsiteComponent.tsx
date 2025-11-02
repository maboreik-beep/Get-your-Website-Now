import React, { useState, useMemo, useContext } from 'react';
import { Page, Section, HeroSection, AboutSection, StorySection, ServicesSection, ProductsSection, FeaturesSection, PricingSection, ClientsSection, TeamSection, ContactSection, GallerySection, TestimonialsSection, FAQSection, CTASection, FooterSection, BlogSection, Industry, ServiceItem, Website, BaseSection } from '../types';
import { Icon, ICONS, Logo } from '../constants';
import { WebsiteContext } from '../App';

// --- Helper Functions ---
const isColorDark = (hexColor: string) => {
    if (!hexColor || typeof hexColor !== 'string' || !hexColor.startsWith('#')) return false;
    const rgba = hexColor.substring(1);
    let r, g, b;

    if (rgba.length === 3) {
        r = parseInt(rgba[0] + rgba[0], 16);
        g = parseInt(rgba[1] + rgba[1], 16);
        b = parseInt(rgba[2] + rgba[2], 16);
    } else if (rgba.length === 6) {
        r = parseInt(rgba.substring(0, 2), 16);
        g = parseInt(rgba.substring(2, 4), 16);
        b = parseInt(rgba.substring(4, 6), 16);
    } else {
        return false;
    }
    
    // Perceived brightness (Luma) calculation
    const luma = (0.299 * r + 0.587 * g + 0.114 * b);
    return luma < 128; // Threshold to determine if text should be light or dark
};

const getTextColorForBackground = (bgColor: string) => {
    return isColorDark(bgColor) ? 'text-white' : 'text-gray-900';
};

// Helper to get translated text from a Record<string, string> field or contentTranslations map
// This is the core logic for dynamic multilingual content rendering.
const getTranslatedText = (
  fieldValue: Record<string, string> | undefined,
  path: string, // e.g., "pages.0.sections.1.headline" or "name"
  website: Website,
  currentLang: string
): string => {
    // Special handling for website.name itself
    if (path === 'name') {
        if (website.name && typeof website.name === 'object') {
            return website.name[currentLang] || website.name[website.defaultLanguage] || '';
        }
        return '';
    }
    
    // First, try to get from contentTranslations if available for currentLang
    if (website.contentTranslations && website.contentTranslations[currentLang] && website.contentTranslations[currentLang][path]) {
        return website.contentTranslations[currentLang][path];
    }
    // Fallback to the field's direct multilingual object
    if (fieldValue && typeof fieldValue === 'object') {
        // Prioritize currentLang, then defaultLanguage, then the new dummy field
        return fieldValue[currentLang] || fieldValue[website.defaultLanguage] || (fieldValue as any).__default_lang_content || '';
    }
    return '';
};


// --- Component Implementations ---

interface SectionWrapperProps {
    section: Section;
    children: React.ReactNode;
    websiteTheme: 'light' | 'dark'; // Added global website theme
    className?: string;
    themeColor: string;
}

const SectionWrapper: React.FC<SectionWrapperProps> = ({ section, children, websiteTheme, className = '', themeColor }) => {
    // Determine the effective theme for the section: section-specific override or global default
    const effectiveTheme = section.theme || websiteTheme; 
    const isDarkTheme = effectiveTheme === 'dark';

    const bgClass = isDarkTheme ? 'bg-dark-bg' : 'bg-white';
    const textColorClass = isDarkTheme ? 'text-dark-text' : 'text-gray-900';
    const accentColorStyle = themeColor ? { '--theme-color': themeColor } as React.CSSProperties : {};

    return (
        <section className={`py-20 md:py-28 px-4 md:px-8 ${bgClass} ${textColorClass} ${className}`} style={accentColorStyle}>
            <div className="container mx-auto max-w-7xl">
                {children}
            </div>
        </section>
    );
}

const HeroSectionComponent: React.FC<{ section: HeroSection; themeColor: string; website: Website; currentContentLanguage: string; path: string; }> = ({ section, themeColor, website, currentContentLanguage, path }) => {
    const subheadlineColor = 'text-gray-200'; // Always light for contrast
    const ctaTextColor = getTextColorForBackground(themeColor);

    const layoutClasses = {
        'left-aligned': 'justify-start text-left',
        'centered': 'justify-center text-center',
        'split': 'justify-start text-left md:justify-between md:flex-row'
    };
    
    const minHeightClass = section.layout === 'split' ? 'min-h-[70vh]' : 'min-h-[80vh] md:min-h-screen';

    return (
        <div 
            className={`relative w-full flex items-center bg-cover bg-center ${minHeightClass} transition-all duration-300`}
            style={{ backgroundImage: `url(${section.backgroundImage})` }}
            role="banner"
        >
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/60 to-black/30" aria-hidden="true"></div>

            <div className="relative z-10 container mx-auto max-w-7xl px-4 md:px-8">
                <div className={`flex flex-col ${layoutClasses[section.layout || 'left-aligned']} gap-8`}>
                    <div className={`${section.layout === 'centered' ? 'mx-auto' : ''} ${section.layout === 'split' ? 'md:max-w-2xl' : 'max-w-4xl'}`}>
                       <>
                           <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-4 drop-shadow-lg text-white">
                               {getTranslatedText(section.headline, `${path}.headline`, website, currentContentLanguage)}
                           </h1>
                           <div className={`w-24 h-1.5 rounded-full mb-6 ${section.layout === 'centered' ? 'mx-auto' : ''}`} style={{ backgroundColor: themeColor }}></div>
                       </>
                        <p className={`text-lg md:text-xl ${subheadlineColor} max-w-2xl mb-8 drop-shadow-md ${section.layout === 'centered' ? 'mx-auto' : ''}`}>
                            {getTranslatedText(section.subheadline, `${path}.subheadline`, website, currentContentLanguage)}
                        </p>
                        <div className="flex flex-wrap gap-4 items-center" style={{justifyContent: section.layout === 'centered' ? 'center' : 'flex-start'}}>
                            {section.ctaText &&
                                <a 
                                    href="#" 
                                    className={`font-bold py-4 px-10 rounded-md text-lg inline-block transition-transform transform hover:scale-105 shadow-xl ${ctaTextColor}`}
                                    style={{ backgroundColor: themeColor }}
                                    role="button"
                                >
                                    {getTranslatedText(section.ctaText, `${path}.ctaText`, website, currentContentLanguage)}
                                </a>
                            }
                            {section.ctaText2 &&
                                <a 
                                    href="#" 
                                    className={`font-bold py-4 px-10 rounded-md text-lg inline-block transition-transform transform hover:scale-105 shadow-xl bg-transparent border-2 border-white text-white hover:bg-white hover:text-black`}
                                    role="button"
                                >
                                    {getTranslatedText(section.ctaText2, `${path}.ctaText2`, website, currentContentLanguage)}
                                </a>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

interface AboutSectionComponentProps {
    section: AboutSection;
    themeColor: string;
    websiteTheme: 'light' | 'dark'; // Pass global theme
    website: Website;
    currentContentLanguage: string;
    path: string;
}

const AboutSectionComponent: React.FC<AboutSectionComponentProps> = ({ section, themeColor, websiteTheme, website, currentContentLanguage, path }) => {
    const effectiveTheme = section.theme || websiteTheme;
    const isDark = effectiveTheme === 'dark';
    const titleColor = isDark ? 'text-white' : 'text-gray-900';
    const textColor = isDark ? 'text-gray-300' : 'text-gray-600';

    const imageOrderClass = section.layout === 'image-left' ? 'md:order-1' : 'md:order-2';
    const textOrderClass = section.layout === 'image-left' ? 'md:order-2' : 'md:order-1';

    return (
        <SectionWrapper section={section} themeColor={themeColor} websiteTheme={websiteTheme}>
            <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className={textOrderClass}>
                    <h2 className={`text-4xl lg:text-5xl font-bold mb-6 ${titleColor}`}>{getTranslatedText(section.title, `${path}.title`, website, currentContentLanguage)}</h2>
                    <p className={`${textColor} leading-relaxed text-lg`}>{getTranslatedText(section.text, `${path}.text`, website, currentContentLanguage)}</p>
                </div>
                <div className={imageOrderClass}>
                    <img src={section.image} alt={getTranslatedText(section.title, `${path}.title`, website, currentContentLanguage)} className="rounded-lg shadow-2xl object-cover w-full h-full aspect-[4/3] transition-transform duration-300 hover:scale-105" />
                </div>
            </div>
        </SectionWrapper>
    );
};

const StorySectionComponent: React.FC<{ section: StorySection, themeColor: string, websiteTheme: 'light' | 'dark', website: Website; currentContentLanguage: string; path: string; }> = ({ section, themeColor, websiteTheme, website, currentContentLanguage, path }) => {
    const effectiveTheme = section.theme || websiteTheme;
    const isDark = effectiveTheme === 'dark';
    const titleColor = isDark ? 'text-white' : 'text-gray-900';
    const textColor = isDark ? 'text-gray-400' : 'text-gray-600';
    const cardBg = isDark ? 'bg-dark-surface' : 'bg-white';
    const cardTextColor = isDark ? 'text-gray-300' : 'text-gray-700';

    return (
     <SectionWrapper section={section} themeColor={themeColor} websiteTheme={websiteTheme}>
        <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className={`text-4xl lg:text-5xl font-bold mb-4 ${titleColor}`}>{getTranslatedText(section.title, `${path}.title`, website, currentContentLanguage)}</h2>
            <p className={`${textColor} text-lg leading-relaxed`}>{getTranslatedText(section.text, `${path}.text`, website, currentContentLanguage)}</p>
        </div>
        <div className="relative max-w-4xl mx-auto">
             <div className="absolute left-1/2 -translate-x-1/2 h-full w-1 rounded-full" style={{backgroundColor: `${themeColor}30`}}></div>
            {section.timeline.map((item, index) => (
                <div key={item.id} className={`relative mb-12 flex items-center flex-col md:flex-row ${index % 2 === 0 ? 'md:justify-start' : 'md:flex-row-reverse md:justify-end'}`}>
                    <div className={`w-full md:w-1/2 p-4 ${index % 2 === 0 ? 'md:pr-16 text-right' : 'md:pl-16 text-left'}`}>
                        <div className={`p-6 rounded-lg shadow-xl border-l-4 transition-transform duration-300 hover:scale-[1.02] ${cardBg}`} style={{borderColor: themeColor}}>
                           <p className="font-bold text-xl mb-2" style={{ color: themeColor }}>{item.year}</p>
                           <p className={cardTextColor}>{getTranslatedText(item.event, `${path}.timeline.${item.id}.event`, website, currentContentLanguage)}</p>
                        </div>
                    </div>
                    <div className={`absolute left-1/2 w-8 h-8 border-4 rounded-full z-10 -translate-x-1/2 flex items-center justify-center transition-transform duration-300 hover:scale-125 ${isDark ? 'bg-dark-bg' : 'bg-white'}`} style={{borderColor: themeColor}}>
                        <div className="w-2 h-2 rounded-full" style={{backgroundColor: themeColor}}></div>
                    </div>
                </div>
            ))}
        </div>
    </SectionWrapper>
);
};


const ServicesSectionComponent: React.FC<{ section: ServicesSection, themeColor: string, websiteTheme: 'light' | 'dark', website: Website; currentContentLanguage: string; path: string; }> = ({ section, themeColor, websiteTheme, website, currentContentLanguage, path }) => {
    const effectiveTheme = section.theme || websiteTheme;
    const isDark = effectiveTheme === 'dark';
    const titleColor = isDark ? 'text-white' : 'text-gray-900';
    const textColor = isDark ? 'text-gray-400' : 'text-gray-600';
    const cardBg = isDark ? 'bg-dark-surface' : 'bg-white';

    const layoutClasses = {
        'grid-icon-top': 'grid md:grid-cols-2 lg:grid-cols-3 gap-8',
        'list-icon-left': 'grid md:grid-cols-1 gap-6 max-w-3xl mx-auto',
    };

    const itemContent = (item: ServiceItem, itemIndex: number) => (
        <>
            <div className="inline-flex p-3 rounded-full transition-colors group-hover:bg-opacity-100" style={{backgroundColor: `${themeColor}20`, color: themeColor}}>
                <Icon name={item.icon as keyof typeof ICONS} className="w-8 h-8 flex-shrink-0"/>
            </div>
            <div>
                <h3 className={`text-2xl font-semibold mb-3 ${titleColor}`}>{getTranslatedText(item.name, `${path}.items.${item.id || itemIndex}.name`, website, currentContentLanguage)}</h3>
                <p className={textColor}>{getTranslatedText(item.description, `${path}.items.${item.id || itemIndex}.description`, website, currentContentLanguage)}</p>
            </div>
        </>
    );

    return (
        <SectionWrapper section={section} themeColor={themeColor} websiteTheme={websiteTheme}>
            <h2 className={`text-4xl lg:text-5xl font-bold text-center mb-16 ${titleColor}`}>{getTranslatedText(section.title, `${path}.title`, website, currentContentLanguage)}</h2>
            <div className={layoutClasses[section.layout || 'grid-icon-top']}>
                {section.items.map((item, index) => (
                    <div 
                        key={item.id} 
                        className={`p-8 rounded-xl shadow-lg transition-all transform hover:-translate-y-2 hover:shadow-2xl group ${cardBg} 
                            ${section.layout === 'list-icon-left' ? 'flex items-start gap-6' : 'flex flex-col items-start gap-4'}`}
                    >
                        {itemContent(item, index)}
                    </div>
                ))}
            </div>
        </SectionWrapper>
    );
};

const ProductsSectionComponent: React.FC<{ section: ProductsSection, themeColor: string, websiteTheme: 'light' | 'dark', website: Website; currentContentLanguage: string; path: string; }> = ({ section, themeColor, websiteTheme, website, currentContentLanguage, path }) => {
    const effectiveTheme = section.theme || websiteTheme;
    const isDark = effectiveTheme === 'dark';
    const titleColor = isDark ? 'text-white' : 'text-gray-900';
    const textColor = isDark ? 'text-gray-300' : 'text-gray-600';
    const cardBg = isDark ? 'bg-dark-surface' : 'bg-white';
    const buttonTextColor = getTextColorForBackground(themeColor);

    return (
        <SectionWrapper section={section} themeColor={themeColor} websiteTheme={websiteTheme}>
            <h2 className={`text-4xl lg:text-5xl font-bold text-center mb-16 ${titleColor}`}>{getTranslatedText(section.title, `${path}.title`, website, currentContentLanguage)}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {section.items.map((item, index) => (
                    <div key={item.id} className={`group rounded-lg overflow-hidden shadow-lg transition-transform transform hover:-translate-y-2 ${cardBg}`}>
                        <img src={item.image} alt={getTranslatedText(item.name, `${path}.items.${item.id || index}.name`, website, currentContentLanguage)} className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105" />
                        <div className="p-6">
                            <h3 className={`text-2xl font-semibold mb-2 ${titleColor}`}>{getTranslatedText(item.name, `${path}.items.${item.id || index}.name`, website, currentContentLanguage)}</h3>
                            <p className={`${textColor} mb-4`}>{getTranslatedText(item.description, `${path}.items.${item.id || index}.description`, website, currentContentLanguage)}</p>
                            <div className="flex justify-between items-center">
                                <span className={`text-2xl font-bold ${titleColor}`} style={{ color: themeColor }}>{item.price}</span>
                                <a href="#" className={`font-semibold py-2 px-5 rounded-md text-sm ${buttonTextColor}`} style={{ backgroundColor: themeColor }} role="button">
                                    Add to Cart
                                </a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </SectionWrapper>
    );
};

const FeaturesSectionComponent: React.FC<{ section: FeaturesSection; themeColor: string, websiteTheme: 'light' | 'dark', website: Website; currentContentLanguage: string; path: string; }> = ({ section, themeColor, websiteTheme, website, currentContentLanguage, path }) => {
    const effectiveTheme = section.theme || websiteTheme;
    const isDark = effectiveTheme === 'dark';
    const titleColor = isDark ? 'text-white' : 'text-gray-900';
    const textColor = isDark ? 'text-gray-400' : 'text-gray-600';

    return (
        <SectionWrapper section={section} themeColor={themeColor} websiteTheme={websiteTheme}>
            <h2 className={`text-4xl lg:text-5xl font-bold text-center mb-20 ${titleColor}`}>{getTranslatedText(section.title, `${path}.title`, website, currentContentLanguage)}</h2>
            <div className="space-y-20">
                {section.items.map((item, index) => (
                    <div key={item.id} className={`grid md:grid-cols-2 gap-12 items-center`}>
                        <div className={`order-2 ${section.layout === 'image-left-text-right' ? 'md:order-1' : 'md:order-2'} ${index % 2 === 0 ? '' : 'md:order-2'}`}> {/* Dynamic order based on layout and index */}
                            <img src={item.image} alt={getTranslatedText(item.name, `${path}.items.${item.id || index}.name`, website, currentContentLanguage)} className="rounded-lg shadow-xl aspect-video object-cover transition-transform duration-300 hover:scale-105" />
                        </div>
                        <div className={`order-1 ${section.layout === 'image-left-text-right' ? 'md:order-2' : 'md:order-1'} ${index % 2 === 0 ? '' : 'md:order-1'}`}> {/* Dynamic order based on layout and index */}
                            <h3 className={`text-3xl font-bold mb-3 ${titleColor}`}>{getTranslatedText(item.name, `${path}.items.${item.id || index}.name`, website, currentContentLanguage)}</h3>
                            <p className={`${textColor} leading-relaxed text-lg`}>{getTranslatedText(item.description, `${path}.items.${item.id || index}.description`, website, currentContentLanguage)}</p>
                        </div>
                    </div>
                ))}
            </div>
        </SectionWrapper>
    );
};

const PricingSectionComponent: React.FC<{ section: PricingSection, themeColor: string, websiteTheme: 'light' | 'dark', website: Website; currentContentLanguage: string; path: string; }> = ({ section, themeColor, websiteTheme, website, currentContentLanguage, path }) => {
    const effectiveTheme = section.theme || websiteTheme;
    const isDark = effectiveTheme === 'dark';
    const titleColor = isDark ? 'text-white' : 'text-gray-900';
    const textColor = isDark ? 'text-gray-400' : 'text-gray-600';
    const cardBg = isDark ? 'bg-dark-surface' : 'bg-white';
    const buttonTextColor = getTextColorForBackground(themeColor);


    return (
        <SectionWrapper section={section} themeColor={themeColor} websiteTheme={websiteTheme}>
            <h2 className={`text-4xl lg:text-5xl font-bold text-center mb-16 ${titleColor}`}>{getTranslatedText(section.title, `${path}.title`, website, currentContentLanguage)}</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 items-center max-w-6xl mx-auto">
                {section.items.map((item, index) => (
                    <div 
                        key={item.id} 
                        className={`p-8 ${cardBg} rounded-xl shadow-lg text-center transition-all transform ${item.featured ? 'scale-105 shadow-2xl border-2' : 'hover:scale-105 hover:shadow-2xl'}`} 
                        style={{ borderColor: item.featured ? themeColor : 'transparent' }}
                    >
                        <h3 className={`text-2xl font-bold mb-2 ${titleColor}`}>{getTranslatedText(item.plan, `${path}.items.${item.id || index}.plan`, website, currentContentLanguage)}</h3>
                        <p className="text-5xl font-extrabold mb-2" style={{color: item.featured ? themeColor : titleColor}}>{item.price.startsWith('Contact') ? item.price : `$${item.price}`}</p>
                         <p className={`text-base font-medium ${textColor} mb-6 h-6`}>{getTranslatedText(item.period, `${path}.items.${item.id || index}.period`, website, currentContentLanguage) && `/ ${getTranslatedText(item.period, `${path}.items.${item.id || index}.period`, website, currentContentLanguage)}`}</p>
                        <ul className={`my-6 space-y-3 ${textColor} text-left`}>
                            {item.features.map((feature, i) => <li key={i} className="flex items-center gap-3"><Icon name="Shield" className="w-5 h-5 text-green-500 flex-shrink-0" />{getTranslatedText(feature, `${path}.items.${item.id || index}.features.${i}`, website, currentContentLanguage)}</li>)}
                        </ul>
                        <button className={`font-bold py-3 px-8 rounded-md w-full transition ${item.featured ? buttonTextColor : (isDark ? 'bg-gray-700' : 'bg-gray-200 text-gray-800')}`}>
                            Choose Plan
                        </button>
                    </div>
                ))}
            </div>
        </SectionWrapper>
    );
};

const ClientsSectionComponent: React.FC<{ section: ClientsSection; themeColor: string, websiteTheme: 'light' | 'dark', website: Website; currentContentLanguage: string; path: string; }> = ({ section, themeColor, websiteTheme, website, currentContentLanguage, path }) => {
    const effectiveTheme = section.theme || websiteTheme;
    const isDark = effectiveTheme === 'dark';
    const titleColor = isDark ? 'text-gray-400' : 'text-gray-700';
    const sectionBg = isDark ? 'bg-dark-surface' : 'bg-gray-50';

    return (
        <SectionWrapper section={section} className={sectionBg} themeColor={themeColor} websiteTheme={websiteTheme}>
            <h2 className={`text-3xl font-bold text-center ${titleColor} mb-12`}>{getTranslatedText(section.title, `${path}.title`, website, currentContentLanguage)}</h2>
            <div className="flex flex-wrap justify-center items-center gap-x-16 gap-y-8">
                {section.items.map((item, index) => (
                    <div key={item.id} title={getTranslatedText(item.name, `${path}.items.${item.id || index}.name`, website, currentContentLanguage)} className="opacity-60 hover:opacity-100 transition-opacity duration-300">
                        <img src={item.logo} alt={getTranslatedText(item.name, `${path}.items.${item.id || index}.name`, website, currentContentLanguage)} className="h-10 max-w-[150px] object-contain" />
                    </div>
                ))}
            </div>
        </SectionWrapper>
    );
};

const TeamSectionComponent: React.FC<{ section: TeamSection, themeColor: string, websiteTheme: 'light' | 'dark', website: Website; currentContentLanguage: string; path: string; }> = ({ section, themeColor, websiteTheme, website, currentContentLanguage, path }) => {
    const effectiveTheme = section.theme || websiteTheme;
    const isDark = effectiveTheme === 'dark';
    const titleColor = isDark ? 'text-white' : 'text-gray-900';
    const nameColor = isDark ? 'text-white' : 'text-gray-900';
    const roleColor = themeColor; // Ensure this is always visible
    const cardBg = isDark ? 'bg-dark-surface' : 'bg-white';

    return (
        <SectionWrapper section={section} themeColor={themeColor} websiteTheme={websiteTheme}>
            <h2 className={`text-4xl lg:text-5xl font-bold text-center mb-16 ${titleColor}`}>{getTranslatedText(section.title, `${path}.title`, website, currentContentLanguage)}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                {section.members.map((member, index) => (
                    <div key={member.id} className={`text-center group p-6 rounded-xl shadow-lg transition-all transform hover:-translate-y-2 ${cardBg}`}>
                        <div className="relative w-48 h-48 mx-auto mb-4 overflow-hidden rounded-full border-4 transition-transform duration-300 group-hover:scale-105" style={{borderColor: themeColor}}>
                            <img src={member.image} alt={getTranslatedText(member.name, `${path}.members.${member.id || index}.name`, website, currentContentLanguage)} className="w-full h-full object-cover" />
                        </div>
                        <h3 className={`text-xl font-semibold ${nameColor} mb-1`}>{getTranslatedText(member.name, `${path}.members.${member.id || index}.name`, website, currentContentLanguage)}</h3>
                        <p className="font-medium mb-3" style={{color: roleColor}}>{getTranslatedText(member.title, `${path}.members.${member.id || index}.title`, website, currentContentLanguage)}</p>
                        <div className="flex justify-center gap-4 text-dark-text-secondary">
                            {member.social?.twitter && <a href={member.social.twitter} aria-label={`${getTranslatedText(member.name, `${path}.members.${member.id || index}.name`, website, currentContentLanguage)}'s Twitter`} className="hover:text-primary transition-colors"><Icon name="Twitter" className="w-6 h-6"/></a>}
                            {member.social?.linkedin && <a href={member.social.linkedin} aria-label={`${getTranslatedText(member.name, `${path}.members.${member.id || index}.name`, website, currentContentLanguage)}'s LinkedIn`} className="hover:text-primary transition-colors"><Icon name="Linkedin" className="w-6 h-6"/></a>}
                            {member.social?.facebook && <a href={member.social.facebook} aria-label={`${getTranslatedText(member.name, `${path}.members.${member.id || index}.name`, website, currentContentLanguage)}'s Facebook`} className="hover:text-primary transition-colors"><Icon name="Facebook" className="w-6 h-6"/></a>}
                            {member.social?.instagram && <a href={member.social.instagram} aria-label={`${getTranslatedText(member.name, `${path}.members.${member.id || index}.name`, website, currentContentLanguage)}'s Instagram`} className="hover:text-primary transition-colors"><Icon name="Instagram" className="w-6 h-6"/></a>}
                        </div>
                    </div>
                ))}
            </div>
        </SectionWrapper>
    );
};

const GallerySectionComponent: React.FC<{ section: GallerySection, themeColor: string, websiteTheme: 'light' | 'dark', website: Website; currentContentLanguage: string; path: string; }> = ({ section, themeColor, websiteTheme, website, currentContentLanguage, path }) => {
    const context = useContext(WebsiteContext);
    const [filter, setFilter] = useState('All');
    const effectiveTheme = section.theme || websiteTheme;
    const isDark = effectiveTheme === 'dark';
    const titleColor = isDark ? 'text-white' : 'text-gray-900';

    // Categories are now translated
    const categories = useMemo(() => {
        const uniqueCategories = new Set(section.items.map(item => getTranslatedText(item.category, `${path}.items.${item.id}.category`, website, currentContentLanguage)));
        return ['All', ...Array.from(uniqueCategories)];
    }, [section.items, website, currentContentLanguage, path]);

    const filteredItems = useMemo(() => {
      if (filter === 'All') return section.items;
      return section.items.filter(item => getTranslatedText(item.category, `${path}.items.${item.id}.category`, website, currentContentLanguage) === filter);
    }, [filter, section.items, website, currentContentLanguage, path]);


    return (
        <SectionWrapper section={section} themeColor={themeColor} websiteTheme={websiteTheme}>
            <h2 className={`text-4xl lg:text-5xl font-bold text-center mb-6 ${titleColor}`}>{getTranslatedText(section.title, `${path}.title`, website, currentContentLanguage)}</h2>
            <div className="flex justify-center gap-2 md:gap-4 mb-12 flex-wrap">
                {categories.map(cat => (
                    <button key={cat} onClick={() => setFilter(cat)} className={`font-semibold py-2 px-5 rounded-full text-sm transition ${filter === cat ? getTextColorForBackground(themeColor) : (isDark ? 'text-gray-300 bg-dark-surface' : 'text-gray-600 bg-gray-100')}`} style={{backgroundColor: filter === cat ? themeColor : undefined}}>
                        {cat}
                    </button>
                ))}
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map((item, index) => (
                    <div key={item.id} className="group relative overflow-hidden rounded-lg shadow-lg aspect-square">
                        <img src={item.image} alt={getTranslatedText(item.title, `${path}.items.${item.id || index}.title`, website, currentContentLanguage)} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex flex-col justify-end p-6">
                            <h3 className="text-xl font-bold text-white opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">{getTranslatedText(item.title, `${path}.items.${item.id || index}.title`, website, currentContentLanguage)}</h3>
                            <p className="text-sm text-gray-300 opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 delay-100">{getTranslatedText(item.category, `${path}.items.${item.id || index}.category`, website, currentContentLanguage)}</p>
                        </div>
                    </div>
                ))}
            </div>
        </SectionWrapper>
    );
};

const TestimonialsSectionComponent: React.FC<{ section: TestimonialsSection, themeColor: string, websiteTheme: 'light' | 'dark', website: Website; currentContentLanguage: string; path: string; }> = ({ section, themeColor, websiteTheme, website, currentContentLanguage, path }) => {
    const effectiveTheme = section.theme || websiteTheme;
    const isDark = effectiveTheme === 'dark';
    const titleColor = isDark ? 'text-white' : 'text-gray-900';
    const textColor = isDark ? 'text-gray-300' : 'text-gray-700';
    const authorColor = isDark ? 'text-white' : 'text-gray-900';
    const roleColor = isDark ? 'text-gray-400' : 'text-gray-500';
    const cardBg = isDark ? 'bg-dark-surface' : 'bg-gray-50';

    return (
        <SectionWrapper section={section} themeColor={themeColor} className={cardBg} websiteTheme={websiteTheme}>
            <h2 className={`text-4xl lg:text-5xl font-bold text-center mb-16 ${titleColor}`}>{getTranslatedText(section.title, `${path}.title`, website, currentContentLanguage)}</h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                {section.items.map((item, index) => (
                    <div key={item.id} className={`p-8 rounded-xl shadow-lg transition-transform hover:scale-105 ${isDark ? 'bg-dark-bg' : 'bg-white'}`}>
                        <p className={`text-lg italic leading-relaxed mb-6 ${textColor}`}>"{getTranslatedText(item.text, `${path}.items.${item.id || index}.text`, website, currentContentLanguage)}"</p>
                        <div className="flex items-center gap-4">
                            <img src={item.avatar} alt={getTranslatedText(item.author, `${path}.items.${item.id || index}.author`, website, currentContentLanguage)} className="w-16 h-16 rounded-full object-cover border-2" style={{borderColor: themeColor}} />
                            <div>
                                <h4 className={`font-bold text-lg ${authorColor}`}>{getTranslatedText(item.author, `${path}.items.${item.id || index}.author`, website, currentContentLanguage)}</h4>
                                <p className={roleColor}>{getTranslatedText(item.role, `${path}.items.${item.id || index}.role`, website, currentContentLanguage)}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </SectionWrapper>
    );
};

const FAQSectionComponent: React.FC<{ section: FAQSection, themeColor: string, websiteTheme: 'light' | 'dark', website: Website; currentContentLanguage: string; path: string; }> = ({ section, themeColor, websiteTheme, website, currentContentLanguage, path }) => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);
    const effectiveTheme = section.theme || websiteTheme;
    const isDark = effectiveTheme === 'dark';
    const titleColor = isDark ? 'text-white' : 'text-gray-900';
    const questionColor = isDark ? 'text-gray-100' : 'text-gray-800';
    const answerColor = isDark ? 'text-gray-400' : 'text-gray-600';
    const borderColor = isDark ? 'border-dark-border' : 'border-gray-200';

    return (
        <SectionWrapper section={section} themeColor={themeColor} websiteTheme={websiteTheme}>
            <h2 className={`text-4xl lg:text-5xl font-bold text-center mb-16 ${titleColor}`}>{getTranslatedText(section.title, `${path}.title`, website, currentContentLanguage)}</h2>
            <div className={`max-w-4xl mx-auto space-y-4`}>
                {section.items.map((item, index) => (
                    <div key={item.id} className={`border-b ${borderColor}`}>
                        <button onClick={() => setOpenIndex(openIndex === index ? null : index)} className="w-full flex justify-between items-center py-5 text-left" aria-expanded={openIndex === index} aria-controls={`faq-answer-${item.id}`}>
                            <h3 className={`text-xl font-semibold ${questionColor}`}>{getTranslatedText(item.question, `${path}.items.${item.id || index}.question`, website, currentContentLanguage)}</h3>
                            <Icon name={openIndex === index ? 'ChevronUp' : 'ChevronDown'} className="w-6 h-6 flex-shrink-0" style={{color: themeColor}}/>
                        </button>
                        {openIndex === index && <p id={`faq-answer-${item.id}`} className={`pb-5 pr-8 ${answerColor} animate-fade-in-down`}>{getTranslatedText(item.answer, `${path}.items.${item.id || index}.answer`, website, currentContentLanguage)}</p>}
                    </div>
                ))}
            </div>
        </SectionWrapper>
    );
};

const CTASectionComponent: React.FC<{ section: CTASection; themeColor: string, websiteTheme: 'light' | 'dark', website: Website; currentContentLanguage: string; path: string; }> = ({ section, themeColor, websiteTheme, website, currentContentLanguage, path }) => {
    const effectiveTheme = section.theme || websiteTheme;
    const isDark = effectiveTheme === 'dark';
    const bgColor = isDark ? 'bg-dark-surface' : 'bg-gray-800'; // Usually a dark, contrasting background
    const titleColor = 'text-white';
    const textColor = 'text-gray-300';
    const buttonTextColor = getTextColorForBackground(themeColor);

    return (
        <SectionWrapper section={section} className={bgColor} themeColor={themeColor} websiteTheme={websiteTheme}>
            <div 
                className={`text-center max-w-4xl mx-auto py-16 px-8 rounded-lg ${section.backgroundImage ? 'bg-cover bg-center relative' : ''}`}
                style={section.backgroundImage ? { backgroundImage: `url(${section.backgroundImage})` } : {}}
            >
                {section.backgroundImage && <div className="absolute inset-0 bg-black bg-opacity-60 rounded-lg" aria-hidden="true"></div>}
                <div className="relative z-10">
                    <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${titleColor}`}>{getTranslatedText(section.title, `${path}.title`, website, currentContentLanguage)}</h2>
                    <p className={`text-lg md:text-xl mb-8 ${textColor}`}>{getTranslatedText(section.text, `${path}.text`, website, currentContentLanguage)}</p>
                    <a href={section.ctaLink || '#'} className={`font-bold py-4 px-10 rounded-md text-lg inline-block transition-transform transform hover:scale-105 shadow-xl ${buttonTextColor}`} style={{ backgroundColor: themeColor }}>
                        {getTranslatedText(section.ctaText, `${path}.ctaText`, website, currentContentLanguage)}
                    </a>
                </div>
            </div>
        </SectionWrapper>
    );
};


const BlogSectionComponent: React.FC<{ section: BlogSection; themeColor: string, websiteTheme: 'light' | 'dark', website: Website; currentContentLanguage: string; path: string; }> = ({ section, themeColor, websiteTheme, website, currentContentLanguage, path }) => {
    const effectiveTheme = section.theme || websiteTheme;
    const isDark = effectiveTheme === 'dark';
    const titleColor = isDark ? 'text-white' : 'text-gray-900';
    const textColor = isDark ? 'text-gray-400' : 'text-gray-600';
    const cardBg = isDark ? 'bg-dark-surface' : 'bg-white';
    const linkColor = themeColor;
    
    return (
        <SectionWrapper section={section} themeColor={themeColor} websiteTheme={websiteTheme}>
            <h2 className={`text-4xl lg:text-5xl font-bold text-center mb-16 ${titleColor}`}>{getTranslatedText(section.title, `${path}.title`, website, currentContentLanguage)}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {section.items.map((item, index) => (
                    <div key={item.id} className={`group rounded-lg overflow-hidden shadow-lg transition-transform transform hover:-translate-y-2 ${cardBg}`}>
                        <img src={item.image} alt={getTranslatedText(item.title, `${path}.items.${item.id || index}.title`, website, currentContentLanguage)} className="w-full h-56 object-cover" />
                        <div className="p-6">
                            <p className={`text-sm ${textColor} mb-2`}>{item.date} &bull; {getTranslatedText(item.author, `${path}.items.${item.id || index}.author`, website, currentContentLanguage)}</p>
                            <h3 className={`text-xl font-semibold mb-3 ${titleColor}`}>{getTranslatedText(item.title, `${path}.items.${item.id || index}.title`, website, currentContentLanguage)}</h3>
                            <p className={`${textColor} mb-4 text-sm`}>{getTranslatedText(item.excerpt, `${path}.items.${item.id || index}.excerpt`, website, currentContentLanguage)}</p>
                            <a href="#" className="font-bold text-sm" style={{ color: linkColor }}>Read More &rarr;</a>
                        </div>
                    </div>
                ))}
            </div>
        </SectionWrapper>
    );
};


const ContactSectionComponent: React.FC<{ section: ContactSection, themeColor: string, websiteTheme: 'light' | 'dark', website: Website; currentContentLanguage: string; path: string; }> = ({ section, themeColor, websiteTheme, website, currentContentLanguage, path }) => {
    const effectiveTheme = section.theme || websiteTheme;
    const isDark = effectiveTheme === 'dark';
    const titleColor = isDark ? 'text-white' : 'text-gray-900';
    const textColor = isDark ? 'text-gray-400' : 'text-gray-600';
    const labelColor = isDark ? 'text-dark-text-secondary' : 'text-gray-600';
    const inputBg = isDark ? 'bg-dark-bg' : 'bg-gray-100';
    const inputBorder = isDark ? 'border-dark-border' : 'border-gray-300';
    const buttonTextColor = getTextColorForBackground(themeColor);

    const contactInfo = (
    <div className={`p-8 rounded-lg shadow-xl ${isDark ? 'bg-dark-surface' : 'bg-white'}`}>
        <h3 className={`text-2xl font-bold mb-6 ${titleColor}`}>Contact Information</h3>
        <div className="space-y-4">
            <div className="flex items-start">
                <Icon name="Geo" className="w-6 h-6 mr-3 flex-shrink-0" style={{color: themeColor}} />
                <p className={textColor}>{getTranslatedText(section.address, `${path}.address`, website, currentContentLanguage)}</p>
            </div>
            <div className="flex items-start">
                <Icon name="DocumentText" className="w-6 h-6 mr-3 flex-shrink-0" style={{color: themeColor}} />
                <p className={textColor}>{section.email}</p>
            </div>
            <div className="flex items-start">
                {/* FIX: Changed ShoppingCart to Support for phone icon */}
                <Icon name="Support" className="w-6 h-6 mr-3 flex-shrink-0" style={{color: themeColor}} />
                <p className={textColor}>{section.phone}</p>
            </div>
        </div>
    </div>
    );

    const contactForm = (
        <div className={`p-8 rounded-lg shadow-xl ${isDark ? 'bg-dark-surface' : 'bg-white'}`}>
            <h3 className={`text-2xl font-bold mb-6 ${titleColor}`}>Send us a Message</h3>
            <form className="space-y-4">
                <div>
                    <label htmlFor="name" className={`block text-sm font-medium mb-1 ${labelColor}`}>Name</label>
                    <input type="text" id="name" name="name" className={`w-full ${inputBg} ${inputBorder} rounded-md px-4 py-2 text-sm ${textColor}`} />
                </div>
                <div>
                    <label htmlFor="email" className={`block text-sm font-medium mb-1 ${labelColor}`}>Email</label>
                    <input type="email" id="email" name="email" className={`w-full ${inputBg} ${inputBorder} rounded-md px-4 py-2 text-sm ${textColor}`} />
                </div>
                <div>
                    <label htmlFor="message" className={`block text-sm font-medium mb-1 ${labelColor}`}>Message</label>
                    <textarea id="message" name="message" rows={4} className={`w-full ${inputBg} ${inputBorder} rounded-md px-4 py-2 text-sm ${textColor}`}></textarea>
                </div>
                <button type="submit" className={`py-3 px-8 rounded-md font-bold text-lg transition ${buttonTextColor}`} style={{backgroundColor: themeColor}}>
                    Send Message
                </button>
            </form>
        </div>
    );

    const layoutClasses = {
        'address-left-form-right': 'grid md:grid-cols-2 gap-12',
        'form-left-address-right': 'grid md:grid-cols-2 gap-12 md:flex-row-reverse',
    };

    return (
        <SectionWrapper section={section} themeColor={themeColor} websiteTheme={websiteTheme}>
            <h2 className={`text-4xl lg:text-5xl font-bold text-center mb-16 ${titleColor}`}>{getTranslatedText(section.title, `${path}.title`, website, currentContentLanguage)}</h2>
            <div className={`${layoutClasses[section.layout || 'address-left-form-right']} max-w-6xl mx-auto`}>
                {section.layout === 'address-left-form-right' ? (
                    <>
                        {contactInfo}
                        {contactForm}
                    </>
                ) : (
                    <>
                        {contactForm}
                        {contactInfo}
                    </>
                )}
            </div>
        </SectionWrapper>
    );
};


const FooterSectionComponent: React.FC<{ section: FooterSection, themeColor: string, websiteTheme: 'light' | 'dark', website: Website; currentContentLanguage: string; path: string; }> = ({ section, themeColor, websiteTheme, website, currentContentLanguage, path }) => {
    const effectiveTheme = section.theme || websiteTheme;
    const isDark = effectiveTheme === 'dark';
    const textColor = isDark ? 'text-gray-400' : 'text-gray-600';
    const linkColor = isDark ? 'text-dark-text-secondary' : 'text-gray-500';

    return (
        <SectionWrapper section={section} themeColor={themeColor} websiteTheme={websiteTheme} className={isDark ? 'bg-dark-bg' : 'bg-gray-100'}>
            <div className="text-center text-sm md:flex md:justify-between md:items-center">
                <p className={`${textColor} md:text-left`}>{getTranslatedText(section.text, `${path}.text`, website, currentContentLanguage)}</p>
                <div className="flex justify-center md:justify-end gap-4 mt-4 md:mt-0">
                    {section.socialLinks?.twitter && <a href={section.socialLinks.twitter} aria-label="Twitter" className={`hover:text-primary transition-colors ${linkColor}`}><Icon name="Twitter" className="w-5 h-5"/></a>}
                    {section.socialLinks?.linkedin && <a href={section.socialLinks.linkedin} aria-label="LinkedIn" className={`hover:text-primary transition-colors ${linkColor}`}><Icon name="Linkedin" className="w-5 h-5"/></a>}
                    {section.socialLinks?.facebook && <a href={section.socialLinks.facebook} aria-label="Facebook" className={`hover:text-primary transition-colors ${linkColor}`}><Icon name="Facebook" className="w-5 h-5"/></a>}
                    {section.socialLinks?.instagram && <a href={section.socialLinks.instagram} aria-label="Instagram" className={`hover:text-primary transition-colors ${linkColor}`}><Icon name="Instagram" className="w-5 h-5"/></a>}
                </div>
            </div>
        </SectionWrapper>
    );
};


export interface WebsiteComponentProps {
    website: Website;
    activePage: Page;
}

const WebsiteComponent: React.FC<WebsiteComponentProps> = ({ website, activePage }) => {
    if (!website || !activePage) {
        return <div className="text-center text-dark-text-secondary p-8">No website or page data available.</div>;
    }

    const { themeColor, theme: websiteTheme, defaultLanguage, contentTranslations } = website;
    const { currentContentLanguage } = useContext(WebsiteContext)!;


    const renderSection = (section: Section, sectionIndex: number) => {
        if (!section.enabled) return null;

        // FIX: Explicitly cast section to BaseSection to resolve 'never' type inference issue for common properties.
        const pathPrefix = `pages.${activePage.id}.sections.${(section as BaseSection).id}`; // Unique path for content extraction/translation

        switch (section.type) {
            case 'Hero':
                return <HeroSectionComponent key={section.id} section={section} themeColor={themeColor} website={website} currentContentLanguage={currentContentLanguage} path={pathPrefix} />;
            case 'About':
                return <AboutSectionComponent key={section.id} section={section} themeColor={themeColor} websiteTheme={websiteTheme} website={website} currentContentLanguage={currentContentLanguage} path={pathPrefix} />;
            case 'Story':
                return <StorySectionComponent key={section.id} section={section} themeColor={themeColor} websiteTheme={websiteTheme} website={website} currentContentLanguage={currentContentLanguage} path={pathPrefix} />;
            case 'Services':
                return <ServicesSectionComponent key={section.id} section={section} themeColor={themeColor} websiteTheme={websiteTheme} website={website} currentContentLanguage={currentContentLanguage} path={pathPrefix} />;
            case 'Products':
                return <ProductsSectionComponent key={section.id} section={section} themeColor={themeColor} websiteTheme={websiteTheme} website={website} currentContentLanguage={currentContentLanguage} path={pathPrefix} />;
            case 'Features':
                return <FeaturesSectionComponent key={section.id} section={section} themeColor={themeColor} websiteTheme={websiteTheme} website={website} currentContentLanguage={currentContentLanguage} path={pathPrefix} />;
            case 'Pricing':
                return <PricingSectionComponent key={section.id} section={section} themeColor={themeColor} websiteTheme={websiteTheme} website={website} currentContentLanguage={currentContentLanguage} path={pathPrefix} />;
            case 'Clients':
                return <ClientsSectionComponent key={section.id} section={section} themeColor={themeColor} websiteTheme={websiteTheme} website={website} currentContentLanguage={currentContentLanguage} path={pathPrefix} />;
            case 'Team':
                return <TeamSectionComponent key={section.id} section={section} themeColor={themeColor} websiteTheme={websiteTheme} website={website} currentContentLanguage={currentContentLanguage} path={pathPrefix} />;
            case 'Gallery':
                return <GallerySectionComponent key={section.id} section={section} themeColor={themeColor} websiteTheme={websiteTheme} website={website} currentContentLanguage={currentContentLanguage} path={pathPrefix} />;
            case 'Testimonials':
                return <TestimonialsSectionComponent key={section.id} section={section} themeColor={themeColor} websiteTheme={websiteTheme} website={website} currentContentLanguage={currentContentLanguage} path={pathPrefix} />;
            case 'FAQ':
                return <FAQSectionComponent key={section.id} section={section} themeColor={themeColor} websiteTheme={websiteTheme} website={website} currentContentLanguage={currentContentLanguage} path={pathPrefix} />;
            case 'CTA':
                return <CTASectionComponent key={section.id} section={section} themeColor={themeColor} websiteTheme={websiteTheme} website={website} currentContentLanguage={currentContentLanguage} path={pathPrefix} />;
            case 'Blog':
                return <BlogSectionComponent key={section.id} section={section} themeColor={themeColor} websiteTheme={websiteTheme} website={website} currentContentLanguage={currentContentLanguage} path={pathPrefix} />;
            case 'Contact':
                return <ContactSectionComponent key={section.id} section={section} themeColor={themeColor} websiteTheme={websiteTheme} website={website} currentContentLanguage={currentContentLanguage} path={pathPrefix} />;
            case 'Footer':
                return <FooterSectionComponent key={section.id} section={section} themeColor={themeColor} websiteTheme={websiteTheme} website={website} currentContentLanguage={currentContentLanguage} path={pathPrefix} />;
            default:
                return <div key={section.id} className="text-center text-red-500 p-8">Unknown section type: {section.type}</div>;
        }
    };

    return (
        <div className={`website-preview min-h-screen ${websiteTheme === 'dark' ? 'dark-theme' : 'light-theme'}`}>
            {activePage.sections.map(renderSection)}
        </div>
    );
};

export default WebsiteComponent;