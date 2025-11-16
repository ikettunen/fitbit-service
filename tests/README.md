# Fitbit Service Test Suite

Comprehensive test suite for the Fitbit Service (S6) using Jest and Supertest.

## Test Coverage

### Test Suites

| Suite ID | Name | Tests | File |
|----------|------|-------|------|
| S6.TS1 | Health Endpoint Tests | 1 | health.test.js |
| S6.TS2 | API Key Management Tests | 5 | api-key-management.test.js |
| S6.TS3 | Patient Summary Tests | 4 | patient-summary.test.js |
| S6.TS4 | Batch Operations Tests | 3 | batch-operations.test.js |
| S6.TS5 | Demo Endpoints Tests | 2 | demo-endpoints.test.js |
| S6.TS6 | Fitbit API Integration Tests | 4 | fitbit-integration.test.js |
| **Total** | **6 Test Suites** | **19 Tests** | |

## Installation

```bash
# Install dependencies
npm install
```

## Running Tests

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch

# Generate full report
npm run test:report
```

## Test Reports

Reports are generated in the `reports/` folder:
- **test-report.html** - Interactive HTML report
- **test-report-natural-language.txt** - Human-readable report
- **test-report-natural-language.md** - Markdown report
- **coverage/** - Code coverage reports

## What's Tested

### ✓ Health Checks
- Service availability

### ✓ API Key Management
- Link API key to patient
- Unlink API key
- Field validation
- Success responses

### ✓ Patient Summary
- Health data retrieval
- Steps, heart rate, sleep data
- Unlinked patient handling
- Invalid patient handling

### ✓ Batch Operations
- Multiple patient data retrieval
- Array validation
- Partial failure handling

### ✓ Demo Endpoints
- Demo data linking
- DEMO_KEY usage

### ✓ Fitbit API Integration
- API call correctness
- Response parsing
- Error handling
- Rate limiting

## Technology

- **Framework:** Express.js
- **Testing:** Jest + Supertest
- **Mocking:** Jest mocks
- **Coverage:** Jest coverage
