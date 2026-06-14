export type StudioHistoryItem = {
  $id: string;
  content: string;
  analysis?: string | null;
  mode?: string | null;
  createdAt: string;
  updatedAt: string;
};

export function studioChatTitle(raw: string, max = 52) {
  const plain = raw
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (!plain) return 'Untitled draft';
  if (plain.length <= max) return plain;
  return `${plain.slice(0, max)}…`;
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
