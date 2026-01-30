// app/garden/concepts/page.tsx
import { Navbar } from "app/components/nav";
import { PageWrapper } from "app/components/page-wrapper";
import { ScrollAnimate } from "app/components/scroll-animate";
import { GardenNav } from "app/components/garden-nav";
import { ConceptsSearch } from "app/components/concepts-search";
import fs from "fs";
import path from "path";

export const metadata = {
  title: "Concepts - Digital Garden",
  description: "A personal lexicon of terms and ideas I'm exploring",
};

interface Concept {
  term: string;
  domain: string[];
  brief: string;
  slug: string;
}

function getConcepts(): Concept[] {
  const conceptsPath = path.join(
    process.cwd(),
    "public",
    "data",
    "concepts.json",
  );

  if (!fs.existsSync(conceptsPath)) {
    return [];
  }

  const fileContent = fs.readFileSync(conceptsPath, "utf-8");
  return JSON.parse(fileContent);
}

export default function ConceptsPage() {
  const concepts = getConcepts();

  const allDomains = Array.from(
    new Set(concepts.flatMap((c) => c.domain)),
  ).sort();

  return (
    <PageWrapper>
      <Navbar />

      <section className="min-h-screen pb-16">
        <div className="max-w-5xl mx-auto">
          <ScrollAnimate>
            <h1 className="font-semibold text-2xl mb-1 tracking-tighter">
              Concepts
            </h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-8">
              A personal lexicon of terms, ideas, and mental models I find
              useful
            </p>

            <p className="text-xs text-neutral-500 mb-6">
              {concepts.length} concepts — {allDomains.length} domains
            </p>
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
              <ConceptsSearch concepts={concepts} allDomains={allDomains} />
            )}
          </ScrollAnimate>
        </div>
      </section>
    </PageWrapper>
  );
}
