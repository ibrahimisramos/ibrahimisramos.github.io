# How to post

Posts are Markdown files. GitHub Pages builds the site when you push to `main`.

1. Copy a draft from `_drafts/` (or the templates below) into `_posts/` and rename it `YYYY-MM-DD-short-slug.md`.
2. Fill in the front matter and write the post. Delete every `TODO`.
3. Preview locally (below), then commit and push.

Drafts in `_drafts/` are never published, so park half-finished posts there.

## Categories

| `category:` | Shows as     | Layout                         |
|-------------|--------------|--------------------------------|
| `certs`     | Cert review  | `layout: cert-review`          |
| `resources` | Resources    | default (no layout line)       |
| `labs`      | Lab log      | default (no layout line)       |
| `travel`    | Travel       | `layout: travel`               |

URLs come out as `/<category>/<slug>/`, e.g. `/travel/paris-trip/`.

## Cert reviews

`cert:` must match an `id` in `_data/certs.yml`. That links the review to the
verification badge automatically and adds a "My review" link on the Work page.
The `resources:` list renders as "Resources I used" at the bottom.

Adding a new cert: add an entry to `_data/certs.yml` (status `earned` or `in-progress`).

## Images

Put them in `assets/img/<category>/` and reference as `/assets/img/travel/doha-1.jpg`.
Set `cover:` in front matter for a card/hero image. Resize to ~1600px wide first.

## Preview locally

```bash
docker run --rm -it -p 4000:4000 -v "$PWD":/srv -w /srv ruby:3.3-bookworm \
  bash -c "bundle install && bundle exec jekyll serve --host 0.0.0.0 --drafts"
```

Then open http://localhost:4000. `--drafts` shows `_drafts/` posts too (local only).

## CTF portal

See `scripts/README-ctf.md`. Never commit plaintext flags; run `ruby scripts/hash-flag.rb 'CTF{...}'`
and paste the hash into the challenge's `flag_hash:`.
