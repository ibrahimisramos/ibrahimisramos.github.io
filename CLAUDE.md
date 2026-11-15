# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Personal site for Ibrahim Sharul (pentester): a Jekyll site built by GitHub Pages from `main`. Pushing to `main` publishes it, so do redesign work on a branch and only merge with the owner's approval.

## Build and preview

The `github-pages` gem pins Jekyll 3.10 and the allowed plugins. Native gem installs fail on this machine, so build in Docker:

```bash
# Production build into _site/
docker run --rm -v "$PWD":/srv -v jekyll-gems:/usr/local/bundle -w /srv -e JEKYLL_ENV=production \
  ruby:3.3-bookworm bash -c "bundle install && bundle exec jekyll build"

# Live preview with drafts at http://localhost:4000
docker run --rm -it -p 4000:4000 -v "$PWD":/srv -v jekyll-gems:/usr/local/bundle -w /srv \
  ruby:3.3-bookworm bash -c "bundle install && bundle exec jekyll serve --host 0.0.0.0 --drafts"
```

`_site/` is then owned by root; remove it via Docker or sudo. There is no test suite or linter. Check changes by building and clicking through the built site (`python3 -m http.server` in `_site/` also works). The CTF flag checker uses `crypto.subtle`, which only runs on https or localhost.

## Architecture

- **Content is data-driven.** Certs, experience, papers and red/blue work live in `_data/*.yml` and are rendered by includes (`work-card`, `timeline-item`). Add a cert or job by editing YAML, not HTML.
- **Posts** use `category:` = `certs | resources | labs | travel`. Labels, blurbs and filter-chip order come from `post_categories` in `_config.yml`. Permalinks are `/:categories/:title/`. `blog/index.html` filters client-side via `assets/js/filter.js` (supports `?c=<category>`).
- **Cert reviews** (`layout: cert-review`) set `cert:` to an `id` in `_data/certs.yml`, which links the verification badge and adds a "My review" link on the Work page. Front matter fields (`cost`, `prep_time`, `difficulty`, `exam_format`, `would_recommend`, `resources:`) fill the fact box and the "Resources I used" list.
- **Drafts** in `_drafts/` are never published; most starter posts sit there with `TODO`s for the owner to write. `POSTING.md` is the owner-facing how-to; keep it in sync with layout or front-matter changes.
- **Styling** is one hand-written `assets/css/main.scss` built on CSS variables, light theme only (no dark mode). There is no framework or vendor CSS.
- **Untouched legacy files** (`numerology*.html`, `Reports/`, `Projects/`, `Files/`) have no front matter and are copied through as-is. Old URLs (`about-me.html`, `portfolio.html`) are kept alive with `redirect_from`.

## Hidden CTF ("Launchpad")

- The portal at `/secret-ctf-portal/` is for teaching secondary school students. Every challenge must be solvable in a browser with DevTools, view-source or CyberChef; nothing to install.
- **Clue chain:** the HTML comment in `index.html` → `robots.txt` (`Disallow`) → portal. Renaming the path means updating all three, plus the `secret-ctf-portal` defaults scope in `_config.yml`, which applies `layout: ctf`, `sitemap: false` and `noindex`.
- Each challenge page has front matter: `permalink`, `slug_id`, `order`, `track`, `difficulty`, `flag_hash`, `hints`, `learned`, `real_world`. The portal index lists every page with `order`.
- **Flag checking:** `assets/js/ctf.js` lowercases the trimmed input, SHA-256s it, and compares the result to `flag_hash`. Hashes must therefore come from the lowercased flag. Use `ruby scripts/hash-flag.rb 'CTF{...}'`.
- **Plaintext flags never go in the repo.** They live outside it in `../ctf-flags.local.txt`. The exception is flags that the challenge deliberately hides in page source.
- Progress is stored in localStorage under `launchpad-solved`.
- `ctf.js` finds feedback with `document.querySelector('.flag-result')`. Do not reuse the `flag-result` class for other elements on a challenge page.
- See `scripts/README-ctf.md` for adding a challenge.

## Liquid gotchas (Jekyll 3)

- `where_exp` does not support `or`.
- `assign x = a == b` does not evaluate a comparison. Use `{% if %}` blocks instead.
