"use client";
import React, { useState, useEffect, useRef } from "react";

// ====== ОРИГИНАЛЬНАЯ ПАНЕЛЬ ======
const HeaderPanel = ({ onClearChat }: { onClearChat?: () => void }) => (
  <div style={{
    width: `calc(100% - 30px)`,
    maxWidth: 560,
    minHeight: 62,
    background: "linear-gradient(90deg, #eff5fe 0%, #e5e8ed 100%)",
    color: "#2e2e2e",
    margin: "20px auto 0 auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 22,
    padding: "5px 15px",
    fontFamily: "'Manrope', Arial, Helvetica, sans-serif"
  }}>
    <div style={{display: "flex", flexDirection: "column", alignItems: "flex-start", flex: 1, paddingLeft: 5}}>
      <span style={{
        fontWeight: 800, fontSize: "19px", lineHeight: 1.06, whiteSpace: "nowrap", marginBottom: 7
      }}>
        Nora Plus
      </span>
      <span style={{
        fontWeight: 400, fontSize: "13px", color: "#565656", lineHeight: 1.04, whiteSpace: "nowrap"
      }}>
        Ассистент для будущих мам
      </span>
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: 16 }}>
      <button style={{
        background: "transparent", border: "none", width: 38, height: 38, borderRadius: 19, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center"}} onClick={() => window?.navigator?.share?.({ title: "Nora Plus", url: window.location.href })}>
        <img src="https://cdn-icons-png.flaticon.com/512/535/535285.png" style={{width: 23, height: 23}} alt="share"/>
      </button>
      <button style={{
        background: "transparent", border: "none", width: 38, height: 38, borderRadius: 19, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center"}} onClick={() => window.open("https://t.me/norasmart", "_blank")}>
        <img src="https://cdn-icons-png.flaticon.com/512/1946/1946547.png" style={{width: 23, height: 23}} alt="tg"/>
      </button>
      <button style={{
        background: "transparent", border: "none", width: 38, height: 38, borderRadius: 19, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center"}} onClick={onClearChat}>
        <img src="https://cdn-icons-png.flaticon.com/512/1345/1345823.png" style={{width: 23, height: 23}} alt="clear"/>
      </button>
    </div>
  </div>
);

// ====== Эмодзи-Причины ======
const BENEFITS = [
  { emoji: "🩺", text: "Медицинская точность: советы основаны на рекомендациях британской службы NHS и адаптированы под ваш регион." },
  { emoji: "🤝", text: "Поддержка 24/7: ассистент всегда на связи для заботы и помощи в любой ситуации." },
  { emoji: "⏰", text: "Напоминания о важных делах: следим, чтобы вы ничего не забыли — анализы, витамины, визиты." },
  { emoji: "🔒", text: "Конфиденциальность: личные данные остаются только у вас — никакой передачи сторонним." },
  { emoji: "⚡️", text: "Быстрые решения: полезные советы и поддержка сразу, когда это нужно." },
];
const WhyNoraBlock = () => (
  <div style={{
    width: "calc(100% - 20px)",
    maxWidth: 560,
    margin: "0 auto 38px auto",
    background: "linear-gradient(90deg, #eff5fe 0%, #e5e8ed 100%)",
    borderRadius: 22,
    boxShadow: "0 6px 20px 0 rgba(150,175,205,0.09)",
    padding: "22px 10px 20px 10px",
    fontFamily: "'Manrope', Arial, Helvetica, sans-serif"
  }}>
    <div style={{ fontWeight: 700, fontSize: 20, color: "#2e2e2e", marginBottom: 25, textAlign: "center" }}>Почему Nora Plus?</div>
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {BENEFITS.map(({ emoji, text }, idx) => (
        <div key={idx} style={{
          background: "#fff",
          borderRadius: 16,
          boxShadow: "0 2px 14px rgba(160,180,210,0.07)",
          padding: "15px 10px",
          marginBottom: 10,
          fontSize: 15,
          display: "flex",
          alignItems: "center"
        }}>
          <span style={{ fontSize: 19, marginRight: 10 }}>{emoji}</span>
          <span style={{ fontSize: 15, color: "#222" }}>{text}</span>
        </div>
      ))}
    </div>
  </div>
);

// ====== Отзывы ======
const REVIEWS = [
  { name: "Анна", badge: "2 месяц беременности", text: "Nora Plus подсказала, как справиться с утренней тошнотой, благодаря советам по питанию стало легче." },
  { name: "Елена", badge: "4 месяц беременности", text: "Теперь я знаю, когда сдавать анализы и какие витамины пить. Всё под контролем." },
  { name: "Ирина", badge: "5 месяц беременности", text: "Успокоилась: ежедневно получаю поддержку и рекомендации." },
  { name: "Мария", badge: "7 месяц беременности", text: "Благодаря советам Nora Plus я лучше сплю и чувствую уверенность!" },
];
const ReviewBlock = () => (
  <div style={{
    width: "calc(100% - 20px)",
    maxWidth: 560,
    margin: "0 auto 38px auto",
    background: "linear-gradient(90deg, #eff5fe 0%, #e5e8ed 100%)",
    borderRadius: 22,
    boxShadow: "0 6px 20px 0 rgba(150,175,205,0.10)",
    fontFamily: "'Manrope', Arial, Helvetica, sans-serif",
    padding: "22px 10px 20px 10px"
  }}>
    <div style={{ fontWeight: 700, fontSize: 20, color: "#2e2e2e", marginBottom: 20, textAlign: "center" }}>Отзывы будущих мам</div>
    {REVIEWS.map(({ name, badge, text }, idx) => (
      <div key={idx} style={{
        background: "#fff",
        borderRadius: 16,
        boxShadow: "0 2px 14px rgba(160,180,210,0.07)",
        padding: "15px 10px",
        marginBottom: 10
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 7 }}>
          <span style={{ fontWeight: 700, fontSize: 15 }}>{name}</span>
          <span style={{
            background: "#f3f7fe",
            color: "#1681f5",
            borderRadius: 12,
            padding: "3px 8px",
            fontSize: 13
          }}>{badge}</span>
        </div>
        <div style={{ fontSize: 13, color: "#3a3a3a", lineHeight: 1.6 }}>{text}</div>
      </div>
    ))}
  </div>
);

// ====== Как работает Нора ======
const EXAMPLES = [
  { q: "Можно ли пить кофе во время беременности?", a: "☕ Конечно, но не больше 1-2 чашек в день и лучше без сахара." },
  { q: "Я часто переживаю без причины.", a: "🤗 Это естественно. Я помогу успокоиться и понять, что нормально, а когда лучше обратиться к врачу." },
  { q: "Болят ноги и поясница.", a: "🦵 Это распространено! Покажу упражнения и советы для облегчения." },
  { q: "Плохо сплю.", a: "😴 Попробуйте лёгкий перекус перед сном, дыхательные техники и комфортную позу на боку." },
  { q: "Какие витамины принимать?", a: "💊 Помогу подобрать подходящие витамины и напомню, когда их принимать." },
  { q: "Можно ли летать?", a: "✈️ Если беременность протекает спокойно, перелёты до 30 недели безопасны, но уточните у врача." },
];
const bubbleStyle = (align = "right") => ({
  alignSelf: align === "right" ? 'flex-end' : 'flex-start',
  background: "#fff",
  borderRadius: 19,
  padding: align === "right" ? "12px 14px" : "14px 14px",
  marginBottom: 16,
  maxWidth: 370,
  textAlign: "left",
  lineHeight: "1.6",
  boxShadow: "0 1px 8px rgba(200,180,200,0.1)",
  color: "#2e2e2e",
  fontSize: 15
});
const NoraHowItWorksBlock = () => {
  const [step, setStep] = useState(0);
  const [phase, setPhase] = useState("typeQ");
  const [q, setQ] = useState("");
  const [a, setA] = useState("");
  useEffect(() => {
    if (phase === "typeQ") {
      setQ("");
      let i = 0;
      const id = setInterval(() => {
        setQ(EXAMPLES[step].q.slice(0, i + 1));
        i++;
        if (i > EXAMPLES[step].q.length) {
          clearInterval(id);
          setTimeout(() => setPhase("typeA"), 300);
        }
      }, 60);
      return () => clearInterval(id);
    }
    if (phase === "typeA") {
      setA("");
      let i = 0;
      const id = setInterval(() => {
        setA(EXAMPLES[step].a.slice(0, i + 1));
        i++;
        if (i > EXAMPLES[step].a.length) {
          clearInterval(id);
          setTimeout(() => setPhase("next"), 6500);
        }
      }, 35);
      return () => clearInterval(id);
    }
    if (phase === "next") {
      const timer = setTimeout(() => {
        setStep((step + 1) % EXAMPLES.length);
        setQ("");
        setA("");
        setPhase("typeQ");
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [phase, step]);
  return (
    <div style={{
      width: "calc(100% - 20px)",
      maxWidth: 560,
      margin: "0 auto 38px auto",
      background: "linear-gradient(90deg, #eff5fe 0%, #e5e8ed 100%)",
      borderRadius: 22,
      boxShadow: "0 6px 20px 0 rgba(150,175,205,0.09)",
      padding: "22px 10px 20px 10px",
      fontFamily: "'Manrope', Arial, Helvetica, sans-serif"
    }}>
      <div style={{ textAlign: "center", fontSize: 20, color: "#2e2e2e", fontWeight: 700 }}>Как работает Nora?</div>
      <div style={{ height: 23 }} />
      <div style={{ display: "flex", flexDirection: "column" }}>
        {q && <div style={bubbleStyle("right")}>{q}<span style={{ opacity: 0.24 }}>{phase === "typeQ" && "|"}</span></div>}
        {a && <div style={bubbleStyle("left")}>{a}<span style={{ opacity: 0.24 }}>{phase === "typeA" && "|"}</span></div>}
      </div>
      <div style={{ textAlign: "center", color: "#7b8590", fontSize: 13, marginTop: 8 }}>Нора помогает и отвечает сразу</div>
    </div>
  );
};

// ====== Футер ======
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
const IconPolicy = (
  <svg width="16" height="16" fill="none" viewBox="0 0 20 20">
    <path d="M4 4.5V10c0 5 7 6.5 7 6.5s7-1.5 7-6.5v-5.5л-7-2-7 2Z" stroke="#4d5762" strokeWidth="1.5" fill="none"/>
  </svg>
);
const Footer = () => (
  <div style={{
    width: "calc(100% - 56px)",
    maxWidth: 560,
    margin: "0 auto",
    background: "linear-gradient(90deg, #eff5fe 0%, #e5e8ed 100%)",
    borderRadius: 22,
    boxShadow: "0 -4px 14px rgba(155,175,205,0.06)",
    padding: 28,
    fontFamily: "'Manrope', sans-serif"
  }}>
    <div style={{ fontSize: 12, textAlign: "center", color: "#263540", fontWeight: 600 }}>Ташкент, Юнусабадский район, массив Кашгар 26</div>
    <div style={{ display: "flex", gap: 11, justifyContent: "center", marginTop: 15 }}>
      <a href="#" style={{ background: "#fff", border: "1px solid #e1e9f5", padding: "9px 0", borderRadius: 13, width: "63%", display: "flex", justifyContent: "center", alignItems: "center", fontSize: 14, gap: 7, color: "#495062" }}>{IconPartner} Стать партнёром</a>
      <a href="#" style={{ background: "#fff", border: "1px solid #e1e9f5", padding: "9px 0", borderRadius: 13, width: "37%", display: "flex", justifyContent: "center", alignItems: "center", fontSize: 14, gap: 7, color: "#495062" }}>{IconContact} Контакты</a>
    </div>
    <a href="#" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 7, background: "#fff", border: "1px solid #e1e9f5", borderRadius: 14, color: "#556", fontSize: 14, padding: "8px 0", marginTop: 16, textDecoration: "none" }}>{IconPolicy} Политика конфиденциальности</a>
    <div style={{ fontSize: 12, color: "#8a97a0", textAlign: "center", marginTop: 10 }}>© {new Date().getFullYear()} Nora Plus — забота и поддержка будущих мам</div>
  </div>
);

// ====== Главный компонент ======
const Chat = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [msg, setMsg] = useState("");
  const [chat, setChat] = useState<{ text: string; sender: "user" | "bot" }[]>([]);
  const endChat = useRef<HTMLDivElement>(null);
  useEffect(() => { if (endChat.current) endChat.current.scrollIntoView({ behavior: "smooth" }); }, [chat]);
  const send = () => {
    if (!msg.trim()) return;
    setChat([...chat, { text: msg, sender: "user" }]);
    setTimeout(() => {
      setChat(prev => [...prev, { text: "Nora отвечает на ваш вопрос!", sender: "bot" }]);
      setMsg("");
    }, 1000);
  };
  return (
    <div style={{ background: "#f8fdff", minHeight: "100vh" }}>
      <HeaderPanel onClearChat={() => setChat([])} />
      {showWelcome ? (
        <>
          <div style={{ textAlign: "center", marginTop: 20 }}>
            <video src="/nora.mp4" style={{ width: "100%", maxWidth: 320, borderRadius: 22 }} autoPlay muted loop playsInline preload="auto" />
          </div>
          <div style={{ marginTop: 24, textAlign: "center" }}>
            <div style={{ fontWeight: 700, fontSize: 22, color: "#2e2e2e", marginBottom: 12 }}>Ждёте малыша? Я помогу!</div>
            <div style={{
              color: "#2e2e2e",
              fontSize: 15,
              lineHeight: 1.75,
              padding: "0 34px"
            }}>
              Я помогаю будущим мамам: отвечаю на вопросы, напоминаю о важных делах, слежу за самочувствием и поддерживаю!
            </div>
          </div>
          <div style={{ textAlign: "center", marginTop: 36, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <button onClick={() => setShowWelcome(false)} style={{
              background: "linear-gradient(90deg, #e39290 0%, #efb1b6 100%)",
              border: "none",
              borderRadius: 22,
              color: "#fff",
              fontSize: 17,
              fontWeight: 700,
              padding: "15px 30px",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10
            }}>
              <span>Начать пользоваться</span>
              <span>
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <path d="M6 11H16M16 11L12 7M16 11L12 15"
                    stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </button>
            <div style={{ fontSize: 13, color: "#7c8792", marginTop: 13 }}>
              Попробуйте — это быстро и бесплатно
            </div>
          </div>
          <div style={{ marginTop: 40 }} />
          <NoraHowItWorksBlock />
          <WhyNoraBlock />
          <ReviewBlock />
          <Footer />
          <div style={{ height: 20 }} />
        </>
      ) : (
        <>
          <div style={{ maxWidth: 560, margin: "0 auto", padding: "30px 0 90px 0" }}>
            {chat.map((m, i) => (
              <div key={i} style={{ textAlign: m.sender === "user" ? "right" : "left", margin: "10px 20px" }}>
                <span style={{
                  display: "inline-block",
                  background: m.sender === "user" ? "#fff" : "#f7fafd",
                  padding: 10,
                  borderRadius: 16,
                  fontSize: 16
                }}>{m.text}</span>
              </div>
            ))}
            <div ref={endChat} />
          </div>
          <div style={{
            position: "fixed", bottom: 25, left: 0, width: "calc(100% - 40px)", margin: "0 20px",
            maxWidth: 560, display: "flex", alignItems: "center"
          }}>
            <input type="text" value={msg} onChange={e => setMsg(e.target.value)} onKeyDown={e => e.key === "Enter" && send()}
              placeholder="Введите сообщение..."
              style={{ flex: 1, height: 48, borderRadius: 22, border: "1px solid #e5e8ed", padding: "0 18px", fontSize: 16 }} />
            <button onClick={send} style={{
              width: 48, height: 48, border: "none", borderRadius: 22,
              marginLeft: 8, background: "linear-gradient(90deg, #e39290 0%, #efb1b6 100%)", color: "#fff", cursor: "pointer"
            }}>
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <path d="M6 11H16M16 11L12 7M16 11L12 15"
                  stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Chat;
