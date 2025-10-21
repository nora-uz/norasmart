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

const iconPolicy = (
  <svg width="17" height="17" fill="none" viewBox="0 0 20 20">
    <rect x="4" y="7" width="12" height="9" rx="2.1" stroke="#5a6573" strokeWidth="1.4"/>
    <path d="M7,7V5a3,3 0 0,1 6,0v2" stroke="#5a6573" strokeWidth="1.4" fill="none"/>
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
  { name: "Анна", badge: "2 месяц беременности", problem: "Токсикоз", text: "Nora Plus подсказала, как справиться с утренней тошнотой. Благодаря рекомендациям по питанию и режиму дня симптомы стали гораздо легче." },
  { name: "Елена", badge: "4 месяц беременности", problem: "Слабость и усталость", text: "Теперь я знаю, какие витамины нужно пить, сколько отдыхать и как выстроить день. Чувствую себя значительно лучше!" },
  { name: "Шахноза", badge: "5 месяц беременности", problem: "Плохое настроение", text: "Благодаря советам и поддержке Nora Plus моё настроение заметно улучшилось." },
  { name: "Мария", badge: "7 месяц беременности", problem: "Бессонница", text: "Советы Nora Plus помогли спать лучше и ждать малыша спокойно." }
];

const WhyNoraBlock = () => (
  <div style={{
    width: `calc(100% - ${BLOCK_SIDE_PADDING * 2}px)`,
    maxWidth,
    margin: "0 auto 38px auto",
    background: GRADIENT,
    borderRadius: borderRadius,
    boxShadow: "0 6px 20px 0 rgba(150, 175, 205, 0.10)",
    fontFamily: "'Manrope', Arial, sans-serif"
  }}>
    <div style={{ padding: "21px 0 20px 0" }}>
      <div style={{
        fontWeight: 700,
        fontSize: 20,
        color: NORA_COLOR,
        marginBottom: 20,
        textAlign: "center"
      }}>Почему Nora Plus?</div>
      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: CARD_GAP,
        padding: `0 ${BLOCK_SIDE_PADDING}px`
      }}>
        {BENEFITS.map(({ emoji, title, text }, idx) => (
          <div key={idx} style={{
            background: "#fff", borderRadius: 18, boxShadow: "0 2px 18px rgba(150,180,220,0.07)",
            padding: "22px 16px", textAlign: "left", position: "relative"
          }}>
            <span style={{
              position: "absolute", right: 12, top: 8,
              fontSize: 54, opacity: 0.1
            }}>{emoji}</span>
            <div style={{ fontWeight: 700, fontSize: 16, color: NORA_COLOR, marginBottom: 6 }}>{title}</div>
            <div style={{ fontSize: 14, color: "#3a3a3a", lineHeight: 1.65 }}>{text}</div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const HowItWorks = () => {
  const EXAMPLES = [
    {
      q: "Можно ли пить кофе во время беременности?",
      a: "☕ Да, можно, но соблюдайте умеренность. Безопасно 1–2 чашки в день (до 200 мг кофеина), чтобы избежать риска для малыша. Лучше чередовать с напитками без кофеина или травяными чаями."
    },
    {
      q: "Я часто волнуюсь без причины.",
      a: "🤗 Это чувство знакомо многим мамам. Беременность делает нас чувствительнее, и тревога естественна. Попробуйте дыхательные упражнения и прогулки. Если тревога сильная, я подскажу, как справиться без вреда для малыша."
    },
    {
      q: "Болит спина и поясница. Что делать?",
      a: "💆 Это естественно из-за изменения центра тяжести. Отдыхайте лёжа на боку, используйте подушку для беременных, не поднимайте тяжести. При необходимости расскажу, какие мягкие упражнения помогут облегчить боль."
    },
    {
      q: "Как улучшить сон?",
      a: "😴 Проветривайте комнату, ложитесь в одно и то же время. Помогают лёгкие вечерние прогулки и дыхание перед сном. Если усталость накапливается — поделитесь, подскажу, как восстановиться."
    },
    {
      q: "Можно ли заниматься спортом во время беременности?",
      a: "🏃 Да! Йога, плавание и прогулки отлично подходят, если нет противопоказаний. Главное — не перенапрягаться, отдыхать и слушать своё тело. При желании помогу подобрать безопасный план."
    }
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
        if (i > EXAMPLES[step].q.length) { clearInterval(t); setTimeout(() => setPhase("a"), 400); }
      }, 35);
    } else if (phase === "a") {
      setA("");
      let i = 0;
      t = setInterval(() => {
        setA(EXAMPLES[step].a.slice(0, i + 1));
        i++;
        if (i > EXAMPLES[step].a.length) { clearInterval(t); setTimeout(() => setPhase("next"), 6500); }
      }, 18);
    } else if (phase === "next") {
      t = setTimeout(() => {
        setStep((s) => (s + 1) % EXAMPLES.length);
        setPhase("q");
      }, 400);
    }
    return () => clearInterval(t);
  }, [phase, step]);

  const bubbleUser = (text) => (
    <div style={{
      alignSelf: "flex-end",
      background: "#fff",
      borderRadius: "19px 19px 4px 19px",
      padding: "22px 25px",
      marginBottom: 32,
      maxWidth: 420,
      minWidth: 100,
      textAlign: "right",
      boxShadow: "0 1px 8px rgba(200,180,200,0.12)",
      fontSize: 16,
      lineHeight: 1.75
    }}>{text}</div>
  );

  const bubbleBot = (text) => (
    <div style={{
      alignSelf: "flex-start",
      background: "#f7fafd",
      borderRadius: "19px 19px 19px 4px",
      padding: "22px 25px",
      marginBottom: 32,
      maxWidth: 420,
      minWidth: 100,
      textAlign: "left",
      boxShadow: "0 1px 8px rgba(200,180,200,0.12)",
      fontSize: 16,
      lineHeight: 1.75
    }}>{text}</div>
  );

  return (
    <div style={{
      width: `calc(100% - ${BLOCK_SIDE_PADDING * 2}px)`,
      maxWidth,
      margin: "0 auto 38px auto",
      background: GRADIENT,
      borderRadius: 22,
      boxShadow: "0 6px 20px rgba(150,175,205,0.10)",
      padding: "24px 0 20px",
      fontFamily: "'Manrope', Arial, sans-serif"
    }}>
      <div style={{ display: "flex", flexDirection: "column", padding: "0 16px" }}>
        {q && bubbleUser(q)}
        {a && bubbleBot(a)}
      </div>
      <div style={{ textAlign: "center", fontSize: 13, color: "#7b8590" }}>
        Просто задайте вопрос — Нора найдёт ответ!
      </div>
    </div>
  );
};

