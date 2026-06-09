import MarketingFooter from '@/components/marketing/MarketingFooter';
import { marketingBgClass } from '@/lib/marketing/marketingTheme';
import { cn } from '@/lib/utils';

export default function HomeFooter() {
  return (
    <MarketingFooter
      className={cn('relative z-10 mt-8 shrink-0 py-8', marketingBgClass)}
    />
  );
}
