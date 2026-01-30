// app/writing/page.tsx
import {
  getBlogPosts,
  getAllTopics,
  getAllPostTypes,
  getTopicStats,
} from "app/writing/utils";
import { PostsSearch } from "app/components/posts-search";
import { ScrollAnimate } from "app/components/scroll-animate";
import { Navbar } from "app/components/nav";
import { PageWrapper } from "app/components/page-wrapper";

export const metadata = {
  title: "Writing",
  description:
    "Writing about code, mathematics, philosophy, and things I'm learning.",
};

export default async function Page() {
  const allBlogs = getBlogPosts("en").sort((a, b) => {
    if (new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)) {
      return -1;
    }
    return 1;
  });

  const allTopics = getAllTopics("en");
  const allTypes = getAllPostTypes("en");
  const topicStats = getTopicStats("en");

  return (
    <PageWrapper>
      <Navbar />

      <section className="min-h-screen pb-16">
        <div className="max-w-5xl mx-auto">
          <ScrollAnimate>
            <h1 className="font-semibold text-2xl mb-1 tracking-tighter">
              My Thoughts
            </h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-8">
              Writing about development, systems thinking, mathematics, and
              things I'm learning
            </p>

            <p className="text-xs text-neutral-500 mb-6">
              {allBlogs.length} posts — {allTopics.length} topics
            </p>
          </ScrollAnimate>

          <ScrollAnimate delay={100}>
            <PostsSearch
              posts={allBlogs}
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
