
import React, { ReactElement, useMemo } from 'react';
import clsx from 'clsx';
import InputField from './components/InputField';
import PromptOutput from './components/PromptOutput';
import { EraserIcon } from './components/icons/EraserIcon';
import DisclaimerModal from './components/modals/DisclaimerModal';
import HowToUseModal from './components/modals/HowToUseModal';
import SubscriptionInfoModal from './components/modals/SubscriptionInfoModal';
import TeaserPopupModal from './components/modals/TeaserPopupModal';
import { AppLogoIcon } from './components/icons/AppLogoIcon';
import { AiTextIcon } from './components/AiTextIcon';
import { ChevronDownIcon } from './components/icons/ChevronDownIcon';
import { ChevronUpIcon } from './components/icons/ChevronUpIcon';
import { GmailIcon } from './components/icons/GmailIcon';
import { GithubIcon } from './components/icons/GithubIcon';
import { MediumIcon } from './components/icons/MediumIcon';
import { PencilIcon } from './components/icons/PencilIcon';
import { CameraIcon } from './components/icons/CameraIcon';
import { MusicNoteIcon } from './components/icons/MusicNoteIcon';
import PromptStashPanel from './components/PromptStashPanel';
import GlobalActivityIndicator from './components/GlobalActivityIndicator';
import { BadgeCheckIcon } from './components/icons/BadgeCheckIcon';
import { GlobeAltIcon } from './components/icons/GlobeAltIcon';
import { StarIcon } from './components/icons/StarIcon';
import { useAppLogic } from './hooks/useAppLogic';
import { useLanguage } from './contexts/LanguageContext';
import { frameworks } from './frameworks';
import { APP_VERSION } from './constants';

