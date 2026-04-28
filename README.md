# nawotech.github.io

Portfolio site for **Nawotech — Electronics Design Consulting**, built with [Jekyll](https://jekyllrb.com/) and hosted on [GitHub Pages](https://pages.github.com/).

Live: https://nawotech.github.io

---

## Editing the site

The whole site is driven by a few easy-to-edit files. **You almost never need to touch HTML** — most updates are YAML or Markdown.

### Add a new project

1. Create a new file in `_projects/` named `<slug>.md` (lowercase, dashes), e.g. `_projects/cool-widget.md`.
2. Copy this template:

   ```markdown
   ---
   title: Cool Widget
   summary: One-line description that shows in the portfolio section.
   photos:
     - thumb: /assets/img/projects/cool-widget/thumb-1.webp
       full: /assets/img/projects/cool-widget/full-1.webp
       alt: Cool Widget prototype
     - thumb: /assets/img/projects/cool-widget/thumb-2.webp
       full: /assets/img/projects/cool-widget/full-2.webp
       alt: Cool Widget in use
   links:
     website: https://example.com
   ---

   Long-form Markdown write-up goes here. Headings, images, lists, code, links —
   anything Markdown supports.

   ## What it does

   ...

   ## How it's built

   ...
   ```

3. Drop images into `assets/img/projects/<slug>/`.
4. For performance, use smaller `thumb` images and larger `full` images.
   - `thumb`: ~1200px wide, ~100-300KB
   - `full`: ~2000-2600px wide, ~300-900KB
   - Prefer `.webp`
5. Commit + push. GitHub Pages rebuilds automatically.

### Auto-optimize + auto-link project images

You can automate image optimization and front-matter updates:

```bash
# one-time setup
python3 -m venv .venv
.venv/bin/python -m pip install pillow pyyaml

# preview changes
.venv/bin/python tools/optimize_project_images.py --dry-run

# write optimized files + update _projects/*.md photos:
.venv/bin/python tools/optimize_project_images.py
```

What it does:
- Scans `assets/img/projects/<slug>/` for source images.
- Generates `thumb-XX.webp` and `full-XX.webp`.
- Writes/updates `photos:` in `_projects/<slug>.md`.

### Add a new blog post

Create `_posts/YYYY-MM-DD-title.md`:

```markdown
---
title: Post title
date: 2026-04-27
excerpt: Short teaser shown on the blog index.
---

Markdown content...
```

### Update services

Edit `/_includes/services.html`.

### Update professional experience

Edit `_data/experience.yml`. Each entry becomes a row on the experience timeline.

### Update site-wide info

Edit `_config.yml` for tagline, contact info, social links, etc.

### Replace the resume PDF

Drop your latest PDF at `assets/resume.pdf` (overwrites the placeholder).

### Enable the contact form

1. Create a free account at [formspree.io](https://formspree.io/).
2. Create a form, copy the endpoint URL (looks like `https://formspree.io/f/abc123`).
3. Paste it into `_config.yml` under `formspree_endpoint:`.

Until you do, the contact section falls back to a `mailto:` link.

---

## Local preview (optional)

GitHub Pages builds the site automatically on push, so you don't *need* to run it locally — but if you want to:

```bash
bundle install
bundle exec jekyll serve --livereload
```

Then visit http://localhost:4000.

Requires Ruby 3.x. On macOS with Homebrew: `brew install ruby` and add the Homebrew Ruby to your PATH.

---

## File structure

```
_config.yml           Site config (tagline, contact, social, etc.)
_data/
  experience.yml      Job history
_projects/            One Markdown file per project
_posts/               One Markdown file per blog post
_layouts/             Page templates (default, project, post)
_includes/            Reusable section partials
assets/
  css/main.scss       Site styles
  img/                Images (project galleries, etc.)
  resume.pdf          Downloadable resume
index.html            Single-page site: hero + services + work + experience + writing + contact
```

The site is single-page. Only individual project pages (`/projects/<slug>/`)
and individual blog posts (`/blog/...`) get their own URLs.
