'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

interface SpeechRecognitionResult {
  transcript: string
  confidence: number
  isFinal: boolean
}

interface UseSpeechRecognitionOptions {
  continuous?: boolean
  interimResults?: boolean
  language?: string
  onResult?: (result: SpeechRecognitionResult) => void
  onError?: (error: string) => void
  onStart?: () => void
  onEnd?: () => void
}

interface UseSpeechRecognitionReturn {
  isListening: boolean
  isSupported: boolean
  transcript: string
  confidence: number
  error: string | null
  startListening: () => void
  stopListening: () => void
  resetTranscript: () => void
}

// Extend the Window interface for TypeScript
declare global {
  interface Window {
    SpeechRecognition: any
    webkitSpeechRecognition: any
  }
}

export function useSpeechRecognition(
  options: UseSpeechRecognitionOptions = {}
): UseSpeechRecognitionReturn {
  const {
    continuous = true,
    interimResults = true,
    language = 'en-US',
    onResult,
    onError,
    onStart,
    onEnd
  } = options

  const [isListening, setIsListening] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [confidence, setConfidence] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const finalTranscriptRef = useRef('')

  // Check browser support
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    setIsSupported(!!SpeechRecognition)
  }, [])

  // Initialize speech recognition
  const initializeRecognition = useCallback(() => {
    if (!isSupported) return null

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()

    recognition.continuous = continuous
    recognition.interimResults = interimResults
    recognition.lang = language
    recognition.maxAlternatives = 1

    recognition.onstart = () => {
      setIsListening(true)
      setError(null)
      onStart?.()
    }

    recognition.onend = () => {
      setIsListening(false)
      onEnd?.()
    }

    recognition.onerror = (event) => {
      setIsListening(false)

      let errorMessage = 'Speech recognition error'

      switch (event.error) {
        case 'no-speech':
          errorMessage = 'No speech detected. Please try again.'
          break
        case 'audio-capture':
          errorMessage = 'No microphone found. Please check your microphone settings.'
          break
        case 'not-allowed':
          errorMessage = 'Microphone access denied. Please allow microphone access.'
          break
        case 'network':
          errorMessage = 'Network error occurred. Please check your connection.'
          break
        case 'service-not-allowed':
          errorMessage = 'Speech recognition service not allowed.'
          break
        case 'bad-grammar':
          errorMessage = 'Speech recognition grammar error.'
          break
        case 'language-not-supported':
          errorMessage = 'Language not supported for speech recognition.'
          break
        default:
          errorMessage = `Speech recognition error: ${event.error}`
      }

      setError(errorMessage)
      onError?.(errorMessage)
    }

    recognition.onresult = (event) => {
      let interimTranscript = ''
      let finalTranscript = finalTranscriptRef.current

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i]
        const transcriptPart = result[0].transcript

        if (result.isFinal) {
          finalTranscript += transcriptPart + ' '
          finalTranscriptRef.current = finalTranscript
        } else {
          interimTranscript += transcriptPart
        }

        // Call the onResult callback with detailed info
        onResult?.({
          transcript: transcriptPart,
          confidence: result[0].confidence || 0,
          isFinal: result.isFinal
        })
      }

      const fullTranscript = finalTranscript + interimTranscript
      setTranscript(fullTranscript.trim())

      // Update confidence based on the last result
      if (event.results.length > 0) {
        const lastResult = event.results[event.results.length - 1]
        setConfidence(lastResult[0].confidence || 0)
      }
    }

    return recognition
  }, [isSupported, continuous, interimResults, language, onResult, onError, onStart, onEnd])

  const startListening = useCallback(() => {
    if (!isSupported) {
      setError('Speech recognition is not supported in this browser')
      return
    }

    if (isListening) return

    try {
      const recognition = initializeRecognition()
      if (recognition) {
        recognitionRef.current = recognition
        recognition.start()
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to start speech recognition'
      setError(errorMessage)
      onError?.(errorMessage)
    }
  }, [isSupported, isListening, initializeRecognition, onError])

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
      recognitionRef.current = null
    }
  }, [isListening])

  const resetTranscript = useCallback(() => {
    setTranscript('')
    setConfidence(0)
    finalTranscriptRef.current = ''
    setError(null)
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [])

  return {
    isListening,
    isSupported,
    transcript,
    confidence,
    error,
    startListening,
    stopListening,
    resetTranscript
  }
}