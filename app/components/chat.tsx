"use client";
import React, { useState, useEffect, useRef } from "react";

// --- Объявление темы (замени значения на свои/оставь как есть для теста) ---
const themes = {
  dark: {
    bgColor: "#22232e",
    inputBg: "#2f3141",
    inputText: "#fff",
    placeholder: "#535572",
    userBubble: "#303246",
    userText: "#fff",
    assistantBubble: "#344378",
    assistantText: "#fff",
  },
  light: {
    bgColor: "#f8f8f8",
    inputBg: "#fff",
    inputText: "#22232e",
    placeholder: "#b3bad0",
    userBubble: "#ededfa",
    userText: "#22232e",
    assistantBubble: "#e9f5ff",
    assistantText: "#22232e",
  }
};

// ... остальные ваши константы ICONS, BANNER, TOPICS, API_KEY и пр. без изменений

const Chat = () => {
  // ... хуки
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

  // Формируем автоматическое сообщение при выборе месяца и темы
  function makeFirstUserMsg(month, topic) {
    if (!month || !topic) return "";
    return `Срок беременности: ${month} месяц\nХочу обсудить: ${topic.title}, ${topic.desc}`;
  }

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
      { role: "user", text: makeFirstUserMsg(pickedMonth, topic), first: true }
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
                  justifyContent: msg.first ? "center" : msg.role === "assistant" ? "flex-start" : "flex-end",
                  marginBottom: 12
                }}
              >
                <div
                  style={
                    msg.first
                      ? {
                          background: theme.userBubble,
                          color: theme.userText,
                          borderRadius: borderRadius,
                          padding: "14px 20px",
                          fontSize: 16,
                          lineHeight: 1.7,
                          border: "none",
                          maxWidth: "100%",
                          width: "100%",
                          minWidth: 54,
                          marginLeft: 0,
                          marginRight: 0,
                          wordBreak: "break-word",
                          alignSelf: "center",
                          boxShadow: "none",
                          whiteSpace: "pre-line",
                          textAlign: "left",
                          transition: "background 0.4s, color 0.4s"
                        }
                      : {
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
                        }
                  }
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

// ...iconBtn, iconImgPanel, iconImgSend без изменений

export default Chat;