const Footer = () => (
  <div style={{
    width: `calc(100% - 40px)`,
    maxWidth,
    margin: "0 auto",
    background: GRADIENT,
    borderRadius: 22,
    boxShadow: "0 -4px 14px rgba(155,175,205,0.06)",
    fontFamily: "'Manrope', Arial, sans-serif",
    padding: "22px 20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 18
  }}>
    <div style={{ fontSize: 12, color: "#263540", fontWeight: 600, textAlign: "center" }}>
      Ташкент, Юнусабадский район, массив Кашгар 26
    </div>
    <div style={{ display: "flex", gap: 11, width: "100%", justifyContent: "center" }}>
      <a href="#" style={{
        background: "#fff", width: "63%", borderRadius: 13, color: "#495062",
        fontSize: 14, padding: "9px 0", textDecoration: "none",
        border: "1px solid #e1e9f5", display: "flex", alignItems: "center",
        justifyContent: "center", gap: 7
      }}>{IconPartner} Стать партнёром</a>
      <a href="#" style={{
        background: "#fff", width: "37%", borderRadius: 13, color: "#495062",
        fontSize: 14, padding: "9px 0", textDecoration: "none",
        border: "1px solid #e1e9f5", display: "flex", alignItems: "center",
        justifyContent: "center", gap: 7
      }}>{IconContact} Контакты</a>
    </div>
    <a href="#" style={{
      background: "#fff", padding: "7px 0", width: "100%", borderRadius: 14,
      color: "#556", fontWeight: 400, fontSize: 14, textDecoration: "none",
      border: "1px solid #e1e9f5", textAlign: "center",
      display: "flex", alignItems: "center", justifyContent: "center", gap: 8
    }}>
      {iconPolicy} Политика конфиденциальности
    </a>
    <div style={{ fontSize: 12, color: "#8a97a0", textAlign: "center" }}>
      © {new Date().getFullYear()} Nora Plus — забота и поддержка будущих мам
    </div>
  </div>
);

export { WhyNoraBlock, HowItWorks, Footer };
