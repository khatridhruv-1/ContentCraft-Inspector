'use client';

import { useState } from 'react';
import { marketingFocusRing } from '@/lib/marketing/marketingTheme';
import { cn } from '@/lib/utils';

const TABS = [
  { id: 'getting-started', label: 'Getting started' },
  { id: 'seo', label: 'SEO workflow' },
  { id: 'product', label: 'Product tour' },
  { id: 'troubleshooting', label: 'Troubleshooting' },
] as const;

type TabId = (typeof TABS)[number]['id'];

const TAB_TARGETS: Record<TabId, string> = {
  'getting-started': '#how-it-works',
  seo: '#seo-keywords',
  product: '#preview',
  troubleshooting: '#troubleshooting',
};

export default function HelpPageNav() {
  const [active, setActive] = useState<TabId>('getting-started');

  const goTo = (id: TabId) => {
    setActive(id);
    document.querySelector(TAB_TARGETS[id])?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav
      aria-label="Help sections"
      className="mx-auto mb-8 flex max-w-6xl flex-wrap justify-center gap-2 px-6"
    >
      {TABS.map(tab => (
        <button
          key={tab.id}
          type="button"
          onClick={() => goTo(tab.id)}
          className={cn(
            'rounded-full px-4 py-2 text-sm font-medium transition-colors',
            active === tab.id
              ? 'bg-violet-100 text-violet-900'
              : 'bg-white/70 text-slate-600 hover:bg-white',
            marketingFocusRing
          )}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}
