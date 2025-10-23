import { createServerSupabaseClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { PaymentSetupClient } from './payment-setup-client'

export default async function PaymentSetupPage({
  searchParams,
}: {
  searchParams: { success?: string; refresh?: string }
}) {
  const supabase = await createServerSupabaseClient()

  // Check authentication
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) {
    redirect('/auth/signin')
  }

  // Get user's current payment setup status
  const { data: userProfile } = await supabase
    .from('user_profiles')
    .select('stripe_account_id, stripe_onboarding_completed, subscription_tier')
    .eq('user_id', user.id)
    .single()

  return (
    <PaymentSetupClient
      user={user}
      userProfile={userProfile}
      searchParams={searchParams}
    />
  )
}