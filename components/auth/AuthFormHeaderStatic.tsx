import { marketingEyebrow } from '@/lib/marketing/marketingTheme';
import { cn } from '@/lib/utils';

interface AuthFormHeaderStaticProps {
  title: string;
  subtitle?: string;
  badge?: string;
}

/** Server-rendered auth heading — visible in initial HTML for SEO and crawlers. */
export default function AuthFormHeaderStatic({
  title,
  subtitle,
  badge,
}: AuthFormHeaderStaticProps) {
  return (
    <header className="mb-6 text-center lg:text-left">
      {badge && <span className={cn('mb-4 inline-block', marketingEyebrow)}>{badge}</span>}
      <h1 className="text-balance text-2xl font-black leading-tight tracking-tight text-slate-900 sm:text-3xl">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-2.5 text-[15px] leading-relaxed text-slate-600">{subtitle}</p>
      )}
    </header>
  );
}
