'use client';

import { BarChart3, Brain, ListTree } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AnalysisPanel from '@/components/AnalysisPanel';
import OutlinePanel from '@/components/OutlinePanel';
import InfoGainPanel from '@/components/InfoGainPanel';
import { studioCanvas } from '@/lib/dashboard/studioTheme';
import { cn } from '@/lib/utils';

type DashboardAnalysisTabsProps = {
  analysis: string;
  triggerAnalysis: boolean;
  analysisRunId?: number;
  dataFromChild: string;
  className?: string;
};

const TAB_TRIGGER =
  'flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-medium transition-colors data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:text-slate-500 data-[state=inactive]:hover:bg-slate-100 data-[state=inactive]:hover:text-slate-800 sm:text-sm';

export default function DashboardAnalysisTabs({
  analysis,
  triggerAnalysis,
  analysisRunId = 0,
  dataFromChild,
  className,
}: DashboardAnalysisTabsProps) {
  return (
    <Tabs defaultValue="analysis" className={cn('flex h-full min-h-0 flex-col', className)}>
      <TabsList className="mb-2 grid h-auto w-full shrink-0 grid-cols-3 gap-1 rounded-lg border border-slate-200 bg-slate-50 p-0.5">
        <TabsTrigger value="analysis" className={TAB_TRIGGER}>
          <BarChart3 className="h-4 w-4 shrink-0" aria-hidden />
          <span className="hidden sm:inline">Analysis</span>
        </TabsTrigger>
        <TabsTrigger value="outline" className={TAB_TRIGGER}>
          <ListTree className="h-4 w-4 shrink-0" aria-hidden />
          <span className="hidden sm:inline">Outline</span>
        </TabsTrigger>
        <TabsTrigger value="infogain" className={TAB_TRIGGER}>
          <Brain className="h-4 w-4 shrink-0" aria-hidden />
          <span className="hidden sm:inline">Info Gain</span>
        </TabsTrigger>
      </TabsList>

      <div className={cn(studioCanvas, 'flex-1 min-h-[320px] lg:min-h-0')}>
        <TabsContent value="analysis" className="m-0 h-full overflow-auto p-4 md:p-5">
          <AnalysisPanel
            content={analysis}
            triggerAnalysis={triggerAnalysis}
            analysisRunId={analysisRunId}
            dataFromChild={dataFromChild}
          />
        </TabsContent>
        <TabsContent value="outline" className="m-0 h-full overflow-auto p-4 md:p-5">
          <OutlinePanel
            content={analysis}
            triggerOutline={triggerAnalysis}
            dataFromChild={dataFromChild}
          />
        </TabsContent>
        <TabsContent value="infogain" className="m-0 h-full overflow-auto p-4 md:p-5">
          <InfoGainPanel
            content={analysis}
            triggerInfoGain={triggerAnalysis}
            dataFromChild={dataFromChild}
          />
        </TabsContent>
      </div>
    </Tabs>
  );
}
