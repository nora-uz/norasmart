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

const IconShield = (
  <svg width="17" height="17" fill="none" viewBox="0 0 22 22">
    <path d="M11 3.3C7.1 5 4.6 5.5 3.7 5.7c-.1 0-.2 0-.2.2 0 6.8 2.6 11.2 7.1 12.7.2.1.4.1.6 0 4.5-1.5 7.1-5.8 7.1-12.7 0-.2-.1-.2-.2-.2-.9-.2-3.4-.7-7.1-2.4Z" stroke="#5a6573" strokeWidth="1.35" fill="#f2f7fe"/>
  </svg>
);

// ...IconPartner, IconContact, ICONS, BENEFITS, REVIEWS, PREMADE_THEMES: всё как ранее...

const PremadeThemesPanel = ({ disabled, onSend }: { disabled: boolean, onSend: (q: string) => void }) => (
  <div style={{
    width: "100%",
    maxWidth: maxWidth,
    margin: "18px auto 18px auto",
    padding: "0 7px",
    boxSizing: 'border-box' as const,
    display: "flex",
    justifyContent: "center"
  }}>
    <div
      style={{
        width: "100%",
        maxWidth: maxWidth,
        boxSizing: 'border-box' as const,
        display: "flex",
        flexDirection: "column",
        gap: 15,
      }}>
      <div style={{ fontWeight: 700, fontSize: "17px", color: NORA_COLOR, marginBottom: 10, textAlign: "center" }}>
        Часто задаваемые темы
      </div>
      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: 11,
      }}>
        {PREMADE_THEMES.map(({ emoji, title, desc, question }, idx) => (
          <button
            key={idx}
            style={{
              background: "#fff",
              borderRadius: 19,
              border: "1px solid #e1e9f5",
              boxShadow: "0 1px 10px rgba(155,155,175,0.06)",
              padding: "16px 16px",
              display: "flex",
              alignItems: "center",
              gap: 16,
              cursor: disabled ? "not-allowed" : "pointer",
              opacity: disabled ? 0.55 : 1,
              transition: "opacity 0.13s"
            }}
            disabled={disabled}
            onClick={() => onSend(question)}
          >
            <span style={{ fontSize: 29, marginRight: 2, flexShrink: 0 }}>{emoji}</span>
            <div style={{ textAlign: "left", flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: NORA_COLOR, marginBottom: 2 }}>
                {title}
              </div>
              <div style={{ fontWeight: 400, fontSize: 13, color: "#7c8792" }}>
                {desc}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  </div>
);

// ...WhyNoraBlock, ReviewBlock, Footer, FooterGap — без изменений...

// ...splitBotTextTwoBlocks, HowItWorks — без изменений...

const Chat = () => {
  // ...все useState и обработчики — как раньше...

  // --- Чат-экран ---
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
      {/* Панель */}
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
        boxSizing: 'border-box' as const, zIndex: 1,
        fontFamily: "'Manrope', Arial, Helvetica, sans-serif"
      }}>
        {/* ...блок заголовок и экшн-кнопки */}
      </div>

      {/* Блок часто задаваемых тем — теперь ниже панели, с новыми отступами */}
      <PremadeThemesPanel
        disabled={loading || !!botProgress}
        onSend={(q) => {
          if (!loading && !botProgress) {
            sendMessageToGPT(q);
          }
        }}
      />

      {/* ...остальной чат и input без изменений */}
      {/* ...userMessageStyle как раньше, boxSizing: 'border-box' as const */}
      {/* ...footer, gap, все остальные части без изменений */}
    </div>
  );
};

export default Chat;
