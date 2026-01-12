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
const INPUT_BAR_HEIGHT = 80;
const PANEL_SIDE_PADDING = 15;
const BLOCK_SIDE_PADDING = 10;
const CARD_GAP = 10;

// размер круглых кнопок внизу (файл/мик/отправка)
const ICON_BUTTON_SIZE = 52;
const ICON_DARK = "#5a6573";

const IconShield = (
  <svg width="17" height="17" fill="none" viewBox="0 0 22 22">
    <path
      d="M11 3.3C7.1 5 4.6 5.5 3.7 5.7c-.1 0-.2 0-.2.2 0 6.8 2.6 11.2 7.1 12.7.2.1.4.1.6 0 4.5-1.5 7.1-5.8 7.1-12.7 0-.2-.1-.2-.2-.2-.9-.2-3.4-.7-7.1-2.4Z"
      stroke="#5a6573"
      strokeWidth="1.35"
      fill="#f2f7fe"
    />
  </svg>
);

const IconPartner = (
  <svg width="18" height="18" fill="none" viewBox="0 0 20 20">
    <circle cx="10" cy="6.5" r="3.3" stroke="#5a6573" strokeWidth="1.5" />
    <path
      d="M2.8 16c.9-2.5 3.4-4.2 7.2-4.2s6.2 1.7 7.2 4.2"
      stroke="#5a6573"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);
const IconContact = (
  <svg width="18" height="18" fill="none" viewBox="0 0 20 20">
    <rect
      x="2.8"
      y="3.5"
      width="14.4"
      height="11"
      rx="2.2"
      stroke="#5a6573"
      strokeWidth="1.5"
    />
    <path
      d="M3.5 4l6.5 6.1c.3.2.8.2 1.1 0L17 4"
      stroke="#5a6573"
      strokeWidth="1.5"
    />
  </svg>
);

// увеличенная чёрная иконка меню (кнопка остаётся прозрачной)
const IconMenu = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M4 7h16" stroke="#000000" strokeWidth="2" strokeLinecap="round" />
    <path d="M4 12h16" stroke="#000000" strokeWidth="2" strokeLinecap="round" />
    <path d="M4 17h16" stroke="#000000" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const ICONS = {
  telegram: "https://cdn-icons-png.flaticon.com/512/1946/1946547.png",
  share: "https://cdn-icons-png.flaticon.com/512/535/535285.png",
  arrowRight: (
    <svg width="24" height="24" viewBox="0 0 22 22" fill="none">
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

// увеличенные иконки для файла и микрофона
const IconPaperclip = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path
      d="M8.5 12.5L14 7C15.1 5.9 16.9 5.9 18 7C19.1 8.1 19.1 9.9 18 11L11 18C9.3 19.7 6.5 19.7 4.8 18C3.1 16.3 3.1 13.5 4.8 11.8L11.5 5"
      stroke={ICON_DARK}
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconMic = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <rect
      x="9"
      y="4"
      width="6"
      height="10"
      rx="3"
      stroke={ICON_DARK}
      strokeWidth="1.7"
    />
    <path
      d="M7 11C7 13.2 8.8 15 11 15H13C15.2 15 17 13.2 17 11"
      stroke={ICON_DARK}
      strokeWidth="1.7"
      strokeLinecap="round"
    />
    <path
      d="M12 15V19"
      stroke={ICON_DARK}
      strokeWidth="1.7"
      strokeLinecap="round"
    />
    <path
      d="M9.5 19H14.5"
      stroke={ICON_DARK}
      strokeWidth="1.7"
      strokeLinecap="round"
    />
  </svg>
);

// иконки для нижнего меню
const IconHow = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9" stroke={ICON_DARK} strokeWidth="1.6" />
    <path
      d="M11 10.5C11 9.7 11.5 9.2 12.3 9.2C13.1 9.2 13.6 9.7 13.6 10.4C13.6 11.1 13.2 11.5 12.8 11.8C12.3 12.2 12.1 12.5 12.1 13"
      stroke={ICON_DARK}
      strokeWidth="1.6"
      strokeLinecap="round"
    />
    <circle cx="12" cy="15.3" r="0.9" fill={ICON_DARK} />
  </svg>
);

const IconReviews = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path
      d="M5 6.5C5 5.7 5.7 5 6.5 5H17.5C18.3 5 19 5.7 19 6.5V13.5C19 14.3 18.3 15 17.5 15H9L6 18V15H6.5C5.7 15 5 14.3 5 13.5V6.5Z"
      stroke={ICON_DARK}
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconHistory = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="8" stroke={ICON_DARK} strokeWidth="1.6" />
    <path
      d="M12 8.2V12L14.7 13.3"
      stroke={ICON_DARK}
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconContacts = IconContact;

