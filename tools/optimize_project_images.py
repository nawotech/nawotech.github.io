#!/usr/bin/env python3
"""Optimize project images and auto-link them in _projects/*.md.

For each project markdown file in _projects/<slug>.md, this script scans
assets/img/projects/<slug>/ for source images, generates:
  - thumb-XX.webp (for portfolio thumbnails)
  - full-XX.webp  (for lightbox/full view)
and writes a `photos:` array to project front matter.

Usage:
  .venv/bin/python tools/optimize_project_images.py --dry-run
  .venv/bin/python tools/optimize_project_images.py
"""

from __future__ import annotations

import argparse
import re
from pathlib import Path
from typing import List, Tuple

import yaml
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
PROJECTS_DIR = ROOT / "_projects"
IMAGES_DIR = ROOT / "assets" / "img" / "projects"

SOURCE_EXTS = {".jpg", ".jpeg", ".png", ".webp", ".tif", ".tiff"}
GENERATED_PREFIXES = ("thumb-", "full-")

THUMB_MAX = 1400
FULL_MAX = 2600
WEBP_QUALITY = 82


def split_front_matter(text: str) -> Tuple[str, str]:
    if not text.startswith("---\n"):
        raise ValueError("File does not start with YAML front matter")
    end = text.find("\n---\n", 4)
    if end == -1:
        raise ValueError("Could not find closing front matter marker")
    front = text[4:end]
    body = text[end + 5 :]
    return front, body


def natural_key(path: Path):
    parts = re.split(r"(\d+)", path.stem.lower())
    return [int(p) if p.isdigit() else p for p in parts]


def is_source_image(path: Path) -> bool:
    if path.suffix.lower() not in SOURCE_EXTS:
        return False
    name = path.name.lower()
    if any(name.startswith(prefix) for prefix in GENERATED_PREFIXES):
        return False
    return not name.startswith(".")


def resize_max(img: Image.Image, max_px: int) -> Image.Image:
    w, h = img.size
    if max(w, h) <= max_px:
        return img
    if w >= h:
        new_w = max_px
        new_h = round(h * (max_px / w))
    else:
        new_h = max_px
        new_w = round(w * (max_px / h))
    return img.resize((new_w, new_h), Image.Resampling.LANCZOS)


def optimize_one(src: Path, out_thumb: Path, out_full: Path, dry_run: bool) -> None:
    if dry_run:
        return

    with Image.open(src) as im:
        im = ImageOps.exif_transpose(im)

        thumb = resize_max(im, THUMB_MAX)
        if thumb.mode not in ("RGB", "L"):
            thumb = thumb.convert("RGB")
        thumb.save(out_thumb, "WEBP", quality=WEBP_QUALITY, method=6)

        full = resize_max(im, FULL_MAX)
        if full.mode not in ("RGB", "L"):
            full = full.convert("RGB")
        full.save(out_full, "WEBP", quality=WEBP_QUALITY, method=6)


def update_project(project_md: Path, dry_run: bool = False) -> Tuple[bool, str]:
    slug = project_md.stem
    image_folder = IMAGES_DIR / slug

    if not image_folder.exists():
        return False, f"skip {slug}: no folder {image_folder.relative_to(ROOT)}"

    sources = sorted([p for p in image_folder.iterdir() if p.is_file() and is_source_image(p)], key=natural_key)

    if not sources:
        return False, f"skip {slug}: no source images"

    photos = []
    for i, src in enumerate(sources, start=1):
        thumb_name = f"thumb-{i:02d}.webp"
        full_name = f"full-{i:02d}.webp"
        out_thumb = image_folder / thumb_name
        out_full = image_folder / full_name

        optimize_one(src, out_thumb, out_full, dry_run)

        photos.append(
            {
                "thumb": f"/assets/img/projects/{slug}/{thumb_name}",
                "full": f"/assets/img/projects/{slug}/{full_name}",
                "alt": f"{slug.replace('-', ' ')} {i}",
            }
        )

    raw = project_md.read_text(encoding="utf-8")
    front_raw, body = split_front_matter(raw)
    front = yaml.safe_load(front_raw) or {}

    # keep only minimal + useful optional fields
    for key in ["hero_image", "gallery", "year", "status", "featured", "order", "tech"]:
        front.pop(key, None)

    front["photos"] = photos

    new_front = yaml.safe_dump(front, sort_keys=False, allow_unicode=True).strip()
    new_raw = f"---\n{new_front}\n---\n{body.lstrip()}"

    if not dry_run:
        project_md.write_text(new_raw, encoding="utf-8")

    return True, f"ok {slug}: {len(sources)} source -> {len(photos)} photo entries"


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true", help="show actions without writing files")
    args = parser.parse_args()

    project_files = sorted(PROJECTS_DIR.glob("*.md"))
    if not project_files:
        print("No project markdown files found.")
        return 1

    changed = 0
    for md in project_files:
        ok, msg = update_project(md, dry_run=args.dry_run)
        print(msg)
        if ok:
            changed += 1

    print(f"Done. {'Would update' if args.dry_run else 'Updated'} {changed} project file(s).")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
