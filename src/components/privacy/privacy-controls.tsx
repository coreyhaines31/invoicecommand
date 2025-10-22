'use client'

import { useState, useEffect } from 'react'
import { posthog, optOutOfRecording, optInToRecording } from '@/lib/posthog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'

interface PrivacyPreferences {
  analytics: boolean
  sessionRecording: boolean
  errorTracking: boolean
  hasConsented: boolean
}

const PRIVACY_STORAGE_KEY = 'invoicecommand-privacy-preferences'

export function PrivacyControls() {
  const [preferences, setPreferences] = useState<PrivacyPreferences>({
    analytics: true,
    sessionRecording: false,
    errorTracking: true,
    hasConsented: false,
  })

  const [showBanner, setShowBanner] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load saved preferences
    const saved = localStorage.getItem(PRIVACY_STORAGE_KEY)
    if (saved) {
      try {
        const parsedPreferences = JSON.parse(saved)
        setPreferences(parsedPreferences)
        if (!parsedPreferences.hasConsented) {
          setShowBanner(true)
        }
      } catch (error) {
        console.error('Failed to parse privacy preferences:', error)
        setShowBanner(true)
      }
    } else {
      setShowBanner(true)
    }
    setIsLoading(false)
  }, [])

  const savePreferences = (newPreferences: PrivacyPreferences) => {
    setPreferences(newPreferences)
    localStorage.setItem(PRIVACY_STORAGE_KEY, JSON.stringify(newPreferences))

    // Apply preferences to PostHog
    if (newPreferences.analytics) {
      optInToRecording()
    } else {
      optOutOfRecording()
    }

    // Set PostHog properties based on preferences
    posthog.register({
      privacy_analytics_enabled: newPreferences.analytics,
      privacy_session_recording_enabled: newPreferences.sessionRecording,
      privacy_error_tracking_enabled: newPreferences.errorTracking,
      privacy_consent_date: new Date().toISOString(),
    })
  }

  const handleConsentAll = () => {
    const newPreferences: PrivacyPreferences = {
      analytics: true,
      sessionRecording: true,
      errorTracking: true,
      hasConsented: true,
    }
    savePreferences(newPreferences)
    setShowBanner(false)

    // Track consent
    posthog.capture('privacy_consent_given', {
      consent_type: 'all',
      preferences: newPreferences,
    })
  }

  const handleConsentEssential = () => {
    const newPreferences: PrivacyPreferences = {
      analytics: false,
      sessionRecording: false,
      errorTracking: true, // Essential for app functionality
      hasConsented: true,
    }
    savePreferences(newPreferences)
    setShowBanner(false)

    // Track consent
    posthog.capture('privacy_consent_given', {
      consent_type: 'essential_only',
      preferences: newPreferences,
    })
  }

  const handlePreferenceChange = (key: keyof PrivacyPreferences, value: boolean) => {
    const newPreferences = { ...preferences, [key]: value }
    savePreferences(newPreferences)

    // Track preference change
    posthog.capture('privacy_preference_changed', {
      preference: key,
      value,
      all_preferences: newPreferences,
    })
  }

  if (isLoading) {
    return null
  }

  // Privacy consent banner
  if (showBanner) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-background/95 backdrop-blur border-t border-border">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex-1">
              <h3 className="font-semibold text-foreground mb-2">
                Your Privacy Matters
              </h3>
              <p className="text-sm text-muted-foreground">
                We use analytics and session recordings to improve your experience.
                You can customize these preferences at any time.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleConsentEssential}
              >
                Essential Only
              </Button>
              <Button
                size="sm"
                onClick={handleConsentAll}
              >
                Accept All
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return null
}

// Detailed privacy settings component
export function PrivacySettings() {
  const [preferences, setPreferences] = useState<PrivacyPreferences>({
    analytics: true,
    sessionRecording: false,
    errorTracking: true,
    hasConsented: false,
  })

  useEffect(() => {
    const saved = localStorage.getItem(PRIVACY_STORAGE_KEY)
    if (saved) {
      try {
        setPreferences(JSON.parse(saved))
      } catch (error) {
        console.error('Failed to parse privacy preferences:', error)
      }
    }
  }, [])

  const handlePreferenceChange = (key: keyof PrivacyPreferences, value: boolean) => {
    const newPreferences = { ...preferences, [key]: value }
    setPreferences(newPreferences)
    localStorage.setItem(PRIVACY_STORAGE_KEY, JSON.stringify(newPreferences))

    // Apply to PostHog
    if (key === 'analytics') {
      if (value) {
        optInToRecording()
      } else {
        optOutOfRecording()
      }
    }

    posthog.capture('privacy_preference_changed', {
      preference: key,
      value,
    })
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Privacy Settings</CardTitle>
        <CardDescription>
          Control how we collect and use your data to improve Invoice Command.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Analytics */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-medium">Analytics</h4>
              <Badge variant="secondary" className="text-xs">Optional</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Help us understand how you use the app to improve features and performance.
            </p>
          </div>
          <Switch
            checked={preferences.analytics}
            onCheckedChange={(value) => handlePreferenceChange('analytics', value)}
          />
        </div>

        {/* Session Recording */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-medium">Session Recording</h4>
              <Badge variant="secondary" className="text-xs">Optional</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Record your interactions to help us identify and fix usability issues.
              Sensitive data is automatically masked.
            </p>
          </div>
          <Switch
            checked={preferences.sessionRecording}
            onCheckedChange={(value) => handlePreferenceChange('sessionRecording', value)}
          />
        </div>

        {/* Error Tracking */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-medium">Error Tracking</h4>
              <Badge variant="default" className="text-xs">Essential</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Automatically report errors to help us fix bugs and improve stability.
              This is essential for app functionality.
            </p>
          </div>
          <Switch
            checked={preferences.errorTracking}
            onCheckedChange={(value) => handlePreferenceChange('errorTracking', value)}
            disabled // Essential feature
          />
        </div>

        <div className="pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground">
            Your privacy choices are stored locally and never shared.
            You can change these settings at any time.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}