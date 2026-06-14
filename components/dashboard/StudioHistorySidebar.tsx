'use client';

import { useMemo, useState } from 'react';
import { Loader2, Plus, Search, Trash2, X } from 'lucide-react';
import {
  formatStudioChatTime,
  studioChatInitial,
  studioChatMode,
  studioChatPreviewForItem,
  studioChatTitle,
  type StudioHistoryItem,
} from '@/lib/dashboard/studioHistory';
import { MODE_LABELS } from '@/lib/marketing/workflows';
import { StudioChatListSkeleton } from '@/components/dashboard/StudioPanelSkeleton';
import { marketingFocusRing } from '@/lib/marketing/marketingTheme';
import { cn } from '@/lib/utils';

type StudioHistorySidebarProps = {
  items: StudioHistoryItem[];
  activeId: string | null;
  loading?: boolean;
  deletingId?: string | null;
  onSelect: (item: StudioHistoryItem) => void;
  onDelete: (item: StudioHistoryItem) => void;
  onNewChat: () => void;
};

export default function StudioHistorySidebar({
  items,
  activeId,
  loading = false,
  deletingId = null,
  onSelect,
  onDelete,
  onNewChat,
}: StudioHistorySidebarProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return items;
    return items.filter(item => {
      const title = studioChatTitle(item.content).toLowerCase();
      const preview = studioChatPreviewForItem(item).toLowerCase();
      const mode = MODE_LABELS[studioChatMode(item)].toLowerCase();
      return title.includes(q) || preview.includes(q) || mode.includes(q);
    });
  }, [items, searchQuery]);

  const closeSearch = () => {
    setSearchOpen(false);
    setSearchQuery('');
  };

  return (
    <div className="flex h-full min-h-0 flex-col bg-[#f4f6f8]">
      <header className="shrink-0 border-b border-slate-200/80 bg-white px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-sm font-semibold text-slate-900">Chats</h2>
            <p className="text-xs text-slate-500">Generation &amp; analysis history</p>
          </div>

          <button
            type="button"
            onClick={() => (searchOpen ? closeSearch() : setSearchOpen(true))}
            className={cn(
              'inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border px-3 text-sm font-medium transition-colors',
              searchOpen
                ? 'border-violet-300 bg-violet-50 text-violet-800'
                : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50',
              marketingFocusRing
            )}
            aria-label={searchOpen ? 'Close search' : 'Search chats'}
            aria-expanded={searchOpen}
          >
            {searchOpen ? (
              <X className="h-4 w-4 shrink-0" aria-hidden />
            ) : (
              <Search className="h-4 w-4 shrink-0" aria-hidden />
            )}
            <span className="hidden sm:inline">{searchOpen ? 'Close' : 'Search'}</span>
          </button>
        </div>

        {searchOpen ? (
          <div className="mt-3">
            <label htmlFor="studio-chat-search" className="sr-only">
              Search chats
            </label>
            <input
              id="studio-chat-search"
              type="search"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by title or preview…"
              autoFocus
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-200"
            />
          </div>
        ) : null}
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto custom-scrollbar">
        {loading ? (
          <StudioChatListSkeleton />
        ) : filteredItems.length === 0 ? (
          <p className="px-4 py-6 text-center text-sm leading-relaxed text-slate-500">
            {searchQuery.trim() ? 'No chats match your search.' : 'No chats yet. Tap + below to start.'}
          </p>
        ) : (
          <ul role="list">
            {filteredItems.map(item => {
              const title = studioChatTitle(item.content);
              const active = activeId === item.$id;
              const preview = studioChatPreviewForItem(item);
              const time = formatStudioChatTime(item.updatedAt || item.createdAt);
              const mode = studioChatMode(item);
              const modeLabel = MODE_LABELS[mode];

              const isDeleting = deletingId === item.$id;
              const showDelete = hoveredId === item.$id || isDeleting;

              return (
                <li
                  key={item.$id}
                  className={cn(
                    'relative min-h-[4.75rem] border-b border-slate-200/60',
                    active && 'bg-white shadow-sm'
                  )}
                  onMouseEnter={() => setHoveredId(item.$id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  <button
                    type="button"
                    onClick={() => onSelect(item)}
                    aria-current={active ? 'true' : undefined}
                    disabled={isDeleting}
                    className={cn(
                      'flex h-full w-full min-h-[4.75rem] min-w-0 gap-3 px-3 py-3 pr-14 text-left transition-colors',
                      !active && 'hover:bg-white/70',
                      isDeleting && 'opacity-60',
                      marketingFocusRing
                    )}
                  >
                    <div
                      className={cn(
                        'flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-semibold',
                        mode === 'analyze'
                          ? active
                            ? 'bg-sky-600 text-white'
                            : 'bg-sky-100 text-sky-700'
                          : active
                            ? 'bg-violet-600 text-white'
                            : 'bg-violet-100 text-violet-700'
                      )}
                      aria-hidden
                    >
                      {studioChatInitial(title)}
                    </div>
                    <div className="min-w-0 flex-1 overflow-hidden">
                      <div className="flex min-w-0 items-baseline justify-between gap-2">
                        <span className="min-w-0 truncate text-sm font-semibold text-slate-900">
                          {title}
                        </span>
                        <span
                          className={cn(
                            'shrink-0 text-[11px] text-slate-400',
                            showDelete && 'invisible'
                          )}
                          aria-hidden={showDelete}
                        >
                          {time}
                        </span>
                      </div>
                      <div className="mt-0.5 flex min-w-0 items-center gap-2">
                        <span
                          className={cn(
                            'shrink-0 rounded px-1.5 py-px text-[10px] font-semibold uppercase tracking-wide',
                            mode === 'analyze'
                              ? 'bg-sky-50 text-sky-700'
                              : 'bg-violet-50 text-violet-700'
                          )}
                        >
                          {modeLabel}
                        </span>
                        <p className="min-w-0 truncate text-xs text-slate-500">{preview}</p>
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={e => {
                      e.stopPropagation();
                      onDelete(item);
                    }}
                    disabled={isDeleting}
                    tabIndex={showDelete ? 0 : -1}
                    aria-hidden={!showDelete}
                    aria-label={`Delete ${title}`}
                    className={cn(
                      'absolute right-2 top-1/2 z-10 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-[#fca5a5] shadow-sm transition-opacity',
                      showDelete ? 'opacity-100' : 'pointer-events-none opacity-0',
                      marketingFocusRing
                    )}
                    style={{
                      backgroundColor: '#ef4444',
                      color: '#ffffff',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.backgroundColor = '#dc2626';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.backgroundColor = '#ef4444';
                    }}
                  >
                    {isDeleting ? (
                      <Loader2 className="h-4 w-4 animate-spin" style={{ color: '#fff' }} aria-hidden />
                    ) : (
                      <Trash2 className="h-4 w-4" style={{ color: '#fff', stroke: '#fff' }} aria-hidden />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <footer className="flex shrink-0 justify-end border-t border-slate-200/80 bg-white px-4 py-3">
        <button
          type="button"
          onClick={onNewChat}
          className={cn(
            'flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md shadow-slate-900/15 transition-transform hover:scale-105 hover:bg-primary/90 active:scale-95',
            marketingFocusRing
          )}
          aria-label="Create new chat"
          title="New chat"
        >
          <Plus className="h-6 w-6 stroke-[2.5]" aria-hidden />
        </button>
      </footer>
    </div>
  );
}
