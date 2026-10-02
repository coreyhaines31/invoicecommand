export type DocumentKind = 'purchase_order' | 'sales_order'

export type TemplateVariantType = 'format' | 'profession' | 'integration' | 'intent'

export type DownloadFormat = 'pdf' | 'excel' | 'word' | 'google-docs' | 'google-sheets'

export type TemplateFAQ = {
  question: string
  answer: string
}

export type TemplateSection = {
  heading: string
  body: string
}

export type SampleLineItem = {
  description: string
  quantity: number
  price: number
}

export type VariantBase = {
  slug: string
  metaTitle: string
  h1: string
  metaDescription: string
  keywords: string[]
  intro: string
  sections: TemplateSection[]
  faq: TemplateFAQ[]
}

export type FormatVariant = VariantBase & {
  type: 'format'
  slug: DownloadFormat
}

export type ProfessionVariant = VariantBase & {
  type: 'profession'
  sampleLineItems: SampleLineItem[]
  sampleTerms: string
}

export type IntegrationVariant = VariantBase & {
  type: 'integration'
  integrationName: string
}

export type IntentVariant = VariantBase & {
  type: 'intent'
}

export type TemplateVariant =
  | FormatVariant
  | ProfessionVariant
  | IntegrationVariant
  | IntentVariant

export type TemplateHub = Omit<VariantBase, 'slug'>

export type TemplateCluster = {
  documentKind: DocumentKind
  basePath: string
  hub: TemplateHub
  clusterVariants: TemplateVariant[]
  standalonePages: TemplateVariant[]
}
