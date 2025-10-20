"use client";
import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";

// ... все константы (как у тебя), ICONS ...

const REVIEWS = [
  {
    name: "Анна",
    badge: "2 месяц беременности",
    problem: "Токсикоз",
    text: "Nora Plus подсказала, как справиться с утренней тошнотой. Благодаря рекомендациям по питанию и режиму дня симптомы стали гораздо легче."
  },
  {
    name: "Dilnoza",
    badge: "Homiladorlik 3 oy",
    problem: "Ko'ngil aynishi",
    text: "Nora Plus maslahatlari yordam berdi va ko‘ngil aynishini yengillashtirdi. Hamma maslahatlar o‘z vaqtida etkaziladi."
  },
  {
    name: "Елена",
    badge: "4 месяц беременности",
    problem: "Слабость и усталость",
    text: "Теперь я знаю, какие витамины нужны, сколько отдыхать и как строить день. Чувствую себя в разы лучше!"
  },
  {
    name: "Shahnoza",
    badge: "Homiladorlik 5 oy",
    problem: "Kayfiyat pastligi",
    text: "Nora Plus motivatsion so‘zlari va ijobiy maslahatlari orqali kayfiyatim ancha yaxshilandi."
  },
  {
    name: "Ирина",
    badge: "5 месяц беременности",
    problem: "Тревожность",
    text: "Советы Nora Plus помогли мне больше отдыхать, заботиться о себе и избавили от лишних переживаний за малыша."
  },
  {
    name: "Мария",
    badge: "7 месяц беременности",
    problem: "Бессонница",
    text: "Благодаря советам Nora Plus я стала лучше спать и спокойно дожидаюсь рождения малыша."
  },
  {
    name: "Виктория",
    badge: "3 месяц беременности",
    problem: "Страхи",
    text: "Nora Plus помогла разобраться с тревогами и поддержала советами, теперь чувствую себя увереннее."
  },
  {
    name: "Екатерина",
    badge: "6 месяц беременности",
    problem: "Питание",
    text: "Ассистент напомнил про важные витамины и режим, теперь питаюсь правильно и чувствую себя энергичной."
  },
  {
    name: "Gulnora",
    badge: "Homiladorlik 2 oy",
    problem: "Uyqu buzilishi",
    text: "Nora bilan maslahatlashib, uyqum tiklandi va endi tongni yaxshi kutaman."
  },
  {
    name: "Malika",
    badge: "Homiladorlik 8 oy",
    problem: "Asabiylik",
    text: "Homiladorlikda asabiy bo‘lib qolgandим, Nora maslahatлари yordam berdi va kayfiyatim ko‘tarildi."
  },
  {
    name: "Lola",
    badge: "Homiladorlik 4 oy",
    problem: "Oqsil yetishmaydi",
    text: "To‘g‘ri ovqatlanиш bo‘yича maslahatлар judаyam foydali bo‘ldi, endи o‘zimда kuch topyapman."
  },
];

const ReviewBlock = () => (
  <div
    style={{
      width: `calc(100% - ${BLOCK_SIDE_PADDING * 2}px)`,
      maxWidth,
      margin: "0 auto 38px auto",
      background: GRADIENT,
      borderRadius: borderRadius,
      boxShadow: "0 6px 20px 0 rgba(150, 175, 205, 0.10)",
      boxSizing: "border-box",
      padding: 0,
      fontFamily: "'Manrope', Arial, Helvetica, sans-serif"
    }}
  >
    <div style={{ padding: "21px 0 20px 0" }}>
      <div style={{
        fontWeight: 700,
        fontSize: "20px",
        color: NORA_COLOR,
        marginBottom: 20,
        textAlign: "center"
      }}>
        Отзывы будущих мам
      </div>
      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: CARD_GAP,
        padding: `0 ${BLOCK_SIDE_PADDING}px`
      }}>
        {REVIEWS.map(({ name, badge, problem, text }, idx) => (
          <div
            key={idx}
            style={{
              position: "relative",
              background: "#fff",
              borderRadius: 18,
              boxShadow: "0 2px 18px 0 rgba(150,180,220,0.07)",
              padding: "19px 15px 19px 15px",
              overflow: "hidden",
              textAlign: "left"
            }}
          >
            <span
              style={{
                position: "absolute",
                right: 12,
                top: -16,
                fontSize: 140,
                opacity: 0.10,
                pointerEvents: "none",
                userSelect: "none",
                lineHeight: 1,
                zIndex: 0,
              }}
              aria-hidden="true"
            >
              🤰
            </span>
            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 7 }}>
                <span style={{
                  fontWeight: 700, fontSize: 15, color: "#222"
                }}>
                  {name}
                </span>
                <span style={{
                  fontWeight: 600,
                  fontSize: 13,
                  color: "#fff",
                  padding: "4px 9px",
                  borderRadius: 12,
                  background: "#a48fcc",
                  whiteSpace: "nowrap"
                }}>
                  {badge}
                </span>
              </div>
              <div style={{ fontWeight: 500, fontSize: 13, color: "#acb5bd", marginBottom: 9 }}>
                {problem}
              </div>
              <div style={{ fontSize: 13, color: "#3a3a3a", lineHeight: "1.64" }}>
                {text}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ... (остальной твой код, без изменений)
// Не забудь импортировать/объявить REVIEWS перед использованием!

export default Chat;
