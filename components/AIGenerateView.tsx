'use client';

import { motion } from 'framer-motion';
import { FileSearch } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AIGeneratePanel from '@/components/AIGeneratePanel';
import AnalysisPanel from '@/components/AnalysisPanel';
import OutlinePanel from '@/components/OutlinePanel';
import InfoGainPanel from '@/components/InfoGainPanel';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import { htmlToMarkdown } from '@/lib/utils';

interface AIGenerateViewProps {
  content: string;
  generatedContent: string;
  showAIGenerateAnalysis: boolean;
  onContentGenerated: (content: string) => void;
  onAnalyze: () => void;
  onDownloadAsWord: () => void;
}

export default function AIGenerateView({
  content,
  generatedContent,
  showAIGenerateAnalysis,
  onContentGenerated,
  onAnalyze,
  onDownloadAsWord,
}: AIGenerateViewProps) {
  return (
    <div className="grid grid-cols-2 gap-10 h-full">
      {/* Left Column - Input Panel */}
      <motion.div
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white rounded-2xl border border-gray-100 shadow-lg h-full overflow-hidden flex flex-col"
      >
        <div className="p-4 border-b border-gray-100 flex-shrink-0">
          <h2 className="text-xl font-semibold">Generate New Content</h2>
        </div>
        <div className="flex-1 overflow-auto p-6">
          <AIGeneratePanel onContentGenerated={onContentGenerated} />
        </div>
      </motion.div>

      {/* Right Column - Output and Analysis */}
      <motion.div
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-white rounded-2xl border border-gray-100 shadow-lg h-full flex flex-col"
      >
        <div className="p-4 border-b border-gray-100 flex justify-between items-center flex-shrink-0">
          <h2 className="text-xl font-semibold">Generated Content</h2>
          <div className="flex gap-2">
            <button
              onClick={onAnalyze}
              className="gap-2 px-4 py-2 rounded-lg flex items-center bg-blue-600 text-white hover:bg-blue-700"
            >
              <FileSearch className="h-5 w-5" />
              Analyze
            </button>
            <button
              onClick={onDownloadAsWord}
              className="gap-2 px-4 py-2 rounded-lg flex items-center bg-green-600 text-white hover:bg-green-700"
            >
              📄 Download as Word
            </button>
          </div>
        </div>
        <div className="flex-1 p-6 overflow-auto" style={{ position: 'relative', overflowY: 'auto', scrollbarColor: '#bab9b9 #f0f0f0' }}>
          <div className="prose max-w-none" style={{ position: 'absolute', paddingRight: '10px' }}>
            <MarkdownRenderer content={htmlToMarkdown(generatedContent)} />
          </div>
        </div>
        {showAIGenerateAnalysis && (
          <div className="border-t border-gray-100 flex-1 overflow-hidden">
            <Tabs defaultValue="analysis" className="h-full flex flex-col">
              <TabsList className="grid w-full grid-cols-3 bg-white p-4 border-b border-gray-100">
                <TabsTrigger value="analysis">Analysis 📊</TabsTrigger>
                <TabsTrigger value="outline">Outline 📝</TabsTrigger>
                <TabsTrigger value="infogain">Info Gain 🧠</TabsTrigger>
              </TabsList>
              <div className="flex-1 overflow-auto">
                <TabsContent value="analysis" className="p-4">
                  <AnalysisPanel content={content} triggerAnalysis={showAIGenerateAnalysis} dataFromChild={content} />
                </TabsContent>
                <TabsContent value="outline" className="p-4">
                  <OutlinePanel content={content} triggerOutline={showAIGenerateAnalysis} dataFromChild={content} />
                </TabsContent>
                <TabsContent value="infogain" className="p-4">
                  <InfoGainPanel content={content} triggerInfoGain={showAIGenerateAnalysis} dataFromChild={content} />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        )}
      </motion.div>
    </div>
  );
}
