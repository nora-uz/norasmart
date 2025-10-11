import { NextRequest } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const assistant_id = process.env.OPENAI_ASSISTANT_ID; // Ваш assistant_id из платформы OpenAI

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    // 1. Создаём thread
    const thread = await openai.beta.threads.create();

    // 2. Добавляем последнее сообщение пользователя
    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: messages.at(-1).text,
    });

    // 3. Запускаем ассистента
    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id,
    });

    // 4. Ждём завершения run
    let status = run.status;
    let run_id = run.id;
    while (status !== "completed" && status !== "failed" && status !== "cancelled") {
      await new Promise((res) => setTimeout(res, 1500));
      const updatedRun = await openai.beta.threads.runs.retrieve(thread.id, run_id);
      status = updatedRun.status;
    }

    // 5. Получаем последнее сообщение ассистента, извлекаем все текстовые блоки из content
    const threadMessages = await openai.beta.threads.messages.list(thread.id);
    const assistantMessage = threadMessages.data.find((msg: any) => msg.role === "assistant");
    let assistantMsg = "";
    if (assistantMessage) {
      // Собираем весь текст из текстовых блоков
      assistantMsg = assistantMessage.content
        .filter((block: any) => block.type === "text" && block.text?.value)
        .map((block: any) => block.text.value)
        .join("\n");
    }

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
