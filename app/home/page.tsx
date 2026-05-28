'use client';

import { motion } from 'framer-motion';
import { Edit, FileSearch, Wand2, BarChart3, History, ArrowRight, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getUser } from '@/lib/user/appwrite';

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

const tools = [
  {
    mode: 'ai-generate',
    label: 'AI-Powered',
    description: 'Generate a 1000+ word article from a title, keywords, and tone in seconds.',
    icon: Wand2,
    gradient: 'from-violet-500 to-purple-600',
    glow: 'rgba(139,92,246,0.2)',
    badge: 'Most used',
  },
  {
    mode: 'create',
    label: 'Smart Editor',
    description: 'Write and edit rich content with Quill, then analyze or score it.',
    icon: Edit,
    gradient: 'from-indigo-500 to-blue-600',
    glow: 'rgba(99,102,241,0.2)',
    badge: null,
  },
  {
    mode: 'analyze',
    label: 'Deep Analysis',
    description: 'Get readability score, tone, key insights, outline and info gain.',
    icon: FileSearch,
    gradient: 'from-pink-500 to-rose-600',
    glow: 'rgba(236,72,153,0.2)',
    badge: null,
  },
  {
    mode: 'ai-score',
    label: 'Realness Score',
    description: 'Detect AI vs human writing patterns and get a humanized rewrite.',
    icon: BarChart3,
    gradient: 'from-emerald-500 to-teal-600',
    glow: 'rgba(16,185,129,0.2)',
    badge: null,
  },
];

export default function Home() {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const sessionToken = localStorage.getItem('sessionToken');
      if (!sessionToken) {
        router.push('/auth/login');
        return;
      }
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
    <div
      className="min-h-screen flex flex-col"
      style={{ background: 'hsl(var(--sidebar-background))' }}
    >
      {/* Top bar */}
      <div
        className="flex items-center justify-between px-8 py-4 border-b"
        style={{ borderColor: 'hsl(var(--sidebar-border))' }}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-sm font-semibold text-white tracking-tight">ContentCraft Inspector</span>
        </div>
        <button
          onClick={() => router.push('/history')}
          className="flex items-center gap-2 text-xs font-medium px-3.5 py-2 rounded-lg transition-colors"
          style={{ color: 'hsl(var(--sidebar-foreground))' }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.background = 'hsl(var(--sidebar-accent))';
            (e.currentTarget as HTMLButtonElement).style.color = 'white';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
            (e.currentTarget as HTMLButtonElement).style.color = 'hsl(var(--sidebar-foreground))';
          }}
        >
          <History className="w-3.5 h-3.5" />
          History
        </button>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16">

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 text-xs font-medium px-3.5 py-1.5 rounded-full mb-5 border"
            style={{
              color: 'rgb(167 139 250)',
              background: 'rgba(139,92,246,0.08)',
              borderColor: 'rgba(139,92,246,0.2)',
            }}
          >
            <Sparkles className="w-3 h-3" />
            What would you like to do today?
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight mb-3">
            Your content workspace
          </h1>
          <p className="text-base max-w-md mx-auto leading-relaxed" style={{ color: 'hsl(var(--sidebar-foreground))' }}>
            Pick a tool below to start creating, analyzing, or scoring your content.
          </p>
        </motion.div>

        {/* Tool cards */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-5xl"
        >
          {tools.map(({ mode, label, description, icon: Icon, gradient, glow, badge }) => (
            <motion.div
              key={mode}
              variants={fadeUp}
              onClick={() => router.push(`/dashboard?mode=${mode}`)}
              whileHover={{ y: -4, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
              className="group relative rounded-2xl border cursor-pointer overflow-hidden p-6 flex flex-col gap-4"
              style={{
                background: 'rgba(255,255,255,0.03)',
                borderColor: 'hsl(var(--sidebar-border))',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(139,92,246,0.35)';
                (e.currentTarget as HTMLDivElement).style.background = glow;
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLDivElement).style.borderColor = 'hsl(var(--sidebar-border))';
                (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.03)';
              }}
            >
              {badge && (
                <span className="absolute top-3.5 right-3.5 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-violet-500/15 text-violet-300 border border-violet-500/20">
                  {badge}
                </span>
              )}

              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}>
                <Icon className="w-5 h-5 text-white" />
              </div>

              <div className="flex-1">
                <h2 className="text-sm font-semibold text-white mb-1.5">{label}</h2>
                <p className="text-xs leading-relaxed" style={{ color: 'hsl(var(--sidebar-foreground))' }}>
                  {description}
                </p>
              </div>

              <div className="flex items-center gap-1 text-xs font-medium text-violet-400 group-hover:gap-2 transition-all">
                Open <ArrowRight className="w-3 h-3" />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Quick tip */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-10 text-xs"
          style={{ color: 'hsl(var(--sidebar-foreground) / 0.4)' }}
        >
          Tip — Generate content with AI, then chain directly to Analysis or Realness Score.
        </motion.p>
      </div>
    </div>
  );
}
