"use client";
import React, { useState, useEffect, useRef } from "react";

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
const ICON_SIZE = 23;

const NORA_COLOR = "#2e2e2e";
const BORDER_RADIUS = 22;
const BLOCK_PADDING = 24; // новый общий отступ по бокам (равный для всех блоков!)
const MAX_WIDTH = 560;
const GRADIENT = "linear-gradient(90deg, #eff5fe 0%, #e5e8ed 100%)";
const BABY_GRADIENT = "linear-gradient(90deg, #e39290 0%, #efb1b6 100%)";
const INPUT_HEIGHT = 68;
const CARD_GAP = 10;

// --- Панель с кнопками ---
const HeaderPanel = ({ onClearChat }: { onClearChat?: () => void }) => (
  <div style={{
    width: `calc(100% - 30px)`,
    maxWidth: MAX_WIDTH,
    background: GRADIENT,
    margin: "20px auto 0 auto",
    borderRadius: BORDER_RADIUS,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "5px 15px", // старый отступ возвращён!
    fontFamily: "'Manrope', sans-serif"
  }}>
    <div style={{ flex: 1 }}>
      <div style={{ fontWeight: 800, fontSize: 19, marginBottom: 5 }}>Nora Plus</div>
      <div style={{ fontSize: 13, color: "#555" }}>Ассистент для будущих мам</div>
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <img onClick={() => window?.navigator?.share?.({ title: "Nora Plus", url: window.location.href })} src={ICONS.share} style={{ width: ICON_SIZE, height: ICON_SIZE, cursor: "pointer" }} alt="Share" />
      <img onClick={() => window.open("https://t.me/norasmart", "_blank")} src={ICONS.telegram} style={{ width: ICON_SIZE, height: ICON_SIZE, cursor: "pointer" }} alt="Telegram" />
      <img onClick={onClearChat} src={ICONS.trash} style={{ width: ICON_SIZE, height: ICON_SIZE, cursor: "pointer" }} alt="Trash" />
    </div>
  </div>
);

// --- Footer с кнопками ---
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

// --- Почему Нора ---
const BENEFITS = [
  { emoji: "🩺", title: "Медицинская точность", text: "Советы основаны на рекомендациях британской службы NHS и адаптированы под ваш регион." },
  { emoji: "🤝", title: "Поддержка 24/7", text: "Ассистент всегда на связи для заботы и помощи в любой ситуации." },
  { emoji: "⏰", title: "Напоминания о важных делах", text: "Следим, чтобы вы ничего не забыли — анализы, витамины, визиты." },
  { emoji: "🔒", title: "Конфиденциальность", text: "Личные данные остаются только у вас — никакой передачи сторонним." },
  { emoji: "⚡️", title: "Быстрые решения", text: "Полезные советы и поддержка сразу, когда это нужно." },
];

const WhyNoraBlock = () => (
  <div style={{
    width: `calc(100% - ${BLOCK_PADDING * 2}px)`,
    maxWidth: MAX_WIDTH,
    margin: "0 auto 38px auto",
    background: GRADIENT,
    borderRadius: BORDER_RADIUS,
    boxShadow: "0 6px 20px rgba(150,175,205,0.1)",
    padding: `22px ${BLOCK_PADDING}px 20px ${BLOCK_PADDING}px`,
    fontFamily: "'Manrope', sans-serif"
  }}>
    <h3 style={{ textAlign: "center", fontSize: 20, color: NORA_COLOR, marginBottom: 20 }}>Почему Nora Plus?</h3>
    {BENEFITS.map(({ emoji, title, text }, idx) => (
      <div
        key={idx}
        style={{
          position: "relative",
          background: "#fff",
          borderRadius: 18,
          boxShadow: "0 2px 14px rgba(160,180,210,0.07)",
          padding: "15px 10px", // внутренние отступы уменьшены!
          marginBottom: 10
        }}
      >
        <span style={{
          position: "absolute",
          right: 12,
          top: 14,
          fontSize: 58,
          opacity: 0.14
        }}>{emoji}</span>
        <div>
          <div style={{ fontWeight: 700, marginBottom: 7 }}>{title}</div>
          <div style={{ fontSize: 13, color: "#3a3a3a", lineHeight: 1.6 }}>{text}</div>
        </div>
      </div>
    ))}
  </div>
);

