# BlogCreator — Market launch checklist

Use this before spending on ads or outreach. Identity: **ink + teal**, Plus Jakarta Sans.

## Build & deploy (required path)

Stale `.vercel/output` will ship old code. Always regenerate:

```bash
npm run pages:build
# then, with Wrangler logged in:
WRANGLER_LOG_PATH="$PWD/.wrangler-logs/wrangler.log" npm run pages:deploy
```

Or:

```bash
npm run build
npx next-on-pages --skip-build
npx wrangler pages deploy .vercel/output/static --project-name contentcraft-inspector --branch main
```

Confirm the live site shows the new teal accents (not violet) after deploy.

## Cloudflare Pages — Production env

| Variable | Required for |
|----------|----------------|
| `NEXT_PUBLIC_SITE_URL` | Canonical URLs, OAuth callback |
| `NEXT_PUBLIC_SUPABASE_URL` | Auth + newsletter DB |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Browser auth |
| `SUPABASE_SERVICE_ROLE_KEY` | Newsletter subscribe, admin |
| `RESEND_API_KEY` | Welcome email, contact, daily newsletter |
| `NEWSLETTER_FROM_EMAIL` | Verified sender (e.g. `newsletter@blogcreator.dev`) |
| `CRON_SECRET` | Daily newsletter cron auth |
| `OLLAMA_API_KEY` | Daily issue generation |
| `SCRAPING_HUB_API_KEY` | Trend topics for newsletter |
| `GROQ_API_KEY` | Analyze / outline (product) |

Redeploy after any env change.

## External dashboards

1. **Supabase Auth** → Redirect URLs include:
   - `https://blogcreator.dev/auth/callback`
   - `https://blogcreator.dev/**` (or your Pages preview URL if testing)
2. **Resend** → Domain `blogcreator.dev` verified; test send to your inbox.
3. **GitHub Actions** → Secret `CRON_SECRET` matches Cloudflare; workflow **Daily Newsletter** runs at 09:00 UTC.

## Smoke tests (manual)

| Flow | Pass criteria |
|------|----------------|
| Landing | Teal/ink theme; mobile shows Sign in + hamburger; closing CTA before footer |
| Signup / login (email) | Session lands on `/home` |
| OAuth Google/GitHub | Redirects to `/auth/callback`, then `/home` (not login loop) |
| Try topic | Honest “sample format” copy; no watermark claim |
| Generate | Draft completes for one platform |
| Newsletter subscribe | Success UI; welcome email arrives (or amber warning if Resend fails) |
| Contact form | `/api/contact` 200; message received (or clear config error) |
| `/status` | Unmonitored services labeled **Not monitored** |
| `/newsletter` | Redirects to `/newsletter/sample` |
| Cookie banner | Hidden on `/auth/*`; **Reject all** available; Tab cycles inside dialog |

## Content honesty

- Pricing Free: unlimited generations **during beta**
- Terms §5: matches beta language (no conflicting “monthly caps” for free beta)
- Blog read times: short posts stay ~1 min
- Samples / blog: markdown rendered (no literal `**`)

## Do not ship if

- OAuth still loops to login
- Subscribe returns 502 (Supabase tables / service role)
- Welcome email silent-fails and UI claims inbox success without `emailSent: false` path
- Deploy used outdated `.vercel/output` without `next-on-pages`
