import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Page } from './types';

// Concrete Icon component using a simple SVG structure with text fallback
export const Icon: React.FC<{ name: string; className?: string }> = ({ name, className }) => (
  // In a real application, you would use an icon library (e.g., Heroicons, Font Awesome)
  // and dynamically render SVG paths based on the 'name' prop.
  // For this context, we provide a basic SVG with the icon name as text.
  <svg 
    className={className} 
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24" 
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    {/* Display icon name as text for visual representation */}
    <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize="8" fill="currentColor">{name}</text>
  </svg>
);


// Dummy ICONS map based on usage in SectionFormRenderer
export const ICONS: Record<string, string> = {
  Briefcase: 'Briefcase',
  Chart: 'Chart',
  Megaphone: 'Megaphone',
  Code: 'Code',
  Design: 'Design',
  Support: 'Support',
  Photograph: 'Photograph',
  ShoppingCart: 'ShoppingCart',
  UserGroup: 'UserGroup',
  Shield: 'Shield',
  Geo: 'Geo',
  DocumentText: 'DocumentText',
  Twitter: 'Twitter',
  Linkedin: 'Linkedin',
  Facebook: 'Facebook',
  Instagram: 'Instagram',
  Plus: 'Plus',
  Trash: 'Trash',
  Wand: 'Wand',
  Close: 'Close',
  Send: 'Send',
  Message: 'Message',
  Mic: 'Mic',
  MicOff: 'MicOff',
  ArrowDown: 'ArrowDown', // Added as it's used elsewhere
};


// Dummy Logo component
export const Logo: React.FC<{ className?: string }> = ({ className }) => (
  <span className={className}>GoOnline</span>
);

