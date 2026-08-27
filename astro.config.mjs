import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import rehypeSlug from 'rehype-slug';

function extractFrontmatterDate(filePath) {
  const text = readFileSync(filePath, 'utf-8').replace(/\r\n/g, '\n');
  const match = text.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return undefined;
  const updated = match[1].match(/^updated:\s*['"]([^'"]*)['"]/m);
  const publishedAt = match[1].match(/^publishedAt:\s*['"]([^'"]*)['"]/m);
  return (updated ?? publishedAt)?.[1];
}

function collectLastmods(dir, urlFor) {
  const map = {};
  let files = [];
  try {
    files = readdirSync(dir);
  } catch {
    return map;
  }
  for (const file of files) {
    if (!/\.mdx?$/.test(file)) continue;
    const date = extractFrontmatterDate(path.join(dir, file));
    if (date) map[urlFor(file.replace(/\.mdx?$/, ''))] = date;
  }
  return map;
}

function buildLastmodMap() {
  const contentDir = path.resolve('./src/content');
  return {
    ...collectLastmods(path.join(contentDir, 'blog', 'en'), (slug) => `/writing/en/${slug}/`),
    ...collectLastmods(path.join(contentDir, 'blog', 'id'), (slug) => `/writing/id/${slug}/`),
    ...collectLastmods(path.join(contentDir, 'thoughts', 'en'), (slug) => `/garden/thoughts/en/${slug}/`),
    ...collectLastmods(path.join(contentDir, 'thoughts', 'id'), (slug) => `/garden/thoughts/id/${slug}/`),
    ...collectLastmods(path.join(contentDir, 'case-studies'), (slug) => `/case-studies/${slug}/`),
  };
}

const lastmodMap = buildLastmodMap();

export default defineConfig({
  site: 'https://fadjarrafi.my.id',
  output: 'static',
  integrations: [
    mdx({
      remarkPlugins: [remarkMath, remarkGfm],
      rehypePlugins: [
        rehypeSlug,
        [rehypeKatex, { strict: false, trust: true, output: 'html' }],
      ],
    }),
    sitemap({
      serialize(item) {
        const lastmod = lastmodMap[new URL(item.url).pathname];
        return lastmod ? { ...item, lastmod: new Date(lastmod).toISOString() } : item;
      },
    }),
    tailwind({ applyBaseStyles: false }),
  ],
});
