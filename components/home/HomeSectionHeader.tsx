import type { ReactNode } from 'react';
import {
  marketingEyebrow,
  marketingSectionTitle,
} from '@/lib/marketing/marketingTheme';
import { cn } from '@/lib/utils';

type HomeSectionHeaderProps = {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  className?: string;
  headingId?: string;
  headingLevel?: 'h1' | 'h2';
  prominent?: boolean;
  centered?: boolean;
};

export default function HomeSectionHeader({
  eyebrow,
  title,
  description,
  className = '',
  headingId,
  headingLevel = 'h2',
  prominent = false,
  centered = false,
}: HomeSectionHeaderProps) {
  const Heading = headingLevel;

  return (
    <div className={cn(centered && 'text-center', className)}>
      <span className={cn('mb-3', marketingEyebrow)}>{eyebrow}</span>
      <Heading
        id={headingId}
        className={cn(
          'text-balance',
          prominent
            ? 'text-3xl font-black tracking-tight text-slate-900 md:text-4xl'
            : marketingSectionTitle
        )}
      >
        {title}
      </Heading>
      {description ? (
        <p
          className={cn(
            'mt-3 text-base leading-relaxed text-slate-600',
            prominent ? 'max-w-xl' : 'max-w-md text-sm',
            centered && 'mx-auto'
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
