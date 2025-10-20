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
  shield: (
    <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><path stroke="#e39290" strokeWidth="1.5" d="M10 17.5c-5.5-1-8-3.1-8-7.2V4.2c0-1 .5-1.5 1.6-1.6C5.3 2.2 7.6 2 10 2.2c2.4-.2 4.7 0 6.4.4C17.5 2.7 18 3.2 18 4.2v6.1c0 4.1-2.5 6.19-8 7.2Z"></path></svg>
  ),
  check: (
    <svg width="18" height="18" fill="none" viewBox="0 0 20 20"><path d="M5 10l4 4 6-6" stroke="#e39290" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
  ),
  clock: (
    <svg width="18" height="18" fill="none" viewBox="0 0 20 20"><circle cx="10" cy="10" r="8" stroke="#e39290" strokeWidth="1.5"/><path d="M10 6v4l2 2" stroke="#e39290" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
  ),
  doc: (
    <svg width="18" height="18" fill="none" viewBox="0 0 20 20"><rect x="4" y="4" width="12" height="12" rx="3" stroke="#e39290" strokeWidth="1.5"/><path d="M8 8h4M8 12h2" stroke="#e39290" strokeWidth="1.5" strokeLinecap="round"/></svg>
  ),
  support: (
    <svg width="18" height="18" fill="none" viewBox="0 0 20 20"><circle cx="10" cy="7" r="3.5" stroke="#e39290" strokeWidth="1.5"/><path d="M5 15.5a5 5 0 0 1 10 0" stroke="#e39290" strokeWidth="1.5"/></svg>
  )
};
const filterNora = "invert(13%) sepia(4%) saturate(271%) hue-rotate(175deg) brightness(92%) contrast(93%)";

// -------------------- Уникальные блоки -------------------------

