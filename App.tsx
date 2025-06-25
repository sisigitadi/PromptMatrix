import React, { useMemo, useState } from 'react'; // Tambahkan import yang relevan
import { InputField } from './src/components/InputField'; // Import komponen baru
// Import lainnya yang diperlukan (t, frameworks, dll.)

const App: React.FC = () => { // Bungkus semua logika dalam komponen App
  // Asumsikan semua state dan fungsi (useState, handleInputChange, dll.) didefinisikan di sini

  const filteredFrameworks = useMemo(() => {
    if (!frameworkSearchTerm.trim()) {
      return frameworks;
    }
    const searchTermLower = frameworkSearchTerm.toLowerCase();
    return frameworks.filter(fw => {
      const name = language === 'id' && fw.translations?.id?.name ? fw.translations.id.name : fw.name;
      const description = language === 'id' && fw.translations?.id?.description ? fw.translations.id.description : fw.description;
      return name.toLowerCase().includes(searchTermLower) || description.toLowerCase().includes(searchTermLower);
    });
  }, [frameworks, frameworkSearchTerm, language]);

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
  }, [filteredFrameworks, frameworks, frameworkSearchTerm, selectedCategory, language]);

  const currentFrameworkLocale = useMemo(() => {
    if (!selectedFramework) return null;

    if (language === 'id' && selectedFramework.translations?.id) {
      const idTrans = selectedFramework.translations.id;
      return {
        ...selectedFramework, // Start with the base framework
        name: idTrans.name || selectedFramework.name,
        description: idTrans.description || selectedFramework.description,
        components: idTrans.components || selectedFramework.components,
        predefinedOptions: idTrans.predefinedOptions || selectedFramework.predefinedOptions,
      };
    }
    // Fallback to English/default
    return selectedFramework;
  }, [selectedFramework, language]);

  const langToggleAriaLabel = language === 'id' ? t('switchToEnglish') : t('switchToIndonesian');
  let frameworkListTitle: string;
  if (frameworkSearchTerm.trim()) {
    frameworkListTitle = t('frameworkListTitleNumbered', { number: '2', frameworkName: t('searchResultsTitle') });
  } else if (selectedFramework && currentFrameworkLocale) {
    const selectedFrameworkName = currentFrameworkLocale.name;
    frameworkListTitle = t('frameworkListTitleNumbered', { number: '2', frameworkName: selectedFrameworkName }); // Pass object for t()
  } else if (selectedCategory) {
    frameworkListTitle = t('frameworkListTitleNumbered', { number: '2', frameworkName: t(`${selectedCategory}FrameworksTitle` as TranslationKey) }); // Pass object for t()
  } else { // Default case when no category or framework is selected
    frameworkListTitle = t('frameworkListTitleNumbered', { number: '2', frameworkName: t('textFrameworksTitle') }); // Pass object for t()
  }

  return (
    // Asumsikan ini adalah bagian dari struktur layout utama Anda
    <div className="prompt-studio-panel">
      {/* ... UI lainnya seperti header, pemilihan framework, dll. ... */}

      {/* Bagian yang dirender dari snippet Anda */}
      <div className="input-fields-container p-4">
        {currentFrameworkLocale && currentFrameworkLocale.components && currentFrameworkLocale.components.length > 0 ? (
          currentFrameworkLocale.components.map((componentDetail) => {
            const componentValue = promptComponents.find(pc => pc.id === componentDetail.id)?.value || '';
            return (
              <InputField
                  key={`${selectedFramework.id}-${componentDetail.id}-${language}`}
                  id={componentDetail.id}
                  label={componentDetail.name}
                  value={componentValue}
                  onChange={handleInputChange}
                  placeholder={componentDetail.placeholder || t('inputFieldPlaceholder', { label: componentDetail.name })}
                  isTextarea
                  rows={2}
                  description={t('inputFieldDescription', { label: componentDetail.name, frameworkName: currentFrameworkLocale.name })}
                  isVisible={isInputPanelExpanded}
                  fetchSuggestions={fetchSuggestionsForField}
                  frameworkName={currentFrameworkLocale.name}
                  apiKeyAvailable={apiKeyAvailable}
                  tooltip={componentDetail.tooltip}
              />
            );
          })
        ) : null}
      </div>
      {!isInputPanelExpanded && selectedFramework && (
        <p className="px-4 sm:px-6 py-2.5 text-xs text-center text-slate-400 italic">
          {t('clickToExpandInputPanel', { frameworkName: selectedFramework ? currentFrameworkLocale?.name : '' })}
        </p>
      )}
    </div>
  );
};

export default App;
