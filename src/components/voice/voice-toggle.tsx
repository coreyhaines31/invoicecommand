'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useSpeechRecognition } from '@/hooks/use-speech-recognition'
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
  const [isVoiceMode, setIsVoiceMode] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingError, setProcessingError] = useState<string | null>(null)

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

  const handleVoiceModeToggle = (enabled: boolean) => {
    setIsVoiceMode(enabled)
    if (!enabled && isListening) {
      stopListening()
    }
    resetTranscript()
    setProcessingError(null)
  }

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

    setIsProcessing(true)
    setProcessingError(null)

    try {
      await onVoiceCommand(transcript.trim())
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

  const getRecordingStatus = () => {
    if (isProcessing) return { text: 'Processing...', variant: 'secondary' as const }
    if (isListening) return { text: 'Listening...', variant: 'default' as const }
    if (transcript) return { text: 'Ready to Send', variant: 'default' as const }
    return { text: 'Ready', variant: 'outline' as const }
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
    <Card className="border-border bg-card">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-foreground">Voice Mode</CardTitle>
          <div className="flex items-center space-x-2">
            <Label htmlFor="voice-mode" className="text-sm text-muted-foreground">
              {isVoiceMode ? 'ON' : 'OFF'}
            </Label>
            <Switch
              id="voice-mode"
              checked={isVoiceMode}
              onCheckedChange={handleVoiceModeToggle}
              disabled={disabled}
            />
          </div>
        </div>
      </CardHeader>

      {isVoiceMode && (
        <CardContent className="space-y-4">
          {/* Recording Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                onClick={isListening ? handleStopRecording : handleStartRecording}
                disabled={disabled || isProcessing}
                variant={isListening ? "destructive" : "default"}
                size="sm"
                className="min-w-[100px]"
              >
                {isListening ? (
                  <>
                    <MicOff className="mr-2 h-4 w-4" />
                    Stop
                  </>
                ) : (
                  <>
                    <Mic className="mr-2 h-4 w-4" />
                    Record
                  </>
                )}
              </Button>

              <Badge variant={getRecordingStatus().variant}>
                {isProcessing && <Loader2 className="mr-1 h-3 w-3 animate-spin" />}
                {getRecordingStatus().text}
              </Badge>
            </div>

            {confidence > 0 && (
              <div className="flex items-center space-x-2">
                <Volume2 className="h-4 w-4 text-muted-foreground" />
                <span className={`text-sm font-mono ${getConfidenceColor(confidence)}`}>
                  {Math.round(confidence * 100)}%
                </span>
              </div>
            )}
          </div>

          {/* Transcript Display */}
          {transcript && (
            <div className="space-y-3">
              <div className="p-3 bg-muted rounded-lg border">
                <div className="flex items-start justify-between mb-2">
                  <span className="text-sm font-medium text-muted-foreground">Transcript:</span>
                  {!isListening && transcript && (
                    <Button
                      onClick={handleManualSubmit}
                      disabled={isProcessing}
                      size="sm"
                      variant="outline"
                      className="ml-2"
                    >
                      {isProcessing ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <>
                          <Send className="mr-1 h-3 w-3" />
                          Process
                        </>
                      )}
                    </Button>
                  )}
                </div>
                <p className="text-sm text-foreground font-mono">
                  "{transcript}"
                </p>
              </div>

              <Button
                onClick={resetTranscript}
                variant="ghost"
                size="sm"
                disabled={isListening || isProcessing}
                className="w-full"
              >
                Clear Transcript
              </Button>
            </div>
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

          {/* Instructions */}
          <div className="text-sm text-muted-foreground space-y-1">
            <p><strong>Voice Commands:</strong></p>
            <ul className="text-xs space-y-1 ml-4">
              <li>• "Add $200 design fee to John"</li>
              <li>• "Set tax rate to 8.5 percent"</li>
              <li>• "Change client name to ABC Company"</li>
              <li>• "Set due date to January 15th"</li>
              <li>• "Add 5 hours of consulting at $150 per hour"</li>
            </ul>
          </div>
        </CardContent>
      )}
    </Card>
  )
}