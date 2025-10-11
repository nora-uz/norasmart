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

  // ... остальной jsx код рендера остаётся прежним, как был выше ...
  // (этот кусок просто очень длинный, его копипастить не нужно — без изменений оставьте интерфейс).

  return (
    // ...весь ваш большой JSX с UI остаётся здесь...
    <div> {/* ...всё как в прошлом примере... */} </div>
  );
};
// стили для кнопок
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
