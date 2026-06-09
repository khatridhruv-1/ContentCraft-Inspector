'use server';

import { getSupabaseAdmin, getSupabaseAnon } from "@/lib/supabase/server";

export type AppUser = {
  $id: string;
  name: string;
  email: string;
  $createdAt: string;
};

function mapUser(user: { id: string; email?: string | null; created_at?: string; user_metadata?: { full_name?: string } }): AppUser {
  return {
    $id: user.id,
    name: user.user_metadata?.full_name || user.email?.split("@")[0] || "User",
    email: user.email || "",
    $createdAt: user.created_at || "",
  };
}

function isInvalidSessionError(message?: string | null): boolean {
  if (!message) return false;
  const m = message.toLowerCase();
  return (
    m.includes('expired') ||
    m.includes('invalid jwt') ||
    m.includes('invalid claim') ||
    m.includes('unable to parse') ||
    m.includes('verify signature') ||
    (m.includes('session') && m.includes('not found'))
  );
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function assertValidEmail(email: string) {
  const isValid = /^[\w.-]+@([\w-]+\.)+[a-zA-Z]{2,}$/.test(email);
  if (!isValid) {
    throw new Error("Please enter a valid email address.");
  }
}

export async function signup(email: string, password: string, name: string) {
  const normalizedEmail = normalizeEmail(email);
  assertValidEmail(normalizedEmail);

  const supabase = getSupabaseAnon();
  const admin = getSupabaseAdmin();

  const { data: created, error: createError } = await supabase.auth.signUp({
    email: normalizedEmail,
    password,
    options: {
      data: { full_name: name },
    },
  });

  if (createError) {
    const authError = (createError as { code?: string; message?: string }) || {};
    const message = authError.message?.trim();
    const code = authError.code?.trim();

    if (message) {
      throw new Error(code ? `${message} (${code})` : message);
    }

    throw new Error("Signup failed.");
  }
  if (!created.user) throw new Error("Signup failed.");

  const { error: metadataError } = await admin.auth.admin.updateUserById(created.user.id, {
    user_metadata: { full_name: name },
  });

  if (metadataError) throw new Error(metadataError.message || "Failed to update user profile.");

  return login(normalizedEmail, password);
}

export async function login(email: string, password: string) {
  const normalizedEmail = normalizeEmail(email);
  assertValidEmail(normalizedEmail);

  const supabase = getSupabaseAnon();
  const { data, error } = await supabase.auth.signInWithPassword({ email: normalizedEmail, password });

  if (error) throw new Error(error.message || "Login failed.");
  if (!data.session || !data.user) throw new Error("Login failed.");

  return {
    secret: data.session.access_token,
    userId: data.user.id,
  };
}

export async function logout(_sessionToken: string) {
  return { message: "Logged out successfully" };
}

/** Returns null when the session is missing, expired, or otherwise invalid */
export async function getUser(sessionToken: string): Promise<AppUser | null> {
  const supabase = getSupabaseAnon();
  const { data, error } = await supabase.auth.getUser(sessionToken);

  if (error) {
    if (isInvalidSessionError(error.message)) return null;
    throw new Error(error.message || "User retrieval failed.");
  }

  if (!data.user) return null;

  return mapUser(data.user);
}

export async function updateUserName(sessionToken: string, newName: string) {
  const admin = getSupabaseAdmin();
  const supabase = getSupabaseAnon();

  const { data: current, error: currentError } = await supabase.auth.getUser(sessionToken);
  if (currentError) {
    if (isInvalidSessionError(currentError.message)) {
      throw new Error("Your session has expired. Please sign in again.");
    }
    throw new Error(currentError.message || "Failed to fetch user.");
  }
  if (!current.user) {
    throw new Error("Your session has expired. Please sign in again.");
  }

  const { data: updated, error: updateError } = await admin.auth.admin.updateUserById(current.user.id, {
    user_metadata: {
      ...current.user.user_metadata,
      full_name: newName,
    },
  });

  if (updateError || !updated.user) {
    throw new Error(updateError?.message || "Failed to update name.");
  }

  return mapUser(updated.user);
}

