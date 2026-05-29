'use server';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const authHeaders = {
  'Content-Type': 'application/json',
  'apikey': SUPABASE_ANON_KEY,
};

function mapUser(user: any) {
  return {
    $id: user.id,
    name: user.user_metadata?.name || user.email,
    email: user.email,
    $createdAt: user.created_at,
    $updatedAt: user.updated_at || user.created_at,
  };
}

export async function signup(email: string, password: string, name: string) {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({ email, password, data: { name } }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.msg || data.error_description || 'Signup failed.');
  }

  return await login(email, password);
}

export async function login(email: string, password: string) {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error_description || data.msg || 'Login failed.');
  }

  return {
    secret: data.access_token,
    userId: data.user?.id,
  };
}

export async function logout(sessionToken: string) {
  try {
    await fetch(`${SUPABASE_URL}/auth/v1/logout`, {
      method: 'POST',
      headers: {
        ...authHeaders,
        'Authorization': `Bearer ${sessionToken}`,
      },
    });
  } catch {
    // Ignore network errors — token may already be expired/invalid
  }
  return { message: 'Logged out successfully' };
}

export async function getUser(sessionToken: string) {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    method: 'GET',
    headers: {
      ...authHeaders,
      'Authorization': `Bearer ${sessionToken}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    const msg: string = data.msg || data.error_description || 'Fetching user failed.';
    const isExpired = msg.toLowerCase().includes('expired') || msg.toLowerCase().includes('invalid jwt');
    throw new Error(isExpired ? 'SESSION_EXPIRED' : msg);
  }

  return mapUser(data);
}

export async function forgotPassword(email: string) {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/recover`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({ email }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.msg || 'Failed to send reset email.');
  }
}

export async function resetPassword(accessToken: string, newPassword: string) {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    method: 'PUT',
    headers: { ...authHeaders, Authorization: `Bearer ${accessToken}` },
    body: JSON.stringify({ password: newPassword }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.msg || data.error_description || 'Failed to reset password.');
}

export async function updateUserName(sessionToken: string, newName: string) {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    method: 'PUT',
    headers: {
      ...authHeaders,
      'Authorization': `Bearer ${sessionToken}`,
    },
    body: JSON.stringify({ data: { name: newName } }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.msg || 'Failed to update name.');
  }

  return mapUser(data);
}
