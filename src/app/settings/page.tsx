import { Navigation } from '@/components/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function SettingsPage() {
  return (
    <div className="container mx-auto p-4 min-h-screen">
      <Navigation />

      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-2">Manage your account settings and preferences.</p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Account settings coming soon. You can manage your profile, preferences, and more.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Voice Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Voice command preferences and usage tracking settings will be available here.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Invoice Preferences</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Default invoice settings, templates, and branding options coming soon.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}