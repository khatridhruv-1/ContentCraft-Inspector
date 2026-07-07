import type { ResolvedBrief } from '@/lib/ai/briefIntent';
import { getBrandVoiceSection, BRAND_BANNED_PHRASES } from '@/lib/content/brandVoice';
import { getPlatformPromptSection } from '@/lib/content/platformPrompts';
import type { ReadingTarget } from '@/lib/content/readingTarget';
import { isCompactReadingTarget } from '@/lib/content/readingTarget';
import type { ContentPlatformId } from '@/types/contentPlatform';

function listRules(brief: ResolvedBrief, target: ReadingTarget): string {
  const compact = isCompactReadingTarget(target);
  const itemCount = compact ? '3–4' : '4–6';
  const trendingCount = compact ? '3' : '3–5';

  if (brief.articleType === 'trending_list') {
    return `
LISTICLE (trending now): Answer in paragraph 1 using CURRENT WEB SEARCH RESULTS only.
Cover ${trendingCount} items with ### subheadings. Use only facts from snippets — no invented titles, cast, or stats.
If search results are empty, say rankings could not be verified.`.trim();
  }

  if (brief.articleType === 'canonical_list') {
    return `
LISTICLE (all-time): Not a "trending now" piece. Name films/items from CURRENT WEB SEARCH RESULTS only.
Cover ${itemCount} items with ### subheadings. No invented rankings or box-office figures.`.trim();
  }

  return `
EXPLAINER: Answer the core question in the first 2 sentences.
${compact ? '2–3' : '3–4'} sections with specific headings (not "Introduction" or "Conclusion").`.trim();
}

function buildGenerationSystemPrompt(
  brief: ResolvedBrief,
  platform: ContentPlatformId
): string {
  const target = brief.readingTarget;

  return `
You are an experienced editor. Write one publish-ready article in markdown.

OUTPUT RULES (non-negotiable):
- Return ONLY the finished article. No planning, rule recitation, checklists, word-count math, or notes to yourself.
- Start with the title or opening line immediately.
- ${target.minWords}–${target.maxWords} words (${target.label}). Stop at ${target.maxWords}.
- Short paragraphs (1–2 sentences). No em-dashes (—) or en-dashes (–).
- Never use $1/$2 placeholders, [INSERT], TBD, or TODO.

PLATFORM:
${getPlatformPromptSection(platform, target)}

VOICE:
${getBrandVoiceSection({ topic: brief.topic, rawBrief: brief.rawBrief })}

GOAL: ${brief.articleGoal}

TOPIC: Write only about the user's topic. No invented stats unless in search results.

KEYWORDS: Treat trending keywords as themes — paraphrase naturally, never paste verbatim.

BANNED: ${BRAND_BANNED_PHRASES}

${listRules(brief, target)}
`.trim();
}

export function buildContentGenerationPrompt({
  brief,
  keywords,
  tone,
  platform,
  searchContext,
}: {
  brief: ResolvedBrief;
  keywords: string;
  tone?: string;
  platform: ContentPlatformId;
  searchContext?: string | null;
}): { system: string; user: string } {
  const lines = [
    `TOPIC: ${brief.topic}`,
    `USER INPUT: ${brief.rawBrief}`,
    `PLATFORM: ${platform}`,
    `LENGTH: ${brief.readingTarget.minWords}–${brief.readingTarget.maxWords} words`,
  ];

  if (brief.topicNote) lines.push(`NOTE: ${brief.topicNote}`);

  if (searchContext?.trim()) {
    lines.push('', 'CURRENT WEB SEARCH RESULTS:', searchContext.trim());
  } else if (brief.articleType === 'trending_list' || brief.articleType === 'canonical_list') {
    lines.push('', 'CURRENT WEB SEARCH RESULTS: (none — do not invent specific titles)');
  }

  lines.push('', `TRENDING KEYWORDS: ${keywords || brief.topic}`);
  if (tone?.trim()) lines.push(`TONE: ${tone.trim()}`);
  lines.push('', 'Write the finished article now.');

  return {
    system: buildGenerationSystemPrompt(brief, platform),
    user: lines.join('\n'),
  };
}
