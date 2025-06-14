
import React, { useState, useEffect, useCallback, ReactNode, useRef } from 'react';
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import InputField from './components/InputField';
import PromptOutput from './components/PromptOutput';
import InteractivePromptBuilder from './components/InteractivePromptBuilder'; 
import { Framework, Language, PromptComponent, FrameworkComponentDetail, InteractiveSectionDefinition } from './types';
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
import { frameworks, detailedImageVideoTemplate, detailedMusicTemplate } from './frameworks';


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

  // State untuk Saran Kerangka Kerja AI
  const [userGoalForFramework, setUserGoalForFramework] = useState<string>('');
  const [suggestedFrameworkIds, setSuggestedFrameworkIds] = useState<string[]>([]);
  const [isFetchingFrameworkSuggestions, setIsFetchingFrameworkSuggestions] = useState<boolean>(false);
  const [frameworkSuggestionError, setFrameworkSuggestionError] = useState<string | null>(null);


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
  
  const getInitialInteractiveDefaults = useCallback((frameworkLocale: Framework['idLocale'] | Framework['enLocale']): Record<string, string | string[]> => {
    const defaults: Record<string, string | string[]> = {};
    if (frameworkLocale.interactiveDefinition) {
      frameworkLocale.interactiveDefinition.forEach(section => {
        section.questions.forEach(question => {
          if (question.defaultValue !== undefined) {
            defaults[question.id] = question.defaultValue;
          } else if (question.type === 'multiple-choice') {
            defaults[question.id] = [];
          } else {
            defaults[question.id] = '';
          }
        });
      });
    }
    return defaults;
  }, []);
  
  const computeInitialInteractiveFormState = useCallback((frameworkLocale: Framework['idLocale'] | Framework['enLocale']): Record<string, string | string[]> => {
    const frameworkDefaultValues = getInitialInteractiveDefaults(frameworkLocale);
    const formInitialState: Record<string, string | string[]> = {};

    if (frameworkLocale.interactiveDefinition) {
      frameworkLocale.interactiveDefinition.forEach(section => {
        section.questions.forEach(question => {
          const key = question.id;
          const defaultValueFromFramework = frameworkDefaultValues[key];

          if (question.type === 'manual' && typeof defaultValueFromFramework === 'string' && defaultValueFromFramework.trim() !== '') {
            formInitialState[key] = ''; 
          } else if (defaultValueFromFramework !== undefined) {
            formInitialState[key] = defaultValueFromFramework;
          } else if (question.type === 'multiple-choice') {
            formInitialState[key] = [];
          } else {
            formInitialState[key] = '';
          }
        });
      });
    }
    return formInitialState;
  }, [getInitialInteractiveDefaults]);


  const handleFrameworkSelect = (framework: Framework) => {
    setSelectedFramework(framework);
    const currentLocale = language === 'id' ? framework.idLocale : framework.enLocale;
    
    setOtherInputValues({}); 

    if (currentLocale.interactiveDefinition && currentLocale.interactiveDefinition.length > 0) {
        setPromptComponents([]); 
        setInteractiveFormValues(computeInitialInteractiveFormState(currentLocale));
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
    // setUserGoalForFramework(''); // Reset goal when framework is selected, to avoid stale suggestions for different framework
    // setSuggestedFrameworkIds([]); // Reset suggestions
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

  const handleCategorySelect = (category: 'text' | 'media' | 'music') => {
    if (selectedCategory !== category) {
      setSelectedCategory(category);
      setSelectedFramework(null); 
      setPromptComponents([]);
      setUserDefinedInteraction('');
      setInteractiveFormValues({}); 
      setOtherInputValues({}); 
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
        if (currentFrameworkLocale.interactiveDefinition && currentFrameworkLocale.interactiveDefinition.length > 0) {
            setInteractiveFormValues(computeInitialInteractiveFormState(currentFrameworkLocale)); 
        } else {
            setInteractiveFormValues({}); 
        }
    } else {
        setInteractiveFormValues({});
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
    if (!selectedFramework || !currentFrameworkLocale) {
      setGeneratedPrompt(selectedCategory ? t('selectSpecificFrameworkOutputSummary') : t('selectFrameworkPromptAreaInstruction'));
      setPromptToCopy('');
      return;
    }

    if (currentFrameworkLocale.interactiveDefinition && currentFrameworkLocale.interactiveDefinition.length > 0 && currentFrameworkLocale.interactivePromptTemplate) {
      const initialFormStateForComparison = computeInitialInteractiveFormState(currentFrameworkLocale);
      let formIsDirty = false;

      Object.keys(initialFormStateForComparison).forEach(key => {
        if (formIsDirty) return;

        const currentValueInState = interactiveFormValues[key];
        const initialValueForComparison = initialFormStateForComparison[key];
        const questionDefinition = currentFrameworkLocale.interactiveDefinition?.flatMap(s => s.questions).find(q => q.id === key);

        if (questionDefinition?.type === 'manual') {
           if (typeof currentValueInState === 'string' && currentValueInState.trim() !== (initialValueForComparison as string).trim()) {
             formIsDirty = true;
           }
        } else if (questionDefinition?.type === 'single-choice' && questionDefinition.includeOtherOption && currentValueInState === 'LAINNYA_INTERAKTIF_PLACEHOLDER') {
           const otherTextValue = otherInputValues[key]?.trim() || '';
           if (otherTextValue !== '') { 
               formIsDirty = true;
           } else if (initialValueForComparison !== 'LAINNYA_INTERAKTIF_PLACEHOLDER') { 
               formIsDirty = true;
           }
        } else if (Array.isArray(currentValueInState) && Array.isArray(initialValueForComparison)) {
          if (currentValueInState.length !== initialValueForComparison.length || !currentValueInState.every((val, i) => val === initialValueForComparison[i])) {
            formIsDirty = true;
          }
        } else if (currentValueInState !== initialValueForComparison) {
           formIsDirty = true;
        }
      });
      
      if (!formIsDirty) {
        setGeneratedPrompt(t('initialPromptAreaInstruction'));
        setPromptToCopy('');
      } else {
        let assembledPrompt = currentFrameworkLocale.interactivePromptTemplate;
        const rawFormValues: Record<string, string> = {}; // Holds processed string values from the form

        // Populate rawFormValues with trimmed string versions of all interactive inputs
        currentFrameworkLocale.interactiveDefinition.forEach(section => {
          section.questions.forEach(question => {
            let valueFromForm = interactiveFormValues[question.id];
            let stringValue: string;

            if (valueFromForm === 'LAINNYA_INTERAKTIF_PLACEHOLDER') {
              stringValue = otherInputValues[question.id]?.trim() || '';
            } else if (Array.isArray(valueFromForm)) {
              stringValue = valueFromForm.join(', ').trim();
            } else if (typeof valueFromForm === 'string') {
              stringValue = valueFromForm.trim();
            } else {
              stringValue = '';
            }
            rawFormValues[question.id] = stringValue;
          });
        });
        
        const processedValuesForTemplate: Record<string, string> = { ...rawFormValues };
        
        // Specific logic to construct parameter strings for templates
        if (selectedFramework.id === 'google_veo') {
            processedValuesForTemplate.veo_negative_parameter_string = rawFormValues.negative ? ` --no ${rawFormValues.negative}` : '';
        }
        if (selectedFramework.id === 'midjourney') {
            processedValuesForTemplate.midjourney_aspect_ratio_param_string = rawFormValues.aspect_ratio?.split(' ')[0] ? ` --ar ${rawFormValues.aspect_ratio.split(' ')[0]}` : '';
            processedValuesForTemplate.midjourney_version_param_string = rawFormValues.version ? (rawFormValues.version.includes("niji") ? ` --niji ${rawFormValues.version.split(' ')[1]}` : ` --v ${rawFormValues.version}`) : '';
            processedValuesForTemplate.midjourney_stylize_param_string = rawFormValues.stylize ? ` --s ${rawFormValues.stylize}` : '';
            processedValuesForTemplate.midjourney_chaos_param_string = rawFormValues.chaos ? ` --c ${rawFormValues.chaos}` : '';
            processedValuesForTemplate.midjourney_weird_param_string = rawFormValues.weird ? ` --weird ${rawFormValues.weird}` : '';
            processedValuesForTemplate.midjourney_tile_param_string = (rawFormValues.tile === 'Ya' || rawFormValues.tile === 'Yes') ? ' --tile' : '';
            processedValuesForTemplate.midjourney_iw_param_string = rawFormValues.image_weight ? ` --iw ${rawFormValues.image_weight}` : '';
            processedValuesForTemplate.midjourney_style_raw_param_string = (rawFormValues.style_raw === 'Ya (untuk v5+)' || rawFormValues.style_raw === 'Yes (for v5+)') ? ' --style raw' : '';
            // Ensure other_params (which can contain --no) is processed correctly
            processedValuesForTemplate.other_params = rawFormValues.other_params || '';
        }
        if (selectedFramework.id === 'dalle3') {
             processedValuesForTemplate.dalle_aspect_ratio_value = rawFormValues.aspect_ratio_dalle?.split(' ')[0] || '1:1';
        }
        if (selectedFramework.id === 'stable_diffusion') {
            let sdNegative = '';
            if (rawFormValues.negative_elements && rawFormValues.negative_elements.trim() !== '') sdNegative += rawFormValues.negative_elements;
            if (rawFormValues.custom_negative_prompt && rawFormValues.custom_negative_prompt.trim() !== '') {
                if (sdNegative) sdNegative += ', ';
                sdNegative += rawFormValues.custom_negative_prompt;
            }
            processedValuesForTemplate.sd_negative_param_string = sdNegative ? ` --neg ${sdNegative}` : '';
            processedValuesForTemplate.sd_params_note_string = rawFormValues.param_info ? ` --params ${rawFormValues.param_info}` : '';
        }
        if (selectedFramework.id === 'suno_ai') {
          let sunoLyricsContent = '';
          const lyricsInput = rawFormValues.custom_lyrics_section || rawFormValues.lyrics_theme || '';
          if (lyricsInput.trim().toLowerCase().startsWith('[verse]') || lyricsInput.trim().toLowerCase().startsWith('[chorus]')) {
            sunoLyricsContent = `\n\n[Lyrics]\n${lyricsInput.trim()}`;
          } else if (lyricsInput.trim()) {
            sunoLyricsContent = ` Lyrical theme: ${lyricsInput.trim()}.`;
          }
          processedValuesForTemplate.suno_lyrics_block = sunoLyricsContent;
        }
        
        const templateToCheck = currentFrameworkLocale.interactivePromptTemplate;
        if (templateToCheck === detailedImageVideoTemplate) {
            let detailedNegative = '';
            if (rawFormValues.custom_negative?.trim()) {
                detailedNegative += ` --no ${rawFormValues.custom_negative.trim()}`;
            }
            if (rawFormValues.negative_prompt_elements?.trim()) {
                detailedNegative += (detailedNegative ? ' ' : '') + `--no ${rawFormValues.negative_prompt_elements.trim()}`;
            }
            processedValuesForTemplate.detailed_image_negative_param_string = detailedNegative.trim();
            processedValuesForTemplate.detailed_image_aspect_ratio_param_string = rawFormValues.aspect_ratio?.split(' ')[0] ? ` --ar ${rawFormValues.aspect_ratio.split(' ')[0]}` : '';
        }
        if (templateToCheck === detailedMusicTemplate) {
            let musicLyricsContent = '';
            const lyricsOrTheme = rawFormValues.lyrical_theme_or_custom || '';
            if (lyricsOrTheme.trim().toLowerCase().startsWith('[verse]') || lyricsOrTheme.trim().toLowerCase().startsWith('[chorus]')) {
                 musicLyricsContent = `\nLyrics:\n${lyricsOrTheme.trim()}`;
            } else if (lyricsOrTheme.trim()) {
                 musicLyricsContent = ` Lyrical theme: ${lyricsOrTheme.trim()}`;
            }
            processedValuesForTemplate.detailed_music_lyrics_block = musicLyricsContent;
        }

        // Replace placeholders
        for (const key in processedValuesForTemplate) {
          const regex = new RegExp(`{{${key}}}`, 'g');
          // Ensure that if a value is undefined/null, it's replaced by an empty string
          assembledPrompt = assembledPrompt.replace(regex, processedValuesForTemplate[key] || '');
        }
        
        // Remove any unfulfilled placeholders (e.g., {{placeholder_that_had_no_value}})
        assembledPrompt = assembledPrompt.replace(/\{\{[^{}]*?\}\}/g, '').trim();


        // Final Cleanup Steps
        assembledPrompt = assembledPrompt.replace(/\s\s+/g, ' ').trim();
        const orphanedLabelWithDotRegex = /([a-zA-Z0-9\s\(\)\[\]'"‘’“”,]+:\s*\.(?=(\s|$|,|--)))/g;
        const orphanedLabelWithCommaRegex = /([a-zA-Z0-9\s\(\)\[\]'"‘’“”,]+:\s*,(?=(\s|$|,|--)))/g;
        assembledPrompt = assembledPrompt.replace(orphanedLabelWithDotRegex, '');
        assembledPrompt = assembledPrompt.replace(orphanedLabelWithCommaRegex, '');

        assembledPrompt = assembledPrompt
                          .replace(/,\s*,/g, ',').replace(/\s*,/g, ',').replace(/,\s+/g, ', ')
                          .replace(/\.\s*\./g, '.').replace(/,\s*\./g, '.').replace(/\.\s*,/g, '.')
                          .replace(/\s*--no\s*--params/g, '--no --params') 
                          .replace(/\s*--neg\s*--params/g, '--neg --params')
                          .replace(/,\s*(--\w+)/g, ' $1') 
                          .replace(/\s\s+/g, ' ').trim();

        assembledPrompt = assembledPrompt.replace(/^[\s,.]+/g, '').replace(/[\s,.]+(?=\s*$)/g, '');
        if (assembledPrompt.endsWith('--neg')) assembledPrompt = assembledPrompt.slice(0, -5).trim();
        if (assembledPrompt.endsWith('--no')) assembledPrompt = assembledPrompt.slice(0, -4).trim();
        if (assembledPrompt.endsWith('--params')) assembledPrompt = assembledPrompt.slice(0, -8).trim();
        assembledPrompt = assembledPrompt.trim();

        const cleanedTemplateStructure = (currentFrameworkLocale.interactivePromptTemplate || '')
            .replace(/\{\{[^{}]*?\}\}/g, '') 
            .replace(/\s\s+/g, ' ').trim();

        if (assembledPrompt === '' || assembledPrompt === cleanedTemplateStructure) {
            setGeneratedPrompt(t('initialPromptAreaInstruction'));
            setPromptToCopy('');
        } else {
            setGeneratedPrompt(assembledPrompt);
            setPromptToCopy(assembledPrompt);
        }
      }

    } else { // Handle Standard Framework
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
      getInitialInteractiveDefaults,
      computeInitialInteractiveFormState 
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

    if (!aiClient) {
      setLanguage(newLanguage); 
      setOtherInputValues({});
      if (selectedFramework) {
          const frameworkLocale = newLanguage === 'id' ? selectedFramework.idLocale : selectedFramework.enLocale;
          if (frameworkLocale.interactiveDefinition && frameworkLocale.interactiveDefinition.length > 0) {
            setInteractiveFormValues(computeInitialInteractiveFormState(frameworkLocale));
          } else if (frameworkLocale.components) { 
            const updatedComponents = frameworkLocale.components.map((compDetail: FrameworkComponentDetail) => {
              const existingComp = promptComponents.find(pc => pc.id === compDetail.id);
              return {
                id: compDetail.id,
                value: existingComp?.value || '',
                label: compDetail.id,
                example: compDetail.example
              };
            });
            setPromptComponents(updatedComponents);
          } else {
             setPromptComponents([]); 
             setInteractiveFormValues({});
          }
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
            const frameworkForExample = selectedFramework ? (newLanguage === 'id' ? selectedFramework.idLocale : selectedFramework.enLocale) : null;
            const componentDetailForExample = frameworkForExample?.components?.find(compDet => compDet.id === pc.id);
            
            return { 
              ...pc, 
              value: translatedValue, 
              example: componentDetailForExample?.example || pc.example
            };
          })
        );
        setPromptComponents(translatedPromptComponents);
      }

      if (Object.keys(interactiveFormValues).length > 0 && selectedFramework?.idLocale.interactiveDefinition) {
        const translatedInteractiveValues: Record<string, string | string[]> = {};
        const translatedOtherInputValues: Record<string, string> = {};
        const frameworkLocaleForNewLang = newLanguage === 'id' ? selectedFramework.idLocale : selectedFramework.enLocale;
        const initialNewLangDefaults = getInitialInteractiveDefaults(frameworkLocaleForNewLang);

        for (const key in interactiveFormValues) {
          const value = interactiveFormValues[key];
          const originalOtherValue = otherInputValues[key];
          
          let isDefaultValue = false;
          const currentFrameworkLocaleForDefaults = currentPreviousLanguage === 'id' ? selectedFramework.idLocale : selectedFramework.enLocale;
          const currentLangDefaultValue = getInitialInteractiveDefaults(currentFrameworkLocaleForDefaults)[key];
          
          const questionDefinition = currentFrameworkLocale?.interactiveDefinition?.flatMap(s => s.questions).find(q => q.id === key);
          
          if (questionDefinition?.type === 'manual' && typeof currentLangDefaultValue === 'string' && currentLangDefaultValue.trim() !== '') {
             isDefaultValue = (value as string).trim() === ''; 
          } else if (Array.isArray(value) && Array.isArray(currentLangDefaultValue)) {
            isDefaultValue = value.length === currentLangDefaultValue.length && value.every((v, i) => v === currentLangDefaultValue[i]);
          } else {
            isDefaultValue = value === currentLangDefaultValue;
          }

          if (value === 'LAINNYA_INTERAKTIF_PLACEHOLDER' && originalOtherValue && originalOtherValue.trim() !== '') {
            try {
              translatedOtherInputValues[key] = await translateText(originalOtherValue, currentPreviousLanguage, newLanguage);
              translatedInteractiveValues[key] = 'LAINNYA_INTERAKTIF_PLACEHOLDER'; 
            } catch (error) {
              console.warn(`Translation failed for interactive 'other' value ${key}:`, error);
              translatedOtherInputValues[key] = originalOtherValue; 
              translatedInteractiveValues[key] = 'LAINNYA_INTERAKTIF_PLACEHOLDER';
              translationOccurredError = true;
            }
          } else if (typeof value === 'string' && value.trim() !== '' && value !== 'LAINNYA_INTERAKTIF_PLACEHOLDER') {
             if (isDefaultValue && (questionDefinition?.type !== 'manual' || (typeof currentLangDefaultValue === 'string' && currentLangDefaultValue.trim() === ''))) { 
                translatedInteractiveValues[key] = initialNewLangDefaults[key] !== undefined ? initialNewLangDefaults[key] as string : value;
             } else if (isDefaultValue && questionDefinition?.type === 'manual') {
                translatedInteractiveValues[key] = ''; 
             }
             else { 
                try {
                  translatedInteractiveValues[key] = await translateText(value, currentPreviousLanguage, newLanguage);
                } catch (error) {
                  console.warn(`Translation failed for interactive value ${key}:`, error);
                  translatedInteractiveValues[key] = value; 
                  translationOccurredError = true;
                }
             }
          } else if (Array.isArray(value)) { 
             if (isDefaultValue) {
                translatedInteractiveValues[key] = initialNewLangDefaults[key] !== undefined ? initialNewLangDefaults[key] as string[] : value;
             } else {
                const translatedArray = await Promise.all(value.map(async item => {
                    if(item.trim() !== '') {
                        try { return await translateText(item, currentPreviousLanguage, newLanguage); }
                        catch (e) { translationOccurredError = true; return item; }
                    }
                    return item;
                }));
                translatedInteractiveValues[key] = translatedArray;
             }
          }
          else { 
            if (questionDefinition?.type === 'manual' && typeof initialNewLangDefaults[key] === 'string' && (initialNewLangDefaults[key] as string).trim() !== '') {
                 translatedInteractiveValues[key] = ''; 
            } else {
                 translatedInteractiveValues[key] = initialNewLangDefaults[key] !== undefined ? initialNewLangDefaults[key] : value;
            }
          }
        }
        setInteractiveFormValues(translatedInteractiveValues);
        setOtherInputValues(translatedOtherInputValues);
      }

      if (userDefinedInteraction.trim() !== '') {
        try {
          const translatedUserInteraction = await translateText(userDefinedInteraction, currentPreviousLanguage, newLanguage);
          setUserDefinedInteraction(translatedUserInteraction);
        } catch (error) {
          console.warn(`Translation failed for user defined interaction:`, error);
          translationOccurredError = true;
        }
      }
      
      if (aiFeedback && aiFeedback.trim() !== '') {
        try {
          const translatedAiFeedback = await translateText(aiFeedback, currentPreviousLanguage, newLanguage);
          setAiFeedback(translatedAiFeedback);
        } catch (error) {
          console.warn(`Translation failed for AI feedback:`, error);
          translationOccurredError = true;
        }
      }

      if (userGoalForFramework.trim() !== '') {
         try {
            setUserGoalForFramework(await translateText(userGoalForFramework, currentPreviousLanguage, newLanguage));
         } catch (e) {
            console.warn("Failed to translate user goal for framework suggestions.");
            translationOccurredError = true;
         }
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
      if (selectedFramework && !aiClient && !translationOccurredError) { 
          const newLocaleFramework = newLanguage === 'id' ? selectedFramework.idLocale : selectedFramework.enLocale;
          if (newLocaleFramework.interactiveDefinition && newLocaleFramework.interactiveDefinition.length > 0) {
             setInteractiveFormValues(computeInitialInteractiveFormState(newLocaleFramework));
             setOtherInputValues({});
          }
          else if (newLocaleFramework.components) {
             const updatedComponents = newLocaleFramework.components.map((compDetail: FrameworkComponentDetail) => {
              const existingComp = promptComponents.find(pc => pc.id === compDetail.id); 
              return {
                id: compDetail.id,
                value: existingComp?.value || '', 
                label: compDetail.id,
                example: compDetail.example
              };
            });
            setPromptComponents(updatedComponents);
            setInteractiveFormValues({}); 
            setOtherInputValues({});
          }
      }
    }
  };
  
  useEffect(() => {
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
          <div className="flex items-baseline"> 
            <span className="text-3xl sm:text-4xl font-bold text-teal-600 dark:text-teal-500">
              Prompt
            </span>
            <div className="flex flex-col ml-1"> 
              <div className="text-xs sm:text-sm font-medium self-start leading-none">
                {apiKey ? (
                  <>
                    <span className="animate-word-up-down-1">AI</span>
                    <span className="animate-word-up-down-2 ml-0.5">Inside</span>
                  </>
                ) : (
                  <>
                    <span className="animate-word-up-down-disconnected-1">Dis</span>
                    <span className="animate-word-up-down-disconnected-2 ml-0.5">connected</span>
                  </>
                )}
              </div>
              <span className="text-3xl sm:text-4xl font-bold text-teal-600 dark:text-teal-500 leading-tight">
                Matrix
              </span>
            </div>
          </div>
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
                    </h3>
                     {apiKey && (
                       <span className="text-xs text-purple-400 italic" title={t('aiPoweredFeatureTooltip')}>
                         AI Powered
                       </span>
                     )}
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
