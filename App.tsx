import React, { useMemo, useState, useCallback } from 'react';
import { InputField } from '@/components/InputField'; // Import komponen baru
// Asumsikan file-file ini ada untuk menyediakan data dan tipe
// import { frameworks as allFrameworks } from './frameworks'; 
// import { useTranslation } from 'react-i18next';
// import { Framework, PromptComponent, TranslationKey } from './types';

// --- Placeholder Data & Tipe (Hapus jika Anda sudah punya) ---
type Framework = any;
type PromptComponent = { id: string; value: string };
type TranslationKey = string;
const allFrameworks: Framework[] = []; // Ganti dengan data framework Anda
const useTranslation = () => ({ t: (key: string, _?: any) => key, i18n: { language: 'en' } });
// --- Akhir Placeholder ---

const App: React.FC = () => { // Bungkus semua logika dalam komponen App
  // --- START: Definisi State & Fungsi yang Hilang ---
  const { t, i18n } = useTranslation();
  const language = i18n.language;

  // Safeguard: Pastikan allFrameworks adalah array untuk mencegah crash jika impor gagal.
  const [frameworks] = useState<Framework[]>(Array.isArray(allFrameworks) ? allFrameworks : []);
  const [frameworkSearchTerm, setFrameworkSearchTerm] = useState('');
  // Inisialisasi dengan framework pertama yang valid, atau null jika daftar kosong.
  const [selectedFramework, setSelectedFramework] = useState<Framework | null>(() => (frameworks.length > 0 ? frameworks[0] : null));
  const [selectedCategory, setSelectedCategory] = useState<string | null>('text');
  const [promptComponents, setPromptComponents] = useState<PromptComponent[]>([]);
  const [isInputPanelExpanded, setIsInputPanelExpanded] = useState(true);
  const [apiKeyAvailable, setApiKeyAvailable] = useState(true); // Ganti sesuai logika Anda

  const handleInputChange = useCallback((id: string, value: string) => {
    setPromptComponents(prev => {
      const existing = prev.find(p => p.id === id);
      if (existing) {
        return prev.map(p => (p.id === id ? { ...p, value } : p));
      }
      return [...prev, { id, value }];
    });
  }, []);

  const fetchSuggestionsForField = useCallback((fieldId: string) => {
    console.log(`Fetching suggestions for ${fieldId}...`);
    // Logika untuk mengambil saran AI
  }, []);
  // --- END: Definisi State & Fungsi yang Hilang ---

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
                  // Safeguard: Gunakan optional chaining (?) untuk mencegah error jika selectedFramework null.
                  key={`${selectedFramework?.id}-${componentDetail.id}-${language}`}
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
