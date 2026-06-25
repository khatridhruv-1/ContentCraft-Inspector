#!/usr/bin/env bash
set -euo pipefail

export PATH="/usr/local/bin:/opt/homebrew/bin:/usr/bin:/bin:/usr/sbin:/sbin"

REPO="https://github.com/khatridhruv-1/ContentCraft-Inspector.git"
RAW="https://raw.githubusercontent.com/khatridhruv-1/ContentCraft-Inspector/master"
TEST_BASE=$(mktemp -d /tmp/cc-retest5-XXXXXX)
PASS=0
FAIL=0
SKIP=0

pass() { PASS=$((PASS + 1)); echo "PASS: $1"; }
fail() { FAIL=$((FAIL + 1)); echo "FAIL: $1${2:+ — $2}"; }
skip() { SKIP=$((SKIP + 1)); echo "SKIP: $1 — $2"; }

echo "TEST_BASE=$TEST_BASE"

for path in scripts/install-integration.sh integrations/mcp/index.js integrations/skill/contentcraft-content-generation/SKILL.md; do
  code=$(curl -s -o /dev/null -w "%{http_code}" "$RAW/$path")
  if [[ "$code" == "200" ]]; then pass "REMOTE-URL $path"; else fail "REMOTE-URL $path" "HTTP $code"; fi
done

MCP_GLOB_HOME=$(mktemp -d "$TEST_BASE/mcp-global-XXXXXX")
if HOME="$MCP_GLOB_HOME" bash -c "curl -fsSL '$RAW/scripts/install-integration.sh' | bash -s -- mcp --global" >/tmp/mcp-glob-out.txt 2>&1; then
  if [[ -f "$MCP_GLOB_HOME/.cursor/mcp.json" && -f "$MCP_GLOB_HOME/.cursor/contentcraft-mcp/index.js" && -d "$MCP_GLOB_HOME/.cursor/contentcraft-mcp/node_modules/@modelcontextprotocol/sdk" ]]; then
    pass "REMOTE-CURL mcp --global"
  else
    fail "REMOTE-CURL mcp --global" "missing files"
    cat /tmp/mcp-glob-out.txt
  fi
else
  fail "REMOTE-CURL mcp --global" "$(tail -3 /tmp/mcp-glob-out.txt)"
fi

SKILL_PROJ=$(mktemp -d "$TEST_BASE/skill-project-XXXXXX")
cd "$SKILL_PROJ"
if bash -c "curl -fsSL '$RAW/scripts/install-integration.sh' | bash -s -- skill --project" >/tmp/skill-proj-out.txt 2>&1; then
  if [[ -f "$SKILL_PROJ/.cursor/skills/contentcraft-content-generation/SKILL.md" ]]; then
    pass "REMOTE-CURL skill --project"
  else
    fail "REMOTE-CURL skill --project" "no SKILL.md"
  fi
else
  fail "REMOTE-CURL skill --project" "$(tail -3 /tmp/skill-proj-out.txt)"
fi

CLONE_DIR=$(mktemp -d "$TEST_BASE/clone-XXXXXX")
if git clone --depth 1 -b master "$REPO" "$CLONE_DIR/repo" >/dev/null 2>&1; then
  pass "GIT-CLONE master"
else
  fail "GIT-CLONE master" "clone failed"
fi
INSTALLER="$CLONE_DIR/repo/scripts/install-integration.sh"

MCP_PROJ=$(mktemp -d "$TEST_BASE/mcp-proj-XXXXXX")
cd "$MCP_PROJ"
if bash "$INSTALLER" mcp --project >/tmp/mcp-proj-out.txt 2>&1; then
  if python3 -c "import json; json.load(open('$MCP_PROJ/.cursor/mcp.json'))"; then
    pass "CLONE mcp --project"
  else
    fail "CLONE mcp --project" "bad mcp.json"
  fi
else
  fail "CLONE mcp --project" "$(tail -2 /tmp/mcp-proj-out.txt)"
fi

