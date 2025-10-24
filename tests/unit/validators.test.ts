import { describe, it, expect } from 'vitest';
import { TaskValidator, DEFAULT_VALIDATION_CONFIG } from '../../src/utils/validators';
import type { Task } from '../../src/types/task';

describe('TaskValidator', () => {
  const createMockTask = (overrides: Partial<Task> = {}): Task => ({
    id: 1,
    title: 'Test Task',
    description: 'Test Description',
    status: 'In Progress',
    priority: 'medium',
    created_date: new Date('2025-01-01').toISOString(),
    updated_date: new Date('2025-01-02').toISOString(),
    assignees: [],
    labels: [],
    subtasks: [],
    dependencies: [],
    blocked_by: [],
    acceptance_criteria: [],
    changelog: [],
    ...overrides,
  });

  describe('Close Task Validation', () => {
    describe('Blocking Validations', () => {
      it('should block closing task with incomplete subtasks', () => {
        const task = createMockTask({ subtasks: [2, 3] });
        const allTasks = [
          task,
          createMockTask({ id: 2, status: 'Done' }),
          createMockTask({ id: 3, status: 'To Do' }), // Incomplete
        ];

        const validator = new TaskValidator(DEFAULT_VALIDATION_CONFIG);
        const result = validator.validateClose(task, allTasks);

        expect(result.valid).toBe(false);
        expect(result.blocking.length).toBeGreaterThan(0);
        expect(result.blocking[0].message).toContain('subtask');
      });

      it('should block closing task with unresolved dependencies', () => {
        const task = createMockTask({ dependencies: [2, 3] });
        const allTasks = [
          task,
          createMockTask({ id: 2, status: 'Done' }),
          createMockTask({ id: 3, status: 'In Progress' }), // Not done
        ];

        const validator = new TaskValidator(DEFAULT_VALIDATION_CONFIG);
        const result = validator.validateClose(task, allTasks);

        expect(result.valid).toBe(false);
        expect(result.blocking.length).toBeGreaterThan(0);
        expect(result.blocking[0].message).toContain('dependency');
      });

      it('should block closing task that is blocked by other tasks', () => {
        const task = createMockTask({ blocked_by: [2] });
        const allTasks = [task, createMockTask({ id: 2, status: 'To Do' })];

        const validator = new TaskValidator(DEFAULT_VALIDATION_CONFIG);
        const result = validator.validateClose(task, allTasks);

        expect(result.valid).toBe(false);
        expect(result.blocking.length).toBeGreaterThan(0);
        expect(result.blocking[0].message).toContain('blocked');
      });

      it('should block closing task with incomplete acceptance criteria', () => {
        const task = createMockTask({
          acceptance_criteria: [
            { text: 'Criterion 1', checked: true },
            { text: 'Criterion 2', checked: false }, // Incomplete
          ],
        });
        const allTasks = [task];

        const validator = new TaskValidator(DEFAULT_VALIDATION_CONFIG);
        const result = validator.validateClose(task, allTasks);

        expect(result.valid).toBe(false);
        expect(result.blocking.length).toBeGreaterThan(0);
        expect(result.blocking[0].message).toContain('acceptance criterion');
      });
    });

    describe('Warnings (Non-blocking)', () => {
      it('should warn when AI task lacks review', () => {
        const task = createMockTask({
          assignees: ['Claude'],
          subtasks: [],
          dependencies: [],
          blocked_by: [],
        });
        const allTasks = [task];

        const validator = new TaskValidator(DEFAULT_VALIDATION_CONFIG);
        const result = validator.validateClose(task, allTasks);

        expect(result.valid).toBe(true);
        expect(result.warnings.length).toBeGreaterThan(0);
        expect(result.warnings.some((w) => w.message.includes('AI review'))).toBe(true);
      });

      // TODO: Implement date validation warnings
      it.skip('should warn when task closed before end date', () => {
        // Not yet implemented in validator
      });

      it.skip('should warn when task closed after end date', () => {
        // Not yet implemented in validator
      });

      it.skip('should warn when task completed too quickly', () => {
        // Not yet implemented in validator
      });
    });

    describe('Suggestions', () => {
      // TODO: Verify suggestion logic is working correctly
      it.skip('should suggest closing parent when all siblings are done', () => {
        // May not be fully implemented
      });

      it.skip('should suggest notifying unblocked tasks', () => {
        // May not be fully implemented
      });
    });

    describe('Force Flag', () => {
      it('should bypass validations when force=true', () => {
        const task = createMockTask({
          subtasks: [2],
          dependencies: [3],
          blocked_by: [4],
        });
        const allTasks = [
          task,
          createMockTask({ id: 2, status: 'To Do' }),
          createMockTask({ id: 3, status: 'To Do' }),
          createMockTask({ id: 4, status: 'To Do' }),
        ];

        const validator = new TaskValidator(DEFAULT_VALIDATION_CONFIG);
        const result = validator.validateClose(task, allTasks, true); // force=true

        expect(result.valid).toBe(true);
        expect(result.blocking.length).toBe(0);
      });
    });

    describe('Configuration Options', () => {
      it('should respect check_subtasks config', () => {
        const task = createMockTask({ subtasks: [2] });
        const allTasks = [task, createMockTask({ id: 2, status: 'To Do' })];

        const validator = new TaskValidator({
          ...DEFAULT_VALIDATION_CONFIG,
          check_subtasks: false,
        });
        const result = validator.validateClose(task, allTasks);

        expect(result.valid).toBe(true);
        expect(result.blocking.length).toBe(0);
      });

      it('should respect check_dependencies config', () => {
        const task = createMockTask({ dependencies: [2] });
        const allTasks = [task, createMockTask({ id: 2, status: 'To Do' })];

        const validator = new TaskValidator({
          ...DEFAULT_VALIDATION_CONFIG,
          check_dependencies: false,
        });
        const result = validator.validateClose(task, allTasks);

        expect(result.valid).toBe(true);
        expect(result.blocking.length).toBe(0);
      });

      it('should respect warn_missing_ai_review config', () => {
        const task = createMockTask({
          assignees: ['Claude'],
          subtasks: [],
          dependencies: [],
          blocked_by: [],
        });
        const allTasks = [task];

        const validator = new TaskValidator({
          ...DEFAULT_VALIDATION_CONFIG,
          warn_missing_ai_review: false,
        });
        const result = validator.validateClose(task, allTasks);

        expect(result.valid).toBe(true);
        expect(result.warnings.length).toBe(0);
      });
    });

    describe('Edge Cases', () => {
      it('should handle task with no subtasks', () => {
        const task = createMockTask({ subtasks: [] });
        const allTasks = [task];

        const validator = new TaskValidator(DEFAULT_VALIDATION_CONFIG);
        const result = validator.validateClose(task, allTasks);

        expect(result.valid).toBe(true);
      });

      it('should handle task with all criteria checked', () => {
        const task = createMockTask({
          acceptance_criteria: [
            { text: 'Criterion 1', checked: true },
            { text: 'Criterion 2', checked: true },
          ],
          subtasks: [],
          dependencies: [],
          blocked_by: [],
        });
        const allTasks = [task];

        const validator = new TaskValidator(DEFAULT_VALIDATION_CONFIG);
        const result = validator.validateClose(task, allTasks);

        expect(result.valid).toBe(true);
        expect(result.blocking.length).toBe(0);
      });

      // TODO: Add validation for non-existent subtask IDs
      it.skip('should handle non-existent subtask IDs gracefully', () => {
        // Not yet implemented - validator doesn't check for missing subtasks
      });
    });
  });
});
