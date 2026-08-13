import React, { createContext, useContext, useState, useEffect } from 'react';
import { SupportedLanguageCode } from '../types';
import { SUPPORTED_LANGUAGES, UI_TRANSLATIONS } from '../data/languages';

interface LanguageContextType {
  currentLanguage: SupportedLanguageCode;
  setLanguage: (code: SupportedLanguageCode) => void;
  t: (key: string) => string;
  supportedLanguages: typeof SUPPORTED_LANGUAGES;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguageState] = useState<SupportedLanguageCode>(() => {
    const saved = (localStorage.getItem('parwah_lang') || localStorage.getItem('sahay_lang')) as SupportedLanguageCode;
    return saved && UI_TRANSLATIONS[saved] ? saved : 'en';
  });

  const setLanguage = (code: SupportedLanguageCode) => {
    setCurrentLanguageState(code);
    localStorage.setItem('parwah_lang', code);
  };

  const t = (key: string): string => {
    const langDict = UI_TRANSLATIONS[currentLanguage] || UI_TRANSLATIONS.en;
    if (langDict[key]) return langDict[key];
    if (UI_TRANSLATIONS.en[key]) return UI_TRANSLATIONS.en[key];
    return key;
  };

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        setLanguage,
        t,
        supportedLanguages: SUPPORTED_LANGUAGES,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
};
