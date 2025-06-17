
export type Language = 'en' | 'id';

export type TranslationFunction = (...args: any[]) => string;

// Defines the structure for translations within a single language.
// It allows for simple string translations or functions for dynamic translations.
export interface Translations {
  [key: string]: string | TranslationFunction;
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
  label: string;
  example?: string;
}

export interface FrameworkComponentDetail {
  id: string;
  label: string; 
  example: string;
}

export type InteractiveQuestionType = 'manual' | 'single-choice' | 'multiple-choice';

export interface InteractiveQuestionDefinition {
  id: string;
  promptText: string; 
  type: InteractiveQuestionType;
  options?: string[]; 
  includeOtherOption?: boolean; 
  defaultValue?: string | string[]; 
}

export interface InteractiveSectionDefinition {
  title: string; 
  questions: InteractiveQuestionDefinition[];
}

export interface FrameworkStrings {
  name: string;
  shortName: string;
  description: string;
  components: FrameworkComponentDetail[];
  category: 'text' | 'media' | 'music';
  toolLink?: string;
  genericToolLinks?: { name: string; url: string }[];
  interactiveDefinition?: InteractiveSectionDefinition[];
  interactivePromptTemplate?: string;
  predefinedOptions?: Record<string, string[]>; 
}

export interface Framework {
  id: string;
  idLocale: FrameworkStrings;
  enLocale: FrameworkStrings;
}

export interface SavedPrompt {
  id: number;
  timestamp: number;
  name: string;
  frameworkId: string | null; 
  category: 'text' | 'media' | 'music';
  promptComponents: PromptComponent[];
  interactiveFormValues: Record<string, string | string[]>; 
  otherInputValues: Record<string, string>; 
  userDefinedInteraction: string;
  generatedPrompt: string; 
  promptToCopy: string; 
  language: Language; 
  selectedFrameworkName: string; 
}

export interface WebResearchDataSource {
  title: string;
  uri: string;
}