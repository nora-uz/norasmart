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

const IconPartner = (
  <svg width="18" height="18" fill="none" viewBox="0 0 20 20">
    <circle cx="10" cy="6.5" r="3.3" stroke="#5a6573" strokeWidth="1.5" />
    <path
      d="M2.8 16c.9-2.5 3.4-4.2 7.2-4.2s6.2 1.7 7.2 4.2"
      stroke="#5a6573"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);
const IconContact = (
  <svg width="18" height="18" fill="none" viewBox="0 0 20 20">
    <rect
      x="2.8"
      y="3.5"
      width="14.4"
      height="11"
      rx="2.2"
      stroke="#5a6573"
      strokeWidth="1.5"
    />
    <path
      d="M3.5 4l6.5 6.1c.3.2.8.2 1.1 0L17 4"
      stroke="#5a6573"
      strokeWidth="1.5"
    />
  </svg>
);

const IconPolicy = (
  <svg width="15" height="15" viewBox="0 0 20 20" fill="none">
    <path
      d="M10 1.5L3 4.5V9C3 13.5 6.2 17.4 10 18.5C13.8 17.4 17 13.5 17 9V4.5L10 1.5Z"
      stroke="#5a6573"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const BENEFITS = [
  {
    emoji: "🩺",
    title: "Медицинская точность",
    text: "Советы основаны на рекомендациях британской службы NHS и адаптированы под ваш регион.",
  },
  {
    emoji: "🤝",
    title: "Поддержка 24/7",
    text: "Ассистент всегда на связи для заботы и помощи в любой ситуации.",
  },
  {
    emoji: "⏰",
    title: "Напоминания о важных делах",
    text: "Следим, чтобы вы ничего не забыли — анализы, витамины, визиты.",
  },
  {
    emoji: "🔒",
    title: "Конфиденциальность",
    text: "Личные данные остаются только у вас — никакой передачи сторонним.",
  },
  {
    emoji: "⚡️",
    title: "Быстрые решения",
    text: "Полезные советы и поддержка сразу, когда это нужно.",
  },
];

const HowItWorks = () => {
  const EXAMPLES = [
    {
      q: "Я часто волнуюсь без причины.",
      a: "🤗 Это очень распространено у беременных! Эмоции усиливаются из-за гормонов. Прогулки на свежем воздухе, дыхательные упражнения и доверительные разговоры с близкими — хорошие помощники. Сильно беспокоит — расскажу, как снизить тревожность.",
    },
    {
      q: "Болит спина и поясница.",
      a: "💆 Чаще всего это нормальная реакция организма на изменение центра тяжести. Помогает отдых на боку с подушкой между ног, отказ от тяжелых сумок и плавные растяжки. Если боли сильные — скажи, подскажу, что ещё важно проверить.",
    },
    {
      q: "Плохо сплю последние дни.",
      a: "😴 Лёгкие вечерние прогулки, проветривание комнаты и комфортная подушка часто решают проблему. Если проблемы с засыпанием затяжные, обсуди это со мной — найдем подходящий ритуал отдыха!",
    },
    {
      q: "Можно ли заниматься спортом?",
      a: "🏃‍♀️ Движение всегда полезно, если нет противопоказаний. Лучше остановиться на специальных занятиях для беременных: йога, плавание, пешие прогулки. Хочешь — предложу простой комплекс лёгких упражнений.",
    },
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
        if (i > EXAMPLES[step].q.length) {
          clearInterval(t);
          setTimeout(() => setPhase("a"), 350);
        }
      }, 35);
    } else if (phase === "a") {
      setA("");
      let i = 0;
      t = setInterval(() => {
        setA(EXAMPLES[step].a.slice(0, i + 1));
        i++;
        if (i > EXAMPLES[step].a.length) {
          clearInterval(t);
          setTimeout(() => setPhase("next"), 6900);
        }
      }, 17);
    } else if (phase === "next") {
      t = setTimeout(() => {
        setStep((s) => (s + 1) % EXAMPLES.length);
        setPhase("q");
      }, 350);
    }
    return () => clearInterval(t);
  }, [phase, step]);

  const bubbleUser = (text) => (
    <div
      style={{
        alignSelf: "flex-end",
        background: "#fff",
        borderRadius: "19px 19px 4px 19px",
        padding: "20px 22px",
        marginBottom: 26,
        maxWidth: 400,
        textAlign: "right",
        fontSize: 15.5,
        lineHeight: 1.7,
        boxShadow: "0 1px 8px rgba(200,180,200,0.12)",
      }}
    >
      {text}
    </div>
  );

  const bubbleBot = (text) => (
    <div
      style={{
        alignSelf: "flex-start",
        background: "#f7fafd",
        borderRadius: "19px 19px 19px 4px",
        padding: "22px 24px",
        marginBottom: 26,
        maxWidth: 420,
        textAlign: "left",
        fontSize: 15.5,
        lineHeight: 1.7,
        boxShadow: "0 1px 8px rgba(200,180,200,0.12)",
      }}
    >
      {text}
    </div>
  );

  return (
    <div
      style={{
        width: `calc(100% - ${BLOCK_SIDE_PADDING * 2}px)`,
        maxWidth,
        margin: "0 auto 38px auto",
        background: GRADIENT,
        borderRadius: 22,
        boxShadow: "0 6px 20px rgba(150,175,205,0.1)",
        padding: "21px 0 20px 0",
        fontFamily: "'Manrope', Arial, Helvetica, sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: `0 ${BLOCK_SIDE_PADDING}px`,
        }}
      >
        {q && bubbleUser(q)}
        {a && bubbleBot(a)}
      </div>
      <div
        style={{
          fontSize: 13,
          color: "#7b8590",
          textAlign: "center",
          marginTop: 8,
        }}
      >
        Просто задайте вопрос — Нора найдёт ответ!
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
      boxSizing: "border-box",
      fontFamily: "'Manrope', Arial, Helvetica, sans-serif",
      padding: 22,
      display: "flex",
      flexDirection: "column",
      gap: 18,
      alignItems: "center",
    }}
  >
    <div
      style={{
        fontSize: 12,
        color: "#263540",
        fontWeight: 600,
        textAlign: "center",
        width: "100%",
      }}
    >
      Ташкент, Юнусабадский район, массив Кашгар 26
    </div>

    <div
      style={{
        display: "flex",
        gap: 11,
        width: "100%",
        justifyContent: "center",
      }}
    >
      <a
        href="#"
        style={{
          background: "#fff",
          width: "63%",
          borderRadius: 13,
          color: "#495062",
          fontWeight: 400,
          fontSize: 14,
          padding: "9px 0",
          textDecoration: "none",
          textAlign: "center",
          border: "1px solid #e1e9f5",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 7,
        }}
      >
        {IconPartner} Стать партнёром
      </a>

      <a
        href="#"
        style={{
          background: "#fff",
          width: "37%",
          borderRadius: 13,
          color: "#495062",
          fontWeight: 400,
          fontSize: 14,
          padding: "9px 0",
          textDecoration: "none",
          textAlign: "center",
          border: "1px solid #e1e9f5",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 7,
        }}
      >
        {IconContact} Контакты
      </a>
    </div>

    <a
      href="#"
      style={{
        background: "#fff",
        width: "100%",
        borderRadius: 13,
        color: "#495062",
        fontWeight: 400,
        fontSize: 14,
        padding: "9px 0",
        textDecoration: "none",
        border: "1px solid #e1e9f5",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 7,
      }}
    >
      {IconPolicy} Политика конфиденциальности
    </a>

    <div
      style={{
        marginTop: 8,
        fontSize: 12,
        color: "#8a97a0",
        textAlign: "center",
        width: "100%",
      }}
    >
      © {new Date().getFullYear()} Nora Plus — забота и поддержка будущих мам
    </div>
  </div>
);

export default function NoraPage() {
  return (
    <div style={{ fontFamily: "'Manrope', Arial, sans-serif" }}>
      <HowItWorks />
      <Footer />
    </div>
  );
}
