import content from './profession-content.json'
import { professions } from './professions-expanded'

export type ProfessionTip = { title: string; body: string }
export type ProfessionChecklistItem = { item: string; why: string }
export type ProfessionFaq = { question: string; answer: string }

export type ProfessionContent = {
  displayName: string
  category: string
  intro: string
  pricingModel: string
  rates: { service: string; unit: string; range: string }[]
  sampleInvoice: {
    items: { description: string; quantity: number; unit: string; rate: number }[]
    notes: string
  }
  invoiceChecklist: ProfessionChecklistItem[]
  paymentTerms: string
  tips: ProfessionTip[]
  faqs: ProfessionFaq[]
  estimate: {
    intro: string
    scopeChecklist: ProfessionChecklistItem[]
    pricingTips: ProfessionTip[]
    faqs: ProfessionFaq[]
  }
}

const professionContent = content as Record<string, ProfessionContent>

export function getProfessionContent(slug: string): ProfessionContent | undefined {
  return professionContent[slug]
}

// The name used in titles and headings. It keeps the searched-for wording
// ("Accounting", not "Accounting Business") but takes the generated casing
// fixes ("ACT Tutor", "3D Printing Service").
export function getProfessionName(slug: string): string | undefined {
  const base = professions.find((p) => p.id === slug)?.name
  const displayName = professionContent[slug]?.displayName
  if (!base || !displayName) return displayName ?? base
  return displayName.toLowerCase().startsWith(base.toLowerCase())
    ? displayName.slice(0, base.length)
    : base
}

// Professions in the same category, starting after this one alphabetically, so
// neighboring pages link to different sets instead of all linking to the same few.
export function getRelatedProfessions(slug: string, limit = 8): { slug: string; name: string }[] {
  const category = professionContent[slug]?.category
  if (!category) return []
  const peers = Object.keys(professionContent)
    .filter((s) => professionContent[s].category === category)
    .sort()
  const index = peers.indexOf(slug)
  const rotated = [...peers.slice(index + 1), ...peers.slice(0, index)]
  return rotated
    .slice(0, limit)
    .map((s) => ({ slug: s, name: getProfessionName(s) ?? s }))
}
