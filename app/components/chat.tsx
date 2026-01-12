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
const INPUT_BAR_HEIGHT = 80;
const PANEL_SIDE_PADDING = 15;
const BLOCK_SIDE_PADDING = 10;
const CARD_GAP = 10;

// размер круглых кнопок внизу (файл/мик/отправка)
const ICON_BUTTON_SIZE = 52;
const ICON_DARK = "#5a6573";

// словарь текстов для RU / UZ
type Lang = "ru" | "uz";

const TEXTS: Record<Lang, any> = {
  ru: {
    appName: "Nora Plus",
    subtitle: "Ассистент для будущих мам",
    heroTitle: "Ждёте малыша? Я помогу!",
    heroBody:
      "Нора — ассистент, который отвечает на вопросы, успокаивает, напоминает о важных делах и делится рекомендациями на основе медицины Великобритании NHS. Не гуглите в панике — просто спросите Нору.",
    welcomeStat: "Уже более 1 000 будущих мам пользуются Норой 🩷",
    startChat: "Начать чат с Норой",
    readyQuestionText:
      "Выберите готовый вопрос или задайте свой — Нора уточнит детали и подстроит рекомендации под ваш срок и самочувствие.",
    inputPlaceholder: "Задайте вопрос...",
    userLabel: "Вы",
    noraLabel: "Нора",
    noraTyping: "Нора печатает…",
    bottomHint:
      "Расскажите Норе о своём самочувствии, сроке беременности или вопросе, который вас волнует — она подскажет, что делать дальше.",
    menuHow: "Как работает Нора",
    menuWhat: "Что умеет Нора",
    menuWhatTitle: "Что умеет Nora Plus",
    menuReviews: "Отзывы",
    menuContacts: "Контакты",
    menuContactsTitle: "Контакты и партнёрство",
    menuReviewsTitle: "Отзывы будущих мам",
    menuMainTitle: "Меню",
    howText:
      "Нора задаёт уточняющие вопросы, учитывает ваш срок, жалобы и историю, а затем опирается на клинические рекомендации, чтобы объяснить, что происходит и какие шаги можно предпринять.",
    whatText:
      "Возможности Норы помогают не только отвечать на вопросы, но и сопровождать беременность день за днём.",
    exampleTitle: "Пример диалога с Норой",
    exampleUser:
      "Срок беременности 9 недель, мучает токсикоз. Что можно сделать, чтобы стало легче?",
    exampleUserLabel: "Будущая мама",
    exampleNora:
      "Первые недели беременности часто сопровождаются токсикозом — это нормально, но неприятно. Попробуйте есть небольшими порциями каждые 2–3 часа, носить с собой перекус и пить воду маленькими глотками в течение дня. Если рвота становится частой, вы теряете вес или не можете пить — обязательно свяжитесь с врачом, чтобы исключить обезвоживание.",
    benefitsTitle1: "Медицинская точность",
    benefitsText1:
      "Советы основаны на рекомендациях британской службы NHS и адаптированы под ваш регион.",
    benefitsTitle2: "Поддержка 24/7",
    benefitsText2:
      "Ассистент всегда на связи для заботы и помощи в любой ситуации.",
    benefitsTitle3: "Напоминания о важных делах",
    benefitsText3:
      "Следим, чтобы вы ничего не забыли — анализы, витамины, визиты.",
    benefitsTitle4: "Конфиденциальность",
    benefitsText4:
      "Личные данные остаются только у вас — никакой передачи сторонним.",
    benefitsTitle5: "Быстрые решения",
    benefitsText5:
      "Полезные советы и поддержка сразу, когда это нужно.",
    bottomNavHow: "Что это?",
    bottomNavReviews: "Отзывы",
    bottomNavStart: "Начать",
    bottomNavHistory: "История",
    bottomNavContacts: "Контакты",
    historySoon: "История диалогов появится скоро.",
    contactsAddressLabel: "Адрес:",
    contactsAddress: "Ташкент, Юнусабадский район, массив Кашгар 26",
    contactsTgLabel: "Телеграм‑канал:",
    contactsTg: "@norasmart",
    contactsPolicy: "Политика конфиденциальности",
    contactsPartner: "Стать партнёром",
    contactsSupport: "Написать в поддержку",
    contactsWhere: "Где нас найти",
    androidBtn: "Скачать на Android",
    iosBtn: "Скачать на iOS",
    iosSoon: "Скоро будет доступна версия для iOS.",
    speakNotSupported:
      "Ваш браузер не поддерживает голосовой ввод (Web Speech API).",
    speakRecording: "Идёт запись...",
    speakTitle: "Голосовой ввод",
    uploadFileUser: (name: string) =>
      `Файл "${name}" отправлен ассистенту.`,
    uploadFileError:
      "Не удалось загрузить файл. Попробуйте ещё раз.",
    serverError: (err?: string) =>
      err
        ? `Ошибка сервера: ${err}`
        : "Ассистент не ответил (ошибка сервера)",
    noAnswer: "Извините, нет ответа от ассистента.",
    genericError: "Ошибка: не удалось получить ответ.",
    mobileOnly:
      "Nora Plus — доступна только \n на мобильных устройствах",
    askNora: "Просто спросите Нору.",
    langButtonCurrent: "Русский",
    langButtonOther: "O'zbekcha",
  },
  uz: {
    appName: "Nora Plus",
    subtitle: "Bo‘lajak onalar uchun yordamchi",
    heroTitle: "Bola kutyapsizmi? Yordam beraman!",
    heroBody:
      "Nora — homiladorlik bo‘yicha savollarga javob beradigan, tinchlantiradigan va muhim ishlarni eslatib turadigan yordamchi. NHS (Buyuk Britaniya sog‘liqni saqlash xizmati) tavsiyalariga tayangan holda maslahat beradi.",
    welcomeStat: "1 000 dan ortiq bo‘lajak onalar Nora’dan foydalanmoqda 🩷",
    startChat: "Nora bilan suhbatni boshlash",
    readyQuestionText:
      "Tayyor savollardan birini tanlang yoki o‘zingiz yozing — Nora sizning muddatingiz va holatingizga mos tavsiyalar beradi.",
    inputPlaceholder: "Savolingizni yozing...",
    userLabel: "Siz",
    noraLabel: "Nora",
    noraTyping: "Nora yozmoqda…",
    bottomHint:
      "O‘zingizni qanday hislayotganingizni, homiladorlik muddatini yoki xavotiringizni yozing — Nora keyingi qadamlarni tushuntirib beradi.",
    menuHow: "Nora qanday ishlaydi",
    menuWhat: "Nora nimalarga qodir",
    menuWhatTitle: "Nora Plus imkoniyatlari",
    menuReviews: "Fikrlar",
    menuContacts: "Kontaktlar",
    menuContactsTitle: "Kontaktlar va hamkorlik",
    menuReviewsTitle: "Bo‘lajak onalar fikrlari",
    menuMainTitle: "Menyu",
    howText:
      "Nora sizning muddatingiz, shikoyatlaringiz va tarixingizni inobatga olib savol beradi, so‘ng klinik tavsiyalar asosida nima bo‘layotgani va nimalar qilish mumkinligini tushuntiradi.",
    whatText:
      "Nora imkoniyatlari savollarga javob berishdan tashqari, homiladorlikni kundalik kuzatishga ham yordam beradi.",
    exampleTitle: "Nora bilan suhbat namunasi",
    exampleUser:
      "Homiladorligim 9 haftada, toksikoz qiynayapti. O‘zimni yengilroq his qilish uchun nima qilsam bo‘ladi?",
    exampleUserLabel: "Bo‘lajak ona",
    exampleNora:
      "Birinchi haftalarda toksikoz tez-tez uchraydi — yoqimsiz, lekin odatiy holat. Har 2–3 soatda oz-ozdan ovqatlaning, yoningizda yengil tamaddi bo‘lsin va kun davomida suvni kichik ho‘plab iching. Agar qusish tez-tez bo‘lsa, vazn yo‘qotsangiz yoki icha olmasangiz — suvsizlanishni oldini olish uchun shifokorga murojaat qiling.",
    benefitsTitle1: "Tibbiy aniqlik",
    benefitsText1:
      "Maslahatlar Buyuk Britaniya NHS tavsiyalariga asoslangan va sizning hududingizga moslashtirilgan.",
    benefitsTitle2: "24/7 yordam",
    benefitsText2:
      "Har doim yoningizda — har qanday vaziyatda qo‘llab-quvvatlaydi.",
    benefitsTitle3: "Muhim eslatmalar",
    benefitsText3:
      "Tahlillar, vitaminlar, qabul vaqtlarini unutib qo‘ymasligingizga yordam beradi.",
    benefitsTitle4: "Maxfiylik",
    benefitsText4:
      "Shaxsiy ma’lumotlaringiz faqat siz bilan — uchinchi shaxslarga uzatilmaydi.",
    benefitsTitle5: "Tezkor yechimlar",
    benefitsText5:
      "Kerakli paytda foydali maslahat va ko‘mak beradi.",
    bottomNavHow: "Bu nima?",
    bottomNavReviews: "Fikrlar",
    bottomNavStart: "Boshlash",
    bottomNavHistory: "Tarix",
    bottomNavContacts: "Kontaktlar",
    historySoon: "Suhbat tarixi tez orada paydo bo‘ladi.",
    contactsAddressLabel: "Manzil:",
    contactsAddress: "Toshkent, Yunusobod tumani, Kashgar massivi 26",
    contactsTgLabel: "Telegram kanal:",
    contactsTg: "@norasmart",
    contactsPolicy: "Maxfiylik siyosati",
    contactsPartner: "Hamkor bo‘lish",
    contactsSupport: "Yordamga yozish",
    contactsWhere: "Qayerdan topish mumkin",
    androidBtn: "Android uchun yuklab olish",
    iosBtn: "iOS uchun yuklab olish",
    iosSoon: "Tez orada iOS versiyasi ham mavjud bo‘ladi.",
    speakNotSupported:
      "Sizning brauzeringiz ovozli kiritishni (Web Speech API) qo‘llab-quvvatlamaydi.",
    speakRecording: "Yozib olinmoqda...",
    speakTitle: "Ovozli kiritish",
    uploadFileUser: (name: string) =>
      `“${name}” fayli yordamchiga yuborildi.`,
    uploadFileError:
      "Faylni yuklab bo‘lmadi. Qayta urinib ko‘ring.",
    serverError: (err?: string) =>
      err
        ? `Server xatosi: ${err}`
        : "Yordamchi javob bermadi (server xatosi).",
    noAnswer: "Kechirasiz, yordamchidan javob kelmadi.",
    genericError: "Xato: javobni olish imkonsiz.",
    mobileOnly:
      "Nora Plus faqat \n mobil qurilmalarda mavjud",
    askNora: "Shunchaki Nora’dan so‘rang.",
    langButtonCurrent: "O'zbekcha",
    langButtonOther: "Русский",
  },
};

