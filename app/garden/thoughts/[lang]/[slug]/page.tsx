// app/garden/thoughts/[lang]/[slug]/page.tsx

import { notFound } from "next/navigation";
import { CustomMDX } from "@/app/components/mdx";
import {
  formatDate,
  getGardenThought,
  getAllGardenThoughts,
  getRelatedThoughts,
} from "@/app/garden/utils";
import { baseUrl } from "@/app/sitemap";
import { ScrollAnimate } from "@/app/components/scroll-animate";
import { TableOfContents } from "@/app/components/table-of-content";
import { GardenRelatedPosts } from "@/app/components/garden-related-posts";
import { Navbar } from "@/app/components/nav";
import { PageWrapper } from "@/app/components/page-wrapper";
import Link from "next/link";
import type { PostType, GrowthStage } from "@/app/garden/utils";

const typeEmojis: Record<PostType, string> = {
  essay: "📝",
  tutorial: "💻",
  note: "📚",
  reflection: "🤔",
  review: "⭐",
};

const stageEmojis: Record<GrowthStage, string> = {
  seed: "🌱",
  sapling: "🌿",
  tree: "🌳",
};

export async function generateStaticParams() {
  let allThoughts = getAllGardenThoughts();

  return allThoughts.map((thought) => ({
    lang: thought.metadata.lang || "en",
    slug: thought.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang: paramLang, slug } = await params;
  const lang = paramLang === "id" ? "id" : "en";
  let thought = getGardenThought(slug, lang);

  if (!thought) {
    return;
  }

  let {
    title,
    publishedAt: publishedTime,
    summary: description,
    image,
  } = thought.metadata;
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
      url: `${baseUrl}/garden/thoughts/${lang}/${thought.slug}`,
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

export default async function ThoughtPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang: paramLang, slug } = await params;
  const lang = paramLang === "id" ? "id" : "en";
  let thought = getGardenThought(slug, lang);

  if (!thought) {
    notFound();
  }

  const headings = extractHeadings(thought.content);
  const relatedThoughts = getRelatedThoughts(slug, lang, 3);

  const translationSlug = thought.metadata.translationSlug;
  const targetLang = lang === "en" ? "id" : "en";
  const hasTranslation =
    translationSlug && getGardenThought(translationSlug, targetLang);

  return (
    <>
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
                headline: thought.metadata.title,
                datePublished: thought.metadata.publishedAt,
                dateModified: thought.metadata.publishedAt,
                description: thought.metadata.summary,
                image: thought.metadata.image
                  ? `${baseUrl}${thought.metadata.image}`
                  : `/og?title=${encodeURIComponent(thought.metadata.title)}`,
                url: `${baseUrl}/garden/thoughts/${lang}/${thought.slug}`,
                author: {
                  "@type": "Person",
                  name: "My Portfolio",
                },
              }),
            }}
          />

          <ScrollAnimate>
            <Link
              href="/garden/thoughts"
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
              Back to Garden
            </Link>

            {/* Post Header */}
            <div className="mb-8">
              <div className="flex items-start gap-3 mb-3">
                {thought.metadata.status && (
                  <span className="text-2xl flex-shrink-0 mt-1">
                    {stageEmojis[thought.metadata.status]}
                  </span>
                )}
                {thought.metadata.type && (
                  <span className="text-2xl flex-shrink-0 mt-1">
                    {typeEmojis[thought.metadata.type]}
                  </span>
                )}
                <h1 className="title font-semibold text-2xl tracking-tighter">
                  {thought.metadata.title}
                </h1>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-sm text-neutral-600 dark:text-neutral-400">
                <time dateTime={thought.metadata.publishedAt}>
                  {formatDate(thought.metadata.publishedAt)}
                </time>
                <span>·</span>
                <span>{thought.readingTime} min read</span>
                {thought.metadata.updated && (
                  <>
                    <span>·</span>
                    <span className="text-green-600 dark:text-green-400">
                      Updated {formatDate(thought.metadata.updated)}
                    </span>
                  </>
                )}
              </div>

              {thought.metadata.topics &&
                Array.isArray(thought.metadata.topics) &&
                thought.metadata.topics.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {thought.metadata.topics.map((topic) => (
                      <Link
                        key={topic}
                        href={`/garden/thoughts?topic=${topic}`}
                        className="px-3 py-1 text-xs bg-neutral-100 dark:bg-neutral-800 rounded-full text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                      >
                        {topic}
                      </Link>
                    ))}
                  </div>
                )}
            </div>
          </ScrollAnimate>

          <ScrollAnimate delay={100}>
            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,2.5fr)_280px] gap-8 relative">
            <article className="prose prose-neutral dark:prose-invert prose-p:my-6 w-full leading-8 min-w-0">
              <CustomMDX source={thought.content} />

              {relatedThoughts.length > 0 && (
                <GardenRelatedPosts
                  posts={relatedThoughts}
                  currentLang={lang}
                />
              )}
            </article>

            <div className="order-first lg:order-last">
              <aside className="lg:sticky lg:top-24 lg:self-start space-y-4">
                {hasTranslation && translationSlug && (
                  <div className="p-4 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-50 dark:bg-neutral-900">
                    <Link
                      href={`/garden/thoughts/${targetLang}/${translationSlug}`}
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

                {headings.length > 0 && <TableOfContents headings={headings} />}
              </aside>
            </div>
            </div>
          </ScrollAnimate>
        </section>
      </PageWrapper>
    </>
  );
}
