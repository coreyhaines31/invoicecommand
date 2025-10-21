import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

// Initialize OpenAI client conditionally
let openai: OpenAI | null = null

function getOpenAIClient() {
  if (!openai && process.env.OPENAI_API_KEY) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    })
  }
  return openai
}

interface VoiceParseRequest {
  transcript: string
  currentInvoice: {
    senderName: string
    senderEmail: string
    senderAddress: string
    senderCity: string
    senderState: string
    senderZip: string
    senderPhone: string
    clientName: string
    clientEmail: string
    clientAddress: string
    clientCity: string
    clientState: string
    clientZip: string
    invoiceNumber: string
    invoiceDate: string
    dueDate: string
    items: Array<{
      description: string
      quantity: number
      price: number
    }>
    taxRate: number
    discountRate: number
    notes: string
    terms: string
  }
}

interface InvoiceUpdate {
  field?: string
  value?: string | number | boolean
  action?: 'add_item' | 'update_item' | 'remove_item' | 'update_field'
  itemIndex?: number
  item?: {
    description: string
    quantity: number
    price: number
  }
  explanation?: string
}

const SYSTEM_PROMPT = `You are an AI assistant that converts natural language voice commands into structured invoice updates for Invoice Command, a professional invoicing application.

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
- Convert natural language dates to YYYY-MM-DD format
- "January 15th" → "2024-01-15" (current year)
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
  "value": "2024-01-15",
  "explanation": "Set due date to January 15, 2024"
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

export async function POST(request: NextRequest) {
  try {
    const body: VoiceParseRequest = await request.json()
    const { transcript, currentInvoice } = body

    // Input validation and sanitization
    if (!transcript?.trim()) {
      return NextResponse.json(
        { error: 'Transcript is required' },
        { status: 400 }
      )
    }

    // Basic input sanitization
    const sanitizedTranscript = transcript
      .trim()
      .slice(0, 1000) // Limit length
      .replace(/[<>]/g, '') // Remove potential HTML/XML tags

    if (sanitizedTranscript.length < 2) {
      return NextResponse.json(
        { error: 'Transcript too short' },
        { status: 400 }
      )
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      )
    }

    // Create the user prompt with current invoice context
    const userPrompt = `Current Invoice Data:
${JSON.stringify(currentInvoice, null, 2)}

Voice Command: "${sanitizedTranscript}"

Parse this voice command and return the appropriate invoice update as JSON. Be precise and only make changes that are clearly requested.`

    // Get OpenAI client
    const client = getOpenAIClient()
    if (!client) {
      return NextResponse.json(
        { error: 'OpenAI client not available' },
        { status: 500 }
      )
    }

    // Call OpenAI API
    const completion = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: SYSTEM_PROMPT
        },
        {
          role: 'user',
          content: userPrompt
        }
      ],
      temperature: 0.1, // Low temperature for consistency
      max_tokens: 500,
    })

    const response = completion.choices[0]?.message?.content

    if (!response) {
      return NextResponse.json(
        { error: 'No response from AI' },
        { status: 500 }
      )
    }

    // Try to parse the JSON response
    let parsedUpdate: InvoiceUpdate
    try {
      parsedUpdate = JSON.parse(response)
    } catch {
      console.error('Failed to parse AI response:', response)
      return NextResponse.json(
        { error: 'Invalid response format from AI' },
        { status: 500 }
      )
    }

    // Validate the response structure
    if (!parsedUpdate.action) {
      return NextResponse.json(
        { error: 'AI response missing required action field' },
        { status: 500 }
      )
    }

    // Return the structured update
    return NextResponse.json({
      success: true,
      update: parsedUpdate,
      originalTranscript: sanitizedTranscript
    })

  } catch (error) {
    console.error('Voice parsing error:', error)

    if (error instanceof Error && error.message.includes('API key')) {
      return NextResponse.json(
        { error: 'OpenAI API configuration error' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to process voice command' },
      { status: 500 }
    )
  }
}