import { describe, expect, it } from 'vitest';
import type { Task } from '../../src/types/task';
import { searchTasks } from '../../src/utils/fuzzy-search';

describe('fuzzy-search.ts', () => {
  const createMockTask = (overrides: Partial<Task> = {}): Task => ({
    id: 1,
    title: 'Test Task',
    description: 'Test Description',
    status: 'To Do',
    priority: 'medium',
    created_date: new Date().toISOString(),
    updated_date: new Date().toISOString(),
    assignees: [],
    labels: [],
    subtasks: [],
    dependencies: [],
    blocked_by: [],
    acceptance_criteria: [],
    changelog: [],
    ...overrides,
  });

  describe('searchTasks', () => {
    it('should find tasks by title', () => {
      const tasks = [
        createMockTask({ id: 1, title: 'Implement authentication' }),
        createMockTask({ id: 2, title: 'Add search functionality' }),
        createMockTask({ id: 3, title: 'Fix login bug' }),
      ];

      const results = searchTasks(tasks, 'authentication');
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].id).toBe(1);
    });

    it('should find tasks by description', () => {
      const tasks = [
        createMockTask({ id: 1, title: 'Task 1', description: 'Implement OAuth flow' }),
        createMockTask({ id: 2, title: 'Task 2', description: 'Add JWT tokens' }),
        createMockTask({ id: 3, title: 'Task 3', description: 'Update documentation' }),
      ];

      const results = searchTasks(tasks, 'OAuth');
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].id).toBe(1);
    });

    it('should find tasks by labels', () => {
      const tasks = [
        createMockTask({ id: 1, title: 'Task 1', labels: ['feature', 'backend'] }),
        createMockTask({ id: 2, title: 'Task 2', labels: ['bug', 'frontend'] }),
        createMockTask({ id: 3, title: 'Task 3', labels: ['docs'] }),
      ];

      const results = searchTasks(tasks, 'backend');
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].id).toBe(1);
    });

    it('should return empty array for no matches', () => {
      const tasks = [
        createMockTask({ id: 1, title: 'Task 1' }),
        createMockTask({ id: 2, title: 'Task 2' }),
      ];

      const results = searchTasks(tasks, 'nonexistent');
      expect(results).toEqual([]);
    });

    it('should respect threshold option', () => {
      const tasks = [
        createMockTask({ id: 1, title: 'authentication' }),
        createMockTask({ id: 2, title: 'author' }),
      ];

      // Strict threshold - only exact matches
      const strictResults = searchTasks(tasks, 'authentication', { threshold: 0.1 });
      expect(strictResults.length).toBeLessThanOrEqual(1);

      // Loose threshold - more fuzzy matches
      const looseResults = searchTasks(tasks, 'authentication', { threshold: 0.9 });
      expect(looseResults.length).toBeGreaterThanOrEqual(strictResults.length);
    });

    it('should respect maxResults option', () => {
      const tasks = Array.from({ length: 100 }, (_, i) =>
        createMockTask({ id: i, title: `Task ${i}`, description: 'common description' })
      );

      const results = searchTasks(tasks, 'Task', { maxResults: 10 });
      expect(results.length).toBeLessThanOrEqual(10);
    });

    it('should handle empty task array', () => {
      const results = searchTasks([], 'query');
      expect(results).toEqual([]);
    });

    it('should handle empty query', () => {
      const tasks = [
        createMockTask({ id: 1, title: 'Task 1' }),
        createMockTask({ id: 2, title: 'Task 2' }),
      ];

      const results = searchTasks(tasks, '');
      expect(results).toEqual([]);
    });

    it('should be case-insensitive', () => {
      const tasks = [createMockTask({ id: 1, title: 'AUTHENTICATION Feature' })];

      const results = searchTasks(tasks, 'authentication');
      expect(results.length).toBeGreaterThan(0);
    });

    it('should prioritize title matches over description', () => {
      const tasks = [
        createMockTask({ id: 1, title: 'Other task', description: 'authentication feature' }),
        createMockTask({ id: 2, title: 'authentication', description: 'something else' }),
      ];

      const results = searchTasks(tasks, 'authentication');
      expect(results[0].id).toBe(2); // Title match should rank higher
    });

    it('should handle special characters in query', () => {
      const tasks = [createMockTask({ id: 1, title: 'Fix: bug in login' })];

      const results = searchTasks(tasks, 'Fix:');
      expect(results.length).toBeGreaterThan(0);
    });

    it('should find partial matches', () => {
      const tasks = [createMockTask({ id: 1, title: 'Implement authentication system' })];

      const results = searchTasks(tasks, 'auth');
      expect(results.length).toBeGreaterThan(0);
    });

    it('should handle unicode characters', () => {
      const tasks = [createMockTask({ id: 1, title: 'Améliorer la documentation' })];

      const results = searchTasks(tasks, 'Améliorer');
      expect(results.length).toBeGreaterThan(0);
    });
  });
});
