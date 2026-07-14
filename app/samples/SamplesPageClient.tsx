'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import BlogCreatorNavBrand from '@/components/brand/BlogCreatorNavBrand';
import MarketingFooter from '@/components/marketing/MarketingFooter';
import MarketingPrimaryButton from '@/components/marketing/MarketingPrimaryButton';
import { SAMPLE_OUTPUTS } from '@/lib/marketing/sampleOutputs';
import {
  marketingAccentSpan,
  marketingFocusRing,
  marketingGlassCard,
  marketingMutedLink,
  marketingPageClass,
} from '@/lib/marketing/marketingTheme';
import { cn } from '@/lib/utils';

function renderBody(body: string) {
  return body.split('\n\n').map((block, i) => {
    if (block.startsWith('## ')) {
      return (
        <h3 key={i} className="mt-6 text-lg font-bold text-slate-900">
          {block.replace('## ', '')}
        </h3>
      );
    }
    if (block.startsWith('→ ') || block.startsWith('#')) {
      return (
        <p key={i} className="mt-2 text-base leading-relaxed text-slate-700">
          {block}
        </p>
      );
    }
    if (/^\d+\./.test(block)) {
      return (
        <p key={i} className="mt-2 whitespace-pre-line text-base leading-relaxed text-slate-700">
          {block}
        </p>
      );
    }
    return (
      <p key={i} className="mt-3 text-base leading-relaxed text-slate-700">
        {block}
      </p>
    );
  });
}

export default function SamplesPageClient() {
  const router = useRouter();

  return (
    <div className={cn('min-h-screen bg-slate-50', marketingPageClass)}>
      <header className="border-b border-slate-200 bg-white/80 px-4 py-4 backdrop-blur-sm sm:px-6">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4">
          <Link
            href="/"
            className={cn('inline-flex items-center gap-2 text-sm', marketingMutedLink, marketingFocusRing)}
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Back to home
          </Link>
          <Link href="/" aria-label="BlogCreator home" className={marketingFocusRing}>
            <BlogCreatorNavBrand />
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-10 md:py-14">
        <p className="text-sm font-medium text-violet-700">Sample outputs</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
          See what BlogCreator <span className={marketingAccentSpan}>generates</span>
        </h1>
        <p className="mt-3 text-base text-slate-600">
          Real drafts from our platform workflows — read before you create an account.
        </p>

        <div className="mt-10 space-y-10">
          {SAMPLE_OUTPUTS.map(sample => (
            <article key={sample.id} className={cn(marketingGlassCard, 'p-6 md:p-8')}>
              <p className="text-xs font-bold uppercase tracking-wider text-violet-700">
                {sample.platform}
              </p>
              <h2 className="mt-2 text-xl font-bold text-slate-900">{sample.topic}</h2>
              <p className="mt-2 text-sm text-slate-600">{sample.excerpt}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {sample.keywords.map(kw => (
                  <span
                    key={kw}
                    className="rounded-full border border-slate-200 bg-white px-2.5 py-0.5 text-xs font-medium text-slate-600"
                  >
                    {kw}
                  </span>
                ))}
              </div>
              <div className="mt-6 border-t border-slate-200 pt-6">{renderBody(sample.body)}</div>
            </article>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <MarketingPrimaryButton
            type="button"
            fullWidth={false}
            onClick={() => router.push('/auth/signup')}
          >
            Generate your own — free
          </MarketingPrimaryButton>
        </div>
      </main>

      <MarketingFooter />
    </div>
  );
}
