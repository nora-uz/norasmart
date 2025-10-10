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

  // Высота учитывает панели, шаблоны (если есть), поле ввода
  const chatAreaHeight = `calc(100vh - ${panelHeight + sidePad * 2 + 2 * (BTN_SIZE + sidePad) + BTN_SIZE}px)`;

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
      {/* Панель */}
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
        justifyContent: "flex-start",
        boxSizing: "border-box",
        zIndex: 2000,
      }}>
        {/* Место под длинное название */}
        <div style={{ fontWeight: 600, fontSize: 19, marginRight: "auto" }}>Nora AI</div>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 6
