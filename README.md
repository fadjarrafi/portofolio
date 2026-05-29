# Portfolio

Personal portfolio and blog site built with Astro 5, featuring bilingual content (English/Indonesian), a writing section for full articles, and a digital garden for shorter thoughts.

## Tech Stack

- **Framework:** Astro 5 (static output, zero JS by default)
- **Styling:** Tailwind CSS v3 + `@tailwindcss/typography`
- **Content:** MDX via `@astrojs/mdx` with Zod schema validation
- **Math:** LaTeX support via `remark-math` + `rehype-katex`
- **Syntax Highlighting:** `sugar-high`
- **Analytics:** Google Analytics 4 (via `PUBLIC_GA_ID` env var)
- **Server:** nginx (Docker)

## Getting Started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:4321](http://localhost:4321) to view the site.

## Production Build

```bash
pnpm build
pnpm preview
```

## Docker

Build and run the container (served by nginx on port 80):

```bash
docker build -t portfolio .
docker run --name portfolio -d -p 80:80 portfolio
```

To rebuild after a code change:

```bash
docker rm -f portfolio
docker build -t portfolio .
docker run --name portfolio -d -p 80:80 portfolio
```

## Project Structure

```
src/
├── components/         # Astro components (Nav, Footer, search, TOC, etc.)
├── content/            # MDX content collections
│   ├── blog/
│   │   ├── en/         # English articles (.mdx)
│   │   └── id/         # Indonesian articles (.mdx)
│   ├── thoughts/       # Digital garden posts
│   │   ├── en/
│   │   └── id/
│   └── case-studies/   # Portfolio case studies (.mdx)
├── layouts/
│   └── BaseLayout.astro  # HTML shell, SEO meta, fonts, GA4
├── pages/              # File-based routing
│   ├── index.astro
│   ├── writing/
│   ├── garden/
│   ├── case-studies/
│   ├── rss.xml.ts
│   └── robots.txt.ts
├── styles/
│   └── global.css      # Tailwind directives + prose styles
└── utils/
    ├── posts.ts        # readingTime, growthStage, relatedPosts
    └── format.ts       # formatDate
public/
└── data/               # Static JSON read at build time
    ├── experiences.json
    ├── concepts.json
    └── library.json
```

## Adding Content

### Writing (Articles)

Create a `.mdx` file in `src/content/blog/{en,id}/`:

```yaml
---
title: 'Your Article Title'
publishedAt: '2025-01-01'
featured: false
topics: ['programming']
type: 'note'
lang: 'en'
translationSlug: 'your-article-slug'
---
```

| Field | Description |
|---|---|
| `topics` | Array of tags — used for related post recommendations |
| `type` | `note` \| `tutorial` \| `essay` |
| `translationSlug` | Shared slug linking EN and ID versions of the same post |
| `featured` | Surfaces the post on the home page |

### Digital Garden (Thoughts)

Create a `.mdx` file in `src/content/thoughts/{en,id}/`:

```yaml
---
title: 'Your Thought Title'
publishedAt: '2025-01-01'
summary: 'Brief description'
topics: ['topic1', 'topic2']
type: 'note'
status: 'seed'
lang: 'en'
---
```

| Field | Description |
|---|---|
| `status` | Growth stage: `seed` (<300 words), `sapling` (300–800 words), `tree` (>800 words) — auto-derived from word count if omitted |
| `topics` | Used for related thought recommendations |

Both content types are served at bilingual routes — e.g. `/writing/en/cors-what-it-is` and `/writing/id/cors-what-it-is`.
