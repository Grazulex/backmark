import type { Task, TaskFilters } from '../../types';

/**
 * Interface for task storage and retrieval
 * Allows different implementations (FileSystem, Indexed, etc.)
 */
export interface TaskRepository {
  /**
   * Get all tasks matching the given filters
   */
  getTasks(filters?: TaskFilters): Promise<Task[]>;

  /**
   * Get a single task by ID
   */
  getTaskById(id: number): Promise<Task | null>;

  /**
   * Create a new task
   */
  createTask(task: Task): Promise<void>;

  /**
   * Update an existing task
   */
  updateTask(task: Task): Promise<void>;

  /**
   * Delete a task
   */
  deleteTask(id: number): Promise<void>;

  /**
   * Get the next available task ID
   */
  getNextTaskId(): Promise<number>;

  /**
   * Sync the repository (for indexed implementations)
   * Does nothing for FileSystem implementation
   */
  sync?(): Promise<void>;

  /**
   * Rebuild the repository index (for indexed implementations)
   * Does nothing for FileSystem implementation
   */
  rebuild?(): Promise<void>;
}
