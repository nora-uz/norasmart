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
  const panelBg = isDark ? "#17171b" : "#f2f3f8";
  const assistantBubble = isDark ? "#202028" : "#eaeafd";
  const inputBg = panelBg;
  const inputColor = isDark ? "#fff" : "#222";
  const borderRadius = 32;

  // icons (Line, один стиль, SVG, без кружков):
  const SunIcon = (<svg width={24} height={24} viewBox="0 0 28 28"><circle cx="14" cy="14" r="7" fill="none" stroke="#FDB813" strokeWidth="2"/><g stroke="#FDB813" strokeWidth="1.7"><line x1="14" y1="2" x2="14" y2="5.5"/><line x1="14" y1="22.5" x2="14" y2="26"/><line x1="2" y1="14" x2="5.5" y2="14"/><line x1="22.5" y1="14" x2="26" y2="14"/><line x1="6.7" y1="6.7" x2="10.1" y2="10.1"/><line x1="21.3" y1="21.3" x2="17.9" y2="17.9"/><line x1="21.3" y1="6.7" x2="17.9" y2="10.1"/><line x1="6.7" y1="21.3" x2="10.1" y2="17.9"/></g></svg>);
  const MoonIcon = (<svg width={24} height={24} viewBox="0 0 28 28"><path d="M20 8.5A9.5 9.5 0 1 1 8.5 20a9.5 9.5 0 0 0 11.5-11.5z" stroke="#fff" strokeWidth="2" fill="none"/></svg>);
  const RefreshIcon = (<svg width={24} height={24} viewBox="0 0 28 28"><path d="M7 21c-2-2.3-3.1-5.3-2.4-8.3S8.8 7.1 12 6m9-2v5M21 7c2 2.3 3.1 5.3 2.4 8.3S19.2 20.9 16 22m-9 2v-5" stroke="#aaa" strokeWidth="2" fill="none" strokeLinecap="round"/></svg>);
  const TelegramIcon = (<svg width={24} height={24} viewBox="0 0 26 26"><path d="M4 13L10 16L14 20L21 6L4 13Z" stroke={isDark ? "#fff" : "#2646FC"} strokeWidth="1.7" fill="none"/><circle cx="13" cy="13" r="12" stroke={isDark ? "#fff" : "#2646FC"} strokeWidth="1.3" fill="none"/></svg>);
  const PhoneIcon = (<svg width={24} height={24} viewBox="0 0 28 28" style={{transform: "scaleX(-1)"}}><path d="M7.8 12.6C9.7 15.4 12.7 18.4 15.5 20.3L17.9 18.2C18.2 18 18.6 17.9 18.9 18C20.2 18.5 21.7 18.8 23.2 18.8C23.9 18.8 24.5 19.3 24.5 20V25.2C24.5 25.8 24 26.3 23.2 26.3C11.8 26.3 2.8 17.3 2.8 5.9C2.8 5.3 3.2 4.8 3.9 4.8H9C9.7 4.8 10.3 5.3 10.3 5.9C10.3 7.5 10.6 9.1 11.1 10.5C11.2 10.8 11.2 11.2 11.1 11.5L7.8 12.6Z" stroke="#aaa" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>);
  const SendIcon = (<svg width={29} height={29} viewBox="0 0 29 29"><path d="M8 14.5H21M21 14.5L15.5 9M21 14.5L15.5 20" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>);

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
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <button
            onClick={() => setDarkMode((v) => !v)}
            aria-label="Сменить тему"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              width: 28,
              height: 28,
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
              width: 28,
              height: 28,
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
              width: 28,
              height: 28,
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
              width: 28,
              height: 28,
              display: "flex"
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
                  color: isDark ? "#eaeaea" : "#232439",
                  borderRadius: borderRadius,
                  padding: "11px 16px",
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
                  background: "transparent",
                  color: isDark ? "#fff" : "#232439",
                  borderRadius: borderRadius,
                  padding: "11px 0px",
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
      {/* Поле ввода — фон равен панели, круглая кнопка */}
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
            padding: "0 17px",
            fontSize: 17,
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
            borderRadius: borderRadius,
            width: 44,
            height: 44,
            fontSize: 21,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            margin: "auto 7px auto 0",
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
