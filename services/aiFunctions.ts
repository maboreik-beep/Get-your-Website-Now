import { FunctionDeclaration, Type } from '@google/genai';

const updateSectionContentDeclaration: FunctionDeclaration = {
  name: 'updateSectionContent',
  description: 'Updates a specific field of a section or an item within a section on a given page.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      pageId: {
        type: Type.STRING,
        description: 'The ID of the page containing the section. Example: "home", "about".',
      },
      sectionId: {
        type: Type.STRING,
        description: 'The ID of the section to update. Example: "hero-123", "services-456".',
      },
      field: {
        type: Type.STRING,
        description: 'The name of the property to update in the section. Example: "headline", "title", "text".',
      },
      value: {
        type: Type.STRING,
        description: 'The new value for the specified field.',
      },
      itemId: {
          type: Type.STRING,
          description: '(Optional) The ID of a specific item within a list section (e.g., a service in ServicesSection) to update. Example: "si-789".',
      },
      itemField: {
          type: Type.STRING,
          description: '(Optional) If itemId is provided, this is the field within that item to update. Example: "name", "description".'
      }
    },
    required: ['sectionId', 'field', 'value'],
  },
};

// You can add more function declarations here later
// e.g., for adding/removing items, changing themes, etc.

export const tools = [{ functionDeclarations: [updateSectionContentDeclaration] }];
