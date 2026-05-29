import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import rehypeSlug from 'rehype-slug';

export default defineConfig({
  site: 'https://fadjarrafi.com',
  output: 'static',
  integrations: [
    mdx({
      remarkPlugins: [remarkMath, remarkGfm],
      rehypePlugins: [
        rehypeSlug,
        [rehypeKatex, { strict: false, trust: true, output: 'html' }],
      ],
    }),
    sitemap(),
    tailwind({ applyBaseStyles: false }),
  ],
});
