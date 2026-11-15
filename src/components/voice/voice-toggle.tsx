'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useSpeechRecognition } from '@/hooks/use-speech-recognition'
import { useUser } from '@/hooks/use-user'
import { useUpgradeTriggers } from '@/hooks/use-upgrade-triggers'
import { useUserTier } from '@/hooks/use-user-tier'
import { getVoiceUsageThisMonth, incrementVoiceUsage, canUseVoiceCommand } from '@/lib/utils'
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Loader2,
  AlertCircle,
  CheckCircle,
  Send
} from 'lucide-react'

interface VoiceToggleProps {
  onVoiceCommand?: (transcript: string) => Promise<void>
  disabled?: boolean
}

export function VoiceToggle({ onVoiceCommand, disabled = false }: VoiceToggleProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingError, setProcessingError] = useState<string | null>(null)
  const [voiceUsage, setVoiceUsage] = useState({ used: 0, limit: 10 })

  const { user } = useUser()
  const { triggerUpgrade } = useUpgradeTriggers()
  const { tier, isAnonymous } = useUserTier()

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

  // Load voice usage on component mount and when user changes
  useEffect(() => {
    const loadUsage = async () => {
      const usage = await getVoiceUsageThisMonth(user?.id)
      setVoiceUsage(usage)
    }
    loadUsage()
  }, [user])

  const handleStartRecording = async () => {
    if (!isSupported) return

    // Check if user has reached their voice command limit before starting recording
    const canUse = await canUseVoiceCommand(user?.id)
    if (!canUse) {
      // Trigger appropriate upgrade based on user tier
      if (isAnonymous) {
        triggerUpgrade('voice-limit-anonymous')
      } else {
        triggerUpgrade('voice-limit-free')
      }
      return
    }

    resetTranscript()
    setProcessingError(null)
    startListening()
  }

  const handleStopRecording = () => {
    stopListening()
  }

  const handleProcessTranscript = async () => {
    if (!transcript.trim() || !onVoiceCommand) return

    // Check if user has reached their voice command limit
    const canUse = await canUseVoiceCommand(user?.id)
    if (!canUse) {
      // Trigger appropriate upgrade based on user tier
      if (isAnonymous) {
        triggerUpgrade('voice-limit-anonymous')
      } else {
        triggerUpgrade('voice-limit-free')
      }
      return
    }

    setIsProcessing(true)
    setProcessingError(null)

    try {
      await onVoiceCommand(transcript.trim())

      // Increment voice usage and update local state
      const success = await incrementVoiceUsage(user?.id)
      if (success) {
        const updatedUsage = await getVoiceUsageThisMonth(user?.id)
        setVoiceUsage(updatedUsage)
      }

      resetTranscript()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to process voice command'
      setProcessingError(errorMessage)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleManualSubmit = () => {
    if (transcript.trim()) {
      handleProcessTranscript()
    }
  }


  const voiceState = isListening ? 'listening' : isProcessing ? 'processing' : 'idle'

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600'
    if (confidence >= 0.6) return 'text-yellow-600'
    return 'text-red-600'
  }

  if (!isSupported) {
    return (
      <Alert>
        <AlertCircle aria-hidden="true" className="h-4 w-4" />
        <AlertDescription>
          Voice commands need Chrome, Safari, or Edge. You can still fill in everything by typing.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      {/* Voice Commands Header with Recording Button */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1 min-w-0">
          <h3 className="text-lg font-semibold">Voice Commands</h3>
          {/* Contextual guidance that follows the recording state */}
          <p key={voiceState} className="page-enter text-sm text-muted-foreground">
            {voiceState === 'listening'
              ? 'Listening. Speak your changes, then stop recording.'
              : voiceState === 'processing'
                ? 'Updating your invoice from what you said.'
                : 'Say something like “Add 5 hours of consulting at $150 per hour.”'}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 sm:flex-nowrap sm:gap-4">
          {/* Usage Counter */}
          <div className="text-sm text-muted-foreground whitespace-nowrap" title="Voice commands used this month">
            <span className="font-mono tabular-nums">
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
            className="min-w-[140px] max-sm:h-11 max-sm:flex-1"
          >
            {isListening ? (
              <>
                {/* Live indicator: a dot that pings while the mic is open */}
                <span aria-hidden="true" className="relative mr-1 flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-white/70 motion-safe:animate-ping" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-white" />
                </span>
                <MicOff aria-hidden="true" className="mr-2 h-5 w-5" />
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
        <p className="sr-only" role="status" aria-live="polite">
          {voiceState === 'listening' ? 'Recording started' : voiceState === 'processing' ? 'Processing voice command' : ''}
        </p>
      </div>

      {/* Transcript Tray - only show when transcript exists */}
      {transcript && (
        <Card className="motion-enter p-4">
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
                  onClick={resetTranscript}
                  variant="outline"
                  size="sm"
                  disabled={isListening || isProcessing}
                >
                  Clear
                </Button>
              </div>
            </div>

            <div className="p-3 bg-muted/50 rounded-lg border border-border">
              <p className="text-foreground font-mono text-sm leading-relaxed">
                &quot;{transcript}&quot;
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Error Display */}
      {(speechError || processingError) && (
        <Alert variant="destructive" className="motion-enter">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {speechError || processingError}
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}