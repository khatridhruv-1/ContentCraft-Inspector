import { groqRequest, extractJSON, sanitizeJSONString } from '@/lib/groq';
import type { ResearchOutput, BrandProfile, ContentPlatform } from '@/types/agents';

interface ResearchInput {
  topic: string;
  industry: string;
  targetAudience: string;
  brandVoiceTone: string;
  contentCategories: string[];
  platform: ContentPlatform;
  competitorWebsites?: string[];
}

const PLATFORM_GUIDANCE: Record<ContentPlatform, string> = {
  blog: 'long-form evergreen content, 1500-3000 words, SEO-optimized',
  linkedin: 'professional insights, 150-300 words, thought leadership',
  twitter: 'punchy threads, 5-15 tweets, conversational',
  facebook: 'community engagement, 100-250 words, shareable',
  instagram: 'visual captions, 50-150 words, hashtag-rich',
  landing_page: 'conversion-focused copy, benefits-driven, clear CTA',
  email: 'personalized, subject-line driven, 200-500 words',
};

export async function runResearchAgent(input: ResearchInput): Promise<ResearchOutput> {
  const platformNote = PLATFORM_GUIDANCE[input.platform] ?? 'general content';

  const systemPrompt = `You are an expert content research agent and digital marketing strategist.
Your job is to research topics deeply and produce structured content briefs that maximize SEO reach and audience engagement.
Always respond with ONLY valid JSON. No markdown fences, no extra text.`;

  const userPrompt = `Research the following topic and produce a comprehensive content brief.

Topic: "${input.topic}"
Industry: ${input.industry}
Target Audience: ${input.targetAudience}
Brand Voice Tone: ${input.brandVoiceTone}
Content Platform: ${input.platform} (${platformNote})
Content Categories: ${input.contentCategories.join(', ')}

Produce JSON in this EXACT structure:
{
  "topic": "refined topic title",
  "searchIntent": "informational|navigational|transactional|commercial",
  "primaryKeywords": ["keyword1", "keyword2", "keyword3"],
  "secondaryKeywords": ["kw4", "kw5", "kw6", "kw7", "kw8"],
  "faqs": ["FAQ question 1?", "FAQ question 2?", "FAQ question 3?", "FAQ question 4?"],
  "competitorInsights": ["insight about what competitors cover", "gap they miss", "angle to differentiate"],
  "contentOutline": [
    {"level": 1, "heading": "Main Title", "keyPoints": ["point1", "point2"]},
    {"level": 2, "heading": "Section 1", "keyPoints": ["point1", "point2"]},
    {"level": 2, "heading": "Section 2", "keyPoints": ["point1", "point2"]},
    {"level": 2, "heading": "Section 3", "keyPoints": ["point1", "point2"]},
    {"level": 2, "heading": "Conclusion", "keyPoints": ["point1", "point2"]}
  ],
  "trendingAngles": ["angle1", "angle2", "angle3"],
  "contentGaps": ["gap1 that competitors miss", "gap2", "gap3"]
}`;

  const raw = await groqRequest([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ]);

  try {
    const result = JSON.parse(sanitizeJSONString(extractJSON(raw)));
    return normalizeResearchOutput(result, input.topic);
  } catch {
    return buildFallbackResearch(input.topic, input.industry);
  }
}

function normalizeResearchOutput(raw: any, topic: string): ResearchOutput {
  return {
    topic: raw.topic ?? topic,
    searchIntent: raw.searchIntent ?? 'informational',
    primaryKeywords: Array.isArray(raw.primaryKeywords) ? raw.primaryKeywords : [],
    secondaryKeywords: Array.isArray(raw.secondaryKeywords) ? raw.secondaryKeywords : [],
    faqs: Array.isArray(raw.faqs) ? raw.faqs : [],
    competitorInsights: Array.isArray(raw.competitorInsights) ? raw.competitorInsights : [],
    contentOutline: Array.isArray(raw.contentOutline) ? raw.contentOutline.map((s: any) => ({
      level: s.level ?? 2,
      heading: s.heading ?? '',
      keyPoints: Array.isArray(s.keyPoints) ? s.keyPoints : [],
    })) : [],
    trendingAngles: Array.isArray(raw.trendingAngles) ? raw.trendingAngles : [],
    contentGaps: Array.isArray(raw.contentGaps) ? raw.contentGaps : [],
  };
}

function buildFallbackResearch(topic: string, industry: string): ResearchOutput {
  return {
    topic,
    searchIntent: 'informational',
    primaryKeywords: [topic.toLowerCase(), industry.toLowerCase(), 'guide'],
    secondaryKeywords: ['tips', 'best practices', 'how to', 'strategy', 'insights'],
    faqs: [
      `What is ${topic}?`,
      `Why is ${topic} important?`,
      `How to implement ${topic}?`,
      `What are the benefits of ${topic}?`,
    ],
    competitorInsights: [
      'Most content focuses on basics',
      'Advanced implementation examples are rare',
      'Actionable step-by-step guides have high engagement',
    ],
    contentOutline: [
      { level: 1, heading: `The Complete Guide to ${topic}`, keyPoints: ['Overview', 'Why it matters'] },
      { level: 2, heading: 'Introduction', keyPoints: ['Context', 'Problem statement'] },
      { level: 2, heading: 'Key Concepts', keyPoints: ['Core ideas', 'Definitions'] },
      { level: 2, heading: 'Implementation', keyPoints: ['Step-by-step', 'Best practices'] },
      { level: 2, heading: 'Conclusion', keyPoints: ['Summary', 'Next steps'] },
    ],
    trendingAngles: [`${topic} in 2025`, `AI-powered ${topic}`, `${topic} for beginners`],
    contentGaps: ['Practical examples', 'ROI metrics', 'Tool comparisons'],
  };
}

export async function generateImagePrompt(brief: {
  topic: string;
  platform: ContentPlatform;
  brandColors: string[];
  tone: string;
}): Promise<string> {
  const platformDimensions: Record<ContentPlatform, string> = {
    blog: '1200x630px hero image',
    linkedin: '1200x627px professional image',
    twitter: '1200x675px engaging visual',
    facebook: '1200x630px shareable image',
    instagram: '1080x1080px square or 1080x1350px portrait',
    landing_page: '1920x1080px full-width hero',
    email: '600x300px email banner',
  };

  const raw = await groqRequest([
    {
      role: 'system',
      content: 'You are an expert creative director specializing in AI image generation prompts for marketing content. Respond with ONLY the image generation prompt, no extra text.',
    },
    {
      role: 'user',
      content: `Create a detailed image generation prompt for:
Topic: ${brief.topic}
Platform: ${brief.platform} (${platformDimensions[brief.platform]})
Brand Colors: ${brief.brandColors.join(', ')}
Tone: ${brief.tone}

Write a 2-3 sentence detailed prompt that specifies style, mood, colors, and visual elements. Make it specific and actionable for DALL-E or Stable Diffusion.`,
    },
  ]);

  return raw.trim();
}
