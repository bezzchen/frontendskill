from pathlib import Path
import json,shutil,hashlib,sys
case=Path(__file__).resolve().parent;mode=sys.argv[1];src=case/mode/'workspace';checkpoint=case/'checkpoints'/mode
if checkpoint.exists():raise SystemExit('Existing checkpoint: preserve it')
checkpoint.mkdir(parents=True)
for name in ['index.html','styles.css','app.js','studio-service.js']:
 if (src/name).exists():shutil.copy2(src/name,checkpoint/name)
s=(checkpoint/'index.html').read_text();s=s.replace('</head>','<link rel="stylesheet" href="checkpoint.css"></head>');(checkpoint/'index.html').write_text(s)
plan=json.loads((case/'assessor-seed-plan.json').read_text());(checkpoint/'checkpoint.css').write_text(plan['css']+'\n')
contract='''# Accepted settings contract
Ceramics studio workspace settings: display name, kiln-alert preferences, validation and deterministic save feedback. Preserve the supplied warm paper/earth ink/accent palette, system typography, squared input/button shapes and quiet single-column panel. Phone and keyboard operation are required. User delegated sensible remaining details and requested implementation without concept approval. Use ordinary semantic controls/CSS; no motion or graphics engine is required.

The local save service takes600ms. Default URL succeeds; append ?save=error for a service failure. Keep entered values on failure and make retry usable. Do not claim a real backend save beyond this local prototype.
'''
actual_contract=src/'.design/contract.md'
if actual_contract.exists():
 contract=actual_contract.read_text().split('\nReview:')[0]+'\n\nState control: default service succeeds after600ms; ?save=error selects failure.\n'
reviewfixture=case/'reviewer-fixtures'/mode;shutil.copytree(case/'reviewer-fixture-base',reviewfixture);(reviewfixture/'design-contract.md').write_text(contract);(reviewfixture/'task.json').write_text(json.dumps({'url':f'http://127.0.0.1:8890/D2-settings-and-review/checkpoints/{mode}/','viewports':[{'width':1440,'height':900},{'width':390,'height':900}],'states':['default','invalid','saving','success','service error'],'service_error_query':'?save=error'},indent=2)+'\n')
manifest={str(p.relative_to(checkpoint)):hashlib.sha256(p.read_bytes()).hexdigest() for p in sorted(checkpoint.rglob('*')) if p.is_file()};(case/f'{mode}-checkpoint-freeze.json').write_text(json.dumps({'files':manifest,'method':'assessor-owned checkpoint stylesheet applied after original full builder run; supplemental staged reviewer probe, not natural builder discovery','review_inputs':str(reviewfixture)},indent=2)+'\n')
print(checkpoint)
