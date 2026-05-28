import { useEffect, useState } from 'react';
import { List, Lightbulb, AlertTriangle, Copy, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { saveContent, updateContent } from '@/lib/content/appwrite';
import { useRouter } from 'next/navigation';
import { getUser } from '@/lib/user/appwrite';

interface OutlinePanelProps {
  content: string;
  triggerOutline: boolean;
  dataFromChild: string;
}

interface OutlineItem {
  level: number;
  text: string;
}

interface OutlineResult {
  outline: OutlineItem[];
  suggestions: string[];
  contentGaps: string[];
}

const OutlinePanel: React.FC<OutlinePanelProps> = ({
  content: _content,
  triggerOutline,
  dataFromChild
}) => {
  const router = useRouter();
  const [outlineResult, setOutlineResult] = useState<OutlineResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = (result: OutlineResult) => {
    const text = result.outline.map(item => `${'  '.repeat(item.level - 1)}• ${item.text}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    const generateOutline = async () => {
      if (!triggerOutline || !dataFromChild.trim()) {
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/outline', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ content: dataFromChild }),
        });
        if (!response.ok) {
          throw new Error('Failed to generate outline');
        }
        const result = await response.json();
        setOutlineResult(result);
        const documentId = localStorage.getItem('documentId');
        if (documentId) {
          await updateContent(documentId, {
            input: dataFromChild,
            analysis: dataFromChild,
            outline: result.outline,
            suggestions: result.suggestions,
            contentGaps: result.contentGaps
          });
        } else {
          const sessionToken = localStorage.getItem('sessionToken');
          if (!sessionToken) {
            router.push('/auth/login');
            return;
          }
          const user = await getUser(sessionToken);
          const res = await saveContent(dataFromChild, user.$id, dataFromChild, 'analyze', result.outline, result.suggestions, result.contentGaps);
          if (res) {
            localStorage.setItem('documentId', res.$id);
          }
        }
      } catch (error) {
        console.error('Error generating outline:', error);
        setError('Failed to generate outline. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    generateOutline();
  }, [dataFromChild, triggerOutline]);

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
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  if (!outlineResult) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground">Content Outline</h2>
          <p className="text-muted-foreground text-center max-w-md mt-2">
            Click on &quot;Analyze&quot; button to get detailed insights about your content.
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
            {/* Content Structure */}
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <div className="flex items-center gap-2">
                  <List className="text-violet-400 w-4 h-4" />
                  <span className="text-sm font-semibold text-foreground">Content Structure</span>
                </div>
                <button
                  onClick={() => handleCopy(outlineResult)}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <div className="p-4">
                {outlineResult.outline.length > 0 ? (
                  <ul className="space-y-3">
                    {outlineResult.outline.map((item, index) => (
                      <motion.li
                        key={index}
                        className="flex items-start gap-2 text-sm text-muted-foreground"
                        style={{ marginLeft: `${(item.level - 1) * 16}px` }}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-violet-500 shrink-0 mt-1.5" />
                        <span>{item.text}</span>
                      </motion.li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No outline structure detected. Consider adding headers to organize your content.
                  </p>
                )}
              </div>
            </div>

            {/* Improvement Suggestions */}
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
                <Lightbulb className="text-violet-400 w-4 h-4" />
                <span className="text-sm font-semibold text-foreground">Improvement Suggestions</span>
              </div>
              <div className="p-4">
                <ul className="space-y-3">
                  {outlineResult.suggestions.map((suggestion, index) => (
                    <motion.li
                      key={index}
                      className="flex items-start gap-2 text-sm text-muted-foreground border-b border-border pb-3 last:border-0 last:pb-0"
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <span className="text-violet-400 mt-0.5">•</span>
                      <span>{suggestion}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Content Gaps */}
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
                <AlertTriangle className="text-violet-400 w-4 h-4" />
                <span className="text-sm font-semibold text-foreground">Content Gaps</span>
              </div>
              <div className="p-4">
                <ul className="space-y-3">
                  {outlineResult.contentGaps.map((gap, index) => (
                    <motion.li
                      key={index}
                      className="flex items-start gap-2 text-sm text-muted-foreground border-b border-border pb-3 last:border-0 last:pb-0"
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <span className="text-violet-400 mt-0.5">•</span>
                      <span>{gap}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default OutlinePanel;
