const DEFAULT_OLLAMA_HOST = 'https://ollama.com';

/** Default cloud model — strong instruction-following for long-form content (override via OLLAMA_MODEL). */
export const OLLAMA_DEFAULT_MODEL = 'qwen3.5:397b-cloud';

export type OllamaMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

type OllamaChatOptions = {
  messages: OllamaMessage[];
  model?: string;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
};

export class OllamaRateLimitError extends Error {
  retryAfterSeconds?: number;

  constructor(message: string, retryAfterSeconds?: number) {
    super(message);
    this.name = 'OllamaRateLimitError';
    this.retryAfterSeconds = retryAfterSeconds;
  }
}

export class OllamaAuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'OllamaAuthError';
  }
}

function resolveHost(): string {
  return (process.env.OLLAMA_API_HOST?.trim() || DEFAULT_OLLAMA_HOST).replace(/\/$/, '');
}

function resolveModel(model?: string): string {
  return model?.trim() || process.env.OLLAMA_MODEL?.trim() || OLLAMA_DEFAULT_MODEL;
}

function getApiKey(): string {
  const apiKey = process.env.OLLAMA_API_KEY?.trim();
  if (!apiKey) {
    throw new Error('Missing OLLAMA_API_KEY environment variable');
  }

  // Many users accidentally paste an SSH public key instead of an Ollama API key.
  // Ollama's Cloud API expects an API key in the Authorization header.
  if (/^ssh-(rsa|ed25519|ecdsa|dss)\b/i.test(apiKey)) {
    throw new OllamaAuthError(
      'Your OLLAMA_API_KEY looks like an SSH public key. Ollama Cloud requires an API key (ollama.com settings/keys), not an ssh-ed25519 key.'
    );
  }

  return apiKey;
}

function parseApiError(payload: unknown, status: number): string {
  if (!payload || typeof payload !== 'object') {
    return `Ollama API request failed (HTTP ${status}).`;
  }

  const p = payload as {
    error?: string;
    message?: string;
  };

  if (p.error) return p.error;
  if (p.message) return p.message;

  return `Ollama API request failed (HTTP ${status}).`;
}

function stripMarkdownFences(text: string): string {
  const trimmed = text.trim();
  const fenced = trimmed.match(/^```(?:markdown|md|json)?\s*([\s\S]*?)\s*```$/i);
  return fenced?.[1]?.trim() ?? trimmed;
}

export async function ollamaChat({
  messages,
  model,
  temperature = 0.7,
  maxTokens = 4096,
  topP,
}: OllamaChatOptions): Promise<string> {
  const body: Record<string, unknown> = {
    model: resolveModel(model),
    messages,
    stream: false,
    // Prevent thinking traces from consuming output; ensures `message.content` is filled.
    think: false,
    options: {
      temperature,
      num_predict: maxTokens,
      ...(topP !== undefined ? { top_p: topP } : {}),
    },
  };

  const response = await fetch(`${resolveHost()}/api/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getApiKey()}`,
    },
    body: JSON.stringify(body),
  });

  let payload = (await response.json().catch(() => ({}))) as {
    message?: { content?: string; thinking?: string };
  };

  if (!response.ok) {
    const message = parseApiError(payload, response.status);

    if (response.status === 401 || response.status === 403) {
      throw new OllamaAuthError(
        `Ollama auth failed: ${message || 'invalid credentials'}. Check OLLAMA_API_KEY at ollama.com/settings/keys (Cloud API key, not SSH).`
      );
    }

    if (response.status === 429) {
      const retryAfter = response.headers.get('retry-after');
      const retryAfterSeconds = retryAfter ? Math.max(1, Number(retryAfter)) : undefined;
      throw new OllamaRateLimitError(message, retryAfterSeconds);
    }

    throw new Error(message);
  }

  let text = resolveOllamaMessageText(payload);

  if (!text) {
    const retryResponse = await fetch(`${resolveHost()}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getApiKey()}`,
      },
      body: JSON.stringify(body),
    });

    payload = (await retryResponse.json().catch(() => ({}))) as {
      message?: { content?: string; thinking?: string };
    };

    if (!retryResponse.ok) {
      const message = parseApiError(payload, retryResponse.status);
      throw new Error(message);
    }

    text = resolveOllamaMessageText(payload);
  }

  if (!text) {
    throw new Error('Ollama returned an empty response.');
  }

  return stripMarkdownFences(text);
}

function resolveOllamaMessageText(payload: {
  message?: { content?: string; thinking?: string };
}): string | null {
  const content = payload.message?.content?.trim();
  if (content) return content;

  const thinking = payload.message?.thinking?.trim();
  if (thinking) return thinking;

  return null;
}

/** Strip optional ```json fences before parsing model JSON output */
export function parseOllamaJson<T>(text: string): T {
  const trimmed = text.trim();
  const fenced = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  const jsonText = fenced?.[1]?.trim() ?? trimmed;
  return JSON.parse(jsonText) as T;
}

export function ollamaErrorResponse(error: unknown) {
  if (error instanceof OllamaAuthError) {
    return {
      status: 401,
      body: {
        error:
          'Ollama API authentication failed. Verify OLLAMA_API_KEY at ollama.com/settings/keys.',
        code: 'auth_failed',
      },
    };
  }

  if (error instanceof OllamaRateLimitError) {
    return {
      status: 429,
      body: {
        error:
          'Ollama Cloud rate limit reached. Please wait and retry, or check your plan limits at ollama.com.',
        retryAfterSeconds: error.retryAfterSeconds,
      },
    };
  }

  return {
    status: 500,
    body: {
      error: error instanceof Error ? error.message : 'Ollama request failed',
    },
  };
}
