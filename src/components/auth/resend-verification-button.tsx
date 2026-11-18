'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { sendVerificationEmail } from '@/lib/auth-client'
import { withNextPath } from '@/lib/next-path'

type State = 'idle' | 'sending' | 'sent' | 'error'

export function ResendVerificationButton({ email }: { email: string }) {
  const [state, setState] = useState<State>('idle')

  const handleClick = async () => {
    setState('sending')
    try {
      const { error } = await sendVerificationEmail({
        email,
        callbackURL: withNextPath('/auth/verified', '/dashboard'),
      })
      setState(error ? 'error' : 'sent')
    } catch {
      setState('error')
    }
  }

  if (state === 'sent') {
    return <p className="text-sm text-foreground font-medium">Check your inbox at {email}.</p>
  }

  return (
    <div className="space-y-2">
      <Button type="button" onClick={handleClick} disabled={state === 'sending'}>
        {state === 'sending' ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Sending...
          </>
        ) : (
          'Send a new verification email'
        )}
      </Button>
      {state === 'error' && (
        <p className="text-sm text-destructive" role="alert">
          We could not send the verification email. Try again in a few minutes.
        </p>
      )}
    </div>
  )
}
