# fadjarrafi.xyz

Personal portfolio and digital garden built with Next.js, featuring bilingual content (English/Indonesian), a writing section, a digital garden, and case studies.

## Tech Stack

| Category | Technology |
|---|---|
| Framework | Next.js (App Router, standalone output) |
| Styling | Tailwind CSS v4 |
| Content | MDX via `next-mdx-remote/rsc` |
| Math | LaTeX via `remark-math` + `rehype-katex` |
| Syntax Highlighting | `sugar-high` |
| Fonts | Outfit (body), IBM Plex Mono (code) |
| Analytics | Vercel Speed Insights |
| Package Manager | pnpm |

## Commands

```bash
pnpm install     # Install dependencies
pnpm dev         # Start development server (http://localhost:3000)
pnpm build       # Build for production
pnpm start       # Start production server
```

## Docker

```bash
docker build -t fadjarrafi-portfolio .
docker run -p 3000:3000 fadjarrafi-portfolio
```

## Project Structure

```
app/
├── page.tsx                          # Homepage
├── layout.tsx                        # Root layout (fonts, metadata)
├── global.css                        # Global styles
├── sitemap.ts                        # Sitemap (baseUrl: fadjarrafi.xyz)
├── robots.ts                         # Robots.txt
├── rss/route.ts                      # RSS feed
├── og/route.tsx                      # OG image generation
│
├── writing/                          # Long-form articles
│   ├── page.tsx                      # Posts list with search/filter
│   ├── [lang]/[slug]/page.tsx        # Post detail page
│   ├── utils.ts                      # Post fetching, related posts
│   ├── format.ts                     # Date formatting (client-safe)
│   └── posts/
│       ├── en/                       # English posts (.mdx)
│       └── id/                       # Indonesian posts (.mdx)
│
├── garden/                           # Digital garden
│   ├── thoughts/                     # Short-to-long form thoughts
│   │   ├── page.tsx                  # Thoughts list with growth stages
│   │   ├── [lang]/[slug]/page.tsx    # Thought detail page
│   │   └── posts/
│   │       ├── en/
│   │       └── id/
│   ├── concepts/                     # Glossary / concept definitions
│   │   ├── page.tsx
│   │   └── [slug]/page.tsx
│   ├── library/                      # Reading notes & resources
│   │   └── page.tsx
│   ├── utils.ts                      # Garden post fetching
│   └── format.ts
│
├── case-studies/                     # Project case studies
│   ├── page.tsx
│   ├── [slug]/page.tsx
│   ├── utils.ts
│   └── posts/                        # Case study MDX files
│
└── components/
    ├── nav.tsx                       # Top navigation
    ├── footer.tsx                    # Footer
    ├── mdx.tsx                       # Custom MDX components
    ├── page-wrapper.tsx              # Client wrapper (route transitions)
    ├── scroll-animate.tsx            # Intersection observer animations
    ├── posts.tsx / posts-search.tsx  # Writing post list + filter
    ├── garden-posts-search.tsx       # Garden thought list + filter
    ├── featured-posts.tsx            # Featured writing on homepage
    ├── featured-case-studies.tsx     # Featured case studies on homepage
    ├── related-posts.tsx             # Related writing posts sidebar
    ├── garden-related-posts.tsx      # Related garden thoughts
    ├── table-of-content.tsx          # Sticky ToC sidebar
    ├── garden-nav.tsx                # Garden section navigation
    ├── work-experience.tsx           # Work timeline on homepage
    ├── hero.tsx / hero-wide.tsx      # Hero variants
    └── concepts-search.tsx / library-search.tsx
```

## Routes

| Route | Description |
|---|---|
| `/` | Homepage — intro, work experience, featured case studies, featured posts |
| `/writing` | All articles with search, topic filter, and type filter |
| `/writing/[lang]/[slug]` | Article detail — ToC, related posts, translation switcher |
| `/garden/thoughts` | Garden thoughts list with growth stage stats |
| `/garden/thoughts/[lang]/[slug]` | Thought detail |
| `/garden/concepts` | Concept glossary |
| `/garden/concepts/[slug]` | Concept detail |
| `/garden/library` | Library / reading notes |
| `/case-studies` | Case studies list |
| `/case-studies/[slug]` | Case study detail |
| `/rss` | RSS feed (English writing posts) |
| `/sitemap.xml` | Sitemap |
| `/og` | Dynamic OG image generation |

## Content

### Writing Posts (`app/writing/posts/{en,id}/`)

Long-form articles with full frontmatter:

```yaml
---
title: 'Post Title'
publishedAt: '2025-01-01'
summary: 'One-sentence description shown in cards and RSS.'
featured: true
topics: ['javascript', 'web']
type: 'tutorial'       # essay | tutorial | note | reflection | review
lang: 'en'
translationSlug: 'same-slug-in-other-lang'
updated: '2025-03-01'  # optional
---
```

### Garden Thoughts (`app/garden/thoughts/posts/{en,id}/`)

Shorter, evolving ideas. Growth stage is auto-assigned from word count if `status` is omitted:

| Stage | Word Count | Emoji |
|---|---|---|
| seed | < 300 | 🌱 |
| sapling | 300–999 | 🌿 |
| tree | 1000+ | 🌳 |

```yaml
---
title: 'Thought Title'
publishedAt: '2025-01-01'
summary: 'Brief description.'
topics: ['philosophy']
type: 'note'
status: 'seed'   # optional — auto-derived from word count if omitted
lang: 'en'
---
```

### Case Studies (`app/case-studies/posts/`)

Project deep-dives:

```yaml
---
title: 'Project Name'
publishedAt: '2025-01-01'
summary: 'What was built and why.'
image: 'https://...'
featured: true
topics: ['AI', 'Python']
role: 'Full-stack Developer'
duration: '2 months'
---
```

## Bilingual Support

Content is organized by language folder (`en/` and `id/`). Posts link to their translation via `translationSlug`. The post detail page shows a language switcher in the sidebar when a translation exists.

## Known Issues

See [`docs/issues.md`](docs/issues.md) for tracked issues and fixes.
