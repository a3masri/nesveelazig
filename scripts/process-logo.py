"""Regenerate transparent logo PNGs from a source with baked-in black background."""
from __future__ import annotations

from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
SRC = PUBLIC / "logo-source.png"
THRESHOLD = 40
DARK_TEXT = (255, 224, 130)


def remove_black(im: Image.Image, threshold: int = THRESHOLD) -> Image.Image:
    im = im.convert("RGBA")
    px = im.load()
    for y in range(im.height):
        for x in range(im.width):
            r, g, b, a = px[x, y]
            if r <= threshold and g <= threshold and b <= threshold:
                px[x, y] = (r, g, b, 0)
    return im


def recolor_visible(im: Image.Image, rgb: tuple[int, int, int]) -> Image.Image:
    px = im.load()
    for y in range(im.height):
        for x in range(im.width):
            r, g, b, a = px[x, y]
            if a > 0:
                px[x, y] = (*rgb, a)
    return im


def crop_transparent(im: Image.Image) -> Image.Image:
    bbox = im.getbbox()
    return im.crop(bbox) if bbox else im


def main() -> None:
    source = SRC if SRC.exists() else PUBLIC / "logo.png"
    if not source.exists():
        raise SystemExit(f"No source image at {source}")

    base = Image.open(source)
    light = crop_transparent(remove_black(base.copy()))
    dark = crop_transparent(recolor_visible(remove_black(base.copy()), DARK_TEXT))

    light.save(PUBLIC / "logo-light.png")
    dark.save(PUBLIC / "logo-dark.png")
    light.save(PUBLIC / "logo.png")
    print("Wrote logo-light.png, logo-dark.png, logo.png")


if __name__ == "__main__":
    main()
