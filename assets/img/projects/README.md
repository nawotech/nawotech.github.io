# Project image folders

Drop project images here. The recommended structure:

```
assets/img/projects/
  pictopocket/
    hero.jpg          # main image (used for hero_image:)
    1.jpg, 2.jpg, ... # gallery images
  fluidclock/
    hero.jpg
    1.jpg, ...
  lil-lite/
    hero.jpg
    ...
```

Then reference them from the project's Markdown front matter:

```yaml
hero_image: /assets/img/projects/pictopocket/hero.jpg
gallery:
  - /assets/img/projects/pictopocket/1.jpg
  - /assets/img/projects/pictopocket/2.jpg
```

Images that aren't set will fall back to a friendly PCB-themed placeholder.

Suggested image sizes:
- Hero: 1600 × 900 (16:9) or 1920 × 1080
- Gallery: 1200 × 900 (4:3) works well

JPG is fine for photography. PNG or SVG for diagrams / renders.
