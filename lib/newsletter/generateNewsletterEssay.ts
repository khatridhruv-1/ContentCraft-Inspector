import { ollamaChat, type OllamaMessage } from '@/lib/ai/ollama';
import { cleanGeneratedContent, normalizePlatformFormat } from '@/lib/ai/sanitizeContent';
import { countWords, truncateToWordLimit } from '@/lib/content/readingTarget';
import { buildDailyNewsletterBrief } from '@/lib/newsletter/editorialBrief';

const NEWSLETTER_MIN_WORDS = 380;
const NEWSLETTER_MAX_WORDS = 520;

const SYSTEM_PROMPT = `
You write BlogCreator Daily — a short morning email to a subscriber who publishes content for a living.

You are not writing a blog explainer, a LinkedIn manifesto, or a how-to playbook with numbered systems.
You are writing a note from an editor who notices publishing patterns and says the sharp thing plainly.

HARD RULES:
- Output ONLY finished markdown. No planning notes.
- Start with one # headline (claim-like, not "X trends", not instruction text).
- Exactly two ## sections. Section 1 = the tension you noticed. Section 2 = one practical move for this week. Do not restate section 1.
- 380–520 words total. Hard stop at 520.
- Short paragraphs. Mix sentence length. Some fragments OK if they sound spoken.
- Address "you" early. Editorial "I" only for judgment ("I'd cut the intro") — never fake client audits, fake founders, or "I see this constantly in audits" unless invented authority is unnecessary.
- No invented metrics, companies, lead counts, or secondhand "I read a thread" stories.
- No binary playbooks ("create two documents… first… second…") unless the topic truly requires it — prefer one concrete practice change.
- Ban: "The era of X is over", "Stop X. Start Y.", "messy middle", "from a mile away", "radical transparency", "blind spot" as a metaphor crutch, "leverage", "delve", "game-changer", em-dashes.
- End with exactly one reply-worthy question on its own line (no heading). The question must tie to the tactic in section 2 — not "what failure will you share?"

Voice test: if a line could appear in any corporate content-marketing blog, rewrite it until it couldn't.
`.trim();

function finalizeEssay(raw: string): string {
  const cleaned = normalizePlatformFormat(cleanGeneratedContent(raw), 'substack');
  return truncateToWordLimit(cleaned, NEWSLETTER_MAX_WORDS);
}

function needsRetry(text: string): string | null {
  const words = countWords(text);
  if (words < NEWSLETTER_MIN_WORDS) {
    return `Too short (${words} words). Expand to ${NEWSLETTER_MIN_WORDS}–${NEWSLETTER_MAX_WORDS} with more concrete detail in section 2. Keep the same # title and two ## sections. End with one question.`;
  }
  if (words > NEWSLETTER_MAX_WORDS + 40) {
    return `Too long (${words} words). Cut to ${NEWSLETTER_MAX_WORDS} max. Keep the sharpest examples; drop schematic step lists.`;
  }

  const h2Count = (text.match(/^##\s+/gm) ?? []).length;
  if (h2Count !== 2) {
    return 'Use exactly one # title and exactly two ## sections, then one closing question on its own line.';
  }

  const lastLines = text
    .trim()
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean);
  const closer = lastLines[lastLines.length - 1] ?? '';
  if (!closer.includes('?')) {
    return 'End with exactly one reply-worthy question on its own final line, tied to section 2.';
  }

  if (/\bI see this (?:constantly|all the time) in audits\b/i.test(text)) {
    return 'Remove invented auditor authority. Rewrite as a publishing-pattern observation without fake audits.';
  }

  return null;
}

export async function generateNewsletterEssay(
  topic: string,
  recentTopics: string[] = []
): Promise<string> {
  const userBrief = buildDailyNewsletterBrief(topic, recentTopics);

  const messages: OllamaMessage[] = [
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'user', content: `${userBrief}\n\nWrite the email essay now.` },
  ];

  let draft = finalizeEssay(
    await ollamaChat({
      messages,
      temperature: 0.72,
      topP: 0.9,
      maxTokens: 1400,
    })
  );

  for (let attempt = 0; attempt < 2; attempt += 1) {
    const reason = needsRetry(draft);
    if (!reason) break;

    try {
      const retry = await ollamaChat({
        messages: [
          ...messages,
          { role: 'assistant', content: draft },
          { role: 'user', content: reason },
        ],
        temperature: 0.6,
        topP: 0.9,
        maxTokens: 1400,
      });
      draft = finalizeEssay(retry);
    } catch (error) {
      console.warn('[daily-newsletter] Essay retry failed; keeping prior draft.', error);
      break;
    }
  }

  return draft;
}
