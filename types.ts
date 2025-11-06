
export type Industry = 
  | 'Design Agency' | 'Charity' | 'Hotel' | 'Business Services' | 'Portfolio' | 'Interior Designer' | 'Online Store'
  | 'Fashion' | 'Furniture' | 'Real Estate' | 'Construction' | 'Marketing'
  | 'Designer' | 'Photographer' | 'Restaurant' | 'Store' | 'Logistics'
  | 'Lawyer' | 'Medical' | 'Technology' | 'Blog' | 'Events' | 'Child Care' | 'Industrial' | 'Security';

export interface Website {
  id?: string; // Firestore document ID
  userId?: string;
  name: Record<string, string>; // Changed to Record<string, string> for multilingual support
  themeColor: string;
  theme: 'light' | 'dark'; // Added global theme setting
  pages: Page[];
  industry: Industry;
  brochureImage?: string; // For generating from an image
  textPromptInput?: string; // Added for AI text prompt input
  defaultLanguage: string; // New: Primary language for content
  supportedLanguages: string[]; // New: List of languages this website supports
  contentTranslations?: Record<string, Record<string, string>>; // New: Flat map for translated content
}

export interface Page {
  id: string;
  name: Record<string, string>; // Changed to Record<string, string>
  sections: Section[];
}

// Section Items
export interface ServiceItem {
  id: string;
  icon: string;
  name: Record<string, string>; // Changed to Record<string, string>
  description: Record<string, string>; // Changed to Record<string, string>
}

export interface ProductItem {
  id: string;
  name: Record<string, string>; // Changed to Record<string, string>
  description: Record<string, string>; // Changed to Record<string, string>
  price: string;
  image: string;
}

export interface FeatureItem {
  id: string;
  name: Record<string, string>; // Changed to Record<string, string>
  description: Record<string, string>; // Changed to Record<string, string>
  image: string;
}

export interface PriceItem {
  id: string;
  plan: Record<string, string>; // Changed to Record<string, string>
  price: string;
  period: Record<string, string>; // Changed to Record<string, string>
  features: Record<string, string>[]; // Changed to Record<string, string>[]
  featured: boolean;
}

export interface ClientItem {
  id: string;
  name: Record<string, string>; // Changed to Record<string, string>
  logo: string;
}

export interface SocialLinkItem {
  name: string;
  url?: string;
  icon: string; // e.g., 'Twitter', 'Linkedin', 'Facebook', 'Instagram'
}

export interface TeamMember {
  id: string;
  name: Record<string, string>; // Changed to Record<string, string>
  title: Record<string, string>; // Changed to Record<string, string>
  image: string;
  social: {
    twitter?: string;
    linkedin?: string;
    facebook?: string; // Added for consistency
    instagram?: string; // Added for consistency
  };
}

export interface TimelineItem {
    id: string; // Added for consistent identification
    year: string;
    event: Record<string, string>; // Changed to Record<string, string>
}

export interface GalleryItem {
  id: string;
  image: string;
  title: Record<string, string>; // Changed to Record<string, string>
  category: Record<string, string>; // Changed to Record<string, string>
}

export interface TestimonialItem {
  id: string;
  text: Record<string, string>; // Changed to Record<string, string>
  author: Record<string, string>; // Changed to Record<string, string>
  role: Record<string, string>; // Changed to Record<string, string>
  avatar: string;
}

export interface FAQItem {
  id: string;
  question: Record<string, string>; // Changed to Record<string, string>
  answer: Record<string, string>; // Changed to Record<string, string>
}

export interface BlogItem {
  id: string;
  title: Record<string, string>; // Changed to Record<string, string>
  excerpt: Record<string, string>; // Changed to Record<string, string>
  author: Record<string, string>; // Changed to Record<string, string>
  date: string;
  image: string;
}


// Section Types
export interface BaseSection { // Export BaseSection
  id: string;
  type: Section['type']; // FIX: Added 'type' property to BaseSection to resolve type errors
  enabled: boolean;
  theme?: 'light' | 'dark'; // Added theme for section-specific styling
}

