import { Navigation } from '@/components/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export default function BillingPage() {
  return (
    <div className="container mx-auto p-4 min-h-screen">
      <Navigation />

      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Billing</h1>
          <p className="text-muted-foreground mt-2">Manage your subscription and billing information.</p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                Current Plan
                <Badge variant="secondary">Free</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">Free Plan Features:</h4>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                  <li>• Unlimited invoice creation</li>
                  <li>• 10 voice commands per month</li>
                  <li>• 3 professional invoice styles</li>
                  <li>• Basic logo upload</li>
                  <li>• PDF export</li>
                </ul>
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-medium mb-2">Upgrade Options:</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Premium Plan</p>
                      <p className="text-sm text-muted-foreground">Unlimited voice commands, custom branding, priority support</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">$20/month</p>
                      <Button size="sm" disabled>Coming Soon</Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Pro Plan</p>
                      <p className="text-sm text-muted-foreground">Everything in Premium + zero transaction fees</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">$100/month</p>
                      <Button size="sm" disabled>Coming Soon</Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Usage This Month</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Voice Commands</span>
                  <span className="font-mono">0 / 10</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '0%' }}></div>
                </div>
                <p className="text-xs text-muted-foreground">Resets monthly on your billing date</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}