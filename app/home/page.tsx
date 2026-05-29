'use client';

import { motion } from 'framer-motion';
import { Edit, FileSearch, Wand2, BarChart3, History, ArrowRight, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getUser } from '@/lib/user/appwrite';

const stagger = { visible: { transition: { staggerChildren: 0.08 } } };
const fadeUp = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

const tools = [
  { mode: 'ai-generate', label: 'AI-Powered',    description: 'Generate a 1000+ word article from a title, keywords, and tone.', icon: Wand2,      gradient: 'from-indigo-500 to-blue-600',   glow: 'rgba(67,56,202,0.08)',  badge: 'Most used' },
  { mode: 'create',      label: 'Smart Editor',   description: 'Write and edit rich content with Quill, then analyze or score it.', icon: Edit,       gradient: 'from-blue-500 to-indigo-600',   glow: 'rgba(99,102,241,0.08)', badge: null },
  { mode: 'analyze',     label: 'Deep Analysis',  description: 'Get readability score, tone, key insights, outline and info gain.', icon: FileSearch, gradient: 'from-indigo-600 to-violet-600', glow: 'rgba(79,70,229,0.08)',  badge: null },
  { mode: 'ai-score',    label: 'Realness Score', description: 'Detect AI vs human writing patterns and get a humanized rewrite.',  icon: BarChart3,  gradient: 'from-blue-600 to-indigo-700',  glow: 'rgba(37,99,235,0.08)',  badge: null },
];

export default function Home() {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const sessionToken = localStorage.getItem('sessionToken');
      if (!sessionToken) { router.push('/auth/login'); return; }
      try {
        await getUser(sessionToken);
        setAuthChecked(true);
      } catch (err: unknown) {
        const msg = (err as Error)?.message ?? '';
        if (msg === 'SESSION_EXPIRED') {
          localStorage.removeItem('sessionToken');
          localStorage.removeItem('documentId');
          router.push('/auth/login');
        } else {
          setAuthChecked(true);
        }
      }
    };
    checkAuth();
  }, [router]);

  if (!authChecked) return null;

  return (
    <div className="min-h-screen flex flex-col bg-background relative overflow-hidden">

      {/* Same gradient orbs as welcome page */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[700px] h-[700px] rounded-full opacity-30"
          style={{ background: 'radial-gradient(circle, rgba(67,56,202,0.15) 0%, transparent 70%)' }} />
        <div className="absolute -top-20 right-0 w-[500px] h-[500px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)' }} />
      </div>

      {/* Top bar */}
      <header className="relative z-10 flex items-center justify-between px-6 sm:px-8 py-4 border-b border-border bg-white/80 backdrop-blur-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg grad flex items-center justify-center" aria-hidden="true">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-sm font-semibold text-foreground tracking-tight">ContentCraft Inspector</span>
        </div>
        <button
          onClick={() => router.push('/history')}
          className="flex items-center gap-2 text-xs font-medium px-3.5 py-2 rounded-lg transition-colors text-muted-foreground hover:text-foreground hover:bg-secondary min-h-[36px]"
        >
          <History className="w-3.5 h-3.5" aria-hidden="true" />
          History
        </button>
      </header>

      {/* Main */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12 sm:py-16">

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10 sm:mb-14"
        >
          <div className="inline-flex items-center gap-2 text-xs font-medium px-3.5 py-1.5 rounded-full mb-5 border border-indigo-200 bg-indigo-50 text-indigo-600" aria-hidden="true">
            <Sparkles className="w-3 h-3" />
            What would you like to do today?
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-3">
            <span className="text-foreground">Your content </span>
            <span className="grad-text">workspace</span>
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto leading-relaxed">
            Pick a tool below to start creating, analyzing, or scoring your content.
          </p>
        </motion.div>

        {/* Tool cards */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-5xl"
          role="list"
          aria-label="Available tools"
        >
          {tools.map(({ mode, label, description, icon: Icon, gradient, glow, badge }) => (
            <motion.button
              key={mode}
              variants={fadeUp}
              onClick={() => router.push(`/dashboard?mode=${mode}`)}
              whileHover={{ y: -4, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
              className="group relative rounded-2xl border border-border bg-white cursor-pointer overflow-hidden p-6 flex flex-col gap-4 shadow-sm hover:shadow-md transition-all text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = `radial-gradient(circle at 30% 30%, ${glow} 0%, white 70%)`; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'white'; }}
              role="listitem"
              aria-label={`Open ${label}: ${description}`}
            >
              {badge && (
                <span className="absolute top-3.5 right-3.5 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-50 text-purple-600 border border-purple-200" aria-label={badge}>
                  {badge}
                </span>
              )}

              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-md`} aria-hidden="true">
                <Icon className="w-5 h-5 text-white" />
              </div>

              <div className="flex-1">
                <h2 className="text-sm font-semibold text-foreground mb-1.5">{label}</h2>
                <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
              </div>

              <div className="flex items-center gap-1 text-xs font-medium text-indigo-500 group-hover:gap-2 transition-all" aria-hidden="true">
                Open <ArrowRight className="w-3 h-3" />
              </div>
            </motion.button>
          ))}
        </motion.div>

        {/* Tip */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-10 text-xs text-muted-foreground/60 text-center max-w-md"
          role="note"
        >
          Tip — Generate content with AI, then chain directly to Analysis or Realness Score for a full workflow.
        </motion.p>
      </main>
    </div>
  );
}
