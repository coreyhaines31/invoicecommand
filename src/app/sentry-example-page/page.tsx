'use client';

import { Button } from '@/components/ui/button';

export default function SentryExamplePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6 text-center">
        <h1 className="text-4xl font-bold">Sentry Test Page</h1>
        <p className="text-muted-foreground">
          Click the button below to trigger a test error and verify Sentry is working.
        </p>
        <Button
          onClick={() => {
            throw new Error('Sentry Test Error - Integration Working!');
          }}
          size="lg"
          variant="destructive"
        >
          Trigger Test Error
        </Button>
      </div>
    </div>
  );
}
