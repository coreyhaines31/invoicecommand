import Conf from 'conf'

type ConfigSchema = {
  apiKey: string
  baseUrl: string
}

const config = new Conf<ConfigSchema>({
  projectName: 'invoicecommand',
  defaults: {
    apiKey: '',
    baseUrl: 'https://invoicecommand.com',
  },
})

export function getApiKey(): string {
  return config.get('apiKey')
}

export function setApiKey(key: string): void {
  config.set('apiKey', key)
}

export function getBaseUrl(): string {
  return config.get('baseUrl')
}

export function setBaseUrl(url: string): void {
  config.set('baseUrl', url)
}

export function clearConfig(): void {
  config.clear()
}

export function getConfigPath(): string {
  return config.path
}
