# Portfolio

Personal portfolio and blog site built with Next.js 16, featuring bilingual content (English/Indonesian), a writing section for articles, and a digital garden for shorter thoughts.

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

## Building for Production

```bash
pnpm build
pnpm start
```

## Docker

```bash
docker build -t portfolio .
docker run -p 3000:3000 portfolio
```

## Content

- **Writing** — full articles in `app/writing/posts/{en,id}/`
- **Digital Garden** — shorter thoughts in `app/garden/thoughts/posts/{en,id}/`

Posts are MDX files with YAML frontmatter. The digital garden uses growth stages (seed/sapling/tree) based on word count.
