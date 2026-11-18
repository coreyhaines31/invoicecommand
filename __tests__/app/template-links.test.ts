/**
 * Hard-coded profession template links must point at a real profession page.
 * The template hubs once linked to slugs that don't exist, which 404 (#61).
 */
import fs from 'node:fs'
import path from 'node:path'
import { professionSlugs } from '@/data/professions-expanded'

const APP_DIR = path.join(__dirname, '../../src/app')
const LINK_RE = /\/(invoice|estimate)-templates\/([a-z0-9-]+)(?=["'`?#])/g

function sourceFiles(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) return sourceFiles(full)
    return /\.(tsx?|mdx?)$/.test(entry.name) ? [full] : []
  })
}

const links = sourceFiles(APP_DIR).flatMap((file) =>
  Array.from(fs.readFileSync(file, 'utf8').matchAll(LINK_RE), (m) => ({
    file: path.relative(APP_DIR, file),
    href: m[0],
    slug: m[2],
  }))
)

describe('hard-coded profession template links', () => {
  it('finds the hub page links', () => {
    expect(links.some((l) => l.file === path.join('invoice-templates', 'page.tsx'))).toBe(true)
    expect(links.some((l) => l.file === path.join('estimate-templates', 'page.tsx'))).toBe(true)
  })

  it('only links to existing profession slugs', () => {
    const known = new Set(professionSlugs)
    const broken = links.filter((l) => !known.has(l.slug)).map((l) => `${l.file}: ${l.href}`)
    expect(broken).toEqual([])
  })
})
