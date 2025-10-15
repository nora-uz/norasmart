"use client";
import React, { useState, useEffect, useRef } from "react";

// Цвета на основе фирменной палитры
const NORA_COLOR = "#26151b";
const PRIMARY_PURPLE = "#7f69a4";
const ACCENT_PURPLE = "#a39bce";
const LIGHT_BG = "#e3e8f0";
const maxWidth = 560;
const borderRadius = 22;
const panelHeight = 62;
const INPUT_BAR_HEIGHT = 68;

const ICON_SIZE = 23;
const BANNER = "/img.webp";

const ICONS = {
  telegram: "https://cdn-icons-png.flaticon.com/512/1946/1946547.png",
  trash: "https://cdn-icons-png.flaticon.com/512/1345/1345823.png",
  share: "https://cdn-icons-png.flaticon.com/512/535/535285.png",
  arrowRight: (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path
        d="M6 11H16M16 11L12 7M16 11L12 15"
        stroke={PRIMARY_PURPLE}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
};
const filterPanel = "brightness(0) saturate(100%) invert(27%) sepia(20%) saturate(916%) hue-rotate(219deg) brightness(87%) contrast(95%)";

const FEEDBACKS_NORA = [
  { name: "Людмила", text: "С Норой я перестала переживать по пустякам — теперь любые вопросы решаю за пару минут!" },
  { name: "Екатерина", text: "Очень удобно: напомнила про посещение врача, подсказала питание по моему анализу — чувствую себя спокойнее!" },
  // ... остальные отзывы ...
];

function filterAsterisks(str) {
  return str.replace(/\*/g, "");
}
function splitBotText(text) {
  if (!text) return [];
  return text.replace(/\r\n/g, "\n").split(/\n{2,}/).map(s => s.trim()).filter(Boolean);
}

type Message = { text: string; sender: "user" | "bot" };
const THREAD_KEY = "nora_thread_id";

const FeedbackBubblesNora = ({ visible }) => { /* ... без изменений ... */ };

const Chat = () => {
  // ... все useState/useEffect и функции — без изменений ...

  return (
    <div
      style={{
        background: LIGHT_BG,
        width: "100vw",
        height: "100vh",
        overflow: "auto",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        boxSizing: "border-box"
      }}>
      {/* Верхняя панель БЕЗ ФОНА */}
      <div style={{
        width: "calc(100% - 40px)",
        maxWidth,
        minHeight: panelHeight,
        background: "transparent",
        color: PRIMARY_PURPLE,
        margin: "20px auto 0 auto",
        display: "flex", alignItems: "center",
        borderRadius: borderRadius,
        paddingLeft: 20, paddingRight: 12, paddingTop: 5, paddingBottom: 5,
        justifyContent: "flex-start", boxSizing: "border-box", zIndex: 1, boxShadow: "none"
      }}>
        <div style={{
          marginRight: 10,
          display: "flex", flexDirection: "column", justifyContent: "center", minWidth: 0
        }}>
          <span style={{
            fontWeight: 800, fontSize: "19px", lineHeight: 1.06,
            whiteSpace: "nowrap", marginBottom: 7,
            color: PRIMARY_PURPLE
          }}>Nora Plus</span>
          <span style={{
            fontWeight: 400, fontSize: "13px",
            color: PRIMARY_PURPLE, lineHeight: 1.04, whiteSpace: "nowrap"
          }}>Ассистент для будущих мам</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: "auto" }}>
          <button style={{
            background: "transparent", border: "none", cursor: "pointer",
            width: 38, height: 38, borderRadius: 19,
            display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            <img src={ICONS.share} alt="Share"
              style={{ width: ICON_SIZE, height: ICON_SIZE, filter: filterPanel }} />
          </button>
          <button style={{
            background: "transparent", border: "none", cursor: "pointer",
            width: 38, height: 38, borderRadius: 19,
            display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            <img src={ICONS.telegram} alt="Telegram"
              style={{ width: ICON_SIZE, height: ICON_SIZE, filter: filterPanel }} />
          </button>
          <button style={{
            background: "transparent", border: "none", cursor: "pointer",
            width: 38, height: 38, borderRadius: 19,
            display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            <img src={ICONS.trash} alt="Trash"
              style={{ width: ICON_SIZE, height: ICON_SIZE, filter: filterPanel }} />
          </button>
        </div>
      </div>

      {/* Welcome-экран */}
      {showWelcome ? (
        <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
          <div style={{ width: "100%", maxWidth }}>
            <div style={{ height: 30 }} />
            <div style={{
              width: "100%",
              display: "flex",
              justifyContent: "center"
            }}>
              <img
                src={BANNER}
                alt="Nora Plus баннер"
                style={{
                  width: "100%",
                  maxWidth: maxWidth - 40, // по 20px отступ по бокам
                  marginLeft: 20,
                  marginRight: 20,
                  height: "auto",
                  display: "block",
                  objectFit: "contain",
                  objectPosition: "center"
                }}
              />
            </div>
            <div style={{ height: 37 }} />
            <div style={{ textAlign: "center" }}>
              <div style={{
                fontWeight: 400,
                fontSize: "16px",
                margin: "0 auto",
                maxWidth: 400,
                padding: "0 20px",
                lineHeight: 1.75,
                color: NORA_COLOR,
                display: "inline-block"
              }}>
                Нора — это виртуальный ассистент и помощник для беременных, который помогает будущим мамам чувствовать себя уверенно и спокойно на каждом этапе беременности.
              </div>
            </div>
            <div style={{ height: 37 }} />
            <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
              <button style={{
                background: "transparent",
                color: PRIMARY_PURPLE,
                border: `2px solid ${PRIMARY_PURPLE}`,
                borderRadius: borderRadius,
                fontWeight: 700,
                fontSize: "17px",
                padding: "15px 0",
                maxWidth: 290,
                width: "100%",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                <span style={{
                  display: "flex", alignItems: "center", justifyContent: "center", color: PRIMARY_PURPLE
                }}>
                  Начать пользоваться&nbsp;{ICONS.arrowRight}
                </span>
              </button>
            </div>
            <div style={{ height: 37 }} />
            <FeedbackBubblesNora visible={showWelcome} />
            <div style={{ height: 24 }} />
          </div>
        </div>
      ) : (
        // Чат-интерфейс
        <div style={{
          width: "100%",
          maxWidth,
          margin: "0 auto",
          flex: 1,
          overflowY: "auto",
          paddingBottom: INPUT_BAR_HEIGHT + 20,
          minHeight: 200
        }}>
          {/* ... остальные части чата — по вашему коду ... */}
        </div>
      )}
    </div>
  );
};

export default Chat;
