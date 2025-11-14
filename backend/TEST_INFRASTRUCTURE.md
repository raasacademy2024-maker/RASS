# Backend Test Infrastructure

## Overview

This test infrastructure provides comprehensive testing capabilities for the RASS Academy LMS backend, focusing on unit tests for core business logic, authentication, validation, and utilities.

## Tech Stack

- **Jest**: Testing framework
- **Node.js ES Modules**: Full ES module support
- **Isolated Unit Tests**: No database dependency for faster execution

## Setup

Dependencies are already installed. If you need to reinstall:

```bash
cd backend
npm install
```

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in watch mode (for development)
```bash
npm run test:watch
```

### Run tests with coverage report
```bash
npm run test:coverage
```

## Test Results

✅ **All 40 tests passing**

```
Test Suites: 3 passed, 3 total
Tests:       40 passed, 40 total
```

## Test Structure

```
backend/
├── __tests__/
│   ├── unit/                 # Unit tests for core logic
│   │   ├── auth.test.js      # Authentication & JWT tests (8 tests)
│   │   ├── validation.test.js # Input validation tests (15 tests)
│   │   └── utilities.test.js  # Utility function tests (17 tests)
│   └── utils/
│       └── testHelper.js     # Test utilities (optional DB helpers)
├── jest.config.js            # Jest configuration
└── package.json              # Test scripts configuration
```

## Test Coverage

### Unit Tests (40 tests)

#### Authentication Logic (8 tests)
- ✅ JWT token generation and verification
- ✅ Password hashing with bcrypt
- ✅ Password comparison
- ✅ Token expiration handling

#### Validation Logic (15 tests)
- ✅ Email format validation
- ✅ Password strength validation
- ✅ Role validation (student, instructor, admin)
- ✅ Course level validation (beginner, intermediate, advanced)
- ✅ Price validation (non-negative numbers)
- ✅ Duration validation
- ✅ Phone number validation (10 digits)

#### Utility Functions (17 tests)
- ✅ Slugify for URL-friendly strings
- ✅ Progress percentage calculation
- ✅ Date calculations and comparisons
- ✅ Enrollment status determination
- ✅ Price formatting (INR)

## Writing New Tests

### Unit Test Example

```javascript
describe('Feature Name', () => {
  describe('Specific Functionality', () => {
    test('should do something', () => {
      const result = someFunction(input);
      expect(result).toBe(expected);
    });

    test('should handle edge case', () => {
      const result = someFunction(edgeCaseInput);
      expect(result).toBe(expectedEdgeCase);
    });
  });
});
```

### Testing Best Practices

1. **Descriptive Names**: Use clear, descriptive test names that explain what is being tested
2. **Arrange-Act-Assert**: Structure tests with setup, action, and verification
3. **Edge Cases**: Test both success scenarios and edge cases/failures
4. **Isolated Tests**: Each test should be independent
5. **Fast Execution**: Unit tests should run quickly (< 1 second per test suite)

## Test Configuration

### jest.config.js
- **testEnvironment**: 'node' - For Node.js environment
- **testMatch**: Finds all `*.test.js` files in `__tests__` directory
- **timeout**: 10 seconds per test
- **forceExit**: Ensures clean exit after tests complete
- **Coverage**: Tracks coverage for models, routes, and middleware

## CI/CD Integration

The test suite is designed to run in CI/CD pipelines:

### GitHub Actions Example
```yaml
name: Backend Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      - name: Install dependencies
        run: cd backend && npm install
      - name: Run tests
        run: cd backend && npm test
      - name: Generate coverage report
        run: cd backend && npm run test:coverage
```

## Future Enhancements

### Integration Tests
For integration testing with real database:
1. Set up test database (separate from production)
2. Add `TEST_MONGO_URI` environment variable
3. Create integration tests in `__tests__/integration/`
4. Test API endpoints with supertest

### Areas for Expansion
- **Assignment Logic**: Test assignment creation, submission, grading
- **Quiz Logic**: Test quiz auto-grading algorithms
- **Progress Tracking**: Test progress calculation across modules
- **Batch Management**: Test batch enrollment and filtering logic
- **Notification Logic**: Test notification creation and delivery
- **Certificate Generation**: Test certificate creation logic
- **Payment Verification**: Test payment webhook handling

## Environment Variables for Testing

Tests use fallback values, no environment setup required for unit tests:

```bash
# Optional for integration tests
TEST_MONGO_URI=mongodb://localhost:27017/rass_test
JWT_SECRET=test-secret-key
```

## Troubleshooting

### Tests failing unexpectedly
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check Node.js version (requires v18+)
- Ensure all dependencies are installed

### Slow test execution
- Unit tests should be fast (< 5 seconds total)
- If tests are slow, check for synchronous operations
- Consider splitting large test suites

### Import errors
- Ensure `"type": "module"` is set in package.json
- Use `.js` extension in all imports
- Use `NODE_OPTIONS=--experimental-vm-modules` for Jest

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Jest ES Modules](https://jestjs.io/docs/ecmascript-modules)
- [Testing Best Practices](https://testingjavascript.com/)

## Summary

✅ **Test Infrastructure Complete**
- 40 passing unit tests
- Fast execution (< 2 seconds)
- Zero dependencies on external services
- Ready for CI/CD integration
- Extensible for future test additions

The test infrastructure provides a solid foundation for maintaining code quality and preventing regressions in the RASS Academy LMS backend.
