
import React, { useState, useCallback, useEffect, ReactNode } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Framework } from '../types';
import { ExternalLinkIcon } from './icons/ExternalLinkIcon';
import ToolLinkSelectorModal from './ToolLinkSelectorModal';
import { ClipboardIcon } from './icons/ClipboardIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { ChevronDownIcon } from './icons/ChevronDownIcon';
import { ChevronUpIcon } from './icons/ChevronUpIcon';
import { AppLogoIcon } from './icons/AppLogoIcon'; 

interface PromptOutputProps {
  promptText: string;
  promptToCopy: string;
  selectedFramework: Framework | null; 
  isExpanded: boolean;
  onToggleExpansion: () => void;
  aiFeedback: string | null;
  isFetchingAiFeedback: boolean;
  aiError: string | null;
  onEnhanceWithAI: () => void;
  apiKeyAvailable: boolean;
  aiFeedbackReceived: boolean;
  hasCurrentPromptBeenCopied: boolean;
  onPromptSuccessfullyCopied: () => void;
}

// Helper function to parse markdown-like content
const parseMarkdownContent = (text: string): ReactNode[] => {
  const output: ReactNode[] = [];
  let currentListType: 'ul' | 'ol' | null = null;
  let listItems: ReactNode[] = [];

  const flushList = () => {
    if (currentListType && listItems.length > 0) {
      if (currentListType === 'ul') {
        output.push(<ul key={`ul-${output.length}`} className="list-disc list-inside ml-4 mb-1">{listItems}</ul>);
      } else {
        output.push(<ol key={`ol-${output.length}`} className="list-decimal list-inside ml-4 mb-1">{listItems}</ol>);
      }
    }
    listItems = [];
    currentListType = null;
  };

  const parseInlineFormatting = (line: string): ReactNode[] => {
    const parts: ReactNode[] = [];
    let remainingLine = line;
    let keyIndex = 0;

    while (remainingLine.length > 0) {
      const boldMatch = remainingLine.match(/^(\*\*|__)(.*?)\1/);
      const italicMatch = remainingLine.match(/^(\*|_)(.*?)\1/);

      if (boldMatch) {
        parts.push(<strong key={`bold-${keyIndex++}`}>{boldMatch[2]}</strong>);
        remainingLine = remainingLine.substring(boldMatch[0].length);
      } else if (italicMatch) {
        parts.push(<em key={`italic-${keyIndex++}`}>{italicMatch[2]}</em>);
        remainingLine = remainingLine.substring(italicMatch[0].length);
      } else {
        const nextMatchIndex = Math.min(
          remainingLine.indexOf('**') > -1 ? remainingLine.indexOf('**') : Infinity,
          remainingLine.indexOf('__') > -1 ? remainingLine.indexOf('__') : Infinity,
          remainingLine.indexOf('*') > -1 ? remainingLine.indexOf('*') : Infinity,
          remainingLine.indexOf('_') > -1 ? remainingLine.indexOf('_') : Infinity
        );
        if (nextMatchIndex === Infinity) {
          parts.push(remainingLine);
          remainingLine = "";
        } else {
          parts.push(remainingLine.substring(0, nextMatchIndex));
          remainingLine = remainingLine.substring(nextMatchIndex);
        }
      }
    }
    return parts;
  };


  text.split('\n').forEach((line, index) => {
    if (line.startsWith('## ')) {
      flushList();
      output.push(<h5 key={`h5-${index}`} className="text-base font-semibold text-slate-200 mt-1 mb-0.5">{parseInlineFormatting(line.substring(3))}</h5>);
    } else if (line.startsWith('# ')) {
      flushList();
      output.push(<h4 key={`h4-${index}`} className="text-lg font-semibold text-slate-100 mt-1.5 mb-0.5">{parseInlineFormatting(line.substring(2))}</h4>);
    } else if (line.match(/^(\*|-|\+) /)) { // Unordered list
      if (currentListType !== 'ul') {
        flushList();
        currentListType = 'ul';
      }
      listItems.push(<li key={`li-${index}`}>{parseInlineFormatting(line.substring(2))}</li>);
    } else if (line.match(/^\d+\. /)) { // Ordered list
      if (currentListType !== 'ol') {
        flushList();
        currentListType = 'ol';
      }
      listItems.push(<li key={`li-${index}`}>{parseInlineFormatting(line.substring(line.indexOf(' ') + 1))}</li>);
    } else {
      flushList();
      if (line.trim() !== "") {
        output.push(<p key={`p-${index}`} className="mb-1">{parseInlineFormatting(line)}</p>);
      } else if (output.length > 0 && typeof output[output.length -1] === 'object' && (output[output.length-1] as any)?.type === 'p') {
        // Add extra margin for consecutive empty lines creating paragraph breaks if needed,
        // or simply ensure single empty lines are ignored if that's preferred.
        // Current: empty lines are mostly ignored unless between text blocks.
      }
    }
  });
  flushList(); // Ensure any trailing list is flushed
  return output;
};


