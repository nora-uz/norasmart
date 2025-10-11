import { NextRequest } from "next/server";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    // Преобразование внутренних сообщений в формат OpenAI:
    const openAIMessages = messages.map((msg: any) => ({
      role: msg.role || "user",
      content: msg.text,
    }));
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo", // или "gpt-4"
      messages: openAIMessages,
    });
    const reply = completion.data.choices[0].message.content;
    return new Response(JSON.stringify({ reply }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
