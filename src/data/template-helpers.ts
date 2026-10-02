import type { TemplateCluster, TemplateVariant } from '@/types/templates'

export function getClusterVariantBySlug(
  cluster: TemplateCluster,
  slug: string
): TemplateVariant | undefined {
  return cluster.clusterVariants.find((v) => v.slug === slug)
}

export function getStandalonePageBySlug(
  cluster: TemplateCluster,
  slug: string
): TemplateVariant | undefined {
  return cluster.standalonePages.find((v) => v.slug === slug)
}

export function buildClusterVariantPath(
  cluster: TemplateCluster,
  slug: string
): string {
  return `${cluster.basePath}/${slug}`
}
