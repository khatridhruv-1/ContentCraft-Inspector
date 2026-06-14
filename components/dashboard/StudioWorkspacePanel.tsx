'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, Copy, FileDown, FileSearch, Wand2 } from 'lucide-react';
import StudioComposer from '@/components/dashboard/StudioComposer';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import MarketingPrimaryButton from '@/components/marketing/MarketingPrimaryButton';
import { AppLoader } from '@/components/loading/AppLoader';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { StudioWorkspaceSkeleton } from '@/components/dashboard/StudioPanelSkeleton';
import { studioActionGhost } from '@/lib/dashboard/studioTheme';
import { marketingFocusRing } from '@/lib/marketing/marketingTheme';
import { htmlToMarkdown } from '@/lib/utils';
import { cn } from '@/lib/utils';
import type { DiscoveredKeyword } from '@/types/seo';

type StudioWorkspacePanelProps = {
  generatedContent: string;
  activeTitle?: string | null;
  discoveredKeywords?: DiscoveredKeyword[];
  historyLoading?: boolean;
  loading: boolean;
  brief: string;
  tone: string;
  keywords: string;
  errorMessage?: string | null;
  onBriefChange: (value: string) => void;
  onToneChange: (tone: string) => void;
  onKeywordsChange: (keywords: string) => void;
  onGenerate: () => void;
  onAnalyze: () => void;
  onDownloadAsWord: () => void;
};

export default function StudioWorkspacePanel({
  generatedContent,
  activeTitle,
  discoveredKeywords = [],
  historyLoading = false,
  loading,
  brief,
  tone,
  keywords,
  errorMessage,
  onBriefChange,
  onToneChange,
  onKeywordsChange,
  onGenerate,
  onAnalyze,
  onDownloadAsWord,
}: StudioWorkspacePanelProps) {
  const [copied, setCopied] = useState(false);
  const [refineOpen, setRefineOpen] = useState(false);
  const wasLoadingRef = useRef(false);
  const hasOutput = generatedContent.trim().length > 0;
  const showHero = !hasOutput && !loading;

  useEffect(() => {
    if (wasLoadingRef.current && !loading && refineOpen && !errorMessage) {
      setRefineOpen(false);
    }
    wasLoadingRef.current = loading;
  }, [loading, refineOpen, errorMessage]);

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

  return (
    <div className="flex h-full min-h-0 flex-col bg-white">
      <header className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 px-4 py-3 sm:px-5">
        <div className="min-w-0">
          <h2 className="truncate text-sm font-semibold text-slate-900">
            {activeTitle || 'New draft'}
          </h2>
          <p className="text-xs text-slate-500">
            {hasOutput ? 'Draft preview' : 'Compose your brief below'}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setRefineOpen(true)}
            disabled={!hasOutput || loading}
            className={cn(studioActionGhost, 'gap-1.5 !h-8 text-xs', marketingFocusRing)}
          >
            <Wand2 className="h-3.5 w-3.5" aria-hidden />
            Refine
          </button>
          <button
            type="button"
            onClick={onAnalyze}
            disabled={!hasOutput}
            className={cn(studioActionGhost, 'gap-1.5 !h-8 text-xs', marketingFocusRing)}
          >
            <FileSearch className="h-3.5 w-3.5" aria-hidden />
            Analyze
          </button>
          <button
            type="button"
            onClick={handleCopy}
            disabled={!hasOutput}
            className={cn(studioActionGhost, 'gap-1.5 !h-8 text-xs', marketingFocusRing)}
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
            disabled={!hasOutput}
            onClick={onDownloadAsWord}
            className="!h-8 !w-auto px-3 text-xs"
          >
            <FileDown className="h-3.5 w-3.5" aria-hidden />
            Export
          </MarketingPrimaryButton>
        </div>
      </header>

      {discoveredKeywords.length > 0 ? (
        <div className="shrink-0 border-b border-violet-100 bg-violet-50/70 px-4 py-2 sm:px-5">
          <p className="mb-1.5 text-[10px] font-bold uppercase tracking-widest text-violet-700">
            Keywords
          </p>
          <div className="flex flex-wrap gap-1.5">
            {discoveredKeywords.map(item => (
              <span
                key={item.keyword}
                className="inline-flex items-center rounded-md border border-violet-200 bg-white px-2 py-0.5 text-xs font-medium text-violet-900"
              >
                {item.keyword}
              </span>
            ))}
          </div>
        </div>
      ) : null}

      {showHero ? (
        <div className="relative flex min-h-0 flex-1 flex-col items-center justify-center overflow-y-auto p-6 md:p-10">
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(139,92,246,0.06)_0%,_transparent_70%)]"
            aria-hidden
          />
          <StudioComposer
            variant="hero"
            brief={brief}
            tone={tone}
            keywords={keywords}
            loading={loading}
            errorMessage={errorMessage}
            onBriefChange={onBriefChange}
            onToneChange={onToneChange}
            onKeywordsChange={onKeywordsChange}
            onGenerate={onGenerate}
          />
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
              <div className="flex min-h-full flex-col items-center justify-center gap-3 p-8 text-center">
                <AppLoader decorative className="!h-8 !w-8" />
                <p className="text-sm font-medium text-slate-700">Writing your draft…</p>
                <p className="max-w-xs text-xs text-slate-500">
                  Finding keywords and generating content.
                </p>
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

      <Sheet open={refineOpen} onOpenChange={setRefineOpen}>
        <SheetContent
          side="right"
          className="w-full overflow-y-auto border-slate-200 bg-white text-slate-900 sm:max-w-lg"
        >
          <SheetHeader className="text-left">
            <SheetTitle className="text-slate-900">Refine &amp; regenerate</SheetTitle>
            <SheetDescription className="text-slate-500">
              Update your brief or tone, then generate a new draft.
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6">
            <StudioComposer
              variant="docked"
              brief={brief}
              tone={tone}
              keywords={keywords}
              loading={loading}
              errorMessage={errorMessage}
              onBriefChange={onBriefChange}
              onToneChange={onToneChange}
              onKeywordsChange={onKeywordsChange}
              onGenerate={onGenerate}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
