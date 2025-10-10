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

// ---- НОВЫЕ ЭЛЕМЕНТЫ ----
const EMOJI_TERM = "🤰";
const EMOJI_STATE = "😊";
const termGradient = "linear-gradient(135deg,#fde047 0%,#fbbf24 100%)"; // желтый градиент
const stateGradient = "linear-gradient(135deg,#7c3aed 0%,#6a11cb 100%)"; // фиолетово-синий градиент

const moods = [
  { label: "Отлично", emoji: "😃" },
  { label: "Хорошо", emoji: "🙂" },
  { label: "Нормально", emoji: "😐" },
  { label: "Не очень", emoji: "😕" },
  { label: "Плохо", emoji: "😣" }
];

const InteractiveLine = ({ onSelect }) => {
  const [showMonthList, setShowMonthList] = useState(false);
  const [showMoodList, setShowMoodList] = useState(false);
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

  const boxPad = 16; // отступы как у баннера и панели
  const fontSizeLabel = 15;
  const fontSizeChoice = 18;
  const dropdownAnim = {
    animation: "dropdown 320ms cubic-bezier(.6,.45,0,1.08)",
    transform: "translateY(-7px)",
    opacity: 1,
    pointerEvents: "auto",
  };

  return (
    <>
      <style>{`
        @keyframes dropdown {
          0% { opacity: 0; transform: translateY(-32px);}
          100% { opacity: 1; transform: translateY(-7px);}
        }
      `}</style>
      <div style={{
        display: "flex",
        gap: 22,
        maxWidth: 560,
        padding: `0 ${boxPad}px`,
        margin: "28px auto 0 auto",
        justifyContent: "center"
      }}>
        {/* Срок беременности */}
        <div style={{
          position: "relative",
          flex: 1,
          background: termGradient,
          borderRadius: 20,
          padding: "14px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxSizing: "border-box",
          minWidth: 128
        }}>
          <div
            onClick={() => setShowMonthList(v => !v)}
            style={{
              fontWeight: 700,
              fontSize: fontSizeLabel,
              color: "#fff",
              userSelect: "none",
              display: "flex",
              alignItems: "center",
              gap: 7
            }}
          >
            <span>{EMOJI_TERM}</span>
            {selectedMonth ? `Срок: ${selectedMonth} мес.` : "Выберите срок"}
          </div>
          {showMonthList && (
            <div style={{
              position: "absolute",
              top: "100%",
              left: 14,
              right: 14,
              background: termGradient,
              borderRadius: 18,
              zIndex: 11,
              padding: 10,
              marginTop: 7,
              boxShadow: "none",
              ...dropdownAnim
            }}>
              {Array.from({ length: 9 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    padding: "9px 0",
                    textAlign: "center",
                    color: "#fff",
                    fontWeight: 600,
                    fontSize: fontSizeChoice,
                    borderRadius: 15,
                    background: selectedMonth === (i + 1) ? "#fff6" : "transparent",
                    cursor: "pointer",
                    marginBottom: i < 8 ? 4 : 0,
                    transition: "background 0.15s"
                  }}
                  onClick={() => {
                    setSelectedMonth(i + 1);
                    setShowMonthList(false);
                  }}
                >
                  <span style={{ marginRight: 10, fontSize: 20 }}>{EMOJI_TERM}</span>
                  {i + 1} месяц
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Самочувствие */}
        <div style={{
          position: "relative",
          flex: 1,
          background: stateGradient,
          borderRadius: 20,
          padding: "14px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxSizing: "border-box",
          minWidth: 128
        }}>
          <div
            onClick={() => setShowMoodList(v => !v)}
            style={{
              fontWeight: 700,
              fontSize: fontSizeLabel,
              color: "#fff",
              userSelect: "none",
              display: "flex",
              alignItems: "center",
              gap: 8
            }}
          >
            <span>{EMOJI_STATE}</span>
            {selectedMood !== null
              ? `${moods[selectedMood].emoji} ${moods[selectedMood].label}`
              : "Выберите самочувствие"}
          </div>
          {showMoodList && (
            <div style={{
              position: "absolute",
              top: "100%",
              left: 14,
              right: 14,
              background: stateGradient,
              borderRadius: 18,
              zIndex: 11,
              padding: 10,
              marginTop: 7,
              boxShadow: "none",
              ...dropdownAnim
            }}>
              {moods.map((item, idx) => (
                <div
                  key={item.label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "9px 0",
                    color: "#fff",
                    fontWeight: 600,
                    fontSize: fontSizeChoice,
                    borderRadius: 14,
                    cursor: "pointer",
                    background: selectedMood === idx ? "#fff5" : "transparent",
                    marginBottom: idx < moods.length - 1 ? 4 : 0,
                    transition: "background 0.16s"
                  }}
                  onClick={() => {
                    setSelectedMood(idx);
                    setShowMoodList(false);
                  }}
                >
                  <span style={{ fontSize: 20 }}>{item.emoji}</span>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
// ---- КОНЕЦ ЭЛЕМЕНТОВ ----

const Chat = () => {
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [inputDisabled, setInputDisabled] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const messagesEndRef = useRef(null);
  const showTemplates = messages.length === 0;
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
      minHeight: 800,
      overflow: "hidden",
      position: "relative",
      transition: "background 0.4s"
    }}>
      <div style={{ height: sidePad }} />
      {/* Панель с градиентом */}
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
      {/* ---- ИНТЕРАКТИВЫ ---- */}
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
