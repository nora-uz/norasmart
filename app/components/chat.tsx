"use client";
import React, { useState, useEffect, useRef } from "react";

// Фирменные цвета
const BRAND_COLOR_1 = "#715b9b";
const BRAND_COLOR_2 = "#a48fcc";
const PRIMARY_PURPLE = BRAND_COLOR_1;
const NORA_COLOR = "#26151b";
const maxWidth = 560;
const borderRadius = 22;
const panelHeight = 62;
const INPUT_BAR_HEIGHT = 68;
const LIGHT_BG = "#e3e8f0";

const ICON_SIZE = 23;
const BANNER = "/123.webp";

// Градиент фирменных цветов
const PANEL_GRADIENT = `linear-gradient(90deg, ${BRAND_COLOR_1} 0%, ${BRAND_COLOR_2} 100%)`;

const ICONS = {
  telegram: "https://cdn-icons-png.flaticon.com/512/1946/1946547.png",
  share: "https://cdn-icons-png.flaticon.com/512/535/535285.png",
  arrowRight: (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path
        d="M6 11H16M16 11L12 7M16 11L12 15"
        stroke="#fff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
};

const FEEDBACKS_NORA = [
  { name: "Людмила", text: "С Норой я перестала переживать по пустякам — теперь любые вопросы решаю за пару минут!" },
  { name: "Екатерина", text: "Очень удобно: напомнила про посещение врача, подсказала питание по моему анализу — чувствую себя спокойнее!" },
  { name: "Марина", text: "Получаю поддержку, советы и простые рекомендации каждый день! Уже посоветовала коллегам и подруге." },
  { name: "Камила", text: "Nora — настоящая подруга во время беременности! Чат легкий, понятный, рекомендации всегда актуальны." },
  { name: "Ольга", text: "Получила четкую инструкцию по приему витаминов, теперь ничего не путаю. Спасибо!" },
];

function filterAsterisks(str: string) {
  return str.replace(/\*/g, "");
}
function splitBotText(text: string) {
  if (!text) return [];
  return text.replace(/\r\n/g, "\n").split(/\n{2,}/).map(s => s.trim()).filter(Boolean);
}

type Message = { text: string; sender: "user" | "bot" };
const THREAD_KEY = "nora_thread_id";

const FeedbackBubblesNora = ({ visible }: { visible: boolean }) => {
  const MAX_BUBBLES = 5;
  const [list, setList] = useState(FEEDBACKS_NORA.slice(0, MAX_BUBBLES));
  useEffect(() => {
    if (!visible) return;
    let i = MAX_BUBBLES;
    const timer = setInterval(() => {
      setList(prev => [FEEDBACKS_NORA[i % FEEDBACKS_NORA.length], ...prev].slice(0, MAX_BUBBLES));
      i++;
    }, 7000);
    return () => clearInterval(timer);
  }, [visible]);
  if (!visible) return null;
  return (
    <div style={{
      width: "100%",
      display: "flex",
      justifyContent: "center",
      minHeight: 80,
      marginTop: 0,
      marginBottom: 0
    }}>
      <div style={{
        display: "flex",
        flexDirection: "column-reverse",
        alignItems: "center",
        gap: "14px",
        width: "100%",
        maxWidth: 370,
        background: "transparent"
      }}>
        {list.map((fb, idx) => (
          <div key={`${fb.name}_${fb.text}_${idx}`}
            style={{
              background: "#fff",
              borderRadius: 21,
              boxShadow: "0 3px 22px 0 rgba(38,21,27,0.12)",
              padding: "18px 25px",
              minWidth: 240,
              maxWidth: 370,
              textAlign: "left",
              border: "1.2px solid #e3e8f0",
              display: "flex",
              flexDirection: "column",
              opacity: 1,
              animation: idx === list.length - 1 ? "bubbleIn .8s" : undefined
            }}>
            <span style={{ fontWeight: 700, fontSize: 15, color: NORA_COLOR, marginBottom: 7 }}>{fb.name}</span>
            <span style={{ fontWeight: 400, fontSize: 15, color: "#393939", lineHeight: 1.58 }}>{fb.text}</span>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes bubbleIn {
          0% { opacity: 0; transform: translateY(28px) scale(.99);}
          65% { opacity: .8; transform: translateY(-7px) scale(1.009);}
          100% { opacity: 1; transform: translateY(0) scale(1);}
        }
      `}</style>
    </div>
  );
};

const Chat = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [preloading, setPreloading] = useState(true);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [threadId, setThreadId] = useState<string | null>(null);
  const [botProgress, setBotProgress] = useState("");
  const [showHowTo, setShowHowTo] = useState(true);
  const [isMobile, setIsMobile] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function checkScreen() {
      if (typeof window !== "undefined") {
        setIsMobile(window.innerWidth <= 640);
      }
    }
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);
  useEffect(() => {
    const saved = window.localStorage.getItem(THREAD_KEY);
    if (saved) setThreadId(saved);
  }, []);
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = "auto"; };
  }, []);
  useEffect(() => {
    const timer = setTimeout(() => setPreloading(false), 1000);
    return () => clearTimeout(timer);
  }, []);
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory, botProgress]);
  useEffect(() => {
    if (chatHistory.length > 0) setShowHowTo(false);
  }, [chatHistory]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Nora Plus — Ассистент для будущих мам",
        text: "Современный ассистент для будущих мам — все рекомендации по беременности в одном месте.",
        url: window.location.href
      });
    } else {
      alert("Ваш браузер не поддерживает Web Share API");
    }
  };

  const sendMessageToGPT = async (text: string) => {
    setLoading(true);
    const newHistory: Message[] = [...chatHistory, { text: filterAsterisks(text), sender: "user" }];
    setChatHistory(newHistory);
    setBotProgress("");
    // Здесь добавьте свою интеграцию с API если надо, сейчас имитация:
    setTimeout(() => {
      setChatHistory(prev => [...prev, { text: "Ответ Норы: ...", sender: "bot" }]);
      setBotProgress("");
      setLoading(false);
    }, 700);
  };

  const handleSendMessage = () => {
    if (message.trim() && !loading && !botProgress) {
      sendMessageToGPT(message.trim());
      setMessage("");
    }
  };

  const clearChatAll = () => {
    setChatHistory([]);
    setThreadId(null);
    window.localStorage.removeItem(THREAD_KEY);
    setShowWelcome(true);
    setShowHowTo(true);
    setBotProgress("");
  };

  return (
    <div
      style={{
        background: LIGHT_BG,
        width: "100vw",
        height: "100vh",
        overflow: "auto",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        boxSizing: "border-box"
      }}>
      {/* Верхняя панель */}
      <div style={{
        width: "calc(100% - 40px)",
        maxWidth,
        minHeight: panelHeight,
        background: PANEL_GRADIENT,
        color: "#fff",
        margin: "20px auto 0 auto",
        display: "flex", alignItems: "center",
        borderRadius: borderRadius,
        paddingLeft: 20, paddingRight: 12, paddingTop: 5, paddingBottom: 5,
        justifyContent: "flex-start", boxSizing: "border-box", zIndex: 1, boxShadow: "none"
      }}>
        <div style={{
          marginRight: 10,
          display: "flex", flexDirection: "column", justifyContent: "center", minWidth: 0
        }}>
          <span style={{
            fontWeight: 800, fontSize: "19px", lineHeight: 1.06,
            whiteSpace: "nowrap", marginBottom: 7, color: "#fff"
          }}>Nora Plus</span>
          <span style={{
            fontWeight: 400, fontSize: "13px",
            color: "#fff", lineHeight: 1.04, whiteSpace: "nowrap"
          }}>Ассистент для будущих мам</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: "auto" }}>
          <button style={{
            background: "transparent", border: "none", cursor: "pointer",
            width: 38, height: 38, borderRadius: 19,
            display: "flex", alignItems: "center", justifyContent: "center"
          }} onClick={handleShare}>
            <img src={ICONS.share} alt="Share"
              style={{ width: ICON_SIZE, height: ICON_SIZE, filter: "brightness(0) invert(1)" }} />
          </button>
          <button style={{
            background: "transparent", border: "none", cursor: "pointer",
            width: 38, height: 38, borderRadius: 19,
            display: "flex", alignItems: "center", justifyContent: "center"
          }} onClick={() => window.open("https://t.me/norasmart", "_blank")}>
            <img src={ICONS.telegram} alt="Telegram"
              style={{ width: ICON_SIZE, height: ICON_SIZE, filter: "brightness(0) invert(1)" }} />
          </button>
        </div>
      </div>
      {/* Фото под панелью, появляется только на welcome экране */}
      {showWelcome && (
        <div style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          paddingLeft: 18,
          paddingRight: 18,
          marginTop: 17 // отступ 17 пикселей
        }}>
          <img
            src={BANNER}
            alt="Nora Plus баннер"
            style={{
              width: "100%",
              height: "auto",
              display: "block",
              objectFit: "contain",
              objectPosition: "center"
            }}
          />
        </div>
      )}
      {showWelcome ? (
        <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
          <div style={{ width: "100%", maxWidth }}>
            <div style={{ height: 37 }} />
            {/* Описание под фото с тёмным цветом */}
            <div style={{ textAlign: "center" }}>
              <div style={{
                fontWeight: 400,
                fontSize: "16px",
                margin: "0 auto",
                maxWidth: 400,
                padding: "0 20px",
                lineHeight: 1.75,
                color: NORA_COLOR,
                display: "inline-block"
              }}>
                Нора — это виртуальный ассистент и помощник для беременных, который помогает будущим мамам чувствовать себя уверенно и спокойно на каждом этапе беременности.
              </div>
            </div>
            <div style={{ height: 37 }} />
            <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
              <button
                style={{
                  background: PANEL_GRADIENT,
                  color: "#fff",
                  border: "none",
                  borderRadius: borderRadius,
                  fontWeight: 700,
                  fontSize: "17px",
                  padding: "15px 0",
                  maxWidth: 290,
                  width: "100%",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
                onClick={() => setShowWelcome(false)}
              >
                <span style={{
                  display: "flex", alignItems: "center", justifyContent: "center", color: "#fff"
                }}>
                  Начать пользоваться&nbsp;{ICONS.arrowRight}
                </span>
              </button>
            </div>
            <div style={{ height: 37 }} />
            <FeedbackBubblesNora visible={showWelcome} />
            <div style={{ height: 24 }} />
          </div>
        </div>
      ) : (
        <div style={{
          width: "100%",
          maxWidth,
          margin: "0 auto",
          flex: 1,
          overflowY: "auto",
          paddingBottom: INPUT_BAR_HEIGHT + 20,
          minHeight: 200
        }}>
          {chatHistory.map((msg, idx) => (
            <div key={idx} style={{ display: "flex", width: "100%", justifyContent: msg.sender === "user" ? "flex-end" : "flex-start" }}>
              <div style={{ margin: "20px", maxWidth: 450, alignSelf: msg.sender === "user" ? "flex-end" : "flex-start" }}>
                {msg.sender === "user" ? (
                  <span style={{
                    background: PRIMARY_PURPLE,
                    color: "#fff",
                    borderRadius: 16,
                    padding: "18px 20px",
                    lineHeight: 1.7,
                    fontSize: 17,
                    minWidth: 0,
                    boxShadow: "0 3px 22px 0 rgba(38,21,27,0.12)",
                    maxWidth: "100%",
                    display: "inline-block",
                    fontWeight: 400,
                    wordBreak: "break-word"
                  }}>
                    {msg.text}
                  </span>
                ) : (
                  <div>
                    {splitBotText(msg.text).map((part, i) => (
                      <p key={i} style={{
                        margin: "0 0 20px 0",
                        fontWeight: 400,
                        color: NORA_COLOR,
                        fontSize: 17,
                        lineHeight: 1.8,
                        wordBreak: "break-word"
                      }}>
                        {part}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {botProgress && (
            <div style={{ display: "flex", width: "100%", justifyContent: "flex-start" }}>
              <div style={{ margin: "20px", maxWidth: 450 }}>
                {splitBotText(botProgress).map((part, i) => (
                  <p key={i} style={{
                    margin: "0 0 20px 0",
                    fontWeight: 400,
                    color: NORA_COLOR,
                    fontSize: 17,
                    lineHeight: 1.8,
                    wordBreak: "break-word"
                  }}>
                    {part}
                  </p>
                ))}
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
          <div style={{
            position: "fixed",
            bottom: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: "100vw",
            maxWidth,
            padding: "10px 20px",
            boxSizing: "border-box",
            display: "flex",
            alignItems: "center",
            zIndex: 9,
            height: INPUT_BAR_HEIGHT,
            background: LIGHT_BG
          }}>
            <input
              value={message}
              onChange={e => setMessage(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSendMessage()}
              placeholder="Введите ваше сообщение..."
              style={{
                flex: 1,
                borderRadius: 17,
                border: "1.2px solid #e3e8f0",
                fontSize: 16,
                padding: "14px 18px",
                outline: "none",
                marginRight: 10
              }}
              disabled={loading}
            />
            <button
              onClick={handleSendMessage}
              disabled={loading || !message.trim()}
              style={{
                background: PANEL_GRADIENT,
                color: "#fff",
                border: "none",
                borderRadius: 17,
                fontWeight: 700,
                fontSize: 16,
                padding: "12px 22px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              {ICONS.arrowRight}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
