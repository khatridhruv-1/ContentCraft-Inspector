import Link from 'next/link';
import { Play } from 'lucide-react';
import {
  marketingGlassCard,
  marketingAccentSpan,
  marketingSectionTitle,
} from '@/lib/marketing/marketingTheme';
import { cn } from '@/lib/utils';

/** 60-second product walkthrough — links to help preview until hosted video is available. */
export default function HelpProductVideoSection() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-10" aria-labelledby="help-video-heading">
      <h2 id="help-video-heading" className={cn(marketingSectionTitle, 'text-center')}>
        60-second <span className={marketingAccentSpan}>product tour</span>
      </h2>
      <p className="mx-auto mt-3 max-w-lg text-center text-sm text-slate-600">
        Watch how generation, keyword discovery, and SEO analysis fit in one workspace.
      </p>

      <div className={cn(marketingGlassCard, 'relative mx-auto mt-6 max-w-2xl overflow-hidden')}>
        <div className="flex aspect-video flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-violet-950 px-6 text-center">
          <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-white">
            <Play className="h-7 w-7" aria-hidden />
          </span>
          <p className="text-sm font-semibold text-white">Interactive walkthrough</p>
          <p className="mt-2 text-xs text-slate-300">
            Step through the dashboard preview, platform picker, and analysis tabs.
          </p>
          <Link
            href="/help#preview"
            className="mt-4 rounded-full bg-violet-600 px-5 py-2 text-sm font-semibold text-white hover:bg-violet-500"
          >
            Start 60s tour
          </Link>
        </div>
      </div>
    </section>
  );
}
