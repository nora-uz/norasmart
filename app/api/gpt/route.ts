import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { reply: "No OpenAI key", error: true },
        { status: 500 }
      );
    }

    const { messages } = await req.json();

    if (!messages || !messages.length) {
      return NextResponse.json(
        { reply: "Нет сообщений", error: true },
        { status: 400 }
      );
    }

    // Формируем сообщения для OpenAI
    const openAiMessages = [
      { role: "system", content: "Ты — полезный ассистент для будущих мам, отвечай дружелюбно и информативно, только на русском языке." },
      ...messages.map((m: any) => ({
        role: m.sender === "bot" ? "assistant" : "user",
        content: m.text,
      })),
    ];

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o", // или "gpt-3.5-turbo"
        messages: openAiMessages,
      }),
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "Ассистент не ответил.";

    return NextResponse.json({ reply });
  } catch (err) {
    console.error("ERROR IN GPT ROUTE", err);
    return NextResponse.json(
      { reply: "Ошибка: не удалось получить ответ.", error: String(err) },
      { status: 500 }
    );
  }
}
