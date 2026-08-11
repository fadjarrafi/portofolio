# Writing Style — Indonesian Articles

Reference: `src/content/blog/id/caching.mdx`. This is the calibration example — when in doubt, match its register, not a textbook-formal one.

## The Core Idea

Real Indonesian developers don't purge English while talking shop — they code-switch constantly, mid-sentence, without translating jargon that doesn't have a natural Indonesian equivalent. Writing that forces every term into "proper" Indonesian (*singgahan* for cache, *ketertinggalan* for stale) reads like a textbook translation, not like a person. The goal isn't 100% Indonesian and it isn't Indonlish for its own sake — it's whatever a sharp Indonesian dev would actually type in a Slack message or a blog draft.

This means the same term can go either way depending on the sentence — that's fine, and expected. `caching.mdx` uses **stale** in one place and **basi** in another. Don't mechanically enforce one choice project-wide; let it vary the way real usage varies.

## What Stays in English

- **CS/technical jargon with no snappy Indonesian equivalent**: cache, cache hit, cache miss, lookup, timestamp, TTL, endpoint, query, index, primary key, rate limit, bottleneck, request/response.
- **Abstract concepts that would sound stiff translated**: freshness, simplicity, trade-off. Don't force these into *kesegaran* or *kesederhanaan* if the English word is what a developer would actually say.
- **Tool, library, and product names**: `Map`, Redis, DataLoader — never translate these, obviously.

## What Stays in Indonesian

Ordinary vocabulary and all grammar/sentence structure: *masalah*, *sistem*, *halaman*, *jawaban*, *kerja*, *data*, *gagal*, *butuh*, *diminta*, *disimpan*. Don't code-switch words that already have a natural, commonly-used Indonesian form — that's what tips the mix from "how devs actually talk" into forced Denglish.

## Morphology: Indonesian Affixes on English Roots

Attach Indonesian prefixes/suffixes directly to English verbs and nouns, no italics, no quotes, no hyphen-as-flag — write it like a normal word, because that's how it's actually typed:

- `di-cache`, `di-update`, `di-deploy`
- `nge-trade` (*nge-* + English verb — common informal register for "doing X")
- `cache-nya`, `key-nya` (*-nya* suffix directly on the English noun)

## Connectors and Register

Skip formal/textbook transition words — *oleh karena itu*, *sehubungan dengan*, *dengan demikian*, *maka dari itu*. Use what people actually say: *jadi*, *tapi*, *soalnya*, *kalau*, *maka* (plain, not "maka dari itu"). Prefer short, direct clauses joined with periods or commas over stacking formal connectors.

## Punctuation: Go Light on Em Dashes

The humanizer scorer flags em-dash clustering as an AI tell (see `/code-review` history on this file — original draft had 14–20 em-dashes in ~1,100 words, docked points on both EN and ID versions). Prefer:

- A period, splitting one sentence into two.
- A comma, when the clause is short enough to just flow.
- Parentheses, for a genuine aside.

One or two em-dashes per article is fine for a deliberate pause. More than that starts reading like a pattern, not a choice.

## Headings

Headings can carry the same mixed register as the body — `caching.mdx` uses "Kapan Ini Works" for one heading (versus the fully-Indonesian "Kapan Tidak", "Kenapa Ini Penting" elsewhere). Going forward, **pick the mixed register for every heading in an article**, not just one — a single code-switched heading next to five formal ones reads as unfinished editing rather than a voice choice. Consistency is per-article, not per-heading.

## Applying This to New Articles

1. Draft the English version first (existing pattern — EN and ID are paired via `translationSlug`).
2. Translate to Indonesian as a genuine rewrite, not a literal port — this is where the code-switching judgment call happens per sentence.
3. Run it past the terms above: does a jargon word sound stiff translated? Leave it English. Does a common word sound try-hard in English? Keep it Indonesian.
4. Check em-dash density and heading consistency before calling it done.
