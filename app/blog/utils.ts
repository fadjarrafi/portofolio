// app/blog/utils.ts

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
  lang?: 'en' | 'id'
  translationSlug?: string
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
    
    if (value === 'true') {
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

function getMDXData(dir: string, lang: 'en' | 'id' = 'en') {
  let mdxFiles = getMDXFiles(dir)
  return mdxFiles.map((file) => {
    let { metadata, content } = readMDXFile(path.join(dir, file))
    let slug = path.basename(file, path.extname(file))

    return {
      metadata: {
        ...metadata,
        lang: metadata.lang || lang,
      },
      slug,
      content,
    }
  })
}

// Get posts for a specific language (for blog list and featured posts)
export const getBlogPosts = cache((lang: 'en' | 'id' = 'en') => {
  const langDir = path.join(process.cwd(), 'app', 'blog', 'posts', lang)
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