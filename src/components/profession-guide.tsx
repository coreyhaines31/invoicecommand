import Link from 'next/link'
import { ArrowRight, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type {
  ProfessionChecklistItem,
  ProfessionContent,
  ProfessionFaq,
  ProfessionTip,
} from '@/data/profession-content'

type ProfessionGuideProps = {
  kind: 'invoice' | 'estimate'
  slug: string
  name: string
  content: ProfessionContent
  related: { slug: string; name: string }[]
}

const sectionClass = 'bg-card border border-border rounded-lg p-6 shadow-lg'

const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

function RatesTable({ rates }: { rates: ProfessionContent['rates'] }) {
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Service</TableHead>
            <TableHead>Priced</TableHead>
            <TableHead className="text-right">Typical range</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rates.map((rate) => (
            <TableRow key={rate.service}>
              <TableCell className="font-medium">{rate.service}</TableCell>
              <TableCell className="text-muted-foreground">{rate.unit}</TableCell>
              <TableCell className="text-right">{rate.range}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <p className="text-xs text-muted-foreground mt-3">
        Typical US ranges. Rates vary by region, experience, and job size.
      </p>
    </>
  )
}

function SampleTable({ sample }: { sample: ProfessionContent['sampleInvoice'] }) {
  const total = sample.items.reduce((sum, item) => sum + item.quantity * item.rate, 0)
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Description</TableHead>
            <TableHead className="text-right">Qty</TableHead>
            <TableHead className="text-right">Rate</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sample.items.map((item) => (
            <TableRow key={item.description}>
              <TableCell>{item.description}</TableCell>
              <TableCell className="text-right whitespace-nowrap">
                {item.quantity} {item.unit}
              </TableCell>
              <TableCell className="text-right">{usd.format(item.rate)}</TableCell>
              <TableCell className="text-right">{usd.format(item.quantity * item.rate)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>Total</TableCell>
            <TableCell className="text-right">{usd.format(total)}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
      <p className="text-sm text-muted-foreground mt-4">
        <span className="font-medium text-foreground">Notes: </span>
        {sample.notes}
      </p>
    </>
  )
}

function Checklist({ items }: { items: ProfessionChecklistItem[] }) {
  return (
    <ul className="space-y-4">
      {items.map((entry) => (
        <li key={entry.item} className="flex items-start gap-3">
          <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold">{entry.item}</h3>
            <p className="text-sm text-muted-foreground">{entry.why}</p>
          </div>
        </li>
      ))}
    </ul>
  )
}

function Tips({ tips }: { tips: ProfessionTip[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {tips.map((tip) => (
        <div key={tip.title}>
          <h3 className="font-semibold mb-1">{tip.title}</h3>
          <p className="text-sm text-muted-foreground">{tip.body}</p>
        </div>
      ))}
    </div>
  )
}

function Faqs({ faqs }: { faqs: ProfessionFaq[] }) {
  return (
    <div className="space-y-4">
      {faqs.map((faq) => (
        <details key={faq.question} className="border-b border-border pb-4">
          <summary className="font-semibold cursor-pointer hover:text-primary">{faq.question}</summary>
          <p className="text-sm text-muted-foreground mt-2">{faq.answer}</p>
        </details>
      ))}
    </div>
  )
}

export function ProfessionGuide({ kind, slug, name, content, related }: ProfessionGuideProps) {
  const otherKind = kind === 'invoice' ? 'estimate' : 'invoice'

  return (
    <section className="mt-20 space-y-12">
      {kind === 'invoice' ? (
        <>
          <div className={sectionClass}>
            <h2 className="text-2xl font-bold text-foreground mb-4">How {name} pricing works</h2>
            <p className="text-muted-foreground mb-6 max-w-3xl">{content.pricingModel}</p>
            <RatesTable rates={content.rates} />
          </div>

          <div className={sectionClass}>
            <h2 className="text-2xl font-bold text-foreground mb-4">Sample {name} invoice</h2>
            <SampleTable sample={content.sampleInvoice} />
          </div>

          <div className={sectionClass}>
            <h2 className="text-2xl font-bold text-foreground mb-6">What to include on your {name} invoice</h2>
            <Checklist items={content.invoiceChecklist} />
          </div>

          <div className={sectionClass}>
            <h2 className="text-2xl font-bold text-foreground mb-4">Payment terms</h2>
            <p className="text-muted-foreground max-w-3xl">{content.paymentTerms}</p>
          </div>

          <div className={sectionClass}>
            <h2 className="text-2xl font-bold text-foreground mb-6">Billing tips</h2>
            <Tips tips={content.tips} />
          </div>

          <div className={sectionClass}>
            <h2 className="text-2xl font-bold text-foreground mb-6">{name} invoice FAQ</h2>
            <Faqs faqs={content.faqs} />
          </div>
        </>
      ) : (
        <>
          <div className={sectionClass}>
            <h2 className="text-2xl font-bold text-foreground mb-6">What to include in your {name} quote</h2>
            <Checklist items={content.estimate.scopeChecklist} />
          </div>

          <div className={sectionClass}>
            <h2 className="text-2xl font-bold text-foreground mb-4">{name} rates to quote from</h2>
            <RatesTable rates={content.rates} />
          </div>

          <div className={sectionClass}>
            <h2 className="text-2xl font-bold text-foreground mb-6">Pricing your quotes</h2>
            <Tips tips={content.estimate.pricingTips} />
          </div>

          <div className={sectionClass}>
            <h2 className="text-2xl font-bold text-foreground mb-6">{name} estimate FAQ</h2>
            <Faqs faqs={content.estimate.faqs} />
          </div>
        </>
      )}

      <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-foreground mb-3">
          {kind === 'invoice' ? 'Quoting a job first?' : 'Job done and ready to bill?'}
        </h2>
        <p className="text-muted-foreground mb-6">
          {kind === 'invoice'
            ? `Send a ${name} estimate for approval, then turn it into an invoice when the work is done.`
            : `Use the ${name} invoice template to bill the client, or convert this estimate once it's approved.`}
        </p>
        <Button asChild size="lg">
          <Link href={`/${otherKind}-templates/${slug}`}>
            {name} {otherKind} template
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </Button>

        {related.length > 0 && (
          <>
            <h3 className="font-semibold mt-8 mb-3">Related {kind} templates</h3>
            <ul className="flex flex-wrap gap-2">
              {related.map((profession) => (
                <li key={profession.slug}>
                  <Link
                    href={`/${kind}-templates/${profession.slug}`}
                    className="text-sm bg-background border border-border px-3 py-1 rounded hover:text-primary"
                  >
                    {profession.name}
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </section>
  )
}
