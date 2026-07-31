'use client';

import { fetchHistory, deleteHistoryItem, fetchContent } from '@/lib/content/appwrite';
import {
  buildDashboardUrl,
  persistDashboardState,
  type DashboardMode,
} from '@/lib/dashboard/dashboardState';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Trash2 } from 'lucide-react';
import PageLoadingScreen from '@/components/loading/PageLoadingScreen';
import { waitForMinDisplay } from '@/lib/loading/minDisplay';
import { Button } from '@/components/ui/button';
import HomeNav from '@/components/home/HomeNav';
import HomeFooter from '@/components/home/HomeFooter';
import MarketingDotGrid from '@/components/marketing/MarketingDotGrid';
import { homeContainer } from '@/components/home/homeLayout';
import { useMarketingPageBackground } from '@/hooks/useMarketingPageBackground';
import {
  MARKETING_PAGE_GRADIENT,
  marketingBgClass,
  marketingFocusRing,
  marketingGhostButton,
  marketingPageClass,
  marketingSkipLink,
} from '@/lib/marketing/marketingTheme';
import { cn } from '@/lib/utils';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import MarkdownRenderer from '@/components/MarkdownRenderer';

type HistoryMode = 'ai-generate' | 'analyze';

interface HistoryItem {
  $id: string;
  userId: string;
  content: string;
  analysis?: string;
  createdAt: string;
  updatedAt: string;
  mode: HistoryMode;
}

const ITEMS_PER_PAGE = 10;

