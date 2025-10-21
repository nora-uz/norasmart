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

// SVG-иконки
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
const IconPolicy = (
  <svg width="16" height="16" fill="none" viewBox="0 0 20 20" style={{marginRight: 6}}>
    <path d="M4 4.5V10c0 5 7 6.5 7 6.5s7-1.5 7-6.5v-5.5л-7-2-7 2Z" stroke="#4d5762" strokeWidth="1.5" fill="none"/>
  </svg>
);

// Список причин
const BENEFITS = [
  { emoji: "🩺", title: "Медицинская точность", text: "Советы основаны на рекомендациях британской службы NHS и адаптированы под ваш регион." },
  { emoji: "🤝", title: "Поддержка 24/7", text: "Ассистент всегда на связи для заботы и помощи в любой ситуации." },
  { emoji: "⏰", title: "Напоминания", text: "Следим, чтобы вы ничего не забыли — анализы, витамины, визиты." },
  { emoji: "🔒", title: "Конфиденциальность", text: "Личные данные остаются только у вас — никакой передачи сторонним." },
  { emoji: "⚡️", title: "Быстрые решения", text: "Полезные советы и поддержка сразу, когда это нужно." },
];

// Отзывы
const REVIEWS = [
  { name: "Анна", badge: "2 мес беременности", problem: "Токсикоз", text: "Nora Plus подсказала, как справиться с утренней тошнотой. Всё стало проще." },
  { name: "Елена", badge: "4 мес беременности", problem: "Слабость", text: "Теперь я знаю, какие витамины принимать и как отдыхать." },
  { name: "Мария", badge: "7 мес беременности", problem: "Бессонница", text: "Благодаря советам Nora Plus я стала лучше спать и чувствую спокойствие." },
];

// Блок HowItWorks
const EXAMPLES = [
  { q: "Можно ли пить кофе во время беременности?", a: "☕ Да, но не больше 1-2 чашек в день." },
  { q: "Часто болит спина, что делать?", a: "🦵 Носите удобную обувь и чаще отдыхайте лёжа на боку." },
  { q: "Как питаться?", a: "🍎 Ешьте сбалансированно, следите за количеством железа и кальция!" },
  { q: "Можно ли заниматься спортом?", a: "🏃 Да! Подойдут прогулки, плавание и йога для беременных." },
  { q: "Почему я быстро устаю?", a: "💤 Организм работает интенсивно — отдыхайте больше, важно соблюдать сон." },
];

const bubbleStyle = (align = "right") => ({
  alignSelf: align === "right" ? ("flex-end" as const) : ("flex-start" as const),
  background: "#fff",
  borderRadius: 19,
  padding: align === "right" ? "12px 16px" : "12px 16px",
  marginBottom: 16,
  maxWidth: 360,
  textAlign: "left" as const,
  boxShadow: "0 1px 8px rgba(200,180,200,0.1)",
});

const NoraHowItWorksBlock = () => {
  const [step, setStep] = useState(0);
  const [phase, setPhase] = useState("typeQ");
  const [qText, setQText] = useState("");
  const [aText, setAText] = useState("");

  useEffect(() => {
    if (phase === "typeQ") {
      setQText("");
      let i = 0;
      const int = setInterval(() => {
        setQText(EXAMPLES[step].q.slice(0, i + 1));
        i++;
        if (i > EXAMPLES[step].q.length) { clearInterval(int); setTimeout(() => setPhase("typeA"), 350); }
      }, 40);
      return () => clearInterval(int);
    }
    if (phase === "typeA") {
      setAText("");
      let i = 0;
      const int = setInterval(() => {
        setAText(EXAMPLES[step].a.slice(0, i + 1));
        i++;
        if (i > EXAMPLES[step].a.length) {
          clearInterval(int);
          setTimeout(() => setPhase("next"), 6000);
        }
      }, 25);
      return () => clearInterval(int);
    }
    if (phase === "next") {
      const timeout = setTimeout(() => {
        setStep((step + 1) % EXAMPLES.length);
        setPhase("typeQ");
      }, 600);
      return () => clearTimeout(timeout);
    }
  }, [phase, step]);

  return (
    <div style={{
      width: `calc(100% - ${BLOCK_SIDE_PADDING * 2}px)`,
      margin: "0 auto 38px auto",
      background: GRADIENT,
      borderRadius: borderRadius,
      boxShadow: "0 6px 20px rgba(150,175,205,0.1)",
      padding: `22px ${BLOCK_SIDE_PADDING}px 20px ${BLOCK_SIDE_PADDING}px`,
      fontFamily: "'Manrope', Arial, sans-serif"
    }}>
      <div style={{ fontWeight: 700, fontSize: 20, color: NORA_COLOR, textAlign: "center" as const }}>
        Как работает Nora?
      </div>
      <div style={{ marginTop: 25, display: "flex", flexDirection: "column" }}>
        {qText && <div style={bubbleStyle("right")}>{qText}</div>}
        {aText && <div style={bubbleStyle("left")}>{aText}</div>}
      </div>
      <div style={{ textAlign: "center" as const, fontSize: 13, color: "#7b8590", marginTop: 10 }}>
        Просто задайте вопрос — Нора ответит!
      </div>
    </div>
  );
};

