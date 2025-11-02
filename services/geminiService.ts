import { GoogleGenAI, Type, GenerateContentResponse, Modality } from "@google/genai";
import { Page, Industry, Website } from '../types';

let ai: GoogleGenAI | null = null;

const getAI = () => {
    if (!ai) {
        if (!process.env.API_KEY) {
            // In a real app, you might want to handle this more gracefully,
            // but for this context, we assume the key is present.
            throw new Error("API_KEY environment variable not set.");
        }
        ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    }
    return ai;
};


export const generateWebsiteWithAI = async (
  companyName: Record<string, string>, // Changed to Record<string, string>
  industry: Industry,
  theme: 'light' | 'dark',
  defaultLanguage: string, // New parameter for default content language
  textPromptInput?: string,
  brochureImage?: string
): Promise<{pages: Page[]}> => {
  try {
    const ai = getAI();
    
    // Define types for all possible item structures within sections for comprehensive schema
    // Text fields within these items now need to be Record<string, string>
    const multiLangStringObject = {
      type: Type.OBJECT,
      properties: {
        // Dummy property to satisfy Gemini API's "properties: should be non-empty for OBJECT type"
        __default_lang_content: { type: Type.STRING }
      },
      additionalProperties: { type: Type.STRING } // For actual language keys like "en", "ar"
    };

    const allItemTypes = {
      type: Type.OBJECT,
      properties: {
        id: { type: Type.STRING },
        icon: { type: Type.STRING },
        image: { type: Type.STRING },
        price: { type: Type.STRING },
        featured: { type: Type.BOOLEAN },
        logo: { type: Type.STRING },
        year: { type: Type.STRING },
        date: { type: Type.STRING },
        
        // Multilingual fields
        name: multiLangStringObject,
        description: multiLangStringObject,
        plan: multiLangStringObject,
        period: multiLangStringObject,
        features: { type: Type.ARRAY, items: multiLangStringObject },
        title: multiLangStringObject,
        category: multiLangStringObject,
        text: multiLangStringObject,
        author: multiLangStringObject,
        role: multiLangStringObject,
        event: multiLangStringObject,
        question: multiLangStringObject,
        answer: multiLangStringObject,
        excerpt: multiLangStringObject,

        social: { // This needs properties for its own fields
            type: Type.OBJECT,
            properties: {
                twitter: { type: Type.STRING },
                linkedin: { type: Type.STRING },
                facebook: { type: Type.STRING },
                instagram: { type: Type.STRING },
            },
            // Social links are optional
            required: [],
        },
      },
      // Ensure additional properties are allowed for future flexibility in item structures
      additionalProperties: true,
    };
    
    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        pages: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              name: multiLangStringObject, // Changed to Record<string, string>
              sections: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    type: { type: Type.STRING },
                    enabled: { type: Type.BOOLEAN },
                    theme: { type: Type.STRING },
                    layout: { type: Type.STRING },
                    
                    // Common fields (now multilingual)
                    title: multiLangStringObject,
                    text: multiLangStringObject,

                    // Hero/CTA (now multilingual)
                    headline: multiLangStringObject,
                    subheadline: multiLangStringObject,
                    ctaText: multiLangStringObject,
                    ctaText2: multiLangStringObject,
                    ctaLink: { type: Type.STRING },
                    backgroundImage: { type: Type.STRING },
                    
                    // About/Features
                    image: { type: Type.STRING },
                    
                    // Story
                    timeline: { type: Type.ARRAY, items: allItemTypes },
                    
                    // Sections with lists of items (Services, Products, Features, Pricing, Clients, Gallery, Testimonials, FAQ, Blog)
                    items: { type: Type.ARRAY, items: allItemTypes },
                    members: { type: Type.ARRAY, items: allItemTypes }, // For Team section

                    // Contact (now multilingual)
                    address: multiLangStringObject,
                    email: { type: Type.STRING },
                    phone: { type: Type.STRING },
                    formRecipientEmail: { type: Type.STRING },
                    
                    // Footer (now multilingual)
                    socialLinks: {
                      type: Type.OBJECT,
                      properties: {
                        twitter: { type: Type.STRING },
                        linkedin: { type: Type.STRING },
                        facebook: { type: Type.STRING },
                        instagram: { type: Type.STRING },
                      },
                      required: [], // Social links are optional
                    }
                  },
                  // Allow additional properties for sections for future flexibility
                  additionalProperties: true,
                }
              }
            },
            // Allow additional properties for pages for future flexibility
            additionalProperties: true,
          }
        }
      },
      // Allow additional properties at the top level for future flexibility
      additionalProperties: true,
    };
    
    let basePrompt = `Generate a complete, multi-page website structure in JSON for a company named '${companyName[defaultLanguage]}' in the '${industry}' industry. The overall theme should be '${theme}'. The default content language for all text fields must be '${defaultLanguage}'.
    Create a 'Home' page, an 'About Us' page, and a 'Contact Us' page. If the industry is product-based (like 'Restaurant', 'Online Store', 'Fashion'), also create a 'Products' or 'Menu' page. If it's a creative industry ('Design Agency', 'Photographer', 'Designer'), include a 'Gallery' or 'Portfolio' page. If it's service-oriented or offers plans, include a 'Pricing' page. If it's focused on content, include a 'Blog' page. Ensure a diverse set of pages relevant to the industry.
    
    For each page, populate with a variety of relevant sections based on the industry and typical website structures.
    
    Ensure the Home page includes a comprehensive set of sections like Hero, About, Products/Services, Features, Gallery, Team, Testimonials, FAQ, CTA, and a Footer.
    The 'About Us' page should include Hero, About, Story, Team and Footer.
    The 'Contact Us' page should include a Hero, Contact section with a form, and a Footer.
    Other pages should also contain relevant sections.

    Vary the 'theme' property ('light' or 'dark') and 'layout' property ('left-aligned', 'centered', 'split', 'grid-icon-top', 'list-icon-left', 'image-left', 'image-right', 'image-right-text-left', 'image-left-text-right', 'grid', 'carousel', 'masonry', 'list', 'address-left-form-right', 'form-left-address-right') for sections to create visual diversity appropriate for the industry and ensure good contrast. Prioritize 'dark' theme for hero sections for impact, and mix themes for other sections, ensuring they align with the global '${theme}' theme where not explicitly overridden.

    For all image properties (backgroundImage, image, logo, avatar), provide a relevant, high-quality image URL from picsum.photos/seed/{unique_seed_and_number}/{width}/{height}. Use highly specific, unique keywords for each seed to avoid repetition (e.g., for '${industry}', for team members use 'portrait-professional-${Math.random().toString(36).substring(2, 7)}', for gallery items use 'creative-portfolio-abstract-${Math.random().toString(36).substring(2, 7)}'). This is critical to prevent broken or duplicate images.
    
    Generate rich, industry-specific content for all sections, ensuring at least 3-4 items for list-based sections:
    - Products/Services: 3-4 items with descriptive names and text, relevant icons (from list: Briefcase, Chart, Megaphone, Code, Design, Support, Photograph, ShoppingCart, UserGroup, Shield, Geo, DocumentText, Twitter, Linkedin, Facebook, Instagram).
    - Testimonials: 2-3 items with realistic names, roles, and avatars.
    - Team: 3-4 members with names, titles, images, and social links.
    - Features: 3-4 key features with descriptions and images.
    - Pricing: 3-tier pricing table if applicable, with features listed.
    - Gallery: 3-4 diverse items with titles, categories, and images.
    - FAQ: 2-3 common questions and answers.
    - Blog: 3-4 posts with titles, excerpts, authors, dates, and images.
    - Contact: Fictional but realistic address, email, phone, and formRecipientEmail.
    - Footer: Include social links for twitter, linkedin, facebook, and instagram. The footer text should be "© [Current Year] ${companyName[defaultLanguage]}. All Rights Reserved.".

    For all text fields, ensure the value is an object. The key '${defaultLanguage}' should contain the primary content. Additionally, for the internal API schema validation, include a key named '__default_lang_content' which also contains this primary content. E.g., "headline": { "__default_lang_content": "Welcome to our company", "${defaultLanguage}": "Welcome to our company" }.

    Ensure the JSON output strictly follows the provided schema. The top-level key must be 'pages'.`;

    if (textPromptInput) {
        basePrompt += `\nAdditional specific requirements from user: ${textPromptInput}`;
    }
    
    let contentParts: Array<any> = [{ text: basePrompt }];

    if (brochureImage) {
        contentParts.push({ text: `\nUse the provided brochure image as the primary source of information for services, company details, and overall tone. Extract key information from the image to populate the website.`});
        contentParts.push({ inlineData: { mimeType: 'image/jpeg', data: brochureImage.split(',')[1] } });
    }

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash', // Using flash for speed, pro can be used for more complex generation
      contents: contentParts,
      config: {
        responseMimeType: 'application/json',
        responseSchema: responseSchema,
      }
    });

    const jsonText = response.text.trim();
    const cleanJson = jsonText.replace(/^```json/, '').replace(/```$/, '').trim();
    return JSON.parse(cleanJson);
  } catch (error: any) {
    console.error("Error generating website content with AI:", error);
    let errorMessage = "Failed to generate website content.";
    if (error instanceof Error) {
      if (error.message.includes('JSON')) {
          try {
              const errorDetails = JSON.parse(error.message.split('\n')[0]);
              errorMessage = `Gemini API error details: ${JSON.stringify(errorDetails, null, 2)}`;
          } catch {
              errorMessage = `Gemini API error: ${error.message}`;
          }
      } else {
          errorMessage = `Gemini API error: ${error.message}`;
      }
    } else if (typeof error === 'string') {
      errorMessage = `Gemini API error: ${error}`;
    }
    throw new Error(errorMessage);
  }
};