// --- Отзывы ---
const REVIEWS = [
  { name: "Анна", badge: "2 месяц беременности", text: "Nora Plus подсказала, как справиться с утренней тошнотой, благодаря советам по питанию стало легче." },
  { name: "Елена", badge: "4 месяц беременности", text: "Теперь я знаю, когда сдавать анализы и какие витамины пить. Всё под контролем." },
  { name: "Ирина", badge: "5 месяц беременности", text: "Успокоилась: ежедневно получаю поддержку и рекомендации." },
  { name: "Мария", badge: "7 месяц беременности", text: "Благодаря советам Nora Plus я лучше сплю и чувствую уверенность!" },
];
const ReviewBlock = () => (
  <div style={{
    width: `calc(100% - ${BLOCK_PADDING * 2}px)`,
    maxWidth: MAX_WIDTH,
    margin: "0 auto 38px auto",
    background: GRADIENT,
    borderRadius: BORDER_RADIUS,
    boxShadow: "0 6px 20px rgba(150,175,205,0.1)",
    padding: `22px ${BLOCK_PADDING}px 20px ${BLOCK_PADDING}px`,
    fontFamily: "'Manrope', sans-serif"
  }}>
    <h3 style={{ textAlign: "center", fontSize: 20, color: NORA_COLOR, marginBottom: 20 }}>Отзывы будущих мам</h3>
    {REVIEWS.map(({ name, badge, text }, idx) => (
      <div key={idx} style={{
        background: "#fff",
        borderRadius: 16,
        boxShadow: "0 2px 14px rgba(160,180,210,0.07)",
        padding: "15px 10px", // уменьшены внутренние отступы
        marginBottom: 10
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 7 }}>
          <span style={{ fontWeight: 700, fontSize: 15 }}>{name}</span>
          <span style={{
            background: "#f3f7fe",
            color: "#1681f5",
            borderRadius: 12,
            padding: "3px 8px",
            fontSize: 13
          }}>{badge}</span>
        </div>
        <div style={{ fontSize: 13, color: "#3a3a3a", lineHeight: 1.6 }}>{text}</div>
      </div>
    ))}
  </div>
);

// --- Как работает Нора (легче, бесконечно) ---
const bubbleStyle = (align = "right") => ({
  alignSelf: align === "right" ? 'flex-end' : 'flex-start',
  background: "#fff",
  borderRadius: 19,
  padding: align === "right" ? "12px 18px" : "14px 18px",
  marginBottom: 16,
  maxWidth: 370,
  textAlign: "left" as const,
  lineHeight: "1.6",
  boxShadow: "0 1px 8px rgba(200,180,200,0.1)",
  color: NORA_COLOR,
  fontSize: 15
});

