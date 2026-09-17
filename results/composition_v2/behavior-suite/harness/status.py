#!/usr/bin/env python3
"""Compact actual trace progress; selection candidates require manual audit."""
import json
import sys
from pathlib import Path

root = Path(__file__).resolve().parents[1]
for trace in sorted(root.glob('D*/*/trace.jsonl')):
    events = []
    for line in trace.read_text().splitlines():
        try:
            events.append(json.loads(line))
        except ValueError:
            pass
    items = [e['item'] for e in events if e.get('type') == 'item.completed' and 'item' in e]
    commands = [i for i in items if i.get('type') == 'command_execution']
    candidate = [i['id'] for i in commands if 'creative-frontend-architect' in i.get('command', '') and any(x in i['command'] for x in ['cat ', 'sed ', 'read_text', 'readFile']) and 'SKILL.md' in i['command']]
    meta = json.loads((trace.parent / 'execution.json').read_text())
    if '--active' in sys.argv and meta.get('terminal_status'):
        continue
    last_message = next((i.get('text','') for i in reversed(items) if i.get('type')=='agent_message'), '')
    print(json.dumps({'run':str(trace.parent.relative_to(root)), 'status':meta.get('terminal_status','running'), 'items':len(items), 'candidate_read_candidates':candidate,'latest_message':last_message[:220]},ensure_ascii=False))
