import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, Sparkles } from 'lucide-react';

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
          throw new Error('Failed to check plagiarism');
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
      <div className="h-full flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <RefreshCw className="w-12 h-12 text-violet-500" />
        </motion.div>
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

  if (!result) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Plagiarism Check</h2>
          <p className="text-muted-foreground text-center max-w-md">
            Click the &quot;Check Plagiarism&quot; button to analyze your content for potential plagiarism and get detailed insights.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto p-5 space-y-4">
      {/* Plagiarism Analysis */}
      <motion.div
        className="bg-card border border-border rounded-xl overflow-hidden"
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
        className="bg-card border border-border rounded-xl overflow-hidden"
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
                  className="text-sm bg-secondary rounded-xl p-3 text-muted-foreground"
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
            <div className="bg-secondary rounded-xl p-4 text-sm text-muted-foreground whitespace-pre-wrap">
              {result.improvedVersion}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PlagiarismPanel;
