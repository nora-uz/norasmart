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

const OPENAI_API_KEY = "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";
const ASSISTANT_ID = "asst_O0ENHkHsICvLEjBXleQpyqDx";

async function getAssistantReply(messagesArr) {
  let thread_id = null;
  let assistantMessage = "Нет ответа";
  try {
    // 1. Thread
    const threadRes = await fetch("https://api.openai.com/v1/threads", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({})
    });
    const threadText = await threadRes.text();
    console.log("OpenAI /threads response:", threadRes.status, threadText);

    let threadData;
    try {
      threadData = JSON.parse(threadText);
    } catch (e) {
      throw new Error("Ошибка чтения JSON ответа OpenAI: " + e.message);
    }
    thread_id = threadData.id;
    if (!thread_id) throw new Error("Ошибка создания thread");

    // 2. Messages
    for (const message of messagesArr) {
      await fetch(`https://api.openai.com/v1/threads/${thread_id}/messages`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          role: message.role,
          content: message.text
        })
      });
    }

    // 3. Run ассистента
    const runRes = await fetch(`https://api.openai.com/v1/threads/${thread_id}/runs`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        assistant_id: ASSISTANT_ID
      })
    });
    const runData = await runRes.json();
    const run_id = runData.id;
    if (!run_id) throw new Error("Ошибка запуска run");

    // 4. Polling с лимитом времени
    let status = runData.status;
    let attempts = 0;
    const maxAttempts = 25;
    while (
      status !== "completed" &&
      status !== "failed" &&
      status !== "requires_action" &&
      status !== "expired"
    ) {
      if (++attempts > maxAttempts) throw new Error("Превышено время ожидания ответа ассистента");
      await new Promise(res => setTimeout(res, 1200));
      const pollRes = await fetch(`https://api.openai.com/v1/threads/${thread_id}/runs/${run_id}`, {
        headers: {
          "Authorization": `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        }
      });
      const pollData = await pollRes.json();
      status = pollData.status;
    }
    if (status !== "completed") throw new Error("Ассистент не ответил, статус: " + status);

    // 5. Получить сообщения ассистента
    const msgRes = await fetch(`https://api.openai.com/v1/threads/${thread_id}/messages`, {
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      }
    });
    const msgData = await msgRes.json();
    const assistantMsgObj = msgData.data.reverse().find(m => m.role === "assistant");
    assistantMessage = assistantMsgObj?.content?.[0]?.text || assistantMsgObj?.content?.[0]?.value || "Нет ответа";
  } catch (error) {
    assistantMessage = `Ошибка: ${error.message}`;
  }
  return assistantMessage;
}

const Chat = () => {
  // ...весь ваш остальной код без изменений...
  // (оставьте все настройки, обработчики, jsx-верстку, стили как было)
  // getAssistantReply теперь будет показывать в консоли реальный ответ сервера!
  // Просто перезапустите приложение и смотрите в консоль браузера после попытки отправки сообщения.
};

const iconBtn = (color) => ({
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
