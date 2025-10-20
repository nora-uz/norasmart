"use client";
import React, { useState, useEffect, useRef } from "react";

const NORA_COLOR = "#2e2e2e";
const ICON_SIZE = 23;
const borderRadius = 22;
const panelHeight = 62;
const maxWidth = 560;
const videoMaxWidth = 314;
const GRADIENT = "linear-gradient(90deg, #eff5fe 0%, #e5e8ed 100%)";
const BABY_GRADIENT = "linear-gradient(90deg, #e39290 0%, #efb1b6 100%)";
const INPUT_BAR_HEIGHT = 68;
const PANEL_SIDE_PADDING = 15;
const BLOCK_SIDE_PADDING = 10;
const CARD_GAP = 10;

// Минималистичные иконки
const IconPartner = (
  <svg width="18" height="18" fill="none" viewBox="0 0 20 20">
    <circle cx="10" cy="6.5" r="3.3" stroke="#5a6573" strokeWidth="1.5"/>
    <path d="M2.8 16c.9-2.5 3.4-4.2 7.2-4.2s6.2 1.7 7.2 4.2" stroke="#5a6573" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const IconContact = (
  <svg width="18" height="18" fill="none" viewBox="0 0 20 20">
    <rect x="2.8" y="3.5" width="14.4" height="11" rx="2.2" stroke="#5a6573" strokeWidth="1.5"/>
    <path d="M3.5 4l6.5 6.1c.3.2.8.2 1.1 0L17 4" stroke="#5a6573" strokeWidth="1.5"/>
  </svg>
);

const IconLock = (
  <svg width="16" height="16" fill="none" viewBox="0 0 20 20"><rect x="5" y="9" width="10" height="7" rx="2" stroke="#8a97a0" strokeWidth="1.6"/><path d="M7.8 9V7a2.2 2.2 0 1 1 4.4 0v2" stroke="#8a97a0" strokeWidth="1.6"/></svg>
);

const ICONS = {
  telegram: "https://cdn-icons-png.flaticon.com/512/1946/1946547.png",
  trash: "https://cdn-icons-png.flaticon.com/512/1345/1345823.png",
  share: "https://cdn-icons-png.flaticon.com/512/535/535285.png",
  arrowRight: (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path d="M6 11H16M16 11L12 7M16 11L12 15"
        stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
};
const filterNora = "invert(13%) sepia(4%) saturate(271%) hue-rotate(175deg) brightness(92%) contrast(93%)";

// Готовые темы
const TOPICS = [
  { icon: "🤢", title: "Тошнота и токсикоз", desc: "Что помогает на ранних сроках?" },
  { icon: "🍏", title: "Питание при беременности", desc: "Какие продукты полезны?" },
  { icon: "🤸‍♀️", title: "Фитнес и движение", desc: "Можно ли беременным спорт?" },
  { icon: "😔", title: "Эмоции и тревожность", desc: "Как справиться со страхами?" },
  { icon: "💊", title: "Витамины", desc: "Что принимать, а что нет?" },
  { icon: "☕️", title: "Кофе и напитки", desc: "Можно ли кофе и чай?" },
];

const TopicsBlock = ({ onTopicClick }) => (
  <div style={{
    margin: "0 auto 24px auto",
    maxWidth: 560,
    display: "flex",
    flexWrap: "wrap",
    gap: "14px",
    justifyContent: "center"
  }}>
    {TOPICS.map((topic, idx) => (
      <button key={idx}
        style={{
          flex: "1 1 44%",
          minWidth: 155,
          maxWidth: 230,
          background: "#fff",
          border: "none",
          borderRadius: "18px",
          boxShadow: "0 2px 12px 0 rgba(150,180,220,0.07)",
          padding: "14px 14px 14px 14px",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          cursor: "pointer",
          fontFamily: "'Manrope', Arial, Helvetica, sans-serif"
        }}
        onClick={() => onTopicClick(`${topic.title}. ${topic.desc}`)}
      >
        <div style={{fontSize: 22, marginBottom: 4}}>{topic.icon}</div>
        <div style={{fontWeight: 700, fontSize: 15, color: "#2e2e2e", marginBottom: 2}}>{topic.title}</div>
        <div style={{fontSize: 13, color: "#6c7689"}}>{topic.desc}</div>
      </button>
    ))}
  </div>
);

// Истории чата
const OLD_CHATS = [
  { id: 1, title: "1-й триместр — анализы", sub: "Рекомендации по обследованиям" },
  { id: 2, title: "Питание и витамины", sub: "Что принимать каждый день?" }
];
const ChatsHistoryBlock = ({onSelect}) => (
  <div style={{
    margin: "0 auto 18px auto",
    maxWidth: 560,
    width: "100%",
    padding: "0 6px"
  }}>
    <div style={{ fontSize: 14, color: "#818ca0", fontWeight: 600, marginBottom: 9, marginLeft: 5 }}>История чата</div>
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {OLD_CHATS.map(chat => (
        <button
          key={chat.id}
          onClick={() => onSelect(chat)}
          style={{
            background: "#fff",
            border: "1px solid #e5e9f8",
            borderRadius: 15,
            padding: "13px 15px",
            display: "flex",
            alignItems: "flex-start",
            gap: 13,
            textAlign: "left",
            cursor: "pointer",
            boxShadow: "0 2px 7px 0 rgba(100,120,180,0.05)"
          }}>
          <span style={{ fontSize: 19, marginTop: 2 }}>💬</span>
          <div>
            <div style={{ fontWeight: 600, color: "#27324d", fontSize: 15 }}>{chat.title}</div>
            <div style={{ fontSize: 13, color: "#7582a3" }}>{chat.sub}</div>
          </div>
        </button>
      ))}
    </div>
  </div>
);

// ... ваши блоки WhyNoraBlock, ReviewBlock, Footer — используйте без изменений из вашего кода выше.

// splitBotTextTwoBlocks — как раньше

const Chat = () => {
  // ... прежнее

  // Новое для тем/историй
  const [showTopics, setShowTopics] = useState(true);
  const [selectedHistory, setSelectedHistory] = useState(null);

  const handleTopicClick = (topic) => {
    setMessage(topic);
    setShowTopics(false);
  };
  const handleChatHistory = (chat) => {
    setSelectedHistory(chat.id);
    setChatHistory([{text: chat.title + ". " + chat.sub, sender: "user"}]);
    setShowTopics(false);
  };

  useEffect(() => { if (chatHistory.length > 0) setShowTopics(false); }, [chatHistory.length]);

  // ... остальные хуки/handlers

  if (showWelcome) {
    // ... ваш Welcome-экран полностью из кода выше!
  }

  // -- ЧАТ ЭКРАН --
  return (
    <div
      style={{
        background: "#f8fdff",
        width: "100vw",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column"
      }}
    >
      {/* Панель */}
      {/* ... как выше ... */}
      {showTopics && <ChatsHistoryBlock onSelect={handleChatHistory} />}
      {showTopics && <TopicsBlock onTopicClick={handleTopicClick}/>}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
        <div style={{ width: "100%", maxWidth: maxWidth, margin: "0 auto", padding: "80px 0 110px 0" }}>
          {chatHistory.map((msg, idx) => (
            <div
              key={idx}
              style={{
                textAlign: msg.sender === "user" ? "right" : "left",
                margin: "8px 20px"
              }}
            >
              {msg.sender === "user"
                ? <span style={{
                    background: GRADIENT,
                    padding: 10,
                    borderRadius: 16,
                    fontSize: 16
                  }}>{msg.text}</span>
                : splitBotTextTwoBlocks(msg.text).map((part, sIdx) => (
                  part.text && (
                    <div
                      key={sIdx}
                      style={{
                        background: "#f7fafd",
                        borderRadius: 12,
                        padding: "10px 15px",
                        marginBottom: sIdx === 0 ? 18 : 30,
                        color: NORA_COLOR,
                        fontSize: 16,
                        lineHeight: 1.7,
                        fontWeight: part.bold ? "bold" : "normal"
                      }}
                    >
                      {part.text}
                    </div>
                  )
                ))
              }
            </div>
          ))}
          {botProgress &&
            splitBotTextTwoBlocks(botProgress).map((part, sIdx) => (
              part.text && (
                <div
                  key={sIdx}
                  style={{
                    background: "#f7fafd",
                    borderRadius: 12,
                    padding: "10px 15px",
                    margin: "0 20px 10px 20px",
                    color: NORA_COLOR,
                    fontSize: 16,
                    lineHeight: 1.7,
                    fontWeight: part.bold ? "bold" : "normal"
                  }}
                >
                  {part.text}
                </div>
              )
            ))
          }
          <div ref={messagesEndRef} />
        </div>
      </div>
      <div style={{
        width: "calc(100% - 40px)",
        margin: "0 20px",
        display: "flex",
        alignItems: "center",
        boxSizing: "border-box",
        maxWidth: maxWidth,
        height: INPUT_BAR_HEIGHT,
        position: "fixed",
        left: 0,
        bottom: 25,
        background: "transparent",
        borderRadius: borderRadius,
        zIndex: 20,
        boxShadow: "none"
      }}>
        <input
          type="text"
          value={message}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={e => setMessage(e.target.value)}
          placeholder="Введите сообщение..."
          style={{
            flex: 1,
            height: 48,
            fontSize: "16px",
            borderRadius: borderRadius,
            borderWidth: focused ? 2 : 1,
            borderStyle: "solid",
            borderColor: focused ? "transparent" : "#e5e8ed",
            borderImage: focused ? GRADIENT + " 1" : undefined,
            padding: "0 18px",
            background: "#fff",
            color: NORA_COLOR,
            boxSizing: "border-box",
            marginRight: 8,
            transition: "border 0.22s"
          }}
          onKeyDown={e => { if (e.key === 'Enter') handleSendMessage(); }}
          disabled={loading || !!botProgress}
        />
        <button
          style={{
            width: 48,
            height: 48,
            background: BABY_GRADIENT,
            color: "#fff",
            border: "none",
            borderRadius: borderRadius,
            fontWeight: 700,
            fontSize: "17px",
            cursor: (loading || !!botProgress) ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 14px 0 rgba(155,175,205,0.12)"
          }}
          onClick={handleSendMessage}
          disabled={loading || !!botProgress}
        >
          <span style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            {ICONS.arrowRight}
          </span>
        </button>
      </div>
    </div>
  );
};

export default Chat;
