'use client';

import { useEffect, useState } from 'react';
import { ArrowLeft, Eye } from 'lucide-react';
import { useRouter } from 'next/navigation';
import BlogArticlePreview from '@/components/blog/BlogArticlePreview';
import PageLoadingScreen from '@/components/loading/PageLoadingScreen';
import { loadBlogPreview, type BlogPreviewPayload } from '@/lib/dashboard/blogPreviewStorage';
import { marketingFocusRing } from '@/lib/marketing/marketingTheme';
import { cn } from '@/lib/utils';

export default function BlogPreviewPage() {
  const router = useRouter();
  const [payload, setPayload] = useState<BlogPreviewPayload | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setPayload(loadBlogPreview());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!payload?.title) return;
    document.title = `${payload.title} | Preview`;
    return () => {
      document.title = 'BlogCreator';
    };
  }, [payload?.title]);

  if (!ready) {
    return <PageLoadingScreen label="Loading preview" />;
  }

  if (!payload?.content.trim()) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-white px-6 text-center">
        <Eye className="mb-4 h-10 w-10 text-slate-300" aria-hidden />
        <h1 className="font-sans text-xl font-semibold text-slate-900">No draft to preview</h1>
        <p className="mt-2 max-w-sm font-sans text-sm leading-relaxed text-slate-600">
          Generate a draft in Studio first, then open preview from the workspace toolbar.
        </p>
        <button
          type="button"
          onClick={() => router.push('/dashboard?mode=ai-generate')}
          className={cn(
            'mt-6 inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50',
            marketingFocusRing
          )}
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back to Studio
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-20 border-b border-slate-200/90 bg-white/95 backdrop-blur-sm print:hidden">
        <div className="mx-auto flex max-w-[920px] items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <button
            type="button"
            onClick={() => router.push('/dashboard?mode=ai-generate')}
            className={cn(
              'inline-flex shrink-0 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50',
              marketingFocusRing
            )}
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Back to Studio
          </button>
          <p className="hidden truncate text-center text-xs font-medium uppercase tracking-[0.15em] text-slate-400 sm:block">
            Article preview
          </p>
          <span className="w-[7.5rem] shrink-0 sm:w-[8.5rem]" aria-hidden />
        </div>
      </header>

      <main className="mx-auto w-full max-w-[920px] px-6 py-10 sm:px-10 sm:py-12 md:px-14 md:py-14">
        <article aria-label={payload.title || 'Blog article preview'}>
          <BlogArticlePreview content={payload.content} />
        </article>
      </main>
    </div>
  );
}
