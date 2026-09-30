"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Language = "th" | "en";

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  tr: (thai: string, english: string) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("th");

  useEffect(() => {
    const saved = window.localStorage.getItem("rada-language");
    if (saved === "en") {
      window.setTimeout(() => setLanguageState("en"), 0);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const value = useMemo<LanguageContextValue>(() => ({
    language,
    setLanguage(next) {
      setLanguageState(next);
      window.localStorage.setItem("rada-language", next);
    },
    tr: (thai, english) => language === "th" ? thai : english,
  }), [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used inside LanguageProvider");
  return context;
}
