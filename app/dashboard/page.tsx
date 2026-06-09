'use client';

import { useEffect, useRef, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AnalysisPanel from '@/components/AnalysisPanel';
import OutlinePanel from '@/components/OutlinePanel';
import InfoGainPanel from '@/components/InfoGainPanel';
import { motion } from 'framer-motion';
import { LogOut, UserCircle, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import ContentEditor from '@/components/ContentEditor';
import { useRouter } from 'next/navigation';
import { logout } from '@/lib/user/appwrite';
import { clearAuthSession } from '@/lib/user/session';
import AIGeneratePanel from '@/components/AIGeneratePanel';
import { Document, HeadingLevel, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';
import { getDownloadableContent } from '@/components/MarkdownRenderer';
import { marked } from 'marked';
import PageLoadingScreen from '@/components/loading/PageLoadingScreen';
import DashboardSidebar from '@/components/DashboardSidebar';
import AIGenerateView from '@/components/AIGenerateView';

type AppMode = 'ai-generate' | 'analyze';

export default function Dashboard() {
  const toHtmlFromMarkdown = (value: unknown) => {
    if (typeof value !== 'string') return '';
    const safeValue = value.trim();
    if (!safeValue) return '';
    return marked(safeValue) as string;
  };

  const [content, setContent] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [mode, setMode] = useState<AppMode>('ai-generate');
  const [showStructured, setShowStructured] = useState(false);
  const [triggerAnalysis, setTriggerAnalysis] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');
  const [showAIGenerateAnalysis, setShowAIGenerateAnalysis] = useState(false);
  const [hasGeneratedContent, setHasGeneratedContent] = useState(false);
  const [documentId, setDocumentId] = useState<string | null>(null);
  const [fromHistory, setFromHistory] = useState(false);
  const [title, setTitle] = useState<string>('GeneratedContent');

  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.removeItem("documentId");
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
    };

    if (profileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [profileMenuOpen]);

  useEffect(() => {
    const loadHistoryState = () => {
      const savedState = localStorage.getItem('dashboardState');

      if (savedState) {
        const { mode, content, documentId, fromHistory, analysis } = JSON.parse(savedState);
        const safeMode: AppMode = mode === 'analyze' ? 'analyze' : 'ai-generate';

        setMode(safeMode);
        setContent(content);
        setAnalysis(analysis);
        setDocumentId(documentId);
        setFromHistory(true);

        switch (safeMode) {
          case 'analyze':
            setTriggerAnalysis(true);
            setShowStructured(true);
            setAnalysis(analysis);
            break;

          case 'ai-generate':
            setGeneratedContent(analysis);
            setHasGeneratedContent(true);
            setAnalysis(analysis);
            break;
        }
        localStorage.removeItem('dashboardState');
      }
    };

    loadHistoryState();
  }, []);

  const BackToHistoryButton = () => {
    if (!fromHistory) return null;

    return (
      <button
        onClick={() => router.push('/history')}
        className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="h-5 w-5" />
        Back to History
      </button>
    );
  };

  const handleLogout = async () => {
    try {
      setSigningOut(true);
      const sessionToken = localStorage.getItem('sessionToken');
      if (sessionToken) {
        await logout(sessionToken);
      }
      clearAuthSession();
      router.push('/auth/login');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setSigningOut(false);
    }
  };

  const handleAnalyze = () => {
    setMode('analyze');
    setTriggerAnalysis(true);
    const contentToAnalyze = generatedContent || content;
    const htmlContent = toHtmlFromMarkdown(contentToAnalyze);
    if (!htmlContent) return;
    setContent(htmlContent);
    setAnalysis(htmlContent);
  };

  const handleModeChange = (newMode: AppMode) => {
    setMode(newMode);
    router.push(`/dashboard?mode=${newMode}${documentId ? `&documentId=${documentId}` : ''}`);
    if (newMode !== mode) {
      setShowStructured(false);
      setTriggerAnalysis(false);
      setShowAIGenerateAnalysis(false);
      setHasGeneratedContent(false);
    }
  };

  const handleShowProfile = () => {
    router.push('/profile');
  };

  const handleHistory = () => {
    router.push('/history');
  };

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    setGeneratedContent(newContent);
    setAnalysis(newContent);
  };

  const handleGeneratedContent = (generatedContent: string) => {
    const safeGeneratedContent = typeof generatedContent === 'string' ? generatedContent.trim() : '';
    const generatedHtmlContent = toHtmlFromMarkdown(safeGeneratedContent);
    if (!generatedHtmlContent) return;
    handleContentChange(generatedHtmlContent);
    setHasGeneratedContent(true);
    setTitle(safeGeneratedContent.split('\n')[0] || 'GeneratedContent');
  };

  const downloadAsWord = () => {
    if (!generatedContent.trim()) return;

    const formattedContent = getDownloadableContent(generatedContent, 'docx');

    const doc = new Document({
      sections: [
        {
          children: formattedContent.split('\n').map((line) => {
            if (line.startsWith('--- ')) {
              return new Paragraph({
                text: line.replace('--- ', ''),
                heading: HeadingLevel.HEADING_1,
              });
            } else if (line.startsWith('-- ')) {
              return new Paragraph({
                text: line.replace('-- ', ''),
                heading: HeadingLevel.HEADING_2,
              });
            } else if (line.startsWith('- ')) {
              return new Paragraph({
                text: line.replace('- ', ''),
                heading: HeadingLevel.HEADING_3,
              });
            } else if (line.startsWith('• ')) {
              return new Paragraph({
                children: [new TextRun(line.replace('• ', ''))],
                bullet: { level: 0 },
              });
            } else if (line.startsWith('1. ')) {
              return new Paragraph({
                children: [new TextRun(line.replace('1. ', ''))],
                numbering: { reference: "ordered-list", level: 0 },
              });
            } else {
              return new Paragraph(line);
            }
          }),
        },
      ],
    });

    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, `${title || 'GeneratedContent'}.docx`);
    });
  };

  const [dataFromChild, setDataFromChild] = useState("");

  function handleDataFromChild(data: any) {
    setDataFromChild(data);
  }
  if (signingOut) {
    return <PageLoadingScreen label="Signing out" />;
  }

  return (
    <div className="min-h-screen h-screen flex bg-white">
      <DashboardSidebar mode={mode} onModeChange={handleModeChange} onHistory={handleHistory} />

      {/* Main Content */}
      <div className="flex-1 p-10 overflow-hidden bg-gray-50">
        <motion.div
          className="h-full flex flex-col max-w-[1800px] mx-auto"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <BackToHistoryButton />
              <motion.h1
                className="text-5xl font-bold text-gray-900"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 10 }}
              >
                ContentCraft Inspector
              </motion.h1>
            </div>

            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setProfileMenuOpen((prev) => !prev)}
                className="flex items-center gap-4 px-6 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
              >
                <UserCircle className="h-7 w-7" />
                Profile
              </button>

              {profileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <button
                    onClick={handleShowProfile}
                    className="w-full flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    <UserCircle className="h-5 w-5" />
                    Show Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-gray-100 rounded-b-lg"
                  >
                    <LogOut className="h-5 w-5" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1">
            {mode === 'ai-generate' && !hasGeneratedContent ? (
              <div className="flex-1 flex items-center justify-center h-full">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="w-[80%] h-[80%] bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden"
                >
                  <div className="h-full flex flex-col p-8">
                    <div className="p-4 border-b border-gray-100">
                      <h2 className="text-xl font-semibold">AI-Powered Content</h2>
                    </div>
                    <div className="flex-1 overflow-auto p-6">
                      <AIGeneratePanel onContentGenerated={handleGeneratedContent} />
                    </div>
                  </div>
                </motion.div>
              </div>
            ) : mode === 'ai-generate' && hasGeneratedContent ? (
              <AIGenerateView
                content={content}
                generatedContent={generatedContent}
                showAIGenerateAnalysis={showAIGenerateAnalysis}
                onContentGenerated={handleGeneratedContent}
                onAnalyze={handleAnalyze}
                onDownloadAsWord={downloadAsWord}
              />
            ) : (
              /* Two-column layout for analyze mode */
              <div className="grid grid-cols-2 gap-10 h-full">
                {/* Left Box */}
                <motion.div
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="bg-white rounded-2xl border border-gray-100 shadow-lg h-[calc(100vh-200px)] overflow-hidden"
                >
                  <ContentEditor
                    initialContent={content}
                    onContentChange={handleContentChange}
                    mode={mode}
                    sendDataToParent={handleDataFromChild}
                    onCreate={() => setShowStructured(true)}
                    onAnalyze={() => setTriggerAnalysis(prev => !prev)}
                  />
                </motion.div>

                {/* Right Column */}
                <div className="h-full flex flex-col">
                  {mode === 'analyze' && (
                    <Tabs defaultValue="analysis" className="h-[calc(100vh-200px)] flex flex-col">
                      <div className="flex items-center justify-between gap-4 mb-4">
                        <TabsList className="grid w-full grid-cols-3 bg-white p-0 rounded-xl border border-gray-100 shadow-lg">
                          <TabsTrigger
                            value="analysis"
                            className={cn(
                              "rounded-l-xl text-lg py-3",
                              "data-[state=active]:bg-blue-600 data-[state=active]:text-white",
                              "data-[state=inactive]:bg-white data-[state=inactive]:text-gray-600"
                            )}
                          >
                            Analysis 📊
                          </TabsTrigger>
                          <TabsTrigger
                            value="outline"
                            className={cn(
                              "text-lg py-3",
                              "data-[state=active]:bg-blue-600 data-[state=active]:text-white",
                              "data-[state=inactive]:bg-white data-[state=inactive]:text-gray-600"
                            )}
                          >
                            Outline 📝
                          </TabsTrigger>
                          <TabsTrigger
                            value="infogain"
                            className={cn(
                              "rounded-r-xl text-lg py-3",
                              "data-[state=active]:bg-blue-600 data-[state=active]:text-white",
                              "data-[state=inactive]:bg-white data-[state=inactive]:text-gray-600"
                            )}
                          >
                            Info Gain 🧠
                          </TabsTrigger>
                        </TabsList>
                      </div>

                      <motion.div
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="bg-white rounded-2xl border border-gray-100 shadow-lg flex-1 overflow-hidden"
                      >
                        <TabsContent value="analysis" className="h-full m-0 p-4 overflow-auto">
                          <AnalysisPanel
                            content={analysis}
                            triggerAnalysis={triggerAnalysis}
                            dataFromChild={dataFromChild}
                          />
                        </TabsContent>
                        <TabsContent value="outline" className="h-full m-0 p-4 overflow-auto">
                          <OutlinePanel
                            content={analysis}
                            triggerOutline={triggerAnalysis}
                            dataFromChild={dataFromChild}
                          />
                        </TabsContent>
                        <TabsContent value="infogain" className="h-full m-0 p-4 overflow-auto">
                          <InfoGainPanel
                            content={analysis}
                            triggerInfoGain={triggerAnalysis}
                            dataFromChild={dataFromChild}
                          />
                        </TabsContent>
                      </motion.div>
                    </Tabs>
                  )}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
