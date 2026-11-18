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

const mockTriggerUpgrade = jest.fn()
jest.mock('@/hooks/use-upgrade-triggers', () => ({
  useUpgradeTriggers: () => ({ triggerUpgrade: mockTriggerUpgrade }),
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
