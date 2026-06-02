import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const siteUrl = context.site?.toString().replace(/\/$/, '') ?? 'https://fadjarrafi.com';
  return new Response(
    `User-agent: *\nAllow: /\nSitemap: ${siteUrl}/sitemap-index.xml\n`,
    { headers: { 'Content-Type': 'text/plain' } }
  );
}
