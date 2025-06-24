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
Unchanged lines  const currentYear = new Date().getFullYear();

  const filteredFrameworks = useMemo(() => {
    if (!frameworkSearchTerm.trim()) return frameworks;
    // If no search term, return all frameworks
    if (!frameworkSearchTerm.trim()) {
      return frameworks;
    }
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
Unchanged lines          };
        }),
        category: base.category,
        // predefinedOptions are not directly in the `translations.id` object in the provided frameworks.ts
        // They are at the top level of the framework object.
        // So, we should use base.predefinedOptions directly.
        // predefinedOptions are at the base level of the framework object, not translated
        predefinedOptions: base.predefinedOptions,
        // genericToolLinks and toolLink are also at the base level
        // genericToolLinks and toolLink are also at the base level, not translated
        genericToolLinks: base.genericToolLinks,
        toolLink: base.toolLink,
      };
Unchanged lines    // Fallback to English/default (which is the base object itself)
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
  let frameworkListTitle: string;
  if (frameworkSearchTerm.trim()) {
Unchanged lines    }
  } else if (selectedFramework && currentFrameworkLocale) {
    const selectedFrameworkName = currentFrameworkLocale.name;
    frameworkListTitle = t('frameworkListTitleNumbered', { number: '2', frameworkName: selectedFrameworkName });
    frameworkListTitle = t('frameworkListTitleNumbered', { number: '2', frameworkName: selectedFrameworkName }); // Pass object for t()
  } else if (selectedCategory) {
    frameworkListTitle = t('frameworkListTitleNumbered', { number: '2', frameworkName: t(`${selectedCategory}FrameworksTitle` as TranslationKey) });
    frameworkListTitle = t('frameworkListTitleNumbered', { number: '2', frameworkName: t(`${selectedCategory}FrameworksTitle` as TranslationKey) }); // Pass object for t()
  } else { // Default case when no category or framework is selected
    frameworkListTitle = t('frameworkListTitleNumbered', { number: '2', frameworkName: t('textFrameworksTitle') }); // Default to Text Frameworks title
    frameworkListTitle = t('frameworkListTitleNumbered', { number: '2', frameworkName: t('textFrameworksTitle') }); // Pass object for t()
  }

  const inputPanelTitleText = selectedFramework && currentFrameworkLocale
Unchanged lines                        <p className="whitespace-pre-wrap">{currentFrameworkLocale.description}</p>
                      </div>
                    )}
                    {currentFrameworkLocale.components && currentFrameworkLocale.components.length > 0 ? (
                      currentFrameworkLocale.components.map((componentDetail) => { // Iterate over the translated component details
                          const componentValue = promptComponents.find(pc => pc.id === componentDetail.id)?.value || ''; // Find the current value from promptComponents state
                          return (
                            <InputField
                                key={`${selectedFramework.id}-${componentDetail.id}-${language}`}
                                id={componentDetail.id}
                                label={componentDetail.name} // Already translated string
                                value={componentValue}
                                onChange={handleInputChange}
                                placeholder={componentDetail.placeholder || t('inputFieldPlaceholder', { label: componentDetail.name })} // Already translated string
                                placeholder={componentDetail.placeholder || t('inputFieldPlaceholder', { label: componentDetail.name })} // Pass object for t()
                                isTextarea
                                rows={2}
                                description={t('inputFieldDescription', { label: componentDetail.name, frameworkName: currentFrameworkLocale.name })} // Already translated strings
                                description={t('inputFieldDescription', { label: componentDetail.name, frameworkName: currentFrameworkLocale.name })} // Pass object for t()
                                predefinedOptions={componentDetail?.options}
                                isVisible={isInputPanelExpanded}
                                fetchSuggestions={fetchSuggestionsForField}
                                frameworkName={currentFrameworkLocale.name}
                                apiKeyAvailable={apiKeyAvailable}
                                exampleText={componentDetail.placeholder} // Already translated string
                                tooltip={componentDetail.tooltip} // Already translated string
                            />
                          );
                        })
Unchanged lines              </div>
               {!isInputPanelExpanded && selectedFramework && (
                 <p className="px-4 sm:px-6 py-2.5 text-xs text-center text-slate-400 italic">
                    {t('clickToExpandInputPanel', { frameworkName: selectedFramework ? currentFrameworkLocale?.name : '' })}
                    {t('clickToExpandInputPanel', { frameworkName: selectedFramework ? currentFrameworkLocale?.name : '' })} // Pass object for t()
                </p>
              )}
            </div>

