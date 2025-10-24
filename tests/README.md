# Backmark Tests

This directory contains the test suite for Backmark.

## Structure

- `unit/` - Unit tests for individual functions and classes
- `integration/` - Integration tests for complete workflows
- `fixtures/` - Test data and mock files

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

## Test Coverage

Currently tested components:

### Unit Tests

- ✅ **StatsCalculator** (`utils/stats.ts`) - Project statistics and analytics
  - Summary statistics (total, completion rate, status breakdown)
  - Milestone progress tracking
  - Team activity analysis
  - AI collaboration metrics
  - Alert detection
  - Filtering by milestone and date range

- ✅ **TaskValidator** (`utils/validators.ts`) - Task validation system
  - Blocking validations (subtasks, dependencies, blocked_by, acceptance criteria)
  - Warnings (AI review, date mismatches)
  - Force flag bypass
  - Configuration options

### Integration Tests

- ⏭️ **Task CRUD operations** - To be implemented
- ⏭️ **Search functionality** - To be implemented
- ⏭️ **Board operations** - To be implemented

## Skipped Tests

Some tests are currently skipped (`.skip`) because the features are not yet fully implemented:

- Date validation warnings (early/late/quick close)
- Parent task suggestions
- Unblocked task notifications
- Non-existent task ID validation

## Writing Tests

Tests use Vitest framework. Example:

```typescript
import { describe, it, expect } from 'vitest';

describe('MyFunction', () => {
  it('should do something', () => {
    const result = myFunction('input');
    expect(result).toBe('expected');
  });
});
```

## Coverage Goals

Target: 80% coverage for critical paths
- Core business logic: validators, stats, task operations
- CLI commands: basic happy path testing
- Utils: comprehensive unit testing
