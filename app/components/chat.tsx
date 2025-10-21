"use client";
import React, { useState, useEffect, useRef } from "react";

const NORA_COLOR = "#2e2e2e";
const ICON_SIZE = 23;
const borderRadius = 22;
const panelHeight = 62;
const maxWidth = 560;
const videoMaxWidth = 314;
const GRADIENT = "linear-gradient(270deg, #eff5fe 0%, #e5e8ed 100%)"; // градиент перевернут
const BABY_GRADIENT = "linear-gradient(90deg, #e39290 0%, #efb1b6 100%)";
const INPUT_BAR_HEIGHT = 68;
const PANEL_SIDE_PADDING = 15;
const BLOCK_SIDE_PADDING = 10;
const CARD_GAP = 10;

const IconPartner = (
  <svg width="18" height="18" fill="none" viewBox="0 0 20 20">
    <circle cx="10" cy="6.5" r="3.3" stroke="#5a6573" strokeWidth="1.5"/>
    <path d="M2.8 16c.9-2.5 3.4-4.2 7.2-4.2s6.2 1.7 7.2 4.2" stroke="#5a6573" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const IconContact = (
  <svg width="18" height="18" fill="none" viewBox="0 0 20 20">
    <rect x="2.8" y="3.5" width="14.4" height="11" rx="2.2" stroke="#5a6573" strokeWidth="1.5"/>
    <path d="M3.5 4l6.5 6.1c.3.2.8.2 1.1 0L17 4" stroke="#5a6573" strokeWidth="1.5"/>
  </svg>
);

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
const filterNora = "invert(13%) sepia(4%) saturate(271%) hue-rotate(175deg) brightness(92%) contrast(93%)";


const BENEFITS = [
  { emoji: "🩺", title: "Медицинская точность", text: "Советы основаны на рекомендациях британской службы NHS и адаптированы под ваш регион." },
  { emoji: "🤝", title: "Поддержка 24/7", text: "Ассистент всегда на связи для заботы и помощи в любой ситуации." },
  { emoji: "⏰", title: "Напоминания о важных делах", text: "Следим, чтобы вы ничего не забыли — анализы, витамины, визиты." },
  { emoji: "🔒", title: "Конфиденциальность", text: "Личные данные остаются только у вас — никакой передачи сторонним." },
  { emoji: "⚡️", title: "Быстрые решения", text: "Полезные советы и поддержка сразу, когда это нужно." },
];

const REVIEWS = [
  { name: "Анна", badge: "2 месяц беременности", problem: "Токсикоз", text: "Nora Plus подсказала, как справиться с утренней тошнотой..." },
  { name: "Дилноза", badge: "3 месяц беременности", problem: "Тошнота", text: "Советы Nora Plus помогли справиться..." },
];

const WhyNoraBlock = () => (
  <div
    style={{
      width: `calc(100% - ${BLOCK_SIDE_PADDING * 2}px)`,
      maxWidth,
      margin: "0 auto 38px auto",
      background: GRADIENT,
      borderRadius: borderRadius,
      boxShadow: "0 6px 20px rgba(150,175,205,0.10)"
    }}>
    <div style={{ padding: `21px 0 20px 0` }}>
      <div style={{
        fontWeight: 700,
        fontSize: "20px",
        color: NORA_COLOR,
        marginBottom: 20,
        textAlign: "center"
      }}>
        Почему Nora Plus?
      </div>
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
            boxShadow: "0 2px 18px rgba(150,180,220,0.07)",
            padding: "19px 15px",
            textAlign: "left"
          }}>
            <div style={{
              fontWeight: 700, fontSize: 16, color: NORA_COLOR, marginBottom: 7
            }}>{emoji} {title}</div>
            <div style={{ fontSize: 13, color: "#3a3a3a", lineHeight: "1.64" }}>{text}</div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ✅ Обновлённый блок “Как работает Нора”
