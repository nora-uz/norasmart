"use client";

import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";

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
const filterNora = "invert(13%) sepia(4%) saturate(271%) hue-rotate(175deg) brightness(92%) contrast(93%)";

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
      fontFamily: "'Manrope', Arial, Helvetica, sans-serif",
    }}
  >
    <div style={{ padding: `21px 0 20px 0` }}>
      <div
        style={{
          fontWeight: 700,
          fontSize: "20px",
          color: NORA_COLOR,
          marginBottom: 20,
          textAlign: "center",
        }}
      >
        Почему Nora Plus?
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: CARD_GAP,
          padding: `0 ${BLOCK_SIDE_PADDING}px`,
        }}
      >
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
              textAlign: "left",
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
              <div style={{ fontSize: 13, color: "#3a3a3a", lineHeight: "1.64", textAlign: "left" }}>{text}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const PREGNANT_EMOJI = "🤰";
const REVIEWS = [
  {
    name: "Анна",
    badge: "2 месяц беременности",
    problem: "Токсикоз",
    text: "Nora Plus подсказала, как справиться с утренней тошнотой. Благодаря рекомендациям по питанию и режиму дня симптомы стали гораздо легче.",
  },
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
      fontFamily: "'Manrope', Arial, Helvetica, sans-serif",
    }}
  >
    <div style={{ padding: "21px 0 20px 0" }}>
      <div
        style={{
          fontWeight: 700,
          fontSize: "20px",
          color: NORA_COLOR,
          marginBottom: 20,
          textAlign: "center",
        }}
      >
        Отзывы будущих мам
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: CARD_GAP,
          padding: `0 ${BLOCK_SIDE_PADDING}px`,
        }}
      >
        {REVIEWS.map(({ name, badge, problem, text }, idx) => (
          <div
            key={idx}
            style={{
              position: "relative",
              background: "#fff",
              borderRadius: 18,
              boxShadow: "0 2px 18px 0 rgba(150,180,220,0.07)",
              padding: "19px 15px 19px 15px",
              textAlign: "left",
              overflow: "hidden",
            }}
          >
            <span
              style={{
                position: "absolute",
                right: 8,
                top: -5,
                fontSize: 180,
                opacity: 0.09,
                pointerEvents: "none",
                userSelect: "none",
                lineHeight: 1,
                zIndex: 0,
              }}
              aria-hidden="true"
            >
              {PREGNANT_EMOJI}
            </span>

            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 7 }}>
                <span style={{ fontWeight: 700, fontSize: 15, color: "#222" }}>{name}</span>
                <span
                  style={{
                    fontWeight: 500,
                    fontSize: 13,
                    color: "#fff",
                    padding: "4px 9px",
                    borderRadius: 12,
                    background: "#a48fcc",
                    whiteSpace: "nowrap",
                  }}
                >
                  {badge}
                </span>
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
  <>
    <div
      style={{
        width: `calc(100% - ${BLOCK_SIDE_PADDING * 2}px)`,
        maxWidth,
        margin: "0 auto 0 auto",
        padding: "22px 16px 22px 16px",
        background: GRADIENT,
        borderRadius: "22px",
        borderTopLeftRadius: "22px",
        borderTopRightRadius: "22px",
        boxShadow: "0 -4px 14px 0 rgba(155,175,205,0.06)",
        boxSizing: "border-box",
        fontFamily: "'Manrope', Arial, Helvetica, sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 13,
      }}
    >
      <div style={{ fontSize: 13, color: "#263540", fontWeight: 600, textAlign: "center", width: "100%" }}>
        Ташкент, Юнусабадский район, массив Кашгар 26
      </div>

      <div style={{ display: "flex", gap: 8, justifyContent: "center", width: "100%" }}>
        <a
          href="#"
          style={{
            background: BABY_GRADIENT,
            width: "120px",
            padding: "6px 0",
            borderRadius: 14,
            color: "#fff",
            fontWeight: 600,
            fontSize: 13,
            textDecoration: "none",
            textAlign: "center",
          }}
        >
          Стать партнёром
        </a>
        <a
          href="#"
          style={{
            background: BABY_GRADIENT,
            width: "120px",
            padding: "6px 0",
            borderRadius: 14,
            color: "#fff",
            fontWeight: 600,
            fontSize: 13,
            textDecoration: "none",
            textAlign: "center",
          }}
        >
          Связаться
        </a>
      </div>

      <div
        style={{
          background: "#fff",
          padding: "9px 0",
          width: "100%",
          borderRadius: 14,
          color: "#715b9b",
          fontWeight: 600,
          fontSize: 15,
          textDecoration: "none",
          border: "1px solid #e1e9f5",
          textAlign: "center",
          marginTop: 9,
        }}
      >
        Политика конфиденциальности
      </div>

      <div style={{ marginTop: 8, fontSize: 12, color: "#8a97a0", textAlign: "center", width: "100%" }}>
        © {new Date().getFullYear()} Nora Plus — забота и поддержка будущих мам
      </div>
    </div>

    <div style={{ height: 20 }} />
  </>
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
      { text: rest, bold: false },
    ];
  } else {
    return [{ text: cleaned, bold: true }];
  }
}

