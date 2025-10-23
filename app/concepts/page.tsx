"use client";

import { useState, useEffect } from "react";
import { ScrollAnimate } from "../components/scroll-animate";
import { PageWrapper } from "../components/page-wrapper";
import { Navbar } from "../components/nav";

interface Concept {
  id: string;
  term: string;
  domain: string[];
  brief: string;
  related: string[];
  difficulty: "beginner" | "intermediate" | "advanced";
  lastUpdated: string;
}

const domains = [
  "All",
  "Programming",
  "Mathematics",
  "Philosophy",
  "Systems Thinking",
];

export default function ConceptsPage() {
  const [concepts, setConcepts] = useState<Concept[]>([]);
  const [selectedDomain, setSelectedDomain] = useState("All");
  const [expandedConcept, setExpandedConcept] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetch("/data/concepts.json")
      .then((res) => res.json())
      .then((data) => setConcepts(data))
      .catch((err) => console.error("Error loading concepts:", err));
  }, []);

  const filteredConcepts = concepts.filter((concept) => {
    const matchesDomain =
      selectedDomain === "All" || concept.domain.includes(selectedDomain);
    const matchesSearch =
      concept.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
      concept.brief.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDomain && matchesSearch;
  });

  return (
    <PageWrapper>
      <div className="min-h-screen bg-white dark:bg-[#181A18] text-black dark:text-white">
        {/* Fixed Navbar */}
        <Navbar />

        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <ScrollAnimate>
            <div className="mb-12">
              <h1 className="text-2xl font-semibold tracking-tighter mb-4">
                Concepts
              </h1>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                A personal lexicon of ideas, terms, and patterns I'm exploring
              </p>
            </div>
          </ScrollAnimate>

          {/* Search */}
          <ScrollAnimate delay={100}>
            <div className="mb-8">
              <input
                type="text"
                placeholder="Search concepts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 text-sm bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-600"
              />
            </div>
          </ScrollAnimate>

          {/* Domain Filter */}
          <ScrollAnimate delay={150}>
            <div className="flex flex-wrap gap-2 mb-8">
              {domains.map((domain) => (
                <button
                  key={domain}
                  onClick={() => setSelectedDomain(domain)}
                  className={`px-3 py-1 text-xs rounded-full transition-colors ${
                    selectedDomain === domain
                      ? "bg-neutral-900 dark:bg-neutral-100 text-white dark:text-black"
                      : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                  }`}
                >
                  {domain}
                </button>
              ))}
            </div>
          </ScrollAnimate>

          {/* Concepts List */}
          <div className="space-y-4">
            {filteredConcepts.length === 0 ? (
              <ScrollAnimate delay={200}>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 py-8 text-center">
                  No concepts found
                </p>
              </ScrollAnimate>
            ) : (
              filteredConcepts.map((concept, index) => (
                <ScrollAnimate key={concept.id} delay={200 + index * 50}>
                  <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors">
                    {/* Concept Header */}
                    <button
                      onClick={() =>
                        setExpandedConcept(
                          expandedConcept === concept.id ? null : concept.id
                        )
                      }
                      className="w-full text-left"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">{concept.term}</h3>
                          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                            {concept.brief}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {concept.domain.map((d) => (
                              <span
                                key={d}
                                className="text-xs px-2 py-0.5 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 rounded"
                              >
                                {d}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="text-neutral-400 dark:text-neutral-600">
                          <svg
                            className={`w-5 h-5 transition-transform ${
                              expandedConcept === concept.id ? "rotate-180" : ""
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </div>
                      </div>
                    </button>

                    {/* Expanded Content */}
                    {expandedConcept === concept.id && (
                      <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-800 animate-[fadeIn_0.3s_ease-out]">
                        <div className="space-y-3 text-sm">
                          <div>
                            <h4 className="font-medium mb-1 text-neutral-600 dark:text-neutral-400">
                              Related Concepts
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {concept.related.map((r) => (
                                <span
                                  key={r}
                                  className="px-2 py-1 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded text-xs hover:border-neutral-400 dark:hover:border-neutral-600 cursor-pointer transition-colors"
                                >
                                  {r}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-500">
                            <span>Difficulty: {concept.difficulty}</span>
                            <span>Last updated: {concept.lastUpdated}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollAnimate>
              ))
            )}
          </div>

          {/* Stats Footer */}
          <ScrollAnimate delay={300}>
            <div className="mt-12 pt-8 border-t border-neutral-200 dark:border-neutral-800">
              <div className="flex gap-8 text-xs text-neutral-600 dark:text-neutral-400">
                <div>
                  <span className="font-medium">Total Concepts:</span>{" "}
                  {concepts.length}
                </div>
                <div>
                  <span className="font-medium">Domains:</span>{" "}
                  {domains.length - 1}
                </div>
              </div>
            </div>
          </ScrollAnimate>
        </div>
      </div>
    </PageWrapper>
  );
}
