
import React, { useState, useEffect, useCallback, ReactNode, useRef } from 'react';
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import InputField from './components/InputField';
import PromptOutput from './components/PromptOutput';
import InteractivePromptBuilder from './components/InteractivePromptBuilder';
import { Framework, Language, PromptComponent, FrameworkComponentDetail, InteractiveQuestionDefinition, InteractiveQuestionType } from './types';
import { useLanguage } from './contexts/LanguageContext';
import { EraserIcon } from './components/icons/EraserIcon';
import DisclaimerModal from './components/DisclaimerModal';
import HowToUseModal from './components/HowToUseModal';
import { AppLogoIcon } from './components/icons/AppLogoIcon';
import { ControlsIcon } from './components/icons/ControlsIcon';
import { ChevronDownIcon } from './components/icons/ChevronDownIcon';
import { ChevronUpIcon } from './components/icons/ChevronUpIcon';
import { PencilIcon } from './components/icons/PencilIcon';
import { CameraIcon } from './components/icons/CameraIcon';
import { MusicNoteIcon } from './components/icons/MusicNoteIcon';
import { SparklesIcon } from './components/icons/SparklesIcon';
import { InfoIcon } from './components/icons/InfoIcon';
import { StarIcon } from './components/icons/StarIcon';
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
} from './frameworks';

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

