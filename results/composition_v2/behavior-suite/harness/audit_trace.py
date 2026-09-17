#!/usr/bin/env python3
"""Extract trace evidence for human audit. Matches are not pass/fail judgments."""
import argparse
import json
from pathlib import Path

parser = argparse.ArgumentParser()
parser.add_argument('run', type=Path)
args = parser.parse_args()
records = []
usage = []
for line in (args.run / 'trace.jsonl').read_text().splitlines():
    try:
        event = json.loads(line)
    except ValueError:
        continue
    if event.get('type') == 'turn.completed':
        usage.append(event.get('usage'))
    if event.get('type') != 'item.completed':
        continue
    item = event.get('item', {})
    if item.get('type') == 'command_execution':
        command = item.get('command', '')
        if any(word in command for word in ['SKILL.md', '/references/', 'CFA_ANTHROPIC', 'integrations.lock', 'browser', 'playwright', 'catalog', 'sha256', 'shasum']):
            records.append({'event_id':item.get('id'),'type':'command','command':command,'exit_code':item.get('exit_code'),'output':item.get('aggregated_output','')[:3500]})
    elif item.get('type') == 'agent_message':
        records.append({'event_id':item.get('id'),'type':'message','text':item.get('text')})
    elif item.get('type') not in ['reasoning', 'file_change']:
        records.append({'event_id':item.get('id'),'type':item.get('type'),'detail':str(item)[:1200]})
print(json.dumps({'run':str(args.run),'note':'Candidate matches for manual review, not inferred behavior or complete loaded-file records. Command outputs truncated here; original JSONL is authoritative.','parent_usage':usage,'records':records},indent=2))
