'use server';

import { supabaseAdmin as supabase } from '@/lib/supabase/admin';
import type { BrandProfile } from '@/types/agents';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function toRow(p: Partial<BrandProfile>) {
  return {
    user_id: p.userId,
    company_id: p.companyId || null,
    brand_name: p.brandName,
    website_url: p.websiteUrl,
    industry: p.industry,
    target_audience: p.targetAudience,
    brand_voice: p.brandVoice,
    brand_colors: p.brandColors ?? [],
    social_accounts: p.socialAccounts ?? {},
    content_categories: p.contentCategories ?? [],
    posting_schedule: p.postingSchedule,
    is_setup_complete: p.isSetupComplete ?? false,
    updated_at: new Date().toISOString(),
  };
}

function fromRow(row: any): BrandProfile | null {
  if (!row) return null;
  return {
    id: row.id,
    userId: row.user_id,
    companyId: row.company_id,
    brandName: row.brand_name ?? '',
    websiteUrl: row.website_url ?? '',
    industry: row.industry ?? '',
    targetAudience: row.target_audience ?? '',
    brandVoice: row.brand_voice ?? { tone: 'professional', adjectives: [], persona: '', avoidWords: [] },
    brandColors: row.brand_colors ?? [],
    socialAccounts: row.social_accounts ?? {},
    contentCategories: row.content_categories ?? [],
    postingSchedule: row.posting_schedule ?? { frequency: 'weekly', days: [], time: '09:00', timezone: 'UTC' },
    isSetupComplete: row.is_setup_complete ?? false,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getBrandProfile(userId: string): Promise<BrandProfile | null> {
  const { data, error } = await supabase
    .from('brand_profiles')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error('Error fetching brand profile:', error);
    return null;
  }
  return fromRow(data);
}

export async function getBrandProfileByCompany(companyId: string): Promise<BrandProfile | null> {
  if (!companyId) return null;
  const { data, error } = await supabase
    .from('brand_profiles')
    .select('*')
    .eq('company_id', companyId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error('Error fetching brand profile by company:', error);
    return null;
  }
  return fromRow(data);
}

export async function saveBrandProfile(profile: Omit<BrandProfile, 'id' | 'createdAt' | 'updatedAt'>): Promise<BrandProfile> {
  const existing = await getBrandProfile(profile.userId);

  if (existing?.id) {
    const { data, error } = await supabase
      .from('brand_profiles')
      .update(toRow(profile))
      .eq('id', existing.id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return fromRow(data)!;
  }

  const { data, error } = await supabase
    .from('brand_profiles')
    .insert({ ...toRow(profile), created_at: new Date().toISOString() })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return fromRow(data)!;
}

export async function updateBrandProfile(id: string, updates: Partial<BrandProfile>): Promise<BrandProfile | null> {
  if (!id || !UUID_RE.test(id)) return null;
  const row: any = {};
  if (updates.brandName !== undefined) row.brand_name = updates.brandName;
  if (updates.websiteUrl !== undefined) row.website_url = updates.websiteUrl;
  if (updates.industry !== undefined) row.industry = updates.industry;
  if (updates.targetAudience !== undefined) row.target_audience = updates.targetAudience;
  if (updates.brandVoice !== undefined) row.brand_voice = updates.brandVoice;
  if (updates.brandColors !== undefined) row.brand_colors = updates.brandColors;
  if (updates.socialAccounts !== undefined) row.social_accounts = updates.socialAccounts;
  if (updates.contentCategories !== undefined) row.content_categories = updates.contentCategories;
  if (updates.postingSchedule !== undefined) row.posting_schedule = updates.postingSchedule;
  if (updates.isSetupComplete !== undefined) row.is_setup_complete = updates.isSetupComplete;
  if (updates.companyId !== undefined) row.company_id = updates.companyId || null;
  row.updated_at = new Date().toISOString();

  const { data, error } = await supabase
    .from('brand_profiles')
    .update(row)
    .eq('id', id)
    .select()
    .single();

  if (error) { console.error('Error updating brand profile:', error); return null; }
  return fromRow(data);
}

export async function saveAgentRun(run: {
  userId: string;
  companyId?: string | null;
  workflowType: string;
  topic?: string;
  platform?: string;
  metadata?: Record<string, any>;
}): Promise<string | null> {
  const { data, error } = await supabase
    .from('agent_runs')
    .insert({
      user_id: run.userId,
      company_id: run.companyId || null,
      workflow_type: run.workflowType,
      status: 'pending',
      steps: [],
      topic: run.topic,
      platform: run.platform,
      metadata: run.metadata ?? {},
      started_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    })
    .select('id')
    .single();

  if (error) { console.error('Error saving agent run:', error); return null; }
  return data.id;
}

export async function updateAgentRun(id: string, updates: {
  status?: string;
  currentStep?: string;
  steps?: any[];
  completedAt?: string;
  error?: string;
  resultBriefId?: string;
  resultContentId?: string;
}): Promise<void> {
  if (!id || !UUID_RE.test(id)) return;
  const row: any = {};
  if (updates.status !== undefined) row.status = updates.status;
  if (updates.currentStep !== undefined) row.current_step = updates.currentStep;
  if (updates.steps !== undefined) row.steps = updates.steps;
  if (updates.completedAt !== undefined) row.completed_at = updates.completedAt;
  if (updates.error !== undefined) row.error = updates.error;
  if (updates.resultBriefId !== undefined) row.result_brief_id = updates.resultBriefId;
  if (updates.resultContentId !== undefined) row.result_content_id = updates.resultContentId;

  await supabase.from('agent_runs').update(row).eq('id', id);
}

export async function getAgentRuns(userId: string, limit = 20): Promise<any[]> {
  const { data, error } = await supabase
    .from('agent_runs')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) { console.error('Error fetching agent runs:', error); return []; }
  return (data ?? []).map((row: any) => ({
    id: row.id,
    userId: row.user_id,
    companyId: row.company_id,
    workflowType: row.workflow_type,
    status: row.status,
    currentStep: row.current_step,
    steps: row.steps ?? [],
    topic: row.topic,
    platform: row.platform,
    startedAt: row.started_at,
    completedAt: row.completed_at,
    error: row.error,
    resultBriefId: row.result_brief_id,
    resultContentId: row.result_content_id,
    metadata: row.metadata ?? {},
    createdAt: row.created_at,
  }));
}

export async function saveContentBrief(brief: {
  userId: string;
  companyId?: string | null;
  agentRunId?: string;
  topic: string;
  searchIntent: string;
  primaryKeywords: string[];
  secondaryKeywords: string[];
  faqs: string[];
  competitorInsights: string[];
  contentOutline: any[];
  targetWordCount: number;
  tone: string;
  platform: string;
}): Promise<string | null> {
  const { data, error } = await supabase
    .from('content_briefs')
    .insert({
      user_id: brief.userId,
      company_id: brief.companyId || null,
      agent_run_id: brief.agentRunId || null,
      topic: brief.topic,
      search_intent: brief.searchIntent,
      primary_keywords: brief.primaryKeywords,
      secondary_keywords: brief.secondaryKeywords,
      faqs: brief.faqs,
      competitor_insights: brief.competitorInsights,
      content_outline: brief.contentOutline,
      target_word_count: brief.targetWordCount,
      tone: brief.tone,
      platform: brief.platform,
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select('id')
    .single();

  if (error) { console.error('Error saving content brief:', error); return null; }
  return data.id;
}

export async function updateContentBrief(id: string, updates: {
  status?: string;
  generatedContent?: string;
  seoReport?: any;
  optimizationNotes?: string[];
}): Promise<void> {
  if (!id || !UUID_RE.test(id)) return;
  const row: any = { updated_at: new Date().toISOString() };
  if (updates.status !== undefined) row.status = updates.status;
  if (updates.generatedContent !== undefined) row.generated_content = updates.generatedContent;
  if (updates.seoReport !== undefined) row.seo_report = updates.seoReport;
  if (updates.optimizationNotes !== undefined) row.optimization_notes = updates.optimizationNotes;
  await supabase.from('content_briefs').update(row).eq('id', id);
}
