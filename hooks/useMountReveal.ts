'use client';

import { useEffect, useState } from 'react';

/** Flips true after the first client paint so mount animations run post-hydration. */
export function useMountReveal() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return ready;
}
