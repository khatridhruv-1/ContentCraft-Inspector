import { Sparkles, ArrowRight } from 'lucide-react';

export default function WelcomeFooter() {
  return (
    <footer className="border-t border-white/[0.06] px-6 py-12 md:py-16" aria-label="Site footer">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">

          <div className="sm:col-span-2 lg:col-span-1">
            <a
              href="/welcome"
              className="mb-3 inline-flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 rounded-lg"
              aria-label="ContentCraft Inspector home"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-500/25">
                <Sparkles className="h-4 w-4 text-white" aria-hidden />
              </div>
              <span className="font-bold text-white tracking-tight text-sm">ContentCraft</span>
              <span className="text-white/40 text-sm font-normal">Inspector</span>
            </a>
            <p className="mt-3 text-sm leading-relaxed text-white/45 max-w-[220px]">
              Generate, analyze, and perfect content with AI — built for speed and clarity.
            </p>
          </div>

          <nav aria-label="Product navigation">
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-white/30">
              Product
            </h2>
            <ul className="space-y-3" role="list">
              {[
                { label: 'Features', href: '/dashboard' },
                { label: 'AI Generation', href: '/dashboard#generation' },
                { label: 'Deep Analysis', href: '/dashboard#analysis' },
              ].map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    className="text-sm text-white/45 hover:text-white/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 rounded"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Company navigation">
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-white/30">
              Company
            </h2>
            <ul className="space-y-3" role="list">
              {[
                { label: 'Contact', href: '/contact' },
                { label: 'Privacy Policy', href: '/privacy' },
                { label: 'Terms of Service', href: '/terms' },
              ].map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    className="text-sm text-white/45 hover:text-white/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 rounded"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Get started navigation">
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-white/30">
              Get started
            </h2>
            <div className="flex flex-col gap-3">
              <a
                href="/auth/login"
                className="inline-flex items-center justify-center rounded-xl border border-white/[0.1] bg-white/[0.04] px-4 py-2 text-sm font-medium text-white/70 transition-colors hover:bg-white/[0.08] hover:text-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
              >
                Sign in
              </a>
              <a
                href="/auth/signup"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-violet-500/20 transition-shadow hover:shadow-violet-500/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090b]"
              >
                Get started free
                <ArrowRight className="h-3.5 w-3.5" aria-hidden />
              </a>
            </div>
          </nav>
        </div>

        <div
          className="mt-10 h-px w-full bg-gradient-to-r from-transparent via-white/[0.08] to-transparent"
          aria-hidden
        />

        <p className="mt-6 text-center text-xs text-white/25">
          © {new Date().getFullYear()} ContentCraft Inspector · Built with AI, powered by creativity.
        </p>
      </div>
    </footer>
  );
}
