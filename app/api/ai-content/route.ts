import { NextResponse } from "next/server";

interface AIContentRequest {
  title?: string;
  keywords?: string;
  tone?: string;
}

class GeminiQuotaError extends Error {
  retryAfterSeconds?: number;

  constructor(message: string, retryAfterSeconds?: number) {
    super(message);
    this.name = "GeminiQuotaError";
    this.retryAfterSeconds = retryAfterSeconds;
  }
}

async function generateWithGemini(prompt: string): Promise<string> {
  const apiKey = process.env.google_ai_studio_api_key;
  if (!apiKey) {
    throw new Error("Missing google_ai_studio_api_key environment variable");
  }

  const modelCandidates = [
    "gemini-1.5-flash-latest",
    "gemini-1.5-flash",
    "gemini-2.0-flash",
    "gemini-2.0-flash-lite",
  ];

  let lastErrorMessage = "Gemini API request failed while generating content.";

  for (const model of modelCandidates) {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            temperature: 0.8,
            topP: 0.9,
            maxOutputTokens: 4096,
          },
        }),
      }
    );

    const payload = await response.json();

    if (!response.ok) {
      const message =
        payload?.error?.message ||
        "Gemini API request failed while generating content.";
      lastErrorMessage = message;

      if (message.toLowerCase().includes("quota exceeded")) {
        const retryMatch = message.match(/retry in\s+([0-9.]+)s/i);
        const retryAfterSeconds = retryMatch
          ? Math.max(1, Math.ceil(Number(retryMatch[1])))
          : undefined;
        throw new GeminiQuotaError(message, retryAfterSeconds);
      }

      // Try the next model when this model is not available for the current key.
      if (
        message.includes("not found") ||
        message.includes("not supported for generateContent")
      ) {
        continue;
      }

      throw new Error(message);
    }

    const text = payload?.candidates?.[0]?.content?.parts
      ?.map((part: { text?: string }) => part?.text || "")
      .join("")
      .trim();

    if (!text) {
      throw new Error("Gemini returned an empty response.");
    }

    return text;
  }

  throw new Error(lastErrorMessage);
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as AIContentRequest;
    const title = body?.title?.trim();
    const keywords = body?.keywords?.trim();
    const tone = body?.tone?.trim();

    if (!title) {
      return NextResponse.json(
        { error: "Title is required to generate content." },
        { status: 400 }
      );
    }

    let keywordPrompt = "";
    if (keywords) {
      keywordPrompt = `Ensure that the article focuses on the following key terms and concepts: ${keywords}. Use these keywords naturally throughout the text.`;
    }

    let tonePrompt = "";
    if (tone) {
      tonePrompt = `Write the content in a ${tone} tone to match the expected audience style.`;
    }

    const prompt = `
You are a knowledgeable content writing assistant.
Generate a well-structured article on the topic "${title}".

Requirements:
- Write in markdown format.
- Include an engaging title.
- Include clear headings and subheadings.
- Include bullet points where useful.
- Keep short, readable paragraphs.
- Include a concise introduction and a strong conclusion.
- Target 900 to 1200 words.
${keywordPrompt}
${tonePrompt}
`.trim();

    const contentResponse = await generateWithGemini(prompt);

    return NextResponse.json({ content: contentResponse });
  } catch (error) {
    console.error("Error in AI content generation:", error);

    if (error instanceof GeminiQuotaError) {
      return NextResponse.json(
        {
          error:
            "Gemini API quota exceeded. Please wait and retry, or enable billing/increase quota in Google AI Studio.",
          retryAfterSeconds: error.retryAfterSeconds,
        },
        { status: 429 }
      );
    }

    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Error generating content",
      },
      { status: 500 }
    );
  }
}
