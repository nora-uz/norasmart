"use client";
import React, { useState, useEffect, useRef } from "react";

// --- Константы ---
const NORA_COLOR = "#2e2e2e";
const ICON_SIZE = 23;
const borderRadius = 22;
const panelHeight = 62;
const maxWidth = 560;
const videoMaxWidth = 314;
const GRADIENT = "linear-gradient(90deg, #eff5fe 0%, #e5e8ed 100%)";
const BABY_GRADIENT = "linear-gradient(90deg, #e39290 0%, #efb1b6 100%)";
const BLOCK_SIDE_PADDING = 10;
const CARD_GAP = 10;

// --- Иконки ---
const IconPartner = (
  <svg width="18" height="18" fill="none" viewBox="0 0 20 20">
    <circle cx="10" cy="6.5" r="3.3" stroke="#5a6573" strokeWidth="1.5"/>
    <path d="M2.8 16c.9-2.5 3.4-4.2 7.2-4.2s6.2 1.7 7.2 4.2"
      stroke="#5a6573" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);
const IconContact = (
  <svg width="18" height="18" fill="none" viewBox="0 0 20 20">
    <rect x="2.8" y="3.5" width="14.4" height="11" rx="2.2"
      stroke="#5a6573" strokeWidth="1.5"/>
    <path d="M3.5 4l6.5 6.1c.3.2.8.2 1.1 0L17 4"
      stroke="#5a6573" strokeWidth="1.5"/>
  </svg>
);

