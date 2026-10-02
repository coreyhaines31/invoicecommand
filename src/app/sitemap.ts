import type { MetadataRoute } from 'next'
import { professionSlugs } from '@/data/professions-expanded'
import { purchaseOrderTemplates } from '@/data/purchase-order-templates'
import { salesOrderTemplates } from '@/data/sales-order-templates'
import { buildClusterVariantPath } from '@/data/template-helpers'
import { getAllPosts } from '@/lib/blog/posts'

const SITE = 'https://invoicecommand.com'

function entry(
  path: string,
  priority: number,
  lastModified?: string
): MetadataRoute.Sitemap[number] {
  return { url: `${SITE}${path}`, priority, ...(lastModified && { lastModified }) }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const clusters = [purchaseOrderTemplates, salesOrderTemplates]

  return [
    entry('', 1.0),
    entry('/invoice-templates', 0.9),
    entry('/estimate-templates', 0.9),
    entry('/estimate-maker', 0.9),
    ...professionSlugs.map((slug) => entry(`/invoice-templates/${slug}`, 0.8)),
    ...professionSlugs.map((slug) => entry(`/estimate-templates/${slug}`, 0.7)),
    ...clusters.flatMap((cluster) => [
      entry(cluster.basePath, 0.9),
      ...cluster.clusterVariants.map((v) => entry(buildClusterVariantPath(cluster, v.slug), 0.8)),
      // Standalone pages live at the site root, e.g. /purchase-order-generator
      ...cluster.standalonePages.map((v) => entry(`/${v.slug}`, 0.8)),
    ]),
    entry('/blog', 0.7),
    ...getAllPosts().map((post) => entry(`/blog/${post.slug}`, 0.6, post.publishedAt)),
  ]
}
