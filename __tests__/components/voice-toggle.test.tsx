import type React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { VoiceToggle } from '@/components/voice/voice-toggle'

jest.mock('next/link', () => {
  function MockLink({ children, href, className }: { children: React.ReactNode; href: string; className?: string }) {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    )
  }
  return MockLink
})

let mockUser: { id: string } | null = null
let mockUserLoading = false
jest.mock('@/hooks/use-user', () => ({
  useUser: () => ({ user: mockUser, loading: mockUserLoading, isAuthenticated: !!mockUser }),
}))

const mockStartListening = jest.fn()
const mockResetTranscript = jest.fn()
let mockSpeech = {
  isListening: false,
  isSupported: true,
  transcript: '',
  confidence: 0,
  error: null as string | null,
}
jest.mock('@/hooks/use-speech-recognition', () => ({
  useSpeechRecognition: () => ({
    ...mockSpeech,
    startListening: mockStartListening,
    stopListening: jest.fn(),
    resetTranscript: mockResetTranscript,
  }),
}))

global.fetch = jest.fn()

beforeEach(() => {
  jest.clearAllMocks()
  mockUser = null
  mockUserLoading = false
  mockSpeech = { isListening: false, isSupported: true, transcript: '', confidence: 0, error: null }
  ;(global.fetch as jest.Mock).mockResolvedValue({ ok: true, json: async () => ({ used: 2, limit: 10 }) })
})

describe('VoiceToggle for anonymous visitors', () => {
  it('says voice needs a free account and links to signup with a return path', () => {
    render(<VoiceToggle onVoiceCommand={jest.fn()} />)

    expect(screen.getByText(/Voice commands need a free account/)).toBeInTheDocument()
    const link = screen.getByRole('link', { name: 'Create a free account' })
    expect(link).toHaveAttribute('href', '/auth/signup?next=%2F')
  })

  it('does not offer the microphone or a usage counter', () => {
    render(<VoiceToggle onVoiceCommand={jest.fn()} />)

    expect(screen.queryByRole('button', { name: /Start Recording/ })).not.toBeInTheDocument()
    expect(screen.queryByText('this month')).not.toBeInTheDocument()
    expect(mockStartListening).not.toHaveBeenCalled()
    expect(global.fetch).not.toHaveBeenCalled()
  })

  it('shows neither the signup line nor the button while the session loads', () => {
    mockUserLoading = true
    render(<VoiceToggle onVoiceCommand={jest.fn()} />)

    expect(screen.queryByText(/Voice commands need a free account/)).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Start Recording/ })).not.toBeInTheDocument()
  })
})

describe('VoiceToggle for signed-in users', () => {
  beforeEach(() => {
    mockUser = { id: 'user-1' }
  })

  it('shows the server usage counter and starts recording', async () => {
    render(<VoiceToggle onVoiceCommand={jest.fn()} />)

    expect(await screen.findByText('2/10')).toBeInTheDocument()
    expect(screen.queryByText(/Voice commands need a free account/)).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /Start Recording/ }))
    await waitFor(() => expect(mockStartListening).toHaveBeenCalled())
  })
})

describe('VoiceToggle errors for signed-in users', () => {
  beforeEach(() => {
    mockUser = { id: 'user-1' }
    mockSpeech = { ...mockSpeech, transcript: 'set tax to eight' }
  })

  async function processWith(result: unknown) {
    const onVoiceCommand = jest.fn().mockResolvedValue(result)
    render(<VoiceToggle onVoiceCommand={onVoiceCommand} />)
    await screen.findByText('2/10')
    fireEvent.click(screen.getByRole('button', { name: /Process/ }))
    await waitFor(() => expect(onVoiceCommand).toHaveBeenCalledWith('set tax to eight'))
    return screen.findByRole('alert')
  }

  it('says when the command was not clear and keeps the transcript', async () => {
    const alert = await processWith({ success: false, message: 'x', errorKind: 'unclear' })
    expect(alert).toHaveTextContent('That command was not clear enough to change the invoice.')
    expect(screen.getByText(/set tax to eight/)).toBeInTheDocument()
    expect(mockResetTranscript).not.toHaveBeenCalled()
  })

  it('says how many commands are included and when they reset on a 429', async () => {
    const alert = await processWith({ success: false, message: 'x', errorKind: 'limit' })
    const now = new Date()
    const reset = new Date(now.getFullYear(), now.getMonth() + 1, 1).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })
    expect(alert).toHaveTextContent(`Your account includes 10 voice commands a month and you have used them all. They reset on ${reset}.`)
  })

  it('uses the limit and reset date from the route when given', async () => {
    const alert = await processWith({ success: false, message: 'x', errorKind: 'limit', limit: 25, resetsAt: '2027-01-01T12:00:00Z' })
    expect(alert).toHaveTextContent('includes 25 voice commands a month')
    expect(alert).toHaveTextContent('They reset on January 1.')
  })

  it('suggests a retry on a network or server failure', async () => {
    const alert = await processWith({ success: false, message: 'x', errorKind: 'failed' })
    expect(alert).toHaveTextContent('network or server problem')
    expect(alert).toHaveTextContent('press Process to try again')
    expect(screen.getByRole('button', { name: /Process/ })).toBeInTheDocument()
  })

  it('suggests a retry when the command handler throws', async () => {
    const onVoiceCommand = jest.fn().mockRejectedValue(new Error('boom'))
    render(<VoiceToggle onVoiceCommand={onVoiceCommand} />)
    await screen.findByText('2/10')
    fireEvent.click(screen.getByRole('button', { name: /Process/ }))
    expect(await screen.findByRole('alert')).toHaveTextContent('press Process to try again')
  })

  it('clears the transcript after a successful command', async () => {
    const onVoiceCommand = jest.fn().mockResolvedValue({ success: true, message: 'ok' })
    render(<VoiceToggle onVoiceCommand={onVoiceCommand} />)
    await screen.findByText('2/10')
    fireEvent.click(screen.getByRole('button', { name: /Process/ }))
    await waitFor(() => expect(mockResetTranscript).toHaveBeenCalled())
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('shows the limit inline before recording when none are left', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValue({ ok: true, json: async () => ({ used: 10, limit: 10 }) })
    mockSpeech = { ...mockSpeech, transcript: '' }
    render(<VoiceToggle onVoiceCommand={jest.fn()} />)
    await screen.findByText('10/10')
    fireEvent.click(screen.getByRole('button', { name: /Start Recording/ }))
    expect(await screen.findByRole('alert')).toHaveTextContent('you have used them all')
    expect(mockStartListening).not.toHaveBeenCalled()
  })
})
