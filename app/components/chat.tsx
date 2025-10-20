"use client";
import React, { useState, useEffect, useRef } from "react";

// ... прежние константы (NORA_COLOR, ICONS, COLORS, BORDER, иконки, BENEFITS, REVIEWS) здесь не привожу ради чистоты. Используйте из последней вашей версии!

// Их вы уже видели выше — исправлять не нужно!

// Минималистичная иконка (замок) для “Политика конфиденциальности”
const IconLock = (
  <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><rect x="5" y="9" width="10" height="7" rx="2" stroke="#8a97a0" strokeWidth="1.6"/><path d="M7.8 9V7a2.2 2.2 0 1 1 4.4 0v2" stroke="#8a97a0" strokeWidth="1.6"/></svg>
);

// --- Готовые темы (советуемые вопросы)
const TOPICS = [
  {
    icon: "🤢",
    title: "Тошнота и токсикоз",
    desc: "Что реально помогает на ранних сроках?"
  },
  {
    icon: "🍏",
    title: "Питание при беременности",
    desc: "Какие продукты полезны, а чего избегать?"
  },
  {
    icon: "🤸‍♀️",
    title: "Фитнес и движение",
    desc: "Можно ли беременным заниматься спортом?"
  },
  {
    icon: "😔",
    title: "Эмоции и тревожность",
    desc: "Как справиться со страхами и стрессом?"
  },
  {
    icon: "💊",
    title: "Витамины",
    desc: "Что принимать, а что нет?"
  },
  {
    icon: "☕️",
    title: "Кофе и напитки",
    desc: "Можно ли пить кофе и чай?"
  },
];

const TopicsBlock = ({ onTopicClick }) => (
  <div
    style={{
      margin: "0 auto 24px auto",
      maxWidth: 560,
      width: "100%",
      display: "flex",
      flexWrap: "wrap",
      gap: "16px",
      justifyContent: "center"
    }}
  >
    {TOPICS.map((topic, idx) => (
      <button key={idx}
        style={{
          flex: "1 1 44%",
          minWidth: 162,
          maxWidth: 250,
          background: "#fff",
          border: "none",
          borderRadius: "18px",
          boxShadow: "0 2px 12px 0 rgba(150,180,220,0.07)",
          padding: "14px 14px 14px 14px",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          cursor: "pointer",
          transition: "box-shadow .13s",
          fontFamily: "'Manrope', Arial, Helvetica, sans-serif"
        }}
        onClick={() => onTopicClick(`${topic.title}. ${topic.desc}`)}
      >
        <div style={{fontSize: 24, marginBottom: 6}}>{topic.icon}</div>
        <div style={{fontWeight: 700, fontSize: 15, color: "#2e2e2e", marginBottom: 2}}>{topic.title}</div>
        <div style={{fontSize: 13, color: "#6c7689"}}>{topic.desc}</div>
      </button>
    ))}
  </div>
);

// --- История чата (фэйковая демо, для реальных нужна интеграция с API/localStorage)
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
    <div style={{
      display: "flex",
      flexDirection: "column",
      gap: 10
    }}>
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

// --- Новый блок "Что умеет Nora?" --- используйте из предыдущего ответа

// --- Footer (замок для политики)
const Footer = () => (
  <div
    style={{
      width: `calc(100% - 40px)`,
      maxWidth,
      margin: "0 auto",
      background: GRADIENT,
      borderRadius: "22px",
      boxShadow: "0 -4px 14px 0 rgba(155,175,205,0.06)",
      boxSizing: "border-box",
      fontFamily: "'Manrope', Arial, Helvetica, sans-serif",
      paddingLeft: 20,
      paddingRight: 20,
      paddingTop: 22,
      paddingBottom: 22,
      display: "flex",
      flexDirection: "column",
      gap: 18,
      alignItems: "center"
    }}
  >
    <div style={{
      fontSize: 12,
      color: "#263540",
      fontWeight: 600,
      textAlign: "center",
      width: "100%"
    }}>
      Ташкент, Юнусабадский район, массив Кашгар 26
    </div>
    <div style={{
      display: "flex",
      gap: 11,
      width: "100%",
      justifyContent: "center"
    }}>
      <a href="#" style={{
        background: "#fff",
        width: "63%",
        borderRadius: 13,
        color: "#495062",
        fontWeight: 400,
        fontSize: 14,
        padding: "9px 0",
        textDecoration: "none",
        textAlign: "center",
        border: "1px solid #e1e9f5",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 7,
        marginRight: 5
      }}>{IconPartner} Стать партнёром</a>
      <a href="#" style={{
        background: "#fff",
        width: "37%",
        borderRadius: 13,
        color: "#495062",
        fontWeight: 400,
        fontSize: 14,
        padding: "9px 0",
        textDecoration: "none",
        textAlign: "center",
        border: "1px solid #e1e9f5",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 7
      }}>{IconContact} Контакты</a>
    </div>
    <a href="#" style={{
      background: "#fff",
      padding: "7px 0",
      width: "100%",
      borderRadius: 14,
      color: "#556",
      fontWeight: 400,
      fontSize: 14,
      textDecoration: "none",
      border: "1px solid #e1e9f5",
      textAlign: "center",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 7
    }}>{IconLock} Политика конфиденциальности</a>
    <div style={{
      marginTop: 8,
      fontSize: 12,
      color: "#8a97a0",
      textAlign: "center",
      width: "100%"
    }}>
      © {new Date().getFullYear()} Nora Plus — забота и поддержка будущих мам
    </div>
  </div>
);

// --- Отступ после футера
const FooterGap = () => <div style={{height: 20}} />;

// ... splitBotTextTwoBlocks и основные переменные в точности как в ваших последних версиях

const Chat = () => {
  // ... прежний набор useState/useEffect — наполнение истории не показано выше для краткости

  // --- Для истории чата (выбор истории симулируется)
  const [selectedHistory, setSelectedHistory] = useState(null);

  // --- Для активации тем — показываются только если чат пуст или новый, иначе исчезают
  const [showTopics, setShowTopics] = useState(true);

  // При выборе темы — чат сразу получает этот “вопрос”
  const handleTopicClick = (topic) => {
    setMessage(topic);
    setShowTopics(false);
  };

  // При выборе истории чата — “имитируем возврат к истории” (в реальности замени на загрузку истории)
  const handleChatHistory = (chat) => {
    setSelectedHistory(chat.id);
    setChatHistory([{text: chat.title + '. ' + chat.sub, sender: "user"}]);
    setShowTopics(false);
  };

  // --- Логика "скрытия" тем после первого сообщения отправленного
  useEffect(() => {
    if (chatHistory.length > 0) setShowTopics(false);
  }, [chatHistory.length]);

  // ... остальная логика — sendMessageToGPT, handleSendMessage/handleShare и т.д.

  if (showWelcome) {
    // ... прежний welcome-экран ...
    // Оформлен фирменными стилями, как в вашем последнем коде
    // description заканчивается: “и слежу за самочувствием.”
    // WhatNoraDoesBlock (вместо WhyNoraBlock)
    // Остальной блок-верстка не копирую здесь ради компактности
  }

  // --- ЧАТ-ЭКРАН ---
  return (
    <div style={{
      background: "#f8fdff",
      width: "100vw",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column"
    }}>
      {/* Панель как обычно */}
      {/* ... */}
      {/* История чатов */}
      {showTopics && <ChatsHistoryBlock onSelect={handleChatHistory} />}
      {/* Темы для обсуждения */}
      {showTopics && <TopicsBlock onTopicClick={handleTopicClick}/>}
      {/* История сообщений */}
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
      {/* Поле input и кнопка */}
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
