/**
 * @jest-environment node
 *
 * The model client is a stub: these tests check the request shape, never call a model.
 */
import type OpenAI from 'openai'
import { VOICE_MODEL, buildSystemPrompt, dropNulls, requestVoiceUpdate } from '@/lib/voice-parser'

function stubClient(content: string) {
  const create = jest.fn().mockResolvedValue({
    choices: [{ message: { content }, finish_reason: 'stop' }],
    usage: { prompt_tokens: 10, completion_tokens: 5, total_tokens: 15 },
  })
  return { client: { chat: { completions: { create } } } as unknown as OpenAI, create }
}

const now = new Date('2026-11-18T12:00:00Z')

describe('requestVoiceUpdate', () => {
  it('defaults to gpt-4o-mini with the original call', async () => {
    const { client, create } = stubClient('{"action":"update_field"}')

    const reply = await requestVoiceUpdate(client, { transcript: 'Set tax to 8 percent', currentInvoice: {}, now })

    const params = create.mock.calls[0][0]
    expect(VOICE_MODEL).toBe('gpt-4o-mini')
    expect(params.model).toBe('gpt-4o-mini')
    expect(params.temperature).toBe(0.1)
    expect(params.max_tokens).toBe(500)
    expect(params.response_format).toBeUndefined()
    expect(params.messages[0].content).toContain('Return ONLY valid JSON')
    expect(reply.content).toBe('{"action":"update_field"}')
  })

  it('sends newer models a JSON schema, max_completion_tokens and no temperature', async () => {
    const { client, create } = stubClient('{}')

    await requestVoiceUpdate(client, { transcript: 'Set tax to 8 percent', currentInvoice: {}, now, model: 'gpt-6-luna' })

    const params = create.mock.calls[0][0]
    expect(params.model).toBe('gpt-6-luna')
    expect(params.temperature).toBeUndefined()
    expect(params.max_tokens).toBeUndefined()
    expect(params.max_completion_tokens).toBeGreaterThan(0)
    expect(params.response_format.type).toBe('json_schema')
    expect(params.response_format.json_schema.strict).toBe(true)
    expect(params.messages[0].content).not.toContain('Return ONLY valid JSON')
  })
})

describe('buildSystemPrompt', () => {
  it('describes the error action only when a schema enforces the shape', () => {
    expect(buildSystemPrompt(now, { structured: true })).toContain('return the "error" action')
    expect(buildSystemPrompt(now)).not.toContain('"error" action')
  })
})

describe('dropNulls', () => {
  it('removes null keys, including inside item, so the client sees absent fields', () => {
    expect(
      dropNulls({ action: 'update_item', field: null, value: null, itemIndex: 1, item: { description: null, quantity: 6, price: null }, explanation: 'x' })
    ).toEqual({ action: 'update_item', itemIndex: 1, item: { quantity: 6 }, explanation: 'x' })
  })
})
