from pathlib import Path
import hashlib
import json
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[1]
MANIFEST_PATH = ROOT / "fixtures" / "FIXTURE_MANIFEST.json"

def git(path: Path, *args: str) -> str:
    """Run a read-only Git command while trusting only this fixture path.

    Avoids CI/container "dubious ownership" failures without mutating
    global Git configuration.
    """
    command = [
        "git",
        "-c", f"safe.directory={path}",
        "-C", str(path),
        *args,
    ]
    return subprocess.check_output(
        command,
        text=True,
        stderr=subprocess.STDOUT,
    ).strip()

def git_head(path: Path) -> str:
    return git(path, "rev-parse", "HEAD")

def tree_hash(path: Path) -> str:
    h = hashlib.sha256()
    for file_path in sorted(
        p for p in path.rglob("*")
        if p.is_file() and ".git" not in p.parts
    ):
        rel = file_path.relative_to(path).as_posix()
        h.update(rel.encode())
        h.update(b"\0")
        h.update(file_path.read_bytes())
        h.update(b"\0")
    return h.hexdigest()

manifest = json.loads(MANIFEST_PATH.read_text())
errors = []

for name, expected in manifest["fixtures"].items():
    fixture = ROOT / "fixtures" / name

    if not fixture.exists():
        errors.append(f"{name}: fixture directory missing")
        continue

    if not (fixture / "package-lock.json").exists():
        errors.append(f"{name}: package-lock.json missing")

    try:
        status = git(fixture, "status", "--porcelain")
        actual_revision = git_head(fixture)
    except subprocess.CalledProcessError as exc:
        errors.append(
            f"{name}: Git inspection failed\n"
            f"{exc.output.strip() if exc.output else exc}"
        )
        continue

    if status:
        errors.append(f"{name}: working tree is dirty:\n{status}")

    if actual_revision != expected["git_revision"]:
        errors.append(
            f"{name}: revision mismatch\n"
            f"  expected: {expected['git_revision']}\n"
            f"  actual:   {actual_revision}"
        )

    actual_hash = tree_hash(fixture)
    if actual_hash != expected["content_sha256_excluding_git"]:
        errors.append(
            f"{name}: content hash mismatch\n"
            f"  expected: {expected['content_sha256_excluding_git']}\n"
            f"  actual:   {actual_hash}"
        )

    if expected.get("dependency_lock") != "package-lock.json frozen and committed":
        errors.append(
            f"{name}: manifest does not mark dependency lock as frozen and committed"
        )

if manifest.get("baseline_blocker") is not None:
    errors.append(
        f"manifest baseline_blocker is not cleared: {manifest['baseline_blocker']}"
    )

if errors:
    print("Fixture integrity check FAILED:\n")
    for error in errors:
        print(f"- {error}")
    sys.exit(1)

print("Fixture integrity check PASSED.")
for name, expected in manifest["fixtures"].items():
    print(f"- {name}: {expected['git_revision']}")