// преимущества
const BENEFITS = [
  {
    emoji: "🩺",
    title: "Медицинская точность",
    text: "Советы основаны на рекомендациях британской службы NHS и адаптированы под ваш регион.",
  },
  {
    emoji: "🤝",
    title: "Поддержка 24/7",
    text: "Ассистент всегда на связи для заботы и помощи в любой ситуации.",
  },
  {
    emoji: "⏰",
    title: "Напоминания о важных делах",
    text: "Следим, чтобы вы ничего не забыли — анализы, витамины, визиты.",
  },
  {
    emoji: "🔒",
    title: "Конфиденциальность",
    text: "Личные данные остаются только у вас — никакой передачи сторонним.",
  },
  {
    emoji: "⚡️",
    title: "Быстрые решения",
    text: "Полезные советы и поддержка сразу, когда это нужно.",
  },
];

const REVIEWS = [
  {
    name: "Анна",
    badge: "2 месяц беременности",
    problem: "Токсикоз",
    text: "Nora Plus подсказала, как справиться с утренней тошнотой. Благодаря рекомендациям по питанию и режиму дня симптомы стали гораздо легче.",
  },
  {
    name: "Дилноза",
    badge: "3 месяц беременности",
    problem: "Тошнота",
    text: "Советы Nora Plus помогли справиться с тошнотой и легче переносить беременность. Все подсказки приходят вовремя.",
  },
  {
    name: "Елена",
    badge: "4 месяц беременности",
    problem: "Слабость и усталость",
    text: "Теперь я знаю, какие витамины нужно пить, сколько отдыхать и как выстроить день. Чувствую себя значительно лучше!",
  },
  {
    name: "Шахноза",
    badge: "5 месяц беременности",
    problem: "Плохое настроение",
    text: "Благодаря мотивационным словам и советам Nora Plus моё настроение заметно улучшилось.",
  },
  {
    name: "Ирина",
    badge: "5 месяц беременности",
    problem: "Тревожность",
    text: "Советы Nora Plus помогли мне больше отдыхать, заботиться о себе и избавиться от лишних переживаний за малыша.",
  },
  {
    name: "Мария",
    badge: "7 месяц беременности",
    problem: "Бессонница",
    text: "Благодаря советам Nora Plus я стала лучше спать и спокойно жду появления малыша.",
  },
  {
    name: "Виктория",
    badge: "3 месяц беременности",
    problem: "Страхи",
    text: "Nora Plus помогла справиться с тревогами и поддержала советами, теперь я чувствую себя увереннее.",
  },
  {
    name: "Екатерина",
    badge: "6 месяц беременности",
    problem: "Питание",
    text: "Ассистент напомнил о важных витаминах и правильном режиме, теперь питаюсь грамотно и чувствую себя энергичной.",
  },
  {
    name: "Гульнора",
    badge: "2 месяц беременности",
    problem: "Нарушение сна",
    text: "Проконсультировавшись с Nora, я восстановила сон и теперь хорошо встречаю утро.",
  },
  {
    name: "Малика",
    badge: "8 месяц беременности",
    problem: "Раздражительность",
    text: "Во время беременности стала нервной, но советы от Nora помогли и настроение улучшилось.",
  },
  {
    name: "Лола",
    badge: "4 месяц беременности",
    problem: "Недостаток белка",
    text: "Советы по питанию очень полезные, теперь у меня больше энергии.",
  },
];

// стартовые темы
const PREMADE_THEMES = [
  {
    emoji: "🤢",
    title: "Как справиться с токсикозом?",
    desc: "Подскажу способы и витамины для уменьшения тошноты.",
    question: "Что делать при токсикозе?",
  },
  {
    emoji: "😴",
    title: "Сон и бессонница",
    desc: "Как уснуть быстрее и лучше высыпаться.",
    question: "Срок беременности: 5 месяц, хочу обсудить сон и бессонницу.",
  },
  {
    emoji: "🥗",
    title: "Питание и витамины",
    desc: "Что можно, что нельзя и какие витамины важны.",
    question: "Что можно есть при беременности и какие витамины важны?",
  },
  {
    emoji: "🩺",
    title: "Анализы и УЗИ",
    desc: "Когда и какие обследования проходить.",
    question: "Какие анализы и УЗИ обязательны на моём сроке?",
  },
  {
    emoji: "🤯",
    title: "Тревога и страхи",
    desc: "Помогу успокоиться и разложить всё по полочкам.",
    question:
      "Я часто волнуюсь и боюсь за малыша, как справиться с тревогой?",
  },
];

