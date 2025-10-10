import React, { useState, useEffect, useRef } from "react";

// PNG иконки
const ICON_SIZE = 32;
const PANEL_ICONS = [
  { alt: "Полная луна", src: "https://user-gen-media-assets.s3.amazonaws.com/seedream_images/b47fcd5d-20e4-47d7-bb93-ec479ee3ba35.png", key: "moon", onClick: null },
  { alt: "Солнце", src: "https://user-gen-media-assets.s3.amazonaws.com/seedream_images/b4b83412-f425-4b6f-83cf-5f471df7ca3d.png", key: "sun", onClick: null },
  { alt: "Мусорка", src: "https://user-gen-media-assets.s3.amazonaws.com/seedream_images/a1a10e8a-7ce4-4789-8e72-0cbb22504d9c.png", key: "trash", onClick: null },
  { alt: "Телефон", src: "https://user-gen-media-assets.s3.amazonaws.com/seedream_images/09b38cb2-5ed3-402a-ba48-f5716e26968a.png", key: "phone", onClick: () => window.open("tel:+1234567890") },
  { alt: "Telegram", src: "https://user-gen-media-assets.s3.amazonaws.com/seedream_images/50394a9d-0d54-499b-b3b0-2a8a96dc316f.png", key: "telegram", onClick: () => window.open("https://t.me/", "_blank") },
];

const MAIN_IMG = "https://user-gen-media-assets.s3.amazonaws.com/seedream_images/70a60994-809a-473d-accc-36284ba46e1c.png";
// Иконка отправки — большая голубая, старая
const SEND_ICON = "https://user-gen-media-assets.s3.amazonaws.com/seedream_images/b4b83412-f425-4b6f-83cf-5f471df7ca3d.png";

const Chat = () => {
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [inputDisabled, setInputDisabled] = useState(false);
  const messagesEndRef = useRef(null);

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
    setMessages([]);
    setUserInput("");
  };

  // --- Стили ---
  const bgColor = "#1C1C1C";
  const panelBg = "#171717";
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
          top: 18,
          left: 18,
          right: 18,
          zIndex: 100,
          height: ICON_SIZE + 10,
          background: panelBg,
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderRadius: borderRadius,
          padding: "0 18px"
        }}
      >
        <div style={{ fontWeight: 600, fontSize: 17 }}>Nora AI</div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {PANEL_ICONS.map((icon) => (
            <button
              key={icon.key}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                width: ICON_SIZE,
                height: ICON_SIZE,
                borderRadius: 8,
                padding: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
              onClick={icon.onClick ? icon.onClick : undefined}
              aria-label={icon.alt}
            >
              <img
                src={icon.src}
                alt={icon.alt}
                style={{
                  width: ICON_SIZE,
                  height: ICON_SIZE,
                  objectFit: "contain"
                }}
              />
            </button>
          ))}
        </div>
      </div>
      {/* Центрированная картинка "Nora AI" — как меню по отступам */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          marginTop: ICON_SIZE + 42,
          marginBottom: 28,
          minHeight: "calc(46vw - 80px)",
        }}
      >
        <img
          src={MAIN_IMG}
          alt="Nora AI"
          style={{
            width: "calc(100vw - 36px)",
            maxWidth: 650 - 36,
            height: "auto",
            borderRadius: borderRadius,
            objectFit: "cover",
            boxShadow: "none",
            background: "none",
            display: "block",
          }}
        />
      </div>
      {/* Сообщения */}
      <div style={{
        flex: 1,
        width: "100%",
        maxWidth: 650,
        margin: "0 auto",
        boxSizing: "border-box",
        minHeight: "100vh",
        padding: "0 18px 108px 18px"
      }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{
            display: "flex",
            justifyContent: msg.role === "assistant" ? "flex-start" : "flex-end",
            marginBottom: 12,
          }}>
            <div
              style={{
                background: msg.role === "assistant" ? panelBg : "none",
                color: "#fff",
                borderRadius: borderRadius,
                padding: "12px 14px",
                fontSize: 17,
                lineHeight: 1.65,
                border: "none",
                maxWidth: "86vw",
                minWidth: 54,
                marginLeft: msg.role === "user" ? "auto" : 0,
                marginRight: msg.role === "assistant" ? "auto" : 0
              }}>
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      {/* Input */}
      <form onSubmit={handleSubmit} style={{
        position: "fixed",
        left: 18,
        right: 18,
        bottom: 18,
        background: panelBg,
        borderRadius: borderRadius,
        display: "flex",
        alignItems: "center",
        padding: 0,
        zIndex: 101,
        height: 62,
      }}>
        <input
          type="text"
          style={{
            flex: 1,
            border: "none",
            borderRadius: borderRadius,
            height: 44,
            padding: "0 22px",
            fontSize: 18,
            background: panelBg,
            color: "#fff",
            outline: "none",
            marginRight: 10,
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
          marginRight: 15,
          marginTop: 9,
          marginBottom: 9,
          cursor: inputDisabled ? "not-allowed" : "pointer",
          opacity: inputDisabled ? 0.7 : 1
        }}>
          <img src={SEND_ICON} alt="Send" style={{width: 22, height: 22}} />
        </button>
      </form>
    </div>
  );
};

export default Chat;
