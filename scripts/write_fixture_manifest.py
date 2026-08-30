"""AUTHORING-ONLY utility.

This script rewrites expected fixture revisions/hashes after an intentional fixture change.
Never call it from integrity verification or during an eval run.
"""

from pathlib import Path
import hashlib, json, subprocess

root = Path(__file__).resolve().parents[1]

def git_head(path):
    return subprocess.check_output(["git", "-C", str(path), "rev-parse", "HEAD"], text=True).strip()

def tree_hash(path):
    h = hashlib.sha256()
    for f in sorted(p for p in path.rglob("*") if p.is_file() and ".git" not in p.parts):
        rel = f.relative_to(path).as_posix()
        h.update(rel.encode()); h.update(b"\0")
        h.update(f.read_bytes()); h.update(b"\0")
    return h.hexdigest()

manifest_path = root / "fixtures" / "FIXTURE_MANIFEST.json"
old = json.loads(manifest_path.read_text())
for name in ["next-tailwind-base", "anime-v4-portfolio", "launch-page-base", "spirits-launch-base"]:
    p = root / "fixtures" / name
    old["fixtures"][name]["git_revision"] = git_head(p)
    old["fixtures"][name]["content_sha256_excluding_git"] = tree_hash(p)
    old["fixtures"][name]["dependency_lock"] = "package-lock.json frozen and committed" if (p/"package-lock.json").exists() else "MISSING"
old["baseline_blocker"] = None if all((root/"fixtures"/n/"package-lock.json").exists() for n in old["fixtures"]) else old["baseline_blocker"]
manifest_path.write_text(json.dumps(old, indent=2) + "\n")
print(manifest_path)
