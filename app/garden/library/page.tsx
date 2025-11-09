// app/garden/library/page.tsx
import { Navbar } from "app/components/nav";
import { PageWrapper } from "app/components/page-wrapper";
import { ScrollAnimate } from "app/components/scroll-animate";
import { GardenNav } from "app/components/garden-nav";
import Link from "next/link";
import fs from "fs";
import path from "path";

export const metadata = {
  title: "Library - Digital Garden",
  description: "Curated resources, book notes, and learning materials",
};

// Type definition for library resource
interface Resource {
  title: string;
  author?: string;
  type: "book" | "article" | "paper" | "video" | "course";
  topics: string[];
  status: "reading" | "completed" | "reference";
  rating?: number;
  slug: string;
  url?: string;
  date_consumed?: string;
}

// Read resources from JSON file
function getResources(): Resource[] {
  const resourcesPath = path.join(
    process.cwd(),
    "public",
    "data",
    "library.json"
  );

  if (!fs.existsSync(resourcesPath)) {
    return [];
  }

  const fileContent = fs.readFileSync(resourcesPath, "utf-8");
  return JSON.parse(fileContent);
}

const typeEmojis: Record<Resource["type"], string> = {
  book: "📚",
  article: "📄",
  paper: "📑",
  video: "🎥",
  course: "🎓",
};

const statusLabels: Record<Resource["status"], string> = {
  reading: "Currently Reading",
  completed: "Completed",
  reference: "Reference",
};

export default function LibraryPage() {
  const resources = getResources();

  // Group by status
  const reading = resources.filter((r) => r.status === "reading");
  const completed = resources.filter((r) => r.status === "completed");
  const reference = resources.filter((r) => r.status === "reference");

  // Get all topics
  const allTopics = Array.from(
    new Set(resources.flatMap((r) => r.topics))
  ).sort();

  return (
    <>
      <PageWrapper>
        <Navbar />

        <section className="min-h-screen pb-16">
          <div className="max-w-4xl mx-auto">
            <ScrollAnimate>
              <h1 className="font-semibold text-2xl mb-2 tracking-tighter">
                Library
              </h1>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-8">
                Books, articles, papers, and courses I'm exploring or have
                completed
              </p>

              <div className="flex flex-wrap gap-4 mb-8 text-xs text-neutral-600 dark:text-neutral-400">
                <span>{resources.length} resources</span>
                <span>·</span>
                <span>{reading.length} reading</span>
                <span>·</span>
                <span>{completed.length} completed</span>
                <span>·</span>
                <span>{allTopics.length} topics</span>
              </div>
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
                <div className="space-y-12">
                  {/* Currently Reading */}
                  {reading.length > 0 && (
                    <div>
                      <h2 className="text-lg font-medium mb-4 text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                        <span className="text-yellow-600 dark:text-yellow-400">
                          ⚡
                        </span>
                        Currently Reading
                      </h2>
                      <div className="grid gap-4">
                        {reading.map((resource) => (
                          <ResourceCard
                            key={resource.slug}
                            resource={resource}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Completed */}
                  {completed.length > 0 && (
                    <div>
                      <h2 className="text-lg font-medium mb-4 text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                        <span className="text-green-600 dark:text-green-400">
                          ✓
                        </span>
                        Completed
                      </h2>
                      <div className="grid gap-4">
                        {completed.map((resource) => (
                          <ResourceCard
                            key={resource.slug}
                            resource={resource}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Reference */}
                  {reference.length > 0 && (
                    <div>
                      <h2 className="text-lg font-medium mb-4 text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                        <span className="text-blue-600 dark:text-blue-400">
                          🔖
                        </span>
                        Reference
                      </h2>
                      <div className="grid gap-4">
                        {reference.map((resource) => (
                          <ResourceCard
                            key={resource.slug}
                            resource={resource}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </ScrollAnimate>
          </div>
        </section>
      </PageWrapper>
    </>
  );
}

function ResourceCard({ resource }: { resource: Resource }) {
  const cardContent = (
    <div className="flex items-start gap-3">
      <span className="text-2xl flex-shrink-0 mt-1">
        {typeEmojis[resource.type]}
      </span>
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-neutral-900 dark:text-neutral-100 mb-1 group-hover:text-neutral-600 dark:group-hover:text-neutral-400 transition-colors">
          {resource.title}
        </h3>
        {resource.author && (
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
            by {resource.author}
          </p>
        )}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {resource.rating && (
            <span className="text-yellow-600 dark:text-yellow-400">
              {"★".repeat(resource.rating)}
              {"☆".repeat(5 - resource.rating)}
            </span>
          )}
          {resource.topics.map((topic) => (
            <span
              key={topic}
              className="px-2 py-1 bg-neutral-100 dark:bg-neutral-800 rounded text-neutral-700 dark:text-neutral-300"
            >
              {topic}
            </span>
          ))}
        </div>
      </div>
    </div>
  );

  if (resource.url) {
    return (
      <Link
        href={resource.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group block p-4 border border-neutral-200 dark:border-neutral-800 rounded-lg hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors"
      >
        {cardContent}
      </Link>
    );
  }

  return (
    <div className="block p-4 border border-neutral-200 dark:border-neutral-800 rounded-lg">
      {cardContent}
    </div>
  );
}