const App: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const [selectedFramework, setSelectedFramework] = useState<Framework | null>(null);
  const [promptComponents, setPromptComponents] = useState<PromptComponent[]>([]);
  const [userDefinedInteraction, setUserDefinedInteraction] = useState<string>('');
  const [generatedPrompt, setGeneratedPrompt] = useState<string>('');
  const [promptToCopy, setPromptToCopy] = useState<string>('');
  const [showDisclaimer, setShowDisclaimer] = useState<boolean>(true);
  const [showHowToUse, setShowHowToUse] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<'text' | 'media' | 'music'>('text');

  const [isInputPanelExpanded, setIsInputPanelExpanded] = useState<boolean>(true);
  const [isOutputPanelExpanded, setIsOutputPanelExpanded] = useState<boolean>(true);

  const [aiFeedback, setAiFeedback] = useState<string | null>(null);
  const [isFetchingAiFeedback, setIsFetchingAiFeedback] = useState<boolean>(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiFeedbackReceived, setAiFeedbackReceived] = useState<boolean>(false);
  const [hasCurrentPromptBeenCopied, setHasCurrentPromptBeenCopied] = useState<boolean>(false);

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

  const rawApiKeyFromEnv = process.env.API_KEY;
  const apiKey = (typeof rawApiKeyFromEnv === 'string' && rawApiKeyFromEnv !== "undefined" && rawApiKeyFromEnv.trim() !== '') ? rawApiKeyFromEnv : null;
  const aiClient = apiKey ? new GoogleGenAI({ apiKey }) : null;

  useEffect(() => {
    const disclaimerAcknowledged = localStorage.getItem('disclaimerAcknowledged');
    if (disclaimerAcknowledged === 'true') {
      setShowDisclaimer(false);
    }
  }, []);

  const handleDisclaimerAcknowledge = () => {
    localStorage.setItem('disclaimerAcknowledged', 'true');
    setShowDisclaimer(false);
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
          // For manual fields that have a non-empty true default, display them as empty initially
          // This encourages user input and makes the "formIsDirty" logic more intuitive.
          if (question.type === 'manual' && typeof trueDefaultValue === 'string' && trueDefaultValue.trim() !== '') {
            formInitialDisplayState[key] = '';
          } else {
            formInitialDisplayState[key] = trueDefaultValue;
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
    // If it's a single-choice, no explicit trueDefaultValue, and "Other" is NOT selected,
    // the effective default is the first option (what's visually selected by the browser).
    // If "Other" IS selected, then the effective default for comparison becomes an empty string,
    // so any text in "Other" makes it non-default.
    if (questionType === 'single-choice' && 
        (trueDefaultValue === undefined || (typeof trueDefaultValue === 'string' && trueDefaultValue.trim() === '')) && 
        questionOptions && questionOptions.length > 0) {
        if (currentValue !== 'LAINNYA_INTERAKTIF_PLACEHOLDER') { 
            defaultToCompare = questionOptions[0];
        } else {
            defaultToCompare = ''; 
        }
    }


    if (Array.isArray(currentValForCompare) && Array.isArray(defaultToCompare)) {
        return areArraysEqual(currentValForCompare, defaultToCompare);
    }
    if (typeof currentValForCompare === 'string' && typeof defaultToCompare === 'string') {
        return currentValForCompare.trim() === defaultToCompare.trim();
    }
    // Handle undefined cases more robustly
    if (currentValForCompare === undefined) return (defaultToCompare === undefined || (typeof defaultToCompare === 'string' && defaultToCompare.trim() === '') || (Array.isArray(defaultToCompare) && defaultToCompare.length === 0));
    if (defaultToCompare === undefined) return ((typeof currentValForCompare === 'string' && currentValForCompare.trim() === '') || (Array.isArray(currentValForCompare) && currentValForCompare.length === 0));
    
    return false; // Fallback if types don't match or other conditions
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
          value: '',
          label: componentDetail.id,
          example: componentDetail.example,
        }));
        setPromptComponents(initialComponents);
    } else {
        setInteractiveFormValues({});
        setPromptComponents([]);
    }

    setUserDefinedInteraction('');
    setAiFeedback(null);
    setAiError(null);
    setAiFeedbackReceived(false);
    setHasCurrentPromptBeenCopied(false);
    if (window.innerWidth < 768) { // Auto-expand panels on smaller screens
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

  const handleCategorySelect = (category: 'text' | 'media' | 'music') => {
    if (selectedCategory !== category) {
      setSelectedCategory(category);
      setSelectedFramework(null);
      setPromptComponents([]);
      setUserDefinedInteraction('');
      setInteractiveFormValues({});
      setOtherInputValues({});
      setTrueInitialDefaults({});
      setAiFeedback(null);
      setAiError(null);
      setAiFeedbackReceived(false);
      setHasCurrentPromptBeenCopied(false);
      resetFrameworkSuggestionStates();
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

  const clearInputs = () => {
    setPromptComponents(prevComponents =>
      prevComponents.map(comp => ({ ...comp, value: '' }))
    );
    setUserDefinedInteraction('');
    setOtherInputValues({});

    if (selectedFramework && currentFrameworkLocale) {
        const calculatedTrueDefaults = getTrueInitialFrameworkDefaultsInternal(currentFrameworkLocale);
        setTrueInitialDefaults(calculatedTrueDefaults);
        if (currentFrameworkLocale.interactiveDefinition && currentFrameworkLocale.interactiveDefinition.length > 0) {
            setInteractiveFormValues(computeInitialDisplayFormState(currentFrameworkLocale, calculatedTrueDefaults));
        } else {
            setInteractiveFormValues({});
        }
    } else {
        setInteractiveFormValues({});
        setTrueInitialDefaults({});
    }

    setAiFeedback(null);
    setAiError(null);
    setAiFeedbackReceived(false);
    setHasCurrentPromptBeenCopied(false);
    resetFrameworkSuggestionStates();
  };

  const handleFetchFrameworkSuggestions = async () => {
    if (!aiClient || !userGoalForFramework.trim()) {
      setFrameworkSuggestionError(apiKey ? t('emptyPromptError') : t('apiKeyMissingError'));
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
  
  useEffect(() => {
    if (!selectedFramework || !currentFrameworkLocale || Object.keys(trueInitialDefaults).length === 0) {
      setGeneratedPrompt(selectedCategory ? t('selectSpecificFrameworkOutputSummary') : t('selectFrameworkPromptAreaInstruction'));
      setPromptToCopy('');
      return;
    }

    if (currentFrameworkLocale.interactiveDefinition && currentFrameworkLocale.interactiveDefinition.length > 0 && currentFrameworkLocale.interactivePromptTemplate) {
      let formIsDirty = false;
      currentFrameworkLocale.interactiveDefinition.forEach(section => {
        section.questions.forEach(question => {
          if (formIsDirty) return;
          const key = question.id;
          const currentValue = interactiveFormValues[key];
          const otherValue = question.includeOtherOption ? otherInputValues[key] : undefined;
          const trueDefault = trueInitialDefaults[key];
          
          if (!isEffectivelyDefault(currentValue, trueDefault, otherValue, question.type, question.options)) {
             // A field is considered changed if it's not default AND has a meaningful value
             const effVal = effectiveValueToString(currentValue, otherValue);
             if (effVal.trim() !== '') {
                 formIsDirty = true;
             }
          }
        });
      });
      
      if (!formIsDirty) {
        setGeneratedPrompt(t('initialPromptAreaInstruction'));
        setPromptToCopy('');
      } else {
        let assembledPrompt = currentFrameworkLocale.interactivePromptTemplate;
        const templateSubstitutions = new Map<string, string>();
        
        const createParamString = (
            formKey: string,
            paramPrefix: string,
            valueTransformer: (val: string) => string = (v) => v.split(' ')[0], // Default transformer
            isNegativeParam: boolean = false // For cases like multi-choice negative prompts
        ) => {
            const questionDef = currentFrameworkLocale.interactiveDefinition?.flatMap(s=>s.questions).find(q=>q.id === formKey);
            const currentValue = interactiveFormValues[formKey];
            const otherValue = questionDef?.includeOtherOption ? otherInputValues[formKey] : undefined;
            const trueDefault = trueInitialDefaults[formKey];

            if (!isEffectivelyDefault(currentValue, trueDefault, otherValue, questionDef?.type, questionDef?.options)) {
                 const effectiveValStr = effectiveValueToString(currentValue, otherValue);
                 if (effectiveValStr.trim() !== '') {
                     const transformedValue = valueTransformer(effectiveValStr.trim());
                     if (transformedValue.trim() !== '') return `${paramPrefix}${transformedValue}`;
                 } else if (isNegativeParam && Array.isArray(currentValue) && currentValue.length > 0) {
                    const joinedArrayValues = currentValue.join(', ').trim();
                    if(joinedArrayValues) return `${paramPrefix}${valueTransformer(joinedArrayValues)}`;
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
            
            let finalSubstitution = "";
            if (!isDefault && effectiveValStr !== "") {
                finalSubstitution = effectiveValStr;
                const activeTemplate = currentFrameworkLocale.interactivePromptTemplate;
                
                if (key === 'lighting' && activeTemplate === detailedImageVideoTemplate) {
                    finalSubstitution = effectiveValStr + " lighting";
                } else if (key === 'artist_influence' && (activeTemplate === detailedImageVideoTemplate || activeTemplate === dalle3Template) && effectiveValStr) {
                    finalSubstitution = "in the style of " + effectiveValStr;
                } else if (key === 'lyrics_theme' && activeTemplate === sunoAITemplate && effectiveValStr && !effectiveValStr.toLowerCase().startsWith('[verse]') && !effectiveValStr.toLowerCase().startsWith('[chorus]')) {
                    // This specific prefix for suno_lyrics_block is handled later
                } else if (key === 'custom_lyrics_section' && activeTemplate === sunoAITemplate && effectiveValStr && (effectiveValStr.toLowerCase().startsWith('[verse]') || effectiveValStr.toLowerCase().startsWith('[chorus]'))) {
                     // This specific prefix for suno_lyrics_block is handled later
                } else if (key === 'lyrical_theme_or_custom' && activeTemplate === detailedMusicTemplate && effectiveValStr) {
                   // This specific prefix for detailed_music_lyrics_block is handled later
                }
            }
            templateSubstitutions.set(key, finalSubstitution);
          });
        });
        
        // Specific parameter string substitutions
        const activeTemplate = currentFrameworkLocale.interactivePromptTemplate;
        if (activeTemplate === veoInteractivePromptTemplate) {
            const currentNegative = effectiveValueToString(interactiveFormValues.negative, otherInputValues.negative).trim();
            templateSubstitutions.set('veo_negative_parameter_string', currentNegative ? ` --no ${currentNegative}` : '');
        }
        if (activeTemplate === midjourneyTemplate) {
            templateSubstitutions.set('midjourney_aspect_ratio_param_string', createParamString('aspect_ratio', ' --ar '));
            const versionVal = effectiveValueToString(interactiveFormValues.version);
            let versionParam = '';
            if (!isEffectivelyDefault(interactiveFormValues.version, trueInitialDefaults.version, undefined, 'single-choice', language === 'id' ? midjourneyVersionOptions : midjourneyVersionOptionsEn) && versionVal) {
                versionParam = versionVal.includes("niji") ? ` --niji ${versionVal.split(' ')[1]}` : ` --v ${versionVal}`;
            }
            templateSubstitutions.set('midjourney_version_param_string', versionParam);
            templateSubstitutions.set('midjourney_stylize_param_string', createParamString('stylize', ' --s ', (v)=>v.trim()));
            templateSubstitutions.set('midjourney_chaos_param_string', createParamString('chaos', ' --c ', (v)=>v.trim()));
            templateSubstitutions.set('midjourney_weird_param_string', createParamString('weird', ' --weird ', (v)=>v.trim()));
            const tileVal = effectiveValueToString(interactiveFormValues.tile);
            const tileParam = (!isEffectivelyDefault(interactiveFormValues.tile, trueInitialDefaults.tile, undefined, 'single-choice') && tileVal === (language === 'id' ? 'Ya' : 'Yes')) ? ' --tile' : '';
            templateSubstitutions.set('midjourney_tile_param_string', tileParam);
            templateSubstitutions.set('midjourney_iw_param_string', createParamString('image_weight', ' --iw ', (v)=>v.trim()));
            const styleRawVal = effectiveValueToString(interactiveFormValues.style_raw);
            const styleRawParam = (!isEffectivelyDefault(interactiveFormValues.style_raw, trueInitialDefaults.style_raw, undefined, 'single-choice') && styleRawVal === (language === 'id' ? 'Ya (untuk v5+)' : 'Yes (for v5+)')) ? ' --style raw' : '';
            templateSubstitutions.set('midjourney_style_raw_param_string', styleRawParam);
        }
        if (activeTemplate === dalle3Template) {
            templateSubstitutions.set('dalle_aspect_ratio_value', createParamString('aspect_ratio_dalle', '', (v) => v.split(' ')[0]));
        }
        if (activeTemplate === stableDiffusionTemplate) {
            let sdNegativeParts: string[] = [];
            const negElementsArray = interactiveFormValues.negative_elements as string[] || [];
            if (!isEffectivelyDefault(negElementsArray, trueInitialDefaults.negative_elements as string[], undefined, 'multiple-choice')) {
                 sdNegativeParts.push(...negElementsArray.filter(el => el.trim() !== ''));
            }
            const customNegVal = effectiveValueToString(interactiveFormValues.custom_negative_prompt);
            if (!isEffectivelyDefault(customNegVal, trueInitialDefaults.custom_negative_prompt, undefined, 'manual') && customNegVal.trim() !== '') {
                 sdNegativeParts.push(customNegVal);
            }
            templateSubstitutions.set('sd_negative_param_string', sdNegativeParts.length > 0 ? ` --neg ${sdNegativeParts.join(', ')}` : '');
            templateSubstitutions.set('sd_params_note_string', createParamString('param_info', ' --params ', (v)=>v.trim()));
        }
        if (activeTemplate === sunoAITemplate) {
            const lyricsInputFromTheme = templateSubstitutions.get('lyrics_theme') || '';
            const lyricsInputFromCustom = templateSubstitutions.get('custom_lyrics_section') || '';
            let sunoLyricsContent = '';
            const finalLyricsInput = lyricsInputFromCustom.trim() !== '' ? lyricsInputFromCustom : lyricsInputFromTheme;

            if (finalLyricsInput.trim() !== '' && !isEffectivelyDefault(finalLyricsInput, trueInitialDefaults.lyrics_theme, undefined, 'manual')) { // Check if lyrics theme is not default
                if (finalLyricsInput.toLowerCase().startsWith('[verse]') || finalLyricsInput.toLowerCase().startsWith('[chorus]')) {
                   sunoLyricsContent = `\n\n[Lyrics]\n${finalLyricsInput}`;
               } else {
                   sunoLyricsContent = ` Lyrical theme: ${finalLyricsInput}.`;
               }
            }
            templateSubstitutions.set('suno_lyrics_block', sunoLyricsContent);
        }
        if (activeTemplate === detailedImageVideoTemplate) {
            let detailedNegativeParts: string[] = [];
            const customNegDetailedVal = templateSubstitutions.get('custom_negative') || ''; 
             if (customNegDetailedVal.trim() !== '' && !isEffectivelyDefault(customNegDetailedVal, trueInitialDefaults.custom_negative, undefined, 'manual')) {
                detailedNegativeParts.push(customNegDetailedVal);
            }
            const negElementsArrayDetailed = interactiveFormValues.negative_prompt_elements as string[] || [];
            if (!isEffectivelyDefault(negElementsArrayDetailed, trueInitialDefaults.negative_prompt_elements as string[], undefined, 'multiple-choice') && negElementsArrayDetailed.length > 0) {
                detailedNegativeParts.push(...negElementsArrayDetailed.filter(el => el.trim() !== ''));
            }
            templateSubstitutions.set('detailed_image_negative_param_string', detailedNegativeParts.length > 0 ? ` --no ${detailedNegativeParts.join(', ')}` : '');
            templateSubstitutions.set('detailed_image_aspect_ratio_param_string', createParamString('aspect_ratio', ' --ar '));
        }
        if (activeTemplate === detailedMusicTemplate) {
             let lyricsBlockContent = "";
             const lyricalThemeOrCustomValue = templateSubstitutions.get('lyrical_theme_or_custom') || '';
             if (lyricalThemeOrCustomValue.trim() !== "" && !isEffectivelyDefault(lyricalThemeOrCustomValue, trueInitialDefaults.lyrical_theme_or_custom, undefined, 'manual')) {
                 if (lyricalThemeOrCustomValue.toLowerCase().startsWith('[verse]') || lyricalThemeOrCustomValue.toLowerCase().startsWith('[chorus]')) {
                    lyricsBlockContent = `\nLyrics:\n${lyricalThemeOrCustomValue}`;
                 } else {
                    lyricsBlockContent = ` Lyrical theme: ${lyricalThemeOrCustomValue}.`;
                 }
             }
             templateSubstitutions.set('detailed_music_lyrics_block', lyricsBlockContent);
        }
        
        templateSubstitutions.forEach((value, key) => {
          const regex = new RegExp(`{{${key}}}`, 'g');
          assembledPrompt = assembledPrompt.replace(regex, value);  
        });

        assembledPrompt = assembledPrompt.replace(/\{\{[^{}]*?\}\}/g, ''); 
        assembledPrompt = assembledPrompt.replace(/\s\s+/g, ' ').trim(); 
        // Remove "Label: ." or "Label: " if value was empty
        assembledPrompt = assembledPrompt.replace(/([A-Za-z\s0-9()&']+?):\s*(?:\.\s*|\s*)(?=(\s*[A-Za-z\s0-9()&']+?:|\s*--|\s*$))/g, '');
        assembledPrompt = assembledPrompt.replace(/\s\s+/g, ' ').trim(); 
        
        // Advanced comma/separator cleaning
        assembledPrompt = assembledPrompt.replace(/\s*([.,;])\s*/g, '$1'); // Remove spaces around separators
        assembledPrompt = assembledPrompt.replace(/([.,;])\1+/g, '$1'); // Consolidate multiple same separators (e.g. `,,` to `,`, `..` to `.`)
        assembledPrompt = assembledPrompt.replace(/[.,;](?=[.,;])/g, ''); // Remove separator if followed immediately by another (e.g. `.,` becomes `,`)
        
        // Convert all remaining separators to a comma followed by a space, then remove duplicates
        assembledPrompt = assembledPrompt.replace(/[.,;]/g, ',').replace(/(,\s*){2,}/g, ', '); 
        
        assembledPrompt = assembledPrompt.replace(/^[\s,.]+|[\s,.]+(?=$)/g, ''); // Remove leading/trailing separators/spaces
        assembledPrompt = assembledPrompt.replace(/,\s*--/g, ' --'); // Remove comma before parameters
        assembledPrompt = assembledPrompt.trim();


        if (assembledPrompt === '' || assembledPrompt === '.' || assembledPrompt === ',') {
            setGeneratedPrompt(t('initialPromptAreaInstruction'));
            setPromptToCopy('');
        } else {
            setGeneratedPrompt(assembledPrompt);
            setPromptToCopy(assembledPrompt);
        }
      }

    } else { 
      const standardFormIsPristine = promptComponents.every(pc => pc.value.trim() === '') && userDefinedInteraction.trim() === '';
      if (standardFormIsPristine) {
        setGeneratedPrompt(t('initialPromptAreaInstruction'));
        setPromptToCopy('');
      } else {
        let structuredPrompt = "";
        let copyPrompt = "";

        if (currentFrameworkLocale?.components) {
          promptComponents.forEach(component => {
            const value = component.value.trim() || '';
            const placeholder = t('promptTemplatePlaceholder', component.id);

            if (value) {
              structuredPrompt += `${component.label}:\n${value}\n\n`;
              copyPrompt += `${value}, `;
            } else {
              structuredPrompt += `${component.label}:\n${placeholder}\n\n`;
            }
          });
        }

        if (userDefinedInteraction.trim()) {
          structuredPrompt += `${t('userDefinedInteractionLabel')}\n${userDefinedInteraction.trim()}\n\n`;
          copyPrompt += `${userDefinedInteraction.trim()}, `;
        }

        setGeneratedPrompt(structuredPrompt.trim() || t('initialPromptAreaInstruction'));
        setPromptToCopy(copyPrompt.replace(/, $/, '').trim());
      }
    }

  }, [
      promptComponents,
      userDefinedInteraction,
      selectedFramework,
      language, t,
      selectedCategory,
      currentFrameworkLocale,
      interactiveFormValues,
      otherInputValues,
      trueInitialDefaults, 
      getTrueInitialFrameworkDefaultsInternal,
      computeInitialDisplayFormState,
      isEffectivelyDefault, 
  ]);

  useEffect(() => {
    setHasCurrentPromptBeenCopied(false);
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

    if (!selectedFramework) { 
        setLanguage(newLanguage);
        return;
    }
    
    const frameworkForNewLang = newLanguage === 'id' ? selectedFramework.idLocale : selectedFramework.enLocale;
    const newTrueDefaults = getTrueInitialFrameworkDefaultsInternal(frameworkForNewLang);
    const newInitialDisplayState = computeInitialDisplayFormState(frameworkForNewLang, newTrueDefaults);

    if (!aiClient) { 
        setLanguage(newLanguage);
        setTrueInitialDefaults(newTrueDefaults);
        setOtherInputValues({}); 
        if (frameworkForNewLang.interactiveDefinition && frameworkForNewLang.interactiveDefinition.length > 0) {
            setInteractiveFormValues(newInitialDisplayState);
        } else if (frameworkForNewLang.components) {
             const updatedComponents = frameworkForNewLang.components.map((compDetail: FrameworkComponentDetail) => {
                const existingComp = promptComponents.find(pc => pc.id === compDetail.id);
                return {
                    id: compDetail.id,
                    value: existingComp?.value || '', 
                    label: compDetail.id, 
                    example: compDetail.example
                };
            });
            setPromptComponents(updatedComponents);
        }
        return;
    }

    setIsTranslating(true);
    setTranslationError(null);
    let translationOccurredError = false;

    try {
      if (promptComponents.length > 0 && selectedFramework?.idLocale.components) {
        const translatedPromptComponents = await Promise.all(
          promptComponents.map(async (pc) => {
            let translatedValue = pc.value;
            if (pc.value.trim() !== '') {
              try {
                translatedValue = await translateText(pc.value, currentPreviousLanguage, newLanguage);
              } catch (error) {
                console.warn(`Translation failed for component value ${pc.id}:`, error);
                translationOccurredError = true;
              }
            }
            const componentDetailForExample = frameworkForNewLang?.components?.find(compDet => compDet.id === pc.id);
            return { ...pc, value: translatedValue, example: componentDetailForExample?.example || pc.example };
          })
        );
        setPromptComponents(translatedPromptComponents);
      }

      if (Object.keys(interactiveFormValues).length > 0 && selectedFramework?.idLocale.interactiveDefinition) {
        const translatedInteractiveValues: Record<string, string | string[]> = {};
        const translatedOtherInputValues: Record<string, string> = {...otherInputValues}; 

        const frameworkLocaleForOldLang = currentPreviousLanguage === 'id' ? selectedFramework.idLocale : selectedFramework.enLocale;
        
        for (const key in interactiveFormValues) {
          const currentValue = interactiveFormValues[key];
          const originalOtherValue = otherInputValues[key];
          const trueDefaultOldLang = trueInitialDefaults[key]; 
          const trueDefaultNewLang = newTrueDefaults[key];     
          const questionDef = frameworkLocaleForOldLang.interactiveDefinition?.flatMap(s => s.questions).find(q => q.id === key);

          const effectivelyDefaultInOldLang = isEffectivelyDefault(currentValue, trueDefaultOldLang, originalOtherValue, questionDef?.type, questionDef?.options);
          
          if (questionDef?.includeOtherOption && currentValue === 'LAINNYA_INTERAKTIF_PLACEHOLDER' && originalOtherValue && originalOtherValue.trim() !== '') {
            try {
              translatedOtherInputValues[key] = await translateText(originalOtherValue, currentPreviousLanguage, newLanguage);
              translatedInteractiveValues[key] = 'LAINNYA_INTERAKTIF_PLACEHOLDER';
            } catch (error) {
              console.warn(`Translation failed for interactive 'other' value ${key}:`, error);
              translationOccurredError = true;
              translatedInteractiveValues[key] = 'LAINNYA_INTERAKTIF_PLACEHOLDER'; 
            }
          } else if (effectivelyDefaultInOldLang) {
            // If it was default in old lang, set it to the default in new lang (or cleared state for display)
            if (questionDef?.type === 'manual' && typeof trueDefaultNewLang === 'string' && trueDefaultNewLang.trim() !== '' && effectiveValueToString(currentValue, originalOtherValue).trim() === '') {
                 // It was a manual field, cleared for display, so keep it cleared if its new true default is also non-empty
                 translatedInteractiveValues[key] = '';
            } else {
                 translatedInteractiveValues[key] = trueDefaultNewLang;
            }
          } else if (typeof currentValue === 'string' && currentValue.trim() !== '' && currentValue !== 'LAINNYA_INTERAKTIF_PLACEHOLDER') {
             try { translatedInteractiveValues[key] = await translateText(currentValue, currentPreviousLanguage, newLanguage); }
             catch (e) { translatedInteractiveValues[key] = currentValue; translationOccurredError = true; }
          } else if (Array.isArray(currentValue)) {
             const translatedArray = await Promise.all(currentValue.map(async item => {
                if(item.trim() !== '') {
                    try { return await translateText(item, currentPreviousLanguage, newLanguage); }
                    catch (e) { translationOccurredError = true; return item; }
                } return item;
             }));
             translatedInteractiveValues[key] = translatedArray;
          } else { 
             translatedInteractiveValues[key] = currentValue; // Preserve if not string or array (e.g., LAINNYA)
          }
        }
        setInteractiveFormValues(translatedInteractiveValues);
        setOtherInputValues(translatedOtherInputValues);
      }

      if (userDefinedInteraction.trim() !== '') {
        try { setUserDefinedInteraction(await translateText(userDefinedInteraction, currentPreviousLanguage, newLanguage)); }
        catch (e) { translationOccurredError = true; }
      }
      if (aiFeedback && aiFeedback.trim() !== '') {
        try { setAiFeedback(await translateText(aiFeedback, currentPreviousLanguage, newLanguage)); }
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
      setLanguage(newLanguage); 
      if (selectedFramework) {
          const frameworkLocale = newLanguage === 'id' ? selectedFramework.idLocale : selectedFramework.enLocale;
          setTrueInitialDefaults(getTrueInitialFrameworkDefaultsInternal(frameworkLocale));
      }
    }
  };


  useEffect(() => {
    // Update the ref when language actually changes, to be used as 'from' language in next toggle
    previousLanguageRef.current = language;
  }, [language]);

  const handleEnhanceWithAI = async () => {
    if (!aiClient) {
      setAiError(t('apiKeyMissingError'));
      return;
    }
    if (!promptToCopy.trim()) {
      setAiError(t('emptyPromptError'));
      setTimeout(() => setAiError(null), 3000);
      return;
    }

    setIsFetchingAiFeedback(true);
    setAiFeedback(null);
    setAiError(null);
    setAiFeedbackReceived(false);

    try {
      const model = 'gemini-2.5-flash-preview-04-17';
      const instruction = t('geminiPromptInstruction');
      const fullPrompt = `${instruction}\n---\n${promptToCopy}\n---`;

      const response: GenerateContentResponse = await aiClient.models.generateContent({
        model: model,
        contents: fullPrompt,
      });

      setAiFeedback(response.text);
      setAiFeedbackReceived(true);

    } catch (error: any) {
      console.error("AI enhancement error:", error);
      let errorMessage = t('aiEnhancementError');
      if (error && typeof error.message === 'string') {
        errorMessage += ` (Details: ${error.message})`;
      } else if (error && typeof error.toString === 'function') {
        errorMessage += ` (Details: ${error.toString()})`;
      }
      setAiError(errorMessage);
    } finally {
      setIsFetchingAiFeedback(false);
    }
  };

  const fetchFieldSuggestions = useCallback(async (componentName: string, frameworkName: string, currentValue: string): Promise<string[]> => {
    if (!aiClient) {
      throw new Error(t('apiKeyMissingError'));
    }
    try {
      const model = 'gemini-2.5-flash-preview-04-17';
      const prompt = t('geminiInstructionForAutocomplete', componentName, frameworkName, currentValue);

      const response: GenerateContentResponse = await aiClient.models.generateContent({
        model: model,
        contents: prompt,
        config: { responseMimeType: "application/json", thinkingConfig: {thinkingBudget: 0} }
      });

      let jsonStr = response.text.trim();
      const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
      const match = jsonStr.match(fenceRegex);
      if (match && match[2]) {
        jsonStr = match[2].trim();
      }

      const suggestions = JSON.parse(jsonStr) as string[];
      if (Array.isArray(suggestions)) {
        return suggestions.filter(s => typeof s === 'string');
      }
      return [];

    } catch (e: any) {
      console.error("Field suggestion API error:", e);
      const detailMessage = (e && typeof e.message === 'string') ? e.message : String(e);
      throw new Error(t('suggestionsError') + (detailMessage ? ` (${detailMessage})` : ''));
    }
  }, [aiClient, t]);

  const frameworkCategories = {
    text: frameworks.filter(f => (f.idLocale.category === 'text' || f.enLocale.category === 'text')),
    media: frameworks.filter(f => (f.idLocale.category === 'media' || f.enLocale.category === 'media')),
    music: frameworks.filter(f => (f.idLocale.category === 'music' || f.enLocale.category === 'music')),
  };

  const getCategoryIcon = (category: 'text' | 'media' | 'music', className?: string): ReactNode => {
    const commonClass = className || "w-4 h-4 mr-1.5";
    if (category === 'text') return <PencilIcon className={commonClass} />;
    if (category === 'media') return <CameraIcon className={commonClass} />;
    if (category === 'music') return <MusicNoteIcon className={commonClass} />;
    return null;
  };

  const footerContactText = t('footerContactMe');

  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-2 sm:p-4 md:p-6 bg-[var(--bg-primary)] text-[var(--text-primary)] relative">
      <DisclaimerModal isOpen={showDisclaimer} onClose={handleDisclaimerAcknowledge} />
      <HowToUseModal isOpen={showHowToUse} onClose={() => setShowHowToUse(false)} />

      <header className="w-full max-w-6xl mb-4 md:mb-6 text-center">
        <div className="inline-flex items-center p-3 rounded-lg header-glowing-frame">
          <AppLogoIcon className="w-10 h-10 sm:w-12 sm:h-12 mr-2 text-teal-600 dark:text-teal-500 shrink-0" />
          <span className="text-3xl sm:text-4xl font-bold text-teal-600 dark:text-teal-500">
            Prompt
          </span>
          <span className="text-3xl sm:text-4xl font-bold text-teal-600 dark:text-teal-500 ml-1.5">
            Matrix
          </span>
          {apiKey && (
            <span
              className="ml-3 text-2xl font-bold text-purple-400 api-status-indicator shrink-0"
              aria-label={t('aiFeaturesActiveIndicator')}
              title={t('aiFeaturesActiveIndicator')}
            >
              AI
            </span>
          )}
        </div>
        <p className="text-sm sm:text-md text-center text-[var(--text-secondary)] dark:text-slate-400 animate-subtitle-pulse mt-2">{t('appSubtitle')}</p>
      </header>

      <main className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 flex-grow">
        <div>
          <div className="flex flex-col bg-[var(--bg-secondary)] dark:bg-slate-800/70 p-1 rounded-xl shadow-xl border border-[var(--border-color)] dark:border-slate-700/50">
            <div
              className="flex justify-between items-center px-4 sm:px-6 py-3 sm:py-4 border-b border-[var(--border-color)] dark:border-slate-700/50 cursor-pointer hover:bg-slate-700/40 transition-colors"
              onClick={() => setIsInputPanelExpanded(!isInputPanelExpanded)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setIsInputPanelExpanded(!isInputPanelExpanded)}
              aria-expanded={isInputPanelExpanded}
              aria-controls="input-panel-content"
            >
              <h2 className="text-lg sm:text-xl font-semibold text-teal-700 dark:text-teal-600 flex items-center">
                  <ControlsIcon className="w-5 h-5 mr-2.5" />
                  {t('inputComponentsTitle')}
              </h2>
              {isInputPanelExpanded ? <ChevronUpIcon className="w-6 h-6 text-teal-700 dark:text-teal-600" /> : <ChevronDownIcon className="w-6 h-6 text-teal-700 dark:text-teal-600" />}
            </div>

            <div id="input-panel-content" className={`flex-grow overflow-hidden ${isInputPanelExpanded ? 'collapsible-content open' : 'collapsible-content'}`}>
              <div className="p-4 sm:p-6 space-y-3 md:space-y-4 flex-grow overflow-y-auto" style={{maxHeight: isInputPanelExpanded ? 'calc(100vh - 280px)' : '0px'}}>

                <div className="p-3 border border-purple-600/50 rounded-lg bg-purple-900/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-purple-300 flex items-center">
                      <SparklesIcon className="w-4 h-4 mr-1.5 text-purple-400" />
                      {t('frameworkSuggestionsTitle')}
                      {apiKey && (
                        <span
                          className="ml-2 text-lg font-bold text-purple-400 api-status-indicator shrink-0"
                          aria-label={t('aiFeaturesActiveIndicator')}
                          title={t('aiFeaturesActiveIndicator')}
                        >
                          AI
                        </span>
                      )}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-400">{t('frameworkSuggestionInstruction')}</p>
                  <textarea
                    value={userGoalForFramework}
                    onChange={(e) => setUserGoalForFramework(e.target.value)}
                    placeholder={t('userGoalInputPlaceholder')}
                    rows={2}
                    className="w-full p-2 bg-slate-700/60 border border-slate-600 rounded-md focus:ring-1 focus:ring-purple-500 focus:border-purple-500 outline-none text-xs text-slate-100 placeholder-slate-400/70 non-copyable-input-field ai-suggestion-textarea"
                    aria-label={t('userGoalInputLabel')}
                  />
                  <button
                    onClick={handleFetchFrameworkSuggestions}
                    disabled={isFetchingFrameworkSuggestions || !apiKey}
                    className={`w-full mt-1 py-1.5 px-2 text-xs font-semibold rounded-md transition-colors duration-150 flex items-center justify-center space-x-1.5 shadow
                                ${!apiKey ? 'bg-slate-600 text-slate-400 cursor-not-allowed opacity-70' :
                                 isFetchingFrameworkSuggestions ? 'bg-purple-700 text-purple-300 animate-pulse cursor-wait' :
                                 'bg-purple-600 hover:bg-purple-500 text-white active:scale-95'}`}
                    aria-label={t('getFrameworkSuggestionsButtonAria')}
                    title={!apiKey ? t('apiKeyMissingError') : t('getFrameworkSuggestionsButtonAria')}
                  >
                    <SparklesIcon className="w-3.5 h-3.5" />
                    <span className="button-text-content">{isFetchingFrameworkSuggestions ? t('frameworkSuggestionsLoading') : t('getFrameworkSuggestionsButton')}</span>
                  </button>
                  {frameworkSuggestionError && <p className="text-xs text-rose-400">{frameworkSuggestionError}</p>}
                </div>

                <div className="space-y-2">
                  <p className="text-xs text-slate-400 dark:text-slate-400/80 mb-1.5">{t('selectCategoryInstruction')}</p>
                  <div className="flex border-b border-slate-600">
                    {(['text', 'media', 'music'] as const).map(cat => (
                      <button
                        key={cat}
                        onClick={() => handleCategorySelect(cat)}
                        className={`flex items-center justify-center py-2 px-3 sm:px-4 text-sm font-medium transition-colors duration-200 ease-in-out border-b-2 hover:bg-slate-700/60
                                    ${selectedCategory === cat
                                      ? 'border-teal-500 text-teal-500'
                                      : 'border-transparent text-slate-400 hover:text-teal-600'
                                    }`}
                        title={t(`${cat}FrameworksCategoryTooltip` as any)}
                        role="tab"
                        aria-selected={selectedCategory === cat}
                      >
                        {getCategoryIcon(cat, "w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2")}
                        <span className="button-text-content">{t(`${cat}FrameworksTitle`)}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {selectedCategory && (
                  <div className="space-y-1.5 pt-1">
                     <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1.5 sm:gap-2">
                      {frameworkCategories[selectedCategory].map(fw => {
                        const locale = language === 'id' ? fw.idLocale : fw.enLocale;
                        const isSuggested = suggestedFrameworkIds.includes(fw.id);
                        return (
                          <button
                            key={fw.id}
                            onClick={() => handleFrameworkSelect(fw)}
                            title={locale.description + (isSuggested ? ` (${t('suggestedFrameworkTooltip')})` : '')}
                            className={`p-1.5 sm:p-2 rounded-md text-xs font-medium border transition-colors duration-150 flex flex-col items-center justify-center space-y-0.5 min-h-[50px] sm:min-h-[55px] text-center relative
                                        ${selectedFramework?.id === fw.id
                                          ? 'bg-teal-700 border-teal-500 text-white shadow-md'
                                          : isSuggested
                                            ? 'bg-purple-700/50 border-purple-500 text-slate-100 hover:bg-purple-600/60 shadow-sm'
                                            : 'bg-slate-600 dark:bg-slate-700 hover:bg-teal-700/80 dark:hover:bg-teal-700/70 border-slate-500 dark:border-slate-600 text-slate-200 dark:text-slate-200 hover:text-white'
                                        }`}
                          >
                              {isSuggested && ! (selectedFramework?.id === fw.id) && (
                                <StarIcon className="absolute top-1 right-1 w-3 h-3 text-yellow-400" title={t('suggestedFrameworkTooltip')} />
                              )}
                              {getCategoryIcon(selectedCategory, "w-4 h-4 mb-0.5")}
                              <span className="button-text-content leading-tight">{locale.shortName}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {selectedFramework && currentFrameworkLocale && (
                  <div className="space-y-2.5 pt-2.5 border-t border-slate-700">
                    <div className="mb-1.5">
                        <p className="text-xs text-slate-300 dark:text-slate-400 mt-0.5">{currentFrameworkLocale.description}</p>
                    </div>

                    {currentFrameworkLocale.interactiveDefinition && currentFrameworkLocale.interactiveDefinition.length > 0 && currentFrameworkLocale.interactivePromptTemplate ? (
                        <InteractivePromptBuilder
                            sections={currentFrameworkLocale.interactiveDefinition}
                            initialValues={interactiveFormValues}
                            onValuesChange={handleInteractiveFormChange}
                            otherInputValues={otherInputValues}
                            onOtherInputChange={handleOtherInputChange}
                            language={language}
                            fetchSuggestions={aiClient ? fetchFieldSuggestions : undefined}
                            apiKeyAvailable={!!apiKey}
                            frameworkName={currentFrameworkLocale.name}
                        />
                    ) : currentFrameworkLocale.components && currentFrameworkLocale.components.length > 0 ? (
                        promptComponents.map(componentData => {
                           const fieldDescription = t('inputFieldDescription', componentData.label, currentFrameworkLocale.shortName);
                           const fieldPlaceholder = componentData.example || t('inputFieldPlaceholder', componentData.label);
                           const predefinedOptions = currentFrameworkLocale.predefinedOptions?.[componentData.id];

                          return (
                            <InputField
                              key={`${selectedFramework.id}-${componentData.id}-${language}`}
                              id={componentData.id}
                              label={componentData.label}
                              value={componentData.value}
                              onChange={handleInputChange}
                              placeholder={fieldPlaceholder}
                              isTextarea={true}
                              rows={2}
                              description={fieldDescription}
                              predefinedOptions={predefinedOptions}
                              isVisible={isInputPanelExpanded}
                              fetchSuggestions={aiClient ? fetchFieldSuggestions : undefined}
                              frameworkName={currentFrameworkLocale.name}
                              apiKeyAvailable={!!apiKey}
                              exampleText={componentData.example}
                            />
                          );
                        })
                    ) : (
                        <p className="text-xs text-slate-400 italic">{t('noInputComponents')}</p>
                    )}

                    {(!currentFrameworkLocale.interactiveDefinition || currentFrameworkLocale.interactiveDefinition.length === 0 ) &&
                     currentFrameworkLocale.components && currentFrameworkLocale.components.length > 0 && (
                         <InputField
                            id="userDefinedInteraction"
                            label={t('userDefinedInteractionLabel')}
                            value={userDefinedInteraction}
                            onChange={handleUserInteractionChange}
                            placeholder={t('userDefinedInteractionPlaceholder')}
                            isTextarea={true}
                            rows={3}
                            isVisible={isInputPanelExpanded}
                            apiKeyAvailable={!!apiKey}
                        />
                    )}

                    <button
                      onClick={clearInputs}
                      className="w-full mt-1.5 py-2 px-2.5 text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white rounded-md transition-colors duration-150 flex items-center justify-center space-x-1.5 transform active:scale-95 shadow"
                      aria-label={t('clearInputsButtonAria')}
                    >
                      <EraserIcon className="w-4 h-4" />
                      <span className="button-text-content">{t('clearInputsButton')}</span>
                    </button>
                  </div>
                )}
                {!selectedFramework && (
                   <p className="text-sm text-slate-400 italic text-center py-3">
                      {selectedCategory ? t('selectSpecificFrameworkInputSummary') : t('initialPromptAreaInstruction')}
                   </p>
                )}
              </div>
            </div>
             {!isInputPanelExpanded && selectedFramework && (
               <p className="px-4 sm:px-6 py-2.5 text-xs text-center text-slate-400 italic">
                  {t('clickToExpandInputPanel', currentFrameworkLocale?.name || '')}
              </p>
             )}
          </div>
        </div>

        <div className="flex flex-col bg-[var(--bg-secondary)] dark:bg-slate-800/70 p-1 rounded-xl shadow-xl border border-[var(--border-color)] dark:border-slate-700/50">
          <PromptOutput
            promptText={generatedPrompt}
            promptToCopy={promptToCopy}
            selectedFramework={selectedFramework}
            isExpanded={isOutputPanelExpanded}
            onToggleExpansion={() => setIsOutputPanelExpanded(!isOutputPanelExpanded)}
            aiFeedback={aiFeedback}
            isFetchingAiFeedback={isFetchingAiFeedback}
            aiError={aiError}
            onEnhanceWithAI={handleEnhanceWithAI}
            apiKeyAvailable={!!apiKey}
            aiFeedbackReceived={aiFeedbackReceived}
            hasCurrentPromptBeenCopied={hasCurrentPromptBeenCopied}
            onPromptSuccessfullyCopied={handlePromptSuccessfullyCopied}
          />
        </div>
      </main>

      <div className="fab-container">
        {(isTranslating || translationError) && (
            <div className="fab-translation-status bg-slate-900/85 fab-visual-effect">
                {isTranslating && (
                    <div className="flex items-center text-xs text-teal-400">
                        <svg className="animate-spin -ml-1 mr-1.5 h-4 w-4 text-teal-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {t('translationInProgress')}
                    </div>
                )}
                {translationError && !isTranslating && (
                    <div className="flex items-center text-xs text-rose-400" title={translationError}>
                        <InfoIcon className="w-4 h-4 mr-1"/>
                        Error
                    </div>
                )}
            </div>
        )}
        <button
          onClick={() => setShowHowToUse(true)}
          className="fab-button bg-slate-700/80 dark:bg-slate-800/80 hover:bg-teal-700/90 text-slate-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-slate-900 animate-subtle-pulse fab-visual-effect"
          title={t('howToUseAppTitleShort')}
          aria-label={t('howToUseAppTitleShort')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
          </svg>
        </button>
        <button
          onClick={handleLanguageToggle}
          className="fab-button bg-slate-700/80 dark:bg-slate-800/80 hover:bg-teal-700/90 text-slate-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-slate-900 fab-visual-effect"
          title={`Switch to ${language === 'id' ? 'English' : 'Bahasa Indonesia'}`}
          aria-label={`Switch to ${language === 'id' ? 'English' : 'Bahasa Indonesia'}`}
          disabled={isTranslating}
        >
          <span className="button-text-content text-sm font-semibold">{language === 'id' ? t('languageEN') : t('languageID')}</span>
        </button>
      </div>

      <footer className="w-full max-w-6xl mt-6 md:mt-8 pt-4 pb-2 border-t border-[var(--border-color)] text-center text-xs text-[var(--text-secondary)] dark:text-slate-500">
        <p>PromptMatrix V5.0 {new Date().getFullYear()}</p>
        <p>{t('footerOptimize')}</p>
        <p>
          {footerContactText}{' '}
          <a
            href="mailto:si.sigitadi@gmail.com"
            className="animated-signature focus:outline-none focus:ring-1 focus:ring-teal-500 rounded-sm"
          >
            si.sigitadi@gmail.com
          </a>
        </p>
      </footer>
    </div>
  );
};

export default App;
