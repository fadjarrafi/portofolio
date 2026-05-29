# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev      # Start development server
pnpm build    # Build for production (standalone output)
pnpm start    # Start production server
```

No test or lint commands are configured.

## Architecture

This is a Next.js 16 portfolio/blog site using the App Router with Tailwind CSS v4 and MDX for content.

### Content Structure

The site has two main content sections with bilingual (English/Indonesian) support:

- **Writing** (`app/writing/posts/{en,id}/`): Full articles with topics, types, and reading time
- **Digital Garden** (`app/garden/thoughts/posts/{en,id}/`): Shorter thoughts with growth stages (seed/sapling/tree based on word count)

Both use MDX files with YAML frontmatter. Posts are fetched via `app/writing/utils.ts` and `app/garden/utils.ts` which parse frontmatter, calculate reading time, and provide React-cached getters.

#### Writing frontmatter

```yaml
title: 'Article Title'
publishedAt: '2025-01-01'
featured: false
topics: ['programming']
type: 'note'          # note | tutorial | essay
lang: 'en'
translationSlug: 'slug-shared-between-en-and-id'
```

#### Garden (thoughts) frontmatter

```yaml
title: 'Thought Title'
publishedAt: '2025-01-01'
summary: 'Brief description'
topics: ['topic1', 'topic2']
type: 'note'
status: 'seed'        # seed | sapling | tree (or derived from word count)
lang: 'en'
```

### MDX Processing

Content is rendered using `next-mdx-remote/rsc` with:
- `sugar-high` for syntax highlighting
- `remark-math` + `rehype-katex` for LaTeX math support
- `remark-gfm` for GitHub-flavored markdown

Custom MDX components are in `app/components/mdx.tsx` (auto-linked headings, custom links, images).

### Key Patterns

- Path alias: `@/*` maps to project root
- Fonts: Outfit (body) and IBM Plex Mono (code) via `next/font/google`
- Routes use dynamic segments: `[lang]/[slug]` pattern for bilingual posts
- Related posts are computed by shared topics with relevance scoring

## Docker

The Dockerfile uses a multi-stage build (deps → builder → runner) with `output: 'standalone'`.

```bash
docker build -t portfolio .
docker run --name portfolio -d -p 3000:3000 portfolio
```

To rebuild and replace a running container:

```bash
docker rm -f portfolio
docker build -t portfolio .
docker run --name portfolio -d -p 3000:3000 portfolio
```

### pnpm 11 notes

The project uses pnpm 11 (via corepack), which has two important differences from earlier versions:

- **`pnpm` field in `package.json` is ignored** — project settings (e.g. `onlyBuiltDependencies`) must go in `pnpm-workspace.yaml`
- **Build scripts are blocked by default** — the Dockerfile uses `--ignore-scripts` on install to bypass the approval mechanism; `onlyBuiltDependencies` in `pnpm-workspace.yaml` allowlists `sharp` and `@vercel/speed-insights` for local development
- **Node.js ≥22.13 required** — the base image is `node:22-alpine`