const Chat = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [message, setMessage] = useState("");

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Nora Plus — Ассистент для будущих мам",
        text: "Современный ассистент для будущих мам на базе NHS — все рекомендации по беременности в одном месте.",
        url: window.location.href,
      });
    } else {
      alert("Ваш браузер не поддерживает Web Share API");
    }
  };

  if (showWelcome) {
    return (
      <div
        style={{
          fontFamily: "'Manrope', Arial, Helvetica, sans-serif",
          background: "#f8fdff",
          width: "100vw",
          minHeight: "100vh",
        }}
      >
        {/* Панель */}
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
            paddingTop: 5,
            paddingBottom: 5,
            boxSizing: "border-box",
            zIndex: 1,
            fontFamily: "'Manrope', Arial, Helvetica, sans-serif",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", flex: 1, paddingLeft: 5 }}>
            <span
              style={{
                fontWeight: 800,
                fontSize: "19px",
                lineHeight: 1.06,
                whiteSpace: "nowrap",
                marginBottom: 7,
              }}
            >
              Nora Plus
            </span>

            <span
              style={{
                fontWeight: 400,
                fontSize: "13px",
                color: "#565656",
                lineHeight: 1.04,
                whiteSpace: "nowrap",
              }}
            >
              Ассистент для будущих мам
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: 16 }}>
            <button
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                width: 38,
                height: 38,
                borderRadius: 19,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              onClick={handleShare}
            >
              <img
                src={ICONS.share}
                alt="Share"
                style={{ width: ICON_SIZE, height: ICON_SIZE, filter: "brightness(0) invert(1)" }}
              />
            </button>
          </div>
        </div>

        <div style={{ height: 40 }} />

        {/* Центрированная кнопка */}
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <div style={{ width: "100%", maxWidth: 290 }}>
            <button
              style={{
                width: "100%",
                background: BABY_GRADIENT,
                color: "#fff",
                border: "none",
                borderRadius: borderRadius,
                fontWeight: 700,
                fontSize: "17px",
                padding: "15px 0",
                margin: "0 auto",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 2px 18px 0 rgba(200, 128, 140, 0.09)",
              }}
              onClick={() => setShowWelcome(false)}
            >
              Начать пользоваться&nbsp;
              <span style={{ marginLeft: 8, display: "flex", alignItems: "center" }}>{ICONS.arrowRight}</span>
            </button>

            <div style={{ fontSize: 13, color: "#7c8792", marginTop: 7, textAlign: "center" }}>
              Попробуйте — это быстро и бесплатно
            </div>
          </div>
        </div>

        <div style={{ height: 40 }} />
        <WhyNoraBlock />
        <ReviewBlock />
        <Footer />
      </div>
    );
  }

  return null;
};

export default Chat;
