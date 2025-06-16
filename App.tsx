
import React, { useState, useEffect, useCallback, ReactNode, useRef, ReactElement } from 'react';
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import InputField from './components/InputField.tsx';
import PromptOutput from './components/PromptOutput.tsx';
import InteractivePromptBuilder from './components/InteractivePromptBuilder.tsx';
import { Framework, Language, PromptComponent, FrameworkComponentDetail, InteractiveQuestionDefinition, InteractiveQuestionType, TranslationKey, SavedPrompt } from './types.ts';
import { useLanguage } from './contexts/LanguageContext.tsx';
import { EraserIcon } from './components/icons/EraserIcon.tsx';
import DisclaimerModal from './components/DisclaimerModal.tsx';
import HowToUseModal from './components/HowToUseModal.tsx';
import SubscriptionInfoModal from './components/SubscriptionInfoModal.tsx';
import TeaserPopupModal from './components/TeaserPopupModal.tsx';
import { AppLogoIcon } from './components/icons/AppLogoIcon.tsx';
import { ChevronDownIcon } from './components/icons/ChevronDownIcon.tsx';
import { ChevronUpIcon } from './components/icons/ChevronUpIcon.tsx';
import { StarIcon } from './components/icons/StarIcon.tsx';
import { GmailIcon } from './components/icons/GmailIcon.tsx';
import { GithubIcon } from './components/icons/GithubIcon.tsx';
import { MediumIcon } from './components/icons/MediumIcon.tsx';
import { PencilIcon } from './components/icons/PencilIcon.tsx';
import { CameraIcon } from './components/icons/CameraIcon.tsx';
import { MusicNoteIcon } from './components/icons/MusicNoteIcon.tsx';
import PromptStashPanel from './components/PromptStashPanel.tsx';
import GlobalActivityIndicator from './components/GlobalActivityIndicator.tsx';
import { addPromptToDB, getAllPromptsFromDB, deletePromptFromDB, updatePromptInDB, getPromptByIdFromDB } from './db.ts';
import { BadgeCheckIcon } from './components/icons/BadgeCheckIcon.tsx';


import {
  frameworks,
  detailedImageVideoTemplate,
  detailedMusicTemplate,
  midjourneyTemplate,
  dalle3Template,
  stableDiffusionTemplate,
  veoInteractivePromptTemplate,
  runwayGen2Template,
  sunoAITemplate,
  midjourneyVersionOptions,
  midjourneyVersionOptionsEn
} from './frameworks.ts';

// Helper function to compare arrays (used for multiple-choice fields)
const areArraysEqual = (array1: any[] | undefined, array2: any[] | undefined): boolean => {
  if (array1 === undefined && array2 === undefined) return true;
  if (array1 === undefined || array2 === undefined) return false;
  if (array1.length !== array2.length) return false;
  const sorted1 = [...array1].sort();
  const sorted2 = [...array2].sort();
  return sorted1.every((value, index) => value === sorted2[index]);
};

// Helper to convert field value to string for prompt
const effectiveValueToString = (
    currentValue: string | string[] | undefined,
    otherTextValue?: string // Only relevant if currentValue is LAINNYA_INTERAKTIF_PLACEHOLDER
): string => {
    if (currentValue === 'LAINNYA_INTERAKTIF_PLACEHOLDER') {
        return (otherTextValue || '').trim();
    }
    if (Array.isArray(currentValue)) {
        return currentValue.join(', ').trim();
    }
    return (currentValue as string || '').trim();
};

const APP_VERSION = "V6.0.0"; 

