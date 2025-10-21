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

const IconPolicy = (
  <svg width="16" height="16" fill="none" viewBox="0 0 20 20" style={{marginRight: 6}}>
    <path d="M4 4.5V10c0 5 7 6.5 7 6.5s7-1.5 7-6.5v-5.5l-7-2-7 2Z" stroke="#4d5762" strokeWidth="1.5" fill="none"/>
  </svg>
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

// --- НОВЫЙ БЛОК Как работает Нора ---
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
    },
    {
      q: "Боюсь пропустить визит к врачу...",
      a: "Я настрою календарь визитов и пришлю уведомления заранее, чтобы ничего не забыть!"
    }
  ];
  const [step, setStep] = useState(0);
  const [showTyping, setShowTyping] = useState(true);

  useEffect(() => {
    if (showTyping) {
      const timer = setTimeout(() => setShowTyping(false), 1300 + DIALOGS[step].a.length * 18);
      return () => clearTimeout(timer);
    }
    if (!showTyping && step < DIALOGS.length - 1) {
      const timer = setTimeout(() => {
        setStep(s => s + 1);
        setShowTyping(true);
      }, 1700);
      return () => clearTimeout(timer);
    }
  }, [showTyping, step]);

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
      minHeight: 180,
    }}>
      <div style={{ fontWeight: 700, fontSize: 20, color: NORA_COLOR, textAlign: "center", marginBottom: 13 }}>
        Как работает Nora?
      </div>
      <div style={{
        width: "100%",
        minHeight: 90,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        justifyContent: "center"
      }}>
        <div style={{
          alignSelf: "flex-end",
          background: "#fff",
          color: NORA_COLOR,
          borderRadius: 19,
          fontSize: 15,
          fontWeight: 500,
          boxShadow: "0 1px 8px 0 rgba(200,180,200,0.12)",
          padding: "12px 18px",
          marginBottom: 8,
          maxWidth: 340,
        }}>
          {DIALOGS[step].q}
        </div>
        <div style={{
          alignSelf: "flex-start",
          background: "rgba(255,255,255,0.06)",
          color: NORA_COLOR,
          borderRadius: 19,
          fontSize: 15,
          fontWeight: 400,
          padding: "12px 18px",
          minHeight: 26,
          boxShadow: "none",
          maxWidth: 340,
          letterSpacing: "0.015em",
        }}>
          {showTyping
            ? <span>
                <span style={{fontStyle:"italic", opacity:0.33}}>&nbsp;печатаю...</span>
              </span>
            : DIALOGS[step].a}
        </div>
      </div>
      <div style={{fontSize: 13, color: "#6e7c85", textAlign: "center", marginTop: 8}}>
        Просто задайте вопрос — Нора найдёт ответ!
      </div>
    </div>
  );
};