// блок «Что умеет»
const WhyNoraBlockContent = () => (
  <div
    style={{
      width: "100%",
      maxWidth,
      margin: "0 auto",
      boxSizing: "border-box" as const,
      padding: "4px 0 6px 0",
      fontFamily: "'Manrope', Arial, Helvetica, sans-serif",
    }}
  >
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
            <div
              style={{
                fontWeight: 700,
                fontSize: 16,
                color: NORA_COLOR,
                marginBottom: 7,
              }}
            >
              {title}
            </div>
            <div
              style={{
                fontSize: 13,
                color: "#3a3a3a",
                lineHeight: "1.64",
              }}
            >
              {text}
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// пример диалога Норы (упрощённый блок)
const NoraExampleBlock = () => (
  <div
    style={{
      width: "100%",
      maxWidth,
      margin: "0 auto",
      padding: "4px 16px 10px 16px",
      boxSizing: "border-box" as const,
      fontFamily: "'Manrope', Arial, Helvetica, sans-serif",
    }}
  >
    <div
      style={{
        fontWeight: 600,
        fontSize: 14,
        marginBottom: 10,
        color: "#1e2933",
      }}
    >
      Пример диалога с Норой
    </div>
    <div
      style={{
        marginBottom: 10,
        textAlign: "right",
      }}
    >
      <div
        style={{
          display: "inline-block",
          background: GRADIENT,
          borderRadius: 16,
          padding: "11px 13px",
          fontSize: 14,
          lineHeight: 1.6,
          maxWidth: "90%",
        }}
      >
        Срок беременности 9 недель, мучает токсикоз. Что можно сделать, чтобы
        стало легче?
      </div>
      <div
        style={{
          fontSize: 11,
          color: "#9aa3ad",
          marginTop: 4,
        }}
      >
        Будущая мама
      </div>
    </div>
    <div
      style={{
        textAlign: "left",
      }}
    >
      <div
        style={{
          display: "inline-block",
          background: "#f7fafd",
          borderRadius: 16,
          padding: "11px 13px",
          fontSize: 14,
          lineHeight: 1.7,
          maxWidth: "93%",
        }}
      >
        Первые недели беременности часто сопровождаются токсикозом — это
        нормально, но неприятно. Попробуйте есть небольшими порциями каждые
        2–3 часа, носить с собой перекус и пить воду маленькими глотками в
        течение дня. Если рвота становится частой, вы теряете вес или не
        можете пить — обязательно свяжитесь с врачом, чтобы исключить
        обезвоживание.
      </div>
      <div
        style={{
          fontSize: 11,
          color: "#9aa3ad",
          marginTop: 4,
        }}
      >
        Нора
      </div>
    </div>
  </div>
);

// блок отзывов (без заголовка внутри)
const ReviewBlockContent = () => (
  <div
    style={{
      width: "100%",
      maxWidth,
      margin: "0 auto",
      boxSizing: "border-box" as const,
      padding: "4px 0 12px 0",
      fontFamily: "'Manrope', Arial, Helvetica, sans-serif",
    }}
  >
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
            background: "#fff",
            borderRadius: 18,
            boxShadow: "0 2px 18px 0 rgba(150,180,220,0.07)",
            padding: "19px 15px 19px 15px",
            overflow: "hidden",
            textAlign: "left",
          }}
        >
          <div style={{ position: "relative", zIndex: 1 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 7,
              }}
            >
              <span
                style={{
                  fontWeight: 700,
                  fontSize: 15,
                  color: "#222",
                }}
              >
                {name}
              </span>
              <span
                style={{
                  fontWeight: 500,
                  fontSize: 13,
                  color: "#1681f5",
                  padding: "4px 9px",
                  borderRadius: 12,
                  background: "#f3f7fe",
                  whiteSpace: "nowrap",
                }}
              >
                {badge}
              </span>
            </div>
            <div
              style={{
                fontWeight: 500,
                fontSize: 13,
                color: "#acb5bd",
                marginBottom: 9,
              }}
            >
              {problem}
            </div>
            <div
              style={{
                fontSize: 13,
                color: "#3a3a3a",
                lineHeight: "1.64",
              }}
            >
              {text}
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// контакты с кнопками и Яндекс‑картой (iframe конструктор)
const ContactsBlock = () => (
  <div
    style={{
      width: "100%",
      maxWidth,
      margin: "0 auto",
      padding: "6px 16px 12px 16px",
      boxSizing: "border-box" as const,
      fontFamily: "'Manrope', Arial, Helvetica, sans-serif",
      color: "#1e2933",
    }}
  >
    <div style={{ marginBottom: 12, fontSize: 14, lineHeight: 1.6 }}>
      <div style={{ marginBottom: 8 }}>
        <strong>Адрес:</strong> Ташкент, Юнусабадский район, массив Кашгар 26
      </div>
      <div style={{ marginBottom: 8 }}>
        <strong>Телеграм‑канал:</strong>{" "}
        <a href="https://t.me/norasmart" target="_blank" rel="noreferrer">
          @norasmart
        </a>
      </div>
    </div>

    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        marginBottom: 14,
      }}
    >
      <button
        style={{
          border: "none",
          background: "#ffffff",
          borderRadius: 16,
          padding: "11px 13px",
          textAlign: "left",
          fontSize: 14,
          boxShadow: "0 1px 8px rgba(150,175,205,0.18)",
          cursor: "pointer",
        }}
      >
        Политика конфиденциальности
      </button>
      <button
        style={{
          border: "none",
          background: "#ffffff",
          borderRadius: 16,
          padding: "11px 13px",
          textAlign: "left",
          fontSize: 14,
          boxShadow: "0 1px 8px rgba(150,175,205,0.18)",
          cursor: "pointer",
        }}
      >
        Стать партнёром
      </button>
      <button
        style={{
          border: "none",
          background: "#ffffff",
          borderRadius: 16,
          padding: "11px 13px",
          textAlign: "left",
          fontSize: 14,
          boxShadow: "0 1px 8px rgba(150,175,205,0.18)",
          cursor: "pointer",
        }}
      >
        Написать в поддержку
      </button>
    </div>

    <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
      Где нас найти
    </div>
    <div
      style={{
        borderRadius: 18,
        overflow: "hidden",
        boxShadow: "0 2px 18px rgba(150,175,205,0.30)",
      }}
    >
      <iframe
        src="https://yandex.ru/map-widget/v1/-/CCU3FJTQxD"
        width="100%"
        height="220"
        frameBorder="0"
        style={{ border: 0 }}
        allowFullScreen
      ></iframe>
    </div>
  </div>
);

