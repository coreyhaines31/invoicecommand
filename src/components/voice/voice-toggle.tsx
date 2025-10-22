'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useSpeechRecognition } from '@/hooks/use-speech-recognition'
import { useUser } from '@/hooks/use-user'
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

  const handleStartRecording = () => {
    if (!isSupported) return
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
      setProcessingError(`You've reached your limit of ${voiceUsage.limit} voice commands this month. ${user ? 'Upgrade for unlimited usage!' : 'Create a free account for more commands!'}`)
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
            disabled={disabled || isProcessing || (!isListening && voiceUsage.used >= voiceUsage.limit)}
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
      </div>

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
                  onClick={resetTranscript}
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
                "{transcript}"
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Error Display */}
      {(speechError || processingError) && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {speechError || processingError}
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}