#!/usr/bin/env python3
"""Fresh development-run capture. Not an efficacy harness or token-cap enforcer."""
import argparse
import datetime as dt
import hashlib
import json
import os
from pathlib import Path
import shutil
import signal
import subprocess
import time

ROOT = Path(__file__).resolve().parents[3]
SKILL = Path(__file__).resolve().parent / 'candidate/creative-frontend-architect'
SOURCE = ROOT / 'work/v2-implementation/sources/frontend-design/SKILL.md'

def manifest(root):
    return {str(p.relative_to(root)): hashlib.sha256(p.read_bytes()).hexdigest()
            for p in sorted(root.rglob('*')) if p.is_file()
            and not set(p.relative_to(root).parts) & {'node_modules', '.git', '__pycache__', 'dist'}}

def write(path, data):
    path.write_text(json.dumps(data, indent=2) + '\n')

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--fixture', type=Path, required=True)
    parser.add_argument('--out', type=Path, required=True)
    parser.add_argument('--prompt', type=Path, required=True)
    parser.add_argument('--mode', choices=['explicit', 'natural-selection', 'review', 'correction'], required=True)
    parser.add_argument('--source', choices=['prepared', 'missing'], default='prepared')
    parser.add_argument('--seconds', type=int, default=1200)
    parser.add_argument('--prepare-only', action='store_true')
    parser.add_argument('--reuse-workspace', action='store_true')
    args = parser.parse_args()
    out = args.out.resolve()
    out.mkdir(parents=True, exist_ok=True)
    workspace = out / 'workspace'
    if workspace.exists() and not args.reuse_workspace:
        parser.error('Output workspace exists; use a new run ID or explicitly reuse for preparation.')
    if not workspace.exists():
        shutil.copytree(args.fixture.resolve(), workspace, ignore=shutil.ignore_patterns('node_modules', '.git', '__pycache__', 'dist'))
        installed = workspace / '.agents/skills/creative-frontend-architect'
        shutil.copytree(SKILL, installed)
        if args.source == 'prepared':
            (workspace / '.sources/frontend-design').mkdir(parents=True)
            shutil.copy2(SOURCE, workspace / '.sources/frontend-design/SKILL.md')
    selected_source = workspace / ('.sources/frontend-design/SKILL.md' if args.source == 'prepared' else '.sources/absent-frontend-design/SKILL.md')
    prompt = args.prompt.read_text()
    if args.mode == 'explicit':
        prompt = 'Use the creative-frontend-architect skill to complete this request.\n\n' + prompt
    (out / 'prompt.txt').write_text(prompt)
    write(out / 'fixture-manifest.json', manifest(args.fixture.resolve()))
    write(out / 'initial-workspace-manifest.json', manifest(workspace))
    installed = workspace / '.agents/skills/creative-frontend-architect'
    check = subprocess.run(['python3', str(ROOT / 'work/frontendskill-v2/scripts/check_skill_package.py'), str(installed)], capture_output=True, text=True)
    (out / 'package-check.txt').write_text(check.stdout + check.stderr)
    if check.returncode:
        raise SystemExit(check.returncode)
    neutral = '\n\n## Local execution environment\nWork in this project only; other projects, research and evaluation records are outside this task. Use the installed project and host guidance as relevant. Do not publish, push, or install skills globally. The environment variable CFA_ANTHROPIC_SOURCE, when relevant, resolves to `' + str(selected_source) + '`. Complete implementation and record actual checks and limitations in work-log.md. Browser launch and local servers may need the normal sandbox approval mechanism.\n'
    agent_file = workspace / 'AGENTS.md'
    if not args.reuse_workspace:
        agent_file.write_text((agent_file.read_text() if agent_file.exists() else '') + neutral)
    write(out / 'dispatch-workspace-manifest.json', manifest(workspace))
    cmd = ['codex', 'exec', '--ignore-user-config', '--ephemeral', '--skip-git-repo-check', '--approve-for-me', '-m', 'gpt-6-astra', '-c', 'model_reasoning_effort="high"', '-C', str(workspace), '--json', '-o', str(out / 'final.md'), '-']
    meta = {'mode': args.mode, 'model_alias': 'gpt-6-astra', 'model_snapshot': None, 'effort': 'high', 'candidate_commit': '12f509e61d8aa15de2bfcc54195a7def07bda0a8', 'harness_sha256': hashlib.sha256(Path(__file__).read_bytes()).hexdigest(), 'command': cmd, 'wall_cap_seconds': args.seconds, 'token_cap': None, 'source_path': str(selected_source), 'source_sha256': hashlib.sha256(selected_source.read_bytes()).hexdigest() if selected_source.exists() else None, 'host_config_ignored': True, 'global_skills_and_hooks_still_present': True, 'isolation': 'fresh CLI context; project-only task instruction, not an OS read barrier', 'whole_workflow_tokens': None}
    write(out / 'execution.json', meta)
    if args.prepare_only:
        print(workspace, flush=True)
        return
    env = os.environ.copy()
    env['CFA_ANTHROPIC_SOURCE'] = str(selected_source)
    start = time.monotonic()
    meta['started_at'] = dt.datetime.now(dt.timezone.utc).isoformat()
    with (out / 'trace.jsonl').open('w') as trace, (out / 'stderr.txt').open('w') as err:
        proc = subprocess.Popen(cmd, stdin=subprocess.PIPE, stdout=trace, stderr=err, cwd=workspace, env=env, text=True, start_new_session=True)
        try:
            proc.communicate(prompt, timeout=args.seconds)
            meta['terminal_status'] = 'completed' if proc.returncode == 0 else 'tool-failed'
        except subprocess.TimeoutExpired:
            os.killpg(proc.pid, signal.SIGTERM)
            try:
                proc.wait(timeout=10)
            except subprocess.TimeoutExpired:
                os.killpg(proc.pid, signal.SIGKILL)
                proc.wait()
            meta['terminal_status'] = 'timeout'
    meta['exit_code'] = proc.returncode
    meta['elapsed_seconds'] = round(time.monotonic() - start, 2)
    meta['finished_at'] = dt.datetime.now(dt.timezone.utc).isoformat()
    usages = []
    for line in (out / 'trace.jsonl').read_text().splitlines():
        try:
            event = json.loads(line)
            if event.get('type') == 'turn.completed':
                usages.append(event.get('usage'))
        except ValueError:
            pass
    meta['parent_usage_events'] = usages
    meta['whole_workflow_tokens_reason'] = 'Parent usage may exclude delegated agents; do not infer total without accounting audit.'
    write(out / 'execution.json', meta)
    write(out / 'final-workspace-manifest.json', manifest(workspace))
    print(json.dumps({'out': str(out), 'status': meta['terminal_status'], 'elapsed_seconds': meta['elapsed_seconds']}), flush=True)

if __name__ == '__main__':
    main()
