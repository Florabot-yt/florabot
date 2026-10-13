import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useMode } from "../contexts/ModeContext";
import { useLang } from "../contexts/LangContext";
import { useState } from "react";
export default function Navbar() {
  const { t } = useTranslation();
  const { mode, setMode } = useMode();
  const { lang, setLang } = useLang();
  const loc = useLocation();
  const [open, setOpen] = useState(false);
  const items = [
    { path: "/", label: t("home"), icon: "🏠" },
    { path: "/detect", label: t("detect"), icon: "🔍" },
    { path: "/environment", label: t("environment"), icon: "🌤️" }
  ];
  if (mode === "student") items.push({ path: "/learn", label: t("learn"), icon: "🎓" });
  items.push({ path: "/about", label: t("about"), icon: "ℹ️" });
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">🌿</span>
            <span className="font-extrabold text-xl" style={{ color: "var(--primary)" }}>FloraBot</span>
          </Link>
          <div className="hidden lg:flex items-center gap-1">
            {items.map((it) => (
              <Link key={it.path} to={it.path}
                className={"px-3 py-2 rounded-lg text-sm font-medium " + (loc.pathname === it.path ? "text-white" : "text-gray-600 hover:bg-gray-100")}
                style={loc.pathname === it.path ? { backgroundColor: "var(--primary)" } : {}}>
                {it.icon} {it.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex rounded-full border-2 overflow-hidden text-xs font-bold" style={{ borderColor: "var(--primary)" }}>
              <button onClick={() => setMode("farmer")} className={"px-3 py-1.5 " + (mode === "farmer" ? "bg-green-600 text-white" : "bg-white text-gray-600")}>🌾 Petani</button>
              <button onClick={() => setMode("student")} className={"px-3 py-1.5 " + (mode === "student" ? "bg-red-600 text-white" : "bg-white text-gray-600")}>🎓 Pelajar</button>
            </div>
            <button onClick={() => setLang(lang === "id" ? "en" : "id")} className="px-3 py-1.5 rounded-full border border-gray-200 text-xs font-bold hover:bg-gray-50">
              {lang === "id" ? "ID" : "EN"}
            </button>
            <button onClick={() => setOpen(!open)} className="lg:hidden p-2 rounded-lg hover:bg-gray-100">☰</button>
          </div>
        </div>
        {open && (
          <div className="lg:hidden border-t border-gray-100 py-2 fade-in">
            {items.map((it) => (
              <Link key={it.path} to={it.path} onClick={() => setOpen(false)}
                className={"block px-4 py-3 rounded-lg text-sm font-medium " + (loc.pathname === it.path ? "text-white" : "text-gray-700 hover:bg-gray-100")}
                style={loc.pathname === it.path ? { backgroundColor: "var(--primary)" } : {}}>
                {it.icon} {it.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
