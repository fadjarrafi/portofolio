// app/garden/concepts/[slug]/page.tsx

import { notFound } from "next/navigation";
import { Navbar } from "@/app/components/nav";
import { PageWrapper } from "@/app/components/page-wrapper";
import { GardenNav } from "@/app/components/garden-nav";
import Link from "next/link";
import fs from "fs";
import path from "path";

interface Concept {
  term: string;
  domain: string[];
  brief: string;
  slug: string;
  extended?: string;
  related?: string[];
  examples?: string[];
  resources?: string[];
}

function getConcepts(): Concept[] {
  const conceptsPath = path.join(
    process.cwd(),
    "public",
    "data",
    "concepts.json"
  );

  if (!fs.existsSync(conceptsPath)) {
    return [];
  }

  const fileContent = fs.readFileSync(conceptsPath, "utf-8");
  return JSON.parse(fileContent);
}

function getConcept(slug: string): Concept | undefined {
  const concepts = getConcepts();
  return concepts.find((c) => c.slug === slug);
}

export async function generateStaticParams() {
  const concepts = getConcepts();
  return concepts.map((concept) => ({
    slug: concept.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const concept = getConcept(slug);

  if (!concept) {
    return {
      title: "Concept Not Found",
    };
  }

  return {
    title: `${concept.term} - Concepts`,
    description: concept.brief,
  };
}

export default async function ConceptPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const concept = getConcept(slug);

  if (!concept) {
    notFound();
  }

  // Get related concepts
  const allConcepts = getConcepts();
  const relatedConcepts = concept.related
    ? allConcepts.filter((c) => concept.related?.includes(c.slug))
    : [];

  return (
    <>
      <PageWrapper>
        <Navbar />

        <section className="min-h-screen pb-16">
          <div className="max-w-4xl mx-auto">
            {/* Back Link */}
            <Link
              href="/garden/concepts"
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
              Back to Concepts
            </Link>

            <GardenNav />

            {/* Concept Header */}
            <div className="mb-8">
              <h1 className="font-semibold text-2xl mb-4 tracking-tighter">
                {concept.term}
              </h1>

              {/* Domain Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {concept.domain.map((d) => (
                  <span
                    key={d}
                    className="text-xs px-3 py-1 bg-neutral-100 dark:bg-neutral-800 rounded-full text-neutral-700 dark:text-neutral-300"
                  >
                    {d}
                  </span>
                ))}
              </div>

              {/* Brief Definition */}
              <div className="p-4 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg">
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-2">
                  Brief Definition
                </p>
                <p className="text-neutral-900 dark:text-neutral-100">
                  {concept.brief}
                </p>
              </div>
            </div>

            {/* Extended Explanation */}
            {concept.extended && (
              <div className="mb-8">
                <h2 className="text-lg font-medium mb-4 text-neutral-900 dark:text-neutral-100">
                  Extended Explanation
                </h2>
                <div className="prose prose-neutral dark:prose-invert max-w-none">
                  <p className="text-neutral-800 dark:text-neutral-200">
                    {concept.extended}
                  </p>
                </div>
              </div>
            )}

            {/* Examples */}
            {concept.examples && concept.examples.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-medium mb-4 text-neutral-900 dark:text-neutral-100">
                  Examples
                </h2>
                <ul className="space-y-3">
                  {concept.examples.map((example, idx) => (
                    <li
                      key={idx}
                      className="flex gap-3 text-sm text-neutral-800 dark:text-neutral-200"
                    >
                      <span className="text-neutral-400 dark:text-neutral-600 flex-shrink-0">
                        •
                      </span>
                      <span>{example}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Related Concepts */}
            {relatedConcepts.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-medium mb-4 text-neutral-900 dark:text-neutral-100">
                  Related Concepts
                </h2>
                <div className="grid gap-3">
                  {relatedConcepts.map((related) => (
                    <Link
                      key={related.slug}
                      href={`/garden/concepts/${related.slug}`}
                      className="group block p-3 border border-neutral-200 dark:border-neutral-800 rounded-lg hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors"
                    >
                      <h3 className="font-medium text-sm text-neutral-900 dark:text-neutral-100 mb-1 group-hover:text-neutral-600 dark:group-hover:text-neutral-400 transition-colors">
                        {related.term}
                      </h3>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400">
                        {related.brief}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Further Resources */}
            {concept.resources && concept.resources.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-medium mb-4 text-neutral-900 dark:text-neutral-100">
                  Further Reading
                </h2>
                <ul className="space-y-2">
                  {concept.resources.map((resource, idx) => (
                    <li
                      key={idx}
                      className="text-sm text-neutral-600 dark:text-neutral-400"
                    >
                      <a
                        href={resource}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-neutral-900 dark:hover:text-neutral-100 underline transition-colors"
                      >
                        {resource}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      </PageWrapper>
    </>
  );
}
