"use client";
import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";

const NORA_COLOR = "#2e2e2e";
const ICON_SIZE = 23;
const borderRadius = 22;
const panelHeight = 62;
const maxWidth = 560;
const GRADIENT = "linear-gradient(90deg, #eff5fe 0%, #e5e8ed 100%)";
const INPUT_BAR_HEIGHT = 68;

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

function filterAsterisks(str) {
  return str.replace(/\*/g, "");
}
function formatBotText(text) {
  if (!text) return "";
  let cleaned = filterAsterisks(text).replace(/_/g, "");
  const firstSentenceMatch = cleaned.match(/^([^.!?]+[.!?])/);
  const firstSentence = firstSentenceMatch ? firstSentenceMatch[1].trim() : "";
  const restText = firstSentence ? cleaned.slice(firstSentence.length).trim() : cleaned.trim();
  let result = "";
  if (firstSentence) result += `**${firstSentence}** `;
  if (restText) result += restText;
  result = result.replace(/\*\*(.*?)\*\*[*]+/g, "$1");
  return result.trim();
}

const REVIEWS = [
  { name: "Анна", pregnancy: "2 месяц", problem: "Токсикоз", text: "Nora Plus подсказала, как справиться с утренней тошнотой. Питание стало более сбалансированным и легче переносить симптомы." },
  { name: "Елена", pregnancy: "4 месяц", problem: "Слабость и усталость", text: "Рекомендации по витаминам и сну очень помогли, чувствую себя намного лучше!" },
  { name: "Ирина", pregnancy: "5 месяц", problem: "Тревожность", text: "Советы от Nora Plus помогли мне расслабиться и больше отдыхать. Теперь спокойна за малыша." },
  { name: "Оксана", pregnancy: "6 месяц", problem: "Боль в спине", text: "Упражнения из приложения действительно облегчили боль. Научилась правильно расслабляться." },
  { name: "Виктория", pregnancy: "7 месяц", problem: "Анализы", text: "Пояснения от сервиса помогли понять результаты, тревога уходит, сплю спокойнее." },
  { name: "Мария", pregnancy: "9 месяц", problem: "Отёки ног", text: "Полезные советы, упражнения и режим помогли избавиться от тяжести в ногах." },
  { name: "София", pregnancy: "8 месяц", problem: "Страх родов", text: "Nora отвечала на мои вопросы, теперь чувствую уверенность и готовность." },
  { name: "Оля", pregnancy: "5 месяц", problem: "Питание", text: "Рекомендации по продуктам помогли избежать лишнего веса и токсикоза." },
  { name: "Татьяна", pregnancy: "3 месяц", problem: "Сон", text: "Научилась правильно расслабляться по совету приложения, теперь сплю лучше." },
  { name: "Кристина", pregnancy: "7 месяц", problem: "Забывчивость", text: "Напоминания от Nora Plus о приёме витаминов и воде очень выручают!" },
  { name: "Алиса", pregnancy: "6 месяц", problem: "Недостаток информации", text: "Ответы на вопросы о здоровье пришли быстро, больше не нервничаю." },
  { name: "Светлана", pregnancy: "8 месяц", problem: "Беспокойство", text: "Чат с ассистентом помог снять лишние страхи, отлично поддерживает." },
  { name: "Дарья", pregnancy: "3 месяц", problem: "Токсикоз", text: "Перед сном читаю рекомендации, стало меньше тошноты и улучшилось настроение." },
  { name: "Dilnoza", pregnancy: "6 oy", problem: "Uyqusizlik", text: "Nora Plus maslahatlari yordam berdi, endi yaxshi uxlayman ва ташвишлар камроқ." },
  { name: "Madina", pregnancy: "4 oy", problem: "Ovqat hazmi", text: "Ovqatlanish bo‘yicha maslahatlar juda foydali, endi oshqozonim qiynalmaydi." },
  { name: "Gulnora", pregnancy: "8 oy", problem: "Qo‘rqinch", text: "Nora Plus qo‘llablab-quvvatladi, tug‘ruqdan kamroq qo‘rqаман." },
  { name: "Yulduz", pregnancy: "5 oy", problem: "Bel og‘rig‘i", text: "Mashqlar yordami bilan bel og‘rig‘i ancha kamayди." },
  { name: "Zarina", pregnancy: "3 oy", problem: "Toksikoz", text: "Nora maslahatlari tufayli toksikозni osonroq o‘tkazdim." },
  { name: "Muxlisa", pregnancy: "7 oy", problem: "Vazn ortishi", text: "Sog‘lom ovqatlanish ва harakatлар tufayli vaznimni nazорат qила оляпман." },
  { name: "Kamola", pregnancy: "2 oy", problem: "Xavotir", text: "Assistentim savollarимга тез javob beradi, endi kamroq xavotirdaman." },
  { name: "Nargiza", pregnancy: "5 oy", problem: "Kichik og‘riqlar", text: "Nora maslahatlariga amal qilib, hal qilмоқдаман." },
  { name: "Hanifa", pregnancy: "9 oy", problem: "Tayyorланиш", text: "Tug‘рукка tayyorgarlik bo‘yicha foydali maslahatлар олдим." },
  { name: "Shahzoda", pregnancy: "4 oy", problem: "Energiya yetishmasligi", text: "Sog‘лом turmush tarzини boshlадим, o‘zimни яхши his qilaman." },
  { name: "Laylo", pregnancy: "7 oy", problem: "Uyqu buzilishi", text: "Qisqa mashqlar ва tinchlantирuvchi маҳсалатлар ёрдам берди." },
  { name: "Feruza", pregnancy: "6 oy", problem: "Xotira", text: "Nora eslatmalari vitamin ва сув ичищга ёрдам беради." }
];