const App: React.FC = (): ReactElement => {
  const {
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
  } = useAppLogic();

  const currentYear = new Date().getFullYear();

  const filteredFrameworks = useMemo(() => {
    return frameworks
      .filter(fw => {
        if (!frameworkSearchTerm.trim()) return true;
        const locale = language === 'id' ? fw.idLocale : fw.enLocale;
        const searchTermLower = frameworkSearchTerm.toLowerCase();
        return (
          t(locale.name).toLowerCase().includes(searchTermLower) ||
          t(locale.shortName).toLowerCase().includes(searchTermLower) ||
          t(locale.description).toLowerCase().includes(searchTermLower) ||
          t(locale.shortDescription).toLowerCase().includes(searchTermLower)
        );
      })
      .sort((a, b) => {
        const aLocale = language === 'id' ? a.idLocale : a.enLocale;
        const bLocale = language === 'id' ? b.idLocale : b.enLocale;
        return t(aLocale.name).localeCompare(t(bLocale.name));
      });
  }, [frameworkSearchTerm, language, t]);

  const displayedFrameworks = useMemo(() => {
    if (frameworkSearchTerm.trim()) {
      return (forceGlobalSearchDisplay || !selectedCategory)
        ? filteredFrameworks
        : filteredFrameworks.filter(fw => fw.idLocale.category === selectedCategory);
    }
    if (selectedCategory) {
      return frameworks.filter(fw => fw.idLocale.category === selectedCategory).sort((a, b) => {
        const aLocale = language === 'id' ? a.idLocale : a.enLocale;
        const bLocale = language === 'id' ? b.idLocale : b.enLocale;
        return t(aLocale.name).localeCompare(t(bLocale.name));
      });
    }
    // Default case
    return frameworks.filter(fw => fw.idLocale.category === 'text').sort((a, b) => t(language === 'id' ? a.idLocale.name : a.enLocale.name).localeCompare(t(language === 'id' ? b.idLocale.name : b.enLocale.name)));
  }, [filteredFrameworks, frameworkSearchTerm, forceGlobalSearchDisplay, selectedCategory, language, t]);

  const currentFrameworkLocale = selectedFramework ? (language === 'id' ? selectedFramework.idLocale : selectedFramework.enLocale) : null;


  const langToggleAriaLabel = language === 'id' ? t('switchToEnglish') : t('switchToIndonesian');
  const langToggleTitle = language === 'id' ? t('switchToEnglish') : t('switchToIndonesian');


  const isPromptSavable = promptToCopy.trim().length > 0 && !!selectedFramework;

  let frameworkListTitle = "";
  if (frameworkSearchTerm.trim()) {
    if (selectedCategory && !forceGlobalSearchDisplay) {
        const categoryName = t(`${selectedCategory}FrameworksTitle` as TranslationKey);
        frameworkListTitle = t('searchResultsInCategoryTitle', categoryName);
    } else {
        frameworkListTitle = t('globalSearchResultsTitle');
    }
  } else if (selectedFramework && currentFrameworkLocale) {
    const selectedFrameworkName = t(currentFrameworkLocale.name);
    frameworkListTitle = t('frameworkListTitleNumbered', '2', selectedFrameworkName);
  } else if (selectedCategory) {
    frameworkListTitle = t('frameworkListTitleNumbered', '2', t(`${selectedCategory}FrameworksTitle` as TranslationKey));
  } else {
    frameworkListTitle = t('frameworkListTitleNumbered', '2', t('textFrameworksTitle'));
  }


  const inputPanelTitleText = selectedFramework && currentFrameworkLocale
    ? t('inputComponentsTitleNumberedWithFramework', '3', t(currentFrameworkLocale.name))
    : t('inputComponentsTitleNumbered', '3');


  const inputPanelTitleClasses = "text-lg sm:text-xl font-semibold text-teal-700 dark:text-teal-600";

  const aiFrameworkFinderTitleClasses = apiKeyAvailable
    ? "text-purple-400 dark:text-purple-300"
    : "text-slate-400 dark:text-slate-500"; // This class might become unused if panel is hidden

  const frameworkSuggestionInstructionText = apiKeyAvailable
    ? t('frameworkSuggestionInstruction')
    : t('frameworkSuggestionInstructionFree');

  const freeModeHeaderLinkColors = 'text-slate-300 hover:text-teal-400 focus:ring-teal-500';
  const premiumModeHeaderLinkColors = 'text-purple-300 hover:text-purple-400 focus:ring-purple-500'; 
  const freeModeLangToggleColors = 'border-teal-500 text-teal-300 hover:bg-teal-500 hover:text-white focus:ring-teal-400';
  const premiumModeLangToggleColors = 'border-purple-500 text-purple-300 hover:bg-purple-500 hover:text-white focus:ring-purple-400';

  const headerLinkClass = apiKeyAvailable ? premiumModeHeaderLinkColors : freeModeHeaderLinkColors;
  const langToggleClass = apiKeyAvailable ? premiumModeLangToggleColors : freeModeLangToggleColors;


  return (
    <React.Fragment>
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
          <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
            <div className="p-2 sm:p-3 rounded-lg flex items-center space-x-2 sm:space-x-3">
              <AppLogoIcon
                className="w-10 h-10 sm:w-12 sm:h-12"
                isAiFeatureActive={false}
                enableSwayAndGlow={false}
                isLoading={false}
              />
              <div className="cursor-pointer min-w-0" onClick={handleTitleClick} title={APP_VERSION}>
                <div className="flex items-center space-x-2">
                  <h1 className="text-2xl sm:text-3xl font-bold text-teal-400">
                    {t('appTitle')}
                  </h1>
                  {apiKeyAvailable ? (
                    <span className="plan-badge plan-badge-premium plan-badge-glow-premium plan-badge-sway">
                      <StarIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      <span>{t('premiumPlanBadge')}</span>
                    </span>
                  ) : (
                    <span className="plan-badge plan-badge-free plan-badge-glow-free plan-badge-sway">
                      <BadgeCheckIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      <span>{t('freePlanBadge')}</span>
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 dark:text-slate-300 subtitle-3d-effect break-words">
                  {t('appSubtitle')}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-3">
              {apiKeyAvailable && (
                <button
                  onClick={() => setShowSubscriptionInfoModal(true)}
                  className={`text-xs sm:text-sm font-medium transition-colors focus:outline-none focus:ring-1 rounded px-1.5 py-0.5 ${premiumModeHeaderLinkColors}`}
                  title={t('subscriptionInfoButtonText')}
                >
                  <span className="button-text-content">{t('headerLinkInfoPremium')}</span>
                </button>
              )}
              <button
                onClick={() => setShowDisclaimer(true)}
                className={`text-xs sm:text-sm font-medium transition-colors focus:outline-none focus:ring-1 rounded px-1.5 py-0.5 ${headerLinkClass}`}
                title={t('disclaimerTitle')}
              >
                <span className="button-text-content">{t('headerLinkAbout')}</span>
              </button>
              <button
                onClick={() => setShowHowToUse(true)}
                className={`text-xs sm:text-sm font-medium transition-colors focus:outline-none focus:ring-1 rounded px-1.5 py-0.5 ${headerLinkClass}`}
                title={t('howToUseAppTitleShort')}
              >
                <span className="button-text-content">{t('headerLinkHowToUse')}</span>
              </button>
              <button
                onClick={handleLanguageToggle}
                className={`px-2.5 py-1 text-xs sm:text-sm font-semibold rounded-md transition-colors duration-150 border focus:outline-none focus:ring-1 ${langToggleClass}`}
                aria-label={langToggleAriaLabel}
                title={langToggleTitle}
                disabled={isTranslating && apiKeyAvailable} 
              >
                <span className="button-text-content">{language === 'id' ? 'EN' : 'ID'}</span>
              </button>
            </div>
          </div>
        </header>

        <main className="container mx-auto p-3 sm:p-4 md:p-6 flex-grow flex flex-col md:flex-row gap-3 sm:gap-4 md:gap-6">
          <div className={`md:w-1/2 flex flex-col space-y-3 sm:space-y-4 md:space-y-6 ${!isInputPanelExpanded && 'md:max-h-[80px] overflow-hidden'}`}>
            <div className="bg-[var(--bg-secondary)] dark:bg-slate-800/70 rounded-xl shadow-lg border border-[var(--border-color)] dark:border-slate-700/50">
              <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-[var(--border-color)] dark:border-slate-700/50">
                <h2 className="text-lg sm:text-xl font-semibold text-teal-700 dark:text-teal-600">{t('selectCategoryTitleNumbered', '1')}</h2>
              </div>
              <div className="p-3 sm:p-4 space-y-3">
                <div className="grid grid-cols-3 gap-2">
                {['text', 'media', 'music'].map((cat) => {
                    const category = cat as 'text' | 'media' | 'music';
                    const IconComponent = category === 'text' ? PencilIcon : category === 'media' ? CameraIcon : MusicNoteIcon;
                    const isActive = selectedCategory === category && !frameworkSearchTerm.trim();
                    return (
                        <button
                        key={category}
                        onClick={() => handleCategorySelect(category)}
                        title={t(`${category}FrameworksCategoryTooltip`)}
                        className={clsx('py-2 px-2.5 text-xs sm:text-sm font-semibold rounded-md transition-all duration-200 ease-in-out flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-1.5 transform active:scale-95 shadow-md', {
                          'bg-teal-700 dark:bg-teal-700 text-white ring-2 ring-teal-500 dark:ring-teal-500 ring-offset-1 ring-offset-[var(--bg-secondary)] dark:ring-offset-slate-800': isActive,
                          'bg-slate-500 dark:bg-slate-600 hover:bg-teal-700/80 dark:hover:bg-teal-700/70 text-slate-100 hover:text-white focus:ring-1 focus:ring-teal-500 dark:focus:ring-teal-600': !isActive,
                        })}
                        aria-pressed={isActive}
                        >
                        <IconComponent className="w-4 h-4" />
                        <span className="button-text-content">{t(category === 'text' ? 'categoryLabelText' : category === 'media' ? 'categoryLabelImage' : 'categoryLabelMusic')}</span>
                        </button>
                    );
                    })}
                </div>
                 <input
                    type="text"
                    placeholder={t('searchFrameworksPlaceholder')}
                    value={frameworkSearchTerm}
                    onChange={(e) => {
                        setFrameworkSearchTerm(e.target.value);
                    }}
                    className="w-full p-2.5 bg-[var(--bg-secondary)] dark:bg-slate-700/50 border border-[var(--border-color)] dark:border-slate-600 rounded-md focus:ring-1 focus:ring-[var(--ring-color)] focus:border-[var(--ring-color)] outline-none text-sm text-[var(--text-primary)] dark:text-slate-100 placeholder-[var(--text-secondary)] dark:placeholder-slate-400/80 shadow-sm non-copyable-input-field"
                    aria-label={t('searchFrameworksPlaceholder')}
                />
              </div>
            </div>

            {/* AI Framework Finder & Researcher - Only shown if apiKeyAvailable */}
            {apiKeyAvailable && (
             <div className="bg-[var(--bg-secondary)] dark:bg-slate-800/70 rounded-xl shadow-lg border border-[var(--border-color)] dark:border-slate-700/50">
              <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-[var(--border-color)] dark:border-slate-700/50">
                <h2 className={`text-lg sm:text-xl font-semibold flex items-center ${aiFrameworkFinderTitleClasses}`}>
                  {t('frameworkSuggestionsTitle')}
                  <AiTextIcon isAiFeatureActive={apiKeyAvailable} enableSwayAndGlow={apiKeyAvailable && !isFetchingFrameworkSuggestions && !isFetchingWebResearch} isLoading={isFetchingFrameworkSuggestions || isFetchingWebResearch} className="ml-2" />
                </h2>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{frameworkSuggestionInstructionText}</p>
              </div>
              <div className="p-3 sm:p-4 space-y-2">
                <textarea
                  value={userGoalForFramework}
                  onChange={(e) => setUserGoalForFramework(e.target.value)}
                  placeholder={t('userGoalInputPlaceholder')}
                  rows={2}
                  className="w-full p-2.5 bg-[var(--bg-secondary)] dark:bg-slate-700/50 border border-[var(--border-color)] dark:border-slate-600 rounded-md focus:ring-1 focus:ring-[var(--ring-color)] focus:border-[var(--ring-color)] outline-none transition-all duration-150 text-sm text-[var(--text-primary)] dark:text-slate-100 placeholder-[var(--text-secondary)] dark:placeholder-slate-400/80 shadow-sm non-copyable-input-field resize-none"
                  aria-label={t('userGoalInputLabel')}
                />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <button
                          onClick={() => handleFetchFrameworkFunctionality('internal')}
                          className={`w-full py-2 px-2.5 text-xs font-semibold rounded-md transition-all duration-200 ease-in-out flex items-center justify-center space-x-1.5
                                      transform active:scale-95 shadow-md
                                      ${!userGoalForFramework.trim() || isFetchingFrameworkSuggestions || isFetchingWebResearch
                                          ? 'bg-slate-600 text-slate-400 cursor-not-allowed focus:ring-slate-500 opacity-70'
                                          : 'bg-purple-600 hover:bg-purple-500 text-white focus:ring-1 focus:ring-purple-400 focus:ring-offset-1 focus:ring-offset-[var(--bg-secondary)] dark:focus:ring-offset-slate-800'
                                      }`}
                          aria-label={t('getFrameworkSuggestionsButtonAria')}
                          disabled={!userGoalForFramework.trim() || isFetchingFrameworkSuggestions || isFetchingWebResearch}
                          title={!userGoalForFramework.trim() ? t('emptyPromptError') : t('getFrameworkSuggestionsButtonAria')}
                      >
                          <span className="button-text-content">{isFetchingFrameworkSuggestions ? t('frameworkSuggestionsLoading') : t('getFrameworkSuggestionsButton')}</span>
                          <AiTextIcon isAiFeatureActive={apiKeyAvailable} enableSwayAndGlow={apiKeyAvailable && !isFetchingFrameworkSuggestions} isLoading={isFetchingFrameworkSuggestions} className="ml-1" />
                      </button>
                      <button
                          onClick={() => handleFetchFrameworkFunctionality('web_research')}
                          className={`w-full py-2 px-2.5 text-xs font-semibold rounded-md transition-all duration-200 ease-in-out flex items-center justify-center space-x-1.5
                                      transform active:scale-95 shadow-md
                                      ${!userGoalForFramework.trim() || isFetchingFrameworkSuggestions || isFetchingWebResearch
                                          ? 'bg-slate-600 text-slate-400 cursor-not-allowed focus:ring-slate-500 opacity-70'
                                          : 'bg-sky-600 hover:bg-sky-500 text-white focus:ring-1 focus:ring-sky-400 focus:ring-offset-1 focus:ring-offset-[var(--bg-secondary)] dark:focus:ring-offset-slate-800'
                                      }`}
                          aria-label={t('researchWebButtonAria')}
                          disabled={!userGoalForFramework.trim() || isFetchingFrameworkSuggestions || isFetchingWebResearch}
                          title={!userGoalForFramework.trim() ? t('emptyPromptError') : t('researchWebButtonAria')}
                      >
                          <span className="button-text-content">{isFetchingWebResearch ? t('webResearchLoading') : t('researchWebButtonText')}</span>
                          <AiTextIcon isAiFeatureActive={apiKeyAvailable} enableSwayAndGlow={apiKeyAvailable && !isFetchingWebResearch} isLoading={isFetchingWebResearch} className="ml-1" />
                          <GlobeAltIcon className="w-3.5 h-3.5 ml-0.5" />
                      </button>
                  </div>
                {frameworkSuggestionError && <p className="text-xs text-rose-400 dark:text-rose-400" role="alert">{frameworkSuggestionError}</p>}
                {webResearchError && <p className="text-xs text-rose-400 dark:text-rose-400" role="alert">{webResearchError}</p>}
              </div>
            </div>
            )}
            {/* The informational block for Free mode regarding AI Framework Finder is now removed */}


            <div className="bg-[var(--bg-secondary)] dark:bg-slate-800/70 rounded-xl shadow-lg border border-[var(--border-color)] dark:border-slate-700/50 flex-grow flex flex-col">
              <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-[var(--border-color)] dark:border-slate-700/50">
                <h2 className={inputPanelTitleClasses}>
                  {frameworkListTitle}
                </h2>
              </div>
              <div className="p-3 sm:p-4 flex-grow min-h-[100px] overflow-y-auto">
                {displayedFrameworks.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-3">
                    {displayedFrameworks.map((fw) => {
                      const locale = language === 'id' ? fw.idLocale : fw.enLocale;
                      const isSuggested = apiKeyAvailable && suggestedFrameworkIds.includes(fw.id);
                      return (
                        <button
                          key={fw.id}
                          onClick={() => handleFrameworkSelect(fw)}
                          title={t(locale.shortDescription)}
                          className={`relative w-full h-16 sm:h-20 p-2 rounded-lg text-left transition-all duration-200 ease-in-out transform hover:scale-[1.03] active:scale-98 shadow-md focus:outline-none focus:ring-2 flex flex-col justify-center items-center
                                      ${selectedFramework?.id === fw.id
                                        ? 'bg-teal-700 dark:bg-teal-600 text-white ring-teal-500 dark:ring-teal-400 ring-offset-1 ring-offset-[var(--bg-secondary)] dark:ring-offset-slate-800'
                                        : isSuggested && apiKeyAvailable 
                                            ? 'bg-purple-600/80 hover:bg-purple-500/80 text-white ring-purple-500 dark:ring-purple-400 border border-purple-500'
                                            : 'bg-slate-600 dark:bg-slate-700 hover:bg-slate-500 dark:hover:bg-slate-600 text-slate-100 hover:text-white focus:ring-slate-500 dark:focus:ring-slate-400 border border-transparent'
                                      }`}
                          aria-pressed={selectedFramework?.id === fw.id}
                        >
                          {isSuggested && apiKeyAvailable && (
                            <span title={t('suggestedFrameworkTooltip')} className="absolute top-1 right-1 text-yellow-300">
                                <AiTextIcon isAiFeatureActive={true} enableSwayAndGlow={true} className="w-3 h-3" />
                            </span>
                          )}
                           <div className="flex flex-col justify-center items-center text-center">
                            <h4 className="text-xs sm:text-sm font-semibold break-words button-text-content">
                                {t(locale.shortName)}
                            </h4>
                            <p className="text-xs text-slate-300 dark:text-slate-400 mt-0.5 break-words button-text-content">
                                ({t(locale.name)})
                            </p>
                            </div>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-center text-slate-400 py-6">{t('noFrameworksFoundError')}</p>
                )}
                 {!selectedFramework && !frameworkSearchTerm.trim() && (
                    <p className="text-xs text-center text-slate-400 dark:text-slate-500 mt-3 italic">
                        {selectedCategory ? t('selectSpecificFrameworkInputSummary') : t('selectCategoryInstruction')}
                    </p>
                )}
              </div>
            </div>

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
                <h2 className={inputPanelTitleClasses}>
                  {inputPanelTitleText}
                </h2>
                {isInputPanelExpanded ? <ChevronUpIcon className="w-6 h-6 text-teal-700 dark:text-teal-600" /> : <ChevronDownIcon className="w-6 h-6 text-teal-700 dark:text-teal-600" />}
              </div>

              <div id="input-panel-content" className={`p-3 sm:p-4 space-y-3 ${isInputPanelExpanded ? 'collapsible-content open' : 'collapsible-content'}`}>
                {selectedFramework && currentFrameworkLocale ? (
                  <>
                    {currentFrameworkLocale.category === 'text' && (
                      <div className="mb-3 p-3 bg-slate-700/40 dark:bg-slate-800/30 rounded-md text-sm text-slate-200 dark:text-slate-300 shadow">
                        <h4 className="font-semibold text-teal-400 mb-1">{t(currentFrameworkLocale.name)} - {t('frameworkOverviewTitle')}</h4>
                        <p className="whitespace-pre-wrap">{t(currentFrameworkLocale.description)}</p>
                      </div>
                    )}
                    {currentFrameworkLocale.components && currentFrameworkLocale.components.length > 0 ? (
                      promptComponents.map((component) => {
                          const componentDetail = currentFrameworkLocale.components?.find(cd => cd.id === component.id);
                          return (
                            <InputField
                                key={`${selectedFramework.id}-${component.id}-${language}`}
                                id={component.id}
                                label={t(component.label)}
                                value={component.value}
                                onChange={handleInputChange}
                                placeholder={t(component.example) || t('inputFieldPlaceholder', t(component.label))}
                                isTextarea
                                rows={2}
                                description={t('inputFieldDescription', t(component.label), t(currentFrameworkLocale.shortName))}
                                predefinedOptions={(currentFrameworkLocale.predefinedOptions?.[component.id] || []).map(optKey => t(optKey))}
                                isVisible={isInputPanelExpanded}
                                fetchSuggestions={fetchSuggestionsForField}
                                frameworkName={t(currentFrameworkLocale.name)}
                                apiKeyAvailable={apiKeyAvailable}
                                exampleText={component.example ? t(component.example) : undefined}
                                tooltip={componentDetail?.tooltip ? t(componentDetail.tooltip) : undefined}
                            />
                          );
                        })
                    ) : (
                      <p className="text-sm text-slate-400 dark:text-slate-500 text-center py-4">{t('noInputComponents')}</p>
                    )}
                    
                    <InputField
                        id="userDefinedInteraction"
                        label={t('userDefinedInteractionLabel')}
                        value={userDefinedInteraction}
                        onChange={(e) => handleUserInteractionChange(e as React.ChangeEvent<HTMLTextAreaElement>)}
                        placeholder={t('userDefinedInteractionPlaceholder')}
                        isTextarea
                        rows={2}
                        isVisible={isInputPanelExpanded}
                    />
                    <button
                      onClick={clearInputs}
                      className="w-full py-2 px-3 text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white rounded-md transition-colors duration-150 flex items-center justify-center space-x-1.5 shadow-sm transform active:scale-95 focus:outline-none focus:ring-1 focus:ring-rose-400"
                      title={t('clearInputsButtonAria')}
                    >
                      <EraserIcon className="w-4 h-4" />
                      <span className="button-text-content">{t('clearInputsButton')}</span>
                    </button>
                  </>
                ) : (
                  <p className="text-sm text-center text-slate-400 dark:text-slate-500 py-4">
                    {t(selectedCategory ? (apiKeyAvailable ? 'selectSpecificFrameworkInputSummary' : 'selectSpecificFrameworkInputSummaryFree') : 'selectCategoryInstruction')}
                  </p>
                )}
              </div>
               {!isInputPanelExpanded && selectedFramework && (
                 <p className="px-4 sm:px-6 py-2.5 text-xs text-center text-slate-400 italic">
                    {t('clickToExpandInputPanel', selectedFramework ? t(currentFrameworkLocale?.name || '') : '')}
                </p>
              )}
            </div>
          </div>

          <div className={`md:w-1/2 flex flex-col space-y-3 sm:space-y-4 md:space-y-6 ${!isOutputPanelExpanded && 'md:max-h-[80px] overflow-hidden'}`}>
            <div className="bg-[var(--bg-secondary)] dark:bg-slate-800/70 rounded-xl shadow-lg border border-[var(--border-color)] dark:border-slate-700/50 flex-grow flex flex-col">
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
                userGoalForFramework={userGoalForFramework}
                onFetchWebResearch={() => handleFetchFrameworkFunctionality('web_research')}
                webResearchSummary={webResearchSummary}
                webResearchSources={webResearchSources}
                isFetchingWebResearch={isFetchingWebResearch}
                webResearchError={webResearchError}
                webResearchReceived={webResearchReceived}
                isFetchingFrameworkSuggestions={isFetchingFrameworkSuggestions}
              />
            </div>
            <PromptStashPanel
                savedPrompts={savedPrompts}
                onLoadPrompt={handleLoadPrompt}
                onDeletePrompt={handleDeletePrompt}
                onRenamePrompt={handleRenamePrompt}
                isLoading={isDBLoading}
                dbError={dbError}
                showToast={showToast} // showToast is now returned from the hook
                reloadPrompts={loadPromptsFromDB}
                appVersion={APP_VERSION}
            />
          </div>
        </main>

        <footer className="bg-slate-900/80 backdrop-blur-sm text-center py-3 sm:py-4 border-t border-slate-700/50">
          <p className="text-xs text-slate-400 dark:text-slate-500">
            {`PromptMatrix© ${APP_VERSION} - ${currentYear} | Built by Engineer not Coder`}
          </p>
          <div className="flex justify-center space-x-4 mt-1.5">
            <a href="mailto:si.sigitadi@gmail.com" title="Email" className="text-slate-400 hover:text-teal-400 transition-colors">
              <GmailIcon className="w-4 h-4" />
            </a>
            <a href="https://github.com/sisigitadi" target="_blank" rel="noopener noreferrer" title="GitHub" className="text-slate-400 hover:text-teal-400 transition-colors">
              <GithubIcon className="w-4 h-4" />
            </a>
            <a href="https://medium.com/@sigit-purnomo" target="_blank" rel="noopener noreferrer" title="Medium" className="text-slate-400 hover:text-teal-400 transition-colors">
              <MediumIcon className="w-4 h-4" />
            </a>
          </div>
          {sessionDevToggleActivated && (
            <div className="mt-2 flex items-center justify-center space-x-2">
              <span className="text-xs font-semibold text-yellow-400">DEV MODE:</span>
              <select
                  value={devToggleUiSelection}
                  onChange={(e) => setDevToggleUiSelection(e.target.value as 'free' | 'premium')}
                  className="text-xs p-1 bg-slate-800 text-yellow-300 border border-yellow-500 rounded-md focus:ring-1 focus:ring-yellow-400 outline-none"
                  aria-label="Developer API Key Status Toggle"
              >
                  <option value="free">{t('devTogglePremiumToFree')}</option>
                  <option value="premium">{t('devToggleFreeToActual')}</option>
              </select>
            </div>
          )}
        </footer>
      </div>

      <DisclaimerModal isOpen={showDisclaimer} onClose={handleDisclaimerAcknowledge} apiKeyAvailable={apiKeyAvailable} />
      <HowToUseModal isOpen={showHowToUse} onClose={handleHowToUseClose} isShownAutomatically={isHowToUseModalShownAutomatically} apiKeyAvailable={apiKeyAvailable} />
      <SubscriptionInfoModal isOpen={showSubscriptionInfoModal} onClose={() => setShowSubscriptionInfoModal(false)} apiKeyAvailable={apiKeyAvailable} />
      <TeaserPopupModal isOpen={showTeaserPopup} onClose={() => setShowTeaserPopup(false)} />
      <GlobalActivityIndicator activityMessage={globalActivityMessage} apiKeyAvailable={apiKeyAvailable} />
    </React.Fragment>
  );

};

export default App;
