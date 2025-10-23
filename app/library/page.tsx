"use client";

import { useState, useEffect } from "react";
import { ScrollAnimate } from "../components/scroll-animate";
import { PageWrapper } from "../components/page-wrapper";
import { Navbar } from "../components/nav";

interface LibraryItem {
  id: string;
  title: string;
  author: string;
  type: "book" | "article" | "paper" | "video" | "course";
  topics: string[];
  status: "reading" | "completed" | "reference";
  rating?: number;
  year?: string;
  url?: string;
  summary?: string;
  keyTakeaways?: string[];
  dateConsumed?: string;
}

const types = ["All", "Book", "Article", "Paper", "Video", "Course"];
const statuses = ["All", "Reading", "Completed", "Reference"];

export default function LibraryPage() {
  const [items, setItems] = useState<LibraryItem[]>([]);
  const [selectedType, setSelectedType] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetch("/data/library.json")
      .then((res) => res.json())
      .then((data) => setItems(data))
      .catch((err) => console.error("Error loading library:", err));
  }, []);

  const filteredItems = items.filter((item) => {
    const matchesType =
      selectedType === "All" || item.type === selectedType.toLowerCase();
    const matchesStatus =
      selectedStatus === "All" || item.status === selectedStatus.toLowerCase();
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.topics.some((t) =>
        t.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchesType && matchesStatus && matchesSearch;
  });

  const renderStars = (rating?: number) => {
    if (!rating) return null;
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? "text-yellow-500"
                : "text-neutral-300 dark:text-neutral-700"
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      book: "📚",
      article: "📄",
      paper: "📑",
      video: "🎥",
      course: "🎓",
    };
    return icons[type] || "📖";
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      reading: "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300",
      completed:
        "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300",
      reference:
        "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400",
    };
    return styles[status] || styles.reference;
  };

  return (
    <PageWrapper>
      <div className="min-h-screen bg-white dark:bg-[#181A18] text-black dark:text-white">
        <Navbar />

        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <ScrollAnimate>
            <div className="mb-12">
              <h1 className="text-2xl font-semibold tracking-tighter mb-4">
                Library
              </h1>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Books, articles, and resources that shaped my thinking
              </p>
            </div>
          </ScrollAnimate>

          {/* Search */}
          <ScrollAnimate delay={100}>
            <div className="mb-8">
              <input
                type="text"
                placeholder="Search library..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 text-sm bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-600"
              />
            </div>
          </ScrollAnimate>

          {/* Filters */}
          <ScrollAnimate delay={150}>
            <div className="space-y-4 mb-8">
              {/* Type Filter */}
              <div>
                <label className="text-xs text-neutral-600 dark:text-neutral-400 mb-2 block">
                  Type
                </label>
                <div className="flex flex-wrap gap-2">
                  {types.map((type) => (
                    <button
                      key={type}
                      onClick={() => setSelectedType(type)}
                      className={`px-3 py-1 text-xs rounded-full transition-colors ${
                        selectedType === type
                          ? "bg-neutral-900 dark:bg-neutral-100 text-white dark:text-black"
                          : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <label className="text-xs text-neutral-600 dark:text-neutral-400 mb-2 block">
                  Status
                </label>
                <div className="flex flex-wrap gap-2">
                  {statuses.map((status) => (
                    <button
                      key={status}
                      onClick={() => setSelectedStatus(status)}
                      className={`px-3 py-1 text-xs rounded-full transition-colors ${
                        selectedStatus === status
                          ? "bg-neutral-900 dark:bg-neutral-100 text-white dark:text-black"
                          : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </ScrollAnimate>

          {/* Library Items */}
          <div className="space-y-4">
            {filteredItems.length === 0 ? (
              <ScrollAnimate delay={200}>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 py-8 text-center">
                  No items found
                </p>
              </ScrollAnimate>
            ) : (
              filteredItems.map((item, index) => (
                <ScrollAnimate key={item.id} delay={200 + index * 50}>
                  <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors">
                    {/* Item Header */}
                    <button
                      onClick={() =>
                        setExpandedItem(
                          expandedItem === item.id ? null : item.id
                        )
                      }
                      className="w-full text-left"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xl">
                              {getTypeIcon(item.type)}
                            </span>
                            <h3 className="font-semibold">{item.title}</h3>
                          </div>
                          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                            by {item.author} {item.year && `(${item.year})`}
                          </p>
                          <div className="flex flex-wrap gap-2 items-center">
                            <span
                              className={`text-xs px-2 py-0.5 rounded ${getStatusBadge(
                                item.status
                              )}`}
                            >
                              {item.status}
                            </span>
                            {item.topics.map((topic) => (
                              <span
                                key={topic}
                                className="text-xs px-2 py-0.5 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 rounded"
                              >
                                {topic}
                              </span>
                            ))}
                            {item.rating && renderStars(item.rating)}
                          </div>
                        </div>
                        <div className="text-neutral-400 dark:text-neutral-600">
                          <svg
                            className={`w-5 h-5 transition-transform ${
                              expandedItem === item.id ? "rotate-180" : ""
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
                    {expandedItem === item.id && (
                      <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-800 animate-[fadeIn_0.3s_ease-out]">
                        <div className="space-y-3 text-sm">
                          {item.summary && (
                            <div>
                              <h4 className="font-medium mb-1 text-neutral-600 dark:text-neutral-400">
                                Summary
                              </h4>
                              <p className="text-neutral-700 dark:text-neutral-300">
                                {item.summary}
                              </p>
                            </div>
                          )}

                          {item.keyTakeaways &&
                            item.keyTakeaways.length > 0 && (
                              <div>
                                <h4 className="font-medium mb-1 text-neutral-600 dark:text-neutral-400">
                                  Key Takeaways
                                </h4>
                                <ul className="list-disc list-inside space-y-1 text-neutral-700 dark:text-neutral-300">
                                  {item.keyTakeaways.map((takeaway, i) => (
                                    <li key={i}>{takeaway}</li>
                                  ))}
                                </ul>
                              </div>
                            )}

                          <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-500 pt-2">
                            {item.dateConsumed && (
                              <span>Completed: {item.dateConsumed}</span>
                            )}
                            {item.url && (
                              <a
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 underline"
                              >
                                View source →
                              </a>
                            )}
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
                  <span className="font-medium">Total Items:</span>{" "}
                  {items.length}
                </div>
                <div>
                  <span className="font-medium">Completed:</span>{" "}
                  {items.filter((i) => i.status === "completed").length}
                </div>
                <div>
                  <span className="font-medium">Currently Reading:</span>{" "}
                  {items.filter((i) => i.status === "reading").length}
                </div>
              </div>
            </div>
          </ScrollAnimate>
        </div>
      </div>
    </PageWrapper>
  );
}
