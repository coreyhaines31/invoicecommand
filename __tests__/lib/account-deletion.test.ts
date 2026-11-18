/**
 * @jest-environment node
 */
import { getTableConfig, PgTable } from 'drizzle-orm/pg-core'
import { createFakeDb } from '../helpers/fake-db'

const fake = createFakeDb()

jest.mock('drizzle-orm', () => jest.requireActual('../helpers/fake-db').drizzleOrmMock)
jest.mock('@/lib/db/schema', () => {
  const { schemaMock } = jest.requireActual('../helpers/fake-db')
  // Same shape as the helper's tables: columns resolve to { key }, and
  // __tableName tells the fake db which rows to use.
  const verification = new Proxy({}, {
    get: (_, key) => (key === '__tableName' ? 'verification' : { key: String(key) }),
  })
  return { ...schemaMock, verification }
})
jest.mock('@/lib/db', () => ({ get db() { return fake.db } }))

import { USER_DATA_CLEANUP, deleteUserData } from '@/lib/account-deletion'

const realSchema: Record<string, unknown> = jest.requireActual('@/lib/db/schema')
const tables = Object.values(realSchema).filter((value): value is PgTable => value instanceof PgTable)
const configs = new Map(tables.map((table) => [getTableConfig(table).name, getTableConfig(table)]))

// A table is cleaned up by the database when it has a cascading foreign key to
// user, directly or through another table that does.
function cascadesFromUser(name: string, seen = new Set<string>()): boolean {
  if (seen.has(name)) return false
  seen.add(name)
  const config = configs.get(name)
  if (!config) return false
  return config.foreignKeys.some((fk) => {
    if (fk.onDelete !== 'cascade') return false
    const parent = getTableConfig(fk.reference().foreignTable).name
    return parent === 'user' || cascadesFromUser(parent, seen)
  })
}

describe('USER_DATA_CLEANUP', () => {
  it('lists every table in the schema except user', () => {
    const names = [...configs.keys()].filter((name) => name !== 'user').sort()
    expect(Object.keys(USER_DATA_CLEANUP).sort()).toEqual(names)
  })

  it.each(Object.entries(USER_DATA_CLEANUP))('%s is cleaned up by %s', (name, cleanup) => {
    expect(cascadesFromUser(name)).toBe(cleanup === 'cascade')
  })
})

describe('deleteUserData', () => {
  beforeEach(() => {
    fake.tables.verification = [
      { id: 'v1', identifier: 'reset-password:abc', value: 'user-a' },
      { id: 'v2', identifier: 'reset-password:def', value: 'user-b' },
    ]
  })

  it("deletes the user's rows in tables without a cascading foreign key", async () => {
    await deleteUserData('user-a')
    expect(fake.tables.verification).toEqual([{ id: 'v2', identifier: 'reset-password:def', value: 'user-b' }])
  })

  it('does not touch tables the database cascades', async () => {
    fake.rows.push({ id: 'inv-a', userId: 'user-a' })
    fake.tables.userProfiles = [{ id: 'p-a', userId: 'user-a', stripeAccountId: 'acct_a' }]

    await deleteUserData('user-a')

    expect(fake.rows).toHaveLength(1)
    expect(fake.tables.userProfiles).toHaveLength(1)
  })
})