const PromptOutput: React.FC<PromptOutputProps> = ({ 
  promptText, 
  promptToCopy, 
  selectedFramework,
  isExpanded,
  onToggleExpansion,
  aiFeedback,
  isFetchingAiFeedback,
  aiError,
  onEnhanceWithAI,
  apiKeyAvailable,
  aiFeedbackReceived,
  hasCurrentPromptBeenCopied,
  onPromptSuccessfullyCopied,
}) => {
  const { language, t } = useLanguage();
  const [copied, setCopied] = useState<boolean>(false); 
  const [copyAttemptedMessage, setCopyAttemptedMessage] = useState<string | null>(null);
  const [isToolSelectorModalOpen, setIsToolSelectorModalOpen] = useState<boolean>(false);
  const [isAiFeedbackExpanded, setIsAiFeedbackExpanded] = useState<boolean>(true);


  const currentFrameworkLocale = selectedFramework ? selectedFramework[language === 'id' ? 'idLocale' : 'enLocale'] : null;

  useEffect(() => {
    if (aiFeedbackReceived && !isFetchingAiFeedback && !aiError && aiFeedback) {
      setIsAiFeedbackExpanded(true);
    }
  }, [aiFeedbackReceived, isFetchingAiFeedback, aiError, aiFeedback]);

  const handleCopy = useCallback(async () => {
    const trimmedPromptToCopy = promptToCopy.trim();
    if (!trimmedPromptToCopy) { 
      setCopyAttemptedMessage(t('nothingToCopyMessage'));
      setTimeout(() => setCopyAttemptedMessage(null), 2500);
      return;
    }
    try {
      await navigator.clipboard.writeText(trimmedPromptToCopy);
      setCopied(true); 
      onPromptSuccessfullyCopied(); 
      setCopyAttemptedMessage(t('copySuccessMessage'));
      setTimeout(() => {
        setCopied(false);
        setCopyAttemptedMessage(null);
      }, 2500);
    } catch (err) {
      console.error('Gagal menyalin teks: ', err);
      setCopyAttemptedMessage('Error: Could not copy.');
       setTimeout(() => setCopyAttemptedMessage(null), 2500);
    }
  }, [promptToCopy, t, onPromptSuccessfullyCopied]);

  const handleLaunchTool = () => {
    if (!currentFrameworkLocale || !selectedFramework) return;

    if (currentFrameworkLocale.genericToolLinks && currentFrameworkLocale.genericToolLinks.length > 0) {
      setIsToolSelectorModalOpen(true);
    } else if (currentFrameworkLocale.toolLink) {
      window.open(currentFrameworkLocale.toolLink, '_blank', 'noopener,noreferrer');
    }
  };
  
  const canLaunchTool =
    selectedFramework && currentFrameworkLocale &&
    (
      (currentFrameworkLocale.genericToolLinks && currentFrameworkLocale.genericToolLinks.length > 0) ||
      !!currentFrameworkLocale.toolLink
    );
  
  const canEnhanceInternal = !!apiKeyAvailable && promptToCopy.trim().length > 0 && !isFetchingAiFeedback;
  const canCopy = promptToCopy.trim().length > 0;

  const isActuallyShowingPrompt = selectedFramework && promptText !== t('initialPromptAreaInstruction') && promptText !== t('selectFrameworkPromptAreaInstruction') && promptToCopy.trim() !== '';
  const opacityClass = isExpanded && !isActuallyShowingPrompt ? 'opacity-60' : 'opacity-100';

  const enhanceButtonCurrentTitle = !apiKeyAvailable 
    ? t('apiKeyMissingError') 
    : t('enhanceButtonTitle');
    
  const showAiFeedbackSuccessIndicator = aiFeedbackReceived && !isFetchingAiFeedback && !aiError && apiKeyAvailable;

  const renderFormattedAiFeedback = () => {
    if (!aiFeedback) return null;
  
    const headers = [
      { key: 'aiFeedbackStrengthsTitle', title: t('aiFeedbackStrengthsTitle') },
      { key: 'aiFeedbackWeaknessesTitle', title: t('aiFeedbackWeaknessesTitle') },
      { key: 'aiFeedbackReasoningTitle', title: t('aiFeedbackReasoningTitle') },
      { key: 'aiFeedbackActionableSuggestionsTitle', title: t('aiFeedbackActionableSuggestionsTitle') },
    ];
  
    let remainingText = aiFeedback;
    const parts: { header?: string; content: string }[] = [];
    let foundAnyHeader = false;
  
    // Try to preserve text before the first known header
    let firstKnownHeaderPosition = -1;
    for (const headerObj of headers) {
        const index = remainingText.indexOf(headerObj.title);
        if (index !== -1) {
            if (firstKnownHeaderPosition === -1 || index < firstKnownHeaderPosition) {
                firstKnownHeaderPosition = index;
            }
        }
    }
  
    if (firstKnownHeaderPosition > 0) {
        parts.push({ content: remainingText.substring(0, firstKnownHeaderPosition).trim() });
        remainingText = remainingText.substring(firstKnownHeaderPosition);
    }
  
    while (remainingText.trim()) {
        let currentHeader: string | undefined = undefined;
        let currentHeaderKey: string | undefined = undefined;
        let nextHeaderStartIndex = Infinity;
        let contentEndIndex = remainingText.length;
    
        // Find the first header at the beginning of the remainingText
        for (const headerObj of headers) {
            if (remainingText.startsWith(headerObj.title)) {
                currentHeader = headerObj.title;
                currentHeaderKey = headerObj.key;
                remainingText = remainingText.substring(currentHeader.length).trimStart();
                foundAnyHeader = true;
                break;
            }
        }
    
        // Find the start of the next header to determine current content boundary
        for (const headerObj of headers) {
            const index = remainingText.indexOf(headerObj.title);
            if (index !== -1 && index < nextHeaderStartIndex) {
                nextHeaderStartIndex = index;
            }
        }
        contentEndIndex = nextHeaderStartIndex;
    
        const content = remainingText.substring(0, contentEndIndex).trim();
        
        if (currentHeader || content) {
             parts.push({ header: currentHeader, content });
        }
        
        remainingText = remainingText.substring(contentEndIndex).trimStart();
        if (!foundAnyHeader && !currentHeader && parts.length > 0) break; // Avoid infinite loop if no headers left
    }
  
    if (!foundAnyHeader && aiFeedback.trim()) {
      // If no known headers were found at all, render everything with Markdown parsing
      return (
        <div className="font-sans text-sm sm:text-base text-slate-100 leading-relaxed max-h-60 sm:max-h-72 overflow-y-auto space-y-1" aria-live="polite">
          {parseMarkdownContent(aiFeedback)}
        </div>
      );
    }
  
    return (
      <div className="font-sans text-sm sm:text-base text-slate-100 leading-relaxed max-h-60 sm:max-h-72 overflow-y-auto space-y-1" aria-live="polite">
        {parts.map((part, index) => (
          (part.header || part.content.trim()) && (
            <div key={index} className={part.header && index > 0 && parts[index-1].content.trim() ? "pt-2" : ""}>
              {part.header && (
                <strong className="block font-semibold text-teal-400 dark:text-teal-300 mb-0.5">
                  {part.header}
                </strong>
              )}
              {part.content.trim() && (
                <div>{parseMarkdownContent(part.content)}</div>
              )}
            </div>
          )
        ))}
      </div>
    );
  };


  return (
    <>
      <div className="flex flex-col h-full">
        <div 
          className="flex justify-between items-center px-4 sm:px-6 py-3 sm:py-4 border-b border-[var(--border-color)] dark:border-slate-700/50 cursor-pointer hover:bg-slate-700/40 transition-colors"
          onClick={onToggleExpansion}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onToggleExpansion()}
          aria-expanded={isExpanded}
          aria-controls="output-panel-content"
        >
          <h3 className="text-lg sm:text-xl font-semibold text-teal-700 dark:text-teal-600">{t('generatedPromptTitle')}</h3>
          {isExpanded ? <ChevronUpIcon className="w-6 h-6 text-teal-700 dark:text-teal-600" /> : <ChevronDownIcon className="w-6 h-6 text-teal-700 dark:text-teal-600" />}
        </div>
        
        <div id="output-panel-content" className={`flex-grow overflow-hidden flex flex-col ${isExpanded ? 'collapsible-content open' : 'collapsible-content'}`}>
          <div 
            className={`relative flex-grow min-h-[120px] sm:min-h-[150px] bg-[var(--bg-tertiary)] dark:bg-slate-700/50 rounded-lg border border-[var(--border-color)] dark:border-slate-600 shadow-inner overflow-auto 
                        transition-opacity duration-300 ${opacityClass}
                        mx-4 sm:mx-6 mt-3 p-3 sm:p-4`} 
          >
            <pre
              className="whitespace-pre-wrap break-words text-xs sm:text-sm text-[var(--text-primary)] dark:text-slate-200 leading-relaxed font-sans" 
              aria-live="polite"
            >
              {promptText}
            </pre>
          </div>

          {apiKeyAvailable && isExpanded && (
            <div className="mx-4 sm:mx-6 mt-2.5"> 
              <div 
                className="flex justify-between items-center px-3 py-2 sm:px-4 sm:py-2.5 bg-slate-700/30 dark:bg-slate-800/40 rounded-t-lg border border-b-0 border-[var(--border-color)] dark:border-slate-600/70 cursor-pointer hover:bg-slate-700/50"
                onClick={() => setIsAiFeedbackExpanded(!isAiFeedbackExpanded)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setIsAiFeedbackExpanded(!isAiFeedbackExpanded)}
                aria-expanded={isAiFeedbackExpanded}
                aria-controls="ai-feedback-content"
              >
                <h4 className="text-sm sm:text-md font-semibold text-purple-400 dark:text-purple-300 flex items-center">
                  <strong className="italic">{t('aiFeedbackTitleTextOnly')}</strong>
                  {apiKeyAvailable && <AppLogoIcon animatedAsAiIndicator className="w-4 h-4 ml-1.5 api-status-indicator shrink-0" />}
                  {showAiFeedbackSuccessIndicator && (
                    <CheckCircleIcon className="w-4 h-4 text-green-500 dark:text-green-400 ml-1.5 shrink-0" title={t('aiFeedbackReceivedIndicatorTooltip')} />
                  )}
                </h4>
                {isAiFeedbackExpanded ? <ChevronUpIcon className="w-5 h-5 text-purple-400" /> : <ChevronDownIcon className="w-5 h-5 text-purple-400" />}
              </div>
              <div 
                id="ai-feedback-content" 
                className={`overflow-hidden transition-all duration-300 ease-in-out bg-slate-700/30 dark:bg-slate-800/40 rounded-b-lg border border-t-0 border-[var(--border-color)] dark:border-slate-600/70
                            ${isAiFeedbackExpanded ? 'max-h-[500px] opacity-100 p-3 sm:p-4' : 'max-h-0 opacity-0 p-0'}`}
              >
                {isFetchingAiFeedback && (
                  <p className="text-xs sm:text-sm text-slate-300 animate-pulse">{t('aiFeedbackLoading')}</p>
                )}
                {aiError && (
                  <p className="text-xs sm:text-sm text-rose-400 dark:text-rose-400" role="alert">{aiError}</p>
                )}
                {!isFetchingAiFeedback && aiFeedback && (
                   renderFormattedAiFeedback()
                )}
              </div>
            </div>
          )}

          <div className="mt-auto pt-2.5 px-4 sm:px-6 pb-3 sm:pb-4 space-y-2.5"> 
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-2.5"> 
                {apiKeyAvailable && (
                  <button
                      onClick={onEnhanceWithAI}
                      title={enhanceButtonCurrentTitle}
                      className={`w-full sm:w-auto flex-grow py-2 px-2.5 text-xs font-semibold rounded-md transition-all duration-200 ease-in-out flex items-center justify-center space-x-1.5
                                  transform active:scale-95 shadow-md
                                  ${canEnhanceInternal
                                      ? 'bg-purple-600 hover:bg-purple-500 text-white focus:ring-1 focus:ring-purple-400 focus:ring-offset-1 focus:ring-offset-[var(--bg-secondary)] dark:focus:ring-offset-slate-800'
                                      : 'bg-slate-600 text-slate-400 cursor-not-allowed focus:ring-slate-500 opacity-70'
                                  }`}
                      aria-label={t('enhanceButtonAria')}
                      disabled={!canEnhanceInternal || isFetchingAiFeedback}
                  >
                      <span className="button-text-content">{isFetchingAiFeedback ? t('enhanceButtonLoadingText') : t('enhanceButtonText')}</span>
                      <AppLogoIcon animatedAsAiIndicator className={`w-4 h-4 api-status-indicator ml-1.5 ${isFetchingAiFeedback ? 'opacity-70 animate-pulse' : ''}`} /> 
                  </button>
                )}

                <button
                onClick={handleCopy}
                title={copied ? t('copiedButtonTitle') : t('copyButtonTitle')}
                className={`w-full sm:w-auto flex-grow py-2 px-2.5 text-xs font-semibold rounded-md transition-all duration-200 ease-in-out flex items-center justify-center space-x-1.5
                            transform active:scale-95 shadow-md
                            ${copied ? 'bg-green-500 hover:bg-green-600 text-white focus:ring-1 focus:ring-green-400 focus:ring-offset-1 focus:ring-offset-[var(--bg-secondary)] dark:focus:ring-offset-slate-800' :
                                canCopy ? 'bg-teal-700 dark:bg-teal-700 hover:bg-teal-600 dark:hover:bg-teal-600 text-white focus:ring-1 focus:ring-teal-500 dark:focus:ring-teal-500 focus:ring-offset-1 focus:ring-offset-[var(--bg-secondary)] dark:focus:ring-offset-slate-800'
                                        : 'bg-slate-600 text-slate-400 cursor-not-allowed focus:ring-slate-500'
                            }`}
                aria-label={copied ? t('promptCopiedAria') : t('copyToClipboardAria')}
                disabled={!canCopy && !copied}
                >
                {copied ? (
                  <CheckCircleIcon className="w-4 h-4" />
                ) : hasCurrentPromptBeenCopied ? (
                  <CheckCircleIcon className="w-4 h-4 text-green-300" title={t('promptHasBeenCopiedIndicatorTooltip')} />
                ) : (
                  <ClipboardIcon className="w-4 h-4" />
                )}
                <span className="button-text-content">{copied ? t('copiedButtonText') : t('copyButtonText')}</span>
                </button>

                <button
                onClick={handleLaunchTool}
                title={t('launchToolButtonAria', (currentFrameworkLocale?.category === 'media' || currentFrameworkLocale?.category === 'music') && currentFrameworkLocale?.toolLink ? currentFrameworkLocale.name : undefined)}
                className={`w-full sm:w-auto flex-grow py-2 px-2.5 text-xs font-semibold rounded-md transition-all duration-200 ease-in-out flex items-center justify-center space-x-1.5
                            ${canLaunchTool
                                ? 'bg-slate-500 dark:bg-slate-600 hover:bg-teal-700 dark:hover:bg-teal-700/80 text-white focus:ring-1 focus:ring-teal-500 dark:focus:ring-teal-600 focus:ring-offset-1 focus:ring-offset-[var(--bg-secondary)] dark:focus:ring-offset-slate-800'
                                : 'bg-slate-600 text-slate-400 cursor-not-allowed focus:ring-slate-500'
                            }
                            transform active:scale-95 shadow-md`}
                aria-label={t('launchToolButtonAria', (currentFrameworkLocale?.category === 'media' || currentFrameworkLocale?.category === 'music') && currentFrameworkLocale?.toolLink ? currentFrameworkLocale.name : undefined)}
                disabled={!canLaunchTool}
                >
                <span className="button-text-content">{t('launchToolButtonText')}</span>
                <ExternalLinkIcon className="w-3.5 h-3.5 ml-1" />
                </button>
            </div>
            {copyAttemptedMessage && (
              <p className={`text-xs text-center ${copied && copyAttemptedMessage === t('copySuccessMessage') ? 'text-green-500 dark:text-green-400' : 'text-rose-400 dark:text-rose-400'}`} role="status">
                {copyAttemptedMessage}
              </p>
            )}
          </div>
          
        </div>
         {!isExpanded && (
             <p className="px-4 sm:px-6 py-2.5 text-xs text-center text-slate-400 italic"> 
                {t('clickToExpandOutputPanel')}
            </p>
         )}

      </div>

      { isToolSelectorModalOpen && selectedFramework && currentFrameworkLocale && currentFrameworkLocale.genericToolLinks && currentFrameworkLocale.genericToolLinks.length > 0 && (
        <ToolLinkSelectorModal
          isOpen={isToolSelectorModalOpen}
          onClose={() => setIsToolSelectorModalOpen(false)}
          links={currentFrameworkLocale.genericToolLinks}
          title={t('toolSelectorModalTitle')}
        />
      )}
    </>
  );
};

export default PromptOutput;
