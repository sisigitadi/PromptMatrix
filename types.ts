
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
  initialPromptAreaInstructionNoApiKey: string; // Added new key
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
  // disclaimerPoint4: string; // Removed
  disclaimerContactPrompt: string;
  disclaimerModalAcknowledgeButton: string;
  // disclaimerAiFeatureNote: string; // Removed
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
  howToUseStep6: string;
  howToUseTip: string; 
  howToUseSwitchToEnglish: string;
  howToUseSwitchToIndonesian: string;
  howToUseDiagramTitle: string;

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
  aiPoweredFeatureTooltip: string; 
  aiFeaturesActiveIndicator: string; 
  geminiInstructionForFrameworkSuggestion: (frameworksInfoJson: string) => string;

  // Diagram steps
  diagramStep1: string;
  diagramStep2: string;
  diagramStep3: string;
  diagramStep4: string;
  diagramStep5: string;
  diagramStep6: string;

  // Labels for Interactive Prompt Assembly
  promptLabel_subject?: string;
  promptLabel_action_details?: string;
  promptLabel_art_style?: string;
  promptLabel_art_medium?: string;
  promptLabel_artist_influence?: string;
  promptLabel_artist_influences?: string;
  promptLabel_composition?: string;
  promptLabel_lighting?: string;
  promptLabel_color_palette?: string;
  promptLabel_detail_level?: string;
  promptLabel_aspect_ratio?: string;
  promptLabel_negative_prompt_elements?: string;
  promptLabel_custom_negative?: string;
  promptLabel_other_tool_params?: string;
  promptLabel_environment?: string;
  promptLabel_atmosphere?: string;
  promptLabel_version?: string;
  promptLabel_stylize?: string;
  promptLabel_chaos?: string;
  promptLabel_weird?: string;
  promptLabel_tile?: string;
  promptLabel_image_weight?: string;
  promptLabel_style_raw?: string;
  promptLabel_other_params?: string;
  promptLabel_scene_description?: string;
  promptLabel_specific_details?: string;
  promptLabel_color_focus?: string;
  promptLabel_lighting_mood?: string;
  promptLabel_composition_angle?: string;
  promptLabel_aspect_ratio_dalle?: string;
  promptLabel_main_subject?: string;
  promptLabel_key_details?: string;
  promptLabel_quality_descriptors?: string;
  promptLabel_art_style_medium?: string;
  promptLabel_technical_aspects?: string;
  promptLabel_camera_shot?: string;
  promptLabel_lighting_style?: string;
  // promptLabel_negative_elements?: string; // Duplicate, ensure consistency or remove if covered
  promptLabel_custom_negative_prompt?: string;
  promptLabel_param_info?: string;
  promptLabel_subjek?: string;
  promptLabel_aksi?: string;
  promptLabel_lokasi?: string;
  promptLabel_gaya?: string;
  promptLabel_mood?: string;
  promptLabel_warna?: string;
  promptLabel_shot?: string;
  promptLabel_angle?: string;
  promptLabel_movement?: string;
  promptLabel_cahaya?: string;
  promptLabel_kualitas?: string;
  promptLabel_elemen_spesifik?: string;
  promptLabel_negative?: string;
  promptLabel_scene_subject?: string;
  promptLabel_subject_action?: string;
  promptLabel_camera_movement?: string;
  promptLabel_visual_style?: string;
  promptLabel_lighting_atmosphere?: string;
  promptLabel_environment_action?: string;
  promptLabel_sound_design_note?: string;
  promptLabel_duration_note?: string;
  promptLabel_genre?: string;
  promptLabel_subgenre_modifiers?: string;
  promptLabel_main_instruments?: string;
  promptLabel_vocal_style?: string;
  promptLabel_tempo?: string;
  promptLabel_rhythm_description?: string;
  promptLabel_song_structure?: string;
  promptLabel_lyrics_theme?: string;
  promptLabel_custom_lyrics_section?: string;
  promptLabel_main_genre?: string;
  promptLabel_subgenre_style?: string;
  promptLabel_song_structure_desc?: string;
  promptLabel_duration_or_specifics?: string;
  promptLabel_lyrical_theme_or_custom?: string;

  // New keys for category button labels
  categoryLabelImage: string;
  categoryLabelVideo: string;
  categoryLabelMusic: string; 
  categoryLabelText: string; 

  frameworkWord: string; 
}

export type TranslationKey = keyof Translations;

export interface TranslationSet {
  en: Partial<Record<TranslationKey, string | ((...args: any[]) => string)>>;
  id: Partial<Record<TranslationKey, string | ((...args: any[]) => string)>>;
}