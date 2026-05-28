import { supabase } from '@/lib/supabase/client';

function fromRow(row: any) {
  if (!row) return null;
  return {
    $id: row.id,
    id: row.id,
    userId: row.user_id,
    companyId: row.company_id,
    content: row.content,
    analysis: row.analysis,
    mode: row.mode,
    contentScore: row.content_score,
    readability: row.readability,
    tone: row.tone,
    keyInsights: row.key_insights ?? [],
    improvements: row.improvements ?? [],
    wordCount: row.word_count,
    readingTime: row.reading_time,
    aiScore: row.ai_score,
    humanScore: row.human_score,
    humanizedVersion: row.humanized_version,
    outline: row.outline,
    suggestions: row.suggestions ?? [],
    contentGaps: row.content_gaps ?? [],
    summary: row.summary,
    relatedLinks: row.related_links ?? [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function checkCompanyDomain(domain: string) {
  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .eq('domain', domain)
    .maybeSingle();

  if (error) {
    console.error('Error checking company domain:', error);
    return null;
  }

  if (!data) return null;
  return { ...data, $id: data.id };
}

export async function createCompany(payload: { name: string; domain: string; users: string[] }) {
  const { data, error } = await supabase
    .from('companies')
    .insert({ name: payload.name, domain: payload.domain, users: payload.users })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return { ...data, $id: data.id };
}

export async function joinCompany(companyId: string, userId: string) {
  const { data: existing, error: fetchError } = await supabase
    .from('companies')
    .select('users')
    .eq('id', companyId)
    .single();

  if (fetchError) throw new Error(fetchError.message);

  const updatedUsers = [...new Set([...(existing.users ?? []), userId])];

  const { data, error } = await supabase
    .from('companies')
    .update({ users: updatedUsers })
    .eq('id', companyId)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return { ...data, $id: data.id };
}

export async function getCompanyIdbyUser(userId: string) {
  const { data, error } = await supabase
    .from('companies')
    .select('id')
    .contains('users', [userId])
    .maybeSingle();

  if (error) {
    console.error('Error getting company by user:', error);
    return null;
  }

  return data?.id ?? null;
}

export async function getDataByMatchedOrganazationID(companyId: string) {
  if (!companyId) return [];

  const { data, error } = await supabase
    .from('content')
    .select('*')
    .eq('company_id', companyId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching data by companyId:', error);
    return null;
  }

  return (data ?? []).map(fromRow).filter((d): d is NonNullable<ReturnType<typeof fromRow>> => d !== null);
}

export async function deleteCompanyHistoryItem(documentId: string) {
  const { error } = await supabase
    .from('content')
    .delete()
    .eq('id', documentId);

  if (error) {
    console.error('Error deleting company history item:', error);
    throw error;
  }

  return true;
}

export async function saveContentHistory(
  content: string,
  userId: string,
  analysis?: string,
  mode?: string,
  contentScore?: number,
  readability?: number,
  tone?: string,
  keyInsights?: string[],
  improvements?: string[],
  wordCount?: number,
  readingTime?: number,
  aiScore?: number,
  humanScore?: number,
  humanizedVersion?: string,
  outline?: { level: number; text: string }[],
  suggestions?: string[],
  contentGaps?: string[],
  summary?: string,
  relatedLinks?: { title: string; url: string; description: string }[],
  companyId?: string
) {
  const safeInt = (val: any) => (typeof val === 'number' && !isNaN(val) ? Math.round(val) : null);

  const { data, error } = await supabase
    .from('content')
    .insert({
      user_id: userId,
      content,
      analysis: analysis ?? null,
      mode: mode ?? null,
      content_score: contentScore ?? null,
      readability: readability != null ? String(readability) : null,
      tone: tone ?? null,
      key_insights: keyInsights ?? [],
      improvements: improvements ?? [],
      word_count: wordCount ?? null,
      reading_time: readingTime ?? null,
      ai_score: safeInt(aiScore),
      human_score: safeInt(humanScore),
      humanized_version: humanizedVersion ?? null,
      outline: outline ?? null,
      suggestions: suggestions ?? [],
      content_gaps: contentGaps ?? [],
      summary: summary ?? null,
      related_links: relatedLinks ?? [],
      company_id: companyId ?? null,
    })
    .select()
    .single();

  if (error) {
    console.error('Error saving content history:', error);
    throw error;
  }

  return fromRow(data);
}
