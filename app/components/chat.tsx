import React, { useState, useEffect, useRef } from "react";

const ICON_SIZE = 32;
const SMALL_ICON = 26;

const ICON_MOON = "https://user-gen-media-assets.s3.amazonaws.com/seedream_images/350cb7b8-4f7f-43db-9c71-c5388ac17f4e.png";
const ICON_SUN = "https://user-gen-media-assets.s3.amazonaws.com/seedream_images/baf09364-3f86-47e1-8134-0c505aeaf9cc.png";
const ICON_TRASH = "https://user-gen-media-assets.s3.amazonaws.com/seedream_images/a1a10e8a-7ce4-4789-8e72-0cbb22504d9c.png";
const ICON_PHONE = "https://user-gen-media-assets.s3.amazonaws.com/seedream_images/09b38cb2-5ed3-402a-ba48-f5716e26968a.png";
const ICON_TELEGRAM = "https://user-gen-media-assets.s3.amazonaws.com/seedream_images/50394a9d-0d54-499b-b3b0-2a8a96dc316f.png";
const ICON_ARROW = "https://user-gen-media-assets.s3.amazonaws.com/seedream_images/4f06cab0-ec48-4875-8a37-e4f27fb4da0c.png";

const MAIN_IMG = "https://user-gen-media-assets.s3.amazonaws.com/seedream_images/70a60994-809a-473d-accc-36284ba46e1c.png";

const Chat = () => {
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [inputDisabled, setInputDisabled] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;
    setMessages(prev => [...prev, { role: "user", text: userInput }]);
    setUserInput("");
    setInputDisabled(false);
  };

  const clearChat = () => {
    setMessages([]);
    setUserInput("");
  };

  // --- Стили ---
  const bgColor = "#1C1C1C";
  const panelBg = "#171717";
  const borderRadius = 18;
  const panelHeight = 56;
  const panelPadH = 16;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: bgColor,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: 0,
        overflow: "hidden"
      }}
    >
      {/* Панель */}
      <div
        style={{
          position: "fixed",
          top: 18,
          left: 18,
          right: 18,
          zIndex: 100,
          height: panelHeight,
          background: panelBg,
          color: "#fff",
          display: "flex",
          alignItems: "center",
          borderRadius: borderRadius,
          padding: `0 ${panelPadH}px`,
          justifyContent: "space-between"
        }}
      >
        <div style={{ fontWeight: 600, fontSize: 17 }}>Nora AI</div>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}>
          <button
            style={iconBtnStyle}
            onClick={() => setDarkMode(mode => !mode)}
            aria-label="Тема"
          >
            <img
              src={darkMode ? ICON_SUN : ICON_MOON}
              alt="Theme"
              style={iconImgStyle}
            />
          </button>
          <button style={iconBtnStyle} onClick={clearChat} aria-label="Очистить чат">
            <img src={ICON_TRASH} alt="Trash" style={iconImgStyle} />
          </button>
          <button
            style={iconBtnStyleSm}
            aria-label="Позвонить"
            onClick={() => window.open("
