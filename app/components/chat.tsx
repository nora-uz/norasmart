"use client";
import React, { useState, useEffect, useRef } from "react";

const NORA_COLOR = "#2e2e2e";
const ICON_SIZE = 23;
const borderRadius = 22;
const panelHeight = 62;
const maxWidth = 560;
const videoMaxWidth = 314;
const GRADIENT = "linear-gradient(90deg, #eff5fe 0%, #e5e8ed 100%)";
const BABY_GRADIENT = "linear-gradient(90deg, #e39290 0%, #efb1b6 100%)";
const INPUT_BAR_HEIGHT = 68;
const PANEL_SIDE_PADDING = 15;
const BLOCK_SIDE_PADDING = 10;
const CARD_GAP = 10;

const ICONS = {
  telegram: "https://cdn-icons-png.flaticon.com/512/1946/1946547.png",
  trash: "https://cdn-icons-png.flaticon.com/512/1345/1345823.png",
  share: "https://cdn-icons-png.flaticon.com/512/535/535285.png",
  arrowRight: (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path d="M6 11H16M16 11L12 7M16 11L12 15"
        stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
};
const filterNora = "invert(13%) sepia(4%) saturate(271%) hue-rotate(175deg) brightness(92%) contrast(93%)";

const BENEFITS = [
  { emoji: "🩺", title: "Медицинская точность", text: "Советы основаны на рекомендациях британской службы NHS и адаптированы под ваш регион." },
  { emoji: "🤝", title: "Поддержка 24/7", text: "Ассистент всегда на связи для заботы и помощи в любой ситуации." },
  { emoji: "⏰", title: "Напоминания о важных делах", text: "Следим, чтобы вы ничего не забыли — анализы, витамины, визиты." },
  { emoji: "🔒", title: "Конфиденциальность", text: "Личные данные остаются только у вас — никакой передачи сторонним." },
  { emoji: "⚡️", title: "Быстрые решения", text: "Полезные советы и поддержка сразу, когда это нужно." },
];

const WhyNoraBlock = () => (
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
    <div style={{ padding: `21px 0 20px 0` }}>
      <div style={{
        fontWeight: 700,
        fontSize: "20px",
        color: NORA_COLOR,
        marginBottom: 20,
        textAlign: "center"
      }}>
        Почему Nora Plus?
      </div>
      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: CARD_GAP,
        padding: `0 ${BLOCK_SIDE_PADDING}px`
      }}>
        {BENEFITS.map(({ emoji, title, text }, idx) => (
          <div
            key={idx}
            style={{
              position: "relative",
              background: "#fff",
              borderRadius: 18,
              boxShadow: "0 2px 18px 0 rgba(150,180,220,0.07)",
              padding: "19px 15px 19px 15px",
              overflow: "hidden",
              minHeight: 56,
              textAlign: "left"
            }}
          >
            <span
              style={{
                position: "absolute",
                right: 12,
                top: 14,
                fontSize: 62,
                opacity: 0.14,
                pointerEvents: "none",
                userSelect: "none",
                lineHeight: 1,
                zIndex: 0,
              }}
              aria-hidden="true"
            >
              {emoji}
            </span>
            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 16, color: NORA_COLOR, marginBottom: 7, textAlign: "left" }}>
                {title}
              </div>
              <div style={{ fontSize: 13, color: "#3a3a3a", lineHeight: "1.64", textAlign: "left" }}>
                {text}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

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
    text: "Nora Plus motivatsion so‘zlari ва ijobiy maslahatlari orqali kayfiyatim ancha yaxshilandi."
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
    text: "Homiladorlikda asabiy bo‘lib qolgandim, Nora maslahatlari yordam berdi ва kayfiyatим ko‘tarildi."
  },
  {
    name: "Lola",
    badge: "Homiladorlik 4 oy",
    problem: "Oqsil yetishmaydi",
    text: "To‘g‘ri ovqatланish bo‘yicha maslahatlar judayam foydali bo‘ldi, endi o‘zimda kuch topyapman."
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
            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 7 }}>
                <span style={{
                  fontWeight: 700, fontSize: 15, color: "#222"
                }}>
                  {name}
                </span>
                <span style={{
                  fontWeight: 500, fontSize: 13, color: "#1681f5",
                  padding: "4px 9px", borderRadius: 12, background: "#f3f7fe", whiteSpace: "nowrap"
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

const Footer = () => (
  <div style={{
    width: `calc(100% - ${BLOCK_SIDE_PADDING * 2}px)`,
    maxWidth,
    margin: "0 auto 0 auto",
    padding: "0 0 8px 0",
    background: GRADIENT,
    borderRadius: "22px",
    boxShadow: "0 -4px 14px 0 rgba(155,175,205,0.06)",
    boxSizing: "border-box",
    fontFamily: "'Manrope', Arial, Helvetica, sans-serif",
    display: "flex",
    flexDirection: "column",
    gap: 13,
    alignItems: "center"
  }}>
    <div style={{
      fontSize: 13,
      color: "#263540",
      fontWeight: 600,
      textAlign: "center",
      width: "100%",
      minWidth: "220px",       // Ставим минимальную ширину для симметрии дальнейших блоков
      padding: "12px 0"
    }}>
      Ташкент, Юнусабадский район, массив Кашгар 26
    </div>
    <div style={{
      display: "flex",
      justifyContent: "center",
      width: "100%",
      gap: 0,
      margin: 0,
    }}>
      <a href="#" style={{
        background: BABY_GRADIENT,
        flex: 1,
        textAlign: "center",
        borderRadius: 14,
        color: "#fff",
        fontWeight: 600,
        fontSize: 14,
        padding: "7px 0",
        marginRight: 8,
        textDecoration: "none",
        minWidth: "120px",
      }}>Стать партнёром</a>
      <a href="#" style={{
        background: BABY_GRADIENT,
        flex: 1,
        textAlign: "center",
        borderRadius: 14,
        color: "#fff",
        fontWeight: 600,
        fontSize: 14,
        padding: "7px 0",
        marginLeft: 8,
        textDecoration: "none",
        minWidth: "120px"
      }}>Связаться с менеджером</a>
    </div>
    <a href="#" style={{
      background: "#fff",
      padding: "8px 0",
      width: "100%",
      borderRadius: 14,
      color: "#556",
      fontWeight: 500,
      fontSize: 14,
      textDecoration: "none",
      border: "1px solid #e1e9f5",
      textAlign: "center",
      marginTop: 13,
      minWidth: "220px"
    }}>Политика конфиденциальности</a>
    <div style={{
      marginTop: 12,
      fontSize: 12,
      color: "#8a97a0",
      textAlign: "center",
      width: "100%"
    }}>
      © {new Date().getFullYear()} Nora Plus — забота и поддержка будущих мам
    </div>
    <div style={{ height: 20 }} />
  </div>
);

// Остальной код (логика чата, input, panel) брать строго из вашего второго блока
// Состояния и вся функциональность чата остаются полностью вашими

// Кусок чата и input берём строго из вашего второго кода!

// ВАЖНО: welcome-экран (и всё, что ДО кнопки начать) — берём из ПЕРВОГО кода, кроме инпута!
// После нажатия "Начать пользоваться" — отображается только чат и input как во втором коде!

export default function Chat() {
  // ... ВСЯ логика обработчиков, состояния как во втором коде ...
}
