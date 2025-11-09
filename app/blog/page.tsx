// app/blog/page.tsx
import {
  getBlogPosts,
  getAllTopics,
  getAllPostTypes,
  getTopicStats,
} from "app/blog/utils";
import { PostsSearch } from "app/components/posts-search";
import { ScrollAnimate } from "app/components/scroll-animate";
import { Navbar } from "app/components/nav";
import { PageWrapper } from "app/components/page-wrapper";

export const metadata = {
  title: "Blog",
  description:
    "Writing about code, mathematics, philosophy, and things I'm learning.",
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const currentPage = Number(resolvedSearchParams.page) || 1;

  // Get all English posts
  const allBlogs = getBlogPosts("en").sort((a, b) => {
    if (new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)) {
      return -1;
    }
    return 1;
  });

  // Get unique topics and types
  const allTopics = getAllTopics("en");
  const allTypes = getAllPostTypes("en");
  const topicStats = getTopicStats("en");

  return (
    <>
      <PageWrapper>
        <Navbar />

        <section className="min-h-screen pb-16">
          {/* Centered Content */}
          <div className="max-w-4xl mx-auto">
            <ScrollAnimate>
              <h1 className="font-semibold text-2xl mb-2 tracking-tighter">
                My Thoughts
              </h1>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-8">
                Writing about development, systems thinking, mathematics, and
                things I'm learning
              </p>

              {/* Blog Stats */}
              <div className="flex flex-wrap gap-4 mb-12 text-xs text-neutral-600 dark:text-neutral-400">
                <span>{allBlogs.length} posts</span>
                <span>·</span>
                <span>{allTopics.length} topics</span>
              </div>
            </ScrollAnimate>

            <ScrollAnimate delay={100}>
              <PostsSearch
                posts={allBlogs}
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
