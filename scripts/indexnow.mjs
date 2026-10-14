#!/usr/bin/env node
// Tells IndexNow engines (Bing, Yandex, Seznam, Naver; Yahoo and DuckDuckGo use
// Bing's index) that pages changed, so they recrawl them soon.
//
// Usage:
//   node scripts/indexnow.mjs                        # every URL in the live sitemap
//   node scripts/indexnow.mjs /invoice-templates/plumber https://invoicecommand.com/blog
//
// The key must match public/<key>.txt, which IndexNow fetches to verify ownership.

const SITE = 'https://invoicecommand.com'
const KEY = '0079327f94e5babff26a1c26c4518260'

async function sitemapUrls() {
  const response = await fetch(`${SITE}/sitemap.xml`)
  if (!response.ok) throw new Error(`Fetching the sitemap failed: ${response.status}`)
  const xml = await response.text()
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])
}

async function main() {
  const args = process.argv.slice(2)
  const urls = args.length
    ? args.map((u) => (u.startsWith('http') ? u : `${SITE}${u}`))
    : await sitemapUrls()

  if (!urls.length) throw new Error('No URLs to submit')

  const response = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({
      host: new URL(SITE).host,
      key: KEY,
      keyLocation: `${SITE}/${KEY}.txt`,
      urlList: urls,
    }),
  })

  // 200 = accepted, 202 = accepted while the key is still being verified
  if (response.status !== 200 && response.status !== 202) {
    throw new Error(`IndexNow returned ${response.status}: ${await response.text()}`)
  }
  console.log(`Submitted ${urls.length} URLs (HTTP ${response.status})`)
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
