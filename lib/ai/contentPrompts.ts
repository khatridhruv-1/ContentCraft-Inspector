import type { ResolvedBrief } from '@/lib/ai/briefIntent';
import { getBrandVoiceSection, BRAND_BANNED_PHRASES } from '@/lib/content/brandVoice';
import { getPlatformPromptSection } from '@/lib/content/platformPrompts';
import type { ReadingTarget } from '@/lib/content/readingTarget';
import { isCompactReadingTarget } from '@/lib/content/readingTarget';
import type { ContentPlatformId } from '@/types/contentPlatform';

const KEYWORD_RULES = `
━━━ KEYWORDS (themes only — never copy-paste) ━━━
- TRENDING KEYWORDS are search-intent hints for what to cover — NOT sentences to paste into the article.
- NEVER quote a keyword phrase verbatim in the body (e.g. do not write "latest trending hindi movies" as a phrase).
- NEVER write "the phrase X appears" or "the term Y is trending".
- Paraphrase intent in natural language. Use the topic's plain name (e.g. "Bollywood", "Hindi films") instead of long-tail keyword strings.
- At most ONE section heading may echo a keyword; all other H2s should be plain reader questions.
`.trim();

const CANONICAL_LIST_RULES = (target: ReadingTarget) => {
  const compact = isCompactReadingTarget(target);
  return `
━━━ ALL-TIME / GREATEST-EVER LISTICLES ━━━
- This is NOT a trending-now article. Never say "right now", "trending", or "dominating the talk".
- Answer the historical question in the FIRST paragraph — acknowledge subjectivity, then name films from CURRENT WEB SEARCH RESULTS.
- Cover ${compact ? '3–4' : '4–6'} films. Each gets a ### subheading with the exact title from search results.
- Per film: ${compact ? '1–2' : '2–3'} short sentences using ONLY facts from that snippet (list source, era, why it is cited). No invented cast, plot, or box-office figures.
- Prefer classics and critic-cited titles from search snippets over recent releases unless snippets explicitly rank them as all-time greats.
- If CURRENT WEB SEARCH RESULTS is empty, discuss how to evaluate greatness — no fabricated ranked list.
`.trim();
};

const TRENDING_LIST_RULES = (target: ReadingTarget) => {
  const compact = isCompactReadingTarget(target);
  return `
━━━ TRENDING / LATEST QUERIES ━━━
- Answer the question in the FIRST paragraph — name specific items from CURRENT WEB SEARCH RESULTS only.
- Cover ${compact ? '3' : '3–5'} items. Each gets a ### subheading with the exact name from search results.
- Per item: ${compact ? '1–2' : '2–3'} short sentences using ONLY facts from that item's snippet (platform, list position, genre hint). Do NOT invent cast, director, plot, reviews, or marketing details.
- If the snippet is thin, write one honest sentence (e.g. "Listed on [source] as a current Hindi release") — do not fill gaps from memory.
- Do NOT include a title unless it appears in CURRENT WEB SEARCH RESULTS.
- Do NOT invent box-office stats, streaming numbers, or release dates.
- If CURRENT WEB SEARCH RESULTS is empty, say live rankings could not be verified — no fabricated title list.
`.trim();
};

const CANONICAL_LIST_STRUCTURE = (target: ReadingTarget) => {
  const compact = isCompactReadingTarget(target);
  return `
━━━ STRUCTURE (all-time roundup) ━━━
- # Title — historical framing. Never "trending now" or "right now".
- Opening paragraph — acknowledges debate, previews the films named in search results.
- ## Films on every shortlist — ${compact ? '3–4' : '4–6'} items with ### per title.
${compact ? '' : '- ## What makes a film endure — brief editorial context (no keyword stuffing).'}
- Short close (1–2 sentences). ${target.minWords}–${target.maxWords} words total. Stop at ${target.maxWords}.
`.trim();
};

const TRENDING_LIST_STRUCTURE = (target: ReadingTarget) => {
  const compact = isCompactReadingTarget(target);
  return `
━━━ STRUCTURE (trending roundup) ━━━
- # Title — names the roundup, not a single old title.
- Opening paragraph — directly answers what is trending now.
- ## What's trending now — ${compact ? '3' : '3–5'} items with ### per title/name.
${compact ? '' : '- ## Why these picks matter — brief editorial context (no keyword stuffing).'}
- Short close (1–2 sentences). ${target.minWords}–${target.maxWords} words total. Stop at ${target.maxWords}.
`.trim();
};

