// In-memory stand-in for the Drizzle query builder, enough for the v1 invoice
// routes. Pair it with the drizzle-orm and schema mocks below so `where`
// predicates are evaluated against real rows, which is what makes the
// cross-user isolation tests meaningful.

export type Row = Record<string, unknown>
type Predicate = (row: Row) => boolean
type Column = { key: string }

export const drizzleOrmMock = {
  eq: (col: Column, value: unknown): Predicate => (row) => row[col.key] === value,
  // SQL semantics: NULL <> 'x' is not true, so a NULL column never matches.
  ne: (col: Column, value: unknown): Predicate => (row) => row[col.key] != null && row[col.key] !== value,
  or: (...preds: Predicate[]): Predicate => (row) => preds.some((p) => p(row)),
  and: (...preds: Predicate[]): Predicate => (row) => preds.every((p) => p(row)),
  isNull: (col: Column): Predicate => (row) => row[col.key] == null,
  inArray: (col: Column, values: unknown[]): Predicate => (row) => values.includes(row[col.key]),
  desc: (col: Column) => col,
}

const TABLE_NAME = '__tableName'
type Table = Record<string, Column>

function fakeTable(name: string): Table {
  return new Proxy({} as Table, {
    get: (_, key) => (key === TABLE_NAME ? name : { key: String(key) }),
  })
}

export const schemaMock = {
  invoices: fakeTable('invoices'),
  userProfiles: fakeTable('userProfiles'),
}

// `rows` is the invoices table; other tables live in `tables`.
export function createFakeDb() {
  const rows: Row[] = []
  const tables: Record<string, Row[]> = { invoices: rows }
  const tableRows = (table?: Table): Row[] => {
    const name = (table?.[TABLE_NAME] as unknown as string | undefined) ?? 'invoices'
    return (tables[name] ??= [])
  }

  class Query implements PromiseLike<Row[]> {
    private predicate: Predicate = () => true
    private projection?: Record<string, Column>
    private mutate?: (matches: Row[]) => Row[]
    private source: Row[]
    private max = Infinity
    private skip = 0

    constructor(opts: { projection?: Record<string, Column>; mutate?: (matches: Row[]) => Row[]; source?: Row[] } = {}) {
      this.projection = opts.projection
      this.mutate = opts.mutate
      this.source = opts.source ?? rows
    }

    from(table?: Table) { this.source = tableRows(table); return this }
    where(predicate: Predicate) { this.predicate = predicate; return this }
    orderBy() { return this }
    limit(n: number) { this.max = n; return this }
    offset(n: number) { this.skip = n; return this }
    returning(projection?: Record<string, Column>) {
      if (projection) this.projection = projection
      return this
    }

    private run(): Row[] {
      let matches = this.source.filter(this.predicate)
      if (this.mutate) matches = this.mutate(matches)
      matches = matches.slice(this.skip, this.skip + this.max)
      const projection = this.projection
      if (!projection) return matches.map((r) => ({ ...r }))
      return matches.map((r) =>
        Object.fromEntries(Object.entries(projection).map(([alias, col]) => [alias, r[col.key]]))
      )
    }

    then<T1 = Row[], T2 = never>(
      onFulfilled?: ((value: Row[]) => T1 | PromiseLike<T1>) | null,
      onRejected?: ((reason: unknown) => T2 | PromiseLike<T2>) | null
    ) {
      return Promise.resolve().then(() => this.run()).then(onFulfilled, onRejected)
    }
  }

  const db = {
    select: (projection?: Record<string, Column>) => new Query({ projection }),
    update: (table?: Table) => ({
      set: (values: Row) =>
        new Query({
          source: tableRows(table),
          mutate: (matches) => {
            matches.forEach((r) => Object.assign(r, values))
            return matches
          },
        }),
    }),
    delete: (table?: Table) => {
      const source = tableRows(table)
      return new Query({
        source,
        mutate: (matches) => {
          matches.forEach((r) => source.splice(source.indexOf(r), 1))
          return matches
        },
      })
    },
    insert: (table?: Table) => ({
      values: (values: Row) => {
        const source = tableRows(table)
        const row = { id: crypto.randomUUID(), status: 'draft', ...values }
        source.push(row)
        return new Query({ source, mutate: (matches) => matches.filter((r) => r === row) })
      },
    }),
  }

  return { db, rows, tables }
}
