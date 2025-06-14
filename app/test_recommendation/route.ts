import { NextRequest, NextResponse } from "next/server";

import { KEY } from "@/anthropic_api_key";

import Anthropic from "@anthropic-ai/sdk";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || KEY || "";
  const anthropic = new Anthropic({
    apiKey: ANTHROPIC_API_KEY,
  });

  try {
    const msg = await anthropic.messages.create({
      model: "claude-opus-4-20250514",
      max_tokens: 1000,
      temperature: 1,
      system: "Respond only with short poems.",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Why is the ocean salty?",
            },
          ],
        },
      ],
    });
    console.log(msg);
    return NextResponse.json({ msg });
  } catch (e) {
    console.log(e);
  }

  return NextResponse.json({ error: true });
}
