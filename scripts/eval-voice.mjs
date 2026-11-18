#!/usr/bin/env node
// Runs the synthetic voice commands in evals/voice/cases.json against a model
// through the same prompt and call the route uses (src/lib/voice-parser.ts),
// grades each reply deterministically, and writes evals/voice/results-<model>.json.
//
// Usage (paid calls through the Vercel AI Gateway; needs AI_GATEWAY_API_KEY,
// or VERCEL_OIDC_TOKEN from `vercel env pull`, in the environment):
//   npm run eval:voice -- --model openai/gpt-6-luna
//   VOICE_EVAL_MODEL=openai/gpt-4o-mini npm run eval:voice

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { DEFAULT_VOICE_MODEL, requestVoiceUpdate } from '../src/lib/voice-parser.ts'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const fixture = JSON.parse(fs.readFileSync(path.join(root, 'evals/voice/cases.json'), 'utf8'))

const flag = process.argv.indexOf('--model')
const model = (flag !== -1 ? process.argv[flag + 1] : undefined) ?? process.env.VOICE_EVAL_MODEL ?? DEFAULT_VOICE_MODEL
const concurrency = 5

// USD per million tokens, from the gateway's model list (read 2026-11-18).
const PRICES = {
  'openai/gpt-4o-mini': { input: 0.15, output: 0.6 },
  'openai/gpt-6-luna': { input: 0.1, output: 0.5 },
}

const FIELDS = new Set([
  'senderName', 'senderEmail', 'senderAddress', 'senderCity', 'senderState', 'senderZip', 'senderPhone',
  'clientName', 'clientEmail', 'clientAddress', 'clientCity', 'clientState', 'clientZip',
  'invoiceNumber', 'invoiceDate', 'dueDate', 'notes', 'terms', 'taxRate', 'discountRate',
])
const TOP_LEVEL_KEYS = new Set(['action', 'field', 'value', 'itemIndex', 'item', 'explanation', 'error'])
const ITEM_KEYS = new Set(['description', 'quantity', 'price'])

function sameNumber(actual, expected) {
  const n = typeof actual === 'number' ? actual : Number(String(actual).replace(/[$,%\s]/g, ''))
  return Number.isFinite(n) && Math.abs(n - expected) < 0.005
}

function sameValue(actual, expected) {
  if (actual === undefined || actual === null) return false
  if (typeof expected === 'number') return sameNumber(actual, expected)
  if (/^\d{4}-\d{2}-\d{2}$/.test(expected)) return String(actual).trim().slice(0, 10) === expected
  return String(actual).trim().toLowerCase() === expected.toLowerCase()
}

// Returns null on a pass, or the reason it failed.
function gradeOne(update, expect, invoice) {
  if (expect.action === 'error') {
    if (update.action === 'error') return null
    if (update.action === undefined && update.error !== undefined) return null
    return `expected error, got action ${JSON.stringify(update.action)}`
  }

  if (update.action !== expect.action) return `expected ${expect.action}, got ${JSON.stringify(update.action)}`

  const extra = Object.keys(update).filter((k) => !TOP_LEVEL_KEYS.has(k))
  if (extra.length) return `unexpected keys: ${extra.join(', ')}`

  if (expect.action === 'update_field') {
    if (update.field !== expect.field) return `expected field ${expect.field}, got ${JSON.stringify(update.field)}`
    if (!FIELDS.has(update.field)) return `unknown field ${update.field}`
    if (update.item !== undefined || update.itemIndex !== undefined) return 'update_field carries item data'
    if ('value' in expect && !sameValue(update.value, expect.value)) return `value ${JSON.stringify(update.value)} != ${JSON.stringify(expect.value)}`
    if (expect.valueAnyOf && !expect.valueAnyOf.some((v) => sameValue(update.value, v))) return `value ${JSON.stringify(update.value)} not in ${JSON.stringify(expect.valueAnyOf)}`
    if (expect.valueIncludes && !String(update.value ?? '').toLowerCase().includes(expect.valueIncludes.toLowerCase())) return `value ${JSON.stringify(update.value)} lacks "${expect.valueIncludes}"`
    return null
  }

  if (update.field !== undefined) return `${expect.action} carries field ${update.field}`

  if (expect.action === 'add_item' || expect.action === 'update_item') {
    if (expect.action === 'update_item' && update.itemIndex !== expect.itemIndex) return `expected itemIndex ${expect.itemIndex}, got ${JSON.stringify(update.itemIndex)}`
    if (expect.action === 'add_item' && update.itemIndex !== undefined) return 'add_item carries itemIndex'
    const item = update.item
    if (!item || typeof item !== 'object') return 'missing item'
    const badKeys = Object.keys(item).filter((k) => !ITEM_KEYS.has(k))
    if (badKeys.length) return `unexpected item keys: ${badKeys.join(', ')}`
    const want = expect.item
    if (want.descriptionIncludes && !want.descriptionIncludes.some((w) => String(item.description ?? '').toLowerCase().includes(w))) return `description ${JSON.stringify(item.description)} lacks ${JSON.stringify(want.descriptionIncludes)}`
    for (const key of ['quantity', 'price']) {
      if (key in want && !sameNumber(item[key], want[key])) return `${key} ${JSON.stringify(item[key])} != ${want[key]}`
    }
    // Nothing invented: on an update, untouched item fields must be absent or unchanged.
    if (expect.action === 'update_item') {
      const current = invoice.items[expect.itemIndex]
      for (const key of ITEM_KEYS) {
        const asked = key in want || (key === 'description' && want.descriptionIncludes)
        if (!asked && item[key] !== undefined && item[key] !== current[key]) return `changed ${key} to ${JSON.stringify(item[key])} without being asked`
      }
    }
    return null
  }

  if (expect.action === 'remove_item') {
    if (update.itemIndex !== expect.itemIndex) return `expected itemIndex ${expect.itemIndex}, got ${JSON.stringify(update.itemIndex)}`
    if (update.item !== undefined && update.item !== null && Object.keys(update.item).length) return 'remove_item carries item data'
    return null
  }

  return `no grader for ${expect.action}`
}

