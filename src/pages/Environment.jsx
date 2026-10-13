import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLang } from "../contexts/LangContext";
import { fetchWeather, fetchSoil } from "../utils/api";
import Loader from "../components/Loader";

export default function Environment() {
  const { t } = useTranslation();
  const { lang } = useLang();
  const [weather, setWeather] = useState(null);
  const [soil, setSoil] = useState(null);
  const [coords, setCoords] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getLocation = (useDefault = false) => {
    setLoading(true); setError(null);
    const fallback = () => setCoords({ lat: -6.2, lon: 106.8 });
    if (useDefault || !navigator.geolocation) return fallback();
    navigator.geolocation.getCurrentPosition(
      (pos) => setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      () => { setError(t("errorLocation")); fallback(); }
    );
  };

  useEffect(() => { getLocation(); }, []);
  useEffect(() => {
    if (!coords) return;
    setLoading(true);
    Promise.all([fetchWeather(coords.lat, coords.lon), fetchSoil(coords.lat, coords.lon)])
      .then(([w, s]) => { setWeather(w); setSoil(s); })
      .catch((e) => { console.error(e); setError("Failed to load data."); })
      .finally(() => setLoading(false));
  }, [coords]);

  const isId = lang === "id";

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 fade-in">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-2" style={{ color: "var(--primary-dark)" }}>🌤️ {t("environment")}</h1>
          {coords && <p className="text-gray-600">📍 {coords.lat.toFixed(3)}, {coords.lon.toFixed(3)}</p>}
        </div>
        <button onClick={() => getLocation()} className="btn-primary px-5 py-2.5 rounded-xl font-semibold">📍 {t("useMyLocation")}</button>
      </div>
      {error && (<div className="mb-4 p-3 rounded-xl bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm">⚠️ {error}</div>)}
      {loading ? <Loader text={t("loading")} /> : (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="card p-6">
            <h2 className="text-xl font-bold mb-4" style={{ color: "var(--primary-dark)" }}>🌤️ {t("weather")}</h2>
            {weather ? (
              <>
                <div className="flex items-center gap-4 mb-6">
                  <div className="text-6xl">{weather.emoji}</div>
                  <div>
                    <div className="text-4xl font-extrabold" style={{ color: "var(--primary)" }}>{weather.temp}C</div>
                    <div className="text-gray-600">{weather.description}</div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <Metric icon="💧" label={t("humidity")} value={weather.humidity + "%"} />
                  <Metric icon="🌬️" label={t("wind")} value={weather.wind + " km/h"} />
                  <Metric icon="🌧️" label={t("rainfall")} value={weather.rainfall + " mm"} />
                </div>
              </>
            ) : <p className="text-gray-400">{t("loading")}</p>}
          </div>
          <div className="card p-6">
            <h2 className="text-xl font-bold mb-4" style={{ color: "var(--primary-dark)" }}>🌱 {t("soil")}</h2>
            {soil ? (
              <>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <Metric icon="🌡️" label={t("soilTemp")} value={soil.temp + "C"} big />
                  <Metric icon="💦" label={t("soilMoisture")} value={soil.moisture + "%"} big />
                </div>
                <div className="p-3 rounded-xl bg-gray-50 mb-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold text-gray-600">pH Tanah</span>
                    <span className="text-lg font-bold" style={{ color: "var(--primary)" }}>{soil.ph} <span className="text-xs text-gray-500">({soil.phLabel})</span></span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-2 rounded-lg bg-green-50"><p className="text-xs text-gray-500 font-bold">N</p><p className="font-bold text-green-700">{soil.npk.n}</p></div>
                  <div className="p-2 rounded-lg bg-orange-50"><p className="text-xs text-gray-500 font-bold">P</p><p className="font-bold text-orange-700">{soil.npk.p}</p></div>
                  <div className="p-2 rounded-lg bg-purple-50"><p className="text-xs text-gray-500 font-bold">K</p><p className="font-bold text-purple-700">{soil.npk.k}</p></div>
                </div>
              </>
            ) : <p className="text-gray-400">{t("loading")}</p>}
          </div>
        </div>
      )}
      <div className="mt-8 card p-6">
        <h3 className="font-bold text-lg mb-3" style={{ color: "var(--primary-dark)" }}>💡 {isId ? "Tips Berdasarkan Kondisi Saat Ini" : "Tips Based on Current Conditions"}</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          {weather && weather.humidity > 80 && (<li>💧 {isId ? "Kelembapan tinggi - waspada penyakit jamur." : "High humidity - watch for fungal diseases."}</li>)}
          {weather && weather.temp > 32 && (<li>🌡️ {isId ? "Suhu panas - siram pagi & sore." : "Hot temperature - water morning & evening."}</li>)}
          {soil && parseFloat(soil.ph) < 5.5 && (<li>🧪 {isId ? "pH asam - tambahkan dolomit." : "Acidic pH - add dolomite lime."}</li>)}
          {soil && parseFloat(soil.ph) > 7.5 && (<li>🧪 {isId ? "pH basa - tambahkan bahan organik." : "Alkaline pH - add organic matter."}</li>)}
          {soil && parseFloat(soil.moisture) < 20 && (<li>🚿 {isId ? "Tanah kering - tambah penyiraman." : "Dry soil - increase watering."}</li>)}
          {soil && parseFloat(soil.moisture) > 45 && (<li>🌊 {isId ? "Tanah terlalu basah - perbaiki drainase." : "Soil too wet - improve drainage."}</li>)}
        </ul>
      </div>
    </div>
  );
}

function Metric({ icon, label, value, big }) {
  return (
    <div className="p-3 rounded-xl bg-gray-50 text-center">
      <div className={(big ? "text-3xl" : "text-2xl") + " mb-1"}>{icon}</div>
      <div className="text-xs text-gray-500 font-medium">{label}</div>
      <div className={"font-bold " + (big ? "text-lg" : "")} style={{ color: "var(--primary)" }}>{value}</div>
    </div>
  );
}
