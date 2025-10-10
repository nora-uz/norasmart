import React, { useState, useEffect, useRef } from "react";

const ICONS = {
  telegram: "https://your-cdn.com/telegram.png",
  phone: "https://your-cdn.com/phone.png",
  sun: "https://your-cdn.com/sun1.png",
  moon: "https://your-cdn.com/moon.png",
  trash: "https://your-cdn.com/trash.png",
  arrow: "https://your-cdn.com/arrow.png", // стрелка вверх на белом фоне, темная
};

// Замените на свою ссылку настоящей главной фотографии
const MAIN_IMG = "https://user-gen-media-assets.s3.amazonaws.com/seedream_images/70a60994-809a-473d-accc-36284ba46e1c.png";

const ICON_SIZE = 32;
const BTN_SIZE = 48;
const borderRadius = 22;
const sidePad = 18;
const panelHeight = 62;

const Chat = () => {
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [inputDisabled, setInputDisabled] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;
    setMessages(prev => [...prev, { role: "user", text: userInput }]);
    setUserInput(""); setInputDisabled(false);
  };
  const clearChat = () => { setMessages([]); setUserInput(""); };

  const panelBg = "#171717", bgColor = "#1C1C1C";

  return (
    <div style={{
      minHeight: "100vh",
      background: bgColor,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: 0,
      overflow: "hidden"
    }}>
      {/* Панель */}
      <div style={{
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
      }}>
        <div style={{ fontWeight: 600, fontSize: 19 }}>Nora AI</div>
        <div style={{ display: "flex", alignItems: "center", gap: 13 }}>
          <button style={iconBtn(panelBg)} onClick={() => setDarkMode(mode => !mode)} aria-label="Тема">
            <img src={darkMode ? ICONS.sun : ICONS.moon} alt="Theme" style={iconImg} />
          </button>
          <button style={iconBtn(panelBg)} onClick={clearChat} aria-label="Очистить чат">
            <img src={ICONS.trash} alt="Trash" style={iconImg} />
          </button>
          <button style={iconBtn(panelBg)} aria-label="Позвонить" onClick={() => window.open('tel:+1234567890')}>
            <img src={ICONS.phone} alt="Phone" style={iconImg} />
          </button>
          <button style={iconBtn(panelBg)} aria-label="Telegram" onClick={() => window.open('https://t.me/', '_blank')}>
            <img src={ICONS.telegram} alt="Telegram" style={iconImg} />
          </button>
        </div>
      </div>
      {/* Картинка Nora — по центру */}
      <div style={{
        width: `calc(100vw - ${sidePad * 2}px)`,
        maxWidth: 650 - sidePad * 2,
        margin: "0 auto",
        marginTop: sidePad + panelHeight + 12,
        borderRadius: borderRadius,
        overflow: "hidden",
        background: "none",
        boxSizing: "border-box"
      }}>
        <img
          src={MAIN_IMG}
          alt="Nora AI"
          style={{
            width: "100%",
            borderRadius: borderRadius,
            display: "block", background: "none", boxShadow: "none"
          }}
        />
      </div>
      {/* Сообщения */}
      <div style={{
        flex: 1, width: "100%", maxWidth: 650, margin: "0 auto",
        boxSizing: "border-box", minHeight: "100vh",
        padding: `20px ${sidePad}px 140px ${sidePad}px`,
      }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{
            display: "flex",
            justifyContent: msg.role === "assistant" ? "flex-start" : "flex-end",
            marginBottom: 15,
          }}>
            <div style={{
              background: msg.role === "assistant" ? panelBg : "none",
              color: "#fff",
              borderRadius: borderRadius,
              padding: "14px 20px",
              fontSize: 18,
              lineHeight: 1.7, border: "none",
              maxWidth: "86vw", minWidth: 54,
              marginLeft: msg.role === "user" ? "auto" : 0,
              marginRight: msg.role === "assistant" ? "auto" : 0
            }}>
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      {/* Инпут и кнопка отправки */}
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
            height: BTN_SIZE,
            padding: "0 22px",
            fontSize: 19,
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
          borderRadius: BTN_SIZE/2,
          width: BTN_SIZE,
          height: BTN_SIZE,
          marginLeft: 10,
          marginRight: 8,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          cursor: inputDisabled ? "not-allowed" : "pointer",
          opacity: inputDisabled ? 0.7 : 1,
          boxShadow: "none"
        }}>
          <img src={ICONS.arrow} alt="Send" style={{ width: 28, height: 28, display: "block" }} />
        </button>
      </form>
    </div>
  );
};

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
