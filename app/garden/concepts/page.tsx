// app/garden/concepts/page.tsx
import { Navbar } from "app/components/nav";
import { PageWrapper } from "app/components/page-wrapper";
import { ScrollAnimate } from "app/components/scroll-animate";
import { GardenNav } from "app/components/garden-nav";
import Link from "next/link";
import fs from "fs";
import path from "path";

export const metadata = {
  title: "Concepts - Digital Garden",
  description: "A personal lexicon of terms and ideas I'm exploring",
};

// Type definition for concept
interface Concept {
  term: string;
  domain: string[];
  brief: string;
  slug: string;
}

// Read concepts from JSON file
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

export default function ConceptsPage() {
  const concepts = getConcepts();

  // Get unique domains for stats
  const allDomains = Array.from(
    new Set(concepts.flatMap((c) => c.domain))
  ).sort();

  return (
    <>
      <PageWrapper>
        <Navbar />

        <section className="min-h-screen pb-16">
          <div className="max-w-4xl mx-auto">
            <ScrollAnimate>
              <h1 className="font-semibold text-2xl mb-2 tracking-tighter">
                Concepts
              </h1>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-8">
                A personal lexicon of terms, ideas, and mental models I find
                useful
              </p>

              <div className="flex flex-wrap gap-4 mb-8 text-xs text-neutral-600 dark:text-neutral-400">
                <span>{concepts.length} concepts</span>
                <span>·</span>
                <span>{allDomains.length} domains</span>
              </div>
            </ScrollAnimate>

            <ScrollAnimate delay={50}>
              <GardenNav />
            </ScrollAnimate>

            <ScrollAnimate delay={100}>
              {concepts.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                    No concepts yet. Start building your lexicon by creating{" "}
                    <code className="px-2 py-1 bg-neutral-100 dark:bg-neutral-800 rounded text-xs">
                      public/data/concepts.json
                    </code>
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Alphabetical List */}
                  {concepts
                    .sort((a, b) => a.term.localeCompare(b.term))
                    .map((concept) => (
                      <Link
                        key={concept.slug}
                        href={`/garden/concepts/${concept.slug}`}
                        className="group block p-4 border border-neutral-200 dark:border-neutral-800 rounded-lg hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors"
                      >
                        <h3 className="font-medium text-neutral-900 dark:text-neutral-100 mb-2 group-hover:text-neutral-600 dark:group-hover:text-neutral-400 transition-colors">
                          {concept.term}
                        </h3>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
                          {concept.brief}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {concept.domain.map((d) => (
                            <span
                              key={d}
                              className="text-xs px-2 py-1 bg-neutral-100 dark:bg-neutral-800 rounded text-neutral-700 dark:text-neutral-300"
                            >
                              {d}
                            </span>
                          ))}
                        </div>
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
