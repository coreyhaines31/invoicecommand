import { Metadata } from 'next'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { DashboardContent } from '@/components/dashboard/dashboard-content'

export const metadata: Metadata = {
  title: 'Dashboard | Invoice Command',
  description: 'Manage your invoices, view analytics, and access your Invoice Command account.',
}

export default async function DashboardPage() {
  const supabase = createServerSupabaseClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect('/auth/login')
  }

  // Fetch user's invoices
  const { data: invoices = [] } = await supabase
    .from('invoices')
    .select('*')
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false })

  return <DashboardContent user={session.user} invoices={invoices} />
}