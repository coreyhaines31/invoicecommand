/**
 * @jest-environment node
 *
 * The AI SDK is mocked: these tests check the request shape, never call a model.
 */
const mockGenerateText = jest.fn()

jest.mock('ai', () => ({
  generateText: (...args: unknown[]) => mockGenerateText(...args),
  Output: { object: (options: unknown) => ({ kind: 'object', options }) },
}))

import { DEFAULT_VOICE_MODEL, buildSystemPrompt, dropNulls, requestVoiceUpdate, voiceUpdateSchema } from '@/lib/voice-parser'

const now = new Date('2026-11-18T12:00:00Z')

beforeEach(() => {
  delete process.env.VOICE_MODEL
  mockGenerateText.mockReset()
  mockGenerateText.mockResolvedValue({
    output: { action: 'update_field', field: 'taxRate', value: 8, itemIndex: null, item: null, explanation: 'Set tax' },
    usage: { inputTokens: 10, outputTokens: 5 },
  })
})

describe('requestVoiceUpdate', () => {
  it('calls gpt-4o-mini with its original temperature and token cap', async () => {
    const reply = await requestVoiceUpdate({ transcript: 'Set tax to 8 percent', currentInvoice: {}, now, model: 'openai/gpt-4o-mini' })

    const params = mockGenerateText.mock.calls[0][0]
    expect(params.model).toBe('openai/gpt-4o-mini')
    expect(params.temperature).toBe(0.1)
    expect(params.maxOutputTokens).toBe(500)
    expect(params.output.options.schema).toBe(voiceUpdateSchema)
    expect(reply.update).toEqual({ action: 'update_field', field: 'taxRate', value: 8, explanation: 'Set tax' })
  })

  it('gives reasoning models low effort, room for reasoning tokens and no temperature', async () => {
    await requestVoiceUpdate({ transcript: 'Set tax to 8 percent', currentInvoice: {}, now, model: 'openai/gpt-6-luna' })

    const params = mockGenerateText.mock.calls[0][0]
    expect(params.temperature).toBeUndefined()
    expect(params.reasoning).toBe('low')
    expect(params.maxOutputTokens).toBe(2000)
  })

  it('uses VOICE_MODEL over the default', async () => {
    process.env.VOICE_MODEL = 'openai/some-other-model'

    await requestVoiceUpdate({ transcript: 'Set tax to 8 percent', currentInvoice: {}, now })

    expect(mockGenerateText.mock.calls[0][0].model).toBe('openai/some-other-model')
    expect(DEFAULT_VOICE_MODEL).not.toBe('openai/some-other-model')
  })
})

describe('voiceUpdateSchema', () => {
  it('rejects actions and fields the client does not know', () => {
    const base = { action: 'update_field', field: 'taxRate', value: 8, itemIndex: null, item: null, explanation: 'x' }
    expect(voiceUpdateSchema.safeParse(base).success).toBe(true)
    expect(voiceUpdateSchema.safeParse({ ...base, action: 'delete_invoice' }).success).toBe(false)
    expect(voiceUpdateSchema.safeParse({ ...base, field: 'paid' }).success).toBe(false)
  })
})

describe('buildSystemPrompt', () => {
  it('names the error action for unclear commands', () => {
    expect(buildSystemPrompt(now)).toContain('return the "error" action')
  })
})

describe('dropNulls', () => {
  it('removes null keys, including inside item, so the client sees absent fields', () => {
    expect(
      dropNulls({ action: 'update_item', field: null, value: null, itemIndex: 1, item: { description: null, quantity: 6, price: null }, explanation: 'x' })
    ).toEqual({ action: 'update_item', itemIndex: 1, item: { quantity: 6 }, explanation: 'x' })
  })
})
