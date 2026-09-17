import json,hashlib,re
from pathlib import Path
ROOT=Path(__file__).resolve().parent

def run_record(dirname,mode):
    run=ROOT/dirname
    meta=json.loads((run/'execution.json').read_text())
    reads=[]
    for line in (run/'trace.jsonl').read_text().splitlines():
        event=json.loads(line);item=event.get('item',{})
        if event.get('type')!='item.completed' or item.get('type')!='command_execution' or item.get('exit_code')!=0:continue
        command=item.get('command','')
        if not any(x in command for x in ['cat ','sed ','read_text','readFile']):continue
        for text in re.findall(r"(?:/[^\s'\"]+|\.agents/[^\s'\"]+|\.sources/[^\s'\"]+)(?:SKILL\.md|references/[^\s'\"]+\.md)",command):
            p=Path(text) if text.startswith('/') else run/'workspace'/text
            if p.is_file():
                reads.append({'path':str(p.resolve()),'sha256':hashlib.sha256(p.read_bytes()).hexdigest(),'trace_event_id':item.get('id'),'command':command})
    # Commands are retained as the authority when a compound shell read is not parsed.
    commands=[]
    for line in (run/'trace.jsonl').read_text().splitlines():
        e=json.loads(line);i=e.get('item',{})
        if e.get('type')=='item.completed' and i.get('type')=='command_execution' and i.get('exit_code')==0 and ('SKILL.md' in i.get('command','') or '/references/' in i.get('command','')):commands.append({'trace_event_id':i.get('id'),'command':i['command']})
    (run/'actual-read-commands.json').write_text(json.dumps(commands,indent=2)+'\n')
    candidate_read=any('cat .agents/skills/creative-frontend-architect/SKILL.md' in x['command'] for x in commands)
    observations=json.loads((run/'assessment-initial/observations.json').read_text()) if (run/'assessment-initial/observations.json').exists() else None
    supplement=json.loads((run/'assessment-combined-state/observations.json').read_text()) if (run/'assessment-combined-state/observations.json').exists() else {'assertions':[]}
    if observations:observations['assertions']+=supplement['assertions']
    critical=[]
    groups=[('Hiding metronome stops its owned animation updates while waveform continues.',['hiding metronome stops owned updates while visible waveform continues','real scroll pauses metronome while waveform remains visible']),('Hiding document pauses both; resuming restarts only active work without duplicate subscribers.',['native document-hidden pauses all owned continuous work','restoring real visibility resumes without duplicate subscriptions','native background cancels work with metronome already hidden','native restore resumes only eligible waveform']),('Unmounting one surface releases only its resources; shared scheduler survives for its sibling.',['unmount releases only metronome while waveform continues','remount does not accumulate subscribers']),('Reduced motion preserves controls/content and avoids unnecessary continuous work.',['reduced motion stops unnecessary continuous work','reduced-motion controls remain keyboard operable'])]
    for assertion,names in groups:
        rows=[x for x in (observations or {}).get('assertions',[]) if x['assertion'] in names]
        status='pass' if len(rows)==len(names) and all(x['status']=='pass' for x in rows) else ('fail' if any(x['status']=='fail' for x in rows) else 'unverified')
        critical.append({'assertion':assertion,'status':status,'evidence':str(run.relative_to(ROOT)/'assessment-initial/observations.json'),'supporting_checks':rows,'supplemental_evidence':str(run.relative_to(ROOT)/'assessment-combined-state/observations.json')})
    outcome='pass' if all(x['status']=='pass' for x in critical) else ('fail' if any(x['status']=='fail' for x in critical) else 'unverified')
    initial=json.loads((run/'initial-workspace-manifest.json').read_text());final=json.loads((run/'final-workspace-manifest.json').read_text()) if (run/'final-workspace-manifest.json').exists() else {}
    return {'run_id':dirname,'invocation_mode':mode,'activation':{'candidate_read':candidate_read,'expected_selection':mode=='explicit','selection_status':'pass' if candidate_read==(mode=='explicit') else 'fail','interpretation':'Animation bug fixes are outside automatic trigger scope; natural nonselection is intended. Explicit invocation must preserve settled design.','actual_reads':reads,'command_evidence':str(run.relative_to(ROOT)/'actual-read-commands.json'),'contamination':[x['command'] for x in commands if '/Users/bezzchen/.codex/skills/' in x['command']]},'assertions':critical,'initial_outcome':outcome,'final_outcome':outcome,'correction_cycles':0,'execution':meta,'candidate_files_unchanged':all(final.get(k)==v for k,v in initial.items() if k.startswith('.agents/')),'assessment_method':'Native Chromium default context via CDP noDefaults:true, actual tab backgrounding with trusted events; actual mouse-wheel scrolling; per-subscriber counters and global pending-rAF instrumentation. Reduced motion uses browser media preference emulation.','limitations':['Unscored development; no efficacy comparison.','Assessment author prepared the fixture and knew its original defects; not a blinded independent review.','Whole-workflow token/cost totals unavailable; execution record contains known parent CLI usage only.','Concurrent development builds may be present; no performance/frame-rate superiority inference.']}

records=[]
for dirname,mode in [('natural-selection-run1','natural-selection'),('explicit-run1','explicit')]:
    if (ROOT/dirname/'final-workspace-manifest.json').exists():records.append(run_record(dirname,mode))
report={'case_id':'D8-shared-animation-ownership','candidate_commit':'12f509e61d8aa15de2bfcc54195a7def07bda0a8','fixture_freeze':'fixture-freeze.json','baseline_evidence':'original-assessment-run2/observations.json','launch_failures':['natural-selection/stderr.txt'],'assessment_deviations':['Original baseline first assessment page.goto(load) timed out; preserved original-assessment/observations.json. Retry uses domcontentloaded and succeeds.'],'runs':records,'overall_status':'pass' if len(records)==2 and all(x['final_outcome']=='pass' and x['activation']['selection_status']=='pass' for x in records) else 'in-progress'}
(ROOT/'report.json').write_text(json.dumps(report,indent=2)+'\n')
print('Saved',len(records),'completed run records')
