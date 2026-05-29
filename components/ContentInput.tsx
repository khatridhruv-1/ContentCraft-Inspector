import { useState, useEffect, useCallback } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Zap, Upload, FileText, FileSearch, Wand2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';

interface ContentInputProps {
  content: string;
  setContent: (content: string) => void;
  onAnalyze: () => void;
  buttonText?: string;
  mode: 'create' | 'analyze' | 'ai-score';
}

const ContentInput: React.FC<ContentInputProps> = ({
  content,
  setContent,
  onAnalyze,
  mode,
  buttonText = "Analyze"
}) => {
  const [charCount, setCharCount] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    setCharCount(content.length);
    setWordCount(content.trim().split(/\s+/).filter(Boolean).length);
  }, [content]);

  const handleFileUpload = useCallback(async (file: File) => {
    try {
      const text = await file.text();
      setContent(text);
    } catch (error) {
      console.error('Error reading file:', error);
      // You might want to add error handling UI here
    }
  }, [setContent]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const hasContent = content.trim().length > 0;

  return (
    <div className="h-full flex flex-col gap-4 p-5 sm:p-6">
      <div className="flex gap-2 items-center flex-wrap">
        <Input
          type="file"
          onChange={handleFileChange}
          accept=".txt,.doc,.docx,.pdf,.md"
          className="hidden"
          id="file-upload"
          aria-label="Upload a file"
        />
        <Button
          variant="outline"
          onClick={() => document.getElementById('file-upload')?.click()}
          className="gap-2 text-sm"
          aria-label="Upload a .txt, .doc, .docx, .pdf, or .md file"
        >
          <Upload className="h-4 w-4" aria-hidden="true" />
          Upload File
        </Button>
        <p className="text-xs text-muted-foreground">
          .txt, .doc, .docx, .pdf, .md
        </p>
      </div>

      <div
        className={`flex-1 relative min-h-0 rounded-xl transition-all ${isDragging ? 'ring-2 ring-primary ring-offset-2' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        aria-label="Content input area — drag and drop a file here"
      >
        <div className="relative h-full flex flex-col">
          <label htmlFor="content-textarea" className="sr-only">Paste your content here to analyze</label>
          <Textarea
            id="content-textarea"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Paste your content here to analyze, or drag & drop a file..."
            className="h-full resize-none text-sm p-5 rounded-xl overflow-auto"
          />
          {hasContent && (
            <Button
              onClick={onAnalyze}
              className="absolute right-3 top-3 gap-2 text-xs grad hover:opacity-90 transition-opacity border-0 text-white"
              size="sm"
            >
              <FileSearch className="h-3.5 w-3.5" aria-hidden="true" />
              Analyze
            </Button>
          )}
        </div>
        {isDragging && (
          <div className="absolute inset-0 bg-background/90 flex items-center justify-center rounded-xl border-2 border-dashed border-primary">
            <div className="text-center">
              <FileText className="h-10 w-10 mx-auto mb-2 text-primary" aria-hidden="true" />
              <p className="text-sm font-medium text-foreground">Drop your file here</p>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center">
        <div className="flex gap-4 text-xs text-muted-foreground">
          <span><span className="font-semibold text-foreground">{charCount}</span> chars</span>
          <span><span className="font-semibold text-foreground">{wordCount}</span> words</span>
        </div>
        {mode === 'analyze' && (
          <Button
            onClick={onAnalyze}
            disabled={!hasContent}
            className="gap-2 px-5 py-2.5 text-sm rounded-xl grad hover:opacity-90 transition-opacity border-0 text-white disabled:opacity-40"
          >
            <Wand2 className="h-4 w-4" aria-hidden="true" />
            Analyze
          </Button>
        )}
      </div>
    </div>
  );
};

export default ContentInput;