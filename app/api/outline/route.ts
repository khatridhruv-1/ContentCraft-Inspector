import { NextResponse } from "next/server";
import { groqRequest, extractJSON, cleanContent } from "@/lib/groq";

export async function POST(req: Request) {
  try {
    const { content } = await req.json();
    const plain = cleanContent(content, 3000);

    const raw = await groqRequest([
      {
        role: "system",
        content: `You are a content structure analyzer. Respond with ONLY valid JSON, no extra text, no markdown:
{"outline":[{"level":1,"text":"heading"}],"suggestions":["tip1"],"contentGaps":["gap1"]}`,
      },
      { role: "user", content: `Outline this: ${plain}` },
    ]);

    let result;
    try {
      result = JSON.parse(extractJSON(raw));
    } catch {
      result = { outline: [], suggestions: [], contentGaps: [] };
    }

    return NextResponse.json(result);
  } catch (e: any) {
    console.error("outline error:", e.message);
    return NextResponse.json({ error: e.message || "Error generating outline" }, { status: 500 });
  }
}
