import React, { useState, useEffect, useRef } from "react";

const ICONS = {
  telegram: "https://cdn-icons-png.flaticon.com/512/9821/9821637.png",
  phone: "https://cdn-icons-png.flaticon.com/512/5068/5068703.png",
  sun: "https://cdn-icons-png.flaticon.com/512/16769/16769231.png",
  moon: "https://cdn-icons-png.flaticon.com/512/16769/16769231.png",
  trash: "https://cdn-icons-png.flaticon.com/512/3917/3917772.png",
  arrow: "https://cdn-icons-png.flaticon.com/512/3916/3916848.png",
};

const MAIN_IMG = "https://user-gen-media-assets.s3.amazonaws.com/seedream_images/70a60994-809a-473d-accc-36284ba46e1c.png";

const ICON_SIZE_PANEL = 18;
const ICON_SIZE_SEND = 28;
const BTN_SIZE = 48;
const borderRadius = 22;
const sidePad = 18;
const panelHeight = 62;
const panelBg = "#131313";
const bgColor = "#181818";
const maxWidth = 560;
const topPad = sidePad;

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

  return (
    <div
      style={{
        background: bgColor,
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      {/* ВЕРХНИЙ ОТСТУП */}
      <div style={{ height: topPad }} />
      {/* ПАНЕЛЬ */}
      <div
        style={{
          width: "100%",
          maxWidth: maxWidth,
          margin: "0 auto",
          height: panelHeight,
          background: panelBg,
          color: "#fff",
          display: "flex",
          alignItems: "center",
          borderRadius: borderRadius,
          padding: `0 ${sidePad}px`,
          justifyContent: "space-between",
          boxSizing: "border-box",
          zIndex: 1000,
        }}
      >
        <div style={{ fontWeight: 600, fontSize: 19 }}>Nora AI</div>
        <div style={{ display: "flex", alignItems: "center", gap: 13 }}>
          <button style={iconBtn(panelBg)} onClick={() => setDarkMode(mode => !mode)} aria-label="Тема">
            <img src={darkMode ? ICONS.sun : ICONS.moon} alt="Theme" style={iconImgPanel} />
          </button>
          <button style={iconBtn(panelBg)} onClick={clearChat} aria-label="Очистить чат">
            <img src={ICONS.trash} alt="Trash" style={iconImgPanel} />
          </button>
          <button style={iconBtn(panelBg)} aria-label="Позвонить" onClick={() => window.open('tel:+1234567890')}>
            <img src={ICONS.phone} alt="Phone" style={iconImgPanel} />
          </button>
          <button style={iconBtn(panelBg)} aria-label="Telegram" onClick={() => window.open('https://t.me/', '_blank')}>
            <img src={ICONS.telegram} alt="Telegram" style={iconImgPanel} />
          </button>
        </div>
      </div>
      {/* ОТСТУП ПОСЛЕ ПАНЕЛИ */}
      <div style={{ height: sidePad }} />
      {/* ФОТО НОРА */}
      <div
        style={{
          width: "100%",
          maxWidth: 370,
          margin: "0 auto",
          borderRadius: borderRadius,
          overflow: "hidden",
          boxSizing: "border-box",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
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
            boxShadow: "none",
          }}
        />
      </div>
      {/* ОТСТУП МЕЖДУ ФОТО И СООБЩЕНИЯМИ */}
      <div style={{ height: sidePad }} />
      {/* ОБЛАСТЬ СООБЩЕНИЙ */}
      <div
        style={{
          width: "100%",
          maxWidth: maxWidth,
          margin: "0 auto",
          boxSizing: "border-box",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          alignItems: "center",
          overflowY: "auto",
          padding: `0 ${sidePad}px`,
        }}
      >
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              display: "flex",
              justifyContent: msg.role === "assistant" ? "flex-start" : "flex-end",
              marginBottom: 12,
              width: "100%",
            }}
          >
            <div
              style={{
                background: msg.role === "assistant" ? panelBg : "none",
                color: "#fff",
                borderRadius: borderRadius,
                padding: "14px 20px",
                fontSize: 18,
                lineHeight: 1.7,
                border: "none",
                maxWidth: "86vw",
                minWidth: 54,
                marginLeft: msg.role === "user" ? "auto" : 0,
                marginRight: msg.role === "assistant" ? "auto" : 0,
                wordBreak: "break-word",
              }}
            >
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      {/* ПОЛЕ ДЛЯ СООБЩЕНИЯ ФИКСИРОВАНО */}
      <form
        onSubmit={handleSubmit}
        style={{
          position: "fixed",
          left: "50%",
          bottom: sidePad + sidePad, // двойной нижний отступ
          transform: "translateX(-50%)",
          width: `calc(100% - ${sidePad * 2}px)`,
          background: panelBg,
          borderRadius: borderRadius,
          height: panelHeight,
          display: "flex",
          alignItems: "center",
          zIndex: 1000,
          padding: 0,
          boxSizing: "border-box",
          margin: "0 auto",
        }}
      >
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
        <button
          type="submit"
          style={{
            background: "#fff",
            color: panelBg,
            border: "none",
            borderRadius: BTN_SIZE / 2,
            width: BTN_SIZE,
            height: BTN_SIZE,
            marginLeft: 10,
            marginRight: 8,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: inputDisabled ? "not-allowed" : "pointer",
            opacity: inputDisabled ? 0.7 : 1,
            boxShadow: "none",
          }}
        >
          <img src={ICONS.arrow} alt="Send" style={iconImgSend} />
        </button>
      </form>
      {/* НИЖНИЙ ОТСТУП ПОД ИНПУТОМ */}
      <div style={{ height: sidePad }} />
    </div>
  );
};

const iconBtn = (color) => ({
  background: color,
  border: "none",
  cursor: "pointer",
  width: BTN_SIZE,
  height: BTN_SIZE,
  borderRadius: BTN_SIZE / 2,
  padding: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "none",
});

const iconImgPanel = {
  width: ICON_SIZE_PANEL,
  height: ICON_SIZE_PANEL,
  display: "block",
  background: "none",
  filter: "brightness(0) invert(1)",
};

const iconImgSend = {
  width: ICON_SIZE_SEND,
  height: ICON_SIZE_SEND,
  display: "block",
  background: "none",
};

export default Chat;
