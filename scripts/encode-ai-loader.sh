#!/usr/bin/env bash
# Re-encode fullscreen loader from a source GIF (place as public/loading/source.gif).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DIR="$ROOT/public/loading"
SRC="${1:-$DIR/source.gif}"

if [[ ! -f "$SRC" ]]; then
  echo "Missing source: $SRC"
  echo "Usage: ./scripts/encode-ai-loader.sh [path/to/source.gif]"
  exit 1
fi

ffmpeg -y -i "$SRC" -an -c:v libvpx-vp9 -crf 32 -b:v 0 -pix_fmt yuv420p "$DIR/ai-product-loader.webm"
ffmpeg -y -i "$SRC" -an -c:v libx264 -crf 28 -preset slow -pix_fmt yuv420p -movflags +faststart "$DIR/ai-product-loader.mp4"
ffmpeg -y -i "$SRC" -frames:v 1 "$DIR/ai-product-loader-poster.png"
ls -lah "$DIR"/ai-product-loader.{webm,mp4} "$DIR/ai-product-loader-poster.png"
