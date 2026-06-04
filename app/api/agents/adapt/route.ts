import { NextResponse } from 'next/server';
import { groqRequest, cleanContent } from '@/lib/groq';

const PLATFORM_INSTRUCTIONS: Record<string, string> = {
  linkedin: `Rewrite this as a LinkedIn post (150-300 words).
- Start with a bold hook or surprising stat
- Use short paragraphs (1-2 lines each)
- Add 3-5 relevant hashtags at the end
- Professional but conversational tone
- End with a question to drive comments`,

  twitter: `Rewrite this as a Twitter/X thread (8-12 tweets).
- Number each tweet: 1/, 2/, 3/ etc.
- First tweet must be a strong hook under 280 chars
- Each tweet max 280 characters
- Last tweet = CTA or takeaway
- No hashtags except on last tweet (max 2)`,

  instagram: `Rewrite this as an Instagram caption (100-150 words).
- Start with an attention-grabbing first line
- Use line breaks for readability
- Conversational and relatable tone
- End with a question or CTA
- Add 10-15 relevant hashtags on a new line at the end`,

  facebook: `Rewrite this as a Facebook post (150-250 words).
- Conversational and warm tone
- Tell a short story or share an insight
- Ask a question to encourage comments
- Add 2-3 relevant emojis naturally
- No excessive hashtags (max 3)`,

  email: `Rewrite this as a marketing email (250-400 words).
- First line = compelling subject line starting with "Subject:"
- Personalized opening ("Hi [Name],")
- Clear value proposition in first paragraph
- 2-3 short body paragraphs
- Single clear CTA button text at the end
- Sign off professionally`,

  wordpress: `Rewrite this as a complete WordPress blog post.
- Keep the full structure with H1, H2, H3 headings
- Maintain all sections and key points
- SEO-optimized with keywords naturally placed
- Add a strong conclusion with CTA`,

  blog: `Rewrite this as a detailed blog post (1200-1500 words).
- H1 title, H2 sections, H3 subsections
- Strong introduction with hook
- Bullet points where appropriate
- Conclusion with key takeaways`,
};

export async function POST(req: Request) {
  try {
    const { content, platform, topic, brandVoice } = await req.json();

    if (!content || !platform) {
      return NextResponse.json({ error: 'content and platform required' }, { status: 400 });
    }

    const instructions = PLATFORM_INSTRUCTIONS[platform] ?? PLATFORM_INSTRUCTIONS.blog;
    const plain = cleanContent(content, 2000);
    const tone = brandVoice?.tone ?? 'professional';

    const adapted = await groqRequest([
      {
        role: 'system',
        content: `You are an expert content adapter. Adapt content for different platforms while maintaining the core message. Write in a ${tone} tone. Respond with ONLY the adapted content — no explanations, no preamble.`,
      },
      {
        role: 'user',
        content: `Topic: "${topic}"

Original content:
${plain}

Instructions:
${instructions}

Write the adapted content now:`,
      },
    ]);

    return NextResponse.json({ content: adapted.trim(), platform });
  } catch (e: any) {
    console.error('adapt error:', e.message);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
