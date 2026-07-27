import BlogCreatorLogo from '@/components/brand/BlogCreatorLogo';
import { cn } from '@/lib/utils';

interface BlogCreatorNavBrandProps {
  className?: string;
  priority?: boolean;
}

/** Nav lockup — icon + BlogCreator wordmark */
export default function BlogCreatorNavBrand({ className }: BlogCreatorNavBrandProps) {
  return (
    <BlogCreatorLogo
      size="md"
      className={cn('[&_svg]:!h-8 [&_svg]:!w-8 md:[&_svg]:!h-9 md:[&_svg]:!w-9', className)}
    />
  );
}
