import { useEffect, useState } from 'react';
import { ExternalLink, Search, HelpCircle, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import { saveContent, updateContent } from '@/lib/content/appwrite';
import { useRouter } from 'next/navigation';
import { getUser } from '@/lib/user/appwrite';

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
  followUpQuestions: string[];
}

const InfoGainPanel: React.FC<InfoGainPanelProps> = ({
  content,
  triggerInfoGain,
  dataFromChild
}) => {
  const router = useRouter();
  const [tavilyData, setTavilyData] = useState<TavilyData | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const extractMainTopic = (text: string): string => {
    const words = text.split(/\s+/);
    return words.slice(0, 10).join(' ');
  };

  const fetchInfoGain = async (topic: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/infogain', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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
          relatedLinks: data.results
        });
      } else {
        const sessionToken = localStorage.getItem('sessionToken');
        if (!sessionToken) {
          router.push('/auth/login');
          return;
        }
        const user = await getUser(sessionToken);
        const res = await saveContent(
          content, user.$id, content, 'analyze',
          undefined, undefined, undefined, undefined, undefined, undefined, undefined,
          undefined, undefined, undefined, undefined, undefined, undefined,
          data.answer, data.results,
        );
        if (res) {
          localStorage.setItem('documentId', res.$id);
        }
      }
    } catch (error) {
      console.error('Error fetching InfoGain results:', error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (dataFromChild && triggerInfoGain) {
      const mainTopic = extractMainTopic(dataFromChild);
      fetchInfoGain(mainTopic);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataFromChild, triggerInfoGain]);

  const handleSearch = () => {
    if (searchTerm) {
      fetchInfoGain(searchTerm);
    }
  };

  return (
    <div className="h-full flex flex-col relative">
      <div className="absolute inset-0 overflow-y-auto">
        {/* Sticky Header */}
        <div className="sticky top-0 z-10 bg-[hsl(var(--card))] border-b border-border px-5 py-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
            <Search className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-semibold text-foreground">Knowledge Expansion</span>
        </div>

        {/* Search Bar */}
        <div className="flex gap-2 px-5 py-3 border-b border-border">
          <label htmlFor="infogain-search" className="sr-only">Search for additional information on a topic</label>
          <input
            id="infogain-search"
            type="search"
            placeholder="Search for more information..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
            className="flex-1 bg-secondary border border-border rounded-xl px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/10 transition-all"
          />
          <button
            onClick={handleSearch}
            disabled={!searchTerm.trim()}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-1.5 hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            <Search className="w-4 h-4" aria-hidden="true" />
            Search
          </button>
        </div>

        {/* Content Area */}
        <div className="p-5 space-y-5">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center gap-3">
                <motion.div
                  className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                  aria-hidden="true"
                />
                <p className="text-xs text-muted-foreground">Searching the web...</p>
              </div>
            </div>
          ) : tavilyData ? (
            <>
              {tavilyData.answer && (
                <motion.div
                  className="py-4 border-b border-border"
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <h3 className="text-xs font-semibold text-foreground flex items-center gap-2 mb-2">
                    <BookOpen className="w-3.5 h-3.5 text-violet-400" />
                    Summary
                  </h3>
                  <p className="text-sm text-muted-foreground">{tavilyData.answer}</p>
                </motion.div>
              )}

              {tavilyData.followUpQuestions?.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-foreground mb-3">Related Questions</h3>
                  <ul className="space-y-2">
                    {tavilyData.followUpQuestions.map((query: string, index: number) => (
                      <motion.li
                        key={index}
                        className="flex items-center gap-2 text-xs p-2 border-b border-border text-muted-foreground"
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <HelpCircle className="text-violet-400 w-3.5 h-3.5 shrink-0" />
                        <span>{query}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              )}

              {tavilyData.results?.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-foreground mb-3">Related Links</h3>
                  <ul className="space-y-2">
                    {tavilyData.results.map((item, index) => (
                      <motion.li
                        key={index}
                        className="border-b border-border overflow-hidden hover:bg-secondary transition-colors"
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block p-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 rounded-lg"
                          aria-label={`${item.title} (opens in a new tab)`}
                        >
                          <motion.h4
                            className="text-sm font-medium text-primary flex items-center gap-1"
                            whileHover={{ x: 5 }}
                          >
                            {item.title}
                            <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                          </motion.h4>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{item.content}</p>
                        </a>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          ) : (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4" aria-hidden="true">
                  <Search className="h-6 w-6 text-primary" />
                </div>
                <p className="text-sm font-semibold text-foreground mb-1">Info Gain</p>
                <p className="text-xs text-muted-foreground max-w-xs">Search for a topic or run analysis to see web research and related content.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InfoGainPanel;
