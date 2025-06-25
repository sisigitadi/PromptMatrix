export type Language = 'en' | 'id';

export type TranslationFunction = (...args: any[]) => string;

// Defines the structure for translations within a single language.
// It allows for simple string translations or functions for dynamic translations.
export interface Translations {
  [key: string]: string | string[] | TranslationFunction;
}

// Defines a key for accessing specific translation strings or functions.
// Using 'string' for flexibility, but could be a union of all actual keys for stricter typing.
export type TranslationKey = string;

// Defines the structure for holding all translation sets (e.g., for 'en' and 'id').
export interface TranslationSet {
  en: Translations;
  id: Translations;
}

export interface PromptComponent {
  id: string;
  value: string;
  label: TranslationKey; // Ensured this is a TranslationKey
  example?: TranslationKey; // Ensured this is a TranslationKey
}

export interface FrameworkComponentDetail {
  id: string;
  label: TranslationKey; 
  example: TranslationKey;
  tooltip?: TranslationKey; // V7: Added for detailed guidance
}

export type InteractiveQuestionType = 'manual' | 'single-choice' | 'multiple-choice';

export interface InteractiveQuestionDefinition {
  id: string;
  promptText: string; // This will be a TranslationKey or direct string
  type: InteractiveQuestionType; // Added missing type property
  options?: string[]; // For single/multiple choice, these are direct strings, localization handled by mapping if needed.
  includeOtherOption?: boolean; 
  defaultValue?: string | string[]; 
  tooltip?: TranslationKey; // Added optional tooltip property
}

export interface InteractiveSectionDefinition {
  title: string; // This will be a TranslationKey or direct string
  questions: InteractiveQuestionDefinition[];
}

export interface FrameworkStrings {
  name: TranslationKey; 
  shortName: TranslationKey; 
  description: TranslationKey; 
  shortDescription: TranslationKey; // V7: Added for framework cards
  components: FrameworkComponentDetail[];
  category: 'text' | 'media' | 'music';
  toolLink?: string; // Direct URL
  genericToolLinks?: { name: string; url: string }[]; // Name can be TranslationKey or direct string
  interactiveDefinition?: InteractiveSectionDefinition[];
  interactivePromptTemplate?: string; // Template string with placeholders
  predefinedOptions?: Record<string, string[]>; // Options are direct strings
  examplePrompts?: { prompt: string; output: string; }[]; // Direct strings
}

export interface Framework {
  id: string; // Unique identifier
  idLocale: FrameworkStrings;
  enLocale: FrameworkStrings;
}

export interface SavedPrompt {
  id: number;
  timestamp: number;
  name: string;
  frameworkId: string | null; 
  category: 'text' | 'media' | 'music';
  promptComponents: PromptComponent[]; // Values are user input, labels/examples are keys
  interactiveFormValues: Record<string, string | string[]>; 
  otherInputValues: Record<string, string>; 
  userDefinedInteraction: string;
  generatedPrompt: string; 
  promptToCopy: string; 
  language: Language; 
  selectedFrameworkName: string; // Actual translated name at time of save
  notes?: string; // V7: Added for personal notes
}

export interface WebResearchDataSource {
  title: string;
  uri: string;
}