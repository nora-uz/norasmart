import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message, thread_id } = await req.json();
    console.log("GPT API request (frontend):", { message, thread_id });

    const assistant_id = "asst_O0ENHkHsICvLEjBXleQpyqDx";
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      console.error("No OPENAI_API_KEY defined!");
      return NextResponse.json({ reply: "No OpenAI key", error: true }, { status: 500 });
    }

    // Все запросы требуют OpenAI-Beta header!
    const commonHeaders = {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "OpenAI-Beta": "assistants=v2",
    };

    // 1. Создаем/берем thread
    let usedThreadId = thread_id;
    if (!usedThreadId) {
      const threadRes = await fetch("https://api.openai.com/v1/threads", {
        method: "POST",
        headers: commonHeaders,
        body: JSON.stringify({}),
      });
      const threadData = await threadRes.json();
      console.log("THREAD CREATE STATUS:", threadRes.status, threadData);
      if (!threadData.id) {
        throw new Error("Could not create thread " + JSON.stringify(threadData));
      }
      usedThreadId = threadData.id;
    }

    // 2. Отправляем сообщение
    const messageRes = await fetch(`https://api.openai.com/v1/threads/${usedThreadId}/messages`, {
      method: "POST",
      headers: commonHeaders,
      body: JSON.stringify({
        role: "user",
        content: message,
      }),
    });
    const messageStatus = await messageRes.json();
    console.log("MESSAGE STATUS:", messageRes.status, messageStatus);

    // 3. Запускаем ран ассистента
    const runRes = await fetch(`https://api.openai.com/v1/threads/${usedThreadId}/runs`, {
      method: "POST",
      headers: commonHeaders,
      body: JSON.stringify({ assistant_id }),
    });
    const runData = await runRes.json();
    console.log("RUN STATUS:", runRes.status, runData);
    const runId = runData.id;

    // 4. Ждем run completion
    let reply = "Ассистент не ответил.";
    for (let i = 0; i < 40; i++) {
      await new Promise(res => setTimeout(res, 1500));
      const statusRes = await fetch(
        `https://api.openai.com/v1/threads/${usedThreadId}/runs/${runId}`,
        {
          method: "GET",
          headers: commonHeaders,
        }
      );
      const status = await statusRes.json();
      console.log(`Run status [${i}]:`, status.status, status);

      if (status.status === "completed") {
        const messagesRes = await fetch(
          `https://api.openai.com/v1/threads/${usedThreadId}/messages`,
          {
            method: "GET",
            headers: commonHeaders,
          }
        );
        const messages = await messagesRes.json();
        console.log("MESSAGES GET STATUS:", messagesRes.status, messages);

        const lastBotMsg = messages.data
          .reverse()
          .find((m: any) => m.role === "assistant");
        reply = lastBotMsg?.content?.[0]?.text?.value || reply;
        console.log("Final bot reply:", reply);
        break;
      }
      if (status.status === "failed") {
        reply = "Ошибка асинхронного выполнения.";
        console.log("Run failed", status);
        break;
      }
    }

    // 5. Возвращаем ответ и thread_id! — фронт отправляет его потом в запросе
    console.log("Returning:", { reply, thread_id: usedThreadId });
    return NextResponse.json({ reply, thread_id: usedThreadId });
  } catch (err) {
    console.error("ERROR IN GPT ROUTE", err);
    return NextResponse.json({ reply: "Ошибка: не удалось получить ответ.", error: String(err) }, { status: 500 });
  }
}
