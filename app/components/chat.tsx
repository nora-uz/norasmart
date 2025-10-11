"use client";
import React, { useState, useEffect, useRef } from "react";

// --- темы ---
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

// ...ICONS, BANNER, TOPICS, переменные стиля и пр. (оставь как у себя)

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

      // Здесь запрос идет к своему API, а не к OpenAI напрямую!
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ messages: history })
      });
      const result = await response.json();
      const assistantMessage = result.text || "Нет ответа";

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

  // ... весь render как у тебя, без изменений

  return (
    // ... твоя верстка, все стили, возвращаемая JSX-структура
    // главное что fetch идет на /api/chat
  );
};

export default Chat;
