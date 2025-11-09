// app/garden/utils.ts
import 'server-only'

import fs from 'fs'
import path from 'path'
import { cache } from 'react'

export type PostType = 'essay' | 'tutorial' | 'note' | 'reflection' | 'review'
export type GrowthStage = 'seed' | 'sapling' | 'tree'

// Export formatDate from separate file for client-side use
export { formatDate } from './format'

type Metadata = {
  title: string
  publishedAt: string
  summary: string
  image?: string
  lang?: 'en' | 'id'
  translationSlug?: string
  topics?: string[]
  type?: PostType
  updated?: string
  status?: GrowthStage
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
    
    if (value.startsWith('[') && value.endsWith(']')) {
      const arrayItems = value
        .slice(1, -1)
        .split(',')
        .map(item => item.trim().replace(/^['"](.*)['"]$/, '$1'))
        .filter(item => item.length > 0)
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

    // Auto-assign growth stage based on word count if not specified
    let status: GrowthStage = metadata.status || 'tree'
    if (!metadata.status) {
      const wordCount = content.trim().split(/\s+/).length
      if (wordCount < 300) {
        status = 'seed'
      } else if (wordCount < 1000) {
        status = 'sapling'
      }
    }

    return {
      metadata: {
        ...metadata,
        lang: metadata.lang || lang,
        topics: metadata.topics || [],
        type: metadata.type || 'essay',
        status,
      },
      slug,
      content,
      readingTime,
    }
  })
}

// Get garden thoughts for a specific language
export const getGardenThoughts = cache((lang: 'en' | 'id' = 'en') => {
  const langDir = path.join(process.cwd(), 'app', 'garden', 'thoughts', 'posts', lang)
  return getMDXData(langDir, lang)
})

// Get all garden thoughts from all languages
export const getAllGardenThoughts = cache(() => {
  const enThoughts = getGardenThoughts('en').map(post => ({ ...post, lang: 'en' as const }))
  const idThoughts = getGardenThoughts('id').map(post => ({ ...post, lang: 'id' as const }))
  return [...enThoughts, ...idThoughts]
})

// Get a specific thought by slug and language
export const getGardenThought = cache((slug: string, lang: 'en' | 'id' = 'en') => {
  const thoughts = getGardenThoughts(lang)
  return thoughts.find((thought) => thought.slug === slug)
})

// Get all unique topics
export const getAllGardenTopics = cache((lang: 'en' | 'id' = 'en') => {
  const thoughts = getGardenThoughts(lang)
  const topicsSet = new Set<string>()
  
  thoughts.forEach(thought => {
    const topics = thought.metadata.topics
    if (topics && Array.isArray(topics)) {
      topics.forEach(topic => topicsSet.add(topic))
    }
  })
  
  return Array.from(topicsSet).sort()
})

// Get all unique post types
export const getAllGardenTypes = cache((lang: 'en' | 'id' = 'en') => {
  const thoughts = getGardenThoughts(lang)
  const typesSet = new Set<PostType>()
  
  thoughts.forEach(thought => {
    if (thought.metadata.type) {
      typesSet.add(thought.metadata.type)
    }
  })
  
  return Array.from(typesSet).sort()
})

// Find related thoughts based on shared topics
export const getRelatedThoughts = cache((slug: string, lang: 'en' | 'id' = 'en', limit: number = 3) => {
  const currentThought = getGardenThought(slug, lang)
  if (!currentThought) return []
  
  const currentTopics = currentThought.metadata.topics
  if (!currentTopics || !Array.isArray(currentTopics) || currentTopics.length === 0) {
    return []
  }
  
  const allThoughts = getGardenThoughts(lang)
  
  const thoughtsWithScores = allThoughts
    .filter(thought => thought.slug !== slug)
    .map(thought => {
      const thoughtTopics = thought.metadata.topics
      const sharedTopics = (thoughtTopics && Array.isArray(thoughtTopics))
        ? thoughtTopics.filter(topic => currentTopics.includes(topic))
        : []
      
      return {
        ...thought,
        relevanceScore: sharedTopics.length
      }
    })
    .filter(thought => thought.relevanceScore > 0)
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, limit)
  
  return thoughtsWithScores
})

// Get topic statistics
export const getGardenTopicStats = cache((lang: 'en' | 'id' = 'en') => {
  const thoughts = getGardenThoughts(lang)
  const stats: Record<string, number> = {}
  
  thoughts.forEach(thought => {
    const topics = thought.metadata.topics
    if (topics && Array.isArray(topics)) {
      topics.forEach(topic => {
        stats[topic] = (stats[topic] || 0) + 1
      })
    }
  })
  
  return stats
})