const ReviewBlock = () => {
  const [visibleIdx, setVisibleIdx] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleIdx(idx => (REVIEWS.length ? (idx + 1) % REVIEWS.length : 0));
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  // Пропускаем пустые элементы
  let reviewsToShow = [];
  for (let i = 0; i < 5 && REVIEWS.length; i++) {
    const review = REVIEWS[(visibleIdx + REVIEWS.length - i) % REVIEWS.length];
    if (review) reviewsToShow.push(review);
  }

  if (!reviewsToShow.length) return null;

  return (
    <div style={{ width: "100%", maxWidth: 560, margin: "30px auto 0 auto", background: "none" }}>
      {reviewsToShow.map((r, idx) => (
        <div
          key={r.name + idx}
          style={{
            background: "linear-gradient(90deg, #eff5fe 0%, #e5e8ed 100%)",
            borderRadius: 22,
            margin: "0 20px 0 20px",
            marginBottom: idx < 4 ? 20 : 0,
            boxShadow: "0 2px 8px 0 rgba(150, 180, 220, 0.10)",
            padding: "14px 16px 11px 16px",
            animation: idx === 0 ? "slideInTop 0.6s" : undefined,
            transition: "all 0.5s"
          }}>
          <div style={{ fontWeight: 700, fontSize: 15 }}>{r.name} — {r.pregnancy}</div>
          <div style={{ fontWeight: 700, color: "#715b9b", margin: "4px 0 3px 0" }}>{r.problem}</div>
          <div style={{ fontSize: 14, color: "#2e2e2e", lineHeight: "1.5" }}>{r.text}</div>
        </div>
      ))}
      <div style={{ height: 30 }} />
      <style>
        {`
        @keyframes slideInTop {
          0% { opacity: 0; transform: translateY(-30px);}
          100% { opacity: 1; transform: translateY(0);}
        `}
      </style>
    </div>
  );
};

