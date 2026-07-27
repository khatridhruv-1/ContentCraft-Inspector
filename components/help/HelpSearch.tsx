'use client';

import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { HELP_TROUBLESHOOTING_ITEMS } from '@/lib/marketing/helpContent';
import { marketingFocusRing, marketingPageContainerTight } from '@/lib/marketing/marketingTheme';
import { cn } from '@/lib/utils';

const STATIC_RESULTS = [
  { title: 'Getting started in four steps', href: '#how-it-works' },
  { title: 'SEO keyword workflow', href: '#seo-keywords' },
  { title: 'Product walkthrough', href: '#preview' },
  { title: 'MCP and API setup', href: '/integrate' },
  ...HELP_TROUBLESHOOTING_ITEMS.map(item => ({
    title: item.question,
    href: '#troubleshooting',
  })),
];

export default function HelpSearch() {
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return STATIC_RESULTS.filter(r => r.title.toLowerCase().includes(q)).slice(0, 6);
  }, [query]);

  return (
    <div className={cn(marketingPageContainerTight, 'mb-8')}>
      <label htmlFor="help-search" className="sr-only">
        Search help
      </label>
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
          aria-hidden
        />
        <input
          id="help-search"
          type="search"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search guides and fixes..."
          className={cn(
            'w-full rounded-xl border border-slate-200 bg-white/80 py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400',
            marketingFocusRing
          )}
        />
      </div>
      {results.length > 0 && (
        <ul className="mt-2 rounded-xl border border-slate-200 bg-white p-2 shadow-sm">
          {results.map(r => (
            <li key={r.title}>
              <a
                href={r.href}
                className="block rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
              >
                {r.title}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
