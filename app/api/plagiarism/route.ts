import { NextResponse } from "next/server";
import { groqRequest, extractJSON, cleanContent } from "@/lib/groq";

export async function POST(req: Request) {
  try {
    const { content } = await req.json();
    const plain = cleanContent(content, 3000);

    const raw = await groqRequest([
      { role: "system", content: `Return ONLY a JSON object: {"plagiarismScore":number,"originalityScore":number,"flaggedSections":string[],"improvedVersion":string}` },
      { role: "user",   content: `Check plagiarism and rewrite: ${plain}` },
    ]);

    const result = JSON.parse(extractJSON(raw));
    return NextResponse.json(result);
  } catch (e: any) {
    console.error("plagiarism error:", e.message);
    return NextResponse.json({ error: e.message || "Error checking plagiarism" }, { status: 500 });
  }
}
