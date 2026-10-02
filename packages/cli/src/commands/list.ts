import { Command } from 'commander'
import chalk from 'chalk'
import ora from 'ora'
import { listInvoices, ApiError } from '../lib/api-client.js'

export const listCommand = new Command('list')
  .description('List all invoices')
  .option('-t, --type <type>', 'Filter by type (invoice, estimate)')
  .option('-s, --status <status>', 'Filter by status (draft, sent, paid)')
  .option('-l, --limit <limit>', 'Maximum number to return', '20')
  .option('--json', 'Output as JSON')
  .action(async (options) => {
    const spinner = ora('Fetching invoices...').start()

    try {
      const result = await listInvoices({
        documentType: options.type as 'invoice' | 'estimate' | undefined,
        status: options.status as 'draft' | 'sent' | 'paid' | undefined,
        limit: parseInt(options.limit, 10),
      })

      spinner.stop()

      if (options.json) {
        console.log(JSON.stringify(result.data, null, 2))
        return
      }

      if (result.data.length === 0) {
        console.log(chalk.yellow('\nNo invoices found.'))
        return
      }

      console.log(chalk.bold(`\nInvoices (${result.data.length})\n`))
      console.log(
        chalk.gray(
          padRight('ID', 36) +
            padRight('Number', 15) +
            padRight('Client', 25) +
            padRight('Total', 12) +
            padRight('Status', 10) +
            'Type'
        )
      )
      console.log(chalk.gray('-'.repeat(110)))

      for (const invoice of result.data) {
        const statusColor =
          invoice.status === 'paid'
            ? chalk.green
            : invoice.status === 'sent'
            ? chalk.yellow
            : chalk.gray

        console.log(
          chalk.cyan(padRight(invoice.id, 36)) +
            padRight(invoice.invoiceNumber, 15) +
            padRight(truncate(invoice.clientName, 23), 25) +
            padRight(formatCurrency(invoice.total, invoice.currency), 12) +
            statusColor(padRight(invoice.status, 10)) +
            invoice.documentType
        )
      }

      if (result.pagination.hasMore) {
        console.log(chalk.gray(`\nMore invoices available. Use --limit to see more.`))
      }
    } catch (error) {
      spinner.fail('Failed to fetch invoices')
      if (error instanceof ApiError) {
        console.log(chalk.red(`\n${error.message}`))
        if (error.status === 401) {
          console.log(chalk.gray('Run "invoicecommand init" to set up your API key.'))
        }
      } else {
        console.log(chalk.red('\nAn unexpected error occurred.'))
      }
      process.exit(1)
    }
  })

function padRight(str: string, len: number): string {
  return str.length >= len ? str.substring(0, len) : str + ' '.repeat(len - str.length)
}

function truncate(str: string, len: number): string {
  if (str.length <= len) return str
  return str.substring(0, len - 1) + '…'
}

function formatCurrency(amount: string, currency: string): string {
  const num = parseFloat(amount)
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency || 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(num)
}
