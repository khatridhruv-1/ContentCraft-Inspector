'use client';

import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import ContentEditor from '@/components/ContentEditor';
import { useRouter } from 'next/navigation';
import DashboardParams from '@/components/DashboardParams';
import { Document, HeadingLevel, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';
import { getDownloadableContent } from '@/components/MarkdownRenderer';
import { marked } from 'marked';
import PageLoadingScreen from '@/components/loading/PageLoadingScreen';
import AIGenerateView from '@/components/AIGenerateView';
import HomeNav from '@/components/home/HomeNav';
import type { HomeModeId } from '@/components/home/homeWorkflows';
import DashboardModeSwitcher from '@/components/dashboard/DashboardModeSwitcher';
import DashboardAnalysisTabs from '@/components/dashboard/DashboardAnalysisTabs';
import MarketingDotGrid from '@/components/marketing/MarketingDotGrid';
import { dashboardSplitGrid } from '@/components/dashboard/dashboardLayout';
import { studioCanvas } from '@/lib/dashboard/studioTheme';
import {
  MARKETING_PAGE_GRADIENT,
  marketingBgClass,
  marketingFocusRing,
  marketingGhostButton,
  marketingPageClass,
  marketingSkipLink,
} from '@/lib/marketing/marketingTheme';
import { useMarketingPageBackground } from '@/hooks/useMarketingPageBackground';
import { cn } from '@/lib/utils';
import { extractDraftTitle, type StudioHistoryItem } from '@/lib/dashboard/studioHistory';

type AppMode = HomeModeId;

export default function Dashboard() {
  const toHtmlFromMarkdown = (value: unknown) => {
    if (typeof value !== 'string') return '';
    const safeValue = value.trim();
    if (!safeValue) return '';
    return marked(safeValue) as string;
  };

  const [content, setContent] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [mode, setMode] = useState<AppMode>('ai-generate');
  const [triggerAnalysis, setTriggerAnalysis] = useState(false);
  const [signingOut] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');
  const [documentId, setDocumentId] = useState<string | null>(null);
  const [fromHistory, setFromHistory] = useState(false);
  const [title, setTitle] = useState<string>('GeneratedContent');
  const [dataFromChild, setDataFromChild] = useState('');
  const [analysisRunId, setAnalysisRunId] = useState(0);
  const [initialBrief, setInitialBrief] = useState<string | undefined>();

  const router = useRouter();
  useMarketingPageBackground({ includeHtml: true });

  useEffect(() => {
    localStorage.removeItem('documentId');
  }, []);

  useEffect(() => {
    const loadHistoryState = () => {
      const savedState = localStorage.getItem('dashboardState');
      if (!savedState) return;

      let parsed: any;
      try {
        parsed = JSON.parse(savedState);
      } catch {
        // Ignore corrupted dashboard state (e.g. after a previous crash).
        localStorage.removeItem('dashboardState');
        return;
      }

      const {
        mode: savedMode,
        content: savedContent,
        documentId: savedDocId,
        fromHistory: wasHistory,
        analysis: savedAnalysis,
      } = parsed;
      const safeMode: AppMode = savedMode === 'analyze' ? 'analyze' : 'ai-generate';

      setMode(safeMode);
      setContent(savedContent);
      setAnalysis(savedAnalysis);
      setDocumentId(savedDocId);
      setFromHistory(wasHistory);

      if (safeMode === 'analyze') {
        setTriggerAnalysis(true);
        setAnalysis(savedAnalysis);
      } else {
        setGeneratedContent(savedAnalysis);
        setAnalysis(savedAnalysis);
        if (typeof savedContent === 'string' && savedContent.trim()) {
          setInitialBrief(savedContent);
        }
      }
      localStorage.removeItem('dashboardState');
    };

    loadHistoryState();
  }, []);

  const handleModeChange = (newMode: AppMode) => {
    setMode(newMode);
    router.push(`/dashboard?mode=${newMode}${documentId ? `&documentId=${documentId}` : ''}`);
    if (newMode !== mode) {
      setTriggerAnalysis(false);
    }
  };

  const handleAnalyze = () => {
    setMode('analyze');
    setAnalysisRunId(id => id + 1);
    setTriggerAnalysis(true);
    const contentToAnalyze = generatedContent || content;
    const htmlContent = toHtmlFromMarkdown(contentToAnalyze);
    if (!htmlContent) return;
    setContent(htmlContent);
    setAnalysis(htmlContent);
    router.push('/dashboard?mode=analyze');
  };

  const handleOpenAnalyzeChat = (item: StudioHistoryItem) => {
    const htmlContent = toHtmlFromMarkdown(item.content) || item.content;
    setMode('analyze');
    setContent(htmlContent);
    setAnalysis(item.analysis?.trim() ? item.analysis : htmlContent);
    setDocumentId(item.$id);
    setAnalysisRunId(id => id + 1);
    setTriggerAnalysis(true);
    localStorage.setItem('documentId', item.$id);
    router.push(`/dashboard?mode=analyze&documentId=${item.$id}`);
  };

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    setGeneratedContent(newContent);
    setAnalysis(newContent);
  };

  const handleGeneratedContent = (newGenerated: string) => {
    const safeGeneratedContent = typeof newGenerated === 'string' ? newGenerated.trim() : '';
    if (!safeGeneratedContent) {
      setGeneratedContent('');
      setContent('');
      setAnalysis('');
      return;
    }

    const generatedHtmlContent = toHtmlFromMarkdown(safeGeneratedContent);
    if (!generatedHtmlContent) return;
    handleContentChange(generatedHtmlContent);
    setTitle(extractDraftTitle(safeGeneratedContent) ?? 'GeneratedContent');
  };

  const downloadAsWord = () => {
    if (!generatedContent.trim()) return;
    const formattedContent = getDownloadableContent(generatedContent, 'docx');

    const doc = new Document({
      sections: [
        {
          children: formattedContent.split('\n').map(line => {
            if (line.startsWith('--- ')) {
              return new Paragraph({ text: line.replace('--- ', ''), heading: HeadingLevel.HEADING_1 });
            }
            if (line.startsWith('-- ')) {
              return new Paragraph({ text: line.replace('-- ', ''), heading: HeadingLevel.HEADING_2 });
            }
            if (line.startsWith('- ')) {
              return new Paragraph({ text: line.replace('- ', ''), heading: HeadingLevel.HEADING_3 });
            }
            if (line.startsWith('• ')) {
              return new Paragraph({ children: [new TextRun(line.replace('• ', ''))], bullet: { level: 0 } });
            }
            if (line.startsWith('1. ')) {
              return new Paragraph({
                children: [new TextRun(line.replace('1. ', ''))],
                numbering: { reference: 'ordered-list', level: 0 },
              });
            }
            return new Paragraph(line);
          }),
        },
      ],
    });

    Packer.toBlob(doc).then(blob => {
      saveAs(blob, `${title || 'GeneratedContent'}.docx`);
    });
  };

  if (signingOut) {
    return <PageLoadingScreen label="Signing out" />;
  }

  return (
    <div
      className={cn('relative flex h-dvh min-h-0 flex-col overflow-hidden', marketingBgClass, marketingPageClass)}
      style={{ background: MARKETING_PAGE_GRADIENT }}
    >
      <MarketingDotGrid />

      <a
        href="#dashboard-main"
        className={marketingSkipLink}
      >
        Skip to dashboard
      </a>

      <div className="relative z-10 flex h-full min-h-0 flex-1 flex-col">
        <HomeNav />
        <DashboardParams setMode={setMode} />

        <div
          className={cn(
            'relative z-10 flex shrink-0 flex-wrap items-center justify-center gap-2 px-3 py-2 sm:gap-3 sm:px-6 md:px-8',
            fromHistory && 'justify-between'
          )}
        >
          {fromHistory ? (
            <button
              type="button"
              onClick={() => router.push('/history')}
              className={cn(
                'inline-flex items-center gap-1.5',
                marketingGhostButton,
                marketingFocusRing,
                '!h-9 !w-auto shrink-0 px-3'
              )}
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
              History
            </button>
          ) : (
            <span className="hidden sm:block sm:flex-1" aria-hidden />
          )}
          <DashboardModeSwitcher mode={mode} onModeChange={handleModeChange} />
          <span className="hidden flex-1 sm:block" aria-hidden />
        </div>

        <main id="dashboard-main" className="flex min-h-0 flex-1 flex-col overflow-hidden">
          {mode === 'ai-generate' ? (
            <AIGenerateView
              generatedContent={generatedContent}
              initialBrief={initialBrief}
              onContentGenerated={handleGeneratedContent}
              onAnalyze={handleAnalyze}
              onOpenAnalyzeChat={handleOpenAnalyzeChat}
              onDownloadAsWord={downloadAsWord}
            />
          ) : null}

          {mode === 'analyze' ? (
            <div className={cn(dashboardSplitGrid, 'relative z-10')}>
              <div className={cn(studioCanvas, 'flex min-h-0 flex-col overflow-hidden')}>
                <div className="flex items-center gap-2 border-b border-slate-200 px-4 py-3 md:px-5">
                  <h2 className="text-sm font-semibold text-slate-900">Editor</h2>
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    Draft
                  </span>
                </div>
                <div className="min-h-0 flex-1 p-3 md:p-4">
                  <ContentEditor
                    initialContent={content}
                    onContentChange={handleContentChange}
                    mode={mode}
                    sendDataToParent={setDataFromChild}
                    onCreate={() => undefined}
                    onAnalyze={() => {
                      setAnalysisRunId(id => id + 1);
                      setTriggerAnalysis(true);
                    }}
                  />
                </div>
              </div>

              <DashboardAnalysisTabs
                analysis={analysis}
                triggerAnalysis={triggerAnalysis}
                analysisRunId={analysisRunId}
                dataFromChild={dataFromChild}
                className="min-h-0"
              />
            </div>
          ) : null}
        </main>
      </div>
    </div>
  );
}
