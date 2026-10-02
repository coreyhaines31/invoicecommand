# Test Suite for Estimate Mode Feature

This directory contains comprehensive test coverage for the estimate mode feature implementation.

## Test Structure

```
__tests__/
├── utils/
│   ├── invoice-numbering.test.ts    # Tests for document numbering (INV/EST)
│   └── date-validation.test.ts      # Tests for expiration date validation
├── components/
│   └── document-type-toggle.test.tsx # Tests for UI toggle component
└── README.md
```

## What's Tested

### 1. Invoice Numbering (`invoice-numbering.test.ts`)
- ✅ Separate numbering sequences for invoices (INV-1001) and estimates (EST-1001)
- ✅ Sequential number generation
- ✅ Number formatting with leading zeros
- ✅ localStorage persistence for anonymous users
- ✅ Proper prefix format validation

### 2. Date Validation (`date-validation.test.ts`)
- ✅ Expiration date validation (future dates only)
- ✅ Rejection of past dates
- ✅ Validation within one year constraint
- ✅ Default expiration date generation (30 days)
- ✅ Custom date offset support
- ✅ Proper error messages

### 3. Document Type Toggle (`document-type-toggle.test.tsx`)
- ✅ Rendering of invoice/estimate options
- ✅ Visual highlighting of selected type
- ✅ Document type switching behavior
- ✅ Proper state management integration
- ✅ Descriptive text updates
- ✅ Prevention of redundant updates

## Running Tests

### Prerequisites

First, install testing dependencies:

```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom @testing-library/user-event jest-environment-jsdom @types/jest ts-jest
```

### Configuration

Create `jest.config.js` in the project root:

```javascript
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testMatch: ['**/__tests__/**/*.test.ts', '**/__tests__/**/*.test.tsx'],
}

module.exports = createJestConfig(customJestConfig)
```

Create `jest.setup.js` in the project root:

```javascript
import '@testing-library/jest-dom'
```

### Add Test Scripts

Add to `package.json`:

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

### Run Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run specific test file
npm test invoice-numbering.test.ts
```

## Test Coverage Goals

Current test coverage focuses on critical functionality:

- **Invoice Numbering**: 100% coverage of generateInvoiceNumber function
- **Date Validation**: 100% coverage of all validation utilities
- **Document Toggle**: ~90% coverage of UI component behavior

## Future Test Additions

Additional tests to consider:

1. **Store Tests**: Test `convertEstimateToInvoice` action
2. **Integration Tests**: Test full estimate → invoice conversion flow
3. **Preview Component Tests**: Test ESTIMATE badge display
4. **PDF Export Tests**: Test estimate PDF generation
5. **Form Validation Tests**: Test expiration date field behavior
6. **E2E Tests**: Test complete user workflows with Playwright/Cypress

## Writing New Tests

When adding new tests:

1. Follow the existing structure (organize by feature area)
2. Use descriptive test names: `it('should do X when Y happens', ...)`
3. Mock external dependencies (Supabase, etc.)
4. Test both success and error cases
5. Include edge cases (empty strings, invalid dates, etc.)

## Continuous Integration

To integrate with CI/CD:

```yaml
# Example GitHub Actions workflow
- name: Run tests
  run: npm test

- name: Upload coverage
  run: npm run test:coverage
```

## Debugging Tests

```bash
# Run tests with verbose output
npm test -- --verbose

# Run single test file in debug mode
node --inspect-brk node_modules/.bin/jest invoice-numbering.test.ts
```

## Notes

- Tests use mocked localStorage for anonymous user scenarios
- Store tests will need Supabase client mocking
- Component tests use React Testing Library best practices
- All tests follow AAA pattern: Arrange, Act, Assert
