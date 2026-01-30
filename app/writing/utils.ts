// app/writing/utils.ts

import fs from 'fs'
import path from 'path'
import { cache } from 'react'
export { formatDate } from './format'

export type PostType = 'essay' | 'tutorial' | 'note' | 'reflection' | 'review'

type Metadata = {
  title: string
  publishedAt: string
  summary: string
  image?: string
  featured?: boolean
  lang?: 'en' | 'id'
  translationSlug?: string
  topics?: string[]
  type?: PostType
  updated?: string
  [key: string]: any
}

function parseFrontmatter(fileContent: string) {
  let frontmatterRegex = /---\s*([\s\S]*?)\s*---/
  let match = frontmatterRegex.exec(fileContent)
  let frontMatterBlock = match![1]
  let content = fileContent.replace(frontmatterRegex, '').trim()
  let frontMatterLines = frontMatterBlock.trim().split('\n')
  let metadata: any = {}

  frontMatterLines.forEach((line) => {
    let [key, ...valueArr] = line.split(': ')
    let value = valueArr.join(': ').trim()
    value = value.replace(/^['"](.*)['"]$/, '$1')
    
    // Handle arrays (e.g., topics: ["programming", "mathematics"])
    if (value.startsWith('[') && value.endsWith(']')) {
      const arrayItems = value
        .slice(1, -1)
        .split(',')
        .map(item => item.trim().replace(/^['"](.*)['"]$/, '$1'))
        .filter(item => item.length > 0) // Remove empty items
      metadata[key.trim()] = arrayItems
    } else if (value === 'true') {
      metadata[key.trim()] = true
    } else if (value === 'false') {
      metadata[key.trim()] = false
    } else {
      metadata[key.trim()] = value
    }
  })

  return { metadata: metadata as Metadata, content }
}

function getMDXFiles(dir: string) {
  if (!fs.existsSync(dir)) {
    return []
  }
  return fs.readdirSync(dir).filter((file) => path.extname(file) === '.mdx')
}

function readMDXFile(filePath: string) {
  let rawContent = fs.readFileSync(filePath, 'utf-8')
  return parseFrontmatter(rawContent)
}

// Calculate reading time in minutes
function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200
  const words = content.trim().split(/\s+/).length
  const minutes = Math.ceil(words / wordsPerMinute)
  return minutes
}

function getMDXData(dir: string, lang: 'en' | 'id' = 'en') {
  let mdxFiles = getMDXFiles(dir)
  return mdxFiles.map((file) => {
    let { metadata, content } = readMDXFile(path.join(dir, file))
    let slug = path.basename(file, path.extname(file))
    let readingTime = calculateReadingTime(content)

    return {
      metadata: {
        ...metadata,
        lang: metadata.lang || lang,
        topics: metadata.topics || [],
        type: metadata.type || 'essay',
      },
      slug,
      content,
      readingTime,
    }
  })
}

// Get posts for a specific language (for blog list and featured posts)
export const getBlogPosts = cache((lang: 'en' | 'id' = 'en') => {
  const langDir = path.join(process.cwd(), 'app', 'writing', 'posts', lang)
  return getMDXData(langDir, lang)
})

// Get all posts from all languages (for static params generation)
export const getAllBlogPosts = cache(() => {
  const enPosts = getBlogPosts('en').map(post => ({ ...post, lang: 'en' as const }))
  const idPosts = getBlogPosts('id').map(post => ({ ...post, lang: 'id' as const }))
  return [...enPosts, ...idPosts]
})

// Get a specific post by slug and language
export const getBlogPost = cache((slug: string, lang: 'en' | 'id' = 'en') => {
  const posts = getBlogPosts(lang)
  return posts.find((post) => post.slug === slug)
})

// Get all unique topics across all posts
export const getAllTopics = cache((lang: 'en' | 'id' = 'en') => {
  const posts = getBlogPosts(lang)
  const topicsSet = new Set<string>()
  
  posts.forEach(post => {
    const topics = post.metadata.topics
    if (topics && Array.isArray(topics)) {
      topics.forEach(topic => topicsSet.add(topic))
    }
  })
  
  return Array.from(topicsSet).sort()
})

// Get all unique post types
export const getAllPostTypes = cache((lang: 'en' | 'id' = 'en') => {
  const posts = getBlogPosts(lang)
  const typesSet = new Set<PostType>()
  
  posts.forEach(post => {
    if (post.metadata.type) {
      typesSet.add(post.metadata.type)
    }
  })
  
  return Array.from(typesSet).sort()
})

// Find related posts based on shared topics
export const getRelatedPosts = cache((slug: string, lang: 'en' | 'id' = 'en', limit: number = 3) => {
  const currentPost = getBlogPost(slug, lang)
  if (!currentPost) return []
  
  const currentTopics = currentPost.metadata.topics
  if (!currentTopics || !Array.isArray(currentTopics) || currentTopics.length === 0) {
    return []
  }
  
  const allPosts = getBlogPosts(lang)
  
  // Calculate relevance score based on shared topics
  const postsWithScores = allPosts
    .filter(post => post.slug !== slug)
    .map(post => {
      const postTopics = post.metadata.topics
      const sharedTopics = (postTopics && Array.isArray(postTopics))
        ? postTopics.filter(topic => currentTopics.includes(topic))
        : []
      
      return {
        ...post,
        relevanceScore: sharedTopics.length
      }
    })
    .filter(post => post.relevanceScore > 0)
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, limit)
  
  return postsWithScores
})

// Get topic statistics
export const getTopicStats = cache((lang: 'en' | 'id' = 'en') => {
  const posts = getBlogPosts(lang)
  const stats: Record<string, number> = {}
  
  posts.forEach(post => {
    const topics = post.metadata.topics
    if (topics && Array.isArray(topics)) {
      topics.forEach(topic => {
        stats[topic] = (stats[topic] || 0) + 1
      })
    }
  })
  
  return stats
})