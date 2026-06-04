import { runResearchAgent } from './research';
import { runSEOAgent } from './seo';
import { runOptimizationAgent } from './optimization';
import { groqRequest } from '@/lib/groq';
import {
  saveAgentRun,
  updateAgentRun,
  saveContentBrief,
  updateContentBrief,
} from '@/lib/brand/profile';
import type {
  BrandProfile,
  ContentPlatform,
  OrchestratorResult,
  AgentRunStep,
  ResearchOutput,
  SEOOutput,
  OptimizationOutput,
  WorkflowType,
} from '@/types/agents';

interface OrchestratorInput {
  topic: string;
  platform: ContentPlatform;
  allPlatforms?: string[];
  brandProfile: BrandProfile;
  userId: string;
  targetWordCount?: number;
  workflowType?: WorkflowType;
}

function makeStep(name: string): AgentRunStep {
  return { name, status: 'running', startedAt: new Date().toISOString() };
}

function completeStep(step: AgentRunStep, summary?: string): AgentRunStep {
  const completedAt = new Date().toISOString();
  const durationMs = step.startedAt
    ? new Date(completedAt).getTime() - new Date(step.startedAt).getTime()
    : 0;
  return { ...step, status: 'completed', completedAt, durationMs, outputSummary: summary };
}

function failStep(step: AgentRunStep, error: string): AgentRunStep {
  return { ...step, status: 'failed', error };
}

export async function runFullPipeline(input: OrchestratorInput): Promise<OrchestratorResult> {
  const { topic, platform, brandProfile, userId, targetWordCount = 1500 } = input;
  const allPlatforms = input.allPlatforms ?? [platform];
  const workflowType = input.workflowType ?? 'full_pipeline';
  const steps: AgentRunStep[] = [];

  const agentRunId = await saveAgentRun({
    userId,
    companyId: brandProfile.companyId,
    workflowType,
    topic,
    platform,
    metadata: { allPlatforms },
  });

  if (!agentRunId) {
    return { agentRunId: '', status: 'failed', steps: [], error: 'Failed to create agent run record' };
  }

  async function syncSteps() {
    await updateAgentRun(agentRunId!, { steps, status: 'running' });
  }

  // ─── Step 1: Research ───────────────────────────────────────────────────────
  let researchOutput: ResearchOutput | null = null;
  {
    const step = makeStep('Research Agent');
    steps.push(step);
    await updateAgentRun(agentRunId, { currentStep: 'Research Agent', steps, status: 'running' });

    try {
      researchOutput = await runResearchAgent({
        topic,
        industry: brandProfile.industry,
        targetAudience: brandProfile.targetAudience,
        brandVoiceTone: brandProfile.brandVoice.tone,
        contentCategories: brandProfile.contentCategories,
        platform,
      });
      steps[steps.length - 1] = completeStep(step, `Brief created: ${researchOutput.primaryKeywords.slice(0, 3).join(', ')}`);
    } catch (err: any) {
      steps[steps.length - 1] = failStep(step, err?.message ?? 'Research failed');
      await updateAgentRun(agentRunId, { steps, status: 'failed', error: 'Research agent failed', completedAt: new Date().toISOString() });
      return { agentRunId, status: 'failed', steps, error: 'Research agent failed' };
    }
    await syncSteps();
  }

  // ─── Step 2: Save Brief ─────────────────────────────────────────────────────
  let briefId: string | null = null;
  if (researchOutput) {
    briefId = await saveContentBrief({
      userId,
      companyId: brandProfile.companyId,
      agentRunId,
      topic: researchOutput.topic,
      searchIntent: researchOutput.searchIntent,
      primaryKeywords: researchOutput.primaryKeywords,
      secondaryKeywords: researchOutput.secondaryKeywords,
      faqs: researchOutput.faqs,
      competitorInsights: researchOutput.competitorInsights,
      contentOutline: researchOutput.contentOutline,
      targetWordCount,
      tone: brandProfile.brandVoice.tone,
      platform,
    });
  }

  // ─── Step 3: Generate Content ────────────────────────────────────────────────
  let generatedContent = '';
  {
    const step = makeStep('Content Generation Agent');
    steps.push(step);
    await updateAgentRun(agentRunId, { currentStep: 'Content Generation Agent', steps });

    try {
      generatedContent = await generateContent({
        brief: researchOutput!,
        brandVoice: brandProfile.brandVoice,
        platform,
        targetWordCount,
        brandName: brandProfile.brandName,
        targetAudience: brandProfile.targetAudience,
      });
      const wc = generatedContent.split(/\s+/).filter(Boolean).length;
      steps[steps.length - 1] = completeStep(step, `${wc} words generated`);
    } catch (err: any) {
      steps[steps.length - 1] = failStep(step, err?.message ?? 'Generation failed');
      await updateAgentRun(agentRunId, { steps, status: 'failed', error: 'Content generation failed', completedAt: new Date().toISOString() });
      return { agentRunId, status: 'failed', steps, error: 'Content generation failed' };
    }
    await syncSteps();
  }

  // ─── Step 4: SEO Analysis ────────────────────────────────────────────────────
  let seoOutput: SEOOutput | null = null;
  {
    const step = makeStep('SEO Agent');
    steps.push(step);
    await updateAgentRun(agentRunId, { currentStep: 'SEO Agent', steps });

    try {
      seoOutput = await runSEOAgent({
        content: generatedContent,
        brief: researchOutput!,
        platform,
        brandName: brandProfile.brandName,
        websiteUrl: brandProfile.websiteUrl,
      });
      steps[steps.length - 1] = completeStep(step, `SEO Score: ${seoOutput.seoScore}/100`);
    } catch (err: any) {
      steps[steps.length - 1] = failStep(step, err?.message ?? 'SEO analysis failed');
    }
    await syncSteps();
  }

  // ─── Step 5: Optimize ────────────────────────────────────────────────────────
  let optimizationOutput: OptimizationOutput | null = null;
  if (seoOutput) {
    const step = makeStep('Optimization Agent');
    steps.push(step);
    await updateAgentRun(agentRunId, { currentStep: 'Optimization Agent', steps });

    try {
      optimizationOutput = await runOptimizationAgent({
        content: generatedContent,
        seoReport: seoOutput,
        brandVoice: brandProfile.brandVoice,
        platform,
      });
      if (optimizationOutput.optimizedContent) {
        generatedContent = optimizationOutput.optimizedContent;
      }
      steps[steps.length - 1] = completeStep(step, `Overall Score: ${optimizationOutput.overallScore}/100`);
    } catch (err: any) {
      steps[steps.length - 1] = failStep(step, err?.message ?? 'Optimization failed');
    }
    await syncSteps();
  }

  // ─── Finalize ────────────────────────────────────────────────────────────────
  if (briefId) {
    await updateContentBrief(briefId, {
      status: 'complete',
      generatedContent,
      seoReport: seoOutput ?? undefined,
      optimizationNotes: optimizationOutput?.improvements.map(i => `[${i.category}] ${i.fix}`) ?? [],
    });
  }

  await updateAgentRun(agentRunId, {
    status: 'completed',
    steps,
    currentStep: 'Complete',
    completedAt: new Date().toISOString(),
    resultBriefId: briefId ?? undefined,
  });

  return {
    agentRunId,
    status: 'completed',
    brief: researchOutput
      ? {
          id: briefId ?? undefined,
          userId,
          companyId: brandProfile.companyId,
          agentRunId,
          topic: researchOutput.topic,
          searchIntent: researchOutput.searchIntent,
          primaryKeywords: researchOutput.primaryKeywords,
          secondaryKeywords: researchOutput.secondaryKeywords,
          faqs: researchOutput.faqs,
          competitorInsights: researchOutput.competitorInsights,
          contentOutline: researchOutput.contentOutline,
          targetWordCount,
          tone: brandProfile.brandVoice.tone,
          platform,
          status: 'complete',
          generatedContent,
          seoReport: seoOutput ?? undefined,
        }
      : undefined,
    content: generatedContent,
    seoReport: seoOutput ?? undefined,
    optimizedContent: optimizationOutput?.optimizedContent,
    improvements: optimizationOutput?.improvements,
    steps,
  };
}

