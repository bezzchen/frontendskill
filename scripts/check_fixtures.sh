#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# Intentionally read-only. Never rewrite expected fixture state here.
python3 "$ROOT/scripts/verify_fixture_manifest.py"
