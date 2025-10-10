import React, { useState, useEffect, useRef } from "react";

// PNG иконки (32px, прозрачный фон)
const ICON_SIZE = 32;

const ICON_MOON = "https://user-gen-media-assets.s3.amazonaws.com/seedream_images/350cb7b8-4f7f-43db-9c71-c5388ac17f4e.png";
const ICON_SUN = "https://user-gen-media-assets.s3.amazonaws.com/seedream_images/baf09364-3f86-47e1-8134-0c505aeaf9cc.png";
const ICON_TRASH = "https://user-gen-media-assets.s3.amazonaws.com/seedream_images/a1a10e8a-7ce4-4789-8e72-0cbb22504d9c.png";
const ICON_PHONE = "https://user-gen-media-assets.s3.amazonaws.com/seedream_images/09b38cb2-5ed3-402a-ba48-f5716e26968a.png";
const ICON_TELEGRAM = "https://user-gen-media-assets.s3.amazonaws.com/seedream_images/50394a9d-0d54-499b-b3b0-2a8a96dc316f.png";
const ICON_ARROW = "https://user-gen-media-assets.s3.amazonaws.com/seedream_images/4f06cab0-ec48-4875-8a37-e4f27fb4da0c.png";

const MAIN_IMG = "https://user-gen-media-assets.s3.amazonaws.com/seedream_images/70a60994-809a-473d-accc-36284ba46e1c.png";

const Chat = () => {
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [inputDisabled, setInputDisabled] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
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
  const panelHeight = 56;  // одна высота для панели и поля ввода
  const panelPadH = 16;

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
          height: panelHeight,
          background: panelBg,
          color: "#fff",
          display: "flex",
          alignItems: "center",
          borderRadius: borderRadius,
          padding: `0 ${panelPadH}px`,
          justifyContent: "space-between"
        }}
      >
        <div style={{ fontWeight: 600, fontSize: 17 }}>Nora AI</div>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 14, // расстояние только между иконками!
        }}>
          {darkMode && (
            <button
              style={iconBtnStyle}
              onClick={() => setDarkMode(false)}
              aria-label="Сменить на светлую тему"
            >
              <img src={ICON_SUN} alt="Sun" style={iconImgStyle} />
            </button>
          )}
          {!darkMode && (
            <button
              style={iconBtnStyle}
              onClick={() => setDarkMode(true)}
              aria-label="Сменить на тёмную тему"
            >
              <img src={ICON_MOON} alt="Moon" style={iconImgStyle} />
            </button>
          )}
          <button style={iconBtnStyle} onClick={clearChat} aria-label="Очистить чат">
            <img src={ICON_TRASH} alt="Trash" style={iconImgStyle} />
          </button>
          <button
            style={iconBtnStyle}
            aria-label="Позвонить"
            onClick={() => window.open("tel:+1234567890")}
          >
            <img src={ICON_PHONE} alt="Phone" style={iconImgStyle} />
          </button>
          <button
            style={iconBtnStyle}
            aria-label="Telegram"
            onClick={() => window.open("https://t.me/", "_blank")}
          >
            <img src={ICON_TELEGRAM} alt="Telegram" style={iconImgStyle} />
          </button>
        </div>
      </div>
      {/* Центрированное изображение — по ширине панели и поля */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          marginTop: panelHeight + 29,
          marginBottom: 24,
        }}
      >
        <img
          src={MAIN_IMG}
          alt="Nora AI"
          style={{
            width: `calc(100vw - 2 * ${18 + panelPadH}px)`,
            maxWidth: 650 - 2 * panelPadH,
            height: panelHeight * 2,
            borderRadius: borderRadius,
            objectFit: "cover",
            boxShadow: "none",
            background: "none",
            display: "block"
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
        padding: "0 18px 112px 18px"
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
      {/* Поле ввода и кнопка-стрелка */}
      <form onSubmit={handleSubmit} style={{
        position: "fixed",
        left: 18, right: 18, bottom: 18,
        background: panelBg,
        borderRadius: borderRadius,
        height: panelHeight,
        display: "flex",
        alignItems: "center",
        padding: 0,
        zIndex: 101,
      }}>
        <div style={{
          display: "flex",
          width: "100%",
          alignItems: "center",
        }}>
          <input
            type="text"
            style={{
              flex: 1,
              border: "none",
              borderRadius: borderRadius,
              height: 40,
              padding: "0 20px",
              fontSize: 18,
              background: panelBg,
              color: "#fff",
              outline: "none",
            }}
            value={userInput}
            onChange={e => setUserInput(e.target.value)}
            placeholder="Введите ваш вопрос"
            disabled={inputDisabled}
          />
          <button type="submit" style={{
            background: "#fff",
            color: "#171717",
            border: "none",
            borderRadius: borderRadius,
            width: 40,
            height: 40,
            marginRight: 6,
            marginLeft: 4,
            marginTop: 2,
            marginBottom: 2,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: inputDisabled ? "not-allowed" : "pointer",
            opacity: inputDisabled ? 0.7 : 1
          }}>
            <img src={ICON_ARROW} alt="Send" style={{width: 22, height: 22, filter: "brightness(0) invert(1)"}} />
          </button>
        </div>
      </form>
    </div>
  );
};

const iconBtnStyle = {
  background: "none", border: "none", cursor: "pointer",
  width: ICON_SIZE, height: ICON_SIZE, borderRadius: 8,
  padding: 0, display: "flex",
  alignItems: "center", justifyContent: "center"
};
const iconImgStyle = {
  width: ICON_SIZE,
  height: ICON_SIZE,
  objectFit: "contain"
};

export default Chat;
