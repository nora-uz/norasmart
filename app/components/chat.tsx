"use client";
import React, { useState, useEffect, useRef } from "react";

const ICONS = {
  telegram: "https://cdn-icons-png.flaticon.com/512/9821/9821637.png",
  sun: "https://cdn-icons-png.flaticon.com/512/16769/16769231.png",
  moon: "https://cdn-icons-png.flaticon.com/512/16769/16769231.png",
  trash: "https://cdn-icons-png.flaticon.com/512/3917/3917772.png",
  arrow: "https://cdn-icons-png.flaticon.com/512/3916/3916848.png",
};

const BANNER = "https://user-gen-media-assets.s3.amazonaws.com/seedream_images/4c36a715-f500-4186-8955-631a09fac0ed.png";
const ICON_SIZE_PANEL = 18;
const ICON_SIZE_SEND = 28;
const BTN_SIZE = 62;
const SEND_BTN_SIZE = 94;
const TEMPLATE_BTN_SIZE = 88;
const borderRadius = 22;
const sidePad = 16;
const panelHeight = 62;
const maxWidth = 560;

const themes = {
  dark: {
    panelBg: "#131313",
    bgColor: "#181818",
    userBubble: "#fff",
    userText: "#181818",
    inputBg: "#131313",
    inputText: "#eee",
    placeholder: "#bbb",
    assistantBubble: "#131313",
    assistantText: "#fff"
  },
  light: {
    panelBg: "#F6F7FB",
    bgColor: "#F9FAFC",
    userBubble: "#fff",
    userText: "#333",
    inputBg: "#F6F7FB",
    inputText: "#222",
    placeholder: "#333",
    assistantBubble: "#E8EAED",
    assistantText: "#333"
  }
};

const FAKE_ANSWERS = [
  "Привет! Я Nora, чем могу помочь?",
  "Расскажи, о чём бы ты хотел поговорить?",
  "Я готова ответить на любые вопросы!",
  "Пиши свой запрос, я отвечу!",
];

const GRADIENT = "linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)";

const INTERACTIVE_HEIGHT = 148; // примерная высота интерактивной панели

const moods = [
  { label: "Отлично", emoji: "😃" },
  { label: "Хорошо", emoji: "🙂" },
  { label: "Нормально", emoji: "😐" },
  { label: "Не очень", emoji: "😕" },
  { label: "Плохо", emoji: "😣" }
];

