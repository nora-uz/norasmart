"use client";
import React, { useState, useEffect, useRef } from "react";

const ICONS = {
  telegram: "https://cdn-icons-png.flaticon.com/512/9821/9821637.png",
  sun: "https://cdn-icons-png.flaticon.com/512/16769/16769231.png",
  moon: "https://cdn-icons-png.flaticon.com/512/16769/16769231.png",
  trash: "https://cdn-icons-png.flaticon.com/512/3917/3917772.png",
  arrow: "https://cdn-icons-png.flaticon.com/512/3916/3916848.png"
};
const BANNER = "https://user-gen-media-assets.s3.amazonaws.com/seedream_images/4c36a715-f500-4186-8955-631a09fac0ed.png";
const ICON_SIZE_PANEL = 18;
const ICON_SIZE_SEND = 28;
const BTN_SIZE = 50;
const SEND_BTN_SIZE = 78;
const borderRadius = 22;
const sidePad = 16;
const blockMargin = 20;
const panelHeight = 62;
const maxWidth = 560;
const GRADIENT = "linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)";

const themes = {
  dark: {
    panelBg: "#232323",
    bgColor: "#1C1C1C",
    userBubble: "#343434",
    userText: "#fff",
    inputBg: "#232323",
    inputText: "#fff",
    placeholder: "#888",
    assistantBubble: "#262939",
    assistantText: "#fff"
  },
  light: {
    panelBg: "#F6F7FB",
    bgColor: "#F9FAFC",
    userBubble: "#fff",
    userText: "#333",
    inputBg: "#F6F7FB",
    inputText: "#222",
    placeholder: "#333",
    assistantBubble: "#E8EAED",
    assistantText: "#333"
  }
};
const TOPICS = [
  { title: "Сон", desc: "Проблемы с бессонницей и усталостью" },
  { title: "Питание", desc: "Рацион и полезные продукты" },
  { title: "Стрессы", desc: "Как управлять тревогой" },
  { title: "Готовность к родам", desc: "Что знать заранее" },
  { title: "Самочувствие", desc: "Физическое и эмоциональное состояние" },
  { title: "Витамины", desc: "Что принимать, когда и зачем" },
  { title: "Физическая активность", desc: "Можно ли и какую выбрать?" }
];

type Role = "user" | "assistant";
type Message = { role: Role; text: string };

async function getAssistantReply(messagesArr: Message[]) {
  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ messages: messagesArr })
    });
    const data = await res.json();
    if (data.reply) return data.reply;
    return data.error || "Ошибка получения ответа ассистента";
  } catch (error: any) {
    return "Ошибка: " + error.message;
  }
}

