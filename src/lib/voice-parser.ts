// Prompt and model call for /api/parse-voice. Shared with scripts/eval-voice.mjs,
// which imports this file directly with Node's type stripping, so keep it free
// of path aliases and runtime imports.
import type OpenAI from 'openai'

export const VOICE_MODEL = 'gpt-4o-mini'

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
- If the command is unclear or ambiguous, return an error
- Only make changes that are explicitly requested
- Preserve existing data unless specifically asked to change it

Return ONLY valid JSON with no additional text.`
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

// Returns the model's raw message content, or null when it sent none.
export async function requestVoiceUpdate(
  client: OpenAI,
  { transcript, currentInvoice, now, model = VOICE_MODEL }: VoiceRequest
): Promise<string | null> {
  const completion = await client.chat.completions.create({
    model,
    messages: [
      { role: 'system', content: buildSystemPrompt(now) },
      { role: 'user', content: buildUserPrompt(transcript, currentInvoice) },
    ],
    temperature: 0.1,
    max_tokens: 500,
  })

  return completion.choices[0]?.message?.content ?? null
}
