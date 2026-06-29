export const BLOG_PREVIEW_STORAGE_KEY = 'blogcreator:blog-preview';

export type BlogPreviewPayload = {
  title: string;
  content: string;
  savedAt: number;
};

export function saveBlogPreview(payload: { title: string; content: string }): void {
  if (typeof window === 'undefined') return;

  const data: BlogPreviewPayload = {
    ...payload,
    savedAt: Date.now(),
  };

  sessionStorage.setItem(BLOG_PREVIEW_STORAGE_KEY, JSON.stringify(data));
}

export function loadBlogPreview(): BlogPreviewPayload | null {
  if (typeof window === 'undefined') return null;

  const raw = sessionStorage.getItem(BLOG_PREVIEW_STORAGE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as BlogPreviewPayload;
    if (!parsed.content?.trim()) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function clearBlogPreview(): void {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(BLOG_PREVIEW_STORAGE_KEY);
}
