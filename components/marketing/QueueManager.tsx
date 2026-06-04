'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Trash2, Clock, CheckCircle2, XCircle,
  Loader2, RefreshCw, Calendar, ChevronUp, ChevronDown, Zap,
} from 'lucide-react';
import { toast } from 'sonner';

interface QueueItem {
  id: string;
  topic: string;
  platform: string;
  priority: number;
  status: 'queued' | 'running' | 'done' | 'failed' | 'skipped';
  scheduled_at?: string;
  done_at?: string;
  error?: string;
  created_at: string;
}

const PLATFORMS = [
  { id: 'blog', label: 'Blog', icon: '📝' },
  { id: 'linkedin', label: 'LinkedIn', icon: '🔗' },
  { id: 'twitter', label: 'Twitter/X', icon: '𝕏' },
  { id: 'instagram', label: 'Instagram', icon: '📸' },
  { id: 'facebook', label: 'Facebook', icon: '📘' },
];

const STATUS_STYLE: Record<QueueItem['status'], { color: string; icon: any; label: string }> = {
  queued:  { color: 'text-blue-500',    icon: Clock,        label: 'Queued'  },
  running: { color: 'text-amber-500',   icon: Loader2,      label: 'Running' },
  done:    { color: 'text-emerald-500', icon: CheckCircle2, label: 'Done'    },
  failed:  { color: 'text-red-500',     icon: XCircle,      label: 'Failed'  },
  skipped: { color: 'text-muted-foreground', icon: Clock,   label: 'Skipped' },
};

interface QueueManagerProps {
  userId: string;
  companyId?: string | null;
  postingSchedule: { frequency: string; days: string[]; time: string; timezone: string };
}

