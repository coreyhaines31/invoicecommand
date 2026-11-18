import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { invoices } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'
import { DashboardContent } from '@/components/dashboard/dashboard-content'

export const metadata: Metadata = {
  title: 'Dashboard | Invoice Command',
  description: 'Manage your invoices, view analytics, and access your Invoice Command account.',
}

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    redirect('/auth/login')
  }

  // Only the list columns: logos and signatures are inline images and would bloat every row
  const userInvoices = await db
    .select({
      id: invoices.id,
      invoiceNumber: invoices.invoiceNumber,
      clientName: invoices.clientName,
      clientEmail: invoices.clientEmail,
      total: invoices.total,
      status: invoices.status,
      dueDate: invoices.dueDate,
      createdAt: invoices.createdAt,
      documentType: invoices.documentType,
      signedAt: invoices.signedAt,
      collectSignature: invoices.collectSignature,
      convertedToInvoiceId: invoices.convertedToInvoiceId,
    })
    .from(invoices)
    .where(eq(invoices.userId, session.user.id))
    .orderBy(desc(invoices.createdAt))

  return <DashboardContent user={session.user} invoices={userInvoices} />
}
