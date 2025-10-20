"use client";
import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";

const NORA_COLOR = "#2e2e2e";
const ICON_SIZE = 23;
const borderRadius = 22;
const panelHeight = 62;
const maxWidth = 560;
const videoMaxWidth = 314;
const GRADIENT = "linear-gradient(90deg, #eff5fe 0%, #e5e8ed 100%)";
const INPUT_BAR_HEIGHT = 68;

// отступы — панель 15px, все блоки 10px, gap 10px
const PANEL_SIDE_PADDING = 15;
const BLOCK_SIDE_PADDING = 10;
const CARD_GAP = 10;

const ICONS = {
  telegram: "https://cdn-icons-png.flaticon.com/512/1946/1946547.png",
  trash: "https://cdn-icons-png.flaticon.com/512/1345/1345823.png",
  share: "https://cdn-icons-png.flaticon.com/512/535/535285.png",
  arrowRight: (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path d="M6 11H16M16 11L12 7M16 11L12 15"
        stroke={NORA_COLOR} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
};
const filterNora = "invert(13%) sepia(4%) saturate(271%) hue-rotate(175deg) brightness(92%) contrast(93%)";

function splitBotTextTwoBlocks(text) {
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
}

const BENEFITS = [
  { emoji: "🩺", title: "Медицинская точность", text: "Советы основаны на рекомендациях британской службы NHS и адаптированы под ваш регион." },
  { emoji: "🤝", title: "Поддержка 24/7", text: "Ассистент всегда на связи для заботы и помощи в любой ситуации." },
  { emoji: "⏰", title: "Напоминания о важных делах", text: "Следим, чтобы вы ничего не забыли — анализы, витамины, визиты." },
  { emoji: "🔒", title: "Конфиденциальность", text: "Личные данные остаются только у вас — никакой передачи сторонним." },
  { emoji: "⚡️", title: "Быстрые решения", text: "Полезные советы и поддержка сразу, когда это нужно." },
];

const WhyNoraBlock = () => (
  <div
    style={{
      width: `calc(100% - ${BLOCK_SIDE_PADDING * 2}px)`,
      maxWidth,
      margin: "0 auto 38px auto",
      background: GRADIENT,
      borderRadius: borderRadius,
      boxShadow: "0 6px 20px 0 rgba(150, 175, 205, 0.10)",
      boxSizing: "border-box",
      padding: 0
    }}
  >
    <div style={{ padding: `21px 0 20px 0` }}>
      <div
        style={{
          fontWeight: 700,
          fontSize: "20px",
          color: NORA_COLOR,
          marginBottom: 20,
          textAlign: "center"
        }}
      >
        Почему Nora Plus?
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

const PREGNANT_EMOJI = "🤰";
const REVIEWS = [
  { name: "Анна", pregnancy: "2 месяц", problem: "Токсикоз", text: "Nora Plus подсказала, как справиться с утренней тошнотой. Питание стало более сбалансированным и легче переносить симптомы." },
  { name: "Dilnoza", pregnancy: "3 oy", problem: "Ko'ngil aynиши", text: "Nora maslahatlari ko'ngil aynиши va ahволни yengil o'tказиш учун ёрдам берди. O'z vaqtida maslahat olаман." },
  { name: "Елена", pregnancy: "4 месяц", problem: "Слабость и усталость", text: "Рекомендации по витаминам и сну очень помогли, чувствую себя намного лучше!" },
  { name: "Shahnoza", pregnancy: "5 oy", problem: "Hafsalasi pastlik", text: "Nora Plus motivatsiya ва ижобий maslahatларни ўз вақтда беради. Ўзимни яхши хис қила бошладим." },
  { name: "Ирина", pregnancy: "5 месяц", problem: "Тревожность", text: "Советы от Nora Plus помогли мне расслабиться и больше отдыхать. Теперь спокойна за малыша." }
];

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
    }}
  >
    <div style={{ padding: "21px 0 20px 0" }}>
      <div
        style={{
          fontWeight: 700,
          fontSize: "20px",
          color: NORA_COLOR,
          marginBottom: 20,
          textAlign: "center"
        }}
      >
        Отзывы будущих мам
      </div>
      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: CARD_GAP,
        padding: `0 ${BLOCK_SIDE_PADDING}px`
      }}>
        {REVIEWS.map(({ name, pregnancy, problem, text }, idx) => (
          <div
            key={idx}
            style={{
              position: "relative",
              background: "#fff",
              borderRadius: 18,
              boxShadow: "0 2px 18px 0 rgba(150,180,220,0.07)",
              padding: "19px 15px 19px 15px",
              overflow: "hidden",
              textAlign: "left"
            }}
          >
            <span
              style={{
                position: "absolute",
                right: 14,
                top: 18,
                fontSize: 62,
                opacity: 0.14,
                pointerEvents: "none",
                userSelect: "none",
                lineHeight: 1,
                zIndex: 0,
              }}
              aria-hidden="true"
            >
              {PREGNANT_EMOJI}
            </span>
            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: "#222", marginBottom: 7 }}>
                {name} — {pregnancy}
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

const THREAD_KEY = "nora_thread_id";

const Chat = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [preloading, setPreloading] = useState(true);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [threadId, setThreadId] = useState(null);
  const [botProgress, setBotProgress] = useState("");
  const [isMobile, setIsMobile] = useState(true);
  const [focused, setFocused] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    function checkScreen() {
      if (typeof window !== "undefined") {
        setIsMobile(window.innerWidth <= 640);
      }
    }
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);
  useEffect(() => {
    const saved = window.localStorage.getItem(THREAD_KEY);
    if (saved) setThreadId(saved);
  }, []);
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = "auto"; };
  }, []);
  useEffect(() => {
    const timer = setTimeout(() => setPreloading(false), 1000);
    return () => clearTimeout(timer);
  }, []);
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory, botProgress]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Nora Plus — Ассистент для будущих мам",
        text: "Современный ассистент для будущих мам на базе NHS — все рекомендации по беременности в одном месте.",
        url: window.location.href
      });
    } else {
      alert("Ваш браузер не поддерживает Web Share API");
    }
  };

  const sendMessageToGPT = async (text) => {
    setLoading(true);
    const newHistory = [...chatHistory, { text, sender: "user" }];
    setChatHistory(newHistory);
    setBotProgress("");
    try {
      const res = await fetch("/api/gpt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newHistory, thread_id: threadId }),
      });
      const data = await res.json();
      if (data.thread_id) {
        setThreadId(data.thread_id);
        window.localStorage.setItem(THREAD_KEY, data.thread_id);
      }
      let botReply = data.reply;
      if (res.status !== 200 || !botReply) {
        botReply = data.error 
          ? (typeof data.error === 'string'
              ? `Ошибка сервера: ${data.error}`
              : `Ассистент не ответил (ошибка сервера)`)
          : "Извините, нет ответа от ассистента.";
      }
      let i = 0;
      setBotProgress("");
      const interval = setInterval(() => {
        setBotProgress(botReply.slice(0, i));
        i++;
        if (i > botReply.length) {
          clearInterval(interval);
          setChatHistory(prev => [...prev, { text: botReply, sender: "bot" }]);
          setBotProgress("");
          setLoading(false);
        }
      }, 18);
    } catch (error) {
      setChatHistory(prev => [...prev, { text: "Ошибка: не удалось получить ответ.", sender: "bot" }]);
      setLoading(false);
      setBotProgress("");
    }
  };

  const handleSendMessage = () => {
    if (message.trim() && !loading && !botProgress) {
      sendMessageToGPT(message.trim());
      setMessage("");
    }
  };

  const clearChatAll = () => {
    setChatHistory([]);
    setThreadId(null);
    window.localStorage.removeItem(THREAD_KEY);
    setShowWelcome(true);
    setBotProgress("");
  };

  // --- Welcome экран ---
  if (showWelcome) {
    return (
      <div style={{
        background: "#f8fdff",
        width: "100vw",
        minHeight: "100vh"
      }}>
        {/* Панель */}
        <div style={{
          width: `calc(100% - ${PANEL_SIDE_PADDING * 2}px)`,
          maxWidth,
          minHeight: panelHeight,
          background: GRADIENT,
          color: NORA_COLOR,
          margin: "20px auto 0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderRadius: borderRadius,
          paddingLeft: PANEL_SIDE_PADDING, paddingRight: PANEL_SIDE_PADDING, paddingTop: 5, paddingBottom: 5,
          boxSizing: "border-box", zIndex: 1
        }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", flex: 1, paddingLeft: 5 }}>
            <span style={{
              fontWeight: 800, fontSize: "19px", lineHeight: 1.06, whiteSpace: "nowrap", marginBottom: 7
            }}>
              Nora Plus
            </span>
            <span style={{
              fontWeight: 400, fontSize: "13px", color: "#565656", lineHeight: 1.04, whiteSpace: "nowrap"
            }}>
              Ассистент для будущих мам
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: 16 }}>
            <button style={{
              background: "transparent", border: "none", cursor: "pointer",
              width: 38, height: 38, borderRadius: 19,
              display: "flex", alignItems: "center", justifyContent: "center"
            }} onClick={handleShare}>
              <img src={ICONS.share} alt="Share"
                style={{ width: ICON_SIZE, height: ICON_SIZE, filter: filterNora }} />
            </button>
            <button style={{
              background: "transparent", border: "none", cursor: "pointer",
              width: 38, height: 38, borderRadius: 19,
              display: "flex", alignItems: "center", justifyContent: "center"
            }} onClick={() => window.open("https://t.me/norasmart", "_blank")}>
              <img src={ICONS.telegram} alt="Telegram"
                style={{ width: ICON_SIZE, height: ICON_SIZE, filter: filterNora }} />
            </button>
            <button style={{
              background: "transparent", border: "none", cursor: "pointer",
              width: 38, height: 38, borderRadius: 19,
              display: "flex", alignItems: "center", justifyContent: "center"
            }} onClick={clearChatAll}>
              <img src={ICONS.trash} alt="Trash"
                style={{ width: ICON_SIZE, height: ICON_SIZE, filter: filterNora }} />
            </button>
          </div>
        </div>

        <div style={{ height: 20 }} />
        <div style={{ height: 20 }} />

        {/* Видео */}
        <div
          style={{
            width: "100%",
            maxWidth: maxWidth,
            margin: "0 auto",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <video
            src="/nora.mp4"
            style={{
              width: "100%",
              maxWidth: videoMaxWidth,
              display: "block",
              borderRadius: 24
            }}
            autoPlay
            playsInline
            muted
            loop
            preload="auto"
          />
        </div>
        <div style={{ height: 20 }} />
        <div style={{ height: 20 }} />

        {/* Заголовок и описание */}
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
            Я помогаю будущим мамам на каждом этапе беременности: отвечаю на вопросы, напоминаю о важных делах, слежу за самочувствием и даю советы, основанные на медицине Великобритании NHS.
          </div>
          <div style={{ height: 40 }} />
          <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
            <button
              style={{
                width: "100%", maxWidth: 290, background: GRADIENT, color: NORA_COLOR,
                border: "none", borderRadius: borderRadius, fontWeight: 700, fontSize: "17px",
                padding: "15px 0", margin: `0 ${BLOCK_SIDE_PADDING}px`, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center"
              }}
              onClick={() => setShowWelcome(false)}
            >
              Начать пользоваться&nbsp;
              <span style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                {ICONS.arrowRight}
              </span>
            </button>
          </div>
          <div style={{ height: 40 }} />

          <WhyNoraBlock />
          <ReviewBlock />
        </div>
      </div>
    );
  }

  // --- Чат-экран ---
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
      <div style={{
        width: `calc(100% - ${PANEL_SIDE_PADDING * 2}px)`,
        maxWidth,
        minHeight: panelHeight,
        background: GRADIENT,
        color: NORA_COLOR,
        margin: "20px auto 0 auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderRadius: borderRadius,
        paddingLeft: PANEL_SIDE_PADDING, paddingRight: PANEL_SIDE_PADDING, paddingTop: 5, paddingBottom: 5,
        boxSizing: "border-box", zIndex: 1
      }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", flex: 1, paddingLeft: 5 }}>
          <span style={{
            fontWeight: 800, fontSize: "19px", lineHeight: 1.06, whiteSpace: "nowrap", marginBottom: 7
          }}>
            Nora Plus
          </span>
          <span style={{
            fontWeight: 400, fontSize: "13px", color: "#565656", lineHeight: 1.04, whiteSpace: "nowrap"
          }}>
            Ассистент для будущих мам
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: 16 }}>
          <button style={{
            background: "transparent", border: "none", cursor: "pointer",
            width: 38, height: 38, borderRadius: 19,
            display: "flex", alignItems: "center", justifyContent: "center"
          }} onClick={handleShare}>
            <img src={ICONS.share} alt="Share"
              style={{ width: ICON_SIZE, height: ICON_SIZE, filter: filterNora }} />
          </button>
          <button style={{
            background: "transparent", border: "none", cursor: "pointer",
            width: 38, height: 38, borderRadius: 19,
            display: "flex", alignItems: "center", justifyContent: "center"
          }} onClick={() => window.open("https://t.me/norasmart", "_blank")}>
            <img src={ICONS.telegram} alt="Telegram"
              style={{ width: ICON_SIZE, height: ICON_SIZE, filter: filterNora }} />
          </button>
          <button style={{
            background: "transparent", border: "none", cursor: "pointer",
            width: 38, height: 38, borderRadius: 19,
            display: "flex", alignItems: "center", justifyContent: "center"
          }} onClick={clearChatAll}>
            <img src={ICONS.trash} alt="Trash"
              style={{ width: ICON_SIZE, height: ICON_SIZE, filter: filterNora }} />
          </button>
        </div>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
        <div style={{ width: "100%", maxWidth: maxWidth, margin: "0 auto", padding: "80px 0 110px 0" }}>
          {chatHistory.map((msg, idx) => (
            <div
              key={idx}
              style={{
                textAlign: msg.sender === "user" ? "right" : "left",
                margin: `8px ${BLOCK_SIDE_PADDING}px`
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
                    margin: `0 ${BLOCK_SIDE_PADDING}px 10px ${BLOCK_SIDE_PADDING}px`,
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
        width: `calc(100% - ${PANEL_SIDE_PADDING * 2}px)`,
        margin: `0 ${PANEL_SIDE_PADDING}px`,
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
            background: GRADIENT,
            color: NORA_COLOR,
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