// --- Иконки действий ---
const ICONS = {
  telegram: "https://cdn-icons-png.flaticon.com/512/1946/1946547.png",
  trash: "https://cdn-icons-png.flaticon.com/512/1345/1345823.png",
  share: "https://cdn-icons-png.flaticon.com/512/535/535285.png",
  arrowRight: (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path d="M6 11H16M16 11L12 7M16 11L12 15"
        stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
};

const BENEFITS = [
  { emoji: "🩺", title: "Медицинская точность", text: "Советы основаны на рекомендациях британской службы NHS и адаптированы под ваш регион." },
  { emoji: "🤝", title: "Поддержка 24/7", text: "Ассистент всегда на связи для заботы и помощи в любой ситуации." },
  { emoji: "⏰", title: "Напоминания о важных делах", text: "Следим, чтобы вы ничего не забыли — анализы, витамины, визиты." },
  { emoji: "🔒", title: "Конфиденциальность", text: "Личные данные остаются только у вас — никакой передачи сторонним." },
  { emoji: "⚡️", title: "Быстрые решения", text: "Полезные советы и поддержка сразу, когда это нужно." },
];

// --- Отзывы ---
const REVIEWS = [
  { name: "Анна", badge: "2 месяц беременности", problem: "Токсикоз", text: "Nora Plus подсказала, как справиться с утренней тошнотой. Благодаря рекомендациям по питанию и режиму дня симптомы стали гораздо легче." },
  { name: "Елена", badge: "4 месяц беременности", problem: "Слабость и усталость", text: "Теперь я знаю, какие витамины нужно пить, сколько отдыхать и как выстроить день. Чувствую себя значительно лучше!" },
  { name: "Ирина", badge: "5 месяц беременности", problem: "Тревожность", text: "Советы Nora Plus помогли мне больше отдыхать, заботиться о себе и избавиться от лишних переживаний за малыша." },
];

// --- WhyNoraBlock ---
const WhyNoraBlock = () => (
  <div style={{
    width: `calc(100% - ${BLOCK_SIDE_PADDING * 2}px)`,
    maxWidth,
    margin: "0 auto 38px auto",
    background: GRADIENT,
    borderRadius: borderRadius,
    boxShadow: "0 6px 20px 0 rgba(150, 175, 205, 0.10)",
    fontFamily: "'Manrope', Arial, Helvetica, sans-serif"
  }}>
    <div style={{ padding: "21px 0 20px 0" }}>
      <div style={{
        fontWeight: 700,
        fontSize: "20px",
        color: NORA_COLOR,
        textAlign: "center",
        marginBottom: 20
      }}>Почему Nora Plus?</div>
      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: CARD_GAP,
        padding: `0 ${BLOCK_SIDE_PADDING}px`
      }}>
        {BENEFITS.map(({ emoji, title, text }, idx) => (
          <div key={idx} style={{
            background: "#fff",
            borderRadius: 18,
            padding: "19px 15px",
            boxShadow: "0 2px 18px 0 rgba(150,180,220,0.07)"
          }}>
            <div style={{ fontWeight: 700, fontSize: 16, color: NORA_COLOR }}>{title}</div>
            <div style={{ fontSize: 13, color: "#3a3a3a", marginTop: 7 }}>{text}</div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// --- ReviewBlock ---
const ReviewBlock = () => (
  <div style={{
    width: `calc(100% - ${BLOCK_SIDE_PADDING * 2}px)`,
    maxWidth,
    margin: "0 auto 38px auto",
    background: GRADIENT,
    borderRadius: borderRadius,
    boxShadow: "0 6px 20px 0 rgba(150, 175, 205, 0.10)"
  }}>
    <div style={{ padding: "21px 0 20px 0" }}>
      <div style={{
        fontWeight: 700,
        fontSize: "20px",
        color: NORA_COLOR,
        textAlign: "center",
        marginBottom: 20
      }}>Отзывы будущих мам</div>
      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: CARD_GAP,
        padding: `0 ${BLOCK_SIDE_PADDING}px`
      }}>
        {REVIEWS.map(({ name, badge, problem, text }, idx) => (
          <div key={idx} style={{
            background: "#fff",
            borderRadius: 18,
            padding: "19px 15px",
            boxShadow: "0 2px 18px 0 rgba(150,180,220,0.07)"
          }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: "#222" }}>{name} — {badge}</div>
            <div style={{ fontSize: 13, color: "#acb5bd", marginTop: 4 }}>{problem}</div>
            <div style={{ fontSize: 13, color: "#3a3a3a", marginTop: 8, lineHeight: 1.5 }}>{text}</div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// --- HowItWorks ---
const HowItWorks = () => {
  const EXAMPLES = [
    { q: "Я часто волнуюсь без причины.", a: "🤗 Это очень распространено у беременных! Эмоции усиливаются из-за гормонов..." },
    { q: "Болит спина и поясница.", a: "💆 Это часто связано с изменением центра тяжести..." },
    { q: "Плохо сплю последние дни.", a: "😴 Попробуйте прогулки и легкие растяжки для расслабления..." },
    { q: "Можно ли заниматься спортом?", a: "🏃‍♀️ Да, но выбирайте безопасные занятия: йога, плавание..." },
  ];
  const [step, setStep] = useState(0);
  const [phase, setPhase] = useState("q");
  const [q, setQ] = useState("");
  const [a, setA] = useState("");

  useEffect(() => {
    let t;
    if (phase === "q") {
      setQ("");
      let i = 0;
      t = setInterval(() => {
        setQ(EXAMPLES[step].q.slice(0, i + 1));
        i++;
        if (i > EXAMPLES[step].q.length) { clearInterval(t); setTimeout(() => setPhase("a"), 350); }
      }, 35);
    } else if (phase === "a") {
      setA(""); let i = 0;
      t = setInterval(() => {
        setA(EXAMPLES[step].a.slice(0, i + 1));
        i++;
        if (i > EXAMPLES[step].a.length) { clearInterval(t); setTimeout(() => setPhase("next"), 6900); }
      }, 17);
    } else if (phase === "next") {
      t = setTimeout(() => { setStep((s) => (s + 1) % EXAMPLES.length); setPhase("q"); }, 350);
    }
    return () => clearInterval(t);
  }, [phase, step]);

  return (
    <div style={{
      width: `calc(100% - ${BLOCK_SIDE_PADDING * 2}px)`,
      maxWidth,
      margin: "0 auto 38px auto",
      background: GRADIENT,
      borderRadius: 22,
      boxShadow: "0 6px 20px rgba(150,175,205,0.1)",
      padding: "21px 0 20px 0"
    }}>
      <div style={{
        display: "flex",
        flexDirection: "column",
        padding: `0 ${BLOCK_SIDE_PADDING}px`
      }}>
        {q && <div style={{
          alignSelf: "flex-end",
          background: "#fff",
          borderRadius: "18px 18px 4px 18px",
          padding: "18px 20px",
          marginBottom: 18,
          fontSize: 15.5
        }}>{q}</div>}
        {a && <div style={{
          alignSelf: "flex-start",
          background: "#f7fafd",
          borderRadius: "18px 18px 18px 4px",
          padding: "18px 20px",
          fontSize: 15.5
        }}>{a}</div>}
      </div>
    </div>
  );
};

// --- TabPanel ---
const TABS = [
  { key: "how", label: "Пример" },
  { key: "why", label: "Почему Nora?" },
  { key: "reviews", label: "Отзывы" },
];
const TabPanel = () => {
  const [activeTab, setActiveTab] = useState("how");
  const tabStyle = (isActive) => ({
    flex: 1,
    padding: "14px 0",
    border: "none",
    borderRadius: borderRadius,
    fontWeight: 700,
    fontSize: "16px",
    background: isActive ? BABY_GRADIENT : GRADIENT,
    color: isActive ? "#fff" : NORA_COLOR,
    cursor: "pointer"
  });
  return (
    <div style={{
      width: `calc(100% - ${BLOCK_SIDE_PADDING * 2}px)`,
      maxWidth,
      margin: "0 auto"
    }}>
      <div style={{
        display: "flex",
        gap: 12,
        marginBottom: 25
      }}>
        {TABS.map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)} style={tabStyle(activeTab === t.key)}>
            {t.label}
          </button>
        ))}
      </div>
      {activeTab === "how" && <HowItWorks />}
      {activeTab === "why" && <WhyNoraBlock />}
      {activeTab === "reviews" && <ReviewBlock />}
    </div>
  );
};

