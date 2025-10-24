import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { LokiIndexedRepository } from '../../src/core/repositories/LokiIndexedRepository';
import type { Task } from '../../src/types';

const TEST_BACKLOG_PATH = '/tmp/backmark-test-loki/backlog';

describe('LokiIndexedRepository', () => {
  let repository: LokiIndexedRepository;

  beforeEach(async () => {
    // Create test directory
    await fs.mkdir(TEST_BACKLOG_PATH, { recursive: true });
    repository = new LokiIndexedRepository(TEST_BACKLOG_PATH);
  });

  afterEach(async () => {
    // Close repository
    await repository.close();
    // Cleanup test directory
    await fs.rm(path.dirname(TEST_BACKLOG_PATH), { recursive: true, force: true });
  });

  describe('sync and rebuild', () => {
    it('should sync tasks from file system', async () => {
      // Create task file manually
      const taskContent = `---
id: 1
title: "Test Task"
status: "To Do"
priority: "medium"
assignees: []
labels: []
subtasks: []
dependencies: []
blocked_by: []
changelog: []
acceptance_criteria: []
created_date: "2025-10-22T10:00:00Z"
updated_date: "2025-10-22T10:00:00Z"
---

Test description`;

      await fs.writeFile(
        path.join(TEST_BACKLOG_PATH, 'task-1 - Test Task.md'),
        taskContent,
        'utf-8'
      );

      // Sync repository
      await repository.sync();

      const tasks = await repository.getTasks();
      expect(tasks).toHaveLength(1);
      expect(tasks[0].id).toBe(1);
      expect(tasks[0].title).toBe('Test Task');
    });

    it('should only re-parse modified files on sync', async () => {
      // Create initial task
      const task1: Task = {
        id: 1,
        title: 'Task 1',
        description: 'Description 1',
        status: 'To Do',
        priority: 'medium',
        assignees: [],
        labels: [],
        subtasks: [],
        dependencies: [],
        blocked_by: [],
        changelog: [],
        acceptance_criteria: [],
        created_date: '2025-10-22T10:00:00Z',
        updated_date: '2025-10-22T10:00:00Z',
        filePath: path.join(TEST_BACKLOG_PATH, 'task-1 - Task 1.md'),
      };

      await repository.createTask(task1);

      // First sync
      await repository.sync();

      // Second sync (should not re-parse)
      await repository.sync();

      const tasks = await repository.getTasks();
      expect(tasks).toHaveLength(1);
    });

    it('should rebuild index from scratch', async () => {
      // Create task
      const task1: Task = {
        id: 1,
        title: 'Task 1',
        description: 'Description 1',
        status: 'To Do',
        priority: 'medium',
        assignees: [],
        labels: [],
        subtasks: [],
        dependencies: [],
        blocked_by: [],
        changelog: [],
        acceptance_criteria: [],
        created_date: '2025-10-22T10:00:00Z',
        updated_date: '2025-10-22T10:00:00Z',
        filePath: path.join(TEST_BACKLOG_PATH, 'task-1 - Task 1.md'),
      };

      await repository.createTask(task1);

      // Rebuild
      await repository.rebuild();

      const tasks = await repository.getTasks();
      expect(tasks).toHaveLength(1);
    });

    it('should remove deleted files from index on sync', async () => {
      // Create task
      const task1: Task = {
        id: 1,
        title: 'Task 1',
        description: 'Description 1',
        status: 'To Do',
        priority: 'medium',
        assignees: [],
        labels: [],
        subtasks: [],
        dependencies: [],
        blocked_by: [],
        changelog: [],
        acceptance_criteria: [],
        created_date: '2025-10-22T10:00:00Z',
        updated_date: '2025-10-22T10:00:00Z',
        filePath: path.join(TEST_BACKLOG_PATH, 'task-1 - Task 1.md'),
      };

      await repository.createTask(task1);

      // Delete file manually
      await fs.unlink(task1.filePath);

      // Sync should remove from index
      await repository.sync();

      const tasks = await repository.getTasks();
      expect(tasks).toHaveLength(0);
    });
  });

  describe('getTasks', () => {
    it('should return an empty array when no tasks exist', async () => {
      const tasks = await repository.getTasks();
      expect(tasks).toEqual([]);
    });

    it('should return all tasks sorted by id', async () => {
      const task1: Task = {
        id: 2,
        title: 'Task 2',
        description: 'Description 2',
        status: 'To Do',
        priority: 'medium',
        assignees: [],
        labels: [],
        subtasks: [],
        dependencies: [],
        blocked_by: [],
        changelog: [],
        acceptance_criteria: [],
        created_date: '2025-10-22T10:00:00Z',
        updated_date: '2025-10-22T10:00:00Z',
        filePath: path.join(TEST_BACKLOG_PATH, 'task-2 - Task 2.md'),
      };

      const task2: Task = {
        id: 1,
        title: 'Task 1',
        description: 'Description 1',
        status: 'In Progress',
        priority: 'high',
        assignees: [],
        labels: [],
        subtasks: [],
        dependencies: [],
        blocked_by: [],
        changelog: [],
        acceptance_criteria: [],
        created_date: '2025-10-22T09:00:00Z',
        updated_date: '2025-10-22T09:00:00Z',
        filePath: path.join(TEST_BACKLOG_PATH, 'task-1 - Task 1.md'),
      };

      await repository.createTask(task1);
      await repository.createTask(task2);

      const tasks = await repository.getTasks();
      expect(tasks).toHaveLength(2);
      expect(tasks[0].id).toBe(1);
      expect(tasks[1].id).toBe(2);
    });

    it('should filter tasks by status using index', async () => {
      const task1: Task = {
        id: 1,
        title: 'Task 1',
        description: 'Description 1',
        status: 'To Do',
        priority: 'medium',
        assignees: [],
        labels: [],
        subtasks: [],
        dependencies: [],
        blocked_by: [],
        changelog: [],
        acceptance_criteria: [],
        created_date: '2025-10-22T10:00:00Z',
        updated_date: '2025-10-22T10:00:00Z',
        filePath: path.join(TEST_BACKLOG_PATH, 'task-1 - Task 1.md'),
      };

      const task2: Task = {
        id: 2,
        title: 'Task 2',
        description: 'Description 2',
        status: 'In Progress',
        priority: 'high',
        assignees: [],
        labels: [],
        subtasks: [],
        dependencies: [],
        blocked_by: [],
        changelog: [],
        acceptance_criteria: [],
        created_date: '2025-10-22T10:00:00Z',
        updated_date: '2025-10-22T10:00:00Z',
        filePath: path.join(TEST_BACKLOG_PATH, 'task-2 - Task 2.md'),
      };

      await repository.createTask(task1);
      await repository.createTask(task2);

      const tasks = await repository.getTasks({ status: 'In Progress' });
      expect(tasks).toHaveLength(1);
      expect(tasks[0].status).toBe('In Progress');
    });

    it('should filter tasks by priority using index', async () => {
      const task1: Task = {
        id: 1,
        title: 'Task 1',
        description: 'Description 1',
        status: 'To Do',
        priority: 'low',
        assignees: [],
        labels: [],
        subtasks: [],
        dependencies: [],
        blocked_by: [],
        changelog: [],
        acceptance_criteria: [],
        created_date: '2025-10-22T10:00:00Z',
        updated_date: '2025-10-22T10:00:00Z',
        filePath: path.join(TEST_BACKLOG_PATH, 'task-1 - Task 1.md'),
      };

      const task2: Task = {
        id: 2,
        title: 'Task 2',
        description: 'Description 2',
        status: 'To Do',
        priority: 'high',
        assignees: [],
        labels: [],
        subtasks: [],
        dependencies: [],
        blocked_by: [],
        changelog: [],
        acceptance_criteria: [],
        created_date: '2025-10-22T10:00:00Z',
        updated_date: '2025-10-22T10:00:00Z',
        filePath: path.join(TEST_BACKLOG_PATH, 'task-2 - Task 2.md'),
      };

      await repository.createTask(task1);
      await repository.createTask(task2);

      const tasks = await repository.getTasks({ priority: 'high' });
      expect(tasks).toHaveLength(1);
      expect(tasks[0].priority).toBe('high');
    });

    it('should filter tasks by assignee', async () => {
      const task1: Task = {
        id: 1,
        title: 'Task 1',
        description: 'Description 1',
        status: 'To Do',
        priority: 'medium',
        assignees: ['@alice'],
        labels: [],
        subtasks: [],
        dependencies: [],
        blocked_by: [],
        changelog: [],
        acceptance_criteria: [],
        created_date: '2025-10-22T10:00:00Z',
        updated_date: '2025-10-22T10:00:00Z',
        filePath: path.join(TEST_BACKLOG_PATH, 'task-1 - Task 1.md'),
      };

      const task2: Task = {
        id: 2,
        title: 'Task 2',
        description: 'Description 2',
        status: 'To Do',
        priority: 'medium',
        assignees: ['@bob'],
        labels: [],
        subtasks: [],
        dependencies: [],
        blocked_by: [],
        changelog: [],
        acceptance_criteria: [],
        created_date: '2025-10-22T10:00:00Z',
        updated_date: '2025-10-22T10:00:00Z',
        filePath: path.join(TEST_BACKLOG_PATH, 'task-2 - Task 2.md'),
      };

      await repository.createTask(task1);
      await repository.createTask(task2);

      const tasks = await repository.getTasks({ assignee: '@alice' });
      expect(tasks).toHaveLength(1);
      expect(tasks[0].assignees).toContain('@alice');
    });

    it('should filter tasks by label', async () => {
      const task1: Task = {
        id: 1,
        title: 'Task 1',
        description: 'Description 1',
        status: 'To Do',
        priority: 'medium',
        assignees: [],
        labels: ['feature'],
        subtasks: [],
        dependencies: [],
        blocked_by: [],
        changelog: [],
        acceptance_criteria: [],
        created_date: '2025-10-22T10:00:00Z',
        updated_date: '2025-10-22T10:00:00Z',
        filePath: path.join(TEST_BACKLOG_PATH, 'task-1 - Task 1.md'),
      };

      const task2: Task = {
        id: 2,
        title: 'Task 2',
        description: 'Description 2',
        status: 'To Do',
        priority: 'medium',
        assignees: [],
        labels: ['bug'],
        subtasks: [],
        dependencies: [],
        blocked_by: [],
        changelog: [],
        acceptance_criteria: [],
        created_date: '2025-10-22T10:00:00Z',
        updated_date: '2025-10-22T10:00:00Z',
        filePath: path.join(TEST_BACKLOG_PATH, 'task-2 - Task 2.md'),
      };

      await repository.createTask(task1);
      await repository.createTask(task2);

      const tasks = await repository.getTasks({ label: 'feature' });
      expect(tasks).toHaveLength(1);
      expect(tasks[0].labels).toContain('feature');
    });

    it('should filter tasks by milestone', async () => {
      const task1: Task = {
        id: 1,
        title: 'Task 1',
        description: 'Description 1',
        status: 'To Do',
        priority: 'medium',
        milestone: 'v1.0',
        assignees: [],
        labels: [],
        subtasks: [],
        dependencies: [],
        blocked_by: [],
        changelog: [],
        acceptance_criteria: [],
        created_date: '2025-10-22T10:00:00Z',
        updated_date: '2025-10-22T10:00:00Z',
        filePath: path.join(TEST_BACKLOG_PATH, 'task-1 - Task 1.md'),
      };

      const task2: Task = {
        id: 2,
        title: 'Task 2',
        description: 'Description 2',
        status: 'To Do',
        priority: 'medium',
        milestone: 'v2.0',
        assignees: [],
        labels: [],
        subtasks: [],
        dependencies: [],
        blocked_by: [],
        changelog: [],
        acceptance_criteria: [],
        created_date: '2025-10-22T10:00:00Z',
        updated_date: '2025-10-22T10:00:00Z',
        filePath: path.join(TEST_BACKLOG_PATH, 'task-2 - Task 2.md'),
      };

      await repository.createTask(task1);
      await repository.createTask(task2);

      const tasks = await repository.getTasks({ milestone: 'v1.0' });
      expect(tasks).toHaveLength(1);
      expect(tasks[0].milestone).toBe('v1.0');
    });

    it('should filter tasks by parent', async () => {
      const task1: Task = {
        id: 1,
        title: 'Parent Task',
        description: 'Description 1',
        status: 'To Do',
        priority: 'medium',
        assignees: [],
        labels: [],
        subtasks: [2],
        dependencies: [],
        blocked_by: [],
        changelog: [],
        acceptance_criteria: [],
        created_date: '2025-10-22T10:00:00Z',
        updated_date: '2025-10-22T10:00:00Z',
        filePath: path.join(TEST_BACKLOG_PATH, 'task-1 - Parent Task.md'),
      };

      const task2: Task = {
        id: 2,
        title: 'Child Task',
        description: 'Description 2',
        status: 'To Do',
        priority: 'medium',
        parent_task: 1,
        assignees: [],
        labels: [],
        subtasks: [],
        dependencies: [],
        blocked_by: [],
        changelog: [],
        acceptance_criteria: [],
        created_date: '2025-10-22T10:00:00Z',
        updated_date: '2025-10-22T10:00:00Z',
        filePath: path.join(TEST_BACKLOG_PATH, 'task-2 - Child Task.md'),
      };

      await repository.createTask(task1);
      await repository.createTask(task2);

      const tasks = await repository.getTasks({ parent: 1 });
      expect(tasks).toHaveLength(1);
      expect(tasks[0].parent_task).toBe(1);
    });

    it('should load full task including AI fields', async () => {
      const task: Task = {
        id: 1,
        title: 'Task with AI fields',
        description: 'Description',
        status: 'To Do',
        priority: 'medium',
        assignees: [],
        labels: [],
        subtasks: [],
        dependencies: [],
        blocked_by: [],
        changelog: [],
        acceptance_criteria: [],
        ai_plan: 'AI Plan content',
        ai_notes: 'AI Notes content',
        ai_documentation: 'AI Documentation content',
        ai_review: 'AI Review content',
        created_date: '2025-10-22T10:00:00Z',
        updated_date: '2025-10-22T10:00:00Z',
        filePath: path.join(TEST_BACKLOG_PATH, 'task-1 - Task with AI fields.md'),
      };

      await repository.createTask(task);

      const loaded = await repository.getTaskById(1);
      expect(loaded?.ai_plan).toBe('AI Plan content');
      expect(loaded?.ai_notes).toBe('AI Notes content');
      expect(loaded?.ai_documentation).toBe('AI Documentation content');
      expect(loaded?.ai_review).toBe('AI Review content');
    });
  });

  describe('getTaskById', () => {
    it('should return null when task does not exist', async () => {
      const task = await repository.getTaskById(999);
      expect(task).toBeNull();
    });

    it('should return the task when it exists', async () => {
      const newTask: Task = {
        id: 5,
        title: 'Task 5',
        description: 'Description 5',
        status: 'To Do',
        priority: 'medium',
        assignees: [],
        labels: [],
        subtasks: [],
        dependencies: [],
        blocked_by: [],
        changelog: [],
        acceptance_criteria: [],
        created_date: '2025-10-22T10:00:00Z',
        updated_date: '2025-10-22T10:00:00Z',
        filePath: path.join(TEST_BACKLOG_PATH, 'task-5 - Task 5.md'),
      };

      await repository.createTask(newTask);

      const task = await repository.getTaskById(5);
      expect(task).not.toBeNull();
      expect(task?.id).toBe(5);
      expect(task?.title).toBe('Task 5');
    });
  });

  describe('createTask', () => {
    it('should create a task file and update index', async () => {
      const newTask: Task = {
        id: 10,
        title: 'New Task',
        description: 'This is a new task',
        status: 'To Do',
        priority: 'medium',
        assignees: ['@alice'],
        labels: ['feature', 'backend'],
        subtasks: [],
        dependencies: [],
        blocked_by: [],
        changelog: [],
        acceptance_criteria: [],
        created_date: '2025-10-22T10:00:00Z',
        updated_date: '2025-10-22T10:00:00Z',
        filePath: path.join(TEST_BACKLOG_PATH, 'task-10 - New Task.md'),
      };

      await repository.createTask(newTask);

      // Verify file exists
      const fileExists = await fs
        .access(newTask.filePath)
        .then(() => true)
        .catch(() => false);
      expect(fileExists).toBe(true);

      // Verify task can be retrieved
      const task = await repository.getTaskById(10);
      expect(task).not.toBeNull();
      expect(task?.title).toBe('New Task');
    });
  });

  describe('updateTask', () => {
    it('should update an existing task file and index', async () => {
      const task: Task = {
        id: 7,
        title: 'Original Title',
        description: 'Original description',
        status: 'To Do',
        priority: 'medium',
        assignees: [],
        labels: [],
        subtasks: [],
        dependencies: [],
        blocked_by: [],
        changelog: [],
        acceptance_criteria: [],
        created_date: '2025-10-22T10:00:00Z',
        updated_date: '2025-10-22T10:00:00Z',
        filePath: path.join(TEST_BACKLOG_PATH, 'task-7 - Original Title.md'),
      };

      await repository.createTask(task);

      // Update task
      task.title = 'Updated Title';
      task.description = 'Updated description';
      task.status = 'In Progress';

      await repository.updateTask(task);

      // Verify update
      const updated = await repository.getTaskById(7);
      expect(updated?.title).toBe('Updated Title');
      expect(updated?.description).toBe('Updated description');
      expect(updated?.status).toBe('In Progress');
    });
  });

  describe('deleteTask', () => {
    it('should delete a task file and remove from index', async () => {
      const task: Task = {
        id: 8,
        title: 'Task to Delete',
        description: 'This task will be deleted',
        status: 'To Do',
        priority: 'medium',
        assignees: [],
        labels: [],
        subtasks: [],
        dependencies: [],
        blocked_by: [],
        changelog: [],
        acceptance_criteria: [],
        created_date: '2025-10-22T10:00:00Z',
        updated_date: '2025-10-22T10:00:00Z',
        filePath: path.join(TEST_BACKLOG_PATH, 'task-8 - Task to Delete.md'),
      };

      await repository.createTask(task);

      // Verify task exists
      let retrieved = await repository.getTaskById(8);
      expect(retrieved).not.toBeNull();

      // Delete task
      await repository.deleteTask(8);

      // Verify task is deleted
      retrieved = await repository.getTaskById(8);
      expect(retrieved).toBeNull();

      // Verify file is deleted
      const fileExists = await fs
        .access(task.filePath)
        .then(() => true)
        .catch(() => false);
      expect(fileExists).toBe(false);
    });
  });

  describe('getNextTaskId', () => {
    it('should return 1 when no tasks exist', async () => {
      const nextId = await repository.getNextTaskId();
      expect(nextId).toBe(1);
    });

    it('should return max ID + 1', async () => {
      const task1: Task = {
        id: 3,
        title: 'Task 3',
        description: 'Description',
        status: 'To Do',
        priority: 'medium',
        assignees: [],
        labels: [],
        subtasks: [],
        dependencies: [],
        blocked_by: [],
        changelog: [],
        acceptance_criteria: [],
        created_date: '2025-10-22T10:00:00Z',
        updated_date: '2025-10-22T10:00:00Z',
        filePath: path.join(TEST_BACKLOG_PATH, 'task-3 - Task 3.md'),
      };

      const task2: Task = {
        id: 7,
        title: 'Task 7',
        description: 'Description',
        status: 'To Do',
        priority: 'medium',
        assignees: [],
        labels: [],
        subtasks: [],
        dependencies: [],
        blocked_by: [],
        changelog: [],
        acceptance_criteria: [],
        created_date: '2025-10-22T10:00:00Z',
        updated_date: '2025-10-22T10:00:00Z',
        filePath: path.join(TEST_BACKLOG_PATH, 'task-7 - Task 7.md'),
      };

      await repository.createTask(task1);
      await repository.createTask(task2);

      const nextId = await repository.getNextTaskId();
      expect(nextId).toBe(8);
    });
  });

  describe('close', () => {
    it('should close the database', async () => {
      // Create a task to initialize the database
      const task: Task = {
        id: 1,
        title: 'Task 1',
        description: 'Description',
        status: 'To Do',
        priority: 'medium',
        assignees: [],
        labels: [],
        subtasks: [],
        dependencies: [],
        blocked_by: [],
        changelog: [],
        acceptance_criteria: [],
        created_date: '2025-10-22T10:00:00Z',
        updated_date: '2025-10-22T10:00:00Z',
        filePath: path.join(TEST_BACKLOG_PATH, 'task-1 - Task 1.md'),
      };

      await repository.createTask(task);

      // Close should not throw
      await expect(repository.close()).resolves.not.toThrow();
    });
  });
});
