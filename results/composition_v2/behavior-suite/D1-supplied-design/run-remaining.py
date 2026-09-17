from pathlib import Path
import json,subprocess,time
base=Path('/Users/bezzchen/Documents/Codex/2026-09-16/take-x20/work/v2-behavior')
while True:
 try:
  if json.loads((base/'D1-supplied-design/explicit/execution.json').read_text()).get('terminal_status'):break
 except (ValueError,FileNotFoundError):pass
 time.sleep(5)
for case,mode in [('D1-supplied-design','natural-selection'),('D4-decide-for-me','explicit'),('D4-decide-for-me','natural-selection'),('D5-director-absent','explicit'),('D5-director-absent','natural-selection')]:
 out=base/case/mode
 cmd=['python3',str(base/'harness/run_probe.py'),'--fixture',str(base/case/'fixture-original'),'--out',str(out),'--prompt',str(base/case/'ordinary-prompt.txt'),'--mode',mode,'--reuse-workspace']
 if case.startswith('D5'):cmd+=['--source','missing']
 print('Dispatching',case,mode,flush=True)
 result=subprocess.run(cmd)
 print('Finished',case,mode,'helper exit',result.returncode,flush=True)
