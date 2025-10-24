import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { FileSystemRepository } from '../../src/core/repositories/FileSystemRepository';
import type { Task } from '../../src/types';

const TEST_BACKLOG_PATH = '/tmp/backmark-test/backlog';

describe('FileSystemRepository', () => {
  let repository: FileSystemRepository;

  beforeEach(async () => {
    // Create test directory
    await fs.mkdir(TEST_BACKLOG_PATH, { recursive: true });
    repository = new FileSystemRepository(TEST_BACKLOG_PATH);
  });

  afterEach(async () => {
    // Cleanup test directory
    await fs.rm(TEST_BACKLOG_PATH, { recursive: true, force: true });
  });

  describe('getTasks', () => {
    it('should return an empty array when no tasks exist', async () => {
      const tasks = await repository.getTasks();
      expect(tasks).toEqual([]);
    });

    it('should return all tasks sorted by id', async () => {
      // Create test tasks
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
      expect(tasks[0].id).toBe(1); // Should be sorted by id
      expect(tasks[1].id).toBe(2);
    });

    it('should filter tasks by status', async () => {
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

    it('should filter tasks by priority', async () => {
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

    it('should apply multiple filters', async () => {
      const task1: Task = {
        id: 1,
        title: 'Task 1',
        description: 'Description 1',
        status: 'In Progress',
        priority: 'high',
        assignees: ['@alice'],
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
        priority: 'high',
        assignees: ['@alice'],
        labels: ['feature'],
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

      const tasks = await repository.getTasks({
        status: 'In Progress',
        priority: 'high',
        assignee: '@alice',
      });
      expect(tasks).toHaveLength(1);
      expect(tasks[0].id).toBe(1);
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
    it('should create a task file', async () => {
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

      // Verify content
      const content = await fs.readFile(newTask.filePath, 'utf-8');
      expect(content).toContain('New Task');
      expect(content).toContain('This is a new task');
      expect(content).toContain('@alice');
    });
  });

  describe('updateTask', () => {
    it('should update an existing task file', async () => {
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
    it('should delete a task file', async () => {
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

      // Verify file exists
      let fileExists = await fs
        .access(task.filePath)
        .then(() => true)
        .catch(() => false);
      expect(fileExists).toBe(true);

      // Delete task
      await repository.deleteTask(8);

      // Verify file is deleted
      fileExists = await fs
        .access(task.filePath)
        .then(() => true)
        .catch(() => false);
      expect(fileExists).toBe(false);
    });

    it('should not throw when deleting non-existent task', async () => {
      await expect(repository.deleteTask(999)).resolves.not.toThrow();
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
});
