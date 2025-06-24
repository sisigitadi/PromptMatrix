                          key={fw.id}
                          onClick={() => handleFrameworkSelect(fw)}
                          title={fwShortDescription || fw.description}
                          className={`relative w-full h-16 sm:h-20 p-2 rounded-lg text-left transition-all duration-200 ease-in-out transform hover:scale-[1.03] active:scale-98 shadow-md focus:outline-none focus:ring-2 flex flex-col justify-center items-center
                                      ${selectedFramework?.id === fw.id
                                        ? 'bg-teal-700 dark:bg-teal-600 text-white ring-teal-500 dark:ring-teal-400 ring-offset-1 ring-offset-[var(--bg-secondary)] dark:ring-offset-slate-800'
                          )}
                          className={`relative w-full h-16 sm:h-20 p-2 rounded-lg text-left transition-all duration-200 ease-in-out transform hover:scale-[1.03] active:scale-98 shadow-md focus:outline-none focus:ring-2 flex flex-col justify-center items-center ${
                            selectedFramework?.id === fw.id
                              ? 'bg-teal-700 dark:bg-teal-600 text-white ring-teal-500 dark:ring-teal-400 ring-offset-1 ring-offset-[var(--bg-secondary)] dark:ring-offset-slate-800'
                              : 'bg-slate-500 dark:bg-slate-600 hover:bg-teal-700/80 dark:hover:bg-teal-700/70 text-slate-100 hover:text-white focus:ring-1 focus:ring-teal-500 dark:focus:ring-teal-600'
                          }`}
                        >
                           <div className="flex flex-col justify-center items-center text-center">
                            <h4 className="text-xs sm:text-sm font-semibold break-words button-text-content">
Unchanged lines  const currentYear = new Date().getFullYear();

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

    const base = selectedFramework; // This is the English/default version

    // If language is Indonesian and translations exist, use them
    if (language === 'id' && base.translations?.id) {
      const idTrans = base.translations.id;
      return {
        name: idTrans.name || base.name,
        description: idTrans.description || base.description,
        // Components need to be mapped to resolve their names/placeholders
        components: base.components.map(comp => {
          const translatedComp = idTrans.components?.find(tComp => tComp.id === comp.id);
          return {
            id: comp.id,
            name: translatedComp?.name || comp.name,
            placeholder: translatedComp?.placeholder || comp.placeholder,
            tooltip: translatedComp?.tooltip || comp.tooltip, // Assuming tooltip is also a direct string
            options: translatedComp?.options || comp.options, // Assuming options are direct strings
          };
        }),
        category: base.category,
        // predefinedOptions are not directly in the `translations.id` object in the provided frameworks.ts
        // They are at the top level of the framework object.
        // So, we should use base.predefinedOptions directly.
        predefinedOptions: base.predefinedOptions,
        // genericToolLinks and toolLink are also at the base level
        genericToolLinks: base.genericToolLinks,
        toolLink: base.toolLink,
      };
    }
    // Fallback to English/default (which is the base object itself)
    return { ...selectedFramework };
    return {
      name: base.name,
      description: base.description,
      components: base.components,
      category: base.category,
      predefinedOptions: base.predefinedOptions,
      genericToolLinks: base.genericToolLinks,
      toolLink: base.toolLink,
    };
  }, [selectedFramework, language]);

  const langToggleAriaLabel = language === 'id' ? t('switchToEnglish') : t('switchToIndonesian');
Unchanged lines    frameworkListTitle = t('frameworkListTitleNumbered', { number: '2', frameworkName: selectedFrameworkName });
  } else if (selectedCategory) {
    frameworkListTitle = t('frameworkListTitleNumbered', { number: '2', frameworkName: t(`${selectedCategory}FrameworksTitle` as TranslationKey) });
  } else {
    frameworkListTitle = t('frameworkListTitleNumbered', { number: '2', frameworkName: t('textFrameworksTitle') });
  } else { // Default case when no category or framework is selected
    frameworkListTitle = t('frameworkListTitleNumbered', { number: '2', frameworkName: t('textFrameworksTitle') }); // Default to Text Frameworks title
  }

  const inputPanelTitleText = selectedFramework && currentFrameworkLocale
    ? t('inputComponentsTitleNumberedWithFramework', '3', currentFrameworkLocale.name)
    : t('inputComponentsTitleNumbered', '3');
    ? t('inputComponentsTitleNumberedWithFramework', { number: '3', frameworkName: currentFrameworkLocale.name })
    : t('inputComponentsTitleNumbered', { number: '3' });


              <div className="p-3 sm:p-4 flex-grow min-h-[100px] overflow-y-auto">
Unchanged lines                      <div className="mb-3 p-3 bg-slate-700/40 dark:bg-slate-800/30 rounded-md text-sm text-slate-200 dark:text-slate-300 shadow">
                        <h4 className="font-semibold text-teal-400 mb-1">{currentFrameworkLocale.name} - {t('frameworkOverviewTitle')}</h4>
                        <p className="whitespace-pre-wrap">{currentFrameworkLocale.description}</p>
                      </div>
                    )}
                    {currentFrameworkLocale.components && currentFrameworkLocale.components.length > 0 ? (
                      promptComponents.map((component) => {
                          const componentDetail = selectedFramework?.components.find(cd => cd.id === component.id);
                      currentFrameworkLocale.components.map((componentDetail) => { // Iterate over the translated component details
                          const componentValue = promptComponents.find(pc => pc.id === componentDetail.id)?.value || ''; // Find the current value from promptComponents state
                          return (
                            <InputField
                                key={`${selectedFramework.id}-${component.id}-${language}`}
                                id={component.id}
                                label={component.name}
                                value={component.value}
                                key={`${selectedFramework.id}-${componentDetail.id}-${language}`}
                                id={componentDetail.id}
                                label={componentDetail.name} // Already translated string
                                value={componentValue}
                                onChange={handleInputChange}
                                placeholder={component.placeholder || t('inputFieldPlaceholder', component.name)}
                                placeholder={componentDetail.placeholder || t('inputFieldPlaceholder', { label: componentDetail.name })} // Already translated string
                                isTextarea
                                rows={2}
                                description={t('inputFieldDescription', component.name, selectedFramework.name)}
                                description={t('inputFieldDescription', { label: componentDetail.name, frameworkName: currentFrameworkLocale.name })} // Already translated strings
                                predefinedOptions={componentDetail?.options}
                                isVisible={isInputPanelExpanded}
                                fetchSuggestions={fetchSuggestionsForField}
                                frameworkName={currentFrameworkLocale.name}
                                apiKeyAvailable={apiKeyAvailable}
                                exampleText={component.placeholder}
                                tooltip={componentDetail?.tooltip}
                                exampleText={componentDetail.placeholder} // Already translated string
                                tooltip={componentDetail.tooltip} // Already translated string
                            />
                          );
                        })
Unchanged lines              </div>
               {!isInputPanelExpanded && selectedFramework && (
                 <p className="px-4 sm:px-6 py-2.5 text-xs text-center text-slate-400 italic">
                    {t('clickToExpandInputPanel', selectedFramework ? currentFrameworkLocale?.name : '')}
                    {t('clickToExpandInputPanel', { frameworkName: selectedFramework ? currentFrameworkLocale?.name : '' })}
                </p>
              )}
            </div>

