import React, { useState, useEffect, useRef } from "react";

const ICONS = {
  telegram: "https://cdn-icons-png.flaticon.com/512/9821/9821637.png",
  phone: "https://cdn-icons-png.flaticon.com/512/5068/5068703.png",
  sun: "https://cdn-icons-png.flaticon.com/512/16769/16769231.png",
  moon: "https://cdn-icons-png.flaticon.com/512/16769/16769231.png",
  trash: "https://cdn-icons-png.flaticon.com/512/3917/3917772.png",
  arrow: "https://cdn-icons-png.flaticon.com/512/3916/3916848.png",
};

const BANNER = "https://user-gen-media-assets.s3.amazonaws.com/seedream_images/4c36a715-f500-4186-8955-631a09fac0ed.png";

const ICON_SIZE_PANEL = 18;
const ICON_SIZE_SEND = 28;
const BTN_SIZE = 48;
const borderRadius = 22;
const sidePad = 18;
const panelHeight = 62;
const panelBg = "#131313";
const bgColor = "#181818";
const maxWidth = 560;

const FAKE_ANSWERS = [
  "Привет! Я Nora, чем могу помочь?",
  "Расскажи, о чём бы ты хотел поговорить?",
  "Я готова ответить на любые вопросы!",
  "Пиши свой запрос, я отвечу!",
];

const Chat = () => {
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [inputDisabled, setInputDisabled] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;
    setMessages(prev => [...prev, { role: "user", text: userInput }]);
    setUserInput("");
    setInputDisabled(true);

    setTimeout(() => {
      const reply = FAKE_ANSWERS[Math.floor(Math.random() * FAKE_ANSWERS.length)];
      setMessages(prev => [...prev, { role: "assistant", text: reply }]);
      setInputDisabled(false);
    }, 700);

    /*
    // Для GPT backend:
    try {
      const response = await fetch("/api/gpt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userInput }),
      });
      if (!response.ok) throw new Error("Сервер не отвечает");
      const data = await response.json();
      setMessages(prev => [...prev, { role: "assistant", text: data.text || "Ошибка ответа от ассистента." }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: "assistant", text: "Ошибка связи с сервером." }]);
    }
    setInputDisabled(false);
    */
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
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Фиксированная панель */}
      <div
        style={{
          position: "fixed",
          top: sidePad,
          left: "50%",
          transform: "translateX(-50%)",
          width: `calc(100% - ${sidePad * 2}px)`,
          maxWidth,
          height: panelHeight,
          background: panelBg,
          color: "#fff",
          display: "flex",
          alignItems: "center",
          borderRadius: borderRadius,
          padding: "0 18px",
          justifyContent: "space-between",
          boxSizing: "border-box",
          zIndex: 2000,
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
      
      {/* Весь главный контент под панелью, с marginTop */}
      <div
        style={{
          width: "100%",
          maxWidth: maxWidth,
          margin: "0 auto",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: sidePad + panelHeight, // отступ сверху ровно под панелью
          paddingBottom: panelHeight + sidePad * 2,
          minHeight: `calc(100vh - ${panelHeight + sidePad * 3}px)`,
        }}
      >
        {/* Баннер - строго под панелью, с отступами по бокам и снизу */}
        <div
          style={{
            width: `calc(100% - ${sidePad * 2}px)`,
            maxWidth: maxWidth,
            margin: "0 auto",
            marginBottom: sidePad,
            borderRadius: 26,
            overflow: "hidden",
            boxShadow: "0 4px 28px 0 rgba(55,40,120,0.14)",
            background: "#181818",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img
            src={BANNER}
            alt="Nora AI баннер"
            style={{
              width: "100%",
              height: "auto",
              display: "block",
            }}
          />
        </div>
        {/* Сообщения */}
        <div style={{ width: "100%" }}>
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
                  maxWidth: "70%",
                  minWidth: 54,
                  marginLeft: sidePad,
                  marginRight: sidePad,
                  wordBreak: "break-word",
                  alignSelf: msg.role === "assistant" ? "flex-start" : "flex-end",
                }}
              >
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      {/* Фиксированное поле ввода снизу */}
      <form
        onSubmit={handleSubmit}
        style={{
          position: "fixed",
          left: "50%",
          bottom: sidePad,
          transform: "translateX(-50%)",
          width: `calc(100% - ${sidePad * 2}px)`,
          maxWidth,
          background: panelBg,
          borderRadius: borderRadius,
          height: panelHeight,
          display: "flex",
          alignItems: "center",
          zIndex: 2000,
          padding: 0,
          boxSizing: "border-box",
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
