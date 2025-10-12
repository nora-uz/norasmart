"use client";

import React, { useState } from "react";

// Используем актуальную фотографию малыша
const BABY_IMG = "/1000004249-removebg-preview-1.jpg";

// Описания по месяцам
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

// Темы для 3-го этапа
const THEMES = [
  { title: "Здоровье", icon: "💉" },
  { title: "Питание", icon: "🍎" },
  { title: "Депрессия", icon: "😊" },
  { title: "Усталость", icon: "😴" }
];

const weights = [46, 47, 48];
const heights = [154, 155, 156];

export default function NoraDesign() {
  const [step, setStep] = useState(0);

  // Данные анкеты
  const [month, setMonth] = useState<number>(5);
  const [weight, setWeight] = useState<number>(47);
  const [height, setHeight] = useState<number>(155);

  // Для чата
  const [userMsg, setUserMsg] = useState("");
  const [selectedTheme, setSelectedTheme] = useState<string | null>("");

  // ----------- ЭКРАН 1: Nora рассказывает о себе ---------------
  if (step === 0) {
    return (
      <div style={rootStyle}>
        {/* Центральная картинка и плашка самое главное */}
        <div style={{ position: "relative", width: "100%", display: "flex", justifyContent: "center" }}>
          <img
            src={BABY_IMG}
            alt="Ребенок"
            style={{ width: 300, height: 300, objectFit: "contain", display: "block", marginTop: 40 }}
          />
          {/* Плашка с описанием сверху */}
          <div style={{
            position: "absolute", top: 16, left: "50%", transform: "translateX(-50%)",
            background: "#F3A3A3", color: "#fff", borderRadius: 27, padding: "24px 30px",
            fontSize: 24, fontWeight: 500, boxSizing: "border-box", textAlign: "center", maxWidth: 390
          }}>
            {BABY_DESCRIPTIONS[month - 1]}
          </div>
          {/* Плашка с месяцем справа внизу */}
          <div style={{
            position: "absolute", right: 10, bottom: 40,
            background: "#F3A3A3", color: "#fff", padding: "12px 28px",
            borderRadius: 25, fontSize: 22, fontWeight: 700, minWidth: 130, textAlign: "center"
          }}>
            Ваш срок<br /> беременности <span style={{ fontSize: 34 }}>{month}</span>
          </div>
        </div>
        {/* Кнопка "далее" */}
        <div style={{ textAlign: "center", marginTop: 330 }}>
          <button
            style={mainBtn}
            onClick={() => setStep(1)}
          >Далее</button>
        </div>
      </div>
    );
  }

  // ----------- ЭКРАН 2: Анкета — срок, вес, рост ---------------
  if (step === 1) {
    return (
      <div style={rootStyle}>
        <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", marginTop: 40 }}>
          <img src={BABY_IMG} alt="Ребенок" style={{ width: 300, height: 300, objectFit: "contain", display: "block" }} />
        </div>
        <div style={{ textAlign: "center", fontWeight: 700, fontSize: 28, margin: "44px 0 28px 0" }}>
          Заполните, для точных ответов.
        </div>
        <div style={{
          display: "flex", gap: 34, justifyContent: "center", marginBottom: 38, flexWrap: "wrap"
        }}>
          {/* Месяц беременности */}
          <div style={bigCard}>
            <div style={{ fontSize: 19, marginBottom: 9 }}>Срок беременности:</div>
            <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
              {[4, 5, 6].map(m => (
                <div
                  key={m}
                  style={{
                    ...choiceBtn,
                    background: month === m ? "#F3A3A3" : "#fff",
                    color: month === m ? "#fff" : "#222"
                  }}
                  onClick={() => setMonth(m)}
                >{m}</div>
              ))}
            </div>
          </div>
          {/* Вес */}
          <div style={bigCard}>
            <div style={{ fontSize: 19, marginBottom: 9 }}>Укажите ваш вес:</div>
            <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
              {weights.map(w => (
                <div
                  key={w}
                  style={{
                    ...choiceBtn,
                    background: weight === w ? "#F7F8F8" : "#fff",
                    color: "#222"
                  }}
                  onClick={() => setWeight(w)}
                >{w}</div>
              ))}
            </div>
          </div>
          {/* Рост */}
          <div style={bigCard}>
            <div style={{ fontSize: 19, marginBottom: 9 }}>Укажите ваш рост:</div>
            <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
              {heights.map(h => (
                <div
                  key={h}
                  style={{
                    ...choiceBtn,
                    background: height === h ? "#F7F8F8" : "#fff",
                    color: "#222"
                  }}
                  onClick={() => setHeight(h)}
                >{h}</div>
              ))}
            </div>
          </div>
        </div>
        <div style={{ textAlign: "center", marginTop: 34 }}>
          <button style={mainBtn} onClick={() => setStep(2)}>Далее</button>
        </div>
        <div style={{ textAlign: "center", marginTop: 12 }}>
          <button
            style={{ ...mainBtn, background: "#ECECEC", color: "#333" }}
            onClick={() => setStep(0)}
          >На главную страницу</button>
        </div>
      </div>
    );
  }

  // ----------- ЭКРАН 3: Чат, темы, поле ввода ---------------
  if (step === 2) {
    return (
      <div style={rootStyle}>
        <div style={{ position: "relative", width: "100%", display: "flex", justifyContent: "center", height: 320, marginBottom: 14 }}>
          <img
            src={BABY_IMG}
            alt="Ребенок"
            style={{ width: 300, height: 300, objectFit: "contain", display: "block", marginTop: 40 }}
          />
          {/* Плашка с кратким описанием сверху */}
          <div style={{
            position: "absolute", top: 16, left: "50%", transform: "translateX(-50%)",
            background: "#F3A3A3", color: "#fff", borderRadius: 27, padding: "24px 30px",
            fontSize: 22, fontWeight: 500, boxSizing: "border-box", textAlign: "center", maxWidth: 370
          }}>
            {BABY_DESCRIPTIONS[month - 1]}
          </div>
          {/* Плашка со сроком беременности справа */}
          <div style={{
            position: "absolute", right: 10, bottom: 60,
            background: "#F3A3A3", color: "#fff", padding: "12px 28px",
            borderRadius: 25, fontSize: 22, fontWeight: 700, minWidth: 120, textAlign: "center"
          }}>
            Ваш срок<br /> беременности <span style={{ fontSize: 32 }}>{month}</span>
          </div>
        </div>
        {/* Вопрос: Что хотите обсудить? */}
        <div style={{
          textAlign: "center", fontWeight: 700, fontSize: 26, margin: "34px 0 38px 0"
        }}>
          Что хотите обсудить сегодня?
        </div>
        {/* Блок тем – карточки четыре в две строки */}
        <div style={{
          display: "flex", flexWrap: "wrap", gap: 22, justifyContent: "center", marginBottom: 30
        }}>
          {THEMES.map((t, idx) => (
            <div
              key={t.title}
              style={{
                background: "#F7F8FA",
                borderRadius: 19,
                boxShadow: selectedTheme === t.title ? "0 0 0 2px #F3A3A3 inset" : "none",
                padding: "24px 20px",
                minWidth: 180,
                maxWidth: 240,
                cursor: "pointer",
                fontWeight: 700,
                fontSize: 22,
                display: "flex",
                flexDirection: "column",
                alignItems: "center"
              }}
              onClick={() => setSelectedTheme(t.title)}
            >
              <span style={{ fontSize: 28, marginBottom: 8 }}>{t.icon}</span>
              <span>{t.title}</span>
              <span style={{ fontWeight: 400, fontSize: 15, marginTop: 5, textAlign: "center", color: "#666" }}>
                {BABY_DESCRIPTIONS[month - 1]}
              </span>
            </div>
          ))}
        </div>
        {/* Поле для ввода вопроса */}
        <div style={{
          display: "flex", alignItems: "center", maxWidth: 540, margin: "0 auto",
          padding: "14px 26px", background: "#F7F7FA", borderRadius: 23
        }}>
          <input
            style={{
              flex: 1, border: "none", fontSize: 26,
              background: "transparent", color: "#222", outline: "none"
            }}
            placeholder="Введите вопрос..."
            value={userMsg}
            onChange={e => setUserMsg(e.target.value)}
          />
          <button
            style={{
              border: "none", background: "none", color: "#F3A3A3",
              fontSize: 38, cursor: "pointer", marginLeft: 12
            }}
          >
            {/* Стилизуем в виде "отправить" — paper plane */}
            <span>✈️</span>
          </button>
        </div>
      </div>
    );
  }

  return null;
}

// ------- Стили максимально близкие к макету -------
const rootStyle = {
  background: "#F9FAFC",
  minHeight: "100vh",
  width: "100vw",
  position: "relative"
} as React.CSSProperties;

const mainBtn = {
  background: "linear-gradient(90deg,#F3A3A3,#F3A3A3)",
  color: "#fff",
  borderRadius: 23,
  height: 56,
  fontWeight: 600,
  fontSize: 22,
  border: "none",
  margin: "auto",
  display: "block",
  width: 340,
  cursor: "pointer"
};

const bigCard = {
  background: "#F7F8FA",
  borderRadius: 19,
  padding: "18px 24px",
  minWidth: 140,
  fontSize: 19,
  color: "#222",
  textAlign: "center",
  marginRight: 10,
  marginBottom: 12,
  boxShadow: "none"
} as React.CSSProperties;

const choiceBtn = {
  borderRadius: 11,
  padding: "10px 0",
  fontWeight: 700,
  fontSize: 36,
  minWidth: 54,
  textAlign: "center",
  margin: "0 4px",
  cursor: "pointer",
  transition: "background 0.18s, color 0.18s"
} as React.CSSProperties;

