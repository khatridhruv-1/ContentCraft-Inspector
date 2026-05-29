'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import { Wand2, Trash2, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

interface ContentEditorProps {
  initialContent: string;
  onContentChange: (content: string) => void;
  mode: 'ai-generate' | 'create' | 'analyze' | 'ai-score';
  onCreate: () => void;
  onAnalyze: () => void;
  onAIScore: () => void;
  sendDataToParent: (data: string) => void;
  onAutoSave?: (content: string) => Promise<void>;
  autoSaveStatus?: 'idle' | 'saving' | 'saved';
}

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ align: [] }],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ indent: '-1' }, { indent: '+1' }],
    ['link', 'image'],
    ['clean'],
  ],
};

const formats = [
  'header', 'bold', 'italic', 'underline', 'strike',
  'align', 'list', 'indent', 'link', 'image',
];

export function ContentEditor({
  initialContent,
  onContentChange,
  mode,
  onCreate,
  onAnalyze,
  onAIScore,
  sendDataToParent,
  onAutoSave,
  autoSaveStatus,
}: ContentEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [isMounted, setIsMounted] = useState(false);
  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => { setIsMounted(true); }, []);
  useEffect(() => { setContent(initialContent); }, [initialContent]);

  const plainText = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  const charCount = plainText.length;
  const wordCount = plainText.split(/\s+/).filter(Boolean).length;
  const hasContent = plainText.length > 0;

  const handleChange = (value: string) => {
    setContent(value);
    onContentChange(value);
    sendDataToParent(value);
    if (onAutoSave) {
      if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
      autoSaveTimer.current = setTimeout(() => { onAutoSave(value); }, 3000);
    }
  };

  if (!isMounted) return null;

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 relative overflow-hidden">
        <style>{`
          .quill { height: 100%; display: flex; flex-direction: column; }
          .ql-toolbar { background: hsl(var(--secondary)); border-bottom: 1px solid hsl(var(--border)); border-top: none; border-left: none; border-right: none; }
          .ql-toolbar .ql-stroke { stroke: hsl(var(--muted-foreground)); }
          .ql-toolbar .ql-fill { fill: hsl(var(--muted-foreground)); }
          .ql-toolbar .ql-picker { color: hsl(var(--muted-foreground)); }
          .ql-toolbar button:hover .ql-stroke, .ql-toolbar button.ql-active .ql-stroke { stroke: hsl(var(--primary)); }
          .ql-toolbar button:hover .ql-fill, .ql-toolbar button.ql-active .ql-fill { fill: hsl(var(--primary)); }
          .ql-container.ql-snow { border: none; }
          .ql-editor { min-height: 300px; line-height: 1.7; padding: 1.25rem; color: hsl(var(--foreground)); background: hsl(var(--background)); font-size: 14px; font-family: 'Inter', -apple-system, sans-serif; }
          .ql-editor.ql-blank::before { color: hsl(var(--muted-foreground)); font-style: normal; }
          .ql-editor p, .ql-editor li { color: hsl(var(--foreground)); }
        `}</style>
        <ReactQuill
          theme="snow"
          value={content}
          onChange={handleChange}
          modules={modules}
          formats={formats}
          placeholder="Start writing your content..."
          style={{ height: '100%' }}
        />
      </div>

      <div className="flex justify-between items-center px-5 py-3 border-t border-border bg-background shrink-0">
        <div className="flex items-center gap-5">
          <div className="flex gap-5 text-xs text-muted-foreground">
            <span><span className="font-semibold text-foreground">{charCount}</span> chars</span>
            <span><span className="font-semibold text-foreground">{wordCount}</span> words</span>
            {wordCount > 0 && (
              <span><span className="font-semibold text-foreground">~{Math.ceil(wordCount / 200)}</span> min read</span>
            )}
            {autoSaveStatus === 'saving' && <span className="text-xs text-muted-foreground/60">Saving...</span>}
            {autoSaveStatus === 'saved' && <span className="text-xs text-emerald-400">Saved ✓</span>}
          </div>
          {hasContent && (
            <button
              onClick={() => { handleChange(''); toast.success('Content cleared'); }}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors"
              title="Clear content"
            >
              <Trash2 className="w-3 h-3" />
              Clear
            </button>
          )}
          {hasContent && wordCount < 50 && (
            <span className="flex items-center gap-1 text-xs text-amber-400">
              <AlertTriangle className="w-3 h-3" />
              {wordCount}/50 min words
            </span>
          )}
        </div>

        {mode === 'analyze' && (
          <button
            onClick={() => {
              if (wordCount < 50) { toast.warning('Add at least 50 words for a meaningful analysis.'); return; }
              onAnalyze();
            }}
            disabled={!hasContent}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
          >
            <Wand2 className="h-4 w-4" />
            Analyze
          </button>
        )}
        {mode === 'create' && (
          <button
            onClick={() => {
              if (wordCount < 50) { toast.warning('Add at least 50 words for a meaningful verification.'); return; }
              onCreate();
            }}
            disabled={!hasContent}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
          >
            <Wand2 className="h-4 w-4" />
            Verify
          </button>
        )}
        {mode === 'ai-score' && (
          <button
            onClick={() => {
              if (wordCount < 50) { toast.warning('Add at least 50 words to get an accurate score.'); return; }
              onAIScore();
            }}
            disabled={!hasContent}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
          >
            <Wand2 className="h-4 w-4" />
            Check Score
          </button>
        )}
      </div>
    </div>
  );
}

export default ContentEditor;
