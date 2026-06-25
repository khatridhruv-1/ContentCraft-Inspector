#!/usr/bin/env bash
# ContentCraft Integration — maximum automated test matrix
# macOS host + optional Linux (Docker). Isolated /tmp only — never touches real ~/.cursor.
set -uo pipefail
export PATH="/usr/local/bin:/opt/homebrew/bin:/usr/bin:/bin:/usr/sbin:/sbin"

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
INSTALL_URL="https://cdn.jsdelivr.net/gh/khatridhruv-1/ContentCraft-Inspector@master/scripts/install-integration.sh"
REPO_URL="https://github.com/khatridhruv-1/ContentCraft-Inspector.git"
TEST_BASE=$(mktemp -d /tmp/cc-100pct-XXXXXX)
PASS=0
FAIL=0
SKIP=0
MANUAL=0

pass() { PASS=$((PASS + 1)); echo "PASS: $1"; }
fail() { FAIL=$((FAIL + 1)); echo "FAIL: $1${2:+ — $2}"; }
skip() { SKIP=$((SKIP + 1)); echo "SKIP: $1${2:+ — $2}"; }
manual() { MANUAL=$((MANUAL + 1)); echo "MANUAL: $1"; }

echo "============================================================"
echo " ContentCraft Integration — 100% Automated Test Matrix"
echo " TEST_BASE=$TEST_BASE"
echo " HOST=$(uname -srm)"
echo "============================================================"
echo ""

# --- A. Docs / URL alignment ---
echo "--- A. Docs & remote delivery ---"
DOCS_BRANCH=$(node -e "const u=require('fs').readFileSync('$REPO_ROOT/lib/marketing/integrationContent.ts','utf8'); const m=u.match(/INTEGRATION_REPO_BRANCH = '([^']+)'/); console.log(m?m[1]:'')")
[[ "$DOCS_BRANCH" == "master" ]] && pass "A1 docs branch is master" || fail "A1 docs branch" "$DOCS_BRANCH"
grep -q 'cdn.jsdelivr.net/gh/khatridhruv-1/ContentCraft-Inspector' "$REPO_ROOT/lib/marketing/integrationContent.ts" && pass "A1b docs use jsDelivr install URL" || fail "A1b docs install URL"
body=$(curl -fsSL "$INSTALL_URL")
echo "$body" | grep -q 'CLONE_TMP_DIR' && ! echo "$body" | grep -q 'local tmp' && pass "A2 jsDelivr script fixed" || fail "A2 jsDelivr script"
for asset in integrations/mcp/index.js integrations/skill/contentcraft-content-generation/SKILL.md; do
  c=$(curl -s -o /dev/null -w "%{http_code}" "https://cdn.jsdelivr.net/gh/khatridhruv-1/ContentCraft-Inspector@master/$asset")
  [[ "$c" == "200" ]] && pass "A3 jsDelivr $asset" || fail "A3 jsDelivr $asset" "HTTP $c"
done
grep -q 'cdn.jsdelivr.net' "$REPO_ROOT/integrations/skill/contentcraft-content-generation/SKILL.md" && pass "A4 skill SKILL.md uses jsDelivr" || fail "A4 skill SKILL.md URL"

# --- B. All 8 install paths ---
echo ""
echo "--- B. Install matrix (mcp/skill × global/project × jsDelivr/clone) ---"
OUT=$(mktemp)
install_jsdelivr() {
  local method=$1 scope=$2 home=$3 proj=$4
  local label="B jsDelivr $method $scope"
  if [[ -n "$proj" ]]; then cd "$proj" || return 1; fi
  if [[ -n "$home" ]]; then
    HOME="$home" bash -c "curl -fsSL '$INSTALL_URL' | bash -s -- $method $scope" >"$OUT" 2>&1
  else
    bash -c "curl -fsSL '$INSTALL_URL' | bash -s -- $method $scope" >"$OUT" 2>&1
  fi
  local ec=$?
  grep -q 'unbound variable' "$OUT" && fail "$label" "unbound variable in output"
  return $ec
}
verify_mcp() {
  local base=$1
  [[ -f "$base/.cursor/mcp.json" && -f "$base/.cursor/contentcraft-mcp/index.js" && -d "$base/.cursor/contentcraft-mcp/node_modules/@modelcontextprotocol/sdk" ]]
}
verify_skill() {
  local base=$1
  [[ -f "$base/.cursor/skills/contentcraft-content-generation/SKILL.md" ]]
}

