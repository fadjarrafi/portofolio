# Content Architecture

## Overview

The site is organized into three main content sections, all using MDX files with YAML frontmatter. Each section has its own utility module for reading and caching posts at build time.

---

## Sections

### Writing (`/writing`)

Long-form technical articles. Bilingual — each post can have an English and Indonesian version linked via `translationSlug`.

**Directory:** `app/writing/posts/{en,id}/`

**Frontmatter schema:**

| Field | Type | Required | Notes |
|---|---|---|---|
| `title` | string | yes | |
| `publishedAt` | string (YYYY-MM-DD) | yes | |
| `summary` | string | yes | Shown in post cards and RSS |
| `topics` | string[] | yes | Used for filtering and related posts |
| `type` | string | yes | `essay` \| `tutorial` \| `note` \| `reflection` \| `review` |
| `lang` | `en` \| `id` | yes | Should match the folder |
| `featured` | boolean | no | Shows post on homepage |
| `translationSlug` | string | no | Slug of the same post in the other language |
| `image` | string | no | OG image URL |
| `updated` | string (YYYY-MM-DD) | no | Shows "Updated" badge |

**Utilities (`app/writing/utils.ts`):**
- `getBlogPosts(lang)` — all posts for a language, cached
- `getAllBlogPosts()` — all posts across both languages
- `getBlogPost(slug, lang)` — single post lookup
- `getRelatedPosts(slug, lang, limit)` — related posts by shared topics
- `getAllTopics(lang)` — unique topic list
- `getAllPostTypes(lang)` — unique type list
- `getTopicStats(lang)` — topic → post count map

---

### Garden — Thoughts (`/garden/thoughts`)

Shorter, evolving ideas at different stages of completeness. Same bilingual structure as Writing.

**Directory:** `app/garden/thoughts/posts/{en,id}/`

**Frontmatter schema:**

| Field | Type | Required | Notes |
|---|---|---|---|
| `title` | string | yes | |
| `publishedAt` | string (YYYY-MM-DD) | yes | |
| `summary` | string | yes | |
| `topics` | string[] | yes | |
| `type` | string | yes | Same values as Writing |
| `lang` | `en` \| `id` | yes | |
| `status` | `seed` \| `sapling` \| `tree` | no | Auto-derived from word count if omitted |
| `translationSlug` | string | no | |
| `updated` | string | no | |

**Growth stage auto-assignment (when `status` is omitted):**

| Stage | Word Count | Meaning |
|---|---|---|
| `seed` 🌱 | < 300 | Raw observation or early idea |
| `sapling` 🌿 | 300–999 | Developing thought |
| `tree` 🌳 | 1000+ | Fully formed piece |

**Utilities (`app/garden/utils.ts`):**
- `getGardenThoughts(lang)` — all thoughts for a language, cached
- `getAllGardenThoughts()` — all thoughts across both languages
- `getGardenThought(slug, lang)` — single thought lookup
- `getRelatedThoughts(slug, lang, limit)` — related by shared topics
- `getAllGardenTopics(lang)` — unique topic list
- `getAllGardenTypes(lang)` — unique type list
- `getGardenTopicStats(lang)` — topic → post count map

---

### Garden — Concepts (`/garden/concepts`)

Glossary of technical and interdisciplinary concepts.

**Directory:** `app/garden/concepts/` (route exists, content structure TBD)

---

### Garden — Library (`/garden/library`)

Reading notes and curated resources.

**Directory:** `app/garden/library/` (route exists, content structure TBD)

---

### Case Studies (`/case-studies`)

In-depth write-ups of projects, not bilingual — English only.

**Directory:** `app/case-studies/posts/`

**Frontmatter schema:**

| Field | Type | Required | Notes |
|---|---|---|---|
| `title` | string | yes | |
| `publishedAt` | string (YYYY-MM-DD) | yes | |
| `summary` | string | yes | |
| `topics` | string[] | yes | |
| `featured` | boolean | no | Shows on homepage |
| `image` | string | no | Cover image URL (supports Unsplash) |
| `role` | string | no | e.g. `Full-stack Developer` |
| `duration` | string | no | e.g. `2 months` |
| `client` | string | no | |

**Utilities (`app/case-studies/utils.ts`):**
- `getCaseStudies()` — all case studies, cached
- `getCaseStudy(slug)` — single case study lookup
- `getFeaturedCaseStudies(limit)` — featured studies sorted by date

---

## MDX Processing

All content is rendered with `next-mdx-remote/rsc` and the following plugins:

| Plugin | Purpose |
|---|---|
| `remark-gfm` | GitHub-flavored markdown (tables, strikethrough, etc.) |
| `remark-math` | LaTeX math blocks (`$$...$$`) |
| `rehype-katex` | Renders LaTeX to HTML |
| `sugar-high` | Syntax highlighting for code blocks |

Custom MDX components are defined in `app/components/mdx.tsx`:
- Headings auto-generate anchor slugs
- Links open external URLs in a new tab
- Images are wrapped with Next.js `<Image>`

---

## Frontmatter Parsing

All three utility modules share the same custom frontmatter parser (not using `gray-matter`). It handles:
- Plain string values
- Boolean values (`true` / `false`)
- Inline arrays (`["a", "b", "c"]`)

Multiline YAML values and nested objects are not supported. Keep frontmatter values on a single line.

---

## URL Structure

| Content | URL Pattern |
|---|---|
| Writing post | `/writing/[lang]/[slug]` |
| Garden thought | `/garden/thoughts/[lang]/[slug]` |
| Garden concept | `/garden/concepts/[slug]` |
| Case study | `/case-studies/[slug]` |

`[lang]` is either `en` or `id`. All static params are generated at build time via `generateStaticParams`.
