"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Locale, t as translate, TranslationKey, getStatusLabel as getStatus } from "./i18n";

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey) => string;
  getStatusLabel: (status: string) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    const saved = localStorage.getItem("npa_admin_locale") as Locale | null;
    if (saved === "en" || saved === "pt") {
      setLocaleState(saved);
    }
  }, []);

  function setLocale(newLocale: Locale) {
    setLocaleState(newLocale);
    localStorage.setItem("npa_admin_locale", newLocale);
  }

  function tFn(key: TranslationKey) {
    return translate(key, locale);
  }

  function statusFn(status: string) {
    return getStatus(status, locale);
  }

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t: tFn, getStatusLabel: statusFn }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return ctx;
}
