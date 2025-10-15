"use client";
import React, { useState, useEffect, useRef } from "react";

const NORA_COLOR = "#2e2e2e";
const ICON_SIZE = 23;
const BANNER = "/img.webp"; // ← теперь используем новый баннер
const borderRadius = 22;
const panelHeight = 62;
const maxWidth = 560;
const GRADIENT = "linear-gradient(90deg, #eff5fe 0%, #e5e8ed 100%)";
const INPUT_BAR_HEIGHT = 68;
const NORA_BOX_SHADOW = "0 3px 22px 0 rgba(46,46,46,0.12)";
const NORA_BORDER = "1.2px solid #e5e8ed";
const FEEDBACK_BUBBLE_RADIUS = 21;

const ICONS = {
  telegram: "https://cdn-icons-png.flaticon.com/512/1946/1946547.png",
  trash: "https://cdn-icons-png.flaticon.com/512/1345/1345823.png",
  share: "https://cdn-icons-png.flaticon.com/512/535/535285.png",
  arrowRight: (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path d="M6 11H16M16 11L12 7M16 11L12 15"
        stroke={NORA_COLOR}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
};
const filterNora = "invert(13%) sepia(4%) saturate(271%) hue-rotate(175deg) brightness(92%) contrast(93%)";

// ... (FEEDBACKS_NORA, filterAsterisks, splitBotText, THREAD_KEY, FeedbackBubblesNora остаются прежними)

const Chat = () => {
  // ... (useState, useEffect, handleShare, sendMessageToGPT, handleSendMessage, clearChatAll — без изменений)

  return (
    <div
      style={{
        background: "#f8fdff",
        width: "100vw",
        height: "100vh",
        overflow: "auto",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        boxSizing: "border-box"
      }}>
      {/* Верхняя панель */}
      <div style={{
        width: "calc(100% - 40px)",
        maxWidth,
        minHeight: panelHeight,
        background: GRADIENT,
        color: NORA_COLOR,
        margin: "20px auto 0 auto",
        display: "flex", alignItems: "center",
        borderRadius: borderRadius,
        paddingLeft: 20, paddingRight: 12, paddingTop: 5, paddingBottom: 5,
        justifyContent: "flex-start", boxSizing: "border-box", zIndex: 1, boxShadow: "none"
      }}>
        <div style={{
          marginRight: 10, color: NORA_COLOR,
          display: "flex", flexDirection: "column", justifyContent: "center", minWidth: 0
        }}>
          <span style={{
            fontWeight: 800, fontSize: "19px", lineHeight: 1.06,
            whiteSpace: "nowrap", marginBottom: 7
          }}>Nora Plus</span>
          <span style={{
            fontWeight: 400, fontSize: "13px",
            color: "#565656", lineHeight: 1.04, whiteSpace: "nowrap"
          }}>Ассистент для будущих мам</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: "auto" }}>
          <button style={{
            background: "transparent", border: "none", cursor: "pointer",
            width: 38, height: 38, borderRadius: 19,
            display: "flex", alignItems: "center", justifyContent: "center"
          }} onClick={handleShare}>
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
          }} onClick={clearChatAll}>
            <img src={ICONS.trash} alt="Trash"
              style={{ width: ICON_SIZE, height: ICON_SIZE, filter: filterNora }} />
          </button>
        </div>
      </div>
      {/* Содержимое welcome-экрана */}
      {showWelcome ? (
        <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
          <div style={{ width: "100%", maxWidth }}>
            <div style={{ height: 37 }} />
            <div style={{ display: "flex", justifyContent: "center" }}>
              <img src={BANNER} alt="Nora Plus баннер" style={{
                width: "100%", maxWidth: "300px", height: "auto", display: "block",
                objectFit: "contain", objectPosition: "center"
              }} />
            </div>
            <div style={{ height: 37 }} />
            <div style={{ textAlign: "center" }}>
              <div style={{
                fontWeight: 400, fontSize: "16px", margin: "0 auto", maxWidth: 400,
                padding: "0 20px", lineHeight: 1.75,
                color: NORA_COLOR,
                display: "inline-block"
              }}>
                Нора — это виртуальный ассистент и помощник для беременных, который помогает будущим мамам чувствовать себя уверенно и спокойно на каждом этапе беременности.
              </div>
            </div>
            <div style={{ height: 37 }} />
            <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
              <button style={{
                background: GRADIENT,
                color: NORA_COLOR,
                border: "none",
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
              }} onClick={() => setShowWelcome(false)}>
                <span style={{
                  display: "flex", alignItems: "center", justifyContent: "center"
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
          {chatHistory.map((msg, idx) => (
            <div key={idx} style={{ display: "flex", width: "100%", justifyContent: msg.sender === "user" ? "flex-end" : "flex-start" }}>
              <div style={{ margin: "20px", maxWidth: 450, alignSelf: msg.sender === "user" ? "flex-end" : "flex-start" }}>
                {msg.sender === "user" ? (
                  <span style={{
                    background: NORA_COLOR,
                    color: "#fff",
                    borderRadius: 16,
                    padding: "18px 20px",
                    lineHeight: 1.7,
                    fontSize: 17,
                    minWidth: 0,
                    boxShadow: "0 2px 14px 0 rgba(46,46,46,0.09)",
                    maxWidth: "100%",
                    display: "inline-block",
                    fontWeight: 400,
                    wordBreak: "break-word"
                  }}>
                    {msg.text}
                  </span>
                ) : (
                  <div>
                    {splitBotText(msg.text).map((part, i) => (
                      <p key={i} style={{
                        margin: "0 0 20px 0",
                        fontWeight: 400,
                        color: NORA_COLOR,
                        fontSize: 17,
                        lineHeight: 1.8,
                        wordBreak: "break-word"
                      }}>
                        {part}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {/* Печатание ответа */}
          {botProgress && (
            <div style={{ display: "flex", width: "100%", justifyContent: "flex-start" }}>
              <div style={{ margin: "20px", maxWidth: 450 }}>
                {splitBotText(botProgress).map((part, i) => (
                  <p key={i} style={{
                    margin: "0 0 20px 0",
                    fontWeight: 400,
                    color: NORA_COLOR,
                    fontSize: 17,
                    lineHeight: 1.8,
                    wordBreak: "break-word"
                  }}>
                    {part}
                  </p>
                ))}
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
          {/* Инпут бар */}
          <div style={{
            position: "fixed",
            bottom: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: "100vw",
            maxWidth,
            padding: "10px 20px",
            boxSizing: "border-box",
            display: "flex",
            alignItems: "center",
            zIndex: 9,
            height: INPUT_BAR_HEIGHT
          }}>
            <input
              value={message}
              onChange={e => setMessage(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSendMessage()}
              placeholder="Введите ваше сообщение..."
              style={{
                flex: 1,
                borderRadius: 17,
                border: "1.2px solid #e8eaf1",
                fontSize: 16,
                padding: "14px 18px",
                outline: "none",
                marginRight: 10
              }}
              disabled={loading}
            />
            <button
              onClick={handleSendMessage}
              disabled={loading || !message.trim()}
              style={{
                background: GRADIENT,
                color: NORA_COLOR,
                border: "none",
                borderRadius: 17,
                fontWeight: 700,
                fontSize: 16,
                padding: "12px 22px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              {ICONS.arrowRight}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
