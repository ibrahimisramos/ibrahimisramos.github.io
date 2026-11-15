# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Personal site for Ibrahim Sharul (pentester at Vantage Point Security, trainer, volunteer, traveller): a Jekyll site built by GitHub Pages from `main`.

## Workflow rules

- **`main` is the live site.** Work on the `redesign` branch, push there, and merge into `main` only when the owner says so in that conversation. An earlier "merge" does not cover later changes.
- Push over the existing SSH remote. Never set a credential helper or write `~/.git-credentials`.
- **Never invent facts** about the owner (dates, names, roles, numbers). Use a clear placeholder and ask. Unfinished posts stay in `_drafts/` (kept hidden on purpose) until the owner fills them.
- **Photos:** resize (about 1600px for posts, 2000–2600px for hero slides), re-encode with Pillow and drop EXIF so no GPS goes out. The only deliberate exception is the CTF postcard (`assets/img/ctf/postcard.jpg`), whose EXIF carries the challenge flag and fake GPS on purpose. Re-saving it must pass the EXIF through.
- Owner's design preferences: light theme only, old iPortfolio colours (accent `#149ddd`, headings `#173b6c`), top nav on desktop with the dark drawer only on mobile, and round cert badges. They rejected the bento layout. Never tease the CTF on the visible site; it's a surprise.

## Build and preview

The `github-pages` gem pins Jekyll 3.10 and the allowed plugins. Native gem installs fail on this machine, so build in Docker:

```bash
# Production build into _site/
docker run --rm -v "$PWD":/srv -v jekyll-gems:/usr/local/bundle -w /srv -e JEKYLL_ENV=production \
  ruby:3.3-bookworm bash -c "bundle install && bundle exec jekyll build"

# Live preview at http://localhost:4000 (container name used below)
docker run --rm --name site-preview -p 127.0.0.1:4000:4000 -v "$PWD":/srv -v jekyll-gems:/usr/local/bundle -w /srv \
  ruby:3.3-bookworm bash -c "bundle exec jekyll serve --host 0.0.0.0 --force_polling"
```

- Preview without `--drafts` so the owner sees what will publish. Add it only when checking drafts.
- Edits to `_config.yml` are not picked up live; run `docker restart site-preview`.
- `_site/` is owned by root; remove it via Docker or sudo.
- There is no test suite. Check with Playwright (`python3`) against localhost:
  - at 375px wide, `document.documentElement.scrollWidth` must stay 375
  - there must be no console errors
  - every CTF flag must be accepted and a wrong one rejected
- The CTF checker uses `crypto.subtle`, which only runs on https or localhost.

## Architecture

- **Content is data-driven.** These live in `_data/*.yml`, rendered by includes (`cert-grid`, `work-card`, `timeline-item`). Add a cert or job by editing YAML, not HTML.
  - certs
  - experience
  - papers
  - red/blue work
  - home hero slides (`hero_slides.yml`)
  - About travel photos (`travel_photos.yml`)
- **Posts** use `category:` = `certs | resources | labs | travel | talks`.
  - Labels and filter-chip order come from `post_categories` in `_config.yml`. Permalinks are `/:categories/:title/`.
  - `assets/js/filter.js` drives the chips on `/blog/` (supports `?c=<category>`) and on the home page's "Latest writing".
  - A chip's `data-filter` matches a card's category or its group. `post-card.html` puts `travel` in the travel group and every other category in the cyber group.
  - On the home page the grid has `data-limit="6"`.
  - `/travel/` redirects to `/blog/?c=travel`.
- **Travel posts** were imported from the owner's old WordPress blog. Images are in `assets/img/travel/<slug>/`. Set `show_cover: false` when the cover repeats in the body. Nothing links to the old blog.
- **Post images:** galleries in posts use `<figure class="gallery">` with nested `<figure>`s. Add `gallery-tall` for portrait photos. Videos use `<video controls playsinline preload="metadata" poster=…>`.
- **Home hero.** `assets/js/hero.js` types the roles in the `.typed` element's `data-items` and crossfades to the slide whose `role` matches.
  - A role with no slide falls back to the first slide (Penetration Tester shares the consultant photo).
  - Per-slide fields:
    - `pos`: background-position
    - `src_mobile` / `pos_mobile`: phone overrides at ≤600px, for example a tall photo for Traveller
  - On phones the hero text sits at the bottom so faces stay clear. Check a new slide at 375×667 and 390×844.
- **Cert reviews** (`layout: cert-review`) set `cert:` to an `id` in `_data/certs.yml`. The Home and Work cert grids show a "My review" link only when a published review exists.
- **Styling** is one hand-written `assets/css/main.scss` built on CSS variables, with no framework. Avoid `backdrop-filter` on the sticky header, because it traps the fixed mobile drawer.
- `POSTING.md` is the owner-facing how-to; keep it in sync with layout or front-matter changes.
- **Legacy files** (`numerology*.html`, `Reports/`, `Projects/`, `Files/`) have no front matter and are copied through as-is. `Files/Ibrahim Sharul Resume.pdf` is linked from Home, About and Work. Old URLs (`about-me.html`, `portfolio.html`, `travel-post.html`) are kept alive with `redirect_from`.

## Hidden CTF portal

- **What it is:** the portal at `/secret-ctf-portal/`, for teaching secondary school students. Every challenge must be solvable in a browser with DevTools, view-source or CyberChef; nothing to install. The pages are still branded "Launchpad".
- **Clue chain:** the HTML comment in `index.html` → `robots.txt` (`Disallow`) → portal.
  - Renaming the path means updating the permalinks, `robots.txt`, `_layouts/ctf.html` (`portal`), the hall-pass cookie path and the `secret-ctf-portal` defaults scope in `_config.yml`.
  - That defaults scope applies `layout: ctf`, `sitemap: false` and `noindex`. Restart the preview after changing it.
- `teachers.html` is deliberately unlinked: it's reachable only by URL and has no answers.
- Each challenge page has front matter: `permalink`, `slug_id`, `order`, `track`, `difficulty`, `flag_hash`, `hints`, `learned`, `real_world`. The portal index lists every page with `order`.
- **Flag format is `CTF{...}`.**
  - `assets/js/ctf.js` lowercases the trimmed input, SHA-256s it and compares the result to `flag_hash`, so hashes must come from the lowercased flag. Use `ruby scripts/hash-flag.rb 'CTF{...}'`.
  - Changing a flag also means updating its encoded copies:
    - the `atob(...)` strings in gatekeeper, hall-pass, save-file and debug-mode
    - the Base64+ROT13 text in layers
    - the Caesar text in caesars-postcard (shift 7, so `CTF` → `JAM`) and its hints
    - the postcard EXIF
- **Plaintext flags never go in the repo.** They live outside it in `../ctf-flags.local.txt`, which is also the owner's answer key.
  - The only exceptions are the read-the-source page comment and the postcard EXIF, which are the puzzles.
  - Before merging to `main`, grep a production build for each real flag.
- Progress is stored in localStorage under `launchpad-solved`. Feedback goes to `[data-ctf-result]`.
- See `scripts/README-ctf.md` for adding a challenge.

## Liquid gotchas (Jekyll 3)

- `where_exp` does not support `or`.
- `assign x = a == b` does not evaluate a comparison. Use `{% if %}` blocks instead.
- A `for` loop can't take a filter inline. `assign` the filtered list first.
- Nested lookups like `site.categories[c[0]]` fail. `assign key = c[0]` first.