export interface HeroSection extends BaseSection {
  type: 'Hero';
  headline: Record<string, string>; // Changed to Record<string, string>
  subheadline: Record<string, string>; // Changed to Record<string, string>
  ctaText: Record<string, string>; // Changed to Record<string, string>
  ctaText2?: Record<string, string>; // Changed to Record<string, string>
  backgroundImage: string;
  layout?: 'left-aligned' | 'centered' | 'split';
}

export interface AboutSection extends BaseSection {
  type: 'About';
  title: Record<string, string>; // Changed to Record<string, string>
  text: Record<string, string>; // Changed to Record<string, string>
  image: string;
  layout?: 'image-left' | 'image-right'; // Added for visual variation
}

export interface StorySection extends BaseSection {
  type: 'Story';
  title: Record<string, string>; // Changed to Record<string, string>
  text: Record<string, string>; // Changed to Record<string, string>
  timeline: TimelineItem[];
}

export interface ServicesSection extends BaseSection {
  type: 'Services';
  title: Record<string, string>; // Changed to Record<string, string>
  items: ServiceItem[];
  layout?: 'grid-icon-top' | 'list-icon-left';
}

export interface ProductsSection extends BaseSection {
  type: 'Products';
  title: Record<string, string>; // Changed to Record<string, string>
  items: ProductItem[];
  layout?: 'grid' | 'carousel'; // Added for visual variation
}

export interface FeaturesSection extends BaseSection {
  type: 'Features';
  title: Record<string, string>; // Changed to Record<string, string>
  items: FeatureItem[];
  layout?: 'image-right-text-left' | 'image-left-text-right'; // Added for visual variation
}

export interface PricingSection extends BaseSection {
  type: 'Pricing';
  title: Record<string, string>; // Changed to Record<string, string>
  items: PriceItem[];
}

export interface ClientsSection extends BaseSection {
  type: 'Clients';
  title: Record<string, string>; // Changed to Record<string, string>
  items: ClientItem[];
}

export interface TeamSection extends BaseSection {
  type: 'Team';
  title: Record<string, string>; // Changed to Record<string, string>
  members: TeamMember[];
  layout?: 'grid' | 'carousel'; // Added for visual variation
}

export interface GallerySection extends BaseSection {
  type: 'Gallery';
  title: Record<string, string>; // Changed to Record<string, string>
  items: GalleryItem[];
  layout?: 'grid' | 'masonry'; // Added for visual variation
}

export interface TestimonialsSection extends BaseSection {
  type: 'Testimonials';
  title: Record<string, string>; // Changed to Record<string, string>
  items: TestimonialItem[];
  layout?: 'grid' | 'carousel'; // Added for visual variation
}

export interface FAQSection extends BaseSection {
  type: 'FAQ';
  title: Record<string, string>; // Changed to Record<string, string>
  items: FAQItem[];
}

export interface CTASection extends BaseSection {
  type: 'CTA';
  title: Record<string, string>; // Changed to Record<string, string>
  text: Record<string, string>; // Changed to Record<string, string>
  ctaText: Record<string, string>; // Changed to Record<string, string>
  ctaLink?: string; // Added for CTA link
  backgroundImage?: string; // Optional background for CTA
}

export interface BlogSection extends BaseSection {
  type: 'Blog';
  title: Record<string, string>; // Changed to Record<string, string>
  items: BlogItem[];
  layout?: 'grid' | 'list'; // Added for visual variation
}

export interface ContactSection extends BaseSection {
  type: 'Contact';
  title: Record<string, string>; // Changed to Record<string, string>
  address: Record<string, string>; // Changed to Record<string, string>
  email: string;
  phone: string;
  formRecipientEmail: string;
  layout?: 'address-left-form-right' | 'form-left-address-right'; // Added for visual variation
}

export interface FooterSection extends BaseSection {
  type: 'Footer';
  text: Record<string, string>; // Changed to Record<string, string>
  socialLinks: {
    twitter?: string;
    linkedin?: string;
    facebook?: string;
    instagram?: string;
  };
}

// Union type for all possible sections
export type Section = 
  | HeroSection
  | AboutSection
  | StorySection
  | ServicesSection
  | ProductsSection
  | FeaturesSection
  | PricingSection
  | ClientsSection
  | TeamSection
  | GallerySection
  | TestimonialsSection
  | FAQSection
  | CTASection
  | BlogSection
  | ContactSection
  | FooterSection;
    