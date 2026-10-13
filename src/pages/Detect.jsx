import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLang } from "../contexts/LangContext";
import { analyzeImage } from "../utils/mockAI";
import { fetchWeather, fetchSoil, generateRecommendation } from "../utils/api";
import { plants } from "../data/plants";
import Loader from "../components/Loader";

export default function Detect() {
  const { t } = useTranslation();
  const { lang } = useLang();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [weather, setWeather] = useState(null);
  const [soil, setSoil] = useState(null);
  const [selectedPlant, setSelectedPlant] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const isId = lang === "id";

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      async (pos) => {
        try {
          const [w, s] = await Promise.all([fetchWeather(pos.coords.latitude, pos.coords.longitude), fetchSoil(pos.coords.latitude, pos.coords.longitude)]);
          setWeather(w); setSoil(s);
        } catch (e) { console.error(e); }
      },
      async () => {
        try {
          const [w, s] = await Promise.all([fetchWeather(-6.2, 106.8), fetchSoil(-6.2, 106.8)]);
          setWeather(w); setSoil(s);
        } catch (e) { console.error(e); }
      }
    );
  }, []);

  const handleFile = (f) => {
    if (!f || !f.type.startsWith("image/")) return;
    setFile(f); setPreview(URL.createObjectURL(f)); setResult(null);
  };
  const handleDrop = (e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); };
  const handleAnalyze = async () => {
    if (!file) return alert(t("errorImage"));
    setLoading(true);
    try { const res = await analyzeImage(file); setResult(res); }
    catch (e) { console.error(e); }
    finally { setLoading(false); }
  };
  const reset = () => { setFile(null); setPreview(null); setResult(null); setSelectedPlant(""); };

  const disease = result?.disease;
  const diseaseName = disease ? (isId ? disease.name : disease.nameEn) : "";
  const diseasePlant = disease ? (isId ? disease.plant : disease.plantEn) : "";
  const actions = disease ? (isId ? disease.actions : disease.actionsEn) : [];
  const prevention = disease ? (isId ? disease.prevention : disease.preventionEn) : [];
  const symptoms = disease ? (isId ? disease.symptoms : disease.symptomsEn) : [];
  const recommendations = disease ? generateRecommendation(disease, weather, soil, lang) : [];

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 fade-in">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-2" style={{ color: "var(--primary-dark)" }}>🔍 {t("detect")}</h1>
        <p className="text-gray-600">{t("subtitle")}</p>
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card p-6">
          {!preview ? (
            <label onDragOver={(e) => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)} onDrop={handleDrop}
              className={"block border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition " + (dragOver ? "scale-[1.02]" : "")}
              style={{ borderColor: "var(--primary)", backgroundColor: dragOver ? "var(--primary-light)" : "white" }}>
              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files[0])} />
              <div className="text-6xl mb-4">📷</div>
              <p className="font-bold text-lg mb-1" style={{ color: "var(--primary)" }}>{t("uploadPhoto")}</p>
              <p className="text-sm text-gray-500">{t("uploadHint")}</p>
              <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400">JPG · PNG · WEBP</div>
            </label>
          ) : (
            <div>
              <div className="relative rounded-2xl overflow-hidden bg-gray-100">
                <img src={preview} alt="preview" className="w-full max-h-96 object-contain" />
                {loading && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="spinner mx-auto" style={{ borderColor: "rgba(255,255,255,.3)", borderTopColor: "white" }} />
                      <p className="mt-3 font-medium">{t("analyzing")}</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="mt-4">
                <label className="text-sm font-semibold text-gray-700 mb-1 block">{t("selectPlant")}</label>
                <select value={selectedPlant} onChange={(e) => setSelectedPlant(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none">
                  <option value="">{t("autoDetect")}</option>
                  {plants.map((p) => (<option key={p.id} value={p.id}>{p.emoji} {isId ? p.name : p.nameEn}</option>))}
                </select>
              </div>
              <div className="mt-4 flex gap-2">
                {!result && (<button onClick={handleAnalyze} disabled={loading} className="btn-primary flex-1 py-3 rounded-xl font-bold disabled:opacity-50">{loading ? t("analyzing") : "🔬 " + t("analyze")}</button>)}
                <button onClick={reset} className={"py-3 px-4 rounded-xl font-bold border-2 transition " + (result ? "flex-1" : "")} style={{ borderColor: "var(--primary)", color: "var(--primary)" }}>
                  {result ? "🔄 " + t("analyzeAnother") : "✕"}
                </button>
              </div>
            </div>
          )}
          {weather && (
            <div className="mt-5 p-3 rounded-xl border border-gray-100 bg-gray-50 flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{weather.emoji}</span>
                <div>
                  <p className="font-semibold text-gray-700">{weather.description}</p>
                  <p className="text-xs text-gray-500">{weather.temp}C · {weather.humidity}% · {weather.rainfall}mm</p>
                </div>
              </div>
              {soil && (<div className="text-xs text-gray-500 text-right"><p>🌱 {soil.temp}C</p><p>pH {soil.ph} ({soil.phLabel})</p></div>)}
            </div>
          )}
        </div>
        <div className="card p-6">
          {!result && !loading && (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="text-6xl mb-4 opacity-30">🔬</div>
              <p className="text-gray-400 font-medium">{isId ? "Hasil diagnosis akan muncul di sini" : "Diagnosis result will appear here"}</p>
            </div>
          )}
          {loading && <Loader text={t("analyzing")} />}
          {result && !loading && (
            <div className="fade-in">
              <div className="p-5 rounded-2xl mb-5" style={{ backgroundColor: "var(--primary-light)" }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500">{t("result")}</span>
                  <span className="text-xs font-bold px-2 py-1 rounded-full text-white"
                    style={{ backgroundColor: disease?.severity === "Tinggi" ? "#dc2626" : disease?.severity === "Sedang" ? "#f59e0b" : disease?.severity === "Rendah" ? "#eab308" : "#16a34a" }}>
                    {disease?.severity}
                  </span>
                </div>
                <h2 className="text-2xl font-extrabold mb-1" style={{ color: "var(--primary-dark)" }}>{diseaseName}</h2>
                {diseasePlant && diseasePlant !== "-" && (<p className="text-sm text-gray-600 mb-3">🌱 {t("plantAffected")}: <b>{diseasePlant}</b> · {disease.pathogen}</p>)}
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs font-semibold text-gray-600 mb-1">
                    <span>{t("confidence")}</span>
                    <span>{(result.confidence * 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full h-2 bg-white rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: (result.confidence * 100) + "%", backgroundColor: "var(--primary)" }} />
                  </div>
                </div>
              </div>
              {symptoms.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-bold text-gray-800 mb-2">🔎 {t("symptoms")}</h3>
                  <ul className="space-y-1 text-sm text-gray-600 list-disc list-inside">{symptoms.map((s, i) => <li key={i}>{s}</li>)}</ul>
                </div>
              )}
              <div className="mb-4">
                <h3 className="font-bold text-gray-800 mb-2">⚡ {t("action")}</h3>
                <ul className="space-y-2">
                  {actions.map((a, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm bg-gray-50 p-3 rounded-lg">
                      <span className="font-bold" style={{ color: "var(--primary)" }}>{i + 1}.</span>
                      <span className="text-gray-700">{a}</span>
                    </li>
                  ))}
                </ul>
              </div>
              {recommendations.length > 0 && (
                <div className="mb-4 p-4 rounded-2xl border-2" style={{ borderColor: "var(--primary-light)" }}>
                  <h3 className="font-bold mb-1" style={{ color: "var(--primary-dark)" }}>🌍 {t("recommendation")}</h3>
                  <p className="text-xs text-gray-500 mb-3">{t("recommendationDesc")}</p>
                  <ul className="space-y-2">
                    {recommendations.map((r, i) => (
                      <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                        <span style={{ color: "var(--primary)" }}>•</span><span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {prevention.length > 0 && (
                <div>
                  <h3 className="font-bold text-gray-800 mb-2">🛡️ {t("prevention")}</h3>
                  <ul className="space-y-1 text-sm text-gray-600 list-disc list-inside">{prevention.map((p, i) => <li key={i}>{p}</li>)}</ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
