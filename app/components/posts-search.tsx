// app/components/posts-search.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { formatDate } from "app/blog/format";

const POSTS_PER_PAGE = 10;

interface BlogPost {
  slug: string;
  metadata: {
    title: string;
    publishedAt: string;
    summary?: string;
  };
}

interface PostsSearchProps {
  posts: BlogPost[];
  currentPage: number;
}

export function PostsSearch({ posts, currentPage }: PostsSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter posts based on search query
  const filteredBlogs = posts.filter((post) => {
    if (!searchQuery) return true;
    const matchesSearch =
      post.metadata.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.metadata.summary?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const totalPages = Math.ceil(filteredBlogs.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const currentPosts = filteredBlogs.slice(startIndex, endIndex);

  return (
    <div>
      {/* Search */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="Search posts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 text-sm bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-600"
        />
      </div>

      {/* Posts List */}
      <div>
        {currentPosts.length === 0 ? (
          <p className="text-sm text-neutral-600 dark:text-neutral-400 py-8 text-center">
            No posts found
          </p>
        ) : (
          currentPosts.map((post) => (
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
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center gap-4 mt-8">
          {currentPage > 1 ? (
            <Link
              href={`/blog?page=${currentPage - 1}`}
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
                    currentPage === pageNum
                      ? "text-neutral-900 dark:text-neutral-100 font-medium"
                      : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
                  }`}
                >
                  {pageNum}
                </Link>
              )
            )}
          </div>

          {currentPage < totalPages ? (
            <Link
              href={`/blog?page=${currentPage + 1}`}
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

      {/* Stats Footer */}
      {searchQuery && (
        <div className="mt-8 pt-4 border-t border-neutral-200 dark:border-neutral-800">
          <p className="text-xs text-neutral-600 dark:text-neutral-400">
            Found {filteredBlogs.length} of {posts.length} posts
          </p>
        </div>
      )}
    </div>
  );
}
