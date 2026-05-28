import React, { useState } from 'react';
import { Loader2, Wand2, FileText, FileDown } from 'lucide-react';
import { toast } from 'sonner';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';
import { saveContent, updateContent } from '@/lib/content/appwrite';
import { useRouter } from 'next/navigation';
import { getUser } from '@/lib/user/appwrite';
import { jsPDF } from 'jspdf';
import { useCompanyId } from '@/hooks/useCompany';

interface AIGeneratePanelProps {
  onContentGenerated: (content: string) => void;
}

export default function AIGeneratePanel({ onContentGenerated }: AIGeneratePanelProps) {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [keywords, setKeywords] = useState('');
  const [tone, setTone] = useState('');
  const [targetWords, setTargetWords] = useState(1000);
  const [loading, setLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');
  const [generateError, setGenerateError] = useState('');
  const [generatedWordCount, setGeneratedWordCount] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { companyId }: any = useCompanyId();

  const tones = [
    'Formal', 'Informal', 'Professional', 'Friendly', 'Persuasive',
    'Authoritative', 'Conversational', 'Inspirational', 'Humorous',
    'Empathetic', 'Educational', 'Engaging', 'Critical', 'Optimistic',
    'Neutral', 'Witty', 'Storytelling', 'Casual', 'Motivational', 'Analytical',
  ];

  const generateContent = async () => {
    if (!title.trim()) return;

    setLoading(true);
    setGenerateError('');
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
        setGenerateError(msg);
        toast.error(msg);
        return;
      }

      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let fullContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        fullContent += chunk;
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
        if (!sessionToken) {
          router.push('/auth/login');
          return;
        }
        const user = await getUser(sessionToken);
        const res = await saveContent(title, user.$id, fullContent, 'ai-generate');
        if (res) localStorage.setItem('documentId', res.$id);
      }
    } catch (error) {
      console.error('Error generating content:', error);
      const msg = 'Failed to generate content. Please try again.';
      setGenerateError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const downloadAsWord = () => {
    if (!generatedContent) return;
    const doc = new Document({
      sections: [{
        children: generatedContent.split('\n').map(line =>
          new Paragraph({ children: [new TextRun(line)] })
        ),
      }],
    });
    Packer.toBlob(doc).then(blob => saveAs(blob, `${title || 'GeneratedContent'}.docx`));
    toast.success('Downloading as Word document...');
  };

  const downloadAsPDF = () => {
    if (!generatedContent) return;
    const doc = new jsPDF();
    const lines = doc.splitTextToSize(generatedContent, 180);
    doc.text(lines, 10, 10);
    doc.save(`${title || 'GeneratedContent'}.pdf`);
    toast.success('Downloading as PDF...');
  };

  const handleToneSelection = (toneOption: string) => {
    setTone(toneOption);
    setDropdownOpen(false);
  };

  const inputCls = (focused: boolean) =>
    `w-full bg-secondary border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder-muted-foreground outline-none transition-all duration-200 ${
      focused ? 'border-primary/60 ring-2 ring-primary/20' : 'border-border hover:border-border/80'
    }`;

  const [focusedField, setFocusedField] = React.useState<string | null>(null);

  return (
    <div className="h-full flex flex-col gap-5 p-1">

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shrink-0">
          <Wand2 className="h-4 w-4 text-white" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-foreground">Generate AI Content</h2>
          <p className="text-xs text-muted-foreground">Fill in the details below to generate a 1000+ word article</p>
        </div>
      </div>

      {/* Templates */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground">Quick templates</label>
        <div className="flex flex-wrap gap-1.5">
          {[
            { label: 'Blog Post',     title: 'How to get started with ',  keywords: 'beginner, guide, tips, step-by-step',           targetWords: 1000 },
            { label: 'Product Desc',  title: 'Why you should use ',        keywords: 'features, benefits, value, solution',            targetWords: 500  },
            { label: 'Email',         title: 'Email: ',                    keywords: 'professional, clear, action, concise',           targetWords: 500  },
            { label: 'Ad Copy',       title: 'Introducing ',               keywords: 'compelling, offer, urgency, conversion',         targetWords: 500  },
            { label: 'Social Media',  title: 'Top 5 tips about ',          keywords: 'engaging, short, trending, viral',               targetWords: 500  },
          ].map(t => (
            <button
              key={t.label}
              onClick={() => { setTitle(t.title); setKeywords(t.keywords); setTargetWords(t.targetWords); }}
              className="text-xs px-2.5 py-1 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-primary/5 transition-all"
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Fields */}
      <div className="flex flex-col gap-3">

        {/* Title */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">Title or Topic <span className="text-destructive">*</span></label>
          <input
            placeholder="e.g. The future of renewable energy..."
            value={title}
            onChange={e => setTitle(e.target.value)}
            onFocus={() => setFocusedField('title')}
            onBlur={() => setFocusedField(null)}
            className={inputCls(focusedField === 'title')}
          />
        </div>

        {/* Keywords */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">Keywords <span className="text-muted-foreground/50">(optional)</span></label>
          <input
            placeholder="e.g. solar, wind, sustainability..."
            value={keywords}
            onChange={e => setKeywords(e.target.value)}
            onFocus={() => setFocusedField('keywords')}
            onBlur={() => setFocusedField(null)}
            className={inputCls(focusedField === 'keywords')}
          />
        </div>

        {/* Tone dropdown */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">Tone <span className="text-muted-foreground/50">(optional)</span></label>
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className={`w-full bg-secondary border rounded-xl px-4 py-2.5 text-sm text-left transition-all duration-200 flex items-center justify-between ${
                dropdownOpen ? 'border-primary/60 ring-2 ring-primary/20' : 'border-border hover:border-border/80'
              } ${tone ? 'text-foreground' : 'text-muted-foreground'}`}
            >
              <span>{tone || 'Select tone...'}</span>
              <svg className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {dropdownOpen && (
              <div className="absolute z-20 mt-1.5 w-full bg-card border border-border rounded-xl shadow-xl overflow-hidden">
                <div className="max-h-48 overflow-y-auto py-1">
                  {tones.map((toneOption, index) => (
                    <button
                      key={index}
                      onClick={() => handleToneSelection(toneOption)}
                      className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                        tone === toneOption
                          ? 'bg-primary/10 text-primary font-medium'
                          : 'text-foreground hover:bg-muted'
                      }`}
                    >
                      {toneOption}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Target length */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">Target length</label>
          <div className="flex gap-1.5">
            {[500, 1000, 2000, 3000].map(words => (
              <button
                key={words}
                onClick={() => setTargetWords(words)}
                className={`text-xs px-3 py-1.5 rounded-xl border transition-colors ${
                  targetWords === words
                    ? 'bg-primary/15 text-primary border-primary/30'
                    : 'border-border text-muted-foreground hover:text-foreground'
                }`}
              >
                {words} words
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Generate button */}
      <button
        onClick={generateContent}
        disabled={!title.trim() || loading}
        className="w-full flex items-center justify-center gap-2 bg-primary hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity text-primary-foreground font-medium py-2.5 rounded-xl text-sm"
      >
        {loading ? (
          <><Loader2 className="h-4 w-4 animate-spin" />Generating...</>
        ) : (
          <><Wand2 className="h-4 w-4" />Generate Content</>
        )}
      </button>

      {!title.trim() && !generateError && (
        <p className="text-xs text-center text-muted-foreground/60">Enter a title to enable generation</p>
      )}

      {generateError && (
        <p className="text-xs text-center text-destructive">{generateError}</p>
      )}

      {generatedWordCount > 0 && !generateError && (
        <div className="space-y-2">
          <p className="text-xs text-center text-muted-foreground">
            Generated <span className="font-semibold text-foreground">{generatedWordCount.toLocaleString()}</span> words
          </p>
          <div className="flex gap-2">
            <button
              onClick={downloadAsWord}
              className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium py-2 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:border-border/80 transition-colors"
            >
              <FileText className="h-3.5 w-3.5" />
              Word
            </button>
            <button
              onClick={downloadAsPDF}
              className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium py-2 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:border-border/80 transition-colors"
            >
              <FileDown className="h-3.5 w-3.5" />
              PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
