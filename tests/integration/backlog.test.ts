import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { Backlog } from '../../src/core/backlog';
import type { Task } from '../../src/types/task';

describe('Backlog Integration Tests', () => {
  const testDir = path.join('/tmp', `backmark-test-${Date.now()}`);
  const backlogDir = path.join(testDir, 'backlog');
  const configPath = path.join(backlogDir, 'config.yml');

  beforeEach(async () => {
    // Create test directory structure
    await fs.mkdir(backlogDir, { recursive: true });

    // Create minimal config
    const minimalConfig = `
project:
  name: "Test Project"
  createdAt: "${new Date().toISOString()}"

board:
  columns:
    - "To Do"
    - "In Progress"
    - "Review"
    - "Done"

git:
  autoCommit: false

display:
  dateFormat: "YYYY-MM-DD HH:mm"
  zeroPaddedIds: true

validations:
  close:
    check_subtasks: true
    check_dependencies: true
    check_blocked_by: true
    check_acceptance_criteria: true
`;
    await fs.writeFile(configPath, minimalConfig, 'utf-8');
  });

  afterEach(async () => {
    // Cleanup test directory
    try {
      await fs.rm(testDir, { recursive: true, force: true });
    } catch (error) {
      // Ignore cleanup errors
    }
  });

  describe('Backlog.load', () => {
    it('should load existing backlog', async () => {
      const backlog = await Backlog.load(testDir);
      expect(backlog).toBeDefined();
    });

    it('should throw error if backlog not initialized', async () => {
      const nonExistentDir = path.join('/tmp', `backmark-nonexistent-${Date.now()}`);
      await expect(Backlog.load(nonExistentDir)).rejects.toThrow('not initialized');
    });

    it('should auto-migrate missing validations config', async () => {
      // Create config without validations
      const oldConfig = `
project:
  name: "Old Project"
  createdAt: "${new Date().toISOString()}"

board:
  columns:
    - "To Do"
    - "Done"
`;
      await fs.writeFile(configPath, oldConfig, 'utf-8');

      const backlog = await Backlog.load(testDir);
      const config = backlog.getConfig();
      expect(config.validations).toBeDefined();
      expect(config.validations?.close?.check_subtasks).toBe(true);
    });
  });

  describe('Task Creation', () => {
    it('should create a new task', async () => {
      const backlog = await Backlog.load(testDir);

      const taskData = {
        title: 'Test Task',
        description: 'Test Description',
        status: 'To Do' as const,
        priority: 'medium' as const,
      };

      const task = await backlog.createTask(taskData);

      expect(task).toBeDefined();
      expect(task.id).toBe(1);
      expect(task.title).toBe('Test Task');
      expect(task.description).toBe('Test Description');
      expect(task.status).toBe('To Do');
      expect(task.priority).toBe('medium');
      expect(task.created_date).toBeDefined();
      expect(task.updated_date).toBeDefined();

      await backlog.close();
    });

    it('should increment task IDs', async () => {
      const backlog = await Backlog.load(testDir);

      const task1 = await backlog.createTask({
        title: 'Task 1',
        description: 'Description 1',
        status: 'To Do',
        priority: 'low',
      });

      const task2 = await backlog.createTask({
        title: 'Task 2',
        description: 'Description 2',
        status: 'To Do',
        priority: 'high',
      });

      expect(task1.id).toBe(1);
      expect(task2.id).toBe(2);

      await backlog.close();
    });

    it('should create task with changelog entry', async () => {
      const backlog = await Backlog.load(testDir);

      const task = await backlog.createTask({
        title: 'Test Task',
        description: 'Test',
        status: 'To Do',
        priority: 'medium',
      });

      expect(task.changelog).toBeDefined();
      expect(task.changelog.length).toBeGreaterThan(0);
      expect(task.changelog[0].action).toBe('created');

      await backlog.close();
    });
  });

  describe('Task Retrieval', () => {
    it('should get task by ID', async () => {
      const backlog = await Backlog.load(testDir);

      const createdTask = await backlog.createTask({
        title: 'Test Task',
        description: 'Test',
        status: 'To Do',
        priority: 'medium',
      });

      const retrievedTask = await backlog.getTaskById(createdTask.id);

      expect(retrievedTask).toBeDefined();
      expect(retrievedTask?.id).toBe(createdTask.id);
      expect(retrievedTask?.title).toBe('Test Task');

      await backlog.close();
    });

    it('should return null for non-existent task ID', async () => {
      const backlog = await Backlog.load(testDir);

      const task = await backlog.getTaskById(999);

      expect(task).toBeNull();

      await backlog.close();
    });

    it('should get all tasks', async () => {
      const backlog = await Backlog.load(testDir);

      await backlog.createTask({
        title: 'Task 1',
        description: 'Description 1',
        status: 'To Do',
        priority: 'low',
      });

      await backlog.createTask({
        title: 'Task 2',
        description: 'Description 2',
        status: 'In Progress',
        priority: 'high',
      });

      const tasks = await backlog.getTasks();

      expect(tasks.length).toBe(2);

      await backlog.close();
    });

    it('should filter tasks by status', async () => {
      const backlog = await Backlog.load(testDir);

      await backlog.createTask({
        title: 'Task 1',
        description: 'Test',
        status: 'To Do',
        priority: 'low',
      });

      await backlog.createTask({
        title: 'Task 2',
        description: 'Test',
        status: 'In Progress',
        priority: 'high',
      });

      const todoTasks = await backlog.getTasks({ status: 'To Do' });

      expect(todoTasks.length).toBe(1);
      expect(todoTasks[0].status).toBe('To Do');

      await backlog.close();
    });

    it('should filter tasks by priority', async () => {
      const backlog = await Backlog.load(testDir);

      await backlog.createTask({
        title: 'Task 1',
        description: 'Test',
        status: 'To Do',
        priority: 'low',
      });

      await backlog.createTask({
        title: 'Task 2',
        description: 'Test',
        status: 'To Do',
        priority: 'critical',
      });

      const criticalTasks = await backlog.getTasks({ priority: 'critical' });

      expect(criticalTasks.length).toBe(1);
      expect(criticalTasks[0].priority).toBe('critical');

      await backlog.close();
    });
  });

  describe('Task Updates', () => {
    it('should update task', async () => {
      const backlog = await Backlog.load(testDir);

      const task = await backlog.createTask({
        title: 'Original Title',
        description: 'Original Description',
        status: 'To Do',
        priority: 'low',
      });

      const updatedTask = await backlog.updateTask(task.id, {
        title: 'Updated Title',
        status: 'In Progress',
      });

      expect(updatedTask.title).toBe('Updated Title');
      expect(updatedTask.status).toBe('In Progress');
      expect(updatedTask.description).toBe('Original Description');

      await backlog.close();
    });

    it('should add changelog entry on update', async () => {
      const backlog = await Backlog.load(testDir);

      const task = await backlog.createTask({
        title: 'Test Task',
        description: 'Test',
        status: 'To Do',
        priority: 'medium',
      });

      const initialChangelogLength = task.changelog.length;

      await backlog.updateTask(task.id, { status: 'In Progress' });

      const updatedTask = await backlog.getTaskById(task.id);
      expect(updatedTask?.changelog.length).toBeGreaterThan(initialChangelogLength);

      await backlog.close();
    });
  });

  describe('Task Deletion', () => {
    // TODO: deleteTask method not implemented yet
    it.skip('should delete task', async () => {
      // Method not available
    });

    it.skip('should throw error when deleting non-existent task', async () => {
      // Method not available
    });
  });

  describe('Configuration', () => {
    it('should get full config', async () => {
      const backlog = await Backlog.load(testDir);

      const config = backlog.getConfig();

      expect(config).toBeDefined();
      expect(config.project).toBeDefined();
      expect(config.board).toBeDefined();

      await backlog.close();
    });

    it('should get config by key', async () => {
      const backlog = await Backlog.load(testDir);

      const projectName = backlog.getConfig<string>('project.name');

      expect(projectName).toBe('Test Project');

      await backlog.close();
    });

    it('should get nested config', async () => {
      const backlog = await Backlog.load(testDir);

      const autoCommit = backlog.getConfig<boolean>('git.autoCommit');

      expect(autoCommit).toBe(false);

      await backlog.close();
    });
  });

  describe('Resource Cleanup', () => {
    it('should close backlog properly', async () => {
      const backlog = await Backlog.load(testDir);

      await expect(backlog.close()).resolves.not.toThrow();
    });

    it('should handle multiple close calls', async () => {
      const backlog = await Backlog.load(testDir);

      await backlog.close();
      await expect(backlog.close()).resolves.not.toThrow();
    });
  });
});