// Основной компонент
const Chat = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  return (
    <div style={{ fontFamily: "'Manrope',sans-serif", background: "#f8fdff" }}>
      {/* Панель */}
      <div style={{
        maxWidth,
        margin: "20px auto",
        background: GRADIENT,
        borderRadius: borderRadius,
        height: 62,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "5px 15px"
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 800, fontSize: 19 }}>Nora Plus</div>
          <div style={{ fontSize: 13, color: "#555" }}>Ассистент для будущих мам</div>
        </div>
        <div style={{ gap: 8, display: "flex" }}>
          <img src="https://cdn-icons-png.flaticon.com/512/535/535285.png" style={{ width: ICON_SIZE, height: ICON_SIZE }} />
          <img src="https://cdn-icons-png.flaticon.com/512/1946/1946547.png" style={{ width: ICON_SIZE, height: ICON_SIZE }} />
          <img src="https://cdn-icons-png.flaticon.com/512/1345/1345823.png" style={{ width: ICON_SIZE, height: ICON_SIZE }} />
        </div>
      </div>

      {/* Welcome Screen */}
      {showWelcome && (
        <div style={{ textAlign: "center" }}>
          <video
            src="/nora.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            style={{ width: "100%", maxWidth: videoMaxWidth, borderRadius: 22 }}
          />
          <h2 style={{ color: NORA_COLOR, fontSize: 22, fontWeight: 700, marginTop: 16 }}>Ждёте малыша? Я помогу!</h2>
          <p style={{
            color: NORA_COLOR, fontSize: 15, lineHeight: 1.7, maxWidth: 400, margin: "10px auto"
          }}>
            Я помогаю будущим мамам: отвечаю на вопросы, напоминаю о делах, слежу за самочувствием и поддерживаю!
          </p>
          <button
            onClick={() => setShowWelcome(false)}
            style={{
              background: BABY_GRADIENT,
              border: "none",
              borderRadius: borderRadius,
              color: "#fff",
              fontWeight: 700,
              fontSize: 17,
              padding: "15px 30px",
              marginTop: 25,
              cursor: "pointer"
            }}
          >
            Начать пользоваться
          </button>
        </div>
      )}

      {/* Как работает Нора */}
      <NoraHowItWorksBlock />
      {/* Преимущества */}
      <div style={{
        width: `calc(100% - ${BLOCK_SIDE_PADDING * 2}px)`,
        background: GRADIENT,
        borderRadius: borderRadius,
        margin: "0 auto 38px auto",
        boxShadow: "0 6px 20px rgba(150,175,205,0.1)",
        padding: `22px ${BLOCK_SIDE_PADDING}px 20px`
      }}>
        <h3 style={{ fontWeight: 700, textAlign: "center", fontSize: 20, color: NORA_COLOR }}>Почему Nora Plus?</h3>
        {BENEFITS.map((b, i) => (
          <div key={i} style={{ background: "#fff", borderRadius: 18, padding: "15px", marginTop: 10 }}>
            <strong>{b.emoji} {b.title}</strong>
            <div style={{ fontSize: 13 }}>{b.text}</div>
          </div>
        ))}
      </div>
      {/* Отзывы */}
      <div style={{
        width: `calc(100% - ${BLOCK_SIDE_PADDING * 2}px)`,
        background: GRADIENT,
        borderRadius: borderRadius,
        margin: "0 auto 38px auto",
        boxShadow: "0 6px 20px rgba(150,175,205,0.1)",
        padding: `22px ${BLOCK_SIDE_PADDING}px 20px`
      }}>
        <h3 style={{ fontWeight: 700, textAlign: "center", fontSize: 20, color: NORA_COLOR }}>Отзывы будущих мам</h3>
        {REVIEWS.map((r, i) => (
          <div key={i} style={{ background: "#fff", borderRadius: 18, padding: "15px", marginTop: 10 }}>
            <div><strong>{r.name}</strong> <span style={{ color: "#1681f5" }}>{r.badge}</span></div>
            <div style={{ fontSize: 13, marginTop: 5 }}>{r.text}</div>
          </div>
        ))}
      </div>

      {/* Футер */}
      <div style={{
        width: `calc(100% - 40px)`,
        maxWidth,
        margin: "0 auto 20px auto",
        background: GRADIENT,
        borderRadius: 22,
        boxShadow: "0 -4px 14px rgba(155,175,205,0.06)",
        padding: 20
      }}>
        <div style={{ fontSize: 12, textAlign: "center", color: "#263540", fontWeight: 600 }}>
          Ташкент, Юнусабадский район, массив Кашгар 26
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 10, marginTop: 10 }}>
          <span>{IconPartner}</span><span>{IconContact}</span><span>{IconPolicy}</span>
        </div>
      </div>
    </div>
  );
};

export default Chat;
