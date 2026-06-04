import express from "express";
import cors from "cors";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { z } from "zod";

const GROQ_API_KEY = process.env.GROQ_API_KEY || "";
const MCP_API_KEY  = process.env.MCP_API_KEY  || "";
const PORT         = parseInt(process.env.PORT || "3100");

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
      Authorization: `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({ model: "llama-3.3-70b-versatile", messages }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as any)?.error?.message || "Groq API error");
  }

  const data = await res.json();
  return (data as any).choices[0].message.content as string;
}

function createMcpServer() {
  const server = new McpServer({ name: "contentcraft-inspector", version: "1.0.0" });

  server.tool(
    "generate_content",
    "Generate a full article or blog post using ContentCraft's AI. Supports multiple languages and tones.",
    {
      title:       z.string().describe("Article topic or title"),
      keywords:    z.string().optional().describe("Comma-separated keywords"),
      tone:        z.string().optional().describe("Writing tone: professional, casual, formal, persuasive"),
      targetWords: z.number().optional().describe("Approximate word count (default: 1000)"),
      language:    z.string().optional().describe("Output language (default: English)"),
    },
    async ({ title, keywords = "", tone = "professional", targetWords = 1000, language = "English" }) => {
      const nativeLang  = NATIVE_NAMES[language] || language;
      const nativeInstr = NATIVE_INSTRUCTIONS[language] || "";
      const kwPrompt    = keywords.trim() ? `Keywords to include: ${keywords}.` : "";
      const isEnglish   = language === "English";

      const systemPrompt = isEnglish
        ? `You are a professional content writer. Format in Markdown: use # for title, ## for sections, ### for subheadings, **bold** for key terms, - for bullet points.`
        : [
            `You are an expert ${nativeLang} content writer.`,
            `ABSOLUTE RULE: Write EVERYTHING in ${nativeLang} script only. No English anywhere.`,
            nativeInstr,
          ].join("\n");

      const userPrompt = isEnglish
        ? `Write a detailed article of ~${targetWords} words on: "${title}". ${kwPrompt} Tone: ${tone}.`
        : [
            nativeInstr,
            `Write a complete article of ~${targetWords} words on: "${title}"`,
            kwPrompt,
            `Write entirely in ${nativeLang} — no English words at all`,
          ].filter(Boolean).join("\n");

      const result = await groqGenerate([
        { role: "system", content: systemPrompt },
        { role: "user",   content: userPrompt   },
      ]);

      return { content: [{ type: "text" as const, text: result }] };
    }
  );

  server.tool(
    "analyze_content",
    "Analyze content. Returns content score, readability, tone, key insights, and improvement suggestions.",
    { content: z.string().describe("The text content to analyze") },
    async ({ content }) => {
      const plain = content.slice(0, 3000);

      const raw = await groqGenerate([
        {
          role: "system",
          content: `You are a content analyzer. Respond with ONLY a valid JSON object:
{"contentScore":75,"readability":70,"tone":"professional","keyInsights":["insight1"],"improvements":["tip1"]}`,
        },
        { role: "user", content: `Analyze: ${plain}` },
      ]);

      let result: object;
      try {
        const match = raw.match(/\{[\s\S]*\}/);
        result = JSON.parse(match ? match[0] : raw);
      } catch {
        result = { contentScore: 70, readability: 70, tone: "neutral", keyInsights: [], improvements: [] };
      }

      return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
    }
  );

  return server;
}

const app = express();
app.use(cors());
app.use(express.json());

// Optional API key auth — set MCP_API_KEY env var to enable
function authMiddleware(req: express.Request, res: express.Response, next: express.NextFunction) {
  if (!MCP_API_KEY) return next();
  const token = req.headers.authorization?.replace("Bearer ", "") || req.query.api_key;
  if (token !== MCP_API_KEY) {
    res.status(401).json({ error: "Unauthorized — invalid API key" });
    return;
  }
  next();
}

const transports: Record<string, SSEServerTransport> = {};

app.get("/sse", authMiddleware, async (req, res) => {
  const transport = new SSEServerTransport("/message", res);
  const server    = createMcpServer();
  transports[transport.sessionId] = transport;

  res.on("close", () => { delete transports[transport.sessionId]; });

  await server.connect(transport);
});

app.post("/message", authMiddleware, async (req, res) => {
  const sessionId  = req.query.sessionId as string;
  const transport  = transports[sessionId];
  if (!transport) {
    res.status(404).json({ error: "Session not found" });
    return;
  }
  await transport.handlePostMessage(req, res);
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok", server: "contentcraft-inspector", version: "1.0.0" });
});

app.listen(PORT, () => {
  console.log(`ContentCraft MCP HTTP server running on port ${PORT}`);
  console.log(`SSE endpoint: http://localhost:${PORT}/sse`);
  console.log(`Auth: ${MCP_API_KEY ? "enabled" : "disabled (set MCP_API_KEY to enable)"}`);
});
