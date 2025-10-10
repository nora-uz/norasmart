import React, { useState, useEffect, useRef } from "react";

// PNG иконки (реально прозрачные)
const ICON_SIZE = 32;
const BTN_SIZE = 44; // размер кнопки (фон)
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
  const sidePad = 18;
  const panelHeight = BTN_SIZE;

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
          top: sidePad,
          left: sidePad,
          right: sidePad,
          zIndex: 100,
          height: panelHeight,
          background: panelBg,
          color: "#fff",
          display: "flex",
          alignItems: "center",
          borderRadius: borderRadius,
          padding: "0 18px",
          justifyContent: "space-between"
        }}
      >
        <div style={{ fontWeight: 600, fontSize: 17 }}>Nora AI</div>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 13,
        }}>
          <button
            style={iconBtn(panelBg)}
            onClick={() => setDarkMode(mode => !mode)}
            aria-label="Тема"
          >
            <img
              src={darkMode ? ICON_SUN : ICON_MOON}
              alt="Theme"
              style={iconImg}
            />
          </button>
          <button style={iconBtn(panelBg)} onClick={clearChat} aria-label="Очистить чат">
            <img src={ICON_TRASH} alt="Trash" style={iconImg} />
          </button>
          <button
            style={iconBtn(panelBg)}
            aria-label="Позвонить"
            onClick={() => window.open("tel:+1234567890")}
          >
            <img src={ICON_PHONE} alt="Phone" style={iconImg} />
          </button>
          <button
            style={iconBtn(panelBg)}
            aria-label="Telegram"
            onClick={() => window.open("https://t.me/", "_blank")}
          >
            <img src={ICON_TELEGRAM} alt="Telegram" style={iconImg} />
          </button>
        </div>
      </div>
      {/* Фото ровно под панелью, идеально выровнено */}
      <div
        style={{
          width: `calc(100vw - ${sidePad * 2}px)`,
          maxWidth: 650 - sidePad * 2,
          margin: "0 auto",
          marginTop: sidePad + panelHeight + 12,
          borderRadius: borderRadius,
          overflow: "hidden",
          background: "none",
          boxSizing: "border-box"
        }}
      >
        <img
          src={MAIN_IMG}
          alt="Nora AI"
          style={{
            width: "100%",
            borderRadius: borderRadius,
            display: "block",
            background: "none",
            boxShadow: "none"
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
        padding: `18px ${sidePad}px 110px ${sidePad}px`,
        marginTop: 20,
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
                padding: "12px 16px",
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
      {/* Поле ввода и кнопка */}
      <form onSubmit={handleSubmit} style={{
        position: "fixed",
        left: sidePad, right: sidePad, bottom: sidePad,
        background: panelBg,
        borderRadius: borderRadius,
        height: panelHeight,
        display: "flex",
        alignItems: "center",
        zIndex: 101,
        padding: 0,
      }}>
        <input
          type="text"
          style={{
            flex: 1,
            border: "none",
            borderRadius: borderRadius,
            height: 44,
            padding: "0 19px",
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
          color: panelBg,
          border: "none",
          borderRadius: borderRadius,
          width: BTN_SIZE,
          height: BTN_SIZE,
          marginLeft: 10,
          marginRight: 6,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          cursor: inputDisabled ? "not-allowed" : "pointer",
          opacity: inputDisabled ? 0.7 : 1,
          boxShadow: "none"
        }}>
          <img src={ICON_ARROW} alt="Send" style={{width: 32, height: 32}} />
        </button>
      </form>
    </div>
  );
};

// Стиль кнопки — круглый фон, прозрачная PNG-иконка внутри
const iconBtn = (color) => ({
  background: color,
  border: "none",
  cursor: "pointer",
  width: BTN_SIZE,
  height: BTN_SIZE,
  borderRadius: BTN_SIZE/2,
  padding: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "none",
});
const iconImg = {
  width: ICON_SIZE,
  height: ICON_SIZE,
  display: "block",
  background: "none",
};

export default Chat;
