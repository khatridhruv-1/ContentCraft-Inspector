import { createClient } from "@supabase/supabase-js";

function getAnonConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL environment variable");
  if (!anonKey) throw new Error("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable");

  return { url, anonKey };
}

function getAdminConfig() {
  const { url } = getAnonConfig();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceRoleKey) throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY environment variable");

  return { url, serviceRoleKey };
}

export function getSupabaseAdmin() {
  const { url, serviceRoleKey } = getAdminConfig();
  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export function getSupabaseAnon() {
  const { url, anonKey } = getAnonConfig();
  return createClient(url, anonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
