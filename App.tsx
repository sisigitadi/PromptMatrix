  const currentYear = new Date().getFullYear();

  const filteredFrameworks = useMemo(() => {
    if (!frameworkSearchTerm.trim()) return frameworks;
    const searchTermLower = frameworkSearchTerm.toLowerCase();
    return frameworks.filter(fw => {
      const name = language === 'id' && fw.translations?.id?.name ? fw.translations.id.name : fw.name;
      const description = language === 'id' && fw.translations?.id?.description ? fw.translations.id.description : fw.description;
      return name.toLowerCase().includes(searchTermLower) || description.toLowerCase().includes(searchTermLower);
    });
  }, [frameworkSearchTerm, language]);

  const displayedFrameworks = useMemo(() => {
    const sourceFrameworks = frameworkSearchTerm.trim() ? filteredFrameworks : frameworks;
    
    const categoryFiltered = selectedCategory
      ? sourceFrameworks.filter(fw => fw.category === selectedCategory)
      : sourceFrameworks.filter(fw => fw.category === 'text');

    return categoryFiltered.sort((a, b) => {
      const aName = language === 'id' && a.translations?.id?.name ? a.translations.id.name : a.name;
      const bName = language === 'id' && b.translations?.id?.name ? b.translations.id.name : b.name;
      return aName.localeCompare(bName);
    });
  }, [filteredFrameworks, frameworkSearchTerm, forceGlobalSearchDisplay, selectedCategory, language]);

  const currentFrameworkLocale = useMemo(() => {
    if (!selectedFramework) return null;
    if (language === 'id' && selectedFramework.translations?.id) {
      return {
        name: selectedFramework.translations.id.name || selectedFramework.name,
        description: selectedFramework.translations.id.description || selectedFramework.description,
        components: selectedFramework.translations.id.components || selectedFramework.components,
        category: selectedFramework.category,
        predefinedOptions: selectedFramework.translations?.id?.predefinedOptions || selectedFramework.predefinedOptions,
      };
    }
    // Fallback to English/default
    return { ...selectedFramework };
  }, [selectedFramework, language]);



  const langToggleAriaLabel = language === 'id' ? t('switchToEnglish') : t('switchToIndonesian');
        frameworkListTitle = t('globalSearchResultsTitle');
    }
  } else if (selectedFramework && currentFrameworkLocale) {
    const selectedFrameworkName = currentFrameworkLocale.name;
    frameworkListTitle = t('frameworkListTitleNumbered', '2', selectedFrameworkName);
  } else if (selectedCategory) {
    frameworkListTitle = t('frameworkListTitleNumbered', '2', t(`${selectedCategory}FrameworksTitle` as TranslationKey));
  } else {
    frameworkListTitle = t('frameworkListTitleNumbered', '2', t('textFrameworksTitle'));
  }

  const inputPanelTitleText = selectedFramework && currentFrameworkLocale
    ? t('inputComponentsTitleNumberedWithFramework', '3', currentFrameworkLocale.name)
    : t('inputComponentsTitleNumbered', '3');


              <div className="p-3 sm:p-4 flex-grow min-h-[100px] overflow-y-auto">
                {displayedFrameworks.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-3">
                    {displayedFrameworks.map((fw) => {                      
                      const isSuggested = apiKeyAvailable && suggestedFrameworkIds.includes(fw.id);
                      const fwName = language === 'id' && fw.translations?.id?.name ? fw.translations.id.name : fw.name;
                      const fwShortDescription = language === 'id' && fw.translations?.id?.shortDescription ? fw.translations.id.shortDescription : fw.shortDescription;
                      return (
                        <button
                          key={fw.id}
                          onClick={() => handleFrameworkSelect(fw)}
                          title={fwShortDescription || fw.description}
                          className={`relative w-full h-16 sm:h-20 p-2 rounded-lg text-left transition-all duration-200 ease-in-out transform hover:scale-[1.03] active:scale-98 shadow-md focus:outline-none focus:ring-2 flex flex-col justify-center items-center
                                      ${selectedFramework?.id === fw.id
                                        ? 'bg-teal-700 dark:bg-teal-600 text-white ring-teal-500 dark:ring-teal-400 ring-offset-1 ring-offset-[var(--bg-secondary)] dark:ring-offset-slate-800'
                          )}
                           <div className="flex flex-col justify-center items-center text-center">
                            <h4 className="text-xs sm:text-sm font-semibold break-words button-text-content">
                                {fwName}
                            </h4>
                            <p className="text-xs text-slate-300 dark:text-slate-400 mt-0.5 break-words button-text-content">
                                ({fw.name})
                            </p>
                            </div>
                        </button>
                  <>
                    {currentFrameworkLocale.category === 'text' && (
                      <div className="mb-3 p-3 bg-slate-700/40 dark:bg-slate-800/30 rounded-md text-sm text-slate-200 dark:text-slate-300 shadow">
                        <h4 className="font-semibold text-teal-400 mb-1">{currentFrameworkLocale.name} - {t('frameworkOverviewTitle')}</h4>
                        <p className="whitespace-pre-wrap">{currentFrameworkLocale.description}</p>
                      </div>
                    )}
                    {currentFrameworkLocale.components && currentFrameworkLocale.components.length > 0 ? (
                      promptComponents.map((component) => {
                          const componentDetail = selectedFramework?.components.find(cd => cd.id === component.id);
                          return (
                            <InputField
                                key={`${selectedFramework.id}-${component.id}-${language}`}
                                id={component.id}
                                label={component.name}
                                value={component.value}
                                onChange={handleInputChange}
                                placeholder={component.placeholder || t('inputFieldPlaceholder', component.name)}
                                isTextarea
                                rows={2}
                                description={t('inputFieldDescription', component.name, selectedFramework.name)}
                                predefinedOptions={componentDetail?.options}
                                isVisible={isInputPanelExpanded}
                                fetchSuggestions={fetchSuggestionsForField}
                                frameworkName={currentFrameworkLocale.name}
                                apiKeyAvailable={apiKeyAvailable}
                                exampleText={component.placeholder}
                                tooltip={componentDetail?.tooltip}
                            />
                          );
                        })
              </div>
               {!isInputPanelExpanded && selectedFramework && (
                 <p className="px-4 sm:px-6 py-2.5 text-xs text-center text-slate-400 italic">
                    {t('clickToExpandInputPanel', selectedFramework ? currentFrameworkLocale?.name : '')}
                </p>
              )}
            </div>

