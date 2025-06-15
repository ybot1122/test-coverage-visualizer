import { NextRequest, NextResponse } from "next/server";

import Anthropic from "@anthropic-ai/sdk";
import { getFile } from "@/utils/getFile";

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const anthropic = new Anthropic({
  apiKey: ANTHROPIC_API_KEY,
});
// Given a file, and a line number, recommend a unit test that covers the specified line.
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const path = searchParams.get("path");
  const coverage = searchParams.get("coverage");
  const line = searchParams.get("line");

  if (!path || !coverage || !line) {
    return new NextResponse("need path", { status: 400 });
  }

  const data = await getFile({ path, ref: "main" });

  const file = atob(data.content);

  try {
    const stream = await anthropic.messages.create({
      model: "claude-opus-4-20250514",
      max_tokens: 1024,
      temperature: 1,
      stream: true,
      system:
        "Line numbers are 1-indexed, not 0-indexed. Just explain the coverage, not the code itself.",
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
              text: coverage,
            },
          ],
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Given the source code and test coverage report, what can you tell me about line ${line}?`,
            },
          ],
        },
      ],
    });

    // Pipe the Claude stream to a ReadableStream for Next.js
    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        for await (const message of stream) {
          if (
            message.type === "content_block_delta" &&
            message.delta &&
            typeof (message.delta as any).text === "string"
          ) {
            controller.enqueue(encoder.encode((message.delta as any).text));
          }
        }
        controller.close();
      },
    });

    return new NextResponse(readable, {
      headers: { "Content-Type": "text/plain" },
    });
  } catch (e) {
    console.log(e);
  }

  return NextResponse.json({ error: true }, { status: 500 });
}

export const runtime = "edge";
