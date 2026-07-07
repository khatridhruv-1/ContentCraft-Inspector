'use client';

import { useEffect, useRef, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { FileSearch } from 'lucide-react';
import MarketingPrimaryButton from '@/components/marketing/MarketingPrimaryButton';
import { useIsMobile } from '@/hooks/use-mobile';

interface ContentEditorProps {
  initialContent: string;
  onContentChange: (content: string) => void;
  mode: 'ai-generate' | 'analyze';
  onCreate: () => void;
  onAnalyze: () => void;
  sendDataToParent: (data: string) => void;
}

export function ContentEditor({
  initialContent,
  onContentChange,
  mode,
  onAnalyze,
  sendDataToParent,
}: ContentEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [charCount, setCharCount] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const editorRef = useRef<unknown>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setContent(initialContent);
    if (initialContent.trim()) {
      sendDataToParent(initialContent);
    }
  }, [initialContent, sendDataToParent]);

  const handleEditorChange = (newContent: string) => {
    setContent(newContent);
    onContentChange(newContent);
    const plainText = newContent.replace(/<[^>]*>/g, '').trim();
    setCharCount(plainText.length);
    setWordCount(plainText.split(/\s+/).filter(Boolean).length);
    sendDataToParent(newContent);
  };

  const hasContent = content.trim().length > 0;

  if (!isMounted) {
    return null;
  }

  return (
    <div className="flex h-full min-h-[240px] flex-col gap-3 sm:min-h-[360px] sm:gap-4">
      <div className="relative min-h-[220px] flex-1 overflow-hidden rounded-xl border border-slate-200 bg-white sm:min-h-[300px]">
        <Editor
          key={isMobile ? 'mobile' : 'desktop'}
          tinymceScriptSrc="/tinymce/tinymce.min.js"
          licenseKey="gpl"
          onInit={(_evt, editor) => {
            editorRef.current = editor;
            const current = editor.getContent();
            if (current.trim()) {
              sendDataToParent(current);
            }
          }}
          value={content}
          onEditorChange={handleEditorChange}
          init={{
            height: '100%',
            menubar: !isMobile,
            branding: false,
            statusbar: false,
            skin_url: '/tinymce/skins/ui/oxide',
            content_css: '/tinymce/skins/content/default/content.min.css',
            plugins: isMobile
              ? ['lists', 'link', 'autolink', 'wordcount']
              : [
                  'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
                  'preview', 'anchor', 'searchreplace', 'visualblocks', 'code',
                  'fullscreen', 'insertdatetime', 'media', 'table', 'wordcount',
                ],
            toolbar: isMobile
              ? 'undo redo | bold italic | bullist numlist | link | removeformat'
              : [
                  { name: 'history', items: ['undo', 'redo'] },
                  { name: 'styles', items: ['styleselect'] },
                  { name: 'formatting', items: ['bold', 'italic', 'underline', 'strikethrough'] },
                  { name: 'alignment', items: ['alignleft', 'aligncenter', 'alignright', 'alignjustify'] },
                  { name: 'lists', items: ['numlist', 'bullist'] },
                  { name: 'indentation', items: ['outdent', 'indent'] },
                  { name: 'insert', items: ['link', 'image', 'table'] },
                  { name: 'view', items: ['preview', 'fullscreen'] },
                ],
            toolbar_mode: isMobile ? 'scrolling' : 'wrap',
            content_style: `
              body {
                font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif;
                font-size: ${isMobile ? '15px' : '16px'};
                line-height: 1.6;
                padding: 0.75rem;
                background-color: #ffffff !important;
                color: #0f172a !important;
                min-height: ${isMobile ? '220px' : '320px'};
              }
              p { margin: 0; min-height: 1.5em; }
            `,
            placeholder: 'Paste or write your content here…',
            forced_root_block: 'p',
            remove_trailing_brs: true,
          }}
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-6 text-sm text-slate-500">
          <span>Characters: {charCount}</span>
          <span>Words: {wordCount}</span>
        </div>
        {mode === 'analyze' ? (
          <MarketingPrimaryButton
            type="button"
            size="sm"
            fullWidth={false}
            disabled={!hasContent}
            onClick={onAnalyze}
            className="!w-full sm:!w-auto sm:min-w-[140px]"
          >
            <FileSearch className="h-4 w-4" aria-hidden />
            Run analysis
          </MarketingPrimaryButton>
        ) : null}
      </div>
    </div>
  );
}

export default ContentEditor;
