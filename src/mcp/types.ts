/**
 * MCP Tool and Resource Types for Backmark
 */

export interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

export interface ResourceDefinition {
  uri: string;
  name: string;
  description: string;
  mimeType: string;
}

export interface TaskCreateArgs {
  title: string;
  description?: string;
  status?: string;
  priority?: string;
  assignees?: string[];
  labels?: string[];
  milestone?: string;
  startDate?: string;
  endDate?: string;
  parentTask?: number;
  dependencies?: number[];
}

export interface TaskEditArgs {
  id: number;
  title?: string;
  description?: string;
  status?: string;
  priority?: string;
  assignees?: string[];
  labels?: string[];
  milestone?: string;
  startDate?: string;
  endDate?: string;
}

export interface TaskListArgs {
  status?: string;
  priority?: string;
  assignee?: string;
  milestone?: string;
  label?: string;
  parent?: number;
}

export interface TaskViewArgs {
  id: number;
}

export interface TaskAiPlanArgs {
  id: number;
  plan: string;
}

export interface TaskAiNoteArgs {
  id: number;
  note: string;
}

export interface TaskAiDocArgs {
  id: number;
  documentation: string;
}

export interface TaskAiReviewArgs {
  id: number;
  review: string;
}

export interface SearchArgs {
  query: string;
  status?: string;
  priority?: string;
  assignee?: string;
  milestone?: string;
  label?: string;
}

export interface OverviewArgs {
  milestone?: string;
  start?: string;
  end?: string;
}

export interface BoardShowArgs {
  milestone?: string;
}

// Template management
export interface TemplateShowArgs {
  name: string;
}

export interface TaskCreateWithTemplateArgs {
  title: string;
  template: string;
  description?: string;
  status?: string;
  priority?: string;
  assignees?: string[];
  labels?: string[];
  milestone?: string;
  startDate?: string;
  endDate?: string;
}

// AI Automation
export interface TaskIdArgs {
  id: number;
}

// Acceptance Criteria
export interface AcceptanceCriterionArgs {
  id: number;
  text: string;
}

export interface CheckCriterionArgs {
  id: number;
  index: number;
}

// Configuration
export interface ConfigAddStatusArgs {
  status: string;
}

export interface ConfigAddPriorityArgs {
  priority: string;
}
