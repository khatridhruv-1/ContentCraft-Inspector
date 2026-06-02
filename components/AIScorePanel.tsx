'use client';

import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { marked } from 'marked';
import { Brain, RefreshCw, Sparkles, AlertTriangle } from 'lucide-react';
import { saveContent, updateContent } from '@/lib/content/appwrite';
import { useRouter } from 'next/navigation';
import { getUser } from '@/lib/user/appwrite';

interface AIScorePanelProps {
  content: string;
  triggerAIScore: boolean;
}

interface AIScoreResult {
  aiScore: number;
  humanScore: number;
  analysis: {
    languagePatterns?: string[];
    tone?: string;
    style?: string;
  } | string;
  suggestions: string[];
  humanizedVersion: string;
}

const AIScorePanel: React.FC<AIScorePanelProps> = ({
  content,
  triggerAIScore,
}) => {
  const router = useRouter();
  const [result, setResult] = useState<AIScoreResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showHumanized, setShowHumanized] = useState(false);

  const humanizedHtml = useMemo(() => {
    const v = result?.humanizedVersion;
    if (!v || typeof v !== 'string') return '';
    if (v.trimStart().startsWith('<')) return v;
    return marked(v) as string;
  }, [result?.humanizedVersion]);

  const analysisHtml = useMemo(() => {
    const a = result?.analysis;
    if (!a || typeof a !== 'string') return '';
    if (a.trimStart().startsWith('<')) return a;
    return marked(a) as string;
  }, [result?.analysis]);

  useEffect(() => {
    const checkAIScore = async () => {
      if (!triggerAIScore || !content.trim()) {
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/ai-score', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ content }),
        });

        if (!response.ok) {
          const e = await response.json().catch(() => ({})); throw new Error(e?.error || 'Failed to analyze content');
        }

        const result = await response.json();
        setResult(result);

        const documentId = localStorage.getItem('documentId')
          if (documentId) {
            await updateContent(documentId, {
              analysis: content,
              input: content,
              aiScore: result.aiScore,
              humanScore: result.humanScore,
              humanizedVersion: result.humanizedVersion
            });
          } else {
            const sessionToken = localStorage.getItem('sessionToken');
            if (!sessionToken) {
              router.push('/auth/login');
              return;
            }
            const user = await getUser(sessionToken)
            const res = await saveContent(content, user.$id, content, 'ai-score')

            if (res) localStorage.setItem('documentId', res.$id);
          }
      } catch (error) {
        console.error('Error checking AI score:', error);
        setError('Failed to analyze AI content. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    checkAIScore();
  }, [content, triggerAIScore]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="flex flex-col items-center gap-3">
          <motion.div
            className="w-10 h-10 border-2 border-primary/20 border-t-primary rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
          />
          <p className="text-xs text-muted-foreground">Scoring content...</p>
        </div>
      </div>
    );
  }

  if (error && !result) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <AlertTriangle className="w-8 h-8 text-destructive mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
            <Brain className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-xs font-semibold text-foreground mb-1">Realness Score</h2>
          <p className="text-xs text-muted-foreground max-w-xs">Click &quot;Check Score&quot; to detect AI vs human writing patterns and get a humanized rewrite.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-8">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>

            {/* Score bars */}
            <div className="py-4 border-b border-border mb-3">
              <div className="flex items-center gap-2 mb-4">
                <Brain className="h-4 w-4 text-primary" />
                <h3 className="text-xs font-semibold text-foreground">Content Analysis</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-muted-foreground font-medium">AI Influence</span>
                    <span className="font-bold text-primary">{result.aiScore}%</span>
                  </div>
                  <div className="h-2 bg-border rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-violet-500 to-purple-600"
                      initial={{ width: 0 }}
                      animate={{ width: `${result.aiScore}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-muted-foreground font-medium">Human Touch</span>
                    <span className="font-bold text-emerald-500">{result.humanScore}%</span>
                  </div>
                  <div className="h-2 bg-border rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-600"
                      initial={{ width: 0 }}
                      animate={{ width: `${result.humanScore}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Analysis */}
            <div className="py-4 border-b border-border mb-3">
              <h3 className="text-xs font-semibold text-foreground mb-3">Writing Pattern Analysis</h3>
              <style>{`
                .analysis-content h1{font-size:0.95rem;font-weight:700;margin:0 0 8px}
                .analysis-content h2{font-size:0.85rem;font-weight:600;margin:12px 0 5px;color:hsl(var(--foreground))}
                .analysis-content h3{font-size:0.8rem;font-weight:600;margin:8px 0 4px;color:hsl(var(--foreground))}
                .analysis-content p{font-size:0.8rem;margin:0 0 8px;line-height:1.6;color:hsl(var(--muted-foreground))}
                .analysis-content ul{margin:4px 0 8px;padding-left:1.4rem}
                .analysis-content li{font-size:0.8rem;color:hsl(var(--muted-foreground));margin-bottom:3px;line-height:1.5}
                .analysis-content strong{font-weight:600;color:hsl(var(--foreground))}
              `}</style>
              {analysisHtml ? (
                <div className="analysis-content" dangerouslySetInnerHTML={{ __html: analysisHtml }} />
              ) : (
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {typeof result.analysis === 'string' ? result.analysis : ''}
                </p>
              )}
            </div>

            {/* Humanized Version */}
            <div className="border-t border-border overflow-hidden">
              <button
                onClick={() => setShowHumanized(!showHumanized)}
                className="w-full flex items-center justify-between px-4 py-3 text-xs font-semibold text-foreground hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                  Humanized Version
                </div>
                <RefreshCw className={`h-3.5 w-3.5 text-muted-foreground transition-transform duration-300 ${showHumanized ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {showHumanized && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 border-t border-border">
                      <style>{`
                        .hv-content h1{font-size:0.95rem;font-weight:700;margin:0 0 8px}
                        .hv-content h2{font-size:0.85rem;font-weight:600;margin:12px 0 5px}
                        .hv-content h3{font-size:0.8rem;font-weight:600;margin:8px 0 4px}
                        .hv-content p{margin:0 0 8px;line-height:1.6}
                        .hv-content ul,.hv-content ol{margin:4px 0 8px;padding-left:1.4rem}
                        .hv-content li{margin-bottom:3px;line-height:1.5}
                        .hv-content strong{font-weight:600}
                      `}</style>
                      <div
                        className="hv-content pt-3 text-sm text-foreground"
                        dangerouslySetInnerHTML={{ __html: humanizedHtml }}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

      </motion.div>
    </div>
  );
};
export default AIScorePanel;