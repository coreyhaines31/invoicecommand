import { professionSlugs } from '@/data/professions-expanded'
import { getProfessionContent, getProfessionName, getRelatedProfessions } from '@/data/profession-content'

describe('profession content', () => {
  it('exists for every profession page', () => {
    const missing = professionSlugs.filter((slug) => !getProfessionContent(slug))
    // Fix with: node scripts/generate-profession-content.mjs
    expect(missing).toEqual([])
  })

  it('has the sections every page renders', () => {
    for (const slug of professionSlugs) {
      const content = getProfessionContent(slug)
      if (!content) continue
      expect(content.rates.length).toBeGreaterThan(0)
      expect(content.sampleInvoice.items.length).toBeGreaterThan(0)
      expect(content.faqs.length).toBeGreaterThan(0)
      expect(content.estimate.faqs.length).toBeGreaterThan(0)
    }
  })
})

describe('getProfessionName', () => {
  it('keeps the original wording but fixes casing', () => {
    expect(getProfessionName('accounting')).toBe('Accounting')
    expect(getProfessionName('act-tutor')).toBe('ACT Tutor')
  })
})

describe('getRelatedProfessions', () => {
  const slug = professionSlugs.find((s) => getRelatedProfessions(s).length > 0) as string

  it('returns other professions in the same category', () => {
    const category = getProfessionContent(slug)?.category
    const related = getRelatedProfessions(slug)
    expect(related.map((r) => r.slug)).not.toContain(slug)
    for (const r of related) {
      expect(getProfessionContent(r.slug)?.category).toBe(category)
    }
  })

  it('respects the limit', () => {
    expect(getRelatedProfessions(slug, 2).length).toBeLessThanOrEqual(2)
  })

  it('returns nothing for an unknown profession', () => {
    expect(getRelatedProfessions('not-a-profession')).toEqual([])
  })
})
