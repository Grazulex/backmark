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

**Overall Coverage: 27.33%**
**Utils Module: 81.23%** ✅ (Goal: 80%+ ACHIEVED!)

### Test Statistics
- 📊 **140 total tests**
- ✅ **127 passing**
- ⏭️ **13 skipped** (features not yet implemented)
- ❌ **0 failing**

### Unit Tests (120 tests)

- ✅ **StatsCalculator** (`utils/stats.ts`) - **90.17% coverage**
  - Summary statistics (total, completion rate, status breakdown)
  - Milestone progress tracking
  - Team activity analysis with AI detection
  - AI collaboration metrics
  - Alert detection (blocked, critical, overdue)
  - Filtering by milestone and date range
  - Helper functions (progress bar, formatters)

- ✅ **TaskValidator** (`utils/validators.ts`) - **81.11% coverage**
  - Blocking validations (subtasks, dependencies, blocked_by, acceptance criteria)
  - Warnings (AI review for AI-assigned tasks)
  - Force flag bypass
  - Configuration options respect
  - Edge cases and error handling
  - Formatting functions

- ✅ **Fuzzy Search** (`utils/fuzzy-search.ts`) - **100% coverage**
  - Search by title, description, labels
  - Threshold and maxResults options
  - Case-insensitive matching
  - Partial matches and special characters

- ✅ **Date Utils** (`utils/date.ts`) - **91.3% coverage**
  - Date formatting with patterns
  - Timestamp generation
  - Date validation

- ✅ **Colors & Formatting** (`utils/colors.ts`) - **71.42% coverage**
  - Status and priority colorization
  - Task ID formatting with zero-padding
  - Date formatting
  - Icon definitions

### Integration Tests (20 tests)

- ✅ **Backlog** (`core/backlog.ts`) - **70.83% coverage**
  - Task creation with auto-incrementing IDs
  - Task retrieval by ID
  - Task updates with changelog
  - Filtering by status and priority
  - Configuration management
  - Auto-migration of config

- ✅ **LokiIndexedRepository** - **77.68% coverage**
  - Indexed task operations
  - Performance optimizations for large datasets

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
