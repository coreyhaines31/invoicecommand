import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Clock } from 'lucide-react'

export function ShareLinkExpired() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Clock className="w-6 h-6 text-muted-foreground" />
            <CardTitle>This link has expired</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            The shareable link for this invoice is no longer active. Please contact the
            sender to request a new one.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
