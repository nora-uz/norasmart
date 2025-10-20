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
    <circle cx="10" cy="6.5" r="3.3" stroke="#5a6573" strokeWidth="1.5" />
    <path d="M2.8 16c.9-2.5 3.4-4.2 7.2-4.2s6.2 1.7 7.2 4.2" stroke="#5a6573" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const IconContact = (
  <svg width="18" height="18" fill="none" viewBox="0 0 20 20">
    <rect x="2.8" y="3.5" width="14.4" height="11" rx="2.2" stroke="#5a6573" strokeWidth="1.5" />
    <path d="M3.5 4l6.5 6.1c.3.2.8.2 1.1 0L17 4" stroke="#5a6573" strokeWidth="1.5" />
  </svg>
);

const IconLock = (
  <svg width="16" height="16" fill="none" viewBox="0 0 20 20"><rect x="5" y="9" width="10" height="7" rx="2" stroke="#8a97a0" strokeWidth="1.6" /><path d="M7.8 9V7a2.2 2.2 0 1 1 4.4 0v2" stroke="#8a97a0" strokeWidth="1.6" /></svg>
);

const ICONS = {
  telegram: "https://cdn-icons-png.flaticon.com/512/1946/1946547.png",
  trash: "https://cdn-icons-png.flaticon.com/512/1345/1345823.png",
  share: "https://cdn-icons-png.flaticon.com/512/535/535285.png",
  arrowRight: (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path d="M6 11H16M16 11L12 7M16 11L12 15"
        stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};
const filterNora = "invert(13%) sepia(4%) saturate(271%) hue-rotate(175deg) brightness(92%) contrast(93%)";

const BENEFITS = [
  { emoji: "🩺", title: "Медицинская точность", text: "Советы основаны на рекомендациях британской службы NHS и адаптированы под ваш регион." },
  { emoji: "🤝", title: "Поддержка 24/7", text: "Ассистент всегда на связи для заботы и помощи в любой ситуации." },
  { emoji: "⏰", title: "Напоминания о важных делах", text: "Следим, чтобы вы ничего не забыли — анализы, витамины, визиты." },
  { emoji: "🔒", title: "Конфиденциальность", text: "Личные данные остаются только у вас — никакой передачи сторонним." },
  { emoji: "⚡️", title: "Быстрые решения", text: "Полезные советы и поддержка сразу, когда это нужно." },
];

const REVIEWS = [
  { name: "Анна", badge: "2 месяц беременности", problem: "Токсикоз", text: "Nora Plus подсказала, как справиться с утренней тошнотой. Благодаря рекомендациям по питанию и режиму дня симптомы стали гораздо легче." },
  { name: "Дилноза", badge: "3 месяц беременности", problem: "Тошнота", text: "Советы Nora Plus помогли справиться с тошнотой и легче переносить беременность. Все подсказки приходят вовремя." },
  { name: "Елена", badge: "4 месяц беременности", problem: "Слабость и усталость", text: "Теперь я знаю, какие витамины нужно пить, сколько отдыхать и как выстроить день. Чувствую себя значительно лучше!" },
  { name: "Шахноза", badge: "5 месяц беременности", problem: "Плохое настроение", text: "Благодаря мотивационным словам и советам Nora Plus моё настроение заметно улучшилось." },
  { name: "Ирина", badge: "5 месяц беременности", problem: "Тревожность", text: "Советы Nora Plus помогли мне больше отдыхать, заботиться о себе и избавиться от лишних переживаний за малыша." },
  { name: "Мария", badge: "7 месяц беременности", problem: "Бессонница", text: "Благодаря советам Nora Plus я стала лучше спать и спокойно жду появления малыша." },
  { name: "Виктория", badge: "3 месяц беременности", problem: "Страхи", text: "Nora Plus помогла справиться с тревогами и поддержала советами, теперь я чувствую себя увереннее." },
  { name: "Екатерина", badge: "6 месяц беременности", problem: "Питание", text: "Ассистент напомнил о важных витаминах и правильном режиме, теперь питаюсь грамотно и чувствую себя энергичной." },
  { name: "Гульнора", badge: "2 месяц беременности", problem: "Нарушение сна", text: "Проконсультировавшись с Nora, я восстановила сон и теперь хорошо встречаю утро." },
  { name: "Малика", badge: "8 месяц беременности", problem: "Раздражительность", text: "Во время беременности стала нервной, но советы от Nora помогли и настроение улучшилось." },
  { name: "Лола", badge: "4 месяц беременности", problem: "Недостаток белка", text: "Советы по питанию очень полезные, теперь у меня больше энергии." }
];

const TOPICS = [
  { emoji: "🤢", title: "Тошнота и токсикоз", desc: "Что помогает на ранних сроках?" },
  { emoji: "🍏", title: "Питание при беременности", desc: "Какие продукты полезны?" },
  { emoji: "🤸‍♀️", title: "Фитнес и движение", desc: "Можно ли беременным спорт?" },
  { emoji: "😔", title: "Эмоции и тревожность", desc: "Как справиться со страхами?" },
  { emoji: "💊", title: "Витамины", desc: "Что принимать, а что нет?" },
  { emoji: "☕️", title: "Кофе и напитки", desc: "Можно ли кофе и чай?" },
];

const splitBotTextTwoBlocks = (text) => {
  if (!text) return [];
  let cleaned = text.replace(/[*_]/g, "");
  const match = cleaned.match(/^([^.!?]+[.!?])\s*(.*)$/s);
  if (match) {
    const first = match[1].trim();
    const rest = match[2].trim();
    return [
      { text: first, bold: true },
      { text: rest, bold: false }
    ];
  } else {
    return [{ text: cleaned, bold: true }];
  }
};


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


const ReviewBlock = () => (
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
    <div style={{ padding: "21px 0 20px 0" }}>
      <div style={{
        fontWeight: 700,
        fontSize: "20px",
        color: NORA_COLOR,
        marginBottom: 20,
        textAlign: "center"
      }}>
        Отзывы будущих мам
      </div>
      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: CARD_GAP,
        padding: `0 ${BLOCK_SIDE_PADDING}px`
      }}>
        {REVIEWS.map(({ name, badge, problem, text }, idx) => (
          <div
            key={idx}
            style={{
              background: "#fff",
              borderRadius: 18,
              boxShadow: "0 2px 18px 0 rgba(150,180,220,0.07)",
              padding: "19px 15px 19px 15px",
              overflow: "hidden",
              textAlign: "left"
            }}
          >
            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 7 }}>
                <span style={{
                  fontWeight: 700, fontSize: 15, color: "#222"
                }}>
                  {name}
                </span>
                <span style={{
                  fontWeight: 500, fontSize: 13, color: "#1681f5",
                  padding: "4px 9px", borderRadius: 12, background: "#f3f7fe", whiteSpace: "nowrap"
                }}>
                  {badge}
                </span>
              </div>
              <div style={{ fontWeight: 500, fontSize: 13, color: "#acb5bd", marginBottom: 9 }}>
                {problem}
              </div>
              <div style={{ fontSize: 13, color: "#3a3a3a", lineHeight: "1.64" }}>
                {text}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

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

const Chat = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);
  const [showTopics, setShowTopics] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (chatHistory.length > 0) setShowTopics(false);
  }, [chatHistory.length]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory]);

  const handleTopicClick = (topic) => {
    setMessage(topic);
    setShowTopics(false);
  };

  const handleSendMessage = () => {
    if (message.trim() && !loading) {
      setChatHistory(prev => [...prev, { text: message, sender: "user" }]);
      setMessage("");
      setShowTopics(false);
    }
  };

  const handleStart = () => {
    setShowWelcome(false);
    setShowTopics(true);
    setChatHistory([]);
    setMessage("");
  };

  if (showWelcome) {
    return (
      <div style={{
        fontFamily: "'Manrope', Arial, Helvetica, sans-serif",
        background: "#f8fdff",
        width: "100vw",
        minHeight: "100vh"
      }}>
        {/* Панель */}
        {/* ... добавьте сюда вашу панель и видео как раньше ... */}
        <div style={{
          width: `calc(100% - ${BLOCK_SIDE_PADDING * 2}px)`,
          maxWidth,
          textAlign: "center",
          margin: "0 auto"
        }}>
          <div style={{ fontWeight: 700, fontSize: "22px", color: NORA_COLOR, marginBottom: 14 }}>
            Ждёте малыша? Я помогу!
          </div>
          <div style={{
            fontWeight: 400, fontSize: "15px", margin: "0 auto 0 auto", maxWidth: 400,
            padding: "0 18px",
            lineHeight: 1.75, color: NORA_COLOR, display: "inline-block"
          }}>
            Я помогаю будущим мамам на каждом этапе беременности: отвечаю на вопросы, напоминаю о важных делах и слежу за самочувствием.
          </div>
          <div style={{ height: 40 }} />
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
              margin: "0 auto 10px auto",
              cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 2px 18px 0 rgba(200, 128, 140, 0.09)"
            }}
            onClick={handleStart}
          >
            Начать пользоваться&nbsp;
            <span style={{ marginLeft: 8, display: "flex", alignItems: "center" }}>{ICONS.arrowRight}</span>
          </button>
          <div style={{ fontSize: 13, color: "#7c8792", marginBottom: 40 }}>
            Попробуйте — это быстро и бесплатно
          </div>
          <WhatNoraDoesBlock />
          <ReviewBlock />
          <Footer />
          <div style={{ height: 20 }} />
        </div>
      </div>
    );
  }

  return (
    <div style={{
      background: "#f8fdff",
      width: "100vw",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column"
    }}>
      {/* Панель как обычно */}
      {/* Готовые темы */}
      {showTopics && <TopicsBlock onTopicClick={handleTopicClick} />}
      {/* История чата */}
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
                fontSize: 16,
                display: "inline-block",
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
      <Footer />
    </div>
  );
};

export default Chat;