// иконка перевода языка (минималистичная)
const IconLang = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9" stroke="#111827" strokeWidth="1.6" />
    <path
      d="M7 9H17"
      stroke="#111827"
      strokeWidth="1.4"
      strokeLinecap="round"
    />
    <path
      d="M9 6H15"
      stroke="#111827"
      strokeWidth="1.4"
      strokeLinecap="round"
    />
    <path
      d="M9 18C10 15.5 11 14.2 12 14"
      stroke="#111827"
      strokeWidth="1.4"
      strokeLinecap="round"
    />
  </svg>
);

const IconShield = (
  <svg width="17" height="17" fill="none" viewBox="0 0 22 22">
    <path
      d="M11 3.3C7.1 5 4.6 5.5 3.7 5.7c-.1 0-.2 0-.2.2 0 6.8 2.6 11.2 7.1 12.7.2.1.4.1.6 0 4.5-1.5 7.1-5.8 7.1-12.7 0-.2-.1-.2-.2-.2-.9-.2-3.4-.7-7.1-2.4Z"
      stroke="#5a6573"
      strokeWidth="1.35"
      fill="#f2f7fe"
    />
  </svg>
);

const IconPartner = (
  <svg width="18" height="18" fill="none" viewBox="0 0 20 20">
    <circle cx="10" cy="6.5" r="3.3" stroke="#5a6573" strokeWidth="1.5" />
    <path
      d="M2.8 16c.9-2.5 3.4-4.2 7.2-4.2s6.2 1.7 7.2 4.2"
      stroke="#5a6573"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);
const IconContact = (
  <svg width="18" height="18" fill="none" viewBox="0 0 20 20">
    <rect
      x="2.8"
      y="3.5"
      width="14.4"
      height="11"
      rx="2.2"
      stroke="#5a6573"
      strokeWidth="1.5"
    />
    <path
      d="M3.5 4l6.5 6.1c.3.2.8.2 1.1 0L17 4"
      stroke="#5a6573"
      strokeWidth="1.5"
    />
  </svg>
);

const IconMenu = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M4 7h16" stroke="#000000" strokeWidth="2" strokeLinecap="round" />
    <path d="M4 12h16" stroke="#000000" strokeWidth="2" strokeLinecap="round" />
    <path d="M4 17h16" stroke="#000000" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const ICONS = {
  arrowRight: (
    <svg width="24" height="24" viewBox="0 0 22 22" fill="none">
      <path
        d="M6 11H16M16 11L12 7M16 11L12 15"
        stroke="#fff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
};

const filterNora =
  "invert(13%) sepia(4%) saturate(271%) hue-rotate(175deg) brightness(92%) contrast(93%)";

// увеличенные иконки для файла и микрофона
const IconPaperclip = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path
      d="M8.5 12.5L14 7C15.1 5.9 16.9 5.9 18 7C19.1 8.1 19.1 9.9 18 11L11 18C9.3 19.7 6.5 19.7 4.8 18C3.1 16.3 3.1 13.5 4.8 11.8L11.5 5"
      stroke={ICON_DARK}
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconMic = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <rect
      x="9"
      y="4"
      width="6"
      height="10"
      rx="3"
      stroke={ICON_DARK}
      strokeWidth="1.7"
    />
    <path
      d="M7 11C7 13.2 8.8 15 11 15H13C15.2 15 17 13.2 17 11"
      stroke={ICON_DARK}
      strokeWidth="1.7"
      strokeLinecap="round"
    />
    <path
      d="M12 15V19"
      stroke={ICON_DARK}
      strokeWidth="1.7"
      strokeLinecap="round"
    />
    <path
      d="M9.5 19H14.5"
      stroke={ICON_DARK}
      strokeWidth="1.7"
      strokeLinecap="round"
    />
  </svg>
);

