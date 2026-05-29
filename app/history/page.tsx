'use client';

import { fetchContent } from "@/lib/content/appwrite";
import { getUser } from "@/lib/user/appwrite";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Trash2, Search } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { deleteCompanyHistoryItem, getDataByMatchedOrganazationID } from "@/lib/companyHelper/companyHelpers";
import { useCompanyId } from "@/hooks/useCompany";

interface HistoryItem {
  $id: string;
  userId: string;
  content: string;
  analysis?: string;
  createdAt: string;
  updatedAt: string;
  mode: 'ai-generate' | 'create' | 'analyze' | 'ai-score';
}

export default function HistoryPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ $id: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const ITEMS_PER_PAGE = 3;
  const { companyId } = useCompanyId();
  const [companyData, setCompanyData] = useState<any>(null);
  const [activeFilter, setActiveFilter] = useState<HistoryItem['mode'] | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const handleCheck = async () => {
      try {
        const result = await getDataByMatchedOrganazationID(companyId as any);
        const totalItems = result?.length || 0;
        const newTotalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));
        setTotalPages(newTotalPages);

        // If current page is out of bounds (e.g., after deletion), go to previous page
        if (currentPage > newTotalPages) {
          setCurrentPage(newTotalPages);
          return; // Wait for next effect to update data
        }

        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        const paginatedData = result?.slice(startIndex, endIndex) || [];
        setCompanyData(paginatedData);
        setError('');
      } catch (error) {
        console.error("Error in useEffect:", error);
        setError('Failed to load company data Or company Id is missing. Please try again later.');
      }
    };

    handleCheck();
  }, [user?.$id, companyId, currentPage]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const sessionToken = localStorage.getItem('sessionToken');
        if (!sessionToken) {
          router.push('/auth/login');
          return;
        }

        const userData = await getUser(sessionToken);
        setUser(userData);
        setAuthChecked(true);
      } catch (err: unknown) {
        console.error('Profile fetch failed:', err);
        const msg = (err as Error)?.message ?? '';
        if (msg === 'SESSION_EXPIRED') {
          localStorage.removeItem('sessionToken');
          localStorage.removeItem('documentId');
          router.push('/auth/login');
          return;
        }
        setAuthChecked(true);
        setError('Failed to load your profile. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

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
    } catch (error) {
      console.error("Error fetching content details:", error);
    }
  };  

  const handleDelete = async (documentId: string) => {
    setItemToDelete(documentId);
    setShowDeleteAlert(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      await deleteCompanyHistoryItem(itemToDelete)
      const result = await getDataByMatchedOrganazationID(companyId as any);
      setCompanyData(result);
    } catch (error) {
      console.error('Delete failed:', error);
      setError('Failed to delete item. Please try again.');
    } finally {
      setShowDeleteAlert(false);
      setItemToDelete(null);
    }
  };  

  const getModeColor = (_mode: HistoryItem['mode']) =>
    'bg-secondary text-foreground border-border';

  const getModeLabel = (mode: HistoryItem['mode']) => {
    const labels = {
      'ai-generate': 'AI Generated',
      'create': 'Created',
      'analyze': 'Analyzed',
      'ai-score': 'AI Scored'
    };
    return labels[mode];
  };

  const handleBack = () => {
    localStorage.setItem('skipWelcome', 'true');
    router.push('/dashboard');
  };

  if (!authChecked) return null;

  if (!user && !loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">Please log in to view your history.</p>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-background">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8">

          {/* Header */}
          <header className="flex items-center gap-3 mb-8">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-xs font-medium px-3 py-2 rounded-lg transition-colors text-muted-foreground hover:text-foreground hover:bg-secondary min-h-[36px]"
              aria-label="Back to dashboard"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Back
            </button>
            <div>
              <h1 className="text-xl font-bold text-foreground">History</h1>
              <p className="text-xs text-muted-foreground mt-0.5">Your past analyses and generations</p>
            </div>
          </header>

          {/* Filter tabs */}
          {(() => {
            const filters: { label: string; value: HistoryItem['mode'] | 'all' }[] = [
              { label: 'All', value: 'all' },
              { label: 'AI Generated', value: 'ai-generate' },
              { label: 'Analyzed', value: 'analyze' },
              { label: 'AI Score', value: 'ai-score' },
              { label: 'Created', value: 'create' },
            ];
            return (
              <div className="flex gap-2 flex-wrap mb-5" role="tablist" aria-label="Filter history by type">
                {filters.map(f => (
                  <button
                    key={f.value}
                    onClick={() => setActiveFilter(f.value)}
                    role="tab"
                    aria-selected={activeFilter === f.value}
                    className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors min-h-[32px] ${
                      activeFilter === f.value
                        ? 'grad text-white border-transparent'
                        : 'border-border text-muted-foreground hover:text-foreground hover:border-primary/40 bg-white'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            );
          })()}

          {/* Search input */}
          <div className="relative mb-5">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" aria-hidden="true" />
            <input
              type="search"
              placeholder="Search history..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              aria-label="Search history"
              className="w-full bg-secondary border border-border rounded-xl pl-9 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/10 transition-all"
            />
          </div>

          {error && (
            <div role="alert" className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-3 rounded-xl mb-5 flex items-center gap-2">
              <span className="shrink-0">⚠</span>
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center py-20" aria-busy="true" aria-label="Loading history">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" aria-hidden="true" />
                <p className="text-xs text-muted-foreground">Loading history...</p>
              </div>
            </div>
          ) : companyData?.length > 0 ? (
            <>
              <ul className="divide-y divide-border" aria-label="History items">
                {(activeFilter === 'all' ? companyData : companyData.filter((item: any) => item.mode === activeFilter))
                  .filter((item: any) => !searchQuery || item.content?.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((item: any) => (
                  <li
                    key={item.$id}
                    className="py-5 transition-colors hover:bg-secondary/50 px-2 -mx-2 rounded-xl"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border ${getModeColor(item.mode)}`}>
                          {getModeLabel(item.mode)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <time
                          dateTime={item.createdAt}
                          className="text-[11px] text-muted-foreground"
                        >
                          {new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </time>
                        <button
                          onClick={e => { e.stopPropagation(); handleDelete(item.$id); }}
                          className="p-1.5 rounded-lg text-muted-foreground/50 hover:text-red-500 hover:bg-red-500/10 transition-colors min-h-[32px] min-w-[32px] flex items-center justify-center"
                          aria-label={`Delete this history item from ${new Date(item.createdAt).toLocaleDateString()}`}
                        >
                          <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                        </button>
                      </div>
                    </div>

                    {item.content && (
                      <p className="text-sm leading-relaxed mb-3 text-foreground/80 break-words line-clamp-3">
                        {item.content.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 300)}
                      </p>
                    )}

                    <button
                      className="text-xs font-medium text-primary hover:opacity-80 transition-opacity inline-flex items-center gap-1"
                      onClick={() => handleViewDetails(item)}
                    >
                      View details
                      <ArrowLeft className="w-3 h-3 rotate-180" aria-hidden="true" />
                    </button>
                  </li>
                ))}
              </ul>

              <nav className="mt-8 flex items-center justify-center gap-3" aria-label="Pagination">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium transition-colors disabled:opacity-30 text-muted-foreground hover:text-foreground hover:bg-secondary border border-border"
                  aria-label="Previous page"
                >
                  <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" /> Previous
                </button>
                <span className="text-xs text-muted-foreground" aria-live="polite">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium transition-colors disabled:opacity-30 text-muted-foreground hover:text-foreground hover:bg-secondary border border-border"
                  aria-label="Next page"
                >
                  Next <ArrowLeft className="h-3.5 w-3.5 rotate-180" aria-hidden="true" />
                </button>
              </nav>
            </>
          ) : (
            <div className="text-center py-20">
              <div className="w-12 h-12 rounded-2xl bg-secondary border border-border flex items-center justify-center mx-auto mb-4" aria-hidden="true">
                <Search className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-sm font-semibold text-foreground mb-1">No history yet</p>
              <p className="text-xs text-muted-foreground">Your analyses and generations will appear here after you use the tools.</p>
            </div>
          )}
        </div>
      </div>

      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">Delete this item?</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              This action cannot be undone. This will permanently delete this content from your history.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-border">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}