const WhyNoraBlock = () => (
  <div style={{
    width: `calc(100% - ${BLOCK_SIDE_PADDING * 2}px)`,
    maxWidth,
    margin: "0 auto 38px auto",
    background: GRADIENT,
    borderRadius: borderRadius,
    boxShadow: "0 6px 20px 0 rgba(150, 175, 205, 0.10)",
    boxSizing: "border-box",
    padding: 0,
    fontFamily: "'Manrope', Arial, Helvetica, sans-serif"
  }}>
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
          <div key={idx}
            style={{
              position: "relative",
              background: "#fff",
              borderRadius: 18,
              boxShadow: "0 2px 18px 0 rgba(150,180,220,0.07)",
              padding: "19px 15px 19px 15px",
              overflow: "hidden",
              minHeight: 56,
              textAlign: "left"
            }}>
            <span style={{
              position: "absolute",
              right: 12,
              top: 14,
              fontSize: 62,
              opacity: 0.14,
              pointerEvents: "none",
              userSelect: "none",
              lineHeight: 1,
              zIndex: 0,
            }} aria-hidden="true">{emoji}</span>
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
  <div style={{
    width: `calc(100% - ${BLOCK_SIDE_PADDING * 2}px)`,
    maxWidth,
    margin: "0 auto 38px auto",
    background: GRADIENT,
    borderRadius: borderRadius,
    boxShadow: "0 6px 20px 0 rgba(150, 175, 205, 0.10)",
    boxSizing: "border-box",
    padding: 0,
    fontFamily: "'Manrope', Arial, Helvetica, sans-serif"
  }}>
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
          <div key={idx}
            style={{
              background: "#fff",
              borderRadius: 18,
              boxShadow: "0 2px 18px 0 rgba(150,180,220,0.07)",
              padding: "19px 15px 19px 15px",
              overflow: "hidden",
              textAlign: "left"
            }}>
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

const Footer = () => (
  <div style={{
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
  }}>
    <div style={{
      fontSize: 12, color: "#263540", fontWeight: 600, textAlign: "center", width: "100%"
    }}>Ташкент, Юнусабадский район, массив Кашгар 26</div>
    <div style={{
      display: "flex", gap: 11, width: "100%", justifyContent: "center"
    }}>
      <a href="#" style={{
        background: "#fff", width: "63%", borderRadius: 13, color: "#495062",
        fontWeight: 400, fontSize: 14, padding: "9px 0", textDecoration: "none",
        textAlign: "center", border: "1px solid #e1e9f5",
        display: "flex", alignItems: "center", justifyContent: "center", gap: 7, marginRight: 5
      }}>{IconPartner} Стать партнёром</a>
      <a href="#" style={{
        background: "#fff", width: "37%", borderRadius: 13, color: "#495062",
        fontWeight: 400, fontSize: 14, padding: "9px 0", textDecoration: "none",
        textAlign: "center", border: "1px solid #e1e9f5",
        display: "flex", alignItems: "center", justifyContent: "center", gap: 7
      }}>{IconContact} Контакты</a>
    </div>
    <a href="#" style={{
      background: "#fff", padding: "7px 0", width: "100%",
      borderRadius: 14, color: "#556", fontWeight: 400, fontSize: 14,
      textDecoration: "none", border: "1px solid #e1e9f5",
      textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", gap: 7
    }}>{IconPolicy} Политика конфиденциальности</a>
    <div style={{
      marginTop: 8, fontSize: 12, color: "#8a97a0", textAlign: "center", width: "100%"
    }}>
      © {new Date().getFullYear()} Nora Plus — забота и поддержка будущих мам
    </div>
  </div>
);

const FooterGap = () => <div style={{height: 20}} />;

// ---------- ОСНОВНОЙ КОМПОНЕНТ ----------
const Chat = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [botProgress, setBotProgress] = useState("");
  const [threadId, setThreadId] = useState(null);
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
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = "auto"; };
  }, []);
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory, botProgress]);

  // --- Заглушка функции чата, можно заменить твоей реальной ---
  const handleSendMessage = () => {
    if (!message.trim()) return;
    setLoading(true);
    setChatHistory([...chatHistory, { text: message.trim(), sender: "user" }]);
    setTimeout(() => {
      setChatHistory(prev => [...prev, { text: "Nora отвечает на ваш вопрос!", sender: "bot" }]);
      setLoading(false);
      setMessage("");
    }, 1200);
  };

  if (!isMobile) {
    return (
      <div style={{
        width: "100vw", height: "100vh", background: "#f8fdff",
        display: "flex", alignItems: "center", justifyContent: "center", position: "fixed", left: 0, top: 0, zIndex: 10000
      }}>
        <div style={{
          fontWeight: 700, fontSize: "21px", textAlign: "center", color: NORA_COLOR, background: "#fff",
          borderRadius: 24, padding: "35px 28px", boxShadow: "0 6px 36px 0 rgba(155, 175, 205, 0.12)"
        }}>
          Nora Plus — доступна только <br /> на мобильных устройствах
        </div>
      </div>
    );
  }

  // ------------- WELCOME ЭКРАН -------------
  if (showWelcome) {
    return (
      <div style={{
        fontFamily: "'Manrope', Arial, Helvetica, sans-serif",
        background: "#f8fdff",
        width: "100vw",
        minHeight: "100vh"
      }}>
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
          <NoraHowItWorksBlock />
          <WhyNoraBlock />
          <ReviewBlock />
          <Footer />
          <FooterGap />
        </div>
      </div>
    );
  }

  // -------------- ЧАТ ПАНЕЛЬ --------------
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
            Ассистент для будущих мам
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: 16 }}>
          <button style={{
            background: "transparent", border: "none", cursor: "pointer",
            width: 38, height: 38, borderRadius: 19,
            display: "flex", alignItems: "center", justifyContent: "center"
          }} onClick={() => alert('Поделиться')}>
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
          }} onClick={() => setChatHistory([])}>
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
              <span style={{
                background: msg.sender === "user" ? "#fff" : "#f7fafd",
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
            fontSize: 16,
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
            fontSize: 17,
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
    </div>
  );
};

export default Chat;
