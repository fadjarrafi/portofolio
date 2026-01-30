// app/garden/thoughts/page.tsx
import {
  getGardenThoughts,
  getAllGardenTopics,
  getAllGardenTypes,
  getGardenTopicStats,
} from "@/app/garden/utils";
import { GardenPostsSearch } from "@/app/components/garden-posts-search";
import { ScrollAnimate } from "@/app/components/scroll-animate";
import { Navbar } from "@/app/components/nav";
import { PageWrapper } from "@/app/components/page-wrapper";
import { GardenNav } from "@/app/components/garden-nav";

export const metadata = {
  title: "Thoughts - Digital Garden",
  description:
    "Evolving ideas, explorations, and observations at different stages of growth.",
};

export default async function Page() {
  const allThoughts = getGardenThoughts("en").sort((a, b) => {
    if (new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)) {
      return -1;
    }
    return 1;
  });

  const allTopics = getAllGardenTopics("en");
  const allTypes = getAllGardenTypes("en");
  const topicStats = getGardenTopicStats("en");

  const seeds = allThoughts.filter((p) => p.metadata.status === "seed").length;
  const saplings = allThoughts.filter(
    (p) => p.metadata.status === "sapling",
  ).length;
  const trees = allThoughts.filter((p) => p.metadata.status === "tree").length;

  return (
    <PageWrapper>
      <Navbar />

      <section className="min-h-screen pb-16">
        <div className="max-w-5xl mx-auto">
          <ScrollAnimate>
            <h1 className="font-semibold text-2xl mb-1 tracking-tighter">
              Garden Thoughts
            </h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-8">
              Evolving ideas, explorations, and observations at different stages
              of growth.
            </p>

            <p className="text-xs text-neutral-500 mb-6">
              {allThoughts.length} thoughts — {seeds} seeds, {saplings}{" "}
              saplings, {trees} trees
            </p>
          </ScrollAnimate>

          <ScrollAnimate delay={50}>
            <GardenNav />
          </ScrollAnimate>

          <ScrollAnimate delay={100}>
            <GardenPostsSearch
              posts={allThoughts}
              allTopics={allTopics}
              allTypes={allTypes}
              topicStats={topicStats}
            />
          </ScrollAnimate>
        </div>
      </section>
    </PageWrapper>
  );
}
