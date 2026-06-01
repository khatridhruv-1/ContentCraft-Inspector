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
  children?: OutlineItem[];
}

interface OutlineResult {
  outline: OutlineItem[];
  suggestions: string[];
  contentGaps: string[];
}

function OutlineTree({ items, depth }: { items: OutlineItem[]; depth: number }) {
  return (
    <ul className="space-y-2">
      {items.map((item, index) => (
        <li key={index} style={{ paddingLeft: `${depth * 16}px` }}>
          <motion.div
            className="flex items-start gap-2 text-sm text-muted-foreground"
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.05 }}
          >
            <span className={`shrink-0 mt-1.5 rounded-full ${depth === 0 ? 'w-2 h-2 bg-primary' : 'w-1.5 h-1.5 bg-border border border-muted-foreground/40'}`} />
            <span className={depth === 0 ? 'font-medium text-foreground' : ''}>{item.text}</span>
          </motion.div>
          {item.children && item.children.length > 0 && (
            <OutlineTree items={item.children} depth={depth + 1} />
          )}
        </li>
      ))}
    </ul>
  );
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

  const flattenOutline = (items: OutlineItem[], depth = 0): string[] =>
    items.flatMap(item => [
      `${'  '.repeat(depth)}• ${item.text}`,
      ...(item.children ? flattenOutline(item.children, depth + 1) : []),
    ]);

  const handleCopy = (result: OutlineResult) => {
    const text = flattenOutline(result.outline || []).join('\n');
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
          const e = await response.json().catch(() => ({})); throw new Error(e?.error || 'Failed to generate outline');
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
          const res = await saveContent(
            dataFromChild, user.$id, dataFromChild, 'analyze',
            undefined, undefined, undefined, undefined, undefined, undefined, undefined,
            undefined, undefined, undefined,
            result.outline, result.suggestions, result.contentGaps,
          );
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
      <div className="flex items-center justify-center py-16">
        <div className="flex flex-col items-center gap-3">
          <motion.div
            className="w-10 h-10 border-2 border-primary/20 border-t-primary rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
            aria-hidden="true"
          />
          <p className="text-xs text-muted-foreground">Generating outline...</p>
        </div>
      </div>
    );
  }

  if (error && !outlineResult) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center mx-auto mb-3" aria-hidden="true">
            <AlertTriangle className="h-5 w-5 text-destructive" />
          </div>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  if (!outlineResult) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4" aria-hidden="true">
            <List className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-sm font-semibold text-foreground mb-1">Content Outline</h2>
          <p className="text-xs text-muted-foreground max-w-xs">
            Click &quot;Analyze&quot; to generate a detailed content structure and improvement suggestions.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-4"
      >
            {/* Content Structure */}
            <div className="overflow-hidden">
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
                {(outlineResult.outline || []).length > 0 ? (
                  <OutlineTree items={outlineResult.outline || []} depth={0} />
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No outline structure detected. Consider adding headers to organize your content.
                  </p>
                )}
              </div>
            </div>

            {/* Improvement Suggestions */}
            <div className="overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
                <Lightbulb className="text-violet-400 w-4 h-4" />
                <span className="text-sm font-semibold text-foreground">Improvement Suggestions</span>
              </div>
              <div className="p-4">
                <ul className="space-y-3">
                  {(outlineResult.suggestions || []).map((suggestion, index) => (
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
            <div className="overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
                <AlertTriangle className="text-violet-400 w-4 h-4" />
                <span className="text-sm font-semibold text-foreground">Content Gaps</span>
              </div>
              <div className="p-4">
                <ul className="space-y-3">
                  {(outlineResult.contentGaps || []).map((gap, index) => (
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
  );
};

export default OutlinePanel;
