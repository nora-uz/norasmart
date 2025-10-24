"use client";
import React, { useState, useEffect, useRef } from "react";

// --- Константы и иконки ---
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

const IconPartner = (
  <svg width="18" height="18" fill="none" viewBox="0 0 20 20">
    <circle cx="10" cy="6.5" r="3.3" stroke="#5a6573" strokeWidth="1.5"/>
    <path d="M2.8 16c.9-2.5 3.4-4.2 7.2-4.2s6.2 1.7 7.2 4.2"
          stroke="#5a6573" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);
const IconContact = (
  <svg width="18" height="18" fill="none" viewBox="0 0 20 20">
    <rect x="2.8" y="3.5" width="14.4" height="11" rx="2.2"
          stroke="#5a6573" strokeWidth="1.5"/>
    <path d="M3.5 4l6.5 6.1c.3.2.8.2 1.1 0L17 4"
          stroke="#5a6573" strokeWidth="1.5"/>
  </svg>
);
const ICONS = {
  telegram: "https://cdn-icons-png.flaticon.com/512/1946/1946547.png",
  trash: "https://cdn-icons-png.flaticon.com/512/1345/1345823.png",
  share: "https://cdn-icons-png.flaticon.com/512/535/535285.png",
  arrowRight: (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path d="M6 11H16M16 11L12 7M16 11L12 15"
        stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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

const WhyNoraBlock = () => (
  <div style={{
    width: `calc(100% - ${BLOCK_SIDE_PADDING * 2}px)`,
    maxWidth,
    margin: "0 auto 38px auto",
    background: GRADIENT,
    borderRadius: borderRadius,
    boxShadow: "0 6px 20px 0 rgba(150, 175, 205, 0.10)",
    boxSizing: "border-box",
    padding: 0,
    fontFamily: "'Manrope', Arial, Helvetica, sans-serif"
  }}>
    <div style={{ padding: `21px 0 20px 0` }}>
      <div style={{
        fontWeight: 700,
        fontSize: "20px",
        color: NORA_COLOR,
        marginBottom: 20,
        textAlign: "center"
      }}>
        Почему Nora Plus?
      </div>
      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: CARD_GAP,
        padding: `0 ${BLOCK_SIDE_PADDING}px`
      }}>
        {BENEFITS.map(({ emoji, title, text }, idx) => (
          <div key={idx} style={{
            position: "relative",
            background: "#fff",
            borderRadius: 18,
            boxShadow: "0 2px 18px 0 rgba(150,180,220,0.07)",
            padding: "19px 15px 19px 15px",
            overflow: "hidden",
            minHeight: 56,
            textAlign: "left"
          }}>
            <span style={{
              position: "absolute",
              right: 12,
              top: 14,
              fontSize: 62,
              opacity: 0.14,
              pointerEvents: "none",
              userSelect: "none",
              lineHeight: 1,
              zIndex: 0,
            }} aria-hidden="true">
              {emoji}
            </span>
            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 16, color: NORA_COLOR, marginBottom: 7, textAlign: "left" }}>
                {title}
              </div>
              <div style={{ fontSize: 13, color: "#3a3a3a", lineHeight: "1.64", textAlign: "left" }}>
                {text}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const ReviewBlock = () => (
  <div style={{
    width: `calc(100% - ${BLOCK_SIDE_PADDING * 2}px)`,
    maxWidth,
    margin: "0 auto 38px auto",
    background: GRADIENT,
    borderRadius: borderRadius,
    boxShadow: "0 6px 20px 0 rgba(150, 175, 205, 0.10)",
    boxSizing: "border-box",
    padding: 0,
    fontFamily: "'Manrope', Arial, Helvetica, sans-serif"
  }}>
    <div style={{ padding: "21px 0 20px 0" }}>
      <div style={{
        fontWeight: 700,
        fontSize: "20px",
        color: NORA_COLOR,
        marginBottom: 20,
        textAlign: "center"
      }}>
        Отзывы будущих мам
      </div>
      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: CARD_GAP,
        padding: `0 ${BLOCK_SIDE_PADDING}px`
      }}>
        {REVIEWS.map(({ name, badge, problem, text }, idx) => (
          <div key={idx} style={{
            background: "#fff",
            borderRadius: 18,
            boxShadow: "0 2px 18px 0 rgba(150,180,220,0.07)",
            padding: "19px 15px 19px 15px",
            overflow: "hidden",
            textAlign: "left"
          }}>
            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 7 }}>
                <span style={{
                  fontWeight: 700, fontSize: 15, color: "#222"
                }}>{name}</span>
                <span style={{
                  fontWeight: 500, fontSize: 13, color: "#1681f5",
                  padding: "4px 9px", borderRadius: 12, background: "#f3f7fe", whiteSpace: "nowrap"
                }}>{badge}</span>
              </div>
              <div style={{ fontWeight: 500, fontSize: 13, color: "#acb5bd", marginBottom: 9 }}>
                {problem}
              </div>
              <div style={{ fontSize: 13, color: "#3a3a3a", lineHeight: "1.64" }}>
                {text}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// --- TabPanel ---
const TABS = [
  { key: "how", label: "Пример" },
  { key: "why", label: "Почему Nora?" },
  { key: "reviews", label: "Отзывы" },
];
const TabPanel = () => {
  const [activeTab, setActiveTab] = useState("how");
  const tabBtnStyle = (isActive) => ({
    flex: 1,
    minWidth: 0,
    padding: "14px 0",
    fontWeight: 700,
    fontSize: "16px",
    border: "none",
    borderRadius: borderRadius,
    cursor: "pointer",
    color: isActive ? "#fff" : NORA_COLOR,
    background: isActive ? BABY_GRADIENT : GRADIENT,
    transition: "background 0.22s, color 0.18s",
    boxShadow: isActive ? "0 2px 14px 0 rgba(200,128,140,0.09)" : "none",
    outline: "none"
  });
  return (
    <div
      style={{
        width: `calc(100% - ${BLOCK_SIDE_PADDING * 2}px)`,
        maxWidth,
        margin: "0 auto"
      }}
    >
      <div
        style={{
          display: "flex",
          gap: 12,
          justifyContent: "center",
          padding: `0 ${BLOCK_SIDE_PADDING}px`,
          marginBottom: 25,
          marginTop: 5,
        }}
      >
        {TABS.map((tab) => (
          <button
            key={tab.key}
            style={tabBtnStyle(activeTab === tab.key)}
            onClick={() => setActiveTab(tab.key)}
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div>
        {activeTab === "how" && <HowItWorks />}
        {activeTab === "why" && <WhyNoraBlock />}
        {activeTab === "reviews" && <ReviewBlock />}
      </div>
    </div>
  );
};

// --- Остальные твои компоненты: Footer, FooterGap, splitBotTextTwoBlocks, HowItWorks, и вся логика чата ---
// Без изменений – просто оставь твои старые функции и useEffects.

// --- Вставь TabPanel в экран приветствия ---
const Chat = () => {
  // ... твои стейты/effects ...
  if (showWelcome) {
    return (
      <div style={{
        fontFamily: "'Manrope', Arial, Helvetica, sans-serif",
        background: "#f8fdff",
        width: "100vw",
        minHeight: "100vh"
      }}>
        {/* Панель ... */}
        <div style={{
          width: `calc(100% - ${BLOCK_SIDE_PADDING * 2}px)`,
          maxWidth,
          textAlign: "center",
          margin: "0 auto"
        }}>
          {/* Приветствие и кнопка */}
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
          {/* --- ДОБАВЛЕНО --- */}
          <div style={{ height: 40 }} />
          <TabPanel />
          <div style={{ height: 40 }} />
          {/* Footer и всё остальное */}
          <Footer />
          <FooterGap />
        </div>
      </div>
    );
  }
  // ... остальной чат без изменений ...
};

export default Chat;
