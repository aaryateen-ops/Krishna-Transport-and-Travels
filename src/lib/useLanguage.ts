import { useState, useEffect } from "react";

export function useLanguage() {
  const [lang, setLang] = useState<"hi" | "en">("hi");

  useEffect(() => {
    const saved = localStorage.getItem("krishna_lang");
    if (saved === "en" || saved === "hi") {
      setLang(saved);
    }
  }, []);

  const changeLang = (newLang: "hi" | "en") => {
    setLang(newLang);
    localStorage.setItem("krishna_lang", newLang);
  };

  return [lang, changeLang] as const;
}
