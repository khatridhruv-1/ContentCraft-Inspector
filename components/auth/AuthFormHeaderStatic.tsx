import { marketingAccentSpan, marketingEyebrow } from '@/lib/marketing/marketingTheme';
import { cn } from '@/lib/utils';

interface AuthFormHeaderStaticProps {
  title: string;
  titleAccent?: string;
  subtitle?: string;
  badge?: string;
}

/** Server-rendered auth heading — visible in initial HTML for SEO and crawlers. */
export default function AuthFormHeaderStatic({
  title,
  titleAccent,
  subtitle,
  badge,
}: AuthFormHeaderStaticProps) {
  return (
    <header className="mb-7 text-center">
      {badge && (
        <span className={cn('mb-3 inline-flex', marketingEyebrow)}>{badge}</span>
      )}
      <h1 className="text-balance text-2xl font-black tracking-tight text-slate-900 sm:text-[1.85rem]">
        {title}
        {titleAccent ? (
          <>
            {' '}
            <span className={marketingAccentSpan}>{titleAccent}</span>
          </>
        ) : null}
      </h1>
      {subtitle && (
        <p className="mx-auto mt-2.5 max-w-sm text-[15px] leading-relaxed text-slate-600">
          {subtitle}
        </p>
      )}
    </header>
  );
}
