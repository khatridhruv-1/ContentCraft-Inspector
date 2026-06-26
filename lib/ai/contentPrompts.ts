import type { ResolvedBrief } from '@/lib/ai/briefIntent';
import { getBrandVoiceSection, BRAND_BANNED_PHRASES } from '@/lib/content/brandVoice';
import { getPlatformPromptSection } from '@/lib/content/platformPrompts';
import type { ContentPlatformId } from '@/types/contentPlatform';
import { PLATFORM_READING_TARGET } from '@/types/contentPlatform';

const KEYWORD_RULES = `
━━━ KEYWORDS (themes only — never copy-paste) ━━━
- TRENDING KEYWORDS are search-intent hints for what to cover — NOT sentences to paste into the article.
- NEVER quote a keyword phrase verbatim in the body (e.g. do not write "latest trending hindi movies" as a phrase).
- NEVER write "the phrase X appears" or "the term Y is trending".
- Paraphrase intent in natural language. Use the topic's plain name (e.g. "Bollywood", "Hindi films") instead of long-tail keyword strings.
- At most ONE section heading may echo a keyword; all other H2s should be plain reader questions.
`.trim();

const CANONICAL_LIST_RULES = `
━━━ ALL-TIME / GREATEST-EVER LISTICLES ━━━
- This is NOT a trending-now article. Never say "right now", "trending", or "dominating the talk".
- Answer the historical question in the FIRST paragraph — acknowledge subjectivity, then name films from CURRENT WEB SEARCH RESULTS.
- Cover 4–6 films. Each gets a ### subheading with the exact title from search results.
- Per film: 2–3 sentences using ONLY facts from that snippet (list source, era, why it is cited). No invented cast, plot, or box-office figures.
- Prefer classics and critic-cited titles from search snippets over recent releases unless snippets explicitly rank them as all-time greats.
- If CURRENT WEB SEARCH RESULTS is empty, discuss how to evaluate greatness — no fabricated ranked list.
`.trim();

const TRENDING_LIST_RULES = `
━━━ TRENDING / LATEST QUERIES ━━━
- Answer the question in the FIRST paragraph — name specific items from CURRENT WEB SEARCH RESULTS only.
- Cover 3–5 items. Each gets a ### subheading with the exact name from search results.
- Per item: 2–3 sentences using ONLY facts from that item's snippet (platform, list position, genre hint). Do NOT invent cast, director, plot, reviews, or marketing details.
- If the snippet is thin, write one honest sentence (e.g. "Listed on [source] as a current Hindi release") — do not fill gaps from memory.
- Do NOT include a title unless it appears in CURRENT WEB SEARCH RESULTS.
- Do NOT invent box-office stats, streaming numbers, or release dates.
- If CURRENT WEB SEARCH RESULTS is empty, say live rankings could not be verified — no fabricated title list.
`.trim();

const CANONICAL_LIST_STRUCTURE = `
━━━ STRUCTURE (all-time roundup) ━━━
- # Title — historical framing (e.g. "Hindi Films That Define Bollywood's Canon"). Never "trending now" or "right now".
- Opening paragraph — acknowledges debate, previews the films named in search results.
- ## Films on every shortlist — 4–6 items with ### per title.
- ## What makes a film endure — brief editorial context (no keyword stuffing).
- Short close. 700–900 words.
`.trim();

const TRENDING_LIST_STRUCTURE = `
━━━ STRUCTURE (trending roundup) ━━━
- # Title — names the roundup (e.g. "Bollywood Hindi Films Trending Now"), not a single old title.
- Opening paragraph — directly answers what is trending now.
- ## What's trending now — 3–5 items with ### per title/name.
- ## Why these picks matter — brief editorial context (no keyword stuffing).
- Short close. 700–900 words.
`.trim();

/**
 * Single system prompt for content generation.
 * All quality, SEO, and style rules live here — one LLM call, no post-processing pass.
 */
