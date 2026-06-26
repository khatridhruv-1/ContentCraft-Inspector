import { marketingSectionDividerLine, marketingSectionDividerWrap } from '@/lib/marketing/marketingTheme';
import { cn } from '@/lib/utils';

type MarketingSectionDividerProps = {
  className?: string;
};

export default function MarketingSectionDivider({ className }: MarketingSectionDividerProps) {
  return (
    <div className={cn(marketingSectionDividerWrap, className)} aria-hidden>
      <div className={marketingSectionDividerLine} />
    </div>
  );
}
