import Link from 'next/link';
import { Mail, MessageSquare } from 'lucide-react';
import MarketingFooter from '@/components/marketing/MarketingFooter';
import MarketingSubpageHeader from '@/components/marketing/MarketingSubpageHeader';
import {
  MARKETING_PAGE_GRADIENT,
  marketingAccentSpan,
  marketingLink,
  marketingPageClass,
  marketingPageContainerNarrow,
  marketingSectionTitle,
  marketingSubpageMain,
} from '@/lib/marketing/marketingTheme';
import { SITE_EMAILS } from '@/lib/marketing/siteConfig';
import { cn } from '@/lib/utils';

const SUPPORT_EMAIL = SITE_EMAILS.support;

interface ContactPageShellProps {
  children: React.ReactNode;
}

/** Server-rendered contact shell — headings and links visible in initial HTML. */
export default function ContactPageShell({ children }: ContactPageShellProps) {
  return (
    <div
      className={cn('marketing-page min-h-screen overflow-x-hidden', marketingPageClass)}
      style={{ background: MARKETING_PAGE_GRADIENT }}
    >
      <MarketingSubpageHeader maxWidth="6xl" />

      <main className={marketingSubpageMain}>
        <div className="mb-12 text-center md:mb-14">
          <h1 className={cn(marketingSectionTitle, 'text-balance break-words')}>
            Contact <span className={marketingAccentSpan}>us</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-balance break-words text-slate-600">
            Questions about your account, billing, privacy, or how to use BlogCreator? Send us a
            message — we typically reply within one business day.
          </p>
        </div>

        <div className={marketingPageContainerNarrow}>
          <div className="prose-legal space-y-8 break-words text-slate-600">
            <div className="grid gap-4 sm:grid-cols-2 not-prose">
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white/60 p-4 transition-colors hover:border-slate-300 hover:bg-white/80"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-teal-100 text-teal-700">
                  <Mail className="h-4 w-4" aria-hidden />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-slate-900">Email</span>
                  <span className={cn('block text-sm', marketingLink)}>{SUPPORT_EMAIL}</span>
                </span>
              </a>
              <Link
                href="/help"
                className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white/60 p-4 transition-colors hover:border-slate-300 hover:bg-white/80"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-sky-700">
                  <MessageSquare className="h-4 w-4" aria-hidden />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-slate-900">Help Center</span>
                  <span className="block text-sm text-slate-600">
                    Guides and frequently asked questions
                  </span>
                </span>
              </Link>
            </div>

            {children}
          </div>
        </div>

        <MarketingFooter className="mt-12" />
      </main>
    </div>
  );
}
