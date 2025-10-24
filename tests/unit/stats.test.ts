import { describe, expect, it } from 'vitest';
import type { Task } from '../../src/types/task';
import {
  StatsCalculator,
  createProgressBar,
  formatNumber,
  formatPercentage,
} from '../../src/utils/stats';

describe('StatsCalculator', () => {
  const createMockTask = (overrides: Partial<Task> = {}): Task => ({
    id: 1,
    title: 'Test Task',
    description: 'Test Description',
    status: 'To Do',
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

  describe('Summary Statistics', () => {
    it('should calculate total tasks correctly', () => {
      const tasks = [createMockTask(), createMockTask({ id: 2 }), createMockTask({ id: 3 })];
      const calculator = new StatsCalculator(tasks);
      const stats = calculator.calculate();

      expect(stats.summary.total).toBe(3);
    });

    it('should calculate completion rate correctly', () => {
      const tasks = [
        createMockTask({ id: 1, status: 'Done' }),
        createMockTask({ id: 2, status: 'Done' }),
        createMockTask({ id: 3, status: 'To Do' }),
        createMockTask({ id: 4, status: 'In Progress' }),
      ];
      const calculator = new StatsCalculator(tasks);
      const stats = calculator.calculate();

      expect(stats.summary.completionRate).toBe(50); // 2 out of 4 = 50%
    });

    it('should group tasks by status correctly', () => {
      const tasks = [
        createMockTask({ id: 1, status: 'Done' }),
        createMockTask({ id: 2, status: 'Done' }),
        createMockTask({ id: 3, status: 'To Do' }),
        createMockTask({ id: 4, status: 'In Progress' }),
        createMockTask({ id: 5, status: 'Blocked' }),
      ];
      const calculator = new StatsCalculator(tasks);
      const stats = calculator.calculate();

      expect(stats.summary.byStatus.Done).toBe(2);
      expect(stats.summary.byStatus['To Do']).toBe(1);
      expect(stats.summary.byStatus['In Progress']).toBe(1);
      expect(stats.summary.byStatus.Blocked).toBe(1);
    });

    it('should group tasks by priority correctly', () => {
      const tasks = [
        createMockTask({ id: 1, priority: 'critical' }),
        createMockTask({ id: 2, priority: 'high' }),
        createMockTask({ id: 3, priority: 'high' }),
        createMockTask({ id: 4, priority: 'medium' }),
        createMockTask({ id: 5, priority: 'low' }),
      ];
      const calculator = new StatsCalculator(tasks);
      const stats = calculator.calculate();

      expect(stats.summary.byPriority.critical).toBe(1);
      expect(stats.summary.byPriority.high).toBe(2);
      expect(stats.summary.byPriority.medium).toBe(1);
      expect(stats.summary.byPriority.low).toBe(1);
    });
  });

  describe('Milestone Statistics', () => {
    it('should calculate milestone progress correctly', () => {
      const tasks = [
        createMockTask({ id: 1, milestone: 'v1.0', status: 'Done' }),
        createMockTask({ id: 2, milestone: 'v1.0', status: 'Done' }),
        createMockTask({ id: 3, milestone: 'v1.0', status: 'To Do' }),
        createMockTask({ id: 4, milestone: 'v2.0', status: 'In Progress' }),
      ];
      const calculator = new StatsCalculator(tasks);
      const stats = calculator.calculate();

      const v1Milestone = stats.milestones.find((m) => m.name === 'v1.0');
      expect(v1Milestone).toBeDefined();
      expect(v1Milestone?.total).toBe(3);
      expect(v1Milestone?.completed).toBe(2);
      expect(v1Milestone?.percentage).toBeCloseTo(66.67, 1);
    });

    it('should handle tasks without milestones', () => {
      const tasks = [createMockTask({ id: 1 }), createMockTask({ id: 2, milestone: 'v1.0' })];
      const calculator = new StatsCalculator(tasks);
      const stats = calculator.calculate();

      const noMilestone = stats.milestones.find((m) => m.name === 'No Milestone');
      expect(noMilestone).toBeDefined();
      expect(noMilestone?.total).toBe(1);
    });
  });

  describe('Team Statistics', () => {
    it('should calculate team member task counts', () => {
      const tasks = [
        createMockTask({ id: 1, assignees: ['Alice'] }),
        createMockTask({ id: 2, assignees: ['Alice', 'Bob'] }),
        createMockTask({ id: 3, assignees: ['Bob'] }),
        createMockTask({ id: 4, assignees: ['Charlie'] }),
      ];
      const calculator = new StatsCalculator(tasks);
      const stats = calculator.calculate();

      const alice = stats.team.find((t) => t.name === 'Alice');
      const bob = stats.team.find((t) => t.name === 'Bob');
      const charlie = stats.team.find((t) => t.name === 'Charlie');

      expect(alice?.total).toBe(2);
      expect(bob?.total).toBe(2);
      expect(charlie?.total).toBe(1);
    });

    it('should detect AI team members', () => {
      const tasks = [
        createMockTask({ id: 1, assignees: ['Claude'] }),
        createMockTask({ id: 2, assignees: ['AI'] }),
        createMockTask({ id: 3, assignees: ['Alice'] }),
      ];
      const calculator = new StatsCalculator(tasks);
      const stats = calculator.calculate();

      const claude = stats.team.find((t) => t.name === 'Claude');
      const ai = stats.team.find((t) => t.name === 'AI');
      const alice = stats.team.find((t) => t.name === 'Alice');

      expect(claude?.isAI).toBe(true);
      expect(ai?.isAI).toBe(true);
      expect(alice?.isAI).toBe(false);
    });

    it('should sort team members by total tasks descending', () => {
      const tasks = [
        createMockTask({ id: 1, assignees: ['Alice'] }),
        createMockTask({ id: 2, assignees: ['Bob'] }),
        createMockTask({ id: 3, assignees: ['Bob'] }),
        createMockTask({ id: 4, assignees: ['Bob'] }),
        createMockTask({ id: 5, assignees: ['Charlie'] }),
        createMockTask({ id: 6, assignees: ['Charlie'] }),
      ];
      const calculator = new StatsCalculator(tasks);
      const stats = calculator.calculate();

      expect(stats.team[0].name).toBe('Bob');
      expect(stats.team[0].total).toBe(3);
      expect(stats.team[1].name).toBe('Charlie');
      expect(stats.team[1].total).toBe(2);
      expect(stats.team[2].name).toBe('Alice');
      expect(stats.team[2].total).toBe(1);
    });
  });

  describe('Alert Statistics', () => {
    it('should count blocked tasks', () => {
      const tasks = [
        createMockTask({ id: 1, status: 'Blocked' }),
        createMockTask({ id: 2, status: 'Blocked' }),
        createMockTask({ id: 3, status: 'To Do' }),
      ];
      const calculator = new StatsCalculator(tasks);
      const stats = calculator.calculate();

      expect(stats.alerts.blocked).toBe(2);
    });

    it('should count critical priority tasks', () => {
      const tasks = [
        createMockTask({ id: 1, priority: 'critical' }),
        createMockTask({ id: 2, priority: 'critical' }),
        createMockTask({ id: 3, priority: 'high' }),
      ];
      const calculator = new StatsCalculator(tasks);
      const stats = calculator.calculate();

      expect(stats.alerts.critical).toBe(2);
    });

    it('should count tasks without acceptance criteria', () => {
      const tasks = [
        createMockTask({ id: 1, acceptance_criteria: [] }),
        createMockTask({ id: 2, acceptance_criteria: [{ text: 'Test', checked: false }] }),
        createMockTask({ id: 3, acceptance_criteria: [] }),
      ];
      const calculator = new StatsCalculator(tasks);
      const stats = calculator.calculate();

      expect(stats.alerts.noCriteria).toBe(2);
    });
  });

  describe('AI Collaboration Statistics', () => {
    it('should count AI-assigned tasks', () => {
      const tasks = [
        createMockTask({ id: 1, assignees: ['Claude'] }),
        createMockTask({ id: 2, assignees: ['AI'] }),
        createMockTask({ id: 3, assignees: ['Alice'] }),
      ];
      const calculator = new StatsCalculator(tasks);
      const stats = calculator.calculate();

      expect(stats.ai.total).toBe(2);
    });

    it('should count tasks with AI documentation', () => {
      const tasks = [
        createMockTask({ id: 1, assignees: ['Claude'], ai_plan: 'Plan here' }),
        createMockTask({ id: 2, assignees: ['Claude'], ai_notes: 'Notes here' }),
        createMockTask({ id: 3, assignees: ['Claude'], ai_documentation: 'Docs here' }),
        createMockTask({ id: 4, assignees: ['Claude'], ai_review: 'Review here' }),
        createMockTask({ id: 5, assignees: ['Claude'] }),
      ];
      const calculator = new StatsCalculator(tasks);
      const stats = calculator.calculate();

      expect(stats.ai.withPlan).toBe(1);
      expect(stats.ai.withNotes).toBe(1);
      expect(stats.ai.withDoc).toBe(1);
      expect(stats.ai.withReview).toBe(1);
    });
  });

  describe('Filtering', () => {
    it('should filter by milestone', () => {
      const tasks = [
        createMockTask({ id: 1, milestone: 'v1.0' }),
        createMockTask({ id: 2, milestone: 'v1.0' }),
        createMockTask({ id: 3, milestone: 'v2.0' }),
      ];
      const calculator = new StatsCalculator(tasks);
      const stats = calculator.calculate({ milestone: 'v1.0' });

      expect(stats.summary.total).toBe(2);
    });

    it('should filter by date range', () => {
      const tasks = [
        createMockTask({ id: 1, created_date: new Date('2025-01-15').toISOString() }),
        createMockTask({ id: 2, created_date: new Date('2025-02-15').toISOString() }),
        createMockTask({ id: 3, created_date: new Date('2025-03-15').toISOString() }),
      ];
      const calculator = new StatsCalculator(tasks);
      const stats = calculator.calculate({
        startDate: new Date('2025-02-01'),
        endDate: new Date('2025-02-28'),
      });

      expect(stats.summary.total).toBe(1);
    });
  });
});

describe('Helper Functions', () => {
  describe('createProgressBar', () => {
    it('should create progress bar with correct filled/empty ratio', () => {
      const bar = createProgressBar(50, 10);
      expect(bar).toBe('█████░░░░░');
    });

    it('should handle 0%', () => {
      const bar = createProgressBar(0, 10);
      expect(bar).toBe('░░░░░░░░░░');
    });

    it('should handle 100%', () => {
      const bar = createProgressBar(100, 10);
      expect(bar).toBe('██████████');
    });

    it('should handle decimal percentages', () => {
      const bar = createProgressBar(33.33, 12);
      expect(bar.length).toBe(12);
      expect(bar).toContain('█');
      expect(bar).toContain('░');
    });
  });

  describe('formatNumber', () => {
    it('should format numbers with 1 decimal place', () => {
      expect(formatNumber(5.123)).toBe('5.1');
      expect(formatNumber(10.987)).toBe('11.0');
    });

    it('should handle integers', () => {
      expect(formatNumber(5)).toBe('5.0');
    });
  });

  describe('formatPercentage', () => {
    it('should format percentages with % symbol', () => {
      expect(formatPercentage(50)).toBe('50%');
      expect(formatPercentage(33.33)).toBe('33%');
    });

    it('should handle 0 and 100', () => {
      expect(formatPercentage(0)).toBe('0%');
      expect(formatPercentage(100)).toBe('100%');
    });
  });
});
