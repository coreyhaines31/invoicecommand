import { Command } from 'commander'
import chalk from 'chalk'
import ora from 'ora'
import { writeFile } from 'fs/promises'
import { getInvoice, downloadPdf, ApiError } from '../lib/api-client.js'

export const exportCommand = new Command('export')
  .description('Export an invoice as PDF')
  .argument('<id>', 'Invoice ID')
  .option('-o, --output <path>', 'Output file path')
  .action(async (id, options) => {
    const spinner = ora('Fetching invoice...').start()

    try {
      // Get invoice details for filename
      const { data: invoice } = await getInvoice(id)

      spinner.text = 'Generating PDF...'

      // Download PDF
      const pdfBuffer = await downloadPdf(id)

      // Determine output path
      const cleanNumber = invoice.invoiceNumber.replace(/[^\w\-]/g, '_').slice(0, 50)
      const outputPath = options.output || `invoice-${cleanNumber}.pdf`

      spinner.text = 'Saving file...'

      await writeFile(outputPath, Buffer.from(pdfBuffer))

      spinner.succeed('PDF exported')
      console.log(chalk.green(`\nSaved to: ${outputPath}`))
      console.log(chalk.gray(`Invoice: ${invoice.invoiceNumber}`))
      console.log(chalk.gray(`Client:  ${invoice.clientName}`))
      console.log(chalk.gray(`Total:   ${formatCurrency(invoice.total, invoice.currency)}`))
    } catch (error) {
      spinner.fail('Failed to export invoice')
      if (error instanceof ApiError) {
        console.log(chalk.red(`\n${error.message}`))
        if (error.status === 404) {
          console.log(chalk.gray('The invoice ID may be incorrect.'))
        }
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
