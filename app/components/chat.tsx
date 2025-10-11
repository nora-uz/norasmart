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
const BTN_SIZE = 50;
const SEND_BTN_SIZE = 78;
const borderRadius = 22;
const sidePad = 16;
const blockMargin = 20;
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

const TOPICS = [
  { title: "Сон", desc: "Проблемы с бессонницей и усталостью" },
  { title: "Питание", desc: "Рацион и полезные продукты" },
  { title: "Стрессы", desc: "Как управлять тревогой" },
  { title: "Готовность к родам", desc: "Что знать заранее" },
  { title: "Самочувствие", desc: "Физическое и эмоциональное состояние" },
  { title: "Витамины", desc: "Что принимать, когда и зачем" },
  { title: "Физическая активность", desc: "Можно ли и какую выбрать?" }
];

const API_URL = "https://api.openai.com/v1/assistants/asst_O0ENHkHsICvLEjBXleQpyqDx/messages";
const OPENAI_API_KEY = "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";

const Chat = () => {
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [inputDisabled, setInputDisabled] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [pickedMonth, setPickedMonth] = useState(null);
  const [pickedTopic, setPickedTopic] = useState(null);
  const [firstMessageSent, setFirstMessageSent] = useState(false);
  const messagesEndRef = useRef(null);

  const theme = darkMode ? themes.dark : themes.light;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const showSteps = !(pickedMonth && pickedTopic) && !firstMessageSent;
  const showFixedInput = pickedMonth && pickedTopic;

  const handleMonthPick = (month) => {
    if (inputDisabled) return;
    setPickedMonth(month);
    setPickedTopic(null);
    setUserInput("");
    setFirstMessageSent(false);
  };

  const handleTopicPick = (topic) => {
    if (inputDisabled || !pickedMonth) return;
    setPickedTopic(topic);
    setMessages([
      { role: "user", text: `Тема: ${topic.title}. ${topic.desc}` }
    ]);
    setFirstMessageSent(true);
    setUserInput("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userInput.trim() || inputDisabled) return;
    setMessages(prev => [...prev, { role: "user", text: userInput }]);
    setUserInput("");
    setInputDisabled(true);

    try {
      const history = [
        ...(pickedMonth
          ? [{ role: "user", text: `Мой срок беременности: ${pickedMonth} месяц` }]
          : []),
        ...(pickedTopic
          ? [{ role: "user", text: `Тема: ${pickedTopic.title}. ${pickedTopic.desc}` }]
          : []),
        ...messages.filter(msg => msg.role === "user").map(msg => ({
          role: "user", text: msg.text
        })),
        { role: "user", text: userInput }
      ];

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messages: history.map(m => ({ role: m.role, content: m.text })),
        })
      });
      const result = await response.json();
      const assistantMessage = result.choices?.[0]?.message?.content || result.result || "Нет ответа";

      setMessages(prev => [
        ...prev,
        { role: "assistant", text: assistantMessage }
      ]);
    } catch (error) {
      setMessages(prev => [
        ...prev,
        { role: "assistant", text: "Ошибка ответа ассистента, попробуйте позже." }
      ]);
    } finally {
      setInputDisabled(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setUserInput("");
    setPickedMonth(null);
    setPickedTopic(null);
    setFirstMessageSent(false);
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
      {/* --- ГЛОБАЛЬНЫЕ СТИЛИ --- */}
      <style>{`
        .months-scroll::-webkit-scrollbar { display: none; }
        .months-scroll { scrollbar-width: none; -ms-overflow-style: none; }
      `}</style>

      <div style={{ height: blockMargin }} />
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
            gap: 7,
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
      <div style={{ height: blockMargin }} />
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
            height: "auto",
            display: "block",
            objectFit: "contain",
            objectPosition: "center"
          }}
        />
      </div>
      <div style={{ height: blockMargin }} />
      {(firstMessageSent && messages.length > 0) && (
        <>
          <div style={{ height: blockMargin }} />
          <div style={{
            width: "100%",
            maxWidth,
            margin: "0 auto"
          }}>
            <div style={{
              background: "#F6F7FB",
              color: "#1C1C1C",
              borderRadius: borderRadius,
              padding: "14px 20px",
              fontSize: 16,
              lineHeight: 1.7,
              border: "none",
              boxShadow: "none",
              textAlign: "left",
              marginBottom: blockMargin
            }}>
              {messages[0].text}
            </div>
          </div>
        </>
      )}
      {/* --- ВЫБОР МЕСЯЦА и ТЕМЫ --- */}
      {showSteps && (
        <div
          style={{
            width: `calc(100% - ${sidePad * 2}px)`,
            maxWidth,
            margin: "0 auto",
            borderRadius: borderRadius,
            background: theme.inputBg,
            marginBottom: blockMargin,
            padding: `${sidePad + 2}px ${sidePad}px ${sidePad + 6}px ${sidePad}px`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
          }}
        >
          {/* Заголовок "Выберите срок беременности:" */}
          <div style={{ width: "100%" }}>
            <div style={{
              fontWeight: 400,
              fontSize: 17,
              marginBottom: blockMargin,
              color: "#fff",
              letterSpacing: "0.03em"
            }}>
              Выберите срок беременности:
            </div>
            <div
              className="months-scroll"
              style={{
                display: "flex",
                gap: 12,
                overflowX: "auto",
                padding: "6px 0 6px 0",
                scrollSnapType: "x mandatory"
              }}
            >
              {[...Array(9)].map((_, i) => {
                let month = i + 1;
                let styleBtn = {
                  minWidth: 52,
                  height: 52,
                  borderRadius: 20,
                  border: "none",
                  cursor: inputDisabled ? "not-allowed" : "pointer",
                  fontSize: 26,
                  fontWeight: 600,
                  background: pickedMonth === month ? "#fff" : GRADIENT,
                  color: pickedMonth === month ? "#2575fc" : "#fff",
                  opacity: 1,
                  boxShadow: "none",
                  outline: "none",
                  scrollSnapAlign: "center",
                  marginRight: i < 8 ? 9 : 0,
                  transition: "box-shadow 0.2s, background 0.2s, color 0.2s"
                };
                return (
                  <button
                    key={month}
                    style={styleBtn}
                    disabled={inputDisabled}
                    onClick={() => handleMonthPick(month)}
                  >
                    {month}
                  </button>
                );
              })}
            </div>
          </div>
          <div style={{ height: blockMargin }} />
          <div style={{ width: "100%", marginBottom: 0 }}>
            <div style={{
              fontWeight: 400,
              fontSize: 17,
              marginBottom: blockMargin,
              color: "#fff",
              letterSpacing: "0.03em"
            }}>
              Выберите тему для обсуждения:
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {TOPICS.map((topic, i) => {
                let isSelected = pickedTopic?.title === topic.title;
                let disabled = inputDisabled || !pickedMonth;
                let styleBtn;
                if (isSelected) {
                  styleBtn = {
                    width: "100%",
                    borderRadius: 18,
                    border: "none",
                    cursor: disabled ? "not-allowed" : "pointer",
                    background: "#fff",
                    color: "#2575fc",
                    opacity: disabled ? 0.45 : 1,
                    textAlign: "left",
                    padding: "17px 18px 13px 18px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    fontWeight: 600,
                    boxShadow: "none",
                    outline: "none",
                    filter: disabled ? "brightness(0.7) grayscale(0.4)" : "none",
                    transition: "box-shadow 0.2s, background 0.2s, color 0.2s"
                  };
                } else {
                  styleBtn = {
                    width: "100%",
                    borderRadius: 18,
                    border: "none",
                    cursor: disabled ? "not-allowed" : "pointer",
                    background: GRADIENT,
                    color: "#fff",
                    opacity: disabled ? 0.45 : 1,
                    textAlign: "left",
                    padding: "17px 18px 13px 18px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    fontWeight: 600,
                    boxShadow: "none",
                    outline: "none",
                    filter: disabled ? "brightness(0.7) grayscale(0.4)" : "none",
                    transition: "box-shadow 0.2s, background 0.2s, color 0.2s"
                  };
                }
                return (
                  <button
                    key={i}
                    style={styleBtn}
                    disabled={disabled}
                    onClick={() => handleTopicPick(topic)}
                  >
                    <span style={{
                      fontSize: 19,
                      fontWeight: 700,
                      marginBottom: 5,
                      color: isSelected ? "#2575fc" : "#fff"
                    }}>
                      {topic.title}
                    </span>
                    <span style={{
                      fontSize: 15,
                      fontWeight: 400,
                      opacity: 0.95,
                      color: isSelected ? "#2575fc" : "#fff"
                    }}>
                      {topic.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
      {/* ---- Чат ---- */} 
      {!showSteps && firstMessageSent && (
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
          <div style={{ height: blockMargin }} />
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
            {messages.slice(1).map((msg, idx) => (
              <div
                key={idx}
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: msg.role === "assistant" ? "flex-start" : "flex-end",
                  marginBottom: 12,
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
                    alignSelf: "flex-start",
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
      )}
      <div style={{ height: blockMargin }} />
      <form
        onSubmit={handleSubmit}
        style={{
          position: showFixedInput ? "fixed" : "static",
          left: showFixedInput ? "50%" : "auto",
          bottom: showFixedInput ? blockMargin : "auto",
          transform: showFixedInput ? "translateX(-50%)" : "none",
          width: `calc(100% - ${sidePad * 2}px)`,
          maxWidth,
          margin: showFixedInput ? 0 : `0 auto`,
          zIndex: showFixedInput ? 2600 : "auto",
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
          onChange={(e) => {
            setUserInput(e.target.value);
            if (e.target.value.trim() && !firstMessageSent) {
              setFirstMessageSent(true);
            }
          }}
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
      <div style={{ height: blockMargin }} />
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