const Chat = () => {
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [inputDisabled, setInputDisabled] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const messagesEndRef = useRef(null);
  const showTemplates = messages.length === 0;
  const theme = darkMode ? themes.dark : themes.light;

  // Состояния для интерактива
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedMood, setSelectedMood] = useState(null);
  const [introSent, setIntroSent] = useState(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Логика: отправка сообщения только при выборе обоих
  useEffect(() => {
    if (!introSent && selectedMonth !== null && selectedMood !== null) {
      setMessages(prev => [
        ...prev,
        {
          role: "user",
          text: `Срок беременности: ${selectedMonth + 1} мес., самочувствие: ${moods[selectedMood].label}`
        }
      ]);
      setIntroSent(true);
      setInputDisabled(true);
      setTimeout(() => {
        const reply = FAKE_ANSWERS[Math.floor(Math.random() * FAKE_ANSWERS.length)];
        setMessages(prev => [...prev, { role: "assistant", text: reply }]);
        setInputDisabled(false);
      }, 700);
    }
  }, [selectedMonth, selectedMood, introSent]);

  useEffect(() => {
    if (selectedMonth === null || selectedMood === null) setIntroSent(false);
  }, [selectedMonth, selectedMood]);

  const handleSubmit = (e) => {
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
  };

  const clearChat = () => {
    setMessages([]);
    setUserInput("");
    setSelectedMonth(null);
    setSelectedMood(null);
    setIntroSent(false);
  };

  return (
    <div style={{
      background: theme.bgColor,
      width: "100vw",
      minHeight: 800,
      overflow: "hidden",
      position: "relative",
      transition: "background 0.4s"
    }}>
      <div style={{ height: sidePad }} />
      {/* Панель с градиентом, без тени/линии */}
      <div style={{
        width: `calc(100% - ${sidePad * 2}px)`,
        maxWidth,
        height: panelHeight,
        margin: "0 auto",
        background: GRADIENT,
        color: "#fff",
        display: "flex",
        alignItems: "center",
        borderRadius: borderRadius,
        padding: `0 ${sidePad}px 0 ${sidePad}px`,
        justifyContent: "flex-start",
        boxSizing: "border-box",
        position: "relative",
        zIndex: 2000,
        transition: "background 0.4s, color 0.4s"
      }}>
        <div style={{ fontWeight: 800, fontSize: 25, marginRight: sidePad }}>Nora AI</div>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          marginLeft: "auto"
        }}>
          <button style={iconBtn("transparent")} onClick={() => setDarkMode((prev) => !prev)}>
            <img src={darkMode ? ICONS.sun : ICONS.moon} alt="Theme" style={iconImgPanel} />
          </button>
          <button style={iconBtn("transparent")} onClick={() => window.open('https://t.me/', '_blank')}>
            <img src={ICONS.telegram} alt="Telegram" style={iconImgPanel} />
          </button>
          <button
            style={{ ...iconBtn("transparent"), marginRight: -sidePad }}
            onClick={clearChat}
          >
            <img src={ICONS.trash} alt="Trash" style={iconImgPanel} />
          </button>
        </div>
      </div>
      <div style={{ height: sidePad }} />
      <div
        style={{
          width: `calc(100% - ${sidePad * 2}px)`,
          maxWidth,
          margin: "0 auto",
          borderRadius: 26,
          overflow: "hidden",
          boxShadow: "0 4px 28px 0 rgba(55,40,120,0.14)",
          background: theme.bgColor,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexShrink: 0,
          position: "relative"
        }}
      >
        <img
          src={BANNER}
          alt="Nora AI баннер"
          style={{
            width: "100%",
            height: "auto",
            display: "block",
            objectFit: "contain",
            objectPosition: "center"
          }}
        />
      </div>
      <div style={{ height: sidePad }} />
      {/* --- Интерактивная панель --- */}
      {showTemplates && (
        <div style={{
          width: `calc(100% - ${sidePad * 2}px)`,
          maxWidth,
          margin: "0 auto",
          borderRadius: borderRadius,
          background: theme.panelBg,
          marginBottom: sidePad,
          padding: `${sidePad}px`,
          display: "flex",
          flexDirection: "row",
          gap: 18,
          alignItems: "center",
          justifyContent: "space-between"
        }}>
          {/* Слева: срок */}
          <div
            style={{
              flex: 1,
              background: "linear-gradient(135deg, #ffb347 0%, #ffcc33 100%)",
              borderRadius: 22,
              padding: 12,
              display: "flex",
              alignItems: "center",
              gap: 8,
              justifyContent: "center"
            }}
          >
            {Array.from({ length: 9 }).map((_, i) => (
              <button
                key={i}
                style={{
                  minWidth: 38,
                  height: 38,
                  borderRadius: 12,
                  border: "none",
                  background: selectedMonth === i ? "#fff6" : "transparent",
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: 16,
                  cursor: inputDisabled ? "not-allowed" : "pointer",
                  outline: "none",
                  transition: "background 0.19s"
                }}
                disabled={inputDisabled}
                onClick={() => setSelectedMonth(i)}
              >
                {i + 1}
              </button>
            ))}
          </div>
          {/* Справа: самочувствие */}
          <div
            style={{
              flex: 2,
              background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
              borderRadius: 22,
              padding: 12,
              display: "flex",
              alignItems: "center",
              gap: 8,
              justifyContent: "center"
            }}
          >
            {moods.map((item, idx) => (
              <button
                key={item.label}
                style={{
                  background: selectedMood === idx ? "#fff3" : "transparent",
                  color: "#fff",
                  border: "none",
                  borderRadius: 12,
                  minWidth: 48,
                  height: 48,
                  fontSize: 21,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 600,
                  cursor: inputDisabled ? "not-allowed" : "pointer",
                  outline: "none",
                  transition: "background 0.2s"
                }}
                disabled={inputDisabled}
                onClick={() => setSelectedMood(idx)}
              >
                <span style={{ fontSize: 24 }}>{item.emoji}</span>
                <span style={{ fontSize: 11 }}>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
      {/* Сообщения идут ниже интерактива */}
      <div style={{
        width: "100%",
        maxWidth,
        margin: "0 auto",
        boxSizing: "border-box",
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        overflow: "hidden"
      }}>
        <div style={{
          width: "100%",
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
        }}>
          {messages.map((msg, idx) => (
            <div key={idx} style={{
              display: "flex",
              justifyContent: msg.role === "assistant" ? "flex-start" : "flex-end",
              marginBottom: 12,
              width: "100%",
            }}>
              <div style={{
                background: msg.role === "assistant" ? theme.assistantBubble : theme.userBubble,
                color: msg.role === "assistant" ? theme.assistantText : theme.userText,
                borderRadius: borderRadius,
                padding: "14px 20px",
                fontSize: 16,
                lineHeight: 1.7,
                border: "none",
                maxWidth: "70%",
                minWidth: 54,
                marginLeft: sidePad,
                marginRight: sidePad,
                wordBreak: "break-word",
                alignSelf: msg.role === "assistant" ? "flex-start" : "flex-end",
                boxShadow: msg.role === "user" ? "0 2px 12px rgba(0,0,0,0.08)" : "none",
                transition: "background 0.4s, color 0.4s"
              }}>
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
          <div style={{
            height: (BTN_SIZE + sidePad * 3) + (showTemplates ? INTERACTIVE_HEIGHT : 0)
          }} />
        </div>
      </div>
      <form
        onSubmit={handleSubmit}
        style={{
          position: "fixed",
          left: "50%",
          bottom: sidePad,
          transform: "translateX(-50%)",
          width: `calc(100% - ${sidePad * 2}px)`,
          maxWidth,
          zIndex: 2600,
          display: "flex",
          alignItems: "center",
          background: "none",
          boxSizing: "border-box",
          padding: 0
        }}
      >
        <input
          type="text"
          style={{
            flex: 1,
            border: "none",
            borderRadius: borderRadius,
            height: BTN_SIZE,
            padding: `0 8px 0 ${sidePad}px`,
            fontSize: 19,
            background: theme.inputBg,
            color: theme.inputText,
            outline: "none",
            marginRight: 0,
            transition: "background 0.4s, color 0.4s"
          }}
          value={userInput}
          onChange={e => setUserInput(e.target.value)}
          placeholder="Введите ваш вопрос"
          disabled={inputDisabled}
          className="nora-input"
        />
        <button
          type="submit"
          style={{
            background: theme.userBubble,
            color: theme.userText,
            border: "none",
            borderRadius: borderRadius,
            width: SEND_BTN_SIZE,
            height: BTN_SIZE,
            marginRight: 0,
            marginLeft: sidePad,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: inputDisabled ? "not-allowed" : "pointer",
            opacity: inputDisabled ? 0.7 : 1,
            boxShadow: "none",
            transition: "background 0.4s, color 0.4s"
          }}
          disabled={inputDisabled}
        >
          <img src={ICONS.arrow} alt="Send" style={iconImgSend} />
        </button>
        <style>{`
          .nora-input::placeholder {
            color: ${theme.placeholder};
            opacity: 1;
            font-size: 15px;
          }
        `}</style>
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
  boxShadow: "none"
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
