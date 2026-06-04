export type PublishPlatform = 'linkedin' | 'instagram' | 'twitter' | 'facebook' | 'wordpress';

export interface PublishResult {
  platform: PublishPlatform;
  success: boolean;
  postId?: string;
  url?: string;
  error?: string;
}

// ─── LinkedIn ────────────────────────────────────────────────────────────────
export async function publishToLinkedIn(
  content: string,
  accessToken: string,
  authorUrn: string
): Promise<PublishResult> {
  try {
    const body = {
      author: authorUrn,
      lifecycleState: 'PUBLISHED',
      specificContent: {
        'com.linkedin.ugc.ShareContent': {
          shareCommentary: { text: content.slice(0, 3000) },
          shareMediaCategory: 'NONE',
        },
      },
      visibility: { 'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC' },
    };

    const res = await fetch('https://api.linkedin.com/v2/ugcPosts', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'X-Restli-Protocol-Version': '2.0.0',
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.message ?? `LinkedIn API error: ${res.status}`);
    }

    const data = await res.json();
    const postId = data.id ?? '';
    return {
      platform: 'linkedin',
      success: true,
      postId,
      url: `https://www.linkedin.com/feed/update/${postId}`,
    };
  } catch (err: any) {
    return { platform: 'linkedin', success: false, error: err.message };
  }
}

// ─── Instagram ───────────────────────────────────────────────────────────────
export async function publishToInstagram(
  caption: string,
  accessToken: string,
  businessAccountId: string,
  imageUrl?: string
): Promise<PublishResult> {
  try {
    // Instagram requires an image — use a placeholder if none provided
    const finalImageUrl = imageUrl ?? 'https://placehold.co/1080x1080/6366f1/white?text=Post';

    // Step 1: Create media container
    const containerRes = await fetch(
      `https://graph.facebook.com/v19.0/${businessAccountId}/media`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image_url: finalImageUrl,
          caption: caption.slice(0, 2200),
          access_token: accessToken,
        }),
      }
    );

    if (!containerRes.ok) {
      const err = await containerRes.json().catch(() => ({}));
      throw new Error(err?.error?.message ?? `Instagram container error: ${containerRes.status}`);
    }

    const { id: creationId } = await containerRes.json();

    // Step 2: Publish container
    const publishRes = await fetch(
      `https://graph.facebook.com/v19.0/${businessAccountId}/media_publish`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ creation_id: creationId, access_token: accessToken }),
      }
    );

    if (!publishRes.ok) {
      const err = await publishRes.json().catch(() => ({}));
      throw new Error(err?.error?.message ?? `Instagram publish error: ${publishRes.status}`);
    }

    const { id: postId } = await publishRes.json();
    return { platform: 'instagram', success: true, postId };
  } catch (err: any) {
    return { platform: 'instagram', success: false, error: err.message };
  }
}

// ─── Twitter / X ─────────────────────────────────────────────────────────────
export async function publishToTwitter(
  content: string,
  apiKey: string,
  apiSecret: string,
  accessToken: string,
  accessTokenSecret: string
): Promise<PublishResult> {
  try {
    // Split into tweets if thread (numbered tweets separated by \n\n)
    const tweets = content
      .split(/\n\n|\d+\.\s+/)
      .map(t => t.trim())
      .filter(t => t.length > 0 && t.length <= 280)
      .slice(0, 25);

    const firstTweet = tweets[0] ?? content.slice(0, 280);

    // OAuth 1.0a signature
    const oauthHeader = buildOAuthHeader('POST', 'https://api.twitter.com/2/tweets', {
      apiKey, apiSecret, accessToken, accessTokenSecret,
    });

    const res = await fetch('https://api.twitter.com/2/tweets', {
      method: 'POST',
      headers: {
        Authorization: oauthHeader,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: firstTweet }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.detail ?? err?.title ?? `Twitter API error: ${res.status}`);
    }

    const data = await res.json();
    const postId = data?.data?.id ?? '';
    return {
      platform: 'twitter',
      success: true,
      postId,
      url: postId ? `https://twitter.com/i/web/status/${postId}` : undefined,
    };
  } catch (err: any) {
    return { platform: 'twitter', success: false, error: err.message };
  }
}

// ─── Facebook ────────────────────────────────────────────────────────────────
export async function publishToFacebook(
  content: string,
  pageAccessToken: string,
  pageId: string
): Promise<PublishResult> {
  try {
    const res = await fetch(`https://graph.facebook.com/v19.0/${pageId}/feed`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: content.slice(0, 63206),
        access_token: pageAccessToken,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.error?.message ?? `Facebook API error: ${res.status}`);
    }

    const data = await res.json();
    const postId = data?.id ?? '';
    return {
      platform: 'facebook',
      success: true,
      postId,
      url: postId ? `https://facebook.com/${postId}` : undefined,
    };
  } catch (err: any) {
    return { platform: 'facebook', success: false, error: err.message };
  }
}

