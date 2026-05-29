import { NextResponse } from "next/server";
import { groqRequest, cleanContent } from "@/lib/groq";

export async function POST(req: Request) {
  try {
    const { content } = await req.json();
    const plain = cleanContent(content, 3000);

    const rephrased = await groqRequest([
      { role: "system", content: "Rephrase the following content to be more engaging and original. Return only the rephrased text, no extra commentary." },
      { role: "user",   content: plain },
    ]);

    return NextResponse.json({ rephrasedContent: rephrased.trim() });
  } catch (e: any) {
    console.error("rephrase error:", e.message);
    return NextResponse.json({ error: e.message || "Error rephrasing content" }, { status: 500 });
  }
}
