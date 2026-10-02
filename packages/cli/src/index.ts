#!/usr/bin/env node

import { Command } from 'commander'
import chalk from 'chalk'
import { initCommand } from './commands/init.js'
import { listCommand } from './commands/list.js'
import { newCommand } from './commands/new.js'
import { sendCommand } from './commands/send.js'
import { exportCommand } from './commands/export.js'

const program = new Command()

program
  .name('invoicecommand')
  .description('CLI for Invoice Command - Create, send, and manage invoices')
  .version('1.0.0')

program.addCommand(initCommand)
program.addCommand(listCommand)
program.addCommand(newCommand)
program.addCommand(sendCommand)
program.addCommand(exportCommand)

// Add helpful examples
program.on('--help', () => {
  console.log('')
  console.log(chalk.bold('Examples:'))
  console.log('  $ invoicecommand init                    # Set up API key')
  console.log('  $ invoicecommand list                    # List all invoices')
  console.log('  $ invoicecommand list --type invoice     # List invoices only')
  console.log('  $ invoicecommand list --status paid      # List paid invoices')
  console.log('  $ invoicecommand new -f invoice.yaml     # Create from YAML')
  console.log('  $ invoicecommand send abc-123            # Send invoice by ID')
  console.log('  $ invoicecommand export abc-123 -o inv.pdf  # Download PDF')
  console.log('')
  console.log(chalk.bold('Getting Started:'))
  console.log('  1. Create an API key at https://invoicecommand.com/dashboard/settings')
  console.log('  2. Run: invoicecommand init')
  console.log('  3. Start creating invoices!')
  console.log('')
})

program.parse()
