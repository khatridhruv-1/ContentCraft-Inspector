import { useState, useEffect } from 'react';
import { Zap, Copy, Check } from 'lucide-react';
import { motion } from 'framer-motion';

interface RephrasedPanelProps {
  content: string;
  triggerRephrase: boolean;
}

const RephrasedPanel: React.FC<RephrasedPanelProps> = ({
  content,
  triggerRephrase,
}) => {
  const [rephrasedContent, setRephrasedContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!rephrasedContent) return;
    navigator.clipboard.writeText(rephrasedContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    const rephraseContent = async () => {
      if (!triggerRephrase || !content.trim()) {
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/rephrase', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ content }),
        });

        if (!response.ok) {
          throw new Error('Failed to rephrase content');
        }

        const result = await response.json();
        setRephrasedContent(result);
      } catch (error) {
        console.error('Error rephrasing content:', error);
        setError('Failed to rephrase content. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    rephraseContent();
  }, [content, triggerRephrase]);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <motion.div
          className="w-16 h-16 border-t-4 border-violet-500 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-destructive font-medium">{error}</p>
      </div>
    );
  }

  if (!rephrasedContent) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground">Content Rephrasing</h2>
          <p className="text-muted-foreground text-center max-w-md mt-2">
            Click the &quot;Rephrase&quot; button to get a rephrased version of your content.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col relative">
      <div className="absolute inset-0 overflow-y-auto">
        <div className="p-5 space-y-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            {/* Rephrased Content */}
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <div className="flex items-center gap-2">
                  <Zap className="text-violet-400 w-4 h-4" />
                  <span className="text-sm font-semibold text-foreground">Rephrased Content</span>
                </div>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <div className="p-4 text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                {rephrasedContent}
              </div>
            </div>

          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default RephrasedPanel;
