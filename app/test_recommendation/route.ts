import { NextRequest, NextResponse } from "next/server";

import { KEY } from "@/anthropic_api_key";

import Anthropic from "@anthropic-ai/sdk";
import { getFile } from "@/utils/getFile";

// Given a file, and a line number, recommend a unit test that covers the specified line.
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const path = searchParams.get("path");
  const line = searchParams.get("line");
  const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || KEY || "";
  const anthropic = new Anthropic({
    apiKey: ANTHROPIC_API_KEY,
  });

  if (!path) {
    return new NextResponse("need path", { status: 400 });
  }

  const data = await getFile({ path, ref: "main" });

  const file = atob(data.content);

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
              text: file,
            },
          ],
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Can you write unit tests for this file?`,
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

  return NextResponse.json({ error: true }, { status: 500 });
}
