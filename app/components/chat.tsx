"use client";
import React, { useState, useEffect, useRef } from "react";

// -- Константы и иконки ---
const NORA_COLOR = "#2e2e2e";
const ICON_SIZE = 23;
const borderRadius = 22;
const panelHeight = 62;
const maxWidth = 560;
const videoMaxWidth = 314;
const GRADIENT =
  "linear-gradient(90deg, #eff5fe 0%, #e5e8ed 100%)";
const BABY_GRADIENT =
  "linear-gradient(90deg, #e39290 0%, #efb1b6 100%)";
const INPUT_BAR_HEIGHT = 68;
const PANEL_SIDE_PADDING = 15;
const BLOCK_SIDE_PADDING = 10;
const CARD_GAP = 10;

const IconPartner = (
  <svg width="18" height="18" fill="none" viewBox="0 0 20 20">
    <circle cx="10" cy="6.5" r="3.3" stroke="#5a6573" strokeWidth="1.5" />
    <path d="M2.8 16c.9-2.5 3.4-4.2 7.2-4.2s6.2 1.7 7.2 4.2"
          stroke="#5a6573" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const IconContact = (
  <svg width="18" height="18" fill="none" viewBox="0 0 20 20">
    <rect x="2.8" y="3.5" width="14.4" height="11" rx="2.2"
          stroke="#5a6573" strokeWidth="1.5" />
    <path d="M3.5 4l6.5 6.1c.3.2.8.2 1.1 0L17 4"
          stroke="#5a6573" strokeWidth="1.5" />
  </svg>
);

const IconPolicy = (
  <svg width="16" height="16" fill="none" viewBox="0 0 20 20"
       style={{ marginRight: 6 }}>
    <path d="M4 4.5V10c0 5 7 6.5 7 6.5s7-1.5 7-6.5v-5.5l-7-2-7 2Z"
          stroke="#4d5762" strokeWidth="1.5" fill="none" />
  </svg>
);

const ICONS = {
  telegram: "https://cdn-icons-png.flaticon.com/512/1946/1946547.png",
  trash: "https://cdn-icons-png.flaticon.com/512/1345/1345823.png",
  share: "https://cdn-icons-png.flaticon.com/512/535/535285.png",
  arrowRight: (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path d="M6 11H16M16 11L12 7M16 11L12 15"
            stroke="#fff" strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"/>
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

// SVG хвостик для правого пузыря (вопрос)
const BubbleTailRight = () => (
  <svg viewBox="0 0 14 28" width="15" height="30" style={{position:'absolute', right:-14, bottom:0}}>
    <path d="M0 28 Q9 10 14 0 V28 Z" fill="#fff"/>
  </svg>
);

// SVG хвостик для левого пузыря (ответ)
const BubbleTailLeft = () => (
  <svg viewBox="0 0 14 28" width="15" height="30" style={{position:'absolute', left:-14, bottom:0}}>
    <path d="M14 28 Q5 10 0 0 V28 Z" fill="#fff"/>
  </svg>
);

// --- Блок "Как работает Нора?" с typing эффектом, отступом, хвостиками ---
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
  const [phase, setPhase] = useState("typeQ"); // typeQ, typeA, waitNext
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
      minHeight: 190,
    }}>
      <div style={{
        fontWeight: 700, fontSize: 20, color: NORA_COLOR, textAlign: "center"
      }}>
        Как работает Nora?
      </div>
      <div style={{height: 20}} />
      <div style={{
        width: "100%", minHeight: 90, display: "flex", flexDirection: "column",
        alignItems: "flex-end", justifyContent: "center"
      }}>
        {qText && (
          <div style={{
            position: "relative", alignSelf: "flex-end",
            background: "#fff", color: NORA_COLOR,
            borderRadius: 19, fontSize: 15, fontWeight: 500,
            boxShadow: "0 1px 8px 0 rgba(200,180,200,0.12)",
            padding: "12px 18px", marginBottom: 8, maxWidth: 340,
          }}>
            {qText}<span style={{opacity:0.19}}>{phase==="typeQ"&&"|"}</span>
            <BubbleTailRight />
          </div>
        )}
        {aText && (
          <div style={{
            position: "relative", alignSelf: "flex-start",
            background: "#fff", color: NORA_COLOR,
            borderRadius: 19, fontSize: 15, fontWeight: 400,
            padding: "12px 18px", minHeight: 26,
            boxShadow: "0 1px 8px 0 rgba(200,180,200,0.09)",
            maxWidth: 340, letterSpacing: "0.015em"
          }}>
            {aText}<span style={{opacity:0.19}}>{phase==="typeA"&&"|"}</span>
            <BubbleTailLeft />
          </div>
        )}
      </div>
      <div style={{fontSize: 13, color: "#6e7c85", textAlign: "center", marginTop: 8}}>
        Просто задайте вопрос — Нора найдёт ответ!
      </div>
    </div>
  );
};

// --- WhyNoraBlock/ReviewBlock/Footer/FooterGap — скопируй из прошлого полного кода ---

// ---- Панель ----
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
      }}>
        <img src={ICONS.share} alt="Share"
          style={{ width: ICON_SIZE, height: ICON_SIZE, filter: filterNora }} />
      </button>
      <button style={{
        background: "transparent", border: "none", cursor: "pointer",
        width: 38, height: 38, borderRadius: 19,
        display: "flex", alignItems: "center", justifyContent: "center"
      }}>
        <img src={ICONS.telegram} alt="Telegram"
          style={{ width: ICON_SIZE, height: ICON_SIZE, filter: filterNora }} />
      </button>
      <button style={{
        background: "transparent", border: "none", cursor: "pointer",
        width: 38, height: 38, borderRadius: 19,
        display: "flex", alignItems: "center", justifyContent: "center"
      }}>
        <img src={ICONS.trash} alt="Trash"
          style={{ width: ICON_SIZE, height: ICON_SIZE, filter: filterNora }} />
      </button>
    </div>
  </div>
);

// ---- Основной компонент ----
const Chat = () => {
  const [showWelcome, setShowWelcome] = useState(true);

  // ... остальной код чата и состояний как в примере выше ...

  if (showWelcome) {
    return (
      <div style={{
        fontFamily: "'Manrope', Arial, Helvetica, sans-serif",
        background: "#f8fdff",
        width: "100vw",
        minHeight: "100vh"
      }}>
        <HeaderPanel />
        <div style={{ height: 20 }} />
        <div style={{ height: 20 }} />

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
          {/* вставь ниже свои WhyNoraBlock, ReviewBlock, Footer, FooterGap */}
        </div>
      </div>
    );
  }

  // ---- чат после нажатия "начать пользоваться" ----
  // вставь сюда панель, чат-историю и input аналогично твоей прошлой версии

  return (
    <div>
      <HeaderPanel />
      {/* ...код твоего чата и футеры... */}
    </div>
  );
};

export default Chat;
