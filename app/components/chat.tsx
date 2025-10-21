"use client";
import React, { useState, useEffect, useRef } from "react";

// ==== Иконки ====
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

const NORA_COLOR = "#2e2e2e";
const BORDER_RADIUS = 22;
const PANEL_PADDING = 15;
const MAX_WIDTH = 560;
const GRADIENT = "linear-gradient(90deg, #eff5fe 0%, #e5e8ed 100%)";
const BABY_GRADIENT = "linear-gradient(90deg, #e39290 0%, #efb1b6 100%)";
const ICON_SIZE = 23;
const INPUT_HEIGHT = 68;

// ===== Панель =====
const HeaderPanel = ({ onClearChat }: { onClearChat?: () => void }) => (
  <div style={{
    width: `calc(100% - ${PANEL_PADDING * 2}px)`,
    maxWidth: MAX_WIDTH,
    minHeight: 62,
    background: GRADIENT,
    margin: "20px auto 0 auto",
    borderRadius: BORDER_RADIUS,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "5px 15px",
    boxSizing: "border-box",
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

// ===== Footer (только на Welcome) =====
const IconPartner = (
  <svg width="18" height="18" fill="none" viewBox="0 0 20 20">
    <circle cx="10" cy="6.5" r="3.3" stroke="#5a6573" strokeWidth="1.5" />
    <path d="M2.8 16c.9-2.5 3.4-4.2 7.2-4.2s6.2 1.7 7.2 4.2" stroke="#5a6573" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);
const IconContact = (
  <svg width="18" height="18" fill="none" viewBox="0 0 20 20">
    <rect x="2.8" y="3.5" width="14.4" height="11" rx="2.2" stroke="#5a6573" strokeWidth="1.5" />
    <path d="M3.5 4l6.5 6.1c.3.2.8.2 1.1 0L17 4" stroke="#5a6573" strokeWidth="1.5" />
  </svg>
);
const IconPolicy = (
  <svg width="16" height="16" fill="none" viewBox="0 0 20 20" style={{ marginRight: 6 }}>
    <path d="M4 4.5V10c0 5 7 6.5 7 6.5s7-1.5 7-6.5v-5.5l-7-2-7 2Z" stroke="#4d5762" strokeWidth="1.5" fill="none" />
  </svg>
);
const Footer = () => (
  <div style={{
    width: "calc(100% - 40px)",
    maxWidth: MAX_WIDTH,
    margin: "0 auto",
    background: GRADIENT,
    borderRadius: 22,
    boxShadow: "0 -4px 14px rgba(155,175,205,0.06)",
    padding: 22,
    fontFamily: "'Manrope', sans-serif"
  }}>
    <div style={{ fontSize: 12, textAlign: "center", color: "#263540", fontWeight: 600 }}>Ташкент, Юнусабадский район, массив Кашгар 26</div>
    <div style={{ display: "flex", gap: 11, justifyContent: "center", marginTop: 15 }}>
      <a href="#" style={{ background: "#fff", border: "1px solid #e1e9f5", padding: "9px 0", borderRadius: 13, width: "63%", display: "flex", justifyContent: "center", alignItems: "center", fontSize: 14, gap: 7, color: "#495062" }}>{IconPartner} Стать партнёром</a>
      <a href="#" style={{ background: "#fff", border: "1px solid #e1e9f5", padding: "9px 0", borderRadius: 13, width: "37%", display: "flex", justifyContent: "center", alignItems: "center", fontSize: 14, gap: 7, color: "#495062" }}>{IconContact} Контакты</a>
    </div>
    <a href="#" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, background: "#fff", border: "1px solid #e1e9f5", borderRadius: 14, color: "#556", fontSize: 14, padding: "8px 0", marginTop: 16, textDecoration: "none" }}>{IconPolicy} Политика конфиденциальности</a>
    <div style={{ fontSize: 12, color: "#8a97a0", textAlign: "center", marginTop: 10 }}>© {new Date().getFullYear()} Nora Plus — забота и поддержка будущих мам</div>
  </div>
);

// ===== "Как работает Нора" =====
const bubbleStyle = (align = "right") => ({
  position: 'relative' as const,
  alignSelf: align === "right" ? 'flex-end' as const : 'flex-start' as const,
  background: "#fff",
  color: NORA_COLOR,
  borderTopLeftRadius: 19,
  borderTopRightRadius: 19,
  borderBottomLeftRadius: align === "left" ? 2 : 19,
  borderBottomRightRadius: align === "right" ? 2 : 19,
  fontSize: 15,
  padding: align === "right" ? "15px 20px" : "20px 21px",
  marginBottom: 16,
  maxWidth: 370,
  textAlign: "left" as const,
  lineHeight: "1.6",
  boxShadow: "0 1px 8px rgba(200,180,200,0.1)"
});

const NoraHowItWorksBlock = () => {
  const DIALOGS = [
    { q: "Можно ли пить кофе во время беременности?", a: "☕ Конечно! Только не больше 1-2 чашек в день — и лучше без сахара, чтобы не повысить давление." },
    { q: "Я постоянно переживаю за малыша...", a: "🤗 Это нормально! Позвольте себе отдых, используйте дыхательные практики и отслеживайте свои эмоции." },
    { q: "Часто болит спина и ноги, что делать?", a: "🦵 Очень частая жалоба. Носите удобную обувь, практикуйте лёгкую зарядку, отдыхайте чаще лёжа на боку." },
    { q: "Плохо сплю по ночам, просыпаюсь часто.", a: "😴 Лёгкий перекус перед сном, прохладная проветренная комната и регулярный режим — всё это помогает с бессонницей." },
    { q: "Не забыть бы витамины и анализы!", a: "💊 Я поставлю напоминания, сформирую календарь визитов и пришлю push-запрос за 2 дня!" },
  ];
  const [step, setStep] = useState(0);
  const [phase, setPhase] = useState("typeQ");
  const [qText, setQText] = useState("");
  const [aText, setAText] = useState("");

  // ⚙️ Замедленная печать (в 2 раза медленнее)
  const typingSpeedQ = 60;
  const typingSpeedA = 28;

  useEffect(() => {
    if (phase === "typeQ") {
      setQText("");
      let i = 0;
      const interval = setInterval(() => {
        setQText(DIALOGS[step].q.slice(0, i + 1));
        i++;
        if (i > DIALOGS[step].q.length) {
          clearInterval(interval);
          setTimeout(() => setPhase("typeA"), 400);
        }
      }, typingSpeedQ);
      return () => clearInterval(interval);
    }
    if (phase === "typeA") {
      setAText("");
      let i = 0;
      const interval = setInterval(() => {
        setAText(DIALOGS[step].a.slice(0, i + 1));
        i++;
        if (i > DIALOGS[step].a.length) {
          clearInterval(interval);
          setTimeout(() => setPhase("waitNext"), 7000);
        }
      }, typingSpeedA);
      return () => clearInterval(interval);
    }
    if (phase === "waitNext" && step < DIALOGS.length - 1) {
      const timer = setTimeout(() => {
        setQText("");
        setAText("");
        setStep(step + 1);
        setPhase("typeQ");
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [phase, step]);

  return (
    <div style={{
      width: `calc(100% - 20px)`,
      maxWidth: 560,
      margin: "0 auto 38px auto",
      background: GRADIENT,
      borderRadius: 22,
      boxShadow: "0 6px 20px rgba(150,175,205,0.1)",
      padding: "22px 10px 20px 10px",
      fontFamily: "'Manrope', sans-serif"
    }}>
      <div style={{ textAlign: "center", fontWeight: 700, fontSize: 20, color: NORA_COLOR }}>Как работает Nora?</div>
      <div style={{ height: 28 }} />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "stretch" }}>
        {qText && (
          <div style={bubbleStyle("right")}>
            {qText}
            <span style={{ opacity: 0.2 }}>{phase === "typeQ" && "|"}</span>
          </div>
        )}
        {aText && (
          <div style={{ ...bubbleStyle("left"), marginBottom: 20 }}>
            {aText}
            <span style={{ opacity: 0.2 }}>{phase === "typeA" && "|"}</span>
          </div>
        )}
      </div>
      <div style={{ textAlign: "center", color: "#6e7c85", fontSize: 13, marginTop: 8 }}>
        Просто задайте вопрос — Нора найдёт ответ!
      </div>
    </div>
  );
};

// ===== Основной компонент =====
const Chat = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<{ text: string, sender: "user" | "bot" }[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  const handleSendMessage = () => {
    if (!message.trim()) return;
    setChatHistory([...chatHistory, { text: message, sender: "user" }]);
    setTimeout(() => {
      setChatHistory(prev => [...prev, { text: "Nora отвечает на ваш вопрос!", sender: "bot" }]);
      setMessage("");
    }, 1200);
  };

  return (
    <div style={{ background: "#f8fdff", minHeight: "100vh" }}>
      <HeaderPanel onClearChat={() => setChatHistory([])} />
      {showWelcome ? (
        <>
          <div style={{ height: 20 }} />
          <div style={{ textAlign: "center" }}>
            <video src="/nora.mp4" style={{ width: "100%", maxWidth: 314, borderRadius: 20 }} autoPlay muted loop playsInline preload="auto" />
          </div>
          <div style={{ marginTop: 20 }}>
            <div style={{ fontWeight: 700, fontSize: 22, color: NORA_COLOR, textAlign: "center" }}>Ждёте малыша? Я помогу!</div>
            <div style={{ fontWeight: 400, fontSize: 15, color: NORA_COLOR, textAlign: "center", lineHeight: 1.75, marginTop: 12 }}>
              Я помогаю будущим мамам: отвечаю на вопросы, напоминаю о важных делах, слежу за самочувствием.
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "center", marginTop: 38 }}>
            <button
              onClick={() => setShowWelcome(false)}
              style={{
                background: BABY_GRADIENT,
                color: "#fff",
                border: "none",
                borderRadius: BORDER_RADIUS,
                fontWeight: 700,
                fontSize: 17,
                padding: "15px 35px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
                boxShadow: "0 2px 18px rgba(200,128,140,0.09)"
              }}>
              Начать пользоваться {ICONS.arrowRight}
            </button>
          </div>

          <div style={{ marginTop: 40 }} />
          <NoraHowItWorksBlock />
          <Footer />
        </>
      ) : (
        <>
          <div style={{
            width: "100%",
            maxWidth: MAX_WIDTH,
            margin: "0 auto",
            padding: "24px 0 90px 0"
          }}>
            {chatHistory.map((msg, i) => (
              <div key={i} style={{ textAlign: msg.sender === "user" ? "right" : "left", margin: "12px 20px" }}>
                <div style={{
                  display: "inline-block",
                  background: msg.sender === "user" ? "#fff" : "#f7fafd",
                  padding: 10,
                  borderRadius: 16,
                  fontSize: 16
                }}>{msg.text}</div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div style={{
            width: "calc(100% - 40px)",
            margin: "0 20px",
            display: "flex",
            alignItems: "center",
            maxWidth: MAX_WIDTH,
            height: INPUT_HEIGHT,
            position: "fixed",
            left: 0,
            bottom: 25,
            background: "transparent"
          }}>
            <input
              type="text"
              value={message}
              onChange={e => setMessage(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") handleSendMessage(); }}
              placeholder="Введите сообщение..."
              style={{
                flex: 1,
                height: 48,
                borderRadius: BORDER_RADIUS,
                border: "1px solid #e5e8ed",
                padding: "0 18px",
                fontSize: 16
              }}
            />
            <button
              onClick={handleSendMessage}
              style={{
                width: 48,
                height: 48,
                background: BABY_GRADIENT,
                border: "none",
                borderRadius: BORDER_RADIUS,
                marginLeft: 8,
                color: "#fff",
                cursor: "pointer"
              }}
            >{ICONS.arrowRight}</button>
          </div>
        </>
      )}
    </div>
  );
};
export default Chat;
