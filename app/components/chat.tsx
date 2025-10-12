"use client";

import React from "react";

// Главное фото изменено на ссылку ibb.co:
const BABY_IMG = "https://i.ibb.co/SQGD1zx/photo-2024-05-17-14-03-29-removebg-preview.png";

// Месяц (пока статично: по макету — 5)
const PREGNANCY_MONTH = 5;

// Описание из макета
const MAIN_DESC = "Сейчас малыш похож на маленькое зернышко, но с каждым днём быстро развивается.";

export default function NoraWelcomePage() {
  return (
    <div style={{
      background: "#b4b4b4",
      minHeight: "100vh",
      width: "100vw",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "start",
      position: "relative",
      fontFamily: "inherit"
    }}>
      {/* Верхний роЗовый блок-описание */}
      <div style={{
        position: "absolute",
        top: 60,
        left: "50%",
        transform: "translateX(-50%)",
        background: "#F3A3A3",
        color: "#fff",
        borderRadius: 32,
        padding: "22px 38px",
        fontSize: 26,
        fontWeight: 500,
        textAlign: "center",
        maxWidth: 430,
        boxShadow: "0 4px 26px #f3a3a32a"
      }}>
        {MAIN_DESC}
      </div>
      {/* Центральная картинка ребёнка */}
      <img
        src={BABY_IMG}
        alt="Ребёнок"
        style={{
          width: 340,
          height: 340,
          objectFit: "contain",
          marginTop: 120
        }}
      />
      {/* Блок "Ваш срок беременности" справа */}
      <div style={{
        position: "absolute",
        top: 175,
        right: "12vw",
        background: "#F3A3A3",
        color: "#fff",
        borderRadius: 26,
        padding: "14px 36px",
        fontSize: 24,
        fontWeight: 500,
        textAlign: "center",
        boxShadow: "0 4px 24px #F3A3A335"
      }}>
        Ваш срок<br />
        беременности<br />
        <span style={{ fontSize: 46, fontWeight: 700 }}>{PREGNANCY_MONTH}</span>
      </div>
    </div>
  );
}
