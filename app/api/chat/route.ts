import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    // --- Реальный код запроса к OpenAI Assisant API
    // Здесь берём ключ и вызываем внешнее API, получаем ответ
    // Пример:
    // const openaiResponse = await fetch(
    //   "https://api.openai.com/v1/threads", { ... });
    // ... парсим результат ...
    // return new Response(JSON.stringify({ reply: openaiResponse }), {...});

    // Пока демо-заглушка:
    const lastUserMsg = messages?.at(-1)?.text || "Привет!";
    return new Response(JSON.stringify({ reply: `Эхо: ${lastUserMsg}` }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
