import { Command } from 'commander'
import chalk from 'chalk'
import ora from 'ora'
import inquirer from 'inquirer'
import { getInvoice, sendInvoice, downloadPdf, ApiError } from '../lib/api-client.js'

export const sendCommand = new Command('send')
  .description('Send an invoice via email')
  .argument('<id>', 'Invoice ID')
  .option('-m, --message <message>', 'Optional message to include')
  .option('-y, --yes', 'Skip confirmation')
  .action(async (id, options) => {
    const spinner = ora('Fetching invoice...').start()

    try {
      // First, get the invoice to show details
      const { data: invoice } = await getInvoice(id)

      spinner.stop()

      if (!invoice.clientEmail) {
        console.log(chalk.red('\nCannot send: No client email address on invoice.'))
        process.exit(1)
      }

      if (!invoice.senderName) {
        console.log(chalk.red('\nCannot send: No sender name on invoice.'))
        process.exit(1)
      }

      console.log(chalk.bold('\nInvoice to send:'))
      console.log(chalk.gray('  Number: ') + invoice.invoiceNumber)
      console.log(chalk.gray('  Client: ') + invoice.clientName)
      console.log(chalk.gray('  Email:  ') + invoice.clientEmail)
      console.log(chalk.gray('  Total:  ') + formatCurrency(invoice.total, invoice.currency))
      console.log()

      if (!options.yes) {
        const { confirm } = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'confirm',
            message: `Send invoice to ${invoice.clientEmail}?`,
            default: true,
          },
        ])

        if (!confirm) {
          console.log(chalk.yellow('\nCancelled.'))
          process.exit(0)
        }
      }

      spinner.start('Generating PDF...')

      // Download PDF
      const pdfBuffer = await downloadPdf(id)
      const base64Pdf = Buffer.from(pdfBuffer).toString('base64')

      spinner.text = 'Sending email...'

      // Send the invoice
      const result = await sendInvoice(id, base64Pdf, options.message)

      spinner.succeed('Invoice sent!')
      console.log(chalk.green(`\nEmail sent to ${invoice.clientEmail}`))
      console.log(chalk.gray(`Email ID: ${result.emailId}`))
    } catch (error) {
      spinner.fail('Failed to send invoice')
      if (error instanceof ApiError) {
        console.log(chalk.red(`\n${error.message}`))
        if (error.status === 404) {
          console.log(chalk.gray('The invoice ID may be incorrect.'))
        }
      } else {
        console.log(chalk.red('\nAn unexpected error occurred.'))
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
