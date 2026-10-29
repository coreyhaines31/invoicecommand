// In-memory stand-in for the Drizzle query builder, enough for the v1 invoice
// routes. Pair it with the drizzle-orm and schema mocks below so `where`
// predicates are evaluated against real rows, which is what makes the
// cross-user isolation tests meaningful.

export type Row = Record<string, unknown>
type Predicate = (row: Row) => boolean
type Column = { key: string }

export const drizzleOrmMock = {
  eq: (col: Column, value: unknown): Predicate => (row) => row[col.key] === value,
  and: (...preds: Predicate[]): Predicate => (row) => preds.every((p) => p(row)),
  isNull: (col: Column): Predicate => (row) => row[col.key] == null,
  inArray: (col: Column, values: unknown[]): Predicate => (row) => values.includes(row[col.key]),
  desc: (col: Column) => col,
}

export const schemaMock = {
  invoices: new Proxy({} as Record<string, Column>, { get: (_, key) => ({ key: String(key) }) }),
}

export function createFakeDb() {
  const rows: Row[] = []

  class Query implements PromiseLike<Row[]> {
    private predicate: Predicate = () => true
    private projection?: Record<string, Column>
    private mutate?: (matches: Row[]) => Row[]
    private max = Infinity
    private skip = 0

    constructor(opts: { projection?: Record<string, Column>; mutate?: (matches: Row[]) => Row[] } = {}) {
      this.projection = opts.projection
      this.mutate = opts.mutate
    }

    from() { return this }
    where(predicate: Predicate) { this.predicate = predicate; return this }
    orderBy() { return this }
    limit(n: number) { this.max = n; return this }
    offset(n: number) { this.skip = n; return this }
    returning(projection?: Record<string, Column>) {
      if (projection) this.projection = projection
      return this
    }

    private run(): Row[] {
      let matches = rows.filter(this.predicate)
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
    update: () => ({
      set: (values: Row) =>
        new Query({
          mutate: (matches) => {
            matches.forEach((r) => Object.assign(r, values))
            return matches
          },
        }),
    }),
    delete: () =>
      new Query({
        mutate: (matches) => {
          matches.forEach((r) => rows.splice(rows.indexOf(r), 1))
          return matches
        },
      }),
    insert: () => ({
      values: (values: Row) => {
        const row = { id: crypto.randomUUID(), status: 'draft', ...values }
        rows.push(row)
        return new Query({ mutate: (matches) => matches.filter((r) => r === row) })
      },
    }),
  }

  return { db, rows }
}