// иконки приложений (минималистичные)
const IconAndroidMini = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <rect
      x="7"
      y="9"
      width="10"
      height="9"
      rx="2"
      stroke="#ffffff"
      strokeWidth="1.6"
    />
    <circle cx="10" cy="7" r="0.8" fill="#ffffff" />
    <circle cx="14" cy="7" r="0.8" fill="#ffffff" />
  </svg>
);

const IconAppleMini = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path
      d="M16.3 4.1C15.6 4.8 14.7 5.2 13.8 5.1C13.7 4.3 14 3.4 14.6 2.8C15.3 2 16.4 1.6 17.3 1.6C17.4 2.4 17.1 3.3 16.3 4.1Z"
      fill="#111827"
    />
    <path
      d="M18.5 8.5C18.4 8.6 17.4 9.2 17.4 10.4C17.4 11.8 18.6 12.3 18.7 12.4C18.7 12.5 18.5 13.2 18 13.9C17.5 14.7 16.9 15.5 16 15.5C15.1 15.5 14.8 15 13.8 15C12.8 15 12.5 15.5 11.6 15.5C10.7 15.5 10.1 14.7 9.6 14C8.7 12.7 8 10.2 9 8.5C9.5 7.6 10.4 7 11.4 7C12.3 7 13 7.6 13.8 7.6C14.6 7.6 15.1 7 16.1 7C16.9 7 17.8 7.4 18.5 8.5Z"
      fill="#111827"
    />
  </svg>
);

// преимущества
const BENEFITS = [
  {
    emoji: "🩺",
    keyTitle: "benefitsTitle1",
    keyText: "benefitsText1",
  },
  {
    emoji: "🤝",
    keyTitle: "benefitsTitle2",
    keyText: "benefitsText2",
  },
  {
    emoji: "⏰",
    keyTitle: "benefitsTitle3",
    keyText: "benefitsText3",
  },
  {
    emoji: "🔒",
    keyTitle: "benefitsTitle4",
    keyText: "benefitsText4",
  },
  {
    emoji: "⚡️",
    keyTitle: "benefitsTitle5",
    keyText: "benefitsText5",
  },
];

// отзывы оставляем на русском (как реальные цитаты)
const REVIEWS = [
  {
    name: "Анна",
    badge: "2 месяц беременности",
    problem: "Токсикоз",
    text: "Nora Plus подсказала, как справиться с утренней тошнотой. Благодаря рекомендациям по питанию и режиму дня симптомы стали гораздо легче.",
  },
  {
    name: "Дилноза",
    badge: "3 месяц беременности",
    problem: "Тошнота",
    text: "Советы Nora Plus помогли справиться с тошнотой и легче переносить беременность. Все подсказки приходят вовремя.",
  },
  {
    name: "Елена",
    badge: "4 месяц беременности",
    problem: "Слабость и усталость",
    text: "Теперь я знаю, какие витамины нужно пить, сколько отдыхать и как выстроить день. Чувствую себя значительно лучше!",
  },
  {
    name: "Шахноза",
    badge: "5 месяц беременности",
    problem: "Плохое настроение",
    text: "Благодаря мотивационным словам и советам Nora Plus моё настроение заметно улучшилось.",
  },
  {
    name: "Ирина",
    badge: "5 месяц беременности",
    problem: "Тревожность",
    text: "Советы Nora Plus помогли мне больше отдыхать, заботиться о себе и избавиться от лишних переживаний за малыша.",
  },
  {
    name: "Мария",
    badge: "7 месяц беременности",
    problem: "Бессонница",
    text: "Благодаря советам Nora Plus я стала лучше спать и спокойно жду появления малыша.",
  },
  {
    name: "Виктория",
    badge: "3 месяц беременности",
    problem: "Страхи",
    text: "Nora Plus помогла справиться с тревогами и поддержала советами, теперь я чувствую себя увереннее.",
  },
  {
    name: "Екатерина",
    badge: "6 месяц беременности",
    problem: "Питание",
    text: "Ассистент напомнил о важных витаминах и правильном режиме, теперь питаюсь грамотно и чувствую себя энергичной.",
  },
  {
    name: "Гульнора",
    badge: "2 месяц беременности",
    problem: "Нарушение сна",
    text: "Проконсультировавшись с Nora, я восстановила сон и теперь хорошо встречаю утро.",
  },
  {
    name: "Малика",
    badge: "8 месяц беременности",
    problem: "Раздражительность",
    text: "Во время беременности стала нервной, но советы от Nora помогли и настроение улучшилось.",
  },
  {
    name: "Лола",
    badge: "4 месяц беременности",
    problem: "Недостаток белка",
    text: "Советы по питанию очень полезные, теперь у меня больше энергии.",
  },
];

// стартовые темы
const PREMADE_THEMES = [
  {
    emoji: "🤢",
    titleRu: "Как справиться с токсикозом?",
    titleUz: "Toksikoz bilan qanday kurashish mumkin?",
    descRu: "Подскажу способы и витамины для уменьшения тошноты.",
    descUz:
      "Ko‘ngil aynishini kamaytirishga yordam beradigan usullar va vitaminlar.",
    questionRu: "Что делать при токсикозе?",
    questionUz: "Toksikoz bo‘lsa, nimalar qilish kerak?",
  },
  {
    emoji: "😴",
    titleRu: "Сон и бессонница",
    titleUz: "Uyqu va uyqusizlik",
    descRu: "Как уснуть быстрее и лучше высыпаться.",
    descUz: "Tezroq uxlab qolish va yaxshi uxlash bo‘yicha maslahatlar.",
    questionRu:
      "Срок беременности: 5 месяц, хочу обсудить сон и бессонницу.",
    questionUz:
      "Homiladorligim 5-oyda, uyqu va uyqusizlik haqida gaplashmoqchiman.",
  },
  {
    emoji: "🥗",
    titleRu: "Питание и витамины",
    titleUz: "Ovqatlanish va vitaminlar",
    descRu: "Что можно, что нельзя и какие витамины важны.",
    descUz:
      "Nimani yeyish mumkin, nimalardan saqlanish kerak va qaysi vitaminlar muhim.",
    questionRu:
      "Что можно есть при беременности и какие витамины важны?",
    questionUz:
      "Homiladorlikda nimalarni yeyish mumkin va qaysi vitaminlar muhim?",
  },
  {
    emoji: "🩺",
    titleRu: "Анализы и УЗИ",
    titleUz: "Tahlillar va UZI",
    descRu: "Когда и какие обследования проходить.",
    descUz: "Qachon va qaysi tekshiruvlardan o‘tish kerak.",
    questionRu: "Какие анализы и УЗИ обязательны на моём сроке?",
    questionUz: "Mening muddatimda qaysi tahlillar va UZI majburiy?",
  },
  {
    emoji: "🤯",
    titleRu: "Тревога и страхи",
    titleUz: "Xavotir va qo‘rquvlar",
    descRu: "Помогу успокоиться и разложить всё по полочкам.",
    descUz: "Xavotirlarni kamaytirish va vaziyatni tushuntirishga yordam beraman.",
    questionRu:
      "Я часто волнуюсь и боюсь за малыша, как справиться с тревогой?",
    questionUz:
      "Bolam uchun tez-tez xavotirlanaman, bu holatni qanday yengsam bo‘ladi?",
  },
];

