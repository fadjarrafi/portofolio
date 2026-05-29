# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev      # Start development server (http://localhost:4321)
pnpm build    # Build for production (static output to dist/)
pnpm preview  # Preview production build locally
```

No test or lint commands are configured.

## Architecture

This is an **Astro 5** portfolio/blog site with `output: 'static'` (pure static HTML, zero JS shipped by default), Tailwind CSS v3, and MDX for content. Deployed via Docker + nginx.

### Content Structure

Content lives in Astro content collections under `src/content/`:

- **Blog** (`src/content/blog/{en,id}/`): Full articles with topics, types, and reading time
- **Thoughts** (`src/content/thoughts/{en,id}/`): Shorter digital garden posts with growth stages (seed/sapling/tree by word count)
- **Case Studies** (`src/content/case-studies/`): Project case study posts

Schemas are defined with Zod in `src/content/config.ts`. Use `getCollection('blog')` etc. from `astro:content` to query posts — no custom frontmatter parser.

Utility functions are in `src/utils/`:
- `src/utils/posts.ts`: `calculateReadingTime()`, `getGrowthStage()`, `getRelatedPosts()`
- `src/utils/format.ts`: `formatDate()`

#### Blog frontmatter

```yaml
title: 'Article Title'
publishedAt: '2025-01-01'
featured: false
topics: ['programming']
type: 'note'          # note | tutorial | essay
lang: 'en'
translationSlug: 'slug-shared-between-en-and-id'
```

#### Thoughts frontmatter

```yaml
title: 'Thought Title'
publishedAt: '2025-01-01'
summary: 'Brief description'   # optional
topics: ['topic1', 'topic2']
type: 'note'
status: 'seed'        # seed | sapling | tree (or auto-derived from word count)
lang: 'en'
```

### MDX Processing

Content is rendered via `@astrojs/mdx` with:
- `sugar-high` for syntax highlighting
- `remark-math` + `rehype-katex` for LaTeX math support
- `remark-gfm` for GitHub-flavored markdown
- `rehype-slug` for heading IDs (used by TableOfContents)

Custom MDX components are passed via `<Content components={{ YouTube }} />` in page files. The `YouTube` component is at `src/components/YouTube.astro`.

### Key Patterns

- Path alias: `@/*` maps to `src/`
- Fonts: **Space Grotesk** (body) and **IBM Plex Mono** (code) via Google Fonts `<link>` in `BaseLayout.astro`
- Routes use dynamic segments: `[lang]/[slug]` for bilingual posts (e.g. `/writing/en/my-post`)
- Related posts computed in `src/utils/posts.ts` by shared topics with relevance scoring
- Interactive components (search, TOC) use vanilla JS — no React runtime in output
- Scroll animations use CSS + global IntersectionObserver in `BaseLayout.astro`
- Static data files (`experiences.json`, `concepts.json`, `library.json`) are read at build time with `fs.readFileSync` from `public/data/`

### Analytics

Google Analytics 4 via `PUBLIC_GA_ID` environment variable. Set it on the VPS:
```bash
PUBLIC_GA_ID=G-XXXXXXXXXX
```
The GA script is conditionally injected in `BaseLayout.astro` only when the variable is present.

## Docker

The Dockerfile uses a two-stage build: `node:22-alpine` builder → `nginx:alpine` runner. The static `dist/` output is served by nginx on port 80.

```bash
docker build -t portfolio .
docker run --name portfolio -d -p 80:80 portfolio
```

To rebuild and replace a running container:

```bash
docker rm -f portfolio
docker build -t portfolio .
docker run --name portfolio -d -p 80:80 portfolio
```

nginx config is at `nginx.conf`: gzip enabled, 1-year cache for hashed assets, correct MIME types for `.xml` and `.txt`.

### pnpm 11 notes

The project uses pnpm 11 (via corepack), which has two important differences from earlier versions:

- **`pnpm` field in `package.json` is ignored** — project settings (e.g. `onlyBuiltDependencies`) must go in `pnpm-workspace.yaml`
- **Build scripts are blocked by default** — the Dockerfile uses `--ignore-scripts` on install to bypass the approval mechanism; `onlyBuiltDependencies` in `pnpm-workspace.yaml` allowlists `@resvg/resvg-js` for local development
- **Node.js ≥22.13 required** — the base image is `node:22-alpine`
