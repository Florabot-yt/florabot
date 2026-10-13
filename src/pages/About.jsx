import { useLang } from "../contexts/LangContext";

export default function About() {
  const { lang } = useLang();
  const isId = lang === "id";
  const c = isId ? {
    title: "Tentang FloraBot",
    p1: "FloraBot adalah asisten digital petani Indonesia yang menggabungkan kecerdasan buatan dengan data cuaca dan tanah real-time untuk mendeteksi dini penyakit serta hama tanaman.",
    p2: "Hanya dengan satu foto, FloraBot dapat mengidentifikasi gangguan tanaman secara presisi dan memberi tindakan pertolongan pertama yang spesifik untuk lahan Anda.",
    mission: "Misi Kami", missionText: "Mencegah gagal panen dengan teknologi yang mudah diakses semua petani Indonesia - gratis, cepat, dan akurat.",
    vision: "Visi Kami", visionText: "Menjadi platform pertanian cerdas #1 di Indonesia yang mendorong generasi muda terlibat dalam pertanian modern."
  } : {
    title: "About FloraBot",
    p1: "FloraBot is a digital assistant for Indonesian farmers, combining AI with real-time weather and soil data to detect plant diseases and pests early.",
    p2: "With a single photo, FloraBot precisely identifies plant issues and provides first-aid actions specific to your land.",
    mission: "Our Mission", missionText: "Prevent harvest failure with technology accessible to all Indonesian farmers - free, fast, and accurate.",
    vision: "Our Vision", visionText: "Become the #1 smart farming platform that inspires the younger generation to engage in modern agriculture."
  };
  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-12 fade-in">
      <div className="text-center mb-10">
        <div className="text-6xl mb-4">🌿</div>
        <h1 className="text-4xl font-extrabold mb-2" style={{ color: "var(--primary-dark)" }}>{c.title}</h1>
      </div>
      <div className="card p-6 md:p-8 mb-6">
        <p className="text-gray-700 text-lg leading-relaxed mb-4">{c.p1}</p>
        <p className="text-gray-700 leading-relaxed">{c.p2}</p>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="card p-6">
          <div className="text-4xl mb-3">🎯</div>
          <h2 className="text-xl font-bold mb-2" style={{ color: "var(--primary-dark)" }}>{c.mission}</h2>
          <p className="text-gray-600">{c.missionText}</p>
        </div>
        <div className="card p-6">
          <div className="text-4xl mb-3">🚀</div>
          <h2 className="text-xl font-bold mb-2" style={{ color: "var(--primary-dark)" }}>{c.vision}</h2>
          <p className="text-gray-600">{c.visionText}</p>
        </div>
      </div>
      <div className="mt-8 text-center text-sm text-gray-400">Powered by AI · Open-Meteo · React · Made in Indonesia</div>
    </div>
  );
}
