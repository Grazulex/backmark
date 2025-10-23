export type TaskStatus = 'To Do' | 'In Progress' | 'Review' | 'Done' | 'Blocked' | string;

export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';

export interface ChangelogEntry {
  timestamp: string;
  action: string;
  details: string;
  user?: string;
}

export interface AcceptanceCriterion {
  text: string;
  checked: boolean;
}

export interface Task {
  // Core
  id: number;
  title: string;
  description: string;

  // Dates manuelles
  start_date?: string;
  end_date?: string;
  release_date?: string;

  // Dates automatiques
  created_date: string;
  updated_date: string;
  closed_date?: string;

  // Organisation
  status: TaskStatus;
  priority: TaskPriority;
  milestone?: string;

  // Personnes et labels
  assignees: string[];
  labels: string[];

  // Hiérarchie et dépendances
  parent_task?: number;
  subtasks: number[];
  dependencies: number[];
  blocked_by: number[];

  // Historique
  changelog: ChangelogEntry[];

  // Critères d'acceptation
  acceptance_criteria: AcceptanceCriterion[];

  // Espaces pour l'IA
  ai_plan?: string;
  ai_notes?: string;
  ai_documentation?: string;
  ai_review?: string;

  // Métadonnées système
  filePath: string;
}

export interface TaskData {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  milestone?: string;
  assignees?: string[];
  labels?: string[];
  start_date?: string;
  end_date?: string;
  release_date?: string;
  parent_task?: number;
  dependencies?: number[];
}

export interface TaskFilters {
  status?: TaskStatus;
  priority?: TaskPriority;
  assignee?: string;
  label?: string;
  milestone?: string;
  parent?: number;
}
