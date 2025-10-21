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

const BENEFITS = [
  { emoji: "🩺", title: "Медицинская точность", text: "Советы основаны на рекомендациях NHS и адаптированы под ваш регион." },
  { emoji: "🤝", title: "Поддержка 24/7", text: "Ассистент всегда рядом, чтобы помочь и поддержать в нужный момент." },
  { emoji: "⏰", title: "Напоминания и забота", text: "Следим за важными анализами, визитами и витаминами." },
  { emoji: "🔒", title: "Конфиденциальность", text: "Ваши данные надёжно защищены и никогда не передаются третьим лицам." },
  { emoji: "⚡️", title: "Мгновенные ответы", text: "Все советы — сразу и по делу, понятным языком." }
];
const REVIEWS = [
  { name: "Анна", badge: "2 месяц", problem: "Токсикоз", text: "Nora Plus помогла уменьшить тошноту и дала советы, которые реально работают." },
  { name: "Елена", badge: "4 месяц", problem: "Слабость", text: "После рекомендаций чувствую себя намного лучше — режим и витамины помогают!" },
  { name: "Мария", badge: "7 месяц", problem: "Бессонница", text: "Теперь сплю спокойно, советы по питанию и отдыху действительно сработали." },
  { name: "Шахноза", badge: "5 месяц", problem: "Настроение", text: "Ободряющие слова и забота от Норы помогли вернуть спокойствие." }
];

const HowItWorks = () => {
  const EXAMPLES = [
    { q: "Можно ли пить кофе во время беременности?", a: "☕ Да, можно, но максимум 1–2 чашки в день. Лучше чередовать с травяными чаями и следить за самочувствием." },
    { q: "Часто волнуюсь без причины.", a: "🤗 Это естественно! Беременность усиливает эмоции. Попробуйте дыхательные практики и прогулки — расскажу, какие лучше подойдут." },
    { q: "Болит спина и поясница.", a: "💆 Это распространено у будущих мам. Отдыхайте лёжа на боку, не поднимайте тяжестей и делайте лёгкую гимнастику." },
    { q: "Проблемы со сном.", a: "😴 Проветривайте комнату и ложитесь в одно время. Помогаю подобрать простые способы заснуть быстрее." },
    { q: "Можно ли заниматься спортом?", a: "🏃 Да, если нет противопоказаний. Самое полезное — плавание, лёгкая йога и прогулки." },
  ];
  const [step, setStep] = useState(0);
  const [phase, setPhase] = useState("q");
  const [q, setQ] = useState("");
  const [a, setA] = useState("");
  useEffect(() => {
    let t;
    if (phase === "q") {
      setQ("");
      let i = 0; t = setInterval(() => { setQ(EXAMPLES[step].q.slice(0, i + 1)); i++; if (i > EXAMPLES[step].q.length) { clearInterval(t); setTimeout(() => setPhase("a"), 300); }}, 35);
    } else if (phase === "a") {
      setA(""); let i = 0; t = setInterval(() => { setA(EXAMPLES[step].a.slice(0, i + 1)); i++; if (i > EXAMPLES[step].a.length) { clearInterval(t); setTimeout(() => setPhase("next"), 7000); }}, 18);
    } else if (phase === "next") {
      t = setTimeout(() => { setStep((s) => (s + 1) % EXAMPLES.length); setPhase("q"); }, 300);
    }
    return () => clearTimeout(t);
  }, [phase, step]);

  const bubbleUser = (text) => (<div style={{ alignSelf: "flex-end", background: "#fff", borderRadius: "19px 19px 4px 19px",
    padding: "22px 25px", marginBottom: 32, textAlign: "right", fontSize: 16, lineHeight: 1.7,
    boxShadow: "0 1px 8px rgba(200,180,200,0.12)" }}>{text}</div>);
  const bubbleBot = (text) => (<div style={{ alignSelf: "flex-start", background: "#f7fafd", borderRadius: "19px 19px 19px 4px",
    padding: "22px 25px", marginBottom: 32, textAlign: "left", fontSize: 16, lineHeight: 1.7,
    boxShadow: "0 1px 8px rgba(200,180,200,0.12)" }}>{text}</div>);

  return (
    <div style={{ width: `calc(100% - ${BLOCK_SIDE_PADDING * 2}px)`, maxWidth, margin: "0 auto 38px auto",
      background: GRADIENT, borderRadius: 22, padding: "24px 0 20px", boxShadow: "0 6px 20px rgba(150,175,205,0.1)" }}>
      <div style={{ display: "flex", flexDirection: "column", padding: "0 16px" }}>
        {q && bubbleUser(q)}
        {a && bubbleBot(a)}
      </div>
      <div style={{ textAlign: "center", fontSize: 13, color: "#7b8590" }}>Просто спросите — Нора ответит!</div>
    </div>
  );
};

