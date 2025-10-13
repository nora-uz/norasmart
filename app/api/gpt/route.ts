import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // Получаем сообщение (messages не обязательно нужны — Assistant API сам хранит историю)
    const { messages, thread_id } = await req.json();
    const currentMessage = messages && messages.length
      ? messages[messages.length - 1].text
      : null;
    if (!currentMessage) {
      return NextResponse.json({ reply: "Нет сообщения пользователя", error: true }, { status: 400 });
    }

    const assistant_id = "asst_O0ENHkHsICvLEjBXleQpyqDx";
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error("No OPENAI_API_KEY defined!");
      return NextResponse.json({ reply: "No OpenAI key", error: true }, { status: 500 });
    }

    const commonHeaders = {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "OpenAI-Beta": "assistants=v2",
    };

    // Если thread_id нет — создаём новый thread
    let usedThreadId = thread_id;
    if (!usedThreadId) {
      const threadRes = await fetch("https://api.openai.com/v1/threads", {
        method: "POST",
        headers: commonHeaders,
        body: JSON.stringify({}),
      });
      const threadData = await threadRes.json();
      if (!threadData.id) {
        throw new Error("Could not create thread " + JSON.stringify(threadData));
      }
      usedThreadId = threadData.id;
    }

    // Отправляем сообщение пользователя в thread
    const messageRes = await fetch(
      `https://api.openai.com/v1/threads/${usedThreadId}/messages`,
      {
        method: "POST",
        headers: commonHeaders,
        body: JSON.stringify({ role: "user", content: currentMessage }),
      }
    );
    const messageStatus = await messageRes.json();

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
      await new Promise(res => setTimeout(res, 1500));
      const statusRes = await fetch(
        `https://api.openai.com/v1/threads/${usedThreadId}/runs/${runId}`,
        { method: "GET", headers: commonHeaders }
      );
      const status = await statusRes.json();
      if (status.status === "completed") {
        // Получаем все сообщения и берем последний ответ ассистента
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

    // Возвращаем ответ и текущий thread_id (он сохраняется на фронте)
    return NextResponse.json({ reply, thread_id: usedThreadId });
  } catch (err) {
    console.error("ERROR IN GPT ROUTE", err);
    return NextResponse.json({ reply: "Ошибка: не удалось получить ответ.", error: String(err) }, { status: 500 });
  }
}
