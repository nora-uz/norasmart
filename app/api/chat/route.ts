import { NextRequest } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const assistant_id = process.env.OPENAI_ASSISTANT_ID; // ваш ID ассистента

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    // Создаём thread, если его ещё нет
    const thread = await openai.beta.threads.create();

    // Добавляем сообщение пользователя
    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: messages.at(-1).text,
    });

    // Запускаем ассистента
    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id,
    });

    // Ожидаем завершения (или опрашиваем статусы, если хотите)
    let status = run.status;
    let run_id = run.id;
    while (status !== "completed" && status !== "failed" && status !== "cancelled") {
      // Можно явно ждать пару секунд между запросами
      await new Promise((res) => setTimeout(res, 1500));
      const updatedRun = await openai.beta.threads.runs.retrieve(thread.id, run_id);
      status = updatedRun.status;
    }

    // Получаем сообщения ассистента
    const threadMessages = await openai.beta.threads.messages.list(thread.id);
    const assistantMsg = threadMessages.data.find(
      (msg) => msg.role === "assistant"
    )?.content[0]?.text.value;

    return new Response(JSON.stringify({ reply: assistantMsg }), {
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
