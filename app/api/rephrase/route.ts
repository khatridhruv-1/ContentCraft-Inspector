import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { content } = await req.json();
    const plainContent = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 8000);

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: "You are a professional rephrasing assistant. Rephrase the user's input with a more structured format, using unique, descriptive, and powerful words. Aim for maximum clarity and attractiveness.",
          },
          {
            role: "user",
            content: `Rephrase the following: ${plainContent}`,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      console.error("Groq error in rephrase:", errData);
      return NextResponse.json({ error: errData?.error?.message || "Error rephrasing content" }, { status: 500 });
    }

    const data = await response.json();
    const rephrased = data.choices[0].message.content;

    return NextResponse.json(rephrased);
  } catch (error) {
    console.error("Error in rephrase:", error);
    return NextResponse.json({ error: "Error rephrasing content" }, { status: 500 });
  }
}
