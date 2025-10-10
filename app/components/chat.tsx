// импорт тот же, что и раньше

return (
  <div
    style={{
      position: "relative",
      minHeight: "100vh",
      background: "#f7fafb",
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-end", // фиксируем поле внизу
      alignItems: "center",
      padding: "0"
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
                padding: "15px 18px", // больше воздуха внутри
                margin: "12px 0", // больше отступ между сообщениями
                maxWidth: "92%", // почти во всю ширину экрана
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
      {/* Фиксируем форму внизу и убираем воздух по бокам */}
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
