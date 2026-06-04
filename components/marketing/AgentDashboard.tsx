'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Play, Loader2, CheckCircle2, XCircle, Clock, Wand2,
  FileText, TrendingUp, Zap, BarChart2, RefreshCw,
  ChevronRight, Target, BookOpen, Sparkles, Settings,
  Activity, Calendar, Share2, Send, Copy, Check, Tag,
} from 'lucide-react';
import { toast } from 'sonner';
import ContentBriefDisplay from './ContentBriefDisplay';
import QueueManager from './QueueManager';
import type { BrandProfile, AgentRun, ContentPlatform, OrchestratorResult, AgentRunStep } from '@/types/agents';
import MarkdownRenderer from '@/components/MarkdownRenderer';

interface AgentDashboardProps {
  userId: string;
  brandProfile: BrandProfile;
  onSetupEdit: () => void;
}

const PLATFORMS: { id: ContentPlatform; label: string; icon: string; wordCount: number }[] = [
  { id: 'blog', label: 'Blog Post', icon: '📝', wordCount: 1500 },
  { id: 'linkedin', label: 'LinkedIn', icon: '🔗', wordCount: 300 },
  { id: 'twitter', label: 'Twitter Thread', icon: '𝕏', wordCount: 250 },
  { id: 'facebook', label: 'Facebook', icon: '📘', wordCount: 200 },
  { id: 'instagram', label: 'Instagram', icon: '📸', wordCount: 150 },
  { id: 'email', label: 'Email', icon: '✉️', wordCount: 400 },
];

const STATUS_CONFIG: Record<AgentRun['status'], { color: string; icon: any; label: string }> = {
  idle: { color: 'text-muted-foreground', icon: Clock, label: 'Idle' },
  running: { color: 'text-amber-500', icon: Loader2, label: 'Running' },
  completed: { color: 'text-emerald-500', icon: CheckCircle2, label: 'Completed' },
  failed: { color: 'text-red-500', icon: XCircle, label: 'Failed' },
};

function StepIndicator({ steps }: { steps: AgentRunStep[] }) {
  if (!steps.length) return null;
  return (
    <div className="space-y-1.5 mt-3">
      {steps.map((step, i) => {
        const config = STATUS_CONFIG[step.status];
        const Icon = config.icon;
        return (
          <div key={i} className="flex items-center gap-2.5">
            <Icon className={`h-3.5 w-3.5 shrink-0 ${config.color} ${step.status === 'running' ? 'animate-spin' : ''}`} />
            <span className="text-xs text-muted-foreground">{step.name}</span>
            {step.outputSummary && <span className="text-xs text-muted-foreground/60 ml-auto truncate max-w-[150px]">{step.outputSummary}</span>}
            {step.durationMs && <span className="text-[10px] text-muted-foreground/50 ml-1 shrink-0">{(step.durationMs / 1000).toFixed(1)}s</span>}
          </div>
        );
      })}
    </div>
  );
}

function RunCard({ run, onView }: { run: AgentRun; onView?: (run: AgentRun) => void }) {
  const config = STATUS_CONFIG[run.status];
  const Icon = config.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 rounded-xl border border-border hover:border-primary/30 transition-all bg-background"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <Icon className={`h-3.5 w-3.5 shrink-0 ${config.color} ${run.status === 'running' ? 'animate-spin' : ''}`} />
            <span className={`text-[10px] font-bold uppercase tracking-wider ${config.color}`}>{config.label}</span>
            <div className="ml-auto flex items-center gap-1 flex-wrap">
              {/* Use allPlatforms from metadata only if it's a valid non-empty array */}
              {(() => {
                const fromMeta = (run as any).metadata?.allPlatforms;
                const platforms = Array.isArray(fromMeta) && fromMeta.length > 0
                  ? fromMeta
                  : [run.platform ?? 'blog'];
                return platforms.map((pid: string) => {
                  const meta = PLATFORMS.find(p => p.id === pid);
                  return (
                    <span key={pid} className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-secondary text-muted-foreground">
                      {meta?.icon} {pid}
                    </span>
                  );
                });
              })()}
            </div>
          </div>
          <p className="text-sm font-medium text-foreground truncate">{run.topic ?? 'Untitled'}</p>
          {run.currentStep && run.status === 'running' && (
            <p className="text-xs text-muted-foreground mt-0.5">→ {run.currentStep}</p>
          )}
          <p className="text-[11px] text-muted-foreground mt-1">
            {new Date(run.createdAt ?? '').toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
        {onView && run.status === 'completed' && (
          <button
            onClick={() => onView(run)}
            className="shrink-0 flex items-center gap-1 text-xs font-medium text-primary hover:opacity-80 transition-opacity"
          >
            View <ChevronRight className="h-3 w-3" />
          </button>
        )}
      </div>
      {run.steps && <StepIndicator steps={run.steps} />}
    </motion.div>
  );
}