const THREAD_KEY = "nora_thread_id";

function splitBotTextTwoBlocks(text: string) {
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

const PremadeThemesPanel = ({
  disabled,
  onSend,
}: {
  disabled: boolean;
  onSend: (q: string) => void;
}) => (
  <div
    style={{
      width: "100%",
      maxWidth: maxWidth,
      margin: "18px auto 8px auto",
      padding: "0 15px",
      boxSizing: "border-box" as const,
      display: "flex",
      justifyContent: "center",
    }}
  >
    <div
      style={{
        width: "100%",
        maxWidth: maxWidth,
        boxSizing: "border-box" as const,
        display: "flex",
        flexDirection: "column",
        gap: 15,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 11,
        }}
      >
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
              transition: "opacity 0.13s, transform 0.1s",
            }}
            disabled={disabled}
            onClick={() => onSend(question)}
            onMouseDown={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform =
                "scale(0.97)";
            }}
            onMouseUp={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform =
                "scale(1)";
            }}
          >
            <span style={{ fontSize: 29, marginRight: 2, flexShrink: 0 }}>
              {emoji}
            </span>
            <div style={{ textAlign: "left", flex: 1 }}>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: 15,
                  color: NORA_COLOR,
                  marginBottom: 2,
                }}
              >
                {title}
              </div>
              <div
                style={{
                  fontWeight: 400,
                  fontSize: 13,
                  color: "#7c8792",
                }}
              >
                {desc}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  </div>
);

type MenuSection = "how" | "what" | "reviews" | "contacts" | null;

const bottomNavButtonStyle: React.CSSProperties = {
  flex: 1,
  border: "none",
  background: "transparent",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: 0,
  cursor: "pointer",
};

