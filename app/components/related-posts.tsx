// app/components/related-posts.tsx
import Link from "next/link";
import { formatDate } from "app/blog/format";
import type { PostType } from "app/blog/utils";

interface RelatedPost {
  slug: string;
  metadata: {
    title: string;
    publishedAt: string;
    summary?: string;
    topics?: string[];
    type?: PostType;
  };
  readingTime: number;
  relevanceScore: number;
}

interface RelatedPostsProps {
  posts: RelatedPost[];
  currentLang: "en" | "id";
}

const typeEmojis: Record<PostType, string> = {
  essay: "📝",
  tutorial: "💻",
  note: "📚",
  reflection: "🤔",
  review: "⭐",
};

export function RelatedPosts({ posts, currentLang }: RelatedPostsProps) {
  if (posts.length === 0) return null;

  return (
    <aside className="mt-16 pt-8 border-t border-neutral-200 dark:border-neutral-800">
      <h2 className="text-lg font-semibold mb-6 tracking-tight">
        Related Posts
      </h2>

      <div className="space-y-6">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${currentLang}/${post.slug}`}
            className="block group no-underline"
          >
            <article className="space-y-2">
              {/* Title with Type Emoji */}
              <div className="flex items-start gap-2">
                {post.metadata.type && (
                  <span className="text-base flex-shrink-0 mt-5">
                    {typeEmojis[post.metadata.type]}
                  </span>
                )}
                <h3 className="text-neutral-900 dark:text-neutral-100 font-medium group-hover:text-neutral-600 dark:group-hover:text-neutral-400 transition-colors">
                  {post.metadata.title}
                </h3>
              </div>

              {/* Summary */}
              {post.metadata.summary && (
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  {post.metadata.summary}
                </p>
              )}

              {/* Metadata */}
              <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400">
                <time dateTime={post.metadata.publishedAt}>
                  {formatDate(post.metadata.publishedAt, false)}
                </time>

                <span>·</span>

                <span>{post.readingTime} min</span>

                {/* Shared Topics */}
                {post.metadata.topics &&
                  Array.isArray(post.metadata.topics) &&
                  post.metadata.topics.length > 0 && (
                    <>
                      <span>·</span>
                      <div className="flex gap-1.5 flex-wrap">
                        {post.metadata.topics.slice(0, 3).map((topic) => (
                          <span
                            key={topic}
                            className="px-1.5 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded text-neutral-700 dark:text-neutral-300"
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
        ))}
      </div>
    </aside>
  );
}
