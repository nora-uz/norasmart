import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

// Создаём клиент Upstash Redis для хранения thread_id
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function POST(req: Request) {
  try {
    // Получаем данные от фронта
    // user_id нужен для уникального пользователя (можно временно использовать "testuser" если нет авторизации)
    const { messages, thread_id, user_id } = await req.json();
    const currentMessage =
      messages && messages.length ? messages[messages.length - 1].text : null;

    if (!currentMessage) {
      return NextResponse.json(
        { reply: "Нет сообщения пользователя", error: true },
        { status: 400 }
      );
    }

    const assistant_id = "asst_O0ENHkHsICvLEjBXleQpyqDx";
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error("No OPENAI_API_KEY defined!");
      return NextResponse.json(
        { reply: "No OpenAI key", error: true },
        { status: 500 }
      );
    }

    const commonHeaders = {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "OpenAI-Beta": "assistants=v2",
    };

    // --- ХРАНЕНИЕ thread_id в базе по user_id ---
    // Получаем thread_id из базы, если нет во входных данных
    let usedThreadId = thread_id;

    if (!usedThreadId && user_id) {
      usedThreadId = await redis.get<string>(`thread:${user_id}`);
    }

    // Если thread_id всё равно нет — создаём новый и сохраняем в Upstash
    if (!usedThreadId) {
      const threadRes = await fetch("https://api.openai.com/v1/threads", {
        method: "POST",
        headers: commonHeaders,
        body: JSON.stringify({}),
      });
      const threadData = await threadRes.json();
      if (!threadData.id) {
        throw new Error(
          "Could not create thread " + JSON.stringify(threadData)
        );
      }
      usedThreadId = threadData.id;
      // Сохраняем для текущего пользователя
      if (user_id) {
        await redis.set(`thread:${user_id}`, usedThreadId);
      }
    }

    // Отправляем сообщение пользователя в thread
    await fetch(
      `https://api.openai.com/v1/threads/${usedThreadId}/messages`,
      {
        method: "POST",
        headers: commonHeaders,
        body: JSON.stringify({ role: "user", content: currentMessage }),
      }
    );

    // Запускаем ассистента
    const runRes = await fetch(
      `https://api.openai.com/v1/threads/${usedThreadId}/runs`,
      {
        method: "POST",
        headers: commonHeaders,
        body: JSON.stringify({ assistant_id }),
      }
    );
    const runData = await runRes.json();
    const runId = runData.id;

    // Ждём завершения run
    let reply = "Ассистент не ответил.";
    for (let i = 0; i < 40; i++) {
      await new Promise((res) => setTimeout(res, 1500));
      const statusRes = await fetch(
        `https://api.openai.com/v1/threads/${usedThreadId}/runs/${runId}`,
        { method: "GET", headers: commonHeaders }
      );
      const status = await statusRes.json();
      if (status.status === "completed") {
        const messagesRes = await fetch(
          `https://api.openai.com/v1/threads/${usedThreadId}/messages`,
          { method: "GET", headers: commonHeaders }
        );
        const messagesData = await messagesRes.json();
        const lastBotMsg = messagesData.data
          .reverse()
          .find((m: any) => m.role === "assistant");
        reply = lastBotMsg?.content?.[0]?.text?.value || reply;
        break;
      }
      if (status.status === "failed") {
        reply = "Ошибка асинхронного выполнения.";
        break;
      }
    }

    // На всякий случай повторно сохраняем thread_id для юзера
    if (user_id) {
      await redis.set(`thread:${user_id}`, usedThreadId);
    }

    // Возвращаем ответ и thread_id
    return NextResponse.json({ reply, thread_id: usedThreadId });
  } catch (err) {
    console.error("ERROR IN GPT ROUTE", err);
    return NextResponse.json(
      { reply: "Ошибка: не удалось получить ответ.", error: String(err) },
      { status: 500 }
    );
  }
}
