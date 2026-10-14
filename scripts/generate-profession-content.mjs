#!/usr/bin/env node
// Generates src/data/profession-content.json: the per-profession guide shown on
// /invoice-templates/[profession] and /estimate-templates/[profession].
//
// Usage (needs AI_GATEWAY_API_KEY):
//   node scripts/generate-profession-content.mjs              # only professions missing content
//   node scripts/generate-profession-content.mjs plumber tutor # regenerate these
//   CONTENT_MODEL=openai/gpt-6 node scripts/generate-profession-content.mjs

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { generateText, Output } from 'ai'
import { z } from 'zod'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const professionsPath = path.join(root, 'src/data/professions-expanded.ts')
const outputPath = path.join(root, 'src/data/profession-content.json')
const model = process.env.CONTENT_MODEL ?? 'anthropic/claude-sonnet-5-5'
const concurrency = Number(process.env.CONCURRENCY ?? 8)

const CATEGORIES = [
  'Creative & Design',
  'Technology & Development',
  'Business & Consulting',
  'Marketing & Writing',
  'Health & Wellness',
  'Beauty & Personal Care',
  'Education & Coaching',
  'Home Services',
  'Construction & Trades',
  'Events & Entertainment',
  'Automotive & Transportation',
  'Pets & Animals',
  'Retail & Manufacturing',
]

const tip = z.object({ title: z.string(), body: z.string() })
const checklistItem = z.object({ item: z.string(), why: z.string() })
const faq = z.object({ question: z.string(), answer: z.string() })

const schema = z.object({
  displayName: z.string().describe('Correctly cased singular name, e.g. "ACT Tutor", "3D Printing Service", "HVAC Technician"'),
  category: z.enum(CATEGORIES),
  intro: z.string().describe('2-3 sentences: who sends these invoices and what they typically bill for'),
  pricingModel: z.string().describe('One paragraph on how this profession usually prices work: hourly, per session, per square foot, flat fee, retainer, packages, materials markup, etc.'),
  rates: z.array(z.object({
    service: z.string(),
    unit: z.string().describe('Pricing unit, e.g. "per hour", "per visit", "per sq ft", "flat fee"'),
    range: z.string().describe('Typical US range, e.g. "$75-150"'),
  })).describe('5-8 items'),
  sampleInvoice: z.object({
    items: z.array(z.object({
      description: z.string(),
      quantity: z.number(),
      unit: z.string(),
      rate: z.number().describe('Unit price in USD'),
    })).describe('3-6 items'),
    notes: z.string().describe('A realistic notes/terms line for the bottom of this invoice'),
  }),
  invoiceChecklist: z.array(checklistItem).describe('5-7 items. Details this profession specifically should put on an invoice (licenses, mileage, materials, session dates, PO numbers, etc.), each with why'),
  paymentTerms: z.string().describe('One paragraph on common deposits, due dates, late fees, and payment methods in this field'),
  tips: z.array(tip).describe('3-5 items. Practical billing tips specific to this profession'),
  faqs: z.array(faq).describe('4-5 items. Questions people in this profession ask about invoicing, with direct answers'),
  estimate: z.object({
    intro: z.string().describe('2-3 sentences on when this profession sends an estimate or quote and what clients compare'),
    scopeChecklist: z.array(checklistItem).describe('5-7 items. What to spell out in a quote for this profession to avoid disputes'),
    pricingTips: z.array(tip).describe('3-4 items. How to price and present quotes in this field'),
    faqs: z.array(faq).describe('3-4 items. Questions about quoting and estimates in this profession'),
  }),
})

function buildPrompt(profession) {
  return `Write reference content for a page that helps a ${profession.name} (slug: ${profession.id}) bill clients.

The page is read by people who do this work, often solo or in a small business, mostly in the US. They want to know what to charge, what to put on an invoice or estimate, and how to get paid. Be concrete and specific to this profession: name real services, real pricing units, and the details that come up in this line of work and not in others. If the slug describes a business type rather than a person (e.g. "accounting", "cleaning-service"), write for the person running that business.

Rules:
- Plain, direct language. No marketing words ("seamless", "streamline", "elevate", "game-changer"), no exclamation marks.
- Do not mention any invoicing product, website, or tool by name.
- Rates are typical US ranges. Keep them realistic and conservative; they vary by region and experience.
- Only state legal or tax requirements that are broadly true, and hedge where they vary ("in many states", "check your local rules").
- The sample invoice should look like a real one for a typical job in this field, with sensible quantities and rates inside your ranges.
- The estimate section is about quoting before work starts. Don't repeat the invoice section.`
}

function readProfessions() {
  const source = fs.readFileSync(professionsPath, 'utf8')
  const ids = [...source.matchAll(/"id": "([^"]+)"/g)].map((m) => m[1])
  const names = [...source.matchAll(/"name": "([^"]+)"/g)].map((m) => m[1])
  return ids.map((id, i) => ({ id, name: names[i] }))
}

function readContent() {
  return fs.existsSync(outputPath) ? JSON.parse(fs.readFileSync(outputPath, 'utf8')) : {}
}

function writeContent(content) {
  const sorted = Object.fromEntries(Object.keys(content).sort().map((k) => [k, content[k]]))
  fs.writeFileSync(outputPath, JSON.stringify(sorted, null, 2) + '\n')
}

async function main() {
  const requested = process.argv.slice(2)
  const professions = readProfessions()
  const content = readContent()

  const unknown = requested.filter((slug) => !professions.some((p) => p.id === slug))
  if (unknown.length) throw new Error(`Unknown professions: ${unknown.join(', ')}`)

  const queue = requested.length
    ? professions.filter((p) => requested.includes(p.id))
    : professions.filter((p) => !content[p.id])

  console.log(`Generating ${queue.length} of ${professions.length} professions with ${model}`)
  let done = 0
  const failed = []

  async function worker() {
    while (queue.length) {
      const profession = queue.shift()
      try {
        const { output } = await generateText({
          model,
          output: Output.object({ schema }),
          prompt: buildPrompt(profession),
          maxRetries: 3,
        })
        content[profession.id] = output
        writeContent(content)
        console.log(`[${++done}] ${profession.id}`)
      } catch (error) {
        failed.push(profession.id)
        console.error(`FAILED ${profession.id}: ${error.message} ${error.cause?.message ?? ""}`.trim())
      }
    }
  }

  await Promise.all(Array.from({ length: concurrency }, worker))

  if (failed.length) {
    console.error(`\n${failed.length} failed; rerun to retry: ${failed.join(' ')}`)
    process.exit(1)
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
