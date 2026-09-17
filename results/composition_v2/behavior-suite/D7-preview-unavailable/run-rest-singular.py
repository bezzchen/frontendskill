from pathlib import Path
import json,subprocess,time
base=Path(__file__).resolve().parent.parent
for case,mode in [('D7-preview-unavailable','natural-selection'),('D6-catalog-offline','explicit')]:
    while not json.loads((base/case/mode/'execution.json').read_text()).get('terminal_status'):time.sleep(5)
for case,mode in [('D6-catalog-offline','natural-selection'),('D2-settings-and-review','explicit'),('D2-settings-and-review','natural-selection')]:
    p=base/case
    r=subprocess.run(['python3',str(base/'harness/run_probe.py'),'--fixture',str(p/'mode-fixtures'/mode),'--out',str(p/mode),'--prompt',str(p/'ordinary-prompt.txt'),'--mode',mode])
    print(case,mode,r.returncode,flush=True)
