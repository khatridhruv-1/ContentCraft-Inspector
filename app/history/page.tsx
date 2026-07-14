'use client';

import { fetchHistory, deleteHistoryItem, fetchContent } from '@/lib/content/appwrite';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useState, useEffect, useCallback } from 'react';
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
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const loadHistory = useCallback(async (userId: string, page: number) => {
    const historyData = await fetchHistory(userId, page, ITEMS_PER_PAGE);
    setHistory((historyData?.documents as HistoryItem[]) || []);
    setTotalPages(Math.max(1, Math.ceil((historyData?.total || 0) / ITEMS_PER_PAGE)));
  }, []);

  useEffect(() => {
    const load = async () => {
      const startedAt = Date.now();
      try {
        if (!user.$id) return;
        await loadHistory(user.$id, currentPage);
      } catch (err) {
        console.error('History fetch failed:', err);
        setError('Failed to load your history. Please try again.');
      } finally {
        await waitForMinDisplay(startedAt);
        setLoading(false);
      }
    };

    load();
  }, [user.$id, currentPage, loadHistory]);

  const handleViewDetails = async (item: HistoryItem) => {
    try {
      const contentData = await fetchContent(item.$id);

      const query = {
        id: item.$id,
        mode: item.mode,
        content: contentData?.document?.content || item.content,
        documentId: item.$id,
        fromHistory: true,
        analysis: contentData?.document?.analysis || item.analysis,
      };

      localStorage.setItem('dashboardState', JSON.stringify(query));
      router.push('/dashboard');
    } catch (err) {
      console.error('Error fetching content details:', err);
    }
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
      analyze: 'bg-purple-100 text-purple-800',
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
    localStorage.setItem('skipWelcome', 'true');
    router.push('/dashboard');
  };

  if (!user && !loading) {
    return (
      <div className={cn('relative flex min-h-dvh flex-col', marketingBgClass, marketingPageClass)}>
        <HomeNav />
        <div className={cn('flex flex-1 items-center justify-center px-6 py-12', homeContainer)}>
          <p className="text-center text-slate-500">Please log in to view your history.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return <PageLoadingScreen label="Loading history" />;
  }

  return (
    <div
      className={cn('relative flex min-h-dvh flex-col', marketingBgClass, marketingPageClass)}
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
              <span className="hidden sm:inline">Back to Dashboard</span>
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
                    <button
                      type="button"
                      className="text-left text-sm font-medium text-blue-600 hover:text-blue-800 sm:text-right"
                      onClick={() => handleViewDetails(item)}
                    >
                      View details
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </>
        ) : (
          <p className="text-slate-500">No history found.</p>
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
            {!selectedItem ? (
              <PageLoadingScreen label="Loading document" />
            ) : (
              <div className="space-y-6">
                <div className="prose max-w-none">
                  <h3 className="text-lg font-semibold mb-2">Input</h3>
                  <MarkdownRenderer content={selectedItem.content} />
                </div>

                {selectedItem.analysis && (
                  <div className="prose max-w-none">
                    <h3 className="text-lg font-semibold mb-2">Analysis</h3>
                    <div className="rounded-lg bg-gray-50 p-4">{selectedItem.analysis}</div>
                  </div>
                )}
              </div>
            )}
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
