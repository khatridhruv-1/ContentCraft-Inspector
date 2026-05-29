"use server";

import { supabase } from '@/lib/supabase/client';

function toRow(data: Record<string, any>) {
  return {
    user_id: data.userId,
    company_id: data.companyId || null,
    content: data.content ?? null,
    analysis: data.analysis ?? null,
    mode: data.mode ?? null,
    content_score: data.contentScore ?? null,
    readability: data.readability != null ? String(data.readability) : null,
    tone: data.tone ?? null,
    key_insights: data.keyInsights ?? [],
    improvements: data.improvements ?? [],
    word_count: data.wordCount ?? null,
    reading_time: data.readingTime ?? null,
    ai_score: data.aiScore != null ? Math.round(data.aiScore) : null,
    human_score: data.humanScore != null ? Math.round(data.humanScore) : null,
    humanized_version: data.humanizedVersion ?? null,
    outline: data.outline ?? null,
    suggestions: data.suggestions ?? [],
    content_gaps: data.contentGaps ?? [],
    summary: data.summary ?? null,
    related_links: data.relatedLinks ?? [],
  };
}

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

export async function saveContent(
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
  try {
    const { data, error } = await supabase
      .from('content')
      .insert(toRow({
        userId, content, analysis, mode, contentScore, readability, tone,
        keyInsights, improvements, wordCount, readingTime, aiScore, humanScore,
        humanizedVersion, outline, suggestions, contentGaps, summary, relatedLinks, companyId,
      }))
      .select()
      .single();

    if (error) throw error;
    return fromRow(data);
  } catch (error) {
    console.error('Error saving content:', error);
    throw error;
  }
}

export async function fetchHistory(userId: string, page: number, limit: number) {
  try {
    const offset = (page - 1) * limit;

    const { data, error, count } = await supabase
      .from('content')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return {
      documents: (data ?? []).map(fromRow).filter((d): d is NonNullable<ReturnType<typeof fromRow>> => d !== null),
      total: count ?? 0,
    };
  } catch (error) {
    console.error('Error fetching history:', error);
    throw error;
  }
}

export async function deleteHistoryItem(documentId: string) {
  try {
    const { error } = await supabase
      .from('content')
      .delete()
      .eq('id', documentId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting item:', error);
    throw error;
  }
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function updateContent(
  documentId: string,
  {
    input,
    analysis,
    contentScore,
    readability,
    tone,
    keyInsights,
    improvements,
    wordCount,
    readingTime,
    aiScore,
    humanScore,
    humanizedVersion,
    outline,
    suggestions,
    contentGaps,
    summary,
    relatedLinks,
    companyId,
  }: {
    input?: string;
    analysis?: string;
    contentScore?: number;
    readability?: string;
    tone?: string;
    keyInsights?: string[];
    improvements?: string[];
    wordCount?: number;
    readingTime?: number;
    aiScore?: number;
    humanScore?: number;
    humanizedVersion?: string;
    outline?: { level: number; text: string }[];
    suggestions?: string[];
    contentGaps?: string[];
    summary?: string;
    relatedLinks?: { url: string; title: string; content: string; score: number; raw_content: string | null }[];
    companyId?: any;
  }
) {
  if (!documentId || !UUID_RE.test(documentId)) return null;
  try {
    const updates: Record<string, any> = { updated_at: new Date().toISOString() };

    if (input !== undefined) updates.content = input;
    if (analysis !== undefined) updates.analysis = analysis;
    if (contentScore !== undefined) updates.content_score = Math.round(contentScore);
    if (readability !== undefined) updates.readability = readability;
    if (tone !== undefined) updates.tone = tone;
    if (keyInsights !== undefined) updates.key_insights = keyInsights;
    if (improvements !== undefined) updates.improvements = improvements;
    if (wordCount !== undefined) updates.word_count = wordCount;
    if (readingTime !== undefined) updates.reading_time = readingTime;
    if (aiScore !== undefined) updates.ai_score = Math.round(aiScore);
    if (humanScore !== undefined) updates.human_score = Math.round(humanScore);
    if (humanizedVersion !== undefined) updates.humanized_version = humanizedVersion;
    if (outline !== undefined) updates.outline = outline;
    if (suggestions !== undefined) updates.suggestions = suggestions;
    if (contentGaps !== undefined) updates.content_gaps = contentGaps;
    if (summary !== undefined) updates.summary = summary;
    if (relatedLinks !== undefined) updates.related_links = relatedLinks;
    if (companyId !== undefined) updates.company_id = companyId || null;

    const { data, error } = await supabase
      .from('content')
      .update(updates)
      .eq('id', documentId)
      .select()
      .single();

    if (error) { console.error('Error updating content:', error); return null; }
    return fromRow(data);
  } catch (error) {
    console.error('Error updating content:', error);
    return null;
  }
}

export async function fetchContent(documentId: string) {
  if (!documentId || !UUID_RE.test(documentId)) return null;
  try {
    const { data, error } = await supabase
      .from('content')
      .select('*')
      .eq('id', documentId)
      .single();

    if (error) throw error;
    return { document: fromRow(data) };
  } catch (error) {
    console.error('Error fetching content:', error);
    throw error;
  }
}
