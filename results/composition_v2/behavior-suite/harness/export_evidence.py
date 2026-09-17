#!/usr/bin/env python3
"""Copy final development evidence, excluding dependencies and browser profiles."""
import argparse
import hashlib
import json
from pathlib import Path
import shutil

parser=argparse.ArgumentParser()
parser.add_argument('destination',type=Path)
args=parser.parse_args()
source=Path(__file__).resolve().parents[1]
destination=args.destination.resolve()
if destination.exists():
    raise SystemExit('Use a new destination; never overwrite archived evidence.')
summary=json.loads((source/'summary.json').read_text())
if summary.get('execution_record_status')!='complete':
    raise SystemExit('Final summary required before export.')
excluded={'node_modules','.git','__pycache__','.pytest_cache','.cache','.DS_Store'}
selected=[*sorted(source.glob('D*')),source/'harness',source/'summary.json',source/'README.md']
manifest={}
skipped=[]
def copy_file(path):
    relative=path.relative_to(source)
    if any(part in excluded or part.startswith(('native-profile-','chromium-profile-','browser-profile-')) for part in relative.parts):
        return
    if 'in-progress' in path.name:
        return
    if path.is_symlink():
        skipped.append(str(relative))
        return
    target=destination/relative
    target.parent.mkdir(parents=True,exist_ok=True)
    shutil.copy2(path,target)
    digest=hashlib.sha256(path.read_bytes()).hexdigest()
    if hashlib.sha256(target.read_bytes()).hexdigest()!=digest:
        raise RuntimeError('Copy mismatch: '+str(relative))
    manifest[str(relative)]=digest
for root in selected:
    if root.is_dir():
        for path in sorted(root.rglob('*')):
            if path.is_file() or path.is_symlink():
                copy_file(path)
    elif root.is_file():
        copy_file(root)
(destination/'archive-manifest.json').write_text(json.dumps({'file_sha256':manifest,'skipped_symlinks':skipped,'exclusions':sorted(excluded),'note':'Generated artifact and raw evidence bytes copied unchanged. Machine-specific original paths remain in logs; browser profiles/dependencies excluded.'},indent=2)+'\n')
print(json.dumps({'destination':str(destination),'files':len(manifest),'bytes':sum((destination/p).stat().st_size for p in manifest),'skipped_symlinks':skipped}))
