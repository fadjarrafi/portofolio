# Known Issues

## Critical

### 1. Wrong `baseUrl` — `app/sitemap.ts:3`
Still using the starter template default `'https://portfolio-blog-starter.vercel.app'`. Propagates to the sitemap, RSS feed, OG image URLs, and JSON-LD structured data.
**Fix:** Set to `'https://fadjarrafi.xyz'`.

### 2. Wrong URL structure in sitemap — `app/sitemap.ts:7`
Post URLs use `/writing/${post.slug}` but the actual route is `/writing/[lang]/[slug]`.
**Fix:** Change to `/writing/en/${post.slug}`.

### 3. Wrong URL structure in RSS — `app/rss/route.ts:20`
Same issue as above — links resolve to 404.
**Fix:** Change to `/writing/en/${post.slug}`.

### 4. All 11 writing posts missing `summary` frontmatter — `app/writing/posts/en/*.mdx`
Every English writing post has no `summary:` field. Post cards and the RSS feed description are blank.
**Fix:** Add a `summary:` field to each post's frontmatter.

---

## Notable

### 5. `app/writing/utils.ts` missing `import 'server-only'`
`app/garden/utils.ts` guards against client-side import with `import 'server-only'`, but `writing/utils.ts` does not, despite both using `fs`. Accidental client import would produce a confusing runtime error.
**Fix:** Add `import 'server-only'` at the top of `app/writing/utils.ts`.

### 6. Analytics commented out — `app/layout.tsx:71`
`<Analytics />` from `@vercel/analytics` is commented out. The package is installed but no page-view data is being collected.
**Fix:** Uncomment `<Analytics />`.

### 7. OG image default title — `app/og/route.tsx:5`
Fallback title is still `'Next.js Portfolio Starter'`. Shown if the `title` query param is missing.
**Fix:** Change to your own name/site title.

### 8. Hardcoded `lang="en"` on `<html>` — `app/layout.tsx:60`
Indonesian posts (`/writing/id/...`) still render with `lang="en"` on the root element. Bad for accessibility and screen readers.
**Fix:** Pass the language dynamically, or use a `lang` param in the root layout for post pages.

---

## Minor

### 9. JSON-LD author name — `app/writing/[lang]/[slug]/page.tsx:149`
Author is set to `"My Portfolio"` instead of the actual person name.
**Fix:** Change to `"Fadjar Rafi"`.

### 10. Sitemap missing routes — `app/sitemap.ts`
Only `/` and `/writing` are in the sitemap. `/garden/thoughts`, `/case-studies`, and individual post pages for both sections are not included.
**Fix:** Extend sitemap to cover all routes.

### 11. `pnpm-workspace.yaml` untracked — repo root
Shows in `git status` but hasn't been committed. If intentional, commit it; if not, delete it.
