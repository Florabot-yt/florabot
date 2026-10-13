import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useMode } from "../contexts/ModeContext";

export default function Home() {
  const { t } = useTranslation();
  const { mode, setMode } = useMode();
  const features = mode === "farmer"
    ? [
        { icon: "🔬", title: t("feature1Title"), desc: t("feature1Desc") },
        { icon: "🌦️", title: t("feature2Title"), desc: t("feature2Desc") }
      ]
    : [
        { icon: "🔬", title: t("feature1Title"), desc: t("feature1Desc") },
        { icon: "🌦️", title: t("feature2Title"), desc: t("feature2Desc") },
        { icon: "🎓", title: t("feature3Title"), desc: t("feature3Desc") }
      ];
  return (
    <div className="fade-in">
      <section className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, var(--primary-light), white)" }}>
        <div className="max-w-7xl mx-auto px-6 py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-4 text-white" style={{ backgroundColor: "var(--primary)" }}>
              {mode === "farmer" ? "🌾 " + t("welcomeFarmer") : "🎓 " + t("welcomeStudent")}
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4" style={{ color: "var(--primary-dark)" }}>
              {mode === "farmer" ? t("heroFarmer") : t("heroStudent")}
            </h1>
            <p className="text-lg text-gray-700 mb-6 max-w-lg">{t("subtitle")}</p>
            <div className="flex flex-wrap gap-3">
              <Link to="/detect" className="btn-primary px-6 py-3 rounded-xl font-semibold shadow-md">🔍 {t("startDetect")}</Link>
              {mode === "student" && (
                <Link to="/learn" className="px-6 py-3 rounded-xl font-semibold bg-white border-2 hover:bg-gray-50 transition" style={{ borderColor: "var(--primary)", color: "var(--primary)" }}>
                  🎓 {t("startLearn")}
                </Link>
              )}
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="text-[160px] md:text-[220px] leading-none select-none" style={{ filter: "drop-shadow(0 20px 30px rgba(0,0,0,.15))" }}>
              {mode === "farmer" ? "🌿" : "📚"}
            </div>
          </div>
        </div>
      </section>
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-10" style={{ color: "var(--primary-dark)" }}>{t("features")}</h2>
        <div className={"grid gap-6 " + (mode === "student" ? "md:grid-cols-3" : "md:grid-cols-2")}>
          {features.map((f, i) => (
            <div key={i} className="card p-6 text-center hover:-translate-y-1">
              <div className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center text-3xl mb-4" style={{ backgroundColor: "var(--primary-light)" }}>{f.icon}</div>
              <h3 className="text-lg font-bold mb-2" style={{ color: "var(--primary-dark)" }}>{f.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-12" style={{ color: "var(--primary-dark)" }}>{t("howItWorks")}</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: "📷", t: t("step1"), d: t("step1Desc") },
              { icon: "🤖", t: t("step2"), d: t("step2Desc") },
              { icon: "✅", t: t("step3"), d: t("step3Desc") }
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center text-3xl font-bold text-white mb-4 shadow-lg" style={{ backgroundColor: "var(--primary)" }}>{s.icon}</div>
                <h3 className="text-xl font-bold mb-2" style={{ color: "var(--primary-dark)" }}>{s.t}</h3>
                <p className="text-gray-600">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="rounded-3xl p-8 md:p-12 text-center text-white shadow-xl" style={{ background: "linear-gradient(135deg, var(--primary), var(--primary-dark))" }}>
          <h3 className="text-2xl md:text-3xl font-extrabold mb-3">{mode === "farmer" ? "🎓 " + t("modeStudent") : "🌾 " + t("modeFarmer")}</h3>
          <p className="opacity-90 mb-6 max-w-xl mx-auto">
            {mode === "farmer" ? "Ingin belajar lebih dalam tentang kesehatan tanaman?" : "Ingin fokus ke diagnosis & perawatan praktis?"}
          </p>
          <button onClick={() => setMode(mode === "farmer" ? "student" : "farmer")} className="px-6 py-3 rounded-xl font-bold bg-white transition hover:scale-105" style={{ color: "var(--primary)" }}>
            {mode === "farmer" ? "🎓 " + t("modeStudent") : "🌾 " + t("modeFarmer")}
          </button>
        </div>
      </section>
    </div>
  );
}
