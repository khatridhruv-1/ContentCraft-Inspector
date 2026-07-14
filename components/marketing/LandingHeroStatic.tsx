import Link from 'next/link';
import {
  LANDING_HERO_BADGE,
  LANDING_HERO_SUBHEAD,
  LANDING_HERO_TITLE_LINE1,
  LANDING_HERO_TITLE_LINE2,
} from '@/lib/marketing/landingHeroContent';
import { marketingLandingHero } from '@/lib/marketing/marketingTheme';

/** SSR hero shell — visible in initial HTML for crawlers and no-JS users. */
export default function LandingHeroStatic() {
  return (
    <section className={marketingLandingHero} aria-labelledby="hero-heading-ssr">
      <span className="inline-flex flex-wrap items-center justify-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-1.5 text-sm font-medium text-slate-700">
        {LANDING_HERO_BADGE}
        <span className="rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 whitespace-nowrap">
          Free for everyone
        </span>
      </span>

      <h1
        id="hero-heading-ssr"
        className="mb-5 text-balance text-5xl font-black tracking-tight leading-[1.05] text-slate-900 md:text-7xl lg:text-[5.5rem]"
      >
        {LANDING_HERO_TITLE_LINE1}
        <span className="mt-1 block">{LANDING_HERO_TITLE_LINE2}</span>
      </h1>

      <p className="mb-8 max-w-2xl text-balance text-lg leading-relaxed text-slate-600 md:text-xl">
        {LANDING_HERO_SUBHEAD}
      </p>

      <div className="flex w-full flex-col items-center justify-center gap-3 sm:flex-row">
        <Link
          href="/auth/signup"
          className="inline-flex shrink-0 items-center justify-center rounded-full bg-violet-600 px-6 py-3 text-sm font-semibold text-white hover:bg-violet-700"
        >
          Get started free
        </Link>
        <Link
          href="/samples"
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-800 hover:border-slate-300 hover:bg-slate-50"
        >
          See sample output
        </Link>
      </div>
    </section>
  );
}
