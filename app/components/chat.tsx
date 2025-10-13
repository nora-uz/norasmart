"use client";
import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";

const NORA_COLOR = "#2e2e2e";
const ICON_SIZE = 23;
const PANEL_TOP = 20;
const FIRST_MSG_OFFSET = 30;
const ADDITIONAL_PANEL_OFFSET = 10;
const BANNER_BOTTOM_OFFSET = 50;

const ICONS = {
  telegram: "https://cdn-icons-png.flaticon.com/512/1946/1946547.png",
  trash: "https://cdn-icons-png.flaticon.com/512/1345/1345823.png",
  share: "https://cdn-icons-png.flaticon.com/512/535/535285.png",
  arrowRight: (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path d="M6 11H16M16 11L12 7M16 11L12 15" stroke={NORA_COLOR} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
};
const filterNora = "invert(13%) sepia(4%) saturate(271%) hue-rotate(175deg) brightness(92%) contrast(93%)";
const BANNER = "/banner.webp";
const borderRadius = 22;
const panelHeight = 62;
const maxWidth = 560;
const GRADIENT = "linear-gradient(90deg, #eff5fe 0%, #e5e8ed 100%)";

const topics = [
  {
    title: "Постоянная усталость и сонливость",
    description: "Чувствуете невозможную усталость? Узнайте, чем это вызвано и как минимально повысить энергию без вреда для малыша.",
    query: "Почему беременные так быстро устают и что делать?"
  },
  {
    title: "Тревоги, страхи и стресс",
    description: "Беспокойство перед родами, страхи, паника — что делать, когда эмоции мешают наслаждаться ожиданием счастливого события?",
    query: "Как справиться с тревогой во время беременности?"
  },
  {
    title: "Рацион, питание, витамины",
    description: "Что должно быть на столе будущей мамы? Какие витамины необходимы именно сейчас? Лёгкие идеи для меню на каждый день.",
    query: "Какие продукты полезны беременным и какие витамины пить?"
  },
  {
    title: "Проблемы со сном",
    description: "Невозможно быстро заснуть, часто просыпаетесь ночью. Рабочие советы для комфортного сна и отдыха.",
    query: "Как улучшить качество сна во время беременности?"
  }
];

function filterAsterisks(str: string) {
  return str.replace(/\*/g, "");
}

function formatBotText(text: string) {
  if (!text) return "";
  let cleaned = filterAsterisks(text).replace(/_/g, "");
  const firstSentenceMatch = cleaned.match(/^([^.!?]+[.!?])/);
  const firstSentence = firstSentenceMatch ? firstSentenceMatch[1].trim() : "";
  const restText = firstSentence ? cleaned.slice(firstSentence.length).trim() : cleaned.trim();
  let result = "";
  if (firstSentence) result += `**${firstSentence}** `;
  if (restText) result += restText;
  result = result.replace(/\*\*(.*?)\*\*[*]+/g, "$1");
  return result.trim();
}

type Message = { text: string; sender: "user" | "bot" };

const Chat: React.FC = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [preloading, setPreloading] = useState(true);
  const [message, setMessage] = useState("");
  const [showTopics, setShowTopics] = useState(true);
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [threadId, setThreadId] = useState<string | null>(null);
  const [botProgress, setBotProgress] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  // ОТПРАВКА СО ВСЕЙ ИСТОРИЕЙ и всегда слежение за thread_id
  const sendMessageToGPT = async (text: string) => {
    setLoading(true);
    const newHistory: Message[] = [...chatHistory, { text: filterAsterisks(text), sender: "user" }];
    setChatHistory(newHistory);
    setBotProgress("");
    try {
      const res = await fetch("/api/gpt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newHistory, thread_id: threadId }), // всегда передаем текущий thread_id!
      });
      const data = await res.json();
      if (data.thread_id) setThreadId(data.thread_id); // присваиваем всегда

      let botReply = data.reply;
      if (res.status !== 200 || !botReply) {
        botReply = data.error 
          ? (typeof data.error === 'string'
              ? `Ошибка сервера: ${data.error}`
              : `Ассистент не ответил (ошибка сервера)`)
          : "Извините, нет ответа от ассистента.";
      }

      let i = 0;
      setBotProgress("");
      botReply = filterAsterisks(botReply);
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
  const handleTopicClick = (topic: typeof topics[0]) => {
    setShowTopics(false);
    sendMessageToGPT(`Хочу обсудить ${topic.title.toLowerCase()}`);
    setMessage("");
  };

  if (preloading) {
    return (
      <div style={{
        background: "#f8fdff",
        width: "100vw",
        height: "100vh",
        minHeight: "100vh",
        display: "flex",
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
        overflow: "hidden",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        boxSizing: "border-box",
        paddingTop: panelHeight + PANEL_TOP + FIRST_MSG_OFFSET + ADDITIONAL_PANEL_OFFSET,
      }}
    >
      {/* Фиксированная панель */}
      <div style={{
        width: "calc(100% - 40px)",
        maxWidth,
        minHeight: panelHeight,
        background: GRADIENT,
        color: NORA_COLOR,
        position: "fixed",
        top: PANEL_TOP,
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        alignItems: "center",
        borderRadius: borderRadius,
        paddingLeft: 20,
        paddingRight: 12,
        paddingTop: 5,
        paddingBottom: 5,
        justifyContent: "flex-start",
        boxSizing: "border-box",
        zIndex: 100
      }}>
        <div style={{
          marginRight: 10,
          color: NORA_COLOR,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          minWidth: 0
        }}>
          <span style={{
            fontWeight: 800, fontSize: "19px", lineHeight: 1.06,
            whiteSpace: "nowrap", marginBottom: 7
          }}>Nora AI</span>
          <span style={{
            fontWeight: 400, fontSize: "13px", color: "#565656",
            lineHeight: 1.04, whiteSpace: "nowrap"
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
          }} onClick={() => {
            setChatHistory([]);
            setThreadId(null);
            setShowWelcome(true);
            setShowTopics(true);
            setBotProgress("");
          }}>
            <img src={ICONS.trash} alt="Trash"
              style={{ width: ICON_SIZE, height: ICON_SIZE, filter: filterNora }} />
          </button>
        </div>
      </div>

      {showWelcome ? (
        <>
        <div style={{
          width: "calc(100% - 40px)", maxWidth, borderRadius: 26,
          overflow: "hidden", margin: "10px auto 0 auto",
          display: "flex", justifyContent: "center", alignItems: "center"
        }}>
          <img src={BANNER} alt="Nora AI баннер"
            style={{
              width: "100%", height: "auto", display: "block",
              objectFit: "contain", objectPosition: "center"
            }}
          />
        </div>
        <div style={{ height: BANNER_BOTTOM_OFFSET }} />
        <div style={{
          width: "calc(100% - 40px)", maxWidth, textAlign: "center"
        }}>
          <div style={{
            fontWeight: 700, fontSize: "22px", color: NORA_COLOR, marginBottom: 14
          }}>Добро пожаловать, Я Nora</div>
          <div style={{
            fontWeight: 400, fontSize: "15px", margin: "0 auto 0 auto",
            maxWidth: 400, padding: "0 20px", lineHeight: 1.75,
            color: NORA_COLOR, display: "inline-block"
          }}>
            Я помогаю будущим мамам на каждом этапе беременности: отвечаю на вопросы, напоминаю о важных делах, слежу за самочувствием и даю советы, основанные на медицине Великобритании NHS.
          </div>
          <div style={{ height: 40 }} />
        </div>
        <button
          style={{
            width: "100%",
            maxWidth: 290,
            background: GRADIENT,
            color: NORA_COLOR,
            border: "none",
            borderRadius: borderRadius,
            fontWeight: 700,
            fontSize: "17px",
            padding: "15px 0",
            margin: "0 20px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
          onClick={() => setShowWelcome(false)}
        >
          Начать пользоваться&nbsp;
          <span style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            {ICONS.arrowRight}
          </span>
        </button>
        </>
      ) : (
        <>
        {showTopics && (
          <div style={{
            width: "100%",
            maxWidth: 520,
            padding: "0 20px",
            display: "flex",
            flexDirection: "column",
            gap: 20,
            margin: "30px auto 0 auto",
          }}>
            {topics.map((topic, idx) => (
              <div key={idx}
                style={{
                  background: GRADIENT,
                  borderRadius: borderRadius,
                  padding: "15px 20px",
                  display: "flex", flexDirection: "column",
                  alignItems: "flex-start", boxSizing: "border-box",
                  cursor: "pointer",
                  boxShadow: "0 2px 14px 0 rgba(155,175,205,0.07)"
                }}
                onClick={() => handleTopicClick(topic)}
              >
                <div style={{
                  fontWeight: 600, fontSize: "16px", color: NORA_COLOR, marginBottom: 7
                }}>{topic.title}</div>
                <div style={{
                  fontWeight: 400, fontSize: "13px", color: "#565656", lineHeight: 1.4
                }}>{topic.description}</div>
              </div>
            ))}
          </div>
        )}

        <div style={{
          width: "100%",
          maxWidth,
          padding: "0 20px",
          margin: "0 auto",
          marginTop: 0,
          flex: 1,
          overflowY: "auto"
        }}>
          {chatHistory.map((msg, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                width: "100%",
                marginTop: idx === 0 ? 0 : 30,
                marginBottom: 30,
                paddingLeft: 20,
                paddingRight: 20,
                justifyContent: "flex-start"
              }}
            >
              <span
                style={{
                  background: GRADIENT,
                  color: NORA_COLOR,
                  borderRadius: 16,
                  padding: "18px 20px",
                  lineHeight: 1.7,
                  fontSize: 17,
                  minWidth: 0,
                  boxShadow: "0 2px 14px 0 rgba(155,175,205,0.07)",
                  maxWidth: "100%",
                  margin: 0,
                  wordBreak: "break-word",
                  fontWeight: 400,
                  width: "100%",
                  display: "block"
                }}
              >
                {msg.sender === "bot"
                  ? <ReactMarkdown>{formatBotText(msg.text)}</ReactMarkdown>
                  : filterAsterisks(msg.text)
                }
              </span>
            </div>
          ))}
          {botProgress && (
            <div
              style={{
                display: "flex",
                width: "100%",
                marginTop: chatHistory.length === 0 ? 0 : 30,
                marginBottom: 30,
                paddingLeft: 20,
                paddingRight: 20,
                justifyContent: "flex-start"
              }}
            >
              <span
                style={{
                  background: GRADIENT,
                  color: NORA_COLOR,
                  borderRadius: 16,
                  padding: "18px 20px",
                  lineHeight: 1.7,
                  fontSize: 17,
                  minWidth: 0,
                  boxShadow: "0 2px 14px 0 rgba(155,175,205,0.07)",
                  maxWidth: "100%",
                  margin: 0,
                  wordBreak: "break-word",
                  fontWeight: 400,
                  width: "100%",
                  display: "block"
                }}
              >
                <ReactMarkdown>{formatBotText(botProgress)}</ReactMarkdown>
              </span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <div style={{
          width: "100%",
          padding: "0 20px",
          display: "flex",
          alignItems: "center",
          margin: "0 auto",
          boxSizing: "border-box",
          maxWidth: maxWidth,
          position: "fixed",
          left: 0,
          bottom: 20,
          background: "#f8fdff",
          zIndex: 20
        }}>
          <input
            type="text"
            value={message}
            onChange={e => setMessage(filterAsterisks(e.target.value))}
            placeholder="Введите сообщение..."
            style={{
              flex: 1,
              height: 48,
              fontSize: "16px",
              borderRadius: borderRadius,
              border: "1px solid #e5e8ed",
              padding: "0 18px",
              background: "#fff",
              color: NORA_COLOR,
              boxSizing: "border-box",
              marginRight: 8
            }}
            onKeyDown={e => { if (e.key === 'Enter') handleSendMessage(); }}
            disabled={loading || !!botProgress}
          />
          <button
            style={{
              width: 48,
              height: 48,
              background: GRADIENT,
              color: NORA_COLOR,
              border: "none",
              borderRadius: borderRadius,
              fontWeight: 700,
              fontSize: "17px",
              cursor: (loading || !!botProgress) ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 14px 0 rgba(155,175,205,0.12)"
            }}
            onClick={handleSendMessage}
            disabled={loading || !!botProgress}
          >
            <span style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              {ICONS.arrowRight}
            </span>
          </button>
        </div>
        </>
      )}
    </div>
  );
};

export default Chat;
