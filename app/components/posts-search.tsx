// app/components/posts-search.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { formatDate } from "app/writing/format";
import type { PostType } from "app/writing/utils";

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
  allTopics: string[];
  allTypes: PostType[];
  topicStats: Record<string, number>;
}

const typeEmojis: Record<PostType, string> = {
  essay: "📝",
  tutorial: "💻",
  note: "📚",
  reflection: "🤔",
  review: "⭐",
};

export function PostsSearch({
  posts,
  allTopics,
  allTypes,
  topicStats,
}: PostsSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTopic, setSelectedTopic] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<PostType | "all">("all");

  const hasActiveFilters =
    searchQuery || selectedTopic !== "all" || selectedType !== "all";

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedTopic("all");
    setSelectedType("all");
  };

  const filteredPosts = posts.filter((post) => {
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

  return (
    <div>
      {/* Search + Filters Row */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 min-w-[140px] px-3 py-1.5 text-sm bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-600"
        />
        <select
          value={selectedType}
          onChange={(e) =>
            setSelectedType(e.target.value as PostType | "all")
          }
          className="text-xs px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg focus:outline-none"
        >
          <option value="all">All types</option>
          {allTypes.map((type) => (
            <option key={type} value={type}>
              {typeEmojis[type]} {type.charAt(0).toUpperCase() + type.slice(1)}
            </option>
          ))}
        </select>
        <select
          value={selectedTopic}
          onChange={(e) => setSelectedTopic(e.target.value)}
          className="text-xs px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg focus:outline-none"
        >
          <option value="all">All topics</option>
          {allTopics.map((topic) => (
            <option key={topic} value={topic}>
              {topic} ({topicStats[topic] || 0})
            </option>
          ))}
        </select>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {/* Result count */}
      {hasActiveFilters && (
        <p className="text-xs text-neutral-500 mb-4">
          {filteredPosts.length} of {posts.length} posts
        </p>
      )}

      {/* Posts Grid */}
      {filteredPosts.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-sm text-neutral-500 mb-2">No posts found</p>
          <button
            onClick={clearFilters}
            className="text-sm text-neutral-900 dark:text-neutral-100 hover:underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/writing/en/${post.slug}`}
              className="group block p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors"
            >
              <div className="flex items-center gap-1.5 mb-2">
                {post.metadata.type && (
                  <span className="text-sm">
                    {typeEmojis[post.metadata.type]}
                  </span>
                )}
                <span className="text-xs text-neutral-400">
                  {post.readingTime}m
                </span>
              </div>
              <h2 className="text-sm font-medium text-neutral-900 dark:text-neutral-100 group-hover:text-neutral-600 dark:group-hover:text-neutral-400 transition-colors mb-1.5 line-clamp-2">
                {post.metadata.title}
              </h2>
              {post.metadata.summary && (
                <p className="text-xs text-neutral-500 line-clamp-2 mb-3">
                  {post.metadata.summary}
                </p>
              )}
              <div className="mt-auto flex items-center justify-between text-xs text-neutral-400">
                <time dateTime={post.metadata.publishedAt}>
                  {formatDate(post.metadata.publishedAt, false)}
                </time>
                {post.metadata.updated && (
                  <span className="text-green-600 dark:text-green-400">
                    updated
                  </span>
                )}
              </div>
              {post.metadata.topics &&
                post.metadata.topics.length > 0 && (
                  <div className="flex gap-1 flex-wrap mt-2">
                    {post.metadata.topics.slice(0, 2).map((topic) => (
                      <span
                        key={topic}
                        className="text-[10px] px-1.5 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded text-neutral-500"
                      >
                        {topic}
                      </span>
                    ))}
                    {post.metadata.topics.length > 2 && (
                      <span className="text-[10px] px-1.5 py-0.5 text-neutral-400">
                        +{post.metadata.topics.length - 2}
                      </span>
                    )}
                  </div>
                )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
