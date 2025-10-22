// app/components/featured-posts.tsx

import Link from "next/link";
import { formatDate, getBlogPosts } from "@/app/blog/utils";
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
        <h2 className="text-2xl font-semibold tracking-tighter mb-8">
          Featured Posts
        </h2>
      </ScrollAnimate>
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
        ))}
    </div>
  );
}
