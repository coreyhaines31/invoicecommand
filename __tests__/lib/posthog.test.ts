/**
 * initPostHog must pass options posthog-js actually understands: the old
 * snake_case session_recording block was silently ignored, so recording
 * stayed on in development.
 */

import posthog from 'posthog-js'
import { initPostHog, syncSessionRecordingForPath } from '@/lib/posthog'

jest.mock('posthog-js', () => ({
  __esModule: true,
  default: {
    init: jest.fn(),
    register: jest.fn(),
    capture: jest.fn(),
    stopSessionRecording: jest.fn(),
    startSessionRecording: jest.fn(),
    __loaded: true,
  },
}))

const mockedPostHog = jest.mocked(posthog)

describe('initPostHog', () => {
  const originalEnv = process.env

  beforeEach(() => {
    jest.clearAllMocks()
    process.env = { ...originalEnv, NEXT_PUBLIC_POSTHOG_KEY: 'phc_test' }
  })

  afterEach(() => {
    process.env = originalEnv
  })

  function initOptions() {
    initPostHog()
    expect(mockedPostHog.init).toHaveBeenCalledTimes(1)
    return mockedPostHog.init.mock.calls[0][1]
  }

  it('disables session recording in development', () => {
    jest.replaceProperty(process.env, 'NODE_ENV', 'development')

    expect(initOptions()).toMatchObject({
      disable_session_recording: true,
      enable_recording_console_log: true,
    })
  })

  it('leaves session recording enabled in production', () => {
    jest.replaceProperty(process.env, 'NODE_ENV', 'production')

    expect(initOptions()).toMatchObject({
      disable_session_recording: false,
      enable_recording_console_log: false,
    })
  })

  it('masks inputs and sensitive elements in recordings', () => {
    const options = initOptions()

    expect(options?.session_recording).toMatchObject({
      maskAllInputs: true,
      maskTextSelector: expect.stringContaining('[data-sensitive]'),
      blockSelector: expect.stringContaining('[data-private]'),
    })
  })

  it('registers environment and app version on every event', () => {
    jest.replaceProperty(process.env, 'NODE_ENV', 'production')
    initPostHog()

    expect(mockedPostHog.register).toHaveBeenCalledWith(
      expect.objectContaining({ environment: 'production', app_version: expect.any(String) })
    )
  })

  it('does nothing without an API key', () => {
    delete process.env.NEXT_PUBLIC_POSTHOG_KEY
    initPostHog()

    expect(mockedPostHog.init).not.toHaveBeenCalled()
  })

  it('redacts share tokens in before_send', () => {
    const before_send = initOptions()?.before_send as (e: unknown) => { properties: Record<string, unknown> }
    const token = 'Ab3_dEf-GhIjKlMnOpQrStUvWxYz0123'

    const result = before_send({
      event: '$pageview',
      properties: { $current_url: `https://invoicecommand.com/i/${token}`, $pathname: `/i/${token}` },
    })

    expect(JSON.stringify(result)).not.toContain(token)
  })

  it('starts with session recording disabled on a share page', () => {
    jest.replaceProperty(process.env, 'NODE_ENV', 'production')
    window.history.pushState({}, '', '/i/Ab3_dEf-GhIjKlMnOpQrStUvWxYz0123')

    expect(initOptions()).toMatchObject({ disable_session_recording: true })

    window.history.pushState({}, '', '/')
  })

  it('masks the builder preview in recordings', () => {
    expect(initOptions()?.session_recording?.maskTextSelector).toContain('[data-exclude]')
  })
})

describe('syncSessionRecordingForPath', () => {
  const originalEnv = process.env

  beforeEach(() => {
    jest.clearAllMocks()
    process.env = { ...originalEnv, NEXT_PUBLIC_POSTHOG_KEY: 'phc_test' }
    jest.replaceProperty(process.env, 'NODE_ENV', 'production')
    window.history.pushState({}, '', '/')
    initPostHog()
  })

  afterEach(() => {
    process.env = originalEnv
  })

  it('stops recording on share and invoice pages and resumes after', () => {
    syncSessionRecordingForPath('/i/Ab3_dEf-GhIjKlMnOpQrStUvWxYz0123')
    syncSessionRecordingForPath('/invoice/abc')
    expect(mockedPostHog.stopSessionRecording).toHaveBeenCalledTimes(1)
    expect(mockedPostHog.startSessionRecording).not.toHaveBeenCalled()

    syncSessionRecordingForPath('/dashboard')
    expect(mockedPostHog.startSessionRecording).toHaveBeenCalledTimes(1)
  })

  it('does not touch recording on public pages', () => {
    syncSessionRecordingForPath('/')
    syncSessionRecordingForPath('/blog/how-to-invoice')
    expect(mockedPostHog.stopSessionRecording).not.toHaveBeenCalled()
    expect(mockedPostHog.startSessionRecording).not.toHaveBeenCalled()
  })

  it('never starts recording in development', () => {
    jest.replaceProperty(process.env, 'NODE_ENV', 'development')
    initPostHog()
    syncSessionRecordingForPath('/i/Ab3_dEf-GhIjKlMnOpQrStUvWxYz0123')
    syncSessionRecordingForPath('/')
    expect(mockedPostHog.startSessionRecording).not.toHaveBeenCalled()
  })
})
