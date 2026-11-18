import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { invoices, userProfiles } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { calculateApplicationFee } from '@/lib/stripe'
import { toStripeAmount } from '@/lib/stripe-amount'
import { jsonErrorResponse } from '@/lib/error-response'
import { isPayableDocument, startInvoicePayment } from '@/lib/invoice-payment-intent'

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers })
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const { invoiceId, amount } = body

    if (!invoiceId || amount == null) {
      return NextResponse.json({ error: 'Invoice ID and amount are required' }, { status: 400 })
    }

    if (!Number.isInteger(amount) || amount <= 0) {
      return NextResponse.json({ error: 'Amount must be a positive integer in the currency\'s smallest unit' }, { status: 400 })
    }

    const [invoice] = await db
      .select()
      .from(invoices)
      .where(and(eq(invoices.id, invoiceId), eq(invoices.userId, session.user.id)))

    if (!invoice || !isPayableDocument(invoice)) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 })
    }

    const invoiceCurrency = (invoice.currency || 'USD').toLowerCase()

    const expectedAmount = toStripeAmount(Number(invoice.total), invoiceCurrency)
    if (amount !== expectedAmount) {
      return NextResponse.json({ error: 'Amount does not match invoice total' }, { status: 400 })
    }

    const [userProfile] = await db
      .select({
        stripeAccountId: userProfiles.stripeAccountId,
        stripeOnboardingCompleted: userProfiles.stripeOnboardingCompleted,
        subscriptionTier: userProfiles.subscriptionTier,
      })
      .from(userProfiles)
      .where(eq(userProfiles.userId, session.user.id))

    if (!userProfile?.stripeAccountId || !userProfile.stripeOnboardingCompleted) {
      return NextResponse.json(
        { error: 'Stripe account not set up. Please complete payment setup first.' },
        { status: 400 }
      )
    }

    const userTier = (userProfile.subscriptionTier as 'free' | 'premium' | 'pro') || 'free'
    const applicationFeeAmount = calculateApplicationFee(amount, userTier)

    return await startInvoicePayment({
      invoice,
      amount,
      applicationFeeAmount,
      createParams: {
        currency: invoiceCurrency,
        transfer_data: { destination: userProfile.stripeAccountId },
        metadata: {
          invoice_id: invoiceId,
          user_id: session.user.id,
          invoice_number: invoice.invoiceNumber || '',
        },
        description: `Payment for Invoice ${invoice.invoiceNumber || invoiceId}`,
      },
      idempotencyKeyPrefix: 'owner-invoice',
      scope: and(eq(invoices.id, invoiceId), eq(invoices.userId, session.user.id)),
      extraSet: { paymentEnabled: true },
      responseExtras: { userTier },
    })
  } catch (error) {
    return jsonErrorResponse(error, 'Failed to create payment intent')
  }
}
