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

export interface SavedPrompt {
  id: number; // Auto-incrementing ID from IndexedDB
  name: string;
  frameworkId: string | null;
  category: 'text' | 'media' | 'music';
  promptComponents: PromptComponent[];
  interactiveFormValues: Record<string, string | string[]>;
  otherInputValues: Record<string, string>;
  userDefinedInteraction: string;
  timestamp: number;
  generatedPrompt: string; // For quick preview in stash
  promptToCopy: string; // The actual prompt to be used
  language: Language; // Language at the time of saving
  selectedFrameworkName?: string; // Store for display
}

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
  initialPromptAreaInstructionNoApiKey: string; 
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
  disclaimerContactPrompt: string;
  disclaimerModalAcknowledgeButton: string;
  disclaimerAcknowledgeButtonDisabledText: (seconds: number) => string;
  disclaimerSwitchToEnglish: string;
  disclaimerSwitchToIndonesian: string;

  howToUseAppTitle: string;
  howToUseAppTitleShort: string; 
  howToUseStep1: string;
  howToUseStep2: string;
  howToUseStep3: string;
  howToUseStep4: string;
  howToUseStep5: string;
  howToUseStep5b: string; 
  howToUseStep6: string;
  howToUseTip: string; 
  howToUseSwitchToEnglish: string;
  howToUseSwitchToIndonesian: string;
  howToUseDiagramTitle: string;

  diagramStep1: string;
  diagramStep2: string;
  diagramStep3: string;
  diagramStep4: string;
  diagramStep5: string;
  diagramStep6: string;
  
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

  interactiveFormOptionOtherLabel: string;
  interactiveFormOptionOtherPlaceholder: string;
  interactiveFormMultipleChoiceHelpText: string;
  interactiveFormManualInputPlaceholder: string;

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
  aiPoweredFeatureTooltip: string; 
  aiFeaturesActiveIndicator: string; 
  aiFeaturesDisconnectedIndicator: string;
  geminiInstructionForFrameworkSuggestion: (frameworksInfoJson: string) => string;
  aiFeatureRequiresSubscriptionTooltip: string;
  aiFeaturesRequireSubscriptionMessage: string;
  freePlanBadge: string;
  premiumPlanBadge: string;
  freePlanTooltip: string;
  premiumPlanTooltip: string;
  subscriptionInfoModalTitle: string;
  subscriptionInfoButtonText: string;
  switchToEnglish: string;
  switchToIndonesian: string;
  subscriptionModalIntro: string;
  subscriptionModalFreeFeaturesTitle: string;
  subscriptionModalFreeFeature1: string;
  subscriptionModalFreeFeature2: string;
  subscriptionModalFreeFeature3: string;
  subscriptionModalFreeFeature4: string;
  subscriptionModalPremiumFeaturesTitle: string;
  subscriptionModalPremiumFeature1: string;
  subscriptionModalPremiumFeature2: string;
  subscriptionModalPremiumFeature3: string;
  subscriptionModalPremiumFeature4: string;
  subscriptionModalComingSoon: string;
  teaserPopupTitle: string;
  teaserPopupMessage: string;

  promptLabel_subject?: string;
  promptLabel_action_details?: string;
  // ... (keep all other promptLabel_ keys) ...
  promptLabel_lyrical_theme_or_custom?: string;

  categoryLabelImage: string;
  categoryLabelVideo: string;
  categoryLabelMusic: string; 
  categoryLabelText: string; 
  frameworkWord: string;

  promptStashTitle: string;
  promptStashDescription: string;
  savePromptButton: string;
  savePromptButtonAria: string;
  loadPromptButton: string;
  deletePromptButton: string;
  renamePromptButton: string;
  promptNameInputPlaceholder: string;
  noSavedPrompts: string;
  confirmDeletePromptTitle: string;
  confirmDeletePromptMessage: (promptName: string) => string;
  confirmButton: string;
  cancelButton: string;
  promptSavedSuccess: string;
  promptLoadedSuccess: string;
  promptDeletedSuccess: string;
  promptRenamedSuccess: string;
  errorSavingPrompt: string;
  errorLoadingPrompts: string;
  errorDeletingPrompt: string;
  errorRenamingPrompt: string;
  errorUnsupportedBrowserDB: string;
  exportPromptsButton: string;
  exportPromptsButtonAria: string;
  importPromptsButton: string;
  importPromptsButtonAria: string;
  promptsExportedSuccess: string;
  promptsImportedSuccess: (count: number) => string;
  errorExportingPrompts: string;
  errorImportingPrompts: string;
  selectJsonFile: string;
  searchInStashPlaceholder: string;

  searchFrameworksPlaceholder: string;
  noFrameworksFoundError: string;

  favoriteFrameworkTooltipAdd: string;
  favoriteFrameworkTooltipRemove: string;
  favoriteFrameworksSectionTitle: string; 

  analyzeButtonText: string;
  analyzeButtonLoadingText: string;
  analyzeButtonTitle: string;
  analyzeButtonAria: string;
  detailedAnalysisTitle: string;
  detailedAnalysisLoading: string;
  aiDetailedAnalysisError: string;
  detailedAnalysisReceivedIndicatorTooltip: string;
  geminiDetailedAnalysisInstruction: string;
  initialDetailedAnalysisInstruction: string; 
  detailedAnalysisClarityScoreTitle: string;
  detailedAnalysisSpecificityScoreTitle: string;
  detailedAnalysisAmbiguitiesTitle: string;
  detailedAnalysisSuggestionsTitle: string;
  detailedAnalysisOverallAssessmentTitle: string;

  activityFetchingSuggestions: string;
  activityTranslatingContent: string;
  activityAnalyzingPrompt: string;
  activityGettingFeedback: string;
  premiumFeatureTitleSuffix: string; // Added this line
}

export type TranslationKey = keyof Translations;

export interface TranslationSet {
  en: Partial<Record<TranslationKey, string | ((...args: any[]) => string)>>;
  id: Partial<Record<TranslationKey, string | ((...args: any[]) => string)>>;
}