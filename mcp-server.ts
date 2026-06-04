import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { groqRequest, cleanContent, extractJSON, sanitizeJSONString } from "./lib/groq.js";

const NATIVE_NAMES: Record<string, string> = {
  English: "English", Hindi: "Hindi (हिंदी)", Gujarati: "Gujarati (ગુજરાતી)",
  Spanish: "Spanish (Español)", French: "French (Français)", German: "German (Deutsch)",
  Portuguese: "Portuguese (Português)", Japanese: "Japanese (日本語)", Korean: "Korean (한국어)",
  Chinese: "Chinese (中文)", Arabic: "Arabic (العربية)", Russian: "Russian (Русский)",
  Italian: "Italian (Italiano)", Turkish: "Turkish (Türkçe)", Bengali: "Bengali (বাংলা)",
  Tamil: "Tamil (தமிழ்)", Telugu: "Telugu (తెలుగు)", Marathi: "Marathi (मराठी)",
  Punjabi: "Punjabi (ਪੰਜਾਬੀ)", Urdu: "Urdu (اردو)",
};

const NATIVE_INSTRUCTIONS: Record<string, string> = {
  Hindi: "पूरा लेख केवल हिंदी में लिखें। एक भी अंग्रेज़ी शब्द का प्रयोग न करें।",
  Gujarati: "સંપૂર્ણ લેખ ફક્ત ગુજરાતીમાં લખો. એક પણ અંગ્રેજી શબ્દ વાપરો નહીં.",
  Japanese: "この記事は全て日本語で書いてください。英語は一切使わないでください。",
  Korean: "이 글 전체를 한국어로만 작성하세요. 영어를 전혀 사용하지 마세요.",
  Chinese: "请用中文撰写整篇文章，不要使用任何英语单词。",
  Arabic: "اكتب المقال بالكامل باللغة العربية فقط. لا تستخدم أي كلمة إنجليزية.",
  Russian: "Напишите всю статью только на русском. Не используйте ни одного английского слова.",
  Italian: "Scrivi l'intero articolo solo in italiano. Non usare parole inglesi.",
  Turkish: "Makaleyi tamamen Türkçe yazın. Hiç İngilizce kelime kullanmayın.",
  Bengali: "পুরো নিবন্ধটি কেবল বাংলায় লিখুন। একটিও ইংরেজি শব্দ ব্যবহার করবেন না।",
  Tamil: "இந்த கட்டுரையை முழுவதும் தமிழிலேயே எழுதுங்கள். ஒரு ஆங்கில வார்த்தையும் பயன்படுத்தாதீர்கள்.",
  Telugu: "ఈ వ్యాసాన్ని పూర్తిగా తెలుగులో మాత్రమే రాయండి. ఒక్క ఇంగ్లీష్ పదం కూడా వాడవద్దు.",
  Marathi: "संपूर्ण लेख केवळ मराठीत लिहा. एकही इंग्रजी शब्द वापरू नका.",
  Punjabi: "ਪੂਰਾ ਲੇਖ ਸਿਰਫ਼ ਪੰਜਾਬੀ ਵਿੱਚ ਲਿਖੋ। ਇੱਕ ਵੀ ਅੰਗਰੇਜ਼ੀ ਸ਼ਬਦ ਨਾ ਵਰਤੋ।",
  Urdu: "پورا مضمون صرف اردو میں لکھیں۔ ایک بھی انگریزی لفظ استعمال نہ کریں۔",
  Spanish: "Escribe el artículo completo solo en español. No uses ninguna palabra en inglés.",
  French: "Rédigez l'article entièrement en français. N'utilisez aucun mot anglais.",
  German: "Schreiben Sie den gesamten Artikel nur auf Deutsch. Verwenden Sie kein einziges englisches Wort.",
  Portuguese: "Escreva o artigo inteiro somente em português. Não use nenhuma palavra em inglês.",
};

async function groqGenerate(messages: { role: string; content: string }[]): Promise<string> {
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || "Groq API error");
  }

  const data = await res.json();
  return data.choices[0].message.content as string;
}

