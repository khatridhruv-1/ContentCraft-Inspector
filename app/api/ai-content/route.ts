import { NextResponse } from "next/server";

const NATIVE_NAMES: Record<string, string> = {
  English:    'English',
  Hindi:      'Hindi (हिंदी)',
  Gujarati:   'Gujarati (ગુજરાતી)',
  Spanish:    'Spanish (Español)',
  French:     'French (Français)',
  German:     'German (Deutsch)',
  Portuguese: 'Portuguese (Português)',
  Japanese:   'Japanese (日本語)',
  Korean:     'Korean (한국어)',
  Chinese:    'Chinese (中文)',
  Arabic:     'Arabic (العربية)',
  Russian:    'Russian (Русский)',
  Italian:    'Italian (Italiano)',
  Turkish:    'Turkish (Türkçe)',
  Bengali:    'Bengali (বাংলা)',
  Tamil:      'Tamil (தமிழ்)',
  Telugu:     'Telugu (తెలుగు)',
  Marathi:    'Marathi (मराठी)',
  Punjabi:    'Punjabi (ਪੰਜਾਬੀ)',
  Urdu:       'Urdu (اردو)',
};

const NATIVE_INSTRUCTIONS: Record<string, string> = {
  Hindi:      'पूरा लेख केवल हिंदी में लिखें। एक भी अंग्रेज़ी शब्द का प्रयोग न करें।',
  Gujarati:   'સંપૂર્ણ લેખ ફક્ત ગુજરાતીમાં લખો. એક પણ અંગ્રેજી શબ્દ વાપરો નહીં.',
  Japanese:   'この記事は全て日本語で書いてください。英語は一切使わないでください。',
  Korean:     '이 글 전체를 한국어로만 작성하세요. 영어를 전혀 사용하지 마세요.',
  Chinese:    '请用中文撰写整篇文章，不要使用任何英语单词。',
  Arabic:     'اكتب المقال بالكامل باللغة العربية فقط. لا تستخدم أي كلمة إنجليزية.',
  Russian:    'Напишите всю статью только на русском. Не используйте ни одного английского слова.',
  Italian:    "Scrivi l'intero articolo solo in italiano. Non usare parole inglesi.",
  Turkish:    'Makaleyi tamamen Türkçe yazın. Hiç İngilizce kelime kullanmayın.',
  Bengali:    'পুরো নিবন্ধটি কেবল বাংলায় লিখুন। একটিও ইংরেজি শব্দ ব্যবহার করবেন না।',
  Tamil:      'இந்த கட்டுரையை முழுவதும் தமிழிலேயே எழுதுங்கள். ஒரு ஆங்கில வார்த்தையும் பயன்படுத்தாதீர்கள்.',
  Telugu:     'ఈ వ్యాసాన్ని పూర్తిగా తెలుగులో మాత్రమే రాయండి. ఒక్క ఇంగ్లీష్ పదం కూడా వాడవద్దు.',
  Marathi:    'संपूर्ण लेख केवळ मराठीत लिहा. एकही इंग्रजी शब्द वापरू नका.',
  Punjabi:    'ਪੂਰਾ ਲੇਖ ਸਿਰਫ਼ ਪੰਜਾਬੀ ਵਿੱਚ ਲਿਖੋ। ਇੱਕ ਵੀ ਅੰਗਰੇਜ਼ੀ ਸ਼ਬਦ ਨਾ ਵਰਤੋ।',
  Urdu:       'پورا مضمون صرف اردو میں لکھیں۔ ایک بھی انگریزی لفظ استعمال نہ کریں۔',
  Spanish:    'Escribe el artículo completo solo en español. No uses ninguna palabra en inglés.',
  French:     "Rédigez l'article entièrement en français. N'utilisez aucun mot anglais.",
  German:     'Schreiben Sie den gesamten Artikel nur auf Deutsch. Verwenden Sie kein einziges englisches Wort.',
  Portuguese: 'Escreva o artigo inteiro somente em português. Não use nenhuma palavra em inglês.',
};

export async function POST(req: Request) {
  try {
    const { title, keywords, tone, targetWords = 1000, language = 'English' } = await req.json();

    const nativeLang  = NATIVE_NAMES[language] || language;
    const nativeInstr = NATIVE_INSTRUCTIONS[language] || '';
    const kwPrompt    = keywords?.trim() ? `Keywords to include: ${keywords}.` : '';
    const isEnglish   = language === 'English';

    const systemPrompt = isEnglish
      ? `You are a professional content writer. Format your response in Markdown: use # for the main title, ## for section headings, ### for subheadings, **bold** for key terms, and - for bullet points. Every section must have a heading.`
      : [
          `You are an expert ${nativeLang} content writer.`,
          `ABSOLUTE RULE: Every single word of your response — including all headings, subheadings, bullet points, and body text — MUST be written in ${nativeLang} script only.`,
          `Do NOT use English anywhere in the article, not even for technical terms or section titles.`,
          nativeInstr,
        ].join('\n');

    const toneNote = isEnglish && tone?.trim() ? `Tone: ${tone}.` : '';

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
        ].filter(Boolean).join('\n');

    const openaiRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        stream: true,
        temperature: isEnglish ? 0.3 : 0.7,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user",   content: userPrompt   },
        ],
      }),
    });

    if (!openaiRes.ok) {
      const err = await openaiRes.json().catch(() => ({}));
      console.error('Groq ai-content error:', err);
      return NextResponse.json({ error: err?.error?.message || "Error generating content" }, { status: 500 });
    }

    const stream = new ReadableStream({
      async start(controller) {
        const reader  = openaiRes.body!.getReader();
        const decoder = new TextDecoder();
        let buffer    = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() ?? '';
          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || trimmed === 'data: [DONE]') continue;
            if (!trimmed.startsWith('data: ')) continue;
            try {
              const json  = JSON.parse(trimmed.slice(6));
              const token = json.choices?.[0]?.delta?.content ?? '';
              if (token) controller.enqueue(new TextEncoder().encode(token));
            } catch { /* skip malformed chunks */ }
          }
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  } catch (error) {
    console.error("Error in AI content generation:", error);
    return NextResponse.json({ error: "Error generating content" }, { status: 500 });
  }
}
