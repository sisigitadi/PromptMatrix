export interface PromptComponent {
  id: string;
  value: string;
  label: string; 
  example?: string; 
}

export interface FrameworkComponentDetail {
  id: string; 
  example: string; 
}

// --- Definisi untuk Mode Interaktif ---
export type InteractiveQuestionType = 'manual' | 'single-choice' | 'multiple-choice';

export interface InteractiveQuestionDefinition {
  id: string; // Harus unik dalam framework, akan digunakan sebagai kunci dalam state jawaban
  promptText: string; // Teks pertanyaan yang ditampilkan ke pengguna
  type: InteractiveQuestionType;
  options?: string[]; // Untuk 'single-choice' dan 'multiple-choice'
  includeOtherOption?: boolean; // Untuk 'single-choice', jika true, opsi "Lainnya" akan ditambahkan
  defaultValue?: string | string[]; // Nilai default untuk pertanyaan
}

export interface InteractiveSectionDefinition {
  title: string; // Judul bagian, e.g., "Bagian 1: Konsep Inti"
  questions: InteractiveQuestionDefinition[];
}
// --- Akhir Definisi Mode Interaktif ---


export interface FrameworkStrings {
  name: string;
  shortName: string;
  description: string;
  components: FrameworkComponentDetail[];
  examples?: Record<string, string>;
  category: 'text' | 'media' | 'music'; 
  predefinedOptions?: Record<string, string[]>; 
  toolLink?: string; 
  genericToolLinks?: { name: string; url: string }[];
  interactiveDefinition?: InteractiveSectionDefinition[]; // Opsional: Untuk mode interaktif
  interactivePromptTemplate?: string; // Opsional: Templat string untuk merakit prompt dari jawaban interaktif
}

export interface Framework {
  id: string;
  idLocale: FrameworkStrings;
  enLocale: FrameworkStrings;
}

export type Language = 'id' | 'en';

export interface Translations {
  appTitle: string;
  appSubtitle: string; 
  textFrameworksTitle: string;
  mediaFrameworksTitle: string;
  musicFrameworksTitle: string; 
  inputComponentsTitle: string;
  clearInputsButton: string;
  clearInputsButtonAria: string;
  generatedPromptTitle: string;
  footerOptimize: string;
  footerContactMe: string;
  initialPromptAreaInstruction: string;
  selectFrameworkPromptAreaInstruction: string; 
  nothingToCopyMessage: string;
  noInputComponents: string;
  inputFieldDescription: (componentName: string, frameworkShortName: string) => string;
  inputFieldPlaceholder: (componentName: string) => string;
  promptTemplatePlaceholder: (componentName: string) => string; 
  copyButtonTitle: string;
  copiedButtonTitle: string;
  copySuccessMessage: string;
  copyToClipboardAria: string;
  promptCopiedAria: string;
  languageID: string;
  languageEN: string;
  userDefinedInteractionLabel: string;
  userDefinedInteractionPlaceholder: string;
  copyButtonText: string; 
  copiedButtonText: string; 
  noExamplesAvailable: string;
  launchToolButtonText: string; 
  launchToolButtonAria: (toolName?: string) => string; 
  toolSelectorModalTitle: string; 
  customToolUrlInputLabel: string; 
  customToolUrlInputPlaceholder: string; 
  customToolUrlButtonText: string; 
  customToolUrlButtonAria: string; 
  disclaimerTitle: string;
  disclaimerPoint1: string;
  disclaimerPoint2: string;
  disclaimerPoint3: string;
  disclaimerPoint4: string;
  disclaimerContactPrompt: string;
  disclaimerModalAcknowledgeButton: string;
  disclaimerAiFeatureNote: string; 

  howToUseAppTitle: string;
  howToUseAppTitleShort: string; 
  howToUseStep1: string;
  howToUseStep2: string;
  howToUseStep3: string;
  howToUseStep4: string;
  howToUseStep5: string;
  howToUseStep6: string;
  howToUseStep7: string;
  howToUseStep8: string;
  textFrameworksCategoryTooltip: string;
  mediaFrameworksCategoryTooltip: string;
  musicFrameworksCategoryTooltip: string;
  selectCategoryTitle: string;
  selectCategoryInstruction: string;
  selectSpecificFrameworkInputSummary: string;
  selectSpecificFrameworkOutputSummary: string;
  clickToExpandInputPanel: (frameworkName: string) => string;
  clickToExpandOutputPanel: string;
  selectOptionTooltip: string; 

  enhanceButtonText: string;
  enhanceButtonLoadingText: string;
  enhanceButtonTitle: string;
  enhanceButtonAria: string;
  aiFeedbackTitle: string; 
  aiFeedbackTitleTextOnly: string; 
  aiFeedbackLoading: string;
  aiEnhancementError: string;
  apiKeyMissingError: string;
  emptyPromptError: string;
  geminiPromptInstruction: string;
  aiFeedbackReceivedIndicatorTooltip: string; 
  promptHasBeenCopiedIndicatorTooltip: string; 
  
  aiFeedbackStrengthsTitle: string;
  aiFeedbackWeaknessesTitle: string;
  aiFeedbackReasoningTitle: string;
  aiFeedbackActionableSuggestionsTitle: string; 

  suggestButtonTitle: string;
  suggestionsLoading: string;
  suggestionsError: string;
  noSuggestionsFound: string;
  geminiInstructionForAutocomplete: (componentName: string, frameworkName: string, currentValue: string) => string;

  translationInProgress: string;
  translationGeneralError: string;

  // Teks untuk InteractivePromptBuilder
  interactiveFormOptionOtherLabel: string;
  interactiveFormOptionOtherPlaceholder: string;
  interactiveFormMultipleChoiceHelpText: string;
  interactiveFormManualInputPlaceholder: string;

  // Kunci untuk fitur Saran Kerangka Kerja AI
  userGoalInputLabel: string;
  userGoalInputPlaceholder: string;
  getFrameworkSuggestionsButton: string;
  getFrameworkSuggestionsButtonAria: string;
  frameworkSuggestionsLoading: string;
  frameworkSuggestionsError: string;
  suggestedFrameworkTooltip: string;
  noFrameworkSuggestionsFound: string;
  frameworkSuggestionInstruction: string;
  frameworkSuggestionsTitle: string;
  aiPoweredFeatureTooltip: string; // Tooltip umum untuk fitur AI
  geminiInstructionForFrameworkSuggestion: (frameworksInfoJson: string) => string;
}

export type TranslationKey = keyof Translations;

export interface TranslationSet {
  en: Partial<Record<TranslationKey, string | ((...args: any[]) => string)>>;
  id: Partial<Record<TranslationKey, string | ((...args: any[]) => string)>>;
}