// блок «Что умеет»
const WhyNoraBlockContent = ({ lang }: { lang: Lang }) => (
  <div
    style={{
      width: "100%",
      maxWidth,
      margin: "0 auto",
      boxSizing: "border-box" as const,
      padding: "4px 0 6px 0",
      fontFamily: "'Manrope', Arial, Helvetica, sans-serif",
    }}
  >
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: CARD_GAP,
        padding: `0 ${BLOCK_SIDE_PADDING}px`,
      }}
    >
      {BENEFITS.map(({ emoji, keyTitle, keyText }, idx) => (
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
            textAlign: "left",
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
            <div
              style={{
                fontWeight: 700,
                fontSize: 16,
                color: NORA_COLOR,
                marginBottom: 7,
              }}
            >
              {TEXTS[lang][keyTitle]}
            </div>
            <div
              style={{
                fontSize: 13,
                color: "#3a3a3a",
                lineHeight: "1.64",
              }}
            >
              {TEXTS[lang][keyText]}
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// пример диалога Норы (локализован)
const NoraExampleBlock = ({ lang }: { lang: Lang }) => (
  <div
    style={{
      width: "100%",
      maxWidth,
      margin: "0 auto",
      padding: "4px 16px 10px 16px",
      boxSizing: "border-box" as const,
      fontFamily: "'Manrope', Arial, Helvetica, sans-serif",
    }}
  >
    <div
      style={{
        fontWeight: 600,
        fontSize: 14,
        marginBottom: 10,
        color: "#1e2933",
      }}
    >
      {TEXTS[lang].exampleTitle}
    </div>
    <div
      style={{
        marginBottom: 10,
        textAlign: "right",
      }}
    >
      <div
        style={{
          display: "inline-block",
          background: GRADIENT,
          borderRadius: 16,
          padding: "11px 13px",
          fontSize: 14,
          lineHeight: 1.6,
          maxWidth: "90%",
        }}
      >
        {TEXTS[lang].exampleUser}
      </div>
      <div
        style={{
          fontSize: 11,
          color: "#9aa3ad",
          marginTop: 4,
        }}
      >
        {TEXTS[lang].exampleUserLabel}
      </div>
    </div>
    <div
      style={{
        textAlign: "left",
      }}
    >
      <div
        style={{
          display: "inline-block",
          background: "#f7fafd",
          borderRadius: 16,
          padding: "11px 13px",
          fontSize: 14,
          lineHeight: 1.7,
          maxWidth: "93%",
        }}
      >
        {TEXTS[lang].exampleNora}
      </div>
      <div
        style={{
          fontSize: 11,
          color: "#9aa3ad",
          marginTop: 4,
        }}
      >
        Nora
      </div>
    </div>
  </div>
);

// блок отзывов
const ReviewBlockContent = () => (
  <div
    style={{
      width: "100%",
      maxWidth,
      margin: "0 auto",
      boxSizing: "border-box" as const,
      padding: "4px 0 12px 0",
      fontFamily: "'Manrope', Arial, Helvetica, sans-serif",
    }}
  >
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: CARD_GAP,
        padding: `0 ${BLOCK_SIDE_PADDING}px`,
      }}
    >
      {REVIEWS.map(({ name, badge, problem, text }, idx) => (
        <div
          key={idx}
          style={{
            background: "#fff",
            borderRadius: 18,
            boxShadow: "0 2px 18px 0 rgba(150,180,220,0.07)",
            padding: "19px 15px 19px 15px",
            overflow: "hidden",
            textAlign: "left",
          }}
        >
          <div style={{ position: "relative", zIndex: 1 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 7,
              }}
            >
              <span
                style={{
                  fontWeight: 700,
                  fontSize: 15,
                  color: "#222",
                }}
              >
                {name}
              </span>
              <span
                style={{
                  fontWeight: 500,
                  fontSize: 13,
                  color: "#1681f5",
                  padding: "4px 9px",
                  borderRadius: 12,
                  background: "#f3f7fe",
                  whiteSpace: "nowrap",
                }}
              >
                {badge}
              </span>
            </div>
            <div
              style={{
                fontWeight: 500,
                fontSize: 13,
                color: "#acb5bd",
                marginBottom: 9,
              }}
            >
              {problem}
            </div>
            <div
              style={{
                fontSize: 13,
                color: "#3a3a3a",
                lineHeight: "1.64",
              }}
            >
              {text}
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// контакты
const ContactsBlock = ({ lang }: { lang: Lang }) => (
  <div
    style={{
      width: "100%",
      maxWidth,
      margin: "0 auto",
      padding: "6px 16px 12px 16px",
      boxSizing: "border-box" as const,
      fontFamily: "'Manrope', Arial, Helvetica, sans-serif",
      color: "#1e2933",
    }}
  >
    <div style={{ marginBottom: 12, fontSize: 14, lineHeight: 1.6 }}>
      <div style={{ marginBottom: 8 }}>
        <strong>{TEXTS[lang].contactsAddressLabel}</strong>{" "}
        {TEXTS[lang].contactsAddress}
      </div>
      <div style={{ marginBottom: 8 }}>
        <strong>{TEXTS[lang].contactsTgLabel}</strong>{" "}
        <a href="https://t.me/norasmart" target="_blank" rel="noreferrer">
          {TEXTS[lang].contactsTg}
        </a>
      </div>
    </div>

    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        marginBottom: 14,
      }}
    >
      <button
        style={{
          border: "none",
          background: "#ffffff",
          borderRadius: 16,
          padding: "11px 13px",
          textAlign: "left",
          fontSize: 14,
          boxShadow: "0 1px 8px rgba(150,175,205,0.18)",
          cursor: "pointer",
        }}
      >
        {TEXTS[lang].contactsPolicy}
      </button>
      <button
        style={{
          border: "none",
          background: "#ffffff",
          borderRadius: 16,
          padding: "11px 13px",
          textAlign: "left",
          fontSize: 14,
          boxShadow: "0 1px 8px rgba(150,175,205,0.18)",
          cursor: "pointer",
        }}
      >
        {TEXTS[lang].contactsPartner}
      </button>
      <button
        style={{
          border: "none",
          background: "#ffffff",
          borderRadius: 16,
          padding: "11px 13px",
          textAlign: "left",
          fontSize: 14,
          boxShadow: "0 1px 8px rgba(150,175,205,0.18)",
          cursor: "pointer",
        }}
      >
        {TEXTS[lang].contactsSupport}
      </button>
    </div>

    <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
      {TEXTS[lang].contactsWhere}
    </div>
    <div
      style={{
        borderRadius: 18,
        overflow: "hidden",
        boxShadow: "0 2px 18px rgba(150,175,205,0.30)",
      }}
    >
      <iframe
        src="https://yandex.ru/map-widget/v1/-/CCU3FJTQxD"
        width="100%"
        height="220"
        frameBorder="0"
        style={{ border: 0 }}
        allowFullScreen
      ></iframe>
    </div>
  </div>
);

const THREAD_KEY = "nora_thread_id";

function splitBotTextTwoBlocks(text: string) {
  if (!text) return [];
  let cleaned = text.replace(/[*_]/g, "");
  const match = cleaned.match(/^([^.!?]+[.!?])\s*(.*)$/s);
  if (match) {
    const first = match[1].trim();
    const rest = match[2].trim();
    return [
      { text: first, bold: true },
      { text: rest, bold: false },
    ];
  } else {
    return [{ text: cleaned, bold: true }];
  }
}

const PremadeThemesPanel = ({
  disabled,
  onSend,
  lang,
}: {
  disabled: boolean;
  onSend: (q: string) => void;
  lang: Lang;
}) => (
  <div
    style={{
      width: "100%",
      maxWidth: maxWidth,
      margin: "18px auto 8px auto",
      padding: "0 15px",
      boxSizing: "border-box" as const,
      display: "flex",
      justifyContent: "center",
    }}
  >
    <div
      style={{
        width: "100%",
        maxWidth: maxWidth,
        boxSizing: "border-box" as const,
        display: "flex",
        flexDirection: "column",
        gap: 15,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 11,
        }}
      >
        {PREMADE_THEMES.map(
          (
            {
              emoji,
              titleRu,
              titleUz,
              descRu,
              descUz,
              questionRu,
              questionUz,
            },
            idx
          ) => {
            const title = lang === "ru" ? titleRu : titleUz;
            const desc = lang === "ru" ? descRu : descUz;
            const question = lang === "ru" ? questionRu : questionUz;
            return (
              <button
                key={idx}
                style={{
                  background: "#fff",
                  borderRadius: 19,
                  border: "1px solid #e1e9f5",
                  boxShadow: "0 1px 10px rgba(155,155,175,0.06)",
                  padding: "16px 16px",
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  cursor: disabled ? "not-allowed" : "pointer",
                  opacity: disabled ? 0.55 : 1,
                  transition: "opacity 0.13s, transform 0.1s",
                }}
                disabled={disabled}
                onClick={() => onSend(question)}
                onMouseDown={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.transform =
                    "scale(0.97)";
                }}
                onMouseUp={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.transform =
                    "scale(1)";
                }}
              >
                <span style={{ fontSize: 29, marginRight: 2, flexShrink: 0 }}>
                  {emoji}
                </span>
                <div style={{ textAlign: "left", flex: 1 }}>
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: 15,
                      color: NORA_COLOR,
                      marginBottom: 2,
                    }}
                  >
                    {title}
                  </div>
                  <div
                    style={{
                      fontWeight: 400,
                      fontSize: 13,
                      color: "#7c8792",
                    }}
                  >
                    {desc}
                  </div>
                </div>
              </button>
            );
          }
        )}
      </div>
    </div>
  </div>
);

