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
label: build log      # optional — small pill above the title, e.g. "build log". Omit for a plain post.
hero_image: /assets/img/posts/post-slug/hero.webp   # optional — full-width 16:9 photo under the title
---

Markdown content...
```

**Extra patterns available inside post (and project) body content**, for build-log-style
write-ups — tables, code blocks, blockquotes, and images all just work as standard
Markdown. Two extra snippets are available for content Markdown doesn't have a native
syntax for:

- **GitHub repo callout** — a bordered card linking to a repo:

  ```liquid
  {% include repo-card.html repo="nawotech/fluidclock" url="https://github.com/nawotech/fluidclock" desc="firmware, KiCad project, and enclosure files" %}
  ```

- **Build photo grid** — a 2-up grid of photos, e.g. under a "Build photos" heading:

  ```liquid
  {% include build-photos.html photos="/assets/img/posts/fluidclock/pcb.jpg, /assets/img/posts/fluidclock/enclosure.jpg" alts="Bare PCB, Assembled enclosure" %}
  ```

- **Figure caption** under an image (e.g. `fig. 1 — power & LED driver`):

  ```html
  <p class="fig-caption">fig. 1 — power &amp; LED driver</p>
  ```

  right after the image's Markdown line.

### Update services

Services shown on the homepage are the tag list in `_includes/hero.html` (the `<ul class="hero-services">`). Edit the `<li>` entries there.

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

## Editing articles visually (CMS)

There's a git-backed admin UI at `/admin/` ([Sveltia CMS](https://github.com/sveltia/sveltia-cms), a modern Decap CMS-compatible editor) for writing and editing posts and projects with form fields, a rich-text body editor, and drag-and-drop image upload — no Markdown/YAML by hand, no local setup. It commits straight to this repo.

It needs a **one-time setup** before it can log in, because this is a plain GitHub Pages site with no server of its own to handle the OAuth handshake:

1. **Create a GitHub OAuth App** at [github.com/settings/developers](https://github.com/settings/developers) → "New OAuth App":
   - Application name: anything, e.g. "Nawotech CMS"
   - Homepage URL: `https://nawotech.github.io`
   - Authorization callback URL: you'll fill this in after step 2 (it's `<your-worker-url>/callback`)
   - Save, then note the **Client ID** and generate + note a **Client Secret**.

2. **Deploy the OAuth proxy worker.** [sveltia-cms-auth](https://github.com/sveltia/sveltia-cms-auth) is a small, purpose-built Cloudflare Worker that does the OAuth token exchange for you — no code to write. Deploy it to a free Cloudflare account (its README has a one-click "Deploy to Cloudflare" button), then set `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` as Worker secrets using the values from step 1. Note the Worker's URL (`https://<something>.workers.dev`).

3. Go back to your GitHub OAuth App from step 1 and set the callback URL to `https://<your-worker-url>/callback`.

4. Edit `admin/config.yml` in this repo and replace the placeholder `base_url` with your Worker's URL. Commit + push.

5. Visit `https://nawotech.github.io/admin/`, click "Login with GitHub," authorize, and you're in.

This only needs to be done once. After that, `/admin/` is the easy visual way to write build logs and add portfolio projects — changes there create real commits to `main`, same as editing the files by hand.

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
admin/                Visual editor (Sveltia CMS) — see "Editing articles visually" above
assets/
  css/main.scss       Site styles
  img/                Images (project galleries, etc.)
  resume.pdf          Downloadable resume
index.html            Single-page site: hero (incl. services) + work + experience + writing + contact
```

The site is single-page. Only individual project pages (`/projects/<slug>/`)
and individual blog posts (`/blog/...`) get their own URLs.
