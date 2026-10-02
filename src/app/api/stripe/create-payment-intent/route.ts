import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { invoices, userProfiles } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { stripe, calculateApplicationFee } from '@/lib/stripe'
import { jsonErrorResponse } from '@/lib/error-response'

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
      return NextResponse.json({ error: 'Amount must be a positive integer in cents' }, { status: 400 })
    }

    const [invoice] = await db
      .select()
      .from(invoices)
      .where(and(eq(invoices.id, invoiceId), eq(invoices.userId, session.user.id)))

    if (!invoice) return NextResponse.json({ error: 'Invoice not found' }, { status: 404 })

    const expectedAmount = Math.round(Number(invoice.total) * 100)
    if (amount !== expectedAmount) {
      return NextResponse.json({ error: 'Amount does not match invoice total' }, { status: 400 })
    }

    const invoiceCurrency = (invoice.currency || 'USD').toLowerCase()

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

    // Reuse an in-flight payment intent rather than creating a new one. Same
    // reasoning as the public endpoint — see comment there for the webhook
    // dispatch / orphan-intent failure mode.
    if (
      invoice.stripePaymentIntentId &&
      invoice.stripePaymentStatus === 'processing' &&
      invoice.paymentAmountCents === amount
    ) {
      const existing = await stripe.paymentIntents.retrieve(invoice.stripePaymentIntentId)
      if (existing.status !== 'canceled' && existing.status !== 'succeeded') {
        return NextResponse.json({
          clientSecret: existing.client_secret,
          paymentIntentId: existing.id,
          applicationFeeAmount: invoice.applicationFeeCents ?? applicationFeeAmount,
          userTier,
          message: 'Existing payment intent reused',
        })
      }
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: invoiceCurrency,
      application_fee_amount: applicationFeeAmount,
      transfer_data: { destination: userProfile.stripeAccountId },
      metadata: {
        invoice_id: invoiceId,
        user_id: session.user.id,
        invoice_number: invoice.invoiceNumber || '',
      },
      description: `Payment for Invoice ${invoice.invoiceNumber || invoiceId}`,
    }, {
      idempotencyKey: `owner-invoice-${invoiceId}-${amount}`,
    })

    await db
      .update(invoices)
      .set({
        stripePaymentIntentId: paymentIntent.id,
        paymentEnabled: true,
        paymentAmountCents: amount,
        applicationFeeCents: applicationFeeAmount,
        stripePaymentStatus: 'processing',
        updatedAt: new Date(),
      })
      .where(and(eq(invoices.id, invoiceId), eq(invoices.userId, session.user.id)))

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      applicationFeeAmount,
      userTier,
      message: 'Payment intent created successfully',
    })
  } catch (error) {
    return jsonErrorResponse(error, 'Failed to create payment intent')
  }
}
