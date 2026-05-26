import axios from "axios";
import { NextResponse } from "next/server";

async function validateContent(req: Request): Promise<string | NextResponse> {
  let content: unknown;
  try {
    const body = await req.json();
    content = body?.content;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!content || typeof content !== "string" || !content.trim()) {
    return NextResponse.json({ error: "Content is required" }, { status: 400 });
  }

  if (content.length > 10000) {
    return NextResponse.json(
      { error: "Content exceeds maximum length of 10000 characters" },
      { status: 400 }
    );
  }

  return content;
}

async function fetchAnalysis(content: string): Promise<object | NextResponse> {
  const response = await axios.post(
    "https://api.openai.com/v1/chat/completions",
    {
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `
            You are a powerful AI assistant that analyzes content and provides detailed insights and scores.
            Your task is to evaluate the given content and return the following results in JSON format:
            {
              "contentScore": number, // Overall vibe of the content (0-100, with 100 being the best). Calculate this score based on these factors:
                - Readability (weight: 30%)
                - Structure and organization (weight: 30%)
                - Tone appropriateness (weight: 20%)
                - Use of engaging and concise language (weight: 20%)
              "wordCount": number, // Total word count of the content
              "readingTime": number, // Estimated reading time in minutes (assume 150 words per minute)
              "readability": number, // Readability score (0-100, with 100 being the easiest to read)
              "tone": string, // The tone of the content (e.g., "formal", "casual", "persuasive", etc.)
              "keyInsights": string[], // Key insights from the content (up to 5 points)
              "improvements": string[] // Suggested improvements to make the content stronger (up to 5 points)
            }
            Provide clear and concise results based on your analysis.
          `,
        },
        {
          role: "user",
          content: `Analyze the following content and provide scores and insights: ${content}`,
        },
      ],
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
    }
  );

  const data = response.data.choices[0].message.content;
  try {
    return JSON.parse(data);
  } catch {
    return NextResponse.json(
      { error: "Invalid analysis response" },
      { status: 502 }
    );
  }
}

export async function POST(req: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 }
    );
  }

  const validated = await validateContent(req);
  if (validated instanceof NextResponse) {
    return validated;
  }

  try {
    const analysis = await fetchAnalysis(validated);
    if (analysis instanceof NextResponse) {
      return analysis;
    }
    return NextResponse.json(analysis);
  } catch {
    return NextResponse.json(
      { error: "Analysis service unavailable" },
      { status: 502 }
    );
  }
}
