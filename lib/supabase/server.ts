import { createClient } from "@supabase/supabase-js";

function getAnonConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL environment variable");
  if (!anonKey) throw new Error("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable");

  return { url, anonKey };
}

function getAdminConfig() {
  // Admin client needs only the Supabase URL + service role key.
  // The anon key is not required and making it a hard dependency breaks server-side routes
  // when `NEXT_PUBLIC_SUPABASE_ANON_KEY` isn't present in production.
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable');

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable');

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
