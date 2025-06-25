
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Language } from '../types'; // Hanya butuh tipe Language di sini

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const getInitialLanguage = (): Language => {
  const storedLang = localStorage.getItem('appLanguage') as Language | null;
  if (storedLang && (storedLang === 'id' || storedLang === 'en')) {
    return storedLang;
  }
  const browserLang = navigator.language.toLowerCase().split('-')[0];
  return browserLang === 'id' ? 'id' : 'en';
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage);

  useEffect(() => {
    document.documentElement.lang = language;
    localStorage.setItem('appLanguage', language);
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: TranslationKey, ...args: any[]): string => {
    const translationSet = allTranslations[language]; // Changed from 'translations' to 'allTranslations'
    const translationValue = translationSet[key]; // Value can be string, string[], or Function

    if (typeof translationValue === 'function') {
      // Assuming TranslationFunction always returns string as per its definition in types.ts
      return (translationValue as TranslationFunction)(...args);
    }
    
    if (typeof translationValue === 'string') {
      return translationValue;
    }

    // If translationValue is an array (e.g., quickPromptTipsList) or undefined (key not found).
    // This indicates a misuse of t() for array-type keys, or the key simply doesn't exist.
    // In either case, fallback to returning the key itself as a string.
    // A warning could be logged here in development mode if desired for keys resolving to arrays.
    // e.g., if (Array.isArray(translationValue) && process.env.NODE_ENV === 'development') {
    //   console.warn(`Translation key '${key}' resolved to an array and was called with t(). Returning key as string.`);
    // }
    
    return key.toString(); // Fallback for undefined or array types
  };
  

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};