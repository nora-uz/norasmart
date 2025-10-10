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
const ICON_SIZE_PANEL = 18;
const ICON_SIZE_SEND = 28;
const BTN_SIZE = 50;       // уменьшено было 62
const SEND_BTN_SIZE = 78;  // уменьшено было 94
const borderRadius = 22;
const sidePad = 16;
const panelHeight = 62;
const maxWidth = 560;
const GRADIENT = "linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)";

const themes = {
  dark: {
    panelBg: "#232323",
    bgColor: "#1C1C1C",
    userBubble: "#343434",
    userText: "#fff",
    inputBg: "#232323",
    inputText: "#fff",
    placeholder: "#888",
    assistantBubble: "#262939",
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
  "Пиши свой запрос, я отвечу!"
];

const TOPICS = [
  { title: "Сон", desc: "Проблемы с бессонницей и усталостью" },
  { title: "Питание", desc: "Рацион и полезные продукты" },
  { title: "Стрессы", desc: "Как управлять тревогой" },
  { title: "Готовность к родам", desc: "Что знать заранее" },
  { title: "Самочувствие", desc: "Физическое и эмоциональное состояние" },
  { title: "Витамины", desc: "Что принимать, когда и зачем" },
  { title: "Физическая активность", desc: "Можно ли и какую выбрать?" }
];

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
    setMessages((prev) => [...prev, { role: "user", text: userInput }]);
    setUserInput("");
    setInputDisabled(true);
    setTimeout(() => {
      const reply = FAKE_ANSWERS[Math.floor(Math.random() * FAKE_ANSWERS.length)];
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: reply }
      ]);
      setInputDisabled(false);
    }, 700);
  };

  const clearChat = () => {
    setMessages([]);
    setUserInput("");
  };

  return (
    <div
      style={{
        background: theme.bgColor,
        width: "100vw",
        minHeight: 800,
        overflow: "hidden",
        position: "relative",
        transition: "background 0.4s"
      }}
    >
      <div style={{ height: sidePad }} />
      <div
        style={{
          width: `calc(100% - ${sidePad * 2}px)`,
          maxWidth,
          height: panelHeight,
          margin: "0 auto",
          background: GRADIENT,
          color: "#fff",
          display: "flex",
          alignItems: "center",
          borderRadius: borderRadius,
          padding: `0 ${sidePad}px`,
          justifyContent: "flex-start",
          boxSizing: "border-box",
          position: "relative",
          zIndex: 2000,
          transition: "background 0.4s, color 0.4s"
        }}
      >
        <div style={{ fontWeight: 800, fontSize: 25, marginRight: sidePad }}>
          Nora AI
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            marginLeft: "auto"
          }}
        >
          <button
            style={iconBtn("transparent")}
            onClick={() => setDarkMode((prev) => !prev)}
          >
            <img src={darkMode ? ICONS.sun : ICONS.moon} alt="Theme" style={iconImgPanel} />
          </button>
          <button
            style={iconBtn("transparent")}
            onClick={() => window.open("https://t.me/", "_blank")}
          >
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
          background: theme.bgColor,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative"
        }}
      >
        <img
          src={BANNER}
          alt="Nora AI баннер"
          style={{
            width: "100%",
            maxHeight: 170,
            display: "block",
            objectFit: "contain",
            objectPosition: "center"
          }}
        />
      </div>
      <div style={{ height: sidePad }} />

      {showTemplates && (
        <div
          style={{
            width: `calc(100% - ${sidePad * 2}px)`,
            maxWidth,
            margin: "0 auto",
            borderRadius: borderRadius,
            background: theme.inputBg,
            marginBottom: sidePad,
            padding: `${sidePad + 2}px ${sidePad}px ${sidePad + 6}px ${sidePad}px`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
          }}
        >
          {/* Срок беременности */}
          <div style={{ width: "100%", marginBottom: sidePad }}>
            <div
              style={{
                fontWeight: 400,
                fontSize: 15,
                marginBottom: 18,
                color: "#c7d3ef",
                letterSpacing: "0.03em"
              }}
            >
              Выберите срок беременности:
            </div>
            <div
              style={{
                display: "flex",
                gap: 12,
                overflowX: "auto",
                justifyContent: "flex-start",
                paddingRight: 32
              }}
              className="months-scroll"
            >
              {Array.from({ length: 9 }).map((_, i) => (
                <button
                  key={i}
                  style={{
                    minWidth: 52,
                    height: 52,
                    borderRadius: 20,
                    border: "none",
                    cursor: inputDisabled ? "not-allowed" : "pointer",
                    fontSize: 26,
                    fontWeight: 600,
                    background: GRADIENT,
                    color: "#fff",
                    boxShadow: "none",
                    opacity: inputDisabled ? 0.7 : 1,
                    outline: "none",
                    marginRight: i < 8 ? 9 : 0,
                    transition: "box-shadow 0.2s"
                  }}
                  disabled={inputDisabled}
                  onClick={() => {
                    if (inputDisabled) return;
                    setMessages((prev) => [
                      ...prev,
                      { role: "user", text: `Мой срок беременности: ${i + 1} месяц` }
                    ]);
                    setInputDisabled(true);
                    setUserInput("");
                    setTimeout(() => {
                      const reply = FAKE_ANSWERS[Math.floor(Math.random() * FAKE_ANSWERS.length)];
                      setMessages((prev) => [
                        ...prev,
                        { role: "assistant", text: reply }
                      ]);
                      setInputDisabled(false);
                    }, 700);
                  }}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <style>{`
              .months-scroll::-webkit-scrollbar { display: none; }
              .months-scroll { scrollbar-width: none; -ms-overflow-style: none; }
            `}</style>
          </div>
          {/* Темы для обсуждения */}
          <div style={{ width: "100%", marginBottom: sidePad }}>
            <div
              style={{
                fontWeight: 400,
                fontSize: 15,
                marginBottom: 18,
                color: "#c7d3ef",
                letterSpacing: "0.03em"
              }}
            >
              Выберите тему для обсуждения:
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 16
              }}
            >
              {TOPICS.map((topic, i) => (
                <button
                  key={i}
                  style={{
                    width: "100%",
                    borderRadius: 18,
                    border: "none",
                    cursor: inputDisabled ? "not-allowed" : "pointer",
                    background: GRADIENT,
                    color: "#fff",
                    boxShadow: "none",
                    opacity: inputDisabled ? 0.7 : 1,
                    outline: "none",
                    textAlign: "left",
                    padding: "17px 18px 13px 18px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    transition: "box-shadow 0.2s",
                    fontWeight: 600
                  }}
                  disabled={inputDisabled}
                  onClick={() => {
                    if (inputDisabled) return;
                    setMessages((prev) => [
                      ...prev,
                      { role: "user", text: `Тема: ${topic.title}. ${topic.desc}` }
                    ]);
                    setInputDisabled(true);
                    setUserInput("");
                    setTimeout(() => {
                      const reply = FAKE_ANSWERS[Math.floor(Math.random() * FAKE_ANSWERS.length)];
                      setMessages((prev) => [
                        ...prev,
                        { role: "assistant", text: reply }
                      ]);
                      setInputDisabled(false);
                    }, 700);
                  }}
                >
                  <span style={{ fontSize: 19, fontWeight: 700, marginBottom: 5 }}>
                    {topic.title}
                  </span>
                  <span style={{ fontSize: 15, fontWeight: 400, opacity: 0.95 }}>
                    {topic.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div
        style={{
          width: "100%",
          maxWidth,
          margin: "0 auto",
          boxSizing: "border-box",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          overflow: "hidden"
        }}
      >
        <div
          style={{
            width: "100%",
            flex: 1,
            minHeight: 0,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start"
          }}
        >
          {messages.map((msg, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                justifyContent: msg.role === "assistant" ? "flex-start" : "flex-end",
                marginBottom: 12,
                width: "100%"
              }}
            >
              <div
                style={{
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
                  boxShadow: "none",
                  transition: "background 0.4s, color 0.4s"
                }}
              >
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
          <div style={{ height: BTN_SIZE + sidePad * 3 }} />
        </div>
      </div>
      <div
        style={{
          width: "100vw",
          height: 36,
          background: darkMode ? "#181A1B" : "#F2F4F5",
          transition: "background 0.4s"
        }}
      />
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
            fontSize: 21,
            background: theme.inputBg,
            color: theme.inputText,
            outline: "none",
            marginRight: 0,
            transition: "background 0.4s, color 0.4s"
          }}
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Введите ваш вопрос"
          disabled={inputDisabled}
          className="nora-input"
        />
        <button
          type="submit"
          style={{
            background: "#fff",
            color: "#2575fc",
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
            font-size: 21px;
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
  filter: "brightness(0) invert(1)"
};

const iconImgSend = {
  width: ICON_SIZE_SEND,
  height: ICON_SIZE_SEND,
  display: "block",
  background: "none"
};

export default Chat;
