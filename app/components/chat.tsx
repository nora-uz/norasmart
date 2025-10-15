"use client";
import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";

const NORA_COLOR = "#2e2e2e";
const GRADIENT = "linear-gradient(90deg, #eff5fe 0%, #e5e8ed 100%)";
const INPUT_BAR_HEIGHT = 68;
const maxWidth = 560;

function filterAsterisks(str: string, keepStars = false) {
  return keepStars ? str : str.replace(/\*/g, "");
}

function formatBotText(text: string) {
  if (!text) return "";

  let cleaned = text.replace(/_/g, "").trim();
  const lines = cleaned
    .split(/\n+/)
    .map((l) => l.trim())
    .filter(Boolean);

  if (lines.length === 0) return "";

  const first = `**${lines[0]}**`;
  const rest = lines.slice(1).join("\n\n");

  return rest ? `${first}\n\n${rest}` : first;
}

type Message = { text: string; sender: "user" | "bot" };
const THREAD_KEY = "nora_thread_id";

const Chat: React.FC = () => {
  const [preloading, setPreloading] = useState(true);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [threadId, setThreadId] = useState<string | null>(null);
  const [botProgress, setBotProgress] = useState("");
  const [isMobile, setIsMobile] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = window.localStorage.getItem(THREAD_KEY);
    if (saved) setThreadId(saved);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setPreloading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMobile(window.innerWidth <= 640);
    }
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory, botProgress]);

  const sendMessageToGPT = async (text: string) => {
    setLoading(true);

    // 🟢 добавляем типизацию, чтобы TS понимал тип sender
    const newMessage: Message = { text, sender: "user" };
    const newHistory: Message[] = [...chatHistory, newMessage];

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

      const botReply: string =
        data.reply ||
        "Извини, что-то пошло не так. Попробуй ещё раз позже 💛";

      let i = 0;
      const interval = setInterval(() => {
        setBotProgress(botReply.slice(0, i));
        i++;
        if (i > botReply.length) {
          clearInterval(interval);
          const botMsg: Message = { text: botReply, sender: "bot" };
          setChatHistory((prev) => [...prev, botMsg]);
          setBotProgress("");
          setLoading(false);
        }
      }, 18);
    } catch {
      const errorMsg: Message = {
        text: "Ошибка соединения. Попробуй снова 💬",
        sender: "bot",
      };
      setChatHistory((prev) => [...prev, errorMsg]);
      setLoading(false);
    }
  };

  const handleSend = () => {
    if (message.trim() && !loading) {
      sendMessageToGPT(message.trim());
      setMessage("");
    }
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
          position: "fixed",
          left: 0,
          top: 0,
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
            animation: "pulse 1.4s infinite linear",
          }}
        >
          Nora AI
        </span>
        <style>{`
          @keyframes pulse {
            0% { opacity: 0.3; }
            50% { opacity: 1; }
            100% { opacity: 0.3; }
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
              justifyContent: msg.sender === "user" ? "flex-end" : "flex-start",
              margin: "20px",
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
                  lineHeight: 1.7,
                  display: "inline-block",
                  wordBreak: "break-word",
                }}
              >
                <ReactMarkdown
                  components={{
                    p: ({ node, ...props }) => (
                      <p style={{ marginBottom: "10px" }} {...props} />
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
        ))}

        {botProgress && (
          <div style={{ margin: "20px" }}>
            <ReactMarkdown>{formatBotText(botProgress)}</ReactMarkdown>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default Chat;