#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

if [[ -f .env ]]; then
  set -a
  # shellcheck disable=SC1091
  source .env
  set +a
fi

if [[ -z "${SUPABASE_ACCESS_TOKEN:-}" ]]; then
  echo "Missing SUPABASE_ACCESS_TOKEN. Add it to .env (see .env.example)."
  exit 1
fi

if [[ -z "${SUPABASE_PROJECT_REF:-}" ]]; then
  echo "Missing SUPABASE_PROJECT_REF. Add it to .env (see .env.example)."
  exit 1
fi

export SUPABASE_ACCESS_TOKEN

echo "Linking Supabase project: ${SUPABASE_PROJECT_REF}"
npx supabase link --project-ref "${SUPABASE_PROJECT_REF}"

echo "Pushing migrations..."
npx supabase db push

echo "Done. Tables are ready on your Supabase project."
