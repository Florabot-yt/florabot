import { createContext, useContext, useEffect, useState } from "react";
const ModeContext = createContext();
export function ModeProvider({ children }) {
  const [mode, setMode] = useState(localStorage.getItem("florabot_mode") || "farmer");
  useEffect(() => {
    localStorage.setItem("florabot_mode", mode);
    const r = document.documentElement;
    if (mode === "farmer") {
      r.style.setProperty("--primary", "#16a34a");
      r.style.setProperty("--primary-light", "#dcfce7");
      r.style.setProperty("--primary-dark", "#14532d");
    } else {
      r.style.setProperty("--primary", "#dc2626");
      r.style.setProperty("--primary-light", "#fee2e2");
      r.style.setProperty("--primary-dark", "#7f1d1d");
    }
  }, [mode]);
  return <ModeContext.Provider value={{ mode, setMode }}>{children}</ModeContext.Provider>;
}
export const useMode = () => useContext(ModeContext);
