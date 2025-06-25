import React, { useMemo, useState, useCallback } from 'react';
import { InputField } from '@/components/InputField'; // Import komponen baru
// Impor ini sekarang diasumsikan berfungsi. ErrorBoundary akan menangkap jika ada masalah.
import { frameworks as allFrameworks } from './frameworks';
import { useTranslation } from 'react-i18next';
import { Framework, PromptComponent, TranslationKey } from './types';

const App: React.FC = () => {
  const { t, i18n } = useTranslation();
  const language = i18n.language;

  const [frameworks] = useState<Framework[]>(Array.isArray(allFrameworks) ? allFrameworks : []);
  const [frameworkSearchTerm, setFrameworkSearchTerm] = useState('');
  const [selectedFramework, setSelectedFramework] = useState<Framework | null>(null); // Mulai dengan null
  const [selectedCategory, setSelectedCategory] = useState<string>('text');
  const [promptComponents, setPromptComponents] = useState<PromptComponent[]>([]);
  const [isInputPanelExpanded, setIsInputPanelExpanded] = useState(true);
  const [apiKeyAvailable, setApiKeyAvailable] = useState(true);

  const handleInputChange = useCallback((id: string, value: string) => {
    setPromptComponents(prev => {
      const existing = prev.find(p => p.id === id);
      return existing
        ? prev.map(p => (p.id === id ? { ...p, value } : p))
        : [...prev, { id, value }];
    });
  }, []);

  const fetchSuggestionsForField = useCallback((fieldId: string) => {
    console.log(`Fetching suggestions for ${fieldId}...`);
  }, []);

  const handleFrameworkSelect = (framework: Framework) => {
    setSelectedFramework(framework);
    setPromptComponents([]); // Reset input saat framework baru dipilih
  };

  const filteredFrameworks = useMemo(() => {
    if (!frameworkSearchTerm.trim()) return frameworks;
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
        ...selectedFramework,
        name: idTrans.name || selectedFramework.name,
        description: idTrans.description || selectedFramework.description,
        components: idTrans.components || selectedFramework.components,
        predefinedOptions: idTrans.predefinedOptions || selectedFramework.predefinedOptions,
      };
    }
    return selectedFramework;
  }, [selectedFramework, language]);

  return (
    <div className="flex flex-col h-screen bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
      {/* Placeholder untuk UI pemilihan framework yang sebenarnya */}
      <header className="p-4 bg-white dark:bg-slate-800 shadow-md border-b border-slate-200 dark:border-slate-700">
        <h1 className="text-2xl font-bold text-teal-600 dark:text-teal-400">PromptMatrix</h1>
        <p className="text-sm text-slate-500">Select a framework below to begin.</p>
        <div className="flex gap-2 mt-4 flex-wrap">
          {displayedFrameworks.slice(0, 10).map(fw => (
            <button
              key={fw.id}
              onClick={() => handleFrameworkSelect(fw)}
              className={`p-2 text-sm rounded transition ${selectedFramework?.id === fw.id ? 'bg-teal-600 text-white' : 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600'}`}
            >
              {fw.name}
            </button>
          ))}
        </div>
      </header>

      <main className="flex-grow p-4 md:p-6 overflow-y-auto">
        {selectedFramework && currentFrameworkLocale ? (
          // Tampilan saat framework sudah dipilih
          <div className="prompt-studio-panel max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-2">{currentFrameworkLocale.name}</h2>
            <p className="text-base text-slate-600 dark:text-slate-400 mb-6">{currentFrameworkLocale.description}</p>

            <div className="input-fields-container bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg">
              {currentFrameworkLocale.components?.map((componentDetail: any) => {
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
              })}
            </div>
          </div>
        ) : (
          // Tampilan saat belum ada framework yang dipilih (layar sambutan)
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-slate-500 dark:text-slate-400">
              <h2 className="text-3xl font-bold">Welcome to PromptMatrix</h2>
              <p className="mt-2 text-lg">Please select a framework from the header to start building your prompt.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
