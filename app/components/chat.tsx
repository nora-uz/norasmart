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

  // Тёмная / светлая тема и стили
  const isDark = darkMode;
  const bgColor = isDark ? "#1C1C1C" : "#f6f6fa";
  const panelBg = isDark ? "#15151A" : "#f7f8fa";
  const assistantBubble = isDark ? "#111117" : "#ebeefa";
  const inputBg = panelBg;
  const inputColor = isDark ? "#f8f8fa" : "#232439";
  const borderRadius = 18;

  // icons — outline, чистый line, один стиль (24px)
  const iconColor = isDark ? "#E2E3E7" : "#232439";
  const SunIcon = (<svg width={24} height={24} viewBox="0 0 24 24"><circle cx="12" cy="12" r="6" fill="none" stroke="#FDB813" strokeWidth="2"/><g stroke="#FDB813" strokeWidth="1.5"><line x1="12" y1="1" x2="12" y2="4"/><line x1="12" y1="20" x2="12" y2="23"/><line x1="1" y1="12" x2="4" y2="12"/><line x1="20" y1="12" x2="23" y2="12"/><line x1="4.2" y1="4.2" x2="6.5" y2="6.5"/><line x1="19.8" y1="19.8" x2="17.5" y2="17.5"/><line x1="19.8" y1="4.2" x2="17.5" y2="6.5"/><line x1="4.2" y1="19.8" x2="6.5" y2="17.5"/></g></svg>);
  const MoonIcon = (<svg width={24} height={24} viewBox="0 0 24 24"><path d="M17 6.5A9.5 9.5 0 1 1 6.5 17a9.5 9.5 0 0 0 10.5-10.5z" stroke={iconColor} strokeWidth="2" fill="none"/></svg>);
  const RefreshIcon = (<svg width={24} height={24} viewBox="0 0 24 24"><path d="M5 19A9 9 0 1 1 19 5" stroke="#A4A5A8" strokeWidth="2" fill="none" /><polyline points="19 9 19 5 15 5" stroke="#A4A5A8" strokeWidth="2" fill="none"/></svg>);
  const TelegramIcon = (<svg width={24} height={24} viewBox="0 0 24 24"><path d="M3.7 12.5L20.3 3.5c.6-.3 1.2.4 1 .9l-3.1 17.3c-.1.6-.7.8-1.1.3l-4.2-5.2-2.5 2c-.4.3-1 .1-1-.4l1-6.4-5-1.2c-.6-.1-.7-.9-.2-1.1z" stroke={iconColor} strokeWidth="1.5" fill="none"/></svg>);
  const PhoneIcon = (<svg width={24} height={24} viewBox="0 0 24 24" style={{transform: "scaleX(-1)"}}><path d="M6.8 11.5C8.4 13.9 11.2 16.6 13.6 18.2l1.6-1.7c.4-.4 1-.4 1.5-.3 1.2.4 2.4.7 3.7.7.7 0 1.2.5 1.2 1.2v3.1c0 .7-.5 1.2-1.2 1.2-8.1 0-14.7-6.6-14.7-14.7 0-.7.5-1.2 1.2-1.2H8.5c.7 0 1.2.5 1.2 1.2 0 1.2.3 2.4.7 3.7.2.5.1 1.1-.3 1.5l-1.7 1.6z" stroke="#A4A5A8" strokeWidth="1.5" fill="none"/></svg>);
  const SendIcon = (<svg width={24} height={24} viewBox="0 0 24 24"><path d="M5 12h14M19 12l-7-7M19 12l-7 7" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>);

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
      {/* Панель (фикс, 15px от верха и по бокам) */}
      <div
        style={{
          position: "fixed",
          top: 15,
          left: 15,
          right: 15,
          zIndex: 100,
          height: 52,
          background: panelBg,
          color: isDark ? "#fff" : "#232439",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderRadius: borderRadius,
          padding: "0 14px",
        }}
      >
        <div style={{ fontWeight: 600, fontSize: 15 }}>Norasmart.uz</div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button
            onClick={() => setDarkMode((v) => !v)}
            aria-label="Сменить тему"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              width: 24,
              height: 24,
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
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
              width: 24,
              height: 24,
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
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
              width: 24,
              height: 24,
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
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
              width: 24,
              height: 24,
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
            onClick={() => window.open("tel:+1234567890")}
          >
            {PhoneIcon}
          </button>
        </div>
      </div>

      {/* Содержимое чата */}
      <div
        style={{
          flex: 1,
          width: "100%",
          maxWidth: 650,
          margin: "0 auto",
          boxSizing: "border-box",
          minHeight: "100vh",
          padding: "85px 15px 70px 15px",
        }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              justifyContent: msg.role === "assistant" ? "flex-start" : "flex-end",
              marginBottom: 12,
            }}
          >
            {msg.role === "assistant" ? (
              <div
                style={{
                  background: assistantBubble,
                  color: isDark ? "#f6f6f6" : "#232439",
                  borderRadius: borderRadius,
                  padding: "9px 13px",
                  fontSize: 17,
                  lineHeight: 1.65,
                  border: "none",
                  maxWidth: "86vw",
                  minWidth: 54,
                  marginRight: "auto"
                }}
              >
                <Markdown>{msg.text}</Markdown>
              </div>
            ) : (
              <div
                style={{
                  background: "none",
                  color: isDark ? "#fff" : "#232439",
                  borderRadius: borderRadius,
                  padding: "9px 0px",
                  fontSize: 17,
                  lineHeight: 1.65,
                  border: "none",
                  maxWidth: "86vw",
                  minWidth: 54,
                  marginLeft: "auto"
                }}
              >
                <Markdown>{msg.text}</Markdown>
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      {/* Поле ввода — фон равен панели, круглая кнопка меньше */}
      <form
        onSubmit={handleSubmit}
        style={{
          position: "fixed",
          left: 15,
          right: 15,
          bottom: 15,
          background: inputBg,
          borderRadius: borderRadius,
          display: "flex",
          gap: 8,
          padding: "0",
          zIndex: 101,
          height: 52,
        }}
      >
        <input
          type="text"
          style={{
            flex: 1,
            border: "none",
            borderRadius: borderRadius,
            height: "100%",
            padding: "0 13px",
            fontSize: 17,
            background: inputBg,
            color: "#fff",
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
            borderRadius: borderRadius,
            width: 36,
            height: 36,
            fontSize: 17,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            margin: "auto 4px auto 0",
            cursor: inputDisabled ? "not-allowed" : "pointer",
            opacity: inputDisabled ? 0.7 : 1
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
