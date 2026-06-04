'use client';

import { motion } from 'framer-motion';
import { Target, Key, HelpCircle, FileText, TrendingUp, Search, ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import type { ContentBrief } from '@/types/agents';

interface ContentBriefDisplayProps {
  brief: ContentBrief;
}

function Section({ title, icon: Icon, children }: { title: string; icon: any; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3 bg-secondary/30 hover:bg-secondary/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Icon className="h-3.5 w-3.5 text-primary" />
          <span className="text-xs font-semibold text-foreground">{title}</span>
        </div>
        {open ? <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" /> : <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />}
      </button>
      {open && <div className="px-4 py-3">{children}</div>}
    </div>
  );
}

export default function ContentBriefDisplay({ brief }: ContentBriefDisplayProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-bold text-foreground">{brief.topic}</h3>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-xs text-muted-foreground capitalize">{brief.platform} · {brief.targetWordCount} words · {brief.tone} tone</span>
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
              brief.status === 'complete' ? 'bg-emerald-500/15 text-emerald-600' :
              brief.status === 'generating' ? 'bg-amber-500/15 text-amber-600' :
              brief.status === 'failed' ? 'bg-red-500/15 text-red-500' :
              'bg-secondary text-muted-foreground'
            }`}>
              {brief.status}
            </span>
          </div>
        </div>
      </div>

      {/* Search Intent */}
      <div className="flex items-center gap-2 px-3 py-2 bg-primary/5 border border-primary/20 rounded-xl">
        <Search className="h-3.5 w-3.5 text-primary" />
        <span className="text-xs text-foreground">Search Intent: <strong className="text-primary capitalize">{brief.searchIntent}</strong></span>
      </div>

      {/* Keywords */}
      <Section title="Keywords" icon={Key}>
        <div className="space-y-2">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">Primary</p>
            <div className="flex flex-wrap gap-1.5">
              {brief.primaryKeywords.map(kw => (
                <span key={kw} className="text-xs px-2.5 py-1 rounded-lg grad text-white font-medium">{kw}</span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">Secondary</p>
            <div className="flex flex-wrap gap-1.5">
              {brief.secondaryKeywords.map(kw => (
                <span key={kw} className="text-xs px-2.5 py-1 rounded-lg bg-secondary border border-border text-muted-foreground">{kw}</span>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* Content Outline */}
      <Section title="Content Outline" icon={FileText}>
        <div className="space-y-2">
          {brief.contentOutline.map((section, i) => (
            <div key={i} style={{ paddingLeft: `${(section.level - 1) * 12}px` }}>
              <p className={`font-semibold text-foreground ${section.level === 1 ? 'text-sm' : 'text-xs'}`}>
                {'#'.repeat(section.level)} {section.heading}
              </p>
              <ul className="mt-1 space-y-0.5">
                {section.keyPoints.map((pt, j) => (
                  <li key={j} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                    <span className="text-primary mt-0.5 shrink-0">·</span>
                    {pt}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      {/* FAQs */}
      <Section title="FAQs to Address" icon={HelpCircle}>
        <ul className="space-y-2">
          {brief.faqs.map((faq, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
              <span className="text-primary font-bold shrink-0">Q{i + 1}.</span>
              {faq}
            </li>
          ))}
        </ul>
      </Section>

      {/* Competitor Insights */}
      {brief.competitorInsights.length > 0 && (
        <Section title="Competitor Insights" icon={Target}>
          <ul className="space-y-2">
            {brief.competitorInsights.map((insight, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                <span className="text-amber-500 mt-0.5 shrink-0">→</span>
                {insight}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* SEO Report */}
      {brief.seoReport && (
        <Section title="SEO Report" icon={TrendingUp}>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">SEO Score</span>
              <div className="flex items-center gap-2">
                <div className="w-24 h-1.5 bg-border rounded-full overflow-hidden">
                  <div className="h-full grad rounded-full" style={{ width: `${brief.seoReport.seoScore}%` }} />
                </div>
                <span className="text-xs font-bold text-primary">{brief.seoReport.seoScore}/100</span>
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-foreground mb-0.5">Meta Title</p>
              <p className="text-xs text-muted-foreground italic">"{brief.seoReport.metaTitle}"</p>
            </div>
            <div>
              <p className="text-xs font-medium text-foreground mb-0.5">Meta Description</p>
              <p className="text-xs text-muted-foreground italic">"{brief.seoReport.metaDescription}"</p>
            </div>
            {brief.seoReport.recommendations.length > 0 && (
              <div>
                <p className="text-xs font-medium text-foreground mb-1">Recommendations</p>
                <ul className="space-y-1">
                  {brief.seoReport.recommendations.slice(0, 4).map((rec, i) => (
                    <li key={i} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                      <span className="text-primary shrink-0 mt-0.5">✓</span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </Section>
      )}
    </motion.div>
  );
}
