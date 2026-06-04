'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AnalysisPanel from '@/components/AnalysisPanel';
import OutlinePanel from '@/components/OutlinePanel';
import InfoGainPanel from '@/components/InfoGainPanel';
import AIScorePanel from '@/components/AIScorePanel';
import { motion } from 'framer-motion';
import { LogOut, UserCircle, Wand2, History, ArrowLeft, Menu, X, FileSearch, Notebook as Robot, Sparkles } from 'lucide-react';
import { cn, htmlToMarkdown } from '@/lib/utils';
import ContentEditor from '@/components/ContentEditor';
import { useRouter } from 'next/navigation';
import { logout, getUser } from '@/lib/user/appwrite';
import { updateContent } from '@/lib/content/appwrite';
import AIGeneratePanel from '@/components/AIGeneratePanel';
import PlagiarismPanel from '@/components/PlagiarismPanel';
import RephrasedPanel from '@/components/RephrasedPanel';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import { marked } from 'marked';
import { toast } from 'sonner';
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
  const [triggerOutline, setTriggerOutline]     = useState(false);
  const [triggerInfoGain, setTriggerInfoGain]   = useState(false);
  const [triggerPlagiarism, setTriggerPlagiarism] = useState(false);
  const [triggerRephrase, setTriggerRephrase]   = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');
  const [hasGeneratedContent, setHasGeneratedContent] = useState(false);
  const [documentId, setDocumentId] = useState<string | null>(null);
  const [fromHistory, setFromHistory] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [showPasteOption, setShowPasteOption] = useState(false);
  const [activeSidebarButton, setActiveSidebarButton] = useState<'ai-powered' | 'deep-analyze'>('ai-powered');

  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);
  const [panelKey, setPanelKey] = useState(0);

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

  // Listen for paste mode event from sidebar
  useEffect(() => {
    const handleOpenPasteMode = () => {
      setShowPasteOption(true);
    };
    window.addEventListener('openPasteMode', handleOpenPasteMode);
    return () => window.removeEventListener('openPasteMode', handleOpenPasteMode);
  }, []);

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
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to History
      </button>
    );
  };

  const handleLogout = async () => {
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

  const handleSmartEditor = () => {
    const htmlContent = marked(generatedContent || content) as string;
    setContent(htmlContent);
    setAnalysis(htmlContent);
    handleModeChange('create');
  };

  const handleAnalyze = () => {
    const contentToAnalyze = generatedContent || content;
    if (!contentToAnalyze.trim()) {
      toast.error('No content to analyze');
      return;
    }
    // Convert Markdown to HTML before setting it in the editor
    const htmlContent = marked(contentToAnalyze) as string;
    setContent(htmlContent);
    setAnalysis(htmlContent);
    setMode('analyze');
    // Small delay to ensure state is updated
    setTimeout(() => {
      setTriggerAnalysis(true);
    }, 100);
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
      setHasGeneratedContent(false);
      setTriggerOutline(false);
      setTriggerInfoGain(false);
      setTriggerPlagiarism(false);
      setTriggerRephrase(false);
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
          id="sidebar-nav"
          className={`fixed lg:relative z-30 lg:z-auto w-48 shrink-0 flex flex-col h-screen transition-transform duration-300 lg:translate-x-0 border-r border-border ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
          style={{ background: 'hsl(var(--sidebar-background))' }}
          aria-label="Main navigation sidebar"
        >
        {/* Logo */}
        <div className="relative px-5 py-5 border-b" style={{ borderColor: 'hsl(var(--sidebar-border))' }}>
          <button
            className="lg:hidden absolute top-4 right-4 p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close navigation menu"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg grad flex items-center justify-center shrink-0" aria-hidden="true">
              <Wand2 className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="text-sm font-semibold text-sidebar-foreground tracking-tight">ContentCraft</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto" aria-label="Main navigation">
          <button
            onClick={() => {
              handleModeChange('ai-generate');
              setActiveSidebarButton('ai-powered');
              setShowPasteOption(false);
            }}
            aria-current={activeSidebarButton === 'ai-powered' ? 'page' : undefined}
            className={cn(
              'w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 outline-none focus:outline-none focus-visible:outline-none',
              activeSidebarButton !== 'ai-powered' && 'hover:text-white'
            )}
            style={activeSidebarButton === 'ai-powered' ? { background: 'linear-gradient(135deg, #4338ca 0%, #4f46e5 50%, #6366f1 100%)', color: 'white' } : { color: 'hsl(var(--sidebar-foreground))' }}
            onMouseEnter={e => { if (activeSidebarButton !== 'ai-powered') (e.currentTarget as HTMLButtonElement).style.background = 'hsl(var(--sidebar-accent))'; }}
            onMouseLeave={e => { if (activeSidebarButton !== 'ai-powered') (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
          >
            <Wand2 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            AI Powered
          </button>

          <button
            onClick={() => {
              setContent(''); setAnalysis(''); setGeneratedContent('');
              setTriggerAnalysis(false); setTriggerAIScore(false);
              setTriggerOutline(false); setTriggerInfoGain(false);
              setTriggerPlagiarism(false); setTriggerRephrase(false);
              setShowStructured(false);
              setPanelKey(k => k + 1);
              handleModeChange('ai-generate');
              setActiveSidebarButton('deep-analyze');
              // Auto-open paste mode
              setTimeout(() => {
                const event = new CustomEvent('openPasteMode');
                window.dispatchEvent(event);
              }, 100);
            }}
            aria-current={activeSidebarButton === 'deep-analyze' ? 'page' : undefined}
            className={cn(
              'w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 outline-none focus:outline-none focus-visible:outline-none',
              activeSidebarButton !== 'deep-analyze' && 'hover:text-white'
            )}
            style={activeSidebarButton === 'deep-analyze' ? { background: 'linear-gradient(135deg, #4338ca 0%, #4f46e5 50%, #6366f1 100%)', color: 'white' } : { color: 'hsl(var(--sidebar-foreground))' }}
            onMouseEnter={e => { if (activeSidebarButton !== 'deep-analyze') (e.currentTarget as HTMLButtonElement).style.background = 'hsl(var(--sidebar-accent))'; }}
            onMouseLeave={e => { if (activeSidebarButton !== 'deep-analyze') (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
          >
            <FileSearch className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            Deep Analyze
          </button>

          <button
            onClick={() => router.push('/marketing-manager')}
            className={cn(
              'w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 outline-none focus:outline-none focus-visible:outline-none whitespace-nowrap',
              'hover:text-white'
            )}
            style={{ color: 'hsl(var(--sidebar-foreground))' }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'hsl(var(--sidebar-accent))'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
          >
            <Sparkles className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            AI Marketing
          </button>

          <div className="pt-4">
            <p className="text-[10px] font-semibold uppercase tracking-widest px-3 pb-2" style={{ color: 'hsl(var(--sidebar-foreground) / 0.45)' }}>Account</p>
            <button
              onClick={handleHistory}
              className={cn(
                'w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 outline-none focus:outline-none focus-visible:outline-none',
                'hover:text-white'
              )}
              style={{ color: 'hsl(var(--sidebar-foreground))' }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'hsl(var(--sidebar-accent))'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
            >
              <History className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              History
            </button>
          </div>
        </nav>

        {/* Profile at bottom */}
        <div className="px-3 py-4 border-t" style={{ borderColor: 'hsl(var(--sidebar-border))' }} ref={menuRef}>
          <button
            onClick={() => setProfileMenuOpen(prev => !prev)}
            aria-expanded={profileMenuOpen}
            aria-haspopup="menu"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 min-h-[40px]"
            style={{ color: 'hsl(var(--sidebar-foreground))' }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'hsl(var(--sidebar-accent))'; (e.currentTarget as HTMLButtonElement).style.color = 'white'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = 'hsl(var(--sidebar-foreground))'; }}
          >
            <UserCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
            Profile
          </button>
          {profileMenuOpen && (
            <div role="menu" className="mt-1 rounded-xl overflow-hidden shadow-lg border" style={{ background: 'hsl(var(--sidebar-accent))', borderColor: 'hsl(var(--sidebar-border))' }}>
              <button
                role="menuitem"
                onClick={handleShowProfile}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm transition-colors min-h-[40px]"
                style={{ color: 'hsl(var(--sidebar-foreground))' }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = 'white'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'hsl(var(--sidebar-foreground))'; }}
              >
                <UserCircle className="h-4 w-4" aria-hidden="true" />
                View Profile
              </button>
              <button
                role="menuitem"
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:text-red-400 hover:bg-red-500/10 transition-colors min-h-[40px]"
              >
                <LogOut className="h-4 w-4" aria-hidden="true" />
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
          {/* Mobile menu toggle only — no navbar */}
          <div className="flex lg:hidden items-center px-4 py-3 border-b border-border">
            <button
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              onClick={() => setSidebarOpen(prev => !prev)}
              aria-label="Open navigation menu"
              aria-expanded={sidebarOpen}
              aria-controls="sidebar-nav"
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </button>
            <BackToHistoryButton />
          </div>

          {/* Content area wrapper + Content Area */}
          <div className={cn("flex-1 flex flex-col", mode !== 'ai-generate' ? 'p-6 overflow-hidden' : 'bg-secondary/30 overflow-y-auto')}>
            {mode === 'ai-generate' ? (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="w-full"
              >
                <AIGeneratePanel
                  key={panelKey}
                  onContentGenerated={handleGeneratedContent}
                  onSmartEditor={handleSmartEditor}
                  onAnalyze={handleAnalyze}
                  onAIScore={handleAIScore}
                  initialContent={generatedContent || undefined}
                  showPasteOption={showPasteOption}
                  setShowPasteOption={setShowPasteOption}
                />
              </motion.div>
            ) : mode === 'create' && !showStructured ? (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="flex-1 flex flex-col overflow-hidden"
              >
                <div className="px-6 py-4 border-b border-border">
                  <h2 className="text-xs font-semibold text-foreground">Smart Editor</h2>
                </div>
                <div className="flex-1 overflow-hidden">
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
                </div>
              </motion.div>
            ) : mode === 'analyze' ? (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="flex-1 overflow-auto"
              >
                <div className="w-full px-6 py-4">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xs font-semibold text-foreground">Deep Analysis</h2>
                    <div className="flex items-center gap-3">
                      {!triggerAnalysis && content.trim() && (
                        <button
                          onClick={() => setTriggerAnalysis(true)}
                          className="flex items-center gap-1.5 text-xs font-medium px-4 py-2 rounded-xl grad text-white hover:opacity-90 transition-opacity min-h-[36px]"
                        >
                          Analyze
                        </button>
                      )}
                      {triggerAnalysis && (
                        <button
                          onClick={() => setTriggerAnalysis(false)}
                          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                        >
                          ← Edit content
                        </button>
                      )}
                    </div>
                  </div>
                  <Tabs defaultValue="analysis">
                    <TabsList className="grid w-full grid-cols-5 bg-secondary rounded-xl p-1 h-10 mb-6">
                      <TabsTrigger value="analysis" className="rounded-lg text-xs font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:text-muted-foreground">Analysis</TabsTrigger>
                      <TabsTrigger value="outline"  className="rounded-lg text-xs font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:text-muted-foreground" onClick={() => setTriggerOutline(true)}>Outline</TabsTrigger>
                      <TabsTrigger value="infogain" className="rounded-lg text-xs font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:text-muted-foreground" onClick={() => setTriggerInfoGain(true)}>Info Gain</TabsTrigger>
                      <TabsTrigger value="plagiarism" className="rounded-lg text-xs font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:text-muted-foreground" onClick={() => setTriggerPlagiarism(true)}>Plagiarism</TabsTrigger>
                      <TabsTrigger value="rephrase" className="rounded-lg text-xs font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:text-muted-foreground" onClick={() => setTriggerRephrase(true)}>Rephrase</TabsTrigger>
                    </TabsList>
                    <TabsContent value="analysis"><AnalysisPanel content={analysis} triggerAnalysis={triggerAnalysis} dataFromChild={dataFromChild || analysis}/></TabsContent>
                    <TabsContent value="outline"><OutlinePanel content={analysis} triggerOutline={triggerOutline} dataFromChild={dataFromChild || analysis}/></TabsContent>
                    <TabsContent value="infogain"><InfoGainPanel content={analysis} triggerInfoGain={triggerInfoGain} dataFromChild={dataFromChild || analysis}/></TabsContent>
                    <TabsContent value="plagiarism"><PlagiarismPanel content={analysis} triggerPlagiarism={triggerPlagiarism} /></TabsContent>
                    <TabsContent value="rephrase"><RephrasedPanel content={analysis} triggerRephrase={triggerRephrase} /></TabsContent>
                  </Tabs>
                </div>
              </motion.div>

            ) : mode === 'ai-score' ? (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="flex-1 overflow-auto"
              >
                <div className="w-full px-6 py-4">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xs font-semibold text-foreground">Realness Score</h2>
                    <div className="flex items-center gap-3">
                      {!triggerAIScore && content.trim() && (
                        <button
                          onClick={() => setTriggerAIScore(true)}
                          className="flex items-center gap-1.5 text-xs font-medium px-4 py-2 rounded-xl grad text-white hover:opacity-90 transition-opacity min-h-[36px]"
                        >
                          Check Score
                        </button>
                      )}
                      {triggerAIScore && (
                        <button
                          onClick={() => setTriggerAIScore(false)}
                          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                        >
                          ← Edit content
                        </button>
                      )}
                    </div>
                  </div>
                  <AIScorePanel content={content} triggerAIScore={triggerAIScore} />
                </div>
              </motion.div>

            ) : mode === 'create' && showStructured ? (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="flex-1 overflow-auto"
              >
                <div className="w-full px-6 py-4">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xs font-semibold text-foreground">Structured Content</h2>
                    <div className="flex gap-2">
                      <button onClick={handleAnalyze} className="gap-1.5 px-3 py-1.5 rounded-lg flex items-center text-xs font-medium grad text-white hover:opacity-90 transition-opacity">
                        <FileSearch className="h-3.5 w-3.5" /> Analyze
                      </button>
                      <button onClick={handleAIScore} className="gap-1.5 px-3 py-1.5 rounded-lg flex items-center text-xs font-medium bg-secondary border border-border text-foreground hover:bg-accent transition-colors">
                        <Robot className="h-3.5 w-3.5" /> AI Score
                      </button>
                    </div>
                  </div>
                  <MarkdownRenderer content={htmlToMarkdown(content)} />
                </div>
              </motion.div>

            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.35 }}
                className="flex-1 flex flex-col overflow-hidden"
              >
                <div className="px-6 py-4 border-b border-border">
                  <h2 className="text-xs font-semibold text-foreground">Smart Editor</h2>
                </div>
                <div className="flex-1 overflow-hidden">
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
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}