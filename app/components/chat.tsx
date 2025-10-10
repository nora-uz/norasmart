import React, { useState, useEffect, useRef } from "react";
import Markdown from "react-markdown";
const WELCOME_IMAGE = "https://user-gen-media-assets.s3.amazonaws.com/seedream_images/70a60994-809a-473d-accc-36284ba46e1c.png";

const ICON_SIZE = 28;

const icons = {
  sun: (
    <svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 24 24"><circle cx="12" cy="12" r="6" fill="none" stroke="#fff" strokeWidth="2"/><g stroke="#fff" strokeWidth="1.5"><line x1="12" y1="1" x2="12" y2="4"/><line x1="12" y1="20" x2="12" y2="23"/><line x1="1" y1="12" x2="4" y2="12"/><line x1="20" y1="12" x2="23" y2="12"/><line x1="4.2" y1="4.2" x2="6.5" y2="6.5"/><line x1="19.8" y1="19.8" x2="17.5" y2="17.5"/><line x1="19.8" y1="4.2" x2="17.5" y2="6.5"/><line x1="4.2" y1="19.8" x2="6.5" y2="17.5"/></g></svg>
  ),
  moon: (
    <svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 24 24"><path d="M17 6.5A9.5 9.5 0 1 1 6.5 17a9.5 9.5 0 0 0 10.5-10.5z" stroke="#fff" strokeWidth="2" fill="none"/></svg>
  ),
  trash: (
    <svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 24 24"><rect x="6" y="8" width="12" height="10" rx="2" stroke="#fff" strokeWidth="2" fill="none"/><path d="M10 11v4M14 11v4M8 8V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="#fff" strokeWidth="2" fill="none"/><line x1="4" y1="8" x2="20" y2="8" stroke="#fff" strokeWidth="2"/></svg>
  ),
  send: (
    <svg width={20} height={20} viewBox="0 0 20 20"><path d="M4 10H16M16 10L10 4M16 10L10 16" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
  )
};

const WelcomeMessage = ({borderRadius}) => (
  <div>
    {/* Фото занимает всю ширину блока, сверху */}
    <img
      src={WELCOME_IMAGE}
      alt="Nora AI"
      style={{
        width: "100%",
        height: "auto",
        borderRadius: borderRadius,
        marginBottom: 18,
        objectFit: "cover"
      }}
    />
    <div style={{
      fontWeight: 700,
      fontSize: "1.12em",
      marginBottom: 8
    }}>
      79% мам совершают ошибки на ранних сроках беременности 👶🏻
    </div>
    <div style={{marginBottom: 8, fontSize: "1em"}}>
      👩🏻‍💻 Я — Нора, умный помощник для будущих мам на базе знаний NHS.
      Слежу за состоянием, предупреждаю о рисках, даю советы и поддерживаю.
    </div>
  </div>
);

const Chat = () => {
  const [userInput, setUserInput] = useState("");
  const [darkMode, setDarkMode] = useState(true);
  const [messages, setMessages] = useState([{ role: "assistant", text: "" }]);
  const [inputDisabled, setInputDisabled] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    setMessages([{ role: "assistant", text: "" }]);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;
    setMessages(prev => [...prev, { role: "user", text: userInput }]);
    setUserInput("");
    setInputDisabled(false);
  };

  const clearChat = () => {
    setMessages([{ role: "assistant", text: "" }]);
    setUserInput("");
  };

  // --- Стили ---
  const bgColor = "#1C1C1C";
  const panelBg = "#171717";
  const assistantBubble = panelBg;
  const inputBg = panelBg;
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
      }}>
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
          padding: "0 14px"
        }}>
        <div style={{ fontWeight: 600, fontSize: 15 }}>Nora AI</div>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 18
        }}>
          <button
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              width: ICON_SIZE,
              height: ICON_SIZE,
              borderRadius: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
            onClick={() => setDarkMode(d => !d)}
            aria-label="Переключить тему"
          >
            {darkMode ? icons.moon : icons.sun}
          </button>
          <button
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              width: ICON_SIZE,
              height: ICON_SIZE,
              borderRadius: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
            onClick={clearChat}
            aria-label="Очистить чат"
          >
            {icons.trash}
          </button>
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
        padding: "85px 15px 90px 15px"
      }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{
            display: "flex",
            justifyContent: msg.role === "assistant" ? "flex-start" : "flex-end",
            marginBottom: 12,
          }}>
            {msg.role === "assistant"
              ? <div style={{
                  background: assistantBubble,
                  color: "#fff",
                  borderRadius: borderRadius,
                  padding: "0px 0px 12px 0px",
                  fontSize: 17,
                  lineHeight: 1.65,
                  border: "none",
                  maxWidth: "86vw",
                  minWidth: 54,
                  marginRight: "auto"
                }}>
                <WelcomeMessage borderRadius={borderRadius} />
                {msg.text && msg.text.trim() !== "" && (
                  <div style={{padding: "0 14px"}}>
                    <Markdown>{msg.text}</Markdown>
                  </div>
                )}
                </div>
              : <div style={{
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
            }
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      {/* Инпут */}
      <form onSubmit={handleSubmit} style={{
        position: "fixed",
        left: 15,
        right: 15,
        bottom: 25,
        background: inputBg,
        borderRadius: borderRadius,
        display: "flex",
        gap: 0,
        padding: 0,
        zIndex: 101,
        height: 54,
      }}>
        <div style={{
          display: "flex",
          background: inputBg,
          borderRadius: borderRadius,
          alignItems: "center",
          width: "100%"
        }}>
          <input
            type="text"
            style={{
              flex: 1,
              border: "none",
              borderRadius: borderRadius,
              height: 44,
              padding: "0 21px",
              fontSize: 19,
              background: inputBg,
              color: "#fff",
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
            width: 44,
            height: 44,
            fontSize: 20,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginRight: 10,
            cursor: inputDisabled ? "not-allowed" : "pointer",
            opacity: inputDisabled ? 0.7 : 1
          }}>
            {icons.send}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chat;
