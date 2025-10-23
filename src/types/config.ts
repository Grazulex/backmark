export interface Config {
  project: ProjectConfig;
  board: BoardConfig;
  display: DisplayConfig;
  search: SearchConfig;
  performance?: PerformanceConfig;
}

export interface ProjectConfig {
  name: string;
  createdAt: string;
}

export interface BoardConfig {
  columns: string[];
}

export interface DisplayConfig {
  dateFormat: string;
  zeroPaddedIds: boolean;
  theme: string; // Reserved for future use (custom color themes)
}

export interface SearchConfig {
  threshold: number;
  maxResults: number;
}

export interface PerformanceConfig {
  useIndex: boolean;
  rebuildIndexOnStart?: boolean;
}

export const DEFAULT_CONFIG: Config = {
  project: {
    name: 'My Project',
    createdAt: new Date().toISOString(),
  },
  board: {
    columns: ['To Do', 'In Progress', 'Review', 'Done'],
  },
  display: {
    dateFormat: 'yyyy-MM-dd HH:mm',
    zeroPaddedIds: true,
    theme: 'default',
  },
  search: {
    threshold: 0.3,
    maxResults: 50,
  },
  performance: {
    useIndex: true,
    rebuildIndexOnStart: false,
  },
};
