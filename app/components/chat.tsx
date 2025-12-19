"use client";
import React, { useState, useEffect, useRef } from "react";

const NORA_COLOR = "#2e2e2e";
const ICON_SIZE = 24;
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

const TELEGRAM_BLUE = "#27A7E7"; // общий цвет иконок в панели [web:73]

// размер круглых кнопок внизу (файл/мик/отправка)
const ICON_BUTTON_SIZE = 54;
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

// увеличенная иконка меню, того же цвета что и остальные
const IconMenu = (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
    <path d="M4 7h16" stroke={TELEGRAM_BLUE} strokeWidth="2.2" strokeLinecap="round" />
    <path d="M4 12h16" stroke={TELEGRAM_BLUE} strokeWidth="2.2" strokeLinecap="round" />
    <path d="M4 17h16" stroke={TELEGRAM_BLUE} strokeWidth="2.2" strokeLinecap="round" />
  </svg>
);

const ICONS = {
  telegram: "https://cdn-icons-png.flaticon.com/512/1946/1946547.png",
  share: "https://cdn-icons-png.flaticon.com/512/535/535285.png",
  arrowRight: (
    <svg width="26" height="26" viewBox="0 0 22 22" fill="none">
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

// фильтр перекрашивает share/telegram в единый синий
const filterPanelBlue =
  "invert(48%) sepia(81%) saturate(1453%) hue-rotate(181deg) brightness(94%) contrast(93%)";

// увеличенные иконки для файла и микрофона
const IconPaperclip = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path
      d="M8.5 12.5L14 7C15.1 5.9 16.9 5.9 18 7C19.1 8.1 19.1 9.9 18 11L11 18C9.3 19.7 6.5 19.7 4.8 18C3.1 16.3 3.1 13.5 4.8 11.8L11.5 5"
      stroke={ICON_DARK}
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconMic = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <rect
      x="9"
      y="4"
      width="6"
      height="10"
      rx="3"
      stroke={ICON_DARK}
      strokeWidth="1.9"
    />
    <path
      d="M7 11C7 13.2 8.8 15 11 15H13C15.2 15 17 13.2 17 11"
      stroke={ICON_DARK}
      strokeWidth="1.9"
      strokeLinecap="round"
    />
    <path
      d="M12 15V19"
      stroke={ICON_DARK}
      strokeWidth="1.9"
      strokeLinecap="round"
    />
    <path
      d="M9.5 19H14.5"
      stroke={ICON_DARK}
      strokeWidth="1.9"
      strokeLinecap="round"
    />
  </svg>
);

// преимущества и отзывы и т.д. (как в предыдущей версии – без изменений по контенту)
const BENEFITS = [ /* ... тот же массив как раньше ... */ ];
const REVIEWS = [ /* ... тот же массив как раньше ... */ ];
const PREMADE_THEMES = [ /* ... тот же массив как раньше ... */ ];

// —–– те же блоки WhyNoraBlockContent, NoraExampleBlock, ReviewBlockContent, ContactsBlock
// (скопируй их из предыдущего ответа без изменений, они только про контент/градиенты) –––

/* ------------- дублирую полностью для целостности ------------- */

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
        Срок беременности 9 недель, мучает токсикоз. Что можно сделать, чтобы стало легче?
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
        Первые недели беременности часто сопровождаются токсикозом — это нормально, но неприятно.
        Попробуйте есть небольшими порциями каждые 2–3 часа, носить с собой перекус и пить воду
        маленькими глотками в течение дня. Если рвота становится частой, вы теряете вес или не
        можете пить — обязательно свяжитесь с врачом, чтобы исключить обезвоживание.
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
    {/* контент как в предыдущей версии, не менялся */}
    {/* ... */}
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
  // как раньше, без изменений
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
    {/* ... */}
  </div>
);

type MenuSection = "how" | "what" | "reviews" | "contacts" | null;

