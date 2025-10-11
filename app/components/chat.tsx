"use client";
import React, { useState, useEffect, useRef } from "react";

// ...Const ICONS, themes, TOPICS, другие стили и константы оставьте без изменений...

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

      // --- ВАЖНО: отправка только на свой API ---
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history })
      });
      const result = await response.json();
      const assistantMessage = result.message || "Нет ответа";

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
    <div>
      {/* --- ВАШИ СТИЛИ, ПАНЕЛЬ, БАННЕР И ВЫБОР МЕСЯЦА/ТЕМЫ без изменений... --- */}
      {/* --- Рендер сообщений --- */}
      {!showSteps && firstMessageSent && (
        <div style={{
          width: "100%", maxWidth, margin: "0 auto", flex: 1, display: "flex", flexDirection: "column", alignItems: "center", overflow: "hidden"
        }}>
          <div style={{ height: blockMargin }} />
          <div style={{ width: "100%", flex: 1, minHeight: 0, overflowY: "auto", display: "flex", flexDirection: "column", justifyContent: "flex-start" }}>
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
      {/* --- Поле ввода, кнопка отправки без изменений... --- */}
    </div>
  );
};

// ...iconBtn, iconImgPanel, iconImgSend без изменений

export default Chat;
