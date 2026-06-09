import type { ReactNode } from 'react';

type HomeSectionHeaderProps = {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  className?: string;
  headingId?: string;
  /** Use h1 for the page hero; h2 for sections below */
  headingLevel?: 'h1' | 'h2';
};

/** Shared eyebrow + headline rhythm (matches Workflows section) */
export default function HomeSectionHeader({
  eyebrow,
  title,
  description,
  className = '',
  headingId,
  headingLevel = 'h2',
}: HomeSectionHeaderProps) {
  const Heading = headingLevel;

  return (
    <div className={className}>
      <span className="mb-2 inline-flex items-center rounded-full border border-white/[0.08] bg-white/[0.04] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white/50">
        {eyebrow}
      </span>
      <Heading
        id={headingId}
        className="text-xl font-black tracking-tight text-white md:text-2xl"
      >
        {title}
      </Heading>
      {description ? (
        <p className="mt-1.5 max-w-md text-sm text-white/55">{description}</p>
      ) : null}
    </div>
  );
}