const TopBullets = () => (
  <div style={{
    margin: "0 auto",
    maxWidth,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 18
  }}>
    <div style={{ display: "flex", gap: 22, width: "100%", justifyContent: "center" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
        {ICONS.check}
        <span style={{ color: "#8e456c", fontWeight: 600, fontSize: 15 }}>Советы врачей</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
        {ICONS.clock}
        <span style={{ color: "#8e456c", fontWeight: 600, fontSize: 15 }}>Ответ 24/7</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
        {ICONS.shield}
        <span style={{ color: "#8e456c", fontWeight: 600, fontSize: 15 }}>100% конфиденциально</span>
      </div>
    </div>
  </div>
);

const HowWorks = () => (
  <div style={{
    background: "#fff",
    width: `calc(100% - 30px)`,
    maxWidth,
    margin: "40px auto 42px auto",
    padding: "24px 0 14px 0",
    borderRadius: 22,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    boxShadow: "0 6px 20px 0 rgba(150, 175, 205, 0.09)"
  }}>
    <div style={{ fontWeight: 700, fontSize: "20px", color: NORA_COLOR, marginBottom: 18 }}>Как работает сервис?</div>
    <div style={{
      display: "flex",
      flexDirection: "column",
      gap: 18,
      width: "100%",
      maxWidth: 390
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
        <span style={{
          fontWeight: 600, color: "#e39290", fontSize: 23
        }}>1</span>
        <span style={{
          color: "#2e2e2e", fontWeight: 600, fontSize: 15
        }}>Начните чат — я всегда онлайн 👋</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
        <span style={{
          fontWeight: 600, color: "#e39290", fontSize: 23
        }}>2</span>
        <span style={{
          color: "#2e2e2e", fontWeight: 600, fontSize: 15
        }}>Задайте вопрос — получите быстрый и персональный совет</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
        <span style={{
          fontWeight: 600, color: "#e39290", fontSize: 23
        }}>3</span>
        <span style={{
          color: "#2e2e2e", fontWeight: 600, fontSize: 15
        }}>Я напомню о приёме витаминов, анализах, визитах к врачу и важных моментах — всё в одном месте!</span>
      </div>
    </div>
  </div>
);

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
        Почему выбирают Nora Plus?
      </div>
      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: CARD_GAP,
        padding: `0 ${BLOCK_SIDE_PADDING}px`
      }}>
        {[
          { icon: ICONS.check, title: "Только проверенные советы", text: "Все рекомендации соответствуют международным и локальным медицинским стандартам." },
          { icon: ICONS.support, title: "24/7 поддержка в любом вопросе", text: "Можно спросить всё, что волнует — от рациона до эмоций и самочувствия." },
          { icon: ICONS.clock, title: "Быстрая помощь", text: "Чат-ассистент отвечает мгновенно — не надо ждать приёма или искать врачей." },
          { icon: ICONS.shield, title: "Конфиденциальность и приватность", text: "Никаких данных не передаём, всё только у вас!" }
        ].map(({ icon, title, text }, idx) => (
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
              textAlign: "left",
              display: "flex",
              gap: 16,
              alignItems: "center"
            }}
          >
            <span style={{ fontSize: 30 }}>{icon}</span>
            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 16, color: NORA_COLOR, marginBottom: 7 }}>
                {title}
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

// направленные отзывы с фото и деталями
const REVIEWS = [
  {
    name: "Анна",
    city: "Ташкент",
    stage: "4-й месяц",
    img: "/photos/anna.jpg",
    text: "Только здесь мне реально помогли с тревожностью во время беременности и напомнили о витаминках — теперь сплю спокойно."
  },
  {
    name: "Дилноза",
    city: "Самарканд",
    stage: "3-й месяц",
    img: "/photos/dilnoza.jpg",
    text: "Врачей не дозвонишься, а тут — всё чётко, быстро и без лишних советов бабушек."
  },
  {
    name: "Виктория",
    city: "Нукус",
    stage: "6-й месяц",
    img: "/photos/viktoria.jpg",
    text: "Всем советую! Подсказали очень актуальные вещи — и главное, всё бесплатно и я точно спокойна за конфиденциальность."
  }
];

const ReviewBlock = () => (
  <div
    style={{
      width: `calc(100% - ${BLOCK_SIDE_PADDING * 2}px)`,
      maxWidth,
      margin: "0 auto 36px auto",
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
        marginBottom: 16,
        textAlign: "center"
      }}>
        Отзывы будущих мам
      </div>
      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: 16,
        padding: `0 ${BLOCK_SIDE_PADDING}px`
      }}>
        {REVIEWS.map((r, idx) => (
          <div
            key={idx}
            style={{
              background: "#fff",
              borderRadius: 18,
              boxShadow: "0 2px 18px 0 rgba(150,180,220,0.07)",
              padding: "19px 15px 19px 15px",
              textAlign: "left",
              display: "flex",
              alignItems: "center",
              gap: 19
            }}
          >
            <img alt={r.name} src={r.img} width={54} height={54}
              style={{
                borderRadius: "50%",
                objectFit: "cover",
                minWidth: 54, minHeight: 54,
                border: "2.5px solid #efb1b6",
                boxShadow: "0 2px 10px 0 #e3929039"
              }} />
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, color: "#222", marginBottom: 3 }}>{r.name}, {r.city} <span style={{ color: "#acb5bd", fontWeight: 400 }}>({r.stage})</span></div>
              <div style={{ fontSize: 13, color: "#3a3a3a", lineHeight: "1.57" }}>{r.text}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const PrivacyBlock = () => (
  <div style={{
    background: "#fff8f7",
    borderRadius: 18,
    margin: "0 auto 44px auto",
    width: `calc(100% - 36px)`,
    maxWidth,
    boxShadow: "0 4px 20px 0 #e3929020",
    display: "flex",
    alignItems: "center",
    padding: "22px 24px 22px 24px",
    gap: 16
  }}>
    <span style={{ fontSize: 32 }}>{ICONS.shield}</span>
    <div>
      <div style={{ color: "#d38d90", fontWeight: 700, fontSize: 15, marginBottom: 2 }}>Ваши данные под защитой</div>
      <div style={{ color: "#ad6367", fontSize: 14 }}>
        Мы не храним сообщения, не передаём контакты третьим лицам. Чат работает бесплатно, без рекламы, в формате “здесь и сейчас”.
      </div>
    </div>
  </div>
);

const Footer = () => (
  <div
    style={{
      width: `calc(100% - ${BLOCK_SIDE_PADDING * 2}px)`,
      maxWidth,
      margin: "0 auto",
      background: GRADIENT,
      borderRadius: "22px",
      boxShadow: "0 -4px 14px 0 rgba(155,175,205,0.06)",
      boxSizing: "border-box",
      fontFamily: "'Manrope', Arial, Helvetica, sans-serif",
      padding: "0 0 20px 0",
      display: "flex",
      flexDirection: "column",
      alignItems: "center"
    }}
  >
    <div style={{
      fontSize: 13,
      color: "#263540",
      fontWeight: 600,
      textAlign: "center",
      width: "100%",
      minWidth: 220,
      padding: "14px 0 8px 0"
    }}>
      Ташкент, Юнусабадский район, массив Кашгар 26
    </div>
    <a href="#" style={{
      display: "block",
      background: BABY_GRADIENT,
      border: "none",
      borderRadius: 14,
      color: "#fff",
      fontWeight: 600,
      fontSize: 14,
      padding: "12px 0",
      margin: "8px 0 0 0",
      width: "100%",
      textAlign: "center",
      textDecoration: "none"
    }}>Стать партнёром</a>
    <a href="#" style={{
      display: "block",
      background: BABY_GRADIENT,
      border: "none",
      borderRadius: 14,
      color: "#fff",
      fontWeight: 600,
      fontSize: 14,
      padding: "12px 0",
      margin: "10px 0 0 0",
      width: "100%",
      textAlign: "center",
      textDecoration: "none"
    }}>Связаться с менеджером</a>
    <a href="#" style={{
      background: "#fff",
      padding: "13px 0",
      width: "100%",
      borderRadius: 14,
      color: "#556",
      fontWeight: 500,
      fontSize: 14,
      textDecoration: "none",
      border: "1px solid #e1e9f5",
      textAlign: "center",
      margin: "15px 0 0 0"
    }}>Политика конфиденциальности</a>
    <div style={{
      marginTop: 9,
      fontSize: 12,
      color: "#8a97a0",
      textAlign: "center",
      width: "100%"
    }}>
      © {new Date().getFullYear()} Nora Plus — персональная забота о будущих мамах
    </div>
    <div style={{ height: 20 }} />
  </div>
);

const THREAD_KEY = "nora_thread_id";
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

  if (!isMobile) {
    return (
      <div style={{
        width: "100vw",
        height: "100vh",
        background: "#f8fdff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "fixed",
        left: 0,
        top: 0,
        zIndex: 10000
      }}>
        <div style={{
          fontWeight: 700,
          fontSize: "21px",
          textAlign: "center",
          color: NORA_COLOR,
          background: "#fff",
          borderRadius: 24,
          padding: "35px 28px",
          boxShadow: "0 6px 36px 0 rgba(155, 175, 205, 0.12)"
        }}>
          Nora Plus — доступна только <br /> на мобильных устройствах
        </div>
      </div>
    );
  }

  if (preloading) {
    return (
      <div style={{
        background: "#f8fdff",
        width: "100vw",
        height: "100vh",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 10000,
        margin: 0, padding: 0
      }}>
        <span style={{
          fontWeight: 800,
          fontSize: "38px",
          color: NORA_COLOR,
          letterSpacing: "0.07em",
          animation: "noraPulse 1.4s infinite linear"
        }}>Nora Plus</span>
        <style>{`
          @keyframes noraPulse {
            0% { opacity: 0.30; }
            50% { opacity: 1; }
            100% { opacity: 0.30; }
          }
        `}</style>
      </div>
    );
  }

  if (showWelcome) {
    return (
      <div style={{
        fontFamily: "'Manrope', Arial, Helvetica, sans-serif",
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
          boxSizing: "border-box", zIndex: 1,
          fontFamily: "'Manrope', Arial, Helvetica, sans-serif"
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
              Личный ассистент для будущих мам
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

        <div style={{ height: 19 }} />

        <div style={{
          fontWeight: 800, fontSize: "28px", color: "#bb4369", textAlign: "center", lineHeight: 1.15,
          maxWidth: 430, margin: "0 auto 8px auto"
        }}>
          Nora Plus — забота и поддержка будущих мам <span style={{ color: "#2e2e2e" }}>в один клик</span>
        </div>
        <div style={{
          color: "#575f7e", fontSize: "16px", fontWeight: 500,
          textAlign: "center", lineHeight: 1.60, margin: "0 auto 23px auto", maxWidth: 390
        }}>
          Персональные рекомендации, ответы 24/7 и внимательная забота. Ваша беременность под контролем, а приватность&nbsp;— на первом месте.
        </div>

        <TopBullets />

        {/* Видео */}
        <div
          style={{
            width: "100%",
            maxWidth: maxWidth,
            margin: "33px auto 0 auto",
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
        <div style={{ height: 27 }} />

        <div style={{
          display: "flex", justifyContent: "center", width: "100%", alignItems: "center"
        }}>
          <button
            style={{
              width: "100%", maxWidth: 326,
              background: BABY_GRADIENT,
              color: "#fff",
              border: "none",
              borderRadius: borderRadius,
              fontWeight: 700,
              fontSize: "20px",
              padding: "18px 0",
              margin: `0 ${BLOCK_SIDE_PADDING}px`,
              cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 3px 22px 0 rgba(200, 128, 140, 0.12)",
              letterSpacing: "0.03em"
            }}
            onClick={() => setShowWelcome(false)}
          >
            Начать общение&nbsp;
            <span style={{ marginLeft: 11, display: "flex", alignItems: "center" }}>{ICONS.arrowRight}</span>
          </button>
        </div>
        <div style={{ fontSize: 14, margin: "10px 0 8px 0", textAlign: "center", color: "#7c8792" }}>
          Бесплатно. Для каждой будущей мамы. Без рекламы и риска для данных.
        </div>

        <HowWorks />

        <WhyNoraBlock />
        <ReviewBlock />
        <PrivacyBlock />
        <Footer />
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
        boxSizing: "border-box", zIndex: 1,
        fontFamily: "'Manrope', Arial, Helvetica, sans-serif"
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
            Личный ассистент для будущих мам
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
