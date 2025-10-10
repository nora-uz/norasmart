"use client";

import React, { useState, useEffect } from "react";

// Интерактивные значения для самочувствия
const moods = [
  { label: "Отлично", emoji: "😃" },
  { label: "Хорошо", emoji: "🙂" },
  { label: "Нормально", emoji: "😐" },
  { label: "Не очень", emoji: "😕" },
  { label: "Плохо", emoji: "😣" }
];

// Главный компонент с двумя интерактивами
export default function PregnancyInteractive({ sendMessage, inputDisabled }) {
  const [selectedMonth, setSelectedMonth] = useState(null); // выбранный месяц
  const [selectedMood, setSelectedMood] = useState(null);   // выбранное самочувствие
  const [hasSent, setHasSent] = useState(false);

  // Отправлять сообщение только если оба значения выбраны
  useEffect(() => {
    if (!hasSent && selectedMonth !== null && selectedMood !== null) {
      if (sendMessage) {
        sendMessage(
          `Срок беременности: ${selectedMonth + 1} мес., самочувствие: ${moods[selectedMood].label}`
        );
      }
      setHasSent(true); // Чтобы не отправлялось заново, если снова выбрать значения
    }
  }, [selectedMonth, selectedMood, sendMessage, hasSent]);

  useEffect(() => {
    if (selectedMonth === null || selectedMood === null) setHasSent(false);
  }, [selectedMonth, selectedMood]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 18,
        width: "100%",
        maxWidth: 600,
        margin: "0 auto",
        marginBottom: 24
      }}
    >
      {/* Интерактив 1: срок беременности */}
      <div
        style={{
          flex: 1,
          background: "linear-gradient(135deg, #ffb347 0%, #ffcc33 100%)",
          borderRadius: 22,
          padding: 12,
          display: "flex",
          alignItems: "center",
          gap: 8,
          justifyContent: "center"
        }}
      >
        {Array.from({ length: 9 }).map((_, i) => (
          <button
            key={i}
            style={{
              minWidth: 38,
              height: 38,
              borderRadius: 12,
              border: "none",
              background: selectedMonth === i ? "#fff6" : "transparent",
              color: "#fff",
              fontWeight: 600,
              fontSize: 16,
              cursor: inputDisabled ? "not-allowed" : "pointer",
              outline: "none",
              transition: "background 0.2s"
            }}
            disabled={inputDisabled}
            onClick={() => setSelectedMonth(i)}
          >
            {i + 1}
          </button>
        ))}
      </div>
      {/* Интерактив 2: самочувствие */}
      <div
        style={{
          flex: 2,
          background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
          borderRadius: 22,
          padding: 12,
          display: "flex",
          alignItems: "center",
          gap: 8,
          justifyContent: "center"
        }}
      >
        {moods.map((item, idx) => (
          <button
            key={item.label}
            style={{
              background: selectedMood === idx ? "#fff3" : "transparent",
              color: "#fff",
              border: "none",
              borderRadius: 12,
              minWidth: 48,
              height: 48,
              fontSize: 21,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 600,
              cursor: inputDisabled ? "not-allowed" : "pointer",
              outline: "none",
              transition: "background 0.2s"
            }}
            disabled={inputDisabled}
            onClick={() => setSelectedMood(idx)}
          >
            <span style={{ fontSize: 24 }}>{item.emoji}</span>
            <span style={{ fontSize: 11 }}>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
