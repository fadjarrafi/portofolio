export type PostType = 'essay' | 'tutorial' | 'note' | 'reflection' | 'review';
export type GrowthStage = 'seed' | 'sapling' | 'tree';

export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

export function getGrowthStage(content: string, explicitStatus?: GrowthStage): GrowthStage {
  if (explicitStatus) return explicitStatus;
  const wordCount = content.trim().split(/\s+/).length;
  if (wordCount < 300) return 'seed';
  if (wordCount < 1000) return 'sapling';
  return 'tree';
}

export function getRelatedPosts<T extends { slug: string; data: { topics?: string[] } }>(
  entries: T[],
  currentSlug: string,
  limit = 3
): (T & { relevanceScore: number })[] {
  const current = entries.find((e) => e.slug === currentSlug);
  if (!current) return [];

  const currentTopics = current.data.topics;
  if (!currentTopics || currentTopics.length === 0) return [];

  return entries
    .filter((e) => e.slug !== currentSlug)
    .map((e) => {
      const sharedTopics = (e.data.topics ?? []).filter((t) => currentTopics.includes(t));
      return { ...e, relevanceScore: sharedTopics.length };
    })
    .filter((e) => e.relevanceScore > 0)
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, limit);
}
