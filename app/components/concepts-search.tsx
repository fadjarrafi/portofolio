// app/components/concepts-search.tsx
"use client";

import { useState } from "react";
import Link from "next/link";

interface Concept {
  term: string;
  domain: string[];
  brief: string;
  slug: string;
}

interface ConceptsSearchProps {
  concepts: Concept[];
  allDomains: string[];
}

export function ConceptsSearch({ concepts, allDomains }: ConceptsSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDomain, setSelectedDomain] = useState<string>("all");

  const hasActiveFilters = searchQuery || selectedDomain !== "all";

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedDomain("all");
  };

  const filtered = concepts
    .filter((concept) => {
      const matchesSearch =
        !searchQuery ||
        concept.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
        concept.brief.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesDomain =
        selectedDomain === "all" || concept.domain.includes(selectedDomain);

      return matchesSearch && matchesDomain;
    })
    .sort((a, b) => a.term.localeCompare(b.term));

  return (
    <div>
      {/* Search + Filter Row */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <input
          type="text"
          placeholder="Search concepts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 min-w-[140px] px-3 py-1.5 text-sm bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-600"
        />
        <select
          value={selectedDomain}
          onChange={(e) => setSelectedDomain(e.target.value)}
          className="text-xs px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg focus:outline-none"
        >
          <option value="all">All domains</option>
          {allDomains.map((domain) => (
            <option key={domain} value={domain}>
              {domain}
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
          {filtered.length} of {concepts.length} concepts
        </p>
      )}

      {/* Concepts Grid */}
      {filtered.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-sm text-neutral-500 mb-2">No concepts found</p>
          <button
            onClick={clearFilters}
            className="text-sm text-neutral-900 dark:text-neutral-100 hover:underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((concept) => (
            <Link
              key={concept.slug}
              href={`/garden/concepts/${concept.slug}`}
              className="group block p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors"
            >
              <h3 className="text-sm font-medium text-neutral-900 dark:text-neutral-100 group-hover:text-neutral-600 dark:group-hover:text-neutral-400 transition-colors mb-1.5">
                {concept.term}
              </h3>
              <p className="text-xs text-neutral-500 line-clamp-2 mb-3">
                {concept.brief}
              </p>
              <div className="flex gap-1 flex-wrap">
                {concept.domain.slice(0, 2).map((d) => (
                  <span
                    key={d}
                    className="text-[10px] px-1.5 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded text-neutral-500"
                  >
                    {d}
                  </span>
                ))}
                {concept.domain.length > 2 && (
                  <span className="text-[10px] px-1.5 py-0.5 text-neutral-400">
                    +{concept.domain.length - 2}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
