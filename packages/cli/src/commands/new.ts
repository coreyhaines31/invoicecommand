import { Command } from 'commander'
import chalk from 'chalk'
import ora from 'ora'
import { readFile } from 'fs/promises'
import { parse as parseYaml } from 'yaml'
import { createInvoice, ApiError, type InvoiceCreate } from '../lib/api-client.js'

export const newCommand = new Command('new')
  .description('Create a new invoice')
  .option('-f, --file <path>', 'Create from YAML file')
  .option('--json', 'Output as JSON')
  .action(async (options) => {
    if (!options.file) {
      console.log(chalk.red('\nPlease specify a YAML file with -f option.'))
      console.log(chalk.gray('\nExample invoice.yaml:'))
      console.log(
        chalk.cyan(`
invoiceNumber: INV-001
invoiceDate: 2024-01-15
dueDate: 2024-02-15
clientName: Acme Corp
clientEmail: billing@acme.com
senderName: Your Company
senderEmail: invoices@yourcompany.com
items:
  - description: Consulting services
    quantity: 10
    price: 150
  - description: Software license
    quantity: 1
    price: 500
subtotal: 2000
taxRate: 10
tax: 200
total: 2200
currency: USD
notes: Thank you for your business!
`)
      )
      process.exit(1)
    }

    const spinner = ora('Reading file...').start()

    try {
      const content = await readFile(options.file, 'utf-8')
      const invoiceData = parseYaml(content) as InvoiceCreate

      // Validate required fields
      if (!invoiceData.invoiceNumber) {
        throw new Error('invoiceNumber is required')
      }
      if (!invoiceData.clientName) {
        throw new Error('clientName is required')
      }
      if (!invoiceData.items || invoiceData.items.length === 0) {
        throw new Error('At least one item is required')
      }

      spinner.text = 'Creating invoice...'

      const result = await createInvoice(invoiceData)

      spinner.succeed('Invoice created')

      if (options.json) {
        console.log(JSON.stringify(result.data, null, 2))
      } else {
        console.log(chalk.bold('\nInvoice Created:'))
        console.log(chalk.gray('  ID:     ') + chalk.cyan(result.data.id))
        console.log(chalk.gray('  Number: ') + result.data.invoiceNumber)
        console.log(chalk.gray('  Client: ') + result.data.clientName)
        console.log(chalk.gray('  Total:  ') + formatCurrency(result.data.total, result.data.currency))
        console.log(chalk.gray('  Status: ') + result.data.status)
        console.log()
        console.log(chalk.green('Send it with:'))
        console.log(chalk.cyan(`  invoicecommand send ${result.data.id}`))
      }
    } catch (error) {
      spinner.fail('Failed to create invoice')
      if (error instanceof ApiError) {
        console.log(chalk.red(`\n${error.message}`))
      } else if (error instanceof Error) {
        console.log(chalk.red(`\n${error.message}`))
      }
      process.exit(1)
    }
  })

function formatCurrency(amount: string, currency: string): string {
  const num = parseFloat(amount)
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency || 'USD',
  }).format(num)
}
