"use client";
import React, { useState, useEffect, useRef } from "react";

// ... все твои константы и SVG иконки ...

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

// --- "Как работает Нора" с тайпингом, хвостиками и отступом ---
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
            {qText}<span style={{opacity:0.19}}>{phase==="typeQ"&&"_"}</span>
            <BubbleTailRight />
          </div>
        )}
        {aText && (
          <div style={{
            position: "relative", alignSelf: "flex-start",
            background: "#fff", color: NORA_COLOR, // пузырь для ответа — тоже белый, чтобы с хвостиком выглядело аккуратно
            borderRadius: 19, fontSize: 15, fontWeight: 400,
            padding: "12px 18px", minHeight: 26,
            boxShadow: "0 1px 8px 0 rgba(200,180,200,0.09)",
            maxWidth: 340, letterSpacing: "0.015em"
          }}>
            {aText}<span style={{opacity:0.19}}>{phase==="typeA"&&"_"}</span>
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

// --- Функционал welcome-экрана: с панелью и новым блоком ---
const WelcomePanel = ({setShowWelcome}) => (
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
    {/* Кнопка только для демонстрации (убери если не нужна) */}
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: 16 }}>
      <button style={{
        background: "transparent", border: "none", cursor: "pointer",
        width: 38, height: 38, borderRadius: 19,
        display: "flex", alignItems: "center", justifyContent: "center"
      }} onClick={() => setShowWelcome(false)}>
        <span>→</span>
      </button>
    </div>
  </div>
);

// ... WhyNoraBlock, ReviewBlock, Footer как раньше ...

// --- основной компонент ---
const Chat = () => {
  const [showWelcome, setShowWelcome] = useState(true);

  // ... остальной код, как раньше ...

  if (showWelcome) {
    return (
      <div style={{
        fontFamily: "'Manrope', Arial, Helvetica, sans-serif",
        background: "#f8fdff",
        width: "100vw",
        minHeight: "100vh"
      }}>
        <WelcomePanel setShowWelcome={setShowWelcome} />
        {/* остальной welcome-экран как раньше */}
        {/* ... */}
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
          {/* Кнопка если нужна */}
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
            </div>
          </div>
          <div style={{ height: 40 }} />
          <NoraHowItWorksBlock />
          {/* ... WhyNoraBlock, ReviewBlock, Footer ... */}
        </div>
      </div>
    );
  }

  // ... основной чат-экран как раньше ...
};

export default Chat;
