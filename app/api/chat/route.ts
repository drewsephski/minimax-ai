import { streamText, convertToModelMessages } from "ai";
import { createOpenAI } from "@ai-sdk/openai";

// Configure OpenRouter via the OpenAI-compatible provider from the AI SDK
const openrouter = createOpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const uiMessages = body?.messages ?? [];
    const modelId = body?.model ?? process.env.OPENROUTER_MODEL ?? "openai/gpt-4o-mini";

    const result = await streamText({
      model: openrouter.chat(modelId),
      messages: convertToModelMessages(uiMessages),
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("/api/chat error:", error);
    return new Response("Failed to generate response.", { status: 500 });
  }
}


