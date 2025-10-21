"use client";
import React, { useState, useEffect, useRef } from "react";

// ... все предыдущие константы и иконки остаются ...

// SVG иконка для политики (минималистичная)
const IconPolicy = (
  <svg width="16" height="16" fill="none" viewBox="0 0 20 20" style={{marginRight: 6}}>
    <path d="M4 4.5V10c0 5 7 6.5 7 6.5s7-1.5 7-6.5v-5.5l-7-2-7 2Z" stroke="#4d5762" strokeWidth="1.5" fill="none"/>
  </svg>
);

// ====== Новый блок "Как работает Нора?" ======
const NoraHowItWorksBlock = () => {
  // примитивная текстовая имитация переписки + базовая анимация появления
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (step < QA.length-1) {
      const timer = setTimeout(() => setStep(step+1), 1700);
      return () => clearTimeout(timer);
    }
  }, [step]);
  const QA = [
    { q: "Что делать при тошноте на ранних сроках?", a: "Nora: Спокойно! Вот простые советы, чтобы стало легче: отдых, вода и дробное питание." },
    { q: "Когда сдавать анализы?", a: "Nora: Я напомню! Введи ПДР — и подарю персональный календарь важного." },
    { q: "Не хочу забыть про витамины!", a: "Nora: Сделаю расписание и буду напоминать вовремя!" }
  ];
  return (
    <div
      style={{
        width: `calc(100% - ${BLOCK_SIDE_PADDING * 2}px)`,
        maxWidth,
        margin: "0 auto 38px auto",
        background: "#fff",
        borderRadius: borderRadius,
        boxShadow: "0 3px 16px 0 rgba(150,175,205,0.10)",
        padding: `22px ${BLOCK_SIDE_PADDING}px`,
        fontFamily: "'Manrope', Arial, Helvetica, sans-serif"
      }}
    >
      <div style={{fontWeight: 700, fontSize: 20, color: NORA_COLOR, textAlign: "center", marginBottom: 13}}>
        Как работает Nora?
      </div>
      <div>
        {QA.map((item, idx) => idx <= step &&
          <div key={idx} style={{marginBottom: 19, opacity: idx === step ? 1 : 0.8, transition: "opacity 0.4s"}}>
            <div style={{
              background: "#eef7ff",
              color: "#147bdd",
              padding: "13px 14px",
              borderRadius: 15,
              maxWidth: 340,
              fontWeight: 500,
              display: "inline-block"
            }}>
              Вы: {item.q}
            </div>
            <div style={{
              marginTop: 7,
              background: "#fffde4",
              color: "#9d5a7a",
              padding: "13px 14px",
              borderRadius: 15,
              maxWidth: 340,
              fontWeight: 500,
              display: "inline-block",
              boxShadow: "0 2px 8px 0 rgba(220,180,215,0.06)"
            }}>
              {item.a}
            </div>
          </div>
        )}
      </div>
      <div style={{fontSize: 13, color: "#6e7c85", textAlign: "center"}}>
        Просто задайте вопрос — Нора найдёт решение!
      </div>
    </div>
  );
};

// ===== Вариант футера с иконкой и убранным жирным =====
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
    }}>{IconPolicy} Политика конфиденциальности</a>
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

// ...далее без изменений, вставь компонент <NoraHowItWorksBlock /> после главной кнопки - как новый блок!

// Основной блок welcome-экрана:
if (showWelcome) {
  return (
    <div
      style={{
        fontFamily: "'Manrope', Arial, Helvetica, sans-serif",
        background: "#f8fdff",
        width: "100vw",
        minHeight: "100vh"
      }}>
      {/* ...панель и приветствие, не меняется... */}
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
        {/* Здесь сокращённое описание: */}
        <div style={{
          fontWeight: 400, fontSize: "15px", margin: "0 auto 0 auto", maxWidth: 400,
          padding: "0 18px",
          lineHeight: 1.75, color: NORA_COLOR, display: "inline-block"
        }}>
          Я помогаю будущим мамам: отвечаю на вопросы, напоминаю о важных делах, слежу за самочувствием.
        </div>
        <div style={{ height: 40 }} />
        {/* Кнопка и подпись */}
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
        {/* Вставляем новый блок прямо под кнопкой */}
        <NoraHowItWorksBlock />  
        <WhyNoraBlock />
        <ReviewBlock />
        <Footer />
        <FooterGap />
      </div>
    </div>
  );
}

// ...остальной код без изменений...

export default Chat;