export const generateImage = async (prompt: string, aspectRatio: string): Promise<string> => {
  try {
    const ai = getAI();
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: `A vibrant, high-resolution, professional photograph for a website. The subject is: ${prompt}. Style: cinematic, photorealistic, high detail, rule of thirds.`,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: aspectRatio as "1:1" | "3:4" | "4:3" | "9:16" | "16:9",
        },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
        const base64ImageBytes = response.generatedImages[0].image.imageBytes;
        return `data:image/jpeg;base64,${base64ImageBytes}`;
    }
    throw new Error("No image was generated.");
  } catch (error) {
    console.error("Error generating image:", error);
    throw new Error("Failed to generate image.");
  }
};

export const generateContentWithSearch = async (prompt: string): Promise<{ text: string, sources: any[] }> => {
    try {
        const ai = getAI();
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                tools: [{googleSearch: {}}],
            },
        });
        const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
        return { text: response.text, sources: groundingChunks };
    } catch (error) {
        console.error("Error with Search Grounding:", error);
        throw new Error("Failed to generate content with search.");
    }
};

export const getLocationWithMaps = async (prompt: string, userLocation?: {latitude: number, longitude: number}): Promise<{ text: string, sources: any[] }> => {
    try {
        const ai = getAI();
        
        const config: any = { tools: [{googleMaps: {}}] };
        if (userLocation) {
            config.toolConfig = {
                retrievalConfig: {
                    latLng: userLocation
                }
            };
        }

        const response: GenerateContentResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: config,
        });

        const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
        return { text: response.text, sources: groundingChunks };

    } catch (error) {
        console.error("Error with Maps Grounding:", error);
        throw new Error("Failed to get location details.");
    }
};


