#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
FIXTURES=(
  "$ROOT/fixtures/next-tailwind-base"
  "$ROOT/fixtures/anime-v4-portfolio"
  "$ROOT/fixtures/launch-page-base"
)

for dir in "${FIXTURES[@]}"; do
  echo "Freezing dependencies: $dir"
  npm --prefix "$dir" install --package-lock-only --ignore-scripts --no-audit --no-fund
  git -C "$dir" add package-lock.json
  if ! git -C "$dir" diff --cached --quiet; then
    git -C "$dir" commit -m "Freeze dependency lock for official eval"
  fi
done

python3 "$ROOT/scripts/write_fixture_manifest.py"

echo
echo "Dependency locks frozen. Record the new fixture revisions before Phase 0."
