export interface Config {
  project: ProjectConfig;
  board: BoardConfig;
  display: DisplayConfig;
  search: SearchConfig;
  performance?: PerformanceConfig;
  validations?: ValidationsConfig;
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

export interface ValidationsConfig {
  close?: {
    check_subtasks?: boolean;
    check_dependencies?: boolean;
    check_blocked_by?: boolean;
    check_acceptance_criteria?: boolean;
    warn_missing_ai_review?: boolean;
    warn_early_close?: boolean;
    warn_late_close?: boolean;
    warn_quick_close?: number; // seconds, 0 = disabled
    suggest_parent_close?: boolean;
    notify_unblocked?: boolean;
    allow_force?: boolean;
  };
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
  validations: {
    close: {
      check_subtasks: true,
      check_dependencies: true,
      check_blocked_by: true,
      check_acceptance_criteria: true,
      warn_missing_ai_review: true,
      warn_early_close: true,
      warn_late_close: true,
      warn_quick_close: 300, // 5 minutes
      suggest_parent_close: true,
      notify_unblocked: true,
      allow_force: true,
    },
  },
};
