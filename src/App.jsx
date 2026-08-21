import React, { useState, useRef, useEffect } from "react";
import { Volume2, Star, Sparkles, Home as HomeIcon, CheckCircle2 } from "lucide-react";

/* ---------------------------------------------------------
   بيانات السور القصيرة (نص مشكّل)
--------------------------------------------------------- */
const SURAHS = [
  {
    id: "fatiha",
    name: "الفاتحة",
    number: 1,
    color: "#FF7A5C",
    verses: [
      "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
      "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
      "الرَّحْمَٰنِ الرَّحِيمِ",
      "مَالِكِ يَوْمِ الدِّينِ",
      "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",
      "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ",
      "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ",
    ],
  },
  {
    id: "ikhlas",
    name: "الإخلاص",
    number: 112,
    color: "#FFC93C",
    verses: [
      "قُلْ هُوَ اللَّهُ أَحَدٌ",
      "اللَّهُ الصَّمَدُ",
      "لَمْ يَلِدْ وَلَمْ يُولَدْ",
      "وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ",
    ],
  },
  {
    id: "falaq",
    name: "الفلق",
    number: 113,
    color: "#4CAF7D",
    verses: [
      "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ",
      "مِنْ شَرِّ مَا خَلَقَ",
      "وَمِنْ شَرِّ غَاسِقٍ إِذَا وَقَبَ",
      "وَمِنْ شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ",
      "وَمِنْ شَرِّ حَاسِدٍ إِذَا حَسَدَ",
    ],
  },
  {
    id: "nas",
    name: "الناس",
    number: 114,
    color: "#8B7FD1",
    verses: [
      "قُلْ أَعُوذُ بِرَبِّ النَّاسِ",
      "مَلِكِ النَّاسِ",
      "إِلَٰهِ النَّاسِ",
      "مِنْ شَرِّ الْوَسْوَاسِ الْخَنَّاسِ",
      "الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ",
      "مِنَ الْجِنَّةِ وَالنَّاسِ",
    ],
  },
  {
    id: "kawthar",
    name: "الكوثر",
    number: 108,
    color: "#3EB8C0",
    verses: [
      "إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ",
      "فَصَلِّ لِرَبِّكَ وَانْحَرْ",
      "إِنَّ شَانِئَكَ هُوَ الْأَبْتَرُ",
    ],
  },
];

const REPEAT_TARGET = 3;
const NAVY = "#1B4B5A";
// مصدر صوت القارئ: مشاري العفاسي عبر واجهة alquran.cloud (مجانية ومفتوحة للمطورين)
const RECITER = "ar.alafasy";

/* ---------------------------------------------------------
   شخصية "نجمة" المرافقة
--------------------------------------------------------- */
function Mascot({ mood = "happy", size = 88, color = "#FF7A5C" }) {
  const eyes =
    mood === "excited" ? (
      <>
        <path d="M35 44 L45 44" stroke={NAVY} strokeWidth="4" strokeLinecap="round" />
        <path d="M55 44 L65 44" stroke={NAVY} strokeWidth="4" strokeLinecap="round" />
      </>
    ) : (
      <>
        <circle cx="40" cy="44" r="4.5" fill={NAVY} />
        <circle cx="60" cy="44" r="4.5" fill={NAVY} />
      </>
    );
  const mouth =
    mood === "excited" ? (
      <path d="M38 56 Q50 72 62 56" stroke={NAVY} strokeWidth="4" fill="none" strokeLinecap="round" />
    ) : (
      <path d="M40 56 Q50 66 60 56" stroke={NAVY} strokeWidth="4" fill="none" strokeLinecap="round" />
    );
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className="mascot-bounce"
      style={{ overflow: "visible" }}
    >
      <path
        d="M50 4 L61 35 L94 35 L67 55 L78 88 L50 68 L22 88 L33 55 L6 35 L39 35 Z"
        fill={color}
        stroke="#fff"
        strokeWidth="3"
      />
      {eyes}
      {mouth}
      <circle cx="30" cy="52" r="6" fill="#fff" opacity="0.35" />
    </svg>
  );
}

/* ---------------------------------------------------------
   صف الخرزات (يمثل عدد مرات التكرار)
--------------------------------------------------------- */
function BeadRow({ filled, total, color }) {
  return (
    <div className="flex items-center justify-center gap-3" dir="ltr">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className="rounded-full flex items-center justify-center bead"
          style={{
            width: 40,
            height: 40,
            background: i < filled ? color : "#fff",
            border: `3px solid ${color}`,
            transform: i < filled ? "scale(1)" : "scale(0.88)",
            transition: "all 0.25s ease",
          }}
        >
          {i < filled && <Star size={18} color="#fff" fill="#fff" />}
        </div>
      ))}
    </div>
  );
}

