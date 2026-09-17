#!/usr/bin/env python3
"""Collect authored case assessments without inferring an overall behavioral pass."""
import argparse
import datetime
import hashlib
import json
from pathlib import Path

parser=argparse.ArgumentParser()
parser.add_argument('--final',action='store_true')
args=parser.parse_args()
base=Path(__file__).resolve().parents[1]
reports=[]
pending=[]
for case in sorted(base.glob('D*')):
    path=case/'report.json'
    if not path.exists():
        pending.append(case.name)
        continue
    data=json.loads(path.read_text())
    runs=data.get('runs',[])
    if len(runs)!=2 or data.get('overall_status') in [None,'in-progress']:
        pending.append(case.name)
    reports.append({'case_id':case.name,'report_path':str(path.relative_to(base)),'report_sha256':hashlib.sha256(path.read_bytes()).hexdigest(),'overall_status':data.get('overall_status'),'runs':[{'run_id':r.get('run_id'),'invocation_mode':r.get('invocation_mode'),'activation':r.get('activation'),'assertions':r.get('assertions'),'initial_outcome':r.get('initial_outcome'),'final_outcome':r.get('final_outcome'),'correction_cycles':r.get('correction_cycles'),'limitations':r.get('limitations')} for r in runs]})
if args.final and pending:
    raise SystemExit('Cannot finalize; missing/unfinished case reports: '+', '.join(pending))
gate_path=base/'harness/gate-decision.json'
gate=json.loads(gate_path.read_text()) if gate_path.exists() else None
if args.final and not gate:
    raise SystemExit('Coordinator gate decision required before final summary.')
usage=[]
for execution in sorted(base.glob('D*/*/execution.json')):
    record=json.loads(execution.read_text())
    if record.get('mode') not in ['explicit','natural-selection']:
        continue
    parent_usage=record.get('parent_usage_events',[])
    partial=sum(x.get('input_tokens',0)+x.get('output_tokens',0) for x in parent_usage if x)
    usage.append({'run_id':str(execution.parent.relative_to(base)),'terminal_status':record.get('terminal_status','running-or-prepared'),'elapsed_seconds':record.get('elapsed_seconds'),'known_parent_input_output_tokens':partial if parent_usage else None,'source_path':str(execution.relative_to(base))})
summary={'suite_id':'composition-v2-development-behavior','captured_at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'execution_record_status':'complete' if args.final else 'in-progress','candidate_commit':'12f509e61d8aa15de2bfcc54195a7def07bda0a8','planned_cases':8,'planned_initial_runs':16,'completed_initial_runs':sum(r['terminal_status']=='completed' for r in usage),'finished_case_reports':8-len(pending),'pending_cases':pending,'promotion_gate':gate or 'requires-coordinator-interpretation','efficacy_experiment_run':False,'reports':reports,'initial_run_accounting':usage,'known_parent_tokens_sum':sum(r['known_parent_input_output_tokens'] or 0 for r in usage),'whole_workflow_tokens':None,'whole_workflow_cost_usd':None,'accounting_note':'Known parent sums include repeated cached input exactly once. Delegated agent, coordinator and assessment accounting unavailable; sum is not total workflow consumption or billed cost.'}
if args.final and summary['completed_initial_runs']!=16:
    raise SystemExit('Expected exactly sixteen completed initial implementations.')
print(json.dumps(summary,indent=2))
