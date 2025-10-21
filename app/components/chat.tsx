"use client";
import React, { useState, useEffect, useRef, CSSProperties } from "react";

// Кнопки панели
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
const borderRadius = 22;
const panelHeight = 62;
const maxWidth = 560;
const videoMaxWidth = 314;
const GRADIENT = "linear-gradient(90deg, #eff5fe 0%, #e5e8ed 100%)";
const BABY_GRADIENT = "linear-gradient(90deg, #e39290 0%, #efb1b6 100%)";
const INPUT_BAR_HEIGHT = 68;
const PANEL_SIDE_PADDING = 15;
const BLOCK_SIDE_PADDING = 10;

// --- Панель с кнопками (возвращена, как просили!) ---
const HeaderPanel = ({ onClearChat }: { onClearChat?: () => void }) => (
  <div style={{
    width: `calc(100% - ${PANEL_SIDE_PADDING * 2}px)`,
    maxWidth,
    minHeight: panelHeight,
    background: GRADIENT,
    color: NORA_COLOR,
    margin: "20px auto 0 auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: borderRadius,
    paddingLeft: PANEL_SIDE_PADDING, paddingRight: PANEL_SIDE_PADDING, paddingTop: 5, paddingBottom: 5,
    boxSizing: "border-box", zIndex: 1,
    fontFamily: "'Manrope', Arial, Helvetica, sans-serif"
  }}>
    <div style={{display: "flex", flexDirection: "column", alignItems: "flex-start", flex: 1, paddingLeft: 5}}>
      <span style={{
        fontWeight: 800, fontSize: "19px", lineHeight: 1.06, whiteSpace: "nowrap", marginBottom: 7
      }}>
        Nora Plus
      </span>
      <span style={{
        fontWeight: 400, fontSize: "13px", color: "#565656", lineHeight: 1.04, whiteSpace: "nowrap"
      }}>
        Ассистент для будущих мам
      </span>
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: 16 }}>
      <button style={{
        background: "transparent", border: "none", cursor: "pointer",
        width: 38, height: 38, borderRadius: 19,
        display: "flex", alignItems: "center", justifyContent: "center"
      }} onClick={() => window?.navigator?.share?.({ title: "Nora Plus", url: window.location.href })}>
        <img src={ICONS.share} alt="Share"
          style={{ width: ICON_SIZE, height: ICON_SIZE, filter: "invert(13%) sepia(4%) saturate(271%) hue-rotate(175deg) brightness(92%) contrast(93%)" }} />
      </button>
      <button style={{
        background: "transparent", border: "none", cursor: "pointer",
        width: 38, height: 38, borderRadius: 19,
        display: "flex", alignItems: "center", justifyContent: "center"
      }} onClick={() => window.open("https://t.me/norasmart", "_blank")}>
        <img src={ICONS.telegram} alt="Telegram"
          style={{ width: ICON_SIZE, height: ICON_SIZE, filter: "invert(13%) sepia(4%) saturate(271%) hue-rotate(175deg) brightness(92%) contrast(93%)" }} />
      </button>
      <button style={{
        background: "transparent", border: "none", cursor: "pointer",
        width: 38, height: 38, borderRadius: 19,
        display: "flex", alignItems: "center", justifyContent: "center"
      }} onClick={() => onClearChat && onClearChat()}>
        <img src={ICONS.trash} alt="Trash"
          style={{ width: ICON_SIZE, height: ICON_SIZE, filter: "invert(13%) sepia(4%) saturate(271%) hue-rotate(175deg) brightness(92%) contrast(93%)" }} />
      </button>
    </div>
  </div>
);

// --- Стили для TypeScript ---
const bubbleStyle = (align: "left" | "right"): CSSProperties => ({
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
  minWidth: 120,
  textAlign: "left" as const,
  fontWeight: align === "right" ? 500 : 400,
  lineHeight: align === "right" ? "1.55" : "1.7",
  boxShadow: "0 1px 8px 0 rgba(200,180,200,0.1)",
  display: "block",
  whiteSpace: "pre-line" as const,
});

