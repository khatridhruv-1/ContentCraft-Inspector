/**
 * Editorial brief for BlogCreator Daily — tuned against multi-critic review
 * (AI-slop openers, fake anonymized case studies, LinkedIn-bro antithesis,
 * meta "thought leadership about thought leadership").
 */
export function buildDailyNewsletterBrief(topic: string): string {
  return [
    topic,
    'Write a 2 minute read Substack newsletter essay on this topic (target 400–520 words, HARD MAX 550).',
    'FORM: one # title as a sharp editorial headline a subscriber would open (not a vague "X trends" label); exactly two ## sections; max ~5 short paragraphs per section.',
    'SECTION JOBS: ##1 diagnoses one current habit/problem for this topic; ##2 gives what to do Monday (tactics). Section 2 must not restate section 1.',
    'VOICE: short letter to a working marketer/founder. Smart peer. Editorial "I" = judgment and observed patterns only — never fake biography, never "I recently read a thread" without a real source URL.',
    'OPEN: sentence 1–2 state the insight and address "you". Ban: "The era of X is over", "For years… But today…", "Here\'s the thing", "In today\'s fast-paced…".',
    'PROOF: one concrete workflow friction or named public pattern. NEVER invent anonymized founders, clients, dollar losses, lead counts, or percent metrics. Prefer operational nouns (tickets, drafts, edit passes, subject lines) over abstractions (transparency, texture, authority).',
    'BANNED / REWRITE: "from a mile away", "messy middle", "shiny case study", "radical transparency", "let the details do the heavy lifting", "Stop trying to X. Start Y.", "Your audience can smell", "They do not need X. They need Y." loops, "game-changer", "leverage", "delve", "unlock".',
    'ANGLE: stay faithful to this topic\'s domain. If the topic is meta (thought leadership), pick ONE operational sub-angle (proof format, distribution, review loop) — do not sermonize "be authentic".',
    'CLOSE: one short reply-worthy question tied to THIS issue\'s evidence. No product pitch. No summary sermon after the last tactic. No em-dashes.',
  ].join(' ');
}

/** Prefer a human subject when the seed topic is a bland trend phrase. */
export function dailyNewsletterSubject(topic: string): string {
  const cleaned = topic.replace(/\s+trends?\s*$/i, '').trim();
  if (cleaned.length >= 12 && cleaned.toLowerCase() !== topic.toLowerCase()) {
    return cleaned;
  }
  return topic;
}