// ─── WordPress ───────────────────────────────────────────────────────────────
export async function publishToWordPress(params: {
  content: string;
  title: string;
  siteUrl: string;
  username: string;
  appPassword: string;
  status?: 'publish' | 'draft' | 'future';
  categories?: number[];
  tags?: number[];
  featuredMediaId?: number;
}): Promise<PublishResult> {
  try {
    const {
      content, title, siteUrl, username, appPassword,
      status = 'publish', categories, tags, featuredMediaId,
    } = params;

    // Normalise URL — strip trailing slash
    const base = siteUrl.replace(/\/$/, '');
    const endpoint = `${base}/wp-json/wp/v2/posts`;

    // WordPress Application Password uses HTTP Basic Auth
    const credentials = Buffer.from(`${username}:${appPassword}`).toString('base64');

    const body: Record<string, any> = {
      title,
      content,
      status,
    };
    if (categories?.length) body.categories = categories;
    if (tags?.length) body.tags = tags;
    if (featuredMediaId) body.featured_media = featuredMediaId;

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${credentials}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.message ?? `WordPress API error: ${res.status}`);
    }

    const data = await res.json();
    return {
      platform: 'wordpress',
      success: true,
      postId: String(data.id),
      url: data.link ?? `${base}/?p=${data.id}`,
    };
  } catch (err: any) {
    return { platform: 'wordpress', success: false, error: err.message };
  }
}

// ─── Multi-platform publish ───────────────────────────────────────────────────
export async function publishToAll(
  content: string,
  platforms: PublishPlatform[],
  socialTokens: Record<string, any>,
  meta?: { title?: string }
): Promise<PublishResult[]> {
  const results: PublishResult[] = [];

  for (const platform of platforms) {
    const t = socialTokens[platform];
    if (!t?.connected) {
      results.push({ platform, success: false, error: 'Account not connected' });
      continue;
    }

    switch (platform) {
      case 'linkedin':
        results.push(await publishToLinkedIn(content, t.accessToken, t.authorUrn));
        break;
      case 'instagram':
        results.push(await publishToInstagram(content, t.accessToken, t.businessAccountId));
        break;
      case 'twitter':
        results.push(await publishToTwitter(content, t.apiKey, t.apiSecret, t.accessToken, t.accessTokenSecret));
        break;
      case 'facebook':
        results.push(await publishToFacebook(content, t.pageAccessToken, t.pageId));
        break;
      case 'wordpress':
        results.push(await publishToWordPress({
          content,
          title: meta?.title ?? 'New Post',
          siteUrl: t.siteUrl,
          username: t.username,
          appPassword: t.appPassword,
          status: t.defaultStatus ?? 'publish',
        }));
        break;
    }
  }

  return results;
}

// ─── OAuth 1.0a helper for Twitter ───────────────────────────────────────────
function buildOAuthHeader(
  method: string,
  url: string,
  keys: { apiKey: string; apiSecret: string; accessToken: string; accessTokenSecret: string }
): string {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const nonce = Math.random().toString(36).substring(2);

  const oauthParams: Record<string, string> = {
    oauth_consumer_key: keys.apiKey,
    oauth_nonce: nonce,
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp: timestamp,
    oauth_token: keys.accessToken,
    oauth_version: '1.0',
  };

  const paramStr = Object.keys(oauthParams)
    .sort()
    .map(k => `${encode(k)}=${encode(oauthParams[k])}`)
    .join('&');

  const baseStr = `${method}&${encode(url)}&${encode(paramStr)}`;
  const signingKey = `${encode(keys.apiSecret)}&${encode(keys.accessTokenSecret)}`;

  // Use Web Crypto for HMAC-SHA1
  const signature = hmacSha1Base64(signingKey, baseStr);

  const headerParams = { ...oauthParams, oauth_signature: signature };
  const headerStr = Object.keys(headerParams)
    .sort()
    .map(k => `${k}="${encode(headerParams[k])}"`)
    .join(', ');

  return `OAuth ${headerStr}`;
}

function encode(str: string): string {
  return encodeURIComponent(str).replace(/!/g, '%21').replace(/'/g, '%27').replace(/\(/g, '%28').replace(/\)/g, '%29').replace(/\*/g, '%2A');
}

function hmacSha1Base64(key: string, data: string): string {
  // Simple HMAC-SHA1 using SubtleCrypto is async — for now return empty
  // In production, use the 'crypto' module or a library like 'oauth-1.0a'
  return '';
}
