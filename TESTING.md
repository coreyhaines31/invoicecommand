# Testing

Invoice Command has two test suites:

- **Jest** with React Testing Library for libraries, hooks, stores, components and route handlers. Tests live in `__tests__/`.
- **e2e** ([tester.army/e2e](https://tester.army/e2e)) drives a real browser. Tests live in `tests/`.

CI runs both on every PR (`.github/workflows/jest.yml` and `.github/workflows/e2e.yml`).

## Commands

```bash
npm test               # run the Jest suite
npm run test:watch     # Jest in watch mode
npm run test:coverage  # Jest with a coverage report in coverage/
npm run test:ci        # what CI runs: jest --ci --coverage --maxWorkers=2
npm run test:e2e       # e2e browser tests (see below)
```

Run one file or one test name:

```bash
npm test -- __tests__/utils/invoice-numbering.test.ts
npm test -- --testNamePattern="share link"
```

## Jest

### Layout

`__tests__/` mirrors `src/`:

```
__tests__/
├── app/          # pages and client components under src/app
│   └── api/      # route handler tests
├── components/   # src/components (including providers/ and ui/)
├── data/         # SEO page data in src/data
├── helpers/      # shared test helpers (fake-db.ts)
├── hooks/        # src/hooks
├── lib/          # src/lib
├── stores/       # src/stores
└── utils/        # helpers from src/lib/utils.ts
```

Name files `<name>.test.ts` or `<name>.test.tsx`. Jest only picks up files under `__tests__/` (see `testMatch` in `jest.config.js`).

### Configuration

`jest.config.js` uses `next/jest`, so `next.config.ts` and `.env` files load in tests and TypeScript is compiled with SWC. It maps `@/` to `src/`, defaults to the `jsdom` environment, and collects coverage from `src/**`.

Coverage thresholds live in `coverageThreshold` in `jest.config.js`; `test:coverage` and `test:ci` fail when coverage drops below them.

`jest.setup.js` loads `@testing-library/jest-dom` and, under jsdom only, mocks `window.matchMedia`, `IntersectionObserver`, `localStorage` and `sessionStorage`.

### Route handler tests

Route handlers run in Node, not jsdom. Opt in with a docblock at the top of the file:

```ts
/**
 * @jest-environment node
 */
```

Use the in-memory fake database in `__tests__/helpers/fake-db.ts` instead of a real one. `__tests__/app/api/v1-invoice-isolation.test.ts` shows the pattern.

### Component tests

```tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { MyComponent } from '@/components/my-component'

describe('MyComponent', () => {
  it('calls onClick when the button is pressed', () => {
    const handleClick = jest.fn()
    render(<MyComponent onClick={handleClick} />)

    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
```

Prefer `getByRole` and `getByLabelText` over `getByTestId`, and use `waitFor` for async updates.

## e2e

`e2e.config.ts` starts `npm run dev` itself. Agent steps (`agent.act`, `agent.assert`) call a model through the Vercel AI Gateway, so they need `AI_GATEWAY_API_KEY` or a `vercel link`ed project. Run `npx e2e guide` for the full reference.

- Wait for hydration before typing (see `waitForHydration` in `tests/invoice-builder.e2e.ts`). Input typed into server-rendered HTML before React hydrates is silently dropped.
- `.e2e/` is excluded from Tailwind's source scanning in `globals.css`. Without that, e2e's output files trigger dev rebuilds that reset page state mid-test.
- Fork PRs don't receive secrets, so e2e skips there.

## Common issues

- **"Cannot find module '@/...'"**: check `moduleNameMapper` in `jest.config.js`.
- **"window is not defined" in a route test**: add the `@jest-environment node` docblock.
- **Date tests pass locally but fail in CI**: CI runs in UTC. Build dates with explicit components rather than parsing local date strings.
