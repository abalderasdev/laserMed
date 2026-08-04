"""
Add width/height attributes to <img> tags that don't have them.
Reads actual dimensions from the image files.
"""
import re
from pathlib import Path
from PIL import Image

REPO = Path(r"C:\Users\abald\.abm\laserMed-repo")
INDEX = REPO / "index.html"

def get_dim(img_path: Path):
    try:
        with Image.open(img_path) as im:
            return im.width, im.height
    except Exception:
        return None, None

def process():
    html = INDEX.read_text(encoding="utf-8")
    pattern = re.compile(r'<img\s+([^>]*?)>')

    changed = 0
    skipped = 0
    missing = []

    def replace(m):
        nonlocal changed, skipped
        attrs = m.group(1)
        # Skip if already has width or height
        if re.search(r'\bwidth\s*=', attrs) or re.search(r'\bheight\s*=', attrs):
            skipped += 1
            return m.group(0)
        # Get src
        src_match = re.search(r'src="([^"]+)"', attrs)
        if not src_match:
            skipped += 1
            return m.group(0)
        src = src_match.group(1)
        # Resolve path
        if src.startswith('/') or src.startswith('http'):
            return m.group(0)
        img_path = INDEX.parent / src.lstrip('/')
        if not img_path.exists():
            missing.append(src)
            skipped += 1
            return m.group(0)
        w, h = get_dim(img_path)
        if not w or not h:
            skipped += 1
            return m.group(0)
        # Insert width/height right before loading or last attribute
        new_attrs = attrs.rstrip() + f' width="{w}" height="{h}"'
        changed += 1
        return f'<img {new_attrs}>'

    new_html = pattern.sub(replace, html)
    INDEX.write_text(new_html, encoding="utf-8")
    print(f"Updated: {changed}")
    print(f"Skipped (already had or no src): {skipped}")
    if missing:
        print(f"Missing files: {missing}")

if __name__ == "__main__":
    process()
