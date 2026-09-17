#!/usr/bin/env python3
"""Check installable package structure, not skill behavior or source availability.

Only SKILL.md and references/*.md are runtime Markdown. This deliberately does
not traverse repository docs, historical protocols, README files or upstream
source paths. Uses a small parser for the package's ordinary Markdown links and
scalar frontmatter; it is not a general YAML/CommonMark validator.
"""
import argparse
import json
from pathlib import Path, PurePosixPath
import re
import sys
from urllib.parse import unquote, urlsplit

DEFAULT_PACKAGE = Path(__file__).resolve().parents[1] / 'skill' / 'creative-frontend-architect'


def markdown_targets(text):
    # Ignore fenced examples and inline code before finding inline/reference links.
    text = re.sub(r'^\s*(`{3,}|~{3,})[^\n]*\n.*?^\s*\1\s*$', '', text, flags=re.M | re.S)
    text = re.sub(r'`+[^`\n]*`+', '', text)
    pattern = r'\]\(\s*(<[^>]+>|[^\s)]+)|^\s*\[[^\]]+\]:\s*(<[^>]+>|\S+)'
    for match in re.finditer(pattern, text, re.M):
        yield (match.group(1) or match.group(2)).strip('<>')


def validate_package(folder):
    root = Path(folder).resolve()
    errors = []

    def reject(message):
        errors.append(message)

    def packaged_path(value, label, base=root):
        if not isinstance(value, str) or not value.strip():
            reject(f'{label}: required relative file path')
            return None
        if Path(value).is_absolute() or urlsplit(value).scheme or '\\' in value:
            reject(f'{label}: path escapes package or is not relative: {value}')
            return None
        try:
            path = (base / value).resolve()
            path.relative_to(root)
        except (ValueError, OSError, RuntimeError):
            reject(f'{label}: path escapes package: {value}')
            return None
        if not path.is_file():
            reject(f'{label}: missing file: {value}')
            return None
        return path

    def read_file(path):
        try:
            return path.read_text(encoding='utf-8')
        except (OSError, UnicodeError) as error:
            reject(f'{path.name}: cannot read: {error}')
            return ''

    skill = packaged_path('SKILL.md', 'entrypoint')
    if skill:
        text = read_file(skill)
        front = re.match(r'\A---\s*\n(.*?)\n---\s*(?:\n|$)', text, re.S)
        if not front:
            reject('SKILL.md: required frontmatter with name and description')
        else:
            for field in ('name', 'description'):
                found = re.findall(rf'^{field}:[ \t]*([^\n]*)$', front.group(1), re.M)
                if len(found) != 1 or found[0].strip().strip('\'"') in ('', 'null', '~', '>', '|'):
                    reject(f'SKILL.md: required nonempty scalar frontmatter {field}')

    runtime = [skill] if skill else []
    refs = root / 'references'
    if refs.exists():
        # Check all reference paths, including unreferenced escaping symlinks.
        for path in [refs, *refs.rglob('*')]:
            try:
                path.resolve().relative_to(root)
            except (ValueError, OSError, RuntimeError):
                reject(f'references: path escapes package: {path.relative_to(root)}')
                continue
            if path.is_file() and path.suffix == '.md' and path.name.lower() != 'readme.md':
                runtime.append(path)
    for path in runtime:
        for target in markdown_targets(read_file(path)):
            parsed = urlsplit(target)
            # Filesystem/editor URIs cannot be portable package dependencies.
            if parsed.scheme.lower() in {'file', 'filesystem', 'vscode', 'vscode-insiders'}:
                reject(f'{path.relative_to(root)}: local filesystem URI is not a portable relative link: {target}')
                continue
            if parsed.scheme or parsed.netloc or not parsed.path:
                continue
            packaged_path(unquote(parsed.path), str(path.relative_to(root)), path.parent)

    manifest_path = packaged_path('integrations.lock.json', 'manifest')
    if not manifest_path:
        return errors
    try:
        manifest = json.loads(read_file(manifest_path))
    except json.JSONDecodeError as error:
        reject(f'integrations.lock.json: invalid JSON: {error.msg}')
        return errors
    if not isinstance(manifest, dict):
        reject('integrations.lock.json: must be an object')
        return errors
    for key, expected in [('path_base', 'skill-directory'), ('source_paths_base', 'upstream-repository')]:
        if manifest.get(key) != expected:
            reject(f'manifest {key}: expected {expected}')
    if not isinstance(manifest.get('schema_version'), str) or not manifest['schema_version']:
        reject('manifest: required schema_version')
    ids = set()
    for section in ('integrations', 'methodology_references'):
        entries = manifest.get(section, [] if section == 'methodology_references' else None)
        if not isinstance(entries, list) or (section == 'integrations' and not entries):
            reject(f'{section}: required nonempty list' if section == 'integrations' else f'{section}: must be a list')
            continue
        for index, entry in enumerate(entries):
            label = f'{section}[{index}]'
            if not isinstance(entry, dict):
                reject(f'{label}: must be an object')
                continue
            for field in ('id', 'role', 'source_url', 'source_revision', 'compatibility_status'):
                if not isinstance(entry.get(field), str) or not entry[field].strip():
                    reject(f'{label}: required {field}')
            identity = entry.get('id')
            if isinstance(identity, str):
                if identity in ids:
                    reject(f'{label}: duplicate id {identity}')
                ids.add(identity)
            if not re.fullmatch(r'[0-9a-f]{40}', str(entry.get('source_revision', ''))):
                reject(f'{label}: source_revision must be a full 40-character commit pin')
            source_url = entry.get('source_url')
            if not isinstance(source_url, str) or not source_url.startswith('https://') or not urlsplit(source_url).netloc:
                reject(f'{label}: source_url must be an absolute https URL')
            sources = entry.get('source_paths')
            if not isinstance(sources, list) or not sources:
                reject(f'{label}: source_paths must be a nonempty list')
                sources = []
            seen_sources = set()
            for source in sources:
                if not isinstance(source, str) or not source or PurePosixPath(source).is_absolute() or '..' in PurePosixPath(source).parts or '\\' in source:
                    reject(f'{label}: invalid upstream source path')
                    continue
                if source in seen_sources:
                    reject(f'{label}: duplicate source path {source}')
                seen_sources.add(source)
            packaged_path(entry.get('adapter_path'), f'{label} adapter_path')
            if not isinstance(entry.get('tested_hosts'), list):
                reject(f'{label}: tested_hosts must be a list')
            hashes = entry.get('source_hashes', {})
            if not isinstance(hashes, dict) or (section == 'integrations' and not hashes):
                reject(f'{label}: source_hashes must contain pinned sha256 values')
                hashes = {}
            for source, pin in hashes.items():
                if source not in seen_sources:
                    reject(f'{label}: hash for undeclared source {source}')
                if not isinstance(pin, dict) or pin.get('algorithm') != 'sha256' or not re.fullmatch(r'[0-9a-f]{64}', str(pin.get('value', ''))):
                    reject(f'{label}: invalid sha256 pin for {source}')
            if section == 'integrations':
                for field in ('prerequisites', 'decision_scope'):
                    if not isinstance(entry.get(field), list):
                        reject(f'{label}: {field} must be a list')
                fallback = entry.get('fallback')
                if not isinstance(fallback, dict) or not fallback.get('id') or not fallback.get('behavior'):
                    reject(f'{label}: required fallback identity and behavior')
                if isinstance(fallback, dict):
                    packaged_path(fallback.get('reference_path'), f'{label} fallback reference_path')
                attribution = entry.get('attribution')
                if not isinstance(attribution, dict):
                    reject(f'{label}: required attribution object')
                else:
                    for field in ('author', 'work', 'license'):
                        if not isinstance(attribution.get(field), str) or not attribution[field].strip():
                            reject(f'{label}: required attribution {field}')
                    packaged_path(attribution.get('license_path'), f'{label} attribution license_path')
            elif not entry.get('attribution'):
                reject(f'{label}: required attribution')
    return errors


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('folder', nargs='?', type=Path, default=DEFAULT_PACKAGE)
    args = parser.parse_args()
    try:
        errors = validate_package(args.folder)
    except (OSError, ValueError, RuntimeError) as error:
        errors = [f'cannot inspect package: {error}']
    if errors:
        for error in errors:
            print(f'FAIL: {error}', file=sys.stderr)
        return 1
    print(f'PASS: package structure valid: {args.folder.resolve()}')
    return 0


if __name__ == '__main__':
    sys.exit(main())
