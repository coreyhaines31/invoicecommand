import { Metadata } from 'next'
import Link from 'next/link'
import { LegalPage } from '@/components/legal-page'

const URL = 'https://invoicecommand.com/terms'
const DESCRIPTION =
  'The terms for using Invoice Command, the free invoice and estimate maker at invoicecommand.com.'

export const metadata: Metadata = {
  title: 'Terms of Service | Invoice Command',
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: {
    title: 'Terms of Service | Invoice Command',
    description: DESCRIPTION,
    url: URL,
    type: 'website',
  },
}

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Service">
      <p>
        These terms cover your use of Invoice Command at invoicecommand.com, run by the operator
        of invoicecommand.com (&ldquo;we&rdquo;). By using the service you agree to them.
      </p>

      <h2>The service</h2>
      <p>
        Invoice Command is a free tool for creating invoices and estimates, exporting them as
        PDFs, sending them by email, collecting e-signatures on estimates, and accepting payments
        through Stripe. You can use the builder without an account. Saving, sending, sharing,
        voice commands and payments need a free account.
      </p>
      <p>
        The code is open source under the AGPL-3.0 license and is available at{' '}
        <a href="https://github.com/coreyhaines31/invoicecommand">
          github.com/coreyhaines31/invoicecommand
        </a>
        . These terms cover the hosted service at invoicecommand.com. The license covers the code.
      </p>

      <h2>Your account</h2>
      <p>
        Keep your password and API keys safe. You are responsible for what happens in your
        account and through your API keys. Tell us at{' '}
        <a href="mailto:support@invoicecommand.com">support@invoicecommand.com</a> if you think
        someone else has access.
      </p>

      <h2>Acceptable use</h2>
      <p>Do not use Invoice Command to:</p>
      <ul>
        <li>Commit fraud, or send fake or misleading invoices or estimates.</li>
        <li>Bill for goods or services you did not provide or have no right to charge for.</li>
        <li>Send spam or unwanted email.</li>
        <li>Impersonate another person or business.</li>
        <li>Break the law, or help someone else break it.</li>
        <li>Disrupt the service, get around its limits, or access other people&apos;s data.</li>
      </ul>
      <p>We may suspend or close accounts that break these rules.</p>

      <h2>Your invoices and taxes</h2>
      <p>
        You are responsible for the content of your invoices and estimates, including amounts,
        tax rates and client details. You are responsible for meeting your own tax, accounting
        and legal obligations. Invoice Command does not give tax, legal or financial advice. Check
        the numbers before you send anything.
      </p>
      <p>
        You keep ownership of the content you create. You give us permission to store, process
        and send it only as needed to run the service for you.
      </p>

      <h2>Payments</h2>
      <p>
        Payments are processed by Stripe through Stripe Connect. To accept payments you need a
        Stripe account, and your use of it is governed by{' '}
        <a href="https://stripe.com/legal">Stripe&apos;s terms</a>. Card details go to Stripe,
        not to us.
      </p>
      <p>
        We charge an application fee of 0.5% of each payment you collect through Invoice
        Command. This is in addition to Stripe&apos;s own processing fees. Refunds, disputes and
        chargebacks are handled between you, your client and Stripe.
      </p>

      <h2>No warranty</h2>
      <p>
        The service is provided as is and as available, without warranties of any kind. We do
        not promise that it will be uninterrupted, error free, or that data will never be lost.
        Keep your own copies of important invoices.
      </p>

      <h2>Limitation of liability</h2>
      <p>
        To the extent the law allows, we are not liable for indirect, incidental or consequential
        damages, or for lost profits, revenue or data, arising from your use of the service. Our
        total liability for any claim is limited to the application fees you paid us in the 12
        months before the claim.
      </p>

      <h2>Ending your use</h2>
      <p>
        You can stop using the service and delete your account from Settings at any time. We may
        stop offering the service or parts of it.
      </p>

      <h2>Changes to these terms</h2>
      <p>
        We may update these terms. When we do, we will change the date at the top of this page.
        If you keep using the service after a change, you accept the updated terms.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about these terms: <a href="mailto:support@invoicecommand.com">support@invoicecommand.com</a>.
        See also our <Link href="/privacy">Privacy Policy</Link>.
      </p>
    </LegalPage>
  )
}