const NoraHowItWorksBlock = () => {
  const EXAMPLES = [
    { q: "Можно ли пить кофе во время беременности?", a: "☕ Конечно, но не больше 1-2 чашек в день и лучше без сахара." },
    { q: "Я часто переживаю без причины.", a: "🤗 Это естественно. Я помогу успокоиться и понять, что нормально, а когда лучше обратиться к врачу." },
    { q: "Болят ноги и поясница.", a: "🦵 Это распространено! Покажу упражнения и советы для облегчения." },
    { q: "Плохо сплю.", a: "😴 Попробуйте лёгкий перекус перед сном, дыхательные техники и комфортную позу на боку." },
    { q: "Какие витамины принимать?", a: "💊 Помогу подобрать подходящие витамины и напомню, когда их принимать." },
    { q: "Можно ли летать?", a: "✈️ Если беременность протекает спокойно, перелёты до 30 недели безопасны, но уточните у врача." },
  ];
  const [step, setStep] = useState(0);
  const [phase, setPhase] = useState("typeQ");
  const [q, setQ] = useState("");
  const [a, setA] = useState("");

  useEffect(() => {
    if (phase === "typeQ") {
      setQ("");
      let i = 0;
      const id = setInterval(() => {
        setQ(EXAMPLES[step].q.slice(0, i + 1));
        i++;
        if (i > EXAMPLES[step].q.length) {
          clearInterval(id);
          setTimeout(() => setPhase("typeA"), 300);
        }
      }, 60);
      return () => clearInterval(id);
    }
    if (phase === "typeA") {
      setA("");
      let i = 0;
      const id = setInterval(() => {
        setA(EXAMPLES[step].a.slice(0, i + 1));
        i++;
        if (i > EXAMPLES[step].a.length) {
          clearInterval(id);
          setTimeout(() => setPhase("next"), 6500);
        }
      }, 35);
      return () => clearInterval(id);
    }
    if (phase === "next") {
      const timer = setTimeout(() => {
        setStep((step + 1) % EXAMPLES.length);
        setQ("");
        setA("");
        setPhase("typeQ");
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [phase, step]);

  return (
    <div style={{
      width: `calc(100% - ${BLOCK_PADDING * 2}px)`,
      maxWidth: MAX_WIDTH,
      margin: "0 auto 38px auto",
      background: GRADIENT,
      borderRadius: BORDER_RADIUS,
      boxShadow: "0 6px 20px rgba(150,175,205,0.1)",
      padding: `22px ${BLOCK_PADDING}px 20px ${BLOCK_PADDING}px`
    }}>
      <h3 style={{ textAlign: "center", fontSize: 20, color: NORA_COLOR }}>Как работает Nora?</h3>
      <div style={{ height: 25 }} />
      <div style={{ display: "flex", flexDirection: "column" }}>
        {q && <div style={bubbleStyle("right")}>{q}<span style={{ opacity: 0.2 }}>{phase === "typeQ" && "|"}</span></div>}
        {a && <div style={bubbleStyle("left")}>{a}<span style={{ opacity: 0.2 }}>{phase === "typeA" && "|"}</span></div>}
      </div>
      <div style={{ textAlign: "center", color: "#7b8590", fontSize: 13, marginTop: 8 }}>Нора помогает и отвечает сразу</div>
    </div>
  );
};

// --- Главный компонент ---
const Chat = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [msg, setMsg] = useState("");
  const [chat, setChat] = useState<{ text: string; sender: "user" | "bot" }[]>([]);
  const endChat = useRef<HTMLDivElement>(null);
  useEffect(() => { if (endChat.current) endChat.current.scrollIntoView({ behavior: "smooth" }); }, [chat]);
  const send = () => {
    if (!msg.trim()) return;
    setChat([...chat, { text: msg, sender: "user" }]);
    setTimeout(() => {
      setChat(prev => [...prev, { text: "Nora отвечает на ваш вопрос!", sender: "bot" }]);
      setMsg("");
    }, 1000);
  };
  return (
    <div style={{ background: "#f8fdff", minHeight: "100vh" }}>
      <HeaderPanel onClearChat={() => setChat([])} />
      {showWelcome ? (
        <>
          <div style={{ textAlign: "center", marginTop: 20 }}>
            <video src="/nora.mp4" style={{ width: "100%", maxWidth: 320, borderRadius: 22 }} autoPlay muted loop playsInline preload="auto" />
          </div>
          <div style={{ marginTop: 24, textAlign: "center" }}>
            <div style={{ fontSize: 22, color: NORA_COLOR, marginBottom: 12 }}>Ждёте малыша? Я помогу!</div>
            <div style={{ fontWeight: 400, color: NORA_COLOR, fontSize: 15, lineHeight: 1.75, padding: "0 34px" }}>
              Я помогаю будущим мамам: отвечаю на вопросы, напоминаю о важных делах, слежу за самочувствием и поддерживаю!
            </div>
          </div>
          <div style={{ textAlign: "center", marginTop: 36 }}>
            <button onClick={() => setShowWelcome(false)} style={{
              background: BABY_GRADIENT,
              border: "none",
              borderRadius: BORDER_RADIUS,
              color: "#fff",
              fontSize: 17,
              fontWeight: 700,
              padding: "15px 40px",
              cursor: "pointer"
            }}>
              Начать пользоваться {ICONS.arrowRight}
            </button>
          </div>
          <div style={{ textAlign: "center", color: "#7c8792", fontSize: 13, marginTop: 10 }}>Попробуйте — это быстро и бесплатно</div>
          <div style={{ marginTop: 40 }} />
          <NoraHowItWorksBlock />
          <WhyNoraBlock />
          <ReviewBlock />
          <Footer />
          <div style={{ height: 20 }} />
        </>
      ) : (
        <>
          <div style={{ maxWidth: MAX_WIDTH, margin: "0 auto", padding: "30px 0 90px 0" }}>
            {chat.map((m, i) => (
              <div key={i} style={{ textAlign: m.sender === "user" ? "right" : "left", margin: "10px 20px" }}>
                <span style={{
                  display: "inline-block",
                  background: m.sender === "user" ? "#fff" : "#f7fafd",
                  padding: 10,
                  borderRadius: 16,
                  fontSize: 16
                }}>{m.text}</span>
              </div>
            ))}
            <div ref={endChat} />
          </div>
          <div style={{
            position: "fixed", bottom: 25, left: 0, width: "calc(100% - 40px)", margin: "0 20px",
            maxWidth: MAX_WIDTH, display: "flex", alignItems: "center"
          }}>
            <input type="text" value={msg} onChange={e => setMsg(e.target.value)} onKeyDown={e => e.key === "Enter" && send()}
              placeholder="Введите сообщение..."
              style={{ flex: 1, height: 48, borderRadius: BORDER_RADIUS, border: "1px solid #e5e8ed", padding: "0 18px", fontSize: 16 }} />
            <button onClick={send} style={{
              width: 48, height: 48, border: "none", borderRadius: BORDER_RADIUS,
              marginLeft: 8, background: BABY_GRADIENT, color: "#fff", cursor: "pointer"
            }}>{ICONS.arrowRight}</button>
          </div>
        </>
      )}
    </div>
  );
};
export default Chat;