const Chat = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [preloading, setPreloading] = useState(true);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<{ text: string; sender: string }[]>([]);
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

  // все useEffect и логика GPT те же, как в предыдущей версии
  // ...

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
      {/* левый блок – фиксированный текст, одинаковый до/после */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          flex: 1,
          paddingLeft: 5,
        }}
      >
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

      {/* правые иконки: один размер и один цвет */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginLeft: 16,
        }}
      >
        <button
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            width: 40,
            height: 40,
            borderRadius: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: "Nora Plus — Ассистент для будущих мам",
                text: "Современный ассистент для будущих мам.",
                url: window.location.href,
              });
            }
          }}
        >
          <img
            src={ICONS.share}
            alt="Share"
            style={{ width: ICON_SIZE, height: ICON_SIZE, filter: filterPanelBlue }}
          />
        </button>

        <button
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            width: 40,
            height: 40,
            borderRadius: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => window.open("https://t.me/norasmart", "_blank")}
        >
          <img
            src={ICONS.telegram}
            alt="Telegram"
            style={{ width: ICON_SIZE, height: ICON_SIZE, filter: filterPanelBlue }}
          />
        </button>

        <button
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            width: 44,
            height: 44,
            borderRadius: 22,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => {
            setMenuOpen(true);
            setActiveSection(null);
          }}
        >
          {IconMenu}
        </button>
      </div>
    </div>
  );

  // дальше — модалка, welcome‑экран и экран чата такие же, как в предыдущем ответе,
  // но важные правки в панели ввода:

  const inputBar = (
    <div
      style={{
        width: "calc(100% - 40px)",
        margin: "0 20px",
        boxSizing: "border-box",
        maxWidth: maxWidth,
        height: INPUT_BAR_HEIGHT,
        position: "fixed",
        left: 0,
        bottom: 30,
        background: "transparent",
        borderRadius: borderRadius,
        zIndex: 20,
        boxShadow: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          background: "#fff",
          borderRadius: borderRadius,
          borderWidth: focused ? 2 : 1,
          borderStyle: "solid",
          borderColor: focused ? "transparent" : "#e5e8ed",
          borderImage: focused ? GRADIENT + " 1" : undefined,
          display: "flex",
          alignItems: "center",
          paddingLeft: 14,
          paddingRight: 10,
          boxSizing: "border-box",
          boxShadow: "0 2px 14px 0 rgba(155,175,205,0.10)",
        }}
      >
        {/* input и file hidden – как раньше */}

        {/* кнопка файла – крупная иконка без фона */}
        <button
          // onClick...
          style={{
            width: ICON_BUTTON_SIZE,
            height: ICON_BUTTON_SIZE,
            borderRadius: ICON_BUTTON_SIZE / 2,
            border: "none",
            background: "transparent",
            cursor: loading || !!botProgress ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginRight: 4,
          }}
        >
          {IconPaperclip}
        </button>

        {/* микрофон – тот же размер */}
        <button
          // onClick...
          style={{
            width: ICON_BUTTON_SIZE,
            height: ICON_BUTTON_SIZE,
            borderRadius: ICON_BUTTON_SIZE / 2,
            border: "none",
            background: "transparent",
            cursor: loading || !!botProgress ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginRight: 4,
            animation: isListening ? "micPulseNora 1.1s infinite ease-out" : "none",
          }}
        >
          {IconMic}
        </button>

        {/* отправка – круглая, только вокруг стрелки */}
        <button
          // onClick...
          style={{
            width: ICON_BUTTON_SIZE,
            height: ICON_BUTTON_SIZE,
            background: BABY_GRADIENT,
            color: "#fff",
            border: "none",
            borderRadius: ICON_BUTTON_SIZE / 2,
            cursor: loading || !!botProgress ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 14px 0 rgba(155,175,205,0.12)",
            marginLeft: 2,
          }}
        >
          {ICONS.arrowRight}
        </button>
      </div>
    </div>
  );

  // размести inputBar внизу экрана чата вместо старой панели ввода

  return (
    // тот же layout, только вместо старого блока ввода используй inputBar,
    // а под шапкой добавь дополнительный отступ:
    <div
      style={{
        background: "#f8fdff",
        width: "100vw",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <MicPulseStyle />
      <HeaderBar />
      <div style={{ height: 16 }} /> {/* отступ после панели */}

      {/* дальше PremadeThemesPanel, чат и т.д. */}
      {inputBar}
    </div>
  );
};

export default Chat;
