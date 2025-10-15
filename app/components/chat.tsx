"use client";
import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";

const NORA_COLOR = "#2e2e2e";
const GRADIENT = "linear-gradient(90deg, #eff5fe 0%, #e5e8ed 100%)";
const INPUT_BAR_HEIGHT = 68;
const maxWidth = 560;
const THREAD_KEY = "nora_thread_id";

// 💬 форматирование текста Норы в читаемые абзацы
function formatBotText(text: string) {
  if (!text) return "";
  // Убираем нижние подчеркивания
  let cleaned = text.replace(/_/g, "");
  // Разбиваем по точкам, восклицаниям и переводам строк
  const paragraphs = cleaned
    .split(/\n+/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  // Склеиваем обратно с двойным переносом строк для ReactMarkdown
  return paragraphs.join("\n\n");
}

function filterAsterisks(str: string) {
  return str.replace(/\*/g, "");
}

type Message = { text: string; sender: "user" | "bot" };

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
    return () => {
      document.body.style.overflow = "auto";
    };
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

  const sendMessageToGPT = async (text: string) => {
    setLoading(true);
    const newHistory: Message[] = [
      ...chatHistory,
      { text: filterAsterisks(text), sender: "user" },
    ];
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
          ? typeof data.error === "string"
            ? `Ошибка сервера: ${data.error}`
            : `Ассистент не ответил (ошибка сервера)`
          : "Извините, нет ответа от ассистента.";
      }
      let i = 0;
      setBotProgress("");
      const interval = setInterval(() => {
        setBotProgress(botReply.slice(0, i));
        i++;
        if (i > botReply.length) {
          clearInterval(interval);
          setChatHistory((prev) => [
            ...prev,
            { text: botReply, sender: "bot" },
          ]);
          setBotProgress("");
          setLoading(false);
        }
      }, 18);
    } catch (error) {
      setChatHistory((prev) => [
        ...prev,
        { text: "Ошибка: не удалось получить ответ.", sender: "bot" },
      ]);
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
      <div
        style={{
          width: "100vw",
          height: "100vh",
          background: "#f8fdff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            fontWeight: 700,
            fontSize: "21px",
            textAlign: "center",
            color: NORA_COLOR,
            background: "#fff",
            borderRadius: 24,
            padding: "35px 28px",
            boxShadow: "0 6px 36px 0 rgba(155, 175, 205, 0.12)",
          }}
        >
          Nora AI — доступна только <br /> на мобильных устройствах
        </div>
      </div>
    );
  }

  if (preloading) {
    return (
      <div
        style={{
          background: "#f8fdff",
          width: "100vw",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            fontWeight: 800,
            fontSize: "38px",
            color: NORA_COLOR,
            letterSpacing: "0.07em",
            animation: "noraPulse 1.4s infinite linear",
          }}
        >
          Nora AI
        </span>
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
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth,
          paddingBottom: INPUT_BAR_HEIGHT + 20,
        }}
      >
        {chatHistory.map((msg, idx) => (
          <div
            key={idx}
            style={{
              display: "flex",
              width: "100%",
              justifyContent:
                msg.sender === "user" ? "flex-end" : "flex-start",
            }}
          >
            <div
              style={{
                margin: "20px",
                maxWidth: 450,
                alignSelf:
                  msg.sender === "user" ? "flex-end" : "flex-start",
              }}
            >
              {msg.sender === "user" ? (
                <span
                  style={{
                    background: GRADIENT,
                    color: NORA_COLOR,
                    borderRadius: 16,
                    padding: "18px 20px",
                    lineHeight: 1.7,
                    fontSize: 17,
                    display: "inline-block",
                    wordBreak: "break-word",
                  }}
                >
                  {filterAsterisks(msg.text)}
                </span>
              ) : (
                <span
                  style={{
                    color: NORA_COLOR,
                    fontSize: 17,
                    lineHeight: 1.8,
                    display: "inline-block",
                    wordBreak: "break-word",
                  }}
                >
                  <ReactMarkdown
                    components={{
                      p: ({ node, ...props }) => (
                        <p
                          style={{
                            marginBottom: "12px",
                            whiteSpace: "pre-wrap",
                          }}
                          {...props}
                        />
                      ),
                      strong: ({ node, ...props }) => (
                        <strong
                          style={{
                            color: "#f38ab3",
                            fontWeight: 700,
                          }}
                          {...props}
                        />
                      ),
                    }}
                  >
                    {formatBotText(msg.text)}
                  </ReactMarkdown>
                </span>
              )}
            </div>
          </div>
        ))}
        {botProgress && (
          <div style={{ marginLeft: 20, marginRight: 20 }}>
            <ReactMarkdown>{formatBotText(botProgress)}</ReactMarkdown>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default Chat;