const server = new McpServer({
  name: "contentcraft-inspector",
  version: "1.0.0",
});

// Tool 1: generate_content
server.tool(
  "generate_content",
  "Generate a full article or blog post using ContentCraft's AI. Supports multiple languages and tones.",
  {
    title:       z.string().describe("Article topic or title"),
    keywords:    z.string().optional().describe("Comma-separated keywords to include"),
    tone:        z.string().optional().describe("Writing tone: professional, casual, formal, persuasive, etc."),
    targetWords: z.number().optional().describe("Approximate word count (default: 1000)"),
    language:    z.string().optional().describe("Output language (default: English). Supported: Hindi, Gujarati, Spanish, French, German, etc."),
  },
  async ({ title, keywords = "", tone = "professional", targetWords = 1000, language = "English" }) => {
    const nativeLang  = NATIVE_NAMES[language] || language;
    const nativeInstr = NATIVE_INSTRUCTIONS[language] || "";
    const kwPrompt    = keywords.trim() ? `Keywords to include: ${keywords}.` : "";
    const isEnglish   = language === "English";

    const systemPrompt = isEnglish
      ? `You are a professional content writer. Format your response in Markdown: use # for the main title, ## for section headings, ### for subheadings, **bold** for key terms, and - for bullet points. Every section must have a heading.`
      : [
          `You are an expert ${nativeLang} content writer.`,
          `ABSOLUTE RULE: Every single word of your response — including all headings, subheadings, bullet points, and body text — MUST be written in ${nativeLang} script only.`,
          `Do NOT use English anywhere in the article, not even for technical terms or section titles.`,
          nativeInstr,
        ].join("\n");

    const toneNote = isEnglish && tone ? `Tone: ${tone}.` : "";

    const userPrompt = isEnglish
      ? `Write a detailed article of ~${targetWords} words on: "${title}". ${kwPrompt} ${toneNote}`
      : [
          nativeInstr,
          ``,
          `Write a complete, well-structured article of approximately ${targetWords} words on this topic: "${title}"`,
          kwPrompt,
          ``,
          `Requirements:`,
          `- Write entirely in ${nativeLang} — no English words at all`,
          `- Include a title, introduction, multiple sections with headings, and a conclusion`,
          `- Use ${nativeLang} for ALL headings and section titles`,
        ].filter(Boolean).join("\n");

    const result = await groqGenerate([
      { role: "system", content: systemPrompt },
      { role: "user",   content: userPrompt   },
    ]);

    return { content: [{ type: "text" as const, text: result }] };
  }
);

// Tool 2: analyze_content
server.tool(
  "analyze_content",
  "Analyze content using ContentCraft's AI. Returns content score, readability, tone, key insights, and improvement suggestions.",
  {
    content: z.string().describe("The text content to analyze"),
  },
  async ({ content }) => {
    const plain = cleanContent(content, 3000);

    const raw = await groqRequest([
      {
        role: "system",
        content: `You are a content analyzer. Respond with ONLY a valid JSON object — no extra text, no markdown, no trailing commas. Use this exact structure:
{"contentScore":75,"readability":70,"tone":"professional","keyInsights":["insight1","insight2"],"improvements":["tip1","tip2"]}`,
      },
      { role: "user", content: `Analyze: ${plain}` },
    ]);

    let result: object;
    try {
      result = JSON.parse(extractJSON(sanitizeJSONString(raw)));
    } catch {
      const scoreMatch = raw.match(/"contentScore"\s*:\s*(\d+)/);
      const readMatch  = raw.match(/"readability"\s*:\s*(\d+)/);
      const toneMatch  = raw.match(/"tone"\s*:\s*"([^"]+)"/);
      result = {
        contentScore: scoreMatch ? parseInt(scoreMatch[1]) : 70,
        readability:  readMatch  ? parseInt(readMatch[1])  : 70,
        tone:         toneMatch  ? toneMatch[1]            : "neutral",
        keyInsights:  [],
        improvements: [],
      };
    }

    return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error("MCP server error:", err);
  process.exit(1);
});
