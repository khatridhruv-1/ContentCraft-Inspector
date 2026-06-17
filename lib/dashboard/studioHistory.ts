export type StudioHistoryItem = {
  $id: string;
  content: string;
  analysis?: string | null;
  mode?: string | null;
  relatedLinks?: unknown;
  related_links?: unknown;
  createdAt: string;
  updatedAt: string;
};

type RelatedLinkRecord = {
  title?: string;
  url?: string;
  description?: string;
  content?: string;
};

export function coerceRelatedLinks(value: unknown): RelatedLinkRecord[] {
  if (value == null) return [];

  let parsed: unknown = value;
  if (typeof value === 'string') {
    try {
      parsed = JSON.parse(value);
    } catch {
      return [];
    }
  }

  if (!Array.isArray(parsed)) return [];

  return parsed.filter(
    (link): link is RelatedLinkRecord =>
      link !== null &&
      typeof link === 'object' &&
      typeof (link as RelatedLinkRecord).title === 'string' &&
      typeof (link as RelatedLinkRecord).url === 'string'
  );
}

export function studioChatTitle(raw: string, max = 52) {
  const plain = raw
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (!plain) return 'Untitled draft';
  if (plain.length <= max) return plain;
  return `${plain.slice(0, max)}…`;
}

/** First # heading (or H1 / first line) from generated draft markdown or HTML. */
export function extractDraftTitle(raw: string | null | undefined, max = 52): string | null {
  if (!raw?.trim()) return null;

  const mdH1 = raw.match(/^#\s+(.+)$/m);
  if (mdH1?.[1]?.trim()) {
    return studioChatTitle(mdH1[1].trim(), max);
  }

  const htmlH1 = raw.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  if (htmlH1?.[1]) {
    const text = htmlH1[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    if (text) return studioChatTitle(text, max);
  }

  const firstLine = raw
    .replace(/<[^>]+>/g, '')
    .split('\n')
    .map(line => line.trim())
    .find(line => line.length > 0);

  if (firstLine) {
    return studioChatTitle(firstLine.replace(/^#+\s*/, ''), max);
  }

  return null;
}

export function studioItemTitle(item: StudioHistoryItem, max = 52): string {
  if (item.mode === 'analyze') {
    return studioChatTitle(item.content || item.analysis || '', max);
  }

  const fromDraft = extractDraftTitle(item.analysis);
  if (fromDraft) return fromDraft;

  return studioChatTitle(item.content, max);
}

export function studioChatPreview(raw: string | null | undefined, max = 56) {
  if (!raw?.trim()) return 'No preview yet';
  const plain = raw
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (plain.length <= max) return plain;
  return `${plain.slice(0, max)}…`;
}

export function studioChatPreviewForItem(item: StudioHistoryItem, max = 56) {
  const raw =
    item.mode === 'analyze'
      ? item.content || item.analysis
      : item.analysis || item.content;
  return studioChatPreview(raw, max);
}

export function studioChatMode(item: StudioHistoryItem): 'ai-generate' | 'analyze' {
  return item.mode === 'analyze' ? 'analyze' : 'ai-generate';
}

export function studioChatInitial(title: string) {
  const letter = title.trim().charAt(0).toUpperCase();
  return letter && /[A-Z0-9]/i.test(letter) ? letter : '?';
}

export function formatStudioChatTime(iso: string) {
  const date = new Date(iso);
  const now = new Date();
  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  if (isToday) {
    return date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
  }

  const diffDays = Math.floor((now.getTime() - date.getTime()) / 86400000);
  if (diffDays < 7) {
    return date.toLocaleDateString(undefined, { weekday: 'short' });
  }

  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}
