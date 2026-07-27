import { useEffect, useState } from 'react';
import { BookOpen, Brain, ExternalLink, HelpCircle, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { saveContent, updateContent } from '@/lib/content/appwrite';
import router from 'next/router';
import { getUser } from '@/lib/user/appwrite';
import { clearAuthSession } from '@/lib/user/session';
import MarketingPrimaryButton from '@/components/marketing/MarketingPrimaryButton';
import DashboardPanelLoading from '@/components/dashboard/DashboardPanelLoading';
import DashboardEmptyState from '@/components/dashboard/DashboardEmptyState';
import DashboardResultCard from '@/components/dashboard/DashboardResultCard';
import { marketingFocusRing, marketingInput } from '@/lib/marketing/marketingTheme';
import { cn } from '@/lib/utils';

interface InfoGainPanelProps {
  content: string;
  triggerInfoGain: boolean;
  dataFromChild: string;
}

interface SearchResult {
  title: string;
  url: string;
  content: string;
}

interface TavilyData {
  answer: string;
  results: SearchResult[];
  relatedQueries: string[];
}

const InfoGainPanel: React.FC<InfoGainPanelProps> = ({
  content,
  triggerInfoGain,
  dataFromChild,
}) => {
  const [tavilyData, setTavilyData] = useState<TavilyData | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const extractMainTopic = (text: string): string => {
    const words = text.replace(/<[^>]*>/g, ' ').split(/\s+/).filter(Boolean);
    return words.slice(0, 10).join(' ');
  };

  const fetchInfoGain = async (topic: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/infogain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic }),
      });
      const data = await response.json();
      setTavilyData(data);

      const documentId = localStorage.getItem('documentId');
      if (documentId) {
        await updateContent(documentId, {
          input: content,
          analysis: content,
          summary: data.answer,
          relatedLinks: data.results,
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
        const res = await saveContent(content, user.$id, content, 'analyze', data.answer, data.results);
        localStorage.setItem('documentId', res.$id);
      }
    } catch (error) {
      console.error('Error fetching InfoGain results:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (dataFromChild && triggerInfoGain) {
      fetchInfoGain(extractMainTopic(dataFromChild));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataFromChild, triggerInfoGain]);

  const handleSearch = () => {
    if (searchTerm.trim()) fetchInfoGain(searchTerm.trim());
  };

  if (isLoading && !tavilyData) {
    return <DashboardPanelLoading label="Researching sources…" />;
  }

  if (!tavilyData && !isLoading) {
    return (
      <DashboardEmptyState
        icon={Brain}
        title="Knowledge expansion"
        description="Run analysis to discover related topics, questions, and sources."
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
      <DashboardResultCard title="Search deeper" icon={<Search className="h-4 w-4 text-teal-400" />}>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            placeholder="Search for more information…"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className={cn('flex-1', marketingInput, marketingFocusRing)}
          />
          <MarketingPrimaryButton
            type="button"
            size="sm"
            fullWidth={false}
            loading={isLoading}
            loadingText="Searching…"
            onClick={handleSearch}
            className="!w-auto shrink-0"
          >
            <Search className="h-4 w-4" aria-hidden />
            Search
          </MarketingPrimaryButton>
        </div>
      </DashboardResultCard>

      {isLoading ? <DashboardPanelLoading label="Updating results…" /> : null}

      {tavilyData?.answer ? (
        <DashboardResultCard title="Summary" icon={<BookOpen className="h-4 w-4 text-teal-400" />}>
          <p className="text-sm leading-relaxed text-slate-600">{tavilyData.answer}</p>
        </DashboardResultCard>
      ) : null}

      {tavilyData?.relatedQueries?.length ? (
        <DashboardResultCard title="Related questions" icon={<HelpCircle className="h-4 w-4 text-teal-400" />}>
          <ul className="space-y-2">
            {tavilyData.relatedQueries.map((query, index) => (
              <motion.li
                key={index}
                className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700"
                initial={{ x: -12, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                {query}
              </motion.li>
            ))}
          </ul>
        </DashboardResultCard>
      ) : null}

      {tavilyData?.results?.length ? (
        <DashboardResultCard title="Related links" icon={<ExternalLink className="h-4 w-4 text-teal-400" />}>
          <ul className="space-y-3">
            {tavilyData.results.map((item, index) => (
              <motion.li
                key={index}
                className="overflow-hidden rounded-lg border border-slate-200 bg-slate-50"
                initial={{ y: 8, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-3 transition-colors hover:bg-white"
                >
                  <h4 className="flex items-center gap-2 text-sm font-semibold text-teal-300">
                    {item.title}
                    <ExternalLink className="h-3.5 w-3.5 shrink-0" aria-hidden />
                  </h4>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-500">{item.content}</p>
                </a>
              </motion.li>
            ))}
          </ul>
        </DashboardResultCard>
      ) : null}
    </motion.div>
  );
};

export default InfoGainPanel;
