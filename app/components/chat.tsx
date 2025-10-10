"use client";
import React, { useState, useEffect, useRef } from "react";

const ICONS = {
  telegram: "https://cdn-icons-png.flaticon.com/512/9821/9821637.png",
  sun: "https://cdn-icons-png.flaticon.com/512/16769/16769231.png",
  moon: "https://cdn-icons-png.flaticon.com/512/16769/16769231.png",
  trash: "https://cdn-icons-png.flaticon.com/512/3917/3917772.png",
  arrow: "https://cdn-icons-png.flaticon.com/512/3916/3916848.png",
  term: "https://cdn-icons-png.flaticon.com/512/1514/1514826.png", // пример иконки минимализма
  state_1: "https://cdn-icons-png.flaticon.com/512/599/599305.png", // Отлично
  state_2: "https://cdn-icons-png.flaticon.com/512/752/752828.png", // Хорошо
  state_3: "https://cdn-icons-png.flaticon.com/512/5593/5593095.png", // Нормально
  state_4: "https://cdn-icons-png.flaticon.com/512/2728/2728949.png", // Не очень
  state_5: "https://cdn-icons-png.flaticon.com/512/189/189254.png", // Плохо
};

const BANNER = "https://user-gen-media-assets.s3.amazonaws.com/seedream_images/4c36a715-f500-4186-8955-631a09fac0ed.png";
const ICON_SIZE_PANEL = 18;
const ICON_SIZE_SEND = 28;
const ICON_SIZE_BIG = 22;
const BTN_SIZE = 62;
const SEND_BTN_SIZE = 94;
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

const moods = [
  { label: "Отлично", icon: ICONS.state_1 },
  { label: "Хорошо", icon: ICONS.state_2 },
  { label: "Нормально", icon: ICONS.state_3 },
  { label: "Не очень", icon: ICONS.state_4 },
  { label: "Плохо", icon: ICONS.state_5 }
];

const termGradient = "linear-gradient(135deg,#fde047 0%,#fbbf24 100%)";
const stateGradient = "linear-gradient(135deg,#7c3aed 0%,#6a11cb 100%)";

function InteractiveLine({ onSelect }) {
  const [showMonthList, setShowMonthList] = useState(false);
  const [showMoodList, setShowMoodList] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedMood, setSelectedMood] = useState(null);
  const [hasSent, setHasSent] = useState(false);

  useEffect(() => {
    if (!hasSent && selectedMonth !== null && selectedMood !== null) {
      onSelect(
        `Срок беременности: ${selectedMonth} мес., самочувствие: ${moods[selectedMood].label}`
      );
      setHasSent(true);
    }
  }, [selectedMonth, selectedMood, onSelect, hasSent]);

  useEffect(() => {
    if (selectedMonth === null || selectedMood === null) setHasSent(false);
  }, [selectedMonth, selectedMood]);

  const fontSizeLabel = 15;
  const fontSizeChoice = 18;

  return (
    <div style={{
      margin: "24px auto 0 auto",
      maxWidth: maxWidth,
      width: "100%",
      display: "flex",
      flexDirection: "column",
      gap: 18
    }}>
      {/* Срок беременности */}
      <div style={{
        background: termGradient,
        borderRadius: 20,
        padding: "18px 22px",
        position: "relative"
      }}>
        <div style={{
          fontWeight: 800,
          fontSize: fontSizeLabel + 3,
          color: "#fff",
          marginBottom: 12,
          display: "flex",
          alignItems: "center",
          gap: 10
        }}>
          <img src={ICONS.term} style={{ width: ICON_SIZE_BIG, height: ICON_SIZE_BIG }} alt="term"/>
          <span>Выберите срок беременности:</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12, marginBottom: 8 }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              onClick={() => { setSelectedMonth(i); }}
              style={{
                background: selectedMonth === i ? "#fff6" : "transparent",
                color: "#fff",
                fontWeight: 600,
                borderRadius: 12,
                fontSize: fontSizeChoice,
                textAlign: "center",
                padding: "10px 0",
                cursor: "pointer",
                border: selectedMonth === i ? "2px solid #fff" : "none"
              }}
            >
              {i}
            </div>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12 }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i + 5}
              onClick={() => { setSelectedMonth(i + 5); }}
              style={{
                background: selectedMonth === (i + 5) ? "#fff6" : "transparent",
                color: "#fff",
                fontWeight: 600,
                borderRadius: 12,
                fontSize: fontSizeChoice,
                textAlign: "center",
                padding: "10px 0",
                cursor: "pointer",
                border: selectedMonth === (i + 5) ? "2px solid #fff" : "none"
              }}
            >
              {i + 5}
            </div>
          ))}
        </div>
      </div>
      {/* Самочувствие */}
      <div style={{
        background: stateGradient,
        borderRadius: 20,
        padding: "18px 22px",
        position: "relative"
      }}>
        <div style={{
          fontWeight: 800,
          fontSize: fontSizeLabel + 3,
          color: "#fff",
          marginBottom: 12,
          display: "flex",
          alignItems: "center",
          gap: 10
        }}>
          <span>
            <img src={ICONS.state_1} style={{ width: ICON_SIZE_BIG, height: ICON_SIZE_BIG }} alt="mood"/>
          </span>
          <span>Выберите самочувствие:</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 8 }}>
          {moods.slice(0, 3).map((item, idx) => (
            <div
              key={item.label}
              onClick={() => setSelectedMood(idx)}
              style={{
                background: selectedMood === idx ? "#fff6" : "transparent",
                color: "#fff",
                fontWeight: 600,
                borderRadius: 12,
                fontSize: fontSizeChoice,
                textAlign: "center",
                padding: "10px 0",
                cursor: "pointer",
                border: selectedMood === idx ? "2px solid #fff" : "none",
                display: "flex",
                alignItems: "center",
                gap: 8,
                justifyContent: "center"
              }}
            >
              <img src={item.icon} style={{ width: ICON_SIZE_BIG, height: ICON_SIZE_BIG }} alt={item.label}/>
              {item.label}
            </div>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
          {moods.slice(3).map((item, idx) => (
            <div
              key={item.label}
              onClick={() => setSelectedMood(idx + 3)}
              style={{
                background: selectedMood === (idx + 3) ? "#fff6" : "transparent",
                color: "#fff",
                fontWeight: 600,
                borderRadius: 12,
                fontSize: fontSizeChoice,
                textAlign: "center",
                padding: "10px 0",
                cursor: "pointer",
                border: selectedMood === (idx + 3) ? "2px solid #fff" : "none",
                display: "flex",
                alignItems: "center",
                gap: 8,
                justifyContent: "center"
              }}
            >
              <img src={item.icon} style={{ width: ICON_SIZE_BIG, height: ICON_SIZE_BIG }} alt={item.label}/>
              {item.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- основной блок чата ---
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
      width: "100vw", minHeight: 800, overflow: "hidden",
      position: "relative", transition: "background 0.4s"
    }}>
      <div style={{ height: sidePad }} />
      {/* Header Panel */}
      <div style={{
        width: `calc(100% - ${sidePad * 2}px)`,
        maxWidth,
        height: panelHeight,
        margin: "0 auto",
        background: stateGradient,
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
      {/* Banner */}
      <div
        style={{
          width: `calc(100% - ${sidePad * 2}px)`, maxWidth,
          margin: "0 auto", borderRadius: 26, overflow: "hidden",
          boxShadow: "0 4px 28px 0 rgba(55,40,120,0.14)",
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
      {/* --- Интерактив сразу под фото --- */}
      <InteractiveLine onSelect={handleInteractive} />
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
        </div>
      </div>
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
