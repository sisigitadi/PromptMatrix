// e:\Projects\Ai\PromptMatrix_Local\types.ts

// No longer using TranslationKey type for direct strings in framework definitions
// export type TranslationKey = string;

export interface FrameworkComponentDetail {
  id: string;
  name: string; // Direct string (English)
  placeholder: string; // Direct string (English)
  tooltip?: string; // Direct string (English)
  options?: string[]; // Direct strings (English)
}

// This interface defines the structure of the 'translations.id' object inside a Framework
export interface TranslatedFrameworkContent {
  name: string; // Translated string (Indonesian)
  description: string; // Translated string (Indonesian)
  components?: Array<{ // Components can also be translated
    id: string;
    name: string; // Translated string (Indonesian)
    placeholder: string; // Translated string (Indonesian)
    tooltip?: string; // Translated string (Indonesian)
    options?: string[]; // Translated strings (Indonesian)
  }>;
  // predefinedOptions are not expected to be translated here, they are at the base level
}

export interface Framework {
  id: string;
  name: string; // English name
  category: 'Text' | 'Media' | 'Music'; // Direct string
  isInteractive: boolean;
  isNew: boolean;
  description: string; // English description
  components: FrameworkComponentDetail[]; // English components
  translations?: { // Optional translations object
    id?: TranslatedFrameworkContent; // Indonesian translations
  };
  genericToolLinks?: { name: string; url: string }[];
  toolLink?: string;
  predefinedOptions?: { [key: string]: string[] }; // Direct strings
}

// This type is used in App.tsx for the currentFrameworkLocale
// It resolves to actual strings for rendering, combining base and translated content
export interface ResolvedFrameworkLocale {
  name: string;
  description: string;
  components: Array<{ id: string; name: string; placeholder: string; tooltip?: string; options?: string[] }>;
  category: 'Text' | 'Media' | 'Music';
  predefinedOptions?: { [key: string]: string[] };
  genericToolLinks?: { name: string; url: string }[];
  toolLink?: string;
}