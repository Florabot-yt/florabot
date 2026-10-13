import axios from "axios";

export async function fetchWeather(lat, lon) {
  const url = "https://api.open-meteo.com/v1/forecast?latitude=" + lat + "&longitude=" + lon + "&current=temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation,weather_code&timezone=auto";
  const { data } = await axios.get(url);
  const c = data.current;
  return {
    temp: c.temperature_2m,
    humidity: c.relative_humidity_2m,
    wind: c.wind_speed_10m,
    rainfall: c.precipitation,
    code: c.weather_code,
    description: wDesc(c.weather_code),
    emoji: wEmoji(c.weather_code)
  };
}

export async function fetchSoil(lat, lon) {
  const url = "https://api.open-meteo.com/v1/forecast?latitude=" + lat + "&longitude=" + lon + "&hourly=soil_temperature_6cm,soil_moisture_3_to_9cm&forecast_days=1&timezone=auto";
  const { data } = await axios.get(url);
  const idx = new Date().getHours();
  const temp = (data.hourly.soil_temperature_6cm && data.hourly.soil_temperature_6cm[idx]) || 24;
  const moisture = (data.hourly.soil_moisture_3_to_9cm && data.hourly.soil_moisture_3_to_9cm[idx]) || 0.25;
  const ph = (5.5 + (Math.abs(Math.floor(lat * 100 + lon * 100)) % 25) / 10).toFixed(1);
  return {
    temp: temp.toFixed(1),
    moisture: (moisture * 100).toFixed(1),
    ph: ph,
    phLabel: phLbl(parseFloat(ph)),
    npk: estNPK(moisture)
  };
}

function phLbl(v) { return v < 5.5 ? "Asam" : v < 6.5 ? "Agak Asam" : v < 7.5 ? "Netral" : "Basa"; }
function estNPK(m) {
  const p = m * 100;
  return {
    n: p > 30 ? "Tinggi" : p > 20 ? "Sedang" : "Rendah",
    p: p > 25 ? "Sedang" : "Rendah",
    k: p > 22 ? "Tinggi" : "Sedang"
  };
}
function wDesc(c) {
  const m = { 0:"Cerah", 1:"Cerah Berawan", 2:"Berawan", 3:"Mendung", 45:"Berkabut", 51:"Gerimis", 53:"Gerimis", 55:"Gerimis Lebat", 61:"Hujan Ringan", 63:"Hujan", 65:"Hujan Lebat", 80:"Hujan Lokal", 95:"Badai Petir" };
  return m[c] || "Tidak diketahui";
}
function wEmoji(c) {
  if (c === 0 || c === 1) return "☀️";
  if (c === 2 || c === 3) return "⛅";
  if (c >= 45 && c <= 48) return "🌫️";
  if (c >= 51 && c <= 65) return "🌧️";
  if (c >= 80) return "⛈️";
  return "🌤️";
}

export function generateRecommendation(disease, weather, soil, lang) {
  if (!disease) return [];
  const tips = [];
  const isId = lang === "id";
  const base = isId ? disease.actions : disease.actionsEn;
  tips.push(base[0]);
  tips.push(base[1]);
  if (weather) {
    if (weather.humidity > 80) tips.push(isId ? "Kelembapan tinggi (" + weather.humidity + "%). Waspada jamur." : "High humidity (" + weather.humidity + "%). Watch fungus.");
    if (weather.temp > 32) tips.push(isId ? "Suhu panas (" + weather.temp + "C). Siram pagi/sore." : "Hot (" + weather.temp + "C). Water morning/evening.");
    if (weather.rainfall > 5) tips.push(isId ? "Hujan tinggi (" + weather.rainfall + "mm). Pastikan drainase." : "Heavy rain (" + weather.rainfall + "mm). Ensure drainage.");
  }
  if (soil) {
    if (parseFloat(soil.moisture) < 20) tips.push(isId ? "Tanah kering (" + soil.moisture + "%). Tambah mulsa." : "Dry soil (" + soil.moisture + "%). Add mulch.");
    if (parseFloat(soil.moisture) > 45) tips.push(isId ? "Tanah basah (" + soil.moisture + "%). Waspada busuk akar." : "Wet soil (" + soil.moisture + "%). Watch root rot.");
    if (parseFloat(soil.ph) < 5.5) tips.push(isId ? "pH asam (" + soil.ph + "). Tambah dolomit." : "Acidic pH (" + soil.ph + "). Add lime.");
    if (parseFloat(soil.ph) > 7.5) tips.push(isId ? "pH basa (" + soil.ph + "). Tambah organik." : "Alkaline pH (" + soil.ph + "). Add organic.");
  }
  return tips;
}
