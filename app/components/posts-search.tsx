// app/components/posts-search.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { formatDate } from "app/writing/format";
import type { PostType } from "app/writing/utils";

const POSTS_PER_PAGE = 10;

interface BlogPost {
  slug: string;
  metadata: {
    title: string;
    publishedAt: string;
    summary?: string;
    topics?: string[];
    type?: PostType;
    updated?: string;
  };
  readingTime: number;
}

interface PostsSearchProps {
  posts: BlogPost[];
  currentPage: number;
  allTopics: string[];
  allTypes: PostType[];
  topicStats: Record<string, number>;
}

// Post type emoji mapping
const typeEmojis: Record<PostType, string> = {
  essay: "📝",
  tutorial: "💻",
  note: "📚",
  reflection: "🤔",
  review: "⭐",
};

export function PostsSearch({
  posts,
  currentPage,
  allTopics,
  allTypes,
  topicStats,
}: PostsSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTopic, setSelectedTopic] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<PostType | "all">("all");

  // Filter posts based on search query, topic, and type
  const filteredBlogs = posts.filter((post) => {
    const matchesSearch =
      !searchQuery ||
      post.metadata.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.metadata.summary?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTopic =
      selectedTopic === "all" ||
      (post.metadata.topics &&
        Array.isArray(post.metadata.topics) &&
        post.metadata.topics.includes(selectedTopic));

    const matchesType =
      selectedType === "all" || post.metadata.type === selectedType;

    return matchesSearch && matchesTopic && matchesType;
  });

  const totalPages = Math.ceil(filteredBlogs.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const currentPosts = filteredBlogs.slice(startIndex, endIndex);

  return (
    <div>
      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search posts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 text-sm bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-600"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-8">
        {/* Type Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-neutral-600 dark:text-neutral-400">
            Type:
          </span>
          <select
            value={selectedType}
            onChange={(e) =>
              setSelectedType(e.target.value as PostType | "all")
            }
            className="text-xs px-3 py-1.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-600"
          >
            <option value="all">All</option>
            {allTypes.map((type) => (
              <option key={type} value={type}>
                {typeEmojis[type]}{" "}
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Topic Filter Pills */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-neutral-600 dark:text-neutral-400">
            Topic:
          </span>
          <button
            onClick={() => setSelectedTopic("all")}
            className={`text-xs px-3 py-1.5 rounded-lg transition-colors ${
              selectedTopic === "all"
                ? "bg-neutral-900 dark:bg-neutral-100 text-white dark:text-black"
                : "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700"
            }`}
          >
            All ({posts.length})
          </button>
          {allTopics.map((topic) => (
            <button
              key={topic}
              onClick={() => setSelectedTopic(topic)}
              className={`text-xs px-3 py-1.5 rounded-lg transition-colors ${
                selectedTopic === topic
                  ? "bg-neutral-900 dark:bg-neutral-100 text-white dark:text-black"
                  : "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700"
              }`}
            >
              {topic} ({topicStats[topic] || 0})
            </button>
          ))}
        </div>
      </div>

      {/* Active Filters Summary */}
      {(searchQuery || selectedTopic !== "all" || selectedType !== "all") && (
        <div className="mb-6 pb-4 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-neutral-600 dark:text-neutral-400">
              Active filters:
            </span>
            {searchQuery && (
              <span className="text-xs px-2 py-1 bg-neutral-100 dark:bg-neutral-800 rounded">
                Search: "{searchQuery}"
              </span>
            )}
            {selectedType !== "all" && (
              <span className="text-xs px-2 py-1 bg-neutral-100 dark:bg-neutral-800 rounded">
                Type: {typeEmojis[selectedType as PostType]} {selectedType}
              </span>
            )}
            {selectedTopic !== "all" && (
              <span className="text-xs px-2 py-1 bg-neutral-100 dark:bg-neutral-800 rounded">
                Topic: {selectedTopic}
              </span>
            )}
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedTopic("all");
                setSelectedType("all");
              }}
              className="text-xs text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 underline"
            >
              Clear all
            </button>
          </div>
        </div>
      )}

      {/* Posts List */}
      <div className="space-y-6">
        {currentPosts.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
              No posts found
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedTopic("all");
                setSelectedType("all");
              }}
              className="text-sm text-neutral-900 dark:text-neutral-100 hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          currentPosts.map((post) => (
            <Link
              key={post.slug}
              className="block group"
              href={`/writing/en/${post.slug}`}
            >
              <article className="space-y-2">
                {/* Title and Type */}
                <div className="flex items-start gap-2">
                  {post.metadata.type && (
                    <span className="text-lg flex-shrink-0 mt-0.5">
                      {typeEmojis[post.metadata.type]}
                    </span>
                  )}
                  <h2 className="text-neutral-900 dark:text-neutral-100 font-medium group-hover:text-neutral-600 dark:group-hover:text-neutral-400 transition-colors">
                    {post.metadata.title}
                  </h2>
                </div>

                {/* Summary */}
                {post.metadata.summary && (
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2">
                    {post.metadata.summary}
                  </p>
                )}

                {/* Metadata */}
                <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-600 dark:text-neutral-400">
                  <time dateTime={post.metadata.publishedAt}>
                    {formatDate(post.metadata.publishedAt, false)}
                  </time>

                  <span>·</span>

                  <span>{post.readingTime} min read</span>

                  {post.metadata.updated && (
                    <>
                      <span>·</span>
                      <span className="text-green-600 dark:text-green-400">
                        Updated {formatDate(post.metadata.updated, false)}
                      </span>
                    </>
                  )}

                  {/* Topics */}
                  {post.metadata.topics &&
                    Array.isArray(post.metadata.topics) &&
                    post.metadata.topics.length > 0 && (
                      <>
                        <span>·</span>
                        <div className="flex gap-1.5 flex-wrap">
                          {post.metadata.topics.map((topic) => (
                            <span
                              key={topic}
                              className="px-2 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded text-neutral-700 dark:text-neutral-300"
                            >
                              {topic}
                            </span>
                          ))}
                        </div>
                      </>
                    )}
                </div>
              </article>
            </Link>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center gap-4 mt-12">
          {currentPage > 1 ? (
            <Link
              href={`/writing?page=${currentPage - 1}`}
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
                  href={`/writing?page=${pageNum}`}
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
              href={`/writing?page=${currentPage + 1}`}
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
      <div className="mt-8 pt-6 border-t border-neutral-200 dark:border-neutral-800">
        <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-600 dark:text-neutral-400">
          <span>
            Showing {currentPosts.length} of {filteredBlogs.length} posts
          </span>
          {filteredBlogs.length !== posts.length && (
            <span>({posts.length} total)</span>
          )}
        </div>
      </div>
    </div>
  );
}
