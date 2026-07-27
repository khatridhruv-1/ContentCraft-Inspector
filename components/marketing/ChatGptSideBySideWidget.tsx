'use client';

import {
  marketingGlassCard,
  marketingLandingSection,
  marketingPageContainerMedium,
  marketingSectionHeader,
  marketingSectionTitle,
  marketingAccentSpan,
  marketingEyebrow,
} from '@/lib/marketing/marketingTheme';
import { cn } from '@/lib/utils';

const SAMPLE_BRIEF = 'How to improve B2B SaaS onboarding emails';

const SIDE_BY_SIDE = {
  blogcreator: {
    title: 'BlogCreator output (website format)',
    excerpt:
      'Start with the activation moment buyers care about — not a feature list. Map three onboarding emails to problem-aware queries, then draft with keywords already in the outline.',
    bullets: ['Platform-native structure', 'Keywords in headings', 'SEO score included'],
  },
  chatgpt: {
    title: 'Typical ChatGPT output',
    excerpt:
      'Here are some tips for onboarding emails: 1) Be clear 2) Use a friendly tone 3) Include a CTA. You can customize these for your SaaS product.',
    bullets: ['Generic list format', 'No keyword mapping', 'Manual SEO pass needed'],
  },
} as const;

export default function ChatGptSideBySideWidget() {
  return (
    <section className={marketingLandingSection} aria-labelledby="side-by-side-heading">
      <div className={marketingPageContainerMedium}>
        <div className={marketingSectionHeader}>
          <span className={marketingEyebrow}>Same brief</span>
          <h2 id="side-by-side-heading" className={marketingSectionTitle}>
            Side-by-side on{' '}
            <span className={marketingAccentSpan}>one topic</span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-base text-slate-600">
            Brief: &ldquo;{SAMPLE_BRIEF}&rdquo; — illustrative samples, not live API calls.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {(['blogcreator', 'chatgpt'] as const).map(key => {
            const col = SIDE_BY_SIDE[key];
            return (
              <article
                key={key}
                className={cn(
                  marketingGlassCard,
                  'p-5 md:p-6',
                  key === 'blogcreator' && 'ring-2 ring-teal-200'
                )}
              >
                <h3 className="text-sm font-bold text-slate-900">{col.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{col.excerpt}</p>
                <ul className="mt-4 space-y-1">
                  {col.bullets.map(b => (
                    <li key={b} className="text-xs font-medium text-slate-500">
                      · {b}
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
