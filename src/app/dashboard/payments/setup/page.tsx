import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { userProfiles } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { PaymentSetupClient } from './payment-setup-client'

export default async function PaymentSetupPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; refresh?: string }>
}) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/auth/login')

  const [userProfile] = await db
    .select({
      stripeAccountId: userProfiles.stripeAccountId,
      stripeOnboardingCompleted: userProfiles.stripeOnboardingCompleted,
      subscriptionTier: userProfiles.subscriptionTier,
    })
    .from(userProfiles)
    .where(eq(userProfiles.userId, session.user.id))

  const resolvedSearchParams = await searchParams

  return (
    <PaymentSetupClient
      user={session.user}
      userProfile={userProfile ?? null}
      searchParams={resolvedSearchParams}
    />
  )
}
