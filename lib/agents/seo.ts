import { groqRequest, extractJSON, sanitizeJSONString, cleanContent } from '@/lib/groq';
import type { SEOOutput, ResearchOutput, ContentPlatform } from '@/types/agents';

interface SEOInput {
  content: string;
  brief: ResearchOutput;
  platform: ContentPlatform;
  brandName: string;
  websiteUrl: string;
}

export async function runSEOAgent(input: SEOInput): Promise<SEOOutput> {
  const plain = cleanContent(input.content, 3000);
  const primaryKw = input.brief.primaryKeywords[0] ?? input.brief.topic;

  const systemPrompt = `You are a senior SEO strategist with deep expertise in on-page optimization, content strategy, and SERP analysis.
Respond with ONLY valid JSON. No markdown, no fences, no extra text.`;

  const userPrompt = `Perform a comprehensive SEO analysis and generate optimization metadata.

Content (truncated): "${plain.slice(0, 1500)}..."

Content Brief:
- Topic: ${input.brief.topic}
- Primary Keywords: ${input.brief.primaryKeywords.join(', ')}
- Secondary Keywords: ${input.brief.secondaryKeywords.join(', ')}
- Search Intent: ${input.brief.searchIntent}
- Platform: ${input.platform}

Brand: ${input.brandName}
Website: ${input.websiteUrl}

Respond with this EXACT JSON:
{
  "metaTitle": "SEO-optimized title under 60 chars with primary keyword",
  "metaDescription": "Compelling meta description 120-155 chars with primary keyword and CTA",
  "primaryKeyword": "${primaryKw}",
  "secondaryKeywords": ["kw1", "kw2", "kw3"],
  "keywordDensity": 1.5,
  "headingStructure": [
    {"tag": "h1", "text": "heading text", "hasKeyword": true},
    {"tag": "h2", "text": "section heading", "hasKeyword": false}
  ],
  "internalLinkingSuggestions": ["Link to related post about X", "Add link to product page for Y"],
  "schemaRecommendations": ["Article schema", "FAQ schema for the FAQ section"],
  "seoScore": 75,
  "recommendations": [
    "Add primary keyword in first 100 words",
    "Increase keyword density to 1.5%",
    "Add alt text to all images",
    "Include structured data markup"
  ]
}`;

  const raw = await groqRequest([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ]);

  try {
    const result = JSON.parse(sanitizeJSONString(extractJSON(raw)));
    return normalizeSEOOutput(result, input.brief);
  } catch {
    return buildFallbackSEO(input.brief);
  }
}

function normalizeSEOOutput(raw: any, brief: ResearchOutput): SEOOutput {
  return {
    metaTitle: raw.metaTitle ?? brief.topic,
    metaDescription: raw.metaDescription ?? `Learn everything about ${brief.topic}. Expert insights and actionable strategies.`,
    primaryKeyword: raw.primaryKeyword ?? brief.primaryKeywords[0] ?? brief.topic,
    secondaryKeywords: Array.isArray(raw.secondaryKeywords) ? raw.secondaryKeywords : brief.secondaryKeywords,
    keywordDensity: typeof raw.keywordDensity === 'number' ? raw.keywordDensity : 1.0,
    headingStructure: Array.isArray(raw.headingStructure) ? raw.headingStructure.map((h: any) => ({
      tag: h.tag ?? 'h2',
      text: h.text ?? '',
      hasKeyword: h.hasKeyword ?? false,
    })) : [],
    internalLinkingSuggestions: Array.isArray(raw.internalLinkingSuggestions) ? raw.internalLinkingSuggestions : [],
    schemaRecommendations: Array.isArray(raw.schemaRecommendations) ? raw.schemaRecommendations : ['Article schema'],
    seoScore: typeof raw.seoScore === 'number' ? Math.min(100, Math.max(0, raw.seoScore)) : 70,
    recommendations: Array.isArray(raw.recommendations) ? raw.recommendations : [],
  };
}

function buildFallbackSEO(brief: ResearchOutput): SEOOutput {
  const primaryKw = brief.primaryKeywords[0] ?? brief.topic;
  return {
    metaTitle: `${brief.topic} — Complete Guide ${new Date().getFullYear()}`,
    metaDescription: `Master ${primaryKw} with our expert guide. Actionable strategies, proven tips, and real examples. Start optimizing today.`,
    primaryKeyword: primaryKw,
    secondaryKeywords: brief.secondaryKeywords,
    keywordDensity: 1.0,
    headingStructure: [],
    internalLinkingSuggestions: ['Link to related articles in your content hub', 'Add links to relevant product/service pages'],
    schemaRecommendations: ['Article schema', 'FAQ schema'],
    seoScore: 65,
    recommendations: [
      `Include "${primaryKw}" in the first paragraph`,
      'Add descriptive alt text to all images',
      'Ensure all H2s contain secondary keywords',
      'Add internal links to related content',
      'Include FAQ section with schema markup',
    ],
  };
}

export async function generateMetadata(brief: ResearchOutput, brandName: string): Promise<{
  metaTitle: string;
  metaDescription: string;
  ogTitle: string;
  ogDescription: string;
  twitterTitle: string;
  twitterDescription: string;
}> {
  const raw = await groqRequest([
    {
      role: 'system',
      content: 'You are an SEO and social media metadata expert. Respond with ONLY valid JSON, no extra text.',
    },
    {
      role: 'user',
      content: `Generate comprehensive metadata for:
Topic: ${brief.topic}
Primary Keyword: ${brief.primaryKeywords[0]}
Brand: ${brandName}

Return JSON:
{
  "metaTitle": "under 60 chars, keyword first",
  "metaDescription": "120-155 chars with keyword and CTA",
  "ogTitle": "engaging open graph title, 60-70 chars",
  "ogDescription": "compelling og description, 100-200 chars",
  "twitterTitle": "punchy twitter title under 70 chars",
  "twitterDescription": "twitter card description under 200 chars"
}`,
    },
  ]);

  try {
    return JSON.parse(sanitizeJSONString(extractJSON(raw)));
  } catch {
    const kw = brief.primaryKeywords[0] ?? brief.topic;
    return {
      metaTitle: `${kw} — ${brandName}`.slice(0, 60),
      metaDescription: `Discover expert insights on ${brief.topic}. Learn strategies that work in ${new Date().getFullYear()}.`.slice(0, 155),
      ogTitle: brief.topic.slice(0, 70),
      ogDescription: `Expert guide on ${brief.topic} by ${brandName}`.slice(0, 200),
      twitterTitle: brief.topic.slice(0, 70),
      twitterDescription: `Learn everything about ${brief.topic} — actionable insights from ${brandName}`.slice(0, 200),
    };
  }
}
