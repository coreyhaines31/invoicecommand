import { Metadata } from 'next'
import Link from 'next/link'
import { Logo } from '@/components/logo'
import { getAllPosts } from '@/lib/blog/posts'

const SITE = 'https://invoicecommand.com'
const BLOG_URL = `${SITE}/blog`

export const metadata: Metadata = {
  title: 'Invoice Command Blog — Invoicing, Purchase Orders, and Small Business Finance',
  description:
    'Practical guides on invoicing, purchase orders, sales orders, and small business finance. Free templates and tools from Invoice Command.',
  alternates: { canonical: BLOG_URL },
  openGraph: {
    title: 'Invoice Command Blog',
    description:
      'Practical guides on invoicing, purchase orders, sales orders, and small business finance.',
    url: BLOG_URL,
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Invoice Command Blog' }],
  },
}

export default function BlogIndexPage() {
  const posts = getAllPosts()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Invoice Command Blog',
    url: BLOG_URL,
    blogPost: posts.map((p) => ({
      '@type': 'BlogPosting',
      headline: p.title,
      description: p.description,
      datePublished: p.publishedAt,
      url: `${BLOG_URL}/${p.slug}`,
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen bg-background">
        <nav className="container mx-auto p-4 mb-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <Logo width={24} height={24} className="text-primary" />
              <span className="text-lg font-semibold text-foreground">Invoice Command</span>
            </Link>
          </div>
        </nav>

        <header className="container mx-auto p-4 mb-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold text-foreground mb-4">Blog</h1>
            <p className="text-xl text-muted-foreground">
              Practical guides on invoicing, purchase orders, sales orders, and the
              small business finance work that pays the bills.
            </p>
          </div>
        </header>

        <main className="container mx-auto p-4">
          <div className="max-w-4xl mx-auto">
            {posts.length === 0 ? (
              <p className="text-center text-muted-foreground py-12">
                No posts yet. Check back soon.
              </p>
            ) : (
              <ul className="space-y-6">
                {posts.map((post) => (
                  <li
                    key={post.slug}
                    className="bg-card border border-border rounded-lg p-6 transition-shadow hover:shadow-lg"
                  >
                    <Link href={`/blog/${post.slug}`} className="block">
                      <div className="text-xs uppercase tracking-wide text-muted-foreground mb-2">
                        {post.category} ·{' '}
                        {new Date(post.publishedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </div>
                      <h2 className="text-2xl font-bold text-foreground mb-2 hover:text-primary transition">
                        {post.title}
                      </h2>
                      <p className="text-muted-foreground">
                        {post.excerpt ?? post.description}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </main>
      </div>
    </>
  )
}
