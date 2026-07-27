import { useEffect, useState } from 'react';
import { AlertTriangle, Lightbulb, List, ListTree } from 'lucide-react';
import { motion } from 'framer-motion';
import { saveContent, updateContent } from '@/lib/content/appwrite';
import router from 'next/router';
import { getUser } from '@/lib/user/appwrite';
import { clearAuthSession } from '@/lib/user/session';
import DashboardPanelLoading from '@/components/dashboard/DashboardPanelLoading';
import DashboardEmptyState from '@/components/dashboard/DashboardEmptyState';
import DashboardResultCard from '@/components/dashboard/DashboardResultCard';
import { dashboardBullet, dashboardListItem } from '@/components/dashboard/dashboardLayout';

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
  triggerOutline,
  dataFromChild,
}) => {
  const [outlineResult, setOutlineResult] = useState<OutlineResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const generateOutline = async () => {
      if (!triggerOutline || !dataFromChild.trim()) return;

      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/outline', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: dataFromChild }),
        });
        if (!response.ok) throw new Error('Failed to generate outline');

        const result = await response.json();
        setOutlineResult(result);

        const documentId = localStorage.getItem('documentId');
        if (documentId) {
          await updateContent(documentId, {
            input: dataFromChild,
            analysis: dataFromChild,
            outline: result.outline,
            suggestions: result.suggestions,
            contentGaps: result.contentGaps,
          });
        } else {
          const sessionToken = localStorage.getItem('sessionToken');
          if (!sessionToken) {
            router.push('/auth/login');
            throw new Error('No session found');
          }
          const user = await getUser(sessionToken);
          if (!user) {
            clearAuthSession();
            router.push('/auth/login');
            return;
          }
          const res = await saveContent(
            dataFromChild,
            user.$id,
            dataFromChild,
            'analyze',
            result.outline,
            result.suggestions,
            result.contentGaps
          );
          localStorage.setItem('documentId', res.$id);
        }
      } catch (err) {
        console.error('Error generating outline:', err);
        setError('Failed to generate outline. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    generateOutline();
  }, [dataFromChild, triggerOutline]);

  if (isLoading) {
    return <DashboardPanelLoading label="Building outline…" />;
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center px-4">
        <p className="text-center text-sm text-red-300" role="alert">{error}</p>
      </div>
    );
  }

  if (!outlineResult) {
    return (
      <DashboardEmptyState
        icon={ListTree}
        title="Content outline"
        description='Run analysis to generate structure, suggestions, and content gaps.'
      />
    );
  }

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <DashboardResultCard title="Content structure" icon={<List className="h-4 w-4 text-teal-400" />}>
        {outlineResult.outline.length > 0 ? (
          <ul className="space-y-3">
            {outlineResult.outline.map((item, index) => (
              <motion.li
                key={index}
                className="flex items-start gap-2 text-sm text-white/75"
                style={{ marginLeft: `${(item.level - 1) * 16}px` }}
                initial={{ x: -12, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-400" aria-hidden />
                <span>{item.text}</span>
              </motion.li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-white/55">
            No outline structure detected. Consider adding headers to organize your content.
          </p>
        )}
      </DashboardResultCard>

      <DashboardResultCard title="Improvement suggestions" icon={<Lightbulb className="h-4 w-4 text-teal-400" />}>
        <ul className="space-y-3">
          {outlineResult.suggestions.map((suggestion, index) => (
            <motion.li key={index} className={dashboardListItem} initial={{ x: -12, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: index * 0.05 }}>
              <span className={dashboardBullet}>•</span>
              <span>{suggestion}</span>
            </motion.li>
          ))}
        </ul>
      </DashboardResultCard>

      <DashboardResultCard title="Content gaps" icon={<AlertTriangle className="h-4 w-4 text-teal-400" />}>
        <ul className="space-y-3">
          {outlineResult.contentGaps.map((gap, index) => (
            <motion.li key={index} className={dashboardListItem} initial={{ x: -12, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: index * 0.05 }}>
              <span className={dashboardBullet}>•</span>
              <span>{gap}</span>
            </motion.li>
          ))}
        </ul>
      </DashboardResultCard>
    </motion.div>
  );
};

export default OutlinePanel;
