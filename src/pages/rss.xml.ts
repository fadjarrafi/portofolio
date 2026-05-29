import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = await getCollection('blog', ({ id }) => id.startsWith('en/'));
  const sorted = posts.sort(
    (a, b) => new Date(b.data.publishedAt).getTime() - new Date(a.data.publishedAt).getTime()
  );

  return rss({
    title: 'fadjarrafi',
    description: 'Writing about code, mathematics, philosophy, and things I am learning.',
    site: context.site!,
    items: sorted.map((post) => {
      const slug = post.id.replace('en/', '');
      return {
        title: post.data.title,
        pubDate: new Date(post.data.publishedAt),
        description: post.data.summary,
        link: `/writing/en/${slug.replace(/\.mdx?$/, '')}`,
      };
    }),
  });
}
