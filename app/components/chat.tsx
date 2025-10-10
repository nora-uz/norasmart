import React, { useState, useEffect, useRef } from "react";
import Markdown from "react-markdown";
const WELCOME_IMAGE = "https://user-gen-media-assets.s3.amazonaws.com/seedream_images/70a60994-809a-473d-accc-36284ba46e1c.png";

const ICON_SIZE = 24;

const icons = {
  sun: (
    <svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="6" fill="none" stroke="#fff" strokeWidth="2"/>
      <g stroke="#fff" strokeWidth="1.5">
        <line x1="12" y1="1" x2="12" y2="4"/>
        <line x1="12" y1="20" x2="12" y2="23"/>
        <line x1="1" y1="12" x2="4" y2="12"/>
        <line x1="20" y1="12" x2="23" y2="12"/>
      </g>
    </svg>
  ),
  moon: (
    <svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 24 24">
      <path d="M17 6.5A9.5 9.5 0 1 1 6.5 17a9.5 9.5 0 0 0 10.5-10.5z" stroke="#fff" strokeWidth="2" fill="none"/>
    </svg>
  ),
  refresh: (
    <svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 24 24"><path d="M5 19A9 9 0 1 1 19 5" stroke="#fff" strokeWidth="2" fill="none" /><polyline points="19 9 19 5 15 5" stroke="#fff" strokeWidth="2" fill="none"/></svg>
  ),
  telegram: (
    <svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 24 24"><path d="M3.7 12.5L20.3 3.5c.6-.3 1.2.4 1 .9l-3.1 17.3c-.1.6-.7.8-1.1.3l-4.2-5.2-2.5 2c-.4.3-1 .1-1-.4l1-6.4-5-1.2c-.6-.1-.7-.9-.2-1.1z" stroke="#fff" strokeWidth="1.5" fill="none"/></svg>
  ),
  phone: (
    <svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 24 24" style={{transform:"scaleX(-1)"}}><path d="M6.8 11.5C8.4 13.9 11.2 16.6 13.6 18.2l1.6-1.7c.4-.4 1-.4 1.5-.3 1.2.4 2.4.7 3.7.7.7 0 1.2.5 1.2 1.2v3.1c0 .7-.5 1.2-1.2 1.2-8.1 0-14.7-6.6-14.7-14.7 0-.7.5-1.2 1.2-1.2H8.5c.7 0 1.2.5 1.2 1.2 0 1.2.3 2.4.7 3.7.2.5.1 1.1-.3 1.5l-1.7 1.6z" stroke="#fff" strokeWidth="1.5" fill="none"/></svg>
  ),
  send: (
    <svg width={20} height={20} viewBox="0 0 20 20"><path d="M4 10H16M16 10L10 4M16 10L10 16" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
  )
};

