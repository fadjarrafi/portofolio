import { getBlogPosts } from "app/blog/utils";
import { PostsSearch } from "app/components/posts-search";
import { ScrollAnimate } from "app/components/scroll-animate";
import { Navbar } from "app/components/nav";
import { PageWrapper } from "app/components/page-wrapper";

export const metadata = {
  title: "Blog",
  description: "Read my blog.",
};

// Make the component async and await searchParams
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  // Await the searchParams Promise
  const resolvedSearchParams = await searchParams;
  const currentPage = Number(resolvedSearchParams.page) || 1;

  // Server-side: Get all English posts
  const allBlogs = getBlogPosts("en").sort((a, b) => {
    if (new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)) {
      return -1;
    }
    return 1;
  });

  return (
    <>
      {/* Fixed Navbar */}
      <div className="fixed top-0 left-0 z-50 p-6">
        <Navbar />
      </div>

      <PageWrapper>
        <section className="min-h-screen py-24">
          {/* Centered Content */}
          <div className="max-w-4xl mx-auto px-6">
            <ScrollAnimate>
              <h1 className="font-semibold text-2xl mb-4 tracking-tighter">
                My Thoughts
              </h1>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-12">
                Writing about development, systems thinking, and things I'm
                learning
              </p>
            </ScrollAnimate>

            <ScrollAnimate delay={100}>
              <PostsSearch posts={allBlogs} currentPage={currentPage} />
            </ScrollAnimate>
          </div>
        </section>
      </PageWrapper>
    </>
  );
}
