# Package validator implementation report

Status: DONE. No commits. Ownership limited to `scripts/check_skill_package.py` and `tests/test_skill_package.py` in the experimental checkout; all other agents' changes preserved.

## Implementation

Added a dependency-free Python CLI, `python3 scripts/check_skill_package.py [folder]`. Omitted folder defaults to this checkout's `skill/creative-frontend-architect` directory. Exit status is 0 for structurally valid packages and 1 with actionable errors for invalid packages.

Checks required scalar SKILL frontmatter (`name`, `description`), runtime Markdown link targets in SKILL/references, resolved path confinement including symlinks, manifest JSON shape and identity fields, unique integration/methodology IDs, full 40-character source revisions, SHA-256 source pins belonging to declared source paths, and packaged adapter/fallback/license files. Preserves the existing distinction between supported integrations (source hash/fallback/license required) and provenance-only methodology references (no fabricated runtime source hash requirement). Upstream source paths are repository-relative identities, not assumed to be bundled files.

README and repository/historical documentation are excluded from runtime Markdown traversal. External URLs and fragment links are not fetched; fenced/inline code examples are not treated as dependencies. Actual source bytes, licenses and runtime behavior are not certified by a structural pass.

## Validation

Used test-first development: initial CLI test failed because implementation was absent; expanded failure cases failed before implementation. Later a dedicated empty-frontmatter test reproduced an accidental newline-consumption bug before its fix.

Final commands:

- `python3 -m unittest discover -s work/frontendskill-v2/tests -p test_skill_package.py`: **17 tests passed**.
- `python3 work/frontendskill-v2/scripts/check_skill_package.py`: **PASS** against actual package via default path.
- `python3 work/frontendskill-v2/scripts/check_skill_package.py work/frontendskill-v2/skill/creative-frontend-architect`: **PASS** via explicit folder argument.
- `git diff --check`: **passed**.

Tests use freshly copied minimal packages in temporary directories, not network calls or design-prose assertions. Coverage includes a complete copy, SKILL-only copy, missing linked reference, escaped relative path, escaped symlink, manifest license escape, malformed JSON/revision/hash, undeclared hash source, duplicate IDs, missing/empty frontmatter, missing identity, wrong entry type without traceback, reference-style Markdown links, and exclusion of README/external links/code examples.

## Limits

This is intentionally a small parser for the package's ordinary Markdown links and scalar frontmatter, not a general CommonMark/YAML validator or JSON Schema framework. It does not download upstream snapshots, prove source license authenticity, validate anchor names, execute skill behavior, assess visual quality or certify activation. No application builds or efficacy tests ran.

## Review fix: local filesystem URI bypass

Independent review identified that a runtime Markdown link using `file:` bypassed containment because all URI schemes were treated as external. Added a regression test covering `file`, `filesystem`, `vscode` and `vscode-insiders`; all four subcases failed before the fix. The validator now rejects those filesystem/editor URI forms as nonportable runtime dependencies, while external HTTP, HTTPS and mailto links remain accepted.

Validation after the fix:

- `python3 -m unittest discover -s work/frontendskill-v2/tests -p test_skill_package.py`: **18 tests passed**, including four local-URI subcases.
- `python3 work/frontendskill-v2/scripts/check_skill_package.py`: **actual package passed**.
- `git diff --check`: **passed**.

No commits. Only the assigned validator and tests changed in the repository.
