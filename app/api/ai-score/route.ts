import { NextResponse } from "next/server";
import { groqRequest, extractJSON, cleanContent } from "@/lib/groq";

export async function POST(req: Request) {
  try {
    const { content } = await req.json();
    const plain = cleanContent(content, 3000);
    const wordCount = plain.split(/\s+/).filter(Boolean).length;

    const raw = await groqRequest([
      {
        role: "system",
        content: `You are a content analyzer. Respond with ONLY valid JSON, no markdown, no extra text:
{"aiScore":80,"humanScore":20,"analysis":"brief analysis string","suggestions":["tip1","tip2"],"humanizedVersion":"rewritten text here"}`,
      },
      { role: "user", content: `Analyze and humanize (~${wordCount} words): ${plain}` },
    ]);

    let result;
    try {
      result = JSON.parse(extractJSON(raw));
    } catch {
      const aiMatch = raw.match(/"aiScore"\s*:\s*(\d+)/);
      const hmMatch = raw.match(/"humanScore"\s*:\s*(\d+)/);
      result = {
        aiScore: aiMatch ? parseInt(aiMatch[1]) : 50,
        humanScore: hmMatch ? parseInt(hmMatch[1]) : 50,
        analysis: 'Analysis unavailable — please try again.',
        suggestions: [],
        humanizedVersion: plain,
      };
    }

    return NextResponse.json(result);
  } catch (e: any) {
    console.error("ai-score error:", e.message);
    return NextResponse.json({ error: e.message || "Error analyzing content" }, { status: 500 });
  }
}
