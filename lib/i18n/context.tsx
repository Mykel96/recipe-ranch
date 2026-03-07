"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { translations, type Language } from "./translations";
import { getCookie, setCookie } from "../cookies";

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("de");

  useEffect(() => {
    const fromCookie = getCookie("rr_lang") as Language | null;
    if (fromCookie && (fromCookie === "en" || fromCookie === "de")) {
      setLanguageState(fromCookie);
      return;
    }

    const stored = (typeof window !== "undefined"
      ? (localStorage.getItem("language") as Language | null)
      : null);

    if (stored && (stored === "en" || stored === "de")) {
      setLanguageState(stored);
    }
  }, []);

  function setLanguage(lang: Language) {
    setLanguageState(lang);

    if (typeof window !== "undefined") {
      localStorage.setItem("language", lang);
    }

    setCookie("rr_lang", lang, {
      maxAge: 60 * 60 * 24 * 365, // 1 year
      sameSite: "Lax",
      path: "/",
    });
  }

  const t = useCallback(
    (key: string): string => translations[language][key] ?? key,
    [language]
  );

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useTranslation must be used within LanguageProvider");
  return ctx;
}
