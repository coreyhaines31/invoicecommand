# Jest tests

This directory holds the Jest suite. Its layout mirrors `src/` (`app/`, `components/`, `hooks/`, `lib/`, `stores/`, and so on), with shared helpers in `helpers/`.

```bash
npm test                                            # run everything
npm test -- __tests__/lib/sentry-redaction.test.ts  # run one file
npm run test:coverage                               # enforce the thresholds in jest.config.js
```

See [TESTING.md](../TESTING.md) for configuration, route handler tests (`@jest-environment node` plus `helpers/fake-db.ts`), and the e2e suite in `tests/`.
