
import React, { useState, useCallback } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Framework } from '../types';
import { ExternalLinkIcon } from './icons/ExternalLinkIcon';
import ToolLinkSelectorModal from './ToolLinkSelectorModal';
import { ClipboardIcon } from './icons/ClipboardIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { ChevronDownIcon } from './icons/ChevronDownIcon';
import { ChevronUpIcon } from './icons/ChevronUpIcon';
import { SparklesIcon } from './icons/SparklesIcon'; 

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
  const [copied, setCopied] = useState<boolean>(false); // Local temporary state for "Copied!" button
  const [copyAttemptedMessage, setCopyAttemptedMessage] = useState<string | null>(null);
  const [isToolSelectorModalOpen, setIsToolSelectorModalOpen] = useState<boolean>(false);
  const [isAiFeedbackExpanded, setIsAiFeedbackExpanded] = useState<boolean>(false);


  const currentFrameworkLocale = selectedFramework ? selectedFramework[language === 'id' ? 'idLocale' : 'enLocale'] : null;

  const handleCopy = useCallback(async () => {
    const trimmedPromptToCopy = promptToCopy.trim();
    if (!trimmedPromptToCopy) { 
      setCopyAttemptedMessage(t('nothingToCopyMessage'));
      setTimeout(() => setCopyAttemptedMessage(null), 2500);
      return;
    }
    try {
      await navigator.clipboard.writeText(trimmedPromptToCopy);
      setCopied(true); // Temporary feedback
      onPromptSuccessfullyCopied(); // Notify App.tsx for persistent state
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
  
  const canEnhance = apiKeyAvailable && promptToCopy.trim().length > 0 && !isFetchingAiFeedback;
  const canCopy = promptToCopy.trim().length > 0;

  const isActuallyShowingPrompt = selectedFramework && promptText !== t('initialPromptAreaInstruction') && promptText !== t('selectFrameworkPromptAreaInstruction') && promptToCopy.trim() !== '';
  const opacityClass = isExpanded && !isActuallyShowingPrompt ? 'opacity-60' : 'opacity-100';

  const enhanceButtonCurrentTitle = !apiKeyAvailable 
    ? t('apiKeyMissingError') 
    : t('enhanceButtonTitle');
    
  const showAiFeedbackSection = !!(aiFeedback || isFetchingAiFeedback || aiError);
  const showAiFeedbackSuccessIndicator = aiFeedbackReceived && !isFetchingAiFeedback && !aiError;


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

          {/* AI Feedback Section - this existing condition is fine, it relates to AI feedback state itself */}
          {showAiFeedbackSection && isExpanded && (
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
                  <SparklesIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" />
                  <strong className="italic">{t('aiFeedbackTitleTextOnly')}</strong>
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
                {aiFeedback && !isFetchingAiFeedback && (
                  <pre className="font-sans whitespace-pre-wrap break-words text-xs sm:text-sm text-slate-200 dark:text-slate-200 leading-relaxed max-h-52 sm:max-h-60 overflow-y-auto"  aria-live="polite">
                    {aiFeedback}
                  </pre>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons Row - this section will now always be rendered if its parent (collapsible-content open) is rendered */}
          <div className="mt-auto pt-2.5 px-4 sm:px-6 pb-3 sm:pb-4 space-y-2.5"> 
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-2.5"> 
                <button
                    onClick={onEnhanceWithAI}
                    title={enhanceButtonCurrentTitle}
                    className={`w-full sm:w-auto flex-grow py-2 px-2.5 text-xs font-semibold rounded-md transition-all duration-200 ease-in-out flex items-center justify-center space-x-1.5
                                transform active:scale-95 shadow-md
                                ${canEnhance
                                    ? 'bg-purple-600 hover:bg-purple-500 text-white focus:ring-1 focus:ring-purple-400 focus:ring-offset-1 focus:ring-offset-[var(--bg-secondary)] dark:focus:ring-offset-slate-800'
                                    : 'bg-slate-600 text-slate-400 cursor-not-allowed focus:ring-slate-500 opacity-70'
                                }`}
                    aria-label={t('enhanceButtonAria')}
                    disabled={!canEnhance || isFetchingAiFeedback}
                >
                    <SparklesIcon className="w-4 h-4" />
                    <span className="button-text-content">{isFetchingAiFeedback ? t('enhanceButtonLoadingText') : t('enhanceButtonText')}</span>
                </button>

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
