'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Copy, Eye, FileDown, FileSearch, Wand2 } from 'lucide-react';
import StudioComposer from '@/components/dashboard/StudioComposer';
import StudioPlatformPicker from '@/components/dashboard/StudioPlatformPicker';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import MarketingPrimaryButton from '@/components/marketing/MarketingPrimaryButton';
import { AppLoader } from '@/components/loading/AppLoader';
import { StudioWorkspaceSkeleton } from '@/components/dashboard/StudioPanelSkeleton';
import { studioActionGhost } from '@/lib/dashboard/studioTheme';
import { saveBlogPreview } from '@/lib/dashboard/blogPreviewStorage';
import { marketingFocusRing } from '@/lib/marketing/marketingTheme';
import { htmlToMarkdown } from '@/lib/utils';
import { cn } from '@/lib/utils';
import type { ContentPlatformId } from '@/types/contentPlatform';

type StudioWorkspacePanelProps = {
  generatedContent: string;
  activeTitle?: string | null;
  historyLoading?: boolean;
  loading: boolean;
  brief: string;
  tone: string;
  platform: ContentPlatformId;
  errorMessage?: string | null;
  onBriefChange: (value: string) => void;
  onToneChange: (tone: string) => void;
  onPlatformChange: (platform: ContentPlatformId) => void;
  onGenerate: () => void;
  onRefine: () => void;
  onAnalyze: () => void;
  onDownloadAsWord: () => void;
};

export default function StudioWorkspacePanel({
  generatedContent,
  activeTitle,
  historyLoading = false,
  loading,
  brief,
  tone,
  platform,
  errorMessage,
  onBriefChange,
  onToneChange,
  onPlatformChange,
  onGenerate,
  onRefine,
  onAnalyze,
  onDownloadAsWord,
}: StudioWorkspacePanelProps) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const hasOutput = generatedContent.trim().length > 0;
  const showHero = !hasOutput && !loading;
  const canRefine = brief.trim().length > 0;

  if (historyLoading) {
    return <StudioWorkspaceSkeleton />;
  }

  const handleCopy = async () => {
    const text = htmlToMarkdown(generatedContent).trim();
    if (!text) return;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const handlePreview = () => {
    const markdown = htmlToMarkdown(generatedContent).trim();
    if (!markdown) return;

    saveBlogPreview({
      title: activeTitle?.trim() || 'Draft preview',
      content: markdown,
    });
    router.push('/dashboard/preview');
  };

  return (
    <div className="flex h-full min-h-0 flex-col bg-white">
      <header className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 px-4 py-3 sm:px-5">
        <div className="min-w-0">
          {hasOutput && activeTitle ? (
            <h1 className="line-clamp-2 text-base font-bold leading-snug text-slate-900 sm:text-lg">
              {activeTitle}
            </h1>
          ) : (
            <h2 className="truncate text-sm font-semibold text-slate-900">New draft</h2>
          )}
          <p className="text-xs text-slate-500">
            {hasOutput ? 'Draft preview' : 'Compose your brief below'}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {hasOutput ? (
            <>
              <button
                type="button"
                onClick={onRefine}
                disabled={loading || !canRefine}
                className={cn(studioActionGhost, 'gap-1.5 !h-9 text-xs', marketingFocusRing)}
              >
                <Wand2 className="h-3.5 w-3.5" aria-hidden />
                {loading ? 'Regenerating…' : 'Refine'}
              </button>
              <button
                type="button"
                onClick={onAnalyze}
                className={cn(studioActionGhost, 'gap-1.5 !h-9 text-xs', marketingFocusRing)}
              >
                <FileSearch className="h-3.5 w-3.5" aria-hidden />
                Analyze
              </button>
              <button
                type="button"
                onClick={handlePreview}
                className={cn(studioActionGhost, 'gap-1.5 !h-9 text-xs', marketingFocusRing)}
              >
                <Eye className="h-3.5 w-3.5" aria-hidden />
                Preview
              </button>
              <button
                type="button"
                onClick={handleCopy}
                className={cn(studioActionGhost, 'gap-1.5 !h-9 text-xs', marketingFocusRing)}
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5 text-emerald-600" aria-hidden />
                ) : (
                  <Copy className="h-3.5 w-3.5" aria-hidden />
                )}
                {copied ? 'Copied' : 'Copy'}
              </button>
              <MarketingPrimaryButton
                type="button"
                size="sm"
                fullWidth={false}
                onClick={onDownloadAsWord}
                className="!h-9 !w-auto px-3 text-xs"
              >
                <FileDown className="h-3.5 w-3.5" aria-hidden />
                Export
              </MarketingPrimaryButton>
            </>
          ) : (
            <span className="text-xs text-slate-400">Actions unlock after your first draft</span>
          )}
        </div>
      </header>

      {hasOutput ? (
        <div className="shrink-0 border-b border-slate-200/80 bg-slate-50/80 px-4 py-3 sm:px-5">
          <StudioPlatformPicker
            platform={platform}
            disabled={loading}
            compact
            onPlatformChange={onPlatformChange}
          />
        </div>
      ) : null}

      {showHero ? (
        <div className="relative flex min-h-0 flex-1 flex-col overflow-y-auto p-4 sm:p-6">
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(139,92,246,0.04)_0%,_transparent_70%)]"
            aria-hidden
          />
          <div className="relative mx-auto flex w-full max-w-2xl flex-1 items-center justify-center py-4">
            <StudioComposer
              variant="hero"
              autoFocus
              brief={brief}
              tone={tone}
              platform={platform}
              loading={loading}
              errorMessage={errorMessage}
              onBriefChange={onBriefChange}
              onToneChange={onToneChange}
              onPlatformChange={onPlatformChange}
              onGenerate={onGenerate}
            />
          </div>
        </div>
      ) : (
        <div
          className="relative min-h-0 flex-1 overflow-hidden bg-slate-50/40"
          role="region"
          aria-label="Draft preview content"
        >
          {loading && hasOutput ? (
            <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-center gap-2 border-b border-slate-200 bg-white/95 px-4 py-2 text-xs font-medium text-slate-600 backdrop-blur-sm">
              <AppLoader decorative className="!h-3.5 !w-3.5" />
              Regenerating draft…
            </div>
          ) : null}

          <div className="h-full min-h-0 overflow-y-auto overscroll-y-contain custom-scrollbar">
            {loading && !hasOutput ? (
              <div className="flex min-h-full flex-col items-center justify-center gap-4 p-8 text-center">
                <AppLoader decorative className="!h-8 !w-8" />
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-700">
                    Finding keywords, then writing your draft…
                  </p>
                  <p className="mx-auto max-w-xs text-xs leading-relaxed text-slate-500">
                    We fetch trending keywords for your topic, then generate content around them.
                  </p>
                </div>
              </div>
            ) : hasOutput ? (
              <article className="w-full bg-white px-5 py-5 sm:px-6 md:px-8 md:py-6">
                <MarkdownRenderer
                  variant="studio"
                  content={htmlToMarkdown(generatedContent)}
                />
              </article>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
