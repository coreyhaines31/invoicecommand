'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useSpeechRecognition } from '@/hooks/use-speech-recognition'
import { useUser } from '@/hooks/use-user'
import type { VoiceCommandResult } from '@/hooks/use-voice-commands'
import { getVoiceUsageThisMonth } from '@/lib/utils'
import { withNextPath } from '@/lib/next-path'
import {
  Mic,
  MicOff,
  Volume2,
  Loader2,
  AlertCircle,
  Send
} from 'lucide-react'

interface VoiceToggleProps {
  onVoiceCommand?: (transcript: string) => Promise<VoiceCommandResult | void>
  disabled?: boolean
}

const FAILED_MESSAGE = 'The voice command did not go through because of a network or server problem. Check your connection, then press Process to try again.'

// The server counts commands per calendar month
function formatResetDate(resetsAt?: string): string {
  const now = new Date()
  const parsed = resetsAt ? new Date(resetsAt) : null
  const date = parsed && !isNaN(parsed.getTime()) ? parsed : new Date(now.getFullYear(), now.getMonth() + 1, 1)
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })
}

function limitMessage(limit: number, resetsAt?: string): string {
  return `Your account includes ${limit} voice commands a month and you have used them all. They reset on ${formatResetDate(resetsAt)}.`
}

function describeVoiceError(result: VoiceCommandResult, limit: number): string {
  switch (result.errorKind) {
    case 'unclear':
      return 'That command was not clear enough to change the invoice. Try again and name the field and the value, for example "set the tax rate to 8 percent".'
    case 'limit':
      return limitMessage(result.limit ?? limit, result.resetsAt)
    case 'invalid':
      return /[.!?]$/.test(result.message) ? result.message : `${result.message}.`
    case 'signed-out':
      return 'You are signed out. Log in again to use voice commands.'
    default:
      return FAILED_MESSAGE
  }
}

export function VoiceToggle({ onVoiceCommand, disabled = false }: VoiceToggleProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingError, setProcessingError] = useState<string | null>(null)
  const [voiceUsage, setVoiceUsage] = useState({ used: 0, limit: 10 })

  const { user, loading: userLoading } = useUser()
  // The draft is kept in localStorage, so signup returns the visitor to the builder
  const needsAccount = !userLoading && !user

  const {
    isListening,
    isSupported,
    transcript,
    confidence,
    error: speechError,
    startListening,
    stopListening,
    resetTranscript
  } = useSpeechRecognition({
    continuous: false,
    interimResults: true,
    language: 'en-US',
    onEnd: () => {
      // Auto-process if we have a transcript when recording ends
      if (transcript.trim() && onVoiceCommand) {
        handleProcessTranscript()
      }
    }
  })

  useEffect(() => {
    if (!user) return
    const loadUsage = async () => {
      setVoiceUsage(await getVoiceUsageThisMonth())
    }
    loadUsage()
  }, [user])

  // Refreshes the counter and reports whether a command is left this month
  const checkAllowance = async () => {
    const usage = await getVoiceUsageThisMonth()
    setVoiceUsage(usage)
    if (usage.used < usage.limit) return true
    setProcessingError(limitMessage(usage.limit))
    return false
  }

  const handleStartRecording = async () => {
    if (!isSupported || !user) return

    setProcessingError(null)
    if (!(await checkAllowance())) return

    resetTranscript()
    setProcessingError(null)
    startListening()
  }

  const handleStopRecording = () => {
    stopListening()
  }

  const handleProcessTranscript = async () => {
    if (!transcript.trim() || !onVoiceCommand || !user) return

    setProcessingError(null)
    if (!(await checkAllowance())) return

    setIsProcessing(true)

    // On failure the transcript stays, so the user can see what was heard and retry
    try {
      const result = await onVoiceCommand(transcript.trim())
      if (result && !result.success) {
        setProcessingError(describeVoiceError(result, voiceUsage.limit))
      } else {
        resetTranscript()
      }
    } catch {
      setProcessingError(FAILED_MESSAGE)
    } finally {
      setIsProcessing(false)
    }
    setVoiceUsage(await getVoiceUsageThisMonth())
  }

  const handleManualSubmit = () => {
    if (transcript.trim()) {
      handleProcessTranscript()
    }
  }


  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600'
    if (confidence >= 0.6) return 'text-yellow-600'
    return 'text-red-600'
  }

  if (!isSupported) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Voice recognition is not supported in this browser. Please use Chrome, Safari, or Edge for voice features.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      {/* Voice Commands Header with Recording Button */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">Voice Commands</h3>
          <p className="text-sm text-muted-foreground">
            Use voice commands to quickly update your invoice
          </p>
        </div>
        {needsAccount ? (
          <p className="text-sm text-muted-foreground">
            Voice commands need a free account.{' '}
            <Link
              href={withNextPath('/auth/signup', '/')}
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Create a free account
            </Link>
          </p>
        ) : user ? (
          <div className="flex items-center gap-4">
            {/* Usage Counter */}
            <div className="text-sm text-muted-foreground">
              <span className="font-mono">
                {voiceUsage.used}/{voiceUsage.limit}
              </span>
              <span className="ml-1">this month</span>
            </div>

            {/* Confidence Indicator */}
            {confidence > 0 && (
              <div className="flex items-center space-x-2 text-sm">
                <Volume2 className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Confidence:</span>
                <span className={`font-mono font-medium ${getConfidenceColor(confidence)}`}>
                  {Math.round(confidence * 100)}%
                </span>
              </div>
            )}

            {/* Recording Button */}
            <Button
              onClick={isListening ? handleStopRecording : handleStartRecording}
              disabled={disabled || isProcessing}
              variant={isListening ? "destructive" : "default"}
              size="lg"
              className="min-w-[140px]"
            >
              {isListening ? (
                <>
                  <MicOff className="mr-2 h-5 w-5" />
                  Stop Recording
                </>
              ) : isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Processing
                </>
              ) : (
                <>
                  <Mic className="mr-2 h-5 w-5" />
                  Start Recording
                </>
              )}
            </Button>
          </div>
        ) : null}
      </div>

      {(speechError || processingError) && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {processingError || speechError}
          </AlertDescription>
        </Alert>
      )}

      {/* Transcript Tray - only show when transcript exists */}
      {transcript && (
        <Card className="p-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-foreground">Transcript</h4>
              <div className="flex items-center gap-2">
                {!isListening && transcript && (
                  <Button
                    onClick={handleManualSubmit}
                    disabled={isProcessing}
                    size="sm"
                    className="gap-2"
                  >
                    {isProcessing ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                    Process
                  </Button>
                )}
                <Button
                  onClick={() => {
                    resetTranscript()
                    setProcessingError(null)
                  }}
                  variant="outline"
                  size="sm"
                  disabled={isListening || isProcessing}
                >
                  Clear
                </Button>
              </div>
            </div>

            <div className="p-3 bg-muted/50 rounded-lg border-l-4 border-primary">
              <p className="text-foreground font-mono text-sm leading-relaxed">
                &quot;{transcript}&quot;
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}