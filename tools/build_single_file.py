"""
build_single_file.py — Menggabungkan index.html + css + js + gambar menjadi SATU file HTML
(../kyobell.html) yang bisa langsung diunggah/dibagikan tanpa folder aset.

Cara pakai (dari folder kyobell-site):  python3 tools/build_single_file.py
"""
import base64
import re
from pathlib import Path

SITE_DIR = Path(__file__).resolve().parent.parent
OUTPUT_FILE = SITE_DIR.parent / 'kyobell.html'

# Urutan HARUS sama dengan urutan <script> di index.html.
SCRIPT_FILES = ['config', 'utils', 'products', 'cart', 'components', 'pages', 'app']


def to_data_uri(relative_path, mime_type):
    data = (SITE_DIR / relative_path).read_bytes()
    return f'data:{mime_type};base64,' + base64.b64encode(data).decode()


def inline_images(javascript):
    """Ganti setiap 'assets/img/xxx.webp' di JS dengan data URI."""
    return re.sub(r'assets/img/[\w-]+\.webp',
                  lambda match: to_data_uri(match.group(0), 'image/webp'), javascript)


css = (SITE_DIR / 'css/style.css').read_text(encoding='utf-8')
css = css.replace('../assets/paw.svg', to_data_uri('assets/paw.svg', 'image/svg+xml'))

javascript = '\n'.join((SITE_DIR / f'js/{name}.js').read_text(encoding='utf-8') for name in SCRIPT_FILES)
javascript = javascript.replace('showEmbeddedMap: true', 'showEmbeddedMap: false')  # iframe peta tidak dimuat di versi satu-file
javascript = inline_images(javascript)

html = (SITE_DIR / 'index.html').read_text(encoding='utf-8')
html = html.replace('<link rel="stylesheet" href="css/style.css">', f'<style>\n{css}\n</style>')
html = re.sub(r'\s*<link rel="icon"[^>]*>', '', html)
html = re.sub(r'\s*<script src="js/[\w-]+\.js"></script>', '', html)
html = html.replace('</body>', f'<script>\n{javascript}\n</script>\n</body>')

OUTPUT_FILE.write_text(html, encoding='utf-8')
print(f'Selesai: {OUTPUT_FILE} ({len(html) // 1024} KB)')
