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

  // --- UI START ---
  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
        background: "#f7fafb",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        alignItems: "center",
        padding: 0
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 680,
          flex: 1,
          padding: "0",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          minHeight: "80vh"
        }}
      >
        <div style={{ flex: 1, padding: "0 6px", paddingBottom: "75px" }}>
          {messages.map((msg, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent: msg.role === "assistant" ? "flex-start" : "flex-end"
              }}
            >
              <div
                style={{
                  background: msg.role === "assistant" ? "#F4F6FC" : "#fff",
                  color: "#222",
                  borderRadius: "16px",
                  padding: "15px 18px",
                  margin: "12px 0",
                  maxWidth: "92%",
                  wordBreak: "break-word",
                  fontSize: 18,
                  boxShadow: "0 1px 4px rgba(0,0,0,0.04)"
                }}
              >
                {msg.role === "code"
                  ? msg.text.split("\n").map((line, idx) => (
                      <div key={idx}><span style={{ color: "#ccc" }}>{`${idx + 1}. `}</span>{line}</div>
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
            bottom: "10px",
            width: "100%",
            display: "flex",
            gap: 7,
            padding: "0 10px",
            zIndex: 10
          }}
        >
          <input
            type="text"
            style={{
              flex: 1,
              border: "1px solid #e5e7eb",
              borderRadius: 11,
              padding: "14px 14px",
              fontSize: 18,
              background: "#fff"
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
              borderRadius: 11,
              padding: "0 0",
              minWidth: "49px",
              width: "49px",
              height: "49px",
              fontSize: 25,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              cursor: inputDisabled ? "not-allowed" : "pointer",
              opacity: inputDisabled ? 0.65 : 1
            }}
            disabled={inputDisabled}
          >
            ✈️
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
