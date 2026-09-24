'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { LocalizedString } from '@/types';

type Language = 'ms' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  tText: (field?: string | LocalizedString) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'ms',
  setLanguage: () => {},
  tText: (field) => {
    if (!field) return '';
    if (typeof field === 'string') return field;
    return field.ms || '';
  },
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('ms');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('math_explorer_lang') as Language;
      if (saved === 'ms' || saved === 'en') {
        setLanguageState(saved);
      }
    } catch {
      // empty
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('math_explorer_lang', lang);
    } catch {
      // empty
    }
  };

  const tText = (field?: string | LocalizedString): string => {
    if (!field) return '';
    if (typeof field === 'string') return field;
    return field[language] || field.ms || '';
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, tText }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

export function getText(field?: string | LocalizedString, lang: Language = 'ms'): string {
  if (!field) return '';
  if (typeof field === 'string') return field;
  return field[lang] || field.ms || '';
}
