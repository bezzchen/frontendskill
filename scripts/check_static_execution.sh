#!/usr/bin/env bash
# M6 — static correctness checks for a Layer C run directory (no browser required).
# Usage: ./scripts/check_static_execution.sh <run-repo-dir> [I2|I5]
set -uo pipefail

DIR="${1:?usage: check_static_execution.sh <run-repo-dir> [I2|I5]}"
CASE="${2:-}"
SRC=$(find "$DIR/app" "$DIR/components" -type f \( -name '*.jsx' -o -name '*.js' -o -name '*.tsx' -o -name '*.ts' \) 2>/dev/null)
fail=0
note() { printf '%-34s %s\n' "$1" "$2"; }

if [ -z "$SRC" ]; then echo "ERROR: no source files under $DIR"; exit 1; fi

# --- Version correctness (I2 / Anime.js only): v3 patterns are an automatic run failure ---
if [ "$CASE" = "I2" ]; then
  v3=$(grep -nE "anime\(\{|easing:|\.timeline\(|^import +anime +from|require\(['\"]animejs['\"]\)" $SRC 2>/dev/null)
  if [ -n "$v3" ]; then
    note "M6 anime-v4-version-correct" "FAIL"; echo "$v3" | sed 's/^/    /'; fail=1
  else
    note "M6 anime-v4-version-correct" "PASS"
  fi
fi

# --- Always-on interval render loop ---
if grep -nE "setInterval\(" $SRC >/dev/null 2>&1; then
  note "M6 no-interval-render-loop" "REVIEW (setInterval present)"
  grep -nE "setInterval\(" $SRC | sed 's/^/    /'
else
  note "M6 no-interval-render-loop" "PASS"
fi

# --- Cleanup path present in effects that own a loop/instance ---
owners=$(grep -lE "requestAnimationFrame|new Application|createScope|createTimer|createDraggable|WebGLRenderingContext|getContext\(" $SRC 2>/dev/null)
if [ -n "$owners" ]; then
  missing=""
  for f in $owners; do grep -qE "return \(\) =>|\.destroy\(|\.revert\(|cancelAnimationFrame" "$f" || missing="$missing $f"; done
  if [ -n "$missing" ]; then
    note "M6 cleanup-path-present" "FAIL"; for m in $missing; do echo "    no teardown in $m"; done; fail=1
  else
    note "M6 cleanup-path-present" "PASS"
  fi
else
  note "M6 cleanup-path-present" "NOT_MEASURED (no loop/instance owner found)"
fi

# --- Dependency drift vs the pinned specialist ---
case "$CASE" in
  I2) pin="animejs"; want="4." ;;
  I5) pin="pixi.js"; want="8." ;;
  *)  pin=""; want="" ;;
esac
if [ -n "$pin" ]; then
  ver=$(node -e "try{const p=require('$DIR/package.json');console.log((p.dependencies||{})['$pin']||'MISSING')}catch(e){console.log('NO_PACKAGE_JSON')}")
  case "$ver" in
    *"$want"*) note "M6 pinned-$pin" "PASS ($ver)" ;;
    *) note "M6 pinned-$pin" "FAIL ($ver)"; fail=1 ;;
  esac
fi

# --- Build ---
if (cd "$DIR" && npm ci --no-audit --no-fund >/dev/null 2>&1 && npx next build >/tmp/lcbuild.log 2>&1); then
  note "M6 build" "PASS"
else
  note "M6 build" "FAIL (see /tmp/lcbuild.log)"; tail -5 /tmp/lcbuild.log | sed 's/^/    /'; fail=1
fi

echo
[ "$fail" -eq 0 ] && echo "M6 static checks: PASS" || echo "M6 static checks: FAIL"
exit "$fail"
