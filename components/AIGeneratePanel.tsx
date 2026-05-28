import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Wand2 } from 'lucide-react';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';
import StructuredView from './StructuredContent';
import { saveContent, updateContent } from '@/lib/content/appwrite';
import router from 'next/router';
import { getUser } from '@/lib/user/appwrite';
import { jsPDF } from 'jspdf';
import { useCompanyId } from '@/hooks/useCompany';

interface AIGeneratePanelProps {
  onContentGenerated: (content: string) => void;
}

export default function AIGeneratePanel({ onContentGenerated }: AIGeneratePanelProps) {
  const [title, setTitle] = useState('');
  const [keywords, setKeywords] = useState('');
  const [tone, setTone] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { companyId }: any = useCompanyId();
  const tones = [
    'Formal',
    'Informal',
    'Professional',
    'Friendly',
    'Persuasive',
    'Authoritative',
    'Conversational',
    'Inspirational',
    'Humorous',
    'Empathetic',
    'Educational',
    'Engaging',
    'Critical',
    'Optimistic',
    'Neutral',
    'Witty',
    'Storytelling',
    'Casual',
    'Motivational',
    'Analytical',
  ];

  const generateContent = async () => {
    if (!title.trim()) return;

    setErrorMessage('');
    setLoading(true);
    try {
      const requestData: Record<string, any> = { title };

      if (keywords.trim()) {
        requestData.keywords = keywords; // Add keywords if provided
      }
      if (tone) {
        requestData.tone = tone; // Add tone if selected
      }

      const response = await fetch('/api/ai-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        const retryAfter = payload?.retryAfterSeconds;
        const apiError = payload?.error || 'Failed to generate content.';

        if (response.status === 429) {
          throw new Error(
            retryAfter
              ? `${apiError} Retry after ${retryAfter}s.`
              : `${apiError} Please try again in a minute.`
          );
        }

        throw new Error(apiError);
      }

      const data = await response.json();
      const safeContent = typeof data?.content === 'string' ? data.content : '';
      if (!safeContent.trim()) {
        throw new Error('AI response was empty. Please try again.');
      }

      setGeneratedContent(safeContent);
      onContentGenerated(safeContent);

      const documentId = localStorage.getItem('documentId');
      if (documentId) {
        await updateContent(documentId, {
          input: title,
          analysis: safeContent,
          companyId: companyId
        });
      } else {
        const sessionToken = localStorage.getItem('sessionToken');
        if (!sessionToken) {
          router.push('/auth/login');
          throw new Error('No session found');
        }
        const user = await getUser(sessionToken);


        if (companyId) {
          const res = await saveContent(title, user.$id, safeContent, 'ai-generate', companyId);
          console.log('res from Ai', res);
          localStorage.setItem('documentId', res.$id);
        }

      }
    } catch (error) {
      console.error('Error generating content:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Failed to generate content.');
    } finally {
      setLoading(false);
    }
  };

  const downloadAsWord = () => {
    if (!generatedContent) return;

    const doc = new Document({
      sections: [
        {
          children: generatedContent
            .split('\n') // Split by new lines
            .map((line) =>
              new Paragraph({
                children: [new TextRun(line)], // Ensure proper paragraph structure
              })
            ),
        },
      ],
    });

    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, `${title || 'GeneratedContent'}.docx`);
    });
  };

  const downloadAsPDF = () => {
    if (!generatedContent) return;

    const doc = new jsPDF();
    const lines = doc.splitTextToSize(generatedContent, 180); // Wrap text for better formatting

    doc.text(lines, 10, 10);
    doc.save(`${title || 'GeneratedContent'}.pdf`);
  };

  const handleToneSelection = (toneOption: string) => {
    setTone(toneOption);
    setDropdownOpen(false); // Close the dropdown
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b border-gray-200 bg-white">
        <h2 className="text-2xl font-semibold mb-4">Generate AI-Powered Content</h2>

        <div className="flex flex-col gap-4">
          {/* Title Input */}
          <Input
            placeholder="Enter title or topic..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-1"
          />

          {/* Keywords Input */}
          <Input
            placeholder="Enter keywords (optional)..."
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            className="flex-1"
          />

          {/* Custom Tone Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-full p-2 border rounded-lg bg-gray-50 text-left"
            >
              {tone || 'Select Tone (optional)'}
            </button>

            {dropdownOpen && (
              <div
                className="absolute z-10 mt-2 bg-white border rounded-lg shadow-lg max-h-48 overflow-y-auto w-full"
                style={{
                  maxHeight: '200px', // Limit dropdown height
                }}
              >
                {tones.map((toneOption, index) => (
                  <div
                    key={index}
                    onClick={() => handleToneSelection(toneOption)}
                    className={`p-2 cursor-pointer hover:bg-blue-100 ${
                      tone === toneOption ? 'bg-blue-50 font-semibold' : ''
                    }`}
                  >
                    {toneOption}
                  </div>
                ))}
              </div>
            )}
          </div>

          <Button
            onClick={generateContent}
            disabled={!title.trim() || loading}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Wand2 className="mr-2 h-4 w-4" />
                Generate
              </>
            )}
          </Button>

          {errorMessage ? (
            <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
              {errorMessage}
            </p>
          ) : null}
        </div>
      </div>

      {/* <div className="flex-1 min-h-0 relative">
        {generatedContent ? (
          <>
            <StructuredView
              content={generatedContent}
              onAnalyze={() => console.log('Analyze Content')}
              onAIScore={() => console.log('Check AI Score')}
            />
            <div className="p-4 border-t border-gray-200 bg-white text-center">
              <Button
                onClick={downloadAsWord}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Download as Word
              </Button>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">No content generated yet. Start by entering a title.</p>
          </div>
        )}
      </div> */}
    </div>
  );
}
