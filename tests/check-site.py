"""Dependency-free static checks; run from the repository root or any directory."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote

ROOT = Path(__file__).resolve().parent.parent

class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.refs = []
        self.ids = set()
        self.languages = []
    def handle_starttag(self, tag, attrs):
        values = dict(attrs)
        if 'id' in values:
            assert values['id'] not in self.ids, f"Duplicate ID: {values['id']}"
            self.ids.add(values['id'])
        for name in ('href', 'src', 'data-copy-code'):
            if name in values:
                self.refs.append(('#' if name == 'data-copy-code' else '') + values[name])
        if tag == 'html':
            self.languages.append(values.get('lang'))

pages = {}
for path in ROOT.glob('*.html'):
    parsed = Page()
    parsed.feed(path.read_text(encoding='utf-8'))
    assert parsed.languages == ['en'], f'{path.name}: missing language'
    assert 'main' in parsed.ids, f'{path.name}: missing main anchor'
    pages[path.name] = parsed

count = 0
for name, parsed in pages.items():
    for required in ('course.html', 'java-reference.html', 'examples.html', 'discover.html'):
        assert required in parsed.refs, f'{name}: missing {required} navigation'
    for ref in parsed.refs:
        parts = urlsplit(ref)
        if parts.scheme or parts.netloc:
            continue
        target = unquote(parts.path) or name
        assert (ROOT / target).is_file(), f'{name}: missing {target}'
        if parts.fragment:
            assert unquote(parts.fragment) in pages[target].ids, f'{name}: missing #{parts.fragment}'
        count += 1
assert all(f'module-{i}.html' in pages for i in range(1, 10))
print(f'{len(pages)} pages, {count} local links/assets/anchors checked.')
