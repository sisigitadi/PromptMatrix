
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Language, Translations, TranslationKey } from '../types';
import { translations } from '../translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey, ...args: any[]) => string;
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
    const translationSet = translations[language];
    const translation = translationSet[key];
    if (typeof translation === 'function') {
      return (translation as (...args: any[]) => string)(...args);
    }
    return translation || key.toString(); // Fallback to key if translation not found
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