export default function HistoryPage() {
  const router = useRouter();
  const { user } = useCurrentUser();
  useMarketingPageBackground({ includeHtml: true });
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [pageLoading, setPageLoading] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const initialLoadDone = useRef(false);

  const loadHistory = useCallback(async (userId: string, page: number) => {
    const historyData = await fetchHistory(userId, page, ITEMS_PER_PAGE);
    setHistory((historyData?.documents as HistoryItem[]) || []);
    const total = historyData?.total || 0;
    setTotalItems(total);
    setTotalPages(Math.max(1, Math.ceil(total / ITEMS_PER_PAGE)));
  }, []);

  useEffect(() => {
    if (!user.$id) return;

    const load = async () => {
      const startedAt = Date.now();
      const isInitial = !initialLoadDone.current;
      if (!isInitial) setPageLoading(true);

      try {
        setError(null);
        await loadHistory(user.$id, currentPage);
      } catch (err) {
        console.error('History fetch failed:', err);
        setError('Failed to load your history. Please try again.');
      } finally {
        if (isInitial) {
          await waitForMinDisplay(startedAt);
          setLoading(false);
          initialLoadDone.current = true;
        }
        setPageLoading(false);
      }
    };

    void load();
  }, [user.$id, currentPage, loadHistory]);

  const openInStudio = async (item: HistoryItem) => {
    try {
      const contentData = await fetchContent(item.$id);
      const mode: DashboardMode = item.mode === 'analyze' ? 'analyze' : 'ai-generate';

      persistDashboardState({
        id: item.$id,
        mode,
        content: contentData?.document?.content || item.content,
        documentId: item.$id,
        fromHistory: true,
        analysis: contentData?.document?.analysis || item.analysis,
      });
      router.push(buildDashboardUrl(mode, item.$id));
    } catch (err) {
      console.error('Error fetching content details:', err);
      setError('Could not open this draft. Please try again.');
    }
  };

  const openPreview = (item: HistoryItem) => {
    setSelectedItem(item);
    setShowDetails(true);
  };

  const handleDelete = (documentId: string) => {
    setItemToDelete(documentId);
    setShowDeleteAlert(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete || !user?.$id) return;

    try {
      await deleteHistoryItem(itemToDelete);
      await loadHistory(user.$id, currentPage);
    } catch (err) {
      console.error('Delete failed:', err);
      setError('Failed to delete item. Please try again.');
    } finally {
      setShowDeleteAlert(false);
      setItemToDelete(null);
    }
  };

  const getModeColor = (mode: HistoryMode) => {
    const colors: Record<string, string> = {
      'ai-generate': 'bg-blue-100 text-blue-800',
      analyze: 'bg-teal-100 text-teal-800',
    };
    return colors[mode] ?? 'bg-gray-100 text-gray-600';
  };

  const getModeLabel = (mode: HistoryMode) => {
    const labels: Record<string, string> = {
      'ai-generate': 'AI Generated',
      analyze: 'Analyzed',
    };
    return labels[mode] ?? mode;
  };

  const handleBack = () => {
    router.push('/home');
  };

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    setCurrentPage(page);
  };

  if (!user && !loading) {
    return (
      <div
        className={cn(
          'marketing-page relative flex min-h-dvh flex-col',
          marketingBgClass,
          marketingPageClass
        )}
        style={{ background: MARKETING_PAGE_GRADIENT }}
      >
        <HomeNav />
        <div className={cn('flex flex-1 items-center justify-center px-6 py-12', homeContainer)}>
          <p className="text-center text-slate-500">Please log in to view your history.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div
        className={cn(
          'marketing-page relative flex min-h-dvh flex-col',
          marketingBgClass,
          marketingPageClass
        )}
        style={{ background: MARKETING_PAGE_GRADIENT }}
      >
        <HomeNav />
        <main className={cn('relative z-10 flex-1 py-6 md:py-10', homeContainer)}>
          <div className="mb-6 h-8 w-32 animate-pulse rounded-lg bg-slate-200" />
          <ul className="space-y-3">
            {[1, 2, 3].map(i => (
              <li key={i} className="h-28 animate-pulse rounded-xl border border-slate-200 bg-white" />
            ))}
          </ul>
        </main>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'marketing-page relative flex min-h-dvh flex-col',
        marketingBgClass,
        marketingPageClass
      )}
      style={{ background: MARKETING_PAGE_GRADIENT }}
    >
      <a href="#history-main" className={marketingSkipLink}>
        Skip to history
      </a>

      <MarketingDotGrid />
      <HomeNav />

      <main id="history-main" className={cn('relative z-10 flex-1 py-6 md:py-10', homeContainer)}>
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <button
              type="button"
              onClick={handleBack}
              className={cn(
                'inline-flex w-fit items-center gap-2',
                marketingGhostButton,
                marketingFocusRing,
                '!h-9 !w-auto shrink-0 px-3'
              )}
            >
              <ArrowLeft className="h-4 w-4" aria-hidden />
              <span className="hidden sm:inline">Back to Home</span>
              <span className="sm:hidden">Back</span>
            </button>
            <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">History</h1>
          </div>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        {pageLoading && (
          <p className="mb-4 text-sm text-slate-500" role="status">
            Loading page…
          </p>
        )}

        {history.length > 0 ? (
          <>
            <ul className="space-y-3 sm:space-y-4">
              {history.map(item => (
                <li
                  key={item.$id}
                  className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md sm:p-5"
                >
                  <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex items-center gap-2">
                      <Badge className={getModeColor(item.mode)}>{getModeLabel(item.mode)}</Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(item.$id)}
                        className="text-red-600 hover:bg-red-50 hover:text-red-800"
                        aria-label="Delete history item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <time
                      dateTime={item.createdAt}
                      className="text-xs text-slate-500 sm:text-sm"
                    >
                      {new Date(item.createdAt).toLocaleString()}
                    </time>
                  </div>

                  <div className="prose prose-sm max-w-none line-clamp-3 mb-3 sm:prose-base">
                    <MarkdownRenderer content={item.content} />
                  </div>

                  {item.analysis && (
                    <div className="mb-3">
                      <p className="text-sm font-medium text-slate-600">Analysis</p>
                      <div className="line-clamp-2 text-sm text-slate-500">{item.analysis}</div>
                    </div>
                  )}

                  <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    {item.updatedAt !== item.createdAt ? (
                      <p className="text-xs text-slate-500 sm:text-sm">
                        Updated {new Date(item.updatedAt).toLocaleString()}
                      </p>
                    ) : (
                      <span />
                    )}
                    <div className="flex flex-wrap gap-3">
                      <button
                        type="button"
                        className="text-left text-sm font-medium text-slate-600 hover:text-slate-900"
                        onClick={() => openPreview(item)}
                      >
                        Quick preview
                      </button>
                      <button
                        type="button"
                        className="text-left text-sm font-medium text-teal-700 hover:text-teal-900"
                        onClick={() => openInStudio(item)}
                      >
                        Open in studio
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex flex-col items-center gap-3">
              <p className="text-sm text-slate-600">
                Page {currentPage} of {totalPages}
                {totalItems > 0 ? ` · ${totalItems} drafts` : ''}
              </p>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => goToPage(currentPage - 1)}
                      className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                      aria-disabled={currentPage === 1}
                    />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => goToPage(currentPage + 1)}
                      className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                      aria-disabled={currentPage === totalPages}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </>
        ) : (
          <div className="rounded-xl border border-dashed border-slate-200 bg-white/60 px-6 py-10 text-center">
            <p className="text-slate-600">No history found.</p>
            <button
              type="button"
              onClick={() => router.push('/dashboard?mode=ai-generate')}
              className="mt-4 text-sm font-semibold text-teal-700 underline-offset-2 hover:underline"
            >
              Create your first draft
            </button>
          </div>
        )}
      </main>

      <HomeFooter />

      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="flex max-h-[85dvh] w-[calc(100vw-1.5rem)] max-w-4xl flex-col overflow-hidden sm:max-h-[80vh]">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle>Content Details</DialogTitle>
            {selectedItem && (
              <Badge className={`mt-2 ${getModeColor(selectedItem.mode)}`}>
                {getModeLabel(selectedItem.mode)}
              </Badge>
            )}
          </DialogHeader>

          <div className="flex-1 overflow-auto mt-4">
            {selectedItem ? (
              <div className="space-y-6">
                <div className="prose max-w-none">
                  <h3 className="text-lg font-semibold mb-2">Content</h3>
                  <MarkdownRenderer content={selectedItem.content} />
                </div>

                {selectedItem.analysis && (
                  <div className="prose max-w-none">
                    <h3 className="text-lg font-semibold mb-2">Analysis</h3>
                    <div className="rounded-lg bg-gray-50 p-4">{selectedItem.analysis}</div>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setShowDetails(false);
                    void openInStudio(selectedItem);
                  }}
                  className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700"
                >
                  Open in studio
                </button>
              </div>
            ) : null}
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this content from your history.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
