"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Language, LANGUAGES, t, TranslationKey } from "@/lib/i18n";

interface LanguageContextValue {
  lang: Language;
  setLang: (lang: Language) => void;
  T: (key: TranslationKey) => string;
  languages: typeof LANGUAGES;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: "en",
  setLang: () => {},
  T: (key) => key,
  languages: LANGUAGES,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>("en");

  useEffect(() => {
    const saved = localStorage.getItem("ff_lang") as Language | null;
    if (saved && LANGUAGES.some((l) => l.code === saved)) {
      setLangState(saved);
    }
  }, []);

  const setLang = (l: Language) => {
    setLangState(l);
    localStorage.setItem("ff_lang", l);
  };

  const T = (key: TranslationKey) => t(lang, key);

  return (
    <LanguageContext.Provider value={{ lang, setLang, T, languages: LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  return useContext(LanguageContext);
}
