// imageTemplates.ts
export const FIXED_IMAGES = {
  'hero-background': [
    'https://picsum.photos/seed/goonline-hero-1/1920/1080',
    'https://picsum.photos/seed/goonline-hero-2/1920/1080',
    'https://picsum.photos/seed/goonline-hero-3/1920/1080',
  ],
  'about-image': [
    'https://picsum.photos/seed/goonline-about-1/600/400',
    'https://picsum.photos/seed/goonline-about-2/600/400',
    'https://picsum.photos/seed/goonline-about-3/600/400',
  ],
  'product-image': [
    'https://picsum.photos/seed/goonline-product-1/400/300',
    'https://picsum.photos/seed/goonline-product-2/400/300',
    'https://picsum.photos/seed/goonline-product-3/400/300',
  ],
  'feature-image': [
    'https://picsum.photos/seed/goonline-feature-1/600/400',
    'https://picsum.photos/seed/goonline-feature-2/600/400',
    'https://picsum.photos/seed/goonline-feature-3/600/400',
  ],
  'client-logo': [
    'https://picsum.photos/seed/goonline-client-1/200/100',
    'https://picsum.photos/seed/goonline-client-2/200/100',
    'https://picsum.photos/seed/goonline-client-3/200/100',
  ],
  'team-member-avatar': [
    'https://picsum.photos/seed/goonline-team-1/400/400',
    'https://picsum.photos/seed/goonline-team-2/400/400',
    'https://picsum.photos/seed/goonline-team-3/400/400',
  ],
  'gallery-item': [
    'https://picsum.photos/seed/goonline-gallery-1/500/500',
    'https://picsum.photos/seed/goonline-gallery-2/500/500',
    'https://picsum.photos/seed/goonline-gallery-3/500/500',
  ],
  'testimonial-avatar': [
    'https://picsum.photos/seed/goonline-testimonial-1/100/100',
    'https://picsum.photos/seed/goonline-testimonial-2/100/100',
    'https://picsum.photos/seed/goonline-testimonial-3/100/100',
  ],
  'blog-post-image': [
    'https://picsum.photos/seed/goonline-blog-1/400/300',
    'https://picsum.photos/seed/goonline-blog-2/400/300',
    'https://picsum.photos/seed/goonline-blog-3/400/300',
  ],
  'cta-background': [
    'https://picsum.photos/seed/goonline-cta-1/1920/1080',
    'https://picsum.photos/seed/goonline-cta-2/1920/1080',
    'https://picsum.photos/seed/goonline-cta-3/1920/1080',
  ],
  'default-item-image': [ // For generic new items if no specific category
      'https://picsum.photos/seed/goonline-default-1/400/300',
      'https://picsum.photos/seed/goonline-default-2/400/300',
  ]
};

let imageIndexMap: { [key: string]: number } = {};

export const getRandomFixedImage = (category: keyof typeof FIXED_IMAGES): string => {
  const images = FIXED_IMAGES[category];
  if (!images || images.length === 0) {
    console.warn(`No fixed images found for category: ${category}`);
    return 'https://picsum.photos/seed/goonline-default-placeholder/600/400'; // Fallback
  }
  // Use a rotating index for variety within fixed images
  if (imageIndexMap[category] === undefined) {
    imageIndexMap[category] = 0;
  } else {
    imageIndexMap[category] = (imageIndexMap[category] + 1) % images.length;
  }
  return images[imageIndexMap[category]];
};

// Reset the index map to ensure fresh image selection for new website creation
export const resetImageIndexMap = () => {
    imageIndexMap = {};
};