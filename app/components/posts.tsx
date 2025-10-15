// app/components/posts.tsx

import Link from "next/link";
import { formatDate, getBlogPosts } from "app/blog/utils";

const POSTS_PER_PAGE = 7;

export function BlogPosts({ page = 1 }: { page?: number }) {
  // Always show only English posts on blog list
  const allBlogs = getBlogPosts("en").sort((a, b) => {
    if (new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)) {
      return -1;
    }
    return 1;
  });

  const totalPages = Math.ceil(allBlogs.length / POSTS_PER_PAGE);
  const startIndex = (page - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const currentPosts = allBlogs.slice(startIndex, endIndex);

  return (
    <div>
      <div>
        {currentPosts.map((post) => (
          <Link
            key={post.slug}
            className="flex flex-col space-y-1 mb-4"
            href={`/blog/en/${post.slug}`}
          >
            <div className="w-full flex flex-col md:flex-row space-x-0 md:space-x-2">
              <p className="text-neutral-600 dark:text-neutral-400 w-[100px] tabular-nums">
                {formatDate(post.metadata.publishedAt, false)}
              </p>
              <p className="text-neutral-900 dark:text-neutral-100 tracking-tight">
                {post.metadata.title}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center gap-4 mt-8">
          {page > 1 ? (
            <Link
              href={`/blog?page=${page - 1}`}
              className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
            >
              ← Previous
            </Link>
          ) : (
            <span className="text-sm text-neutral-600 dark:text-neutral-400 opacity-30 cursor-not-allowed">
              ← Previous
            </span>
          )}

          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (pageNum) => (
                <Link
                  key={pageNum}
                  href={`/blog?page=${pageNum}`}
                  className={`w-8 h-8 text-sm flex items-center justify-center transition-colors ${
                    page === pageNum
                      ? "text-neutral-900 dark:text-neutral-100 font-medium"
                      : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
                  }`}
                >
                  {pageNum}
                </Link>
              )
            )}
          </div>

          {page < totalPages ? (
            <Link
              href={`/blog?page=${page + 1}`}
              className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
            >
              Next →
            </Link>
          ) : (
            <span className="text-sm text-neutral-600 dark:text-neutral-400 opacity-30 cursor-not-allowed">
              Next →
            </span>
          )}
        </div>
      )}
    </div>
  );
}
