import { NextRequest } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const assistant_id = process.env.OPENAI_ASSISTANT_ID; // Ваш assistant_id из платформы OpenAI

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    // Создание thread для сессии диалога
    const thread = await openai.beta.threads.create();

    // Добавляем последнее сообщение пользователя
    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: messages.at(-1).text,
    });

    // Запускаем ассистента
    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id,
    });

    // Дожидаемся завершения run
    let status = run.status;
    let run_id = run.id;
    while (
      status !== "completed" &&
      status !== "failed" &&
      status !== "cancelled"
    ) {
      await new Promise((res) => setTimeout(res, 1500));
      const updatedRun = await openai.beta.threads.runs.retrieve(thread.id, run_id);
      status = updatedRun.status;
    }

    // Получаю последнее сообщение ассистента, только текст!
    const threadMessages = await openai.beta.threads.messages.list(thread.id);

    const assistantMessage = threadMessages.data.find((msg: any) => msg.role === "assistant");
    let assistantMsg = "";
    if (assistantMessage) {
      const textBlock = assistantMessage.content.find((block: any) => block.type === "text");
      assistantMsg = textBlock ? textBlock.text.value : "";
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
