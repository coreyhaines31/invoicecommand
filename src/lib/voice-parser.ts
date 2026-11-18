// Prompt and model call for /api/parse-voice, through the Vercel AI Gateway.
// Shared with scripts/eval-voice.mjs, which imports this file directly with
// Node's type stripping, so keep it free of path aliases.
import { generateText, Output, type LanguageModelUsage } from 'ai'
import { z } from 'zod'

export const DEFAULT_VOICE_MODEL = 'openai/gpt-4o-mini'

export function voiceModel() {
  return process.env.VOICE_MODEL || DEFAULT_VOICE_MODEL
}

// gpt-4o models are not reasoning models: keep the original temperature and
// token cap. Newer OpenAI models reason, which counts against the output cap,
// and their docs do not list temperature support.
function modelSettings(model: string) {
  return model.includes('gpt-4o')
    ? { temperature: 0.1, maxOutputTokens: 500 }
    : { reasoning: 'low' as const, maxOutputTokens: 2000 }
}

const FIELDS = [
  'senderName', 'senderEmail', 'senderAddress', 'senderCity', 'senderState', 'senderZip', 'senderPhone',
  'clientName', 'clientEmail', 'clientAddress', 'clientCity', 'clientState', 'clientZip',
  'invoiceNumber', 'invoiceDate', 'dueDate', 'notes', 'terms', 'taxRate', 'discountRate',
] as const

// Mirrors the update shape the client applies. Structured output needs every
// key present, so optional keys are nullable and nulls are dropped afterwards.
export const voiceUpdateSchema = z.object({
  action: z.enum(['update_field', 'add_item', 'update_item', 'remove_item', 'error']),
  field: z.enum(FIELDS).nullable(),
  value: z.union([z.string(), z.number()]).nullable(),
  itemIndex: z.number().int().nullable(),
  item: z
    .object({
      description: z.string().nullable(),
      quantity: z.number().nullable(),
      price: z.number().nullable(),
    })
    .nullable(),
  explanation: z.string(),
})

// Dates are the server's UTC date; the client does not send its local date.
export function buildSystemPrompt(now: Date) {
  const today = now.toISOString().slice(0, 10)
  const year = today.slice(0, 4)
  const weekday = now.toLocaleDateString('en-US', { weekday: 'long', timeZone: 'UTC' })

  return `You are an AI assistant that converts natural language voice commands into structured invoice updates for Invoice Command, a professional invoicing application.

Your job is to parse voice commands and return JSON updates that can be applied to an invoice. You must be very precise and only make changes that are clearly requested.

SUPPORTED ACTIONS:
1. "update_field" - Update any invoice field (sender info, client info, dates, tax rate, discount rate, notes, terms)
2. "add_item" - Add a new line item to the invoice
3. "update_item" - Modify an existing line item (requires itemIndex)
4. "remove_item" - Remove a line item (requires itemIndex)

FIELD MAPPINGS:
- Business/sender info: senderName, senderEmail, senderAddress, senderCity, senderState, senderZip, senderPhone
- Client info: clientName, clientEmail, clientAddress, clientCity, clientState, clientZip
- Invoice details: invoiceNumber, invoiceDate, dueDate, notes, terms
- Financial: taxRate (as percentage 0-100), discountRate (as percentage 0-100)

DATE FORMATS:
- Today is ${weekday}, ${today}. Resolve relative dates from today.
- Convert natural language dates to YYYY-MM-DD format
- "January 15th" → "${year}-01-15" (current year)
- "next Friday" → calculate the date
- "30 days from now" → calculate the date

EXAMPLES:

Input: "Add 5 hours of consulting at $150 per hour"
Output: {
  "action": "add_item",
  "item": {
    "description": "Consulting services",
    "quantity": 5,
    "price": 150
  },
  "explanation": "Added 5 hours of consulting at $150/hour"
}

Input: "Set tax rate to 8.5 percent"
Output: {
  "action": "update_field",
  "field": "taxRate",
  "value": 8.5,
  "explanation": "Set tax rate to 8.5%"
}

Input: "Change client name to ABC Company"
Output: {
  "action": "update_field",
  "field": "clientName",
  "value": "ABC Company",
  "explanation": "Updated client name to ABC Company"
}

Input: "Set due date to January 15th"
Output: {
  "action": "update_field",
  "field": "dueDate",
  "value": "${year}-01-15",
  "explanation": "Set due date to January 15, ${year}"
}

IMPORTANT RULES:
- Always include an "explanation" field describing what was changed
- For tax/discount rates, use percentage values (8.5 for 8.5%)
- For dates, convert to YYYY-MM-DD format
- For line items, extract quantity and price if mentioned
- If the command is unclear or ambiguous, return the "error" action with an explanation of what is unclear
- Only make changes that are explicitly requested
- Preserve existing data unless specifically asked to change it`
}

export function buildUserPrompt(transcript: string, currentInvoice: unknown) {
  return `Current Invoice Data:
${JSON.stringify(currentInvoice, null, 2)}

Voice Command: "${transcript}"

Parse this voice command and return the appropriate invoice update as JSON. Be precise and only make changes that are clearly requested.`
}

type VoiceRequest = {
  transcript: string
  currentInvoice: unknown
  now: Date
  model?: string
}

export type VoiceUpdate = Record<string, unknown> & { action: string; explanation?: string }

export type VoiceReply = {
  update: VoiceUpdate
  usage: LanguageModelUsage
}

// Throws NoObjectGeneratedError when the reply does not match the schema;
// any other throw is a provider, gateway or network failure.
export async function requestVoiceUpdate({
  transcript,
  currentInvoice,
  now,
  model = voiceModel(),
}: VoiceRequest): Promise<VoiceReply> {
  const { output, usage } = await generateText({
    model,
    system: buildSystemPrompt(now),
    prompt: buildUserPrompt(transcript, currentInvoice),
    output: Output.object({ schema: voiceUpdateSchema }),
    timeout: 20_000,
    ...modelSettings(model),
  })

  return { update: dropNulls(output) as VoiceUpdate, usage }
}

// The client checks `!== undefined`, so drop the nulls to keep its contract.
export function dropNulls(update: Record<string, unknown>) {
  const out: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(update)) {
    if (value === null) continue
    out[key] = value && typeof value === 'object' && !Array.isArray(value)
      ? dropNulls(value as Record<string, unknown>)
      : value
  }
  return out
}