H1=$(mktemp -d "$TEST_BASE/mcp-jg-XXXXXX")
install_jsdelivr mcp --global "$H1" "" && verify_mcp "$H1" && pass "B1 mcp global jsDelivr" || fail "B1 mcp global jsDelivr"
H2=$(mktemp -d "$TEST_BASE/mcp-jp-XXXXXX")
install_jsdelivr mcp --project "" "$H2" && verify_mcp "$H2" && pass "B2 mcp project jsDelivr" || fail "B2 mcp project jsDelivr"
H3=$(mktemp -d "$TEST_BASE/skill-jg-XXXXXX")
install_jsdelivr skill --global "$H3" "" && verify_skill "$H3" && pass "B3 skill global jsDelivr" || fail "B3 skill global jsDelivr"
P4=$(mktemp -d "$TEST_BASE/skill-jp-XXXXXX")
install_jsdelivr skill --project "" "$P4" && verify_skill "$P4" && pass "B4 skill project jsDelivr" || fail "B4 skill project jsDelivr"

CLONE=$(mktemp -d "$TEST_BASE/clone-XXXXXX")
git clone --depth 1 -b master "$REPO_URL" "$CLONE/repo" -q
INST="$CLONE/repo/scripts/install-integration.sh"

H5=$(mktemp -d "$TEST_BASE/mcp-cg-XXXXXX")
HOME="$H5" bash "$INST" mcp --global >"$OUT" 2>&1 && verify_mcp "$H5" && pass "B5 mcp global clone" || fail "B5 mcp global clone"
P6=$(mktemp -d "$TEST_BASE/mcp-cp-XXXXXX")
cd "$P6" && bash "$INST" mcp --project >"$OUT" 2>&1 && verify_mcp "$P6" && pass "B6 mcp project clone" || fail "B6 mcp project clone"
H7=$(mktemp -d "$TEST_BASE/skill-cg-XXXXXX")
HOME="$H7" bash "$INST" skill --global >"$OUT" 2>&1 && verify_skill "$H7" && pass "B7 skill global clone" || fail "B7 skill global clone"
P8=$(mktemp -d "$TEST_BASE/skill-cp-XXXXXX")
cd "$P8" && bash "$INST" skill --project >"$OUT" 2>&1 && verify_skill "$P8" && pass "B8 skill project clone" || fail "B8 skill project clone"

# --- C. npm scripts ---
echo ""
echo "--- C. npm integrate scripts ---"
NP=$(mktemp -d "$TEST_BASE/npm-proj-XXXXXX")
(cd "$NP" && CONTENTCRAFT_INSTALL_ROOT="$REPO_ROOT" bash "$REPO_ROOT/scripts/install-integration.sh" skill --project) >"$OUT" 2>&1
verify_skill "$NP" && pass "C1 integrate:skill:project (cwd isolated)" || fail "C1 integrate:skill:project" "$(tail -2 "$OUT")"
NH=$(mktemp -d "$TEST_BASE/npm-home-XXXXXX")
(cd "$REPO_ROOT" && HOME="$NH" CONTENTCRAFT_INSTALL_ROOT="$REPO_ROOT" npm run integrate:mcp --silent) >"$OUT" 2>&1
verify_mcp "$NH" && pass "C2 npm run integrate:mcp" || fail "C2 npm integrate:mcp" "$(tail -2 "$OUT")"

# --- D. MCP runtime ---
echo ""
echo "--- D. MCP runtime ---"
MCP_IDX="$H1/.cursor/contentcraft-mcp/index.js"
node --check "$MCP_IDX" && pass "D1 node --check" || fail "D1 node --check"
[[ "$(grep -cE "name: '(generate_content|analyze_content|create_outline)'" "$MCP_IDX")" -eq 3 ]] && pass "D2 three tools defined" || fail "D2 three tools"

# MCP tools/list via JSON-RPC
LIST_OUT=$(mktemp)
if command -v python3 >/dev/null 2>&1; then
  python3 - "$MCP_IDX" "$LIST_OUT" <<'PY' 2>/dev/null
