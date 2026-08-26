#!/usr/bin/env bash
# Restore the fixtures' Git metadata after cloning this repository.
#
# The three fixtures under fixtures/ are themselves Git repositories, pinned to exact SHAs that
# scripts/verify_fixture_manifest.py checks with `git rev-parse HEAD`. Git cannot track a nested
# .git directory as ordinary files, so each one is stored here as `dot-git/` and renamed back by
# this script. Idempotent: safe to run more than once.
set -euo pipefail
cd "$(dirname "$0")/.."
restored=0
for fixture in fixtures/*/; do
  if [ -d "${fixture}dot-git" ] && [ ! -d "${fixture}.git" ]; then
    mv "${fixture}dot-git" "${fixture}.git"
    echo "restored ${fixture}.git"
    restored=$((restored + 1))
  fi
done
if [ "$restored" -eq 0 ]; then
  echo "nothing to restore (fixtures already have .git)"
fi
echo
echo "verifying fixture integrity..."
python3 scripts/verify_fixture_manifest.py