const App: React.FC = (): ReactElement => {
  const { language, setLanguage, t } = useLanguage();
  const [selectedFramework, setSelectedFramework] = useState<Framework | null>(null);
  const [promptComponents, setPromptComponents] = useState<PromptComponent[]>([]);
  const [userDefinedInteraction, setUserDefinedInteraction] = useState<string>('');
  const [generatedPrompt, setGeneratedPrompt] = useState<string>('');
  const [promptToCopy, setPromptToCopy] = useState<string>('');

  const initialHasShownModalsFromStorage = localStorage.getItem('hasShownInitialModalsV6') === 'true';
  const [hasShownInitialModals, setHasShownInitialModals] = useState<boolean>(initialHasShownModalsFromStorage);

  const [showDisclaimer, setShowDisclaimer] = useState<boolean>(!initialHasShownModalsFromStorage);
  const [showHowToUse, setShowHowToUse] = useState<boolean>(false);
  const [isHowToUseModalShownAutomatically, setIsHowToUseModalShownAutomatically] = useState<boolean>(false);
  const [showSubscriptionInfoModal, setShowSubscriptionInfoModal] = useState<boolean>(false);
  const [showTeaserPopup, setShowTeaserPopup] = useState<boolean>(false);

  const [selectedCategory, setSelectedCategory] = useState<'text' | 'media' | 'music'>('text');

  const [isInputPanelExpanded, setIsInputPanelExpanded] = useState<boolean>(true);
  const [isOutputPanelExpanded, setIsOutputPanelExpanded] = useState<boolean>(true);

  const [aiFeedback, setAiFeedback] = useState<string | null>(null);
  const [isFetchingAiFeedback, setIsFetchingAiFeedback] = useState<boolean>(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiFeedbackReceived, setAiFeedbackReceived] = useState<boolean>(false);
  const [hasCurrentPromptBeenCopied, setHasCurrentPromptBeenCopied] = useState<boolean>(false);

  const [detailedAiAnalysis, setDetailedAiAnalysis] = useState<string | null>(null);
  const [isFetchingDetailedAnalysis, setIsFetchingDetailedAnalysis] = useState<boolean>(false);
  const [detailedAnalysisError, setDetailedAnalysisError] = useState<string | null>(null);
  const [detailedAiAnalysisReceived, setDetailedAiAnalysisReceived] = useState<boolean>(false);

  const [translationError, setTranslationError] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const previousLanguageRef = useRef<Language>(language);

  const [interactiveFormValues, setInteractiveFormValues] = useState<Record<string, string | string[]>>({});
  const [otherInputValues, setOtherInputValues] = useState<Record<string, string>>({});

  const [userGoalForFramework, setUserGoalForFramework] = useState<string>('');
  const [suggestedFrameworkIds, setSuggestedFrameworkIds] = useState<string[]>([]);
  const [isFetchingFrameworkSuggestions, setIsFetchingFrameworkSuggestions] = useState<boolean>(false);
  const [frameworkSuggestionError, setFrameworkSuggestionError] = useState<string | null>(null);

  const [trueInitialDefaults, setTrueInitialDefaults] = useState<Record<string, string | string[]>>({});

  // --- API KEY LOGIC ADHERING TO GUIDELINES ---
  const apiKeyFromEnv = process.env.API_KEY; // This value is injected by Vite's define config.

  let resolvedApiKey: string | null = null;

  if (typeof apiKeyFromEnv === 'string' && apiKeyFromEnv.trim() !== '' && apiKeyFromEnv.trim() !== "undefined") {
      // The string "undefined" can occur if the env var was not set when Vite ran.
      resolvedApiKey = apiKeyFromEnv.trim();
  }
  
  // The GoogleGenAI constructor now correctly expects an object { apiKey: string }
  const aiClient = resolvedApiKey ? new GoogleGenAI({ apiKey: resolvedApiKey }) : null;
  const apiKeyAvailable = !!aiClient; // True if the client could be initialized.
  // --- END OF API KEY LOGIC ---

  const [savedPrompts, setSavedPrompts] = useState<SavedPrompt[]>([]);
  const [isDBLoading, setIsDBLoading] = useState<boolean>(true);
  const [dbError, setDbError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<{type: 'success' | 'error', message: string} | null>(null);

  const [frameworkSearchTerm, setFrameworkSearchTerm] = useState<string>('');
  const [favoriteFrameworkIds, setFavoriteFrameworkIds] = useState<string[]>([]);
  const [globalActivityMessage, setGlobalActivityMessage] = useState<string | null>(null);

  useEffect((): (() => void) | undefined => {
    if (hasShownInitialModals && localStorage.getItem('shownTeaserPopupV6_0_0') !== 'true') {
      const timer = setTimeout(() => {
        setShowTeaserPopup(true);
        localStorage.setItem('shownTeaserPopupV6_0_0', 'true'); // Use version specific key
      }, 500); 
      return () => clearTimeout(timer);
    }
    return undefined; // Explicitly return undefined if condition is not met
  }, [hasShownInitialModals]);

  useEffect((): void => {
    if (isFetchingAiFeedback) {
      setGlobalActivityMessage(t('activityGettingFeedback'));
    } else if (isFetchingDetailedAnalysis) {
      setGlobalActivityMessage(t('activityAnalyzingPrompt'));
    } else if (isFetchingFrameworkSuggestions) {
      setGlobalActivityMessage(t('activityFetchingSuggestions'));
    } else if (isTranslating && apiKeyAvailable) { // Only show translating message if AI translation is possible
      setGlobalActivityMessage(t('activityTranslatingContent'));
    } else {
      setGlobalActivityMessage(null);
    }
  }, [isFetchingAiFeedback, isFetchingDetailedAnalysis, isFetchingFrameworkSuggestions, isTranslating, t, apiKeyAvailable]);

  useEffect((): void => {
    const storedFavorites = localStorage.getItem('favoriteFrameworkIds');
    if (storedFavorites) {
      try {
        const parsedFavorites = JSON.parse(storedFavorites);
        if (Array.isArray(parsedFavorites) && parsedFavorites.every(id => typeof id === 'string')) {
          setFavoriteFrameworkIds(parsedFavorites);
        }
      } catch (e) {
        console.error("Error parsing favorite frameworks from localStorage:", e);
      }
    }
  }, []);

  useEffect((): void => {
    localStorage.setItem('favoriteFrameworkIds', JSON.stringify(favoriteFrameworkIds));
  }, [favoriteFrameworkIds]);

  useEffect((): (() => void) | undefined => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [toastMessage]);

  const showToast = useCallback((type: 'success' | 'error', messageKey: TranslationKey, ...args: any[]) => {
    setToastMessage({ type, message: t(messageKey, ...args) });
  },[t]);

  const loadPromptsFromDB = useCallback(async () => {
    setIsDBLoading(true);
    setDbError(null);
    try {
      if (!('indexedDB' in window)) {
        throw new Error(t('errorUnsupportedBrowserDB'));
      }
      const prompts = await getAllPromptsFromDB();
      setSavedPrompts(prompts);
    } catch (error: any) {
      console.error(error);
      setDbError(error.message || t('errorLoadingPrompts'));
      showToast('error', 'errorLoadingPrompts');
    } finally {
      setIsDBLoading(false);
    }
  }, [t, showToast]);

  useEffect((): void => {
    loadPromptsFromDB();
  }, [loadPromptsFromDB]);

  const clearAiStates = () => {
    setAiFeedback(null);
    setAiError(null);
    setAiFeedbackReceived(false);
    setDetailedAiAnalysis(null);
    setDetailedAnalysisError(null);
    setDetailedAiAnalysisReceived(false);
  };

  const handleSavePrompt = async () => {
    if (!promptToCopy.trim() || !selectedFramework) {
      showToast('error', 'nothingToCopyMessage');
      return;
    }
    const promptName = window.prompt(t('promptNameInputPlaceholder'), selectedFramework[language === 'id' ? 'idLocale' : 'enLocale'].name + " - " + new Date().toLocaleTimeString());
    if (!promptName || !promptName.trim()) return;

    const newSavedPromptData: Omit<SavedPrompt, 'id' | 'timestamp'> = {
      name: promptName.trim(),
      frameworkId: selectedFramework.id,
      category: selectedCategory,
      promptComponents: [...promptComponents],
      interactiveFormValues: {...interactiveFormValues},
      otherInputValues: {...otherInputValues},
      userDefinedInteraction: userDefinedInteraction,
      generatedPrompt: generatedPrompt,
      promptToCopy: promptToCopy,
      language: language,
      selectedFrameworkName: selectedFramework[language === 'id' ? 'idLocale' : 'enLocale'].name,
    };

    try {
      await addPromptToDB(newSavedPromptData);
      loadPromptsFromDB(); 
      showToast('success', 'promptSavedSuccess');
    } catch (error) {
      console.error(error);
      showToast('error', 'errorSavingPrompt');
    }
  };

  const handleLoadPrompt = async (promptId: number) => {
    try {
      const promptToLoad = await getPromptByIdFromDB(promptId);
      if (promptToLoad) {
        const targetLanguage = promptToLoad.language;
        
        // Logic for language switching when loading a prompt
        if (targetLanguage !== language) {
            previousLanguageRef.current = language; // Store current language before switching
            setLanguage(targetLanguage); // Switch UI language first
            // The useEffect for language change or selectedFramework change should handle content reset/translation
        }
        
        const frameworkToLoad = frameworks.find(fw => fw.id === promptToLoad.frameworkId);
        if (frameworkToLoad) {
          setSelectedCategory(promptToLoad.category); 
          setSelectedFramework(frameworkToLoad); // This will trigger its own useEffect to set defaults

          // Delay slightly to ensure language and framework states are settled
          // before populating with saved values.
          setTimeout(() => {
            const currentLocale = targetLanguage === 'id' ? frameworkToLoad.idLocale : frameworkToLoad.enLocale;
            const calculatedTrueDefaults = getTrueInitialFrameworkDefaultsInternal(currentLocale);
            setTrueInitialDefaults(calculatedTrueDefaults);

            // Populate with saved values
            setPromptComponents(promptToLoad.promptComponents.map(pc => ({...pc})));
            setInteractiveFormValues({...promptToLoad.interactiveFormValues});
            setOtherInputValues({...promptToLoad.otherInputValues});
            setUserDefinedInteraction(promptToLoad.userDefinedInteraction);
            
            setGeneratedPrompt(promptToLoad.generatedPrompt);
            setPromptToCopy(promptToLoad.promptToCopy);

            clearAiStates();
            setHasCurrentPromptBeenCopied(false);
            resetFrameworkSuggestionStates(); 
            showToast('success', 'promptLoadedSuccess');
            if (window.innerWidth < 768) {
                setIsInputPanelExpanded(true);
                setIsOutputPanelExpanded(true);
            }
          }, 100); // Increased delay slightly

        } else {
          showToast('error', 'errorLoadingPrompts');
        }
      } else {
        showToast('error', 'errorLoadingPrompts');
      }
    } catch (error) {
      console.error(error);
      showToast('error', 'errorLoadingPrompts');
    }
  };

  const handleDeletePrompt = async (promptId: number) => {
    try {
      await deletePromptFromDB(promptId);
      loadPromptsFromDB();
      showToast('success', 'promptDeletedSuccess');
    } catch (error) {
      console.error(error);
      showToast('error', 'errorDeletingPrompt');
    }
  };

  const handleRenamePrompt = async (promptId: number, newName: string) => {
    try {
      const promptToUpdate = await getPromptByIdFromDB(promptId);
      if (promptToUpdate) {
        await updatePromptInDB({ ...promptToUpdate, name: newName });
        loadPromptsFromDB();
        showToast('success', 'promptRenamedSuccess');
      }
    } catch (error) {
      console.error(error);
      showToast('error', 'errorRenamingPrompt');
    }
  };

  const toggleFavoriteFramework = (frameworkId: string) => {
    setFavoriteFrameworkIds(prevFavorites => {
      if (prevFavorites.includes(frameworkId)) {
        return prevFavorites.filter(id => id !== frameworkId);
      } else {
        return [...prevFavorites, frameworkId];
      }
    });
  };

  const handleDisclaimerAcknowledge = () => {
    setShowDisclaimer(false);
    if (!hasShownInitialModals) {
      setShowHowToUse(true);
      setIsHowToUseModalShownAutomatically(true);
    } else {
        if (localStorage.getItem('shownTeaserPopupV6_0_0') !== 'true') {
            setShowTeaserPopup(true);
            localStorage.setItem('shownTeaserPopupV6_0_0', 'true');
        }
    }
  };

  const handleHowToUseClose = () => {
    setShowHowToUse(false);
    if (isHowToUseModalShownAutomatically) {
      setHasShownInitialModals(true);
      localStorage.setItem('hasShownInitialModalsV6', 'true');
      setIsHowToUseModalShownAutomatically(false);
      if (localStorage.getItem('shownTeaserPopupV6_0_0') !== 'true') {
        setShowTeaserPopup(true);
        localStorage.setItem('shownTeaserPopupV6_0_0', 'true');
      }
    }
  };

  const getTrueInitialFrameworkDefaultsInternal = useCallback((frameworkLocale: Framework['idLocale'] | Framework['enLocale']): Record<string, string | string[]> => {
    const defaults: Record<string, string | string[]> = {};
    if (frameworkLocale.interactiveDefinition) {
      frameworkLocale.interactiveDefinition.forEach(section => {
        section.questions.forEach(question => {
          if (question.defaultValue !== undefined) {
            defaults[question.id] = question.defaultValue;
          } else if (question.type === 'multiple-choice') {
            defaults[question.id] = [];
          } else if (question.type === 'single-choice' && question.options && question.options.length > 0) {
            defaults[question.id] = question.options[0];
          } else {
            defaults[question.id] = '';
          }
        });
      });
    }
    return defaults;
  }, []);

  const computeInitialDisplayFormState = useCallback((frameworkLocale: Framework['idLocale'] | Framework['enLocale'], currentTrueDefaults: Record<string, string | string[]>): Record<string, string | string[]> => {
    const formInitialDisplayState: Record<string, string | string[]> = {};
    if (frameworkLocale.interactiveDefinition) {
      frameworkLocale.interactiveDefinition.forEach(section => {
        section.questions.forEach(question => {
          const key = question.id;
          const trueDefaultValue = currentTrueDefaults[key];
          // For manual inputs, if trueDefaultValue exists (i.e., was example text from frameworks.ts),
          // the display value should be empty to encourage user input.
          // But if trueDefaultValue is empty itself, then display remains empty.
          if (question.type === 'manual' && typeof trueDefaultValue === 'string' && trueDefaultValue.trim() !== '') {
            formInitialDisplayState[key] = ''; // Override with empty for display
          } else {
            formInitialDisplayState[key] = trueDefaultValue; // Use the actual default for other types
          }
        });
      });
    }
    return formInitialDisplayState;
  }, []);

  const isEffectivelyDefault = useCallback((
    currentValue: string | string[] | undefined,
    trueDefaultValue: string | string[] | undefined,
    otherValueIfSelected?: string,
    questionType?: InteractiveQuestionType,
    questionOptions?: string[]
  ): boolean => {
    let currentValForCompare = currentValue;
    if (questionType === 'single-choice' && currentValue === 'LAINNYA_INTERAKTIF_PLACEHOLDER') {
        currentValForCompare = (otherValueIfSelected || '').trim();
    }

    let defaultToCompare = trueDefaultValue;
    // Special handling for single-choice where trueDefault might be empty string but options exist.
    // In this case, the "effective default" for comparison is the first option if the current value isn't "Other...".
    // If current value is "Other...", then the default to compare against is an empty string for the "other" field.
    if (questionType === 'single-choice' &&
        (trueDefaultValue === undefined || (typeof trueDefaultValue === 'string' && trueDefaultValue.trim() === '')) &&
        questionOptions && questionOptions.length > 0) {
        if (currentValue !== 'LAINNYA_INTERAKTIF_PLACEHOLDER') {
            defaultToCompare = questionOptions[0]; // Compare against the first option
        } else {
            // If "Other..." is selected, and trueDefault was empty, "Other..." input should also be empty to be considered default.
            defaultToCompare = ''; 
        }
    }


    if (Array.isArray(currentValForCompare) && Array.isArray(defaultToCompare)) {
        return areArraysEqual(currentValForCompare, defaultToCompare);
    }
    if (typeof currentValForCompare === 'string' && typeof defaultToCompare === 'string') {
        return currentValForCompare.trim() === defaultToCompare.trim();
    }
    if (currentValForCompare === undefined) return (defaultToCompare === undefined || (typeof defaultToCompare === 'string' && defaultToCompare.trim() === '') || (Array.isArray(defaultToCompare) && defaultToCompare.length === 0));
    if (defaultToCompare === undefined) return ((typeof currentValForCompare === 'string' && currentValForCompare.trim() === '') || (Array.isArray(currentValForCompare) && currentValForCompare.length === 0));

    return false;
  }, []);

  const handleFrameworkSelect = (framework: Framework) => {
    setSelectedFramework(framework);
    const currentLocale = language === 'id' ? framework.idLocale : framework.enLocale;
    const calculatedTrueDefaults = getTrueInitialFrameworkDefaultsInternal(currentLocale);
    setTrueInitialDefaults(calculatedTrueDefaults);
    setOtherInputValues({});

    if (currentLocale.interactiveDefinition && currentLocale.interactiveDefinition.length > 0) {
        setPromptComponents([]);
        setInteractiveFormValues(computeInitialDisplayFormState(currentLocale, calculatedTrueDefaults));
    } else if (currentLocale.components) {
        setInteractiveFormValues({});
        const initialComponents = currentLocale.components.map((componentDetail: FrameworkComponentDetail) => ({
          id: componentDetail.id,
          value: '', // Standard components always start empty
          label: componentDetail.id,
          example: componentDetail.example,
        }));
        setPromptComponents(initialComponents);
    } else {
        setInteractiveFormValues({});
        setPromptComponents([]);
    }

    setUserDefinedInteraction('');
    clearAiStates();
    setHasCurrentPromptBeenCopied(false);
    if (window.innerWidth < 768) {
      setIsInputPanelExpanded(true);
      setIsOutputPanelExpanded(true);
    }
  };

  const resetFrameworkSuggestionStates = () => {
    setUserGoalForFramework('');
    setSuggestedFrameworkIds([]);
    setIsFetchingFrameworkSuggestions(false);
    setFrameworkSuggestionError(null);
  };

  const handleCategorySelect = (newCategory: 'text' | 'media' | 'music') => {
    if (selectedCategory !== newCategory) {
      setSelectedCategory(newCategory);
      setSelectedFramework(null);
      setPromptComponents([]);
      setUserDefinedInteraction('');
      setInteractiveFormValues({});
      setOtherInputValues({});
      setTrueInitialDefaults({});
      clearAiStates();
      setHasCurrentPromptBeenCopied(false);
      resetFrameworkSuggestionStates();
      setFrameworkSearchTerm('');
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { name: string; value: string } }) => {
    const { name, value } = event.target;
    setPromptComponents(prevComponents =>
      prevComponents.map(comp =>
        comp.id === name ? { ...comp, value } : comp
      )
    );
  };

  const handleInteractiveFormChange = (values: Record<string, string | string[]>) => {
    setInteractiveFormValues(values);
  };

  const handleOtherInputChange = (questionId: string, value: string) => {
    setOtherInputValues(prev => ({ ...prev, [questionId]: value }));
  };

  const handleUserInteractionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserDefinedInteraction(event.target.value);
  };

  const currentFrameworkLocale = selectedFramework ? (language === 'id' ? selectedFramework.idLocale : selectedFramework.enLocale) : null;
  const isInteractiveFrameworkSelected = !!(selectedFramework && currentFrameworkLocale && currentFrameworkLocale.interactiveDefinition && currentFrameworkLocale.interactiveDefinition.length > 0);


  const clearInputs = () => {
    // For standard frameworks
    setPromptComponents(prevComponents =>
      prevComponents.map(comp => ({ ...comp, value: '' }))
    );
    setUserDefinedInteraction(''); // Clear this too
    
    // For interactive frameworks
    setOtherInputValues({}); // Always clear "other" text inputs
    if (selectedFramework && currentFrameworkLocale) {
        const calculatedTrueDefaults = getTrueInitialFrameworkDefaultsInternal(currentFrameworkLocale);
        setTrueInitialDefaults(calculatedTrueDefaults);
        if (currentFrameworkLocale.interactiveDefinition && currentFrameworkLocale.interactiveDefinition.length > 0) {
            // This correctly sets interactive fields to their "display" defaults (often empty for manual)
            setInteractiveFormValues(computeInitialDisplayFormState(currentFrameworkLocale, calculatedTrueDefaults));
        } else {
            setInteractiveFormValues({}); // Clear if not interactive (though covered by standard above)
        }
    } else {
        setInteractiveFormValues({}); // No framework selected
        setTrueInitialDefaults({});
    }

    clearAiStates();
    setHasCurrentPromptBeenCopied(false);
    // Do not reset framework suggestions here, as "clear inputs" is about the current prompt form
    // resetFrameworkSuggestionStates(); 
  };

  const handleFetchFrameworkSuggestions = async () => {
    if (!aiClient || !userGoalForFramework.trim()) {
      return;
    }
    setIsFetchingFrameworkSuggestions(true);
    setFrameworkSuggestionError(null);
    setSuggestedFrameworkIds([]);

    try {
      const model = 'gemini-2.5-flash-preview-04-17';
      const allFrameworksInfo = frameworks
        .map(fw => {
          const locale = language === 'id' ? fw.idLocale : fw.enLocale;
          return { id: fw.id, name: locale.name, description: locale.description, category: locale.category };
        })
        .filter(fwInfo => fwInfo.category === selectedCategory);

      const systemPrompt = t('geminiInstructionForFrameworkSuggestion', JSON.stringify(allFrameworksInfo));
      const userPrompt = `User goal: "${userGoalForFramework}". Suggest relevant framework IDs from the provided list that match the user's goal and the currently selected category: ${selectedCategory}.`;

      const response: GenerateContentResponse = await aiClient.models.generateContent({
        model: model,
        contents: userPrompt,
        config: { systemInstruction: systemPrompt, responseMimeType: "application/json" }
      });

      let jsonStr = response.text.trim();
      const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
      const match = jsonStr.match(fenceRegex);
      if (match && match[2]) {
        jsonStr = match[2].trim();
      }

      const result = JSON.parse(jsonStr);
      if (result && Array.isArray(result.suggestedFrameworkIds)) {
        const validIds = result.suggestedFrameworkIds.filter((id: any) => typeof id === 'string' && allFrameworksInfo.some(fw => fw.id === id));
        setSuggestedFrameworkIds(validIds);
        if (validIds.length === 0) {
            setFrameworkSuggestionError(t('noFrameworkSuggestionsFound'));
        }
      } else {
        throw new Error("Invalid JSON response format for framework suggestions.");
      }

    } catch (e: any) {
      console.error("Framework suggestion API error:", e);
      const detailMessage = (e && typeof e.message === 'string') ? e.message : String(e);
      setFrameworkSuggestionError(t('frameworkSuggestionsError') + (detailMessage ? ` (${detailMessage})` : ''));
      setSuggestedFrameworkIds([]);
    } finally {
      setIsFetchingFrameworkSuggestions(false);
    }
  };

  useEffect((): void => {
    let assembledPrompt: string = "";
    let assembledPromptForCopy: string = "";
    let formIsDirty: boolean = false;
    let standardFormIsPristine: boolean = true;
    const placeholderInstructionKey: TranslationKey = apiKeyAvailable ? 'initialPromptAreaInstruction' : 'initialPromptAreaInstructionNoApiKey';


    if (selectedFramework && currentFrameworkLocale) {
      if (currentFrameworkLocale.interactiveDefinition && currentFrameworkLocale.interactiveDefinition.length > 0) {
        if (Object.keys(trueInitialDefaults).length > 0) {
          currentFrameworkLocale.interactiveDefinition.forEach(section => {
            if (formIsDirty) return;
            section.questions.forEach(question => {
              if (formIsDirty) return;
              const key = question.id;
              const currentValue = interactiveFormValues[key];
              const otherValue = question.includeOtherOption ? otherInputValues[key] : undefined;
              const trueDefault = trueInitialDefaults[key]; // This is the 'true' default from frameworks.ts
              
              // Check if the current value is different from its 'true' default.
              // For manual fields, a non-empty input is considered dirty if trueDefault was empty.
              // If trueDefault was not empty (e.g. example text), then empty is NOT dirty.
              // isEffectivelyDefault handles this complex logic.
              if (!isEffectivelyDefault(currentValue, trueDefault, otherValue, question.type, question.options)) {
                // Additional check: if it's not default, is it actually providing a value?
                const effVal = effectiveValueToString(currentValue, otherValue);
                if (effVal.trim() !== '') { // Only consider it dirty if it's non-default AND has content
                    formIsDirty = true;
                }
              }
            });
          });
        }

        if (formIsDirty) {
          const descriptiveSegments: string[] = [];
          const technicalParamSegments: string[] = [];

          const createParamString = (
            formKey: string,
            paramPrefix: string,
            valueTransformer: (val: string) => string = (v) => v.split(' ')[0],
            paramSuffix: string = ''
          ): string => {
            const questionDef = currentFrameworkLocale.interactiveDefinition?.flatMap(s => s.questions).find(q => q.id === formKey);
            const currentValue = interactiveFormValues[formKey];
            const otherValue = questionDef?.includeOtherOption ? otherInputValues[formKey] : undefined;
            const trueDefault = trueInitialDefaults[formKey];

            if (!isEffectivelyDefault(currentValue, trueDefault, otherValue, questionDef?.type, questionDef?.options)) {
              const effectiveValStr = effectiveValueToString(currentValue, otherValue);
              if (effectiveValStr.trim() !== '') {
                const transformedValue = valueTransformer(effectiveValStr.trim());
                if (transformedValue.trim() !== '') return `${paramPrefix}${transformedValue}${paramSuffix}`;
              } else if (questionDef?.type === 'multiple-choice' && Array.isArray(currentValue) && currentValue.length > 0) {
                const joinedArrayValues = currentValue.join(', ').trim();
                if (joinedArrayValues) {
                  const transformedArrayValue = valueTransformer(joinedArrayValues);
                  if(transformedArrayValue.trim() !== '') return `${paramPrefix}${transformedArrayValue}${paramSuffix}`;
                }
              }
            }
            return '';
          };

          currentFrameworkLocale.interactiveDefinition.forEach(section => {
            section.questions.forEach(question => {
              const key = question.id;
              const currentValueInForm = interactiveFormValues[key];
              const currentOtherValue = question.includeOtherOption ? otherInputValues[key] : undefined;
              const trueDefaultForKey = trueInitialDefaults[key];

              const isDefault = isEffectivelyDefault(currentValueInForm, trueDefaultForKey, currentOtherValue, question.type, question.options);
              const effectiveValStr = effectiveValueToString(currentValueInForm, currentOtherValue).trim();

              if (!isDefault && effectiveValStr !== "") {
                let processedValue = effectiveValStr;
                const activeTemplateRefId = selectedFramework.id; 

                if (key === 'lighting' && activeTemplateRefId && ['leonardo_ai', 'adobe_firefly', 'ideogram_ai', 'pika_labs', 'openai_sora', 'playground_ai', 'canva_magic_media', 'kaiber_ai', 'nightcafe_creator', 'clipdrop_stability', 'midjourney', 'stable_diffusion', 'google_veo'].includes(activeTemplateRefId) ) {
                  processedValue = effectiveValStr + " lighting";
                } else if (key === 'artist_influence' && activeTemplateRefId && ['leonardo_ai', 'adobe_firefly', 'ideogram_ai', 'pika_labs', 'openai_sora', 'playground_ai', 'canva_magic_media', 'kaiber_ai', 'nightcafe_creator', 'clipdrop_stability', 'midjourney', 'dalle3'].includes(activeTemplateRefId)) {
                  processedValue = "in the style of " + effectiveValStr;
                } else if (key === 'artist_influences' && activeTemplateRefId === 'stable_diffusion') {
                  processedValue = "by " + effectiveValStr;
                } else if (key === 'lyrics_theme' && activeTemplateRefId === 'suno_ai' && !effectiveValStr.toLowerCase().startsWith('[verse]') && !effectiveValStr.toLowerCase().startsWith('[chorus]')) {
                  processedValue = `Lyrical theme: ${effectiveValStr}`;
                } else if (key === 'custom_lyrics_section' && activeTemplateRefId === 'suno_ai' && (effectiveValStr.toLowerCase().startsWith('[verse]') || effectiveValStr.toLowerCase().startsWith('[chorus]'))) {
                  processedValue = `\n\n[Lyrics]\n${effectiveValStr}`;
                } else if (key === 'lyrical_theme_or_custom' && activeTemplateRefId && ['udio_ai', 'stable_audio', 'google_musicfx', 'mubert_ai'].includes(activeTemplateRefId) ) {
                  if (effectiveValStr.toLowerCase().startsWith('[verse]') || effectiveValStr.toLowerCase().startsWith('[chorus]')) {
                    processedValue = `\nLyrics:\n${effectiveValStr}`;
                  }
                }
                descriptiveSegments.push(processedValue);
              }
            });
          });
            
          const activeFrameworkId = selectedFramework.id;

          if (activeFrameworkId === 'google_veo') {
            technicalParamSegments.push(createParamString('negative', ' --no ', v => v.trim()));
          }
          if (activeFrameworkId === 'midjourney') {
            technicalParamSegments.push(createParamString('aspect_ratio', '--ar '));
            const versionVal = effectiveValueToString(interactiveFormValues.version);
            if (!isEffectivelyDefault(interactiveFormValues.version, trueInitialDefaults.version, undefined, 'single-choice', language === 'id' ? midjourneyVersionOptions : midjourneyVersionOptionsEn) && versionVal) {
              technicalParamSegments.push(versionVal.includes("niji") ? ` --niji ${versionVal.split(' ')[1]}` : ` --v ${versionVal.split(' ')[0]}`);
            }
            technicalParamSegments.push(createParamString('stylize', '--s ', v => v.trim()));
            technicalParamSegments.push(createParamString('chaos', '--c ', v => v.trim()));
            technicalParamSegments.push(createParamString('weird', '--weird ', v => v.trim()));
            if (!isEffectivelyDefault(interactiveFormValues.tile, trueInitialDefaults.tile, undefined, 'single-choice') && effectiveValueToString(interactiveFormValues.tile) === (language === 'id' ? 'Ya' : 'Yes')) {
              technicalParamSegments.push('--tile');
            }
            technicalParamSegments.push(createParamString('image_weight', '--iw ', v => v.trim()));
            if (!isEffectivelyDefault(interactiveFormValues.style_raw, trueInitialDefaults.style_raw, undefined, 'single-choice') && effectiveValueToString(interactiveFormValues.style_raw) === (language === 'id' ? 'Ya (untuk v5+)' : 'Yes (for v5+)')) {
              technicalParamSegments.push('--style raw');
            }
            technicalParamSegments.push(createParamString('other_params', '', v => v.trim(), ' '));
          }
          if (activeFrameworkId === 'stable_diffusion') {
            let sdNegativeParts: string[] = [];
            const negElementsArray = interactiveFormValues.negative_elements as string[] || [];
            if (!isEffectivelyDefault(negElementsArray, trueInitialDefaults.negative_elements as string[], undefined, 'multiple-choice') && negElementsArray.length > 0) {
              sdNegativeParts.push(...negElementsArray.filter(el => el.trim() !== ''));
            }
            const customNegVal = effectiveValueToString(interactiveFormValues.custom_negative_prompt);
            if (!isEffectivelyDefault(customNegVal, trueInitialDefaults.custom_negative_prompt, undefined, 'manual') && customNegVal.trim() !== '') {
              sdNegativeParts.push(customNegVal);
            }
            if (sdNegativeParts.length > 0) technicalParamSegments.push(`--neg ${sdNegativeParts.join(', ')}`);
          }

          if (activeFrameworkId && ['leonardo_ai', 'adobe_firefly', 'ideogram_ai', 'pika_labs', 'openai_sora', 'playground_ai', 'canva_magic_media', 'kaiber_ai', 'nightcafe_creator', 'clipdrop_stability'].includes(activeFrameworkId)) {
            let detailedNegativeParts: string[] = [];
            const customNegDetailedVal = effectiveValueToString(interactiveFormValues.custom_negative, otherInputValues.custom_negative).trim();
            if (customNegDetailedVal !== "" && !isEffectivelyDefault(interactiveFormValues.custom_negative, trueInitialDefaults.custom_negative, otherInputValues.custom_negative, 'manual')) {
              detailedNegativeParts.push(customNegDetailedVal);
            }
            const negElementsArrayDetailed = interactiveFormValues.negative_prompt_elements as string[] || [];
            if (!isEffectivelyDefault(negElementsArrayDetailed, trueInitialDefaults.negative_prompt_elements as string[], undefined, 'multiple-choice') && negElementsArrayDetailed.length > 0) {
                 detailedNegativeParts.push(...negElementsArrayDetailed.filter(el => el.trim() !== ''));
            }
            if (detailedNegativeParts.length > 0) technicalParamSegments.push(`--no ${detailedNegativeParts.join(', ')}`);

            technicalParamSegments.push(createParamString('aspect_ratio', '--ar '));
            technicalParamSegments.push(createParamString('other_tool_params', '', v => v.trim(), ' '));
          }

          let descriptivePart = descriptiveSegments.join('. ');
          if (descriptivePart.trim() !== '' && !descriptivePart.endsWith('.')) {
            descriptivePart += '.';
          }

          const technicalPart = technicalParamSegments.filter(p => p.trim() !== '').join(' ').trim();

          assembledPrompt = [descriptivePart, technicalPart].filter(p => p.trim() !== '').join(' ').trim();
          assembledPromptForCopy = assembledPrompt;
        }
      } else { 
        standardFormIsPristine = !promptComponents.some(pc => pc.value.trim() !== '') && userDefinedInteraction.trim() === '';
        if (!standardFormIsPristine) {
          let displayValues: string[] = [];
          let copyValues: string[] = [];

          if (currentFrameworkLocale?.components) {
            promptComponents.forEach(component => {
            const value = component.value.trim();
            if (value) {
              displayValues.push(value);
              copyValues.push(value);
            }
            });
          }

          if (userDefinedInteraction.trim()) {
            const interactionVal = userDefinedInteraction.trim();
            displayValues.push(interactionVal);
            copyValues.push(interactionVal);
          }
          assembledPrompt = displayValues.join('\n\n').trim();
          assembledPromptForCopy = copyValues.join(', ').trim();
        }
      }

      const finalGeneratedPromptValue = assembledPrompt.trim();
      const finalPromptToCopyValue = assembledPromptForCopy.trim();

      let shouldShowInitialInstruction = false;
      if (currentFrameworkLocale.interactiveDefinition && currentFrameworkLocale.interactiveDefinition.length > 0) {
        if (!formIsDirty) { // For interactive, show instruction if form is not dirty
          shouldShowInitialInstruction = true;
        }
      } else { // For standard frameworks
        if (standardFormIsPristine) { // Show instruction if form is pristine
          shouldShowInitialInstruction = true;
        }
      }

      if (shouldShowInitialInstruction) {
        setGeneratedPrompt(t(placeholderInstructionKey));
        setPromptToCopy('');
      } else if (finalGeneratedPromptValue === '') { // If form was dirty but resulted in empty prompt
        setGeneratedPrompt(t(placeholderInstructionKey));
        setPromptToCopy('');
      } else {
        setGeneratedPrompt(finalGeneratedPromptValue);
        setPromptToCopy(finalPromptToCopyValue);
      }
    } else { 
      setGeneratedPrompt(selectedCategory ? t('selectSpecificFrameworkOutputSummary') : t(placeholderInstructionKey));
      setPromptToCopy('');
    }
  }, [
      promptComponents, userDefinedInteraction, selectedFramework, language, t,
      selectedCategory, currentFrameworkLocale, interactiveFormValues, otherInputValues,
      trueInitialDefaults, // computeInitialDisplayFormState, // Removed from deps as it's stable
      isEffectivelyDefault, apiKeyAvailable // Added apiKeyAvailable
  ]);

  useEffect((): void => {
    setHasCurrentPromptBeenCopied(false);
    clearAiStates(); 
  }, [promptToCopy]);

  const handlePromptSuccessfullyCopied = () => {
    setHasCurrentPromptBeenCopied(true);
  };

  const translateText = useCallback(async (text: string, from: Language, to: Language): Promise<string> => {
    if (!aiClient || !text.trim() || from === to) {
      return text;
    }
    try {
      const model = 'gemini-2.5-flash-preview-04-17';
      const prompt = `Translate the following text from ${from === 'id' ? 'Indonesian' : 'English'} to ${to === 'id' ? 'Indonesian' : 'English'}. Return only the translated text, without any introductory phrases or explanations: "${text}"`;
      const response: GenerateContentResponse = await aiClient.models.generateContent({
        model: model,
        contents: prompt,
        config: { thinkingConfig: { thinkingBudget: 0 } }
      });
      return response.text.trim();
    } catch (error) {
      console.error("Translation API error:", error);
      throw new Error("Translation failed");
    }
  }, [aiClient]);

  const handleLanguageToggle = async () => {
    const newLanguage = language === 'id' ? 'en' : 'id';
    const currentPreviousLanguage = previousLanguageRef.current; 

    previousLanguageRef.current = newLanguage; 
    resetFrameworkSuggestionStates();
    clearAiStates();

    if (!selectedFramework) {
        setLanguage(newLanguage); 
        return;
    }
    
    const frameworkForNewLang = newLanguage === 'id' ? selectedFramework.idLocale : selectedFramework.enLocale;
    const newTrueDefaults = getTrueInitialFrameworkDefaultsInternal(frameworkForNewLang);

    setTrueInitialDefaults(newTrueDefaults);
    setOtherInputValues({}); 

    if (frameworkForNewLang.interactiveDefinition && frameworkForNewLang.interactiveDefinition.length > 0) {
        setInteractiveFormValues(computeInitialDisplayFormState(frameworkForNewLang, newTrueDefaults));
        setPromptComponents([]); 
    } else if (frameworkForNewLang.components) {
        const initialComponents = frameworkForNewLang.components.map((componentDetail: FrameworkComponentDetail) => ({
            id: componentDetail.id,
            value: '', 
            label: componentDetail.id,
            example: componentDetail.example,
        }));
        setPromptComponents(initialComponents);
        setInteractiveFormValues({});
    } else {
        setPromptComponents([]);
        setInteractiveFormValues({});
    }
    
    if (!apiKeyAvailable) {
        setUserDefinedInteraction('');
        setUserGoalForFramework('');
        setLanguage(newLanguage); // Set language for UI and exit if no API key
        return; 
    }

    // Continue with AI Translation if API key is available
    setIsTranslating(true);
    setTranslationError(null);
    let translationOccurredError = false;

    try {
        if (promptComponents.length > 0 && selectedFramework?.idLocale.components && (!isInteractiveFrameworkSelected)) {
            const newLocaleFrameworkComponents = frameworkForNewLang.components || [];
            const translatedPromptComponents = await Promise.all(
                newLocaleFrameworkComponents.map(async (newCompDetail, index) => {
                    const existingCompState = promptComponents[index];
                    let translatedValue = existingCompState?.value || '';
                    if (translatedValue.trim() !== '') {
                        try { translatedValue = await translateText(translatedValue, currentPreviousLanguage, newLanguage); } 
                        catch (e) { console.warn(`Translation failed for component ${newCompDetail.id}:`, e); translationOccurredError = true; }
                    }
                    return { id: newCompDetail.id, value: translatedValue, label: newCompDetail.id, example: newCompDetail.example };
                })
            );
            setPromptComponents(translatedPromptComponents);
        }
        
        if (Object.keys(interactiveFormValues).length > 0 && selectedFramework?.idLocale.interactiveDefinition && isInteractiveFrameworkSelected) {
            const translatedInteractiveValues: Record<string, string | string[]> = {};
            const translatedOtherInputValues: Record<string, string> = { ...otherInputValues };
            const frameworkLocaleForOldLang = currentPreviousLanguage === 'id' ? selectedFramework.idLocale : selectedFramework.enLocale;

            for (const key in interactiveFormValues) {
                const currentValue = interactiveFormValues[key];
                const originalOtherValue = otherInputValues[key];
                const trueDefaultOldLang = (currentPreviousLanguage === language ? trueInitialDefaults : getTrueInitialFrameworkDefaultsInternal(frameworkLocaleForOldLang))[key]; 
                const questionDefOldLang = frameworkLocaleForOldLang.interactiveDefinition?.flatMap(s => s.questions).find(q => q.id === key);
                const questionDefNewLang = frameworkForNewLang.interactiveDefinition?.flatMap(s => s.questions).find(q => q.id === key);

                const effectivelyDefaultInOldLang = isEffectivelyDefault(currentValue, trueDefaultOldLang, originalOtherValue, questionDefOldLang?.type, questionDefOldLang?.options);

                if (questionDefOldLang?.includeOtherOption && currentValue === 'LAINNYA_INTERAKTIF_PLACEHOLDER' && originalOtherValue && originalOtherValue.trim() !== '') {
                    try {
                        translatedOtherInputValues[key] = await translateText(originalOtherValue, currentPreviousLanguage, newLanguage);
                        translatedInteractiveValues[key] = 'LAINNYA_INTERAKTIF_PLACEHOLDER';
                    } catch (error) { console.warn(`Translation failed for 'other' ${key}:`, error); translationOccurredError = true; translatedInteractiveValues[key] = 'LAINNYA_INTERAKTIF_PLACEHOLDER'; }
                } else if (effectivelyDefaultInOldLang && questionDefNewLang) {
                    const displayDefaultNewLang = computeInitialDisplayFormState(frameworkForNewLang, newTrueDefaults);
                    translatedInteractiveValues[key] = displayDefaultNewLang[key];
                    if (questionDefNewLang?.includeOtherOption && displayDefaultNewLang[key] !== 'LAINNYA_INTERAKTIF_PLACEHOLDER') {
                        translatedOtherInputValues[key] = '';
                    }
                } else if (typeof currentValue === 'string' && currentValue.trim() !== '' && currentValue !== 'LAINNYA_INTERAKTIF_PLACEHOLDER') {
                    try { translatedInteractiveValues[key] = await translateText(currentValue, currentPreviousLanguage, newLanguage); }
                    catch (e) { translatedInteractiveValues[key] = currentValue; translationOccurredError = true; }
                } else if (Array.isArray(currentValue)) {
                    const translatedArray = await Promise.all(currentValue.map(async item => {
                        if (item.trim() !== '') { try { return await translateText(item, currentPreviousLanguage, newLanguage); } catch (e) { translationOccurredError = true; return item; } } return item;
                    }));
                    translatedInteractiveValues[key] = translatedArray;
                } else {
                    translatedInteractiveValues[key] = currentValue;
                }
            }
            setInteractiveFormValues(translatedInteractiveValues);
            setOtherInputValues(translatedOtherInputValues);
        }

        if (userDefinedInteraction.trim() !== '') {
            try { setUserDefinedInteraction(await translateText(userDefinedInteraction, currentPreviousLanguage, newLanguage)); }
            catch (e) { translationOccurredError = true; }
        }
        if (userGoalForFramework.trim() !== '') {
            try { setUserGoalForFramework(await translateText(userGoalForFramework, currentPreviousLanguage, newLanguage)); }
            catch (e) { translationOccurredError = true; }
        }

        if (translationOccurredError) {
            setTranslationError(t('translationGeneralError'));
        }
    } catch (error) {
        console.error("General translation process error:", error);
        setTranslationError(t('translationGeneralError'));
    } finally {
        setIsTranslating(false);
    }
    setLanguage(newLanguage); // Set language for UI text *after* translations (if any) are processed
  };

  const fetchAiFeedback = async () => {
    if (!aiClient || !promptToCopy.trim()) {
      setAiError(t('aiFeatureRequiresSubscriptionTooltip')); 
      return;
    }
    setIsFetchingAiFeedback(true);
    setAiError(null);
    setAiFeedback(null);
    setAiFeedbackReceived(false);

    try {
      const model = 'gemini-2.5-flash-preview-04-17';
      const systemInstruction = t('geminiPromptInstruction');
      const fullPromptForAi = `${promptToCopy}`;

      const response: GenerateContentResponse = await aiClient.models.generateContent({
        model: model,
        contents: fullPromptForAi,
        config: { systemInstruction: systemInstruction }
      });

      setAiFeedback(response.text);
      setAiFeedbackReceived(true);
    } catch (e: any) {
      console.error("AI feedback API error:", e);
      const detailMessage = (e && typeof e.message === 'string') ? e.message : String(e);
      setAiError(t('aiEnhancementError') + (detailMessage ? ` (${detailMessage})` : ''));
    } finally {
      setIsFetchingAiFeedback(false);
    }
  };

  const fetchDetailedAiAnalysis = async () => {
    if (!aiClient || !promptToCopy.trim()) {
      setDetailedAnalysisError(t('aiFeatureRequiresSubscriptionTooltip')); 
      return;
    }
    setIsFetchingDetailedAnalysis(true);
    setDetailedAnalysisError(null);
    setDetailedAiAnalysis(null);
    setDetailedAiAnalysisReceived(false);

    try {
      const model = 'gemini-2.5-flash-preview-04-17';
      const systemInstruction = t('geminiDetailedAnalysisInstruction');
      const userPromptContent = promptToCopy;

      const response: GenerateContentResponse = await aiClient.models.generateContent({
        model: model,
        contents: userPromptContent,
        config: { systemInstruction: systemInstruction }
      });

      setDetailedAiAnalysis(response.text);
      setDetailedAiAnalysisReceived(true);
    } catch (e: any) { 
      console.error("Detailed AI analysis API error:", e);
      const detailMessage = (e && typeof e.message === 'string') ? e.message : String(e);
      setDetailedAnalysisError(t('aiDetailedAnalysisError') + (detailMessage ? ` (${detailMessage})` : ''));
    } finally {
      setIsFetchingDetailedAnalysis(false);
    }
  };

  const fetchSuggestionsForField = async (componentName: string, frameworkNameForSuggestion: string, currentValueForSuggestion: string): Promise<string[]> => {
    if (!aiClient) { 
      throw new Error(t('aiFeatureRequiresSubscriptionTooltip'));
    }
    try {
      const model = 'gemini-2.5-flash-preview-04-17';
      const systemPrompt = t('geminiInstructionForAutocomplete', componentName, frameworkNameForSuggestion, currentValueForSuggestion);
      const response = await aiClient.models.generateContent({
        model: model,
        contents: "Suggest continuations based on the system instruction.",
        config: { systemInstruction: systemPrompt, responseMimeType: "application/json", thinkingConfig: { thinkingBudget: 0 } }
      });

      let jsonStr = response.text.trim();
      const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
      const match = jsonStr.match(fenceRegex);
      if (match && match[2]) {
        jsonStr = match[2].trim();
      }

      const suggestionsArray = JSON.parse(jsonStr);
      if (Array.isArray(suggestionsArray) && suggestionsArray.every(s => typeof s === 'string')) {
        return suggestionsArray;
      }
      return [];
    } catch (e) {
      console.error("AI suggestion API error:", e);
      throw new Error(t('suggestionsError'));
    }
  };

  const currentYear = new Date().getFullYear();

  const filteredFrameworksForCategory = frameworks
    .filter(fw => fw.idLocale.category === selectedCategory)
    .filter(fw => {
      if (!frameworkSearchTerm.trim()) return true;
      const locale = language === 'id' ? fw.idLocale : fw.enLocale;
      const searchTermLower = frameworkSearchTerm.toLowerCase();
      return locale.name.toLowerCase().includes(searchTermLower) || locale.description.toLowerCase().includes(searchTermLower);
    })
    .sort((a, b) => {
      const aIsFavorite = favoriteFrameworkIds.includes(a.id);
      const bIsFavorite = favoriteFrameworkIds.includes(b.id);
      if (aIsFavorite && !bIsFavorite) return -1;
      if (!aIsFavorite && bIsFavorite) return 1;
      const aLocale = language === 'id' ? a.idLocale : a.enLocale;
      const bLocale = language === 'id' ? b.idLocale : b.enLocale;
      return aLocale.name.localeCompare(bLocale.name);
    });

  const langToggleAriaLabel = language === 'id' ? t('switchToEnglish') : t('switchToIndonesian');
  const langToggleTitle = language === 'id' ? t('switchToEnglish') : t('switchToIndonesian');


  const canEnhanceCurrentPrompt = apiKeyAvailable && promptToCopy.trim().length > 0 && !isFetchingAiFeedback;
  const canAnalyzeCurrentPrompt = apiKeyAvailable && promptToCopy.trim().length > 0 && !isFetchingDetailedAnalysis;
  const isPromptSavable = promptToCopy.trim().length > 0 && !!selectedFramework;

  const baseTitleKey = `${selectedCategory}FrameworksTitle` as TranslationKey;
  const baseTitle = t(baseTitleKey);
  const frameworkWord = t('frameworkWord');
  let frameworkListTitle = baseTitle;

  if (selectedFramework && currentFrameworkLocale) {
    const selectedFrameworkName = currentFrameworkLocale.name;
    if (baseTitle.endsWith(frameworkWord)) {
      frameworkListTitle = baseTitle.substring(0, baseTitle.length - frameworkWord.length).trimEnd() + " " + selectedFrameworkName;
    } else {
      frameworkListTitle = `${baseTitle} (${selectedFrameworkName})`;
    }
  }

  const inputPanelTitleText = selectedFramework && currentFrameworkLocale
    ? `${t('inputComponentsTitle')} (${currentFrameworkLocale.name})`
    : t('inputComponentsTitle');

  const inputPanelTitleClasses = "text-lg sm:text-xl font-semibold text-teal-700 dark:text-teal-600";

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)]">
      {toastMessage && (
        <div
          className={`fixed top-5 right-5 z-[200] p-3 rounded-md shadow-lg text-sm font-medium
            ${toastMessage.type === 'success' ? 'bg-green-500 text-white' : 'bg-rose-500 text-white'}`}
          role={toastMessage.type === 'error' ? 'alert' : 'status'}
        >
          {toastMessage.message}
        </div>
      )}
      <header className="sticky top-0 z-30 bg-slate-900/80 backdrop-blur-sm shadow-md">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-y-2 gap-x-4">

            <div className="flex flex-col items-center sm:items-start w-full sm:w-auto">
              <div className="flex items-center">
                <div className="flex items-center header-glowing-frame p-2 rounded-lg shrink-0">
                  <AppLogoIcon className="w-8 h-8 sm:w-10 sm:h-10 mr-2 text-teal-600" animatedAsAiIndicator={false} />
                  <div className="flex items-center">
                    <span className="text-3xl sm:text-4xl font-bold text-teal-600 dark:text-teal-500">Prompt</span>
                    <span className="text-3xl sm:text-4xl font-bold text-teal-400 dark:text-teal-300 ml-1.5">Matrix</span>
                  </div>
                </div>
                 <div className="ml-3 flex items-center space-x-2">
                    <span 
                      className={`plan-badge plan-badge-animated plan-badge-sway ${apiKeyAvailable ? 'plan-badge-premium plan-badge-glow-premium' : 'plan-badge-free plan-badge-glow-free'}`}
                      title={apiKeyAvailable ? t('premiumPlanTooltip') : t('freePlanTooltip')}
                    >
                        <BadgeCheckIcon />
                        {apiKeyAvailable ? t('premiumPlanBadge') : t('freePlanBadge')}
                    </span>
                </div>
                <div className="ml-4 hidden md:flex items-center">
                  <p className="text-base font-semibold text-slate-300 subtitle-3d-effect">
                    {t('appSubtitle')}
                  </p>
                </div>
              </div>
              <div className="mt-1 md:hidden text-center sm:text-left w-full flex justify-center items-center">
                <p className="text-sm font-semibold text-slate-300 subtitle-3d-effect">
                  {t('appSubtitle')}
                </p>
              </div>
            </div>

            <div className="flex items-center self-center sm:self-auto gap-x-2 sm:gap-x-3 mt-2 sm:mt-0 shrink-0">
              <div className="text-xs">
                  {isTranslating && apiKeyAvailable && !globalActivityMessage && ( <span className="text-slate-300 animate-pulse">{t('translationInProgress')}</span> )}
                  {translationError && apiKeyAvailable && !isTranslating && ( <span className="text-rose-400" title={translationError}>{t('translationGeneralError').split('.')[0]}</span> )}
              </div>
              <button
                onClick={() => setShowSubscriptionInfoModal(true)}
                className="button-header-3d px-2.5 py-1 sm:px-3 sm:py-1.5 text-purple-300 hover:text-yellow-300 transition-colors rounded-md hover:bg-purple-700/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-900 font-semibold text-xs sm:text-sm flex items-center"
                title={t('subscriptionInfoModalTitle')}
              >
                 <StarIcon className="w-3.5 h-3.5 mr-1 text-yellow-400" />
                <span className="button-text-content">{t('subscriptionInfoButtonText')}</span>
              </button>
              <button
                onClick={() => {
                  setShowHowToUse(true);
                  setIsHowToUseModalShownAutomatically(false);
                }}
                className="button-header-3d px-2.5 py-1 sm:px-3 sm:py-1.5 text-slate-300 hover:text-teal-400 transition-colors rounded-md hover:bg-slate-700/80 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-slate-900 font-semibold text-xs sm:text-sm"
                title={t('howToUseAppTitle')}
                aria-label={t('howToUseAppTitle')}
              >
                <span className="button-text-content">{t('howToUseAppTitleShort')}</span>
              </button>
              <button
                onClick={handleLanguageToggle}
                className={`button-header-3d px-2 py-1 sm:px-3 sm:py-1.5 text-slate-300 hover:text-teal-400 transition-colors rounded-md hover:bg-slate-700/80 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-slate-900 font-semibold text-xs sm:text-sm
                            ${isTranslating && apiKeyAvailable ? 'cursor-not-allowed opacity-60' : ''}`}
                title={langToggleTitle}
                aria-label={langToggleAriaLabel}
                disabled={isTranslating && apiKeyAvailable} 
              >
                {language === 'id' ? 'EN' : 'ID'}
              </button>
            </div>
          </div>
        </div>
        <GlobalActivityIndicator activityMessage={globalActivityMessage} />
      </header>

      <main className="flex-grow container mx-auto px-2 sm:px-4 py-4 sm:py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          <div className="md:col-span-1 space-y-4 sm:space-y-6">
            <div className="bg-[var(--bg-secondary)] dark:bg-slate-800/70 p-3 sm:p-4 rounded-xl shadow-lg border border-[var(--border-color)] dark:border-slate-700/50">
              <h2 className="text-lg sm:text-xl font-semibold mb-3 text-teal-600 dark:text-teal-500 flex items-center">
                {t('selectCategoryTitle')}
              </h2>
              <div className="grid grid-cols-3 gap-2">
                {(['text', 'media', 'music'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategorySelect(cat)}
                    className={`p-2 sm:p-3 rounded-lg transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800
                                ${selectedCategory === cat
                                  ? 'bg-teal-700 text-white shadow-md scale-105 ring-teal-500'
                                  : 'bg-slate-600 dark:bg-slate-700 hover:bg-teal-700 text-slate-200 dark:text-slate-300 hover:text-white shadow-sm'
                                }`}
                    title={t(`${cat}FrameworksCategoryTooltip` as TranslationKey)}
                    aria-pressed={selectedCategory === cat}
                  >
                    <div className="flex flex-col items-center justify-center space-y-0.5">
                      {cat === 'text' && <PencilIcon className="w-5 h-5 sm:w-6 sm:h-6" />}
                      {cat === 'media' && <CameraIcon className="w-5 h-5 sm:w-6 sm:h-6" />}
                      {cat === 'music' && <MusicNoteIcon className="w-5 h-5 sm:w-6 sm:h-6" />}

                      {cat === 'media' ? (
                        <>
                          <span className="text-xs sm:text-sm font-medium button-text-content">
                            {t('categoryLabelImage')}
                          </span>
                          <span className="text-[0.7rem] sm:text-xs leading-tight font-medium button-text-content -mt-1">
                            {t('categoryLabelVideo')}
                          </span>
                        </>
                      ) : (
                        <span className="text-xs sm:text-sm font-medium button-text-content">
                          {cat === 'text' && t('categoryLabelText')}
                          {cat === 'music' && t('categoryLabelMusic')}
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
              {!selectedCategory && <p className="mt-3 text-xs text-center text-slate-400">{t('selectCategoryInstruction')}</p>}
            </div>

            {selectedCategory && (
              <div className="bg-[var(--bg-secondary)] dark:bg-slate-800/70 p-3 sm:p-4 rounded-xl shadow-lg border border-[var(--border-color)] dark:border-slate-700/50">
                <h2 className="text-lg sm:text-xl font-semibold mb-2 text-teal-600 dark:text-teal-500 flex items-center">
                  {frameworkListTitle}
                </h2>
                 <input
                    type="text"
                    placeholder={t('searchFrameworksPlaceholder')}
                    value={frameworkSearchTerm}
                    onChange={(e) => setFrameworkSearchTerm(e.target.value)}
                    className="w-full p-2 mb-2.5 bg-slate-600/70 dark:bg-slate-700/60 border border-slate-500 rounded-md focus:ring-1 focus:ring-teal-500 focus:border-teal-500 outline-none text-xs text-slate-100 placeholder-slate-400/70 non-copyable-input-field"
                  />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2 max-h-[calc(60vh-40px)] sm:max-h-[calc(100vh-320px)] overflow-y-auto pr-1" style={{ scrollbarWidth: 'thin', scrollbarColor: 'var(--scrollbar-thumb) var(--scrollbar-track)' }}>
                  {filteredFrameworksForCategory.length > 0 ? filteredFrameworksForCategory.map((framework) => {
                    const locale = language === 'id' ? framework.idLocale : framework.enLocale;
                    const isSuggested = suggestedFrameworkIds.includes(framework.id);
                    const isFavorite = favoriteFrameworkIds.includes(framework.id);
                    return (
                      <button
                        key={framework.id}
                        onClick={() => handleFrameworkSelect(framework)}
                        className={`w-full text-left p-2.5 sm:p-3 rounded-md transition-all duration-150 ease-in-out relative group focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-[var(--bg-secondary)] dark:focus:ring-offset-slate-800
                                      ${selectedFramework?.id === framework.id
                                        ? 'bg-teal-600 border border-teal-500 text-white shadow-lg scale-102'
                                        : `bg-slate-600 dark:bg-slate-700 hover:bg-teal-700 dark:hover:bg-slate-600 text-slate-100 dark:text-slate-200 shadow-sm ${isSuggested && apiKeyAvailable ? 'ring-2 ring-purple-400 dark:ring-purple-300' : ''} ${isFavorite ? 'ring-2 ring-yellow-400 dark:ring-yellow-300' : ''}`
                                      }`}
                        title={locale.description}
                        aria-pressed={selectedFramework?.id === framework.id}
                      >
                        <span className="button-text-content text-xs sm:text-sm font-medium">{locale.name}</span>
                        {isSuggested && apiKeyAvailable && ( 
                            <AppLogoIcon
                                animatedAsAiIndicator
                                className="w-3.5 h-3.5 sm:w-4 sm:h-4 absolute top-1.5 right-1.5 text-purple-400 dark:text-purple-300"
                                title={t('suggestedFrameworkTooltip')}
                            />
                        )}
                         <button
                            onClick={(e) => { e.stopPropagation(); toggleFavoriteFramework(framework.id); }}
                            className={`absolute p-0.5 rounded-full
                                        ${selectedFramework?.id === framework.id
                                            ? 'top-1 right-1'
                                            : 'top-1.5 right-1.5 group-hover:bg-slate-500/50'
                                        }
                                        focus:outline-none focus:ring-1 focus:ring-yellow-400`}
                            aria-label={isFavorite ? t('favoriteFrameworkTooltipRemove') : t('favoriteFrameworkTooltipAdd')}
                            aria-pressed={isFavorite}
                          >
                            <StarIcon
                              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors duration-150
                                          ${isFavorite
                                              ? 'text-yellow-400 dark:text-yellow-300'
                                              : 'text-slate-500 dark:text-slate-400 group-hover:text-yellow-400 dark:group-hover:text-yellow-300'
                                          }`
                                      }
                              title={isFavorite ? t('favoriteFrameworkTooltipRemove') : t('favoriteFrameworkTooltipAdd')}
                            />
                          </button>
                      </button>
                    );
                  }) : (
                     <p className="col-span-full text-xs text-center text-slate-400 py-3">{t('noFrameworksFoundError')}</p>
                  )}
                </div>
                 {!selectedFramework && <p className="mt-3 text-xs text-center text-slate-400">{t('selectSpecificFrameworkInputSummary')}</p>}
              </div>
            )}
          </div>

          <div className="md:col-span-2 space-y-4 sm:space-y-6">
            {selectedCategory && (
                <div className={`bg-slate-700/40 dark:bg-slate-800/50 p-3 sm:p-4 rounded-lg border ${apiKeyAvailable ? 'border-purple-600/50' : 'border-slate-600/50'} shadow-sm`}>
                    <h4 className={`relative text-md font-semibold ${apiKeyAvailable ? 'text-purple-400 dark:text-purple-300' : 'text-slate-400'} mb-2 flex items-center`}>
                        <AppLogoIcon
                            animatedAsAiIndicator={apiKeyAvailable}
                            className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 opacity-[0.08] -z-10 ${apiKeyAvailable ? '' : 'grayscale opacity-[0.06]'}`}
                            aria-hidden="true"
                        />
                        {t('frameworkSuggestionsTitle')}
                        {apiKeyAvailable && <AppLogoIcon animatedAsAiIndicator className="w-4 h-4 ml-2 shrink-0" />}
                    </h4>
                    <p className="text-xs text-slate-400 mb-2">
                        {t('frameworkSuggestionInstruction')}
                    </p>
                    <textarea
                        value={userGoalForFramework}
                        onChange={(e) => setUserGoalForFramework(e.target.value)}
                        placeholder={t('userGoalInputPlaceholder')}
                        rows={2}
                        className={`w-full p-2 bg-slate-600/70 dark:bg-slate-700/60 border ${apiKeyAvailable ? 'border-slate-500 focus:ring-purple-500 focus:border-purple-500' : 'border-slate-500 cursor-not-allowed'} rounded-md focus:ring-1 outline-none text-sm text-slate-100 placeholder-slate-400/70 ai-suggestion-textarea non-copyable-input-field`}
                        disabled={!apiKeyAvailable}
                        title={!apiKeyAvailable ? t('aiFeatureRequiresSubscriptionTooltip') : undefined}
                    />
                    <button
                        onClick={handleFetchFrameworkSuggestions}
                        className={`w-full mt-2 py-2 px-3 text-xs font-semibold rounded-md transition-colors duration-150 flex items-center justify-center space-x-1.5
                        ${apiKeyAvailable && userGoalForFramework.trim() && !isFetchingFrameworkSuggestions
                            ? 'bg-purple-600 hover:bg-purple-500 text-white focus:ring-1 focus:ring-purple-400'
                            : 'bg-slate-500 text-slate-300 cursor-not-allowed'
                        }`}
                        disabled={!apiKeyAvailable || !userGoalForFramework.trim() || isFetchingFrameworkSuggestions}
                        aria-label={!apiKeyAvailable ? t('aiFeatureRequiresSubscriptionTooltip') : t('getFrameworkSuggestionsButtonAria')}
                        title={!apiKeyAvailable ? t('aiFeatureRequiresSubscriptionTooltip') : t('getFrameworkSuggestionsButtonAria')}
                    >
                        <span className="button-text-content">{isFetchingFrameworkSuggestions ? t('frameworkSuggestionsLoading') : t('getFrameworkSuggestionsButton')}</span>
                         <AppLogoIcon animatedAsAiIndicator={apiKeyAvailable} className={`w-4 h-4 ml-1.5 ${isFetchingFrameworkSuggestions ? 'opacity-70 animate-pulse' : ''} ${!apiKeyAvailable ? 'grayscale' : ''}`} />
                    </button>
                    {frameworkSuggestionError && <p className="text-xs text-rose-400 mt-1.5">{frameworkSuggestionError}</p>}
                </div>
            )}

            <div className="bg-[var(--bg-secondary)] dark:bg-slate-800/70 rounded-xl shadow-lg border border-[var(--border-color)] dark:border-slate-700/50">
              <div
                className="flex justify-between items-center px-4 sm:px-6 py-3 sm:py-4 border-b border-[var(--border-color)] dark:border-slate-700/50 cursor-pointer hover:bg-slate-700/40 transition-colors"
                onClick={() => setIsInputPanelExpanded(!isInputPanelExpanded)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setIsInputPanelExpanded(!isInputPanelExpanded)}
                aria-expanded={isInputPanelExpanded}
                aria-controls="input-panel-content"
              >
                <h3 className={inputPanelTitleClasses}>
                  {inputPanelTitleText}
                </h3>
                {isInputPanelExpanded ? <ChevronUpIcon className="w-6 h-6 text-teal-700 dark:text-teal-600" /> : <ChevronDownIcon className="w-6 h-6 text-teal-700 dark:text-teal-600" />}
              </div>

              <div id="input-panel-content" className={`p-3 sm:p-4 space-y-3 sm:space-y-4 ${isInputPanelExpanded ? 'collapsible-content open' : 'collapsible-content'}`}>
                {selectedFramework && currentFrameworkLocale ? (
                  <>
                    <p className="text-sm text-center text-slate-400 dark:text-slate-400 py-4">
                      {currentFrameworkLocale.description}
                    </p>
                    {currentFrameworkLocale.interactiveDefinition && currentFrameworkLocale.interactiveDefinition.length > 0 ? (
                      <InteractivePromptBuilder
                        sections={currentFrameworkLocale.interactiveDefinition}
                        initialValues={interactiveFormValues}
                        onValuesChange={handleInteractiveFormChange}
                        otherInputValues={otherInputValues}
                        onOtherInputChange={handleOtherInputChange}
                        language={language}
                        fetchSuggestions={fetchSuggestionsForField} 
                        apiKeyAvailable={apiKeyAvailable}
                        frameworkName={currentFrameworkLocale.name}
                      />
                    ) : currentFrameworkLocale.components && currentFrameworkLocale.components.length > 0 ? (
                      promptComponents.map(component => (
                        <InputField
                          key={component.id}
                          id={component.id}
                          label={t(component.id as TranslationKey, component.label)}
                          value={component.value}
                          onChange={handleInputChange}
                          placeholder={t('inputFieldPlaceholder', t(component.id as TranslationKey, component.label))}
                          isTextarea
                          rows={2}
                          description={t('inputFieldDescription', t(component.id as TranslationKey, component.label), currentFrameworkLocale.shortName)}
                          predefinedOptions={currentFrameworkLocale.predefinedOptions?.[component.id]}
                          isVisible={isInputPanelExpanded}
                          fetchSuggestions={fetchSuggestionsForField} 
                          frameworkName={currentFrameworkLocale.name}
                          apiKeyAvailable={apiKeyAvailable}
                          exampleText={component.example}
                        />
                      ))
                    ) : (
                      null
                    )}
                  </>
                ) : (
                  <p className="text-sm text-center text-slate-400 py-4">
                    {selectedCategory ? t('selectSpecificFrameworkInputSummary') : t('selectCategoryInstruction')}
                  </p>
                )}

                {selectedFramework && !isInteractiveFrameworkSelected && (
                  <InputField
                    id="userDefinedInteraction"
                    label={t('userDefinedInteractionLabel')}
                    value={userDefinedInteraction}
                    onChange={(e) => handleUserInteractionChange(e as React.ChangeEvent<HTMLTextAreaElement>)}
                    placeholder={t('userDefinedInteractionPlaceholder')}
                    isTextarea
                    rows={3}
                    isVisible={isInputPanelExpanded}
                    apiKeyAvailable={apiKeyAvailable} 
                  />
                )}

                {selectedFramework && (
                  <button
                    onClick={clearInputs}
                    className="w-full py-2 px-4 bg-rose-600 hover:bg-rose-500 text-white text-sm font-semibold rounded-md transition-colors duration-150 flex items-center justify-center space-x-1.5 shadow-sm focus:outline-none focus:ring-1 focus:ring-rose-400 focus:ring-offset-1 focus:ring-offset-[var(--bg-secondary)] dark:focus:ring-offset-slate-800"
                    title={t('clearInputsButtonAria')}
                  >
                    <EraserIcon className="w-4 h-4" />
                    <span className="button-text-content">{t('clearInputsButton')}</span>
                  </button>
                )}
              </div>
              {!isInputPanelExpanded && (
                <p className="px-4 sm:px-6 py-2.5 text-xs text-center text-slate-400 italic">
                  {t('clickToExpandInputPanel', selectedFramework ? (language === 'id' ? selectedFramework.idLocale.name : selectedFramework.enLocale.name) : '...')}
                </p>
              )}
            </div>

            <div className="bg-[var(--bg-secondary)] dark:bg-slate-800/70 rounded-xl shadow-lg border border-[var(--border-color)] dark:border-slate-700/50 min-h-[280px] sm:min-h-[300px] flex flex-col">
              <PromptOutput
                promptText={generatedPrompt}
                promptToCopy={promptToCopy}
                selectedFramework={selectedFramework}
                isExpanded={isOutputPanelExpanded}
                onToggleExpansion={() => setIsOutputPanelExpanded(!isOutputPanelExpanded)}
                aiFeedback={aiFeedback}
                isFetchingAiFeedback={isFetchingAiFeedback}
                aiError={aiError}
                onEnhanceWithAI={fetchAiFeedback}
                detailedAiAnalysis={detailedAiAnalysis}
                isFetchingDetailedAnalysis={isFetchingDetailedAnalysis}
                detailedAnalysisError={detailedAnalysisError}
                onAnalyzeWithAI={fetchDetailedAiAnalysis}
                apiKeyAvailable={apiKeyAvailable}
                aiFeedbackReceived={aiFeedbackReceived}
                detailedAiAnalysisReceived={detailedAiAnalysisReceived}
                hasCurrentPromptBeenCopied={hasCurrentPromptBeenCopied}
                onPromptSuccessfullyCopied={handlePromptSuccessfullyCopied}
                onSavePrompt={handleSavePrompt}
                isPromptSavable={isPromptSavable}
              />
            </div>

            <PromptStashPanel
                savedPrompts={savedPrompts}
                onLoadPrompt={handleLoadPrompt}
                onDeletePrompt={handleDeletePrompt}
                onRenamePrompt={handleRenamePrompt}
                isLoading={isDBLoading}
                dbError={dbError}
                showToast={showToast}
                reloadPrompts={loadPromptsFromDB}
                appVersion={APP_VERSION}
            />

          </div>
        </div>
      </main>

      <footer className="text-center py-3 sm:py-4 border-t border-[var(--border-color)] dark:border-slate-700/50 bg-slate-900/80 backdrop-blur-sm">
        <p className="text-xs text-slate-400 dark:text-slate-500">
          <span className="animated-signature">PromptMatrix</span>{'\u00A9'} {APP_VERSION} - {currentYear}
        </p>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
          {t('footerOptimize')}
        </p>
        <div className="flex justify-center items-center space-x-4 mt-2">
            <a
              href="mailto:si.sigitadi@gmail.com"
              title="Email Sigit Adi"
              aria-label="Email Sigit Adi"
              className="text-slate-400 hover:text-teal-500 dark:text-slate-500 dark:hover:text-teal-400 transition-colors"
            >
              <GmailIcon className="w-5 h-5" />
            </a>
            <a
              href="https://github.com/sisigitadi"
              title="GitHub Profile Sigit Adi"
              aria-label="GitHub Profile Sigit Adi"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-teal-500 dark:text-slate-500 dark:hover:text-teal-400 transition-colors"
            >
              <GithubIcon className="w-5 h-5" />
            </a>
            <a
              href="https://medium.com/@si.sigitadi"
              title="Medium Profile Sigit Adi"
              aria-label="Medium Profile Sigit Adi"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-teal-500 dark:text-slate-500 dark:hover:text-teal-400 transition-colors"
            >
              <MediumIcon className="w-5 h-5" />
            </a>
        </div>
      </footer>

      <DisclaimerModal isOpen={showDisclaimer} onClose={handleDisclaimerAcknowledge} />
      <HowToUseModal
        isOpen={showHowToUse}
        onClose={handleHowToUseClose}
        isShownAutomatically={isHowToUseModalShownAutomatically}
      />
      <SubscriptionInfoModal 
        isOpen={showSubscriptionInfoModal} 
        onClose={() => setShowSubscriptionInfoModal(false)} 
      />
      <TeaserPopupModal 
        isOpen={showTeaserPopup} 
        onClose={() => setShowTeaserPopup(false)} 
      />
    </div>
  );
};

export default App;
