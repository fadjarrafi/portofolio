// app/blog/[lang]/[slug]/page.tsx

import { notFound } from "next/navigation";
import { CustomMDX } from "app/components/mdx";
import { formatDate, getBlogPost, getAllBlogPosts } from "@/app/blog/utils";
import { baseUrl } from "app/sitemap";
import { ScrollAnimate } from "app/components/scroll-animate";
import { TableOfContents } from "@/app/components/table-of-content";
import { Navbar } from "app/components/nav";
import { PageWrapper } from "app/components/page-wrapper";
import Link from "next/link";

export async function generateStaticParams() {
  let allPosts = getAllBlogPosts();

  return allPosts.map((post) => ({
    lang: post.metadata.lang || "en",
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang: paramLang, slug } = await params;
  const lang = paramLang === "id" ? "id" : "en";
  let post = getBlogPost(slug, lang);

  if (!post) {
    return;
  }

  let {
    title,
    publishedAt: publishedTime,
    summary: description,
    image,
  } = post.metadata;
  let ogImage = image
    ? image
    : `${baseUrl}/og?title=${encodeURIComponent(title)}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime,
      url: `${baseUrl}/blog/${lang}/${post.slug}`,
      images: [
        {
          url: ogImage,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

function extractHeadings(content: string) {
  const headingRegex = /^#{2}\s+(.+)$/gm;
  const headings: { text: string; slug: string }[] = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const text = match[1];
    const slug = text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    headings.push({ text, slug });
  }

  return headings;
}

export default async function Blog({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang: paramLang, slug } = await params;
  const lang = paramLang === "id" ? "id" : "en";
  let post = getBlogPost(slug, lang);

  if (!post) {
    notFound();
  }

  const headings = extractHeadings(post.content);

  // Check if translation exists
  const translationSlug = post.metadata.translationSlug;
  const targetLang = lang === "en" ? "id" : "en";
  const hasTranslation =
    translationSlug && getBlogPost(translationSlug, targetLang);

  return (
    <>
      {/* Fixed Navbar */}
      <Navbar />

      <PageWrapper>
        <section className="max-w-6xl mx-auto px-6 pb-16">
          <script
            type="application/ld+json"
            suppressHydrationWarning
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "BlogPosting",
                headline: post.metadata.title,
                datePublished: post.metadata.publishedAt,
                dateModified: post.metadata.publishedAt,
                description: post.metadata.summary,
                image: post.metadata.image
                  ? `${baseUrl}${post.metadata.image}`
                  : `/og?title=${encodeURIComponent(post.metadata.title)}`,
                url: `${baseUrl}/blog/${lang}/${post.slug}`,
                author: {
                  "@type": "Person",
                  name: "My Portfolio",
                },
              }),
            }}
          />

          <Link
            href="/blog"
            className="inline-flex items-center text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 mb-8 py-2 px-2 -ml-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
            Back
          </Link>

          <h1 className="title font-semibold text-2xl tracking-tighter">
            {post.metadata.title}
          </h1>
          <div className="flex justify-between items-center mt-2 mb-8 text-sm">
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              {formatDate(post.metadata.publishedAt)}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,2.5fr)_280px] gap-8 relative">
            {/* Main Content */}
            <article className="prose prose-neutral dark:prose-invert prose-p:my-6 w-full leading-8 min-w-0">
              <CustomMDX source={post.content} />
            </article>

            {/* Sticky Sidebar */}
            <div className="order-first lg:order-last">
              <aside className="lg:sticky lg:top-24 lg:self-start space-y-4">
                {/* Translation Link - Only shown if translation exists */}
                {hasTranslation && translationSlug && (
                  <div className="p-4 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-50 dark:bg-neutral-900">
                    <Link
                      href={`/blog/${targetLang}/${translationSlug}`}
                      className="flex items-center gap-2 text-sm font-mono text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="m5 8 6 6" />
                        <path d="m4 14 6-6 2-3" />
                        <path d="M2 5h12" />
                        <path d="M7 2h1" />
                        <path d="m22 22-5-10-5 10" />
                        <path d="M14 18h6" />
                      </svg>
                      <span className="font-medium">
                        {lang === "en"
                          ? "Baca dalam Bahasa Indonesia"
                          : "Read in English"}
                      </span>
                    </Link>
                  </div>
                )}

                {/* Table of Contents */}
                {headings.length > 0 && <TableOfContents headings={headings} />}
              </aside>
            </div>
          </div>
        </section>
      </PageWrapper>
    </>
  );
}
