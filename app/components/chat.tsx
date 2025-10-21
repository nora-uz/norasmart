"use client";
import React, { useState, useEffect, useRef } from "react";

// SVG хвостики для пузырей
const BubbleTailRight = () => (
  <svg viewBox="0 0 14 28" width="15" height="30" style={{position:'absolute', right:-14, bottom:0}}>
    <path d="M0 28 Q9 10 14 0 V28 Z" fill="#fff"/>
  </svg>
);
const BubbleTailLeft = () => (
  <svg viewBox="0 0 14 28" width="15" height="30" style={{position:'absolute', left:-14, bottom:0}}>
    <path d="M14 28 Q5 10 0 0 V28 Z" fill="#fff"/>
  </svg>
);

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

// --- Панель сверху на всех экранах ---
const HeaderPanel = () => (
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
    <div style={{display: "flex", flexDirection: "column", alignItems: "flex-start", flex: 1, paddingLeft: 5}}>
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
  </div>
);

// --- Блок Как работает Нора ---
const NoraHowItWorksBlock = () => {
  const DIALOGS = [
    {
      q: "Почему постоянно тревожусь за малыша?",
      a: "Это естественно! Я помогу отличить «нормальные» тревоги от опасных, дам упражнения для успокоения и подскажу, когда стоит обратиться к врачу."
    },
    {
      q: "Просыпаюсь по ночам и не могу уснуть...",
      a: "Нарушение сна — частая проблема! Я соберу ваши симптомы и подскажу, какие техники помогут лучше засыпать и что важно обсудить с врачом."
    },
    {
      q: "Болят спина и ноги, как облегчить боль?",
      a: "Я дам рекомендации по разгрузке, упражнениям, подскажу, когда обращаться к доктору и помогу отслеживать новые симптомы."
    },
    {
      q: "Какие витамины и анализы нужны?",
      a: "Подскажу персональный список, график напоминаний и объясню, зачем каждый анализ — вы не пропустите важное!"
    }
  ];
  const [step, setStep] = useState(0);
  const [phase, setPhase] = useState("typeQ");
  const [qText, setQText] = useState("");
  const [aText, setAText] = useState("");

  useEffect(() => {
    if (phase === "typeQ") {
      setQText("");
      let i = 0;
      const interval = setInterval(() => {
        setQText(DIALOGS[step].q.slice(0, i+1));
        i++;
        if (i > DIALOGS[step].q.length) {
          clearInterval(interval);
          setTimeout(() => setPhase("typeA"), 300);
        }
      }, 34);
      return () => clearInterval(interval);
    }
    if (phase === "typeA") {
      setAText("");
      let i = 0;
      const interval = setInterval(() => {
        setAText(DIALOGS[step].a.slice(0, i+1));
        i++;
        if (i > DIALOGS[step].a.length) {
          clearInterval(interval);
          setTimeout(() => setPhase("waitNext"), 5000);
        }
      }, 16);
      return () => clearInterval(interval);
    }
    if (phase === "waitNext" && step < DIALOGS.length-1) {
      const timer = setTimeout(() => {
        setQText("");
        setAText("");
        setPhase("typeQ");
        setStep(s => s+1);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [phase, step]);

  return (
    <div style={{
      width: `calc(100% - ${BLOCK_SIDE_PADDING * 2}px)`,
      maxWidth,
      margin: "0 auto 38px auto",
      background: GRADIENT,
      borderRadius: borderRadius,
      boxShadow: "0 6px 20px 0 rgba(150,175,205,0.11)",
      padding: `22px ${BLOCK_SIDE_PADDING}px`,
      fontFamily: "'Manrope', Arial, Helvetica, sans-serif",
      minHeight: 210,
    }}>
      <div style={{
        fontWeight: 700,
        fontSize: 20,
        color: NORA_COLOR,
        textAlign: "center"
      }}>
        Как работает Nora?
      </div>
      <div style={{ height: 28 }} />
      <div style={{
        width: "100%",
        minHeight: 90,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        justifyContent: "center"
      }}>
        {qText && (
          <div style={{
            position: "relative",
            alignSelf: "flex-end",
            background: "#fff",
            color: NORA_COLOR,
            borderTopLeftRadius: 19,
            borderTopRightRadius: 19,
            borderBottomLeftRadius: 19,
            borderBottomRightRadius: 2,
            fontSize: 15,
            fontWeight: 500,
            boxShadow: "0 1px 8px 0 rgba(200,180,200,0.13)",
            padding: "15px 21px",
            marginBottom: 16,
            maxWidth: 340,
            lineHeight: "1.65",
          }}>
            {qText}<span style={{ opacity: 0.19 }}>{phase === "typeQ" && "|"}</span>
            <BubbleTailRight />
          </div>
        )}
        {aText && (
          <div style={{
            position: "relative",
            alignSelf: "flex-start",
            background: "#fff",
            color: NORA_COLOR,
            borderTopLeftRadius: 19,
            borderTopRightRadius: 19,
            borderBottomRightRadius: 19,
            borderBottomLeftRadius: 2,
            fontSize: 15,
            fontWeight: 400,
            padding: "21px 26px",
            minHeight: 35,
            boxShadow: "0 1px 8px 0 rgba(200,180,200,0.09)",
            maxWidth: 370,
            marginBottom: 8,
            lineHeight: "1.72"
          }}>
            {aText}<span style={{ opacity: 0.19 }}>{phase === "typeA" && "|"}</span>
            <BubbleTailLeft />
          </div>
        )}
      </div>
      <div style={{ fontSize: 13, color: "#6e7c85", textAlign: "center", marginTop: 8 }}>
        Просто задайте вопрос — Нора найдёт ответ!
      </div>
    </div>
  );
};

// --- Преимущества ---
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

// --- Отзывы ---
const REVIEWS = [
  { name: "Анна", badge: "2 месяц беременности", problem: "Токсикоз", text: "Nora Plus подсказала, как справиться с утренней тошнотой. Благодаря рекомендациям по питанию и режиму дня симптомы стали гораздо легче." },
  { name: "Дилноза", badge: "3 месяц беременности", problem: "Тошнота", text: "Советы Nora Plus помогли справиться с тошнотой и легче переносить беременность. Все подсказки приходят вовремя." },
  { name: "Елена", badge: "4 месяц беременности", problem: "Слабость и усталость", text: "Теперь я знаю, какие витамины нужно пить, сколько отдыхать и как выстроить день. Чувствую себя значительно лучше!" },
  { name: "Шахноза", badge: "5 месяц беременности", problem: "Плохое настроение", text: "Благодаря мотивационным словам и советам Nora Plus моё настроение заметно улучшилось." },
  { name: "Ирина", badge: "5 месяц беременности", problem: "Тревожность", text: "Советы Nora Plus помогли мне больше отдыхать, заботиться о себе и избавиться от лишних переживаний за малыша." },
  { name: "Мария", badge: "7 месяц беременности", problem: "Бессонница", text: "Благодаря советам Nora Plus я стала лучше спать и спокойно жду появления малыша." },
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
                  <span style={{ fontWeight: 700, fontSize: 15, color: "#222" }}>{name}</span>
                  <span style={{
                    fontWeight: 500, fontSize: 13, color: "#1681f5",
                    padding: "4px 9px", borderRadius: 12, background: "#f3f7fe", whiteSpace: "nowrap"
                  }}>{badge}</span>
                </div>
                <div style={{ fontWeight: 500, fontSize: 13, color: "#acb5bd", marginBottom: 9 }}>{problem}</div>
                <div style={{ fontSize: 13, color: "#3a3a3a", lineHeight: "1.64" }}>{text}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
);

// --- Футер ---
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

const FooterGap = () => <div style={{height: 20}} />;

// --- ОСНОВНОЙ КОМПОНЕНТ ---
const Chat = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory]);

  const handleSendMessage = () => {
    if (!message.trim()) return;
    setChatHistory([...chatHistory, { text: message.trim(), sender: "user" }]);
    setTimeout(() => {
      setChatHistory(prev => [...prev, { text: "Nora отвечает на ваш вопрос!", sender: "bot" }]);
      setMessage("");
    }, 1200);
  };

  return (
    <div style={{ background: "#f8fdff", minHeight: "100vh" }}>
      {showWelcome && (
        <>
          <HeaderPanel />
          <div style={{ height: 20 }} />
          <div style={{ height: 20 }} />
          <div style={{
            width: "100%",
            maxWidth: maxWidth,
            margin: "0 auto",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}>
            <video src="/nora.mp4"
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

          <div style={{
            width: `calc(100% - ${BLOCK_SIDE_PADDING * 2}px)`,
            maxWidth,
            textAlign: "center",
            margin: "0 auto"
          }}>
            <div style={{
              fontWeight: 700,
              fontSize: "22px",
              color: NORA_COLOR,
              marginBottom: 14
            }}>Ждёте малыша? Я помогу!</div>
            <div style={{
              fontWeight: 400,
              fontSize: "15px",
              margin: "0 auto 0 auto",
              maxWidth: 400,
              padding: "0 18px",
              lineHeight: 1.75,
              color: NORA_COLOR,
              display: "inline-block"
            }}>
              Я помогаю будущим мамам: отвечаю на вопросы, напоминаю о важных делах, слежу за самочувствием.
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
                  Начать пользоваться
                </button>
                <div style={{ height: 13 }} />
                <div style={{ fontSize: 13, color: "#7c8792" }}>
                  Попробуйте — это быстро и бесплатно
                </div>
              </div>
            </div>
            <div style={{ height: 40 }} />
            <NoraHowItWorksBlock />
            <WhyNoraBlock />
            <ReviewBlock />
            <Footer />
            <FooterGap />
          </div>
        </>
      )}
      {!showWelcome && (
        <>
          <HeaderPanel />
          <div style={{
            width: "100%",
            maxWidth: maxWidth,
            margin: "0 auto",
            padding: "24px 0 80px 0",
            minHeight: "60vh"
          }}>
            {chatHistory.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  textAlign: msg.sender === "user" ? "right" : "left",
                  margin: "10px 20px"
                }}
              >
                <span style={{
                  background: msg.sender === "user" ? "#fff" : "#f7fafd",
                  padding: 12,
                  borderRadius: 16,
                  fontSize: 16
                }}>{msg.text}</span>
              </div>
            ))}
            <div ref={messagesEndRef} />
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
              onChange={e => setMessage(e.target.value)}
              placeholder="Введите сообщение..."
              style={{
                flex: 1,
                height: 48,
                fontSize: 16,
                borderRadius: borderRadius,
                borderWidth: 1,
                borderStyle: "solid",
                borderColor: "#e5e8ed",
                padding: "0 18px",
                background: "#fff",
                color: NORA_COLOR,
                boxSizing: "border-box",
                marginRight: 8,
                transition: "border 0.22s"
              }}
              onKeyDown={e => { if (e.key === 'Enter') handleSendMessage(); }}
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
                fontSize: 17,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 2px 14px 0 rgba(155,175,205,0.12)"
              }}
              onClick={handleSendMessage}
            >
              ➤
            </button>
          </div>
          <Footer />
        </>
      )}
    </div>
  );
};

export default Chat;
