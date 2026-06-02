import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Loader2, Wand2, FileText, FileDown, RefreshCw, FileSearch, BarChart2, Edit, Copy, Check, Download } from 'lucide-react';
import { toast } from 'sonner';
import { saveAs } from 'file-saver';
import { saveContent, updateContent } from '@/lib/content/appwrite';
import { useRouter } from 'next/navigation';
import { getUser } from '@/lib/user/appwrite';
import { jsPDF } from 'jspdf';
import { useCompanyId } from '@/hooks/useCompany';
import { getDownloadableContent } from './MarkdownRenderer';
import { marked } from 'marked';
import { Document as DocxDocument, Packer as DocxPacker, Paragraph as DocxParagraph, TextRun as DocxTextRun } from 'docx';
import 'react-quill-new/dist/quill.snow.css';

const NATIVE_NAMES: Record<string, string> = {
  English:    'English',
  Hindi:      'Hindi (हिंदी)',
  Gujarati:   'Gujarati (ગુજરાતી)',
  Spanish:    'Spanish (Español)',
  French:     'French (Français)',
  German:     'German (Deutsch)',
  Portuguese: 'Portuguese (Português)',
  Japanese:   'Japanese (日本語)',
  Korean:     'Korean (한국어)',
  Chinese:    'Chinese (中文)',
  Arabic:     'Arabic (العربية)',
  Russian:    'Russian (Русский)',
  Italian:    'Italian (Italiano)',
  Turkish:    'Turkish (Türkçe)',
  Bengali:    'Bengali (বাংলা)',
  Tamil:      'Tamil (தமிழ்)',
  Telugu:     'Telugu (తెలుగు)',
  Marathi:    'Marathi (मराठी)',
  Punjabi:    'Punjabi (ਪੰਜਾਬੀ)',
  Urdu:       'Urdu (اردو)',
};

interface AIGeneratePanelProps {
  onContentGenerated: (content: string) => void;
  onSmartEditor?: () => void;
  onAnalyze?: () => void;
  onAIScore?: () => void;
  initialContent?: string;
  showPasteOption?: boolean;
  setShowPasteOption?: (show: boolean) => void;
}

const tones = [
  'Analytical', 'Authoritative', 'Casual', 'Conversational', 'Educational',
  'Empathetic', 'Engaging', 'Formal', 'Friendly', 'Humorous',
  'Informal', 'Inspirational', 'Motivational', 'Neutral', 'Persuasive',
  'Professional', 'Storytelling', 'Witty',
];

const lengths = [
  { label: '~500 words',  value: 500  },
  { label: '~1000 words', value: 1000 },
  { label: '~2000 words', value: 2000 },
  { label: '~3000 words', value: 3000 },
];


const templates = [
  { label: '📝 Blog Post',    title: 'How to get started with ',  keywords: 'beginner, guide, tips, step-by-step', targetWords: 1000 },
  { label: '🛍️ Product Desc', title: 'Why you should use ',        keywords: 'features, benefits, value, solution',  targetWords: 500  },
  { label: '📧 Email',        title: 'Email: ',                    keywords: 'professional, clear, action, concise', targetWords: 500  },
  { label: '📣 Ad Copy',      title: 'Introducing ',               keywords: 'compelling, offer, urgency, conversion',targetWords: 500  },
  { label: '📱 Social Media', title: 'Top 5 tips about ',          keywords: 'engaging, short, trending, viral',     targetWords: 500  },
];

