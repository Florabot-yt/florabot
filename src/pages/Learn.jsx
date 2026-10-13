import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Navigate } from "react-router-dom";
import { useMode } from "../contexts/ModeContext";
import { useLang } from "../contexts/LangContext";
import { quizBank } from "../data/quiz";
import { plants } from "../data/plants";
import { diseases } from "../data/diseases";

export default function Learn() {
  const { t } = useTranslation();
  const { mode } = useMode();
  const { lang } = useLang();
  const [tab, setTab] = useState("quiz");

  if (mode !== "student") return <Navigate to="/" replace />;

  const tabs = [
    { id: "quiz", label: "📝 " + (lang === "id" ? "Kuis Interaktif" : "Interactive Quiz") },
    { id: "plants", label: "🌱 " + t("plantDB") },
    { id: "diseases", label: "🦠 " + t("diseasesLibrary") }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 fade-in">
      <div className="mb-6">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-2" style={{ color: "var(--primary-dark)" }}>🎓 {t("learn")}</h1>
        <p className="text-gray-600">{t("feature3Desc")}</p>
      </div>
      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map((tb) => (
          <button key={tb.id} onClick={() => setTab(tb.id)}
            className={"px-4 py-2 rounded-full font-semibold text-sm transition " + (tab === tb.id ? "text-white shadow-md" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50")}
            style={tab === tb.id ? { backgroundColor: "var(--primary)" } : {}}>
            {tb.label}
          </button>
        ))}
      </div>
      {tab === "quiz" && <QuizPanel lang={lang} />}
      {tab === "plants" && <PlantsPanel lang={lang} />}
      {tab === "diseases" && <DiseasesPanel lang={lang} />}
    </div>
  );
}

function QuizPanel({ lang }) {
  const { t } = useTranslation();
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [shuffled, setShuffled] = useState(() => shuffle(quizBank));
  const q = shuffled[idx];
  const isCorrect = selected === q?.answer;
  const options = q?.options[lang] || q?.options.id;

  const handlePick = (i) => {
    if (selected !== null) return;
    setSelected(i);
    if (i === q.answer) setScore((s) => s + 1);
  };
  const next = () => {
    if (idx + 1 < shuffled.length) { setIdx(idx + 1); setSelected(null); }
    else { setFinished(true); }
  };
  const restart = () => {
    setIdx(0); setSelected(null); setScore(0); setFinished(false); setShuffled(shuffle(quizBank));
  };

  if (finished) {
    const pct = Math.round((score / shuffled.length) * 100);
    const message = pct >= 80 ? (lang === "id" ? "🌟 Luar biasa!" : "🌟 Excellent!") : pct >= 60 ? (lang === "id" ? "👍 Bagus!" : "👍 Good!") : (lang === "id" ? "💪 Terus belajar!" : "💪 Keep learning!");
    return (
      <div className="card p-8 text-center max-w-lg mx-auto fade-in">
        <div className="text-6xl mb-4">🏆</div>
        <h2 className="text-2xl font-extrabold mb-2" style={{ color: "var(--primary-dark)" }}>{t("yourScore")}</h2>
        <div className="text-5xl font-extrabold mb-2" style={{ color: "var(--primary)" }}>{score} / {shuffled.length}</div>
        <div className="text-lg font-bold mb-6 text-gray-600">{pct}% — {message}</div>
        <button onClick={restart} className="btn-primary px-6 py-3 rounded-xl font-bold">🔄 {t("playAgain")}</button>
      </div>
    );
  }

  return (
    <div className="card p-6 md:p-8 max-w-3xl mx-auto fade-in">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-semibold text-gray-500">{t("question")} {idx + 1} / {shuffled.length}</span>
        <span className="text-sm font-bold" style={{ color: "var(--primary)" }}>⭐ {score}</span>
      </div>
      <div className="w-full h-2 bg-gray-100 rounded-full mb-6 overflow-hidden">
        <div className="h-full transition-all" style={{ width: ((idx) / shuffled.length * 100) + "%", backgroundColor: "var(--primary)" }} />
      </div>
      <h2 className="text-xl md:text-2xl font-bold mb-6" style={{ color: "var(--primary-dark)" }}>{q.q[lang] || q.q.id}</h2>
      <div className="space-y-3">
        {options.map((opt, i) => {
          const picked = selected === i;
          const right = selected !== null && i === q.answer;
          const wrong = picked && selected !== null && i !== q.answer;
          return (
            <button key={i} disabled={selected !== null} onClick={() => handlePick(i)}
              className={"w-full text-left px-5 py-4 rounded-xl border-2 font-medium transition " + (right ? "border-green-500 bg-green-50" : wrong ? "border-red-500 bg-red-50" : "border-gray-200 hover:border-gray-300 hover:bg-gray-50")}>
              <span className="inline-block w-6 h-6 rounded-full bg-gray-100 text-xs font-bold text-center leading-6 mr-3">{String.fromCharCode(65 + i)}</span>
              {opt}
              {right && <span className="float-right">✅</span>}
              {wrong && <span className="float-right">❌</span>}
            </button>
          );
        })}
      </div>
      {selected !== null && (
        <div className="mt-6 fade-in">
          <div className={"p-4 rounded-xl border-l-4 " + (isCorrect ? "bg-green-50 border-green-500" : "bg-red-50 border-red-500")}>
            <p className={"font-bold mb-1 " + (isCorrect ? "text-green-700" : "text-red-700")}>{isCorrect ? "✅ " + t("correct") : "❌ " + t("wrong")}</p>
            <p className="text-sm text-gray-700">{q.explain[lang] || q.explain.id}</p>
          </div>
          <button onClick={next} className="btn-primary mt-4 px-6 py-3 rounded-xl font-bold w-full">
            {idx + 1 < shuffled.length ? t("quizNext") + " →" : t("quizFinish") + " 🎉"}
          </button>
        </div>
      )}
    </div>
  );
}

function PlantsPanel({ lang }) {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const filtered = useMemo(() => {
    const s = search.toLowerCase();
    return plants.filter((p) => p.name.toLowerCase().includes(s) || p.nameEn.toLowerCase().includes(s));
  }, [search]);
  return (
    <div className="fade-in">
      <input type="text" placeholder={t("searchPlant")} value={search} onChange={(e) => setSearch(e.target.value)}
        className="w-full md:max-w-md mb-6 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none" />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map((p) => (
          <div key={p.id} className="card p-5 text-center hover:-translate-y-1">
            <div className="text-5xl mb-3">{p.emoji}</div>
            <h3 className="font-bold" style={{ color: "var(--primary-dark)" }}>{lang === "id" ? p.name : p.nameEn}</h3>
            <p className="text-xs text-gray-500 italic">{p.family}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function DiseasesPanel({ lang }) {
  const { t } = useTranslation();
  const [openId, setOpenId] = useState(null);
  return (
    <div className="grid md:grid-cols-2 gap-4 fade-in">
      {diseases.filter((d) => d.id !== "healthy").map((d) => {
        const isOpen = openId === d.id;
        const name = lang === "id" ? d.name : d.nameEn;
        const plant = lang === "id" ? d.plant : d.plantEn;
        const symptoms = lang === "id" ? d.symptoms : d.symptomsEn;
        const actions = lang === "id" ? d.actions : d.actionsEn;
        return (
          <div key={d.id} className="card p-5 cursor-pointer hover:shadow-md" onClick={() => setOpenId(isOpen ? null : d.id)}>
            <div className="flex items-start justify-between gap-3 mb-2">
              <div>
                <h3 className="font-bold text-lg" style={{ color: "var(--primary-dark)" }}>{name}</h3>
                <p className="text-xs text-gray-500 italic">{d.pathogen}</p>
              </div>
              <span className="text-xs font-bold px-2 py-1 rounded-full text-white shrink-0"
                style={{ backgroundColor: d.severity === "Tinggi" ? "#dc2626" : d.severity === "Sedang" ? "#f59e0b" : "#eab308" }}>
                {d.severity}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-2">🌱 <b>{plant}</b></p>
            {isOpen && (
              <div className="mt-3 pt-3 border-t border-gray-100 fade-in">
                <h4 className="font-bold text-sm mb-1">🔎 {t("symptoms")}</h4>
                <ul className="text-sm text-gray-600 list-disc list-inside mb-3">{symptoms.map((s, i) => <li key={i}>{s}</li>)}</ul>
                <h4 className="font-bold text-sm mb-1">⚡ {t("action")}</h4>
                <ul className="text-sm text-gray-600 list-disc list-inside">{actions.map((a, i) => <li key={i}>{a}</li>)}</ul>
              </div>
            )}
            {!isOpen && <p className="text-xs font-semibold" style={{ color: "var(--primary)" }}>{lang === "id" ? "Klik untuk detail →" : "Click for details →"}</p>}
          </div>
        );
      })}
    </div>
  );
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = a[i]; a[i] = a[j]; a[j] = tmp;
  }
  return a;
}
