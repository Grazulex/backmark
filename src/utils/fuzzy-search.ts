import Fuse from 'fuse.js';
import type { Task } from '../types';

export interface SearchOptions {
  threshold?: number;
  maxResults?: number;
}

export function searchTasks(
  tasks: Task[],
  query: string,
  options: SearchOptions = {}
): Task[] {
  const { threshold = 0.3, maxResults = 50 } = options;

  const fuse = new Fuse(tasks, {
    keys: [
      { name: 'title', weight: 0.4 },
      { name: 'description', weight: 0.3 },
      { name: 'keywords', weight: 0.2 },
      { name: 'labels', weight: 0.1 },
    ],
    threshold,
    includeScore: true,
    ignoreLocation: true,
  });

  const results = fuse.search(query, { limit: maxResults });
  return results.map((result) => result.item);
}
