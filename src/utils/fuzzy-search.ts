import Fuse from 'fuse.js';
import type { Task } from '../types';

export interface SearchOptions {
  threshold?: number;
  maxResults?: number;
}

export function searchTasks(tasks: Task[], query: string, options: SearchOptions = {}): Task[] {
  const { threshold = 0.3, maxResults = 50 } = options;

  // Recent fuse.js 7.x returns every item for an empty query; keep "no query, no results"
  if (query.trim() === '') {
    return [];
  }

  const fuse = new Fuse(tasks, {
    keys: [
      { name: 'title', weight: 0.4 },
      { name: 'description', weight: 0.3 },
      { name: 'labels', weight: 0.3 },
    ],
    threshold,
    includeScore: true,
    ignoreLocation: true,
  });

  const results = fuse.search(query, { limit: maxResults });
  return results.map((result) => result.item);
}
