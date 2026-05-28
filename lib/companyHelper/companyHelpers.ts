"use server";

import { getSupabaseAdmin } from "@/lib/supabase/server";

function mapContent(row: any) {
  return {
    ...row,
    $id: row.id,
    userId: row.user_id,
    companyId: row.company_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function checkCompanyDomain(domain: string) {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("companies")
    .select("*")
    .eq("domain", domain.toLowerCase())
    .maybeSingle();

  if (error) {
    console.error("Error checking company domain:", error);
    return null;
  }
  if (!data) return null;

  return { ...data, $id: data.id };
}

export async function createCompany(data: { name: string; domain: string; users: string[] }) {
  const supabase = getSupabaseAdmin();

  const { data: company, error: companyError } = await supabase
    .from("companies")
    .insert({ name: data.name, domain: data.domain.toLowerCase() })
    .select("*")
    .single();

  if (companyError || !company) throw new Error(companyError?.message || "Failed to create company");

  if (data.users.length > 0) {
    const members = data.users.map((userId) => ({ company_id: company.id, user_id: userId }));
    const { error: memberError } = await supabase.from("company_members").upsert(members, {
      onConflict: "company_id,user_id",
    });
    if (memberError) throw new Error(memberError.message || "Failed to add company member");
  }

  return { ...company, $id: company.id };
}

export async function joinCompany(companyId: string, userId: string) {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from("company_members")
    .upsert({ company_id: companyId, user_id: userId }, { onConflict: "company_id,user_id" });

  if (error) throw new Error(error.message || "Failed to join company");
  return true;
}

export async function getCompanyIdbyUser(userId: string) {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("company_members")
    .select("company_id")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    console.error("Error checking company domain:", error);
    return null;
  }
  return data?.company_id || null;
}

export async function getDataByMatchedOrganazationID(companyId: string) {
  if (!companyId) return [];

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("contents")
    .select("*")
    .eq("company_id", companyId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching data by companyId:", error);
    return null;
  }

  return (data || []).map(mapContent);
}

export async function deleteCompanyHistoryItem(documentId: string) {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("contents").delete().eq("id", documentId);
  if (error) throw new Error(error.message || "Failed to delete company history item");
  return true;
}