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
    placeholder: "#fff",
    assistantBubble: "#131313",
    assistantText: "#fff"
  },
  light: {
    panelBg: "#F6F7FB",
    bgColor: "#F9FAFC",
    userBubble: "#fff",
    userText: "#333",
    inputBg: "#F6F7FB",
    placeholder: "#333",
    assistantBubble: "#E8EAED",
    assistantText: "#333"
  }
};

const PRESET_TEMPLATES = [
  { title: "Здоровье", description: "Советы для самочувствия, профилактики и ухода." },
  { title: "Эмоции", description: "Как справиться со стрессом и получить поддержку." }
];

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
  const showTemplates = messages.length === 0;
  const theme = darkMode ? themes.dark : themes.light;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const mobileScreenHeight = `calc(100vh - ${(showTemplates ? TEMPLATE_BTN_SIZE * PRESET_TEMPLATES.length + sidePad : 0) + BTN_SIZE + sidePad * 3}px)`;

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

  return (
    <div style={{
      background: theme.bgColor,
      width: "100vw",
      minHeight: "100vh",
      overflow: "hidden",
      position: "relative",
      transition: "background 0.4s"
    }}>
      {/* Отступ сверху до панели */}
      <div style={{ height: sidePad }} />
      {/* Панель */}
      <div style={{
        width: `calc(100% - ${sidePad * 2}px)`,
        maxWidth,
        height: panelHeight,
        margin: "0 auto",
        background: theme.panelBg,
        color: theme.assistantText,
        display: "flex",
        alignItems: "center",
        borderRadius: borderRadius,
        padding: `0 ${sidePad}px 0 ${sidePad}px`,
        justifyContent: "flex-start",
        boxSizing: "border-box",
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
          <button style={iconBtn(theme.panelBg)} onClick={() => setDarkMode((prev) => !prev)}>
            <img src={darkMode ? ICONS.sun : ICONS.moon} alt="Theme" style={iconImgPanel} />
          </button>
          <button style={iconBtn(theme.panelBg)} onClick={() => window.open('https://t.me/', '_blank')}>
            <img src={ICONS.telegram} alt="Telegram" style={iconImgPanel} />
          </button>
          <button
            style={{ ...iconBtn(theme.panelBg), marginRight: -sidePad }}
            onClick={clearChat}
          >
            <img src={ICONS.trash} alt="Trash" style={iconImgPanel} />
          </button>
        </div>
      </div>
      {/* Отступ после панели до фото */}
      <div style={{ height: sidePad }} />
      <div style={{
        width: "100%",
        maxWidth,
        margin: "0 auto",
        boxSizing: "border-box",
        height: mobileScreenHeight,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        overflow: "hidden",
      }}>
        {/* БАННЕР */}
        <div style={{
          width: `calc(100% - ${sidePad * 2}px)`,
          maxWidth,
          borderRadius: 26,
          overflow: "hidden",
          boxShadow: "0 4px 28px 0 rgba(55,40,120,0.14)",
          background: theme.bgColor,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexShrink: 0,
          position: "relative"
        }}>
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
                fontSize: 18,
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
      {/* Фиксированные готовые ответы */}
      {showTemplates && (
        <div style={{
          position: "fixed",
          left: "50%",
          bottom: BTN_SIZE + sidePad * 2, // отступ между формой и шаблонами как sidePad
          transform: "translateX(-50%)",
          width: `calc(100% - ${sidePad * 2}px)`,
          maxWidth,
          zIndex: 2500,
        }}>
          {PRESET_TEMPLATES.map((tpl) => (
            <button
              key={tpl.title}
              style={{
                background: theme.panelBg,
                color: theme.assistantText,
                border: "none",
                borderRadius: borderRadius,
                padding: "12px 22px",
                fontSize: 15,
                width: "100%",
                height: TEMPLATE_BTN_SIZE,
                marginBottom: sidePad,
                cursor: inputDisabled ? "not-allowed" : "pointer",
                textAlign: "left",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "start",
                outline: "none",
                boxShadow: "none",
                transition: "background 0.4s, color 0.4s",
                whiteSpace: "normal",
                overflowWrap: "anywhere"
              }}
              disabled={inputDisabled}
              onClick={() => {
                if (inputDisabled) return;
                setMessages(prev => [...prev, { role: "user", text: tpl.description }]);
                setInputDisabled(true);
                setUserInput("");
                setTimeout(() => {
                  const reply = FAKE_ANSWERS[Math.floor(Math.random() * FAKE_ANSWERS.length)];
                  setMessages(prev => [...prev, { role: "assistant", text: reply }]);
                  setInputDisabled(false);
                }, 700);
              }}
            >
              <span style={{
                fontWeight: 600,
                fontSize: 15,
                marginBottom: 5,
                lineHeight: 1.13,
                whiteSpace: "nowrap"
              }}>
                {tpl.title}
              </span>
              <span style={{
                fontSize: 13,
                color: "#bbb",
                lineHeight: 1.32,
                wordBreak: "break-word",
                whiteSpace: "normal"
              }}>
                {tpl.description}
              </span>
            </button>
          ))}
        </div>
      )}
      {/* Фиксированное поле ввода */}
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
          padding: 0,
        }}
      >
        <input
          type="text"
          style={{
            flex: 14,
            border: "none",
            borderRadius: borderRadius,
            height: BTN_SIZE,
            padding: `0 8px 0 ${sidePad}px`,
            fontSize: 19,
            background: theme.inputBg,
            color: theme.assistantText,
            outline: "none",
            marginRight: 8,
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
            marginRight: sidePad,
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
