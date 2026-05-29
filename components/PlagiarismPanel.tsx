import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Sparkles, Shield } from 'lucide-react';

interface PlagiarismPanelProps {
  content: string;
  triggerPlagiarism: boolean;
}

interface PlagiarismResult {
  plagiarismScore: number;
  uniquenessScore: number;
  analysis: string;
  suggestions: string[];
  improvedVersion: string;
}

const PlagiarismPanel: React.FC<PlagiarismPanelProps> = ({
  content,
  triggerPlagiarism,
}) => {
  const [result, setResult] = useState<PlagiarismResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkPlagiarism = async () => {
      if (!triggerPlagiarism || !content.trim()) {
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/plagiarism', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ content }),
        });
        if (!response.ok) {
          const e = await response.json().catch(() => ({})); throw new Error(e?.error || 'Failed to check plagiarism');
        }
        const data = await response.json();
        setResult(data);
      } catch (error) {
        console.error('Error checking plagiarism:', error);
        setError('Failed to check plagiarism. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    checkPlagiarism();
  }, [content, triggerPlagiarism]);

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
          <p className="text-xs text-muted-foreground">Checking for plagiarism...</p>
        </div>
      </div>
    );
  }

  if (error) {
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

  if (!result) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4" aria-hidden="true">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-sm font-semibold text-foreground mb-1">Plagiarism Check</h2>
          <p className="text-xs text-muted-foreground max-w-xs">
            Click &quot;Check Plagiarism&quot; to analyze your content for originality and get detailed insights.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto p-5 space-y-4">
      {/* Plagiarism Analysis */}
      <motion.div
        className="overflow-hidden border-b border-border"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
          <AlertTriangle className="text-amber-400 w-4 h-4" />
          <span className="text-sm font-semibold text-foreground">Plagiarism Analysis</span>
        </div>
        <div className="p-4 space-y-5">
          {/* Plagiarism Score */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Plagiarism Score</span>
              <span className="font-medium text-foreground">{result.plagiarismScore}%</span>
            </div>
            <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-red-500 to-orange-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${result.plagiarismScore}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              {result.plagiarismScore}% potential plagiarism detected
            </p>
          </div>

          {/* Uniqueness Score */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Uniqueness Score</span>
              <span className="font-medium text-foreground">{result.uniquenessScore}%</span>
            </div>
            <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${result.uniquenessScore}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              {result.uniquenessScore}% unique content
            </p>
          </div>

          {/* Analysis Text */}
          <div className="space-y-1">
            <h4 className="text-sm font-semibold text-foreground">Analysis</h4>
            <p className="text-sm text-muted-foreground">{result.analysis}</p>
          </div>
        </div>
      </motion.div>

      {/* Suggested Improvements */}
      <motion.div
        className="overflow-hidden border-b border-border"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
          <Sparkles className="text-violet-400 w-4 h-4" />
          <span className="text-sm font-semibold text-foreground">Suggested Improvements</span>
        </div>
        <div className="p-4 space-y-4">
          {/* Suggestions List */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-foreground">Suggestions for Improvement</h4>
            <ul className="space-y-2">
              {result.suggestions.map((suggestion, index) => (
                <motion.li
                  key={index}
                  className="text-sm py-3 text-muted-foreground"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {suggestion}
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Improved Version */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-foreground">Improved Version</h4>
            <div className="py-4 text-sm text-muted-foreground whitespace-pre-wrap">
              {result.improvedVersion}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PlagiarismPanel;
