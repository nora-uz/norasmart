"use client";
import React, { useState, useEffect, useRef } from "react";

const ICONS = {
  telegram: "https://cdn-icons-png.flaticon.com/512/9821/9821637.png",
  sun: "https://cdn-icons-png.flaticon.com/512/16769/16769231.png",
  moon: "https://cdn-icons-png.flaticon.com/512/16769/16769231.png",
  trash: "https://cdn-icons-png.flaticon.com/512/3917/3917772.png",
  arrow: "https://cdn-icons-png.flaticon.com/512/3916/3916848.png"
};

const BANNER = "https://user-gen-media-assets.s3.amazonaws.com/seedream_images/4c36a715-f500-4186-8955-631a09fac0ed.png";
const maxWidth = 370; // уменьшено для компактности
const borderRadius = 16;
const BTN_SIZE = 48; // уменьшено
const SEND_BTN_SIZE = 62; // уменьшено
const ICON_SIZE_PANEL = 18;
const ICON_SIZE_SEND = 24;
const sidePad = 8;
const panelHeight = 38; // уменьшено
const gradient = "linear-gradient(135deg,#6a11cb 0%,#2575fc 100%)";

const FAKE_ANSWERS = [
  "Привет! Я Nora, чем могу помочь?",
  "Расскажи, о чём бы ты хотел поговорить?",
  "Я готова ответить на любые вопросы!",
  "Пиши свой запрос, я отвечу!"
];

