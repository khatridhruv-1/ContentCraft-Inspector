import React, { useState, useRef, useEffect } from 'react';
import { Loader2, Wand2, FileText, FileDown, RefreshCw, FileSearch, BarChart2 } from 'lucide-react';
import { toast } from 'sonner';
import { saveAs } from 'file-saver';
import { saveContent, updateContent } from '@/lib/content/appwrite';
import { useRouter } from 'next/navigation';
import { getUser } from '@/lib/user/appwrite';
import { jsPDF } from 'jspdf';
import { useCompanyId } from '@/hooks/useCompany';
import MarkdownRenderer, { getDownloadableContent } from './MarkdownRenderer';
import { Document as DocxDocument, Packer as DocxPacker, Paragraph as DocxParagraph, TextRun as DocxTextRun } from 'docx';

interface AIGeneratePanelProps {
  onContentGenerated: (content: string) => void;
  onAnalyze?: () => void;
  onAIScore?: () => void;
  initialContent?: string;
}

const tones = [
  'Professional', 'Formal', 'Informal', 'Friendly', 'Persuasive',
  'Authoritative', 'Conversational', 'Inspirational', 'Humorous',
  'Empathetic', 'Educational', 'Engaging', 'Neutral', 'Analytical',
  'Witty', 'Casual', 'Motivational', 'Storytelling',
];

const lengths = [
  { label: '~500 words',  value: 500  },
  { label: '~1000 words', value: 1000 },
  { label: '~2000 words', value: 2000 },
  { label: '~3000 words', value: 3000 },
];

const languages = ['English', 'Hindi', 'Spanish', 'French', 'German', 'Portuguese', 'Japanese'];

const templates = [
  { label: '📝 Blog Post',    title: 'How to get started with ',  keywords: 'beginner, guide, tips, step-by-step', targetWords: 1000 },
  { label: '🛍️ Product Desc', title: 'Why you should use ',        keywords: 'features, benefits, value, solution',  targetWords: 500  },
  { label: '📧 Email',        title: 'Email: ',                    keywords: 'professional, clear, action, concise', targetWords: 500  },
  { label: '📣 Ad Copy',      title: 'Introducing ',               keywords: 'compelling, offer, urgency, conversion',targetWords: 500  },
  { label: '📱 Social Media', title: 'Top 5 tips about ',          keywords: 'engaging, short, trending, viral',     targetWords: 500  },
];

