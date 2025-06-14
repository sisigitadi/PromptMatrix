import React, { useState, useEffect, ChangeEvent, useRef } from 'react';
import { InteractiveSectionDefinition, InteractiveQuestionDefinition, Language } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { ChevronDownIcon } from './icons/ChevronDownIcon';
import { ChevronUpIcon } from './icons/ChevronUpIcon';
import { SparklesIcon } from './icons/SparklesIcon';

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
}) => {
  const { t } = useLanguage();
  const [currentValues, setCurrentValues] = useState<Record<string, string | string[]>>(initialValues);
  const [expandedMultipleChoice, setExpandedMultipleChoice] = useState<Record<string, boolean>>({});

  // State untuk saran AI pada input "Lainnya..."
  const [activeSuggestionQuestionId, setActiveSuggestionQuestionId] = useState<string | null>(null);
  const [currentSuggestions, setCurrentSuggestions] = useState<string[]>([]);
  const [isFetchingCurrentSuggestions, setIsFetchingCurrentSuggestions] = useState(false);
  const [currentSuggestionError, setCurrentSuggestionError] = useState<string | null>(null);
  const [showCurrentSuggestions, setShowCurrentSuggestions] = useState(false);
  const [currentFocusedSuggestionIndex, setCurrentFocusedSuggestionIndex] = useState(-1);
  const suggestionsListRef = useRef<HTMLUListElement>(null);
  const otherInputRef = useRef<HTMLInputElement | null>(null);


  useEffect(() => {
    setCurrentValues(initialValues);
    setExpandedMultipleChoice({}); 
    setActiveSuggestionQuestionId(null); // Reset active suggestion state on framework change
    setShowCurrentSuggestions(false);
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
    // Reset suggestions if dropdown value changes
    if (activeSuggestionQuestionId === questionId) {
        setShowCurrentSuggestions(false);
        setCurrentSuggestions([]);
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
    // Hide suggestions when user types in "Other..." input directly
    if (activeSuggestionQuestionId === questionId) {
        setShowCurrentSuggestions(false);
    }
  };

  const handleSuggestForOtherInput = async (questionId: string, questionPromptText: string) => {
    if (!fetchSuggestions || !frameworkName || !apiKeyAvailable) return;
    
    setActiveSuggestionQuestionId(questionId);
    setIsFetchingCurrentSuggestions(true);
    setCurrentSuggestionError(null);
    setCurrentSuggestions([]);
    setShowCurrentSuggestions(true);
    setCurrentFocusedSuggestionIndex(-1);

    try {
      const currentValue = otherInputValues[questionId] || '';
      const fetchedSuggestions = await fetchSuggestions(questionPromptText, frameworkName, currentValue);
      setCurrentSuggestions(fetchedSuggestions);
      if (fetchedSuggestions.length === 0) {
        setCurrentSuggestionError(t('noSuggestionsFound'));
      }
    } catch (error: any) {
      setCurrentSuggestionError(error.message || t('suggestionsError'));
      setCurrentSuggestions([]);
    } finally {
      setIsFetchingCurrentSuggestions(false);
    }
  };

  const handleOtherInputOptionClick = (questionId: string, suggestion: string) => {
    onOtherInputChange(questionId, suggestion);
    setShowCurrentSuggestions(false);
    setCurrentSuggestions([]);
    setCurrentFocusedSuggestionIndex(-1);
    otherInputRef.current?.focus();
  };
  
  const handleOtherInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, questionId: string) => {
    if (showCurrentSuggestions && currentSuggestions.length > 0 && activeSuggestionQuestionId === questionId) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setCurrentFocusedSuggestionIndex(prev => (prev + 1) % currentSuggestions.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setCurrentFocusedSuggestionIndex(prev => (prev - 1 + currentSuggestions.length) % currentSuggestions.length);
      } else if (e.key === 'Enter') {
        if (currentFocusedSuggestionIndex >= 0 && currentFocusedSuggestionIndex < currentSuggestions.length) {
          e.preventDefault();
          handleOtherInputOptionClick(questionId, currentSuggestions[currentFocusedSuggestionIndex]);
        }
      } else if (e.key === 'Escape') {
        setShowCurrentSuggestions(false);
        setCurrentSuggestions([]);
        setCurrentFocusedSuggestionIndex(-1);
      }
    }
  };

  useEffect(() => {
    if (currentFocusedSuggestionIndex !== -1 && suggestionsListRef.current && showCurrentSuggestions) {
      const suggestionItem = suggestionsListRef.current.children[currentFocusedSuggestionIndex] as HTMLLIElement;
      suggestionItem?.focus(); 
    }
  }, [currentFocusedSuggestionIndex, showCurrentSuggestions]);

  const handleOtherInputBlur = (e: React.FocusEvent<HTMLDivElement>, questionId: string) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
        setTimeout(() => {
            const activeEl = document.activeElement;
            if (activeSuggestionQuestionId === questionId && !activeEl?.closest('.ai-suggestion-item') && !activeEl?.closest(`.ai-suggest-button-${questionId}`)) {
                setShowCurrentSuggestions(false);
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

    switch (question.type) {
      case 'manual':
        const manualPlaceholder = (question.defaultValue && typeof question.defaultValue === 'string' && question.defaultValue.trim() !== '') 
                                  ? question.defaultValue 
                                  : t('interactiveFormManualInputPlaceholder');
        return (
          <textarea
            id={question.id}
            value={(questionValue as string) || ''}
            onChange={(e) => handleSelectChange(question.id, e.target.value)}
            placeholder={manualPlaceholder}
            rows={3}
            className="w-full p-2.5 bg-[var(--bg-secondary)] dark:bg-slate-700/50 border border-[var(--border-color)] dark:border-slate-600 rounded-md focus:ring-1 focus:ring-[var(--ring-color)] focus:border-[var(--ring-color)] outline-none transition-all duration-150 text-sm text-[var(--text-primary)] dark:text-slate-100 placeholder-[var(--text-secondary)] dark:placeholder-slate-400/80 shadow-sm non-copyable-input-field"
          />
        );
      case 'single-choice':
        const options = question.options || [];
        const showOtherInput = question.includeOtherOption && questionValue === 'LAINNYA_INTERAKTIF_PLACEHOLDER';
        const effectiveSuggestButtonTitle = !apiKeyAvailable ? t('apiKeyMissingError') : t('suggestButtonTitle');
        return (
          <div className="space-y-1.5 relative" onBlur={(e) => handleOtherInputBlur(e, question.id)}>
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
                  ref={otherInputRef}
                  type="text"
                  placeholder={t('interactiveFormOptionOtherPlaceholder')}
                  value={otherTextValueForThisQuestion}
                  onChange={(e) => handleLocalOtherInputChange(question.id, e.target.value)}
                  onKeyDown={(e) => handleOtherInputKeyDown(e, question.id)}
                  className="flex-grow p-2 text-sm bg-slate-600 border-slate-500 rounded-md focus:ring-teal-500 focus:border-teal-500 non-copyable-input-field pr-8"
                  aria-autocomplete="list"
                  aria-expanded={showCurrentSuggestions && activeSuggestionQuestionId === question.id && (currentSuggestions.length > 0 || isFetchingCurrentSuggestions || !!currentSuggestionError)}
                  aria-controls={`${question.id}-other-suggestions`}
                />
                {apiKeyAvailable && fetchSuggestions && (
                    <button
                        type="button"
                        onClick={() => handleSuggestForOtherInput(question.id, question.promptText)}
                        className={`absolute right-1 top-1/2 -translate-y-1/2 p-1 text-purple-400 hover:text-purple-200 active:text-purple-500 transition-colors duration-150 focus:outline-none focus:ring-1 focus:ring-purple-500 rounded-full ai-suggest-button-${question.id}`}
                        title={effectiveSuggestButtonTitle}
                        aria-label={t('suggestButtonTitle')}
                        disabled={isFetchingCurrentSuggestions || !apiKeyAvailable}
                    >
                        <SparklesIcon className={`w-4 h-4 ${isFetchingCurrentSuggestions && activeSuggestionQuestionId === question.id ? 'animate-pulse text-purple-600' : ''}`} />
                    </button>
                )}
              </div>
            )}
            {showCurrentSuggestions && activeSuggestionQuestionId === question.id && (isFetchingCurrentSuggestions || currentSuggestionError || currentSuggestions.length > 0) && (
              <div className="absolute z-20 w-full mt-0.5 bg-[var(--bg-tertiary)] dark:bg-slate-700 border border-[var(--border-color)] dark:border-slate-600 rounded-md shadow-lg max-h-40 overflow-y-auto" id={`${question.id}-other-suggestions`} role="listbox">
                {isFetchingCurrentSuggestions && (
                  <div className="px-2.5 py-1.5 text-xs text-slate-400 animate-pulse">{t('suggestionsLoading')}</div>
                )}
                {currentSuggestionError && !isFetchingCurrentSuggestions && (
                  <div className="px-2.5 py-1.5 text-xs text-rose-400" role="alert">{currentSuggestionError}</div>
                )}
                {!isFetchingCurrentSuggestions && !currentSuggestionError && currentSuggestions.length > 0 && (
                  <ul ref={suggestionsListRef}>
                    {currentSuggestions.map((suggestion, index) => (
                      <li
                        key={index}
                        onClick={() => handleOtherInputOptionClick(question.id, suggestion)}
                        onMouseDown={(e) => e.preventDefault()} 
                        className={`px-2.5 py-1.5 text-xs text-slate-200 hover:bg-teal-600 dark:hover:bg-teal-700 cursor-pointer ai-suggestion-item ${index === currentFocusedSuggestionIndex ? 'bg-teal-600 dark:bg-teal-700' : ''}`}
                        role="option"
                        aria-selected={index === currentFocusedSuggestionIndex}
                        tabIndex={-1} 
                        id={`${question.id}-other-suggestion-${index}`} 
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
          <div>
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
    </div>
  );
};

export default InteractivePromptBuilder;