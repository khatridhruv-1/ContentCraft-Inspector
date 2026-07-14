/** Minimum time auth-gated pages show the loading screen (avoids flash). */
export const AUTH_SESSION_MIN_MS = 200;

/** Guest auth pages skip minimum delay when no session token exists. */
export const GUEST_GUARD_MIN_MS = 0;

export async function waitForMinDisplay(
  startedAt: number,
  minMs = AUTH_SESSION_MIN_MS
): Promise<void> {
  const elapsed = Date.now() - startedAt;
  if (elapsed >= minMs) return;
  await new Promise(resolve => setTimeout(resolve, minMs - elapsed));
}
