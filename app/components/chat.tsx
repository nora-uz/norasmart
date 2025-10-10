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
  const bgColor = isDark ? "#1C1C1C" : "#f7fafb";
  const userBubble = isDark ? "#475569" : "#fff";
  const assistantBubble = isDark ? "#232438" : "#F4F6FC";
  const inputBg = isDark ? "#232438" : "#fff";
  const inputColor = isDark ? "#fff" : "#111";
  const iconStroke = isDark ? "#fff" : "#2646FC";
  const borderColor = "#22242e";

  // SVG стрелка
  const SendIcon = (
    <svg width="28" height="28" viewBox="0 0 24 24"><path d="M4 12L20 12M20 12L13 5M20 12L13 19" stroke={iconStroke} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
  );

  // SVG телефона
  const PhoneIcon = (
    <svg width="24" height="24" viewBox="0 0 24 24"><path d="M6.6 10.8C8.2 13.1 10.9 15.8 13.2 17.4L15.2 15.5C15.5 15.3 15.9 15.2 16.2 15.3C17.3 15.7 18.5 16 19.7 16C20.3 16 20.8 16.5 20.8 17.1V21C20.8 21.6 20.3 22.1 19.7 22.1C9.4 22.1 1.9 14.6 1.9 4.3C1.9 3.7 2.3 3.2 2.9 3.2H6.8C7.4 3.2 7.9 3.7 7.9 4.3C7.9 5.5 8.2 6.7 8.6 7.7C8.7 8 8.7 8.4 8.6 8.6L6.6 10.8Z" stroke={iconStroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
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
      {/* Шапка */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          height: 62,
          background: "#18181d",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 12px",
          borderBottom: "1.5px solid #232438"
        }}
      >
        <div style={{ fontWeight: 700, letterSpacing: 1, fontSize: 22 }}>NoraSmart</div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button
            onClick={() => setDarkMode((v) => !v)}
            aria-label="Сменить тему"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              marginRight: 6
            }}
          >
            {isDark
              ? <svg width="27" height="27" viewBox="0 0 22 22"><circle cx="11" cy="11" r="8" fill="none" stroke="#fff" strokeWidth="2" /><path d="M2,11 L20,11 M11,2 L11,20 M4.9,4.9 L17.1,17.1 M4.9,17.1 L17.1,4.9" stroke="#fff" strokeWidth="1" /></svg>
              : <svg width="27" height="27" viewBox="0 0 22 22"><circle cx="11" cy="11" r="8" fill="none" stroke="#232438" strokeWidth="2" /></svg>
            }
          </button>
          <button
            onClick={clearChat}
            aria-label="Очистить чат"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#aaa",
              fontSize: 17
            }}
          >
            Очистить
          </button>
          <button
            aria-label="Позвонить"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer"
            }}
            onClick={() => {
              window.open("tel:+1234567890");
            }}
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
          maxWidth: 700,
          margin: "0 auto",
          padding: "82px 10px 85px 10px",
          boxSizing: "border-box",
          minHeight: "100vh"
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
                background: msg.role === "assistant" ? assistantBubble : userBubble,
                color: isDark
                  ? (msg.role === "assistant" ? "#eaeaea" : "#fff")
                  : "#232438",
                borderRadius: 20,
                padding: "19px 20px",
                maxWidth: "84vw",
                minWidth: 60,
                fontSize: 18,
                lineHeight: 1.7,
                boxShadow:
                  msg.role === "assistant"
                    ? "0 2px 12px rgba(86,86,138,.10)"
                    : "0 2px 12px rgba(38,70,252,0.09)",
                border: msg.role === "assistant"
                  ? "1px solid #242443"
                  : "1.3px solid #2646fc33",
                marginRight: msg.role === "assistant" ? "auto" : 0,
                marginLeft: msg.role === "user" ? "auto" : 0,
                marginTop: 2
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
      <form
        onSubmit={handleSubmit}
        style={{
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 0,
          width: "100%",
          background: "#18181d",
          display: "flex",
          gap: 10,
          padding: "14px 12px 18px 12px",
          zIndex: 101,
          borderTop: "1.5px solid #232438"
        }}
      >
        <input
          type="text"
          style={{
            flex: 1,
            border: "1.6px solid #232438",
            borderRadius: 20,
            padding: "16px 17px",
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
