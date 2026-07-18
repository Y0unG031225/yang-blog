"""Generate per-post social cards and install icons from Markdown metadata."""

from pathlib import Path
import re
from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parents[1]
POSTS = ROOT / "content" / "posts"
CARD_DIR = ROOT / "public" / "og" / "posts"
ICON_DIR = ROOT / "public" / "icons"
FONT_REGULAR = Path(r"C:\Windows\Fonts\msyh.ttc")
FONT_BOLD = Path(r"C:\Windows\Fonts\msyhbd.ttc")

PALETTES = {
    "graduate": ((22, 53, 76), (92, 143, 174)),
    "study": ((26, 55, 74), (91, 158, 181)),
    "life": ((35, 55, 73), (122, 145, 165)),
    "games": ((31, 46, 68), (106, 118, 170)),
}


def font(size: int, bold: bool = False):
    path = FONT_BOLD if bold else FONT_REGULAR
    return ImageFont.truetype(str(path), size=size)


def parse_post(path: Path):
    text = path.read_text(encoding="utf-8")
    block = re.match(r"^---\s*\n(.*?)\n---", text, re.S)
    data = {}
    if block:
        for line in block.group(1).splitlines():
            if ":" not in line:
                continue
            key, value = line.split(":", 1)
            value = value.strip().strip('"\'')
            if value.startswith("[") and value.endswith("]"):
                data[key.strip()] = [item.strip().strip('"\'') for item in value[1:-1].split(",") if item.strip()]
            else:
                data[key.strip()] = value
    data["slug"] = path.stem
    return data


def wrap(draw, text, selected_font, max_width, max_lines):
    lines, current = [], ""
    for char in text:
        candidate = current + char
        if current and draw.textlength(candidate, font=selected_font) > max_width:
            lines.append(current)
            current = char
            if len(lines) == max_lines:
                break
        else:
            current = candidate
    if len(lines) < max_lines and current:
        lines.append(current)
    consumed = "".join(lines)
    if len(consumed) < len(text) and lines:
        while lines[-1] and draw.textlength(lines[-1] + "…", font=selected_font) > max_width:
            lines[-1] = lines[-1][:-1]
        lines[-1] += "…"
    return lines


def cover(image, size):
    ratio = max(size[0] / image.width, size[1] / image.height)
    resized = image.resize((round(image.width * ratio), round(image.height * ratio)), Image.Resampling.LANCZOS)
    left = (resized.width - size[0]) // 2
    top = (resized.height - size[1]) // 2
    return resized.crop((left, top, left + size[0], top + size[1]))


def generate_card(post):
    size = (1200, 630)
    background = cover(Image.open(ROOT / "public" / "city-hero-wide.jpg").convert("RGB"), size)
    background = ImageEnhance.Contrast(background).enhance(.9).filter(ImageFilter.GaussianBlur(1.2))
    base, accent = PALETTES.get(post.get("categoryKey"), PALETTES["graduate"])
    overlay = Image.new("RGBA", size, base + (190,))
    image = Image.alpha_composite(background.convert("RGBA"), overlay)
    draw = ImageDraw.Draw(image)

    draw.rounded_rectangle((54, 48, 1146, 582), radius=24, fill=(9, 24, 37, 185), outline=accent + (105,), width=2)
    draw.rounded_rectangle((88, 82, 270, 120), radius=19, fill=accent + (230,))
    draw.text((179, 101), post.get("category", "ARTICLE"), font=font(20, True), fill=(245, 249, 251), anchor="mm")
    draw.text((1090, 99), "YANG'S BLOG", font=font(20, True), fill=(205, 221, 231), anchor="ra")
    draw.line((88, 151, 1112, 151), fill=accent + (145,), width=2)

    title_font = font(54, True)
    title_lines = wrap(draw, post.get("title", "Untitled"), title_font, 930, 2)
    y = 190
    for line in title_lines:
        draw.text((88, y), line, font=title_font, fill=(244, 247, 249), anchor="la")
        y += 76

    description_font = font(24)
    description_lines = wrap(draw, post.get("description", ""), description_font, 960, 2)
    y = max(366, y + 12)
    for line in description_lines:
        draw.text((88, y), line, font=description_font, fill=(184, 201, 212), anchor="la")
        y += 38

    tags = post.get("tags", [])[:3]
    draw.text((88, 529), "  ".join(f"#{tag}" for tag in tags), font=font(20), fill=accent, anchor="la")
    draw.text((1112, 529), post.get("date", ""), font=font(20), fill=(151, 170, 183), anchor="ra")

    CARD_DIR.mkdir(parents=True, exist_ok=True)
    image.convert("RGB").save(CARD_DIR / f"{post['slug']}.png", "PNG", optimize=True)


def icon_canvas(size, maskable=False):
    image = Image.new("RGB", (size, size))
    pixels = image.load()
    for y in range(size):
        mix = y / max(1, size - 1)
        color = tuple(round(20 + (48 - 20) * mix) if i == 0 else round((40, 80)[i-1] + ((73, 105)[i-1] - (40, 80)[i-1]) * mix) for i in range(3))
        for x in range(size):
            pixels[x, y] = color
    draw = ImageDraw.Draw(image)
    inset = round(size * (.18 if maskable else .08))
    draw.rounded_rectangle((inset, inset, size-inset, size-inset), radius=round(size*.15), fill=(12, 31, 47), outline=(139, 191, 219), width=max(2, size//80))
    draw.text((size/2, size*.45), "YB", font=font(round(size*.25), True), fill=(238, 245, 248), anchor="mm")
    draw.line((size*.32, size*.61, size*.68, size*.61), fill=(139, 191, 219), width=max(2, size//90))
    draw.text((size/2, size*.7), "BLOG", font=font(round(size*.055), True), fill=(159, 190, 208), anchor="mm")
    return image


def main():
    for path in sorted(POSTS.glob("*.md")):
        post = parse_post(path)
        if str(post.get("draft", "false")).lower() != "true":
            generate_card(post)
    ICON_DIR.mkdir(parents=True, exist_ok=True)
    icon_canvas(192).save(ICON_DIR / "icon-192.png", optimize=True)
    icon_canvas(512).save(ICON_DIR / "icon-512.png", optimize=True)
    icon_canvas(512, maskable=True).save(ICON_DIR / "icon-512-maskable.png", optimize=True)
    icon_canvas(180).save(ICON_DIR / "apple-touch-icon.png", optimize=True)
    print(f"Generated social cards for {len(list(CARD_DIR.glob('*.png')))} posts and install icons.")


if __name__ == "__main__":
    main()
