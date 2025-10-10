"use client";

import React, { useState, useEffect, useRef } from "react";
import Markdown from "react-markdown";
// @ts-expect-error - no types for this yet
import { AssistantStreamEvent } from "openai/resources/beta/assistants/assistants";
import { RequiredActionFunctionToolCall } from "openai/resources/beta/threads/runs/runs";
import { AssistantStream } from "openai/lib/AssistantStream";

type ChatProps = {
  functionCallHandler?: (
    toolCall: RequiredActionFunctionToolCall
  ) => Promise<string>;
};

const Chat = ({
  functionCallHandler = () => Promise.resolve(""),
}: ChatProps) => {
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [inputDisabled, setInputDisabled] = useState(false);
  const [threadId, setThreadId] = useState("");
  const [darkMode, setDarkMode] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const createThread = async () => {
      const res = await fetch(`/api/assistants/threads`, {
        method: "POST",
      });
      const data = await res.json();
      setThreadId(data.threadId);
    };
    createThread();
  }, []);

  const sendMessage = async (text) => {
    const response = await fetch(
      `/api/assistants/threads/${threadId}/messages`,
      {
        method: "POST",
        body: JSON.stringify({
          content: text,
        }),
      }
    );
    const stream = AssistantStream.fromReadableStream(response.body);
    handleReadableStream(stream);
  };

  const submitActionResult = async (runId, toolCallOutputs) => {
    const response = await fetch(
      `/api/assistants/threads/${threadId}/actions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          runId: runId,
          toolCallOutputs: toolCallOutputs,
        }),
      }
    );
    const stream = AssistantStream.fromReadableStream(response.body);
    handleReadableStream(stream);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;
    sendMessage(userInput);
    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "user", text: userInput },
    ]);
    setUserInput("");
    setInputDisabled(true);
    scrollToBottom();
  };

  const handleTextCreated = () => {
    appendMessage("assistant", "");
  };

  const handleTextDelta = (delta) => {
    if (delta.value != null) {
      appendToLastMessage(delta.value);
    }
    if (delta.annotations != null) {
      annotateLastMessage(delta.annotations);
    }
  };

  const handleImageFileDone = (image) => {
    appendToLastMessage(`\n![${image.file_id}](/api/files/${image.file_id})\n`);
  };

  const toolCallCreated = (toolCall) => {
    if (toolCall.type != "code_interpreter") return;
    appendMessage("code", "");
  };

  const toolCallDelta = (delta, snapshot) => {
    if (delta.type != "code_interpreter") return;
    if (!delta.code_interpreter.input) return;
    appendToLastMessage(delta.code_interpreter.input);
  };

  const handleRequiresAction = async (
    event: AssistantStreamEvent.ThreadRunRequiresAction
  ) => {
    const runId = event.data.id;
    const toolCalls = event.data.required_action.submit_tool_outputs.tool_calls;
    const toolCallOutputs = await Promise.all(
      toolCalls.map(async (toolCall) => {
        const result = await functionCallHandler(toolCall);
        return { output: result, tool_call_id: toolCall.id };
      })
    );
    setInputDisabled(true);
    submitActionResult(runId, toolCallOutputs);
  };

  const handleRunCompleted = () => {
    setInputDisabled(false);
  };

  const handleReadableStream = (stream: AssistantStream) => {
    stream.on("textCreated", handleTextCreated);
    stream.on("textDelta", handleTextDelta);
    stream.on("imageFileDone", handleImageFileDone);
    stream.on("toolCallCreated", toolCallCreated);
    stream.on("toolCallDelta", toolCallDelta);
    stream.on("event", (event) => {
      if (event.event === "thread.run.requires_action")
        handleRequiresAction(event);
      if (event.event === "thread.run.completed") handleRunCompleted();
    });
  };

  const appendToLastMessage = (text) => {
    setMessages((prevMessages) => {
      const lastMessage = prevMessages[prevMessages.length - 1];
      const updatedLastMessage = {
        ...lastMessage,
        text: lastMessage.text + text,
      };
      return [...prevMessages.slice(0, -1), updatedLastMessage];
    });
  };

  const appendMessage = (role, text) => {
    setMessages((prevMessages) => [...prevMessages, { role, text }]);
  };

  const annotateLastMessage = (annotations) => {
    setMessages((prevMessages) => {
      const lastMessage = prevMessages[prevMessages.length - 1];
      const updatedLastMessage = { ...lastMessage };
      annotations.forEach((annotation) => {
        if (annotation.type === 'file_path') {
          updatedLastMessage.text = updatedLastMessage.text.replaceAll(
            annotation.text,
            `/api/files/${annotation.file_path.file_id}`
          );
        }
      });
      return [...prevMessages.slice(0, -1), updatedLastMessage];
    });
  };

  // Очистить чат
  const clearChat = () => {
    setMessages([]);
    setUserInput("");
  };

  // Тёмная / светлая тема
  const isDark = darkMode;
  const bgColor = isDark ? "#1C1C1C" : "#f5f5f5";
  const bubbleUser = isDark ? "#28324d" : "#fff";
  const bubbleAssistant = isDark ? "#232439" : "#F1F3F8";
  const inputBg = isDark ? "#232439" : "#fff";
  const inputColor = isDark ? "#fff" : "#111";
  const borderColor = "#22242e";

  // SVG icons
  const SunIcon = (
    <svg width="27" height="27" viewBox="0 0 22 22" style={{display:"block"}}>
      <circle cx="11" cy="11" r="6.5" fill="none" stroke="#FDB813" strokeWidth="2"/>
      <g stroke="#FDB813" strokeWidth="1">
        <line x1="11" y1="0.5" x2="11" y2="4"/>
        <line x1="11" y1="18" x2="11" y2="21.5"/>
        <line x1="0.5" y1="11" x2="4" y2="11"/>
        <line x1="18" y1="11" x2="21.5" y2="11"/>
        <line x1="4.05" y1="4.05" x2="6.6" y2="6.6"/>
        <line x1="17.96" y1="17.96" x2="15.4" y2="15.4"/>
        <line x1="4.05" y1="17.96" x2="6.6" y2="15.4"/>
        <line x1="15.4" y1="6.6" x2="17.96" y2="4.05"/>
      </g>
    </svg>
  );
  const MoonIcon = (
    <svg width="27" height="27" viewBox="0 0 22 22" style={{display:"block"}}>
      <path d="M15.5 5.9A8 8 0 1 1 6.5 16.1a8 8 0 0 0 9-10.2z"
        stroke="#fff" strokeWidth="1.8" fill="none"/>
    </svg>
  );
  const RefreshIcon = (
    <svg width="27" height="27" viewBox="0 0 22 22" style={{display:"block"}}>
      <path d="M3 12a9 9 0 0 1 14.7-5.7m0 0L18 3m-0.3 3.3H14" 
        stroke="#aaa" strokeWidth="2.6" fill="none" strokeLinecap="round"/>
      <path d="M19 10a9 9 0 0 1-14.7 5.7m0 0L4 21m0.3-3.3H8" 
        stroke="#aaa" strokeWidth="2.6" fill="none" strokeLinecap="round"/>
    </svg>
  );
  const TelegramIcon = (
    <svg width="25" height="25" viewBox="0 0 496 496" style={{display:"block"}}>
      <path d="M248 0C111.036 0 0 111.036 0 248c0 136.964 111.036 248 248 248s248-111.036 248-248C496 111.036 384.964 0 248 0zm93.928 177.552l-45.84 215.08c-5.432 24-19.616 29.84-39.832 18.576l-55.168-40.52-26.624 25.664c-2.936 2.936-5.384 5.384-11.064 5.384l3.944-55.658 101.408-91.656c4.406-3.944-0.96-6.184-6.827-2.24l-125.344 78.856-54.088-16.908c-11.76-3.68-12.016-11.76 2.432-17.344L360.56 164.648c10.008-3.68 19.576 2.432 16.768 12.904z" fill={isDark ? "#fff" : "#2646FC"}/>
    </svg>
  );
  const PhoneIcon = (
    <svg width="24" height="24" viewBox="0 0 24 24" style={{display:"block", transform:"scaleX(-1)"}}>
      <path d="M6.6 10.8C8.2 13.1 10.9 15.8 13.2 17.4L15.2 15.5C15.5 15.3 15.9 15.2 16.2 15.3C17.3 15.7 18.5 16 19.7 16C20.3 16 20.8 16.5 20.8 17.1V21C20.8 21.6 20.3 22.1 19.7 22.1C9.4 22.1 1.9 14.6 1.9 4.3C1.9 3.7 2.3 3.2 2.9 3.2H6.8C7.4 3.2 7.9 3.7 7.9 4.3C7.9 5.5 8.2 6.7 8.6 7.7C8.7 8 8.7 8.4 8.6 8.6L6.6 10.8Z" stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </svg>
  );
  // SVG стрелка (отправить)
  const SendIcon = (
    <svg width="35" height="35" viewBox="0 0 32 32"><path d="M7 15L25 15M25 15L17.5 7.5M25 15L17.5 22.5" stroke="#fff" strokeWidth="2.7" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
  );

  // --- UI START ---
  return (
    <div
      style={{
        minHeight: "100vh",
        background: bgColor,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: 0,
      }}
    >
      {/* Шапка внутри чата */}
      <div
        style={{
          position: "relative",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          height: 58,
          background: isDark ? "#232439" : "#f2f3fa",
          color: isDark ? "#fff" : "#232439",
          width: "99%",
          maxWidth: 670,
          margin: "15px auto 0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderRadius: "20px",
          padding: "0 18px",
          boxShadow: isDark ? "0 2px 18px rgba(44,44,68,0.12)" : "0 2px 14px #ccd6ff44"
        }}
      >
        <div style={{ fontWeight: 700, fontSize: 18 }}>Norasmart.uz</div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button
            onClick={() => setDarkMode((v) => !v)}
            aria-label="Сменить тему"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              width: 35,
              height: 35,
              display: "flex",
            }}
          >
            {isDark ? MoonIcon : SunIcon}
          </button>
          <button
            onClick={clearChat}
            aria-label="Очистить чат"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              width: 35,
              height: 35,
              display: "flex"
            }}
          >
            {RefreshIcon}
          </button>
          <button
            aria-label="Telegram"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              width: 35,
              height: 35,
              display: "flex"
            }}
            onClick={() => window.open("https://t.me/", "_blank")}
          >
            {TelegramIcon}
          </button>
          <button
            aria-label="Позвонить"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              width: 35,
              height: 35,
              display: "flex"
            }}
            onClick={() => window.open("tel:+1234567890")}
          >
            {PhoneIcon}
          </button>
        </div>
      </div>
      {/* Содержимое чата фиксированный отступ от шапки */}
      <div
        style={{
          flex: 1,
          width: "100%",
          maxWidth: 670,
          margin: "0 auto",
          boxSizing: "border-box",
          minHeight: "100vh",
          padding: "90px 13px 85px 13px",
        }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              justifyContent: msg.role === "assistant" ? "flex-start" : "flex-end",
              marginBottom: 15,
            }}
          >
            <div
              style={{
                background: msg.role === "assistant" ? bubbleAssistant : bubbleUser,
                color: isDark
                  ? (msg.role === "assistant" ? "#eaeaea" : "#fff")
                  : "#232439",
                borderRadius: 20,
                padding: "21px 23px",
                maxWidth: "90vw",
                minWidth: 60,
                fontSize: 18,
                lineHeight: 1.7,
                boxShadow:
                  msg.role === "assistant"
                    ? "0 2px 18px rgba(44,44,68,.13)"
                    : "0 2px 12px rgba(38,70,252,0.11)",
                border: msg.role === "assistant"
                  ? "1.3px solid #242443"
                  : "1.5px solid #2646fc33",
                marginRight: msg.role === "assistant" ? "auto" : 0,
                marginLeft: msg.role === "user" ? "auto" : 0,
              }}
            >
              {msg.role === "code"
                ? msg.text.split("\n").map((line, idx) => (
                    <div key={idx}><span style={{ color: "#889" }}>{`${idx + 1}. `}</span>{line}</div>
                  ))
                : <Markdown>{msg.text}</Markdown>
              }
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      {/* Форма отправки сообщения */}
      <form
        onSubmit={handleSubmit}
        style={{
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 0,
          width: "100%",
          background: isDark ? "#232439" : "#f2f3fa",
          display: "flex",
          gap: 10,
          padding: "15px 16px 17px 16px",
          zIndex: 101,
          borderTop: isDark ? "1.5px solid #262640" : "1.3px solid #2646fc22"
        }}
      >
        <input
          type="text"
          style={{
            flex: 1,
            border: "1.7px solid #2646fc33",
            borderRadius: 20,
            padding: "17px 17px",
            fontSize: 18,
            background: inputBg,
            color: inputColor,
            outline: "none"
          }}
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Введите ваш вопрос"
          disabled={inputDisabled}
        />
        <button
          type="submit"
          style={{
            background: "#2646FC",
            color: "#fff",
            border: "none",
            borderRadius: 20,
            width: "54px",
            height: "54px",
            fontSize: 23,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginLeft: 2,
            cursor: inputDisabled ? "not-allowed" : "pointer",
            opacity: inputDisabled ? 0.73 : 1
          }}
          disabled={inputDisabled}
        >
          {SendIcon}
        </button>
      </form>
    </div>
  );
};

export default Chat;
