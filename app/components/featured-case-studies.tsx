// app/components/featured-case-studies.tsx

import Link from "next/link";
import { getFeaturedCaseStudies } from "@/app/case-studies/utils";

export function FeaturedCaseStudies() {
  const studies = getFeaturedCaseStudies(3);

  if (studies.length === 0) {
    return null;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-semibold text-lg tracking-tighter">Case Studies</h2>
        <Link
          href="/case-studies"
          className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
        >
          View all
        </Link>
      </div>

      <div className="grid gap-4">
        {studies.map((study) => (
          <Link
            key={study.slug}
            href={`/case-studies/${study.slug}`}
            className="group block"
          >
            <article className="p-4 border border-neutral-200 dark:border-neutral-800 rounded-lg hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors">
              <div className="min-w-0">
                <h3 className="font-medium text-neutral-900 dark:text-neutral-100 mb-1 group-hover:text-neutral-600 dark:group-hover:text-neutral-400 transition-colors truncate">
                  {study.metadata.title}
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2">
                  {study.metadata.summary}
                </p>
                {study.metadata.topics && study.metadata.topics.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {study.metadata.topics.slice(0, 3).map((topic) => (
                      <span
                        key={topic}
                        className="px-2 py-0.5 text-xs bg-neutral-100 dark:bg-neutral-800 rounded text-neutral-600 dark:text-neutral-400"
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
    </div>
  );
}
