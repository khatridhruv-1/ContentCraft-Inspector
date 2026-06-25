#!/usr/bin/env bash
# ContentCraft Inspector — install MCP server or Cursor skill via CLI.
# Usage:
#   bash ./scripts/install-integration.sh <mcp|skill> [--global|--project]
#   curl -fsSL .../master/scripts/install-integration.sh | bash -s -- mcp --global

set -euo pipefail

export PATH="/usr/local/bin:/opt/homebrew/bin:/usr/bin:/bin:${PATH:-}"

METHOD="${1:-}"
SCOPE="${2:---global}"
REPO_URL="${CONTENTCRAFT_REPO:-https://github.com/khatridhruv-1/ContentCraft-Inspector.git}"
BRANCH="${CONTENTCRAFT_BRANCH:-master}"
INSTALL_ROOT="${CONTENTCRAFT_INSTALL_ROOT:-}"
API_URL="${CONTENTCRAFT_API_URL:-http://localhost:3000}"
CLONE_TMP_DIR=""

cleanup_clone() {
  if [[ -n "${CLONE_TMP_DIR:-}" ]]; then
    rm -rf "$CLONE_TMP_DIR"
    CLONE_TMP_DIR=""
  fi
}

usage() {
  cat <<'EOF'
ContentCraft Inspector — integration installer

Usage:
  install-integration.sh <mcp|skill> [--global|--project]

Options:
  mcp       Install the ContentCraft MCP server (Cursor / Claude Desktop)
  skill     Install the ContentCraft Cursor skill
  --global  User-level install (~/.cursor) — default
  --project Project-level install (.cursor in current directory)

Environment:
  CONTENTCRAFT_API_URL       API origin (default: http://localhost:3000)
  CONTENTCRAFT_REPO          Git clone URL for source files
  CONTENTCRAFT_BRANCH        Branch to clone (default: master)
  CONTENTCRAFT_INSTALL_ROOT  Use existing repo path instead of cloning

Examples:
  bash ./scripts/install-integration.sh mcp --global
  bash ./scripts/install-integration.sh skill --project
  CONTENTCRAFT_API_URL=https://app.example.com bash ./scripts/install-integration.sh mcp

Platform notes:
  Run with bash (not sh/dash). On Windows, use Git Bash or WSL.
  For WSL + Windows Cursor, install from the same environment Cursor uses.
EOF
}

preflight() {
  local missing=0
  for cmd in bash node; do
    if ! command -v "$cmd" >/dev/null 2>&1; then
      echo "error: required command not found: $cmd" >&2
      missing=1
    fi
  done

  if [[ "$METHOD" == "mcp" ]] && ! command -v npm >/dev/null 2>&1; then
    echo "error: npm is required for MCP install" >&2
    missing=1
  fi

  if [[ "$missing" -ne 0 ]]; then
    exit 1
  fi

  local major
  major="$(node -e "process.stdout.write(String(process.versions.node.split('.')[0]))")"
  if [[ "$major" -lt 18 ]]; then
    echo "error: Node.js 18+ required (found v$(node -v))" >&2
    exit 1
  fi
}

write_mcp_json() {
  local mcp_json="$1"
  local mcp_home="$2"
  local api_url="$3"

  node - "$mcp_json" "$mcp_home" "$api_url" <<'NODE'
const fs = require('fs');
const [file, home, apiUrl] = process.argv.slice(2);
let data = {};
if (fs.existsSync(file)) {
  try {
    data = JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    console.error(`error: invalid JSON in ${file}`);
    process.exit(1);
  }
}
data.mcpServers = data.mcpServers || {};
data.mcpServers.contentcraft = {
  command: 'node',
  args: [`${home}/index.js`],
  env: { CONTENTCRAFT_API_URL: apiUrl },
};
fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n');
NODE
}

if [[ -z "$METHOD" ]] || [[ "$METHOD" == "-h" ]] || [[ "$METHOD" == "--help" ]]; then
  usage
  exit 0
fi

if [[ "$METHOD" != "mcp" && "$METHOD" != "skill" ]]; then
  echo "error: method must be 'mcp' or 'skill'" >&2
  usage
  exit 1
fi

if [[ "$SCOPE" != "--global" && "$SCOPE" != "--project" ]]; then
  echo "error: scope must be '--global' or '--project'" >&2
  usage
  exit 1
fi

preflight

if [[ "$SCOPE" == "--global" ]]; then
  CURSOR_DIR="${HOME}/.cursor"
else
  CURSOR_DIR="$(pwd)/.cursor"
fi

mkdir -p "$CURSOR_DIR"

resolve_source() {
  if [[ -n "$INSTALL_ROOT" && -d "$INSTALL_ROOT/integrations" ]]; then
    SOURCE_ROOT="$INSTALL_ROOT"
    return
  fi

  local script_path="${BASH_SOURCE[0]:-}"
  if [[ -n "$script_path" && "$script_path" != "-" ]]; then
    local script_dir
    script_dir="$(cd "$(dirname "$script_path")" && pwd)"
    local repo_root="$(cd "$script_dir/.." && pwd)"

    if [[ -d "$repo_root/integrations" ]]; then
      SOURCE_ROOT="$repo_root"
      return
    fi
  fi

  if ! command -v git >/dev/null 2>&1; then
    echo "error: git is required to clone integration files (or set CONTENTCRAFT_INSTALL_ROOT)" >&2
    exit 1
  fi

  CLONE_TMP_DIR="$(mktemp -d)"
  trap cleanup_clone EXIT
  echo "Cloning ContentCraft Inspector (${BRANCH})..." >&2
  if ! git clone --depth 1 --branch "$BRANCH" "$REPO_URL" "$CLONE_TMP_DIR/repo" >/dev/null 2>&1; then
    echo "error: failed to clone ${REPO_URL} (branch: ${BRANCH})" >&2
    echo "  Clone the repo locally and run: CONTENTCRAFT_INSTALL_ROOT=/path/to/repo bash $0 $METHOD $SCOPE" >&2
    exit 1
  fi
  SOURCE_ROOT="$CLONE_TMP_DIR/repo"
}

SOURCE_ROOT=""
resolve_source
MCP_SRC="$SOURCE_ROOT/integrations/mcp"
SKILL_SRC="$SOURCE_ROOT/integrations/skill/contentcraft-content-generation"

install_mcp() {
  if [[ ! -d "$MCP_SRC" ]]; then
    echo "error: MCP source not found at $MCP_SRC" >&2
    echo "  Integration files may not be published on branch '${BRANCH}' yet." >&2
    exit 1
  fi

  local mcp_home="$CURSOR_DIR/contentcraft-mcp"
  rm -rf "$mcp_home"
  mkdir -p "$mcp_home"
  cp -R "$MCP_SRC/." "$mcp_home/"

  echo "Installing MCP dependencies..." >&2
  if ! (cd "$mcp_home" && npm install --omit=dev --silent); then
    echo "error: npm install failed in $mcp_home" >&2
    exit 1
  fi

  local mcp_json="$CURSOR_DIR/mcp.json"
  write_mcp_json "$mcp_json" "$mcp_home" "$API_URL"

  echo "✓ ContentCraft MCP installed → $mcp_json"
  echo "  Server path: $mcp_home"
  echo "  API URL: $API_URL"
  echo "  Restart Cursor to load the MCP server."
}

install_skill() {
  if [[ ! -f "$SKILL_SRC/SKILL.md" ]]; then
    echo "error: skill not found at $SKILL_SRC" >&2
    echo "  Integration files may not be published on branch '${BRANCH}' yet." >&2
    exit 1
  fi

  local skills_dir="$CURSOR_DIR/skills"
  local dest="$skills_dir/contentcraft-content-generation"
  mkdir -p "$skills_dir"
  rm -rf "$dest"
  cp -R "$SKILL_SRC" "$dest"

  echo "✓ ContentCraft skill installed → $dest/SKILL.md"
  echo "  Set CONTENTCRAFT_API_URL=$API_URL in your environment or project .env"
}

case "$METHOD" in
  mcp) install_mcp ;;
  skill) install_skill ;;
esac
