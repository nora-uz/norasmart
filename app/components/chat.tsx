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

const THREAD_KEY = "nora_thread_id";

// --- Основные иконки ---
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

// --- Преимущества ---
const BENEFITS = [
  { emoji: "🩺", title: "Медицинская точность", text: "Советы основаны на NHS и адаптированы под ваш регион." },
  { emoji: "🤝", title: "Поддержка 24/7", text: "Ассистент всегда рядом, чтобы помочь и поддержать." },
  { emoji: "⏰", title: "Напоминания", text: "Следим, чтобы вы не забыли о приёмах, анализах, витаминах." },
  { emoji: "🔒", title: "Конфиденциальность", text: "Ваши данные остаются только у вас — без передачи сторонним." },
  { emoji: "⚡️", title: "Быстрые ответы", text: "Нора подскажет сразу, когда это нужно." },
];

// --- Отзывы ---
const REVIEWS = [
  { name: "Анна", badge: "2 месяц беременности", problem: "Токсикоз", text: "Nora Plus помогла справиться с тошнотой и подобрать питание." },
  { name: "Елена", badge: "5 месяц", problem: "Слабость", text: "Советы помогли выстроить режим и чувствовать себя энергичнее." },
  { name: "Ирина", badge: "6 месяц", problem: "Тревожность", text: "Теперь спокойна и уверена, поддержка Норы помогает каждый день." },
  { name: "Малика", badge: "8 месяц", problem: "Бессонница", text: "Сон наладился, советы обстановки и дыхания работают отлично." },
];

// --- Микро-функция бота ---
function splitBotTextTwoBlocks(text) {
  if (!text) return [];
  let cleaned = text.replace(/[*_]/g, "");
  const match = cleaned.match(/^([^.!?]+[.!?])\s*(.*)$/s);
  if (match) {
    return [{ text: match[1].trim(), bold: true }, { text: match[2].trim(), bold: false }];
  } else {
    return [{ text: cleaned, bold: true }];
  }
}

// --- Блок «Как работает Нора» ---
const HowItWorks = () => {
  const EXAMPLES = [
    { q: "Часто отекают ноги к вечеру.", a: "🦵 Отдыхайте с приподнятыми ногами и пейте воду. Если сильно беспокоит — обсудим!" },
    { q: "Болит спина и поясница.", a: "💆 Это из-за роста живота. Помогут лёгкие растяжки и отдых с подушкой между ног." },
    { q: "Плохо сплю последние дни.", a: "😴 Вечерняя прогулка и чашка тёплого молока помогут расслабиться." },
    { q: "Стал сухой живот и появляется зуд.", a: "🧴 Увлажняйте маслом или кремом утром и вечером — кожа будет мягче." },
    { q: "Чувствую тревогу без причины.", a: "🤗 Такое бывает. Подышим глубже и найдём способ снять напряжение." },
    { q: "После еды изжога.", a: "🔥 Ешьте понемногу и не ложитесь сразу. Тёплый йогурт или молоко снижают жжение." }
  ];

  const [step, setStep] = useState(0);
  const [phase, setPhase] = useState("q");
  const [q, setQ] = useState("");
  const [a, setA] = useState("");

  useEffect(() => {
    let t;
    if (phase === "q") {
      setQ(""); let i = 0;
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
        if (i > EXAMPLES[step].a.length) { clearInterval(t); setTimeout(() => setPhase("next"), 7000); }
      }, 17);
    } else if (phase === "next") {
      t = setTimeout(() => { setStep((s) => (s + 1) % EXAMPLES.length); setPhase("q"); }, 300);
    }
    return () => clearInterval(t);
  }, [phase, step]);

  const bubbleUser = (text) => (
    <div style={{
      alignSelf: "flex-end",
      background: "#fff",
      borderRadius: "19px 19px 4px 19px",
      padding: "20px 22px",
      marginBottom: 26,
      maxWidth: 400,
      textAlign: "right",
      fontSize: 15.5,
      lineHeight: 1.7,
      boxShadow: "0 1px 8px rgba(200,180,200,0.12)"
    }}>{text}</div>
  );

  const bubbleBot = (text) => (
    <div style={{
      alignSelf: "flex-start",
      background: "#f7fafd",
      borderRadius: "19px 19px 19px 4px",
      padding: "22px 24px",
      marginBottom: 26,
      maxWidth: 420,
      textAlign: "left",
      fontSize: 15.5,
      lineHeight: 1.7,
      boxShadow: "0 1px 8px rgba(200,180,200,0.12)"
    }}>{text}</div>
  );

  return (
    <div style={{
      width: `calc(100% - ${BLOCK_SIDE_PADDING * 2}px)`,
      maxWidth,
      margin: "0 auto 30px auto",
      background: GRADIENT,
      borderRadius: 22,
      boxShadow: "0 6px 20px rgba(150,175,205,0.1)",
      padding: "10px 0 20px 0",
      fontFamily: "'Manrope', Arial, Helvetica, sans-serif"
    }}>
      <div style={{ display: "flex", flexDirection: "column", padding: `0 ${BLOCK_SIDE_PADDING}px` }}>
        {q && bubbleUser(q)}
        {a && bubbleBot(a)}
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

// --- Главный компонент Chat ---
const Chat = () => {
  const [showWelcome, setShowWelcome] = useState(true);

  return (
    <div style={{ background: "#f8fdff", minHeight: "100vh", fontFamily: "'Manrope', Arial" }}>
      {showWelcome ? (
        <div style={{ padding: 20 }}>
          <h2 style={{ textAlign: "center", color: NORA_COLOR }}>Nora Plus</h2>
          <p style={{ textAlign: "center", maxWidth: 400, margin: "0 auto", color: NORA_COLOR }}>
            Ассистент для будущих мам: советы, напоминания и поддержка по стандартам NHS.
          </p>
          <HowItWorks />
          <div style={{ textAlign: "center" }}>
            <button
              onClick={() => setShowWelcome(false)}
              style={{
                background: BABY_GRADIENT,
                border: "none",
                borderRadius: 22,
                color: "#fff",
                fontSize: 17,
                fontWeight: 700,
                padding: "15px 40px",
                cursor: "pointer"
              }}
            >
              Начать пользоваться 🚀
            </button>
          </div>
        </div>
      ) : (
        <div style={{ textAlign: "center", paddingTop: 100, color: NORA_COLOR }}>
          Чат загружается…
        </div>
      )}
    </div>
  );
};

export default Chat;
