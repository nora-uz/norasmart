"use client";

import React, { useState, useEffect, useRef } from "react";

// Путь к фото ребёнка (замени на актуальный если нужно)
const BABY_IMG = "/1000004249-removebg-preview-1.jpg";

// Описания для каждого месяца
const BABY_DESCRIPTIONS = [
  "Сейчас малыш похож на маленькое зернышко, но с каждым днём быстро развивается.",
  "Малыш активно растёт, формируются основные органы.",
  "Вы заметите первые движения, развивается нервная система.",
  "Формируются черты лица, малыш может шевелиться.",
  "Начинает слышать звуки, кожа становится плотнее.",
  "Малыш реагирует на свет и звук, развивается мозг.",
  "Увеличивается вес и рост, образуются рефлексы.",
  "Все органы сформированы, малыш активно двигается.",
  "Готовится к рождению, занимает конечное положение."
];

const THEMES = [
  { title: "Здоровье", icon: "❤️", desc: "О здоровье мамы и малыша" },
  { title: "Питание", icon: "🥗", desc: "Рекомендации по питанию" },
  { title: "Депрессия", icon: "🙂", desc: "Эмоциональное состояние" },
  { title: "Усталость", icon: "😞", desc: "Проблемы с усталостью" }
];

const weights = [46, 47, 48];
const heights = [154, 155, 156];

