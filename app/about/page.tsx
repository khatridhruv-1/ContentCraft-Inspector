import type { Metadata } from 'next';
import Link from 'next/link';
import MarketingFooter from '@/components/marketing/MarketingFooter';
import MarketingSubpageHeader from '@/components/marketing/MarketingSubpageHeader';
import { CASE_STUDY } from '@/lib/marketing/caseStudy';
import { ABOUT_FOUNDERS, ABOUT_PROOF_POINTS, ABOUT_ORIGIN } from '@/lib/marketing/aboutContent';
import { TESTIMONIALS } from '@/lib/marketing/testimonials';
import {
  MARKETING_PAGE_GRADIENT,
  marketingAccentSpan,
  marketingGlassCard,
  marketingPageClass,
  marketingSubpageMain,
  marketingSectionTitle,
} from '@/lib/marketing/marketingTheme';
import { absoluteUrl } from '@/lib/marketing/siteUrl';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'About — BlogCreator',
  description: 'BlogCreator builds platform-first tools for humanized content — website, LinkedIn, Quora, Medium, and Substack.',
  alternates: { canonical: absoluteUrl('/about') },
};

export default function AboutPage() {
  return (
    <div
      className={cn('marketing-page min-h-screen', marketingPageClass)}
      style={{ background: MARKETING_PAGE_GRADIENT }}
    >
      <MarketingSubpageHeader maxWidth="6xl" />

      <main className={marketingSubpageMain}>
        <h1 className={marketingSectionTitle}>
          About <span className={marketingAccentSpan}>BlogCreator</span>
        </h1>
        <p className="mt-4 text-base leading-relaxed text-slate-600">
          BlogCreator is a free workspace for practitioners who publish across multiple platforms.
          We believe destination-first drafting — pick where the piece will live, then write with
          live keywords and SEO scoring — beats generic chat output every time. The drafts are
          built to sound human.
        </p>

        <section className={cn(marketingGlassCard, 'mt-8 p-6 md:p-8')}>
          <h2 className="text-lg font-bold text-slate-900">{ABOUT_ORIGIN.headline}</h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600 whitespace-pre-line">
            {ABOUT_ORIGIN.body}
          </p>
        </section>

        <section className={cn(marketingGlassCard, 'mt-6 p-6 md:p-8')}>
          <h2 className="text-lg font-bold text-slate-900">What we ship</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-600">
            <li>Five-platform humanized drafts (website, LinkedIn, Quora, Medium, Substack)</li>
            <li>Keyword discovery and deep SEO analysis</li>
            <li>MCP tool, agent skill, and REST API for developer workflows</li>
            <li>BlogCreator Daily — a practitioner newsletter on humanized publishing</li>
          </ul>
        </section>

        <section className={cn(marketingGlassCard, 'mt-6 p-6 md:p-8')}>
          <h2 className="text-lg font-bold text-slate-900">Founding team</h2>
          <ul className="mt-4 space-y-4">
            {ABOUT_FOUNDERS.map(member => (
              <li key={member.name} className="flex items-start gap-4">
                <span
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-sm font-bold text-slate-700"
                  aria-hidden
                >
                  {member.initials}
                </span>
                <div>
                  <p className="font-semibold text-slate-900">{member.name}</p>
                  <p className="text-sm text-teal-700">{member.role}</p>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">{member.bio}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className={cn(marketingGlassCard, 'mt-6 p-6 md:p-8')}>
          <h2 className="text-lg font-bold text-slate-900">Customer stories</h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">{CASE_STUDY.summary}</p>
          <p className="mt-2 text-2xl font-black tracking-tight text-slate-900">
            {CASE_STUDY.metric}
          </p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {CASE_STUDY.highlights.map(item => (
              <li
                key={item}
                className="rounded-lg bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-800"
              >
                {item}
              </li>
            ))}
          </ul>
          <footer className="mt-4 border-t border-slate-200 pt-4 text-sm text-slate-500">
            <span className="font-semibold text-slate-900">{CASE_STUDY.attribution}</span>
            {' · '}
            {CASE_STUDY.role} at {CASE_STUDY.company}
          </footer>
          <ul className="mt-6 space-y-4 border-t border-slate-200 pt-6">
            {TESTIMONIALS.map(item => (
              <li key={item.name}>
                <blockquote className="text-sm italic leading-relaxed text-slate-700">
                  &ldquo;{item.quote}&rdquo;
                </blockquote>
                <p className="mt-2 text-xs font-semibold text-slate-900">
                  {item.name} · {item.role}
                </p>
              </li>
            ))}
          </ul>
          <ul className="mt-4 flex flex-wrap gap-2">
            {ABOUT_PROOF_POINTS.map(point => (
              <li
                key={point}
                className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600"
              >
                {point}
              </li>
            ))}
          </ul>
        </section>

        <section className={cn(marketingGlassCard, 'mt-6 p-6 md:p-8')}>
          <h2 className="text-lg font-bold text-slate-900">Mission</h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            Help small teams compete with bigger content budgets through specificity, platform-native
            drafts, and honest tooling — not generic AI filler.
          </p>
        </section>

        <p className="mt-8 text-sm text-slate-600">
          Questions?{' '}
          <Link href="/contact" className="font-semibold text-teal-700 underline-offset-2 hover:underline">
            Contact us
          </Link>
          {' · '}
          <Link href="/changelog" className="font-semibold text-teal-700 underline-offset-2 hover:underline">
            See what shipped recently
          </Link>
        </p>
      </main>

      <MarketingFooter />
    </div>
  );
}
