# Portfolio

Personal portfolio and blog site built with Next.js 16, featuring bilingual content (English/Indonesian), a writing section for full articles, and a digital garden for shorter thoughts.

## Tech Stack

- **Framework:** Next.js 16 (App Router, standalone output)
- **Styling:** Tailwind CSS v4
- **Content:** MDX with `next-mdx-remote/rsc`
- **Math:** LaTeX support via `remark-math` + `rehype-katex`
- **Syntax Highlighting:** `sugar-high`
- **Analytics:** Vercel Analytics + Speed Insights

## Getting Started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Production Build

```bash
pnpm build
pnpm start
```

## Docker

Build and run the container:

```bash
docker build -t portfolio .
docker run --name portfolio -d -p 3000:3000 portfolio
```

To rebuild after a code change:

```bash
docker rm -f portfolio
docker build -t portfolio .
docker run --name portfolio -d -p 3000:3000 portfolio
```

## Project Structure

```
app/
├── components/         # Shared React components
├── writing/            # Blog articles
│   ├── posts/
│   │   ├── en/         # English articles (.mdx)
│   │   └── id/         # Indonesian articles (.mdx)
│   └── utils.ts        # Post fetching and parsing
├── garden/             # Digital garden
│   ├── thoughts/       # Short-form essays
│   │   └── posts/
│   │       ├── en/
│   │       └── id/
│   ├── concepts/       # Glossarium entries
│   └── library/        # Reading notes & resources
├── case-studies/       # Portfolio case studies (.mdx)
└── og/                 # Open Graph image generation
```

## Adding Content

### Writing (Articles)

Create a `.mdx` file in `app/writing/posts/{en,id}/`:

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

Create a `.mdx` file in `app/garden/thoughts/posts/{en,id}/`:

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
| `status` | Growth stage: `seed` (<300 words), `sapling` (300–800 words), `tree` (>800 words) |
| `topics` | Used for related thought recommendations |

Both content types are served at bilingual routes — e.g. `/en/cors-what-it-is` and `/id/cors-what-it-is`.