const THREAD_KEY = "nora_thread_id";
const Chat = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [preloading, setPreloading] = useState(true);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [threadId, setThreadId] = useState(null);
  const [botProgress, setBotProgress] = useState("");
  const [showHowTo, setShowHowTo] = useState(true);
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
  useEffect(() => {
    if (chatHistory.length > 0) setShowHowTo(false);
  }, [chatHistory]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Nora AI — Ассистент для будущих мам",
        text: "Современный ассистент для будущих мам на базе NHS — все рекомендации по беременности в одном месте.",
        url: window.location.href
      });
    } else {
      alert("Ваш браузер не поддерживает Web Share API");
    }
  };

  const sendMessageToGPT = async (text) => {
    setLoading(true);
    const newHistory = [...chatHistory, { text: filterAsterisks(text), sender: "user" }];
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
      botReply = filterAsterisks(botReply);
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
    setShowHowTo(true);
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
          Nora AI — доступна только <br /> на мобильных устройствах
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
        }}>Nora AI</span>
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

  return (
    <div
      style={{
        background: "#f8fdff",
        width: "100vw",
        height: "100vh",
        overflow: "auto",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        boxSizing: "border-box"
      }}
    >

      <div style={{
        width: "calc(100% - 40px)",
        maxWidth,
        minHeight: panelHeight,
        background: GRADIENT,
        color: NORA_COLOR,
        margin: "20px auto 0 auto",
        display: "flex", alignItems: "center",
        borderRadius: borderRadius,
        paddingLeft: 20, paddingRight: 12, paddingTop: 5, paddingBottom: 5,
        justifyContent: "flex-start", boxSizing: "border-box", zIndex: 1, boxShadow: "none"
      }}>
        <div style={{
          marginRight: 10, color: NORA_COLOR,
          display: "flex", flexDirection: "column", justifyContent: "center", minWidth: 0
        }}>
          <span style={{
            fontWeight: 800, fontSize: "19px", lineHeight: 1.06,
            whiteSpace: "nowrap", marginBottom: 7
          }}>Nora AI</span>
          <span style={{
            fontWeight: 400, fontSize: "13px",
            color: "#565656", lineHeight: 1.04, whiteSpace: "nowrap"
          }}>Ассистент для будущих мам</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: "auto" }}>
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
      <div style={{ height: 40 }} />

      {showWelcome ? (
        <>
          <div style={{
            width: "100%",
            maxWidth,
            margin: "10px auto 0 auto",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "none",
            paddingLeft: 10,
            paddingRight: 20
          }}>
            <video
              src="/nora.mp4"
              style={{
                maxWidth: "100%",
                width: "100%",
                height: 285, // уменьшено на 5px
                objectFit: "cover",
                objectPosition: "center",
                display: "block",
                margin: "0 auto",
                borderRadius: 24,
              }}
              autoPlay
              playsInline
              muted
              loop
              preload="auto"
            />
          </div>
          <div style={{ height: 30 }} /> {/* Отступ между видео и заголовком */}
          <div style={{
            width: "calc(100% - 40px)", maxWidth, textAlign: "center", margin: "0 auto"
          }}>
            <div style={{
              fontWeight: 700, fontSize: "22px", color: NORA_COLOR, marginBottom: 14
            }}>Ждёте малыша? Я помогу!</div>
            <div style={{
              fontWeight: 400, fontSize: "15px", margin: "0 auto 0 auto", maxWidth: 400,
              padding: "0 20px", lineHeight: 1.75, color: NORA_COLOR, display: "inline-block"
            }}>
              Я помогаю будущим мамам на каждом этапе беременности: отвечаю на вопросы, напоминаю о важных делах, слежу за самочувствием и даю советы, основанные на медицине Великобритании NHS.
            </div>
            <div style={{ height: 40 }} />
          </div>
          <button
            style={{
              width: "100%", maxWidth: 290, background: GRADIENT, color: NORA_COLOR,
              border: "none", borderRadius: borderRadius, fontWeight: 700, fontSize: "17px",
              padding: "15px 0", margin: "0 20px", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center"
            }}
            onClick={() => setShowWelcome(false)}
          >
            Начать пользоваться&nbsp;
            <span style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              {ICONS.arrowRight}
            </span>
          </button>
          <div style={{ height: 30 }} /> {/* Отступ между кнопкой и отзывами */}
          <ReviewBlock />
        </>
      ) : (showHowTo && (
        <div style={{
          width: "calc(100% - 40px)", maxWidth, textAlign: "center", margin: "90px auto 0 auto"
        }}>
          <div style={{
            fontWeight: 700, fontSize: "21px", color: NORA_COLOR, marginBottom: 10, marginTop: 12
          }}>
            Как пользоваться Nora?
          </div>
          <div style={{
            fontWeight: 400, fontSize: "15px", margin: "0 auto", maxWidth: 400,
            padding: "0 20px", lineHeight: 1.75, color: NORA_COLOR, display: "inline-block"
          }}>
            Можно спрашивать все, что связано с беременностью, здоровьем, самочувствием, питанием, анализами, подготовкой к родам, эмоциональным состоянием и любые другие темы.
          </div>
          <div style={{ height: 40 }} />
        </div>
      ))}

      <div style={{
        width: "100%",
        maxWidth,
        padding: "0 0px",
        margin: "0 auto",
        marginTop: 0,
        flex: 1,
        overflowY: "auto",
        paddingBottom: INPUT_BAR_HEIGHT + 20
      }}>
        {chatHistory.map((msg, idx) => (
          <div
            key={idx}
            style={{
              display: "flex",
              width: "100%",
              justifyContent: msg.sender === "user" ? "flex-end" : "flex-start"
            }}
          >
            <div
              style={{
                margin: "20px",
                maxWidth: 450,
                alignSelf: msg.sender === "user" ? "flex-end" : "flex-start"
              }}
            >
              {msg.sender === "user" ? (
                <span
                  style={{
                    background: GRADIENT,
                    color: NORA_COLOR,
                    borderRadius: 16,
                    padding: "18px 20px",
                    lineHeight: 1.7,
                    fontSize: 17,
                    minWidth: 0,
                    boxShadow: "0 2px 14px 0 rgba(155,175,205,0.07)",
                    maxWidth: "100%",
                    display: "inline-block",
                    fontWeight: 400,
                    wordBreak: "break-word"
                  }}
                >
                  {filterAsterisks(msg.text)}
                </span>
              ) : (
                <span
                  style={{
                    color: NORA_COLOR,
                    background: "transparent",
                    borderRadius: 0,
                    padding: 0,
                    lineHeight: 1.7,
                    fontSize: 17,
                    minWidth: 0,
                    maxWidth: "100%",
                    display: "inline-block",
                    fontWeight: 400,
                    wordBreak: "break-word"
                  }}
                >
                  <ReactMarkdown>{formatBotText(msg.text)}</ReactMarkdown>
                </span>
              )}
            </div>
          </div>
        ))}
        {botProgress && (
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "flex-start",
              marginTop: "20px",
              marginBottom: "20px",
              paddingLeft: 20,
              paddingRight: 20,
              boxSizing: "border-box"
            }}
          >
            <div
              style={{
                maxWidth: 450,
                width: "100%",
                color: NORA_COLOR,
                fontSize: 17,
                fontWeight: 400,
                background: "transparent",
                borderRadius: 0,
                padding: 0,
                lineHeight: 1.7,
                wordBreak: "break-word"
              }}
            >
              <ReactMarkdown>{formatBotText(botProgress)}</ReactMarkdown>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {!showWelcome && (
        <>
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
              onChange={e => setMessage(filterAsterisks(e.target.value))}
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
          <div style={{ height: 20 }} />
        </>
      )}
    </div>
  );
};

export default Chat;
