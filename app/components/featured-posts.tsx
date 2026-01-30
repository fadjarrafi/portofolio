// app/components/featured-posts.tsx

import Link from "next/link";
import { formatDate, getBlogPosts } from "@/app/writing/utils";
import { ScrollAnimate } from "./scroll-animate";

export function FeaturedBlogPosts() {
  // Always show only English posts on homepage
  let allBlogs = getBlogPosts("en");

  // Filter only featured posts
  let featuredBlogs = allBlogs.filter(
    (post) => post.metadata.featured === true
  );

  return (
    <div>
      <ScrollAnimate delay={0}>
        <h2 className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-6">
          Writing
        </h2>
      </ScrollAnimate>
      <div className="space-y-6">
        {featuredBlogs
          .sort((a, b) => {
            if (
              new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)
            ) {
              return -1;
            }
            return 1;
          })
          .map((post) => (
            <ScrollAnimate key={post.slug} delay={100}>
              <Link
                className="block group"
                href={`/writing/en/${post.slug}`}
              >
                <p className="text-xs text-neutral-400 dark:text-neutral-500 tabular-nums mb-1">
                  {formatDate(post.metadata.publishedAt, false)}
                </p>
                <p className="text-base font-medium mb-1 group-hover:underline">
                  {post.metadata.title}
                </p>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  {post.metadata.summary}
                </p>
              </Link>
            </ScrollAnimate>
          ))}
      </div>
    </div>
  );
}
