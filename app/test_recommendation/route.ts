import { NextRequest, NextResponse } from "next/server";

import { KEY } from "@/anthropic_api_key";

import Anthropic from "@anthropic-ai/sdk";

// Given a file, and a line number, recommend a unit test that covers the specified line.
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const path = searchParams.get("path");
  const line = searchParams.get("line");
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
              text: `
              function getFirstPathSegment(path: string): string {
  // Remove leading/trailing slashes
  path = path.replace(/^\/+|\/+$/g, "");
  // If the path is empty after trimming, return an empty string
  if (path === "") return "";
  // Split by '/' and return the first segment (handles single filename too)
  const segments = path.split("/");
  return segments[0];
}             
              `,
            },
          ],
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Can you write unit tests for the function?`,
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
