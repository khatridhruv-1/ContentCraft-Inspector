import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Sparkles, Shield } from 'lucide-react';

interface PlagiarismPanelProps {
  content: string;
  triggerPlagiarism: boolean;
}

interface PlagiarismResult {
  plagiarismScore: number;
  originalityScore: number;
  flaggedSections: string[];
}

const PlagiarismPanel: React.FC<PlagiarismPanelProps> = ({ content, triggerPlagiarism }) => {
  const [result, setResult] = useState<PlagiarismResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const contentRef = useRef(content);
  contentRef.current = content;
  const calledRef = useRef(false);

  useEffect(() => {
    if (!triggerPlagiarism) { calledRef.current = false; return; }
    if (calledRef.current) return;
    calledRef.current = true;

    const currentContent = contentRef.current;
    if (!currentContent.trim()) return;

    const run = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/plagiarism', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: currentContent }),
        });
        if (!response.ok) {
          const e = await response.json().catch(() => ({}));
          throw new Error(e?.error || 'Failed to check plagiarism');
        }
        const data = await response.json();
        setResult(data);
      } catch (err: any) {
        console.error('Error checking plagiarism:', err);
        setError('Failed to check plagiarism. Please try again.');
        calledRef.current = false;
      } finally {
        setIsLoading(false);
      }
    };

    run();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggerPlagiarism]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="flex flex-col items-center gap-3">
          <motion.div className="w-10 h-10 border-2 border-primary/20 border-t-primary rounded-full" animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} aria-hidden="true" />
          <p className="text-xs text-muted-foreground">Checking for plagiarism...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center mx-auto mb-3"><AlertTriangle className="h-5 w-5 text-destructive" /></div>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4"><Shield className="h-6 w-6 text-primary" /></div>
          <h2 className="text-sm font-semibold text-foreground mb-1">Plagiarism Check</h2>
          <p className="text-xs text-muted-foreground max-w-xs">Click the &quot;Plagiarism&quot; tab to analyze your content for originality.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="border-b border-border pb-4">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="text-amber-400 w-4 h-4" />
          <span className="text-xs font-semibold text-foreground">Plagiarism Analysis</span>
        </div>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs mb-2">
              <span className="text-muted-foreground">Plagiarism Score</span>
              <span className="font-bold text-destructive">{result.plagiarismScore}%</span>
            </div>
            <div className="h-2 bg-border rounded-full overflow-hidden">
              <motion.div className="h-full rounded-full bg-gradient-to-r from-red-500 to-orange-500" initial={{ width: 0 }} animate={{ width: `${result.plagiarismScore}%` }} transition={{ duration: 0.8, ease: 'easeOut' }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-xs mb-2">
              <span className="text-muted-foreground">Originality Score</span>
              <span className="font-bold text-emerald-500">{result.originalityScore}%</span>
            </div>
            <div className="h-2 bg-border rounded-full overflow-hidden">
              <motion.div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500" initial={{ width: 0 }} animate={{ width: `${result.originalityScore}%` }} transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }} />
            </div>
          </div>
        </div>
      </motion.div>

      {result.flaggedSections?.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="border-b border-border pb-4">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="text-violet-400 w-4 h-4" />
            <span className="text-xs font-semibold text-foreground">Flagged Sections</span>
          </div>
          <ul className="space-y-2">
            {result.flaggedSections.map((section: string, index: number) => (
              <motion.li key={index} className="text-xs text-muted-foreground py-2 border-b border-border last:border-0" initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: index * 0.1 }}>
                {section}
              </motion.li>
            ))}
          </ul>
        </motion.div>
      )}
    </div>
  );
};

export default PlagiarismPanel;
