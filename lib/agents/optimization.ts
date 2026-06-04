import { groqRequest, extractJSON, sanitizeJSONString, cleanContent } from '@/lib/groq';
import type { OptimizationOutput, OptimizationImprovement, SEOOutput, BrandVoice, ContentPlatform } from '@/types/agents';

interface OptimizationInput {
  content: string;
  seoReport: SEOOutput;
  brandVoice: BrandVoice;
  platform: ContentPlatform;
  analysisResult?: {
    contentScore?: number;
    readability?: number;
    tone?: string;
    improvements?: string[];
  };
}

export async function runOptimizationAgent(input: OptimizationInput): Promise<OptimizationOutput> {
  const plain = cleanContent(input.content, 2500);
  const issues = [
    ...input.seoReport.recommendations.slice(0, 3),
    ...(input.analysisResult?.improvements ?? []).slice(0, 3),
  ].join('\n- ');

  const systemPrompt = `You are an elite content optimization specialist and brand strategist.
You rewrite and improve content to maximize SEO performance, readability, engagement, and brand consistency.
Respond with ONLY valid JSON. No markdown fences, no extra text.`;

  const userPrompt = `Optimize the following content and provide before/after improvements.

Original Content (truncated): "${plain.slice(0, 1200)}..."

Optimization Requirements:
- Primary Keyword: ${input.seoReport.primaryKeyword}
- Target Keyword Density: ~${input.seoReport.keywordDensity}%
- Brand Tone: ${input.brandVoice.tone}
- Brand Adjectives: ${input.brandVoice.adjectives.join(', ')}
- Platform: ${input.platform}
- SEO Score to Beat: ${input.seoReport.seoScore}

Known Issues to Fix:
- ${issues}

Return JSON with this EXACT structure:
{
  "optimizedContent": "The fully rewritten and improved content in Markdown format",
  "improvements": [
    {
      "category": "seo",
      "issue": "Primary keyword missing from first paragraph",
      "fix": "Added keyword to opening sentence",
      "impact": "high"
    },
    {
      "category": "readability",
      "issue": "Sentences average 32 words — too long",
      "fix": "Split into shorter sentences with clearer structure",
      "impact": "medium"
    },
    {
      "category": "engagement",
      "issue": "Weak opening hook",
      "fix": "Rewrote intro with a compelling question and stat",
      "impact": "high"
    },
    {
      "category": "brand",
      "issue": "Tone not aligned with brand voice",
      "fix": "Adjusted language to be more authoritative yet approachable",
      "impact": "medium"
    }
  ],
  "overallScore": 85,
  "seoScore": 82,
  "readabilityScore": 88,
  "engagementScore": 79,
  "brandScore": 91
}`;

  const raw = await groqRequest([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ]);

  try {
    const result = JSON.parse(sanitizeJSONString(extractJSON(raw)));
    return normalizeOptimizationOutput(result, input.content);
  } catch {
    return buildFallbackOptimization(input.content, input.seoReport);
  }
}

function normalizeOptimizationOutput(raw: any, originalContent: string): OptimizationOutput {
  const improvements: OptimizationImprovement[] = Array.isArray(raw.improvements)
    ? raw.improvements.map((imp: any) => ({
        category: (['seo', 'readability', 'engagement', 'brand', 'quality'].includes(imp.category)
          ? imp.category
          : 'quality') as OptimizationImprovement['category'],
        issue: imp.issue ?? '',
        fix: imp.fix ?? '',
        impact: (['high', 'medium', 'low'].includes(imp.impact) ? imp.impact : 'medium') as OptimizationImprovement['impact'],
      }))
    : [];

  return {
    optimizedContent: raw.optimizedContent ?? originalContent,
    improvements,
    overallScore: clampScore(raw.overallScore),
    seoScore: clampScore(raw.seoScore),
    readabilityScore: clampScore(raw.readabilityScore),
    engagementScore: clampScore(raw.engagementScore),
    brandScore: clampScore(raw.brandScore),
  };
}

function buildFallbackOptimization(originalContent: string, seoReport: SEOOutput): OptimizationOutput {
  return {
    optimizedContent: originalContent,
    improvements: [
      {
        category: 'seo',
        issue: 'SEO optimization analysis pending',
        fix: 'Apply SEO recommendations from the SEO report',
        impact: 'high',
      },
      {
        category: 'readability',
        issue: 'Readability assessment needed',
        fix: 'Break long paragraphs and use subheadings',
        impact: 'medium',
      },
    ],
    overallScore: 70,
    seoScore: seoReport.seoScore,
    readabilityScore: 70,
    engagementScore: 65,
    brandScore: 75,
  };
}

function clampScore(val: any): number {
  if (typeof val !== 'number' || isNaN(val)) return 70;
  return Math.min(100, Math.max(0, Math.round(val)));
}

export async function generatePlatformVariants(content: string, platforms: ContentPlatform[]): Promise<Record<string, string>> {
  const plain = cleanContent(content, 2000);
  const platformList = platforms.join(', ');

  const raw = await groqRequest([
    {
      role: 'system',
      content: 'You are a multi-platform content adaptation expert. Respond with ONLY valid JSON.',
    },
    {
      role: 'user',
      content: `Adapt this content for different platforms: ${platformList}

Original Content: "${plain.slice(0, 1000)}..."

For each platform, produce adapted content appropriate to its format and audience.
Return JSON:
{
  ${platforms.map(p => `"${p}": "adapted content for ${p}"`).join(',\n  ')}
}`,
    },
  ]);

  try {
    return JSON.parse(sanitizeJSONString(extractJSON(raw)));
  } catch {
    const fallback: Record<string, string> = {};
    platforms.forEach(p => { fallback[p] = plain.slice(0, 500); });
    return fallback;
  }
}

export async function strengthenHook(content: string, tone: string): Promise<string> {
  const raw = await groqRequest([
    {
      role: 'system',
      content: 'You are an expert copywriter specializing in powerful hooks and openings. Respond with ONLY the improved opening paragraph, no extra text.',
    },
    {
      role: 'user',
      content: `Rewrite the opening paragraph of this content to be more compelling.
Use a ${tone} tone. Start with a surprising stat, provocative question, or bold statement.

Content: "${content.slice(0, 500)}..."

Write ONLY the improved opening paragraph (3-5 sentences):`,
    },
  ]);
  return raw.trim();
}

export async function improveCallToAction(content: string, platform: ContentPlatform, brandName: string): Promise<string> {
  const raw = await groqRequest([
    {
      role: 'system',
      content: 'You are a conversion optimization expert. Respond with ONLY the improved CTA text.',
    },
    {
      role: 'user',
      content: `Write a compelling call-to-action for ${platform} content.
Brand: ${brandName}
Platform: ${platform}
Content Context: "${content.slice(-300)}..."

Write ONLY 1-3 sentences for a strong CTA that drives action:`,
    },
  ]);
  return raw.trim();
}
