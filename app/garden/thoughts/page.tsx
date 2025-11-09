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

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const currentPage = Number(resolvedSearchParams.page) || 1;

  // Get all English garden thoughts
  const allThoughts = getGardenThoughts("en").sort((a, b) => {
    if (new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)) {
      return -1;
    }
    return 1;
  });

  // Group thoughts by growth stage
  const seeds = allThoughts.filter((p) => p.metadata.status === "seed");
  const saplings = allThoughts.filter((p) => p.metadata.status === "sapling");
  const trees = allThoughts.filter((p) => p.metadata.status === "tree");

  const allTopics = getAllGardenTopics("en");
  const allTypes = getAllGardenTypes("en");
  const topicStats = getGardenTopicStats("en");

  return (
    <>
      <PageWrapper>
        <Navbar />

        <section className="min-h-screen pb-16">
          <div className="max-w-4xl mx-auto">
            <ScrollAnimate>
              <h1 className="font-semibold text-2xl mb-2 tracking-tighter">
                Garden Thoughts
              </h1>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-8">
                Ideas at different stages of growth — from quick observations to
                fully-formed explorations
              </p>

              {/* Growth Stage Stats */}
              <div className="flex flex-wrap gap-6 mb-8 text-xs text-neutral-600 dark:text-neutral-400">
                <div className="flex items-center gap-2">
                  <span className="text-base">🌱</span>
                  <span>
                    {seeds.length} {seeds.length === 1 ? "seed" : "seeds"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-base">🌿</span>
                  <span>
                    {saplings.length}{" "}
                    {saplings.length === 1 ? "sapling" : "saplings"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-base">🌳</span>
                  <span>
                    {trees.length} {trees.length === 1 ? "tree" : "trees"}
                  </span>
                </div>
                <span>·</span>
                <span>{allThoughts.length} total thoughts</span>
                <span>·</span>
                <span>{allTopics.length} topics</span>
              </div>
            </ScrollAnimate>

            <ScrollAnimate delay={50}>
              <GardenNav />
            </ScrollAnimate>

            <ScrollAnimate delay={100}>
              <GardenPostsSearch
                posts={allThoughts}
                currentPage={currentPage}
                allTopics={allTopics}
                allTypes={allTypes}
                topicStats={topicStats}
              />
            </ScrollAnimate>
          </div>
        </section>
      </PageWrapper>
    </>
  );
}
