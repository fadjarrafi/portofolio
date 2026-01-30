// app/case-studies/[slug]/page.tsx

import { notFound } from "next/navigation";
import { CustomMDX } from "app/components/mdx";
import { formatDate, getCaseStudy, getCaseStudies } from "@/app/case-studies/utils";
import { baseUrl } from "app/sitemap";
import { ScrollAnimate } from "app/components/scroll-animate";
import { Navbar } from "app/components/nav";
import { PageWrapper } from "app/components/page-wrapper";
import Link from "next/link";
import Image from "next/image";

export async function generateStaticParams() {
  const studies = getCaseStudies();
  return studies.map((study) => ({
    slug: study.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const study = getCaseStudy(slug);

  if (!study) {
    return;
  }

  const {
    title,
    publishedAt: publishedTime,
    summary: description,
    image,
  } = study.metadata;

  const ogImage = image
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
      url: `${baseUrl}/case-studies/${study.slug}`,
      images: [{ url: ogImage }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const study = getCaseStudy(slug);

  if (!study) {
    notFound();
  }

  return (
    <>
      <Navbar />

      <PageWrapper>
        <section className="max-w-4xl mx-auto px-6 pb-16">
          <script
            type="application/ld+json"
            suppressHydrationWarning
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Article",
                headline: study.metadata.title,
                datePublished: study.metadata.publishedAt,
                description: study.metadata.summary,
                image: study.metadata.image
                  ? `${baseUrl}${study.metadata.image}`
                  : `/og?title=${encodeURIComponent(study.metadata.title)}`,
                url: `${baseUrl}/case-studies/${study.slug}`,
              }),
            }}
          />

          <ScrollAnimate>
            <Link
              href="/case-studies"
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

            {/* Featured Image */}
            {study.metadata.image && (
              <div className="relative aspect-video mb-8 rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-900">
                <Image
                  src={study.metadata.image}
                  alt={study.metadata.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}

            {/* Header */}
            <div className="mb-8">
              <h1 className="font-semibold text-2xl tracking-tighter mb-3">
                {study.metadata.title}
              </h1>

              <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                {study.metadata.summary}
              </p>

              {/* Metadata */}
              <div className="flex flex-wrap items-center gap-3 text-sm text-neutral-600 dark:text-neutral-400">
                <time dateTime={study.metadata.publishedAt}>
                  {formatDate(study.metadata.publishedAt)}
                </time>

                {study.metadata.client && (
                  <>
                    <span>·</span>
                    <span>Client: {study.metadata.client}</span>
                  </>
                )}

                {study.metadata.role && (
                  <>
                    <span>·</span>
                    <span>Role: {study.metadata.role}</span>
                  </>
                )}

                {study.metadata.duration && (
                  <>
                    <span>·</span>
                    <span>{study.metadata.duration}</span>
                  </>
                )}

                <span>·</span>
                <span>{study.readingTime} min read</span>
              </div>

              {/* Topics */}
              {study.metadata.topics && study.metadata.topics.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {study.metadata.topics.map((topic) => (
                    <span
                      key={topic}
                      className="px-3 py-1 text-xs bg-neutral-100 dark:bg-neutral-800 rounded-full text-neutral-700 dark:text-neutral-300"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </ScrollAnimate>

          <ScrollAnimate delay={100}>
            <article className="prose prose-neutral dark:prose-invert prose-p:my-6 w-full leading-8">
              <CustomMDX source={study.content} />
            </article>
          </ScrollAnimate>
        </section>
      </PageWrapper>
    </>
  );
}
