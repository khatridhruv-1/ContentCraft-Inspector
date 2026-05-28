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
      const contentData = await fetchContent(item.$id); // Fetch full content
  
      const query = {
        id: item.$id,
        mode: item.mode, // Ensure mode is passed correctly
        content: contentData?.document?.content || item.content,
        documentId: item.$id,
        fromHistory: true,
        analysis: contentData?.document?.analysis || item.analysis,
      };
  
      localStorage.setItem('dashboardState', JSON.stringify(query)); // Store data
      router.push('/dashboard'); // Redirect to dashboard
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

  const getModeColor = (mode: HistoryItem['mode']) => {
    const colors = {
      'ai-generate': 'bg-violet-500/10 text-violet-400 border-violet-500/20',
      'create':      'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
      'analyze':     'bg-pink-500/10 text-pink-400 border-pink-500/20',
      'ai-score':    'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    };
    return colors[mode];
  };

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
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'hsl(var(--sidebar-background))' }}>
        <p className="text-sm" style={{ color: 'hsl(var(--sidebar-foreground))' }}>Please log in to view your history.</p>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen" style={{ background: 'hsl(var(--sidebar-background))' }}>
        <div className="max-w-3xl mx-auto p-6">

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <button
                onClick={handleBack}
                className="flex items-center gap-2 text-xs font-medium px-3 py-2 rounded-lg transition-colors"
                style={{ color: 'hsl(var(--sidebar-foreground))' }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'hsl(var(--sidebar-accent))'; (e.currentTarget as HTMLButtonElement).style.color = 'white'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = 'hsl(var(--sidebar-foreground))'; }}
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>
              <div>
                <h2 className="text-lg font-bold text-white">History</h2>
                <p className="text-xs" style={{ color: 'hsl(var(--sidebar-foreground))' }}>Your past analyses and generations</p>
              </div>
            </div>
          </div>

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
              <div className="flex gap-2 flex-wrap mb-6">
                {filters.map(f => (
                  <button
                    key={f.value}
                    onClick={() => setActiveFilter(f.value)}
                    className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
                      activeFilter === f.value
                        ? 'bg-violet-500/15 text-violet-400 border-violet-500/30'
                        : 'border-border text-muted-foreground hover:text-foreground hover:border-border/80'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            );
          })()}

          {/* Search input */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search history..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-secondary border border-border rounded-xl pl-9 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/60 transition-all"
            />
          </div>

          {error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-3 rounded-xl mb-5">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center py-16">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-violet-500/20 border-t-violet-500 rounded-full animate-spin" />
                <p className="text-xs" style={{ color: 'hsl(var(--sidebar-foreground))' }}>Loading history...</p>
              </div>
            </div>
          ) : companyData?.length > 0 ? (
            <>
              <ul className="space-y-3">
                {(activeFilter === 'all' ? companyData : companyData.filter((item: any) => item.mode === activeFilter))
                  .filter((item: any) => !searchQuery || item.content?.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((item: any) => (
                  <li
                    key={item.$id}
                    className="rounded-2xl border p-5 transition-all cursor-pointer"
                    style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'hsl(var(--sidebar-border))' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLLIElement).style.borderColor = 'rgba(139,92,246,0.3)'; (e.currentTarget as HTMLLIElement).style.background = 'rgba(139,92,246,0.05)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLLIElement).style.borderColor = 'hsl(var(--sidebar-border))'; (e.currentTarget as HTMLLIElement).style.background = 'rgba(255,255,255,0.03)'; }}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getModeColor(item.mode)}`}>
                          {getModeLabel(item.mode)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px]" style={{ color: 'hsl(var(--sidebar-foreground))' }}>
                          {new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                        <button
                          onClick={e => { e.stopPropagation(); handleDelete(item.$id); }}
                          className="p-1.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    {item.content && (
                      <p className="text-xs leading-relaxed line-clamp-2 mb-3" style={{ color: 'hsl(var(--sidebar-foreground))' }}>
                        {item.content.replace(/<[^>]*>/g, '').slice(0, 200)}
                      </p>
                    )}

                    <button
                      className="text-xs font-medium text-violet-400 hover:text-violet-300 transition-colors"
                      onClick={() => handleViewDetails(item)}
                    >
                      View details →
                    </button>
                  </li>
                ))}
              </ul>

              <div className="mt-6 flex items-center justify-center gap-3">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors disabled:opacity-30"
                  style={{ color: 'hsl(var(--sidebar-foreground))' }}
                  onMouseEnter={e => { if (currentPage !== 1) { (e.currentTarget as HTMLButtonElement).style.background = 'hsl(var(--sidebar-accent))'; (e.currentTarget as HTMLButtonElement).style.color = 'white'; }}}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = 'hsl(var(--sidebar-foreground))'; }}
                >
                  <ArrowLeft className="h-3.5 w-3.5" /> Previous
                </button>
                <span className="text-xs" style={{ color: 'hsl(var(--sidebar-foreground))' }}>
                  {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors disabled:opacity-30"
                  style={{ color: 'hsl(var(--sidebar-foreground))' }}
                  onMouseEnter={e => { if (currentPage !== totalPages) { (e.currentTarget as HTMLButtonElement).style.background = 'hsl(var(--sidebar-accent))'; (e.currentTarget as HTMLButtonElement).style.color = 'white'; }}}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = 'hsl(var(--sidebar-foreground))'; }}
                >
                  Next <ArrowLeft className="h-3.5 w-3.5 rotate-180" />
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <div className="w-12 h-12 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mx-auto mb-4">
                <ArrowLeft className="h-6 w-6 text-violet-400 rotate-180" />
              </div>
              <p className="text-sm font-medium text-white mb-1">No history yet</p>
              <p className="text-xs" style={{ color: 'hsl(var(--sidebar-foreground))' }}>Your analyses and generations will appear here.</p>
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