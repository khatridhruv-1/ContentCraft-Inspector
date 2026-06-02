import { NextResponse } from "next/server";
import { groqRequest, cleanContent } from "@/lib/groq";

export async function POST(req: Request) {
  try {
    const { content } = await req.json();
    const plain = cleanContent(content, 3000);

    const rephrased = await groqRequest([
      { role: "system", content: "Rephrase the following content to be more engaging and original. Keep the same structure with Markdown formatting: use # for main title, ## for section headings, ### for subheadings, - for bullet points. Return only the rephrased Markdown text — no JSON, no code blocks, no extra commentary." },
      { role: "user",   content: plain },
    ]);

    let text = rephrased.trim();
    try {
      const parsed = JSON.parse(text);
      if (parsed && typeof parsed === 'object') {
        text = Object.values(parsed)
          .filter((v): v is string => typeof v === 'string')
          .join('\n\n');
      }
    } catch { /* plain text — use as-is */ }

    return NextResponse.json({ rephrasedContent: text });
  } catch (e: any) {
    console.error("rephrase error:", e.message);
    return NextResponse.json({ error: e.message || "Error rephrasing content" }, { status: 500 });
  }
}
