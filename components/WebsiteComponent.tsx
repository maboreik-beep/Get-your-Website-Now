import React from 'react';
import { Website, Section, BaseSection, HeroSection, AboutSection, StorySection, ServicesSection, ProductsSection, FeaturesSection, PricingSection, ClientsSection, TeamSection, GallerySection, TestimonialsSection, FAQSection, CTASection, BlogSection, ContactSection, FooterSection } from '../types'; // Assuming types.ts defines Website and Section

interface WebsiteComponentProps {
  website: Website;
  currentContentLanguage: string;
}

// Changed to a named export
export const WebsiteComponent: React.FC<WebsiteComponentProps> = ({ website, currentContentLanguage }) => {
  if (!website) {
    return <div>Loading website...</div>;
  }

  // A very simplified renderer for sections for the placeholder
  const renderSection = (section: Section) => {
    // Cast to BaseSection to ensure 'id' and 'type' are always present
    const baseSection: BaseSection = section; 

    // Access content using currentContentLanguage or fallback to defaultLanguage
    const getContent = (field: Record<string, string> | undefined) => {
        if (!field) return '';
        // Fallback logic: currentContentLanguage -> website.defaultLanguage -> __default_lang_content -> empty string
        return field[currentContentLanguage] || field[website.defaultLanguage] || field['__default_lang_content'] || '';
    };

    switch (baseSection.type) { // Use baseSection.type
      case 'Hero':
        return (
          <section key={baseSection.id} className="relative h-96 bg-cover bg-center flex items-center justify-center text-white" style={{ backgroundImage: `url(${getContent((section as HeroSection).backgroundImage)})` }}>
            <div className="text-center bg-black bg-opacity-50 p-4 rounded">
              <h1 className="text-4xl font-bold">{getContent((section as HeroSection).headline)}</h1>
              <p className="text-xl">{getContent((section as HeroSection).subheadline)}</p>
            </div>
          </section>
        );
      case 'About':
        return (
          <section key={baseSection.id} className="p-8 bg-gray-800 text-white">
            <h2 className="text-3xl font-bold mb-4">{getContent((section as AboutSection).title)}</h2>
            <p>{getContent((section as AboutSection).text)}</p>
          </section>
        );
      case 'Services':
        return (
            <section key={baseSection.id} className="p-8 bg-gray-800 text-white">
                <h2 className="text-3xl font-bold mb-4">{getContent((section as ServicesSection).title)}</h2>
                {'items' in section && section.items.map(item => (
                    <div key={item.id} className="mb-2">
                        <h3 className="text-xl font-semibold">{getContent(item.name)}</h3>
                        <p className="text-gray-300">{getContent(item.description)}</p>
                    </div>
                ))}
            </section>
        );
      case 'Products':
        return (
            <section key={baseSection.id} className="p-8 bg-gray-800 text-white">
                <h2 className="text-3xl font-bold mb-4">{getContent((section as ProductsSection).title)}</h2>
                {'items' in section && section.items.map(item => (
                    <div key={item.id} className="mb-2">
                        <img src={item.image} alt={getContent(item.name)} className="w-24 h-24 object-cover rounded-md" />
                        <h3 className="text-xl font-semibold">{getContent(item.name)}</h3>
                        <p className="text-gray-300">{getContent(item.description)}</p>
                        <p className="text-primary font-bold">{item.price}</p>
                    </div>
                ))}
            </section>
        );
        case 'Features':
        return (
            <section key={baseSection.id} className="p-8 bg-gray-800 text-white">
                <h2 className="text-3xl font-bold mb-4">{getContent((section as FeaturesSection).title)}</h2>
                {'items' in section && section.items.map(item => (
                    <div key={item.id} className="mb-2">
                        <img src={item.image} alt={getContent(item.name)} className="w-24 h-24 object-cover rounded-md" />
                        <h3 className="text-xl font-semibold">{getContent(item.name)}</h3>
                        <p className="text-gray-300">{getContent(item.description)}</p>
                    </div>
                ))}
            </section>
        );
        case 'Team':
        return (
            <section key={baseSection.id} className="p-8 bg-gray-800 text-white">
                <h2 className="text-3xl font-bold mb-4">{getContent((section as TeamSection).title)}</h2>
                {'members' in section && section.members.map(member => (
                    <div key={member.id} className="mb-2">
                        <img src={member.image} alt={getContent(member.name)} className="w-24 h-24 object-cover rounded-full" />
                        <h3 className="text-xl font-semibold">{getContent(member.name)}</h3>
                        <p className="text-gray-300">{getContent(member.title)}</p>
                    </div>
                ))}
            </section>
        );
        case 'Story':
        return (
            <section key={baseSection.id} className="p-8 bg-gray-800 text-white">
                <h2 className="text-3xl font-bold mb-4">{getContent((section as StorySection).title)}</h2>
                {'timeline' in section && section.timeline.map(item => (
                    <div key={item.id} className="mb-2">
                        <h3 className="text-xl font-semibold">{item.year}</h3>
                        <p className="text-gray-300">{getContent(item.event)}</p>
                    </div>
                ))}
            </section>
        );
        case 'Testimonials':
        return (
            <section key={baseSection.id} className="p-8 bg-gray-800 text-white">
                <h2 className="text-3xl font-bold mb-4">{getContent((section as TestimonialsSection).title)}</h2>
                {'items' in section && section.items.map(item => (
                    <div key={item.id} className="mb-2">
                        <p className="italic text-gray-300">"{getContent(item.text)}"</p>
                        <p className="font-semibold">{getContent(item.author)}</p>
                        <p className="text-sm text-gray-400">{getContent(item.role)}</p>
                    </div>
                ))}
            </section>
        );
        case 'FAQ':
        return (
            <section key={baseSection.id} className="p-8 bg-gray-800 text-white">
                <h2 className="text-3xl font-bold mb-4">{getContent((section as FAQSection).title)}</h2>
                {'items' in section && section.items.map(item => (
                    <div key={item.id} className="mb-2">
                        <h3 className="text-xl font-semibold">{getContent(item.question)}</h3>
                        <p className="text-gray-300">{getContent(item.answer)}</p>
                    </div>
                ))}
            </section>
        );
        case 'CTA':
        return (
            <section key={baseSection.id} className="p-8 bg-primary text-black text-center">
                <h2 className="text-3xl font-bold mb-4">{getContent((section as CTASection).title)}</h2>
                <p className="text-xl mb-4">{getContent((section as CTASection).text)}</p>
                <button className="bg-black text-white px-6 py-3 rounded-md font-semibold">{getContent((section as CTASection).ctaText)}</button>
            </section>
        );
        case 'Contact':
        return (
            <section key={baseSection.id} className="p-8 bg-gray-800 text-white">
                <h2 className="text-3xl font-bold mb-4">{getContent((section as ContactSection).title)}</h2>
                <p>{getContent((section as ContactSection).address)}</p>
                <p>Email: {(section as ContactSection).email}</p>
                <p>Phone: {(section as ContactSection).phone}</p>
            </section>
        );
        case 'Footer':
        return (
            <footer key={baseSection.id} className="p-8 bg-gray-900 text-white text-center">
                <p>{getContent((section as FooterSection).text)}</p>
            </footer>
        );
      default:
        return (
          <section key={baseSection.id} className="p-8 bg-gray-700 text-white">
            <h2 className="text-2xl font-bold">{baseSection.type} Section</h2>
            <p>Content for {getContent((section as any).title)}</p>
          </section>
        );
    }
  };

  return (
    <div className={`min-h-screen ${website.theme === 'dark' ? 'bg-gray-900' : 'bg-white'} text-${website.theme === 'dark' ? 'white' : 'black'}`}>
      {website.pages.map(page => (
        <div key={page.id} id={page.id} className="website-page">
          {page.sections.filter(s => s.enabled).map(renderSection)}
        </div>
      ))}
    </div>
  );
};

// Also export as default for components that might still use it
export default WebsiteComponent;