// --- Footer ---
const Footer = () => (
  <div style={{
    width: "calc(100% - 40px)",
    maxWidth,
    margin: "0 auto",
    background: GRADIENT,
    borderRadius: "22px",
    fontFamily: "'Manrope', Arial, Helvetica, sans-serif",
    padding: 20,
    textAlign: "center"
  }}>
    <div style={{ fontSize: 12, color: "#263540", fontWeight: 600 }}>Ташкент, Юнусабадский район, массив Кашгар 26</div>
    <div style={{ marginTop: 14, display: "flex", justifyContent: "center", gap: 10 }}>
      <a href="#" style={{ background: "#fff", border: "1px solid #e1e9f5", borderRadius: 14, padding: "8px 18px", fontSize: 14, color: "#495062", textDecoration: "none" }}>{IconPartner} Стать партнёром</a>
      <a href="#" style={{ background: "#fff", border: "1px solid #e1e9f5", borderRadius: 14, padding: "8px 18px", fontSize: 14, color: "#495062", textDecoration: "none" }}>{IconContact} Контакты</a>
    </div>
    <a href="#" style={{ display: "block", marginTop: 12, fontSize: 14, color: "#495062", textDecoration: "none" }}>Политика конфиденциальности</a>
    <div style={{ marginTop: 8, fontSize: 12, color: "#8a97a0" }}>© {new Date().getFullYear()} Nora Plus — забота и поддержка будущих мам</div>
  </div>
);
const FooterGap = () => <div style={{ height: 20 }} />;

// --- Chat ---
const Chat = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  if (showWelcome) {
    return (
      <div style={{
        fontFamily: "'Manrope', Arial",
        background: "#f8fdff",
        width: "100vw",
        minHeight: "100vh"
      }}>
        <div style={{
          textAlign: "center",
          marginTop: 40
        }}>
          <h1 style={{ fontSize: 24, color: NORA_COLOR }}>Ждёте малыша? Я помогу!</h1>
          <p style={{ fontSize: 15, maxWidth: 380, margin: "0 auto", lineHeight: 1.6 }}>Я сопровождаю будущих мам на каждом этапе беременности — даю советы, слежу за здоровьем и помогаю заботиться о себе.</p>
          <button
            style={{
              marginTop: 30,
              background: BABY_GRADIENT,
              color: "#fff",
              fontWeight: 700,
              fontSize: "17px",
              border: "none",
              borderRadius: borderRadius,
              padding: "15px 30px",
              cursor: "pointer"
            }}
            onClick={() => setShowWelcome(false)}
          >
            Начать пользоваться {ICONS.arrowRight}
          </button>
          <div style={{ height: 40 }} />
          <TabPanel />
          <Footer />
          <FooterGap />
        </div>
      </div>
    );
  }
  // Здесь оставь остальную часть твоего чата (из оригинала)
  return <div>Чат страница...</div>;
};

export default Chat;
