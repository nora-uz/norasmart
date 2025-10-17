"use client";
import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";

const NORA_COLOR = "#2e2e2e";
const ICON_SIZE = 23;
const BANNER = "/banner.webp";
const borderRadius = 22;
const panelHeight = 62;
const maxWidth = 560;
const GRADIENT = "linear-gradient(90deg, #eff5fe 0%, #e5e8ed 100%)";
const INPUT_BAR_HEIGHT = 68;

const ICONS = {
  telegram: "https://cdn-icons-png.flaticon.com/512/1946/1946547.png",
  trash: "https://cdn-icons-png.flaticon.com/512/1345/1345823.png",
  share: "https://cdn-icons-png.flaticon.com/512/535/535285.png",
  arrowRight: (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path d="M6 11H16M16 11L12 7M16 11L12 15"
        stroke={NORA_COLOR} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
};
const filterNora = "invert(13%) sepia(4%) saturate(271%) hue-rotate(175deg) brightness(92%) contrast(93%)";

const REVIEWS = [
  { name: "Виктория", pregnancy: "27 недель", problem: "Тревожность из-за анализов", text: "Nora Plus помогла мне понять результаты и успокоиться. Теперь я сплю спокойнее." },
  { name: "Мария", pregnancy: "36 недель", problem: "Болели ноги", text: "Рекомендации Nora Plus помогли снять усталость и подобрать упражнения." },
  { name: "Оля", pregnancy: "18 недель", problem: "Тошнота", text: "Советы сервиса помогли выбрать правильное питание и легче переносить токсикоз." },
  { name: "София", pregnancy: "32 недели", problem: "Боялась родов", text: "Nora Plus давала поддержку и ответы на все вопросы. Я чувствую себя уверенней!" },
  { name: "Анастасия", pregnancy: "21 неделя", problem: "Головная боль", text: "Полезные рекомендации и поддержка!" },
  { name: "Екатерина", pregnancy: "25 недель", problem: "Тревоги", text: "Успокоилась, доверяю системе!" },
  { name: "Саида", pregnancy: "28 недель", problem: "Dahlsizlik", text: "Yordamingiz uchun rahmat!" },
  { name: "Азиза", pregnancy: "16 hafta", problem: "Ko'ngil aynish", text: "Nora maslahatlari yordam berdi." },
  { name: "Жанна", pregnancy: "38 недель", problem: "Бессонница", text: "Методы из приложения реально работают!" },
  { name: "Гузал", pregnancy: "20 hafta", problem: "Havotir", text: "Dastur ruhlantirdi." },
  { name: "Алиса", pregnancy: "19 недель", problem: "Страх родов", text: "Теперь спокойна, спасибо Nora!" },
  { name: "Лола", pregnancy: "24 hafta", problem: "Qorindagi og'riq", text: "Nora maslahatlari orqali qiynaldi ketdi." },
  { name: "Ирина", pregnancy: "29 недель", problem: "Боли в спине", text: "Удобно задавать вопросы, всё понятно!" },
  { name: "Диана", pregnancy: "33 недели", problem: "Усталость", text: "Рекомендации реально снимают стресс." },
  { name: "Малика", pregnancy: "15 hafta", problem: "Ishtaha yo'q", text: "Yordam oldim!" },
  { name: "Карина", pregnancy: "22 недели", problem: "Анализы", text: "Быстро получила ответы, все в порядке." },
  { name: "Юлия", pregnancy: "30 недель", problem: "Отеки ног", text: "Nora подсказала, как их уменьшить." },
  { name: "Зебо", pregnancy: "34 hafta", problem: "Charchoq", text: "Yengillik uchun rahmat!" },
  { name: "Эльвира", pregnancy: "23 недели", problem: "Эмоции", text: "Прояснила все тревоги." },
  { name: "Ботирхон", pregnancy: "27 hafta", problem: "Erkak sifatida ham maslahat kerak", text: "Papalar uchun ham foydali!" },
  { name: "Динара", pregnancy: "40 недель", problem: "Раздражение", text: "Советы о расслаблении супер!" },
  { name: "Мухлиса", pregnancy: "26 hafta", problem: "Qularoq", text: "Eng yaxshi yordam!" },
  { name: "Камила", pregnancy: "18 недель", problem: "Токсикоз", text: "Nora спасла моё настроение." },
  { name: "Анвар", pregnancy: "30 hafta", problem: "Uxlash qiyin", text: "Yordam berdingiz!" },
  { name: "Нигина", pregnancy: "20 недель", problem: "Страх", text: "Благодарю, меньше боюсь!" },
  { name: "Мадина", pregnancy: "25 неделя", problem: "Усталость", text: "Удобно, понятные советы!" },
  { name: "Гуль", pregnancy: "23 hafta", problem: "Ko'ngil xiraligi", text: "Yaxshi kayfiyat uchun rahmat!" },
  { name: "Феруза", pregnancy: "37 недель", problem: "Бессонница", text: "Удобно, можно задать вопрос ночью." },
  { name: "Галине", pregnancy: "32 недели", problem: "Питание", text: "Теперь ем правильно!" },
  { name: "Рано", pregnancy: "31 hafta", problem: "Tashvish", text: "Atrofdagilarga maslahatlar ham bera olaman!" },
];

const ReviewBlock: React.FC = () => {
  const [visibleIdx, setVisibleIdx] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleIdx(idx => (idx + 1) % REVIEWS.length);
    }, 7000);
    return () => clearInterval(interval);
  }, []);
  let reviewsToShow: typeof REVIEWS = [];
  for (let i = 0; i < 5; i++) {
    reviewsToShow.push(REVIEWS[
      (visibleIdx + REVIEWS.length - i) % REVIEWS.length
    ]);
  }
  return (
    <div style={{
      width: "100%", maxWidth: maxWidth, margin: "40px auto 0 auto", background: "none"
    }}>
      {reviewsToShow.map((r, idx) => (
        <div
          key={r.name+idx}
          style={{
            background: GRADIENT,
            borderRadius: borderRadius,
            margin: "0 20px " + (idx < 4 ? "20px" : "0"),
            boxShadow: "0 2px 8px 0 rgba(150, 180, 220, 0.10)",
            padding: "14px 16px 11px 16px",
            animation: idx === 0 ? "slideInTop 0.5s" : undefined,
            transition: "all 0.5s"
          }}>
          <div style={{ fontWeight: 700, fontSize: 15 }}>{r.name} — {r.pregnancy}</div>
          <div style={{ fontWeight: 700, color: "#715b9b", margin: "4px 0 3px 0" }}>
            {r.problem}
          </div>
          <div style={{ fontSize: 14, color: "#2e2e2e", lineHeight: "1.5" }}>{r.text}</div>
        </div>
      ))}
      <style>
        {`
        @keyframes slideInTop {
          0% { opacity: 0; transform: translateY(-30px);}
          100% { opacity: 1; transform: translateY(0);}
        `}
      </style>
    </div>
  );
};

type Message = { text: string; sender: "user" | "bot" };
const THREAD_KEY = "nora_thread_id";

const Chat: React.FC = () => {
  // ВАЖНО: showWelcome ОБЯЗАТЕЛЬНО есть!
  const [showWelcome, setShowWelcome] = useState(true);
  // --- твои остальные useState ---
  // ... preloading, message, chatHistory и т.д. ...

  // далее полностью твоя остальная логика компонента,
  // просто убедись что используется showWelcome (как в твоем коде)

  return (
    <div
      style={{
        background: "#f8fdff",
        width: "100vw",
        height: "100vh",
        overflow: "auto",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        boxSizing: "border-box"
      }}
    >
      {/* --- Панель, и т.д. --- */}

      {showWelcome ? (
        <>
          {/* ... блок картинки, описания, кнопка ... */}
          <button ... onClick={() => setShowWelcome(false)}>
            Начать пользоваться
          </button>
          <ReviewBlock />
        </>
      ) : (
        // ... остальной чат, инпут, сообщения ...
        null
      )}
    </div>
  );
};

export default Chat;
