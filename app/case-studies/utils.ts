// app/case-studies/utils.ts

import fs from 'fs'
import path from 'path'
import { cache } from 'react'
export { formatDate } from './format'

type Metadata = {
  title: string
  publishedAt: string
  summary: string
  image?: string
  featured?: boolean
  topics?: string[]
  client?: string
  role?: string
  duration?: string
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

    // Handle arrays (e.g., topics: ["web", "design"])
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

function getMDXData(dir: string) {
  let mdxFiles = getMDXFiles(dir)
  return mdxFiles.map((file) => {
    let { metadata, content } = readMDXFile(path.join(dir, file))
    let slug = path.basename(file, path.extname(file))
    let readingTime = calculateReadingTime(content)

    return {
      metadata: {
        ...metadata,
        topics: metadata.topics || [],
      },
      slug,
      content,
      readingTime,
    }
  })
}

export const getCaseStudies = cache(() => {
  const dir = path.join(process.cwd(), 'app', 'case-studies', 'posts')
  return getMDXData(dir)
})

export const getCaseStudy = cache((slug: string) => {
  const studies = getCaseStudies()
  return studies.find((study) => study.slug === slug)
})

export const getFeaturedCaseStudies = cache((limit: number = 3) => {
  const studies = getCaseStudies()
  return studies
    .filter((study) => study.metadata.featured)
    .sort((a, b) => {
      if (new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)) {
        return -1
      }
      return 1
    })
    .slice(0, limit)
})
