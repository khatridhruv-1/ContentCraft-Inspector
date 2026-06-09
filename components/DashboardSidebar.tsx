'use client';

import { FileSearch, History, Wand2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type AppMode = 'ai-generate' | 'analyze';

interface DashboardSidebarProps {
  mode: AppMode;
  onModeChange: (mode: AppMode) => void;
  onHistory: () => void;
}

export default function DashboardSidebar({ mode, onModeChange, onHistory }: DashboardSidebarProps) {
  return (
    <div className="w-80 border-r border-gray-100 p-8 shrink-0 bg-gray-50 flex flex-col h-screen">
      <h2 className="text-2xl font-semibold mb-8 text-gray-900">Content Tools</h2>

      <div className="space-y-4 flex-grow">
        <button
          onClick={() => onModeChange('ai-generate')}
          className={cn(
            'w-full flex items-center gap-4 px-6 py-4 rounded-xl transition-colors text-lg',
            mode === 'ai-generate'
              ? 'bg-blue-600 text-white'
              : 'hover:bg-gray-100 text-gray-700'
          )}
        >
          <Wand2 className="h-7 w-7" />
          AI-Powered
        </button>

        <button
          onClick={() => onModeChange('analyze')}
          className={cn(
            'w-full flex items-center gap-4 px-6 py-4 rounded-xl transition-colors text-lg',
            mode === 'analyze'
              ? 'bg-blue-600 text-white'
              : 'hover:bg-gray-100 text-gray-700'
          )}
        >
          <FileSearch className="h-7 w-7" />
          Deep Analysis
        </button>

        <div className="flex flex-col items-center mt-auto">
          <button
            onClick={onHistory}
            className="w-full flex items-center gap-4 px-6 py-4 rounded-xl transition-colors text-lg hover:bg-gray-100 text-gray-700"
          >
            <History className="h-7 w-7" />
            History
          </button>
        </div>
      </div>
    </div>
  );
}