export default function QueueManager({ userId, companyId, postingSchedule }: QueueManagerProps) {
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTopic, setNewTopic] = useState('');
  const [newPlatform, setNewPlatform] = useState('blog');
  const [adding, setAdding] = useState(false);

  const loadQueue = useCallback(async () => {
    try {
      const res = await fetch(`/api/agents/queue?userId=${userId}`);
      if (res.ok) {
        const { queue: data } = await res.json();
        setQueue(data ?? []);
      }
    } catch { /* silent */ }
    finally { setLoading(false); }
  }, [userId]);

  useEffect(() => { loadQueue(); }, [loadQueue]);

  const handleAdd = async () => {
    if (!newTopic.trim()) { toast.error('Enter a topic first'); return; }
    setAdding(true);
    try {
      const res = await fetch('/api/agents/queue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, companyId, topic: newTopic.trim(), platform: newPlatform, priority: 0 }),
      });
      if (!res.ok) throw new Error('Failed to add');
      const { item } = await res.json();
      setQueue(prev => [...prev, item]);
      setNewTopic('');
      toast.success('Topic added to queue');
    } catch (err: any) {
      toast.error(err.message || 'Failed to add topic');
    } finally { setAdding(false); }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch('/api/agents/queue', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      setQueue(prev => prev.filter(i => i.id !== id));
      toast.success('Removed from queue');
    } catch { toast.error('Failed to remove'); }
  };

  const handlePriority = async (id: string, direction: 'up' | 'down') => {
    const idx = queue.findIndex(i => i.id === id);
    if (idx === -1) return;
    const newPriority = direction === 'up' ? queue[idx].priority + 1 : queue[idx].priority - 1;
    await fetch('/api/agents/queue', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, priority: newPriority }),
    });
    setQueue(prev => prev.map(i => i.id === id ? { ...i, priority: newPriority } : i)
      .sort((a, b) => b.priority - a.priority || new Date(a.created_at).getTime() - new Date(b.created_at).getTime()));
  };

  const queued = queue.filter(i => i.status === 'queued');
  const history = queue.filter(i => i.status !== 'queued');

  // Next run time calculation
  const nextRun = (() => {
    const now = new Date();
    const [h, m] = (postingSchedule.time ?? '09:00').split(':').map(Number);
    const days = postingSchedule.days ?? [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(now);
      d.setDate(d.getDate() + i);
      const dayName = d.toLocaleDateString('en-US', { weekday: 'long' });
      if (days.includes(dayName)) {
        d.setHours(h, m, 0, 0);
        if (d > now) return d;
      }
    }
    return null;
  })();

  return (
    <div className="space-y-5">
      {/* Schedule status */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-[#1e1b4b]/5 to-[#6366f1]/5 border border-primary/20">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-bold text-foreground">Auto-Pilot Active</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Frequency', value: postingSchedule.frequency },
            { label: 'Days', value: postingSchedule.days?.length ? postingSchedule.days.map((d: string) => d.slice(0, 3)).join(', ') : 'None' },
            { label: 'Time', value: postingSchedule.time },
            { label: 'Next Run', value: nextRun ? nextRun.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) : 'Not scheduled' },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
              <p className="text-xs font-semibold text-foreground mt-0.5 capitalize">{value}</p>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-muted-foreground mt-3">
          Vercel Cron runs every hour → checks if today is a posting day → picks the top topic from the queue → runs the full pipeline → publishes automatically.
        </p>
      </div>

      {/* Add topic */}
      <div className="p-4 rounded-2xl border border-border bg-background space-y-3">
        <p className="text-xs font-semibold text-foreground">Add Topic to Queue</p>
        <div className="flex gap-2">
          <input
            value={newTopic}
            onChange={e => setNewTopic(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleAdd(); }}
            placeholder="e.g. How to reduce SaaS churn rate in 2025"
            className="flex-1 bg-background border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary/60 transition-all"
          />
          <div className="relative">
            <select
              value={newPlatform}
              onChange={e => setNewPlatform(e.target.value)}
              className="appearance-none bg-background border border-border rounded-xl px-3 py-2 pr-7 text-sm text-foreground outline-none focus:border-primary/60 transition-all cursor-pointer"
            >
              {PLATFORMS.map(p => <option key={p.id} value={p.id}>{p.icon} {p.label}</option>)}
            </select>
            <svg className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </div>
          <button
            onClick={handleAdd}
            disabled={adding || !newTopic.trim()}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl grad text-white text-xs font-semibold disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-90 transition-all"
          >
            {adding ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
            Add
          </button>
        </div>
      </div>

      {/* Queued topics */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-bold text-foreground">
            Upcoming Queue <span className="text-muted-foreground font-normal">({queued.length} topics)</span>
          </p>
          <button onClick={loadQueue} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
            <RefreshCw className="h-3 w-3" /> Refresh
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
          </div>
        ) : queued.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-border rounded-2xl">
            <Calendar className="h-7 w-7 text-muted-foreground/30 mx-auto mb-2" />
            <p className="text-sm font-medium text-muted-foreground">Queue is empty</p>
            <p className="text-xs text-muted-foreground/60 mt-1">Add topics above — AI will auto-pick one each scheduled day.</p>
          </div>
        ) : (
          <div className="space-y-2">
            <AnimatePresence>
              {queued.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-3 p-3 rounded-xl border border-border bg-background hover:border-primary/30 transition-all"
                >
                  {/* Priority controls */}
                  <div className="flex flex-col gap-0.5 shrink-0">
                    <button onClick={() => handlePriority(item.id, 'up')} disabled={idx === 0} className="text-muted-foreground hover:text-foreground disabled:opacity-20 transition-colors">
                      <ChevronUp className="h-3.5 w-3.5" />
                    </button>
                    <button onClick={() => handlePriority(item.id, 'down')} disabled={idx === queued.length - 1} className="text-muted-foreground hover:text-foreground disabled:opacity-20 transition-colors">
                      <ChevronDown className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* Position badge */}
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="text-[10px] font-bold text-primary">{idx + 1}</span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{item.topic}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      {PLATFORMS.find(p => p.id === item.platform)?.icon} {item.platform} · Added {new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                  </div>

                  {/* Delete */}
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 rounded-lg text-muted-foreground/50 hover:text-red-500 hover:bg-red-500/10 transition-colors shrink-0"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* History */}
      {history.length > 0 && (
        <div>
          <p className="text-xs font-bold text-foreground mb-3">Run History</p>
          <div className="space-y-2">
            {history.slice(0, 5).map(item => {
              const s = STATUS_STYLE[item.status];
              const Icon = s.icon;
              return (
                <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl border border-border bg-background/50">
                  <Icon className={`h-3.5 w-3.5 shrink-0 ${s.color} ${item.status === 'running' ? 'animate-spin' : ''}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground truncate">{item.topic}</p>
                    {item.error && <p className="text-[11px] text-red-500 mt-0.5">{item.error}</p>}
                  </div>
                  <span className={`text-[10px] font-bold uppercase ${s.color}`}>{s.label}</span>
                  <p className="text-[11px] text-muted-foreground shrink-0">
                    {item.done_at ? new Date(item.done_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
