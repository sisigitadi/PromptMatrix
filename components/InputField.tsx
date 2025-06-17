
import React, { useLayoutEffect, useRef, useEffect, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { XCircleIcon } from './icons/XCircleIcon';
import { AiTextIcon } from './icons/AiTextIcon'; 

interface InputFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { name: string; value: string } }) => void;
  placeholder?: string;
  isTextarea?: boolean;
  rows?: number;
  description?: string;
  predefinedOptions?: string[];
  isVisible?: boolean;
  fetchSuggestions?: (componentName: string, frameworkName: string, currentValue: string) => Promise<string[]>;
  frameworkName?: string;
  apiKeyAvailable?: boolean;
  exampleText?: string; 
}

const InputField: React.FC<InputFieldProps> = ({
  id,
  label,
  value,
  onChange,
  placeholder,
  isTextarea = false,
  rows: initialRows = 2, 
  description,
  predefinedOptions,
  isVisible,
  fetchSuggestions,
  frameworkName,
  apiKeyAvailable,
  exampleText,
}) => {
  const { t } = useLanguage();
  const commonClasses = "w-full p-2.5 bg-[var(--bg-secondary)] dark:bg-slate-700/50 border border-[var(--border-color)] dark:border-slate-600 rounded-md focus:ring-1 focus:ring-[var(--ring-color)] focus:border-[var(--ring-color)] outline-none transition-all duration-150 text-sm text-[var(--text-primary)] dark:text-slate-100 placeholder-[var(--text-secondary)] dark:placeholder-slate-400/80 shadow-sm non-copyable-input-field"; 
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const previousIsVisibleRef = useRef<boolean | undefined>(isVisible);
  const suggestionsListRef = useRef<HTMLUListElement>(null);

  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isFetchingSuggestions, setIsFetchingSuggestions] = useState(false);
  const [suggestionError, setSuggestionError] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [focusedSuggestionIndex, setFocusedSuggestionIndex] = useState(-1);
  
  const hasClearButton = !!value;
  const showSuggestButton = !!fetchSuggestions && !!frameworkName && !!apiKeyAvailable;
  let prClass = 'pr-2.5'; 
  if (hasClearButton && showSuggestButtonIcon) {
    prClass = 'pr-16 sm:pr-16'; 
  } else if (hasClearButton || showSuggestButtonIcon) {
    prClass = 'pr-8 sm:pr-8'; 
  }

  const actualPlaceholder = exampleText || placeholder || t('inputFieldPlaceholder', label);

  const effectiveSuggestButtonTitle = !apiKeyAvailable 
    ? t('aiFeatureRequiresSubscriptionTooltip') 
    : t('suggestButtonTitle');

  useLayoutEffect(() => {
    if (!isTextarea || !textareaRef.current) {
      return;
    }
    const textarea = textareaRef.current;
    let animationFrameId: number;
    let timeoutId: number;

    const adjustHeight = () => {
      if (!textareaRef.current) return;
      textarea.style.height = 'auto'; 
      const newScrollHeight = textarea.scrollHeight;
      if (newScrollHeight > 0) {
        textarea.style.height = `${newScrollHeight}px`;
      } else {
        const minHeightFromRows = `${initialRows * 1.5}rem`; 
        textarea.style.height = minHeightFromRows; 
      }
    };

    if (isVisible) {
      if (previousIsVisibleRef.current === false || previousIsVisibleRef.current === undefined) {
        textarea.style.height = 'auto'; 
        timeoutId = window.setTimeout(() => {
          if (textareaRef.current) { 
             adjustHeight(); 
          }
        }, 560); 
      } else {
        animationFrameId = window.requestAnimationFrame(adjustHeight);
      }
    } else {
      textarea.style.height = 'auto';
    }

    previousIsVisibleRef.current = isVisible;

    return () => {
      if (animationFrameId) {
        window.cancelAnimationFrame(animationFrameId);
      }
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [value, actualPlaceholder, isTextarea, initialRows, isVisible]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange(e);
    setShowSuggestions(false); 
    setSuggestions([]);
    setSuggestionError(null);
    setFocusedSuggestionIndex(-1);
  };

  const handleOptionClick = (optionValue: string) => {
    let newValue;
    const currentInputValue = value; 

    if (currentInputValue.trim()) {
      if (currentInputValue.endsWith(' ') || optionValue.startsWith(' ')) {
        newValue = currentInputValue + optionValue; 
      } else {
        newValue = currentInputValue + ' ' + optionValue; 
      }
    } else {
      newValue = optionValue; 
    }

    onChange({ target: { name: id, value: newValue } } as React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>);
    setShowSuggestions(false);
    setSuggestions([]);
    setFocusedSuggestionIndex(-1);
    
    if (isTextarea && textareaRef.current) {
      textareaRef.current.focus();
    } else if (!isTextarea && inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleClear = () => {
    onChange({ target: { name: id, value: '' } } as React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>);
    setShowSuggestions(false);
    setSuggestions([]);
    setSuggestionError(null);
    setFocusedSuggestionIndex(-1);
  };

  const handleSuggest = async () => {
    if (!fetchSuggestions || !frameworkName || !apiKeyAvailable) return;

    setIsFetchingSuggestions(true);
    setSuggestionError(null);
    setSuggestions([]);
    setShowSuggestions(true); 
    setFocusedSuggestionIndex(-1);

    try {
      const fetchedSuggestions = await fetchSuggestions(label, frameworkName, value);
      setSuggestions(fetchedSuggestions);
      if (fetchedSuggestions.length === 0) {
        setSuggestionError(t('noSuggestionsFound'));
      }
    } catch (error: any) {
      setSuggestionError(error.message || t('suggestionsError'));
      setSuggestions([]);
    } finally {
      setIsFetchingSuggestions(false);
    }
  };
  
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (showSuggestions && suggestions.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setFocusedSuggestionIndex(prev => (prev + 1) % suggestions.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setFocusedSuggestionIndex(prev => (prev - 1 + suggestions.length) % suggestions.length);
      } else if (e.key === 'Enter') {
        if (focusedSuggestionIndex >= 0 && focusedSuggestionIndex < suggestions.length) {
          e.preventDefault();
          handleOptionClick(suggestions[focusedSuggestionIndex]);
        }
      } else if (e.key === 'Escape') {
        setShowSuggestions(false);
        setSuggestions([]);
        setFocusedSuggestionIndex(-1);
      }
    }
  };

  useEffect(() => {
    if (focusedSuggestionIndex !== -1 && suggestionsListRef.current) {
      const suggestionItem = suggestionsListRef.current.children[focusedSuggestionIndex] as HTMLLIElement;
      suggestionItem?.focus(); 
    }
  }, [focusedSuggestionIndex]);


  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
        setTimeout(() => {
            const activeEl = document.activeElement;
            if (!activeEl?.closest('.ai-suggestion-item') && !activeEl?.closest('.ai-suggest-button')) {
                setShowSuggestions(false);
            }
        }, 150); 
    }
  };


  return (
    <div className="space-y-1 relative" onBlur={handleBlur}> 
      <label htmlFor={id} className="block text-sm font-medium text-teal-600 dark:text-teal-500"> 
        {label}
      </label>
      {description && <p className="text-xs text-[var(--text-secondary)] dark:text-slate-400 mb-0.5">{description}</p>} 
      
      {predefinedOptions && predefinedOptions.length > 0 && (
        <div className="flex flex-wrap gap-1 sm:gap-1.5 mb-1.5 sm:mb-2"> 
          {predefinedOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => handleOptionClick(option)}
              className="px-1.5 py-0.5 sm:px-2 text-xs bg-slate-500 dark:bg-slate-600 hover:bg-teal-600 dark:hover:bg-teal-700 text-slate-100 hover:text-white rounded-sm transition-colors duration-150 focus:outline-none focus:ring-1 focus:ring-teal-500 focus:ring-offset-1 focus:ring-offset-[var(--bg-secondary)] dark:focus:ring-offset-slate-800 whitespace-normal text-left shadow-sm" 
              title={`${t('selectOptionTooltip')}: ${option}`}
            >
              <span className="button-text-content">{option}</span>
            </button>
          ))}
        </div>
      )}

      <div className="relative flex items-center min-w-0">
        {isTextarea ? (
          <textarea
            ref={textareaRef}
            id={id}
            name={id}
            value={value}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            placeholder={actualPlaceholder} 
            rows={initialRows} 
            className={`${commonClasses} resize-none overflow-y-hidden ${prClass}`}
            style={{ minHeight: `${initialRows * 1.5}rem` }} 
            aria-autocomplete="list"
            aria-expanded={showSuggestions && (suggestions.length > 0 || isFetchingSuggestions || !!suggestionError)}
            aria-controls={`${id}-suggestions`}
          />
        ) : (
          <input
            ref={inputRef}
            type="text"
            id={id}
            name={id}
            value={value}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            placeholder={actualPlaceholder} 
            className={`${commonClasses} ${prClass}`}
            style={{ minHeight: `calc(1.5rem * ${initialRows > 1 ? initialRows * 0.7 : 1} + 1.25rem)` }} 
            aria-autocomplete="list"
            aria-expanded={showSuggestions && (suggestions.length > 0 || isFetchingSuggestions || !!suggestionError)}
            aria-controls={`${id}-suggestions`}
          />
        )}
        <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center space-x-0"> 
            {showSuggestButton && (
                 <button
                    type="button"
                    onClick={handleSuggest}
                    className="p-1 text-purple-400 hover:text-purple-200 active:text-purple-500 transition-colors duration-150 focus:outline-none focus:ring-1 focus:ring-purple-500 rounded-full ai-suggest-button" 
                    title={effectiveSuggestButtonTitle}
                    aria-label={t('suggestButtonTitle')}
                    disabled={isFetchingSuggestions} 
                >
                    <AppLogoIcon 
                        animatedAsAiIndicator
                        className={`w-4 h-4 api-status-indicator ${isFetchingSuggestions ? 'opacity-70 animate-pulse' : ''}`} 
                    /> 
                </button>
            )}
            {hasClearButton && (
            <button
                type="button"
                onClick={handleClear}
                className="p-1 text-slate-400 hover:text-slate-100 active:text-slate-300 transition-colors duration-150 focus:outline-none focus:ring-1 focus:ring-teal-500 rounded-full" 
                aria-label={`Clear input for ${label}`}
            >
                <XCircleIcon className="w-4 h-4" /> 
            </button>
            )}
        </div>
      </div>
      {showSuggestions && (isFetchingSuggestions || suggestionError || suggestions.length > 0) && (
        <div className="absolute z-10 w-full mt-0.5 bg-[var(--bg-tertiary)] dark:bg-slate-700 border border-[var(--border-color)] dark:border-slate-600 rounded-md shadow-lg max-h-52 overflow-y-auto" id={`${id}-suggestions`} role="listbox"> 
          {isFetchingSuggestions && (
            <div className="px-2.5 py-1.5 text-xs text-slate-400 animate-pulse">{t('suggestionsLoading')}</div>
          )}
          {suggestionError && !isFetchingSuggestions && (
            <div className="px-2.5 py-1.5 text-xs text-rose-400" role="alert">{suggestionError}</div>
          )}
          {!isFetchingSuggestions && !suggestionError && suggestions.length > 0 && (
            <ul ref={suggestionsListRef}>
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  onClick={() => handleOptionClick(suggestion)}
                  onMouseDown={(e) => e.preventDefault()} 
                  className={`px-2.5 py-1.5 text-xs text-slate-200 hover:bg-teal-600 dark:hover:bg-teal-700 cursor-pointer ai-suggestion-item ${index === focusedSuggestionIndex ? 'bg-teal-600 dark:bg-teal-700' : ''}`}
                  role="option"
                  aria-selected={index === focusedSuggestionIndex}
                  tabIndex={-1} 
                  id={`${id}-suggestion-${index}`} 
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
};

export default InputField;