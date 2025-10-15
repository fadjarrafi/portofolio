"use client";

import { useEffect, useState } from "react";

interface Heading {
  text: string;
  slug: string;
}

interface TableOfContentsProps {
  headings: Heading[];
}

export function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a[href^="#"]');

      if (anchor) {
        e.preventDefault();
        const href = anchor.getAttribute("href");
        if (href) {
          const targetId = href.substring(1);
          const targetElement = document.getElementById(targetId);

          if (targetElement) {
            const navbarHeight = 96; // Account for fixed navbar
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition =
              elementPosition + window.pageYOffset - navbarHeight;

            window.scrollTo({
              top: offsetPosition,
              behavior: "smooth",
            });

            // Update URL without triggering navigation
            window.history.pushState(null, "", href);
            setActiveId(targetId);
          }
        }
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-100px 0px -66% 0px",
        threshold: 0,
      }
    );

    // Observe all heading elements
    headings.forEach(({ slug }) => {
      const element = document.getElementById(slug);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      headings.forEach(({ slug }) => {
        const element = document.getElementById(slug);
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, [headings]);

  if (headings.length === 0) {
    return null;
  }

  return (
    <div className="p-4 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-50 dark:bg-neutral-900">
      <h2 className="font-semibold mb-3 text-neutral-900 dark:text-neutral-100 text-sm">
        Table of Contents
      </h2>
      <nav>
        <ul className="space-y-2 font-mono">
          {headings.map((heading, index) => (
            <li key={index}>
              <a
                href={`#${heading.slug}`}
                className={`text-sm block transition-all duration-200 ${
                  activeId === heading.slug
                    ? "text-neutral-900 dark:text-neutral-100 font-medium border-l-2 border-neutral-900 dark:border-neutral-100 pl-3 -ml-[2px]"
                    : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 pl-3"
                }`}
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