/**
 * Recursively extracts translatable text fields from a Website object into a flat map.
 * The keys of the map are dot-separated paths (e.g., "pages.0.sections.1.headline") and values are the text strings.
 */
export const extractTranslatableContent = (website: Website, defaultLang: string): Record<string, string> => {
    const contentMap: Record<string, string> = {};

    function traverse(obj: any, path: string) {
        if (obj === null || typeof obj !== 'object') {
            return;
        }

        if (Array.isArray(obj)) {
            obj.forEach((item, index) => {
                // For list items that don't always have an 'id' (e.g., timeline items), use index
                const itemIdentifier = item.id || index;
                traverse(item, `${path}.${itemIdentifier}`);
            });
        } else {
            for (const key in obj) {
                if (!obj.hasOwnProperty(key)) continue;

                const currentPath = path ? `${path}.${key}` : key;
                const value = obj[key];

                // Heuristic: If value is a Record<string, string> and contains defaultLang, it's translatable text.
                // We also check if it's not empty, to avoid translating empty strings.
                // Also, ensure it's not a socialLinks object itself, but rather its individual link properties if they were objects.
                if (typeof value === 'object' && value !== null && defaultLang in value && typeof value[defaultLang] === 'string' && value[defaultLang].trim() !== '') {
                    contentMap[currentPath] = value[defaultLang];
                } else if (typeof value === 'object' && value !== null && key !== 'socialLinks') { // Recurse for nested objects, skip socialLinks itself
                    traverse(value, currentPath);
                }
            }
        }
    }

    // Start traversal from website.name and website.pages
    if (website.name && website.name[defaultLang] && website.name[defaultLang].trim() !== '') {
        contentMap['name'] = website.name[defaultLang];
    }
    traverse(website.pages, 'pages'); // Assuming pages is the main content container for sections

    return contentMap;
};

