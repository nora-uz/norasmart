"use client";
import React, { useState, useEffect, useRef } from "react";

const NORA_COLOR = "#2e2e2e";
const borderRadius = 22;
const maxWidth = 560;
const videoMaxWidth = 314;
const GRADIENT = "linear-gradient(90deg, #eff5fe 0%, #e5e8ed 100%)";
const BABY_GRADIENT = "linear-gradient(90deg, #e39290 0%, #efb1b6 100%)";
const INPUT_BAR_HEIGHT = 68;
const PANEL_SIDE_PADDING = 15;
const BLOCK_SIDE_PADDING = 10;
const CARD_GAP = 10;

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

const BENEFITS = [
  { emoji: "🩺", title: "Медицинская точность", text: "Советы основаны на рекомендациях британской службы NHS и адаптированы под ваш регион." },
  { emoji: "🤝", title: "Поддержка 24/7", text: "Ассистент всегда на связи для заботы и помощи в любой ситуации." },
  { emoji: "⏰", title: "Напоминания о важных делах", text: "Следим, чтобы вы ничего не забыли — анализы, витамины, визиты." },
  { emoji: "🔒", title: "Конфиденциальность", text: "Личные данные остаются только у вас — никакой передачи сторонним." },
  { emoji: "⚡️", title: "Быстрые решения", text: "Полезные советы и поддержка сразу, когда это нужно." },
];

// Исправленные отзывы — см. предыдущие версии (сократил для краткости)
const REVIEWS = [
  { name: "Анна", badge: "2 месяц беременности", problem: "Токсикоз", text: "Nora Plus подсказала, как справиться с утренней тошнотой. Благодаря рекомендациям по питанию и режиму дня симптомы стали гораздо легче." },
  // ... остальные отзывы ...
];

const TOPICS = [
  { emoji: "🤢", title: "Тошнота и токсикоз", desc: "Что помогает на ранних сроках?" },
  { emoji: "🍏", title: "Питание при беременности", desc: "Какие продукты полезны?" },
  { emoji: "🤸‍♀️", title: "Фитнес и движение", desc: "Можно ли беременным спорт?" },
  { emoji: "😔", title: "Эмоции и тревожность", desc: "Как справиться со страхами?" },
  { emoji: "💊", title: "Витамины", desc: "Что принимать, а что нет?" },
  { emoji: "☕️", title: "Кофе и напитки", desc: "Можно ли кофе и чай?" },
];

const TopicsBlock = ({ onTopicClick }) => (
  <div style={{
    margin: "0 auto 20px auto",
    maxWidth: 560,
    width: "100%",
    padding: "0 20px",
    display: "flex",
    flexDirection: "column",
    gap: 13
  }}>
    {TOPICS.map((topic, idx) => (
      <button
        key={idx}
        style={{
          width: "100%",
          background: "#fff",
          border: "none",
          borderRadius: 18,
          padding: "18px 16px 16px 18px",
          minHeight: 54,
          margin: 0,
          boxShadow: "0 2px 12px 0 rgba(150,180,220,0.09)",
          position: "relative",
          cursor: "pointer",
          textAlign: "left",
          transition: "box-shadow .12s"
        }}
        onClick={() => onTopicClick(`${topic.title}. ${topic.desc}`)}
      >
        <span style={{
          position: "absolute",
          right: 14,
          top: 12,
          fontSize: 54,
          opacity: 0.13,
          zIndex: 0,
          userSelect: "none",
          pointerEvents: "none"
        }}>{topic.emoji}</span>
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: NORA_COLOR, marginBottom: 2 }}>{topic.title}</div>
          <div style={{ fontSize: 13, color: "#778" }}>{topic.desc}</div>
        </div>
      </button>
    ))}
  </div>
);

