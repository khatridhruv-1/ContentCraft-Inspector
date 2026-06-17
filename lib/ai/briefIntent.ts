export type TopicCategory = 'geopolitical' | 'general';
export type ArticleType = 'explainer' | 'trending_list' | 'canonical_list';

export type ResolvedBrief = {
  rawBrief: string;
  topic: string;
  searchTopic: string;
  topicCategory: TopicCategory;
  articleType: ArticleType;
  topicNote?: string;
  articleGoal: string;
};

const META_BRIEF_PATTERNS = [
  /^(?:please\s+)?(?:write|create|draft|generate|compose)\s+(?:me\s+)?(?:an?\s+)?(?:seo[- ]?friendly\s+)?(?:content|blog\s+(?:post|article)\s+)?(?:for|about|on)\s+(?:the\s+)?(.+)$/i,
  /^(?:please\s+)?(?:write|create|draft|generate|compose)\s+(?:me\s+)?(?:an?\s+)?(?:seo[- ]?friendly\s+)?(?:blog\s+post|blog\s+article|post|article)\s+(?:for|about|on)\s+(?:the\s+)?(.+)$/i,
  /^(?:please\s+)?(?:write|create|draft|generate|compose)\s+(?:me\s+)?(?:an?\s+)?(?:seo[- ]?friendly\s+)?(?:for|about|on)\s+(?:the\s+)?(.+)$/i,
];

const TRENDING_SIGNAL_PATTERN =
  /\b(latest|newest|new|trending|hottest|most\s+recent|popular\s+right\s+now|right\s+now)\b/i;

const LIST_RANKING_SIGNAL_PATTERN =
  /\b(top|best|greatest|worst|must[- ]watch|essential|iconic)\b/i;

/** "Best of all time" / history — not "what's hot right now". */
const ALL_TIME_SIGNAL_PATTERN =
  /\b(in\s+history|all[- ]time|of\s+all\s+time|greatest\s+ever|ever\s+made|through\s+history|across\s+decades|timeless|legendary|definitive|greatest\s+(movies?|films?|shows?|songs?))\b/i;

const TRENDING_ENTITY_PATTERN =
  /\b(movies?|films?|shows?|series|songs?|albums?|bollywood|hollywood|hindi|telugu|tamil|music|games?|apps?|products?|phones?|gadgets?)\b/i;

const TYPO_HINTS: Array<{
  pattern: RegExp;
  searchTopic: string;
  note: string;
}> = [
  {
    pattern: /\bagetic\b/i,
    searchTopic: 'agentic AI systems',
    note:
      '"Agetic" is almost certainly a misspelling of "agentic". Write about agentic AI systems — autonomous agents that plan, use tools, and complete tasks. Do NOT invent a product, brand, or platform called "Agetic System".',
  },
  {
    pattern: /\bagentic\s+system(s)?\b/i,
    searchTopic: 'agentic AI systems',
    note:
      'Write about agentic AI systems as a technical concept (agents, planning, tool use, workflows). This is NOT a commercial software product unless the brief names a real, verifiable product.',
  },
  {
    pattern: /\bbolloywood\b/i,
    searchTopic: 'Bollywood Hindi movies trending',
    note: '"Bolloywood" is a misspelling of Bollywood.',
  },
];

function stripTrailingPunctuation(value: string): string {
  return value.trim().replace(/[.?!]+$/, '');
}

function extractTopic(rawBrief: string): string {
  const trimmed = stripTrailingPunctuation(rawBrief);
  for (const pattern of META_BRIEF_PATTERNS) {
    const match = trimmed.match(pattern);
    if (match?.[1]) {
      return stripTrailingPunctuation(match[1]);
    }
  }
  return trimmed;
}

function detectArticleType(topic: string, rawBrief: string): ArticleType {
  const combined = `${rawBrief} ${topic}`;
  const hasEntity = TRENDING_ENTITY_PATTERN.test(combined);
  const isAllTime = ALL_TIME_SIGNAL_PATTERN.test(combined);
  const hasTrendingSignal = TRENDING_SIGNAL_PATTERN.test(combined);
  const hasRankingSignal = LIST_RANKING_SIGNAL_PATTERN.test(combined);

  if (hasEntity && isAllTime && hasRankingSignal) {
    return 'canonical_list';
  }

  if (hasEntity && isAllTime && /\b(which|what)\b/i.test(combined)) {
    return 'canonical_list';
  }

  if ((hasTrendingSignal || (hasRankingSignal && !isAllTime)) && hasEntity) {
    return 'trending_list';
  }

  if (
    hasRankingSignal &&
    /\b(what|which|who)\b/i.test(combined) &&
    /\b(is|are)\b/i.test(combined) &&
    hasEntity
  ) {
    return isAllTime ? 'canonical_list' : 'trending_list';
  }

  return 'explainer';
}

const GEOPOLITICAL_TOPIC_PATTERN =
  /\b(war|wars|conflict|tensions?|sanctions?|geopolitic|military|invasion|airstrikes?|hostage|nuclear deal|ceasefire|strike|strikes)\b/i;

const COUNTRY_ENTITY_PATTERN =
  /\b(us|usa|u\.s\.|united states|iran|china|russia|israel|ukraine|taiwan|north korea|gaza|syria|iraq|afghanistan)\b/i;

const GEOPOLITICAL_NOTE = [
  'This is a geopolitical / current-events topic.',
  'Do NOT invent or assert unverified recent developments (battles, airstrikes, "full-scale war", casualty counts, coalition actions, or dates like "as of 2026").',
  'Write a background explainer: historical roots, long-running disputes, documented flashpoints, and what experts watch — not a breaking-news report.',
  'Use well-established facts and clearly mark uncertainty where developments are disputed or evolving.',
  'Do not present an active war as confirmed fact unless the brief explicitly states it.',
].join(' ');

