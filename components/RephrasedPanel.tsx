import { useState, useEffect, useRef } from 'react';
import { Zap, Copy, Check } from 'lucide-react';
import { motion } from 'framer-motion';

interface RephrasedPanelProps {
  content: string;
  triggerRephrase: boolean;
}

const RephrasedPanel: React.FC<RephrasedPanelProps> = ({ content, triggerRephrase }) => {
  const [rephrasedContent, setRephrasedContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const contentRef = useRef(content);
  contentRef.current = content;
  const calledRef = useRef(false);

  const handleCopy = () => {
    if (!rephrasedContent) return;
    navigator.clipboard.writeText(rephrasedContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    if (!triggerRephrase) { calledRef.current = false; return; }
    if (calledRef.current) return;
    calledRef.current = true;

    const currentContent = contentRef.current;
    if (!currentContent.trim()) return;

    const run = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/rephrase', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: currentContent }),
        });
        if (!response.ok) throw new Error('Failed to rephrase content');
        const result = await response.json();
        const raw = result.rephrasedContent ?? result;
        setRephrasedContent(typeof raw === 'string' ? raw : JSON.stringify(raw, null, 2));
      } catch (err: any) {
        console.error('Error rephrasing content:', err);
        setError('Failed to rephrase content. Please try again.');
        calledRef.current = false;
      } finally {
        setIsLoading(false);
      }
    };

    run();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggerRephrase]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="flex flex-col items-center gap-3">
          <motion.div className="w-10 h-10 border-2 border-primary/20 border-t-primary rounded-full" animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} aria-hidden="true" />
          <p className="text-xs text-muted-foreground">Rephrasing content...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center mx-auto mb-3"><Zap className="h-5 w-5 text-destructive" /></div>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  if (!rephrasedContent) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4"><Zap className="h-6 w-6 text-primary" /></div>
          <h2 className="text-sm font-semibold text-foreground mb-1">Content Rephrasing</h2>
          <p className="text-xs text-muted-foreground max-w-xs">Click the &quot;Rephrase&quot; tab to get an improved version of your content.</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="space-y-4 pb-8">
      <div className="overflow-hidden border-b border-border">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div className="flex items-center gap-2">
            <Zap className="text-violet-400 w-4 h-4" />
            <span className="text-sm font-semibold text-foreground">Rephrased Content</span>
          </div>
          <button onClick={handleCopy} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <div className="p-4 text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
          {rephrasedContent}
        </div>
      </div>
    </motion.div>
  );
};

export default RephrasedPanel;