export default function AIGeneratePanel({ onContentGenerated, onSmartEditor, onAnalyze, onAIScore, initialContent, showPasteOption: externalShowPasteOption, setShowPasteOption: externalSetShowPasteOption }: AIGeneratePanelProps) {
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
  const [copied, setCopied]           = useState(false);
  const [showDownload, setShowDownload] = useState(false);
  const downloadRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [internalShowPasteOption, setInternalShowPasteOption] = useState(false);
  const [pastedContent, setPastedContent] = useState('');

  const showPasteOption = externalShowPasteOption !== undefined ? externalShowPasteOption : internalShowPasteOption;
  const setShowPasteOption = externalSetShowPasteOption || setInternalShowPasteOption;

  const handleCopy = () => {
    if (!generatedContent) return;
    const plain = generatedContent.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    navigator.clipboard.writeText(plain);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  const { companyId }: any = useCompanyId();

  const renderedHtml = useMemo(() => {
    if (!generatedContent) return '';
    if (generatedContent.trimStart().startsWith('<')) return generatedContent;
    return marked(generatedContent) as string;
  }, [generatedContent]);

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
    setPastedContent(''); setShowPasteOption(false);
  };

  const handlePastedContentAnalyze = () => {
    if (!pastedContent.trim()) {
      toast.error('Please paste some content first');
      return;
    }
    const htmlContent = marked(pastedContent) as string;
    setGeneratedContent(htmlContent);
    onContentGenerated(htmlContent);
    const wc = pastedContent.trim().split(/\s+/).filter(Boolean).length;
    setGeneratedWordCount(wc);
    
    // Trigger analyze mode after content is set
    setTimeout(() => {
      if (onAnalyze) {
        onAnalyze();
      }
      toast.success(`Analyzing ${wc.toLocaleString()} words...`);
    }, 300);
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
      requestData.language = language;

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

  const selectCls = 'w-full bg-background border border-border rounded-xl px-3 py-2 text-sm text-foreground outline-none focus:outline-none focus-visible:outline-none focus:border-primary/60 transition-all cursor-pointer appearance-none';
  const inputCls  = 'w-full bg-background border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:outline-none focus-visible:outline-none focus:border-primary/60 transition-all';

  if (generatedContent) {
    return (
      <div className="w-full px-6 py-6 space-y-5">
        {/* Result header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl grad flex items-center justify-center shadow-sm shrink-0" aria-hidden="true">
              <Wand2 className="h-4 w-4 text-white" />
            </div>
            <div>
              <h2 className="text-xs font-semibold text-foreground">Generated Content</h2>
              {generatedWordCount > 0 && (
                <p className="text-xs text-muted-foreground">{generatedWordCount.toLocaleString()} words</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {onSmartEditor && (
              <button onClick={onSmartEditor} className="flex items-center gap-1.5 text-xs font-medium px-3.5 py-2 rounded-xl bg-secondary border border-border text-foreground hover:bg-accent transition-colors">
                <Edit className="h-3.5 w-3.5" aria-hidden="true" /> Smart Editor
              </button>
            )}
            {onAnalyze && (
              <button onClick={onAnalyze} className="flex items-center gap-1.5 text-xs font-medium px-3.5 py-2 rounded-xl bg-secondary border border-border text-foreground hover:bg-accent transition-colors">
                <FileSearch className="h-3.5 w-3.5" aria-hidden="true" /> Deep Analysis
              </button>
            )}
            {onAIScore && (
              <button onClick={onAIScore} className="flex items-center gap-1.5 text-xs font-medium px-3.5 py-2 rounded-xl bg-secondary border border-border text-foreground hover:bg-accent transition-colors">
                <BarChart2 className="h-3.5 w-3.5" aria-hidden="true" /> Realness Score
              </button>
            )}
            
            {/* Clear All button */}
            <button
              onClick={() => {
                setGeneratedContent('');
                setGeneratedWordCount(0);
                onContentGenerated('');
                handleClear();
                toast.success('Content cleared');
              }}
              aria-label="Clear all content"
              title="Clear all"
              className="flex items-center justify-center w-8 h-8 rounded-xl bg-secondary border border-border text-muted-foreground hover:text-destructive hover:border-destructive/30 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
            </button>

            <button
              onClick={handleCopy}
              aria-label="Copy content"
              title="Copy"
              className="flex items-center justify-center w-8 h-8 rounded-xl bg-secondary border border-border text-muted-foreground hover:text-foreground transition-colors"
            >
              {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
            </button>

            {/* Download dropdown */}
            <div className="relative" ref={downloadRef} onMouseEnter={() => setShowDownload(true)} onMouseLeave={() => setShowDownload(false)}>
              <button
                aria-label="Download options"
                title="Download"
                className="flex items-center justify-center w-8 h-8 rounded-xl bg-secondary border border-border text-muted-foreground hover:text-foreground transition-colors"
              >
                <Download className="h-4 w-4" />
              </button>
              {showDownload && (
                <div className="absolute right-0 top-full mt-1 z-50 bg-popover border border-border rounded-xl shadow-lg overflow-hidden min-w-[160px]">
                  <button
                    onClick={() => { downloadAsPDF(); setShowDownload(false); }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-foreground hover:bg-secondary transition-colors"
                  >
                    <FileDown className="h-3.5 w-3.5 text-muted-foreground" /> Download as PDF
                  </button>
                  <button
                    onClick={() => { downloadAsWord(); setShowDownload(false); }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-foreground hover:bg-secondary transition-colors"
                  >
                    <FileText className="h-3.5 w-3.5 text-muted-foreground" /> Download as Word
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content rendered with Quill styles to match Smart Editor */}
        <style>{`
          .ai-content h1{font-size:0.95rem;font-weight:700;margin:0 0 6px}
          .ai-content h2{font-size:0.85rem;font-weight:600;margin:10px 0 4px}
          .ai-content h3{font-size:0.8rem;font-weight:600;margin:7px 0 3px}
          .ai-content p{font-size:0.8rem;margin:0 0 6px;line-height:1.55}
          .ai-content ul,.ai-content ol{margin:3px 0 6px;padding-left:1.2rem}
          .ai-content li{font-size:0.8rem;margin-bottom:2px;line-height:1.45}
          .ai-content strong{font-weight:600}
        `}</style>
        <div
          className="ai-content text-sm text-foreground"
          dangerouslySetInnerHTML={{ __html: renderedHtml }}
        />
      </div>
    );
  }

  return (
    <div className="w-full px-6 py-4 space-y-4">

      {/* Page header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl grad flex items-center justify-center shadow-sm">
            <Wand2 className="h-3.5 w-3.5 text-white" />
          </div>
          <h1 className="text-xs font-semibold text-foreground">
            {showPasteOption ? 'Analyze Existing Content' : 'Generate AI Content'}
          </h1>
        </div>
      </div>

      {/* Paste existing content option */}
      {showPasteOption ? (
        <div className="space-y-3">
          <div>
            <label htmlFor="paste-content" className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground block mb-1">
              Paste Your Existing Content <span className="text-destructive normal-case tracking-normal">*</span>
            </label>
            <textarea
              id="paste-content"
              placeholder="Paste your article, blog post, or any content here to analyze..."
              value={pastedContent}
              onChange={e => setPastedContent(e.target.value)}
              className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:outline-none focus-visible:outline-none focus:border-primary/60 transition-all min-h-[200px] resize-y"
              required
            />
            <p className="text-xs text-muted-foreground mt-1">
              {pastedContent.trim().split(/\s+/).filter(Boolean).length} words
            </p>
          </div>
          <div className="flex items-center justify-between pt-2">
            <button 
              onClick={() => { setPastedContent(''); setShowPasteOption(false); }} 
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-4 py-2.5 rounded-xl hover:bg-secondary border border-transparent hover:border-border"
            >
              <RefreshCw className="h-4 w-4" /> Clear
            </button>
            <button
              onClick={handlePastedContentAnalyze}
              disabled={!pastedContent.trim()}
              className="btn-shimmer flex items-center gap-1.5 grad text-white text-xs font-semibold px-4 py-1.5 rounded-xl disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-90 transition-all shadow-md"
            >
              <FileSearch className="h-3.5 w-3.5" /> Ready to Analyze
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Quick templates */}
          <div className="flex flex-wrap gap-2">
            {templates.map(t => (
              <button
                key={t.label}
                onClick={() => { setTitle(t.title); setKeywords(t.keywords); setTargetWords(t.targetWords); }}
                className="text-xs px-3 py-1.5 rounded-full border border-border bg-white text-muted-foreground hover:text-foreground hover:border-primary/30 hover:bg-secondary transition-all font-medium shadow-sm"
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Form fields */}
          <div className="space-y-3">
        <div>
          <label htmlFor="ai-title" className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground block mb-1">
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

        <div>
          <label htmlFor="ai-keywords" className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground block mb-1">
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

        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Tone', id: 'ai-tone', el: <select id="ai-tone" value={tone} onChange={e => setTone(e.target.value)} className={selectCls}>{tones.map(t => <option key={t}>{t}</option>)}</select> },
            { label: 'Length', id: 'ai-length', el: <select id="ai-length" value={targetWords} onChange={e => setTargetWords(Number(e.target.value))} className={selectCls}>{lengths.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}</select> },
            { label: 'Language', id: 'ai-language', el: <select id="ai-language" value={language} onChange={e => setLanguage(e.target.value)} className={selectCls}>{Object.keys(NATIVE_NAMES).map(l => <option key={l} value={l}>{NATIVE_NAMES[l]}</option>)}</select> },
          ].map(({ label, id, el }) => (
            <div key={label}>
              <label htmlFor={id} className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground block mb-1">{label}</label>
              <div className="relative">{el}
                <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>
          ))}
        </div>

        {generateError && (
          <div role="alert" className="flex items-center gap-2 text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded-xl px-3 py-2">
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
              className="btn-shimmer flex items-center gap-1.5 grad text-white text-xs font-semibold px-4 py-1.5 rounded-xl disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-90 transition-all shadow-md"
            >
              {loading ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Generating...</> : <><Wand2 className="h-3.5 w-3.5" /> Generate Content</>}
            </button>
          </div>
        </>
      )}

    </div>
  );
}
