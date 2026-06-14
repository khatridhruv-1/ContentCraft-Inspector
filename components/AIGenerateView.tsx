'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  studioHistoryColumn,
  studioSplitShell,
  studioWorkspaceColumn,
} from '@/components/dashboard/dashboardLayout';
import StudioHistorySidebar from '@/components/dashboard/StudioHistorySidebar';
import StudioWorkspacePanel from '@/components/dashboard/StudioWorkspacePanel';
import { useAiContentGenerate } from '@/hooks/useAiContentGenerate';
import { deleteHistoryItem, fetchHistory } from '@/lib/content/appwrite';
import { studioChatTitle, type StudioHistoryItem } from '@/lib/dashboard/studioHistory';
import { getUser } from '@/lib/user/appwrite';
import { getSessionToken } from '@/lib/user/session';
import { htmlToMarkdown } from '@/lib/utils';
import type { DiscoveredKeyword } from '@/types/seo';

interface AIGenerateViewProps {
  generatedContent: string;
  discoveredKeywords?: DiscoveredKeyword[];
  initialBrief?: string;
  onContentGenerated: (content: string, meta?: { keywords?: DiscoveredKeyword[] }) => void;
  onAnalyze: () => void;
  onOpenAnalyzeChat?: (item: StudioHistoryItem) => void;
  onDownloadAsWord: () => void;
}

const HISTORY_LIMIT = 40;

export default function AIGenerateView({
  generatedContent,
  discoveredKeywords = [],
  initialBrief,
  onContentGenerated,
  onAnalyze,
  onOpenAnalyzeChat,
  onDownloadAsWord,
}: AIGenerateViewProps) {
  const [historyItems, setHistoryItems] = useState<StudioHistoryItem[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [brief, setBrief] = useState(initialBrief ?? '');
  const [tone, setTone] = useState('');
  const [keywords, setKeywords] = useState('');
  const [localKeywords, setLocalKeywords] = useState<DiscoveredKeyword[]>(discoveredKeywords);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { generate, loading } = useAiContentGenerate();

  const loadHistory = useCallback(async () => {
    try {
      const sessionToken = getSessionToken();
      if (!sessionToken) return;

      const user = await getUser(sessionToken);
      if (!user?.$id) return;

      const result = await fetchHistory(user.$id, 1, HISTORY_LIMIT);
      setHistoryItems(result.documents as StudioHistoryItem[]);
    } catch (err) {
      console.error('Failed to load studio history:', err);
    } finally {
      setHistoryLoading(false);
    }
  }, []);

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
        onContentGenerated(item.analysis, {});
      } else {
        onContentGenerated('', {});
      }
    },
    [onContentGenerated, onOpenAnalyzeChat]
  );

  const handleNewChat = useCallback(() => {
    setActiveChatId(null);
    setBrief('');
    setTone('');
    setKeywords('');
    setErrorMessage(null);
    localStorage.removeItem('documentId');
    onContentGenerated('', {});
  }, [onContentGenerated]);

  const handleDeleteChat = useCallback(
    async (item: StudioHistoryItem) => {
      const title = studioChatTitle(item.content);
      const confirmed = window.confirm(`Delete "${title}"? This cannot be undone.`);
      if (!confirmed) return;

      setDeletingId(item.$id);
      setErrorMessage(null);

      try {
        await deleteHistoryItem(item.$id);
        setHistoryItems(prev => prev.filter(entry => entry.$id !== item.$id));

        if (activeChatId === item.$id) {
          handleNewChat();
        }
      } catch (error) {
        console.error('Failed to delete chat:', error);
        setErrorMessage('Failed to delete chat. Please try again.');
      } finally {
        setDeletingId(null);
      }
    },
    [activeChatId, handleNewChat]
  );

  const handleGenerate = useCallback(async () => {
    const text = brief.trim();
    if (!text || loading) return;

    setErrorMessage(null);

    try {
      const result = await generate(text, { tone: tone || undefined, keywords });
      const keywordList = result.keywords ?? [];
      setLocalKeywords(keywordList);
      onContentGenerated(result.content, { keywords: keywordList });

      const docId = localStorage.getItem('documentId');
      setActiveChatId(docId);
      await loadHistory();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Something went wrong. Please try again.'
      );
    }
  }, [brief, generate, keywords, loadHistory, loading, onContentGenerated, tone]);

  const activeItem = historyItems.find(item => item.$id === activeChatId);
  const activeTitle = activeItem
    ? studioChatTitle(activeItem.content)
    : brief.trim()
      ? studioChatTitle(brief)
      : null;

  return (
    <div className={studioSplitShell}>
      <div className={studioHistoryColumn}>
        <StudioHistorySidebar
          items={historyItems}
          activeId={activeChatId}
          loading={historyLoading}
          deletingId={deletingId}
          onSelect={handleSelectChat}
          onDelete={item => void handleDeleteChat(item)}
          onNewChat={handleNewChat}
        />
      </div>
      <div className={studioWorkspaceColumn}>
        <StudioWorkspacePanel
          generatedContent={generatedContent}
          activeTitle={activeTitle}
          discoveredKeywords={localKeywords.length > 0 ? localKeywords : discoveredKeywords}
          historyLoading={historyLoading}
          loading={loading}
          brief={brief}
          tone={tone}
          keywords={keywords}
          errorMessage={errorMessage}
          onBriefChange={setBrief}
          onToneChange={setTone}
          onKeywordsChange={setKeywords}
          onGenerate={() => void handleGenerate()}
          onAnalyze={onAnalyze}
          onDownloadAsWord={onDownloadAsWord}
        />
      </div>
    </div>
  );
}
