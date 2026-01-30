// app/components/library-search.tsx
"use client";

import { useState } from "react";
import Link from "next/link";

type ResourceType = "book" | "article" | "paper" | "video" | "course";
type ResourceStatus = "reading" | "completed" | "reference";

interface Resource {
  title: string;
  author?: string;
  type: ResourceType;
  topics: string[];
  status: ResourceStatus;
  rating?: number;
  id: string;
  url?: string;
  date_consumed?: string;
}

interface LibrarySearchProps {
  resources: Resource[];
  allTopics: string[];
}

const typeEmojis: Record<ResourceType, string> = {
  book: "📚",
  article: "📄",
  paper: "📑",
  video: "🎥",
  course: "🎓",
};

const statusLabels: Record<ResourceStatus, string> = {
  reading: "Reading",
  completed: "Completed",
  reference: "Reference",
};

export function LibrarySearch({ resources, allTopics }: LibrarySearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<
    ResourceStatus | "all"
  >("all");
  const [selectedType, setSelectedType] = useState<ResourceType | "all">(
    "all"
  );
  const [selectedTopic, setSelectedTopic] = useState<string>("all");

  const hasActiveFilters =
    searchQuery ||
    selectedStatus !== "all" ||
    selectedType !== "all" ||
    selectedTopic !== "all";

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedStatus("all");
    setSelectedType("all");
    setSelectedTopic("all");
  };

  const filtered = resources.filter((r) => {
    const matchesSearch =
      !searchQuery ||
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.author?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      selectedStatus === "all" || r.status === selectedStatus;

    const matchesType = selectedType === "all" || r.type === selectedType;

    const matchesTopic =
      selectedTopic === "all" || r.topics.includes(selectedTopic);

    return matchesSearch && matchesStatus && matchesType && matchesTopic;
  });

  const availableTypes = Array.from(
    new Set(resources.map((r) => r.type))
  ).sort() as ResourceType[];

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
          value={selectedStatus}
          onChange={(e) =>
            setSelectedStatus(e.target.value as ResourceStatus | "all")
          }
          className="text-xs px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg focus:outline-none"
        >
          <option value="all">All statuses</option>
          {(["reading", "completed", "reference"] as ResourceStatus[]).map(
            (s) => (
              <option key={s} value={s}>
                {statusLabels[s]}
              </option>
            )
          )}
        </select>
        <select
          value={selectedType}
          onChange={(e) =>
            setSelectedType(e.target.value as ResourceType | "all")
          }
          className="text-xs px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg focus:outline-none"
        >
          <option value="all">All types</option>
          {availableTypes.map((t) => (
            <option key={t} value={t}>
              {typeEmojis[t]} {t.charAt(0).toUpperCase() + t.slice(1)}
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
              {topic}
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
          {filtered.length} of {resources.length} resources
        </p>
      )}

      {/* Resources Grid */}
      {filtered.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-sm text-neutral-500 mb-2">No resources found</p>
          <button
            onClick={clearFilters}
            className="text-sm text-neutral-900 dark:text-neutral-100 hover:underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((resource) => {
            const card = (
              <>
                <div className="flex items-center gap-1.5 mb-2">
                  <span className="text-sm">{typeEmojis[resource.type]}</span>
                  <span className="text-[10px] text-neutral-400 uppercase tracking-wide">
                    {resource.type}
                  </span>
                  <span className="ml-auto text-[10px] text-neutral-400">
                    {statusLabels[resource.status]}
                  </span>
                </div>
                <h3 className="text-sm font-medium text-neutral-900 dark:text-neutral-100 group-hover:text-neutral-600 dark:group-hover:text-neutral-400 transition-colors mb-1 line-clamp-2">
                  {resource.title}
                </h3>
                {resource.author && (
                  <p className="text-xs text-neutral-500 mb-2">
                    {resource.author}
                  </p>
                )}
                {resource.rating && (
                  <div className="text-xs text-yellow-600 dark:text-yellow-400 mb-2">
                    {"★".repeat(resource.rating)}
                    {"☆".repeat(5 - resource.rating)}
                  </div>
                )}
                <div className="flex gap-1 flex-wrap mt-auto">
                  {resource.topics.slice(0, 2).map((topic) => (
                    <span
                      key={topic}
                      className="text-[10px] px-1.5 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded text-neutral-500"
                    >
                      {topic}
                    </span>
                  ))}
                  {resource.topics.length > 2 && (
                    <span className="text-[10px] px-1.5 py-0.5 text-neutral-400">
                      +{resource.topics.length - 2}
                    </span>
                  )}
                </div>
              </>
            );

            if (resource.url) {
              return (
                <Link
                  key={resource.id}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors"
                >
                  {card}
                </Link>
              );
            }

            return (
              <div
                key={resource.id}
                className="flex flex-col p-4 rounded-lg border border-neutral-200 dark:border-neutral-800"
              >
                {card}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