// Placeholder for generateId from SectionFormRenderer, also exists in constants.
export const generateId = (prefix: string = 'id') => `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;


// Dummy INDUSTRY_TEMPLATES based on usage in LandingPage and DashboardPage
export const INDUSTRY_TEMPLATES: Record<string, any> = {
  'Design Agency': {
    defaultThemeColor: '#6f42c1',
    template: (theme: 'light' | 'dark', companyName: Record<string, string>, defaultLang: string, t: (key: string, variables?: Record<string, string | number>) => string): Page[] => {
      return [{
        id: generateId('page'),
        name: { [defaultLang]: t('home') },
        sections: [{
          id: generateId('hero'),
          type: 'Hero',
          enabled: true,
          headline: { [defaultLang]: t('welcomeHeadline', { companyName: companyName[defaultLang] || 'Your Company' }) },
          subheadline: { [defaultLang]: t('heroSubheadline') },
          ctaText: { [defaultLang]: t('learnMore') },
          backgroundImage: 'https://picsum.photos/seed/design-agency-hero/1920/1080',
          layout: 'centered',
        }]
      }];
    },
  },
  'Charity': {
    defaultThemeColor: '#28a745',
    template: (theme: 'light' | 'dark', companyName: Record<string, string>, defaultLang: string, t: (key: string, variables?: Record<string, string | number>) => string): Page[] => {
      return [{
        id: generateId('page'),
        name: { [defaultLang]: t('home') },
        sections: [{
          id: generateId('hero'),
          type: 'Hero',
          enabled: true,
          headline: { [defaultLang]: t('welcomeHeadline', { companyName: companyName[defaultLang] || 'Your Company' }) },
          subheadline: { [defaultLang]: t('charityHeroSubheadline') },
          ctaText: { [defaultLang]: t('donateNow') },
          backgroundImage: 'https://picsum.photos/seed/charity-hero/1920/1080',
          layout: 'centered',
        }]
      }];
    },
  },
  'Hotel': {
    defaultThemeColor: '#fd7e14',
    template: (theme: 'light' | 'dark', companyName: Record<string, string>, defaultLang: string, t: (key: string, variables?: Record<string, string | number>) => string): Page[] => {
      return [{
        id: generateId('page'),
        name: { [defaultLang]: t('home') },
        sections: [{
          id: generateId('hero'),
          type: 'Hero',
          enabled: true,
          headline: { [defaultLang]: t('welcomeHeadline', { companyName: companyName[defaultLang] || 'Your Company' }) },
          subheadline: { [defaultLang]: t('hotelHeroSubheadline') },
          ctaText: { [defaultLang]: t('bookNow') },
          backgroundImage: 'https://picsum.photos/seed/hotel-hero/1920/1080',
          layout: 'centered',
        }]
      }];
    },
  },
  'Business Services': { // Default fallback template
    defaultThemeColor: '#007bff',
    template: (theme: 'light' | 'dark', companyName: Record<string, string>, defaultLang: string, t: (key: string, variables?: Record<string, string | number>) => string): Page[] => {
      return [{
        id: generateId('page'),
        name: { [defaultLang]: t('home') },
        sections: [{
          id: generateId('hero'),
          type: 'Hero',
          enabled: true,
          headline: { [defaultLang]: t('welcomeHeadline', { companyName: companyName[defaultLang] || 'Your Company' }) },
          subheadline: { [defaultLang]: t('businessHeroSubheadline') },
          ctaText: { [defaultLang]: t('getAQuote') },
          backgroundImage: 'https://picsum.photos/seed/business-hero/1920/1080',
          layout: 'left-aligned',
        }]
      }];
    },
  },
  'Portfolio': {
    defaultThemeColor: '#6c757d',
    template: (theme: 'light' | 'dark', companyName: Record<string, string>, defaultLang: string, t: (key: string, variables?: Record<string, string | number>) => string): Page[] => {
      return [{
        id: generateId('page'),
        name: { [defaultLang]: t('home') },
        sections: [{
          id: generateId('hero'),
          type: 'Hero',
          enabled: true,
          headline: { [defaultLang]: t('welcomeHeadline', { companyName: companyName[defaultLang] || 'Your Company' }) },
          subheadline: { [defaultLang]: t('portfolioHeroSubheadline') },
          ctaText: { [defaultLang]: t('viewMyWork') },
          backgroundImage: 'https://picsum.photos/seed/portfolio-hero/1920/1080',
          layout: 'centered',
        }]
      }];
    },
  },
  'Interior Designer': {
    defaultThemeColor: '#d63384',
    template: (theme: 'light' | 'dark', companyName: Record<string, string>, defaultLang: string, t: (key: string, variables?: Record<string, string | number>) => string): Page[] => {
      return [{
        id: generateId('page'),
        name: { [defaultLang]: t('home') },
        sections: [{
          id: generateId('hero'),
          type: 'Hero',
          enabled: true,
          headline: { [defaultLang]: t('welcomeHeadline', { companyName: companyName[defaultLang] || 'Your Company' }) },
          subheadline: { [defaultLang]: t('interiorDesignerHeroSubheadline') },
          ctaText: { [defaultLang]: t('exploreDesigns') },
          backgroundImage: 'https://picsum.photos/seed/interior-designer-hero/1920/1080',
          layout: 'left-aligned',
        }]
      }];
    },
  },
  'Online Store': {
    defaultThemeColor: '#198754',
    template: (theme: 'light' | 'dark', companyName: Record<string, string>, defaultLang: string, t: (key: string, variables?: Record<string, string | number>) => string): Page[] => {
      return [{
        id: generateId('page'),
        name: { [defaultLang]: t('home') },
        sections: [{
          id: generateId('hero'),
          type: 'Hero',
          enabled: true,
          headline: { [defaultLang]: t('welcomeHeadline', { companyName: companyName[defaultLang] || 'Your Company' }) },
          subheadline: { [defaultLang]: t('onlineStoreHeroSubheadline') },
          ctaText: { [defaultLang]: t('shopNow') },
          backgroundImage: 'https://picsum.photos/seed/online-store-hero/1920/1080',
          layout: 'centered',
        }]
      }];
    },
  },
  'Fashion': {
    defaultThemeColor: '#dc3545',
    template: (theme: 'light' | 'dark', companyName: Record<string, string>, defaultLang: string, t: (key: string, variables?: Record<string, string | number>) => string): Page[] => {
      return [{
        id: generateId('page'),
        name: { [defaultLang]: t('home') },
        sections: [{
          id: generateId('hero'),
          type: 'Hero',
          enabled: true,
          headline: { [defaultLang]: t('welcomeHeadline', { companyName: companyName[defaultLang] || 'Your Company' }) },
          subheadline: { [defaultLang]: t('fashionHeroSubheadline') },
          ctaText: { [defaultLang]: t('discoverCollection') },
          backgroundImage: 'https://picsum.photos/seed/fashion-hero/1920/1080',
          layout: 'centered',
        }]
      }];
    },
  },
  'Furniture': {
    defaultThemeColor: '#0d6efd',
    template: (theme: 'light' | 'dark', companyName: Record<string, string>, defaultLang: string, t: (key: string, variables?: Record<string, string | number>) => string): Page[] => {
      return [{
        id: generateId('page'),
        name: { [defaultLang]: t('home') },
        sections: [{
          id: generateId('hero'),
          type: 'Hero',
          enabled: true,
          headline: { [defaultLang]: t('welcomeHeadline', { companyName: companyName[defaultLang] || 'Your Company' }) },
          subheadline: { [defaultLang]: t('furnitureHeroSubheadline') },
          ctaText: { [defaultLang]: t('browseFurniture') },
          backgroundImage: 'https://picsum.photos/seed/furniture-hero/1920/1080',
          layout: 'left-aligned',
        }]
      }];
    },
  },
  'Real Estate': {
    defaultThemeColor: '#6f42c1',
    template: (theme: 'light' | 'dark', companyName: Record<string, string>, defaultLang: string, t: (key: string, variables?: Record<string, string | number>) => string): Page[] => {
      return [{
        id: generateId('page'),
        name: { [defaultLang]: t('home') },
        sections: [{
          id: generateId('hero'),
          type: 'Hero',
          enabled: true,
          headline: { [defaultLang]: t('welcomeHeadline', { companyName: companyName[defaultLang] || 'Your Company' }) },
          subheadline: { [defaultLang]: t('realEstateHeroSubheadline') },
          ctaText: { [defaultLang]: t('findYourDreamHome') },
          backgroundImage: 'https://picsum.photos/seed/real-estate-hero/1920/1080',
          layout: 'centered',
        }]
      }];
    },
  },
  'Construction': {
    defaultThemeColor: '#0dcaf0',
    template: (theme: 'light' | 'dark', companyName: Record<string, string>, defaultLang: string, t: (key: string, variables?: Record<string, string | number>) => string): Page[] => {
      return [{
        id: generateId('page'),
        name: { [defaultLang]: t('home') },
        sections: [{
          id: generateId('hero'),
          type: 'Hero',
          enabled: true,
          headline: { [defaultLang]: t('welcomeHeadline', { companyName: companyName[defaultLang] || 'Your Company' }) },
          subheadline: { [defaultLang]: t('constructionHeroSubheadline') },
          ctaText: { [defaultLang]: t('viewProjects') },
          backgroundImage: 'https://picsum.photos/seed/construction-hero/1920/1080',
          layout: 'left-aligned',
        }]
      }];
    },
  },
  'Marketing': {
    defaultThemeColor: '#6610f2',
    template: (theme: 'light' | 'dark', companyName: Record<string, string>, defaultLang: string, t: (key: string, variables?: Record<string, string | number>) => string): Page[] => {
      return [{
        id: generateId('page'),
        name: { [defaultLang]: t('home') },
        sections: [{
          id: generateId('hero'),
          type: 'Hero',
          enabled: true,
          headline: { [defaultLang]: t('welcomeHeadline', { companyName: companyName[defaultLang] || 'Your Company' }) },
          subheadline: { [defaultLang]: t('marketingHeroSubheadline') },
          ctaText: { [defaultLang]: t('boostYourBusiness') },
          backgroundImage: 'https://picsum.photos/seed/marketing-hero/1920/1080',
          layout: 'centered',
        }]
      }];
    },
  },
  'Designer': {
    defaultThemeColor: '#fd7e14',
    template: (theme: 'light' | 'dark', companyName: Record<string, string>, defaultLang: string, t: (key: string, variables?: Record<string, string | number>) => string): Page[] => {
      return [{
        id: generateId('page'),
        name: { [defaultLang]: t('home') },
        sections: [{
          id: generateId('hero'),
          type: 'Hero',
          enabled: true,
          headline: { [defaultLang]: t('welcomeHeadline', { companyName: companyName[defaultLang] || 'Your Company' }) },
          subheadline: { [defaultLang]: t('designerHeroSubheadline') },
          ctaText: { [defaultLang]: t('viewPortfolio') },
          backgroundImage: 'https://picsum.photos/seed/designer-hero/1920/1080',
          layout: 'centered',
        }]
      }];
    },
  },
  'Photographer': {
    defaultThemeColor: '#e83e8c',
    template: (theme: 'light' | 'dark', companyName: Record<string, string>, defaultLang: string, t: (key: string, variables?: Record<string, string | number>) => string): Page[] => {
      return [{
        id: generateId('page'),
        name: { [defaultLang]: t('home') },
        sections: [{
          id: generateId('hero'),
          type: 'Hero',
          enabled: true,
          headline: { [defaultLang]: t('welcomeHeadline', { companyName: companyName[defaultLang] || 'Your Company' }) },
          subheadline: { [defaultLang]: t('photographerHeroSubheadline') },
          ctaText: { [defaultLang]: t('viewGallery') },
          backgroundImage: 'https://picsum.photos/seed/photographer-hero/1920/1080',
          layout: 'centered',
        }]
      }];
    },
  },
  'Restaurant': {
    defaultThemeColor: '#ffc107',
    template: (theme: 'light' | 'dark', companyName: Record<string, string>, defaultLang: string, t: (key: string, variables?: Record<string, string | number>) => string): Page[] => {
      return [{
        id: generateId('page'),
        name: { [defaultLang]: t('home') },
        sections: [{
          id: generateId('hero'),
          type: 'Hero',
          enabled: true,
          headline: { [defaultLang]: t('welcomeHeadline', { companyName: companyName[defaultLang] || 'Your Company' }) },
          subheadline: { [defaultLang]: t('restaurantHeroSubheadline') },
          ctaText: { [defaultLang]: t('viewMenu') },
          backgroundImage: 'https://picsum.photos/seed/restaurant-hero/1920/1080',
          layout: 'centered',
        }]
      }];
    },
  },
  'Store': {
    defaultThemeColor: '#20c997',
    template: (theme: 'light' | 'dark', companyName: Record<string, string>, defaultLang: string, t: (key: string, variables?: Record<string, string | number>) => string): Page[] => {
      return [{
        id: generateId('page'),
        name: { [defaultLang]: t('home') },
        sections: [{
          id: generateId('hero'),
          type: 'Hero',
          enabled: true,
          headline: { [defaultLang]: t('welcomeHeadline', { companyName: companyName[defaultLang] || 'Your Company' }) },
          subheadline: { [defaultLang]: t('storeHeroSubheadline') },
          ctaText: { [defaultLang]: t('shopNow') },
          backgroundImage: 'https://picsum.photos/seed/store-hero/1920/1080',
          layout: 'centered',
        }]
      }];
    },
  },
  'Logistics': {
    defaultThemeColor: '#6f42c1',
    template: (theme: 'light' | 'dark', companyName: Record<string, string>, defaultLang: string, t: (key: string, variables?: Record<string, string | number>) => string): Page[] => {
      return [{
        id: generateId('page'),
        name: { [defaultLang]: t('home') },
        sections: [{
          id: generateId('hero'),
          type: 'Hero',
          enabled: true,
          headline: { [defaultLang]: t('welcomeHeadline', { companyName: companyName[defaultLang] || 'Your Company' }) },
          subheadline: { [defaultLang]: t('logisticsHeroSubheadline') },
          ctaText: { [defaultLang]: t('getAQuote') },
          backgroundImage: 'https://picsum.photos/seed/logistics-hero/1920/1080',
          layout: 'left-aligned',
        }]
      }];
    },
  },
  'Lawyer': {
    defaultThemeColor: '#007bff',
    template: (theme: 'light' | 'dark', companyName: Record<string, string>, defaultLang: string, t: (key: string, variables?: Record<string, string | number>) => string): Page[] => {
      return [{
        id: generateId('page'),
        name: { [defaultLang]: t('home') },
        sections: [{
          id: generateId('hero'),
          type: 'Hero',
          enabled: true,
          headline: { [defaultLang]: t('welcomeHeadline', { companyName: companyName[defaultLang] || 'Your Company' }) },
          subheadline: { [defaultLang]: t('lawyerHeroSubheadline') },
          ctaText: { [defaultLang]: t('contactUs') },
          backgroundImage: 'https://picsum.photos/seed/lawyer-hero/1920/1080',
          layout: 'left-aligned',
        }]
      }];
    },
  },
  'Medical': {
    defaultThemeColor: '#28a745',
    template: (theme: 'light' | 'dark', companyName: Record<string, string>, defaultLang: string, t: (key: string, variables?: Record<string, string | number>) => string): Page[] => {
      return [{
        id: generateId('page'),
        name: { [defaultLang]: t('home') },
        sections: [{
          id: generateId('hero'),
          type: 'Hero',
          enabled: true,
          headline: { [defaultLang]: t('welcomeHeadline', { companyName: companyName[defaultLang] || 'Your Company' }) },
          subheadline: { [defaultLang]: t('medicalHeroSubheadline') },
          ctaText: { [defaultLang]: t('bookAppointment') },
          backgroundImage: 'https://picsum.photos/seed/medical-hero/1920/1080',
          layout: 'centered',
        }]
      }];
    },
  },
  'Technology': {
    defaultThemeColor: '#0d6efd',
    template: (theme: 'light' | 'dark', companyName: Record<string, string>, defaultLang: string, t: (key: string, variables?: Record<string, string | number>) => string): Page[] => {
      return [{
        id: generateId('page'),
        name: { [defaultLang]: t('home') },
        sections: [{
          id: generateId('hero'),
          type: 'Hero',
          enabled: true,
          headline: { [defaultLang]: t('welcomeHeadline', { companyName: companyName[defaultLang] || 'Your Company' }) },
          subheadline: { [defaultLang]: t('technologyHeroSubheadline') },
          ctaText: { [defaultLang]: t('learnMore') },
          backgroundImage: 'https://picsum.photos/seed/technology-hero/1920/1080',
          layout: 'left-aligned',
        }]
      }];
    },
  },
  'Blog': {
    defaultThemeColor: '#6c757d',
    template: (theme: 'light' | 'dark', companyName: Record<string, string>, defaultLang: string, t: (key: string, variables?: Record<string, string | number>) => string): Page[] => {
      return [{
        id: generateId('page'),
        name: { [defaultLang]: t('home') },
        sections: [{
          id: generateId('hero'),
          type: 'Hero',
          enabled: true,
          headline: { [defaultLang]: t('welcomeHeadline', { companyName: companyName[defaultLang] || 'Your Company' }) },
          subheadline: { [defaultLang]: t('blogHeroSubheadline') },
          ctaText: { [defaultLang]: t('readOurBlog') },
          backgroundImage: 'https://picsum.photos/seed/blog-hero/1920/1080',
          layout: 'centered',
        }]
      }];
    },
  },
  'Events': {
    defaultThemeColor: '#d63384',
    template: (theme: 'light' | 'dark', companyName: Record<string, string>, defaultLang: string, t: (key: string, variables?: Record<string, string | number>) => string): Page[] => {
      return [{
        id: generateId('page'),
        name: { [defaultLang]: t('home') },
        sections: [{
          id: generateId('hero'),
          type: 'Hero',
          enabled: true,
          headline: { [defaultLang]: t('welcomeHeadline', { companyName: companyName[defaultLang] || 'Your Company' }) },
          subheadline: { [defaultLang]: t('eventsHeroSubheadline') },
          ctaText: { [defaultLang]: t('viewEvents') },
          backgroundImage: 'https://picsum.photos/seed/events-hero/1920/1080',
          layout: 'centered',
        }]
      }];
    },
  },
  'Child Care': {
    defaultThemeColor: '#20c997',
    template: (theme: 'light' | 'dark', companyName: Record<string, string>, defaultLang: string, t: (key: string, variables?: Record<string, string | number>) => string): Page[] => {
      return [{
        id: generateId('page'),
        name: { [defaultLang]: t('home') },
        sections: [{
          id: generateId('hero'),
          type: 'Hero',
          enabled: true,
          headline: { [defaultLang]: t('welcomeHeadline', { companyName: companyName[defaultLang] || 'Your Company' }) },
          subheadline: { [defaultLang]: t('childCareHeroSubheadline') },
          ctaText: { [defaultLang]: t('learnMore') },
          backgroundImage: 'https://picsum.photos/seed/child-care-hero/1920/1080',
          layout: 'centered',
        }]
      }];
    },
  },
  'Industrial': {
    defaultThemeColor: '#0dcaf0',
    template: (theme: 'light' | 'dark', companyName: Record<string, string>, defaultLang: string, t: (key: string, variables?: Record<string, string | number>) => string): Page[] => {
      return [{
        id: generateId('page'),
        name: { [defaultLang]: t('home') },
        sections: [{
          id: generateId('hero'),
          type: 'Hero',
          enabled: true,
          headline: { [defaultLang]: t('welcomeHeadline', { companyName: companyName[defaultLang] || 'Your Company' }) },
          subheadline: { [defaultLang]: t('industrialHeroSubheadline') },
          ctaText: { [defaultLang]: t('viewServices') },
          backgroundImage: 'https://picsum.photos/seed/industrial-hero/1920/1080',
          layout: 'left-aligned',
        }]
      }];
    },
  },
  'Security': {
    defaultThemeColor: '#000000', // Black theme for security
    template: (theme: 'light' | 'dark', companyName: Record<string, string>, defaultLang: string, t: (key: string, variables?: Record<string, string | number>) => string): Page[] => {
      return [{
        id: generateId('page'),
        name: { [defaultLang]: t('home') },
        sections: [{
          id: generateId('hero'),
          type: 'Hero',
          enabled: true,
          headline: { [defaultLang]: t('welcomeHeadline', { companyName: companyName[defaultLang] || 'Your Company' }) },
          subheadline: { [defaultLang]: t('securityHeroSubheadline') },
          ctaText: { [defaultLang]: t('getAQuote') },
          backgroundImage: 'https://picsum.photos/seed/security-hero/1920/1080',
          layout: 'centered',
        }]
      }];
    },
  },
};


// Dummy INDUSTRIES list based on usage
export const INDUSTRIES = [
  'Design Agency', 'Charity', 'Hotel', 'Business Services', 'Portfolio', 'Interior Designer', 'Online Store',
  'Fashion', 'Furniture', 'Real Estate', 'Construction', 'Marketing',
  'Designer', 'Photographer', 'Restaurant', 'Store', 'Logistics',
  'Lawyer', 'Medical', 'Technology', 'Blog', 'Events', 'Child Care', 'Industrial', 'Security'
];

// Dummy LANGUAGES
export const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'ar', name: 'العربية' },
];

// Dummy resetImageIndexMap (it's imported and used but its logic is in imageTemplates.ts)
// The function signature implies it doesn't need to be defined here, just imported.
// But for type safety, I'll add a dummy.
export const resetImageIndexMap = () => { /* no-op */ };


// Dummy LanguageContext and useLanguage hook based on usage
interface LanguageContextType {
  t: (key: string, variables?: Record<string, string | number>) => string;
  currentUILanguage: string;
  setUILanguage: (lang: string) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUILanguage, setUILanguage] = useState('en');

  const t = (key: string, variables?: Record<string, string | number>) => {
    // Simple mock translation for now
    let translated = key; // Default to key if no translation
    // Example translations
    const translations: Record<string, Record<string, string>> = {
      en: {
        'home': 'Home',
        'aboutUs': 'About Us',
        'contactUs': 'Contact Us',
        'products': 'Products',
        'menu': 'Menu',
        'gallery': 'Gallery',
        'portfolio': 'Portfolio',
        'pricing': 'Pricing',
        'blog': 'Blog',
        'welcomeHeadline': 'Welcome to {companyName}',
        'heroSubheadline': 'We build amazing websites.',
        'charityHeroSubheadline': 'Making a difference together.',
        'hotelHeroSubheadline': 'Your perfect getaway awaits.',
        'businessHeroSubheadline': 'Solutions for your growing business.',
        'portfolioHeroSubheadline': 'Showcasing creative excellence.',
        'interiorDesignerHeroSubheadline': 'Crafting beautiful living spaces.',
        'onlineStoreHeroSubheadline': 'Shop the latest trends now.',
        'fashionHeroSubheadline': 'Elegance in every stitch.',
        'furnitureHeroSubheadline': 'Quality furniture for every home.',
        'realEstateHeroSubheadline': 'Find your next property.',
        'constructionHeroSubheadline': 'Building the future, together.',
        'marketingHeroSubheadline': 'Grow your brand with us.',
        'designerHeroSubheadline': 'Innovative designs, stunning results.',
        'photographerHeroSubheadline': 'Capturing moments, creating memories.',
        'restaurantHeroSubheadline': 'Experience culinary delight.',
        'storeHeroSubheadline': 'Your one-stop shop for everything.',
        'logisticsHeroSubheadline': 'Reliable shipping, every time.',
        'lawyerHeroSubheadline': 'Expert legal advice you can trust.',
        'medicalHeroSubheadline': 'Your health is our priority.',
        'technologyHeroSubheadline': 'Innovating for a better tomorrow.',
        'blogHeroSubheadline': 'Insights and updates from our experts.',
        'eventsHeroSubheadline': 'Connecting people, creating experiences.',
        'childCareHeroSubheadline': 'Nurturing bright futures.',
        'industrialHeroSubheadline': 'Powering industries with precision.',
        'securityHeroSubheadline': 'Protecting what matters most.',
        'learnMore': 'Learn More',
        'viewPortfolio': 'View Portfolio',
        'donateNow': 'Donate Now',
        'bookNow': 'Book Now',
        'getAQuote': 'Get A Quote',
        'exploreDesigns': 'Explore Designs',
        'shopNow': 'Shop Now',
        'discoverCollection': 'Discover Collection',
        'browseFurniture': 'Browse Furniture',
        'findYourDreamHome': 'Find Your Dream Home',
        'viewProjects': 'View Projects',
        'boostYourBusiness': 'Boost Your Business',
        'viewMyWork': 'View My Work',
        'viewGallery': 'View Gallery',
        'viewMenu': 'View Menu',
        'viewServices': 'View Services',
        'readOurBlog': 'Read Our Blog',
        'viewEvents': 'View Events',
        'bookAppointment': 'Book Appointment',
        'allRightsReserved': 'All Rights Reserved',
        'myWebsites': 'My Websites',
        'buildStunningWebsite': 'Build a stunning website',
        'inMinutes': 'in minutes',
        'effortlesslyCreate': 'Effortlessly create and customize your professional website with AI.',
        'getStartedForFree': 'Get Started for Free',
        'fourteenDayFreeTrial': '14 days free trial, no credit card required.',
        'uiLanguage': 'UI Language',
        'logout': 'Logout',
        'yourWebsites': 'Your Websites',
        'createNewWebsite': 'Create New Website',
        'noWebsitesYet': 'No websites created yet.',
        'clickButtonCreateFirst': 'Click the button above to create your first website!',
        'editSite': 'Edit Site',
        'createWebsite': 'Create Website',
        'provideDetails': 'Provide a few details or upload a brochure to get started.',
        'errorCompanyNameIndustryRequired': 'Company Name and Industry are required.',
        'generatingFromBrochure': 'Generating website from brochure...',
        'generatingFromDescription': 'Generating website from description...',
        'generatingWithAI': 'Generating website with AI...',
        'craftingFromTemplate': 'Crafting website from template...',
        'errorWebsiteGenerationFailed': 'Website generation failed',
        'companyName': 'Company Name',
        'selectIndustry': 'Select Industry',
        'describeWebsiteAI': 'Describe your website for AI generation (optional)',
        'aiPromptPlaceholder': 'e.g., A modern website for a tech startup that sells AI-powered analytics tools. Emphasize innovation and data security.',
        'uploadBrochureOptional': 'Upload a brochure or image (optional, for AI generation)',
        'uploadFile': 'Upload a file',
        'dragAndDrop': 'or drag and drop',
        'imageSelected': 'Image selected.',
        'imageFormats': 'PNG, JPG, GIF up to 5MB',
        'chooseTheme': 'Choose Theme',
        'light': 'Light',
        'dark': 'Dark',
        'defaultContentLanguage': 'Default Content Language',
        'generateWithAI': 'Generate with AI',
        'startWithTemplate': 'Start with Template',
        'closeModal': 'Close Modal',
        'serviceName': 'Service Name',
        'briefDescription': 'Brief description of the service.',
        'newProduct': 'New Product',
        'productDetails': 'Details about this product.',
        'newFeature': 'New Feature',
        'featureDetails': 'Details about this feature.',
        'newPlan': 'New Plan',
        'month': 'month',
        'feature1': 'Feature 1',
        'newClient': 'New Client',
        'newMember': 'New Member',
        'jobTitle': 'Job Title',
        'newImage': 'New Image',
        'default': 'Default',
        'glowingReview': 'This is a glowing review about our product/service.',
        'customer': 'Customer Name',
        'role': 'Customer Role',
        'newQuestion': 'New Question',
        'answerToNewQuestion': 'Answer to the new question.',
        'newBlogPost': 'New Blog Post',
        'briefSummary': 'Brief summary of the blog post content.',
        'author': 'Author',
        'newEvent': 'New Event',
        'welcomeBack': 'Welcome Back',
        'signInManageWebsites': 'Sign in to manage your websites.',
        'createAccountGetStarted': 'Create an account to get started.',
        'signInGoogle': 'Sign in with Google',
        'or': 'OR',
        'emailAddress': 'Email Address',
        'password': 'Password',
        'loading': 'Loading...',
        'login': 'Login',
        'createAccount': 'Create Account',
        'dontHaveAccount': "Don't have an account?",
        'alreadyHaveAccount': "Already have an account?",
        'signUp': 'Sign Up',
        'pages': 'Pages',
        'sections': 'Sections',
        'exit': 'Exit',
        'save': 'Save',
        'saving': 'Saving...',
        'saved': 'Saved!',
        'saveError': 'Save Error',
        'loginToSave': 'Login to Save',
        'editSection': 'Edit Section',
        'selectSectionToEdit': 'Select a section from the left to edit its content and properties.',
      },
      es: {
        'home': 'Inicio',
        'aboutUs': 'Nosotros',
        'contactUs': 'Contacto',
        'products': 'Productos',
        'menu': 'Menú',
        'gallery': 'Galería',
        'portfolio': 'Portafolio',
        'pricing': 'Precios',
        'blog': 'Blog',
        'welcomeHeadline': 'Bienvenido a {companyName}',
        'heroSubheadline': 'Creamos sitios web increíbles.',
        'charityHeroSubheadline': 'Haciendo una diferencia juntos.',
        'hotelHeroSubheadline': 'Su escapada perfecta le espera.',
        'businessHeroSubheadline': 'Soluciones para su negocio en crecimiento.',
        'portfolioHeroSubheadline': 'Mostrando excelencia creativa.',
        'interiorDesignerHeroSubheadline': 'Creando hermosos espacios habitables.',
        'onlineStoreHeroSubheadline': 'Compre las últimas tendencias ahora.',
        'fashionHeroSubheadline': 'Elegancia en cada puntada.',
        'furnitureHeroSubheadline': 'Muebles de calidad para cada hogar.',
        'realEstateHeroSubheadline': 'Encuentre su próxima propiedad.',
        'constructionHeroSubheadline': 'Construyendo el futuro, juntos.',
        'marketingHeroSubheadline': 'Haga crecer su marca con nosotros.',
        'designerHeroSubheadline': 'Diseños innovadores, resultados impresionantes.',
        'photographerHeroSubheadline': 'Capturando momentos, creando recuerdos.',
        'restaurantHeroSubheadline': 'Experimente el deleite culinario.',
        'storeHeroSubheadline': 'Su tienda única para todo.',
        'logisticsHeroSubheadline': 'Envío confiable, siempre.',
        'lawyerHeroSubheadline': 'Asesoramiento legal experto en el que puede confiar.',
        'medicalHeroSubheadline': 'Su salud es nuestra prioridad.',
        'technologyHeroSubheadline': 'Innovando para un mañana mejor.',
        'blogHeroSubheadline': 'Perspectivas y actualizaciones de nuestros expertos.',
        'eventsHeroSubheadline': 'Conectando personas, creando experiencias.',
        'childCareHeroSubheadline': 'Nutriendo futuros brillantes.',
        'industrialHeroSubheadline': 'Impulsando industrias con precisión.',
        'securityHeroSubheadline': 'Protegiendo lo que más importa.',
        'learnMore': 'Saber más',
        'viewPortfolio': 'Ver Portafolio',
        'donateNow': 'Donar Ahora',
        'bookNow': 'Reservar Ahora',
        'getAQuote': 'Obtener Presupuesto',
        'exploreDesigns': 'Explorar Diseños',
        'shopNow': 'Comprar Ahora',
        'discoverCollection': 'Descubrir Colección',
        'browseFurniture': 'Explorar Muebles',
        'findYourDreamHome': 'Encuentre la Casa de Sus Sueños',
        'viewProjects': 'Ver Proyectos',
        'boostYourBusiness': 'Impulse Su Negocio',
        'viewMyWork': 'Ver Mi Trabajo',
        'viewGallery': 'Ver Galería',
        'viewMenu': 'Ver Menú',
        'viewServices': 'Ver Servicios',
        'readOurBlog': 'Leer Nuestro Blog',
        'viewEvents': 'Ver Eventos',
        'bookAppointment': 'Reservar Cita',
        'allRightsReserved': 'Todos los derechos reservados',
        'myWebsites': 'Mis Sitios Web',
        'buildStunningWebsite': 'Crea un sitio web increíble',
        'inMinutes': 'en minutos',
        'effortlesslyCreate': 'Crea y personaliza sin esfuerzo tu sitio web profesional con IA.',
        'getStartedForFree': 'Empieza gratis',
        'fourteenDayFreeTrial': '14 días de prueba gratuita, no se requiere tarjeta de crédito.',
        'uiLanguage': 'Idioma de UI',
        'logout': 'Cerrar sesión',
        'yourWebsites': 'Tus Sitios Web',
        'createNewWebsite': 'Crear Nuevo Sitio Web',
        'noWebsitesYet': 'Aún no tienes sitios web.',
        'clickButtonCreateFirst': '¡Haz clic en el botón de arriba para crear tu primer sitio web!',
        'editSite': 'Editar Sitio',
        'createWebsite': 'Crear Sitio Web',
        'provideDetails': 'Proporciona algunos detalles o sube un folleto para empezar.',
        'errorCompanyNameIndustryRequired': 'El nombre de la empresa y la industria son obligatorios.',
        'generatingFromBrochure': 'Generando sitio web desde el folleto...',
        'generatingFromDescription': 'Generando sitio web desde la descripción...',
        'generatingWithAI': 'Generando sitio web con IA...',
        'craftingFromTemplate': 'Creando sitio web desde la plantilla...',
        'errorWebsiteGenerationFailed': 'Fallo al generar el sitio web',
        'companyName': 'Nombre de la empresa',
        'selectIndustry': 'Seleccionar industria',
        'describeWebsiteAI': 'Describe tu sitio web para la generación con IA (opcional)',
        'aiPromptPlaceholder': 'ej., Un sitio web moderno para una startup de tecnología que vende herramientas de análisis impulsadas por IA. Enfatiza la innovación y la seguridad de los datos.',
        'uploadBrochureOptional': 'Sube un folleto o imagen (opcional, para generación con IA)',
        'uploadFile': 'Subir archivo',
        'dragAndDrop': 'o arrastra y suelta',
        'imageSelected': 'Imagen seleccionada.',
        'imageFormats': 'PNG, JPG, GIF de hasta 5MB',
        'chooseTheme': 'Elegir Tema',
        'light': 'Claro',
        'dark': 'Oscuro',
        'defaultContentLanguage': 'Idioma de Contenido Predeterminado',
        'generateWithAI': 'Generar con IA',
        'startWithTemplate': 'Empezar con Plantilla',
        'closeModal': 'Cerrar Modal',
        'serviceName': 'Nombre del Servicio',
        'briefDescription': 'Breve descripción del servicio.',
        'newProduct': 'Nuevo Producto',
        'productDetails': 'Detalles sobre este producto.',
        'newFeature': 'Nueva Característica',
        'featureDetails': 'Detalles sobre esta característica.',
        'newPlan': 'Nuevo Plan',
        'month': 'mes',
        'feature1': 'Característica 1',
        'newClient': 'Nuevo Cliente',
        'newMember': 'Nuevo Miembro',
        'jobTitle': 'Cargo',
        'newImage': 'Nueva Imagen',
        'default': 'Predeterminado',
        'glowingReview': 'Esta es una excelente reseña sobre nuestro producto/servicio.',
        'customer': 'Nombre del Cliente',
        'role': 'Cargo del Cliente',
        'newQuestion': 'Nueva Pregunta',
        'answerToNewQuestion': 'Respuesta a la nueva pregunta.',
        'newBlogPost': 'Nueva Publicación de Blog',
        'briefSummary': 'Breve resumen del contenido de la publicación del blog.',
        'author': 'Autor',
        'newEvent': 'Nuevo Evento',
        'welcomeBack': 'Bienvenido de nuevo',
        'signInManageWebsites': 'Inicia sesión para gestionar tus sitios web.',
        'createAccountGetStarted': 'Crea una cuenta para empezar.',
        'signInGoogle': 'Iniciar sesión con Google',
        'or': 'O',
        'emailAddress': 'Dirección de correo electrónico',
        'password': 'Contraseña',
        'loading': 'Cargando...',
        'login': 'Iniciar sesión',
        'createAccount': 'Crear cuenta',
        'dontHaveAccount': "¿No tienes una cuenta?",
        'alreadyHaveAccount': "¿Ya tienes una cuenta?",
        'signUp': 'Registrarse',
        'pages': 'Páginas',
        'sections': 'Secciones',
        'exit': 'Salir',
        'save': 'Guardar',
        'saving': 'Guardando...',
        'saved': '¡Guardado!',
        'saveError': 'Error al guardar',
        'loginToSave': 'Inicia sesión para guardar',
        'editSection': 'Editar Sección',
        'selectSectionToEdit': 'Selecciona una sección de la izquierda para editar su contenido y propiedades.',
      },
      // Add more languages and their translations as needed
    };

    let text = translations[currentUILanguage]?.[key] || key;
    if (variables) {
      for (const varKey in variables) {
        text = text.replace(`{${varKey}}`, String(variables[varKey]));
      }
    }
    return text;
  };

  return (
    <LanguageContext.Provider value={{ t, currentUILanguage, setUILanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};