'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Loader2 } from 'lucide-react';
import {
  studioHistoryColumn,
  studioSplitShell,
  studioWorkspaceColumn,
} from '@/components/dashboard/dashboardLayout';
import StudioHistorySidebar from '@/components/dashboard/StudioHistorySidebar';
import StudioWorkspacePanel from '@/components/dashboard/StudioWorkspacePanel';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { buttonVariants } from '@/components/ui/button';
import { useAiContentGenerate } from '@/hooks/useAiContentGenerate';
import { deleteHistoryItem } from '@/lib/content/appwrite';
import { fetchHistoryCached } from '@/lib/content/fetchHistoryCached';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import {
  extractDraftTitle,
  studioItemTitle,
  type StudioHistoryItem,
} from '@/lib/dashboard/studioHistory';
import { htmlToMarkdown, cn } from '@/lib/utils';
import {
  DEFAULT_CONTENT_PLATFORM,
  type ContentPlatformId,
} from '@/types/contentPlatform';

interface AIGenerateViewProps {
  generatedContent: string;
  initialBrief?: string;
  onContentGenerated: (content: string) => void;
  onAnalyze: () => void;
  onOpenAnalyzeChat?: (item: StudioHistoryItem) => void;
  onDownloadAsWord: () => void;
}

const HISTORY_LIMIT = 40;

export default function AIGenerateView({
  generatedContent,
  initialBrief,
  onContentGenerated,
  onAnalyze,
  onOpenAnalyzeChat,
  onDownloadAsWord,
}: AIGenerateViewProps) {
  const { user } = useCurrentUser();
  const [historyItems, setHistoryItems] = useState<StudioHistoryItem[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [brief, setBrief] = useState(initialBrief ?? '');
  const [tone, setTone] = useState('');
  const [platform, setPlatform] = useState<ContentPlatformId>(DEFAULT_CONTENT_PLATFORM);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<StudioHistoryItem | null>(null);
  const { generate, loading, error: generateError } = useAiContentGenerate();

  const loadHistory = useCallback(async () => {
    try {
      if (!user?.$id) return;

      const result = await fetchHistoryCached(user.$id, 1, HISTORY_LIMIT);
      setHistoryItems(result.documents as StudioHistoryItem[]);
    } catch (err) {
      console.error('Failed to load studio history:', err);
    } finally {
      setHistoryLoading(false);
    }
  }, [user.$id]);

  useEffect(() => {
    void loadHistory();
  }, [loadHistory]);

  useEffect(() => {
    if (initialBrief) setBrief(initialBrief);
  }, [initialBrief]);

  const handleSelectChat = useCallback(
    (item: StudioHistoryItem) => {
      if (item.mode === 'analyze') {
        onOpenAnalyzeChat?.(item);
        return;
      }

      setActiveChatId(item.$id);
      setBrief(htmlToMarkdown(item.content).trim() || item.content);
      setErrorMessage(null);
      localStorage.setItem('documentId', item.$id);

      if (item.analysis?.trim()) {
        onContentGenerated(item.analysis);
      } else {
        onContentGenerated('');
      }
    },
    [onContentGenerated, onOpenAnalyzeChat]
  );

  const handleNewChat = useCallback(() => {
    setActiveChatId(null);
    setBrief('');
    setTone('');
    setPlatform(DEFAULT_CONTENT_PLATFORM);
    setErrorMessage(null);
    localStorage.removeItem('documentId');
    onContentGenerated('');
  }, [onContentGenerated]);

  const handleDeleteRequest = useCallback((item: StudioHistoryItem) => {
    setDeleteTarget(item);
  }, []);

  const handleDeleteDialogOpenChange = useCallback((open: boolean) => {
    if (!open && !deletingId) {
      setDeleteTarget(null);
    }
  }, [deletingId]);

  const confirmDeleteChat = useCallback(async () => {
    if (!deleteTarget) return;

    const item = deleteTarget;
    setDeletingId(item.$id);
    setErrorMessage(null);

    try {
      await deleteHistoryItem(item.$id);
      setHistoryItems(prev => prev.filter(entry => entry.$id !== item.$id));

      if (activeChatId === item.$id) {
        handleNewChat();
      }

      setDeleteTarget(null);
    } catch (error) {
      console.error('Failed to delete chat:', error);
      setErrorMessage('Failed to delete chat. Please try again.');
    } finally {
      setDeletingId(null);
    }
  }, [activeChatId, deleteTarget, handleNewChat]);

  const handleGenerate = useCallback(async () => {
    const text = brief.trim();
    if (!text || loading) return;

    setErrorMessage(null);

    try {
      const result = await generate(text, {
        tone: tone || undefined,
        platform,
      });
      onContentGenerated(result.content);

      const docId = localStorage.getItem('documentId');
      setActiveChatId(docId);
      await loadHistory();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Something went wrong. Please try again.'
      );
    }
  }, [brief, generate, loadHistory, loading, onContentGenerated, platform, tone]);

  const activeTitle = useMemo(() => {
    if (generatedContent.trim()) {
      const title = extractDraftTitle(htmlToMarkdown(generatedContent));
      if (title) return title;
    }

    const activeItem = historyItems.find(item => item.$id === activeChatId);
    if (activeItem) return studioItemTitle(activeItem);

    return null;
  }, [activeChatId, generatedContent, historyItems]);

  const deleteTargetTitle = deleteTarget ? studioItemTitle(deleteTarget) : '';

  return (
    <>
      <div className={studioSplitShell}>
        <div className={studioHistoryColumn}>
          <StudioHistorySidebar
            items={historyItems}
            activeId={activeChatId}
            loading={historyLoading}
            deletingId={deletingId}
            onSelect={handleSelectChat}
            onDelete={handleDeleteRequest}
            onNewChat={handleNewChat}
          />
        </div>
        <div className={studioWorkspaceColumn}>
          <StudioWorkspacePanel
            generatedContent={generatedContent}
            activeTitle={activeTitle}
            historyLoading={historyLoading}
            loading={loading}
            brief={brief}
            tone={tone}
            platform={platform}
            errorMessage={errorMessage ?? generateError}
            onBriefChange={setBrief}
            onToneChange={setTone}
            onPlatformChange={setPlatform}
            onGenerate={() => void handleGenerate()}
            onRefine={() => void handleGenerate()}
            onAnalyze={onAnalyze}
            onDownloadAsWord={onDownloadAsWord}
          />
        </div>
      </div>

      <AlertDialog open={Boolean(deleteTarget)} onOpenChange={handleDeleteDialogOpenChange}>
        <AlertDialogContent className="border-slate-200 bg-white text-slate-900 sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-slate-900">Delete this chat?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-600">
              <span className="font-medium text-slate-800">&ldquo;{deleteTargetTitle}&rdquo;</span>{' '}
              will be permanently removed from your history. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={Boolean(deletingId)}>Cancel</AlertDialogCancel>
            <button
              type="button"
              onClick={() => void confirmDeleteChat()}
              disabled={Boolean(deletingId)}
              className={cn(
                buttonVariants(),
                'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600'
              )}
            >
              {deletingId ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                  Deleting…
                </>
              ) : (
                'Delete'
              )}
            </button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