export default function AIGeneratePanel({ onContentGenerated, onAnalyze, onAIScore, initialContent }: AIGeneratePanelProps) {
  const router = useRouter();
  const [title, setTitle]             = useState('');
  const [keywords, setKeywords]       = useState('');
  const [tone, setTone]               = useState('Professional');
  const [targetWords, setTargetWords] = useState(1000);
  const [language, setLanguage]       = useState('English');
  const [loading, setLoading]         = useState(false);
  const [generatedContent, setGeneratedContent]     = useState(initialContent || '');
  const [generateError, setGenerateError]           = useState('');
  const [generatedWordCount, setGeneratedWordCount] = useState(
    initialContent ? initialContent.replace(/<[^>]*>/g, '').trim().split(/\s+/).filter(Boolean).length : 0
  );
  const [progress, setProgress]       = useState(0);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { companyId }: any = useCompanyId();

  useEffect(() => {
    if (loading) {
      setProgress(0);
      let elapsed = 0;
      progressRef.current = setInterval(() => {
        elapsed += 200;
        setProgress(90 * (1 - Math.exp(-elapsed / 8000)));
        if (elapsed >= 40000 && progressRef.current) clearInterval(progressRef.current);
      }, 200);
    } else {
      if (progressRef.current) clearInterval(progressRef.current);
      setProgress(0);
    }
    return () => { if (progressRef.current) clearInterval(progressRef.current); };
  }, [loading]);

  const handleClear = () => {
    setTitle(''); setKeywords(''); setTone('Professional');
    setTargetWords(1000); setLanguage('English');
    setGenerateError(''); setGeneratedContent(''); setGeneratedWordCount(0);
  };

  const generateContent = async () => {
    if (!title.trim()) return;
    setLoading(true);
    setGenerateError('');
    setGeneratedContent('');
    try {
      const requestData: Record<string, any> = { title };
      if (keywords.trim()) requestData.keywords = keywords;
      if (tone) requestData.tone = tone;
      requestData.targetWords = targetWords;

      const response = await fetch('/api/ai-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const data = await response.json();
        const msg = data.error || 'Failed to generate content. Please try again.';
        setGenerateError(msg); toast.error(msg); return;
      }

      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let fullContent = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        fullContent += decoder.decode(value, { stream: true });
        setGeneratedContent(fullContent);
        onContentGenerated(fullContent);
      }

      const wc = fullContent.trim().split(/\s+/).filter(Boolean).length;
      setGeneratedWordCount(wc);
      toast.success(`Content generated — ${wc.toLocaleString()} words`);

const documentId = localStorage.getItem('documentId');
      if (documentId) {
        await updateContent(documentId, { input: title, analysis: fullContent, companyId });
      } else {
        const sessionToken = localStorage.getItem('sessionToken');
        if (!sessionToken) { router.push('/auth/login'); return; }
        const user = await getUser(sessionToken);
        const res = await saveContent(title, user.$id, fullContent, 'ai-generate');
        if (res) localStorage.setItem('documentId', res.$id);
      }
    } catch {
      const msg = 'Failed to generate content. Please try again.';
      setGenerateError(msg); toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const downloadAsWord = () => {
    if (!generatedContent) return;
    const formattedContent = getDownloadableContent(generatedContent, 'docx');
    const doc = new DocxDocument({
      sections: [{
        children: formattedContent.split('\n').map(line => new DocxParagraph({ children: [new DocxTextRun(line)] })),
      }],
    });
    DocxPacker.toBlob(doc).then(blob => saveAs(blob, `${title || 'GeneratedContent'}.docx`));
    toast.success('Downloading as Word document...');
  };

  const downloadAsPDF = () => {
    if (!generatedContent) return;
    const doc = new jsPDF();
    doc.text(doc.splitTextToSize(generatedContent, 180), 10, 10);
    doc.save(`${title || 'GeneratedContent'}.pdf`);
    toast.success('Downloading as PDF...');
  };

  const selectCls = 'w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/10 transition-all cursor-pointer appearance-none';
  const inputCls  = 'w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/10 transition-all';

  if (generatedContent) {
    return (
      <div className="w-full max-w-3xl mx-auto px-8 py-8 space-y-5">
        {/* Result header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl grad flex items-center justify-center shadow-sm shrink-0" aria-hidden="true">
              <Wand2 className="h-4 w-4 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Generated Content</h2>
              {generatedWordCount > 0 && (
                <p className="text-xs text-muted-foreground">{generatedWordCount.toLocaleString()} words</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleClear}
              className="flex items-center gap-1.5 text-xs font-medium px-3.5 py-2 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              aria-label="Clear and generate new content"
            >
              <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" /> New
            </button>
            {onAnalyze && (
              <button onClick={onAnalyze} className="flex items-center gap-1.5 text-xs font-medium px-3.5 py-2 rounded-xl grad text-white hover:opacity-90 transition-opacity">
                <FileSearch className="h-3.5 w-3.5" aria-hidden="true" /> Analyze
              </button>
            )}
            {onAIScore && (
              <button onClick={onAIScore} className="flex items-center gap-1.5 text-xs font-medium px-3.5 py-2 rounded-xl bg-secondary border border-border text-foreground hover:bg-accent transition-colors">
                <BarChart2 className="h-3.5 w-3.5" aria-hidden="true" /> AI Score
              </button>
            )}
            <button onClick={downloadAsWord} aria-label="Download as Word document" className="flex items-center gap-1.5 text-xs font-medium px-3.5 py-2 rounded-xl bg-secondary border border-border text-muted-foreground hover:text-foreground transition-colors">
              <FileText className="h-3.5 w-3.5" aria-hidden="true" /> Word
            </button>
            <button onClick={downloadAsPDF} aria-label="Download as PDF" className="flex items-center gap-1.5 text-xs font-medium px-3.5 py-2 rounded-xl bg-secondary border border-border text-muted-foreground hover:text-foreground transition-colors">
              <FileDown className="h-3.5 w-3.5" aria-hidden="true" /> PDF
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="prose prose-sm max-w-none">
          <MarkdownRenderer content={generatedContent.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim()} />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto px-8 py-8 space-y-8">

      {/* Page header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl grad flex items-center justify-center shadow-sm">
            <Wand2 className="h-4 w-4 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground">Generate AI Content</h1>
            <p className="text-xs text-muted-foreground">Fill in the details to generate a 1000+ word article</p>
          </div>
        </div>
        <span className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          READY
        </span>
      </div>

      {/* Quick templates */}
      <div className="space-y-2.5">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Quick Templates</p>
        <div className="flex flex-wrap gap-2">
          {templates.map(t => (
            <button
              key={t.label}
              onClick={() => { setTitle(t.title); setKeywords(t.keywords); setTargetWords(t.targetWords); }}
              className="text-xs px-3.5 py-1.5 rounded-full border border-border bg-white text-muted-foreground hover:text-foreground hover:border-primary/30 hover:bg-secondary transition-all font-medium shadow-sm"
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Form fields */}
      <div className="space-y-5">

        <div className="space-y-2">
          <label htmlFor="ai-title" className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            Title or Topic <span className="text-destructive normal-case tracking-normal" aria-label="required">*</span>
          </label>
          <input
            id="ai-title"
            placeholder="e.g. The future of renewable energy..."
            value={title}
            onChange={e => setTitle(e.target.value)}
            className={inputCls}
            required
            aria-required="true"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="ai-keywords" className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            Keywords <span className="normal-case tracking-normal font-normal text-muted-foreground/60">(optional)</span>
          </label>
          <input
            id="ai-keywords"
            placeholder="e.g. renewable, solar, future"
            value={keywords}
            onChange={e => setKeywords(e.target.value)}
            className={inputCls}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Tone', id: 'ai-tone', el: <select id="ai-tone" value={tone} onChange={e => setTone(e.target.value)} className={selectCls}>{tones.map(t => <option key={t}>{t}</option>)}</select> },
            { label: 'Length', id: 'ai-length', el: <select id="ai-length" value={targetWords} onChange={e => setTargetWords(Number(e.target.value))} className={selectCls}>{lengths.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}</select> },
            { label: 'Language', id: 'ai-language', el: <select id="ai-language" value={language} onChange={e => setLanguage(e.target.value)} className={selectCls}>{languages.map(l => <option key={l}>{l}</option>)}</select> },
          ].map(({ label, id, el }) => (
            <div key={label} className="space-y-2">
              <label htmlFor={id} className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">{label}</label>
              <div className="relative">{el}
                <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>
          ))}
        </div>

        {generateError && (
          <div role="alert" className="flex items-center gap-2 text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded-xl px-3 py-2.5">
            <span className="shrink-0">⚠</span>
            {generateError}
          </div>
        )}
      </div>

      {/* Progress bar */}
      {loading && (
        <div className="h-1 bg-secondary rounded-full overflow-hidden">
          <div className="h-full grad rounded-full transition-all duration-300 ease-out" style={{ width: `${progress}%` }} />
        </div>
      )}

      {/* Action bar */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <button onClick={handleClear} disabled={loading} className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-4 py-2.5 rounded-xl hover:bg-secondary border border-transparent hover:border-border">
          <RefreshCw className="h-4 w-4" /> Clear
        </button>
        <button
          onClick={generateContent}
          disabled={!title.trim() || loading}
          className="btn-shimmer flex items-center gap-2 grad text-white text-sm font-semibold px-8 py-2.5 rounded-xl disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-90 transition-all shadow-md"
        >
          {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Generating...</> : <><Wand2 className="h-4 w-4" /> Generate Content</>}
        </button>
      </div>

    </div>
  );
}
