"use client";
import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";

const NORA_COLOR = "#2e2e2e";
const ICON_SIZE = 23;
const BANNER = "/banner.webp";
const borderRadius = 22;
const panelHeight = 62;
const maxWidth = 560;
const GRADIENT = "linear-gradient(90deg, #eff5fe 0%, #e5e8ed 100%)";
const INPUT_BAR_HEIGHT = 68;

const ICONS = {
  telegram: "https://cdn-icons-png.flaticon.com/512/1946/1946547.png",
  trash: "https://cdn-icons-png.flaticon.com/512/1345/1345823.png",
  share: "https://cdn-icons-png.flaticon.com/512/535/535285.png",
  arrowRight: (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path d="M6 11H16M16 11L12 7M16 11L12 15"
        stroke={NORA_COLOR} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
};
const filterNora = "invert(13%) sepia(4%) saturate(271%) hue-rotate(175deg) brightness(92%) contrast(93%)";

function filterAsterisks(str: string) {
  return str.replace(/\*/g, "");
}

// ✅ Исправленная функция — теперь жирный шрифт сохраняется
function formatBotText(text: string) {
  if (!text) return "";
  let cleaned = text.replace(/_/g, ""); // убираем подчёркивания, но не трогаем **
  const firstSentenceMatch = cleaned.match(/^([^.!?]+[.!?])/);
  const firstSentence = firstSentenceMatch ? firstSentenceMatch[1].trim() : "";
  const restText = firstSentence ? cleaned.slice(firstSentence.length).trim() : cleaned.trim();
  let result = "";
  if (firstSentence) result += `**${firstSentence}** `;
  if (restText) result += restText;
  return result.trim();
}

type Message = { text: string; sender: "user" | "bot" };
const THREAD_KEY = "nora_thread_id";

const Chat: React.FC = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [preloading, setPreloading] = useState(true);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [threadId, setThreadId] = useState<string | null>(null);
  const [botProgress, setBotProgress] = useState("");
  const [showHowTo, setShowHowTo] = useState(true);
  const [isMobile, setIsMobile] = useState(true);
  const [focused, setFocused] = useState(false);

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
      // ⚠️ Не трогаем ** — не вызываем filterAsterisks для ответа
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
      }}
    >
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
      <div style={{ height: 40 }} />

      {/* Остальная часть интерфейса — вся твоя, как была! */}

      {/* ... (сюда вставь оставшийся JSX из прошлого примера — он остается полностью без изменений) ... */}

    </div>
  );
};

export default Chat;