const Chat = () => {
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: `
**79% мам совершают ошибки на ранних сроках беременности 👶🏻**

![Nora AI](${WELCOME_IMAGE})

👩🏻‍💻 Я — Нора, умный помощник для будущих мам на базе знаний NHS.
Слежу за состоянием, предупреждаю о рисках, даю советы и поддерживаю.
      `
    }
  ]);
  const [inputDisabled, setInputDisabled] = useState(false);
  const [threadId, setThreadId] = useState("");
  const [darkMode, setDarkMode] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const createThread = async () => {
      const res = await fetch(`/api/assistants/threads`, {
        method: "POST",
      });
      const data = await res.json();
      setThreadId(data.threadId);
    };
    createThread();
  }, []);

  const sendMessage = async (text) => {
    const response = await fetch(
      `/api/assistants/threads/${threadId}/messages`,
      {
        method: "POST",
        body: JSON.stringify({ content: text }),
      }
    );
    // ... если используете stream, добавьте обработчик
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;
    sendMessage(userInput);
    setMessages(prevMessages => [
      ...prevMessages,
      { role: "user", text: userInput }
    ]);
    setUserInput("");
    setInputDisabled(true);
  };

  const clearChat = () => {
    setMessages([
      {
        role: "assistant",
        text: `
**79% мам совершают ошибки на ранних сроках беременности 👶🏻**

![Nora AI](${WELCOME_IMAGE})

👩🏻‍💻 Я — Нора, умный помощник для будущих мам на базе знаний NHS.
Слежу за состоянием, предупреждаю о рисках, даю советы и поддерживаю.
      `
      }
    ]);
    setUserInput("");
  };

  // ----- Стили -----
  const bgColor = "#1C1C1C";
  const panelBg = "#171717";
  const assistantBubble = "#15151A";
  const inputBg = "#171717";
  const inputColor = "#fff";
  const borderRadius = 18;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: bgColor,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: 0,
      }}
    >
      {/* Панель */}
      <div
        style={{
          position: "fixed",
          top: 15,
          left: 15,
          right: 15,
          zIndex: 100,
          height: 52,
          background: panelBg,
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderRadius: borderRadius,
          padding: "0 14px",
        }}
      >
        <div style={{ fontWeight: 600, fontSize: 15 }}>Nora AI</div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button onClick={() => setDarkMode(v => !v)} aria-label="Сменить тему" style={{background:"none", border:"none", cursor:"pointer"}}>{darkMode ? icons.moon : icons.sun}</button>
          <button onClick={clearChat} aria-label="Очистить чат" style={{background:"none", border:"none", cursor:"pointer"}}>{icons.refresh}</button>
          <button aria-label="Telegram" style={{background:"none", border:"none", cursor:"pointer"}} onClick={() => window.open("https://t.me/", "_blank")}>{icons.telegram}</button>
          <button aria-label="Позвонить" style={{background:"none", border:"none", cursor:"pointer"}} onClick={() => window.open("tel:+1234567890")}>{icons.phone}</button>
        </div>
      </div>
      {/* Сообщения */}
      <div style={{
        flex: 1,
        width: "100%",
        maxWidth: 650,
        margin: "0 auto",
        boxSizing: "border-box",
        minHeight: "100vh",
        padding: "85px 15px 70px 15px"
      }}>
        {messages.map((msg, index) => (
          <div key={index} style={{
            display: "flex",
            justifyContent: msg.role === "assistant" ? "flex-start" : "flex-end",
            marginBottom: 12,
          }}>
            {msg.role === "assistant" ? (
              <div style={{
                background: assistantBubble,
                color: "#fff",
                borderRadius: borderRadius,
                padding: "10px 14px",
                fontSize: 17,
                lineHeight: 1.65,
                border: "none",
                maxWidth: "86vw",
                minWidth: 54,
                marginRight: "auto"
              }}>
                <Markdown>{msg.text}</Markdown>
              </div>
            ) : (
              <div style={{
                background: "none",
                color: "#fff",
                borderRadius: borderRadius,
                padding: "9px 0px",
                fontSize: 17,
                lineHeight: 1.65,
                border: "none",
                maxWidth: "86vw",
                minWidth: 54,
                marginLeft: "auto"
              }}>
                <Markdown>{msg.text}</Markdown>
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      {/* Инпут */}
      <form onSubmit={handleSubmit} style={{
        position: "fixed",
        left: 15,
        right: 15,
        bottom: 15,
        background: inputBg,
        borderRadius: borderRadius,
        display: "flex",
        gap: 8,
        padding: 0,
        zIndex: 101,
        height: 52,
      }}>
        <input
          type="text"
          style={{
            flex: 1,
            border: "none",
            borderRadius: borderRadius,
            height: "100%",
            padding: "0 13px",
            fontSize: 17,
            background: inputBg,
            color: inputColor,
            outline: "none"
          }}
          value={userInput}
          onChange={e => setUserInput(e.target.value)}
          placeholder="Введите ваш вопрос"
          disabled={inputDisabled}
        />
        <button type="submit" style={{
          background: "#2646FC",
          color: "#fff",
          border: "none",
          borderRadius: borderRadius,
          width: 36,
          height: 36,
          fontSize: 17,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          margin: "auto 4px auto 0",
          cursor: inputDisabled ? "not-allowed" : "pointer",
          opacity: inputDisabled ? 0.7 : 1
        }}>
          {icons.send}
        </button>
      </form>
    </div>
  );
};

export default Chat;
