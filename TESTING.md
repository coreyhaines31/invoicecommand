# Testing Infrastructure for Invoice Command

## Overview

This document provides a comprehensive guide to the testing infrastructure set up for Invoice Command. The project uses **Jest** as the test runner with **React Testing Library** for component testing.

## Quick Start

```bash
# Run all tests
npm test

# Run tests in watch mode (for development)
npm run test:watch

# Generate coverage report
npm run test:coverage

# Run tests in CI mode
npm run test:ci
```

## Current Test Coverage

**Baseline Coverage (as of setup):**
- Statements: 3.6%
- Branches: 2.38%
- Functions: 3.42%
- Lines: 3.57%

**Coverage Thresholds:**
- Statements: 3%
- Branches: 2%
- Functions: 3%
- Lines: 3%

## Test Structure

```
__tests__/
├── components/
│   └── document-type-toggle.test.tsx
├── utils/
│   ├── invoice-numbering.test.ts
│   └── date-validation.test.ts
└── README.md
```

## Existing Tests (34 tests passing)

### 1. **Invoice Numbering Tests** (`__tests__/utils/invoice-numbering.test.ts`)
- Tests document number generation for invoices (INV-1001) and estimates (EST-1001)
- Validates sequential numbering
- Tests localStorage persistence for anonymous users
- Verifies proper prefix formatting

### 2. **Date Validation Tests** (`__tests__/utils/date-validation.test.ts`)
- Tests expiration date validation (estimates only)
- Validates future date requirements
- Tests date range constraints (within 1 year)
- Verifies default expiration date generation (30 days)
- Tests error messaging for invalid dates

### 3. **Document Type Toggle Tests** (`__tests__/components/document-type-toggle.test.tsx`)
- Tests UI rendering for invoice/estimate toggle
- Validates visual highlighting of selected type
- Tests document type switching behavior
- Verifies Zustand store integration
- Tests descriptive text updates

## Configuration Files

### `jest.config.js`
- Next.js integration via `next/jest`
- TypeScript support via `ts-jest`
- Path aliases configured (`@/` → `src/`)
- Coverage collection from `src/**/*` files
- Excludes `.next/`, `node_modules/`, test files from coverage

### `jest.setup.js`
Browser API mocks for JSDOM environment:
- `window.matchMedia` - for responsive design tests
- `IntersectionObserver` - for visibility tests
- `localStorage` / `sessionStorage` - for storage tests

## Writing New Tests

### Test File Naming
- Component tests: `__tests__/components/[component-name].test.tsx`
- Utility tests: `__tests__/utils/[util-name].test.ts`
- Hook tests: `__tests__/hooks/[hook-name].test.ts`
- Store tests: `__tests__/stores/[store-name].test.ts`

### Example Component Test

```tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { MyComponent } from '@/components/my-component'

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })

  it('should handle click events', () => {
    const handleClick = jest.fn()
    render(<MyComponent onClick={handleClick} />)

    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
```

### Example Utility Test

```typescript
import { myUtilFunction } from '@/lib/utils'

describe('myUtilFunction', () => {
  it('should return expected value', () => {
    const result = myUtilFunction('input')
    expect(result).toBe('expected')
  })

  it('should handle edge cases', () => {
    expect(myUtilFunction('')).toBe('default')
    expect(myUtilFunction(null)).toBe('default')
  })
})
```

## Priority Areas for Test Expansion

Based on the current codebase, here are the recommended priorities for expanding test coverage:

### High Priority (Core Functionality)
1. **Invoice Store** (`src/stores/invoice-store.ts`)
   - Test all Zustand store actions
   - Test `convertEstimateToInvoice` function
   - Test state updates and persistence
   - Current coverage: 6.95%

2. **Invoice Form Component** (`src/components/invoice-form.tsx`)
   - Test form validation
   - Test line item CRUD operations
   - Test calculation logic
   - Test voice command integration
   - Current coverage: 0%

3. **Invoice Preview Components**
   - Test Modern/Classic/Minimal templates
   - Test PDF generation triggers
   - Test data rendering
   - Current coverage: 0%

4. **Utils Library** (`src/lib/utils.ts`)
   - Expand voice usage tracking tests
   - Test invoice number generation for authenticated users
   - Current coverage: 49.12%

