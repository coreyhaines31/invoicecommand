import { Metadata } from 'next'
import Link from 'next/link'
import { LegalPage } from '@/components/legal-page'

const URL = 'https://invoicecommand.com/privacy'
const DESCRIPTION =
  'What Invoice Command stores, where it is stored, which providers receive it, and how to export or delete your data.'

export const metadata: Metadata = {
  title: 'Privacy Policy | Invoice Command',
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: {
    title: 'Privacy Policy | Invoice Command',
    description: DESCRIPTION,
    url: URL,
    type: 'website',
  },
}

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy">
      <p>
        Invoice Command is a free invoicing tool at invoicecommand.com. This page explains what data
        the app stores, where it goes, and what you can do about it. &ldquo;We&rdquo; means the
        operator of invoicecommand.com.
      </p>

      <h2>Using the app without an account</h2>
      <p>
        You can build invoices and estimates without signing up. Your draft is saved in your
        browser&apos;s local storage on your device. It is not sent to our servers while you edit
        it. Clearing your browser data deletes it.
      </p>
      <p>
        PDF downloads are generated in your browser too. A draft only leaves your device once you
        have an account and you save it, send it by email or use voice commands.
      </p>

      <h2>What we store when you have an account</h2>
      <ul>
        <li>
          Your email address and password, and a display name taken from your email address. The
          password is stored as a hash, not as plain text.
        </li>
        <li>
          The invoices and estimates you save, including your business details, your clients&apos;
          names, email addresses and postal addresses, line items, amounts, notes and terms.
        </li>
        <li>Logos you upload. They are stored as part of the invoices that use them.</li>
        <li>
          API keys you create. We store a hash and a short prefix so you can recognize the key, not
          the full key.
        </li>
        <li>
          Webhook endpoints you add, their signing secrets, and a log of the events we sent to them.
        </li>
        <li>Your Stripe account ID and status if you connect Stripe to accept payments.</li>
        <li>How many voice commands you used each month.</li>
        <li>For each sign-in session: the IP address and browser user agent.</li>
      </ul>

      <h2>Shared invoices and e-signatures</h2>
      <p>
        When you share an invoice or estimate, anyone with the link can view it until you turn the
        link off or it expires.
      </p>
      <p>
        When someone accepts an estimate, we store their full name, email address, the signature
        image they drew, the time they signed, their IP address, their browser user agent and the
        consent text they agreed to. This record is attached to the estimate, and the estimate
        owner gets an email saying it was signed.
      </p>

      <h2>Providers that receive data</h2>
      <p>We use these services to run the app. Each receives only what it needs for its job.</p>
      <ul>
        <li>
          <strong>Stripe</strong> processes payments and onboards accounts that accept payments.
          Card details are entered into Stripe&apos;s form and go to Stripe, not to us.
        </li>
        <li>
          <strong>PostShiba</strong> (with <strong>Resend</strong> as a fallback) sends email:
          invoices and estimates you send to clients, signature notices, password resets and
          support requests.
        </li>
        <li>
          <strong>OpenAI</strong> handles voice commands. When you use one, we send the text of
          what you said and the current invoice to OpenAI to work out the change. The speech to
          text step uses your browser&apos;s built-in speech recognition, which some browsers run
          on their own servers.
        </li>
        <li>
          <strong>HoneyWarden</strong> receives error reports from the app and the server. It
          does not record sessions or trace performance. Share tokens are removed from what we
          send.
        </li>
        <li>
          <strong>PostHog</strong> receives page views, clicks and session recordings, with form
          inputs masked. If you are signed in, events are linked to your account ID, not your
          name or email. Recording and click capture are off on shared invoice links, saved
          invoice pages, the dashboard, settings and billing.
        </li>
        <li>
          <strong>TracerKit</strong> loads our site analytics, <strong>Headstream</strong> and{' '}
          <strong>Fathom</strong>. They do not load on shared invoice links or the password reset
          page.
        </li>
        <li>
          <strong>UserProof</strong> records clicks and page activity on public pages only: the
          invoice builder on the home page, the template pages, the estimate and order tools and
          the blog. It never loads on sign-in, the dashboard, settings, billing, saved invoices or
          shared invoices. The live invoice preview on the builder is excluded from recording.
        </li>
        <li>
          <strong>Vercel</strong> hosts the app and <strong>Neon</strong> hosts the database.
        </li>
      </ul>
      <p>We do not sell your data or use it for advertising.</p>

      <h2>Cookies and local storage</h2>
      <p>
        When you sign in, we set a session cookie that keeps you signed in. The app also keeps
        your draft and your privacy choice in your browser&apos;s local storage. PostHog stores an
        identifier in a cookie and in local storage.
      </p>
      <p>
        The privacy banner offers two choices. <strong>Accept All</strong> keeps PostHog
        analytics on. <strong>Essential</strong> turns PostHog off in that browser. Error reports
        to HoneyWarden stay on with either choice, because we need them to fix the app. The banner does
        not control Headstream, Fathom or UserProof, which follow the page rules above. PostHog
        also respects your browser&apos;s Do Not Track setting.
      </p>

      <h2>Keeping and deleting your data</h2>
      <p>
        We keep your account data until you delete it. From Settings you can export your data
        and delete your account. Deleting your account removes your invoices, estimates, API
        keys and webhooks from the database, and your share links stop working.
      </p>
      <p>
        Copies may remain in database backups for a short period after deletion. Emails you
        already sent stay in your clients&apos; inboxes, and Stripe keeps its own payment records
        under its own policies.
      </p>

      <h2>Open source</h2>
      <p>
        Invoice Command is open source under the AGPL-3.0 license. You can read the code that
        does everything described here at{' '}
        <a href="https://github.com/coreyhaines31/invoicecommand">
          github.com/coreyhaines31/invoicecommand
        </a>
        .
      </p>

      <h2>Changes</h2>
      <p>
        If we change what we collect or who receives it, we will update this page and the date at
        the top.
      </p>

      <h2>Contact</h2>
      <p>
        Questions or requests about your data: <a href="mailto:support@invoicecommand.com">support@invoicecommand.com</a>.
        See also our <Link href="/terms">Terms of Service</Link>.
      </p>
    </LegalPage>
  )
}
