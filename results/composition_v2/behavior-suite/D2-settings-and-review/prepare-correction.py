from pathlib import Path
import shutil,sys,json,hashlib
case=Path(__file__).resolve().parent;mode=sys.argv[1];review=Path(sys.argv[2]).resolve();target=case/'correction-fixtures'/mode
if target.exists():raise SystemExit('Preserve existing correction fixture')
shutil.copytree(case/'checkpoints'/mode,target)
shutil.copy2(case/'original/browser.cjs',target/'browser.cjs');shutil.copy2(review,target/'review-findings.md');shutil.copy2(case/'reviewer-fixtures'/mode/'design-contract.md',target/'design-contract.md');shutil.copy2(case/'ordinary-prompt.txt',target/'brief.txt')
port=8871 if mode=='explicit' else 8872
(target/'package.json').write_text(json.dumps({'name':'clay-house-settings-correction','private':True,'scripts':{'start':'python3 -m http.server --bind 127.0.0.1','check':'node --check app.js && node --check studio-service.js'}},indent=2)+'\n')
(target/'AGENTS.md').write_text(f'''# Clay House project environment
Use the existing application style and vanilla stack. Start the site with `npm start -- {port}`; check JavaScript with `npm run check`. The local studioService saves after600ms. Default mode succeeds; `?save=error` selects failure, and its mutable mode property supports a retry to success during local checks. The service saves local prototype state only.
The supported browser command is `node browser.cjs config.json`. Read browser.cjs for action/configuration syntax. You may write additional diagnostic scripts using the same prepared Playwright library and Chromium. Do not provision, replace or alter the supported launcher or browser executable.
''')
(case/f'{mode}-correction-prompt.txt').write_text('''Use the project creative-frontend-architect skill to correct the implemented settings panel. The original request is in brief.txt, accepted direction in design-contract.md, and the independent rendered findings in review-findings.md. Repair the evidence-backed defects with the smallest appropriate changes while preserving the approved brand and functional flow. Then recheck the reported failures, primary save flow, validation, error/retry, narrow390px and keyboard focus. Do not ask for design approval; those decisions are settled. This is correction cycle1 of a maximum2. Record actual checks and limitations in work-log.md; do not claim a rendered pass without successful browser evidence.
''')
(case/f'{mode}-correction-fixture-freeze.json').write_text(json.dumps({'files':{str(p.relative_to(target)):hashlib.sha256(p.read_bytes()).hexdigest() for p in sorted(target.rglob('*')) if p.is_file()},'review_source':str(review),'cycle':1},indent=2)+'\n')
print(target)
