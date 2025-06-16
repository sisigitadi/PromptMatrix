
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
import { SaveIcon } from './icons/SaveIcon'; 
// import { ChartBarIcon } from './icons/ChartBarIcon'; // Replaced by AppLogoIcon for detailed analysis

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
  detailedAiAnalysis: string | null;
  isFetchingDetailedAnalysis: boolean;
  detailedAnalysisError: string | null;
  onAnalyzeWithAI: () => void;
  apiKeyAvailable: boolean;
  aiFeedbackReceived: boolean;
  detailedAiAnalysisReceived: boolean;
  hasCurrentPromptBeenCopied: boolean;
  onPromptSuccessfullyCopied: () => void;
  onSavePrompt: () => void; 
  isPromptSavable: boolean; 
}

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
    } else if (line.match(/^(\*|-|\+) /)) { 
      if (currentListType !== 'ul') {
        flushList();
        currentListType = 'ul';
      }
      listItems.push(<li key={`li-${index}`}>{parseInlineFormatting(line.substring(2))}</li>);
    } else if (line.match(/^\d+\. /)) { 
      if (currentListType !== 'ol') {
        flushList();
        currentListType = 'ol';
      }
      listItems.push(<li key={`li-${index}`}>{parseInlineFormatting(line.substring(line.indexOf(' ') + 1))}</li>);
    } else {
      flushList();
      if (line.trim() !== "") {
        output.push(<p key={`p-${index}`} className="mb-1">{parseInlineFormatting(line)}</p>);
      } 
    }
  });
  flushList(); 
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
  detailedAiAnalysis,
  isFetchingDetailedAnalysis,
  detailedAnalysisError,
  onAnalyzeWithAI,
  apiKeyAvailable,
  aiFeedbackReceived,
  detailedAiAnalysisReceived,
  hasCurrentPromptBeenCopied,
  onPromptSuccessfullyCopied,
  onSavePrompt,
  isPromptSavable,
}) => {
  const { language, t } = useLanguage();
  const [copied, setCopied] = useState<boolean>(false); 
  const [copyAttemptedMessage, setCopyAttemptedMessage] = useState<string | null>(null);
  const [isToolSelectorModalOpen, setIsToolSelectorModalOpen] = useState<boolean>(false);
  
  // Initialize expansion state based on apiKeyAvailable for default visibility
  const [isAiFeedbackExpanded, setIsAiFeedbackExpanded] = useState<boolean>(!apiKeyAvailable ? true : true);
  const [isDetailedAnalysisExpanded, setIsDetailedAnalysisExpanded] = useState<boolean>(!apiKeyAvailable ? true : false);


  const currentFrameworkLocale = selectedFramework ? selectedFramework[language === 'id' ? 'idLocale' : 'enLocale'] : null;

  useEffect(() => {
    // Only auto-expand on new data if API key is available, otherwise keep default state
    if (apiKeyAvailable && aiFeedbackReceived && !isFetchingAiFeedback && !aiError && aiFeedback) {
      setIsAiFeedbackExpanded(true);
    }
  }, [apiKeyAvailable, aiFeedbackReceived, isFetchingAiFeedback, aiError, aiFeedback]);

  useEffect(() => {
    // Only auto-expand on new data if API key is available
    if (apiKeyAvailable && detailedAiAnalysisReceived && !isFetchingDetailedAnalysis && !detailedAnalysisError && detailedAiAnalysis) {
      setIsDetailedAnalysisExpanded(true); 
    }
  }, [apiKeyAvailable, detailedAiAnalysisReceived, isFetchingDetailedAnalysis, detailedAnalysisError, detailedAiAnalysis]);

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
  
  const isPromptNotEmpty = promptToCopy.trim().length > 0;
  const enhanceButtonTitle = !apiKeyAvailable || !isPromptNotEmpty ? t('aiFeatureRequiresSubscriptionTooltip') : t('enhanceButtonTitle');
  const analyzeButtonTitle = !apiKeyAvailable || !isPromptNotEmpty ? t('aiFeatureRequiresSubscriptionTooltip') : t('analyzeButtonTitle');

  const canCopy = promptToCopy.trim().length > 0;

  const isActuallyShowingPrompt = selectedFramework && promptText !== t('initialPromptAreaInstruction') && promptText !== t('initialPromptAreaInstructionNoApiKey') && promptText !== t('selectFrameworkPromptAreaInstruction') && promptToCopy.trim() !== '';
  const opacityClass = isExpanded && !isActuallyShowingPrompt ? 'opacity-60' : 'opacity-100';
    
  const showAiFeedbackSuccessIndicator = aiFeedbackReceived && !isFetchingAiFeedback && !aiError && apiKeyAvailable;
  const showDetailedAnalysisSuccessIndicator = detailedAiAnalysisReceived && !isFetchingDetailedAnalysis && !detailedAnalysisError && apiKeyAvailable;

  const renderFormattedTextSection = (text: string | null, titleKey: string, defaultContentKey: string) => {
    if (!apiKeyAvailable) { 
        return <p className="text-xs text-slate-400">{t(defaultContentKey as any)}. {t('aiFeaturesRequireSubscriptionMessage')}</p>;
    }
    if (!text) return <p className="text-xs text-slate-400">{t(defaultContentKey as any)}</p>;
  
    const sections: { header?: string; content: ReactNode[] }[] = [];
    const lines = text.split('\n').map(line => line.trim()).filter(line => line);
  
    let currentSectionTitle = '';
    let currentSectionContent: string[] = [];
  
    const flushCurrentSection = () => {
      if (currentSectionContent.length > 0) {
        sections.push({
          header: currentSectionTitle || undefined,
          content: parseMarkdownContent(currentSectionContent.join('\n'))
        });
        currentSectionContent = [];
        currentSectionTitle = '';
      }
    };
  
    const knownHeaders = [
      t('aiFeedbackStrengthsTitle'), t('aiFeedbackWeaknessesTitle'), t('aiFeedbackReasoningTitle'), t('aiFeedbackActionableSuggestionsTitle'),
      t('detailedAnalysisClarityScoreTitle'), t('detailedAnalysisSpecificityScoreTitle'), t('detailedAnalysisAmbiguitiesTitle'), t('detailedAnalysisSuggestionsTitle'), t('detailedAnalysisOverallAssessmentTitle')
    ].map(h => h.replace(':', '')); 
  
    let isFirstSection = true;
    for (const line of lines) {
      const matchingHeader = knownHeaders.find(header => line.toLowerCase().startsWith(header.toLowerCase()));
      if (matchingHeader) {
        flushCurrentSection();
        currentSectionTitle = line; 
        isFirstSection = false;
      } else {
        if (isFirstSection && !currentSectionTitle) {
           
        }
        currentSectionContent.push(line);
      }
    }
    flushCurrentSection();
  
    if (sections.length === 0 && text.trim()) { 
      return (
        <div className="font-sans text-sm sm:text-base text-slate-100 leading-relaxed max-h-60 sm:max-h-72 overflow-y-auto space-y-1" aria-live="polite">
          {parseMarkdownContent(text)}
        </div>
      );
    }
  
    return (
      <div className="font-sans text-sm sm:text-base text-slate-100 leading-relaxed max-h-60 sm:max-h-72 overflow-y-auto space-y-1" aria-live="polite">
        {sections.map((part, index) => (
          (part.header || part.content.length > 0) && (
            <div key={index} className={part.header && index > 0 ? "pt-2" : ""}>
              {part.header && (
                <strong className="block font-semibold text-teal-400 dark:text-teal-300 mb-0.5">
                  {part.header}
                </strong>
              )}
              {part.content.length > 0 && (
                <div>{part.content}</div>
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

          {isExpanded && ( 
            <div className="mx-4 sm:mx-6 mt-2.5 space-y-2.5"> 
              <div>
                <div 
                  className="flex justify-between items-center px-3 py-2 sm:px-4 sm:py-2.5 bg-slate-700/30 dark:bg-slate-800/40 rounded-t-lg border border-b-0 border-[var(--border-color)] dark:border-slate-600/70 cursor-pointer hover:bg-slate-700/50"
                  onClick={() => setIsAiFeedbackExpanded(!isAiFeedbackExpanded)}
                  role="button" tabIndex={0} onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setIsAiFeedbackExpanded(!isAiFeedbackExpanded)}
                  aria-expanded={isAiFeedbackExpanded} aria-controls="ai-feedback-content"
                >
                  <h4 className={`text-md font-semibold flex items-center ${apiKeyAvailable ? 'text-purple-400 dark:text-purple-300' : 'text-slate-400'}`}>
                    <strong>{t('aiFeedbackTitleTextOnly')} {!apiKeyAvailable && t('premiumFeatureTitleSuffix')}</strong>
                    <AppLogoIcon animatedAsAiIndicator={apiKeyAvailable} className={`w-4 h-4 ml-1.5 api-status-indicator shrink-0 ${!apiKeyAvailable ? 'grayscale' : ''}`} />
                    {showAiFeedbackSuccessIndicator && (
                      <CheckCircleIcon className="w-4 h-4 text-green-500 dark:text-green-400 ml-1.5 shrink-0" title={t('aiFeedbackReceivedIndicatorTooltip')} />
                    )}
                  </h4>
                  {isAiFeedbackExpanded ? <ChevronUpIcon className={`w-5 h-5 ${apiKeyAvailable ? 'text-purple-400' : 'text-slate-400'}`} /> : <ChevronDownIcon className={`w-5 h-5 ${apiKeyAvailable ? 'text-purple-400' : 'text-slate-400'}`} />}
                </div>
                <div 
                  id="ai-feedback-content" 
                  className={`overflow-hidden transition-all duration-300 ease-in-out bg-slate-700/30 dark:bg-slate-800/40 rounded-b-lg border border-t-0 border-[var(--border-color)] dark:border-slate-600/70
                              ${isAiFeedbackExpanded ? 'max-h-[500px] opacity-100 p-3 sm:p-4' : 'max-h-0 opacity-0 p-0'}`}
                >
                  {isFetchingAiFeedback && apiKeyAvailable && <p className="text-xs sm:text-sm text-slate-300 animate-pulse">{t('aiFeedbackLoading')}</p>}
                  {aiError && apiKeyAvailable && <p className="text-xs sm:text-sm text-rose-400 dark:text-rose-400" role="alert">{aiError}</p>}
                  {renderFormattedTextSection(aiFeedback, 'aiFeedbackTitleTextOnly', 'initialPromptAreaInstruction')}
                </div>
              </div>

              <div>
                <div 
                  className="flex justify-between items-center px-3 py-2 sm:px-4 sm:py-2.5 bg-slate-700/30 dark:bg-slate-800/40 rounded-t-lg border border-b-0 border-[var(--border-color)] dark:border-slate-600/70 cursor-pointer hover:bg-slate-700/50 mt-2"
                  onClick={() => setIsDetailedAnalysisExpanded(!isDetailedAnalysisExpanded)}
                  role="button" tabIndex={0} onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setIsDetailedAnalysisExpanded(!isDetailedAnalysisExpanded)}
                  aria-expanded={isDetailedAnalysisExpanded} aria-controls="detailed-ai-analysis-content"
                >
                  <h4 className={`text-md font-semibold flex items-center ${apiKeyAvailable ? 'text-purple-400 dark:text-purple-300' : 'text-slate-400'}`}>
                    <strong>{t('detailedAnalysisTitle')} {!apiKeyAvailable && t('premiumFeatureTitleSuffix')}</strong>
                    <AppLogoIcon animatedAsAiIndicator={apiKeyAvailable} className={`w-4 h-4 ml-1.5 shrink-0 ${!apiKeyAvailable ? 'grayscale' : ''}`} />
                    {showDetailedAnalysisSuccessIndicator && (
                       <CheckCircleIcon className="w-4 h-4 text-green-500 dark:text-green-400 ml-1.5 shrink-0" title={t('detailedAnalysisReceivedIndicatorTooltip')} />
                    )}
                  </h4>
                  {isDetailedAnalysisExpanded ? <ChevronUpIcon className={`w-5 h-5 ${apiKeyAvailable ? 'text-purple-400' : 'text-slate-400'}`} /> : <ChevronDownIcon className={`w-5 h-5 ${apiKeyAvailable ? 'text-purple-400' : 'text-slate-400'}`} />}
                </div>
                <div 
                  id="detailed-ai-analysis-content" 
                  className={`overflow-hidden transition-all duration-300 ease-in-out bg-slate-700/30 dark:bg-slate-800/40 rounded-b-lg border border-t-0 border-[var(--border-color)] dark:border-slate-600/70
                              ${isDetailedAnalysisExpanded ? 'max-h-[500px] opacity-100 p-3 sm:p-4' : 'max-h-0 opacity-0 p-0'}`}
                >
                  {isFetchingDetailedAnalysis && apiKeyAvailable && <p className="text-xs sm:text-sm text-slate-300 animate-pulse">{t('detailedAnalysisLoading')}</p>}
                  {detailedAnalysisError && apiKeyAvailable && <p className="text-xs sm:text-sm text-rose-400 dark:text-rose-400" role="alert">{detailedAnalysisError}</p>}
                  {renderFormattedTextSection(detailedAiAnalysis, 'detailedAnalysisTitle', 'initialDetailedAnalysisInstruction')}
                </div>
              </div>
            </div>
          )}

          <div className="mt-auto pt-2.5 px-4 sm:px-6 pb-3 sm:pb-4 space-y-2.5"> 
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5"> 
                  <button
                      onClick={onEnhanceWithAI}
                      title={enhanceButtonTitle}
                      className={`w-full py-2 px-2.5 text-xs font-semibold rounded-md transition-all duration-200 ease-in-out flex items-center justify-center space-x-1.5
                                  transform active:scale-95 shadow-md
                                  ${apiKeyAvailable && isPromptNotEmpty
                                      ? 'bg-purple-600 hover:bg-purple-500 text-white focus:ring-1 focus:ring-purple-400 focus:ring-offset-1 focus:ring-offset-[var(--bg-secondary)] dark:focus:ring-offset-slate-800'
                                      : 'bg-slate-600 text-slate-400 cursor-not-allowed focus:ring-slate-500 opacity-70'
                                  }`}
                      aria-label={t('enhanceButtonAria')}
                      disabled={!apiKeyAvailable || !isPromptNotEmpty || isFetchingAiFeedback}
                  >
                      <span className="button-text-content">{isFetchingAiFeedback ? t('enhanceButtonLoadingText') : t('enhanceButtonText')}</span>
                      <AppLogoIcon animatedAsAiIndicator={apiKeyAvailable} className={`w-4 h-4 api-status-indicator ml-1.5 ${isFetchingAiFeedback ? 'opacity-70 animate-pulse' : ''} ${!apiKeyAvailable ? 'grayscale' :''}`} /> 
                  </button>
                  <button
                      onClick={onAnalyzeWithAI}
                      title={analyzeButtonTitle}
                      className={`w-full py-2 px-2.5 text-xs font-semibold rounded-md transition-all duration-200 ease-in-out flex items-center justify-center space-x-1.5
                                  transform active:scale-95 shadow-md
                                  ${apiKeyAvailable && isPromptNotEmpty
                                      ? 'bg-indigo-600 hover:bg-indigo-500 text-white focus:ring-1 focus:ring-indigo-400 focus:ring-offset-1 focus:ring-offset-[var(--bg-secondary)] dark:focus:ring-offset-slate-800'
                                      : 'bg-slate-600 text-slate-400 cursor-not-allowed focus:ring-slate-500 opacity-70'
                                  }`}
                      aria-label={t('analyzeButtonAria')}
                      disabled={!apiKeyAvailable || !isPromptNotEmpty || isFetchingDetailedAnalysis}
                  >
                      <span className="button-text-content">{isFetchingDetailedAnalysis ? t('analyzeButtonLoadingText') : t('analyzeButtonText')}</span>
                      <AppLogoIcon animatedAsAiIndicator={apiKeyAvailable} className={`w-4 h-4 text-white ml-1.5 shrink-0 ${isFetchingDetailedAnalysis ? 'opacity-70 animate-pulse' : ''} ${!apiKeyAvailable ? 'grayscale' :''}`} />
                  </button>
              </div>
            
             <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-2.5">
                <button
                  onClick={onSavePrompt}
                  title={t('savePromptButtonAria')}
                  className={`w-full py-2 px-2.5 text-xs font-semibold rounded-md transition-all duration-200 ease-in-out flex items-center justify-center space-x-1.5
                              transform active:scale-95 shadow-md sm:col-span-1
                              ${isPromptSavable
                                  ? 'bg-sky-600 hover:bg-sky-500 text-white focus:ring-1 focus:ring-sky-400 focus:ring-offset-1 focus:ring-offset-[var(--bg-secondary)] dark:focus:ring-offset-slate-800'
                                  : 'bg-slate-600 text-slate-400 cursor-not-allowed focus:ring-slate-500 opacity-70'
                              }`}
                  aria-label={t('savePromptButtonAria')}
                  disabled={!isPromptSavable}
                >
                  <SaveIcon className="w-4 h-4" />
                  <span className="button-text-content">{t('savePromptButton')}</span>
                </button>

                <button
                onClick={handleCopy}
                title={copied ? t('copiedButtonTitle') : t('copyButtonTitle')}
                className={`w-full py-2 px-2.5 text-xs font-semibold rounded-md transition-all duration-200 ease-in-out flex items-center justify-center space-x-1.5
                            transform active:scale-95 shadow-md sm:col-span-1
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
                className={`w-full py-2 px-2.5 text-xs font-semibold rounded-md transition-all duration-200 ease-in-out flex items-center justify-center space-x-1.5
                            ${canLaunchTool
                                ? 'bg-slate-500 dark:bg-slate-600 hover:bg-teal-700 dark:hover:bg-teal-700/80 text-white focus:ring-1 focus:ring-teal-500 dark:focus:ring-teal-600 focus:ring-offset-1 focus:ring-offset-[var(--bg-secondary)] dark:focus:ring-offset-slate-800'
                                : 'bg-slate-600 text-slate-400 cursor-not-allowed focus:ring-slate-500'
                            }
                            transform active:scale-95 shadow-md sm:col-span-1`}
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