// Новый улучшенный интерактив
function InteractiveLine({ onSelect }) {
  const moods = [
    { label: "Хорошо", emoji: "😃" },
    { label: "Нормально", emoji: "😐" },
    { label: "Плохо", emoji: "😣" }
  ];
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedMood, setSelectedMood] = useState(null);
  const [hasSent, setHasSent] = useState(false);

  useEffect(() => {
    if (!hasSent && selectedMonth !== null && selectedMood !== null) {
      onSelect(
        `Срок беременности: ${selectedMonth} мес., самочувствие: ${moods[selectedMood].emoji} ${moods[selectedMood].label}`
      );
      setHasSent(true);
    }
  }, [selectedMonth, selectedMood, onSelect, hasSent]);

  useEffect(() => {
    if (selectedMonth === null || selectedMood === null) setHasSent(false);
  }, [selectedMonth, selectedMood]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      width: '100%',
      maxWidth,
      margin: '0 auto',
      padding: `0 ${sidePad}px`,
      gap: 14,
      minHeight: 64 // уменьшено, чтобы занять ровно половину пустоты
    }}>
      {/* Срок беременности - слева */}
      <div style={{
        background: gradient,
        borderRadius: 14,
        padding: '10px 13px 12px 13px',
        minWidth: 110,
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start'
      }}>
        <div style={{ fontWeight: 500, fontSize: 13, marginBottom: 7 }}>Выберите срок беременности:</div>
        <div style={{ display: 'flex', gap: 4 }}>
          {Array.from({ length: 9 }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setSelectedMonth(i + 1)}
              style={{
                background: selectedMonth === i + 1 ? gradient : 'transparent',
                color: '#fff',
                borderRadius: 7,
                border: selectedMonth !== i + 1 ? '1px solid #fff8' : 'none',
                fontWeight: 500,
                padding: '3px 0',
                width: 24,
                fontSize: 13,
                boxShadow: selectedMonth === i + 1 ? '0 0 5px #2575fc55' : 'none',
                cursor: 'pointer',
                outline: 'none',
                transition: 'all 0.2s'
              }}
            >{i + 1}</button>
          ))}
        </div>
      </div>
      {/* Самочувствие - справа */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        alignItems: 'flex-end'
      }}>
        <div style={{
          fontWeight: 500, fontSize: 13, marginBottom: 7, color: '#333'
        }}>Как себя чувствуете?</div>
        <div style={{ display: 'flex', gap: 5 }}>
          {moods.map((item, idx) => (
            <button
              key={item.label}
              onClick={() => setSelectedMood(idx)}
              style={{
                background: selectedMood === idx
                  ? gradient
                  : 'transparent',
                color: selectedMood === idx ? '#fff' : '#333',
                fontWeight: 500,
                borderRadius: 7,
                border: selectedMood !== idx ? '1px solid #2575fc' : 'none',
                boxShadow: selectedMood === idx ? '0 0 5px #2575fc55' : 'none',
                minWidth: 58,
                fontSize: 14,
                padding: '5px 10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                cursor: 'pointer',
                outline: 'none',
                transition: 'all 0.2s'
              }}
            >
              <span style={{ fontSize: 18 }}>{item.emoji}</span> {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

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

const Chat = () => {
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [inputDisabled, setInputDisabled] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const messagesEndRef = useRef(null);

  const theme = darkMode ? themes.dark : themes.light;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
  };

  const handleInteractive = msg => {
    setMessages(prev => [
      ...prev,
      { role: "user", text: msg }
    ]);
    setInputDisabled(true);
    setTimeout(() => {
      const reply = FAKE_ANSWERS[Math.floor(Math.random() * FAKE_ANSWERS.length)];
      setMessages(prev => [...prev, { role: "assistant", text: reply }]);
      setInputDisabled(false);
    }, 700);
  };

  return (
    <div style={{
      background: theme.bgColor,
      width: "100vw",
      minHeight: "100vh",
      overflow: "hidden",
      position: "relative",
      transition: "background 0.4s"
    }}>
      {/* Панель */}
      <div style={{ height: sidePad / 2 }} />
      <div style={{
        width: `calc(100% - ${sidePad * 2}px)`,
        maxWidth,
        height: panelHeight,
        margin: "0 auto",
        background: gradient,
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
        <div style={{ fontWeight: 800, fontSize: 18, marginRight: sidePad }}>Nora AI</div>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 4,
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
      <div style={{ height: sidePad / 2 }} />
      {/* Фото-баннер */}
      <div
        style={{
          width: `calc(100% - ${sidePad * 2}px)`, maxWidth,
          margin: "0 auto", borderRadius: 18, overflow: "hidden",
          boxShadow: "0 4px 18px 0 rgba(55,40,120,0.12)",
          background: theme.bgColor,
          display: "flex", justifyContent: "center",
          alignItems: "center", flexShrink: 0, position: "relative"
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
      {/* Интерактивы */}
      <div style={{ height: sidePad / 2 }} />
      <InteractiveLine onSelect={handleInteractive} />
      <div style={{ height: sidePad + 1 }} />
      {/* Сообщения */}
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
              marginBottom: 7,
              width: "100%",
            }}>
              <div style={{
                background: msg.role === "assistant" ? theme.assistantBubble : theme.userBubble,
                color: msg.role === "assistant" ? theme.assistantText : theme.userText,
                borderRadius: borderRadius,
                padding: "10px 15px",
                fontSize: 15,
                lineHeight: 1.7,
                border: "none",
                maxWidth: "75%",
                minWidth: 38,
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
        </div>
      </div>
      {/* Поле ввода */}
      <form onSubmit={handleSubmit}
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
        }}>
        <input
          type="text"
          style={{
            flex: 1,
            border: "none",
            borderRadius: borderRadius,
            height: BTN_SIZE,
            padding: `0 8px 0 ${sidePad}px`,
            fontSize: 16,
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
      </form>
      <style>{`
        .nora-input::placeholder {
          color: ${theme.placeholder};
          opacity: 1;
          font-size: 15px;
        }
      `}</style>
    </div>
  );
};

// Вспомогательные стили для кнопок/иконок
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
  filter: "brightness(0) invert(1)"
};

const iconImgSend = {
  width: ICON_SIZE_SEND,
  height: ICON_SIZE_SEND,
  display: "block",
  background: "none"
};

export default Chat;