type MenuSection = "how" | "what" | "reviews" | "contacts" | null;

const bottomNavButtonStyle: React.CSSProperties = {
  flex: 1,
  border: "none",
  background: "transparent",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: 0,
  cursor: "pointer",
};

// увеличены ещё на 5px
const bottomNavIconWrapStyle: React.CSSProperties = {
  width: 61,
  height: 61,
  borderRadius: 30.5,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const bottomNavLabelStyle: React.CSSProperties = {
  fontSize: 10,
  color: "#5a6573",
  marginTop: 4,
  textAlign: "center",
};

const IconHow = (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9" stroke={ICON_DARK} strokeWidth="1.6" />
    <path
      d="M11 10.5C11 9.7 11.5 9.2 12.3 9.2C13.1 9.2 13.6 9.7 13.6 10.4C13.6 11.1 13.2 11.5 12.8 11.8C12.3 12.2 12.1 12.5 12.1 13"
      stroke={ICON_DARK}
      strokeWidth="1.6"
      strokeLinecap="round"
    />
    <circle cx="12" cy="15.3" r="0.9" fill={ICON_DARK} />
  </svg>
);

const IconReviews = (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
    <path
      d="M5 6.5C5 5.7 5.7 5 6.5 5H17.5C18.3 5 19 5.7 19 6.5V13.5C19 14.3 18.3 15 17.5 15H9L6 18V15H6.5C5.7 15 5 14.3 5 13.5V6.5Z"
      stroke={ICON_DARK}
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconHistory = (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="8" stroke={ICON_DARK} strokeWidth="1.6" />
    <path
      d="M12 8.2V12L14.7 13.3"
      stroke={ICON_DARK}
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconContacts = IconContact;

const BottomNavBar = ({
  onOpenHow,
  onOpenReviews,
  onOpenContacts,
  onStartChat,
  lang,
}: {
  onOpenHow: () => void;
  onOpenReviews: () => void;
  onOpenContacts: () => void;
  onStartChat: () => void;
  lang: Lang;
}) => (
  <div
    style={{
      position: "fixed",
      left: 0,
      bottom: 0,
      width: "100%",
      background: "#ffffff",
      boxShadow: "0 -4px 20px rgba(0,0,0,0.06)",
      zIndex: 25,
      borderTopLeftRadius: 22,
      borderTopRightRadius: 22,
    }}
  >
    <div
      style={{
        maxWidth,
        margin: "0 auto",
        padding: "8px 14px 10px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxSizing: "border-box",
      }}
    >
      <button style={bottomNavButtonStyle} onClick={onOpenHow}>
        <div style={bottomNavIconWrapStyle}>{IconHow}</div>
        <span style={bottomNavLabelStyle}>{TEXTS[lang].bottomNavHow}</span>
      </button>

      <button style={bottomNavButtonStyle} onClick={onOpenReviews}>
        <div style={bottomNavIconWrapStyle}>{IconReviews}</div>
        <span style={bottomNavLabelStyle}>
          {TEXTS[lang].bottomNavReviews}
        </span>
      </button>

      <button
        style={{
          ...bottomNavButtonStyle,
          transform: "translateY(-4px)",
        }}
        onClick={onStartChat}
      >
        <div
          style={{
            width: 66,
            height: 66,
            borderRadius: 33,
            background: BABY_GRADIENT,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 6px 26px rgba(200,128,140,0.35)",
          }}
        >
          {ICONS.arrowRight}
        </div>
        <span style={{ ...bottomNavLabelStyle, marginTop: 6 }}>
          {TEXTS[lang].bottomNavStart}
        </span>
      </button>

      <button
        style={bottomNavButtonStyle}
        onClick={() => {
          alert(TEXTS[lang].historySoon);
        }}
      >
        <div style={bottomNavIconWrapStyle}>{IconHistory}</div>
        <span style={bottomNavLabelStyle}>
          {TEXTS[lang].bottomNavHistory}
        </span>
      </button>

      <button style={bottomNavButtonStyle} onClick={onOpenContacts}>
        <div style={bottomNavIconWrapStyle}>{IconContacts}</div>
        <span style={bottomNavLabelStyle}>
          {TEXTS[lang].bottomNavContacts}
        </span>
      </button>
    </div>
  </div>
);

const Chat = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [preloading, setPreloading] = useState(true);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<
    { text: string; sender: string }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [threadId, setThreadId] = useState<string | null>(null);
  const [botProgress, setBotProgress] = useState("");
  const [isMobile, setIsMobile] = useState(true);
  const [focused, setFocused] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [lang, setLang] = useState<Lang>("ru");

  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<MenuSection>(null);

  useEffect(() => {
    function checkScreen() {
      if (typeof window !== "undefined") {
        setIsMobile(window.innerWidth <= 640);
      }
    }
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  useEffect(() => {
    const saved = window.localStorage.getItem(THREAD_KEY);
    if (saved) setThreadId(saved);
  }, []);

  useEffect(() => {
    const savedLang = window.localStorage.getItem(
      "nora_lang"
    ) as Lang | null;
    if (savedLang === "ru" || savedLang === "uz") {
      setLang(savedLang);
    }
  }, []);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setPreloading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory, botProgress]);

  const openSection = (section: MenuSection) => {
    setActiveSection(section);
    setMenuOpen(true);
  };

  const changeLang = (next: Lang) => {
    setLang(next);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("nora_lang", next);
      window.location.reload();
    }
  };

  const sendMessageToGPT = async (text: string) => {
    setLoading(true);
    const newHistory = [...chatHistory, { text, sender: "user" }];
    setChatHistory(newHistory);
    setBotProgress("");
    try {
      const res = await fetch("/api/gpt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newHistory, thread_id: threadId }),
      });
      const data = await res.json();
      if (data.thread_id) {
        setThreadId(data.thread_id);
        window.localStorage.setItem(THREAD_KEY, data.thread_id);
      }
      let botReply = data.reply;
      if (res.status !== 200 || !botReply) {
        botReply = TEXTS[lang].serverError(
          typeof data.error === "string" ? data.error : undefined
        );
      }
      let i = 0;
      setBotProgress("");
      const interval = setInterval(() => {
        setBotProgress(botReply.slice(0, i));
        i++;
        if (i > botReply.length) {
          clearInterval(interval);
          setChatHistory((prev) => [...prev, { text: botReply, sender: "bot" }]);
          setBotProgress("");
          setLoading(false);
        }
      }, 18);
    } catch {
      setChatHistory((prev) => [
        ...prev,
        { text: TEXTS[lang].genericError, sender: "bot" },
      ]);
      setLoading(false);
      setBotProgress("");
    }
  };

  const handleSendMessage = () => {
    if (message.trim() && !loading && !botProgress) {
      sendMessageToGPT(message.trim());
      setMessage("");
    }
  };

  const startListening = () => {
    if (typeof window === "undefined") return;
    const SpeechRecognition =
      (window as any).webkitSpeechRecognition ||
      (window as any).SpeechRecognition;
    if (!SpeechRecognition) {
      alert(TEXTS[lang].speakNotSupported);
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = lang === "ru" ? "ru-RU" : "uz-UZ";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
    };
    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript;
      setMessage(text);
    };
    recognition.onerror = () => {
      setIsListening(false);
    };
    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);

    const formData = new FormData();
    formData.append("file", selected);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      await res.json();
      setChatHistory((prev) => [
        ...prev,
        {
          text: TEXTS[lang].uploadFileUser(selected.name),
          sender: "user",
        },
      ]);
    } catch {
      setChatHistory((prev) => [
        ...prev,
        { text: TEXTS[lang].uploadFileError, sender: "bot" },
      ]);
    } finally {
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const userMessageStyle: React.CSSProperties = {
    background: GRADIENT,
    padding: "13px 14px",
    borderRadius: 16,
    fontSize: 16,
    display: "inline-block",
    maxWidth: "95vw",
    wordBreak: "break-word",
    overflowWrap: "anywhere",
    marginBottom: 18,
    marginTop: 2,
    boxSizing: "border-box",
    lineHeight: "1.77",
    minWidth: 60,
    textAlign: "right",
    whiteSpace: "pre-line",
  };

  const MicPulseStyle = () => (
    <style jsx global>{`
      @keyframes micPulseNora {
        0% {
          transform: scale(1);
          box-shadow: 0 0 0 0 rgba(255, 152, 0, 0.45);
        }
        70% {
          transform: scale(1.06);
          box-shadow: 0 0 0 10px rgba(255, 152, 0, 0);
        }
        100% {
          transform: scale(1);
          box-shadow: 0 0 0 0 rgba(255, 152, 0, 0);
        }
      }
    `}</style>
  );

  const ModalOverlay = () =>
    !menuOpen ? null : (
      <div
        onClick={() => setMenuOpen(false)}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(10,20,35,0.45)",
          zIndex: 200,
        }}
      />
    );

  const menuButtonStyle: React.CSSProperties = {
    width: "100%",
    borderRadius: 16,
    border: "1px solid #e1e9f5",
    padding: "11px 14px",
    background: "#fff",
    textAlign: "left",
    fontSize: 15,
    fontWeight: 500,
    color: "#1f2933",
    cursor: "pointer",
  };

  const ModalContent = () => {
    if (!menuOpen) return null;

    let body: React.ReactNode = null;
    let bg = "#f8fdff";

    if (!activeSection) {
      bg = "#f8fdff";
      body = (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <button style={menuButtonStyle} onClick={() => openSection("how")}>
            {TEXTS[lang].menuHow}
          </button>
          <button style={menuButtonStyle} onClick={() => openSection("what")}>
            {TEXTS[lang].menuWhat}
          </button>
          <button
            style={menuButtonStyle}
            onClick={() => openSection("reviews")}
          >
            {TEXTS[lang].menuReviews}
          </button>
          <button
            style={menuButtonStyle}
            onClick={() => openSection("contacts")}
          >
            {TEXTS[lang].menuContacts}
          </button>
        </div>
      );
    } else if (activeSection === "how") {
      bg = GRADIENT;
      body = (
        <div>
          <div
            style={{
              padding: "0 16px 10px 16px",
              fontSize: 14,
              lineHeight: 1.7,
              color: "#263540",
            }}
          >
            {TEXTS[lang].howText}
          </div>
          <NoraExampleBlock lang={lang} />
        </div>
      );
    } else if (activeSection === "what") {
      bg = GRADIENT;
      body = (
        <div>
          <div
            style={{
              padding: "0 16px 8px 16px",
              fontSize: 14,
              color: "#263540",
              lineHeight: 1.6,
            }}
          >
            {TEXTS[lang].whatText}
          </div>
          <WhyNoraBlockContent lang={lang} />
        </div>
      );
    } else if (activeSection === "reviews") {
      bg = GRADIENT;
      body = <ReviewBlockContent />;
    } else if (activeSection === "contacts") {
      bg = GRADIENT;
      body = <ContactsBlock lang={lang} />;
    }

    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 210,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth,
            margin: "0 auto",
            padding: "0 18px",
            boxSizing: "border-box",
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              background: bg,
              borderRadius: 22,
              padding: 18,
              maxHeight: "82vh",
              overflowY: "auto",
              boxShadow: "0 10px 40px rgba(0,0,0,0.18)",
              pointerEvents: "auto",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  fontWeight: 700,
                  fontSize: 18,
                  color: "#1e2933",
                }}
              >
                {activeSection === "how"
                  ? TEXTS[lang].menuHow
                  : activeSection === "what"
                  ? TEXTS[lang].menuWhatTitle
                  : activeSection === "reviews"
                  ? TEXTS[lang].menuReviewsTitle
                  : activeSection === "contacts"
                  ? TEXTS[lang].menuContactsTitle
                  : TEXTS[lang].menuMainTitle}
              </div>
              <button
                onClick={() => setMenuOpen(false)}
                style={{
                  border: "none",
                  background: "transparent",
                  fontSize: 20,
                  cursor: "pointer",
                  padding: 4,
                  lineHeight: 1,
                }}
              >
                ×
              </button>
            </div>
            {body}
          </div>
        </div>
      </div>
    );
  };

  const HeaderBar = () => (
    <div
      style={{
        width: `calc(100% - ${PANEL_SIDE_PADDING * 2}px)`,
        maxWidth,
        minHeight: panelHeight,
        background: GRADIENT,
        color: NORA_COLOR,
        margin: "20px auto 0 auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderRadius: borderRadius,
        paddingLeft: PANEL_SIDE_PADDING,
        paddingRight: PANEL_SIDE_PADDING,
        paddingTop: 5,
        paddingBottom: 5,
        boxSizing: "border-box" as const,
        zIndex: 1,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          flex: 1,
          paddingLeft: 5,
        }}
      >
        <button
          onClick={() => {
            setShowWelcome(true);
            setChatHistory([]);
            setBotProgress("");
          }}
          style={{
            background: "none",
            border: "none",
            padding: 0,
            margin: 0,
            cursor: "pointer",
            fontWeight: 800,
            fontSize: "19px",
            lineHeight: 1.06,
            whiteSpace: "nowrap",
            marginBottom: 7,
            color: NORA_COLOR,
          }}
        >
          {TEXTS[lang].appName}
        </button>
        <span
          style={{
            fontWeight: 400,
            fontSize: "13px",
            color: "#565656",
            lineHeight: 1.04,
            whiteSpace: "nowrap",
          }}
        >
          {TEXTS[lang].subtitle}
        </span>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          marginLeft: 12,
        }}
      >
        {/* кнопка смены языка (другая локаль) */}
        <button
          style={{
            background: "#ffffff",
            border: "1px solid #d2d8e2",
            cursor: "pointer",
            borderRadius: 18,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 13,
            fontWeight: 600,
            color: "#1e2933",
            padding: "6px 10px",
            gap: 6,
            minWidth: 110,
          }}
          onClick={() => changeLang(lang === "ru" ? "uz" : "ru")}
        >
          <span>{IconLang}</span>
          <span>
            {lang === "ru"
              ? TEXTS[lang].langButtonOther
              : TEXTS[lang].langButtonOther}
          </span>
        </button>

        {/* просто иконка меню */}
        <button
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            width: 42,
            height: 42,
            borderRadius: 21,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => setMenuOpen(true)}
        >
          {IconMenu}
        </button>
      </div>
    </div>
  );

  if (!isMobile) {
    return (
      <div
        style={{
          width: "100vw",
          height: "100vh",
          background: "#f8fdff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "fixed",
          left: 0,
          top: 0,
          zIndex: 10000,
        }}
      >
        <div
          style={{
            fontWeight: 700,
            fontSize: "21px",
            textAlign: "center",
            color: NORA_COLOR,
            background: "#fff",
            borderRadius: 24,
            padding: "35px 28px",
            boxShadow: "0 6px 36px 0 rgba(155, 175, 205, 0.12)",
            whiteSpace: "pre-line",
          }}
        >
          {TEXTS[lang].mobileOnly}
        </div>
      </div>
    );
  }

  if (preloading) {
    return (
      <div
        style={{
          background: "#f8fdff",
          width: "100vw",
          height: "100vh",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 10000,
          margin: 0,
          padding: 0,
        }}
      >
        <span
          style={{
            fontWeight: 800,
            fontSize: "38px",
            color: NORA_COLOR,
            letterSpacing: "0.07em",
            animation: "noraPulse 1.4s infinite linear",
          }}
        >
          {TEXTS[lang].appName}
        </span>
        <style>{`
          @keyframes noraPulse {
            0% { opacity: 0.30; }
            50% { opacity: 1; }
            100% { opacity: 0.30; }
          }
        `}</style>
      </div>
    );
  }

  // WELCOME
  if (showWelcome) {
    return (
      <div
        style={{
          fontFamily: "'Manrope', Arial, Helvetica, sans-serif",
          background: "#f8fdff",
          width: "100vw",
          minHeight: "100vh",
          paddingBottom: 90,
        }}
      >
        <MicPulseStyle />
        <HeaderBar />

        <ModalOverlay />
        <ModalContent />

        {/* +15px к отступу перед видео */}
        <div style={{ height: 51 }} />

        <div
          style={{
            width: "100%",
            maxWidth: maxWidth,
            margin: "0 auto",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <video
            src="/nora.mp4"
            style={{
              width: "100%",
              maxWidth: videoMaxWidth,
              display: "block",
              borderRadius: 24,
            }}
            autoPlay
            playsInline
            muted
            loop
            preload="auto"
          />
        </div>

        <div style={{ height: 36 }} />

        <div
          style={{
            width: `calc(100% - ${BLOCK_SIDE_PADDING * 2}px)`,
            maxWidth,
            textAlign: "center",
            margin: "0 auto",
          }}
        >
          <div
            style={{
              fontWeight: 800,
              fontSize: "22px",
              color: NORA_COLOR,
              marginBottom: 12,
              padding: "0 18px",
              lineHeight: 1.35,
            }}
          >
            {TEXTS[lang].heroTitle}
          </div>
          <div
            style={{
              fontWeight: 400,
              fontSize: "15px",
              margin: "0 auto",
              maxWidth: 400,
              padding: "0 18px",
              lineHeight: 1.75,
              color: NORA_COLOR,
              display: "inline-block",
            }}
          >
            {TEXTS[lang].heroBody}
          </div>

          <div style={{ height: 32 }} />

          <div
            style={{
              fontSize: 13,
              color: "#7c8792",
              marginBottom: 12,
            }}
          >
            {TEXTS[lang].welcomeStat}
          </div>

          <div
            style={{
              width: "100%",
              maxWidth,
              margin: "0 auto",
              paddingBottom: 16,
            }}
          >
            <WhyNoraBlockContent lang={lang} />
          </div>
        </div>

        {/* блок скачивания приложений — увеличенные кнопки */}
        <div
          style={{
            width: "100%",
            maxWidth,
            margin: "10px auto 90px auto",
            padding: "0 18px",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            <button
              onClick={() => {
                window.location.href =
                  "https://webtoapp.design/apps/download_android_apk/IjE2NDExMSI.MJqUM633YvZ5PgIowcEHc8S6EJE";
              }}
              style={{
                border: "none",
                borderRadius: 20,
                padding: "13px 16px",
                background: "#111827",
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 15,
                fontWeight: 600,
                cursor: "pointer",
                gap: 10,
              }}
            >
              {IconAndroidMini}
              <span>{TEXTS[lang].androidBtn}</span>
            </button>

            <button
              onClick={() => {
                alert(TEXTS[lang].iosSoon);
              }}
              style={{
                border: "1px solid #d1d5db",
                borderRadius: 20,
                padding: "13px 16px",
                background: "#ffffff",
                color: "#111827",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 15,
                fontWeight: 600,
                cursor: "pointer",
                gap: 10,
              }}
            >
              {IconAppleMini}
              <span>{TEXTS[lang].iosBtn}</span>
            </button>
          </div>
        </div>

        <BottomNavBar
          lang={lang}
          onOpenHow={() => {
            openSection("how");
          }}
          onOpenReviews={() => {
            openSection("reviews");
          }}
          onOpenContacts={() => {
            openSection("contacts");
          }}
          onStartChat={() => {
            setShowWelcome(false);
            setTimeout(() => {
              const input = document.querySelector<HTMLInputElement>(
                'input[placeholder]'
              );
              if (input) input.focus();
            }, 200);
          }}
        />
      </div>
    );
  }

  // ЧАТ
  return (
    <div
      style={{
        background: "#f8fdff",
        width: "100vw",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <MicPulseStyle />
      <HeaderBar />

      <ModalOverlay />
      <ModalContent />

      <PremadeThemesPanel
        lang={lang}
        disabled={loading || !!botProgress}
        onSend={(q) => {
          if (!loading && !botProgress) {
            sendMessageToGPT(q);
          }
        }}
      />

      {chatHistory.length === 0 && !botProgress && (
        <div
          style={{
            fontSize: 14,
            color: "#7c8792",
            textAlign: "center",
            margin: "8px 24px 10px 24px",
            lineHeight: 1.6,
          }}
        >
          {TEXTS[lang].bottomHint}
        </div>
      )}

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: maxWidth,
            margin: "0 auto",
            padding: "8px 0 110px 0",
          }}
        >
          {chatHistory.map((msg, idx) => (
            <div
              key={idx}
              style={{
                textAlign: msg.sender === "user" ? "right" : "left",
                margin: "8px 20px",
              }}
            >
              {msg.sender === "user" ? (
                <>
                  <span style={userMessageStyle}>{msg.text}</span>
                  <div
                    style={{
                      fontSize: 11,
                      color: "#9aa3ad",
                      marginTop: -4,
                    }}
                  >
                    {TEXTS[lang].userLabel}
                  </div>
                </>
              ) : (
                <>
                  {splitBotTextTwoBlocks(msg.text).map((part, sIdx) =>
                    part.text ? (
                      <div
                        key={sIdx}
                        style={{
                          background: "#f7fafd",
                          borderRadius: 12,
                          padding: "10px 15px",
                          marginBottom: sIdx === 0 ? 18 : 30,
                          color: NORA_COLOR,
                          fontSize: 16,
                          lineHeight: 1.7,
                          fontWeight: part.bold ? "bold" : "normal",
                          wordBreak: "break-word",
                          overflowWrap: "anywhere",
                        }}
                      >
                        {part.text}
                      </div>
                    ) : null
                  )}
                  <div
                    style={{
                      fontSize: 11,
                      color: "#9aa3ad",
                      marginTop: -6,
                    }}
                  >
                    {TEXTS[lang].noraLabel}
                  </div>
                </>
              )}
            </div>
          ))}

          {botProgress &&
            splitBotTextTwoBlocks(botProgress).map((part, sIdx) =>
              part.text ? (
                <div
                  key={sIdx}
                  style={{
                    background: "#f7fafd",
                    borderRadius: 12,
                    padding: "10px 15px",
                    margin: "0 20px 10px 20px",
                    color: NORA_COLOR,
                    fontSize: 16,
                    lineHeight: 1.7,
                    fontWeight: part.bold ? "bold" : "normal",
                    wordBreak: "break-word",
                    overflowWrap: "anywhere",
                  }}
                >
                  {part.text}
                </div>
              ) : null
            )}

          {botProgress && (
            <div
              style={{
                fontSize: 11,
                color: "#9aa3ad",
                margin: "0 20px 6px 20px",
              }}
            >
              {TEXTS[lang].noraTyping}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* панель ввода */}
      <div
        style={{
          width: "calc(100% - 40px)",
          margin: "0 20px",
          boxSizing: "border-box",
          maxWidth: maxWidth,
          height: INPUT_BAR_HEIGHT,
          position: "fixed",
          left: 0,
          bottom: 30,
          background: "transparent",
          borderRadius: borderRadius,
          zIndex: 20,
          boxShadow: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: "100%",
            background: "#fff",
            borderRadius: borderRadius,
            borderWidth: focused ? 2 : 1,
            borderStyle: "solid",
            borderColor: focused ? "transparent" : "#e5e8ed",
            borderImage: focused ? GRADIENT + " 1" : undefined,
            display: "flex",
            alignItems: "center",
            paddingLeft: 14,
            paddingRight: 6,
            boxSizing: "border-box",
            boxShadow: "0 2px 14px 0 rgba(155,175,205,0.10)",
          }}
        >
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
          />

          <input
            type="text"
            value={message}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={TEXTS[lang].inputPlaceholder}
            style={{
              flex: 1,
              height: 52,
              fontSize: "17px",
              border: "none",
              outline: "none",
              background: "transparent",
              color: NORA_COLOR,
              boxSizing: "border-box",
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSendMessage();
            }}
            disabled={loading || !!botProgress}
          />

          {/* файл */}
          <button
            onClick={openFileDialog}
            disabled={loading || !!botProgress}
            style={{
              width: ICON_BUTTON_SIZE + 5,
              height: ICON_BUTTON_SIZE + 5,
              borderRadius: (ICON_BUTTON_SIZE + 5) / 2,
              border: "none",
              background: "transparent",
              cursor: loading || !!botProgress ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginRight: 4,
            }}
            title="File"
          >
            {IconPaperclip}
          </button>

          {/* микрофон */}
          <button
            onClick={startListening}
            disabled={loading || !!botProgress}
            style={{
              width: ICON_BUTTON_SIZE + 5,
              height: ICON_BUTTON_SIZE + 5,
              borderRadius: (ICON_BUTTON_SIZE + 5) / 2,
              border: "none",
              background: "transparent",
              cursor: loading || !!botProgress ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginRight: 4,
              animation: isListening
                ? "micPulseNora 1.1s infinite ease-out"
                : "none",
            }}
            title={
              isListening ? TEXTS[lang].speakRecording : TEXTS[lang].speakTitle
            }
          >
            {IconMic}
          </button>

          {/* отправка */}
          <button
            style={{
              width: ICON_BUTTON_SIZE + 5,
              height: ICON_BUTTON_SIZE + 5,
              background: BABY_GRADIENT,
              color: "#fff",
              border: "none",
              borderRadius: (ICON_BUTTON_SIZE + 5) / 2,
              fontWeight: 700,
              fontSize: "17px",
              cursor: loading || !!botProgress ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 14px 0 rgba(155,175,205,0.12)",
              marginLeft: 2,
            }}
            onClick={handleSendMessage}
            disabled={loading || !!botProgress}
          >
            <span
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {ICONS.arrowRight}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
