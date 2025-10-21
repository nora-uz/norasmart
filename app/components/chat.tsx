"use client";
import React, { useState, useEffect, useRef } from "react";

/* === КОНСТАНТЫ === */
const NORA_COLOR = "#2e2e2e";
const ICON_SIZE = 23;
const borderRadius = 22;
const panelHeight = 62;
const maxWidth = 560;
const videoMaxWidth = 314;
const GRADIENT = "linear-gradient(90deg, #eff5fe 0%, #e5e8ed 100%)";
const BABY_GRADIENT = "linear-gradient(90deg, #e39290 0%, #efb1b6 100%)";
const PANEL_SIDE_PADDING = 15;
const BLOCK_SIDE_PADDING = 10;
const CARD_GAP = 10;

const ICONS = {
  telegram: "https://cdn-icons-png.flaticon.com/512/1946/1946547.png",
  trash: "https://cdn-icons-png.flaticon.com/512/1345/1345823.png",
  share: "https://cdn-icons-png.flaticon.com/512/535/535285.png",
  arrowRight: (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path
        d="M6 11H16M16 11L12 7M16 11L12 15"
        stroke="#fff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
};

const filterNora =
  "invert(13%) sepia(4%) saturate(271%) hue-rotate(175deg) brightness(92%) contrast(93%)";

/* === ОБНОВЛЁННЫЙ БЛОК - КАК РАБОТАЕТ НОРА === */
const HowItWorks = () => {
  const EXAMPLES = [
    {
      q: "Можно ли пить кофе во время беременности?",
      a: "☕ Да, можно, но не более 1–2 чашек в день. Лучше выбрать напитки без кофеина и следить за самочувствием.",
    },
    {
      q: "Часто волнуюсь без причины.",
      a: "🤗 Это естественно во время беременности. Пробуйте больше отдыхать, делать дыхательные упражнения и уделять внимание себе — если тревога мешает, я помогу подобрать метод расслабления.",
    },
    {
      q: "Болит спина и поясница.",
      a: "💆 Это частая жалоба у беременных. Старайтесь чаще отдыхать лёжа на боку, выбирайте удобную обувь и попробуйте лёгкую гимнастику.",
    },
    {
      q: "Плохо сплю последние дни.",
      a: "😴 Перед сном проветривайте комнату, ложитесь в одно и то же время, пейте тёплое молоко. Если сон не приходит — расскажу, как наладить режим.",
    },
    {
      q: "Можно ли заниматься спортом?",
      a: "🏃 Да, если нет медицинских противопоказаний. Отличный выбор — йога, плавание и прогулки без перегрузок.",
    },
  ];

  const [step, setStep] = useState(0);
  const [phase, setPhase] = useState("q");
  const [q, setQ] = useState("");
  const [a, setA] = useState("");

  useEffect(() => {
    let timer;
    if (phase === "q") {
      setQ("");
      let i = 0;
      timer = setInterval(() => {
        setQ(EXAMPLES[step].q.slice(0, i + 1));
        i++;
        if (i > EXAMPLES[step].q.length) {
          clearInterval(timer);
          setTimeout(() => setPhase("a"), 400);
        }
      }, 35);
    } else if (phase === "a") {
      setA("");
      let i = 0;
      timer = setInterval(() => {
        setA(EXAMPLES[step].a.slice(0, i + 1));
        i++;
        if (i > EXAMPLES[step].a.length) {
          clearInterval(timer);
          setTimeout(() => setPhase("next"), 6400);
        }
      }, 18);
    } else if (phase === "next") {
      timer = setTimeout(() => {
        setStep((s) => (s + 1) % EXAMPLES.length);
        setPhase("q");
      }, 400);
    }
    return () => clearTimeout(timer);
  }, [phase, step]);

  const bubbleUser = (text) => (
    <div
      style={{
        alignSelf: "flex-end",
        background: "#fff",
        borderRadius: "19px 19px 4px 19px",
        padding: "20px 22px",
        marginBottom: 26,
        maxWidth: 400,
        textAlign: "right",
        fontSize: 15.5,
        lineHeight: 1.7,
        boxShadow: "0 1px 8px rgba(200,180,200,0.12)",
      }}
    >
      {text}
    </div>
  );

  const bubbleBot = (text) => (
    <div
      style={{
        alignSelf: "flex-start",
        background: "#f7fafd",
        borderRadius: "19px 19px 19px 4px",
        padding: "22px 24px",
        marginBottom: 26,
        maxWidth: 420,
        textAlign: "left",
        fontSize: 15.5,
        lineHeight: 1.7,
        boxShadow: "0 1px 8px rgba(200,180,200,0.12)",
      }}
    >
      {text}
    </div>
  );

  return (
    <div
      style={{
        width: `calc(100% - ${BLOCK_SIDE_PADDING * 2}px)`,
        maxWidth,
        margin: "0 auto 38px auto",
        background: GRADIENT,
        borderRadius: 22,
        boxShadow: "0 6px 20px rgba(150,175,205,0.1)",
        padding: "21px 0 20px 0",
        fontFamily: "'Manrope', Arial, Helvetica, sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: `0 ${BLOCK_SIDE_PADDING}px`,
        }}
      >
        {q && bubbleUser(q)}
        {a && bubbleBot(a)}
      </div>
      <div
        style={{
          fontSize: 13,
          color: "#7b8590",
          textAlign: "center",
          marginTop: 8,
        }}
      >
        Просто задайте вопрос — Нора найдёт ответ!
      </div>
    </div>
  );
};

/* === ОСНОВНОЙ КОМПОНЕНТ === */
const Chat = () => {
  const [showWelcome, setShowWelcome] = useState(true);

  if (showWelcome)
    return (
      <div
        style={{
          fontFamily: "'Manrope', Arial, Helvetica, sans-serif",
          background: "#f8fdff",
          width: "100vw",
          minHeight: "100vh",
        }}
      >
        {/* ПАНЕЛЬ */}
        <div
          style={{
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
            paddingLeft: PANEL_SIDE_PADDING,
            paddingRight: PANEL_SIDE_PADDING,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <span
              style={{
                fontWeight: 800,
                fontSize: 19,
                lineHeight: 1.06,
                marginBottom: 6,
              }}
            >
              Nora Plus
            </span>
            <span
              style={{
                fontWeight: 400,
                fontSize: 13,
                color: "#565656",
                lineHeight: 1.04,
              }}
            >
              Ассистент для будущих мам
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
              }}
            >
              <img
                src={ICONS.share}
                alt="share"
                style={{ width: ICON_SIZE, height: ICON_SIZE, filter: filterNora }}
              />
            </button>
            <button
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
              }}
            >
              <img
                src={ICONS.telegram}
                alt="telegram"
                style={{ width: ICON_SIZE, height: ICON_SIZE, filter: filterNora }}
              />
            </button>
          </div>
        </div>

        {/* ВИДЕО */}
        <div
          style={{
            width: "100%",
            maxWidth: maxWidth,
            margin: "35px auto 0 auto",
            textAlign: "center",
          }}
        >
          <video
            src="/nora.mp4"
            style={{
              width: "100%",
              maxWidth: videoMaxWidth,
              borderRadius: 24,
            }}
            autoPlay
            playsInline
            muted
            loop
          />
        </div>

        {/* ТЕКСТ И КНОПКА */}
        <div
          style={{
            textAlign: "center",
            marginTop: 35,
            padding: "0 20px",
          }}
        >
          <div
            style={{
              fontWeight: 700,
              fontSize: "22px",
              color: NORA_COLOR,
              marginBottom: 14,
            }}
          >
            Ждёте малыша? Я помогу!
          </div>
          <div
            style={{
              fontWeight: 400,
              fontSize: "15px",
              lineHeight: "1.75",
              color: NORA_COLOR,
              maxWidth: 420,
              margin: "0 auto 0 auto",
            }}
          >
            Я помогаю будущим мамам на каждом этапе беременности: отвечаю на
            вопросы, напоминаю о важных делах, слежу за самочувствием и даю
            советы, основанные на медицине Великобритании NHS.
          </div>
          <div style={{ marginTop: 35 }}>
            <button
              style={{
                background: BABY_GRADIENT,
                border: "none",
                color: "#fff",
                borderRadius: borderRadius,
                fontWeight: 700,
                fontSize: 17,
                padding: "15px 40px",
                boxShadow: "0 2px 18px rgba(200,128,140,0.12)",
                cursor: "pointer",
              }}
              onClick={() => setShowWelcome(false)}
            >
              Начать пользоваться{" "}
              <span style={{ marginLeft: 7 }}>{ICONS.arrowRight}</span>
            </button>
            <div
              style={{
                fontSize: 13,
                color: "#7c8792",
                marginTop: 8,
              }}
            >
              Попробуйте — это быстро и бесплатно
            </div>
          </div>
        </div>

        {/* ТОЛЬКО ИСПРАВЛЕННЫЙ БЛОК */}
        <HowItWorks />
      </div>
    );

  return <div>Здесь будет чат</div>;
};

export default Chat;