const HowItWorks = () => {
  const EXAMPLES = [
    { q: "Можно ли пить кофе во время беременности?", a: "☕ Конечно, но не больше 1–2 чашек в день." },
    { q: "Болит спина и поясница.", a: "🦵 Отдыхайте лёжа на боку и выбирайте удобную обувь." },
    { q: "Плохо сплю.", a: "😴 Проветривайте комнату и делайте лёгкие прогулки." }
  ];

  const [step, setStep] = useState(0);
  const [phase, setPhase] = useState("q");
  const [q, setQ] = useState("");
  const [a, setA] = useState("");

  useEffect(() => {
    if (phase === "q") {
      let i = 0;
      setQ("");
      const t = setInterval(() => {
        setQ(EXAMPLES[step].q.slice(0, i + 1));
        i++;
        if (i > EXAMPLES[step].q.length) {
          clearInterval(t);
          setTimeout(() => setPhase("a"), 350);
        }
      }, 40);
      return () => clearInterval(t);
    } else if (phase === "a") {
      let i = 0;
      setA("");
      const t = setInterval(() => {
        setA(EXAMPLES[step].a.slice(0, i + 1));
        i++;
        if (i > EXAMPLES[step].a.length) {
          clearInterval(t);
          setTimeout(() => setPhase("next"), 4500);
        }
      }, 25);
      return () => clearInterval(t);
    } else if (phase === "next") {
      const t = setTimeout(() => {
        setStep((s) => (s + 1) % EXAMPLES.length);
        setPhase("q");
      }, 300);
      return () => clearTimeout(t);
    }
  }, [phase, step]);

  // Внешний стиль пузыря
  const bubble = (text, side) => {
    const isRight = side === "right";
    return (
      <div
        style={{
          alignSelf: isRight ? "flex-end" : "flex-start",
          background: "#fff",
          borderRadius: 18,
          borderBottomRightRadius: isRight ? 4 : 18,
          borderBottomLeftRadius: isRight ? 18 : 4,
          padding: "16px 20px 17px 20px",
          marginBottom: 20,
          maxWidth: 370,
          lineHeight: 1.6,
          fontSize: 15.3,
          textAlign: isRight ? "right" : "left",
          boxShadow: "0 2px 10px rgba(170,180,210,0.1)"
        }}
      >
        {text}
      </div>
    );
  };

  return (
    <div style={{
      width: `calc(100% - ${BLOCK_SIDE_PADDING * 2}px)`,
      maxWidth: 560,
      margin: "0 auto 38px auto",
      background: "linear-gradient(270deg, #eff5fe 0%, #e5e8ed 100%)",
      borderRadius: 22,
      boxShadow: "0 6px 20px rgba(150,175,205,0.10)",
      padding: "30px 0 26px 0",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      fontFamily: "'Manrope', Arial, Helvetica, sans-serif"
    }}>
      <div style={{
        display: "flex",
        flexDirection: "column",
        padding: `0 ${BLOCK_SIDE_PADDING}px`,
        width: "100%"
      }}>
        {q && bubble(q, "right")}
        {a && bubble(a, "left")}
      </div>
      <div style={{
        fontSize: 13,
        color: "#7b8590",
        textAlign: "center",
        marginTop: 5
      }}>
        Просто задайте вопрос — Нора найдёт ответ!
      </div>
    </div>
  );
};

const Chat = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [preloading, setPreloading] = useState(false);

  if (showWelcome) {
    return (
      <div style={{
        fontFamily: "'Manrope', Arial, Helvetica, sans-serif",
        background: "#f8fdff",
        width: "100vw",
        minHeight: "100vh"
      }}>
        <div style={{ padding: 30, textAlign: "center" }}>
          <div style={{
            fontWeight: 700,
            fontSize: 22,
            color: NORA_COLOR,
            marginBottom: 25
          }}>
            Ждёте малыша? Я помогу!
          </div>
          <button
            style={{
              width: "100%",
              maxWidth: 290,
              background: BABY_GRADIENT,
              color: "#fff",
              border: "none",
              borderRadius: borderRadius,
              fontWeight: 700,
              fontSize: 17,
              padding: "15px 0",
              cursor: "pointer",
              marginBottom: 40
            }}
            onClick={() => setShowWelcome(false)}
          >
            Начать пользоваться
          </button>

          <HowItWorks />{/* теперь сверху под кнопкой */}
          <WhyNoraBlock />
        </div>
      </div>
    );
  }

  return <div>Chat screen...</div>;
};

export default Chat;
