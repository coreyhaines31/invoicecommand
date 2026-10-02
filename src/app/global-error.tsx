'use client';

import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center p-4">
          <div className="w-full max-w-md space-y-6 text-center">
            <h1 className="text-4xl font-bold">Something went wrong</h1>
            <p className="text-muted-foreground">
              We've been notified and are working to fix the issue.
            </p>
            {error.digest && (
              <p className="text-sm text-muted-foreground">
                Error ID: {error.digest}
              </p>
            )}
            <Button onClick={reset} size="lg">
              Try again
            </Button>
          </div>
        </div>
      </body>
    </html>
  );
}
