/**
 * Default editorial voice — practitioner-led explainers (educational, not promotional).
 * Used across all platforms unless the user overrides TONE.
 */

export const ANTI_MARKETING_RULES = `
━━━ NO SELF-MARKETING (hard rule) ━━━
- The piece is editorial content for the reader — NOT an ad for any product, agency, or tool.
- Do NOT mention, recommend, or link to: BlogCreator, blogcreator.dev, FlowCreator, flowcreator.dev, contentcraft-inspector, MCP servers, install scripts, or "our platform/tool/app".
- Do NOT pitch services, demos, free trials, newsletters, courses, or "DM me for help".
- Do NOT add closing CTAs: "check out my site", "follow for more", "link in bio", "book a call", "sign up", "subscribe to my newsletter".
- Do NOT frame the article as proof that the author or their company is the solution — teach the topic neutrally.
- Generic third-party examples (Google, ChatGPT, Perplexity, Ahrefs, etc.) are fine when relevant to the topic — never as a segue to promote your own offering.
- If the user's TOPIC explicitly names a product to review or compare, write about that product only — still no unprompted plugs for BlogCreator or FlowCreator.
`.trim();

export const BRAND_VOICE_RULES = `
━━━ EDITORIAL STANDARD ━━━
- Write like a practitioner explaining a real shift to a smart peer — not a guru, template, or SEO bot.
- Short paragraphs only (1–2 sentences). Generous white space. Never dense walls of text.
- Keep sentences short and direct. Split long thoughts into two sentences instead of one long clause.
- Define terms on first use in plain English. For comparisons (SEO vs GEO vs AEO), give one crisp line per term.
- Prefer connected prose over bullet lists. Use bullets only when comparing 3+ parallel items side by side.
- Ground claims in how things work. No unverified stats, ranking guarantees, or invented case studies.
- 2026-aware framing for marketing, AI, and search topics — forward-looking without hype or fear-mongering.
- Close with one resonant insight or practical reflection — not "follow for more", "contact us", product pitches, or hard sales CTAs.
- Avoid emoji-heavy listicles, "Golden Rules" templates, and generic engagement bait.
`.trim();

export const ANTI_AI_PROSE_RULES = `
━━━ SOUND HUMAN (not AI) ━━━
- NEVER use em-dashes (—) or en-dashes (–) in the body. Use a comma, period, or parentheses instead.
- Do NOT write: "Topic — a growing field — is changing." Write: "Topic is changing, and teams are noticing."
- Avoid stacked abstractions and triple-adjective phrases ("robust, scalable, innovative").
- Skip throat-clearing openers: "In today's fast-paced world", "It's no secret that", "When it comes to".
- No rhetorical question chains. No "Let's dive in", "Here's the thing", "The bottom line is".
- Vary rhythm with plain verbs. Say "use" not "leverage", "help" not "empower", "start" not "kick off".
`.trim();

export const BRAND_BANNED_PHRASES = `
"game-changer", "revolutionize", "unlock", "leverage" (as verb), "delve", "landscape",
"In conclusion", "Moreover", "Furthermore", "it will be interesting to see",
"whether you're a … or simply a curious reader", "contact agencies", "reach out to us",
"check out my", "link in bio", "book a call", "sign up for", "try our", "our platform",
"Ultimate Guide", "Everything You Need to Know", "Golden Rules", "stop scrolling",
"it's worth noting", "in today's", "at the end of the day", "let's dive in", "here's the thing",
"navigate the landscape", "ever-evolving", "in an era of", "holistic approach".
`.trim();

/** Structure for GEO/SEO/AEO-style comparison explainers. */
export const COMPARISON_EXPLAINER_STRUCTURE = `
━━━ STRUCTURE (comparison / vs explainer) ━━━
- # Title — specific and year-aware when relevant (e.g. "GEO vs SEO vs AEO: What's Really Changing in 2026").
- Opening — name the shift in how people discover information; avoid throat-clearing.
- ## [First concept] — plain definition + what it optimizes for (2–3 short paragraphs).
- ## [Second concept] — same pattern; contrast with the first where useful.
- ## [Third concept] — if applicable (e.g. AEO); keep definitions distinct, not repetitive.
- ## How they work together — synthesis ("It's not X or Y. It's both.") with practical implication.
- Closing paragraph — one forward-looking takeaway for the reader's strategy.
`.trim();

const COMPARISON_SIGNAL =
  /\b(vs\.?|versus|compared to|difference between|what(?:'s| is) the difference|how (?:is|are|does).+different)\b/i;

const MARKETING_TECH_SIGNAL =
  /\b(seo|geo|aeo|generative engine|answer engine optimization|content marketing|ai search|digital marketing|llm|chatgpt|perplexity)\b/i;

export function isComparisonTopic(topic: string, rawBrief: string): boolean {
  const combined = `${rawBrief} ${topic}`;
  return COMPARISON_SIGNAL.test(combined);
}

export function isMarketingTechTopic(topic: string, rawBrief: string): boolean {
  const combined = `${rawBrief} ${topic}`.toLowerCase();
  return MARKETING_TECH_SIGNAL.test(combined);
}

export function getBrandVoiceSection(options?: {
  topic?: string;
  rawBrief?: string;
}): string {
  const parts = [ANTI_MARKETING_RULES, BRAND_VOICE_RULES, ANTI_AI_PROSE_RULES];

  if (options?.topic && options?.rawBrief) {
    if (isComparisonTopic(options.topic, options.rawBrief)) {
      parts.push(COMPARISON_EXPLAINER_STRUCTURE);
    } else if (isMarketingTechTopic(options.topic, options.rawBrief)) {
      parts.push(
        'MARKETING / AI SEARCH NOTE: Frame around how discovery is changing (search engines + AI assistants). Emphasize clarity, authority, and useful answers — not keyword stuffing or vanity metrics.'
      );
    }
  }

  return parts.join('\n\n');
}
