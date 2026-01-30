// app/components/garden-nav.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const gardenItems = {
  "/garden/thoughts": {
    name: "thoughts",
    description: "essays & reflections",
  },
  "/garden/concepts": {
    name: "concepts", 
    description: "personal lexicon",
  },
  "/garden/library": {
    name: "library",
    description: "reading notes",
  },
};

export function GardenNav() {
  return (
    <nav className="mb-12 pb-6 border-b border-neutral-200 dark:border-neutral-800">
      <div className="flex flex-col gap-1">
        <h2 className="text-xs text-neutral-600 dark:text-neutral-400 mb-3">
          Digital Garden
        </h2>
        <div className="flex flex-wrap gap-4">
          {Object.entries(gardenItems).map(([path, { name, description }]) => (
            <Link key={path} href={path} className="group flex flex-col">
              <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100 group-hover:text-neutral-600 dark:group-hover:text-neutral-400 transition-colors">
                {name}
              </span>
              <span className="text-xs text-neutral-500 dark:text-neutral-500">
                {description}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
