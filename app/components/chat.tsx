{showWelcome && (
  <div style={{
    width: "100%",
    display: "flex",
    justifyContent: "center",
    paddingLeft: 18,
    paddingRight: 18,
    marginTop: 15
  }}>
    <img
      src={BANNER}
      alt="Nora Plus баннер"
      style={{
        width: "100%",
        height: "auto",
        display: "block",
        objectFit: "contain",
        objectPosition: "center",
        marginBottom: 30 // отступ после фото
      }}
    />
  </div>
)}
{showWelcome ? (
  <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
    <div style={{ width: "100%", maxWidth }}>
      <div style={{ textAlign: "center", marginTop: 0, marginBottom: 30 }}>
        <div style={{
          fontWeight: 400,
          fontSize: "16px",
          margin: "0 auto",
          maxWidth: 400,
          padding: "0 20px",
          lineHeight: 1.75,
          color: NORA_COLOR,
          display: "inline-block"
        }}>
          Нора — это виртуальный ассистент и помощник для беременных, который помогает будущим мамам чувствовать себя уверенно и спокойно на каждом этапе беременности.
        </div>
      </div>
      <div style={{ width: "100%", display: "flex", justifyContent: "center", marginTop: 0, marginBottom: 30 }}>
        <button
          style={{
            background: PANEL_GRADIENT,
            color: "#fff",
            border: "none",
            borderRadius: borderRadius,
            fontWeight: 700,
            fontSize: "17px",
            padding: "15px 0",
            maxWidth: 290,
            width: "100%",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
          onClick={() => setShowWelcome(false)}
        >
          <span style={{
            display: "flex", alignItems: "center", justifyContent: "center", color: "#fff"
          }}>
            Начать пользоваться&nbsp;{ICONS.arrowRight}
          </span>
        </button>
      </div>
      <FeedbackBubblesNora visible={showWelcome} />
      <div style={{ height: 24 }} />
    </div>
  </div>
) : (
  // ... остальной код
)}