const bottomNavIconWrapStyle: React.CSSProperties = {
  width: 40,
  height: 40,
  borderRadius: 20,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const bottomNavLabelStyle: React.CSSProperties = {
  fontSize: 10,
  color: "#5a6573",
  marginTop: 4,
  textAlign: "center",
  whiteSpace: "pre-line",
};

const BottomNavBar = ({
  onOpenHow,
  onOpenReviews,
  onOpenContacts,
  onStartChat,
}: {
  onOpenHow: () => void;
  onOpenReviews: () => void;
  onOpenContacts: () => void;
  onStartChat: () => void;
}) => (
  <div
    style={{
      position: "fixed",
      left: 0,
      bottom: 0,
      width: "100%",
      background: "#ffffff",
      boxShadow: "0 -4px 20px rgba(0,0,0,0.06)",
      zIndex: 25,
    }}
  >
    <div
      style={{
        maxWidth,
        margin: "0 auto",
        padding: "8px 14px 10px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxSizing: "border-box",
      }}
    >
      {/* Как работает */}
      <button style={bottomNavButtonStyle} onClick={onOpenHow}>
        <div style={bottomNavIconWrapStyle}>{IconHow}</div>
        <span style={bottomNavLabelStyle}>Как это{"\n"}работает</span>
      </button>

      {/* Отзывы */}
      <button style={bottomNavButtonStyle} onClick={onOpenReviews}>
        <div style={bottomNavIconWrapStyle}>{IconReviews}</div>
        <span style={bottomNavLabelStyle}>Отзывы</span>
      </button>

      {/* Начать */}
      <button
        style={{
          ...bottomNavButtonStyle,
          transform: "translateY(-6px)",
        }}
        onClick={onStartChat}
      >
        <div
          style={{
            width: 58,
            height: 58,
            borderRadius: 29,
            background: BABY_GRADIENT,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 6px 26px rgba(200,128,140,0.35)",
          }}
        >
          {ICONS.arrowRight}
        </div>
        <span style={{ ...bottomNavLabelStyle, marginTop: 6 }}>Начать</span>
      </button>

      {/* История */}
      <button
        style={bottomNavButtonStyle}
        onClick={() => {
          alert("История диалогов появится скоро.");
        }}
      >
        <div style={bottomNavIconWrapStyle}>{IconHistory}</div>
        <span style={bottomNavLabelStyle}>История</span>
      </button>

      {/* Контакты */}
      <button style={bottomNavButtonStyle} onClick={onOpenContacts}>
        <div style={bottomNavIconWrapStyle}>{IconContacts}</div>
        <span style={bottomNavLabelStyle}>Контакты</span>
      </button>
    </div>
  </div>
);

const SEND_BUTTON_SIZE = 46;

const Chat = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [preloading, setPreloading] = useState(true);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<
    { text: string; sender: string }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [threadId, setThreadId] = useState<string | null>(null);
  const [botProgress, setBotProgress] = useState("");
  const [isMobile, setIsMobile] = useState(true);
  const [focused, setFocused] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<MenuSection>(null);

  useEffect(() => {
    function checkScreen() {
      if (typeof window !== "undefined") {
        setIsMobile(window.innerWidth <= 640);
      }
    }
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  useEffect(() => {
    const saved = window.localStorage.getItem(THREAD_KEY);
    if (saved) setThreadId(saved);
  }, []);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setPreloading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory, botProgress]);

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

  const openMenu = () => {
    setMenuOpen(true);
    setActiveSection(null);
  };

  const openSection = (section: MenuSection) => {
    setActiveSection(section);
  };

  const sendMessageToGPT = async (text: string) => {
    setLoading(true);
    const newHistory = [...chatHistory, { text, sender: "user" }];
    setChatHistory(newHistory);
    setBotProgress("");
    try {
      const res = await fetch("/api/gpt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newHistory, thread_id: threadId }),
      });
      const data = await res.json();
      if (data.thread_id) {
        setThreadId(data.thread_id);
        window.localStorage.setItem(THREAD_KEY, data.thread_id);
      }
      let botReply = data.reply;
      if (res.status !== 200 || !botReply) {
        botReply = data.error
          ? typeof data.error === "string"
            ? `Ошибка сервера: ${data.error}`
            : `Ассистент не ответил (ошибка сервера)`
          : "Извините, нет ответа от ассистента.";
      }
      let i = 0;
      setBotProgress("");
      const interval = setInterval(() => {
        setBotProgress(botReply.slice(0, i));
        i++;
        if (i > botReply.length) {
          clearInterval(interval);
          setChatHistory((prev) => [...prev, { text: botReply, sender: "bot" }]);
          setBotProgress("");
          setLoading(false);
        }
      }, 18);
    } catch {
      setChatHistory((prev) => [
        ...prev,
        { text: "Ошибка: не удалось получить ответ.", sender: "bot" },
      ]);
      setLoading(false);
      setBotProgress("");
    }
  };

  const handleSendMessage = () => {
    if (message.trim() && !loading && !botProgress) {
      sendMessageToGPT(message.trim());
      setMessage("");
    }
  };

  const startListening = () => {
    if (typeof window === "undefined") return;
    const SpeechRecognition =
      (window as any).webkitSpeechRecognition ||
      (window as any).SpeechRecognition;
    if (!SpeechRecognition) {
      alert("Ваш браузер не поддерживает голосовой ввод (Web Speech API).");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "ru-RU";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
    };
    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript;
      setMessage(text);
    };
    recognition.onerror = () => {
      setIsListening(false);
    };
    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);

    const formData = new FormData();
    formData.append("file", selected);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      await res.json();
      setChatHistory((prev) => [
        ...prev,
        { text: `Файл "${selected.name}" отправлен ассистенту.`, sender: "user" },
      ]);
    } catch {
      setChatHistory((prev) => [
        ...prev,
        { text: "Не удалось загрузить файл. Попробуйте ещё раз.", sender: "bot" },
      ]);
    } finally {
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const userMessageStyle: React.CSSProperties = {
    background: GRADIENT,
    padding: "13px 14px",
    borderRadius: 16,
    fontSize: 16,
    display: "inline-block",
    maxWidth: "95vw",
    wordBreak: "break-word",
    overflowWrap: "anywhere",
    marginBottom: 18,
    marginTop: 2,
    boxSizing: "border-box",
    lineHeight: "1.77",
    minWidth: 60,
    textAlign: "right",
    whiteSpace: "pre-line",
  };

  const MicPulseStyle = () => (
    <style jsx global>{`
      @keyframes micPulseNora {
        0% {
          transform: scale(1);
          box-shadow: 0 0 0 0 rgba(255, 152, 0, 0.45);
        }
        70% {
          transform: scale(1.06);
          box-shadow: 0 0 0 10px rgba(255, 152, 0, 0);
        }
        100% {
          transform: scale(1);
          box-shadow: 0 0 0 0 rgba(255, 152, 0, 0);
        }
      }
    `}</style>
  );

  const ModalOverlay = () =>
    !menuOpen ? null : (
      <div
        onClick={() => setMenuOpen(false)}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(10,20,35,0.45)",
          zIndex: 200,
        }}
      />
    );

  const menuButtonStyle: React.CSSProperties = {
    width: "100%",
    borderRadius: 16,
    border: "1px solid #e1e9f5",
    padding: "11px 14px",
    background: "#fff",
    textAlign: "left",
    fontSize: 15,
    fontWeight: 500,
    color: "#1f2933",
    cursor: "pointer",
  };

  const ModalContent = () => {
    if (!menuOpen) return null;

    let body: React.ReactNode = null;
    let bg = "#f8fdff";

    if (!activeSection) {
      bg = "#f8fdff";
      body = (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <button style={menuButtonStyle} onClick={() => openSection("how")}>
            Как работает Нора
          </button>
          <button style={menuButtonStyle} onClick={() => openSection("what")}>
            Что умеет Нора
          </button>
          <button style={menuButtonStyle} onClick={() => openSection("reviews")}>
            Отзывы
          </button>
          <button style={menuButtonStyle} onClick={() => openSection("contacts")}>
            Контакты
          </button>
        </div>
      );
    } else if (activeSection === "how") {
      bg = GRADIENT;
      body = (
        <div>
          <div
            style={{
              padding: "0 16px 10px 16px",
              fontSize: 14,
              lineHeight: 1.7,
              color: "#263540",
            }}
          >
            Нора задаёт уточняющие вопросы, учитывает ваш срок, жалобы и историю,
            а затем опирается на клинические рекомендации, чтобы объяснить, что
            происходит и какие шаги можно предпринять.
          </div>
          <NoraExampleBlock />
        </div>
      );
    } else if (activeSection === "what") {
      bg = GRADIENT;
      body = (
        <div>
          <div
            style={{
              padding: "0 16px 8px 16px",
              fontSize: 14,
              color: "#263540",
              lineHeight: 1.6,
            }}
          >
            Возможности Норы помогают не только отвечать на вопросы, но и
            сопровождать беременность день за днём.
          </div>
          <WhyNoraBlockContent />
        </div>
      );
    } else if (activeSection === "reviews") {
      bg = GRADIENT;
      body = <ReviewBlockContent />;
    } else if (activeSection === "contacts") {
      bg = GRADIENT;
      body = <ContactsBlock />;
    }

    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 210,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth,
            margin: "0 auto",
            padding: "0 18px",
            boxSizing: "border-box",
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              background: bg,
              borderRadius: 22,
              padding: 18,
              maxHeight: "82vh",
              overflowY: "auto",
              boxShadow: "0 10px 40px rgba(0,0,0,0.18)",
              pointerEvents: "auto",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  fontWeight: 700,
                  fontSize: 18,
                  color: "#1e2933",
                }}
              >
                {activeSection === "how"
                  ? "Как работает Нора"
                  : activeSection === "what"
                  ? "Что умеет Nora Plus"
                  : activeSection === "reviews"
                  ? "Отзывы будущих мам"
                  : activeSection === "contacts"
                  ? "Контакты и партнёрство"
                  : "Меню"}
              </div>
              <button
                onClick={() => setMenuOpen(false)}
                style={{
                  border: "none",
                  background: "transparent",
                  fontSize: 20,
                  cursor: "pointer",
                  padding: 4,
                  lineHeight: 1,
                }}
              >
                ×
              </button>
            </div>
            {body}
          </div>
        </div>
      </div>
    );
  };

  if (!isMobile) {
    return (
      <div
        style={{
          width: "100vw",
          height: "100vh",
          background: "#f8fdff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "fixed",
          left: 0,
          top: 0,
          zIndex: 10000,
        }}
      >
        <div
          style={{
            fontWeight: 700,
            fontSize: "21px",
            textAlign: "center",
            color: NORA_COLOR,
            background: "#fff",
            borderRadius: 24,
            padding: "35px 28px",
            boxShadow: "0 6px 36px 0 rgba(155, 175, 205, 0.12)",
          }}
        >
          Nora Plus — доступна только <br /> на мобильных устройствах
        </div>
      </div>
    );
  }

  if (preloading) {
    return (
      <div
        style={{
          background: "#f8fdff",
          width: "100vw",
          height: "100vh",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 10000,
          margin: 0,
          padding: 0,
        }}
      >
        <span
          style={{
            fontWeight: 800,
            fontSize: "38px",
            color: NORA_COLOR,
            letterSpacing: "0.07em",
            animation: "noraPulse 1.4s infinite linear",
          }}
        >
          Nora Plus
        </span>
        <style>{`
          @keyframes noraPulse {
            0% { opacity: 0.30; }
            50% { opacity: 1; }
            100% { opacity: 0.30; }
          }
        `}</style>
      </div>
    );
  }

  const HeaderBar = () => (
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
        boxSizing: "border-box" as const,
        zIndex: 1,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          flex: 1,
          paddingLeft: 5,
        }}
      >
        <button
          onClick={() => {
            // ресет на приветственный экран
            setShowWelcome(true);
            setChatHistory([]);
            setBotProgress("");
          }}
          style={{
            background: "none",
            border: "none",
            padding: 0,
            margin: 0,
            cursor: "pointer",
            fontWeight: 800,
            fontSize: "19px",
            lineHeight: 1.06,
            whiteSpace: "nowrap",
            marginBottom: 7,
            color: NORA_COLOR,
          }}
        >
          Nora Plus
        </button>
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
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginLeft: 16,
        }}
      >
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
            style={{ width: ICON_SIZE, height: ICON_SIZE, filter: filterNora }}
          />
        </button>
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
          onClick={() => window.open("https://t.me/norasmart", "_blank")}
        >
          <img
            src={ICONS.telegram}
            alt="Telegram"
            style={{ width: ICON_SIZE, height: ICON_SIZE, filter: filterNora }}
          />
        </button>
        <button
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            width: 42,
            height: 42,
            borderRadius: 21,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={openMenu}
        >
          {IconMenu}
        </button>
      </div>
    </div>
  );

  // WELCOME
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
        <MicPulseStyle />
        <HeaderBar />

        <ModalOverlay />
        <ModalContent />

        <div style={{ height: 36 }} />

        <div
          style={{
            width: "100%",
            maxWidth: maxWidth,
            margin: "0 auto",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <video
            src="/nora.mp4"
            style={{
              width: "100%",
              maxWidth: videoMaxWidth,
              display: "block",
              borderRadius: 24,
            }}
            autoPlay
            playsInline
            muted
            loop
            preload="auto"
          />
        </div>

        <div style={{ height: 36 }} />

        <div
          style={{
            width: `calc(100% - ${BLOCK_SIDE_PADDING * 2}px)`,
            maxWidth,
            textAlign: "center",
            margin: "0 auto",
          }}
        >
          <div
            style={{
              fontWeight: 800,
              fontSize: "22px",
              color: NORA_COLOR,
              marginBottom: 12,
              padding: "0 18px",
              lineHeight: 1.35,
            }}
          >
            Ждёте малыша? Я помогу!
          </div>
          <div
            style={{
              fontWeight: 400,
              fontSize: "15px",
              margin: "0 auto",
              maxWidth: 400,
              padding: "0 18px",
              lineHeight: 1.75,
              color: NORA_COLOR,
              display: "inline-block",
            }}
          >
            Нора — ассистент, который отвечает на вопросы, успокаивает,
            напоминает о важных делах и делится рекомендациями на основе
            медицины Великобритании NHS. Не гуглите в панике — просто спросите
            Нору.
          </div>

          <div style={{ height: 32 }} />

          <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
            <div style={{ width: "100%", textAlign: "center" }}>
              <button
                style={{
                  width: "100%",
                  maxWidth: 290,
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
                Начать чат с Норой&nbsp;
                <span
                  style={{
                    marginLeft: 8,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {ICONS.arrowRight}
                </span>
              </button>
            </div>
          </div>

          <div style={{ height: 32 }} />

          <div
            style={{
              width: "100%",
              maxWidth,
              margin: "0 auto",
              paddingBottom: 20,
            }}
          >
            <WhyNoraBlockContent />
          </div>
        </div>
      </div>
    );
  }

  // CHAT SCREEN
  return (
    <div
      style={{
        fontFamily: "'Manrope', Arial, Helvetica, sans-serif",
        background: "#f8fdff",
        width: "100vw",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <MicPulseStyle />
      <HeaderBar />

      <ModalOverlay />
      <ModalContent />

      <div
        style={{
          width: "100%",
          maxWidth,
          margin: "12px auto 0 auto",
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: maxWidth,
            margin: "0 auto",
            padding: "8px 0 180px 0",
            boxSizing: "border-box",
          }}
        >
          <PremadeThemesPanel
            disabled={loading || !!botProgress}
            onSend={(q) => {
              if (!loading && !botProgress) {
                sendMessageToGPT(q);
              }
            }}
          />

          {/* История чата */}
          <div
            style={{
              width: "100%",
              maxWidth,
              margin: "0 auto",
              padding: "0 14px",
              boxSizing: "border-box",
            }}
          >
            {chatHistory.map((m, idx) => {
              if (m.sender === "user") {
                return (
                  <div
                    key={idx}
                    style={{
                      textAlign: "right",
                      marginBottom: 6,
                    }}
                  >
                    <div style={userMessageStyle}>{m.text}</div>
                    <div
                      style={{
                        fontSize: 11,
                        color: "#9aa3ad",
                        marginTop: -4,
                      }}
                    >
                      Вы
                    </div>
                  </div>
                );
              }

              const parts = splitBotTextTwoBlocks(m.text);
              return (
                <div
                  key={idx}
                  style={{
                    textAlign: "left",
                    marginBottom: 10,
                  }}
                >
                  <div
                    style={{
                      display: "inline-block",
                      background: "#ffffff",
                      borderRadius: 18,
                      padding: "11px 13px",
                      fontSize: 15,
                      lineHeight: 1.8,
                      boxShadow: "0 2px 18px rgba(150,180,220,0.07)",
                      maxWidth: "95%",
                      whiteSpace: "pre-line",
                    }}
                  >
                    {parts.map((p, i) => (
                      <span
                        key={i}
                        style={{
                          fontWeight: p.bold ? 700 : 400,
                          display: "inline",
                        }}
                      >
                        {p.text + (i === parts.length - 1 ? "" : " ")}
                      </span>
                    ))}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: "#9aa3ad",
                      marginTop: 4,
                    }}
                  >
                    Нора
                  </div>
                </div>
              );
            })}

            {/* прогресс набора текста ботом */}
            {botProgress && (
              <div
                style={{
                  textAlign: "left",
                  marginBottom: 12,
                }}
              >
                <div
                  style={{
                    display: "inline-block",
                    background: "#ffffff",
                    borderRadius: 18,
                    padding: "11px 13px",
                    fontSize: 15,
                    lineHeight: 1.7,
                    boxShadow: "0 2px 18px rgba(150,180,220,0.07)",
                    maxWidth: "95%",
                    whiteSpace: "pre-line",
                  }}
                >
                  {botProgress}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: "#9aa3ad",
                    marginTop: 4,
                  }}
                >
                  Нора печатает…
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* инпут + кнопки */}
      <div
        style={{
          position: "fixed",
          left: 0,
          bottom: 70, // чуть выше нижнего меню
          width: "100%",
          background: "transparent",
          zIndex: 30,
          padding: "8px 10px 10px",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            maxWidth,
            margin: "0 auto",
            background: "#fff",
            borderRadius: borderRadius,
            borderWidth: focused ? 2 : 1,
            borderStyle: "solid",
            borderColor: focused ? "transparent" : "#e5e8ed",
            borderImage: focused ? GRADIENT + " 1" : undefined,
            display: "flex",
            alignItems: "center",
            paddingLeft: 12,
            paddingRight: 6,
            boxSizing: "border-box",
            boxShadow: "0 2px 14px 0 rgba(155,175,205,0.10)",
            minHeight: INPUT_BAR_HEIGHT,
          }}
        >
          {/* input */}
          <input
            type="text"
            placeholder="Задайте вопрос..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              fontSize: 15,
              padding: "10px 8px 10px 0",
              background: "transparent",
              color: "#1f2933",
            }}
          />

          {/* файл */}
          <button
            onClick={openFileDialog}
            style={{
              width: ICON_BUTTON_SIZE,
              height: ICON_BUTTON_SIZE,
              borderRadius: ICON_BUTTON_SIZE / 2,
              border: "none",
              background: "#f3f6fb",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginRight: 5,
              cursor: "pointer",
            }}
          >
            {IconPaperclip}
          </button>

          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
          />

          {/* микрофон */}
          <button
            onClick={startListening}
            style={{
              width: ICON_BUTTON_SIZE,
              height: ICON_BUTTON_SIZE,
              borderRadius: ICON_BUTTON_SIZE / 2,
              border: "none",
              background: isListening ? "#ffe7cc" : "#f3f6fb",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginRight: 5,
              cursor: "pointer",
              animation: isListening ? "micPulseNora 1.6s infinite" : "none",
            }}
          >
            {IconMic}
          </button>

          {/* отправка */}
          <button
            style={{
              width: SEND_BUTTON_SIZE,
              height: SEND_BUTTON_SIZE,
              background: BABY_GRADIENT,
              color: "#fff",
              border: "none",
              borderRadius: SEND_BUTTON_SIZE / 2,
              cursor: loading || !!botProgress ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 16px rgba(200, 128, 140, 0.35)",
              marginLeft: 2,
              flexShrink: 0,
            }}
            onClick={handleSendMessage}
            disabled={loading || !!botProgress}
          >
            {ICONS.arrowRight}
          </button>
        </div>
      </div>

      {/* нижнее меню */}
      <BottomNavBar
        onOpenHow={() => {
          setMenuOpen(true);
          setActiveSection("how");
        }}
        onOpenReviews={() => {
          setMenuOpen(true);
          setActiveSection("reviews");
        }}
        onOpenContacts={() => {
          setMenuOpen(true);
          setActiveSection("contacts");
        }}
        onStartChat={() => {
          const input = document.querySelector<HTMLInputElement>(
            'input[placeholder="Задайте вопрос..."]'
          );
          if (input) input.focus();
        }}
      />
    </div>
  );
};

export default Chat;
