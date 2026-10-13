import { useTranslation } from "react-i18next";
export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="mt-16 border-t border-gray-100 bg-white">
      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
        <div className="flex items-center gap-2">
          <span className="text-xl">🌿</span>
          <span className="font-bold" style={{ color: "var(--primary)" }}>FloraBot</span>
          <span>© {new Date().getFullYear()}</span>
        </div>
        <p>{t("madeWith")} <span className="text-red-500">❤</span> {t("forFarmers")}</p>
      </div>
    </footer>
  );
}
