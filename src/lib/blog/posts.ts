import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export type BlogPostMeta = {
  slug: string
  title: string
  description: string
  publishedAt: string
  category: string
  keywords: string[]
  excerpt?: string
}

export type BlogPost = BlogPostMeta & {
  content: string
}

const BLOG_DIR = path.join(process.cwd(), 'src/content/blog')

function readPostFile(slug: string): BlogPost {
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`)
  const file = fs.readFileSync(filePath, 'utf8')
  const { data, content } = matter(file)
  return {
    slug,
    title: data.title,
    description: data.description,
    publishedAt: data.publishedAt,
    category: data.category,
    keywords: data.keywords ?? [],
    excerpt: data.excerpt,
    content,
  }
}

export function getAllPostSlugs(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return []
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => f.replace(/\.mdx$/, ''))
}

export function getAllPosts(): BlogPostMeta[] {
  return getAllPostSlugs()
    .map((slug) => {
      const { content: _content, ...meta } = readPostFile(slug)
      return meta
    })
    .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1))
}

export function getPostBySlug(slug: string): BlogPost | null {
  if (!getAllPostSlugs().includes(slug)) return null
  return readPostFile(slug)
}

export function getPostsByCategory(category: string): BlogPostMeta[] {
  return getAllPosts().filter((p) => p.category === category)
}
