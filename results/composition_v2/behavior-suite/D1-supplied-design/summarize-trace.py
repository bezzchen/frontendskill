from pathlib import Path
import json,re,hashlib,sys,tarfile
out=Path(sys.argv[1]);workspace=out/'workspace';trace=out/'trace.jsonl'
events=[];commands=[];messages=[];reads=[];errors=[]
for n,line in enumerate(trace.read_text().splitlines(),1):
 try:e=json.loads(line)
 except:continue
 i=e.get('item',{})
 if e.get('type')=='item.completed':
  if i.get('type')=='command_execution':
   commands.append({'line':n,'id':i.get('id'),'command':i.get('command'),'exit_code':i.get('exit_code'),'output_excerpt':i.get('aggregated_output','')[:1200]})
   c=i.get('command','')
   if any(x in c for x in ['SKILL.md','references/','integrations.lock','CFA_ANTHROPIC_SOURCE','accepted-contract','project-decisions','project-context']):reads.append({'line':n,'id':i.get('id'),'command':c,'output_present':bool(i.get('aggregated_output')),'exit_code':i.get('exit_code')})
  elif i.get('type')=='agent_message':messages.append({'line':n,'id':i.get('id'),'text':i.get('text')})
  elif i.get('type')=='error':errors.append({'line':n,'message':i.get('message')})
artifacts={str(p.relative_to(workspace)):hashlib.sha256(p.read_bytes()).hexdigest() for p in sorted(workspace.rglob('*')) if p.is_file() and not any(x in p.relative_to(workspace).parts for x in ['node_modules','.git','dist'])}
(out/'trace-index.json').write_text(json.dumps({'read_and_resolution_commands':reads,'agent_messages':messages,'errors':errors,'command_count':len(commands),'commands':commands},indent=2)+'\n')
(out/'artifact-initial-manifest.json').write_text(json.dumps(artifacts,indent=2)+'\n')
with tarfile.open(out/'artifact-initial.tar.gz','w:gz') as tar:
 for rel in artifacts:tar.add(workspace/rel,arcname=rel)
print(json.dumps({'reads':len(reads),'commands':len(commands),'messages':len(messages),'snapshot_files':len(artifacts)}))