const Footer = () => (
  <div style={{ width: `calc(100% - 40px)`, maxWidth, margin: "0 auto",
    background: GRADIENT, borderRadius: 22, padding: "22px 20px",
    boxShadow: "0 -4px 14px rgba(155,175,205,0.06)", display: "flex",
    flexDirection: "column", alignItems: "center", gap: 18 }}>
    <div style={{ fontSize: 12, color: "#263540", fontWeight: 600 }}>Ташкент, Юнусабад, массив Кашгар 26</div>
    <div style={{ display: "flex", gap: 11, width: "100%", justifyContent: "center" }}>
      <a href="#" style={{ background: "#fff", width: "63%", borderRadius: 13, color: "#495062",
        fontSize: 14, padding: "9px 0", textDecoration: "none", border: "1px solid #e1e9f5",
        display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}>{IconPartner} Стать партнёром</a>
      <a href="#" style={{ background: "#fff", width: "37%", borderRadius: 13, color: "#495062",
        fontSize: 14, padding: "9px 0", textDecoration: "none", border: "1px solid #e1e9f5",
        display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}>{IconContact} Контакты</a>
    </div>
    <a href="#" style={{ background: "#fff", padding: "7px 0", width: "100%", borderRadius: 14,
      color: "#556", fontSize: 14, textDecoration: "none", border: "1px solid #e1e9f5",
      display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>{iconPolicy} Политика конфиденциальности</a>
    <div style={{ fontSize: 12, color: "#8a97a0" }}>© {new Date().getFullYear()} Nora Plus</div>
  </div>
);

const WhyNoraBlock = ({ title, items }) => (
  <div style={{ width: `calc(100% - ${BLOCK_SIDE_PADDING * 2}px)`, maxWidth, margin: "0 auto 38px auto",
    background: GRADIENT, borderRadius: borderRadius, boxShadow: "0 6px 20px rgba(150,175,205,0.1)",
    fontFamily: "'Manrope', Arial, sans-serif" }}>
    <div style={{ padding: "21px 0 20px 0" }}>
      <div style={{ fontWeight: 700, fontSize: 20, color: NORA_COLOR, marginBottom: 20, textAlign: "center" }}>{title}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: CARD_GAP, padding: `0 ${BLOCK_SIDE_PADDING}px` }}>
        {items.map(({ emoji, title, text }, idx) => (
          <div key={idx} style={{ background: "#fff", borderRadius: 18, boxShadow: "0 2px 18px rgba(150,180,220,0.07)",
            padding: "22px 16px", textAlign: "left", position: "relative" }}>
            <span style={{ position: "absolute", right: 12, top: 12, fontSize: 54, opacity: 0.1 }}>{emoji}</span>
            <div style={{ fontWeight: 700, fontSize: 16, color: NORA_COLOR, marginBottom: 6 }}>{title}</div>
            <div style={{ fontSize: 14, color: "#3a3a3a", lineHeight: 1.65 }}>{text}</div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const Chat = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  const handleShare = () => window.alert("Поделиться недоступно в этой среде");
  if (showWelcome)
    return (
      <div style={{ fontFamily: "'Manrope', Arial, sans-serif", background: "#f8fdff", width: "100vw", minHeight: "100vh" }}>
        {/* Панель */}
        <div style={{ width: `calc(100% - ${PANEL_SIDE_PADDING * 2}px)`, maxWidth, minHeight: panelHeight,
          background: GRADIENT, color: NORA_COLOR, margin: "20px auto 0 auto",
          display: "flex", alignItems: "center", justifyContent: "space-between", borderRadius: borderRadius,
          paddingLeft: PANEL_SIDE_PADDING, paddingRight: PANEL_SIDE_PADDING }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
            <span style={{ fontWeight: 800, fontSize: 19 }}>Nora Plus</span>
            <span style={{ fontWeight: 400, fontSize: 13, color: "#565656" }}>Ассистент для будущих мам</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button style={{ background: "transparent", border: "none", cursor: "pointer" }} onClick={handleShare}>
              <img src={ICONS.share} alt="Share" style={{ width: ICON_SIZE, height: ICON_SIZE, filter: filterNora }} />
            </button>
            <button style={{ background: "transparent", border: "none", cursor: "pointer" }}>
              <img src={ICONS.telegram} alt="Telegram" style={{ width: ICON_SIZE, height: ICON_SIZE, filter: filterNora }} />
            </button>
          </div>
        </div>
        {/* Видео */}
        <div style={{ textAlign: "center", marginTop: 30 }}>
          <video src="/nora.mp4" style={{ width: "100%", maxWidth: videoMaxWidth, borderRadius: 24 }}
            autoPlay playsInline muted loop preload="auto" />
        </div>
        {/* Текст и кнопка */}
        <div style={{ maxWidth, margin: "0 auto", padding: "30px 20px", textAlign: "center" }}>
          <h2 style={{ fontWeight: 700, fontSize: 22, color: NORA_COLOR }}>Ждёте малыша? Я помогу!</h2>
          <p style={{ fontSize: 15, lineHeight: 1.7, color: NORA_COLOR }}>
            Я сопровождаю будущих мам с первого месяца до родов — отвечаю на вопросы, слежу за самочувствием и напоминаю о важных делах.
          </p>
          <button style={{
            background: BABY_GRADIENT, color: "#fff", border: "none", borderRadius: borderRadius,
            fontWeight: 700, fontSize: 17, padding: "15px 30px", cursor: "pointer",
            marginTop: 20, boxShadow: "0 2px 18px rgba(200,128,140,0.09)"
          }} onClick={() => setShowWelcome(false)}>Начать пользоваться</button>
          <p style={{ fontSize: 13, color: "#7c8792", marginTop: 10 }}>Попробуйте — это быстро и бесплатно</p>
        </div>

        {/* Блоки */}
        <HowItWorks />
        <WhyNoraBlock title="Почему Nora Plus?" items={BENEFITS} />
        <WhyNoraBlock title="Отзывы будущих мам" items={REVIEWS.map(r => ({ emoji: "💬", title: `${r.name}, ${r.badge}`, text: r.text }))} />
        <Footer />
      </div>
    );

  return <div>Здесь будет чат после нажатия «Начать»</div>;
};

export default Chat;
