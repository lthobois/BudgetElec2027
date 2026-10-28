"""Archive explicitly listed public sources without executing their content.

Usage: python scripts/collect_sources.py manifest.json
The manifest contains a list of {id, url, path, ...provenance fields}.
"""
import concurrent.futures
import hashlib
import io
import json
from datetime import datetime, timezone
from html.parser import HTMLParser
from pathlib import Path
import sys
from urllib.parse import urljoin
from urllib.request import Request, urlopen

from pypdf import PdfReader

ROOT = Path(__file__).resolve().parents[1]


class PageText(HTMLParser):
    def __init__(self):
        super().__init__()
        self.hidden = 0
        self.parts = []
        self.links = []

    def handle_starttag(self, tag, attrs):
        if tag in ('script', 'style', 'noscript'):
            self.hidden += 1
        if tag in ('p', 'div', 'li', 'h1', 'h2', 'h3', 'h4', 'br', 'tr'):
            self.parts.append('\n')
        if tag == 'a':
            href = dict(attrs).get('href')
            if href:
                self.links.append(href)

    def handle_endtag(self, tag):
        if tag in ('script', 'style', 'noscript'):
            self.hidden = max(0, self.hidden - 1)

    def handle_data(self, data):
        if not self.hidden:
            self.parts.append(data)


def collect(job):
    record = dict(job)
    record['consulted_at_utc'] = datetime.now(timezone.utc).isoformat()
    target = (ROOT / job['path']).resolve()
    if not target.is_relative_to(ROOT):
        raise ValueError('Target outside workspace')
    try:
        request = Request(job['url'], headers={'User-Agent': 'BudgetElec2027 documentary research/1.0'})
        with urlopen(request, timeout=40) as response:
            data = response.read()
            record.update(final_url=response.url, http_status=response.status,
                          content_type=response.headers.get('Content-Type'),
                          last_modified=response.headers.get('Last-Modified'))
        is_pdf = data.startswith(b'%PDF-')
        if target.suffix == '.pdf' and not is_pdf:
            raise ValueError('Response is not a PDF')
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_bytes(data)
        record.update(status='downloaded', size_bytes=len(data), sha256=hashlib.sha256(data).hexdigest())
        text_path = target.with_suffix('.txt')
        if is_pdf:
            reader = PdfReader(io.BytesIO(data))
            record['page_count'] = len(reader.pages)
            text = '\n\n'.join(f'=== PAGE PDF {i + 1} ===\n{page.extract_text() or ""}'
                               for i, page in enumerate(reader.pages))
            record['pdf_metadata'] = {str(k): str(v) for k, v in (reader.metadata or {}).items()}
        else:
            parser = PageText()
            parser.feed(data.decode('utf-8', errors='replace'))
            text = '\n'.join(line.strip() for line in ''.join(parser.parts).splitlines() if line.strip())
            record['links'] = list(dict.fromkeys(urljoin(record['final_url'], x) for x in parser.links))
        text_path.write_text(text, encoding='utf-8')
        record['text_path'] = text_path.relative_to(ROOT).as_posix()
    except Exception as exc:
        record.update(status='failed', error=f'{type(exc).__name__}: {exc}')
    return record


if __name__ == '__main__':
    manifest = Path(sys.argv[1])
    jobs = json.loads(manifest.read_text(encoding='utf-8-sig'))
    with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
        records = list(pool.map(collect, jobs))
    output = manifest.with_name(manifest.stem + '-results.json')
    output.write_text(json.dumps(records, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    for record in records:
        print(record['id'], record['status'], record.get('size_bytes', record.get('error')))
