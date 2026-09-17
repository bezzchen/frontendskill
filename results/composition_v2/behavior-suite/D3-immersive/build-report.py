import json,hashlib,re
from pathlib import Path
ROOT=Path(__file__).resolve().parent

def record(dirname,mode):
    run=ROOT/dirname
    meta=json.loads((run/'execution.json').read_text())
    commands=[];reads=[]
    for line in (run/'trace.jsonl').read_text().splitlines():
        event=json.loads(line);item=event.get('item',{});command=item.get('command','')
        if event.get('type')!='item.completed' or item.get('type')!='command_execution' or item.get('exit_code')!=0:continue
        if 'SKILL.md' in command or '/references/' in command:
            commands.append({'trace_event_id':item.get('id'),'command':command})
        if not any(x in command for x in ['cat ','sed ','read_text','read_bytes','readFile']):continue
        for text in re.findall(r"(?:/[^\s'\"]+|\.agents/[^\s'\"]+|\.sources/[^\s'\"]+)(?:SKILL\.md|references/[^\s'\"]+\.md)",command):
            p=Path(text) if text.startswith('/') else run/'workspace'/text
            if p.is_file():reads.append({'path':str(p.resolve()),'sha256':hashlib.sha256(p.read_bytes()).hexdigest(),'trace_event_id':item.get('id'),'command':command})
    (run/'actual-read-commands.json').write_text(json.dumps(commands,indent=2)+'\n')
    candidate=any('.agents/skills/creative-frontend-architect/SKILL.md' in x['command'] and 'cat ' in x['command'] for x in commands)
    observation=run/'assessment-initial/observations.json'
    observed=json.loads(observation.read_text()) if observation.exists() else {'assertions':[]}
    supplement=run/'assessment-mobile-notes/observations.json'
    if supplement.exists():observed['assertions']+=json.loads(supplement.read_text())['assertions']
    static=run/'assessment-static.json'
    critical=json.loads(static.read_text())['assertions'] if static.exists() else []
    behavior=[x for x in observed['assertions'] if any(s in x['assertion'] for s in ['desktop ','mobile ','causal comparison','input materially'])]
    status='pass' if len(behavior)>=9 and all(x['status']=='pass' for x in behavior) else 'fail' if any(x['status']=='fail' for x in behavior) else 'unverified'
    critical.append({'assertion':'Operate all three acts; verify input changes the scene and equivalent content remains available.','status':status,'evidence':['assessment-initial/observations.json']+(['assessment-mobile-notes/observations.json'] if supplement.exists() else []),'supporting_checks':behavior})
    outcome='pass' if len(critical)==3 and all(x['status']=='pass' for x in critical) and not observed.get('errors') else 'fail' if any(x['status']=='fail' for x in critical) else 'unverified'
    if meta.get('terminal_status')!='completed':outcome=meta.get('terminal_status','in-progress')
    initial=json.loads((run/'initial-workspace-manifest.json').read_text());final=json.loads((run/'final-workspace-manifest.json').read_text()) if (run/'final-workspace-manifest.json').exists() else {}
    return {'run_id':dirname,'invocation_mode':mode,'activation':{'candidate_read':candidate,'expected_selection':True,'selection_status':'pass' if candidate else 'fail','actual_reads':reads,'command_evidence':'actual-read-commands.json','contamination':[x['command'] for x in commands if '/Users/bezzchen/.codex/skills/' in x['command']]},'assertions':critical,'initial_outcome':outcome,'final_outcome':outcome,'correction_cycles':0,'execution':meta,'builder_review':{'artifact':'workspace/.design/review.md' if (run/'workspace/.design/review.md').exists() else None,'independence_verified':None,'limitation':'Builder may claim independent review, but exposed CLI JSONL lacks auditable reviewer identity/spawn history; do not equate rendered browser evidence with verified review independence.'},'candidate_files_unchanged':all(final.get(k)==v for k,v in initial.items() if k.startswith('.agents/')) if final else None,'supplemental_runtime_checks':[x for x in observed['assertions'] if x not in behavior],'assessment_method':observed.get('method'),'limitations':['Unscored development; no efficacy comparison.','Fixture author conducted source-informed assessment; not blinded or independent review arm.','Ambient motion paused and stable scene baseline established before input-causality comparison.','Whole-workflow token/cost totals unavailable; execution record contains known parent CLI usage only.','Concurrent development builds may be present; no performance/frame-rate superiority inference.']}

records=[record(d,m) for d,m in [('explicit-run1','explicit'),('natural-selection-run1','natural-selection')] if (ROOT/d/'final-workspace-manifest.json').exists()]
report={'case_id':'D3-immersive','candidate_commit':'12f509e61d8aa15de2bfcc54195a7def07bda0a8','fixture_freeze':'fixture-freeze.json','launch_failures':['explicit/stderr.txt'],'runs':records,'overall_status':'pass' if len(records)==2 and all(x['final_outcome']=='pass' and x['activation']['selection_status']=='pass' for x in records) else 'in-progress'}
(ROOT/'report.json').write_text(json.dumps(report,indent=2)+'\n')
print('Saved',len(records),'terminal run records')