export default function AgentDashboard({ userId, brandProfile, onSetupEdit }: AgentDashboardProps) {
  const [topic, setTopic] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<ContentPlatform[]>(['blog']);
  const [platformContents, setPlatformContents] = useState<Record<string, string>>({});
  const [activePlatformTab, setActivePlatformTab] = useState<string>('blog');
  const [running, setRunning] = useState(false);
  const [runs, setRuns] = useState<AgentRun[]>([]);
  const [currentResult, setCurrentResult] = useState<OrchestratorResult | null>(null);
  const [view, setView] = useState<'dashboard' | 'result' | 'schedule'>('dashboard');
  const [activeRunId, setActiveRunId] = useState<string | null>(null);
  const [loadingRuns, setLoadingRuns] = useState(true);

  // Publish state
  const [publishPlatforms, setPublishPlatforms] = useState<string[]>([]);
  const [publishing, setPublishing] = useState(false);
  const [publishResults, setPublishResults] = useState<{ platform: string; success: boolean; url?: string; error?: string }[]>([]);
  const [copied, setCopied] = useState(false);
  const [loadingResult, setLoadingResult] = useState(false);

  const loadRuns = useCallback(async () => {
    try {
      const res = await fetch(`/api/agents/runs?userId=${userId}&limit=10`);
      if (res.ok) {
        const { runs: data } = await res.json();
        setRuns(data ?? []);
      }
    } catch {
      // silent
    } finally {
      setLoadingRuns(false);
    }
  }, [userId]);

  useEffect(() => { loadRuns(); }, [loadRuns]);

  // Poll while a run is active
  useEffect(() => {
    if (!activeRunId) return;
    const interval = setInterval(() => {
      loadRuns();
      const activeRun = runs.find(r => r.id === activeRunId);
      if (activeRun && (activeRun.status === 'completed' || activeRun.status === 'failed')) {
        clearInterval(interval);
        setActiveRunId(null);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [activeRunId, runs, loadRuns]);

  const togglePlatform = (p: ContentPlatform) => {
    setSelectedPlatforms(prev =>
      prev.includes(p)
        ? prev.length === 1 ? prev   // keep at least one selected
          : prev.filter(x => x !== p)
        : [...prev, p]
    );
  };

  const handleRun = async () => {
    if (!topic.trim()) { toast.error('Please enter a topic'); return; }
    if (!selectedPlatforms.length) { toast.error('Select at least one platform'); return; }

    setRunning(true);
    setCurrentResult(null);
    setPlatformContents({});

    const primaryPlatform = selectedPlatforms[0];
    const extraPlatforms  = selectedPlatforms.slice(1);

    try {
      // Step 1: Full pipeline on primary platform (passes ALL selected platforms for history)
      const res = await fetch('/api/agents/orchestrate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          platform: primaryPlatform,
          allPlatforms: selectedPlatforms,   // stored in agent_run metadata
          userId,
          targetWordCount: PLATFORMS.find(p => p.id === primaryPlatform)?.wordCount ?? 1500,
        }),
      });

      const data = await res.json();
      if (!res.ok) { toast.error(data.error || 'Pipeline failed'); return; }

      const primary = data.optimizedContent ?? data.content ?? '';
      const contents: Record<string, string> = { [primaryPlatform]: primary };

      // Step 2: Adapt content for extra platforms using fast single-LLM call
      if (extraPlatforms.length > 0 && primary) {
        const adaptResults = await Promise.allSettled(
          extraPlatforms.map(ep =>
            fetch('/api/agents/adapt', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                content: primary,
                platform: ep,
                topic,
                brandVoice: brandProfile.brandVoice,
              }),
            }).then(r => r.json())
          )
        );

        adaptResults.forEach((result, i) => {
          if (result.status === 'fulfilled' && result.value?.content) {
            contents[extraPlatforms[i]] = result.value.content;
          }
        });
      }

      setPlatformContents(contents);
      setActivePlatformTab(primaryPlatform);
      setCurrentResult(data);
      setActiveRunId(data.agentRunId);
      await loadRuns();

      if (data.status === 'completed') {
        const count = Object.keys(contents).length;
        toast.success(`Pipeline complete! ${count} platform version${count > 1 ? 's' : ''} generated.`);
        setView('result');
      } else {
        toast.error(data.error || 'Pipeline failed');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to start agent pipeline');
    } finally {
      setRunning(false);
    }
  };

  const completedToday = runs.filter(r => r.status === 'completed' && r.createdAt && new Date(r.createdAt).toDateString() === new Date().toDateString()).length;
  const totalCompleted = runs.filter(r => r.status === 'completed').length;
  const totalFailed = runs.filter(r => r.status === 'failed').length;

  if (loadingResult) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <motion.div
            className="w-10 h-10 border-2 border-primary/20 border-t-primary rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
          />
          <p className="text-xs text-muted-foreground">Loading run details...</p>
        </div>
      </div>
    );
  }

  if (view === 'result' && currentResult?.status === 'completed') {
    return (
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-6 py-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-foreground">Pipeline Complete</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Topic: {currentResult.brief?.topic}</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => { setView('dashboard'); setCurrentResult(null); setTopic(''); loadRuns(); }}
                className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-xl bg-secondary border border-border text-foreground hover:bg-accent transition-colors"
              >
                ← Dashboard
              </button>
            </div>
          </div>

          {/* Score summary */}
          {currentResult.improvements && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* SEO Score */}
              <div className="p-3 rounded-xl border border-border bg-background">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">SEO Score</p>
                <p className="text-lg font-bold mt-1 text-blue-500">{currentResult.seoReport?.seoScore ?? '—'}</p>
              </div>

              {/* Improvements */}
              <div className="p-3 rounded-xl border border-border bg-background">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Improvements</p>
                <p className="text-lg font-bold mt-1 text-emerald-500">{currentResult.improvements.length} fixes</p>
              </div>

              {/* High Impact */}
              <div className="p-3 rounded-xl border border-border bg-background">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">High Impact</p>
                <p className="text-lg font-bold mt-1 text-amber-500">{currentResult.improvements.filter(i => i.impact === 'high').length}</p>
              </div>

              {/* Platforms — show all selected */}
              <div className="p-3 rounded-xl border border-border bg-background">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Platforms</p>
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {Object.keys(platformContents).length > 0
                    ? Object.keys(platformContents).map(pid => {
                        const meta = PLATFORMS.find(p => p.id === pid);
                        return (
                          <span key={pid} className="flex items-center gap-0.5 text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-purple-100 text-purple-600 capitalize">
                            {meta?.icon} {pid}
                          </span>
                        );
                      })
                    : <span className="text-sm font-bold text-purple-500 capitalize">{currentResult.brief?.platform}</span>
                  }
                </div>
              </div>
            </div>
          )}

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Content Brief */}
            {currentResult.brief && (
              <div>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Content Brief</h3>
                <ContentBriefDisplay brief={currentResult.brief} />
              </div>
            )}

            {/* Generated Content — platform tabs if multiple */}
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Generated Content</h3>

              {/* Platform tabs — only show when multiple platforms were generated */}
              {Object.keys(platformContents).length > 1 && (
                <div className="flex gap-1 mb-3 flex-wrap">
                  {Object.keys(platformContents).map(pid => {
                    const meta = PLATFORMS.find(p => p.id === pid);
                    return (
                      <button
                        key={pid}
                        onClick={() => setActivePlatformTab(pid)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold border transition-all ${
                          activePlatformTab === pid
                            ? 'grad text-white border-transparent'
                            : 'border-border text-muted-foreground hover:text-foreground hover:border-primary/40'
                        }`}
                      >
                        <span>{meta?.icon}</span> {meta?.label ?? pid}
                      </button>
                    );
                  })}
                </div>
              )}

              <div className="border border-border rounded-xl p-4 max-h-[600px] overflow-y-auto bg-background">
                <MarkdownRenderer
                  content={
                    Object.keys(platformContents).length > 0
                      ? (platformContents[activePlatformTab] ?? platformContents[Object.keys(platformContents)[0]] ?? '')
                      : (currentResult.optimizedContent ?? currentResult.content ?? '')
                  }
                />
              </div>
            </div>

          </div>

          {/* Optimization Improvements */}
          {currentResult.improvements && currentResult.improvements.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Optimizations Applied</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {currentResult.improvements.map((imp, i) => (
                  <div key={i} className="p-3 rounded-xl border border-border bg-background">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded-full ${
                        imp.impact === 'high' ? 'bg-red-500/10 text-red-500' :
                        imp.impact === 'medium' ? 'bg-amber-500/10 text-amber-500' :
                        'bg-blue-500/10 text-blue-500'
                      }`}>{imp.impact}</span>
                      <span className="text-[10px] font-semibold uppercase text-muted-foreground">{imp.category}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-0.5">{imp.issue}</p>
                    <p className="text-xs text-foreground font-medium">→ {imp.fix}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Publish Panel ── */}
          <div className="border border-border rounded-2xl overflow-hidden bg-background">
            <div className="px-5 py-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Send className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-bold text-foreground">Publish Content</h3>
              </div>
              {/* Copy button */}
              <button
                onClick={() => {
                  const text = (currentResult.optimizedContent ?? '').replace(/[#*_`]/g, '').trim();
                  navigator.clipboard.writeText(text);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                  toast.success('Content copied to clipboard');
                }}
                className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-secondary border border-border text-foreground hover:bg-accent transition-colors"
              >
                {copied ? <><Check className="h-3.5 w-3.5 text-emerald-500" /> Copied</> : <><Copy className="h-3.5 w-3.5" /> Copy Content</>}
              </button>
            </div>

            <div className="px-5 py-4 space-y-4">
              {/* Platform selector */}
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                  Select platforms to publish to:
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'linkedin',  label: 'LinkedIn',  icon: '🔗' },
                    { id: 'instagram', label: 'Instagram', icon: '📸' },
                    { id: 'facebook',  label: 'Facebook',  icon: '📘' },
                    { id: 'twitter',   label: 'Twitter/X', icon: '𝕏'  },
                    { id: 'wordpress', label: 'WordPress', icon: '🌐' },
                  ].map(p => {
                    const selected = publishPlatforms.includes(p.id);
                    return (
                      <button
                        key={p.id}
                        onClick={() => setPublishPlatforms(prev =>
                          selected ? prev.filter(x => x !== p.id) : [...prev, p.id]
                        )}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                          selected
                            ? 'grad text-white border-transparent'
                            : 'border-border text-muted-foreground hover:text-foreground hover:border-primary/40 bg-background'
                        }`}
                      >
                        <span>{p.icon}</span> {p.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Publish button */}
              <div className="flex items-center gap-3">
                <button
                  onClick={async () => {
                    if (!publishPlatforms.length) { toast.error('Please select at least one platform'); return; }
                    setPublishing(true);
                    setPublishResults([]);
                    try {
                      const res = await fetch('/api/agents/publish', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          userId,
                          content: currentResult.optimizedContent ?? currentResult.content,
                          platforms: publishPlatforms,
                          meta: { title: currentResult.brief?.topic },
                        }),
                      });
                      const data = await res.json();
                      if (!res.ok) throw new Error(data.error || 'Publishing failed');
                      setPublishResults(data.results ?? []);
                      const ok = (data.summary?.successful ?? 0);
                      const fail = (data.summary?.failed ?? 0);
                      if (ok > 0) toast.success(`Published to ${ok} platform${ok > 1 ? 's' : ''} successfully!`);
                      if (fail > 0) toast.error(`${fail} platform fail hua — credentials check karo`);
                    } catch (err: any) {
                      toast.error(err.message || 'Publishing failed');
                    } finally {
                      setPublishing(false);
                    }
                  }}
                  disabled={publishing || publishPlatforms.length === 0}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl grad text-white text-sm font-semibold disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-90 transition-all"
                >
                  {publishing
                    ? <><Loader2 className="h-4 w-4 animate-spin" /> Publishing...</>
                    : <><Send className="h-4 w-4" /> Publish Now</>}
                </button>
                <p className="text-xs text-muted-foreground">
                  {publishPlatforms.length === 0
                    ? 'Select platforms above to publish'
                    : `${publishPlatforms.length} platform${publishPlatforms.length > 1 ? 's' : ''} selected`}
                </p>
              </div>

              {/* Publish results */}
              {publishResults.length > 0 && (
                <div className="space-y-2 pt-1">
                  {publishResults.map((r, i) => (
                    <div key={i} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border ${r.success ? 'border-emerald-200 bg-emerald-50' : 'border-red-200 bg-red-50'}`}>
                      {r.success
                        ? <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                        : <XCircle className="h-4 w-4 text-red-500 shrink-0" />}
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-semibold text-foreground capitalize">{r.platform}</span>
                        {r.success
                          ? <span className="text-xs text-emerald-600 ml-2">Published successfully</span>
                          : <span className="text-xs text-red-500 ml-2">{r.error}</span>}
                      </div>
                      {r.url && (
                        <a href={r.url} target="_blank" rel="noopener noreferrer"
                          className="text-xs text-primary font-medium hover:opacity-80 shrink-0">
                          View Post →
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* No credentials warning */}
              {publishPlatforms.length > 0 && publishResults.length === 0 && !publishing && (
                <p className="text-[11px] text-muted-foreground">
                  💡 Accounts not connected yet? Use the <strong>Connect Socials</strong> button in the header to add your credentials.
                </p>
              )}
            </div>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-5xl mx-auto px-6 py-6 space-y-6">

        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-xl grad flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <h1 className="text-base font-bold text-foreground">AI Marketing Manager</h1>
            </div>
          </div>
          <button
            onClick={onSetupEdit}
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-xl bg-secondary border border-border text-foreground hover:bg-accent transition-colors shrink-0"
          >
            <Settings className="h-3.5 w-3.5" /> Brand Setup
          </button>
        </div>

        {/* Today's Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Today's Runs", value: completedToday, icon: Activity, color: 'text-primary' },
            { label: 'Total Generated', value: totalCompleted, icon: FileText, color: 'text-emerald-500' },
            { label: 'Failed', value: totalFailed, icon: XCircle, color: 'text-red-400' },
            { label: 'Platform', value: brandProfile.postingSchedule.frequency, icon: Calendar, color: 'text-amber-500' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="p-4 rounded-xl border border-border bg-background">
              <div className="flex items-center gap-2 mb-2">
                <Icon className={`h-4 w-4 ${color}`} />
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
              </div>
              <p className={`text-xl font-bold ${color} capitalize`}>{value}</p>
            </div>
          ))}
        </div>

        {/* Run Pipeline */}
        <div className="p-5 rounded-2xl border border-border bg-gradient-to-br from-[#1e1b4b]/5 via-transparent to-[#6366f1]/5">
          <div className="flex items-center gap-2 mb-4">
            <Wand2 className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-bold text-foreground">Run Full AI Pipeline</h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground block mb-1.5">Topic / Title</label>
              <input
                value={topic}
                onChange={e => setTopic(e.target.value)}
                placeholder={`e.g. 10 ways to grow your ${brandProfile.industry} business`}
                disabled={running}
                className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary/60 transition-all disabled:opacity-50"
                onKeyDown={e => { if (e.key === 'Enter' && !running) handleRun(); }}
              />
            </div>
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground block mb-1.5">
                Platforms <span className="normal-case font-normal text-muted-foreground/60">(select multiple)</span>
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {PLATFORMS.map(p => {
                  const active = selectedPlatforms.includes(p.id);
                  return (
                    <button
                      key={p.id}
                      onClick={() => togglePlatform(p.id)}
                      disabled={running}
                      className={`relative flex flex-col items-center py-1.5 px-1 rounded-lg border text-[10px] font-medium transition-all disabled:opacity-50 ${active ? 'border-primary bg-primary/5 text-primary' : 'border-border text-muted-foreground hover:text-foreground hover:border-primary/30'}`}
                    >
                      {active && (
                        <span className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-primary" />
                      )}
                      <span className="text-sm mb-0.5">{p.icon}</span>
                      {p.label.split(' ')[0]}
                    </button>
                  );
                })}
              </div>
              {selectedPlatforms.length > 1 && (
                <p className="text-[10px] text-muted-foreground mt-1.5">
                  Primary: <strong className="text-primary">{selectedPlatforms[0]}</strong> · Full pipeline runs first, then adapts for {selectedPlatforms.slice(1).join(', ')}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRun}
              disabled={running || !topic.trim()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl grad text-white text-sm font-semibold disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-90 transition-all shadow-sm"
            >
              {running ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Pipeline Running...</>
              ) : (
                <><Play className="h-4 w-4" /> Launch Pipeline</>
              )}
            </button>
            {!running && (
              <p className="text-xs text-muted-foreground">
                Research → Generate → SEO → Optimize
              </p>
            )}
          </div>

          {/* Pipeline steps visual */}
          {!running && (
            <div className="flex items-center gap-1 mt-4 overflow-x-auto pb-1">
              {[
                { label: 'Research', icon: BookOpen, color: 'text-blue-500' },
                { label: 'Generate', icon: Wand2, color: 'text-purple-500' },
                { label: 'SEO', icon: TrendingUp, color: 'text-green-500' },
                { label: 'Optimize', icon: Zap, color: 'text-amber-500' },
              ].map((s, i) => {
                const Icon = s.icon;
                return (
                  <div key={s.label} className="flex items-center gap-1 shrink-0">
                    <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-secondary border border-border">
                      <Icon className={`h-3 w-3 ${s.color}`} />
                      <span className="text-[10px] font-medium text-muted-foreground">{s.label}</span>
                    </div>
                    {i < 3 && <ChevronRight className="h-3 w-3 text-muted-foreground/50 shrink-0" />}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Brand Summary */}
        <div className="grid sm:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-xl border border-border bg-background">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-3.5 w-3.5 text-primary" />
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Voice</span>
            </div>
            <p className="text-sm font-semibold text-foreground capitalize">{brandProfile.brandVoice.tone}</p>
            <div className="flex flex-wrap gap-1 mt-1.5">
              {brandProfile.brandVoice.adjectives.map(a => (
                <span key={a} className="text-[10px] px-1.5 py-0.5 rounded-full bg-secondary text-muted-foreground">{a}</span>
              ))}
            </div>
          </div>
          <div className="p-3.5 rounded-xl border border-border bg-background">
            <div className="flex items-center gap-2 mb-2">
              <Tag className="h-3.5 w-3.5 text-primary" />
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Categories</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {brandProfile.contentCategories.slice(0, 4).map(c => (
                <span key={c} className="text-[10px] px-1.5 py-0.5 rounded-full bg-secondary text-muted-foreground">{c}</span>
              ))}
              {brandProfile.contentCategories.length > 4 && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-secondary text-muted-foreground">+{brandProfile.contentCategories.length - 4}</span>
              )}
            </div>
          </div>
          <div className="p-3.5 rounded-xl border border-border bg-background">
            <div className="flex items-center gap-2 mb-2">
              <Share2 className="h-3.5 w-3.5 text-primary" />
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Channels</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {Object.keys(brandProfile.socialAccounts).filter(k => (brandProfile.socialAccounts as any)[k]).map(k => (
                <span key={k} className="text-[10px] px-1.5 py-0.5 rounded-full bg-secondary text-muted-foreground capitalize">{k}</span>
              ))}
              {Object.keys(brandProfile.socialAccounts).filter(k => (brandProfile.socialAccounts as any)[k]).length === 0 && (
                <span className="text-[10px] text-muted-foreground">No channels configured</span>
              )}
            </div>
          </div>
        </div>

        {/* Tabs: Runs / Schedule */}
        <div>
          <div className="flex items-center gap-1 mb-4 border-b border-border">
            {[
              { id: 'dashboard', label: 'Recent Runs', icon: Activity },
              { id: 'schedule',  label: 'Auto Schedule', icon: Calendar },
            ].map(tab => {
              const Icon = tab.icon;
              const active = view === tab.id || (tab.id === 'dashboard' && view === 'dashboard');
              return (
                <button
                  key={tab.id}
                  onClick={() => setView(tab.id as any)}
                  className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all -mb-px ${
                    active
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" /> {tab.label}
                </button>
              );
            })}
            {view === 'dashboard' && (
              <button onClick={loadRuns} className="ml-auto flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors pb-2">
                <RefreshCw className="h-3 w-3" /> Refresh
              </button>
            )}
          </div>

          {/* Schedule tab */}
          {view === 'schedule' && (
            <QueueManager
              userId={userId}
              companyId={brandProfile.companyId}
              postingSchedule={brandProfile.postingSchedule}
            />
          )}

          {/* Runs tab */}
          {view === 'dashboard' && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold text-foreground">Recent Agent Runs</h2>
              </div>
              {loadingRuns ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                </div>
              ) : runs.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-border rounded-2xl">
                  <BarChart2 className="h-8 w-8 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-sm font-medium text-muted-foreground">No runs yet</p>
                  <p className="text-xs text-muted-foreground/70 mt-1">Launch your first pipeline above to get started.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {runs.map(run => (
                    <RunCard
                      key={run.id}
                      run={run}
                      onView={async (r) => {
                        // If same session result is already loaded, just switch view
                        if (currentResult?.agentRunId === r.id) {
                          setPublishResults([]);
                          setView('result');
                          return;
                        }
                        // Otherwise fetch from DB
                        setLoadingResult(true);
                        try {
                          const res = await fetch(`/api/agents/runs/${r.id}`);
                          if (!res.ok) { toast.error('Could not load run details'); return; }
                          const { brief, content } = await res.json();
                          setCurrentResult({
                            agentRunId: r.id!,
                            status: 'completed',
                            brief: brief ?? undefined,
                            content: content ?? undefined,
                            optimizedContent: content ?? undefined,
                            seoReport: brief?.seoReport ?? undefined,
                            improvements: [],
                            steps: r.steps ?? [],
                          });
                          setPublishResults([]);
                          setPublishPlatforms([]);
                          setView('result');
                        } catch {
                          toast.error('Failed to load run details');
                        } finally {
                          setLoadingResult(false);
                        }
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
