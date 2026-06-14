import { useState, useEffect, useCallback } from "react";
import type { Lang } from "@/lib/translations";

export function useLanguage() {
  const [lang, setLangState] = useState<Lang>(() => {
    const stored = localStorage.getItem("efl_lang");
    return (stored as Lang) || "en";
  });

  useEffect(() => {
    localStorage.setItem("efl_lang", lang);
  }, [lang]);

  const setLang = useCallback((newLang: Lang) => {
    setLangState(newLang);
  }, []);

  return { lang, setLang };
}