const WhatNoraDoesBlock = () => (
  <div
    style={{
      width: `calc(100% - ${BLOCK_SIDE_PADDING * 2}px)`,
      maxWidth,
      margin: "0 auto 38px auto",
      background: GRADIENT,
      borderRadius: borderRadius,
      boxShadow: "0 6px 20px 0 rgba(150, 175, 205, 0.10)",
      boxSizing: "border-box",
      padding: 0,
      fontFamily: "'Manrope', Arial, Helvetica, sans-serif"
    }}
  >
    <div style={{ padding: `21px 0 20px 0` }}>
      <div style={{
        fontWeight: 700,
        fontSize: "20px",
        color: NORA_COLOR,
        marginBottom: 20,
        textAlign: "center"
      }}>
        Что умеет Nora?
      </div>
      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: CARD_GAP,
        padding: `0 ${BLOCK_SIDE_PADDING}px`
      }}>
        {BENEFITS.map(({ emoji, title, text }, idx) => (
          <div
            key={idx}
            style={{
              position: "relative",
              background: "#fff",
              borderRadius: 18,
              boxShadow: "0 2px 18px 0 rgba(150,180,220,0.07)",
              padding: "19px 15px 19px 15px",
              overflow: "hidden",
              minHeight: 56,
              textAlign: "left"
            }}
          >
            <span
              style={{
                position: "absolute",
                right: 12,
                top: 14,
                fontSize: 62,
                opacity: 0.14,
                pointerEvents: "none",
                userSelect: "none",
                lineHeight: 1,
                zIndex: 0,
              }}
              aria-hidden="true"
            >
              {emoji}
            </span>
            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 16, color: NORA_COLOR, marginBottom: 7, textAlign: "left" }}>
                {title}
              </div>
              <div style={{ fontSize: 13, color: "#3a3a3a", lineHeight: "1.64", textAlign: "left" }}>
                {text}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ReviewBlock, Footer, splitBotTextTwoBlocks — можно взять из вашего предыдущего файла без изменений.

const Chat = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);

  const [showTopics, setShowTopics] = useState(true);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (chatHistory.length > 0) setShowTopics(false);
  }, [chatHistory.length]);

  const handleTopicClick = (topic) => {
    setMessage(topic);
    setShowTopics(false);
  };

  const handleSendMessage = () => {
    if (message.trim() && !loading) {
      setChatHistory(prev => [...prev, {text: message, sender: "user"}]);
      setMessage("");
      setShowTopics(false);
    }
  };

  // Welcome-экран
  if (showWelcome) {
    return (
      <div style={{
        fontFamily: "'Manrope', Arial, Helvetica, sans-serif",
        background: "#f8fdff",
        width: "100vw",
        minHeight: "100vh"
      }}>
        {/* Здесь ваша панель, видео, заголовок и описание, кнопка "Начать", блок "Что умеет Nora", отзывы, футер */}
        <div style={{
          width: `calc(100% - ${BLOCK_SIDE_PADDING * 2}px)`,
          maxWidth,
          textAlign: "center",
          margin: "0 auto"
        }}>
          <div style={{
            fontWeight: 700, fontSize: "22px", color: NORA_COLOR, marginBottom: 14
          }}>Ждёте малыша? Я помогу!</div>
          <div style={{
            fontWeight: 400, fontSize: "15px", margin: "0 auto 0 auto", maxWidth: 400,
            padding: "0 18px",
            lineHeight: 1.75, color: NORA_COLOR, display: "inline-block"
          }}>
            Я помогаю будущим мамам на каждом этапе беременности: отвечаю на вопросы, напоминаю о важных делах и слежу за самочувствием.
          </div>
          <div style={{ height: 40 }} />
          <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
            <div style={{ width: "100%", textAlign: "center" }}>
              <button
                style={{
                  width: "100%", maxWidth: 290,
                  background: BABY_GRADIENT,
                  color: "#fff",
                  border: "none",
                  borderRadius: borderRadius,
                  fontWeight: 700,
                  fontSize: "17px",
                  padding: "15px 0",
                  margin: "0 auto",
                  cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 2px 18px 0 rgba(200, 128, 140, 0.09)"
                }}
                onClick={() => setShowWelcome(false)}
              >
                Начать пользоваться&nbsp;
                <span style={{ marginLeft: 8, display: "flex", alignItems: "center" }}>{ICONS.arrowRight}</span>
              </button>
              <div style={{ height: 13 }} />
              <div style={{ fontSize: 13, color: "#7c8792" }}>
                Попробуйте — это быстро и бесплатно
              </div>
            </div>
          </div>
          <div style={{ height: 40 }} />
          <WhatNoraDoesBlock />
          {/* ReviewBlock, Footer — вставьте как в вашем проекте */}
        </div>
      </div>
    );
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
      {/* Панель ... */}
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
              <span style={{
                background: msg.sender === "user" ? GRADIENT : "#f7fafd",
                padding: 10,
                borderRadius: 16,
                fontSize: 16
              }}>{msg.text}</span>
            </div>
          ))}
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
          disabled={loading}
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
            cursor: loading ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 14px 0 rgba(155,175,205,0.12)"
          }}
          onClick={handleSendMessage}
          disabled={loading}
        >
          <span style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            {ICONS.arrowRight}
          </span>
        </button>
      </div>
      {/* Footer — вставьте как в вашем проекте */}
    </div>
  );
};

export default Chat;
