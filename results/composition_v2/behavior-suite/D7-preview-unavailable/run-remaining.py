from pathlib import Path
import json
import subprocess
import time

BASE = Path(__file__).resolve().parent.parent
HARNESS = BASE / 'harness/run_probe.py'
first = BASE / 'D7-preview-unavailable/explicit/execution.json'
while not json.loads(first.read_text()).get('terminal_status'):
    time.sleep(10)

for case, mode in [
    ('D7-preview-unavailable', 'natural-selection'),
    ('D6-catalog-offline', 'explicit'),
    ('D6-catalog-offline', 'natural-selection'),
    ('D2-settings-and-review', 'explicit'),
    ('D2-settings-and-review', 'natural-selection'),
]:
    folder = BASE / case
    command = ['python3', str(HARNESS), '--fixture', str(folder / 'mode-fixtures' / mode),
               '--out', str(folder / mode), '--prompt', str(folder / 'ordinary-prompt.txt'),
               '--mode', mode]
    print('START', case, mode, flush=True)
    result = subprocess.run(command)
    print('FINISH', case, mode, result.returncode, flush=True)
