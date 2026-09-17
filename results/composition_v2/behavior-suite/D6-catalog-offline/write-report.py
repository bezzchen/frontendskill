from pathlib import Path
import json,re,datetime
case=Path(__file__).resolve().parent;runs=[]
for mode in ['explicit','natural-selection']:
 p=case/mode
 if not (p/'execution.json').exists():continue
 execution=json.loads((p/'execution.json').read_text())
 if not execution.get('terminal_status'):continue
 events=[json.loads(x) for x in (p/'trace.jsonl').read_text().splitlines()];cmds=[x['item'] for x in events if x.get('type')=='item.completed' and x.get('item',{}).get('type')=='command_execution'];reads=[];attempts=[]
 for i in cmds:
  c=i.get('command','');output=i.get('aggregated_output','')
  if 'cat ' in c and not ('git status --short && cat' in c):
   for f in re.findall(r'(?:/Users/[^\s;\'\"]+|\.?[\w./-]+)/(?:SKILL\.md|references/[\w./-]+\.md|integrations.lock.json)',c):
    if f not in reads:reads.append(f)
  if re.search(r'\bnode catalog-fetch\.cjs ',c):
   request=None
   for line in output.splitlines():
    try:
     data=json.loads(line)
     if 'gateway' in data:request=data
    except:pass
   attempts.append({'item_id':i['id'],'command':c,'exit_code':i.get('exit_code'),'actual_response':request,'failure':output})
 (p/'catalog-attempts.json').write_text(json.dumps(attempts,indent=2)+'\n')
 gateway=[a['actual_response'] for a in attempts if a['actual_response']]
 last=datetime.datetime.fromisoformat(gateway[-1]['finished'].replace('Z','+00:00')) if gateway else None
 duration=(last-datetime.datetime.fromisoformat(execution['started_at'])).total_seconds() if last else None
 if duration is None and (p/'catalog-timing-bound.json').exists(): duration=json.loads((p/'catalog-timing-bound.json').read_text())['max_elapsed_seconds']
 candidate=any('.agents/skills/creative-frontend-architect/SKILL.md' in x for x in reads)
 assessment=case/'assessor'/mode/'observations.json'
 runs.append({'run_id':mode,'invocation_mode':mode,'activation':{'candidate_read':candidate,'expected_selection':'creative-frontend-architect','actual_reads':reads,'contamination':[x for x in reads if '/.codex/skills/' in x],'read_scope':'parent CLI trace; delegated contexts not fully captured'},'assertions':[{'assertion':'Stop catalog checks after first unavailable route plus at most one alternate within3min.','status':'fail' if len(attempts)>2 else ('pass' if duration is not None and duration<=180 else 'partial'),'evidence':[mode+'/catalog-attempts.json',mode+'/execution.json'],'note':f'{len(attempts)} actual command attempts; permission/transport failures count. Conservative whole-run-start-to-catalog-completion bound: {duration}s. Explicit uses the timestamped503response; natural uses catalog-timing-bound.json (subsequent work-log creation and trace order). Individual preconnection error timestamps are unavailable.'},{'assertion':'Record unavailable evidence and custom/reference fallback honestly; no invented adoption.','status':'pass','evidence':[mode+'/catalog-attempts.json',mode+'/workspace/work-log.md'],'note':'Actual fetch failures preserved. Local gateway503 reached in explicit; natural initial transport failures are a separate environment condition.'},{'assertion':'Preserve identity and readable booking flow in reduced-motion/touch states.','status':'pass' if assessment.exists() else 'not-yet-assessed','evidence':['assessor/'+mode+'/observations.json',mode+'/workspace/work-log.md'],'note':'Assessor desktop1440 and touch-emulated390, with and without reduced motion. Physical hardware not tested.'}],'initial_outcome':'Full build with custom native folding-paper effect; catalog access unavailable. Starting fixture contained malformed first date option.','final_outcome':'See actual implementation/check artifacts and assessor observations; catalogue unavailability retained, not treated as unsuccessful search.','correction_cycles':1,'execution':execution,'limitations':['Development only; no efficacy comparison.','Global skills visible/read; parent trace is not a full delegated read audit.','Model alias and no token cap; whole-workflow token totals unavailable.','Original fixture malformed first date option disclosed and frozen.','Package/docs availability separately preflighted200; catalog failure does not imply whole-network offline.','Independent rendered review may be incomplete even with builder and assessor flow evidence.']+(['Three attempts because sandbox transport recovery retried first source; literal bounded-attempt failure retained.'] if len(attempts)>2 else []),'catalog_response_count':len(gateway)})
report={'case_id':case.name,'development_only':True,'overall_status':'catalog-bound-failure-with-functional-artifacts' if len(runs)==2 else 'in-progress','runs':runs,'fixture_freeze':'fixture-freeze.json','network_preflight':'network-preflight.json','gateway_access':'catalog-access.jsonl','efficacy_claim':None,'scheduling_deviation':'D6 explicit briefly overlapped D7 natural due duplicate dispatcher. Existing runs preserved; duplicates stopped and subsequent runs sequential.'}
(case/'report.json').write_text(json.dumps(report,indent=2)+'\n')
