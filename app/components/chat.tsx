"use client";
import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";

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
const blockMargin = 20;
const panelHeight = 62;
const maxWidth = 560;
const GRADIENT = "linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)";

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
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: messagesArr })
    });
    const data = await res.json();
    if (data.reply) return data.reply;
    return data.error || "Ошибка получения ответа ассистента";
  } catch (error: any) {
    return "Ошибка: " + error.message;
  }
}

function iconBtn(color: string) {
  return {
    background: color,
    border: "none",
    cursor: "pointer",
    width: BTN_SIZE,
    height: BTN_SIZE,
    borderRadius: BTN_SIZE / 2,
    padding: 0,
    display: "flex",
    alignItems: "center" as const,
    justifyContent: "center" as const,
    boxShadow: "none"
  };
}
const iconImgPanel = {
  width: ICON_SIZE_PANEL,
  height: ICON_SIZE_PANEL,
  display: "block" as const,
  background: "none",
  filter: "brightness(0) invert(1)"
};
const iconImgSend = {
  width: ICON_SIZE_SEND,
  height: ICON_SIZE_SEND,
  display: "block" as const,
  background: "none"
};

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

const Chat: React.FC = () => {
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputDisabled, setInputDisabled] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [pickedMonth, setPickedMonth] = useState<number | null>(null);
  const [pickedTopic, setPickedTopic] = useState<typeof TOPICS[0] | null>(null);
  const [firstMessageSent, setFirstMessageSent] = useState(false);
  const [waitingBot, setWaitingBot] = useState(false);
  const [streamedBotText, setStreamedBotText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const theme = darkMode ? themes.dark : themes.light;
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamedBotText]);

  const showSteps = !(pickedMonth && pickedTopic) && !firstMessageSent;
  const showFixedInput = pickedMonth && pickedTopic;

  const handleMonthPick = (month: number) => {
    if (inputDisabled) return;
    setPickedMonth(month);
    setPickedTopic(null);
    setUserInput("");
    setFirstMessageSent(false);
    setMessages([]);
  };

  async function streamBotResponse(msg: string, existing: Message[]) {
    setStreamedBotText("");
    setWaitingBot(true);
    try {
      let reply = await getAssistantReply([{ role: "user" as Role, text: msg }]);
      let arr = reply.split("");
      for (let i = 0; i <= arr.length; i++) {
        setStreamedBotText(arr.slice(0, i).join(""));
        await new Promise(r => setTimeout(r, 13));
      }
      setMessages([
        ...existing,
        { role: "assistant" as Role, text: reply }
      ]);
    } catch {
      setMessages([
        ...existing,
        { role: "assistant" as Role, text: "Ошибка ответа ассистента, попробуйте позже." }
      ]);
    } finally {
      setStreamedBotText("");
      setInputDisabled(false);
      setWaitingBot(false);
    }
  }

  const handleTopicPick = async (topic: typeof TOPICS[0]) => {
    if (inputDisabled || !pickedMonth) return;
    setPickedTopic(topic);
    const templateMessage = `Срок беременности: ${pickedMonth} месяц, хочу обсудить ${topic.title.toLowerCase()} и ${topic.desc.toLowerCase()}.`;
    setMessages([{ role: "user" as Role, text: templateMessage }]);
    setFirstMessageSent(true);
    setUserInput("");
    setInputDisabled(true);
    setWaitingBot(true);
    await streamBotResponse(templateMessage, [{ role: "user" as Role, text: templateMessage }]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || inputDisabled) return;
    setMessages(prev => [...prev, { role: "user" as Role, text: userInput }]);
    setUserInput("");
    setInputDisabled(true);
    setWaitingBot(true);
    await streamBotResponse(userInput, [...messages, { role: "user" as Role, text: userInput }]);
  };

  const clearChat = () => {
    setMessages([]);
    setUserInput("");
    setPickedMonth(null);
    setPickedTopic(null);
    setFirstMessageSent(false);
    setWaitingBot(false);
    setStreamedBotText("");
  };

  function assistantBubbleStyle() {
    return {
      background: theme.assistantBubble,
      color: theme.assistantText,
      borderRadius: borderRadius,
      padding: "16px 32px",
      fontSize: 16,
      lineHeight: 1.7,
      border: "none",
      width: "100%",
      margin: "0 auto",
      wordBreak: "break-word" as const,
      alignSelf: "flex-start" as const,
      boxShadow: "none",
      textAlign: "left" as const,
      transition: "background 0.4s, color 0.4s"
    };
  }
  function userBubbleStyle() {
    return {
      background: theme.userBubble,
      color: theme.userText,
      borderRadius: borderRadius,
      padding: "14px 32px",
      fontSize: 16,
      lineHeight: 1.7,
      border: "none",
      maxWidth: "65%",
      minWidth: 54,
      margin: "0 auto",
      wordBreak: "break-word" as const,
      alignSelf: "flex-end" as const,
      boxShadow: "none",
      textAlign: "right" as const,
      transition: "background 0.4s, color 0.4s"
    };
  }

  return (
    <div
      style={{
        background: theme.bgColor,
        width: "100vw",
        minHeight: 800,
        overflow: "hidden",
        position: "relative",
        transition: "background 0.4s"
      }}
    >
      {/* Панель управления */}
      <div style={{
        width: "100%",
        maxWidth,
        margin: "0 auto",
        paddingLeft: 20,
        paddingRight: 20
      }}>
        <div
          style={{
            height: panelHeight,
            background: GRADIENT,
            color: "#fff",
            display: "flex",
            alignItems: "center" as const,
            borderRadius: borderRadius,
            padding: `0 16px`,
            justifyContent: "flex-start" as const,
            boxSizing: "border-box",
            position: "relative",
            zIndex: 2000,
            transition: "background 0.4s, color 0.4s"
          }}
        >
          <div style={{ fontWeight: 800, fontSize: 25, marginRight: 16 }}>
            Nora AI
          </div>
          <div style={{ display: "flex", alignItems: "center" as const, gap: 7, marginLeft: "auto" }}>
            <button style={iconBtn("transparent")} onClick={() => setDarkMode((prev) => !prev)}>
              <img src={darkMode ? ICONS.sun : ICONS.moon} alt="Theme" style={iconImgPanel} />
            </button>
            <button style={iconBtn("transparent")} onClick={() => window.open("https://t.me/", "_blank")}>
              <img src={ICONS.telegram} alt="Telegram" style={iconImgPanel} />
            </button>
            <button style={{ ...iconBtn("transparent"), marginRight: -16 }} onClick={clearChat}>
              <img src={ICONS.trash} alt="Trash" style={iconImgPanel} />
            </button>
          </div>
        </div>
      </div>
      <div style={{ height: blockMargin }} />
      {/* Баннер */}
      <div
        style={{
          width: "100%",
          maxWidth,
          margin: "0 auto",
          paddingLeft: 20,
          paddingRight: 20,
          borderRadius: 26,
          overflow: "hidden",
          background: theme.bgColor,
          display: "flex",
          justifyContent: "center" as const,
          alignItems: "center" as const,
          position: "relative"
        }}
      >
        <img
          src={BANNER}
          alt="Nora AI баннер"
          style={{
            width: "100%",
            height: "auto",
            display: "block",
            objectFit: "contain",
            objectPosition: "center"
          }}
        />
      </div>

      {/* Шаблонное сообщение */}
      {(firstMessageSent && messages.length > 0) && (
        <div style={{
          width: "100%",
          maxWidth,
          margin: "20px auto 0 auto",
          paddingLeft: 20,
          paddingRight: 20,
          background: "#F6F7FB",
          color: "#232323",
          borderRadius: borderRadius,
          padding: "18px 22px",
          fontSize: 16,
          lineHeight: 1.7,
          border: "none",
          boxShadow: "none",
          textAlign: "left"
        }}>
          {messages[0]?.text}
        </div>
      )}

      <div style={{ height: blockMargin }} />

      {/* Компактный step выбора срока и темы */}
      {showSteps && (
        <div style={{
          width: "100%",
          maxWidth,
          margin: "0 auto",
          borderRadius: borderRadius,
          background: theme.inputBg,
          marginBottom: blockMargin,
          padding: `18px 0 22px 0`,
          display: "flex",
          flexDirection: "column" as const,
          alignItems: "center" as const
        }}>
          <div style={{ width: "100%" }}>
            <div style={{
              fontWeight: 400,
              fontSize: 17,
              marginBottom: blockMargin,
              color: "#fff",
              letterSpacing: "0.03em"
            }}>
              Выберите срок беременности:
            </div>
            <div className="months-scroll" style={{
              display: "flex",
              gap: 12,
              overflowX: "auto",
              padding: "6px 0 6px 0",
              scrollSnapType: "x mandatory"
            }}>
              {[...Array(9)].map((_, i) => {
                let month = i + 1;
                let styleBtn = {
                  minWidth: 52,
                  height: 52,
                  borderRadius: 20,
                  border: "none",
                  cursor: inputDisabled ? "not-allowed" : "pointer",
                  fontSize: 26,
                  fontWeight: 600,
                  background: pickedMonth === month ? "#fff" : GRADIENT,
                  color: pickedMonth === month ? "#2575fc" : "#fff",
                  opacity: 1,
                  boxShadow: "none",
                  outline: "none",
                  scrollSnapAlign: "center" as const,
                  marginRight: i < 8 ? 9 : 0,
                  transition: "box-shadow 0.2s, background 0.2s, color 0.2s"
                };
                return (
                  <button
                    key={month}
                    style={styleBtn}
                    disabled={inputDisabled}
                    onClick={() => handleMonthPick(month)}
                  >
                    {month}
                  </button>
                );
              })}
            </div>
          </div>
          <div style={{ height: blockMargin }} />
          <div style={{ width: "100%", marginBottom: 0 }}>
            <div style={{
              fontWeight: 400,
              fontSize: 17,
              marginBottom: blockMargin,
              color: "#fff",
              letterSpacing: "0.03em"
            }}>
              Выберите тему для обсуждения:
            </div>
            <div style={{ display: "flex", flexDirection: "column" as const, gap: 16 }}>
              {TOPICS.map((topic, i) => {
                let isSelected = pickedTopic?.title === topic.title;
                let disabled = inputDisabled || !pickedMonth;
                let styleBtn = {
                  width: "100%",
                  borderRadius: 18,
                  border: "none",
                  cursor: disabled ? "not-allowed" : "pointer",
                  background: isSelected ? "#fff" : GRADIENT,
                  color: isSelected ? "#2575fc" : "#fff",
                  opacity: disabled ? 0.45 : 1,
                  textAlign: "left" as const,
                  padding: "17px 18px 13px 18px",
                  display: "flex",
                  flexDirection: "column" as const,
                  alignItems: "flex-start" as const,
                  fontWeight: 600,
                  boxShadow: "none",
                  outline: "none",
                  filter: disabled ? "brightness(0.7) grayscale(0.4)" : "none",
                  transition: "box-shadow 0.2s, background 0.2s, color 0.2s"
                };
                return (
                  <button
                    key={i}
                    style={styleBtn}
                    disabled={disabled}
                    onClick={() => handleTopicPick(topic)}
                  >
                    <span style={{
                      fontSize: 19,
                      fontWeight: 700,
                      marginBottom: 5,
                      color: isSelected ? "#2575fc" : "#fff"
                    }}>
                      {topic.title}
                    </span>
                    <span style={{
                      fontSize: 15,
                      fontWeight: 400,
                      opacity: 0.95,
                      color: isSelected ? "#2575fc" : "#fff"
                    }}>
                      {topic.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Блок сообщений (чат) */}
      {!showSteps && firstMessageSent && (
        <div style={{
          width: "100%",
          maxWidth,
          margin: "20px auto 0 auto",
          paddingLeft: 20,
          paddingRight: 20,
          boxSizing: "border-box",
          flex: 1,
          display: "flex",
          flexDirection: "column" as const,
          alignItems: "center" as const,
          overflow: "hidden"
        }}>
          <div style={{ height: blockMargin }} />
          <div style={{
            width: "100%",
            flex: 1,
            minHeight: 0,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column" as const,
            justifyContent: "flex-start" as const
          }}>
            {messages.slice(1).map((msg, idx) => (
              <div key={idx} style={{
                width: "100%",
                display: "flex",
                justifyContent: msg.role === "assistant" ? "flex-start" as const : "flex-end" as const,
                marginBottom: 12
              }}>
                {msg.role === "assistant" ? (
                  <div style={assistantBubbleStyle()}>
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </div>
                ) : (
                  <div style={userBubbleStyle()}>
                    {msg.text}
                  </div>
                )}
              </div>
            ))}
            {waitingBot && streamedBotText &&
              <div style={{
                width: "100%",
                display: "flex",
                justifyContent: "flex-start" as const,
                marginBottom: 12
              }}>
                <div style={assistantBubbleStyle()}>
                  <ReactMarkdown>{streamedBotText}</ReactMarkdown>
                </div>
              </div>
            }
            <div ref={messagesEndRef} />
            <div style={{ height: BTN_SIZE + 48 }} />
          </div>
        </div>
      )}

      {/* Поле ввода (form) */}
      <div style={{
        width: "100%",
        maxWidth,
        margin: "0 auto",
        paddingLeft: 20,
        paddingRight: 20
      }}>
        <form
          onSubmit={handleSubmit}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            boxSizing: "border-box"
          }}
        >
          <div style={{
            display: "flex",
            alignItems: "center",
            background: theme.inputBg,
            borderRadius: borderRadius,
            flex: 1,
            height: 62,
            boxShadow: "none"
          }}>
            <input
              type="text"
              style={{
                flex: 1,
                border: "none",
                borderRadius: borderRadius,
                height: "100%",
                padding: "0 12px",
                fontSize: 22,
                background: "transparent",
                color: theme.inputText,
                outline: "none"
              }}
              value={userInput}
              onChange={e => setUserInput(e.target.value)}
              placeholder="Введите ваш вопрос"
              disabled={inputDisabled}
              className="nora-input"
            />
            <button
              type="submit"
              style={{
                background: "#fff",
                color: "#2575fc",
                border: "none",
                borderTopRightRadius: borderRadius,
                borderBottomRightRadius: borderRadius,
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0,
                width: 62,
                height: 62,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                cursor: inputDisabled ? "not-allowed" : "pointer",
                opacity: inputDisabled ? 0.7 : 1,
                boxShadow: "none",
                marginLeft: 0
              }}
              disabled={inputDisabled}
            >
              <img src={ICONS.arrow} alt="Send" style={iconImgSend} />
            </button>
          </div>
          <style>{`
            .nora-input::placeholder {
              color: ${theme.placeholder};
              opacity: 1;
              font-size: 22px;
            }
          `}</style>
        </form>
      </div>
      <div style={{ height: blockMargin }} />
    </div>
  );
};

export default Chat;
