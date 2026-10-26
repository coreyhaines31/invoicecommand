/**
 * initPostHog must pass options posthog-js actually understands: the old
 * snake_case session_recording block was silently ignored, so recording
 * stayed on in development.
 */

import posthog from 'posthog-js'
import { initPostHog } from '@/lib/posthog'

jest.mock('posthog-js', () => ({
  __esModule: true,
  default: {
    init: jest.fn(),
    register: jest.fn(),
    capture: jest.fn(),
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
})
