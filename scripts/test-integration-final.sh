#!/usr/bin/env bash
# Final integration test suite — MCP + Skill (jsDelivr + clone paths)
set -uo pipefail
export PATH="/usr/local/bin:/opt/homebrew/bin:/usr/bin:/bin:/usr/sbin:/sbin"

INSTALL_URL="https://cdn.jsdelivr.net/gh/khatridhruv-1/ContentCraft-Inspector@master/scripts/install-integration.sh"
REPO="https://github.com/khatridhruv-1/ContentCraft-Inspector.git"
TEST_BASE=$(mktemp -d /tmp/cc-final-suite-XXXXXX)
PASS=0
FAIL=0
SKIP=0

pass() { PASS=$((PASS + 1)); echo "PASS: $1"; }
fail() { FAIL=$((FAIL + 1)); echo "FAIL: $1${2:+ — $2}"; }
skip() { SKIP=$((SKIP + 1)); echo "SKIP: $1${2:+ — $2}"; }

echo "======== ContentCraft Integration Final Suite ========"
echo "TEST_BASE=$TEST_BASE"
echo ""

# URL delivery
body=$(curl -fsSL "$INSTALL_URL")
if echo "$body" | grep -q 'CLONE_TMP_DIR' && ! echo "$body" | grep -q 'local tmp'; then
  pass "jsDelivr script has fix"
else
  fail "jsDelivr script content"
fi

raw_master=$(curl -fsSL "https://raw.githubusercontent.com/khatridhruv-1/ContentCraft-Inspector/master/scripts/install-integration.sh" 2>/dev/null || true)
if echo "$raw_master" | grep -q 'CLONE_TMP_DIR'; then
  pass "raw.githubusercontent master (cache may have updated)"
elif echo "$raw_master" | grep -q 'local tmp'; then
  skip "raw.githubusercontent master" "still cached old script — use jsDelivr"
else
  fail "raw.githubusercontent master" "unexpected content"
fi

# MCP jsDelivr global
MCP_HOME=$(mktemp -d "$TEST_BASE/mcp-global-XXXXXX")
out=$(mktemp)
if HOME="$MCP_HOME" bash -c "curl -fsSL '$INSTALL_URL' | bash -s -- mcp --global" >"$out" 2>&1; then
  if grep -q 'tmp: unbound variable' "$out"; then fail "MCP jsDelivr no tmp error" "unbound variable seen"; else pass "MCP jsDelivr no tmp error"; fi
  if [[ -f "$MCP_HOME/.cursor/mcp.json" && -f "$MCP_HOME/.cursor/contentcraft-mcp/index.js" && -d "$MCP_HOME/.cursor/contentcraft-mcp/node_modules/@modelcontextprotocol/sdk" ]]; then
    pass "MCP jsDelivr --global install"
  else
    fail "MCP jsDelivr --global install" "missing files"
  fi
else
  fail "MCP jsDelivr --global install" "$(tail -2 "$out")"
fi

# Skill jsDelivr project
SKILL_PROJ=$(mktemp -d "$TEST_BASE/skill-proj-XXXXXX")
cd "$SKILL_PROJ"
if bash -c "curl -fsSL '$INSTALL_URL' | bash -s -- skill --project" >"$out" 2>&1; then
  if grep -q 'tmp: unbound variable' "$out"; then fail "Skill jsDelivr no tmp error"; else pass "Skill jsDelivr no tmp error"; fi
  if [[ -f "$SKILL_PROJ/.cursor/skills/contentcraft-content-generation/SKILL.md" ]]; then
    pass "Skill jsDelivr --project install"
  else
    fail "Skill jsDelivr --project install"
  fi
else
  fail "Skill jsDelivr --project install" "$(tail -2 "$out")"
fi

# Clone paths
CLONE=$(mktemp -d "$TEST_BASE/clone-XXXXXX")
git clone --depth 1 -b master "$REPO" "$CLONE/repo" -q && pass "git clone master" || fail "git clone master"
INST="$CLONE/repo/scripts/install-integration.sh"

MCP_P=$(mktemp -d "$TEST_BASE/mcp-proj-XXXXXX")
cd "$MCP_P" && bash "$INST" mcp --project -q 2>/dev/null || bash "$INST" mcp --project >/dev/null 2>&1
[[ -f "$MCP_P/.cursor/mcp.json" ]] && pass "clone mcp --project" || fail "clone mcp --project"

SKILL_GH=$(mktemp -d "$TEST_BASE/skill-global-XXXXXX")
HOME="$SKILL_GH" bash "$INST" skill --global >/dev/null 2>&1
[[ -f "$SKILL_GH/.cursor/skills/contentcraft-content-generation/SKILL.md" ]] && pass "clone skill --global" || fail "clone skill --global"

# MCP runtime
MCP_IDX="$MCP_HOME/.cursor/contentcraft-mcp/index.js"
node --check "$MCP_IDX" && pass "MCP syntax" || fail "MCP syntax"
[[ "$(grep -cE "name: '(generate_content|analyze_content|create_outline)'" "$MCP_IDX")" -eq 3 ]] && pass "MCP 3 tools" || fail "MCP 3 tools"

SKILL="$SKILL_PROJ/.cursor/skills/contentcraft-content-generation/SKILL.md"
grep -q 'contentcraft-content-generation' "$SKILL" && grep -q '/api/ai-content' "$SKILL" && pass "Skill API docs" || fail "Skill API docs"

# APIs
SVR=$(curl -s -o /dev/null -w "%{http_code}" --max-time 5 http://localhost:3000/welcome 2>/dev/null || echo down)
if [[ "$SVR" == "200" ]]; then
  BODY='{"content":"<p>Final suite test content with enough plain text characters to pass analyze validation requirements for integration testing today.</p>"}'
  for ep in analyze outline; do
    c=$(curl -s -o /dev/null -w "%{http_code}" -X POST "http://localhost:3000/api/$ep" -H 'Content-Type: application/json' -d "$BODY")
    [[ "$c" == "200" ]] && pass "API /api/$ep" || fail "API /api/$ep" "HTTP $c"
  done
  c=$(curl -s -o /dev/null -w "%{http_code}" -X POST http://localhost:3000/api/ai-content -H 'Content-Type: application/json' -d '{"title":"Final suite test","tone":"professional"}')
  [[ "$c" == "200" ]] && pass "API /api/ai-content" || fail "API /api/ai-content" "HTTP $c"
else
  skip "API tests" "server not on :3000"
fi

echo ""
echo "======== SUMMARY: PASS=$PASS FAIL=$FAIL SKIP=$SKIP ========"
[[ "$FAIL" -eq 0 ]] && echo "OVERALL: PASS" || echo "OVERALL: FAIL"
exit "$FAIL"
