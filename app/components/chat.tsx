"use client";
import React, { useState, useEffect, useRef } from "react";

const NORA_COLOR = "#2e2e2e";
const ICON_SIZE = 23;
const borderRadius = 22;
const panelHeight = 62;
const maxWidth = 560;
const videoMaxWidth = 314;
const GRADIENT = "linear-gradient(90deg, #eff5fe 0%, #e5e8ed 100%)";
const BABY_GRADIENT = "linear-gradient(90deg, #e39290 0%, #efb1b6 100%)";
const INPUT_BAR_HEIGHT = 68;
const PANEL_SIDE_PADDING = 15;
const BLOCK_SIDE_PADDING = 10;
const CARD_GAP = 10;

// Иконки
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

const filterNora =
  "invert(13%) sepia(4%) saturate(271%) hue-rotate(175deg) brightness(92%) contrast(93%)";
const BORDER_COLOR = "#e5e8ed";

// --- Встроенный компонент "Как работает Нора" ---
const HowItWorks = () => {
  const EXAMPLES = [
    { q: "Можно ли пить кофе во время беременности?", a: "☕ Конечно, но не больше 1–2 чашек в день." },
    { q: "Я часто волнуюсь без причины.", a: "🤗 Это естественно. Я помогу разобраться, когда стоит обратиться к врачу." },
    { q: "Болит спина и поясница.", a: "🦵 Старайтесь больше отдыхать лёжа на боку и выбирайте удобную обувь." },
    { q: "Плохо сплю.", a: "😴 Проветривайте комнату, делайте спокойные прогулки — всё наладится." },
    { q: "Можно ли заниматься спортом?", a: "🏃 Конечно. Рекомендую йогу, плавание и прогулки, без перегрузок." }
  ];

  const [step, setStep] = useState(0);
  const [phase, setPhase] = useState("q");
  const [q, setQ] = useState("");
  const [a, setA] = useState("");

  useEffect(() => {
    if (phase === "q") {
      setQ("");
      let i = 0;
      const t = setInterval(() => {
        setQ(EXAMPLES[step].q.slice(0, i + 1));
        i++;
        if (i > EXAMPLES[step].q.length) {
          clearInterval(t);
          setTimeout(() => setPhase("a"), 300);
        }
      }, 40);
      return () => clearInterval(t);
    } else if (phase === "a") {
      setA("");
      let i = 0;
      const t = setInterval(() => {
        setA(EXAMPLES[step].a.slice(0, i + 1));
        i++;
        if (i > EXAMPLES[step].a.length) {
          clearInterval(t);
          setTimeout(() => setPhase("next"), 5000);
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

  const bubble = (text: string, side: "left" | "right") => (
    <div
      style={{
        alignSelf: side === "right" ? "flex-end" : "flex-start",
        background: "#fff",
        borderRadius: 19,
        padding: "15px 21px",
        marginBottom: 16,
        maxWidth: 370,
        textAlign: "left",
        boxShadow: "0 1px 8px rgba(200,180,200,0.1)"
      }}
    >
      {text}
    </div>
  );

  return (
    <div style={{
      width: `calc(100% - ${BLOCK_SIDE_PADDING * 2}px)`,
      maxWidth,
      margin: "0 auto 38px auto",
      background: GRADIENT,
      borderRadius: 22,
      boxShadow: "0 6px 20px 0 rgba(150,175,205,0.10)",
      boxSizing: "border-box",
      padding: "21px 0 20px 0",
      fontFamily: "'Manrope', Arial, Helvetica, sans-serif"
    }}>
      <div
        style={{
          fontWeight: 700,
          fontSize: "20px",
          color: NORA_COLOR,
          marginBottom: 20,
          textAlign: "center"
        }}
      >
        Как работает Nora?
      </div>
      <div style={{
        display: "flex",
        flexDirection: "column",
        padding: `0 ${BLOCK_SIDE_PADDING}px`
      }}>
        {q && bubble(q, "right")}
        {a && bubble(a, "left")}
      </div>
      <div style={{
        fontSize: 13,
        color: "#7b8590",
        textAlign: "center",
        marginTop: 8
      }}>
        Просто задайте вопрос — Нора найдёт ответ!
      </div>
    </div>
  );
};

// --- Почему Нора ---
const WhyNoraBlock = () => {
  const BENEFITS = [
    { emoji: "🩺", title: "Медицинская точность", text: "Советы основаны на рекомендациях NHS и адаптированы под ваш регион." },
    { emoji: "🤝", title: "Поддержка 24/7", text: "Всегда на связи, чтобы помочь в любой ситуации." },
    { emoji: "⏰", title: "Напоминания", text: "Следим, чтобы вы ничего не забыли: анализы, витамины, визиты." },
    { emoji: "🔒", title: "Конфиденциальность", text: "Ваши данные остаются только у вас." }
  ];
  return (
    <div
      style={{
        width: `calc(100% - ${BLOCK_SIDE_PADDING * 2}px)`,
        maxWidth,
        margin: "0 auto 38px auto",
        background: GRADIENT,
        borderRadius: borderRadius,
        boxShadow: "0 6px 20px rgba(150,175,205,0.10)",
        padding: "21px 0 20px 0"
      }}
    >
      <div
        style={{
          fontWeight: 700,
          fontSize: "20px",
          color: NORA_COLOR,
          marginBottom: 20,
          textAlign: "center"
        }}
      >
        Почему Nora Plus?
      </div>
      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: CARD_GAP,
        padding: `0 ${BLOCK_SIDE_PADDING}px`
      }}>
        {BENEFITS.map(({ emoji, title, text }, i) => (
          <div key={i} style={{
            background: "#fff",
            borderRadius: 18,
            boxShadow: "0 2px 18px rgba(150,180,220,0.07)",
            padding: "19px 15px"
          }}>
            <div style={{ fontWeight: 700, fontSize: 16, color: NORA_COLOR, marginBottom: 5 }}>{emoji} {title}</div>
            <div style={{ fontSize: 13, color: "#3a3a3a" }}>{text}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Отзывы ---
const ReviewBlock = () => {
  const REVIEWS = [
    { name: "Анна", text: "Nora Plus подсказала, как справиться с утренней тошнотой." },
    { name: "Мария", text: "Советы помогли наладить сон и самочувствие." },
    { name: "Екатерина", text: "Теперь чувствую себя увереннее и спокойнее." }
  ];
  return (
    <div
      style={{
        width: `calc(100% - ${BLOCK_SIDE_PADDING * 2}px)`,
        maxWidth,
        margin: "0 auto 38px auto",
        background: GRADIENT,
        borderRadius: 22,
        boxShadow: "0 6px 20px rgba(150,175,205,0.10)",
        padding: "21px 0 20px 0"
      }}
    >
      <div style={{
        fontWeight: 700,
        fontSize: "20px",
        color: NORA_COLOR,
        marginBottom: 20,
        textAlign: "center"
      }}>Отзывы будущих мам</div>
      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: 10,
        padding: `0 ${BLOCK_SIDE_PADDING}px`
      }}>
        {REVIEWS.map(({ name, text }, i) => (
          <div key={i} style={{
            background: "#fff",
            borderRadius: 18,
            padding: "16px 15px",
            boxShadow: "0 2px 18px rgba(150,180,220,0.07)"
          }}>
            <div style={{ fontWeight: 700, color: NORA_COLOR }}>{name}</div>
            <div style={{ fontSize: 13, color: "#3a3a3a", marginTop: 5 }}>{text}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Footer = () => (
  <div
    style={{
      width: `calc(100% - 40px)`,
      maxWidth,
      margin: "0 auto",
      background: GRADIENT,
      borderRadius: "22px",
      boxShadow: "0 -4px 14px 0 rgba(155,175,205,0.06)",
      padding: 20,
      textAlign: "center",
      fontSize: 13,
      color: "#263540"
    }}
  >
    © {new Date().getFullYear()} Nora Plus — забота и поддержка будущих мам
  </div>
);

// --- Главный компонент ---
const Chat = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  if (showWelcome) {
    return (
      <div
        style={{
          fontFamily: "'Manrope', Arial, Helvetica, sans-serif",
          background: "#f8fdff",
          width: "100vw",
          minHeight: "100vh"
        }}
      >
        {/* Заголовок */}
        <div style={{
          width: `calc(100% - ${PANEL_SIDE_PADDING * 2}px)`,
          maxWidth,
          minHeight: panelHeight,
          background: GRADIENT,
          color: NORA_COLOR,
          margin: "20px auto 0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: borderRadius,
          fontWeight: 700,
          fontSize: "19px"
        }}>
          Nora Plus
        </div>
        <div style={{ height: 40 }} />
        <div style={{
          textAlign: "center",
          fontWeight: 700,
          fontSize: "22px",
          color: NORA_COLOR,
          marginBottom: 10
        }}>Ждёте малыша? Я помогу!</div>
        <div style={{
          fontSize: "15px",
          color: NORA_COLOR,
          lineHeight: 1.6,
          maxWidth: 380,
          margin: "0 auto 40px auto",
          textAlign: "center"
        }}>
          Я помогаю будущим мамам на каждом этапе беременности: отвечаю на вопросы, напоминаю о важных делах, слежу за самочувствием и даю советы, основанные на медицине Великобритании NHS.
        </div>

        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <button
            style={{
              background: BABY_GRADIENT,
              color: "white",
              border: "none",
              borderRadius: borderRadius,
              padding: "15px 50px",
              fontSize: "17px",
              fontWeight: 700,
              cursor: "pointer"
            }}
            onClick={() => setShowWelcome(false)}
          >
            Начать пользоваться
          </button>
        </div>

        {/* --- Встроенные блоки --- */}
        <HowItWorks />
        <WhyNoraBlock />
        <ReviewBlock />
        <Footer />
      </div>
    );
  }
  return <div>Чат-зона</div>;
};

export default Chat;