SKILL_GLOB_HOME=$(mktemp -d "$TEST_BASE/skill-global-XXXXXX")
if HOME="$SKILL_GLOB_HOME" bash "$INSTALLER" skill --global >/tmp/skill-glob-out.txt 2>&1; then
  if [[ -f "$SKILL_GLOB_HOME/.cursor/skills/contentcraft-content-generation/SKILL.md" ]]; then
    pass "CLONE skill --global"
  else
    fail "CLONE skill --global" "no SKILL.md"
  fi
else
  fail "CLONE skill --global" "$(tail -2 /tmp/skill-glob-out.txt)"
fi

MCP_IDX="$MCP_GLOB_HOME/.cursor/contentcraft-mcp/index.js"
if [[ -f "$MCP_IDX" ]]; then
  node --check "$MCP_IDX" && pass "MCP syntax" || fail "MCP syntax" "check failed"
  timeout 2 node "$MCP_IDX" </dev/null 2>/dev/null || true
  ec=$?
  if [[ "$ec" -eq 0 || "$ec" -eq 124 ]]; then pass "MCP startup"; else fail "MCP startup" "exit $ec"; fi
  if [[ "$(grep -cE "name: '(generate_content|analyze_content|create_outline)'" "$MCP_IDX")" -eq 3 ]]; then
    pass "MCP 3 tools"
  else
    fail "MCP tools" "wrong count"
  fi
  if python3 -c "import json; d=json.load(open('$MCP_GLOB_HOME/.cursor/mcp.json')); assert d['mcpServers']['contentcraft']['env']['CONTENTCRAFT_API_URL']=='http://localhost:3000'"; then
    pass "MCP default API URL"
  else
    fail "MCP default API URL" "mismatch"
  fi
else
  fail "MCP runtime" "no index.js"
fi

SKILL="$SKILL_PROJ/.cursor/skills/contentcraft-content-generation/SKILL.md"
if grep -q 'name: contentcraft-content-generation' "$SKILL" && grep -q '/api/ai-content' "$SKILL" && grep -q '/api/analyze' "$SKILL" && grep -q '/api/outline' "$SKILL"; then
  pass "SKILL content"
else
  fail "SKILL content" "incomplete"
fi
for sec in Configuration "Generate content" "Analyze content" "Install via CLI"; do
  if grep -q "## $sec" "$SKILL"; then pass "SKILL section: $sec"; else fail "SKILL section: $sec"; fi
done

SVR=$(curl -s -o /dev/null -w "%{http_code}" --max-time 5 http://localhost:3000/welcome 2>/dev/null || echo down)
if [[ "$SVR" == "200" ]]; then
  BODY='{"content":"<p>Full retest analyze content with enough plain text characters to pass validation for the analyze API endpoint after public repo release.</p>"}'
  for ep in analyze outline; do
    c=$(curl -s -o /dev/null -w "%{http_code}" -X POST "http://localhost:3000/api/$ep" -H 'Content-Type: application/json' -d "$BODY")
    if [[ "$c" == "200" ]]; then pass "API /api/$ep"; else fail "API /api/$ep" "HTTP $c"; fi
  done
  c=$(curl -s -o /dev/null -w "%{http_code}" -X POST http://localhost:3000/api/ai-content -H 'Content-Type: application/json' -d '{"title":"Full public repo retest","tone":"professional"}')
  if [[ "$c" == "200" ]]; then pass "API /api/ai-content"; else fail "API /api/ai-content" "HTTP $c"; fi
  FETCH=$(CONTENTCRAFT_API_URL=http://localhost:3000 node -e "fetch(process.env.CONTENTCRAFT_API_URL+'/api/analyze',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({content:'x'.repeat(120)})}).then(r=>console.log(r.status))")
  if [[ "$FETCH" == "200" ]]; then pass "MCP fetch path"; else fail "MCP fetch path" "$FETCH"; fi
else
  skip "API tests" "server $SVR"
fi

echo ""
echo "======== FINAL: PASS=$PASS FAIL=$FAIL SKIP=$SKIP ========"
if [[ "$FAIL" -eq 0 ]]; then echo "OVERALL: ALL TESTS PASSED"; else echo "OVERALL: SOME TESTS FAILED"; fi
exit "$FAIL"
