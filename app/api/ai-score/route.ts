import { NextResponse } from "next/server";
import { groqRequest, extractJSON, sanitizeJSONString, cleanContent } from "@/lib/groq";

export async function POST(req: Request) {
  try {
    const { content } = await req.json();
    const plain = cleanContent(content, 3000);
    const wordCount = plain.split(/\s+/).filter(Boolean).length;

    const raw = await groqRequest([
      {
        role: "system",
        content: `You are a content analyzer. Respond with ONLY valid JSON, no extra text. Both analysis and humanizedVersion must use Markdown: ## for headings, - for bullets:
{"aiScore":80,"humanScore":20,"analysis":"## Tone\\n\\nFormal and informative.\\n\\n## Style\\n\\n- Clear structure\\n- Good flow","suggestions":["tip1","tip2"],"humanizedVersion":"# Title\\n\\n## Section\\n\\nParagraph text."}`,
      },
      { role: "user", content: `Analyze and humanize (~${wordCount} words): ${plain}` },
    ]);

    let result;
    try {
      result = JSON.parse(sanitizeJSONString(extractJSON(raw)));
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