/**
 * Uses AI to translate a map of text content to a target language.
 */
export const translateContentWithAI = async (contentMap: Record<string, string>, targetLang: string): Promise<Record<string, string>> => {
    const ai = getAI();
    console.log(`Sending ${Object.keys(contentMap).length} content snippets for AI translation to ${targetLang}...`);

    const chunks = Object.entries(contentMap).map(([path, text]) => ({ path, text }));
    
    // Group chunks to avoid exceeding prompt limits if contentMap is very large
    const chunkSize = 20; // Translate 20 items at a time
    const translatedMap: Record<string, string> = {};

    for (let i = 0; i < chunks.length; i += chunkSize) {
        const currentChunks = chunks.slice(i, i + chunkSize);
        const textToTranslate = currentChunks.map(c => c.text);

        const prompt = `Translate the following array of text strings from English to ${targetLang}. Return the translations in a JSON array, where each element is the translated string corresponding to the input. For example, if input is ["Hello", "World"], output should be ["مرحبا", "العالم"]. Ensure all strings are translated and the array order is preserved.\n\nInput to translate: ${JSON.stringify(textToTranslate)}`;
        
        try {
            const response: GenerateContentResponse = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: [{ text: prompt }],
                config: {
                    responseMimeType: 'application/json',
                    responseSchema: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING }
                    }
                }
            });
            const jsonText = response.text.trim();
            const cleanJson = jsonText.replace(/^```json/, '').replace(/```$/, '').trim();
            const translations: string[] = JSON.parse(cleanJson);

            currentChunks.forEach((chunk, index) => {
                if (translations[index] !== undefined) { // Check for undefined to handle potential partial responses
                    translatedMap[chunk.path] = translations[index];
                } else {
                    console.warn(`No translation received for path: ${chunk.path}. Falling back to original text.`);
                    translatedMap[chunk.path] = chunk.text; // Fallback
                }
            });

        } catch (error) {
            console.error(`Error translating chunk ${i} to ${i + chunkSize}:`, error);
            // On error, use original text as a fallback for affected items
            currentChunks.forEach(chunk => {
                translatedMap[chunk.path] = contentMap[chunk.path]; // Fallback to original
            });
            throw error; // Re-throw to propagate error status
        }
    }
    
    console.log("AI translation complete.");
    return translatedMap;
};

/**
 * Applies a flat map of translated content back to the website's contentTranslations.
 */
export const applyTranslatedContent = (
    website: Website,
    translatedMap: Record<string, string>,
    targetLang: string
): Website => {
    const newWebsite = JSON.parse(JSON.stringify(website));
    if (!newWebsite.contentTranslations) {
        newWebsite.contentTranslations = {};
    }
    newWebsite.contentTranslations[targetLang] = translatedMap;

    // Also update supported languages if targetLang is not already there
    if (!newWebsite.supportedLanguages.includes(targetLang)) {
        newWebsite.supportedLanguages.push(targetLang);
    }
    
    return newWebsite;
};