const NoraOnboarding: React.FC = () => {
  const [step, setStep] = useState(0);

  // Анкета
  const [month, setMonth] = useState<number>(5);
  const [weight, setWeight] = useState<number>(47);
  const [height, setHeight] = useState<number>(155);

  // Для чата
  const [userMsg, setUserMsg] = useState("");
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);

  // ----- Первый экран -----
  if (step === 0) {
    return (
      <div style={pageStyle}>
        <img src={BABY_IMG} alt="Ребёнок" style={imgStyle} />
        <h2 style={{ fontWeight: 700, textAlign: "center", marginTop: 40 }}>Добро пожаловать в Nora AI</h2>
        <p style={{ textAlign: "center", fontSize: 20, margin: "20px 0" }}>
          Я помогаю будущим мамам на каждом этапе беременности: отвечаю на вопросы, напоминаю о важных делах,
          слежу за самочувствием и даю полезные советы, основанные на медицине и заботе.
        </p>
        <button style={btnStyle} onClick={() => setStep(1)}>Начать пользоваться</button>
      </div>
    );
  }

  // ----- Второй экран -----
  if (step === 1) {
    return (
      <div style={pageStyle}>
        <img src={BABY_IMG} alt="Ребёнок" style={imgStyle} />
        <h2 style={{ fontWeight: 700, textAlign: "center", marginTop: 40 }}>Заполните, для точных ответов.</h2>
        <div style={{ display: "flex", gap: 12, margin: "20px 0", justifyContent: "center" }}>
          {/* Месяцы */}
          <div style={cardStyle}>
            <div>Срок беременности:</div>
            <div style={{ display: "flex", gap: 6, marginTop: 12 }}>
              {[4, 5, 6].map(m => (
                <div
                  key={m}
                  style={{
                    ...selectStyle,
                    background: month === m ? "#F2A5A5" : "#fff",
                    color: month === m ? "#fff" : "#222"
                  }}
                  onClick={() => setMonth(m)}
                >
                  {m}
                </div>
              ))}
            </div>
          </div>
          {/* Вес */}
          <div style={cardStyle}>
            <div>Укажите ваш вес:</div>
            <div style={{ display: "flex", gap: 6, marginTop: 12 }}>
              {weights.map(w => (
                <div
                  key={w}
                  style={{
                    ...selectStyle,
                    background: weight === w ? "#F2F4F7" : "#fff",
                    color: "#222"
                  }}
                  onClick={() => setWeight(w)}
                >
                  {w}
                </div>
              ))}
            </div>
          </div>
          {/* Рост */}
          <div style={cardStyle}>
            <div>Укажите ваш рост:</div>
            <div style={{ display: "flex", gap: 6, marginTop: 12 }}>
              {heights.map(h => (
                <div
                  key={h}
                  style={{
                    ...selectStyle,
                    background: height === h ? "#F2F4F7" : "#fff",
                    color: "#222"
                  }}
                  onClick={() => setHeight(h)}
                >
                  {h}
                </div>
              ))}
            </div>
          </div>
        </div>
        <button style={btnStyle} onClick={() => setStep(2)}>Далее</button>
        <button
          style={{ ...btnStyle, background: "#ECECEC", color: "#333", marginTop: 8 }}
          onClick={() => setStep(0)}
        >
          На главную страницу
        </button>
      </div>
    );
  }

  // ----- Третий экран -----
  if (step === 2) {
    return (
      <div style={pageStyle}>
        <div style={{ position: "relative", textAlign: "center", marginBottom: 16 }}>
          <img src={BABY_IMG} alt="Ребёнок" style={imgStyle} />
          <div style={{
            position: "absolute", left: "50%", top: "22%", transform: "translate(-50%, 0)",
            background: "#F2A5A5", padding: "18px 28px",
            borderRadius: 25, fontSize: 20, color: "#fff", fontWeight: 500, width: 320,
            maxWidth: "calc(100vw - 40px)", boxSizing: "border-box"
          }}>
            {BABY_DESCRIPTIONS[month-1]}
          </div>
          <div style={{
            position: "absolute", right: "10%", top: "58%",
            background: "#F2A5A5", color: "#fff", padding: "10px 20px",
            borderRadius: 20, fontSize: 22, fontWeight: 700
          }}>
            Ваш срок <br /> беременности <span style={{ fontSize: 32 }}>{month}</span>
          </div>
        </div>
        <h2 style={{ textAlign: "center", fontWeight: 700, marginBottom: 30 }}>
          Что хотите обсудить сегодня?
        </h2>
        {/* Темы обсуждения */}
        <div style={{
          display: "flex", flexWrap: "wrap", gap: 18, justifyContent: "center",
          maxWidth: 700, margin: "0 auto 24px"
        }}>
          {THEMES.map((t, idx) => (
            <div
              key={t.title}
              style={{
                background: "#F7F8FA", borderRadius: 19,
                boxShadow: selectedTheme === t.title ? "0 0 0 2px #F2A5A5 inset" : "none",
                padding: "22px 28px", width: 240, cursor: "pointer"
              }}
              onClick={() => setSelectedTheme(t.title)}
            >
              <div style={{ fontWeight: 700, fontSize: 21, marginBottom: 7 }}>
                {t.title} <span style={{ marginLeft: 12, fontSize: 22 }}>{t.icon}</span>
              </div>
              <div style={{ color: "#444" }}>{BABY_DESCRIPTIONS[month-1]}</div>
            </div>
          ))}
        </div>
        {/* Поле ввода вопроса */}
        <div style={{
          display: "flex", alignItems: "center", maxWidth: 600, margin: "0 auto",
          gap: 12, borderRadius: 22, background: "#F7F8FA", padding: "10px 28px"
        }}>
          <input
            style={{
              flex: 1, border: "none", fontSize: 26,
              background: "transparent", color: "#222"
            }}
            placeholder="Введите вопрос..."
            value={userMsg}
            onChange={e => setUserMsg(e.target.value)}
          />
          <button
            style={{
              border: "none", background: "none", color: "#F2A5A5",
              fontSize: 36, cursor: "pointer"
            }}
          >✈️</button>
        </div>
      </div>
    );
  }

  return null;
};

// ---- Стили ----
const pageStyle = { background: "#F8FBFC", minHeight: "100vh", width: "100vw", padding: "32px 0", position: "relative" } as React.CSSProperties;
const imgStyle = { width: 230, height: 230, objectFit: "contain", display: "block", margin: "0 auto" };
const btnStyle = { background: "linear-gradient(90deg,#F2A5A5,#F2A5A5)", color: "#fff", borderRadius: 19, height: 58, fontWeight: 600, fontSize: 22, border: "none", margin: "30px auto", display: "block", width: 340, cursor: "pointer" };
const cardStyle = { background: "#F7F8FA", borderRadius: 17, padding: "12px 24px", minWidth: 110, fontSize: 19, color: "#222", textAlign: "center", marginRight: 8 } as React.CSSProperties;
const selectStyle = { borderRadius: 13, padding: "8px 0", fontWeight: 700, fontSize: 32, minWidth: 50, textAlign: "center", margin: "0 2px", cursor: "pointer" } as React.CSSProperties;

export default NoraOnboarding;