/* ---------------------------------------------------------
   التطبيق الرئيسي
--------------------------------------------------------- */
export default function App() {
  const [screen, setScreen] = useState("home"); // home | practice | done
  const [surahId, setSurahId] = useState(null);
  const [verseIdx, setVerseIdx] = useState(0);
  const [repeats, setRepeats] = useState(0);
  const [stars, setStars] = useState({}); // { surahId: totalStarsEarned }
  const [audioMode, setAudioMode] = useState("real"); // "real" | "tts" (تحويل تلقائي لو الصوت الحقيقي فشل)
  const [loadingAudio, setLoadingAudio] = useState(false);
  const [burst, setBurst] = useState(false);
  const audioCache = useRef({});
  const audioEl = useRef(null);

  const surah = SURAHS.find((s) => s.id === surahId);
  const verse = surah ? surah.verses[verseIdx] : "";

  const speak = (text) => {
    try {
      if (!window.speechSynthesis) return;
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "ar-SA";
      u.rate = 0.75;
      u.pitch = 1.05;
      window.speechSynthesis.speak(u);
    } catch (e) {
      /* لا يوجد صوت متاح على الإطلاق على هذا الجهاز */
    }
  };

  const playVerseAudio = async () => {
    if (!surah) return;
    const key = `${surah.number}:${verseIdx + 1}`;

    if (audioMode === "tts") {
      speak(verse);
      return;
    }

    try {
      setLoadingAudio(true);
      let url = audioCache.current[key];
      if (!url) {
        const res = await fetch(`https://api.alquran.cloud/v1/ayah/${key}/${RECITER}`);
        if (!res.ok) throw new Error("network");
        const data = await res.json();
        url = data?.data?.audio;
        if (!url) throw new Error("no-audio");
        audioCache.current[key] = url;
      }
      if (audioEl.current) {
        audioEl.current.src = url;
        await audioEl.current.play();
      }
    } catch (e) {
      // فشل تحميل الصوت الحقيقي (غالبًا لعدم توفر إنترنت) -> نتحول تلقائيًا للنطق الصناعي
      setAudioMode("tts");
      speak(verse);
    } finally {
      setLoadingAudio(false);
    }
  };

  const openSurah = (id) => {
    setSurahId(id);
    setVerseIdx(0);
    setRepeats(0);
    setAudioMode("real");
    setScreen("practice");
  };

  const handleRepeat = () => {
    if (repeats >= REPEAT_TARGET) return;
    const next = repeats + 1;
    setRepeats(next);
    setBurst(true);
    setTimeout(() => setBurst(false), 500);
    if (next >= REPEAT_TARGET) {
      setTimeout(() => {
        if (verseIdx + 1 < surah.verses.length) {
          setVerseIdx(verseIdx + 1);
          setRepeats(0);
        } else {
          setStars((s) => ({ ...s, [surahId]: 3 }));
          setScreen("done");
        }
      }, 650);
    }
  };

  const backHome = () => {
    window.speechSynthesis && window.speechSynthesis.cancel();
    if (audioEl.current) audioEl.current.pause();
    setScreen("home");
    setSurahId(null);
  };

  return (
    <div
      className="w-full min-h-full flex flex-col items-center"
      style={{
        fontFamily: "'Marhey', sans-serif",
        background: "linear-gradient(180deg, #EAF6FF 0%, #DFF3FF 60%, #E9F9EF 100%)",
        minHeight: "100vh",
        direction: "rtl",
        color: NAVY,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Marhey:wght@400;500;700&family=Amiri:wght@400;700&display=swap');
        .mascot-bounce { animation: bounce 2.6s ease-in-out infinite; }
        @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        .pop { animation: pop 0.35s ease; }
        @keyframes pop { 0%{transform:scale(0.85)} 60%{transform:scale(1.06)} 100%{transform:scale(1)} }
        .btn-press:active { transform: scale(0.96); }
        .cloud { position:absolute; opacity:0.6; }
        button:focus-visible, [role="button"]:focus-visible { outline: 3px solid #3EB8C0; outline-offset: 3px; }
        @media (prefers-reduced-motion: reduce) {
          .mascot-bounce, .pop { animation: none !important; }
        }
      `}</style>

      {/* زخارف سحابية خفيفة */}
      <div className="cloud" style={{ top: 20, left: 24, width: 60, height: 60, background: "#fff", borderRadius: "50%" }} />
      <div className="cloud" style={{ top: 50, right: 40, width: 40, height: 40, background: "#fff", borderRadius: "50%" }} />

      {screen === "home" && (
        <div className="w-full max-w-md px-5 pt-8 pb-10 flex flex-col items-center relative z-10">
          <Mascot mood="excited" size={96} color="#FF7A5C" />
          <div
            className="mt-2 mb-1 px-4 py-1 rounded-full bg-white text-sm font-bold shadow"
            style={{ color: "#FF7A5C" }}
          >
            يلا بينا نحفظ! ⭐
          </div>
          <h1 className="text-3xl font-bold mt-3" style={{ color: NAVY }}>
            براعم القرآن
          </h1>
          <p className="text-base mt-1 opacity-70 text-center">
            اسمع الآية، وكررها ثلاث مرات، واملأ خرزاتك الذهبية!
          </p>

          <div className="grid grid-cols-2 gap-4 w-full mt-8">
            {SURAHS.map((s) => {
              const earned = stars[s.id] || 0;
              return (
                <button
                  key={s.id}
                  onClick={() => openSurah(s.id)}
                  className="btn-press rounded-3xl p-4 flex flex-col items-center shadow-md bg-white"
                  style={{ border: `3px solid ${s.color}` }}
                >
                  <div
                    className="rounded-full flex items-center justify-center mb-2"
                    style={{ width: 56, height: 56, background: s.color + "22" }}
                  >
                    <Sparkles size={28} color={s.color} />
                  </div>
                  <span className="font-bold text-lg">سورة {s.name}</span>
                  <span className="text-xs opacity-60 mt-1">{s.verses.length} آيات</span>
                  <div className="flex gap-0.5 mt-2">
                    {[0, 1, 2].map((i) => (
                      <Star
                        key={i}
                        size={16}
                        color={i < earned ? "#FFC93C" : "#E2E8F0"}
                        fill={i < earned ? "#FFC93C" : "none"}
                      />
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {screen === "practice" && surah && (
        <div className="w-full max-w-md px-5 pt-6 pb-10 flex flex-col items-center relative z-10">
          {/* الشريط العلوي */}
          <div className="w-full flex items-center justify-between mb-4">
            <button onClick={backHome} className="btn-press rounded-full bg-white p-2 shadow" aria-label="الرئيسية">
              <HomeIcon size={20} color={NAVY} />
            </button>
            <span className="font-bold text-lg" style={{ color: surah.color }}>
              سورة {surah.name}
            </span>
            <span className="text-sm font-bold bg-white rounded-full px-3 py-1 shadow">
              {verseIdx + 1} / {surah.verses.length}
            </span>
          </div>

          <Mascot mood={repeats > 0 ? "excited" : "happy"} size={72} color={surah.color} />

          {/* بطاقة الآية */}
          <div
            className="w-full mt-4 rounded-3xl bg-white shadow-lg p-6 flex items-center justify-center pop"
            key={surahId + verseIdx}
            style={{ minHeight: 140, border: `3px dashed ${surah.color}` }}
          >
            <p
              style={{ fontFamily: "'Amiri', serif", fontSize: "1.9rem", lineHeight: 1.8, textAlign: "center" }}
            >
              {verse}
            </p>
          </div>

          <audio ref={audioEl} className="hidden" />

          {audioMode === "tts" && (
            <p className="text-xs opacity-60 mt-2 text-center">
              تعذّر تحميل صوت القارئ (تأكد من الإنترنت)، فمؤقتًا هنستخدم نطق صناعي 💛
            </p>
          )}

          {/* الخرزات */}
          <div className="mt-6 mb-2 text-sm font-bold opacity-70">كرر معايا</div>
          <BeadRow filled={repeats} total={REPEAT_TARGET} color={surah.color} />

          {/* الأزرار */}
          <div className="flex gap-4 mt-8 w-full justify-center">
            <button
              onClick={playVerseAudio}
              disabled={loadingAudio}
              className="btn-press flex items-center gap-2 rounded-2xl px-5 py-3 shadow-md text-white font-bold"
              style={{ background: "#3EB8C0", opacity: loadingAudio ? 0.6 : 1 }}
            >
              <Volume2 size={20} /> {loadingAudio ? "..." : "استمع"}
            </button>
            <button
              onClick={handleRepeat}
              disabled={repeats >= REPEAT_TARGET}
              className="btn-press flex items-center gap-2 rounded-2xl px-5 py-3 shadow-md text-white font-bold"
              style={{ background: surah.color, opacity: repeats >= REPEAT_TARGET ? 0.5 : 1 }}
            >
              <Star size={20} fill="#fff" /> كررت!
            </button>
          </div>

          {burst && (
            <div className="mt-4 text-2xl pop" aria-hidden="true">
              ✨🌟✨
            </div>
          )}
        </div>
      )}

      {screen === "done" && surah && (
        <div className="w-full max-w-md px-5 pt-16 pb-10 flex flex-col items-center relative z-10">
          <Mascot mood="excited" size={110} color={surah.color} />
          <div className="text-3xl mt-4 pop">🎉✨🎉</div>
          <h2 className="text-2xl font-bold mt-3 text-center">
            أحسنت يا بطل! أنهيت سورة {surah.name}
          </h2>
          <div className="flex gap-1 mt-3">
            {[0, 1, 2].map((i) => (
              <Star key={i} size={32} color="#FFC93C" fill="#FFC93C" />
            ))}
          </div>
          <div className="flex items-center gap-2 mt-4 bg-white rounded-2xl px-4 py-3 shadow">
            <CheckCircle2 size={22} color="#4CAF7D" />
            <span className="font-bold">حفظت {surah.verses.length} آيات كاملة</span>
          </div>
          <button
            onClick={backHome}
            className="btn-press mt-8 rounded-2xl px-6 py-3 shadow-md text-white font-bold flex items-center gap-2"
            style={{ background: surah.color }}
          >
            <HomeIcon size={20} /> رجوع للسور
          </button>
        </div>
      )}
    </div>
  );
      }
