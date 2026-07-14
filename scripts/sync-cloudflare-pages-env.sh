#!/usr/bin/env bash
# Sync runtime secrets from .env to Cloudflare Pages (production).
# Usage: bash scripts/sync-cloudflare-pages-env.sh
set -euo pipefail

PROJECT_NAME="${CLOUDFLARE_PAGES_PROJECT:-contentcraft-inspector}"
ENV_FILE="${1:-.env}"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "Missing $ENV_FILE"
  exit 1
fi

KEYS=(
  NEXT_PUBLIC_SUPABASE_URL
  NEXT_PUBLIC_SUPABASE_ANON_KEY
  SUPABASE_SERVICE_ROLE_KEY
  RESEND_API_KEY
  NEWSLETTER_FROM_EMAIL
  CRON_SECRET
  OLLAMA_API_KEY
  GROQ_API_KEY
  SCRAPING_HUB_API_KEY
)

echo "Syncing secrets to Cloudflare Pages project: $PROJECT_NAME"

for key in "${KEYS[@]}"; do
  value="$(grep -E "^${key}=" "$ENV_FILE" | head -1 | cut -d= -f2- || true)"
  if [[ -z "$value" ]]; then
    echo "  skip $key (not set in $ENV_FILE)"
    continue
  fi
  echo "  put $key"
  printf '%s' "$value" | npx wrangler pages secret put "$key" --project-name="$PROJECT_NAME"
done

echo "Done. Redeploy Pages for changes to take effect."
