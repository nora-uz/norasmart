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

// круглые кнопки-иконки
const ICON_BUTTON_SIZE = 38;
const ICON_BG = "#ffffff";
const ICON_BORDER = "#e1e9f5";
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
const filterNora =
  "invert(13%) sepia(4%) saturate(271%) hue-rotate(175deg) brightness(92%) contrast(93%)";

// контурные иконки для файла и микрофона
const IconPaperclip = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path
      d="M8.5 12.5L14 7C15.1 5.9 16.9 5.9 18 7C19.1 8.1 19.1 9.9 18 11L11 18C9.3 19.7 6.5 19.7 4.8 18C3.1 16.3 3.1 13.5 4.8 11.8L11.5 5"
      stroke={ICON_DARK}
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconMic = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <rect
      x="9"
      y="4"
      width="6"
      height="10"
      rx="3"
      stroke={ICON_DARK}
      strokeWidth="1.6"
    />
    <path
      d="M7 11C7 13.2 8.8 15 11 15H13C15.2 15 17 13.2 17 11"
      stroke={ICON_DARK}
      strokeWidth="1.6"
      strokeLinecap="round"
    />
    <path
      d="M12 15V19"
      stroke={ICON_DARK}
      strokeWidth="1.6"
      strokeLinecap="round"
    />
    <path
      d="M9.5 19H14.5"
      stroke={ICON_DARK}
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  </svg>
);

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

