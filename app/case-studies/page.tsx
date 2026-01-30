// app/case-studies/page.tsx

import { getCaseStudies, formatDate } from "app/case-studies/utils";
import { ScrollAnimate } from "app/components/scroll-animate";
import { Navbar } from "app/components/nav";
import { PageWrapper } from "app/components/page-wrapper";
import Link from "next/link";

export const metadata = {
  title: "Case Studies",
  description: "Projects I've worked on and the stories behind them.",
};

export default function CaseStudiesPage() {
  const allStudies = getCaseStudies().sort((a, b) => {
    if (new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)) {
      return -1;
    }
    return 1;
  });

  return (
    <>
      <PageWrapper>
        <Navbar />

        <section className="min-h-screen pb-16">
          <div className="max-w-4xl mx-auto">
            <ScrollAnimate>
              <h1 className="font-semibold text-2xl mb-2 tracking-tighter">
                Case Studies
              </h1>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-8">
                Projects I've worked on and the stories behind them
              </p>

              <div className="flex flex-wrap gap-4 mb-12 text-xs text-neutral-600 dark:text-neutral-400">
                <span>{allStudies.length} projects</span>
              </div>
            </ScrollAnimate>

            <ScrollAnimate delay={100}>
              {allStudies.length === 0 ? (
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  No case studies yet.
                </p>
              ) : (
                <div className="grid gap-8">
                  {allStudies.map((study) => (
                    <Link
                      key={study.slug}
                      href={`/case-studies/${study.slug}`}
                      className="group block"
                    >
                      <article className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors">
                        <div className="p-6">
                          <h2 className="font-medium text-lg text-neutral-900 dark:text-neutral-100 mb-2 group-hover:text-neutral-600 dark:group-hover:text-neutral-400 transition-colors">
                            {study.metadata.title}
                          </h2>
                          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4 line-clamp-2">
                            {study.metadata.summary}
                          </p>
                          <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-500 dark:text-neutral-500">
                            <time dateTime={study.metadata.publishedAt}>
                              {formatDate(study.metadata.publishedAt)}
                            </time>
                            {study.metadata.client && (
                              <>
                                <span>·</span>
                                <span>{study.metadata.client}</span>
                              </>
                            )}
                            {study.metadata.role && (
                              <>
                                <span>·</span>
                                <span>{study.metadata.role}</span>
                              </>
                            )}
                          </div>
                          {study.metadata.topics &&
                            study.metadata.topics.length > 0 && (
                              <div className="flex flex-wrap gap-2 mt-4">
                                {study.metadata.topics.map((topic) => (
                                  <span
                                    key={topic}
                                    className="px-2 py-1 text-xs bg-neutral-100 dark:bg-neutral-800 rounded text-neutral-700 dark:text-neutral-300"
                                  >
                                    {topic}
                                  </span>
                                ))}
                              </div>
                            )}
                        </div>
                      </article>
                    </Link>
                  ))}
                </div>
              )}
            </ScrollAnimate>
          </div>
        </section>
      </PageWrapper>
    </>
  );
}
