// e:\Projects\Ai\PromptMatrix_Local\types.ts

export type Language = 'en' | 'id';

export type TranslationKey = string; // Atau bisa lebih spesifik jika Anda punya daftar kunci terjemahan

export type TranslationFunction = (...args: any[]) => string;

export interface Translations {
  [key: string]: string | string[] | TranslationFunction;
}

export interface FrameworkComponent {
  id: string;
  name: string;
  placeholder?: string;
  example?: string;
  tooltip?: string;
  options?: string[]; // Untuk dropdown/checkbox
}

export interface FrameworkTranslation {
  name?: string;
  description?: string;
  components?: FrameworkComponent[];
  predefinedOptions?: string[];
}

export interface Framework {
  id: string;
  name: string;
  category: 'text' | 'image' | 'video' | 'music';
  description: string;
  shortDescription?: string;
  components?: FrameworkComponent[];
  predefinedOptions?: string[];
  genericToolLinks?: string[];
  toolLink?: string;
  translations?: {
    id?: FrameworkTranslation;
  };
}

export interface PromptComponent {
  id: string;
  value: string;
}