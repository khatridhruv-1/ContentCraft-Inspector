/** Ensures loaders stay visible long enough to perceive (ms) */
/** Long enough for the ~3s loader clip to start and loop once */
export const PAGE_LOADER_MIN_MS = 1200;

export async function waitForMinDisplay(startedAt: number, minMs = PAGE_LOADER_MIN_MS) {
  const elapsed = Date.now() - startedAt;
  if (elapsed < minMs) {
    await new Promise(resolve => setTimeout(resolve, minMs - elapsed));
  }
}
