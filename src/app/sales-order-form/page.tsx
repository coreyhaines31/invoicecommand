import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { salesOrderTemplates } from '@/data/sales-order-templates'
import { getStandalonePageBySlug } from '@/data/template-helpers'
import {
  StandaloneToolPage,
  buildStandaloneMetadata,
} from '@/components/standalone-tool-page'

const variant = getStandalonePageBySlug(
  salesOrderTemplates,
  'sales-order-form'
)

export const metadata: Metadata = variant
  ? buildStandaloneMetadata(variant)
  : { title: 'Page Not Found' }

export default function Page() {
  if (!variant) notFound()
  return (
    <StandaloneToolPage
      variant={variant}
      cluster={salesOrderTemplates}
      hubLabel="sales order"
    />
  )
}
