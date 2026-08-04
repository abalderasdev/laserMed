"""
Generate og-image.webp (1200x630) from hero + brand.
"""
from PIL import Image, ImageDraw, ImageFont
from pathlib import Path

REPO = Path(r"C:\Users\abald\.abm\laserMed-repo")
W, H = 1200, 630
OUT = REPO / "assets" / "img" / "og-image.webp"

# Use hero-1 as background
hero = Image.open(REPO / "assets" / "img" / "hero-1.webp").convert("RGB")
hero_ratio = hero.width / hero.height
target_ratio = W / H
if hero_ratio > target_ratio:
    # crop sides
    new_w = int(hero.height * target_ratio)
    left = (hero.width - new_w) // 2
    hero = hero.crop((left, 0, left + new_w, hero.height))
else:
    new_h = int(hero.width / target_ratio)
    top = (hero.height - new_h) // 2
    hero = hero.crop((0, top, hero.width, top + new_h))
hero = hero.resize((W, H), Image.LANCZOS)

# Apply dark gradient overlay
overlay = Image.new("RGB", (W, H), (22, 20, 18))
mask = Image.new("L", (W, H), 0)
mdraw = ImageDraw.Draw(mask)
# gradient from left (dark) to right (clear)
for x in range(W):
    a = int(255 * (1 - x / W) * 0.85)
    mdraw.line([(x, 0), (x, H)], fill=a)
hero.paste(overlay, (0, 0), mask)

# Try to load Inter or fallback
font_paths = [
    Path(r"C:\Windows\Fonts\segoeuib.ttf"),  # Bold
    Path(r"C:\Windows\Fonts\segoeui.ttf"),   # Regular
    Path(r"C:\Windows\Fonts\arial.ttf"),
]
font_brand = None
font_big = None
font_sub = None
font_small = None
try:
    font_brand = ImageFont.truetype(str(font_paths[0]), 28)
    font_big = ImageFont.truetype(str(font_paths[0]), 86)
    font_sub = ImageFont.truetype(str(font_paths[1]), 28)
    font_small = ImageFont.truetype(str(font_paths[1]), 22)
except Exception as e:
    print(f"font fallback: {e}")
    font_brand = ImageFont.load_default()
    font_big = ImageFont.load_default()
    font_sub = ImageFont.load_default()
    font_small = ImageFont.load_default()

draw = ImageDraw.Draw(hero)

# Brand top-left
draw.text((64, 56), "L · LASERMED", fill=(248, 245, 239), font=font_brand)

# Eyebrow
draw.text((64, 240), "CDMX · BOUTIQUE DE LÁSER ESTÉTICO", fill=(201, 96, 61), font=font_small)

# Big headline (3 lines)
draw.text((64, 280), "Piel cuidada", fill=(248, 245, 239), font=font_big)
draw.text((64, 360), "con luz de verdad.", fill=(201, 96, 61), font=font_big)

# Sub
draw.text((64, 480), "Depilación definitiva · Eliminación de tatuajes ·", fill=(199, 193, 180), font=font_sub)
draw.text((64, 512), "Manchas · Rejuvenecimiento", fill=(199, 193, 180), font=font_sub)

# CTA pill bottom
cta_text = "Valoración gratuita · lasermed.abdev.click"
bbox = draw.textbbox((0, 0), cta_text, font=font_small)
tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
pad_x, pad_y = 24, 14
btn_w, btn_h = tw + pad_x * 2, th + pad_y * 2
btn_x, btn_y = 64, H - btn_h - 56
draw.rounded_rectangle([btn_x, btn_y, btn_x + btn_w, btn_y + btn_h],
                       radius=999, fill=(201, 96, 61))
draw.text((btn_x + pad_x, btn_y + pad_y - 2), cta_text, fill=(248, 245, 239), font=font_small)

# Save
hero.save(OUT, "WEBP", quality=88, method=6)
print(f"OK · {OUT.stat().st_size/1024:.0f} KB")
