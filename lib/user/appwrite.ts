'use server';

import { ID } from "appwrite";

function getAppwriteConfig({ requireApiKey = false } = {}) {
  const endpoint = process.env.APPWRITE_ENDPOINT;
  const projectId = process.env.APPWRITE_PROJECT_ID;

  if (!endpoint) throw new Error('Missing APPWRITE_ENDPOINT environment variable');
  if (!projectId) throw new Error('Missing APPWRITE_PROJECT_ID environment variable');

  const apiKey = process.env.API_SECRET_KEY;
  if (requireApiKey && !apiKey) throw new Error('Missing API_SECRET_KEY environment variable');

  return { endpoint, projectId, apiKey };
}

export async function signup(email: string, password: string, name: string) {
  const { endpoint, projectId, apiKey } = getAppwriteConfig({ requireApiKey: true });

  try {
    const response = await fetch(`${endpoint}/account`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Appwrite-Project': projectId,
        'X-Appwrite-Key': apiKey!,
      },
      body: JSON.stringify({
        userId: ID.unique(),
        email,
        password,
        name,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Signup failed.');
    }

    return await login(email, password);
  } catch (error) {
    console.error('❌ Signup error:', error);
    throw error instanceof Error ? error : new Error('Signup failed.');
  }
}

export async function login(email: string, password: string) {
  const { endpoint, projectId, apiKey } = getAppwriteConfig({ requireApiKey: true });

  try {
    const response = await fetch(`${endpoint}/account/sessions/email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Appwrite-Project': projectId,
        'X-Appwrite-Key': apiKey!,
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Login failed.');
    }

    return data;
  } catch (error) {
    console.error('❌ Login error:', error);
    throw error instanceof Error ? error : new Error('Login failed.');
  }
}

export async function logout(sessionToken: string) {
  const { endpoint, projectId } = getAppwriteConfig();

  try {
    const response = await fetch(`${endpoint}/account/sessions/current`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'X-Appwrite-Project': projectId,
        'X-Appwrite-Session': sessionToken
      },
    });

    if (!response.ok) {
      throw new Error('Logout failed.');
    }

    return { message: 'Logged out successfully' };
  } catch (error) {
    console.error('❌ Logout error:', error);
    throw error instanceof Error ? error : new Error('Logout failed.');
  }
}

export async function getUser(sessionToken: string) {
  const { endpoint, projectId } = getAppwriteConfig();

  try {
    const response = await fetch(`${endpoint}/account`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Appwrite-Project': projectId,
        'X-Appwrite-Session': sessionToken,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Fetching user failed.');
    }

    return data;
  } catch (error) {
    console.error('❌ Get user error:', error);
    throw error instanceof Error ? error : new Error('User retrieval failed.');
  }
}

export async function updateUserName(sessionToken: string, newName: string) {
  const { endpoint, projectId } = getAppwriteConfig();

  try {
    const response = await fetch(`${endpoint}/account/name`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-Appwrite-Project': projectId,
        'X-Appwrite-session': sessionToken,
      },
      body: JSON.stringify({
        name: newName,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to update name.');
    }

    return data;
  } catch (error) {
    console.error('❌ Update Name error:', error);
    throw error instanceof Error ? error : new Error('Failed to update name.');
  }
}
