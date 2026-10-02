import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { purchaseOrderTemplates } from '@/data/purchase-order-templates'
import { getStandalonePageBySlug } from '@/data/template-helpers'
import {
  StandaloneToolPage,
  buildStandaloneMetadata,
} from '@/components/standalone-tool-page'

const variant = getStandalonePageBySlug(
  purchaseOrderTemplates,
  'purchase-order-generator'
)

export const metadata: Metadata = variant
  ? buildStandaloneMetadata(variant)
  : { title: 'Page Not Found' }

export default function Page() {
  if (!variant) notFound()
  return (
    <StandaloneToolPage
      variant={variant}
      cluster={purchaseOrderTemplates}
      hubLabel="purchase order"
    />
  )
}
