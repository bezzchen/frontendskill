#!/usr/bin/env python3
"""Audit run identity and artifact integrity separately from behavioral judgments."""
import hashlib
import json
from pathlib import Path

base = Path(__file__).resolve().parents[1]
project = base.parents[1]
cases = json.loads((project / 'work/frontendskill-v2/evals/composition_v2_cases.json').read_text())['development_probes']
prompts = {c['id']:c['user_prompt'] for c in cases}
candidate = base / 'harness/candidate/creative-frontend-architect'
expected = {str(p.relative_to(candidate)):hashlib.sha256(p.read_bytes()).hexdigest() for p in candidate.rglob('*') if p.is_file()}
results=[]
for trace in sorted(base.glob('D*/*/trace.jsonl')):
    run=trace.parent
    meta=json.loads((run/'execution.json').read_text())
    mode=meta['mode']
    if mode not in ['explicit','natural-selection']:
        continue
    expect=prompts[run.parent.name]
    if mode=='explicit':
        expect='Use the creative-frontend-architect skill to complete this request.\n\n'+expect
    observed=(run/'prompt.txt').read_text()
    installed=run/'workspace/.agents/skills/creative-frontend-architect'
    differences=[]
    for relative,digest in expected.items():
        p=installed/relative
        actual=hashlib.sha256(p.read_bytes()).hexdigest() if p.is_file() else None
        if actual!=digest: differences.append(relative)
    events=[]
    for line in trace.read_text().splitlines():
        try:events.append(json.loads(line))
        except ValueError:pass
    commands=[e['item'] for e in events if e.get('type')=='item.completed' and e.get('item',{}).get('type')=='command_execution']
    reads=[{'event_id':i.get('id'),'command':i['command'],'exit_code':i.get('exit_code')} for i in commands if 'SKILL.md' in i['command'] and any(t in i['command'] for t in ['cat ','sed ','read_text','readFile'])]
    suspicious=[{'event_id':i.get('id'),'command':i['command']} for i in commands if any(t in i['command'] for t in ['work/frontendskill-v2','outputs/frontendskill','composition_v2_cases','research-directors','foundations-and-alternatives'])]
    results.append({'run_id':str(run.relative_to(base)),'mode':mode,'terminal_status':meta.get('terminal_status','running'),'prompt_matches':observed.strip()==expect.strip(),'candidate_files_unchanged':not differences,'candidate_differences':differences,'skill_read_candidates':reads,'out_of_task_read_candidates':suspicious,'manual_trace_audit_required':True})
print(json.dumps({'candidate_commit':'12f509e61d8aa15de2bfcc54195a7def07bda0a8','note':'Integrity and read candidates only; no behavioral verdicts inferred. Prompt comparison ignores outer whitespace. Historical preagent startup failures remain listed.','runs':results},indent=2))
