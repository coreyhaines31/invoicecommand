// Prompt and model call for /api/parse-voice. Shared with scripts/eval-voice.mjs,
// which imports this file directly with Node's type stripping, so keep it free
// of path aliases and runtime imports.
import type OpenAI from 'openai'

export const VOICE_MODEL = 'gpt-4o-mini'

// gpt-4o models get the original call: prose asks for JSON, with temperature
// and max_tokens. Newer models are reasoning models: they get a JSON schema,
// max_completion_tokens (which also counts reasoning tokens) and no temperature.
export function usesStructuredOutput(model: string) {
  return !model.startsWith('gpt-4o')
}

const FIELDS = [
  'senderName', 'senderEmail', 'senderAddress', 'senderCity', 'senderState', 'senderZip', 'senderPhone',
  'clientName', 'clientEmail', 'clientAddress', 'clientCity', 'clientState', 'clientZip',
  'invoiceNumber', 'invoiceDate', 'dueDate', 'notes', 'terms', 'taxRate', 'discountRate',
]

// Mirrors the update shape the client applies. Strict mode needs every key
// present, so optional keys are nullable and nulls are dropped afterwards.
export const VOICE_UPDATE_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['action', 'field', 'value', 'itemIndex', 'item', 'explanation'],
  properties: {
    action: { type: 'string', enum: ['update_field', 'add_item', 'update_item', 'remove_item', 'error'] },
    field: { type: ['string', 'null'], enum: [...FIELDS, null] },
    value: { type: ['string', 'number', 'null'] },
    itemIndex: { type: ['integer', 'null'] },
    item: {
      type: ['object', 'null'],
      additionalProperties: false,
      required: ['description', 'quantity', 'price'],
      properties: {
        description: { type: ['string', 'null'] },
        quantity: { type: ['number', 'null'] },
        price: { type: ['number', 'null'] },
      },
    },
    explanation: { type: 'string' },
  },
}

// Dates are the server's UTC date; the client does not send its local date.
export function buildSystemPrompt(now: Date, { structured = false } = {}) {
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
- If the command is unclear or ambiguous, ${structured ? 'return the "error" action with an explanation of what is unclear' : 'return an error'}
- Only make changes that are explicitly requested
- Preserve existing data unless specifically asked to change it${structured ? '' : '\n\nReturn ONLY valid JSON with no additional text.'}`
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

export type VoiceReply = {
  content: string | null
  finishReason: string | null
  usage: OpenAI.CompletionUsage | null
}

export async function requestVoiceUpdate(
  client: OpenAI,
  { transcript, currentInvoice, now, model = VOICE_MODEL }: VoiceRequest
): Promise<VoiceReply> {
  const structured = usesStructuredOutput(model)
  const messages: OpenAI.ChatCompletionMessageParam[] = [
    { role: 'system', content: buildSystemPrompt(now, { structured }) },
    { role: 'user', content: buildUserPrompt(transcript, currentInvoice) },
  ]

  const completion = structured
    ? await client.chat.completions.create({
        model,
        messages,
        response_format: {
          type: 'json_schema',
          json_schema: { name: 'invoice_update', strict: true, schema: VOICE_UPDATE_SCHEMA },
        },
        reasoning_effort: 'low',
        max_completion_tokens: 2000,
      })
    : await client.chat.completions.create({
        model,
        messages,
        temperature: 0.1,
        max_tokens: 500,
      })

  const choice = completion.choices[0]
  return {
    content: choice?.message?.content ?? null,
    finishReason: choice?.finish_reason ?? null,
    usage: completion.usage ?? null,
  }
}

// Structured replies carry every key, with null for the ones that do not apply.
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
