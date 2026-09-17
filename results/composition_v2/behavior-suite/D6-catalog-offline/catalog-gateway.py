from http.server import BaseHTTPRequestHandler, HTTPServer
from pathlib import Path
import datetime
import json

LOG = Path(__file__).with_name('catalog-access.jsonl')

class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        body = b'Catalog temporarily unavailable. Retry later.'
        LOG.open('a').write(json.dumps({'at': datetime.datetime.now(datetime.timezone.utc).isoformat(), 'method': 'GET', 'path': self.path, 'status': 503}) + '\n')
        self.send_response(503)
        self.send_header('Content-Type', 'text/plain; charset=utf-8')
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)

HTTPServer(('127.0.0.1', 8896), Handler).serve_forever()
