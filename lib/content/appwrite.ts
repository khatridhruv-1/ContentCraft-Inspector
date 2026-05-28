"use server";

import { getSupabaseAdmin } from "@/lib/supabase/server";

type RelatedLink = {
  url: string;
  title: string;
  content: string;
  score: number;
  raw_content: string | null;
};

function normalizeRow(row: any) {
  return {
    ...row,
    $id: row.id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    userId: row.user_id,
    companyId: row.company_id,
    contentScore: row.content_score,
    wordCount: row.word_count,
    readingTime: row.reading_time,
    aiScore: row.ai_score,
    humanScore: row.human_score,
    humanizedVersion: row.humanized_version,
    keyInsights: row.key_insights,
    contentGaps: row.content_gaps,
    relatedLinks: row.related_links,
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
  const supabase = getSupabaseAdmin();

  const payload = {
    user_id: userId,
    content,
    analysis: analysis ?? null,
    mode: mode ?? null,
    content_score: typeof contentScore === "number" ? Math.round(contentScore) : null,
    readability: typeof readability === "number" ? readability : null,
    tone: tone ?? null,
    key_insights: keyInsights ?? [],
    improvements: improvements ?? [],
    word_count: wordCount ?? null,
    reading_time: readingTime ?? null,
    ai_score: typeof aiScore === "number" ? Math.round(aiScore) : null,
    human_score: typeof humanScore === "number" ? Math.round(humanScore) : null,
    humanized_version: humanizedVersion ?? null,
    outline: outline ?? [],
    suggestions: suggestions ?? [],
    content_gaps: contentGaps ?? [],
    summary: summary ?? null,
    related_links: relatedLinks ?? [],
    company_id: companyId ?? null,
  };

  const { data, error } = await supabase.from("contents").insert(payload).select("*").single();
  if (error || !data) throw new Error(error?.message || "Failed to save content");
  return normalizeRow(data);
}

export async function fetchHistory(userId: string, page: number, limit: number) {
  const supabase = getSupabaseAdmin();
  const offset = (page - 1) * limit;

  const { data, count, error } = await supabase
    .from("contents")
    .select("*", { count: "exact" })
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw new Error(error.message || "Failed to fetch history");

  return {
    documents: (data || []).map(normalizeRow),
    total: count || 0,
  };
}

export async function deleteHistoryItem(documentId: string) {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("contents").delete().eq("id", documentId);
  if (error) throw new Error(error.message || "Failed to delete item");
  return true;
}

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
    readability?: number;
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
    relatedLinks?: RelatedLink[];
    companyId?: string;
  }
) {
  const supabase = getSupabaseAdmin();

  const updatePayload: Record<string, any> = {};
  if (input !== undefined) updatePayload.content = input;
  if (analysis !== undefined) updatePayload.analysis = analysis;
  if (contentScore !== undefined) updatePayload.content_score = Math.round(contentScore);
  if (readability !== undefined) updatePayload.readability = readability;
  if (tone !== undefined) updatePayload.tone = tone;
  if (keyInsights !== undefined) updatePayload.key_insights = keyInsights;
  if (improvements !== undefined) updatePayload.improvements = improvements;
  if (wordCount !== undefined) updatePayload.word_count = wordCount;
  if (readingTime !== undefined) updatePayload.reading_time = readingTime;
  if (aiScore !== undefined) updatePayload.ai_score = Math.round(aiScore);
  if (humanScore !== undefined) updatePayload.human_score = Math.round(humanScore);
  if (humanizedVersion !== undefined) updatePayload.humanized_version = humanizedVersion;
  if (outline !== undefined) updatePayload.outline = outline;
  if (suggestions !== undefined) updatePayload.suggestions = suggestions;
  if (contentGaps !== undefined) updatePayload.content_gaps = contentGaps;
  if (summary !== undefined) updatePayload.summary = summary;
  if (relatedLinks !== undefined) updatePayload.related_links = relatedLinks;
  if (companyId !== undefined) updatePayload.company_id = companyId;

  const { data, error } = await supabase
    .from("contents")
    .update(updatePayload)
    .eq("id", documentId)
    .select("*")
    .single();

  if (error || !data) throw new Error(error?.message || "Failed to update content");
  return normalizeRow(data);
}

export async function fetchContent(documentId: string) {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.from("contents").select("*").eq("id", documentId).single();
  if (error || !data) throw new Error(error?.message || "Failed to fetch content");

  return {
    document: normalizeRow(data),
  };
}