import json, subprocess, sys, os
idx, out = sys.argv[1], sys.argv[2]
env = os.environ.copy()
p = subprocess.Popen(['node', idx], stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE, env=env)
def send(msg):
    p.stdin.write((json.dumps(msg)+'\n').encode()); p.stdin.flush()
send({"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"test","version":"1"}}})
send({"jsonrpc":"2.0","method":"notifications/initialized"})
send({"jsonrpc":"2.0","id":2,"method":"tools/list","params":{}})
# read lines until tools/list response
tools = []
for _ in range(20):
    line = p.stdout.readline().decode()
    if not line: break
    try:
        o = json.loads(line)
        if o.get('id')==2 and 'result' in o:
            tools = [t['name'] for t in o['result'].get('tools',[])]
            break
    except: pass
p.terminate()
open(out,'w').write(json.dumps(tools))
PY
  TOOLS=$(cat "$LIST_OUT" 2>/dev/null || echo "[]")
  echo "$TOOLS" | grep -q generate_content && echo "$TOOLS" | grep -q analyze_content && echo "$TOOLS" | grep -q create_outline \
    && pass "D3 live tools/list RPC" || fail "D3 live tools/list" "$TOOLS"
else
  skip "D3 live tools/list" "no python3"
fi

# mcp.json merge + custom API URL
MERGE_HOME=$(mktemp -d "$TEST_BASE/merge-XXXXXX")
mkdir -p "$MERGE_HOME/.cursor"
echo '{"mcpServers":{"other":{"command":"echo","args":["hi"]}}}' > "$MERGE_HOME/.cursor/mcp.json"
HOME="$MERGE_HOME" CONTENTCRAFT_API_URL="https://example.com" bash -c "curl -fsSL '$INSTALL_URL' | bash -s -- mcp --global" >"$OUT" 2>&1
python3 -c "
import json,sys
d=json.load(open('$MERGE_HOME/.cursor/mcp.json'))
assert 'other' in d['mcpServers']
assert 'contentcraft' in d['mcpServers']
assert d['mcpServers']['contentcraft']['env']['CONTENTCRAFT_API_URL']=='https://example.com'
" 2>/dev/null && pass "D4 mcp.json merge + custom API URL" || fail "D4 mcp.json merge"

# --- E. Skill content ---
echo ""
echo "--- E. Skill content ---"
SKILL="$P4/.cursor/skills/contentcraft-content-generation/SKILL.md"
grep -q '^name: contentcraft-content-generation' "$SKILL" && pass "E1 YAML frontmatter" || fail "E1 YAML"
for api in ai-content analyze outline; do
  grep -q "/api/$api" "$SKILL" && pass "E2 documents /api/$api" || fail "E2 /api/$api"
done
for sec in Configuration "Generate content" "Analyze content" "Create outline" "Install via CLI" Errors; do
  grep -q "## $sec" "$SKILL" && pass "E3 section: $sec" || fail "E3 section $sec"
done

# --- F. Error handling ---
echo ""
echo "--- F. Installer error handling ---"
bash "$INST" >/dev/null 2>&1; [[ $? -eq 0 ]] && pass "F1 no-args shows usage (exit 0)" || fail "F1 no-args"
bash "$INST" bogus --global >/dev/null 2>&1; [[ $? -eq 1 ]] && pass "F2 invalid method exit 1" || fail "F2 invalid method"
bash "$INST" mcp --bogus >/dev/null 2>&1; [[ $? -eq 1 ]] && pass "F3 invalid scope exit 1" || fail "F3 invalid scope"

# --- G. API connectivity ---
echo ""
echo "--- G. API endpoints ---"
SVR=$(curl -s -o /dev/null -w "%{http_code}" --max-time 5 http://localhost:3000/welcome 2>/dev/null)
SVR="${SVR:-down}"
if [[ "$SVR" == "200" ]]; then
  BODY='{"content":"<p>Automated 100 percent integration test content with enough plain text characters to satisfy analyze validation requirements for the API endpoint test suite run today.</p>"}'
  for ep in analyze outline; do
    c=$(curl -s -o /dev/null -w "%{http_code}" -X POST "http://localhost:3000/api/$ep" -H 'Content-Type: application/json' -d "$BODY")
    [[ "$c" == "200" ]] && pass "G1 POST /api/$ep" || fail "G1 /api/$ep" "HTTP $c"
  done
  c=$(curl -s -o /dev/null -w "%{http_code}" -X POST http://localhost:3000/api/ai-content -H 'Content-Type: application/json' -d '{"title":"100pct integration test","tone":"professional"}')
  [[ "$c" == "200" ]] && pass "G2 POST /api/ai-content" || fail "G2 /api/ai-content" "HTTP $c"
  FETCH=$(CONTENTCRAFT_API_URL=http://localhost:3000 node -e "fetch(process.env.CONTENTCRAFT_API_URL+'/api/analyze',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({content:'x'.repeat(150)})}).then(r=>console.log(r.status))")
  [[ "$FETCH" == "200" ]] && pass "G3 MCP-style fetch" || fail "G3 MCP fetch" "$FETCH"
else
  skip "G API tests" "start app: npm run dev (got $SVR)"
fi

# --- H. Linux via Docker ---
echo ""
echo "--- H. Linux (Docker) ---"
if command -v docker >/dev/null 2>&1; then
  for sock in "${HOME}/.docker/run/docker.sock" /var/run/docker.sock; do
    [[ -S "$sock" ]] && export DOCKER_HOST="unix://${sock}" && break
  done
  if docker info >/dev/null 2>&1; then
    if docker run --rm -v "$REPO_ROOT:/repo:ro" node:20-bookworm-slim bash -c "
    set -e
    apt-get update -qq && apt-get install -qq -y bash >/dev/null
    export PATH=/usr/local/bin:/usr/bin:/bin
    H=\$(mktemp -d)
    HOME=\"\$H\" CONTENTCRAFT_INSTALL_ROOT=/repo bash /repo/scripts/install-integration.sh skill --global
    test -f \"\$H/.cursor/skills/contentcraft-content-generation/SKILL.md\"
  " >"$OUT" 2>&1; then
      pass "H1 Linux Docker skill global (clone path)"
    else
      fail "H1 Linux Docker skill" "$(tail -3 "$OUT")"
    fi
    if docker run --rm -v "$REPO_ROOT:/repo:ro" node:20-bookworm-slim bash -c "
    set -e
    apt-get update -qq && apt-get install -qq -y bash >/dev/null
    export PATH=/usr/local/bin:/usr/bin:/bin
    H=\$(mktemp -d)
    HOME=\"\$H\" CONTENTCRAFT_INSTALL_ROOT=/repo bash /repo/scripts/install-integration.sh mcp --global
    test -f \"\$H/.cursor/contentcraft-mcp/index.js\"
    test -d \"\$H/.cursor/contentcraft-mcp/node_modules/@modelcontextprotocol/sdk\"
  " >"$OUT" 2>&1; then
      pass "H2 Linux Docker mcp global (clone path)"
    else
      fail "H2 Linux Docker mcp" "$(tail -3 "$OUT")"
    fi
  else
    skip "H Linux Docker" "daemon not running (start Docker Desktop)"
  fi
else
  skip "H Linux Docker" "docker not available"
fi

# --- Manual-only (cannot automate in CI) ---
echo ""
echo "--- I. Manual verification required ---"
manual "I1 Restart Cursor → confirm contentcraft MCP server appears in MCP settings"
manual "I2 In Cursor chat, invoke generate_content with a topic (server running + API keys)"
manual "I3 Skill: ask agent to generate content using ContentCraft API (CONTENTCRAFT_API_URL set)"
manual "I4 Windows Git Bash or WSL install (no Windows host in this environment)"
manual "I5 Production CONTENTCRAFT_API_URL (non-localhost deployment)"

echo ""
echo "============================================================"
echo " SUMMARY: PASS=$PASS  FAIL=$FAIL  SKIP=$SKIP  MANUAL=$MANUAL"
echo "============================================================"
[[ "$FAIL" -eq 0 ]] && echo "AUTOMATED: ALL PASS" || echo "AUTOMATED: FAILURES PRESENT"
echo "Complete I1–I5 manually for full 100% including Cursor UI + Windows."
exit "$FAIL"
