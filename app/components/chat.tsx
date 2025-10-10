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
const BTN_SIZE = 62;
const borderRadius = 22;
const sidePad = 16;
const panelHeight = 62;
const panelBg = "#131313";
const bgColor = "#181818";
const maxWidth = 560;

const PRESET_TEMPLATES = [
  {
    title: "Здоровье",
    description: "Советы по самочувствию",
  },
  {
    title: "Эмоции",
    description: "Как справиться со стрессом",
  },
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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Высота включает шаблоны только если они видимы
  const templatesHeight = showTemplates
    ? PRESET_TEMPLATES.length * BTN_SIZE + PRESET_TEMPLATES.length * sidePad
    : 0;
  const chatAreaHeight = `calc(100vh - ${panelHeight + sidePad * 2 + BTN_SIZE + templatesHeight}px)`;

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
      background: bgColor,
      width: "100vw",
      height: "100vh",
      overflow: "hidden",
      position: "relative",
    }}>
      {/* Панель — иконки максимально вправо */}
      <div style={{
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
      }}>
        <div style={{
          fontWeight: 600,
          fontSize: 19,
          marginRight: "auto",
        }}>Nora AI</div>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          marginLeft: 32,
        }}>
          <button style={iconBtn(panelBg)} onClick={() => setDarkMode(mode => !mode)}>
            <img src={darkMode ? ICONS.sun : ICONS.moon} alt="Theme" style={iconImgPanel} />
          </button>
          <button style={iconBtn(panelBg)} onClick={clearChat}>
            <img src={ICONS.trash} alt="Trash" style={iconImgPanel} />
          </button>
          <button style={iconBtn(panelBg)} onClick={() => window.open('tel:+1234567890')}>
            <img src={ICONS.phone} alt="Phone" style={iconImgPanel} />
          </button>
          <button style={iconBtn(panelBg)} onClick={() => window.open('https://t.me/', '_blank')}>
            <img src={ICONS.telegram} alt="Telegram" style={iconImgPanel} />
          </button>
        </div>
      </div>

      {/* Контент и баннер */}
      <div style={{
        width: "100%",
        maxWidth,
        margin: "0 auto",
        marginTop: panelHeight + sidePad,
        boxSizing: "border-box",
        height: chatAreaHeight,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        overflow: "hidden",
      }}>
        <div style={{
          width: `calc(100% - ${sidePad * 2}px)`,
          maxWidth,
          marginBottom: sidePad,
          borderRadius: 26,
          overflow: "hidden",
          boxShadow: "0 4px 28px 0 rgba(55,40,120,0.14)",
          background: "#181818",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexShrink: 0,
          position: "relative",
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
              }}>
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Готовые шаблонные ответы над формой, с равным отступом между собой и до поля */}
      {showTemplates && (
        <div style={{
          position: "fixed",
          left: "50%",
          bottom: BTN_SIZE + 2 * sidePad,
          transform: "translateX(-50%)",
          width: `calc(100% - ${sidePad * 2}px)`,
          maxWidth,
          zIndex: 2500,
        }}>
          {PRESET_TEMPLATES.map((tpl, idx) => (
            <button
              key={tpl.title}
              style={{
                background: panelBg,
                color: "#fff",
                border: "none",
                borderRadius: borderRadius,
                padding: "0 22px",
                fontSize: 16,
                width: "100%",
                height: BTN_SIZE,
                marginBottom: idx === PRESET_TEMPLATES.length - 1 ? sidePad : sidePad,
                cursor: inputDisabled ? "not-allowed" : "pointer",
                textAlign: "left",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                outline: "none",
                boxShadow: "none"
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
                fontSize: 16,
                marginBottom: 5,
                lineHeight: 1.13,
              }}>
                {tpl.title}
              </span>
              <span style={{
                fontSize: 11,
                color: "#bbb",
                lineHeight: 1.2,
              }}>
                {tpl.description}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Поле для сообщения фиксировано внизу, кнопка внутри, квадратная и скруглённая */}
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
          height: BTN_SIZE,
          display: "flex",
          alignItems: "center",
          zIndex: 2600,
          padding: 0,
          boxSizing: "border-box",
        }}
      >
        <input
          type="text"
          style={{
            flex: 1,
            border: "none",
            borderRadius: `${borderRadius}px`,
            height: BTN_SIZE,
            padding: "0 18px 0 22px",
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
            width: BTN_SIZE - 8,
            height: BTN_SIZE - 8,
            marginRight: 10,
            marginLeft: 6,
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
