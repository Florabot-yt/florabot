import { createContext, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
const LangContext = createContext();
export function LangProvider({ children }) {
  const { i18n } = useTranslation();
  const [lang, setLangState] = useState(i18n.language || "id");
  const setLang = (l) => {
    setLangState(l);
    i18n.changeLanguage(l);
    localStorage.setItem("florabot_lang", l);
    document.documentElement.lang = l;
  };
  useEffect(() => { document.documentElement.lang = lang; }, [lang]);
  return <LangContext.Provider value={{ lang, setLang }}>{children}</LangContext.Provider>;
}
export const useLang = () => useContext(LangContext);
