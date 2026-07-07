import * as React from 'react';

const MOBILE_BREAKPOINT = 768;
const DESKTOP_SIDEBAR_BREAKPOINT = 1024;

function subscribeMedia(query: string, onChange: () => void) {
  const mql = window.matchMedia(query);
  mql.addEventListener('change', onChange);
  return () => mql.removeEventListener('change', onChange);
}

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const query = `(max-width: ${MOBILE_BREAKPOINT - 1}px)`;
    const update = () => setIsMobile(window.matchMedia(query).matches);
    update();
    return subscribeMedia(query, update);
  }, []);

  return isMobile;
}

/** True below the `lg` breakpoint where studio history becomes a side column. */
export function useIsStudioMobile() {
  const [isStudioMobile, setIsStudioMobile] = React.useState(false);

  React.useEffect(() => {
    const query = `(max-width: ${DESKTOP_SIDEBAR_BREAKPOINT - 1}px)`;
    const update = () => setIsStudioMobile(window.matchMedia(query).matches);
    update();
    return subscribeMedia(query, update);
  }, []);

  return isStudioMobile;
}
