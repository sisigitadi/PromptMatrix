import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Framework, Language, PromptComponent, FrameworkComponentDetail, TranslationKey, SavedPrompt, WebResearchDataSource } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { frameworks } from '../frameworks';
import { KONAMI_CODE_SEQUENCE, TITLE_TAP_TARGET_COUNT } from '../constants';
import { addPromptToDB, getAllPromptsFromDB, deletePromptFromDB, updatePromptInDB, getPromptByIdFromDB } from '../db';

export const useAppLogic = () => {
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

    const [userGoalForFramework, setUserGoalForFramework] = useState<string>('');
    const [suggestedFrameworkIds, setSuggestedFrameworkIds] = useState<string[]>([]);
    const [isFetchingFrameworkSuggestions, setIsFetchingFrameworkSuggestions] = useState<boolean>(false);
    const [frameworkSuggestionError, setFrameworkSuggestionError] = useState<string | null>(null);

    const [webResearchSummary, setWebResearchSummary] = useState<string | null>(null);
    const [webResearchSources, setWebResearchSources] = useState<WebResearchDataSource[] | null>(null);
    const [isFetchingWebResearch, setIsFetchingWebResearch] = useState<boolean>(false);
    const [webResearchError, setWebResearchError] = useState<string | null>(null);
    const [webResearchReceived, setWebResearchReceived] = useState<boolean>(false);

    const [sessionDevToggleActivated, setSessionDevToggleActivated] = useState<boolean>(false);
    const konamiCodeIndexRef = useRef<number>(0);
    const [titleTapCount, setTitleTapCount] = useState<number>(0);
    const [devToggleUiSelection, setDevToggleUiSelection] = useState<'free' | 'premium'>('free');


    const apiKeyFromEnv = process.env.API_KEY;
    let resolvedApiKeyFromEnv: string | null = null;
    if (typeof apiKeyFromEnv === 'string' && apiKeyFromEnv.trim() !== '' && apiKeyFromEnv.trim() !== "undefined") {
        resolvedApiKeyFromEnv = apiKeyFromEnv.trim();
    }

    const baseApiKeyActuallyAvailable = !!resolvedApiKeyFromEnv;

    const apiKeyAvailable = useMemo(() => {
        if (sessionDevToggleActivated) {
            if (devToggleUiSelection === 'free') {
                return false;
            } else if (devToggleUiSelection === 'premium') {
                return true;
            }
        }
        return baseApiKeyActuallyAvailable;
    }, [sessionDevToggleActivated, devToggleUiSelection, baseApiKeyActuallyAvailable]);

    const aiClient = resolvedApiKeyFromEnv ? new GoogleGenAI({ apiKey: resolvedApiKeyFromEnv }) : null;


    const [savedPrompts, setSavedPrompts] = useState<SavedPrompt[]>([]);
    const [isDBLoading, setIsDBLoading] = useState<boolean>(true);
    const [dbError, setDbError] = useState<string | null>(null);
    const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    const [frameworkSearchTerm, setFrameworkSearchTerm] = useState<string>('');
    const [globalActivityMessage, setGlobalActivityMessage] = useState<string | null>(null);

    const [forceGlobalSearchDisplay, setForceGlobalSearchDisplay] = useState<boolean>(false);
    const prevFrameworkSearchTermRef = useRef<string>('');

    useEffect(() => {
        const currentSearchActive = frameworkSearchTerm.trim() !== '';
        const prevSearchActive = prevFrameworkSearchTermRef.current.trim() !== '';

        if (currentSearchActive && !prevSearchActive) {
            setForceGlobalSearchDisplay(true);
        } else if (!currentSearchActive && prevSearchActive) {
            setForceGlobalSearchDisplay(false);
        }

        prevFrameworkSearchTermRef.current = frameworkSearchTerm;
    }, [frameworkSearchTerm]);

    useEffect((): (() => void) | undefined => {
        if (apiKeyAvailable && hasShownInitialModals && localStorage.getItem('shownTeaserPopupV6_2_0') !== 'true') {
            const timer = setTimeout(() => {
                setShowTeaserPopup(true);
                localStorage.setItem('shownTeaserPopupV6_2_0', 'true');
            }, 500);
            return () => clearTimeout(timer);
        }
        return undefined;
    }, [hasShownInitialModals, apiKeyAvailable]);

    useEffect((): (() => void) | undefined => {
        if (!apiKeyAvailable) {
            setGlobalActivityMessage(null);
            return;
        }
        if (isFetchingAiFeedback) {
            setGlobalActivityMessage(t('activityGettingFeedback'));
        } else if (isFetchingDetailedAnalysis) {
            setGlobalActivityMessage(t('activityAnalyzingPrompt'));
        } else if (isFetchingFrameworkSuggestions) {
            setGlobalActivityMessage(t('activityFetchingSuggestions'));
        } else if (isFetchingWebResearch) {
            setGlobalActivityMessage(t('activityFetchingWebResearch'));
        } else if (isTranslating) {
            setGlobalActivityMessage(t('activityTranslatingContent'));
        } else {
            setGlobalActivityMessage(null);
        }
        return undefined;
    }, [isFetchingAiFeedback, isFetchingDetailedAnalysis, isFetchingFrameworkSuggestions, isFetchingWebResearch, isTranslating, t, apiKeyAvailable]);


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
    }, [t]);

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
        setWebResearchSummary(null);
        setWebResearchSources(null);
        setWebResearchError(null);
        setWebResearchReceived(false);
    };

    const handleSavePrompt = async () => {
        if (!promptToCopy.trim() || !selectedFramework) {
            showToast('error', 'nothingToCopyMessage');
            return;
        }

        const userTitleInput = window.prompt(t('promptNameInputPlaceholder'), t('defaultSavePromptTitle'));
        if (!userTitleInput || !userTitleInput.trim()) return;

        const userNotesInput = window.prompt(t('promptNotesInputPlaceholder'));
        const userNotes = userNotesInput ? userNotesInput.trim() : '';

        const frameworkName = selectedFramework[language === 'id' ? 'idLocale' : 'enLocale'].name.replace(/[^\w\s-]/gi, '').replace(/\s+/g, '-');
        const currentDate = new Date().toISOString().split('T')[0];

        const finalPromptName = `${userTitleInput.trim()}_${frameworkName}_${currentDate}`;

        const newSavedPromptData: Omit<SavedPrompt, 'id' | 'timestamp'> = {
            name: finalPromptName,
            frameworkId: selectedFramework.id,
            category: selectedCategory,
            promptComponents: [...promptComponents],
            interactiveFormValues: {}, // No longer relevant
            otherInputValues: {}, // No longer relevant
            userDefinedInteraction: userDefinedInteraction,
            generatedPrompt: generatedPrompt,
            promptToCopy: promptToCopy,
            language: language,
            selectedFrameworkName: t(selectedFramework[language === 'id' ? 'idLocale' : 'enLocale'].name),
            notes: userNotes,
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

                if (targetLanguage !== language) {
                    previousLanguageRef.current = language;
                    setLanguage(targetLanguage);
                }

                const frameworkToLoad = frameworks.find(fw => fw.id === promptToLoad.frameworkId);
                if (frameworkToLoad) {
                    setSelectedCategory(promptToLoad.category);
                    setSelectedFramework(frameworkToLoad);

                    setTimeout(() => { // Allow state to update before processing components
                        const currentLocale = targetLanguage === 'id' ? frameworkToLoad.idLocale : frameworkToLoad.enLocale;

                        if (currentLocale.components && currentLocale.components.length > 0) {
                            const newPromptComponents = currentLocale.components.map((compDetail, index) => {
                                const loadedCompValue = promptToLoad.promptComponents[index]?.value || '';
                                return {
                                    id: compDetail.id,
                                    value: loadedCompValue,
                                    label: compDetail.label,
                                    example: compDetail.example,
                                };
                            });
                            setPromptComponents(newPromptComponents);
                        } else {
                            setPromptComponents(promptToLoad.promptComponents.map(pc => ({ ...pc })));
                        }
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
                    }, 100);

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


    const handleDisclaimerAcknowledge = () => {
        setShowDisclaimer(false);
        if (!hasShownInitialModals) {
            setShowHowToUse(true);
            setIsHowToUseModalShownAutomatically(true);
        } else {
            if (apiKeyAvailable && localStorage.getItem('shownTeaserPopupV6_2_0') !== 'true') {
                setShowTeaserPopup(true);
                localStorage.setItem('shownTeaserPopupV6_2_0', 'true');
            }
        }
    };

    const handleHowToUseClose = () => {
        setShowHowToUse(false);
        if (isHowToUseModalShownAutomatically) {
            setHasShownInitialModals(true);
            localStorage.setItem('hasShownInitialModalsV6', 'true');
            setIsHowToUseModalShownAutomatically(false);
            if (apiKeyAvailable && localStorage.getItem('shownTeaserPopupV6_2_0') !== 'true') {
                setShowTeaserPopup(true);
                localStorage.setItem('shownTeaserPopupV6_2_0', 'true');
            }
        }
    };

    const handleFrameworkSelect = (framework: Framework) => {
        setSelectedFramework(framework);
        setSelectedCategory(framework.idLocale.category as 'text' | 'media' | 'music');
        setFrameworkSearchTerm('');
        setForceGlobalSearchDisplay(false);

        const currentLocale = language === 'id' ? framework.idLocale : framework.enLocale;

        if (currentLocale.components) {
            const initialComponents = currentLocale.components.map((componentDetail: FrameworkComponentDetail) => ({
                id: componentDetail.id,
                value: '',
                label: componentDetail.label,
                example: componentDetail.example,
                tooltip: componentDetail.tooltip,
            }));
            setPromptComponents(initialComponents);
        } else {
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
        setSuggestedFrameworkIds([]);
        setIsFetchingFrameworkSuggestions(false);
        setFrameworkSuggestionError(null);
        setWebResearchSummary(null);
        setWebResearchSources(null);
        setWebResearchError(null);
        setIsFetchingWebResearch(false);
        setWebResearchReceived(false);
    };

    const handleCategorySelect = (newCategory: 'text' | 'media' | 'music') => {
        setForceGlobalSearchDisplay(false);
        if (selectedCategory !== newCategory || frameworkSearchTerm.trim() !== '') {
            setSelectedCategory(newCategory);
            setSelectedFramework(null);
            setPromptComponents([]);
            setUserDefinedInteraction('');
            clearAiStates();
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

    const handleUserInteractionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setUserDefinedInteraction(event.target.value);
    };

    const clearInputs = () => {
        setPromptComponents(prevComponents =>
            prevComponents.map(comp => ({ ...comp, value: '' }))
        );
        setUserDefinedInteraction('');
        clearAiStates();
        setHasCurrentPromptBeenCopied(false);
    };

    const handleFetchFrameworkFunctionality = async (mode: 'internal' | 'web_research') => {
        if (!aiClient || !userGoalForFramework.trim() || !apiKeyAvailable) return;

        if (mode === 'internal') {
            setIsFetchingFrameworkSuggestions(true);
            setFrameworkSuggestionError(null);
            setSuggestedFrameworkIds([]);
        } else {
            setIsFetchingWebResearch(true);
            setWebResearchError(null);
            setWebResearchSummary(null);
            setWebResearchSources(null);
            setWebResearchReceived(false);
        }

        try {
            const model = 'gemini-2.5-flash-preview-04-17';

            if (mode === 'internal') {
                const allFrameworksInfo = frameworks
                    .map(fw => {
                        const locale = language === 'id' ? fw.idLocale : fw.enLocale;
                        return { id: fw.id, name: t(locale.name), description: t(locale.description), category: locale.category };
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
            } else {
                const systemInstruction = t('geminiInstructionForWebResearch', userGoalForFramework);
                const response: GenerateContentResponse = await aiClient.models.generateContent({
                    model: model,
                    contents: `Based on the user's goal: "${userGoalForFramework}", research and summarize new prompt engineering techniques.`,
                    config: {
                        tools: [{ googleSearch: {} }],
                        systemInstruction: systemInstruction,
                    }
                });

                setWebResearchSummary(response.text);
                const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
                    ?.map(chunk => chunk.web ? { title: chunk.web.title || chunk.web.uri, uri: chunk.web.uri } : null)
                    .filter((source): source is WebResearchDataSource => source !== null && !!source.uri) || [];
                setWebResearchSources(sources);
                setWebResearchReceived(true);
                if (!response.text.trim() && sources.length === 0) {
                    setWebResearchError(t('noWebResearchFoundError'));
                }
            }

        } catch (e: any) {
            console.error(`AI Functionality (${mode}) API error:`, e);
            const detailMessage = (e && typeof e.message === 'string') ? e.message : String(e);
            const baseErrorMessageKey = mode === 'internal' ? 'frameworkSuggestionsError' : 'webResearchError';
            const errorMessage = t(baseErrorMessageKey as TranslationKey) + (detailMessage ? ` (${detailMessage})` : '');

            if (mode === 'internal') {
                setFrameworkSuggestionError(errorMessage);
                setSuggestedFrameworkIds([]);
            } else {
                setWebResearchError(errorMessage);
                setWebResearchSummary(null);
                setWebResearchSources(null);
                setWebResearchReceived(false);
            }
        } finally {
            if (mode === 'internal') {
                setIsFetchingFrameworkSuggestions(false);
            } else {
                setIsFetchingWebResearch(false);
            }
        }
    };

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
        const oldLanguage = language;
        const newLanguage = language === 'id' ? 'en' : 'id';

        previousLanguageRef.current = oldLanguage;
        resetFrameworkSuggestionStates();
        clearAiStates();

        if (!selectedFramework) {
            setLanguage(newLanguage);
            return;
        }

        const frameworkForNewLang = newLanguage === 'id' ? selectedFramework.idLocale : selectedFramework.enLocale;
        const newFrameworkComponents = (frameworkForNewLang.components || []).map((componentDetail, index) => {
            const existingCompState = promptComponents[index];
            return {
                id: componentDetail.id,
                value: existingCompState?.value || '',
                label: componentDetail.label,
                example: componentDetail.example,
                tooltip: componentDetail.tooltip,
            };
        });

        if (!apiKeyAvailable) {
            setPromptComponents(newFrameworkComponents.map(comp => ({ ...comp, value: '' })));
            setUserDefinedInteraction('');
            setUserGoalForFramework('');
            setLanguage(newLanguage);
            return;
        }

        setIsTranslating(true);
        setTranslationError(null);
        let translationOccurredError = false;

        try {
            const translatedPromptComponents = await Promise.all(
                newFrameworkComponents.map(async (comp) => {
                    let translatedValue = comp.value;
                    if (translatedValue.trim() !== '') {
                        try {
                            translatedValue = await translateText(translatedValue, oldLanguage, newLanguage);
                        } catch (e) {
                            console.warn(`Translation failed for component ${comp.id}:`, e);
                            translationOccurredError = true;
                        }
                    }
                    return { ...comp, value: translatedValue };
                })
            );
            setPromptComponents(translatedPromptComponents);

            if (userDefinedInteraction.trim() !== '') {
                try { setUserDefinedInteraction(await translateText(userDefinedInteraction, oldLanguage, newLanguage)); }
                catch (e) { translationOccurredError = true; }
            }
            if (userGoalForFramework.trim() !== '') {
                try { setUserGoalForFramework(await translateText(userGoalForFramework, oldLanguage, newLanguage)); }
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
        setLanguage(newLanguage);
    };


    const fetchAiFeedback = async () => {
        if (!aiClient || !promptToCopy.trim() || !apiKeyAvailable) {
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
        if (!aiClient || !promptToCopy.trim() || !apiKeyAvailable) {
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
        if (!aiClient || !apiKeyAvailable) {
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

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            const activeElement = document.activeElement;
            if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA' || activeElement.tagName === 'SELECT')) {
                konamiCodeIndexRef.current = 0;
                return;
            }

            if (event.code === KONAMI_CODE_SEQUENCE[konamiCodeIndexRef.current]) {
                konamiCodeIndexRef.current++;
                if (konamiCodeIndexRef.current === KONAMI_CODE_SEQUENCE.length) {
                    setSessionDevToggleActivated(true);
                    konamiCodeIndexRef.current = 0;
                }
            } else {
                konamiCodeIndexRef.current = 0;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    useEffect(() => {
        if (titleTapCount >= TITLE_TAP_TARGET_COUNT) {
            setSessionDevToggleActivated(true);
            setTitleTapCount(0);
        }
    }, [titleTapCount]);

    const handleTitleClick = () => {
        if (!sessionDevToggleActivated) {
            setTitleTapCount(prev => prev + 1);
        }
    };

    const currentFrameworkLocale = selectedFramework ? (language === 'id' ? selectedFramework.idLocale : selectedFramework.enLocale) : null;

    useEffect(() => {
        let assembledPromptForDisplay: string = "";
        let assembledPromptForCopy: string = "";
        let isFormPristine: boolean = true;

        const placeholderInstructionKey: TranslationKey = apiKeyAvailable ? 'initialPromptAreaInstruction' : 'initialPromptAreaInstructionNoApiKey';

        if (selectedFramework && currentFrameworkLocale) {
            isFormPristine = !promptComponents.some(pc => pc.value.trim() !== '') && userDefinedInteraction.trim() === '';

            if (!isFormPristine) {
                const displayValues: string[] = [];
                const copyValues: string[] = [];

                promptComponents.forEach(component => {
                    const value = component.value.trim();
                    if (value) {
                        if (selectedFramework.id === 'midjourney' && (component.id.startsWith('aspect_ratio') || component.id.startsWith('version_mj') || component.id.startsWith('stylize_mj') || component.id.startsWith('chaos_mj') || component.id.startsWith('weird_mj') || component.id.startsWith('tile_mj') || component.id.startsWith('image_weight_mj') || component.id.startsWith('style_raw_mj') || component.id.startsWith('negative_prompt_mj') || component.id.startsWith('other_parameters_mj'))) {
                            if (value.startsWith('--') || component.id === 'main_prompt_mj') {
                                copyValues.push(value);
                            } else {
                                copyValues.push(value);
                            }
                        } else {
                            copyValues.push(value);
                        }
                        displayValues.push(value);
                    }
                });

                if (userDefinedInteraction.trim()) {
                    const interactionVal = userDefinedInteraction.trim();
                    displayValues.push(interactionVal);
                    copyValues.push(interactionVal);
                }

                assembledPromptForDisplay = displayValues.join('\n\n').trim();

                if (selectedFramework.idLocale.category === 'text') {
                    assembledPromptForCopy = copyValues.join(', ').trim();
                } else {
                    if (selectedFramework.id === 'midjourney') {
                        const mainPromptPart = promptComponents.find(pc => pc.id === 'main_prompt_mj')?.value.trim() || '';
                        const paramParts = promptComponents
                            .filter(pc => pc.id !== 'main_prompt_mj' && pc.value.trim())
                            .map(pc => pc.value.trim())
                            .join(' ');
                        assembledPromptForCopy = [mainPromptPart, paramParts].filter(p => p).join(' ').trim();
                    } else {
                        assembledPromptForCopy = copyValues.join(' ').trim();
                    }
                }


            }

            const finalGeneratedPromptValue = assembledPromptForDisplay.trim();
            const finalPromptToCopyValue = assembledPromptForCopy.trim();

            if (isFormPristine || finalGeneratedPromptValue === '') {
                setGeneratedPrompt(t(placeholderInstructionKey));
                setPromptToCopy('');
            } else {
                setGeneratedPrompt(finalGeneratedPromptValue);
                setPromptToCopy(finalPromptToCopyValue);
            }
        } else {
            setGeneratedPrompt(selectedCategory ? t(apiKeyAvailable ? 'selectSpecificFrameworkOutputSummary' : 'selectSpecificFrameworkOutputSummaryFree') : t(placeholderInstructionKey));
            setPromptToCopy('');
        }
    }, [
        promptComponents, userDefinedInteraction, selectedFramework, language, t,
        selectedCategory, currentFrameworkLocale, apiKeyAvailable
    ]);


    useEffect((): void => {
        setHasCurrentPromptBeenCopied(false);
        clearAiStates();
    }, [promptToCopy]);

    return {
        language,
        t,
        selectedFramework,
        promptComponents,
        userDefinedInteraction,
        generatedPrompt,
        promptToCopy,
        showDisclaimer,
        showHowToUse,
        isHowToUseModalShownAutomatically,
        showSubscriptionInfoModal,
        showTeaserPopup,
        selectedCategory,
        isInputPanelExpanded,
        isOutputPanelExpanded,
        aiFeedback,
        isFetchingAiFeedback,
        aiError,
        aiFeedbackReceived,
        hasCurrentPromptBeenCopied,
        detailedAiAnalysis,
        isFetchingDetailedAnalysis,
        detailedAnalysisError,
        detailedAiAnalysisReceived,
        translationError,
        isTranslating,
        userGoalForFramework,
        suggestedFrameworkIds,
        isFetchingFrameworkSuggestions,
        frameworkSuggestionError,
        webResearchSummary,
        webResearchSources,
        isFetchingWebResearch,
        webResearchError,
        webResearchReceived,
        sessionDevToggleActivated,
        devToggleUiSelection,
        apiKeyAvailable,
        savedPrompts,
        isDBLoading,
        dbError,
        toastMessage,
        frameworkSearchTerm,
        globalActivityMessage,
        forceGlobalSearchDisplay,
        handleTitleClick,
        setShowDisclaimer,
        setShowHowToUse,
        setShowSubscriptionInfoModal,
        setFrameworkSearchTerm,
        handleCategorySelect,
        handleFrameworkSelect,
        setIsInputPanelExpanded,
        clearInputs,
        handleInputChange,
        handleUserInteractionChange,
        setUserGoalForFramework,
        handleFetchFrameworkFunctionality,
        handleLanguageToggle,
        setDevToggleUiSelection,
        handleDisclaimerAcknowledge,
        handleHowToUseClose,
        setIsOutputPanelExpanded,
        fetchAiFeedback,
        fetchDetailedAiAnalysis,
        handlePromptSuccessfullyCopied,
        handleSavePrompt,
        fetchSuggestionsForField,
        handleLoadPrompt,
        handleDeletePrompt,
        handleRenamePrompt,
        loadPromptsFromDB,
        showToast,
    };
};