function buildGenerationSystemPrompt(
  brief: ResolvedBrief,
  platform: ContentPlatformId
): string {
  const isTrendingList = brief.articleType === 'trending_list';
  const isCanonicalList = brief.articleType === 'canonical_list';

  return `
You are an experienced human editor. Write one publish-ready piece in markdown (adapt formatting to the target platform rules below).

TARGET PLATFORM:
${getPlatformPromptSection(platform)}

${getBrandVoiceSection({ topic: brief.topic, rawBrief: brief.rawBrief })}

ARTICLE GOAL:
${brief.articleGoal}

━━━ 1. TOPIC (highest priority) ━━━
- Write only about the TOPIC in the user message.
- If the user says "generate content for X", the subject is X.
- Do not invent statistics, dates, rankings, or " #1" claims unless in CURRENT WEB SEARCH RESULTS or user input.
- Without search results: use qualitative language ("some teams report modest gains") instead of precise numbers you cannot verify.
- Include real-world examples from search results when provided — not from outdated memory.

━━━ 2. VOICE ━━━
- Direct, concrete, varied sentences — like a practitioner, not an SEO bot.
- Natural contractions. No textbook tone, no landing-page copy.
- End on a substantive point — no "contact agencies", "stay informed", or product/service CTAs.

${KEYWORD_RULES}

━━━ 3. NEVER USE ━━━
${BRAND_BANNED_PHRASES},
"commonly discussed", "frequently mentioned", "for more information", "consider reaching out",
"reminds us that".
Title templates: "Understanding [Topic]: How It Works…", "[Topic] Explained: How It Works…",
"Why It Matters" as a title suffix.

${isTrendingList ? TRENDING_LIST_RULES : ''}
${isCanonicalList ? CANONICAL_LIST_RULES : ''}

${isTrendingList ? TRENDING_LIST_STRUCTURE : ''}
${isCanonicalList ? CANONICAL_LIST_STRUCTURE : ''}

━━━ PLACEHOLDER BAN (hard rule) ━━━
NEVER output $1, $2, $3, or any $N on its own line — not in bullets, not in numbered steps, not anywhere.
Every bullet point and numbered step must be a complete sentence with real content.
If you are tempted to write $1 as a placeholder, write the actual content instead.
Do NOT output [INSERT], TBD, TODO, or empty list items.

━━━ BEFORE YOU OUTPUT — verify silently ━━━
✓ Matches TARGET PLATFORM formatting and voice.
✓ Directly answers the user's question.
✓ No self-marketing: no ContentCraft, FlowCreator, product pitches, or author CTAs.
✓ No keyword phrase pasted verbatim from TRENDING KEYWORDS.
✓ No banned phrases. No $ placeholders or LaTeX.
✓ SCAN every line: if any line contains only $1 or similar, rewrite it before outputting.
✓ Names in the article match CURRENT WEB SEARCH RESULTS when provided.
✓ Title is not a formula template. Body is ${PLATFORM_READING_TARGET.minWords}–${PLATFORM_READING_TARGET.maxWords} words (${PLATFORM_READING_TARGET.label}). No unverified precise stats.

Output the final markdown article only. No commentary.
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
    `ARTICLE TYPE: ${brief.articleType}`,
    `TARGET PLATFORM: ${platform}`,
  ];

  if (brief.topicNote) {
    lines.push(`NOTE: ${brief.topicNote}`);
  }

  if (searchContext?.trim()) {
    lines.push('', 'CURRENT WEB SEARCH RESULTS (primary source for names and titles):', searchContext.trim());
  } else if (brief.articleType === 'trending_list' || brief.articleType === 'canonical_list') {
    lines.push(
      '',
      'CURRENT WEB SEARCH RESULTS: (none available — do not invent specific titles or rankings)'
    );
  }

  lines.push('', `TRENDING KEYWORDS (themes only — do not paste verbatim): ${keywords || brief.topic}`);

  if (tone?.trim()) {
    lines.push(`TONE: ${tone.trim()}`);
  }

  return {
    system: buildGenerationSystemPrompt(brief, platform),
    user: lines.join('\n'),
  };
}
