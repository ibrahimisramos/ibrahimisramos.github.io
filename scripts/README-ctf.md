# Launchpad CTF

Hidden portal at `/launchpad-7f3a/`. Clue chain: HTML comment on the home page → `/robots.txt` → portal.

Adding a challenge:
1. Copy a page in `launchpad-7f3a/`, give it a new `permalink`, `slug_id` and the next `order`.
2. Pick a lowercase flag, run `ruby scripts/hash-flag.rb 'IBR{...}'`, paste into `flag_hash`.
3. Record the plaintext flag outside the repo (e.g. `../ctf-flags.local.txt`), never in git.
4. Fill `hints`, `learned`, `real_world`.

Flags that are *meant* to be found in page source (challenges 1–5, 9) are visible in the
public repo too. That's fine for a teaching CTF: the skill is the point, not secrecy.
Crypto and OSINT answers (6–8) only exist as hashes or ciphertext.
