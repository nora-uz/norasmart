"use client";
import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";

const NORA_COLOR = "#2e2e2e";
const ICON_SIZE = 23;
const ICONS = {
  telegram: "https://cdn-icons-png.flaticon.com/512/1946/1946547.png",
  trash: "https://cdn-icons-png.flaticon.com/512/1345/1345823.png",
  arrow: (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path d="M6 11H16M16 11L12 7M16 11L12 15" stroke={NORA_COLOR} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
};
const filterNora = "invert(13%) sepia(4%) saturate(271%) hue-rotate(175deg) brightness(92%) contrast(93%)";
const BANNER = "/banner.webp"; // Ваш путь к баннеру!
const borderRadius = 22;
const panelHeight = 62;
const maxWidth = 560;
const GRADIENT = "linear-gradient(90deg, #eff5fe 0%, #e5e8ed 100%)";
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

const Chat: React.FC = () => {
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputDisabled, setInputDisabled] = useState(false);
  const [pickedMonth, setPickedMonth] = useState<number | null>(null);
  const [pickedTopic, setPickedTopic] = useState<typeof TOPICS[0] | null>(null);
  const [firstMessageSent, setFirstMessageSent] = useState(false);
  const [waitingBot, setWaitingBot] = useState(false);
  const [streamedBotText, setStreamedBotText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  return (
    <div
      style={{
        background: "#f8fdff",
        width: "100vw",
        minHeight: "100vh",
        overflow: "hidden",
        position: "relative",
        transition: "background 0.4s"
      }}
    >
      <div style={{ height: 20 }} />
      <div style={{
        width: "calc(100% - 40px)",
        maxWidth,
        minHeight: panelHeight,
        background: GRADIENT,
        color: NORA_COLOR,
        margin: "0px auto 0 auto",
        display: "flex",
        alignItems: "center",
        borderRadius: borderRadius,
        paddingLeft: 20,
        paddingRight: 12,
        paddingTop: 5,
        paddingBottom: 5,
        justifyContent: "flex-start",
        boxSizing: "border-box"
      }}>
        <div style={{
          marginRight: 10,
          color: NORA_COLOR,
          display: "flex",
          flexDirection: "column" as const,
          justifyContent: "center",
          minWidth: 0
        }}>
          <span style={{
            fontWeight: 800, fontSize: "17px", lineHeight: 1.06,
            whiteSpace: "nowrap", marginBottom: 7
          }}>Nora AI</span>
          <span style={{
            fontWeight: 400, fontSize: "11px", color: "#565656",
            lineHeight: 1.04, whiteSpace: "nowrap"
          }}>Ассистент для будущих мам</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: "auto" }}>
          <button style={{
            background: "transparent", border: "none", cursor: "pointer",
            width: 38, height: 38, borderRadius: 19,
            display: "flex", alignItems: "center", justifyContent: "center"
          }} onClick={() => window.open("https://t.me/", "_blank")}>
            <img src={ICONS.telegram} alt="Telegram"
              style={{ width: ICON_SIZE, height: ICON_SIZE, filter: filterNora }} />
          </button>
          <button style={{
            background: "transparent", border: "none", cursor: "pointer",
            width: 38, height: 38, borderRadius: 19,
            display: "flex", alignItems: "center", justifyContent: "center"
          }} onClick={clearChat}>
            <img src={ICONS.trash} alt="Trash"
              style={{ width: ICON_SIZE, height: ICON_SIZE, filter: filterNora }} />
          </button>
        </div>
      </div>
      <div style={{ height: 20 }} />
      <div
        style={{
          width: "calc(100% - 40px)",
          maxWidth,
          borderRadius: 26,
          overflow: "hidden",
          background: "#f8fdff",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
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
      <div style={{ height: 20 }} />

      {/* Выбор месяца и темы */}
      {showSteps && (
        <div style={{
          width: "calc(100% - 40px)",
          maxWidth,
          margin: "0 auto",
          borderRadius: borderRadius,
          background: "#fff",
          marginBottom: 20,
          padding: "18px 20px 22px 20px",
          display: "flex",
          flexDirection: "column" as const,
          alignItems: "center" as const
        }}>
          <div style={{ width: "100%" }}>
            <div style={{
              fontWeight: 600,
              fontSize: 17,
              marginBottom: 20,
              color: NORA_COLOR,
              letterSpacing: "0.03em",
              textAlign: "left"
            }}>
              Выберите срок беременности:
            </div>
            <div style={{
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
                  background: pickedMonth === month ? "#eff5fe" : GRADIENT,
                  color: pickedMonth === month ? NORA_COLOR : NORA_COLOR,
                  opacity: 1,
                  boxShadow: pickedMonth === month ? "0 2px 14px 0 rgba(155,175,205,0.07)" : "none",
                  outline: "none",
                  scrollSnapAlign: "center",
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
          <div style={{ height: 20 }} />
          <div style={{ width: "100%", marginBottom: 0 }}>
            <div style={{
              fontWeight: 600,
              fontSize: 17,
              marginBottom: 20,
              color: NORA_COLOR,
              letterSpacing: "0.03em",
              textAlign: "left"
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
                  background: isSelected ? "#eff5fe" : GRADIENT,
                  color: isSelected ? NORA_COLOR : NORA_COLOR,
                  opacity: disabled ? 0.45 : 1,
                  textAlign: "left",
                  padding: "17px 18px 13px 18px",
                  display: "flex",
                  flexDirection: "column" as const,
                  alignItems: "flex-start" as const,
                  fontWeight: 600,
                  boxShadow: isSelected ? "0 2px 14px 0 rgba(155,175,205,0.07)" : "none",
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
                      color: isSelected ? NORA_COLOR : NORA_COLOR
                    }}>
                      {topic.title}
                    </span>
                    <span style={{
                      fontSize: 15,
                      fontWeight: 400,
                      opacity: 0.95,
                      color: isSelected ? NORA_COLOR : "#565656"
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

      {(firstMessageSent && messages.length > 0) && (
        <>
          <div style={{ height: 20 }} />
          <div style={{
            width: "100%",
            maxWidth,
            margin: "0 auto",
            paddingLeft: 20,
            paddingRight: 20
          }}>
            <div style={{
              background: "#eff5fe",
              color: NORA_COLOR,
              borderRadius: borderRadius,
              padding: "14px 20px",
              fontSize: 16,
              lineHeight: 1.7,
              border: "none",
              boxShadow: "none",
              textAlign: "left",
              marginBottom: 20
            }}>
              {messages[0]?.text}
            </div>
          </div>
        </>
      )}

      {!showSteps && firstMessageSent && (
        <div style={{
          width: "100%",
          maxWidth,
          margin: "0 auto",
          boxSizing: "border-box",
          flex: 1,
          display: "flex",
          flexDirection: "column" as const,
          alignItems: "center" as const,
          overflow: "hidden"
        }}>
          <div style={{ height: 20 }} />
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
                justifyContent: msg.role === "assistant" ? "flex-start" : "flex-end",
                marginBottom: 12
              }}>
                {msg.role === "assistant" ? (
                  <div style={{
                    background: "#fff",
                    color: NORA_COLOR,
                    borderRadius: borderRadius,
                    padding: "16px 32px",
                    fontSize: 16,
                    lineHeight: 1.7,
                    border: "none",
                    width: "calc(100% - 40px)",
                    marginLeft: 20,
                    marginRight: 20,
                    wordBreak: "break-word",
                    alignSelf: "flex-start" as const,
                    boxShadow: "none",
                    textAlign: "left",
                    transition: "background 0.4s, color 0.4s"
                  }}>
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </div>
                ) : (
                  <div style={{
                    background: GRADIENT,
                    color: NORA_COLOR,
                    borderRadius: borderRadius,
                    padding: "14px 32px",
                    fontSize: 16,
                    lineHeight: 1.7,
                    border: "none",
                    maxWidth: "65%",
                    minWidth: 54,
                    marginLeft: 20,
                    marginRight: 20,
                    wordBreak: "break-word",
                    alignSelf: "flex-end" as const,
                    boxShadow: "0 2px 14px 0 rgba(155,175,205,0.07)",
                    textAlign: "right",
                    transition: "background 0.4s, color 0.4s"
                  }}>
                    {msg.text}
                  </div>
                )}
              </div>
            ))}
            {waitingBot && streamedBotText &&
              <div style={{
                width: "100%",
                display: "flex",
                justifyContent: "flex-start",
                marginBottom: 12
              }}>
                <div style={{
                  background: "#fff",
                  color: NORA_COLOR,
                  borderRadius: borderRadius,
                  padding: "16px 32px",
                  fontSize: 16,
                  lineHeight: 1.7,
                  border: "none",
                  width: "calc(100% - 40px)",
                  marginLeft: 20,
                  marginRight: 20,
                  wordBreak: "break-word",
                  alignSelf: "flex-start" as const,
                  boxShadow: "none",
                  textAlign: "left",
                  transition: "background 0.4s, color 0.4s"
                }}>
                  <ReactMarkdown>{streamedBotText}</ReactMarkdown>
                </div>
              </div>
            }
            <div ref={messagesEndRef} />
            <div style={{ height: 80 }} />
          </div>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        style={{
          position: showFixedInput ? "fixed" as const : "static" as const,
          left: showFixedInput ? "50%" : "auto",
          bottom: showFixedInput ? 20 : "auto",
          transform: showFixedInput ? "translateX(-50%)" : "none",
          width: "calc(100% - 40px)",
          maxWidth,
          margin: showFixedInput ? 0 : "0 auto",
          zIndex: showFixedInput ? 2600 : "auto",
          display: "flex",
          alignItems: "center" as const,
          background: "#f8fdff",
          boxSizing: "border-box",
          padding: 0
        }}
      >
        <input
          type="text"
          style={{
            flex: 1,
            border: "1px solid #e5e8ed",
            borderRadius: borderRadius,
            height: 48,
            padding: "0 18px",
            fontSize: 16,
            background: "#fff",
            color: NORA_COLOR,
            outline: "none",
            marginRight: 8
          }}
          value={userInput}
          onChange={e => setUserInput(e.target.value)}
          placeholder="Введите ваш вопрос"
          disabled={inputDisabled}
        />
        <button
          type="submit"
          style={{
            width: 48,
            height: 48,
            background: GRADIENT,
            color: NORA_COLOR,
            border: "none",
            borderRadius: borderRadius,
            fontWeight: 700,
            fontSize: 17,
            marginLeft: 8,
            cursor: inputDisabled ? "not-allowed" : "pointer",
            opacity: inputDisabled ? 0.7 : 1,
            display: "flex",
            alignItems: "center" as const,
            justifyContent: "center" as const,
            boxShadow: "0 2px 14px 0 rgba(155,175,205,0.12)"
          }}
          disabled={inputDisabled}
        >
          <span style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            {ICONS.arrow}
          </span>
        </button>
      </form>
      <div style={{ height: 20 }} />
    </div>
  );
};

export default Chat;
