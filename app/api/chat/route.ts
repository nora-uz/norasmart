// app/api/chat/route.ts
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // Ваша логика для OpenAI здесь...
    return new Response(JSON.stringify({ reply: "Demo генерация" }), {
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