### Medium Priority (User Features)
5. **Payment Integration** (`src/components/payment/`)
   - Test Stripe payment flow
   - Test payment button states
   - Test error handling
   - Current coverage: 0%

6. **Authentication Forms** (`src/components/auth/`)
   - Test login/signup validation
   - Test error states
   - Test redirect logic
   - Current coverage: 0%

7. **Dashboard Components** (`src/components/dashboard/`)
   - Test invoice list rendering
   - Test filtering/sorting
   - Test CRUD operations
   - Current coverage: 0%

### Lower Priority (Supporting Features)
8. **Email Service** (`src/lib/email-service.ts`)
   - Mock Resend API calls
   - Test email template generation
   - Current coverage: 0%

9. **PDF Generator** (`src/lib/pdf-generator.ts`)
   - Test PDF generation logic
   - Test template rendering
   - Current coverage: 0%

10. **Hooks** (`src/hooks/`)
    - Test custom React hooks
    - Mock external dependencies
    - Current coverage: 0%

## Testing Best Practices

### 1. Follow the AAA Pattern
- **Arrange**: Set up test data and mocks
- **Act**: Execute the code being tested
- **Assert**: Verify the expected outcome

### 2. Mock External Dependencies
```typescript
// Mock Supabase
jest.mock('@/lib/supabase', () => ({
  createBrowserSupabaseClient: jest.fn(() => ({
    from: jest.fn(),
    auth: jest.fn(),
  })),
}))
```

### 3. Use Testing Library Queries
- Prefer `getByRole`, `getByLabelText` over `getByTestId`
- Use `waitFor` for async operations
- Use `userEvent` for more realistic interactions

### 4. Test User Behavior, Not Implementation
- Focus on what the user sees and does
- Avoid testing internal state unless necessary
- Test accessibility (ARIA labels, keyboard navigation)

### 5. Keep Tests Isolated
- Each test should be independent
- Clear mocks between tests with `beforeEach`
- Don't rely on test execution order

## Continuous Integration

The test suite is ready for CI/CD integration. Use the `test:ci` script for optimized CI performance:

```yaml
# GitHub Actions example
- name: Run tests
  run: npm run test:ci

- name: Upload coverage
  uses: codecov/codecov-action@v3
  with:
    files: ./coverage/lcov.info
```

## Coverage Goals

**Short-term goals (3 months):**
- Core store functions: 80%
- Core utility functions: 80%
- Main components: 60%
- Overall project: 40%

**Long-term goals (6 months):**
- Core store functions: 95%
- Core utility functions: 95%
- Main components: 80%
- Overall project: 70%

## Debugging Tests

### Run specific test file
```bash
npm test invoice-numbering.test.ts
```

### Run tests matching a pattern
```bash
npm test -- --testNamePattern="should validate"
```

### Run with verbose output
```bash
npm test -- --verbose
```

### Debug in VS Code
Add to `.vscode/launch.json`:
```json
{
  "type": "node",
  "request": "launch",
  "name": "Jest Debug",
  "program": "${workspaceFolder}/node_modules/.bin/jest",
  "args": ["--runInBand", "--no-cache"],
  "console": "integratedTerminal",
  "internalConsoleOptions": "neverOpen"
}
```

## Common Issues and Solutions

### Issue: "Cannot find module '@/...'"
**Solution**: Check that `jest.config.js` has the correct `moduleNameMapper` configuration.

### Issue: "matchMedia is not defined"
**Solution**: Ensure `jest.setup.js` includes the matchMedia mock.

### Issue: "localStorage is not defined"
**Solution**: Ensure `jest.setup.js` includes the localStorage mock.

### Issue: Tests pass locally but fail in CI
**Solution**: Check timezone differences. Use consistent date parsing (see `src/lib/utils.ts` date validation functions).

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library Documentation](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Library Cheatsheet](https://testing-library.com/docs/react-testing-library/cheatsheet)
- [Common Testing Mistakes](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

## Next Steps

1. **Add E2E Testing** - Consider Playwright or Cypress for end-to-end tests
2. **Add Visual Regression Testing** - Use Percy or Chromatic for visual testing
3. **Add Performance Testing** - Use Lighthouse CI for performance monitoring
4. **Increase Coverage** - Start with high-priority areas listed above
5. **Add Integration Tests** - Test full user workflows (create invoice → send → pay)
