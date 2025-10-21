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

// --- SVG-иконки ---
const IconPartner = (
  <svg width="18" height="18" fill="none" viewBox="0 0 20 20">
    <circle cx="10" cy="6.5" r="3.3" stroke="#5a6573" strokeWidth="1.5"/>
    <path d="M2.8 16c.9-2.5 3.4-4.2 7.2-4.2s6.2 1.7 7.2 4.2" stroke="#5a6573" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const IconContact = (
  <svg width="18" height="18" fill="none" viewBox="0 0 20 20">
    <rect x="2.8" y="3.5" width="14.4" height="11" rx="2.2" stroke="#5a6573" strokeWidth="1.5"/>
    <path d="M3.5 4l6.5 6.1c.3.2.8.2 1.1 0L17 4" stroke="#5a6573" strokeWidth="1.5"/>
  </svg>
);

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

const REVIEWS = [
  { name: "Анна", badge: "2 месяц беременности", problem: "Токсикоз", text: "Nora Plus подсказала, как справиться с утренней тошнотой. Благодаря рекомендациям по питанию и режиму дня симптомы стали гораздо легче." },
  { name: "Дилноза", badge: "3 месяц беременности", problem: "Тошнота", text: "Советы Nora Plus помогли справиться с тошнотой и легче переносить беременность. Все подсказки приходят вовремя." },
  { name: "Елена", badge: "4 месяц беременности", problem: "Слабость и усталость", text: "Теперь я знаю, какие витамины нужно пить, сколько отдыхать и как выстроить день. Чувствую себя значительно лучше!" },
  { name: "Шахноза", badge: "5 месяц беременности", problem: "Плохое настроение", text: "Благодаря мотивационным словам и советам Nora Plus моё настроение заметно улучшилось." },
  { name: "Ирина", badge: "5 месяц беременности", problem: "Тревожность", text: "Советы Nora Plus помогли мне больше отдыхать, заботиться о себе и избавиться от лишних переживаний за малыша." },
  { name: "Мария", badge: "7 месяц беременности", problem: "Бессонница", text: "Благодаря советам Nora Plus я стала лучше спать и спокойно жду появления малыша." },
  { name: "Виктория", badge: "3 месяц беременности", problem: "Страхи", text: "Nora Plus помогла справиться с тревогами и поддержала советами, теперь я чувствую себя увереннее." },
  { name: "Екатерина", badge: "6 месяц беременности", problem: "Питание", text: "Ассистент напомнил о важных витаминах и правильном режиме, теперь питаюсь грамотно и чувствую себя энергичной." },
  { name: "Гульнора", badge: "2 месяц беременности", problem: "Нарушение сна", text: "Проконсультировавшись с Nora, я восстановила сон и теперь хорошо встречаю утро." },
  { name: "Малика", badge: "8 месяц беременности", problem: "Раздражительность", text: "Во время беременности стала нервной, но советы от Nora помогли и настроение улучшилось." },
  { name: "Лола", badge: "4 месяц беременности", problem: "Недостаток белка", text: "Советы по питанию очень полезные, теперь у меня больше энергии." }
];

// --- Как работает Нора ---
const EXAMPLES = [
  { q: "Можно ли пить кофе во время беременности?", a: "☕ Конечно, но не больше 1–2 чашек в день." },
  { q: "Я часто волнуюсь без причины.", a: "🤗 Это естественно. Я помогу разобраться, когда стоит обратиться к врачу." },
  { q: "Болит спина и поясница.", a: "🦵 Старайтесь больше отдыхать лёжа на боку и выбирайте удобную обувь." },
  { q: "Плохо сплю.", a: "😴 Проветривайте комнату, делайте спокойные прогулки — всё наладится." },
  { q: "Можно ли заниматься спортом?", a: "🏃 Конечно. Рекомендую йогу, плавание и прогулки, без перегрузок." },
];
const bubbleStyle = (align = "right") => ({
  alignSelf: align === "right" ? ("flex-end" as const) : ("flex-start" as const),
  background: "#fff",
  borderRadius: 19,
  padding: "15px 21px",
  marginBottom: 16,
  maxWidth: 370,
  textAlign: "left" as const,
  boxShadow: "0 1px 8px rgba(200,180,200,0.1)"
});
const NoraHowItWorksBlock = () => {
  const [step, setStep] = useState(0);
  const [phase, setPhase] = useState("typeQ");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  useEffect(() => {
    if (phase === "typeQ") {
      setQuestion("");
      let i = 0;
      const int = setInterval(() => {
        setQuestion(EXAMPLES[step].q.slice(0, i + 1));
        i++;
        if (i > EXAMPLES[step].q.length) {
          clearInterval(int);
          setTimeout(() => setPhase("typeA"), 350);
        }
      }, 40);
      return () => clearInterval(int);
    }
    if (phase === "typeA") {
      setAnswer("");
      let i = 0;
      const int = setInterval(() => {
        setAnswer(EXAMPLES[step].a.slice(0, i + 1));
        i++;
        if (i > EXAMPLES[step].a.length) {
          clearInterval(int);
          setTimeout(() => setPhase("next"), 6000);
        }
      }, 25);
      return () => clearInterval(int);
    }
    if (phase === "next") {
      const nextDelay = setTimeout(() => {
        setStep((s) => (s + 1) % EXAMPLES.length);
        setPhase("typeQ");
      }, 500);
      return () => clearTimeout(nextDelay);
    }
  }, [phase, step]);
  return (
    <div style={{
      width: `calc(100% - ${BLOCK_SIDE_PADDING * 2}px)`,
      maxWidth,
      margin: "0 auto 38px auto",
      background: GRADIENT,
      borderRadius: borderRadius,
      boxShadow: "0 6px 20px 0 rgba(150,175,205,0.10)",
      boxSizing: "border-box",
      padding: `21px 0 20px 0`,
      fontFamily: "'Manrope', Arial, Helvetica, sans-serif"
    }}>
      <div style={{
        fontWeight: 700,
        fontSize: "20px",
        color: NORA_COLOR,
        marginBottom: 20,
        textAlign: "center"
      }}>
        Как работает Nora?
      </div>
      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: CARD_GAP,
        padding: `0 ${BLOCK_SIDE_PADDING}px`
      }}>
        {question && <div style={bubbleStyle("right")}>{question}</div>}
        {answer && <div style={bubbleStyle("left")}>{answer}</div>}
      </div>
      <div style={{ fontSize: 13, color: "#7b8590", textAlign: "center", marginTop: 8 }}>
        Просто задайте вопрос — Нора найдёт ответ!
      </div>
    </div>
  );
};

const WhyNoraBlock = /* ... твоя часть ... */;
const ReviewBlock = /* ... твоя часть ... */;
const Footer = /* ... твоя часть ... */;
const FooterGap = () => <div style={{height: 20}} />;

const Chat = () => (
  <div>
    {/* ...твой header, welcome, секции... */}
    {/* просто вставь после welcome-сценария вот так: */}
    <NoraHowItWorksBlock />
    <WhyNoraBlock />
    <ReviewBlock />
    <Footer />
    <FooterGap />
  </div>
);

export default Chat;