async function generateContent(params: {
  brief: ResearchOutput;
  brandVoice: BrandProfile['brandVoice'];
  platform: ContentPlatform;
  targetWordCount: number;
  brandName: string;
  targetAudience: string;
}): Promise<string> {
  const { brief, brandVoice, platform, targetWordCount, brandName, targetAudience } = params;

  const outlineStr = brief.contentOutline
    .map(s => `${'#'.repeat(s.level)} ${s.heading}\n${s.keyPoints.map(p => `- ${p}`).join('\n')}`)
    .join('\n\n');

  const platformInstructions: Record<ContentPlatform, string> = {
    blog: `Write a comprehensive blog post of ~${targetWordCount} words. Use Markdown with proper headings, subheadings, bullet points, and a strong intro and conclusion.`,
    linkedin: `Write a LinkedIn post of 150-300 words. Start with a hook, use line breaks for readability, include 3-5 hashtags at the end.`,
    twitter: `Write a Twitter/X thread of 8-12 tweets. Number each tweet. Start with a hook tweet, build value progressively, end with a CTA.`,
    facebook: `Write a Facebook post of 100-250 words. Conversational tone, include a question to drive comments, add relevant emojis.`,
    instagram: `Write an Instagram caption of 50-150 words. Start strong, use line breaks, add 10-15 relevant hashtags at the end.`,
    landing_page: `Write landing page copy of ~${targetWordCount} words. Lead with benefits, add social proof points, include clear CTAs throughout.`,
    email: `Write an email of 200-400 words. Compelling subject line at the top, personalized opening, clear value proposition, single CTA at the end.`,
  };

  const prompt = `You are a world-class content writer for ${brandName}.

${platformInstructions[platform]}

Topic: ${brief.topic}
Target Audience: ${targetAudience}
Tone: ${brandVoice.tone}
Voice Adjectives: ${brandVoice.adjectives.join(', ')}
Primary Keywords to Include: ${brief.primaryKeywords.join(', ')}
Secondary Keywords to Weave In: ${brief.secondaryKeywords.slice(0, 5).join(', ')}

Content Outline to Follow:
${outlineStr}

FAQs to Address:
${brief.faqs.slice(0, 3).map(f => `- ${f}`).join('\n')}

Write the full content now:`;

  const content = await groqRequest(
    [
      {
        role: 'system',
        content: `You are an expert content writer for ${brandName}. Write in a ${brandVoice.tone} tone. Use Markdown formatting. Focus on value, clarity, and SEO.`,
      },
      { role: 'user', content: prompt },
    ],
    2
  );

  return content;
}