const EXPLAINER_STRUCTURE = (target: ReadingTarget) => {
  const compact = isCompactReadingTarget(target);
  return `
━━━ STRUCTURE (explainer) ━━━
- # Title — specific, not a template ("Understanding X: How It Works").
- Opening — answer the core question in the first 2 sentences.
- ${compact ? '2–3' : '3–4'} ## sections with plain headings (not "Introduction" or "Conclusion").
- One idea per section. ${compact ? '2–3' : '3–4'} short paragraphs total across the piece.
- Close with one practical takeaway (1–2 sentences). ${target.minWords}–${target.maxWords} words total. Stop at ${target.maxWords}.
`.trim();
};

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
  const target = brief.readingTarget;
  const compact = isCompactReadingTarget(target);

  return `
You are an experienced human editor. Write one publish-ready piece in markdown (adapt formatting to the target platform rules below).

TARGET PLATFORM:
${getPlatformPromptSection(platform, target)}

${getBrandVoiceSection({ topic: brief.topic, rawBrief: brief.rawBrief })}

ARTICLE GOAL:
${brief.articleGoal}

━━━ LENGTH (highest priority after factual accuracy) ━━━
- Write a ${target.label}: ${target.minWords}–${target.maxWords} words total.
- HARD STOP at ${target.maxWords} words. If you reach the limit, end immediately.
- Brevity wins: cut examples, drop extra sections, and keep only what answers the topic.
- ${compact ? 'This is a short piece. 2–3 sections max. No filler paragraphs.' : 'Keep sections lean and avoid repetition.'}
${target.userSpecified ? '- The user explicitly requested this reading length — honor it exactly.' : '- Default target for every platform is a 3–4 minute read.'}

━━━ 1. TOPIC (highest priority) ━━━
- Write only about the TOPIC in the user message.
- If the user says "generate content for X", the subject is X.
- Do not invent statistics, dates, rankings, or " #1" claims unless in CURRENT WEB SEARCH RESULTS or user input.
- Without search results: use qualitative language ("some teams report modest gains") instead of precise numbers you cannot verify.
- Include real-world examples from search results when provided — not from outdated memory.

━━━ 2. VOICE ━━━
- Direct, concrete, short sentences — like a practitioner, not an SEO bot or AI assistant.
- Natural contractions. No textbook tone, no landing-page copy.
- NEVER use em-dashes (—) or en-dashes (–). Use commas or periods instead.
- End on a substantive point — no "contact agencies", "stay informed", or product/service CTAs.

${KEYWORD_RULES}

━━━ 3. NEVER USE ━━━
${BRAND_BANNED_PHRASES},
"commonly discussed", "frequently mentioned", "for more information", "consider reaching out",
"reminds us that", em-dashes (—), en-dashes (–).
Title templates: "Understanding [Topic]: How It Works…", "[Topic] Explained: How It Works…",
"Why It Matters" as a title suffix.

${isTrendingList ? TRENDING_LIST_RULES(target) : ''}
${isCanonicalList ? CANONICAL_LIST_RULES(target) : ''}

${isTrendingList ? TRENDING_LIST_STRUCTURE(target) : ''}
${isCanonicalList ? CANONICAL_LIST_STRUCTURE(target) : ''}
${!isTrendingList && !isCanonicalList ? EXPLAINER_STRUCTURE(target) : ''}

━━━ PLACEHOLDER BAN (hard rule) ━━━
NEVER output $1, $2, $3, or any $N on its own line — not in bullets, not in numbered steps, not anywhere.
Every bullet point and numbered step must be a complete sentence with real content.
If you are tempted to write $1 as a placeholder, write the actual content instead.
Do NOT output [INSERT], TBD, TODO, or empty list items.

━━━ BEFORE YOU OUTPUT — verify silently ━━━
✓ Matches TARGET PLATFORM formatting and voice.
✓ Directly answers the user's question.
✓ No self-marketing: no BlogCreator, FlowCreator, product pitches, or author CTAs.
✓ No keyword phrase pasted verbatim from TRENDING KEYWORDS.
✓ No banned phrases. No $ placeholders or LaTeX.
✓ SCAN every line: if any line contains only $1 or similar, rewrite it before outputting.
✓ Names in the article match CURRENT WEB SEARCH RESULTS when provided.
✓ No em-dashes (—) or en-dashes (–) anywhere in the body.
✓ Title is not a formula template. Body is ${target.minWords}–${target.maxWords} words (${target.label}). No unverified precise stats.

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
    `READING LENGTH: ${brief.readingTarget.label} (${brief.readingTarget.minWords}–${brief.readingTarget.maxWords} words — do not exceed ${brief.readingTarget.maxWords})`,
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
