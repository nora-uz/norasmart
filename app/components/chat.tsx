"use client";
import React, { useState, useEffect, useRef } from "react";

const NORA_COLOR = "#2e2e2e";
const ICON_SIZE = 23;
const BANNER = "/banner.webp";
const borderRadius = 22;
const panelHeight = 62;
const maxWidth = 560;
const GRADIENT = "linear-gradient(90deg, #eff5fe 0%, #e5e8ed 100%)";
const INPUT_BAR_HEIGHT = 68;
const NORA_BOX_SHADOW = "0 3px 22px 0 rgba(46,46,46,0.12)";
const NORA_BORDER = "1.2px solid #e5e8ed";
const FEEDBACK_BUBBLE_RADIUS = 21;

const ICONS = {
  telegram: "https://cdn-icons-png.flaticon.com/512/1946/1946547.png",
  trash: "https://cdn-icons-png.flaticon.com/512/1345/1345823.png",
  share: "https://cdn-icons-png.flaticon.com/512/535/535285.png",
  arrowRight: (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path d="M6 11H16M16 11L12 7M16 11L12 15"
        stroke={NORA_COLOR}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
};
const filterNora = "invert(13%) sepia(4%) saturate(271%) hue-rotate(175deg) brightness(92%) contrast(93%)";

const FEEDBACKS_NORA = [
  { name: "Людмила", text: "С Норой я перестала переживать по пустякам — теперь любые вопросы решаю за пару минут!" },
  { name: "Екатерина", text: "Очень удобно: напомнила про посещение врача, подсказала питание по моему анализу — чувствую себя спокойнее!" },
  { name: "Марина", text: "Получаю поддержку, советы и простые рекомендации каждый день! Уже посоветовала коллегам и подруге." },
  { name: "Камила", text: "Nora — настоящая подруга во время беременности! Чат легкий, понятный, рекомендации всегда актуальны." },
  { name: "Ольга", text: "Получила четкую инструкцию по приему витаминов, теперь ничего не путаю. Спасибо!" },
  { name: "Дарья", text: "Вдохновляющие советы и забота, будто рядом настоящий специалист. Радуюсь каждый раз, когда приходит уведомление от Норы." },
  { name: "Анастасия", text: "Удобно отслеживать анализы, у Норы совершенно не случайные подсказки — все по делу." },
  { name: "Вера", text: "Через Нору познакомилась с другими будущими мамами, вместе обсуждаем вопросы и делимся опытом!" }
];

function filterAsterisks(str) {
  return str.replace(/\*/g, "");
}
function splitBotText(text) {
  if (!text) return [];
  return text
    .replace(/\r\n/g, "\n")
    .split(/\n{2,}/)
    .map(s => s.trim())
    .filter(Boolean);
}

type Message = { text: string; sender: "user" | "bot" };
const THREAD_KEY = "nora_thread_id";

const FeedbackBubblesNora = ({ visible }) => {
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
              borderRadius: FEEDBACK_BUBBLE_RADIUS,
              boxShadow: NORA_BOX_SHADOW,
              padding: "18px 25px",
              minWidth: 240,
              maxWidth: 370,
              textAlign: "left",
              border: NORA_BORDER,
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
        title: "Nora AI — Ассистент для будущих мам",
        text: "Современный ассистент для будущих мам на базе NHS — все рекомендации по беременности в одном месте.",
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
    try {
      const res = await fetch("/api/gpt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newHistory, thread_id: threadId }),
      });
      const data = await res.json();
      if (data.thread_id) {
        setThreadId(data.thread_id);
        window.localStorage.setItem(THREAD_KEY, data.thread_id);
      }
      let botReply = data.reply || "Извините, нет ответа от ассистента.";
      if (res.status !== 200 || !botReply) {
        botReply = data.error
          ? (typeof data.error === 'string'
            ? `Ошибка сервера: ${data.error}`
            : `Ассистент не ответил (ошибка сервера)`)
          : "Извините, нет ответа от ассистента.";
      }
      let i = 0;
      setBotProgress("");
      const interval = setInterval(() => {
        setBotProgress(botReply.slice(0, i));
        i++;
        if (i > botReply.length) {
          clearInterval(interval);
          setChatHistory(prev => [...prev, { text: botReply, sender: "bot" }]);
          setBotProgress("");
          setLoading(false);
        }
      }, 18);
    } catch (error) {
      setChatHistory(prev => [...prev, { text: "Ошибка: не удалось получить ответ.", sender: "bot" }]);
      setLoading(false);
      setBotProgress("");
    }
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

  if (!isMobile) {
    return (
      <div style={{
        width: "100vw",
        height: "100vh",
        background: "#f8fdff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "fixed",
        left: 0,
        top: 0,
        zIndex: 10000
      }}>
        <div style={{
          fontWeight: 700,
          fontSize: "21px",
          textAlign: "center",
          color: NORA_COLOR,
          background: "#fff",
          borderRadius: 24,
          padding: "35px 28px",
          boxShadow: "0 6px 36px 0 rgba(155, 175, 205, 0.12)"
        }}>
          Nora AI — доступна только <br /> на мобильных устройствах
        </div>
      </div>
    );
  }

  if (preloading) {
    return (
      <div style={{
        background: "#f8fdff",
        width: "100vw",
        height: "100vh",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 10000,
        margin: 0, padding: 0
      }}>
        <span style={{
          fontWeight: 800,
          fontSize: "38px",
          color: NORA_COLOR,
          letterSpacing: "0.07em",
          animation: "noraPulse 1.4s infinite linear"
        }}>Nora AI</span>
        <style>{`
          @keyframes noraPulse {
            0% { opacity: 0.30; }
            50% { opacity: 1; }
            100% { opacity: 0.30; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div
      style={{
        background: "#f8fdff",
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
        background: GRADIENT,
        color: NORA_COLOR,
        margin: "20px auto 0 auto",
        display: "flex", alignItems: "center",
        borderRadius: borderRadius,
        paddingLeft: 20, paddingRight: 12, paddingTop: 5, paddingBottom: 5,
        justifyContent: "flex-start", boxSizing: "border-box", zIndex: 1, boxShadow: "none"
      }}>
        <div style={{
          marginRight: 10, color: NORA_COLOR,
          display: "flex", flexDirection: "column", justifyContent: "center", minWidth: 0
        }}>
          <span style={{
            fontWeight: 800, fontSize: "19px", lineHeight: 1.06,
            whiteSpace: "nowrap", marginBottom: 7
          }}>Nora AI</span>
          <span style={{
            fontWeight: 400, fontSize: "13px",
            color: "#565656", lineHeight: 1.04, whiteSpace: "nowrap"
          }}>Ассистент для будущих мам</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: "auto" }}>
          <button style={{
            background: "transparent", border: "none", cursor: "pointer",
            width: 38, height: 38, borderRadius: 19,
            display: "flex", alignItems: "center", justifyContent: "center"
          }} onClick={handleShare}>
            <img src={ICONS.share} alt="Share"
              style={{ width: ICON_SIZE, height: ICON_SIZE, filter: filterNora }} />
          </button>
          <button style={{
            background: "transparent", border: "none", cursor: "pointer",
            width: 38, height: 38, borderRadius: 19,
            display: "flex", alignItems: "center", justifyContent: "center"
          }} onClick={() => window.open("https://t.me/norasmart", "_blank")}>
            <img src={ICONS.telegram} alt="Telegram"
              style={{ width: ICON_SIZE, height: ICON_SIZE, filter: filterNora }} />
          </button>
          <button style={{
            background: "transparent", border: "none", cursor: "pointer",
            width: 38, height: 38, borderRadius: 19,
            display: "flex", alignItems: "center", justifyContent: "center"
          }} onClick={clearChatAll}>
            <img src={ICONS.trash} alt="Trash"
              style={{ width: ICON_SIZE, height: ICON_SIZE, filter: filterNora }} />
          </button>
        </div>
      </div>
      {/* Содержимое welcome-экрана */}
      {showWelcome ? (
        <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
          <div style={{ width: "100%", maxWidth }}>
            <div style={{ height: 20 }} />
            <div style={{ display: "flex", justifyContent: "center" }}>
              <img src={BANNER} alt="Nora AI баннер" style={{
                width: "100%", maxWidth: "300px", height: "auto", display: "block",
                objectFit: "contain", objectPosition: "center"
              }} />
            </div>
            <div style={{ height: 20 }} />
            <div style={{ height: 20 }} />
            <div style={{ textAlign: "center" }}>
              <div style={{
                fontWeight: 400, fontSize: "16px", margin: "0 auto", maxWidth: 400,
                padding: "0 20px", lineHeight: 1.75,
                color: NORA_COLOR,
                display: "inline-block"
              }}>
                Nora помогает будущим мамам получать актуальные, персональные рекомендации и спокойствие — теперь не нужно искать ответы по разным сайтам.
              </div>
            </div>
            <div style={{ height: 20 }} />
            {/* Кнопка "Начать пользоваться" */}
            <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
              <button style={{
                background: GRADIENT,
                color: NORA_COLOR,
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
              }} onClick={() => setShowWelcome(false)}>
                <span style={{
                  display: "flex", alignItems: "center", justifyContent: "center"
                }}>
                  Начать пользоваться&nbsp;{ICONS.arrowRight}
                </span>
              </button>
            </div>
            <div style={{ height: 20 }} />
            <FeedbackBubblesNora visible={showWelcome} />
            <div style={{ height: 24 }} />
          </div>
        </div>
      ) : (
        // Чат-интерфейс
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
                    background: NORA_COLOR,
                    color: "#fff",
                    borderRadius: 16,
                    padding: "18px 20px",
                    lineHeight: 1.7,
                    fontSize: 17,
                    minWidth: 0,
                    boxShadow: "0 2px 14px 0 rgba(46,46,46,0.09)",
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
          {/* Печатание ответа */}
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
          {/* Инпут бар */}
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
            height: INPUT_BAR_HEIGHT
          }}>
            <input
              value={message}
              onChange={e => setMessage(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSendMessage()}
              placeholder="Введите ваше сообщение..."
              style={{
                flex: 1,
                borderRadius: 17,
                border: "1.2px solid #e8eaf1",
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
                background: GRADIENT,
                color: NORA_COLOR,
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
