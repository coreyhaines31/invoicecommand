'use client'

import { useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle, XCircle, Pen } from 'lucide-react'

const SignatureCanvas = dynamic(() => import('react-signature-canvas'), { ssr: false })

const CONSENT_TEXT =
  'I accept this estimate and agree that this electronic signature is the legal equivalent of my handwritten signature under the U.S. ESIGN Act and applicable state law (UETA).'

type SignatureCanvasRef = {
  isEmpty(): boolean
  clear(): void
  toDataURL(type?: string): string
  getCanvas?(): HTMLCanvasElement
}

interface EstimateSignatureProps {
  estimateId: string
  defaultSignerEmail?: string
  onSigned: (data: { signedAt: string; signerName: string; signerEmail: string; signatureData: string }) => void
}

export function EstimateSignature({ estimateId, defaultSignerEmail = '', onSigned }: EstimateSignatureProps) {
  const sigRef = useRef<SignatureCanvasRef | null>(null)
  const [signerName, setSignerName] = useState('')
  const [signerEmail, setSignerEmail] = useState(defaultSignerEmail)
  const [accepted, setAccepted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleClear = () => {
    sigRef.current?.clear()
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!signerName.trim()) {
      setError('Please type your full name.')
      return
    }
    if (!signerEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signerEmail)) {
      setError('Please enter a valid email address.')
      return
    }
    if (!accepted) {
      setError('You must agree to electronic signing to continue.')
      return
    }
    if (!sigRef.current || sigRef.current.isEmpty()) {
      setError('Please draw your signature in the box above.')
      return
    }

    const signatureData = sigRef.current.toDataURL('image/png')

    setSubmitting(true)
    try {
      const res = await fetch(`/api/estimates/${estimateId}/accept`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          signatureData,
          signerName: signerName.trim(),
          signerEmail: signerEmail.trim(),
          consentText: CONSENT_TEXT,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Could not accept the estimate. Please try again.')
        setSubmitting(false)
        return
      }
      onSigned({
        signedAt: data.signedAt,
        signerName: data.signerName,
        signerEmail: data.signerEmail,
        signatureData,
      })
    } catch (err) {
      console.error(err)
      setError('Network error. Please try again.')
      setSubmitting(false)
    }
  }

  return (
    <Card className="border-primary/30 bg-accent/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Pen className="w-5 h-5 text-primary" />
          Accept this estimate
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="signer-name">Full name</Label>
              <Input
                id="signer-name"
                type="text"
                required
                maxLength={200}
                value={signerName}
                onChange={(e) => setSignerName(e.target.value)}
                placeholder="Jane Smith"
                disabled={submitting}
              />
            </div>
            <div>
              <Label htmlFor="signer-email">Email</Label>
              <Input
                id="signer-email"
                type="email"
                required
                maxLength={320}
                value={signerEmail}
                onChange={(e) => setSignerEmail(e.target.value)}
                placeholder="jane@example.com"
                disabled={submitting}
              />
            </div>
          </div>

          <div>
            <Label>Signature</Label>
            <div className="mt-1 rounded-md border border-input bg-background overflow-hidden">
              <SignatureCanvas
                ref={(ref: SignatureCanvasRef | null) => {
                  sigRef.current = ref
                }}
                penColor="black"
                canvasProps={{
                  className: 'w-full h-40 cursor-crosshair touch-none',
                }}
              />
            </div>
            <div className="mt-2 flex justify-between items-center text-xs text-muted-foreground">
              <span>Draw your signature above</span>
              <button
                type="button"
                onClick={handleClear}
                className="text-primary hover:underline"
                disabled={submitting}
              >
                Clear
              </button>
            </div>
          </div>

          <label className="flex items-start gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
              className="mt-1"
              disabled={submitting}
            />
            <span>{CONSENT_TEXT}</span>
          </label>

          {error && (
            <Alert variant="destructive">
              <XCircle className="w-4 h-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" disabled={submitting} className="w-full md:w-auto">
            {submitting ? 'Submitting...' : (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Accept and sign
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

interface SignedBannerProps {
  signerName: string
  signedAt: string
  signatureData: string | null
}

export function EstimateSignedBanner({ signerName, signedAt, signatureData }: SignedBannerProps) {
  const formatted = new Date(signedAt).toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })

  return (
    <Card className="border-primary bg-primary/5">
      <CardContent className="pt-6">
        <div className="flex items-start gap-3">
          <CheckCircle className="w-6 h-6 text-primary mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="font-semibold text-foreground">
              Accepted by {signerName} on {formatted}
            </p>
            {signatureData && (
              <div className="mt-3 bg-white border border-border rounded p-2 inline-block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={signatureData} alt="Signature" className="h-16" />
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
