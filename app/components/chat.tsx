"use client";
import React, { useState, useEffect, useRef } from "react";
// оставь свои ICONS, BANNER, TOPICS, themes и константы

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

  const showSteps = !(pickedMonth && pickedTopic);
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
        ...(pickedMonth ? [{ role: "user", text: `Мой срок беременности: ${pickedMonth} месяц` }] : []),
        ...(pickedTopic ? [{ role: "user", text: `Тема: ${pickedTopic.title}. ${pickedTopic.desc}` }] : []),
        ...messages.filter(msg => msg.role === "user").map(msg => ({ role: "user", text: msg.text })),
        { role: "user", text: userInput }
      ];

      // Только клиентский fetch на свой эндпоинт!
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history })
      });
      const result = await response.json();
      setMessages(prev => [
        ...prev,
        { role: "assistant", text: result.text || "Нет ответа" }
      ]);
    } catch {
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
        position: "relative"
      }}
    >
      {/* ...весь твой JSX-код (панели, кнопки, баннер, чаты, поля и т.д.) - теперь без кусочных комментариев! */}
      {/* Можно полностью копировать из своего примера выше, только убери все // ... затычки */}

      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          alignItems: "center",
          background: "none",
          boxSizing: "border-box",
          padding: 0
        }}
      >
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Введите ваш вопрос"
          disabled={inputDisabled}
        />
        <button type="submit" disabled={inputDisabled}>
          Отправить
        </button>
      </form>
      <div>
        {messages.map((msg, idx) => (
          <div key={idx} style={{
            background: msg.role === "assistant" ? theme.assistantBubble : theme.userBubble,
            color: msg.role === "assistant" ? theme.assistantText : theme.userText,
            margin: 3, padding: 10, borderRadius: 8
          }}>{msg.text}</div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default Chat;
