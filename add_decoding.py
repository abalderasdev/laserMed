"""
Add decoding=async to all <img> tags that don't have it.
Also: reduce agent wave to 11 bars (we'll do that in HTML separately).
"""
import re
from pathlib import Path

REPO = Path(r"C:\Users\abald\.abm\laserMed-repo")
INDEX = REPO / "index.html"

html = INDEX.read_text(encoding="utf-8")

# Count current
imgs = re.findall(r'<img[^>]+>', html)
print(f"Total img tags: {len(imgs)}")
print(f"  decoding=async: {len(re.findall(r'decoding=.async.', html))}")
print(f"  loading=lazy:   {len(re.findall(r'loading=.lazy.', html))}")
print(f"  with width=:    {len(re.findall(r'width=.[0-9]+', html))}")

# Add decoding=async
def fix_decoding(match):
    tag = match.group(0)
    if "decoding=" in tag:
        return tag
    if tag.endswith("/>"):
        return tag[:-2] + ' decoding="async" />'
    return tag[:-1] + ' decoding="async">'

new_html = re.sub(r'<img[^>]+>', fix_decoding, html)

# Add loading=lazy to images that are NOT above-the-fold
# Above-the-fold: hero image, logo (no images). All others get lazy.
# But we keep fetchpriority="high" on hero.
def fix_loading(match):
    tag = match.group(0)
    if "loading=" in tag or "fetchpriority=" in tag:
        # If has fetchpriority=high (hero), don't add lazy
        if "fetchpriority=\"high\"" in tag:
            return tag
        return tag
    if tag.endswith("/>"):
        return tag[:-2] + ' loading="lazy" />'
    return tag[:-1] + ' loading="lazy">'

new_html = re.sub(r'<img[^>]+>', fix_loading, new_html)

INDEX.write_text(new_html, encoding="utf-8")

print()
print("Despues:")
print(f"  decoding=async: {len(re.findall(r'decoding=.async.', new_html))}")
print(f"  loading=lazy:   {len(re.findall(r'loading=.lazy.', new_html))}")
