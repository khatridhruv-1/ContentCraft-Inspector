'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AnalysisPanel from '@/components/AnalysisPanel';
import OutlinePanel from '@/components/OutlinePanel';
import InfoGainPanel from '@/components/InfoGainPanel';
import AIScorePanel from '@/components/AIScorePanel';
import { motion } from 'framer-motion';
import { Edit, FileSearch, LogOut, Notebook as Robot, UserCircle, Wand2, History, ArrowLeft, Menu, X } from 'lucide-react';
import { cn, htmlToMarkdown } from '@/lib/utils';
import ContentEditor from '@/components/ContentEditor';
import { useRouter } from 'next/navigation';
import { logout, getUser } from '@/lib/user/appwrite';
import { updateContent } from '@/lib/content/appwrite';
import AIGeneratePanel from '@/components/AIGeneratePanel';
import { Document, HeadingLevel, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';
import MarkdownRenderer, { getDownloadableContent } from '@/components/MarkdownRenderer';
import { marked } from 'marked';
import { Suspense } from 'react';
import DashboardParams from '@/components/DashboardParams';

type AppMode = 'ai-generate' | 'create' | 'analyze' | 'ai-score';

export default function Dashboard() {
  const [content, setContent] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [mode, setMode] = useState<AppMode>('ai-generate');
  const [showStructured, setShowStructured] = useState(false);
  const [triggerAnalysis, setTriggerAnalysis] = useState(false);
  const [triggerAIScore, setTriggerAIScore] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [generatedContent, setGeneratedContent] = useState('');
  const [showAIGenerateAnalysis, setShowAIGenerateAnalysis] = useState(false);
  const [showAIGenerateScore, setShowAIGenerateScore] = useState(false);
  const [hasGeneratedContent, setHasGeneratedContent] = useState(false);
  const [documentId, setDocumentId] = useState<string | null>(null);
  const [fromHistory, setFromHistory] = useState(false);
  const [title, setTitle] = useState<string>('GeneratedContent');
  const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);

  const hasContent = content.trim().length > 0 || generatedContent.trim().length > 0;

  // Session check on mount — redirect to login if token is expired
  useEffect(() => {
    const checkAuth = async () => {
      const sessionToken = localStorage.getItem('sessionToken');
      if (!sessionToken) {
        router.push('/auth/login');
        return;
      }
      try {
        await getUser(sessionToken);
        setAuthChecked(true);
      } catch (err: unknown) {
        const msg = (err as Error)?.message ?? '';
        if (msg === 'SESSION_EXPIRED') {
          localStorage.removeItem('sessionToken');
          localStorage.removeItem('documentId');
          router.push('/auth/login');
        } else {
          setAuthChecked(true);
        }
      }
    };

    checkAuth();
  }, [router]);

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
        const { mode, content, documentId, analysis } = JSON.parse(savedState);
  
        setMode(mode as AppMode);
        setContent(content);
        setAnalysis(analysis)
        setDocumentId(documentId);
        setFromHistory(true);
  
        switch (mode) {
          case 'analyze':
            setTriggerAnalysis(true);
            setShowStructured(true);
            setAnalysis(analysis);
            break;
  
          case 'ai-score':
            setTriggerAIScore(true);
            setShowStructured(true);
            setAnalysis(analysis);
            break;
  
          case 'ai-generate':
            setGeneratedContent(analysis);
            setHasGeneratedContent(true);
            setAnalysis(analysis);
            break;
  
          case 'create':
            setShowStructured(true);
            break;
        }
        localStorage.removeItem('dashboardState'); // Remove data after loading
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
    setLoading(true);
    try {
      const sessionToken = localStorage.getItem('sessionToken');
      if (sessionToken) await logout(sessionToken);
    } catch {
      // ignore logout errors
    } finally {
      localStorage.removeItem('sessionToken');
      localStorage.removeItem('documentId');
      router.push('/auth/login');
    }
  };

  const handleAnalyze = () => {
    setMode('analyze');
    setTriggerAnalysis(true);
    const contentToAnalyze = generatedContent || content;
    // Convert Markdown to HTML before setting it in the editor
    const htmlContent = marked(contentToAnalyze) as string;
    setContent(htmlContent);
    setAnalysis(htmlContent);
  };

  const handleAIScore = () => {
    setMode('ai-score');
    setTriggerAIScore(true);
    const contentToScore = generatedContent || content;
    // Convert Markdown to HTML before setting it in the editor
    const htmlContent = marked(contentToScore) as string;
    setContent(htmlContent);
    setAnalysis(htmlContent);
  };

  const handleModeChange = (newMode: AppMode) => {
    setMode(newMode);
    router.push(`/dashboard?mode=${newMode}${documentId ? `&documentId=${documentId}` : ''}`);
    // Only reset these states if we're switching to a different mode
    if (newMode !== mode) {
      setShowStructured(false);
      setTriggerAnalysis(false);
      setTriggerAIScore(false);
      setShowAIGenerateAnalysis(false);
      setShowAIGenerateScore(false);
      setHasGeneratedContent(false);
    }
  };
  const handleShowProfile = () => {
    router.push('/profile');
  };

  const handleHistory = () => {
    router.push('/history');
  }

  const handleContentChange = (newContent: string) => {
    // Keep content as HTML for the editor
    setContent(newContent);
    setGeneratedContent(newContent);
    setAnalysis(newContent);
  };

  const handleGeneratedContent = (generatedContent: string) => {
    if (!generatedContent) return;
    const generatedHtmlContent = marked(generatedContent) as string;
    handleContentChange(generatedHtmlContent);
    setHasGeneratedContent(true);
    setTitle(generatedContent.split('\n')[0] || 'GeneratedContent');
  };

  const downloadAsWord = () => {
    if (!generatedContent.trim()) return;
  
    // Convert Markdown to structured text
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

  function handleDataFromChild(data :any) {
    setDataFromChild(data);
  }

  const handleAutoSave = async (currentContent: string) => {
    const documentId = localStorage.getItem('documentId');
    if (!documentId || !currentContent.trim()) return;
    setAutoSaveStatus('saving');
    try {
      await updateContent(documentId, { input: currentContent, analysis: currentContent });
      setAutoSaveStatus('saved');
      setTimeout(() => setAutoSaveStatus('idle'), 2000);
    } catch {
      setAutoSaveStatus('idle');
    }
  };

  if (!authChecked) return null;

  return (
    <div className="min-h-screen h-screen flex bg-background">
      <Suspense fallback={null}>
        <DashboardParams setMode={setMode} />
      </Suspense>
      {/* Sidebar */}
      <>
        {/* Mobile overlay backdrop */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        <div
          className={`fixed lg:relative z-30 lg:z-auto w-72 shrink-0 flex flex-col h-screen transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
          style={{ background: 'hsl(var(--sidebar-background))' }}
        >
        {/* Logo */}
        <div className="relative px-6 py-6 border-b" style={{ borderColor: 'hsl(var(--sidebar-border))' }}>
          <button
            className="lg:hidden absolute top-4 right-4 p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-violet-500 flex items-center justify-center shrink-0">
              <Wand2 className="h-4 w-4 text-white" />
            </div>
            <span className="text-base font-semibold text-white tracking-tight">ContentCraft</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <p className="text-xs font-semibold uppercase tracking-widest px-3 pb-2" style={{ color: 'hsl(var(--sidebar-foreground) / 0.45)' }}>Tools</p>

          {(([
            { mode: 'ai-generate' as AppMode, label: 'AI-Powered', icon: Wand2, disabled: false },
            { mode: 'create'      as AppMode, label: 'Smart Editor', icon: Edit, disabled: false },
            { mode: 'analyze'     as AppMode, label: 'Deep Analysis', icon: FileSearch, disabled: false },
            { mode: 'ai-score'    as AppMode, label: 'Realness Score', icon: Robot, disabled: !hasContent },
          ]) as Array<{ mode: AppMode; label: string; icon: React.ElementType; disabled: boolean }>).map(({ mode: m, label, icon: Icon, disabled }) => (
            <button
              key={m}
              onClick={() => !disabled && handleModeChange(m)}
              disabled={disabled}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
                mode === m
                  ? 'text-white'
                  : disabled
                  ? 'opacity-40 cursor-not-allowed'
                  : 'hover:text-white'
              )}
              style={
                mode === m
                  ? { background: 'hsl(var(--sidebar-primary))', color: 'white' }
                  : { color: 'hsl(var(--sidebar-foreground))' }
              }
              onMouseEnter={e => { if (mode !== m && !disabled) (e.currentTarget as HTMLButtonElement).style.background = 'hsl(var(--sidebar-accent))'; }}
              onMouseLeave={e => { if (mode !== m) (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </button>
          ))}

          <div className="pt-4">
            <p className="text-xs font-semibold uppercase tracking-widest px-3 pb-2" style={{ color: 'hsl(var(--sidebar-foreground) / 0.45)' }}>Account</p>
            <button
              onClick={handleHistory}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150"
              style={{ color: 'hsl(var(--sidebar-foreground))' }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'hsl(var(--sidebar-accent))'; (e.currentTarget as HTMLButtonElement).style.color = 'white'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = 'hsl(var(--sidebar-foreground))'; }}
            >
              <History className="h-4 w-4 shrink-0" />
              History
            </button>
          </div>
        </nav>

        {/* Profile at bottom */}
        <div className="px-3 py-4 border-t" style={{ borderColor: 'hsl(var(--sidebar-border))' }} ref={menuRef}>
          <button
            onClick={() => setProfileMenuOpen(prev => !prev)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150"
            style={{ color: 'hsl(var(--sidebar-foreground))' }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'hsl(var(--sidebar-accent))'; (e.currentTarget as HTMLButtonElement).style.color = 'white'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = 'hsl(var(--sidebar-foreground))'; }}
          >
            <UserCircle className="h-4 w-4 shrink-0" />
            Profile
          </button>
          {profileMenuOpen && (
            <div className="mt-1 rounded-lg overflow-hidden shadow-lg border" style={{ background: 'hsl(var(--sidebar-accent))', borderColor: 'hsl(var(--sidebar-border))' }}>
              <button
                onClick={handleShowProfile}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm transition-colors"
                style={{ color: 'hsl(var(--sidebar-foreground))' }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = 'white'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'hsl(var(--sidebar-foreground))'; }}
              >
                <UserCircle className="h-4 w-4" />
                Show Profile
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
      </>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden bg-background w-full">
        <motion.div
          className="h-full flex flex-col"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Header */}
          <div className="flex justify-between items-center px-8 py-4 border-b bg-card">
            <div className="flex items-center gap-3">
              <button
                className="lg:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                onClick={() => setSidebarOpen(prev => !prev)}
              >
                <Menu className="h-5 w-5" />
              </button>
              <BackToHistoryButton />
              <div>
                <h1 className="text-xl font-bold text-foreground tracking-tight">ContentCraft Inspector</h1>
                <p className="text-xs text-muted-foreground capitalize">{mode.replace('-', ' ')} mode</p>
              </div>
            </div>
          </div>

          {/* Content area wrapper + Content Area */}
          <div className="flex-1 p-6 overflow-hidden flex flex-col">
            {mode === 'ai-generate' && !hasGeneratedContent ? (
              <div className="flex-1 flex items-center justify-center h-full">
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.35 }}
                  className="w-[80%] h-[80%] bg-card rounded-2xl border border-border shadow-sm overflow-hidden"
                >
                  <div className="h-full flex flex-col">
                    <div className="px-6 py-4 border-b border-border">
                      <h2 className="text-base font-semibold text-foreground">AI-Powered Content</h2>
                    </div>
                    <div className="flex-1 overflow-auto p-6">
                      <AIGeneratePanel onContentGenerated={handleGeneratedContent} />
                    </div>
                  </div>
                </motion.div>
              </div>
            ) : mode === 'ai-generate' && hasGeneratedContent ? (
              <div className="grid grid-cols-2 gap-5 h-full">
                <motion.div
                  initial={{ x: -30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.35, delay: 0.1 }}
                  className="bg-card rounded-2xl border border-border shadow-sm h-full overflow-hidden flex flex-col"
                >
                  <div className="px-5 py-3.5 border-b border-border flex-shrink-0">
                    <h2 className="text-sm font-semibold text-foreground">Generate New Content</h2>
                  </div>
                  <div className="flex-1 overflow-auto p-5">
                    <AIGeneratePanel onContentGenerated={handleGeneratedContent} />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ x: 30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.35, delay: 0.2 }}
                  className="bg-card rounded-2xl border border-border shadow-sm h-full flex flex-col"
                >
                  <div className="px-5 py-3.5 border-b border-border flex justify-between items-center flex-shrink-0">
                    <h2 className="text-sm font-semibold text-foreground">Generated Content</h2>
                    <div className="flex gap-2">
                      <button onClick={handleAnalyze} className="gap-1.5 px-3 py-1.5 rounded-lg flex items-center text-xs font-medium bg-primary text-primary-foreground hover:opacity-90 transition-opacity">
                        <FileSearch className="h-3.5 w-3.5" /> Analyze
                      </button>
                      <button onClick={handleAIScore} className="gap-1.5 px-3 py-1.5 rounded-lg flex items-center text-xs font-medium bg-primary text-primary-foreground hover:opacity-90 transition-opacity">
                        <Robot className="h-3.5 w-3.5" /> AI Score
                      </button>
                      <button onClick={downloadAsWord} className="gap-1.5 px-3 py-1.5 rounded-lg flex items-center text-xs font-medium bg-emerald-600 text-white hover:opacity-90 transition-opacity">
                        📄 Download
                      </button>
                    </div>
                  </div>
                  <div className="flex-1 p-5 overflow-auto">
                    <div className="prose prose-sm max-w-none">
                      <MarkdownRenderer content={htmlToMarkdown(generatedContent)} />
                    </div>
                  </div>
                  {(showAIGenerateAnalysis || showAIGenerateScore) && (
                    <div className="border-t border-border flex-1 overflow-hidden">
                      {showAIGenerateAnalysis && (
                        <Tabs defaultValue="analysis" className="h-full flex flex-col">
                          <TabsList className="grid w-full grid-cols-3 rounded-none border-b border-border bg-muted/50 p-0 h-10">
                            <TabsTrigger value="analysis" className="rounded-none text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Analysis</TabsTrigger>
                            <TabsTrigger value="outline"  className="rounded-none text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Outline</TabsTrigger>
                            <TabsTrigger value="infogain" className="rounded-none text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Info Gain</TabsTrigger>
                          </TabsList>
                          <div className="flex-1 overflow-auto">
                            <TabsContent value="analysis" className="p-4"><AnalysisPanel content={content} triggerAnalysis={showAIGenerateAnalysis} dataFromChild={content}/></TabsContent>
                            <TabsContent value="outline"  className="p-4"><OutlinePanel  content={content} triggerOutline={showAIGenerateAnalysis}  dataFromChild={content}/></TabsContent>
                            <TabsContent value="infogain" className="p-4"><InfoGainPanel content={content} triggerInfoGain={showAIGenerateAnalysis} dataFromChild={content}/></TabsContent>
                          </div>
                        </Tabs>
                      )}
                      {showAIGenerateScore && (
                        <div className="p-4 flex-1 overflow-auto">
                          <AIScorePanel content={content} triggerAIScore={triggerAIScore} />
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              </div>
            ) : mode === 'create' && !showStructured ? (
              <div className="flex-1 flex items-center justify-center h-full">
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.35 }}
                  className="bg-card rounded-2xl border border-border shadow-sm h-full overflow-hidden w-full"
                >
                  <ContentEditor
                    initialContent={analysis}
                    onContentChange={handleContentChange}
                    mode={mode}
                    sendDataToParent={handleDataFromChild}
                    onCreate={() => setShowStructured(true)}
                    onAnalyze={() => setTriggerAnalysis(prev => !prev)}
                    onAIScore={() => setTriggerAIScore(true)}
                    onAutoSave={handleAutoSave}
                    autoSaveStatus={autoSaveStatus}
                  />
                </motion.div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-5 h-full">
                <motion.div
                  initial={{ x: -30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.35, delay: 0.1 }}
                  className="bg-card rounded-2xl border border-border shadow-sm h-[calc(100vh-140px)] overflow-hidden"
                >
                  <ContentEditor
                    initialContent={content}
                    onContentChange={handleContentChange}
                    mode={mode}
                    sendDataToParent={handleDataFromChild}
                    onCreate={() => setShowStructured(true)}
                    onAnalyze={() => setTriggerAnalysis(prev => !prev)}
                    onAIScore={() => setTriggerAIScore(true)}
                    onAutoSave={handleAutoSave}
                    autoSaveStatus={autoSaveStatus}
                  />
                </motion.div>

                <div className="h-full flex flex-col">
                  {mode === 'analyze' && (
                    <Tabs defaultValue="analysis" className="h-[calc(100vh-140px)] flex flex-col">
                      <div className="mb-3">
                        <TabsList className="grid w-full grid-cols-3 bg-card border border-border rounded-xl p-1 shadow-sm h-10">
                          <TabsTrigger value="analysis" className="rounded-lg text-xs font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:text-muted-foreground">Analysis 📊</TabsTrigger>
                          <TabsTrigger value="outline"  className="rounded-lg text-xs font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:text-muted-foreground">Outline 📝</TabsTrigger>
                          <TabsTrigger value="infogain" className="rounded-lg text-xs font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:text-muted-foreground">Info Gain 🧠</TabsTrigger>
                        </TabsList>
                      </div>
                      <motion.div
                        initial={{ x: 30, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.35, delay: 0.2 }}
                        className="bg-card rounded-2xl border border-border shadow-sm flex-1 overflow-hidden"
                      >
                        <TabsContent value="analysis" className="h-full m-0 p-4 overflow-auto"><AnalysisPanel content={analysis} triggerAnalysis={triggerAnalysis} dataFromChild={dataFromChild}/></TabsContent>
                        <TabsContent value="outline"  className="h-full m-0 p-4 overflow-auto"><OutlinePanel  content={analysis} triggerOutline={triggerAnalysis}  dataFromChild={dataFromChild}/></TabsContent>
                        <TabsContent value="infogain" className="h-full m-0 p-4 overflow-auto"><InfoGainPanel content={analysis} triggerInfoGain={triggerAnalysis} dataFromChild={dataFromChild}/></TabsContent>
                      </motion.div>
                    </Tabs>
                  )}

                  {mode === 'create' && showStructured && (
                    <motion.div
                      initial={{ x: 30, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.35, delay: 0.2 }}
                      className="bg-card rounded-2xl border border-border shadow-sm h-[calc(100vh-140px)] overflow-hidden"
                    >
                      <div className="h-full flex flex-col">
                        <div className="px-5 py-3.5 border-b border-border flex justify-between items-center">
                          <h2 className="text-sm font-semibold text-foreground">Structured Content</h2>
                          <div className="flex gap-2">
                            <button onClick={handleAnalyze} className="gap-1.5 px-3 py-1.5 rounded-lg flex items-center text-xs font-medium bg-primary text-primary-foreground hover:opacity-90 transition-opacity">
                              <FileSearch className="h-3.5 w-3.5" /> Analyze
                            </button>
                            <button onClick={handleAIScore} className="gap-1.5 px-3 py-1.5 rounded-lg flex items-center text-xs font-medium bg-primary text-primary-foreground hover:opacity-90 transition-opacity">
                              <Robot className="h-3.5 w-3.5" /> AI Score
                            </button>
                          </div>
                        </div>
                        <div className="flex-1 p-5 overflow-auto">
                          <div className="prose prose-sm max-w-none">
                            <MarkdownRenderer content={htmlToMarkdown(content)} />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {mode === 'ai-score' && (
                    <motion.div
                      initial={{ x: 30, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.35, delay: 0.2 }}
                      className="bg-card rounded-2xl border border-border shadow-sm h-[calc(100vh-140px)] overflow-hidden"
                    >
                      <div className="p-4 h-full overflow-auto">
                        <AIScorePanel content={content} triggerAIScore={triggerAIScore} />
                      </div>
                    </motion.div>
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