// темы (чипы) для старта диалога
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
    question: "Я часто волнуюсь и боюсь за малыша, как справиться с тревогой?",
  },
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
      boxSizing: "border-box" as const,
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
        Что умеет Nora Plus
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
              <div
                style={{
                  fontWeight: 700,
                  fontSize: 16,
                  color: NORA_COLOR,
                  marginBottom: 7,
                  textAlign: "left",
                }}
              >
                {title}
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: "#3a3a3a",
                  lineHeight: "1.64",
                  textAlign: "left",
                }}
              >
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
  <div
    style={{
      width: `calc(100% - ${BLOCK_SIDE_PADDING * 2}px)`,
      maxWidth,
      margin: "0 auto 38px auto",
      background: GRADIENT,
      borderRadius: borderRadius,
      boxShadow: "0 6px 20px 0 rgba(150, 175, 205, 0.10)",
      boxSizing: "border-box" as const,
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
  </div>
);

// футер
const Footer = () => (
  <div
    style={{
      width: `calc(100% - 40px)`,
      maxWidth,
      margin: "0 auto",
      background: GRADIENT,
      borderRadius: "22px",
      boxShadow: "0 -4px 14px 0 rgba(155,175,205,0.06)",
      boxSizing: "border-box" as const,
      fontFamily: "'Manrope', Arial, Helvetica, sans-serif",
      paddingLeft: 15,
      paddingRight: 15,
      paddingTop: 22,
      paddingBottom: 22,
      display: "flex",
      flexDirection: "column",
      gap: 18,
      alignItems: "center",
    }}
  >
    <div
      style={{
        fontSize: 12,
        color: "#263540",
        fontWeight: 600,
        textAlign: "center",
        width: "100%",
      }}
    >
      Ташкент, Юнусабадский район, массив Кашгар 26
    </div>
    <div
      style={{
        display: "flex",
        gap: 11,
        width: "100%",
        justifyContent: "center",
      }}
    >
      <a
        href="#"
        style={{
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
          marginRight: 5,
        }}
      >
        {IconPartner} Стать партнёром
      </a>
      <a
        href="#"
        style={{
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
          gap: 7,
        }}
      >
        {IconContact} Контакты
      </a>
    </div>
    <a
      href="#"
      style={{
        background: "#fff",
        padding: "9px 0",
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
        gap: 8,
      }}
    >
      {IconShield} Политика конфиденциальности
    </a>
    <div
      style={{
        marginTop: 8,
        fontSize: 12,
        color: "#8a97a0",
        textAlign: "center",
        width: "100%",
      }}
    >
      © {new Date().getFullYear()} Nora Plus — забота и поддержка будущих мам
    </div>
  </div>
);

const FooterGap = () => <div style={{ height: 20 }} />;

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

// панель тем без заголовка
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
              (e.currentTarget as HTMLButtonElement).style.transform = "scale(0.97)";
            }}
            onMouseUp={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
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

// ГЛАВНЫЙ КОМПОНЕНТ ЧАТА
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
    } catch (error) {
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

  const clearChatAll = () => {
    setChatHistory([]);
    setThreadId(null);
    window.localStorage.removeItem(THREAD_KEY);
    setShowWelcome(true);
    setBotProgress("");
  };

  const startListening = () => {
    if (typeof window === "undefined") return;
    const SpeechRecognition =
      (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
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
    } catch (err) {
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

  // WELCOME-ЭКРАН
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
        {/* верхняя панель */}
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
                width: 38,
                height: 38,
                borderRadius: 19,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              onClick={clearChatAll}
            >
              <img
                src={ICONS.trash}
                alt="Trash"
                style={{ width: ICON_SIZE, height: ICON_SIZE, filter: filterNora }}
              />
            </button>
          </div>
        </div>

        <div style={{ height: 20 }} />
        <div style={{ height: 20 }} />

        {/* видео Норы */}
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
        <div style={{ height: 20 }} />
        <div style={{ height: 20 }} />

        {/* главный текст и CTA */}
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
              marginBottom: 10,
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
              margin: "0 auto 0 auto",
              maxWidth: 400,
              padding: "0 18px",
              lineHeight: 1.75,
              color: NORA_COLOR,
              display: "inline-block",
            }}
          >
            Нора — ассистент, который отвечает на вопросы, успокаивает, напоминает о важных делах
            и делится рекомендациями на основе медицины Великобритании NHS. Не гуглите в панике —
            просто спросите Нору.
          </div>

          <div style={{ height: 24 }} />

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

          {/* текст под кнопкой */}
          <div style={{ height: 16 }} />
          <div
            style={{
              fontSize: 13,
              color: "#7c8792",
              marginBottom: 24,
            }}
          >
            Уже более 1&nbsp;000 будущих мам задают вопросы Норе.
          </div>

          <WhyNoraBlock />
          <ReviewBlock />
          <Footer />
          <FooterGap />
        </div>
      </div>
    );
  }

  // ЭКРАН ЧАТА
  return (
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
      {/* панель сверху */}
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
              width: 38,
              height: 38,
              borderRadius: 19,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={clearChatAll}
          >
            <img
              src={ICONS.trash}
              alt="Trash"
              style={{ width: ICON_SIZE, height: ICON_SIZE, filter: filterNora }}
            />
          </button>
        </div>
      </div>

      {/* темы для быстрого старта */}
      <PremadeThemesPanel
        disabled={loading || !!botProgress}
        onSend={(q) => {
          if (!loading && !botProgress) {
            sendMessageToGPT(q);
          }
        }}
      />

      {/* текст-подсказка между темами и историей */}
      {chatHistory.length === 0 && !botProgress && (
        <div
          style={{
            fontSize: 14,
            color: "#7c8792",
            textAlign: "center",
            margin: "4px 24px 6px 24px",
            lineHeight: 1.6,
          }}
        >
          Напишите Норе, как вы себя чувствуете.
        </div>
      )}

      {/* история чата */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: maxWidth,
            margin: "0 auto",
            padding: "8px 0 110px 0",
          }}
        >
          {chatHistory.map((msg, idx) => (
            <div
              key={idx}
              style={{
                textAlign: msg.sender === "user" ? "right" : "left",
                margin: "8px 20px",
              }}
            >
              {msg.sender === "user"
                ? <span style={userMessageStyle}>{msg.text}</span>
                : splitBotTextTwoBlocks(msg.text).map((part, sIdx) =>
                    part.text && (
                      <div
                        key={sIdx}
                        style={{
                          background: "#f7fafd",
                          borderRadius: 12,
                          padding: "10px 15px",
                          marginBottom: sIdx === 0 ? 18 : 30,
                          color: NORA_COLOR,
                          fontSize: 16,
                          lineHeight: 1.7,
                          fontWeight: part.bold ? "bold" : "normal",
                          wordBreak: "break-word",
                          overflowWrap: "anywhere",
                        }}
                      >
                        {part.text}
                      </div>
                    )
                  )}
            </div>
          ))}

          {botProgress &&
            splitBotTextTwoBlocks(botProgress).map((part, sIdx) =>
              part.text ? (
                <div
                  key={sIdx}
                  style={{
                    background: "#f7fafd",
                    borderRadius: 12,
                    padding: "10px 15px",
                    margin: "0 20px 10px 20px",
                    color: NORA_COLOR,
                    fontSize: 16,
                    lineHeight: 1.7,
                    fontWeight: part.bold ? "bold" : "normal",
                    wordBreak: "break-word",
                    overflowWrap: "anywhere",
                  }}
                >
                  {part.text}
                </div>
              ) : null
            )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* панель ввода */}
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
            paddingRight: 6,
            boxSizing: "border-box",
            boxShadow: "0 2px 14px 0 rgba(155,175,205,0.10)",
          }}
        >
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
          />

          <input
            type="text"
            value={message}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Задайте вопрос..."
            style={{
              flex: 1,
              height: 52,
              fontSize: "17px",
              border: "none",
              outline: "none",
              background: "transparent",
              color: NORA_COLOR,
              boxSizing: "border-box",
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSendMessage();
            }}
            disabled={loading || !!botProgress}
          />

          {/* файл */}
          <button
            onClick={openFileDialog}
            disabled={loading || !!botProgress}
            style={{
              width: ICON_BUTTON_SIZE,
              height: ICON_BUTTON_SIZE,
              borderRadius: ICON_BUTTON_SIZE / 2,
              border: `1px solid ${ICON_BORDER}`,
              background: ICON_BG,
              cursor: loading || !!botProgress ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginRight: 6,
            }}
            title="Прикрепить файл"
          >
            {IconPaperclip}
          </button>

          {/* микрофон */}
          <button
            onClick={startListening}
            disabled={loading || !!botProgress}
            style={{
              width: ICON_BUTTON_SIZE,
              height: ICON_BUTTON_SIZE,
              borderRadius: ICON_BUTTON_SIZE / 2,
              border: `1px solid ${ICON_BORDER}`,
              background: ICON_BG,
              cursor: loading || !!botProgress ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginRight: 6,
              animation: isListening ? "micPulseNora 1.1s infinite ease-out" : "none",
            }}
            title={isListening ? "Идёт запись..." : "Голосовой ввод"}
          >
            {IconMic}
          </button>

          {/* отправка */}
          <button
            style={{
              width: ICON_BUTTON_SIZE,
              height: ICON_BUTTON_SIZE,
              background: BABY_GRADIENT,
              color: "#fff",
              border: "none",
              borderRadius: ICON_BUTTON_SIZE / 2,
              fontWeight: 700,
              fontSize: "17px",
              cursor: loading || !!botProgress ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 14px 0 rgba(155,175,205,0.12)",
              marginLeft: 2,
            }}
            onClick={handleSendMessage}
            disabled={loading || !!botProgress}
          >
            <span
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {ICONS.arrowRight}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
