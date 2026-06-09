/** Reference-counted scroll lock — safe when multiple loaders mount/unmount out of order */

let lockCount = 0;
let savedBodyOverflow = '';
let savedHtmlOverflow = '';

type ScrollLockOptions = {
  includeHtml?: boolean;
};

export function acquireScrollLock({ includeHtml = false }: ScrollLockOptions = {}) {
  if (lockCount === 0) {
    savedBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    if (includeHtml) {
      savedHtmlOverflow = document.documentElement.style.overflow;
      document.documentElement.style.overflow = 'hidden';
    }
  }
  lockCount += 1;

  return () => {
    lockCount = Math.max(0, lockCount - 1);
    if (lockCount === 0) {
      document.body.style.overflow = savedBodyOverflow;
      if (includeHtml) {
        document.documentElement.style.overflow = savedHtmlOverflow;
      }
    }
  };
}
