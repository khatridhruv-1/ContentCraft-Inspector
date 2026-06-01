import { NextResponse } from "next/server";
import { groqRequest, extractJSON, sanitizeJSONString, cleanContent } from "@/lib/groq";

export async function POST(req: Request) {
  try {
    const { content } = await req.json();
    const plain = cleanContent(content, 3000);

    const raw = await groqRequest([
      { role: "system", content: `Return ONLY a compact JSON object with no line breaks inside string values: {"plagiarismScore":number,"originalityScore":number,"flaggedSections":["short phrase"]}` },
      { role: "user",   content: `Analyze originality of this content: ${plain}` },
    ]);

    let result;
    try {
      result = JSON.parse(sanitizeJSONString(extractJSON(raw)));
    } catch {
      const ps = raw.match(/"plagiarismScore"\s*:\s*(\d+)/);
      const os = raw.match(/"originalityScore"\s*:\s*(\d+)/);
      result = {
        plagiarismScore:  ps ? parseInt(ps[1]) : 20,
        originalityScore: os ? parseInt(os[1]) : 80,
        flaggedSections:  [],
      };
    }
    return NextResponse.json(result);
  } catch (e: any) {
    console.error("plagiarism error:", e.message);
    return NextResponse.json({ error: e.message || "Error checking plagiarism" }, { status: 500 });
  }
}
