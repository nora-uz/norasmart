"use client";
import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";

const NORA_COLOR = "#2e2e2e";
const ICON_SIZE = 23;
const PANEL_TOP = 20;
const FIRST_MSG_OFFSET = 30;
const ADDITIONAL_PANEL_OFFSET = 10;
const BANNER_BOTTOM_OFFSET = 50;
const borderRadius = 22;
const panelHeight = 62;
const maxWidth = 560;
const GRADIENT = "linear-gradient(90deg, #eff5fe 0%, #e5e8ed 100%)";
const THREAD_KEY = "nora_thread_id";
const USER_KEY = "nora_user_id";

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
  const [userId, setUserId] = useState<string | null>(null);
  const [botProgress, setBotProgress] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // ВОССТАНАВЛИВАЕМ thread_id и user_id из localStorage
  useEffect(() => {
    const savedThread = window.localStorage.getItem(THREAD_KEY);
    if (savedThread) setThreadId(savedThread);

    let savedUser = window.localStorage.getItem(USER_KEY);
    if (!savedUser) {
      savedUser = crypto.randomUUID();
      window.localStorage.setItem(USER_KEY, savedUser);
    }
    setUserId(savedUser);
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
        body: JSON.stringify({
          messages: newHistory,
          thread_id: threadId,
          user_id: userId
        }),
      });
      const data = await res.json();
      if (data.thread_id) {
        setThreadId(data.thread_id);
        window.localStorage.setItem(THREAD_KEY, data.thread_id); // сохраняем!
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

  const clearChatAll = () => {
    setChatHistory([]);
    setThreadId(null);
    window.localStorage.removeItem(THREAD_KEY);
    setShowWelcome(true);
    setShowTopics(true);
    setBotProgress("");
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
      {/* Панель и остальной JSX полностью как у тебя */}
      {/* ... Весь UI/JSX код твоей текущей компоненты ... */}

      {/* Просто убедись: код выше теперь внутри твоей функции Chat */}
    </div>
  );
};

export default Chat;