const Chat: React.FC = () => {
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputDisabled, setInputDisabled] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [pickedMonth, setPickedMonth] = useState<number | null>(null);
  const [pickedTopic, setPickedTopic] = useState<typeof TOPICS[0] | null>(null);
  const [firstMessageSent, setFirstMessageSent] = useState(false);
  const [waitingBot, setWaitingBot] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const theme = darkMode ? themes.dark : themes.light;
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const showSteps = !(pickedMonth && pickedTopic) && !firstMessageSent;
  const showFixedInput = pickedMonth && pickedTopic;

  const handleMonthPick = (month: number) => {
    if (inputDisabled) return;
    setPickedMonth(month);
    setPickedTopic(null);
    setUserInput("");
    setFirstMessageSent(false);
  };
  const handleTopicPick = async (topic: typeof TOPICS[0]) => {
    if (inputDisabled || !pickedMonth) return;
    setPickedTopic(topic);
    const templateMessage = `Срок беременности: ${pickedMonth} месяц, хочу обсудить ${topic.title.toLowerCase()} и ${topic.desc.toLowerCase()}.`;

    setMessages([{ role: "user", text: templateMessage }]);
    setFirstMessageSent(true);
    setUserInput("");
    setInputDisabled(true);
    setWaitingBot(true);

    try {
      const assistantReply = await getAssistantReply([{ role: "user", text: templateMessage }]);
      setMessages(prev => [...prev, { role: "assistant", text: assistantReply }]);
    } catch {
      setMessages(prev => [
        ...prev,
        { role: "assistant", text: "Ошибка ответа ассистента, попробуйте позже." }
      ]);
    } finally {
      setInputDisabled(false);
      setWaitingBot(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || inputDisabled) return;
    setMessages(prev => [...prev, { role: "user", text: userInput }]);
    setUserInput("");
    setInputDisabled(true);
    setWaitingBot(true);

    try {
      const userHistory: Message[] = [
        ...(pickedMonth ? [{ role: "user" as const, text: `Мой срок беременности: ${pickedMonth} месяц` }] : []),
        ...(pickedTopic ? [{ role: "user" as const, text: `Тема: ${pickedTopic.title}. ${pickedTopic.desc}` }] : []),
        ...messages
          .filter(msg => msg.role === "user")
          .map(msg => ({ role: "user" as const, text: msg.text })),
        { role: "user", text: userInput }
      ];
      const assistantReply = await getAssistantReply(userHistory);
      setMessages(prev => [
        ...prev,
        { role: "assistant", text: assistantReply }
      ]);
    } catch {
      setMessages(prev => [
        ...prev,
        { role: "assistant", text: "Ошибка ответа ассистента, попробуйте позже." }
      ]);
    } finally {
      setInputDisabled(false);
      setWaitingBot(false);
    }
  };
  const clearChat = () => {
    setMessages([]);
    setUserInput("");
    setPickedMonth(null);
    setPickedTopic(null);
    setFirstMessageSent(false);
    setWaitingBot(false);
  };

  // --- JSX код интерфейса ниже! ---
  return (
    <div style={{
      maxWidth,
      margin: "0 auto",
      background: theme.bgColor,
      minHeight: "100vh",
      borderRadius: borderRadius,
      padding: sidePad,
      position: "relative"
    }}>
      {/* Панель управления */}
      <div style={{
        background: theme.panelBg,
        display: "flex",
        alignItems: "center",
        padding: "8px 16px",
        borderRadius: 16,
        marginBottom: blockMargin,
        height: panelHeight,
        justifyContent: "space-between"
      }}>
        <img src={BANNER} alt="Баннер" style={{ height: 40, borderRadius: 8 }} />
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => setDarkMode(!darkMode)} style={iconBtn(theme.panelBg)}>
            <img src={darkMode ? ICONS.sun : ICONS.moon} style={iconImgPanel} alt="Тема" />
          </button>
          <button onClick={clearChat} style={iconBtn(theme.panelBg)}>
            <img src={ICONS.trash} style={iconImgPanel} alt="Очистить" />
          </button>
        </div>
      </div>

      {/* Выбор месяца и темы */}
      {showSteps && (
        <div>
          <h3 style={{ color: theme.userText, marginBottom: 12 }}>Выберите срок беременности</h3>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 18 }}>
            {[...Array(10)].map((_, i) => (
              <button key={i+1}
                onClick={() => handleMonthPick(i+1)}
                style={{
                  padding: "6px 16px",
                  borderRadius: 14,
                  border: pickedMonth === i+1 ? `2px solid #2575fc` : "1px solid #888",
                  background: pickedMonth === i+1 ? "#2575fc" : theme.inputBg,
                  color: pickedMonth === i+1 ? "#fff" : theme.userText,
                  cursor: "pointer"
                }}
              >{i+1}</button>
            ))}
          </div>

          {pickedMonth && (
            <>
              <h3 style={{ color: theme.userText, marginBottom: 12 }}>Выберите тему</h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {TOPICS.map((topic) => (
                  <button
                    key={topic.title}
                    style={{
                      padding: "6px 12px",
                      borderRadius: 14,
                      border: pickedTopic?.title === topic.title ? `2px solid #2575fc` : "1px solid #888",
                      background: pickedTopic?.title === topic.title ? "#2575fc" : theme.inputBg,
                      color: pickedTopic?.title === topic.title ? "#fff" : theme.userText,
                      cursor: "pointer",
                      minWidth: 140,
                      textAlign: "left"
                    }}
                    onClick={() => handleTopicPick(topic)}
                  >
                    <div style={{ fontWeight: 600 }}>{topic.title}</div>
                    <div style={{ fontSize: 12, color: theme.placeholder }}>{topic.desc}</div>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* История чата */}
      {(!showSteps || firstMessageSent) && (
        <div style={{
          minHeight: 220,
          maxHeight: 420,
          overflowY: "auto",
          padding: "12px 0",
          marginTop: 10,
          marginBottom: 10
        }}>
          {messages.map((msg, idx) => (
            <div key={idx}
              style={{
                display: "flex",
                flexDirection: msg.role === "user" ? "row-reverse" : "row",
                alignItems: "flex-end",
                marginBottom: 8
              }}
            >
              <div style={{
                maxWidth: "78%",
                background: msg.role === "user" ? theme.userBubble : theme.assistantBubble,
                color: msg.role === "user" ? theme.userText : theme.assistantText,
                padding: "12px 18px",
                borderRadius: 14,
                wordBreak: "break-word",
                fontSize: 16
              }}>{msg.text}</div>
            </div>
          ))}
          {waitingBot &&
            <div style={{
              color: theme.assistantText,
              fontStyle: "italic",
              marginLeft: 8,
              marginBottom: 8
            }}>
              Ассистент печатает...
            </div>
          }
          <div ref={messagesEndRef} />
        </div>
      )}

      {/* Ввод сообщения */}
      {showFixedInput && (
        <form onSubmit={handleSubmit} style={{
          display: "flex",
          alignItems: "center",
          background: theme.inputBg,
          borderRadius: 16,
          padding: "10px 10px",
          marginTop: 10
        }}>
          <input
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              background: "transparent",
              color: theme.inputText,
              fontSize: 16,
              padding: "8px 8px"
            }}
            value={userInput}
            onChange={e => setUserInput(e.target.value)}
            disabled={inputDisabled}
            placeholder="Введите сообщение..."
          />
          <button
            type="submit"
            disabled={inputDisabled || !userInput.trim()}
            style={{
              background: GRADIENT,
              border: "none",
              borderRadius: 16,
              width: SEND_BTN_SIZE,
              height: SEND_BTN_SIZE,
              marginLeft: 12,
              cursor: inputDisabled || !userInput.trim() ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <img src={ICONS.arrow} style={iconImgSend}
              alt="Отправить" />
          </button>
        </form>
      )}
    </div>
  );
};

// Стили для кнопок
const iconBtn = (color: string) => ({
  background: color,
  border: "none",
  cursor: "pointer",
  width: BTN_SIZE,
  height: BTN_SIZE,
  borderRadius: BTN_SIZE / 2,
  padding: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "none"
});
const iconImgPanel = {
  width: ICON_SIZE_PANEL,
  height: ICON_SIZE_PANEL,
  display: "block",
  background: "none",
  filter: "brightness(0) invert(1)"
};
const iconImgSend = {
  width: ICON_SIZE_SEND,
  height: ICON_SIZE_SEND,
  display: "block",
  background: "none"
};

export default Chat;
