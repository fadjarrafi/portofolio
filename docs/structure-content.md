# Content Architecture

## Overview

The site runs on **Astro 5** with `output: 'static'`. Content lives in **Astro content collections** under `src/content/`, defined and validated with Zod in `src/content/config.ts`. Posts are queried at build time with `getCollection()` from `astro:content` — there is no custom frontmatter parser and no per-section utility module.

There are three collections: `blog` (Writing), `thoughts` (Garden), and `case-studies`. Two Garden sub-sections (Concepts, Library) are data-driven from JSON rather than collections.

---

## Sections

### Writing (`/writing`)

Long-form technical articles. Bilingual — each post can have an English and Indonesian version linked via `translationSlug`.

**Collection:** `blog` · **Directory:** `src/content/blog/{en,id}/`

**Frontmatter schema** (`src/content/config.ts`):

| Field | Type | Required | Notes |
|---|---|---|---|
| `title` | string | yes | |
| `publishedAt` | string (YYYY-MM-DD) | yes | |
| `summary` | string | no | Shown in post cards, meta description, and RSS |
| `image` | string | no | OG image URL (falls back to `/og-default.png`) |
| `featured` | boolean | no | Surfaces the post on the homepage |
| `lang` | `en` \| `id` | no | Should match the folder |
| `translationSlug` | string | no | Slug of the same post in the other language |
| `topics` | string[] | no | Used for filtering and related posts |
| `type` | string | no | `essay` \| `tutorial` \| `note` \| `reflection` \| `review` |
| `updated` | string (YYYY-MM-DD) | no | Shows an "Updated" badge |

**Pages:** `src/pages/writing/index.astro` (listing) and `src/pages/writing/[lang]/[slug].astro` (post). Posts are read with `getCollection('blog', ({ id }) => id.startsWith('en/'))` and slugged by stripping the `en/` or `id/` prefix and the `.mdx` extension.

---

### Garden — Thoughts (`/garden/thoughts`)

Shorter, evolving ideas at different stages of completeness. Same bilingual structure as Writing.

**Collection:** `thoughts` · **Directory:** `src/content/thoughts/{en,id}/`

**Frontmatter schema:**

| Field | Type | Required | Notes |
|---|---|---|---|
| `title` | string | yes | |
| `publishedAt` | string (YYYY-MM-DD) | yes | |
| `summary` | string | no | |
| `image` | string | no | |
| `lang` | `en` \| `id` | no | |
| `translationSlug` | string | no | |
| `topics` | string[] | no | |
| `type` | string | no | Same values as Writing |
| `status` | `seed` \| `sapling` \| `tree` | no | Auto-derived from word count if omitted |
| `updated` | string | no | |

**Growth stage** (`getGrowthStage()` in `src/utils/posts.ts`, used when `status` is omitted):

| Stage | Word Count | Meaning |
|---|---|---|
| `seed` 🌱 | < 300 | Raw observation or early idea |
| `sapling` 🌿 | 300–999 | Developing thought |
| `tree` 🌳 | ≥ 1000 | Fully formed piece |

**Pages:** `src/pages/garden/thoughts/index.astro` and `src/pages/garden/thoughts/[lang]/[slug].astro`.

---

### Garden — Concepts (`/garden/concepts`) & Library (`/garden/library`)

Not content collections. Each is a single index page that reads a static JSON file at build time with `fs.readFileSync`:

| Section | Page | Data |
|---|---|---|
| Concepts | `src/pages/garden/concepts/index.astro` | `public/data/concepts.json` |
| Library | `src/pages/garden/library/index.astro` | `public/data/library.json` |

There is no `[slug]` route or MDX for these — the JSON is the content.

---

### Case Studies (`/case-studies`)

In-depth project write-ups. English only — no `lang` field.

**Collection:** `case-studies` · **Directory:** `src/content/case-studies/`

**Frontmatter schema:**

| Field | Type | Required | Notes |
|---|---|---|---|
| `title` | string | yes | |
| `publishedAt` | string (YYYY-MM-DD) | yes | |
| `summary` | string | no | |
| `image` | string | no | Cover / OG image URL |
| `featured` | boolean | no | Shows on homepage |
| `topics` | string[] | no | |
| `client` | string | no | |
| `role` | string | no | e.g. `Full-stack Developer` |
| `duration` | string | no | e.g. `2 months` |
| `liveUrl` | string (URL) | no | Validated as a URL |

**Pages:** `src/pages/case-studies/index.astro` and `src/pages/case-studies/[slug].astro`.

---

## Utilities

`getCollection()` from `astro:content` handles all querying. The helpers in `src/utils/` add derived data on top:

**`src/utils/posts.ts`:**
- `calculateReadingTime(content)` — words ÷ 200, rounded up
- `getGrowthStage(content, explicitStatus?)` — seed / sapling / tree by word count
- `getRelatedPosts(entries, currentSlug, limit = 3)` — ranks other entries by count of shared `topics`

**`src/utils/format.ts`:**
- `formatDate(date)` — display formatting

---

## MDX Processing

Content is rendered via `@astrojs/mdx` (configured in `astro.config.mjs`):

| Plugin | Type | Purpose |
|---|---|---|
| `remark-gfm` | remark | GitHub-flavored markdown (tables, strikethrough, etc.) |
| `remark-math` | remark | LaTeX math blocks (`$$...$$`) |
| `rehype-katex` | rehype | Renders LaTeX to HTML (`strict: false`, `output: 'html'`) |
| `rehype-slug` | rehype | Heading IDs (used by the table of contents) |
| `sugar-high` | — | Syntax highlighting for code blocks |

Custom MDX components are injected per-page via `<Content components={{ YouTube }} />`. The `YouTube` component is at `src/components/YouTube.astro`.

---

## Images & Diagrams

Static assets live in `public/` and are referenced by absolute path. Article diagrams go in `public/static/images/` and are referenced as `/static/images/<name>`. Hand-authored SVGs are used for illustrations (they need no render step and stay crisp).

For bilingual diagrams that contain text, keep two files with `-en` / `-id` suffixes (e.g. `variance-en.svg`, `variance-id.svg`) and reference the matching one from each language's post.

---

## Schema Validation

All frontmatter is validated by the Zod schemas in `src/content/config.ts`. Only `title` and `publishedAt` are required across every collection; everything else is optional. A build fails fast if a post violates its schema — no separate parser to maintain.

---

## URL Structure

| Content | URL Pattern | Page file |
|---|---|---|
| Writing post | `/writing/[lang]/[slug]` | `src/pages/writing/[lang]/[slug].astro` |
| Garden thought | `/garden/thoughts/[lang]/[slug]` | `src/pages/garden/thoughts/[lang]/[slug].astro` |
| Garden concept | `/garden/concepts` | index only |
| Garden library | `/garden/library` | index only |
| Case study | `/case-studies/[slug]` | `src/pages/case-studies/[slug].astro` |

`[lang]` is `en` or `id`. All static paths are generated at build time via `getStaticPaths`. The RSS feed (`src/pages/rss.xml.ts`) and `robots.txt` (`src/pages/robots.txt.ts`) are endpoint routes; the sitemap is generated by the `@astrojs/sitemap` integration at `/sitemap-index.xml`.