// --- Динамический блок Как работает Нора ---
const NoraHowItWorksBlock = () => {
  const DIALOGS = [
    { q: "Можно ли пить кофе во время беременности?", a: "☕ Конечно! Только не больше 1-2 чашек в день — и лучше без сахара, чтобы не повысить давление." },
    { q: "Я постоянно переживаю за малыша...", a: "🤗 Это нормально! Позвольте себе отдых, используйте дыхательные практики и отслеживайте свои эмоции." },
    { q: "Часто болит спина и ноги, что делать?", a: "🦵 Очень частая жалоба. Носите удобную обувь, практикуйте легкую зарядку, отдыхайте чаще лёжа на боку." },
    { q: "Плохо сплю по ночам, просыпаюсь часто.", a: "😴 Лёгкий перекус перед сном, прохладная проветренная комната и регулярный режим — всё это поможет с бессонницей." },
    { q: "Не забыть бы витамины и анализы!", a: "💊 Я поставлю напоминания, сформирую календарь визитов и отправлю push за 2 дня!" },
    { q: "Можно ли заниматься спортом?", a: "🏃 Спорт — отлично! Но выбирайте плавание, йогу, прогулки. Главное — никаких экстремальных нагрузок." },
    { q: "У меня иногда тянет живот...", a: "👩‍⚕️ Незначительная боль допустима, но если усиливается или появляются новые симптомы — обязательно сообщите врачу!" },
    { q: "Что взять с собой на первый прием к врачу?", a: "📄 Паспорт, страховой полис, результаты анализов (если есть), список принимаемых витаминов или лекарств." }
  ];
  const [step, setStep] = useState(0);
  const [phase, setPhase] = useState<"typeQ" | "typeA" | "waitNext">("typeQ");
  const [qText, setQText] = useState("");
  const [aText, setAText] = useState("");

  useEffect(() => {
    if (phase === "typeQ") {
      setQText("");
      let i = 0;
      const interval = setInterval(() => {
        setQText(DIALOGS[step].q.slice(0, i + 1));
        i++;
        if (i > DIALOGS[step].q.length) {
          clearInterval(interval);
          setTimeout(() => setPhase("typeA"), 300);
        }
      }, 30);
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
      }, 14);
      return () => clearInterval(interval);
    }
    if (phase === "waitNext" && step < DIALOGS.length - 1) {
      const timer = setTimeout(() => {
        setQText("");
        setAText("");
        setPhase("typeQ");
        setStep((s) => s + 1);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [phase, step]);

  return (
    <div style={{
      width: `calc(100% - ${BLOCK_SIDE_PADDING * 2}px)`,
      maxWidth,
      height: 390,
      minHeight: 390,
      background: GRADIENT,
      borderRadius: borderRadius,
      boxShadow: "0 6px 20px 0 rgba(150,175,205,0.11)",
      padding: `22px ${BLOCK_SIDE_PADDING}px`,
      fontFamily: "'Manrope', Arial, Helvetica, sans-serif",
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-start"
    }}>
      <div style={{
        fontWeight: 700,
        fontSize: 20,
        color: NORA_COLOR,
        textAlign: "center"
      }}>
        Как работает Nora?
      </div>
      <div style={{ height: 28 }} />
      <div style={{
        width: "100%",
        height: "255px",
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        justifyContent: "flex-start"
      }}>
        {qText && (
          <div style={bubbleStyle("right")}>
            {qText}<span style={{ opacity: 0.19 }}>{phase === "typeQ" && "|"}</span>
          </div>
        )}
        {aText && (
          <div style={bubbleStyle("left")}>
            {aText}<span style={{ opacity: 0.19 }}>{phase === "typeA" && "|"}</span>
          </div>
        )}
      </div>
      <div style={{ fontSize: 13, color: "#6e7c85", textAlign: "center", marginTop: 8 }}>
        Просто задайте вопрос — Нора найдёт ответ!
      </div>
    </div>
  );
};

// ... (здесь WhyNoraBlock, ReviewBlock, Footer — смотри их готовые версии выше) ...

const Chat = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<{text: string, sender: "user" | "bot"}[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory]);

  const handleSendMessage = () => {
    if (!message.trim()) return;
    setChatHistory([...chatHistory, { text: message.trim(), sender: "user" }]);
    setTimeout(() => {
      setChatHistory(prev => [...prev, { text: "Nora отвечает на ваш вопрос!", sender: "bot" }]);
      setMessage("");
    }, 1200);
  };

  const handleClearChat = () => {
    setChatHistory([]);
    setMessage("");
  };

  return (
    <div style={{ background: "#f8fdff", minHeight: "100vh" }}>
      <HeaderPanel onClearChat={handleClearChat} />
      {showWelcome ? (
        <>
          <div style={{ height: 20 }} />
          <div style={{ height: 20 }} />
          <div style={{
            width: "100%",
            maxWidth: maxWidth,
            margin: "0 auto",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}>
            <video src="/nora.mp4"
              style={{
                width: "100%",
                maxWidth: videoMaxWidth,
                display: "block",
                borderRadius: 24
              }}
              autoPlay
              playsInline
              muted
              loop
              preload="auto"
            />
          </div>
          <div style={{ height: 20 }} />
          <div style={{ height: 20 }} />

          <div style={{
            width: `calc(100% - ${BLOCK_SIDE_PADDING * 2}px)`,
            maxWidth,
            textAlign: "center",
            margin: "0 auto"
          }}>
            <div style={{
              fontWeight: 700,
              fontSize: "22px",
              color: NORA_COLOR,
              marginBottom: 14
            }}>Ждёте малыша? Я помогу!</div>
            <div style={{
              fontWeight: 400,
              fontSize: "15px",
              margin: "0 auto 0 auto",
              maxWidth: 400,
              padding: "0 18px",
              lineHeight: 1.75,
              color: NORA_COLOR,
              display: "inline-block"
            }}>
              Я помогаю будущим мамам: отвечаю на вопросы, напоминаю о важных делах, слежу за самочувствием.
            </div>
            <div style={{ height: 40 }} />
            <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
              <div style={{ width: "100%", textAlign: "center" }}>
                <button
                  style={{
                    width: "100%", maxWidth: 290,
                    background: BABY_GRADIENT,
                    color: "#fff",
                    border: "none",
                    borderRadius: borderRadius,
                    fontWeight: 700,
                    fontSize: "17px",
                    padding: "15px 0",
                    margin: "0 auto",
                    cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: "0 2px 18px 0 rgba(200, 128, 140, 0.09)"
                  }}
                  onClick={() => setShowWelcome(false)}
                >
                  Начать пользоваться
                  <span style={{ marginLeft: 8, display: "flex", alignItems: "center" }}>{ICONS.arrowRight}</span>
                </button>
                <div style={{ height: 13 }} />
                <div style={{ fontSize: 13, color: "#7c8792" }}>
                  Попробуйте — это быстро и бесплатно
                </div>
              </div>
            </div>
            <div style={{ height: 40 }} />
            <NoraHowItWorksBlock />
            {/* вставь WhyNoraBlock и ReviewBlock ниже */}
            <WhyNoraBlock />
            <ReviewBlock />
            <Footer />
          </div>
        </>
      ) : (
        <>
          <div style={{
            width: "100%",
            maxWidth: maxWidth,
            margin: "0 auto",
            padding: "24px 0 80px 0",
            minHeight: "60vh"
          }}>
            {chatHistory.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  textAlign: msg.sender === "user" ? "right" : "left",
                  margin: "10px 20px"
                }}
              >
                <span style={{
                  background: msg.sender === "user" ? "#fff" : "#f7fafd",
                  padding: 12,
                  borderRadius: 16,
                  fontSize: 16
                }}>{msg.text}</span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div style={{
            width: "calc(100% - 40px)",
            margin: "0 20px",
            display: "flex",
            alignItems: "center",
            boxSizing: "border-box",
            maxWidth: maxWidth,
            height: INPUT_BAR_HEIGHT,
            position: "fixed",
            left: 0,
            bottom: 25,
            background: "transparent",
            borderRadius: borderRadius,
            zIndex: 20,
            boxShadow: "none"
          }}>
            <input
              type="text"
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Введите сообщение..."
              style={{
                flex: 1,
                height: 48,
                fontSize: 16,
                borderRadius: borderRadius,
                borderWidth: 1,
                borderStyle: "solid",
                borderColor: "#e5e8ed",
                padding: "0 18px",
                background: "#fff",
                color: NORA_COLOR,
                boxSizing: "border-box",
                marginRight: 8,
                transition: "border 0.22s"
              }}
              onKeyDown={e => { if (e.key === 'Enter') handleSendMessage(); }}
            />
            <button
              style={{
                width: 48,
                height: 48,
                background: BABY_GRADIENT,
                color: "#fff",
                border: "none",
                borderRadius: borderRadius,
                fontWeight: 700,
                fontSize: 17,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 2px 14px 0 rgba(155,175,205,0.12)"
              }}
              onClick={handleSendMessage}
            >
              {ICONS.arrowRight}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Chat;