const CANONICAL_LIST_NOTE = [
  'This is an all-time / greatest-ever listicle — NOT a "what is trending right now" query.',
  'Frame the article around historical significance, critical acclaim, and enduring popularity.',
  'Do NOT use "trending now", "right now", or "dominating the talk" language.',
  'Use CURRENT WEB SEARCH RESULTS (critic lists, "best of" roundups) as the primary source for film titles.',
  'Only include titles that appear in search snippets. Do not invent films or box-office figures.',
  'Well-known classics are fine when named in search results — do not pad with unverified recent blockbusters.',
].join(' ');

const TRENDING_LIST_NOTE = [
  'This is a "what is trending / latest" query — answer it directly, not with a generic industry essay.',
  'Use CURRENT WEB SEARCH RESULTS as the primary source for names and titles. Do not pick one old example from memory and call it "#1 right now".',
  'If search results are missing, say live rankings could not be verified and discuss how to find current trends — do not invent specific titles.',
  'Never paste raw SEO keyword strings into sentences (e.g. "latest trending hindi movies").',
  'Do not fabricate box-office numbers, streaming records, or release dates unless they appear in the search results.',
].join(' ');

function detectTopicCategory(topic: string): TopicCategory {
  const lower = topic.toLowerCase();
  const hasGeopoliticalSignal = GEOPOLITICAL_TOPIC_PATTERN.test(lower);
  const hasCountryEntity = COUNTRY_ENTITY_PATTERN.test(lower);
  const hasVersus = /\b(vs\.?|versus)\b/i.test(lower);

  if (hasGeopoliticalSignal || (hasCountryEntity && hasVersus)) {
    return 'geopolitical';
  }

  return 'general';
}

function normalizeSearchTopic(topic: string, category: TopicCategory, articleType: ArticleType): string {
  if (articleType === 'trending_list' || articleType === 'canonical_list') {
    return topic
      .replace(/\bbolloywood\b/gi, 'Bollywood')
      .replace(/\bgenerate\s+content\s+for\s+/gi, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  if (category !== 'geopolitical') return topic;

  return topic
    .replace(/\bvs\.?\b/gi, ' ')
    .replace(/\b(us|usa|u\.s\.)\b/gi, 'US')
    .replace(/\s+/g, ' ')
    .trim();
}

function resolveTopicHints(
  topic: string,
  category: TopicCategory,
  articleType: ArticleType
): Pick<ResolvedBrief, 'searchTopic' | 'topicNote'> {
  for (const hint of TYPO_HINTS) {
    if (hint.pattern.test(topic)) {
      return {
        searchTopic: normalizeSearchTopic(hint.searchTopic, category, articleType),
        topicNote: hint.note,
      };
    }
  }

  const searchTopic = normalizeSearchTopic(topic, category, articleType);

  if (articleType === 'trending_list') {
    return { searchTopic, topicNote: TRENDING_LIST_NOTE };
  }

  if (articleType === 'canonical_list') {
    return { searchTopic, topicNote: CANONICAL_LIST_NOTE };
  }

  if (category === 'geopolitical') {
    return { searchTopic, topicNote: GEOPOLITICAL_NOTE };
  }

  return { searchTopic };
}

function buildArticleGoal(topic: string, category: TopicCategory, articleType: ArticleType): string {
  if (articleType === 'canonical_list') {
    return [
      `Answer the reader's question: what are the best / greatest "${topic}" picks across Bollywood history.`,
      'Open with an honest framing — "best ever" is subjective — then name 4–6 films that appear in CURRENT WEB SEARCH RESULTS.',
      'Cover each film briefly: why critics and audiences keep it on shortlists (from snippets only).',
      'Use an editorial canon-roundup voice — historical, not breaking-news or "trending now".',
      'If search results are unavailable, discuss how critics evaluate greatness — do not invent a ranked list.',
    ].join(' ');
  }

  if (articleType === 'trending_list') {
    return [
      `Answer the reader's question: what is trending / latest for "${topic}".`,
      'Open with a direct answer in the first paragraph — name specific titles from CURRENT WEB SEARCH RESULTS.',
      'Cover 3–5 items with a short paragraph each: what it is and why people are talking about it.',
      'Use an editorial roundup voice — not marketing hype, not a single-title deep dive unless only one result is relevant.',
      'If search results are unavailable, be honest about limits instead of inventing rankings.',
    ].join(' ');
  }

  if (category === 'geopolitical') {
    return [
      `Write a contextual, SEO-friendly explainer about "${topic}" for readers who want background — not a live news bulletin.`,
      'Cover: how tensions developed, key historical turning points, major policy disputes, regional stakes, and what informed readers should watch.',
      'Use an editorial explainer voice. No invented battles, timelines, or casualty figures.',
    ].join(' ');
  }

  return [
    `Write an informational, SEO-friendly blog article that explains "${topic}" to a curious reader.`,
    'Cover: what it is, why it matters, how it works in practice, examples or use cases, and actionable advice.',
    'Use an explainer/editorial style — not sales copy, not a product page.',
  ].join(' ');
}

export function resolveBriefIntent(rawBrief: string): ResolvedBrief {
  const trimmed = rawBrief.trim();
  const topic = extractTopic(trimmed);
  const articleType = detectArticleType(topic, trimmed);
  const topicCategory = detectTopicCategory(topic);
  const { searchTopic, topicNote } = resolveTopicHints(topic, topicCategory, articleType);
  const articleGoal = buildArticleGoal(topic, topicCategory, articleType);

  return {
    rawBrief: trimmed,
    topic,
    searchTopic,
    topicCategory,
    articleType,
    topicNote,
    articleGoal,
  };
}
