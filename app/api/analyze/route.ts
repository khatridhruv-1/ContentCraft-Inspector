import { NextResponse } from "next/server";
import { groqRequest, extractJSON, cleanContent } from "@/lib/groq";

export async function POST(req: Request) {
  try {
    const { content } = await req.json();
    const plain = cleanContent(content, 3000);

    const raw = await groqRequest([
      {
        role: "system",
        content: `You are a content analyzer. Respond with ONLY a valid JSON object — no extra text, no markdown, no trailing commas. Use this exact structure:
{"contentScore":75,"readability":70,"tone":"professional","keyInsights":["insight1","insight2"],"improvements":["tip1","tip2"]}`,
      },
      { role: "user", content: `Analyze: ${plain}` },
    ]);

    let result;
    try {
      result = JSON.parse(extractJSON(raw));
    } catch {
      // fallback: extract numbers/strings manually
      const scoreMatch = raw.match(/"contentScore"\s*:\s*(\d+)/);
      const readMatch  = raw.match(/"readability"\s*:\s*(\d+)/);
      const toneMatch  = raw.match(/"tone"\s*:\s*"([^"]+)"/);
      result = {
        contentScore: scoreMatch ? parseInt(scoreMatch[1]) : 70,
        readability:  readMatch  ? parseInt(readMatch[1])  : 70,
        tone:         toneMatch  ? toneMatch[1]            : 'neutral',
        keyInsights:  [],
        improvements: [],
      };
    }

    return NextResponse.json(result);
  } catch (e: any) {
    console.error("analyze error:", e.message);
    return NextResponse.json({ error: e.message || "Error analyzing content" }, { status: 500 });
  }
}
