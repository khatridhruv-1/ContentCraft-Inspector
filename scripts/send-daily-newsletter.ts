/**
 * Generate and send BlogCreator Daily outside Cloudflare Pages.
 * Intended for GitHub Actions (schedule) so AI generation is not bound by Worker timeouts.
 *
 * Usage:
 *   npx tsx scripts/send-daily-newsletter.ts
 *
 * Required env:
 *   NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY,
 *   RESEND_API_KEY, OLLAMA_API_KEY, SCRAPING_HUB_API_KEY
 * Optional:
 *   NEWSLETTER_FROM_EMAIL, NEXT_PUBLIC_SITE_URL, OLLAMA_MODEL, SCRAPING_HUB_API_URL
 */
import { runDailyNewsletterSend } from '../lib/newsletter/runDailySend';

async function main(): Promise<void> {
  console.log('[daily-newsletter] Starting generate + send…');
  const result = await runDailyNewsletterSend();

  console.log(
    JSON.stringify(
      {
        message: result.message,
        topic: result.topic,
        sent: result.sent,
        failed: result.failed,
        failures: result.failures,
      },
      null,
      2
    )
  );

  if (result.failed > 0 && result.sent === 0) {
    process.exitCode = 1;
  }
}

main().catch(error => {
  console.error('[daily-newsletter] Fatal:', error instanceof Error ? error.message : error);
  process.exit(1);
});