function grade(update, expect, invoice) {
  if (!expect.anyOf) return gradeOne(update, expect, invoice)
  const reasons = expect.anyOf.map((e) => gradeOne(update, e, invoice))
  return reasons.includes(null) ? null : reasons.join(' | ')
}

// Same sanitising as the route.
function sanitize(transcript) {
  return transcript.trim().slice(0, 1000).replace(/[<>]/g, '')
}

async function runCase(testCase, now) {
  const invoice = fixture.invoices[testCase.invoice ?? 'base']
  const started = Date.now()
  let reply
  try {
    reply = await requestVoiceUpdate({ transcript: sanitize(testCase.transcript), currentInvoice: invoice, now, model })
  } catch (error) {
    const ms = Date.now() - started
    // The reply came back but did not match the schema: a graded failure.
    if (error.name === 'AI_NoObjectGeneratedError') {
      return { ...testCase, pass: false, reason: 'reply did not match the schema', raw: error.text, usage: error.usage, ms }
    }
    const status = error.statusCode ?? error.lastError?.statusCode
    return { ...testCase, pass: false, reason: `request failed: ${status ?? ''} ${error.message}`, fatal: true }
  }
  const ms = Date.now() - started

  const reason = grade(reply.update, testCase.expect, invoice)
  return { ...testCase, pass: reason === null, reason, update: reply.update, usage: reply.usage, ms }
}

async function main() {
  if (!process.env.AI_GATEWAY_API_KEY && !process.env.VERCEL_OIDC_TOKEN) {
    console.error('Set AI_GATEWAY_API_KEY, or run `vercel env pull` for VERCEL_OIDC_TOKEN, then: npm run eval:voice')
    process.exit(1)
  }

  const now = new Date(fixture.now)
  const cases = fixture.cases
  const results = new Array(cases.length)
  let next = 0

  console.log(`Model ${model}, ${cases.length} cases, today fixed at ${fixture.now}\n`)

  await Promise.all(Array.from({ length: concurrency }, async () => {
    while (next < cases.length) {
      const i = next++
      results[i] = await runCase(cases[i], now)
      if (results[i].fatal) {
        console.error(`Stopping: ${results[i].reason}`)
        process.exit(1)
      }
    }
  }))

  const width = Math.max(...cases.map((c) => c.id.length))
  for (const r of results) {
    console.log(`${r.pass ? 'PASS' : 'FAIL'}  ${r.category.padEnd(15)} ${r.id.padEnd(width)}  ${r.pass ? '' : r.reason}`)
  }

  const byCategory = {}
  for (const r of results) {
    byCategory[r.category] ??= { pass: 0, total: 0 }
    byCategory[r.category].total++
    if (r.pass) byCategory[r.category].pass++
  }

  const passed = results.filter((r) => r.pass).length
  const inputTokens = results.reduce((sum, r) => sum + (r.usage?.inputTokens ?? 0), 0)
  const outputTokens = results.reduce((sum, r) => sum + (r.usage?.outputTokens ?? 0), 0)
  const reasoningTokens = results.reduce((sum, r) => sum + (r.usage?.outputTokenDetails?.reasoningTokens ?? 0), 0)
  const price = PRICES[model]
  const cost = price ? (inputTokens * price.input + outputTokens * price.output) / 1e6 : null
  const latencies = results.map((r) => r.ms ?? 0).sort((a, b) => a - b)

  console.log('\nBy category:')
  for (const [category, { pass, total }] of Object.entries(byCategory)) console.log(`  ${category.padEnd(15)} ${pass}/${total}`)
  console.log(`\nPass rate: ${passed}/${results.length} (${((passed / results.length) * 100).toFixed(1)}%)`)
  console.log(`Tokens: ${inputTokens} in, ${outputTokens} out (${reasoningTokens} reasoning)`)
  console.log(`Cost: ${cost === null ? 'unknown price for this model' : `$${cost.toFixed(4)}`}`)
  console.log(`Median latency: ${latencies[Math.floor(latencies.length / 2)]} ms`)

  const outPath = path.join(root, `evals/voice/results-${model.replace(/[^a-z0-9.-]/gi, '_')}.json`)
  fs.writeFileSync(outPath, JSON.stringify({ model, ranAt: new Date().toISOString(), passed, total: results.length, byCategory, inputTokens, outputTokens, reasoningTokens, cost, results }, null, 2))
  console.log(`\nWrote ${path.relative(root, outPath)}`)
}

main()
