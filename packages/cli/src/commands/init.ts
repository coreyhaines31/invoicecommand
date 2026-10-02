import { Command } from 'commander'
import inquirer from 'inquirer'
import chalk from 'chalk'
import ora from 'ora'
import { setApiKey, setBaseUrl, getConfigPath } from '../lib/config.js'

export const initCommand = new Command('init')
  .description('Configure your Invoice Command API key')
  .option('--key <key>', 'API key (starts with sk_live_)')
  .option('--url <url>', 'Base URL (for self-hosted instances)')
  .action(async (options) => {
    console.log(chalk.bold('\nInvoice Command CLI Setup\n'))

    let apiKey = options.key
    let baseUrl = options.url

    if (!apiKey) {
      const answers = await inquirer.prompt([
        {
          type: 'password',
          name: 'apiKey',
          message: 'Enter your API key:',
          mask: '*',
          validate: (input) => {
            if (!input) return 'API key is required'
            if (!input.startsWith('sk_live_')) return 'API key must start with sk_live_'
            return true
          },
        },
      ])
      apiKey = answers.apiKey
    }

    if (!baseUrl) {
      const answers = await inquirer.prompt([
        {
          type: 'input',
          name: 'baseUrl',
          message: 'Base URL (press Enter for default):',
          default: 'https://invoicecommand.com',
        },
      ])
      baseUrl = answers.baseUrl
    }

    const spinner = ora('Validating API key...').start()

    try {
      // Test the API key
      const response = await fetch(`${baseUrl}/api/v1/invoices?limit=1`, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      })

      if (!response.ok) {
        spinner.fail('Invalid API key')
        if (response.status === 401) {
          console.log(chalk.red('\nThe API key is invalid or has been revoked.'))
        } else if (response.status === 429) {
          console.log(chalk.red('\nRate limit exceeded. Please try again later.'))
        } else {
          console.log(chalk.red(`\nAPI returned status ${response.status}`))
        }
        process.exit(1)
      }

      setApiKey(apiKey)
      if (baseUrl !== 'https://invoicecommand.com') {
        setBaseUrl(baseUrl)
      }

      spinner.succeed('API key validated and saved')
      console.log(chalk.gray(`\nConfig saved to: ${getConfigPath()}`))
      console.log(chalk.green('\nYou\'re all set! Try running:'))
      console.log(chalk.cyan('  invoicecommand list'))
    } catch (error) {
      spinner.fail('Failed to validate API key')
      console.log(chalk.red('\nCould not connect to the API.'))
      if (error instanceof Error) {
        console.log(chalk.gray(error.message))
      }
      process.exit(1)
    }
  })
