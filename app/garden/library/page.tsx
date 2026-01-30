// app/garden/library/page.tsx
import { Navbar } from "app/components/nav";
import { PageWrapper } from "app/components/page-wrapper";
import { ScrollAnimate } from "app/components/scroll-animate";
import { GardenNav } from "app/components/garden-nav";
import { LibrarySearch } from "app/components/library-search";
import fs from "fs";
import path from "path";

export const metadata = {
  title: "Library - Digital Garden",
  description: "Curated resources, book notes, and learning materials",
};

interface Resource {
  title: string;
  author?: string;
  type: "book" | "article" | "paper" | "video" | "course";
  topics: string[];
  status: "reading" | "completed" | "reference";
  rating?: number;
  id: string;
  url?: string;
  date_consumed?: string;
}

function getResources(): Resource[] {
  const resourcesPath = path.join(
    process.cwd(),
    "public",
    "data",
    "library.json",
  );

  if (!fs.existsSync(resourcesPath)) {
    return [];
  }

  const fileContent = fs.readFileSync(resourcesPath, "utf-8");
  return JSON.parse(fileContent);
}

export default function LibraryPage() {
  const resources = getResources();

  const allTopics = Array.from(
    new Set(resources.flatMap((r) => r.topics)),
  ).sort();

  const reading = resources.filter((r) => r.status === "reading").length;
  const completed = resources.filter((r) => r.status === "completed").length;

  return (
    <PageWrapper>
      <Navbar />

      <section className="min-h-screen pb-16">
        <div className="max-w-5xl mx-auto">
          <ScrollAnimate>
            <h1 className="font-semibold text-2xl mb-1 tracking-tighter">
              Library
            </h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-8">
              Books, articles, papers, and courses I'm exploring or have
              completed
            </p>

            <p className="text-xs text-neutral-500 mb-6">
              {resources.length} resources — {reading} reading, {completed}{" "}
              completed
            </p>
          </ScrollAnimate>

          <ScrollAnimate delay={50}>
            <GardenNav />
          </ScrollAnimate>

          <ScrollAnimate delay={100}>
            {resources.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                  No resources yet. Start building your library by creating{" "}
                  <code className="px-2 py-1 bg-neutral-100 dark:bg-neutral-800 rounded text-xs">
                    public/data/library.json
                  </code>
                </p>
              </div>
            ) : (
              <LibrarySearch resources={resources} allTopics={allTopics} />
            )}
          </ScrollAnimate>
        </div>
      </section>
    </PageWrapper>
  );
}
