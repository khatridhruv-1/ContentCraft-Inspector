const GROQ_CHAT_URL = 'https://api.groq.com/openai/v1/chat/completions';

export const GROQ_DEFAULT_MODEL = 'llama-3.3-70b-versatile';

function resolveModel(model?: string): string {
  return model?.trim() || process.env.GROQ_MODEL?.trim() || GROQ_DEFAULT_MODEL;
}

type GroqMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

type GroqChatOptions = {
  messages: GroqMessage[];
  model?: string;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
};

export class GroqRateLimitError extends Error {
  retryAfterSeconds?: number;

  constructor(message: string, retryAfterSeconds?: number) {
    super(message);
    this.name = 'GroqRateLimitError';
    this.retryAfterSeconds = retryAfterSeconds;
  }
}

function getApiKey(): string {
  const apiKey = process.env.GROQ_API_KEY?.trim();
  if (!apiKey) {
    throw new Error('Missing GROQ_API_KEY environment variable');
  }
  return apiKey;
}

function parseApiError(payload: unknown, status: number): string {
  if (!payload || typeof payload !== 'object') {
    return `Groq API request failed (HTTP ${status}).`;
  }

  const p = payload as {
    error?: string | { message?: string; type?: string };
    message?: string;
  };

  if (typeof p.error === 'string') return p.error;
  if (p.error?.message) return p.error.message;
  if (p.message) return p.message;

  return `Groq API request failed (HTTP ${status}).`;
}

export async function groqChat({
  messages,
  model,
  temperature = 0.7,
  maxTokens = 4096,
  topP,
}: GroqChatOptions): Promise<string> {
  const body: Record<string, unknown> = {
    model: resolveModel(model),
    messages,
    temperature,
    max_tokens: maxTokens,
  };
  if (topP !== undefined) {
    body.top_p = topP;
  }

  const response = await fetch(GROQ_CHAT_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getApiKey()}`,
    },
    body: JSON.stringify(body),
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = parseApiError(payload, response.status);

    if (response.status === 429) {
      const retryAfter = response.headers.get('retry-after');
      const retryAfterSeconds = retryAfter ? Math.max(1, Number(retryAfter)) : undefined;
      throw new GroqRateLimitError(message, retryAfterSeconds);
    }

    throw new Error(message);
  }

  const text = (payload as { choices?: Array<{ message?: { content?: string } }> })
    ?.choices?.[0]?.message?.content?.trim();

  if (!text) {
    throw new Error('Groq returned an empty response.');
  }

  return text;
}

/** Strip optional ```json fences before parsing model JSON output */
export function parseGroqJson<T>(text: string): T {
  const trimmed = text.trim();
  const fenced = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  const jsonText = fenced?.[1]?.trim() ?? trimmed;
  return JSON.parse(jsonText) as T;
}

export function groqErrorResponse(error: unknown) {
  if (error instanceof GroqRateLimitError) {
    return {
      status: 429,
      body: {
        error:
          'Groq API rate limit reached. Please wait and retry, or check your Groq console limits.',
        retryAfterSeconds: error.retryAfterSeconds,
      },
    };
  }

  return {
    status: 500,
    body: {
      error: error instanceof Error ? error.message : 'Groq request failed',
    },
  };
}
