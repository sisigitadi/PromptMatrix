
import React, { useState, useEffect, ChangeEvent, useRef } from 'react';
import { InteractiveSectionDefinition, InteractiveQuestionDefinition, Language } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { ChevronDownIcon } from './icons/ChevronDownIcon';
import { ChevronUpIcon } from './icons/ChevronUpIcon';
import { AppLogoIcon } from './icons/AppLogoIcon'; // Changed from SparklesIcon

interface InteractivePromptBuilderProps {
  sections: InteractiveSectionDefinition[];
  initialValues: Record<string, string | string[]>;
  onValuesChange: (values: Record<string, string | string[]>) => void;
  otherInputValues: Record<string, string>;
  onOtherInputChange: (questionId: string, value: string) => void;
  language: Language;
  fetchSuggestions?: (componentName: string, frameworkName: string, currentValue: string) => Promise<string[]>;
  apiKeyAvailable?: boolean;
  frameworkName?: string;
  onEnhancePrompt?: () => void;
  canEnhancePrompt?: boolean;
  isFetchingEnhancement?: boolean;
}

const InteractivePromptBuilder: React.FC<InteractivePromptBuilderProps> = ({
  sections,
  initialValues,
  onValuesChange,
  otherInputValues,
  onOtherInputChange,
  language,
  fetchSuggestions,
  apiKeyAvailable,
  frameworkName,
  onEnhancePrompt,
  canEnhancePrompt,
  isFetchingEnhancement,
}) => {
  const { t } = useLanguage();
  const [currentValues, setCurrentValues] = useState<Record<string, string | string[]>>(initialValues);
  const [expandedMultipleChoice, setExpandedMultipleChoice] = useState<Record<string, boolean>>({});

  const [activeSuggestionFieldId, setActiveSuggestionFieldId] = useState<string | null>(null);
  const [interactiveFieldSuggestions, setInteractiveFieldSuggestions] = useState<string[]>([]);
  const [isFetchingInteractiveFieldSuggestions, setIsFetchingInteractiveFieldSuggestions] = useState(false);
  const [interactiveFieldSuggestionError, setInteractiveFieldSuggestionError] = useState<string | null>(null);
  const [showInteractiveFieldSuggestions, setShowInteractiveFieldSuggestions] = useState(false);
  const [interactiveFieldFocusedSuggestionIndex, setInteractiveFieldFocusedSuggestionIndex] = useState(-1);
  
  const suggestionsListRef = useRef<HTMLUListElement>(null);
  const activeInputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);


  useEffect(() => {
    setCurrentValues(initialValues);
    setExpandedMultipleChoice({});
    setActiveSuggestionFieldId(null);
    setShowInteractiveFieldSuggestions(false);
  }, [initialValues, language]);

  const handleSelectChange = (questionId: string, value: string) => {
    const newValues = { ...currentValues, [questionId]: value };
    setCurrentValues(newValues);
    onValuesChange(newValues);
    
    if (value !== 'LAINNYA_INTERAKTIF_PLACEHOLDER') {
      const question = sections.flatMap(s => s.questions).find(q => q.id === questionId);
      if (question?.includeOtherOption) {
        onOtherInputChange(questionId, ''); 
      }
    }
    if (activeSuggestionFieldId === questionId) {
        setShowInteractiveFieldSuggestions(false);
        setInteractiveFieldSuggestions([]);
    }
  };

  const handleCheckboxChange = (questionId: string, optionValue: string, checked: boolean) => {
    const currentSelection = (currentValues[questionId] as string[] | undefined) || [];
    let newSelection: string[];
    if (checked) {
      newSelection = [...currentSelection, optionValue];
    } else {
      newSelection = currentSelection.filter(item => item !== optionValue);
    }
    const newValues = { ...currentValues, [questionId]: newSelection };
    setCurrentValues(newValues);
    onValuesChange(newValues);
  };

  const handleLocalOtherInputChange = (questionId: string, value: string) => {
    onOtherInputChange(questionId, value);
    if (currentValues[questionId] !== 'LAINNYA_INTERAKTIF_PLACEHOLDER') {
        const newValues = { ...currentValues, [questionId]: 'LAINNYA_INTERAKTIF_PLACEHOLDER' };
        setCurrentValues(newValues);
        onValuesChange(newValues); 
    }
    if (activeSuggestionFieldId === questionId) {
        setShowInteractiveFieldSuggestions(false);
    }
  };
  
  const handleManualInputChange = (questionId: string, value: string) => {
    const newValues = { ...currentValues, [questionId]: value };
    setCurrentValues(newValues);
    onValuesChange(newValues);
    if (activeSuggestionFieldId === questionId) {
        setShowInteractiveFieldSuggestions(false);
    }
  };

  const handleSuggestForInteractiveField = async (fieldId: string, fieldPromptText: string, currentFieldValue: string) => {
    if (!fetchSuggestions || !frameworkName || !apiKeyAvailable) return;
    
    setActiveSuggestionFieldId(fieldId);
    setIsFetchingInteractiveFieldSuggestions(true);
    setInteractiveFieldSuggestionError(null);
    setInteractiveFieldSuggestions([]);
    setShowInteractiveFieldSuggestions(true);
    setInteractiveFieldFocusedSuggestionIndex(-1);

    try {
      const fetchedSuggestions = await fetchSuggestions(fieldPromptText, frameworkName, currentFieldValue);
      setInteractiveFieldSuggestions(fetchedSuggestions);
      if (fetchedSuggestions.length === 0) {
        setInteractiveFieldSuggestionError(t('noSuggestionsFound'));
      }
    } catch (error: any) {
      setInteractiveFieldSuggestionError(error.message || t('suggestionsError'));
      setInteractiveFieldSuggestions([]);
    } finally {
      setIsFetchingInteractiveFieldSuggestions(false);
    }
  };

  const handleInteractiveFieldSuggestionClick = (fieldId: string, suggestion: string, questionType: InteractiveQuestionDefinition['type']) => {
    if (questionType === 'manual') {
        handleManualInputChange(fieldId, suggestion);
    } else if (questionType === 'single-choice') { 
        onOtherInputChange(fieldId, suggestion);
    }
    setShowInteractiveFieldSuggestions(false);
    setInteractiveFieldSuggestions([]);
    setInteractiveFieldFocusedSuggestionIndex(-1);
    activeInputRef.current?.focus();
  };
  
  const handleInteractiveFieldKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>, fieldId: string, questionType: InteractiveQuestionDefinition['type']) => {
    if (showInteractiveFieldSuggestions && interactiveFieldSuggestions.length > 0 && activeSuggestionFieldId === fieldId) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setInteractiveFieldFocusedSuggestionIndex(prev => (prev + 1) % interactiveFieldSuggestions.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setInteractiveFieldFocusedSuggestionIndex(prev => (prev - 1 + interactiveFieldSuggestions.length) % interactiveFieldSuggestions.length);
      } else if (e.key === 'Enter') {
        if (interactiveFieldFocusedSuggestionIndex >= 0 && interactiveFieldFocusedSuggestionIndex < interactiveFieldSuggestions.length) {
          e.preventDefault();
          handleInteractiveFieldSuggestionClick(fieldId, interactiveFieldSuggestions[interactiveFieldFocusedSuggestionIndex], questionType);
        }
      } else if (e.key === 'Escape') {
        setShowInteractiveFieldSuggestions(false);
        setInteractiveFieldSuggestions([]);
        setInteractiveFieldFocusedSuggestionIndex(-1);
      }
    }
  };

  useEffect(() => {
    if (interactiveFieldFocusedSuggestionIndex !== -1 && suggestionsListRef.current && showInteractiveFieldSuggestions) {
      const suggestionItem = suggestionsListRef.current.children[interactiveFieldFocusedSuggestionIndex] as HTMLLIElement;
      suggestionItem?.focus(); 
    }
  }, [interactiveFieldFocusedSuggestionIndex, showInteractiveFieldSuggestions]);

  const handleInteractiveFieldBlur = (e: React.FocusEvent<HTMLDivElement>, fieldId: string) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
        setTimeout(() => {
            const activeEl = document.activeElement;
            if (activeSuggestionFieldId === fieldId && !activeEl?.closest('.ai-suggestion-item') && !activeEl?.closest(`.ai-suggest-button-${fieldId}`)) {
                setShowInteractiveFieldSuggestions(false);
            }
        }, 150); 
    }
  };

  const toggleMultipleChoiceExpansion = (questionId: string) => {
    setExpandedMultipleChoice(prev => ({ ...prev, [questionId]: !prev[questionId] }));
  };

  const renderQuestion = (question: InteractiveQuestionDefinition) => {
    const questionValue = currentValues[question.id];
    const otherTextValueForThisQuestion = otherInputValues[question.id] || '';
    const effectiveSuggestButtonTitle = !apiKeyAvailable ? t('apiKeyMissingError') : t('suggestButtonTitle');

    switch (question.type) {
      case 'manual':
        const manualPlaceholder = (question.defaultValue && typeof question.defaultValue === 'string' && question.defaultValue.trim() !== '') 
                                  ? question.defaultValue 
                                  : t('interactiveFormManualInputPlaceholder');
        const showSuggestButtonForManual = !!apiKeyAvailable && !!fetchSuggestions;
        return (
            <div className="relative" onBlur={(e) => handleInteractiveFieldBlur(e, question.id)}>
                <textarea
                    id={question.id}
                    ref={(el) => { if (activeSuggestionFieldId === question.id) activeInputRef.current = el; }}
                    value={(questionValue as string) || ''}
                    onChange={(e) => handleManualInputChange(question.id, e.target.value)}
                    onKeyDown={(e) => handleInteractiveFieldKeyDown(e, question.id, question.type)}
                    placeholder={manualPlaceholder}
                    rows={3}
                    className={`w-full p-2.5 bg-[var(--bg-secondary)] dark:bg-slate-700/50 border border-[var(--border-color)] dark:border-slate-600 rounded-md focus:ring-1 focus:ring-[var(--ring-color)] focus:border-[var(--ring-color)] outline-none transition-all duration-150 text-sm text-[var(--text-primary)] dark:text-slate-100 placeholder-[var(--text-secondary)] dark:placeholder-slate-400/80 shadow-sm non-copyable-input-field ${showSuggestButtonForManual ? 'pr-8' : 'pr-2.5'}`}
                    aria-autocomplete="list"
                    aria-expanded={showInteractiveFieldSuggestions && activeSuggestionFieldId === question.id && (interactiveFieldSuggestions.length > 0 || isFetchingInteractiveFieldSuggestions || !!interactiveFieldSuggestionError)}
                    aria-controls={`${question.id}-interactive-suggestions`}
                />
                {showSuggestButtonForManual && (
                    <button
                        type="button"
                        onClick={() => handleSuggestForInteractiveField(question.id, question.promptText, (questionValue as string) || '')}
                        className={`absolute right-1.5 top-1.5 p-1 text-purple-400 hover:text-purple-200 active:text-purple-500 transition-colors duration-150 focus:outline-none focus:ring-1 focus:ring-purple-500 rounded-full ai-suggest-button-${question.id}`}
                        title={effectiveSuggestButtonTitle}
                        aria-label={t('suggestButtonTitle')}
                        disabled={isFetchingInteractiveFieldSuggestions && activeSuggestionFieldId === question.id}
                    >
                        <AppLogoIcon 
                            animatedAsAiIndicator
                            className={`w-4 h-4 api-status-indicator ${isFetchingInteractiveFieldSuggestions && activeSuggestionFieldId === question.id ? 'opacity-70 animate-pulse' : ''}`} 
                        />
                    </button>
                )}
                {showInteractiveFieldSuggestions && activeSuggestionFieldId === question.id && (isFetchingInteractiveFieldSuggestions || interactiveFieldSuggestionError || interactiveFieldSuggestions.length > 0) && (
                    <div className="interactive-suggestion-list-container" id={`${question.id}-interactive-suggestions`} role="listbox">
                        {isFetchingInteractiveFieldSuggestions && (
                            <div className="px-2.5 py-1.5 text-xs text-slate-400 animate-pulse">{t('suggestionsLoading')}</div>
                        )}
                        {interactiveFieldSuggestionError && !isFetchingInteractiveFieldSuggestions && (
                            <div className="px-2.5 py-1.5 text-xs text-rose-400" role="alert">{interactiveFieldSuggestionError}</div>
                        )}
                        {!isFetchingInteractiveFieldSuggestions && !interactiveFieldSuggestionError && interactiveFieldSuggestions.length > 0 && (
                        <ul ref={suggestionsListRef}>
                            {interactiveFieldSuggestions.map((suggestion, index) => (
                            <li
                                key={index}
                                onClick={() => handleInteractiveFieldSuggestionClick(question.id, suggestion, question.type)}
                                onMouseDown={(e) => e.preventDefault()} 
                                className={`px-2.5 py-1.5 text-xs text-slate-200 hover:bg-teal-600 dark:hover:bg-teal-700 cursor-pointer ai-suggestion-item ${index === interactiveFieldFocusedSuggestionIndex ? 'bg-teal-600 dark:bg-teal-700' : ''}`}
                                role="option"
                                aria-selected={index === interactiveFieldFocusedSuggestionIndex}
                                tabIndex={-1} 
                                id={`${question.id}-interactive-suggestion-${index}`} 
                            >
                                {suggestion}
                            </li>
                            ))}
                        </ul>
                        )}
                    </div>
                )}
            </div>
        );
      case 'single-choice':
        const options = question.options || [];
        const showOtherInput = question.includeOtherOption && questionValue === 'LAINNYA_INTERAKTIF_PLACEHOLDER';
        const showSuggestButtonForOther = !!apiKeyAvailable && !!fetchSuggestions && showOtherInput;

        return (
          <div className="space-y-1.5 relative" onBlur={(e) => handleInteractiveFieldBlur(e, question.id)}>
            <select
              id={question.id}
              name={question.id}
              value={(questionValue as string) || ''}
              onChange={(e) => handleSelectChange(question.id, e.target.value)}
              className="w-full p-2.5 bg-[var(--bg-secondary)] dark:bg-slate-700/50 border border-[var(--border-color)] dark:border-slate-600 rounded-md focus:ring-1 focus:ring-[var(--ring-color)] focus:border-[var(--ring-color)] outline-none transition-all duration-150 text-sm text-[var(--text-primary)] dark:text-slate-100 shadow-sm"
            >
              {options.map((option, index) => (
                <option key={`${question.id}-option-${index}-${language}`} value={option}>
                  {option}
                </option>
              ))}
              {question.includeOtherOption && (
                <option value="LAINNYA_INTERAKTIF_PLACEHOLDER" style={{fontStyle: 'italic'}}>
                  {t('interactiveFormOptionOtherLabel')}
                </option>
              )}
            </select>
            {showOtherInput && (
              <div className="relative flex items-center mt-1.5">
                <input
                  ref={(el) => { if (activeSuggestionFieldId === question.id) activeInputRef.current = el; }}
                  type="text"
                  placeholder={t('interactiveFormOptionOtherPlaceholder')}
                  value={otherTextValueForThisQuestion}
                  onChange={(e) => handleLocalOtherInputChange(question.id, e.target.value)}
                  onKeyDown={(e) => handleInteractiveFieldKeyDown(e, question.id, question.type)}
                  className={`flex-grow p-2 text-sm bg-slate-600 border-slate-500 rounded-md focus:ring-teal-500 focus:border-teal-500 non-copyable-input-field ${showSuggestButtonForOther ? 'pr-8' : 'pr-2'}`}
                  aria-autocomplete="list"
                  aria-expanded={showInteractiveFieldSuggestions && activeSuggestionFieldId === question.id && (interactiveFieldSuggestions.length > 0 || isFetchingInteractiveFieldSuggestions || !!interactiveFieldSuggestionError)}
                  aria-controls={`${question.id}-interactive-suggestions`}
                />
                {showSuggestButtonForOther && (
                    <button
                        type="button"
                        onClick={() => handleSuggestForInteractiveField(question.id, question.promptText, otherTextValueForThisQuestion)}
                        className={`absolute right-1 top-1/2 -translate-y-1/2 p-1 text-purple-400 hover:text-purple-200 active:text-purple-500 transition-colors duration-150 focus:outline-none focus:ring-1 focus:ring-purple-500 rounded-full ai-suggest-button-${question.id}`}
                        title={effectiveSuggestButtonTitle}
                        aria-label={t('suggestButtonTitle')}
                        disabled={isFetchingInteractiveFieldSuggestions && activeSuggestionFieldId === question.id}
                    >
                        <AppLogoIcon
                            animatedAsAiIndicator
                            className={`w-4 h-4 api-status-indicator ${isFetchingInteractiveFieldSuggestions && activeSuggestionFieldId === question.id ? 'opacity-70 animate-pulse' : ''}`} 
                        />
                    </button>
                )}
              </div>
            )}
            {showInteractiveFieldSuggestions && activeSuggestionFieldId === question.id && (isFetchingInteractiveFieldSuggestions || interactiveFieldSuggestionError || interactiveFieldSuggestions.length > 0) && (
              <div className="interactive-suggestion-list-container" id={`${question.id}-interactive-suggestions`} role="listbox">
                {isFetchingInteractiveFieldSuggestions && (
                  <div className="px-2.5 py-1.5 text-xs text-slate-400 animate-pulse">{t('suggestionsLoading')}</div>
                )}
                {interactiveFieldSuggestionError && !isFetchingInteractiveFieldSuggestions && (
                  <div className="px-2.5 py-1.5 text-xs text-rose-400" role="alert">{interactiveFieldSuggestionError}</div>
                )}
                {!isFetchingInteractiveFieldSuggestions && !interactiveFieldSuggestionError && interactiveFieldSuggestions.length > 0 && (
                  <ul ref={suggestionsListRef}>
                    {interactiveFieldSuggestions.map((suggestion, index) => (
                      <li
                        key={index}
                        onClick={() => handleInteractiveFieldSuggestionClick(question.id, suggestion, question.type)}
                        onMouseDown={(e) => e.preventDefault()} 
                        className={`px-2.5 py-1.5 text-xs text-slate-200 hover:bg-teal-600 dark:hover:bg-teal-700 cursor-pointer ai-suggestion-item ${index === interactiveFieldFocusedSuggestionIndex ? 'bg-teal-600 dark:bg-teal-700' : ''}`}
                        role="option"
                        aria-selected={index === interactiveFieldFocusedSuggestionIndex}
                        tabIndex={-1} 
                        id={`${question.id}-interactive-suggestion-${index}`} 
                      >
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        );
      case 'multiple-choice':
        const isExpanded = !!expandedMultipleChoice[question.id];
        const selectedCount = ((questionValue as string[] | undefined) || []).length;
        return (
          <div className="mc-collapsible-header">
            <button
              type="button"
              onClick={() => toggleMultipleChoiceExpansion(question.id)}
              className="w-full flex justify-between items-center p-2.5 bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600 rounded-md text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-teal-500"
              aria-expanded={isExpanded}
              aria-controls={`${question.id}-mc-content`}
            >
              <span className="text-left">
                {question.promptText}
                {selectedCount > 0 && !isExpanded && <span className="text-xs text-teal-400 ml-2">({selectedCount} {t('selectOptionTooltip')})</span>} 
              </span>
              {isExpanded ? <ChevronUpIcon className="w-5 h-5 text-teal-400 shrink-0" /> : <ChevronDownIcon className="w-5 h-5 text-teal-400 shrink-0" />}
            </button>
            <div 
              id={`${question.id}-mc-content`}
              className={`collapsible-mc-content ${isExpanded ? 'open' : ''} bg-slate-700/30 dark:bg-slate-800/20 border border-t-0 border-slate-600 rounded-b-md p-0`}
            >
              {isExpanded && ( 
                <div className="p-3 space-y-1.5">
                  <p className="text-xs text-slate-400">{t('interactiveFormMultipleChoiceHelpText')}</p>
                  {(question.options || []).map((option, index) => {
                    const uniqueId = `${question.id}-${index}-${language}`;
                    return (
                      <div key={uniqueId} className="flex items-center">
                        <input
                          type="checkbox"
                          id={uniqueId}
                          name={`${question.id}-${option}`} 
                          value={option}
                          checked={((questionValue as string[] | undefined) || []).includes(option)}
                          onChange={(e) => handleCheckboxChange(question.id, option, e.target.checked)}
                          className="h-4 w-4 text-teal-600 border-slate-500 rounded focus:ring-teal-500"
                        />
                        <label htmlFor={uniqueId} className="ml-2 block text-sm text-slate-200">
                          {option}
                        </label>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const enhanceButtonTitle = !apiKeyAvailable 
    ? t('apiKeyMissingError') 
    : t('enhanceButtonTitle');

  return (
    <div className="space-y-4">
      {sections.map((section, sectionIndex) => (
        <div key={`${language}-section-${section.title}-${sectionIndex}`} className="p-3 border border-slate-700 rounded-lg bg-slate-800/30">
          <h3 className="text-md font-semibold text-teal-500 mb-2.5">{section.title}</h3>
          <div className="space-y-3">
            {section.questions.map((question) => (
              <div key={`${language}-question-${question.id}`}>
                 {question.type !== 'multiple-choice' && (
                  <label className="block text-sm font-medium text-slate-300 mb-1" htmlFor={question.id}>
                    {question.promptText}
                  </label>
                 )}
                {renderQuestion(question)}
              </div>
            ))}
          </div>
        </div>
      ))}

      {apiKeyAvailable && onEnhancePrompt && (
        <div className="mt-4 pt-4 border-t border-slate-700">
          <button
            onClick={onEnhancePrompt}
            title={enhanceButtonTitle}
            className={`w-full py-2.5 px-4 text-sm font-semibold rounded-md transition-all duration-200 ease-in-out flex items-center justify-center space-x-2
                        transform active:scale-95 shadow-md
                        ${canEnhancePrompt && !isFetchingEnhancement
                            ? 'bg-purple-600 hover:bg-purple-500 text-white focus:ring-1 focus:ring-purple-400 focus:ring-offset-1 focus:ring-offset-[var(--bg-secondary)] dark:focus:ring-offset-slate-800'
                            : 'bg-slate-600 text-slate-400 cursor-not-allowed focus:ring-slate-500 opacity-70'
                        }`}
            aria-label={t('enhanceButtonAria')}
            disabled={!canEnhancePrompt || isFetchingEnhancement}
          >
            <span className="button-text-content">
              {isFetchingEnhancement ? t('enhanceButtonLoadingText') : t('enhanceButtonText')}
            </span>
            <AppLogoIcon animatedAsAiIndicator className={`w-5 h-5 api-status-indicator ml-2 ${isFetchingEnhancement ? 'opacity-70 animate-pulse' : '' }`} />
          </button>
        </div>
      )}
    </div>
  );
};

export default InteractivePromptBuilder;
