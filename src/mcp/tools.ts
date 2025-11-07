import type {
  AcceptanceCriterionArgs,
  BoardShowArgs,
  CheckCriterionArgs,
  ConfigAddPriorityArgs,
  ConfigAddStatusArgs,
  OverviewArgs,
  SearchArgs,
  TaskAiDocArgs,
  TaskAiNoteArgs,
  TaskAiPlanArgs,
  TaskAiReviewArgs,
  TaskCreateArgs,
  TaskCreateWithTemplateArgs,
  TaskEditArgs,
  TaskIdArgs,
  TaskListArgs,
  TaskViewArgs,
  TemplateShowArgs,
  ToolDefinition,
} from './types.js';

// Import core functionality from commands
import { Backlog } from '../core/backlog.js';
import type { Task, TaskPriority } from '../types/index.js';
import { listTemplates, loadTemplate } from '../utils/templates.js';

/**
 * Register all available MCP tools
 */
export function registerTools(): ToolDefinition[] {
  return [
    // Task management tools
    {
      name: 'backmark_task_create',
      description: 'Create a new task in the backlog',
      inputSchema: {
        type: 'object',
        properties: {
          title: {
            type: 'string',
            description: 'Task title',
          },
          description: {
            type: 'string',
            description: 'Task description (Markdown supported)',
          },
          status: {
            type: 'string',
            description: 'Task status (e.g., "To Do", "In Progress", "Done")',
          },
          priority: {
            type: 'string',
            description: 'Task priority (low, medium, high, critical)',
          },
          assignees: {
            type: 'array',
            items: { type: 'string' },
            description: 'List of assignees (e.g., ["@alice", "@bob", "Claude"])',
          },
          labels: {
            type: 'array',
            items: { type: 'string' },
            description: 'List of labels/tags',
          },
          milestone: {
            type: 'string',
            description: 'Milestone name (e.g., "v1.0", "Sprint 3")',
          },
          startDate: {
            type: 'string',
            description: 'Planned start date (YYYY-MM-DD)',
          },
          endDate: {
            type: 'string',
            description: 'Planned end date (YYYY-MM-DD)',
          },
          parentTask: {
            type: 'number',
            description: 'Parent task ID (if this is a subtask)',
          },
          dependencies: {
            type: 'array',
            items: { type: 'number' },
            description: 'List of task IDs this task depends on',
          },
        },
        required: ['title'],
      },
    },
    {
      name: 'backmark_task_list',
      description: 'List tasks with optional filters',
      inputSchema: {
        type: 'object',
        properties: {
          status: {
            type: 'string',
            description: 'Filter by status',
          },
          priority: {
            type: 'string',
            description: 'Filter by priority',
          },
          assignee: {
            type: 'string',
            description: 'Filter by assignee',
          },
          milestone: {
            type: 'string',
            description: 'Filter by milestone',
          },
          label: {
            type: 'string',
            description: 'Filter by label',
          },
          parent: {
            type: 'number',
            description: 'Filter by parent task ID (list subtasks)',
          },
        },
      },
    },
    {
      name: 'backmark_task_view',
      description: 'View detailed information about a specific task',
      inputSchema: {
        type: 'object',
        properties: {
          id: {
            type: 'number',
            description: 'Task ID',
          },
        },
        required: ['id'],
      },
    },
    {
      name: 'backmark_task_edit',
      description: 'Edit an existing task',
      inputSchema: {
        type: 'object',
        properties: {
          id: {
            type: 'number',
            description: 'Task ID to edit',
          },
          title: {
            type: 'string',
            description: 'New task title',
          },
          description: {
            type: 'string',
            description: 'New task description',
          },
          status: {
            type: 'string',
            description: 'New status',
          },
          priority: {
            type: 'string',
            description: 'New priority',
          },
          assignees: {
            type: 'array',
            items: { type: 'string' },
            description: 'New list of assignees',
          },
          labels: {
            type: 'array',
            items: { type: 'string' },
            description: 'New list of labels',
          },
          milestone: {
            type: 'string',
            description: 'New milestone',
          },
          startDate: {
            type: 'string',
            description: 'New start date (YYYY-MM-DD)',
          },
          endDate: {
            type: 'string',
            description: 'New end date (YYYY-MM-DD)',
          },
        },
        required: ['id'],
      },
    },
    {
      name: 'backmark_task_close',
      description: 'Close a task (set status to Done)',
      inputSchema: {
        type: 'object',
        properties: {
          id: {
            type: 'number',
            description: 'Task ID to close',
          },
        },
        required: ['id'],
      },
    },
    // AI-specific tools for vibe coding
    {
      name: 'backmark_task_ai_plan',
      description: 'Add or update AI implementation plan for a task',
      inputSchema: {
        type: 'object',
        properties: {
          id: {
            type: 'number',
            description: 'Task ID',
          },
          plan: {
            type: 'string',
            description: 'Detailed AI implementation plan (Markdown supported)',
          },
        },
        required: ['id', 'plan'],
      },
    },
    {
      name: 'backmark_task_ai_note',
      description: 'Add timestamped AI work note to a task',
      inputSchema: {
        type: 'object',
        properties: {
          id: {
            type: 'number',
            description: 'Task ID',
          },
          note: {
            type: 'string',
            description: 'AI work note (decisions, problems, solutions)',
          },
        },
        required: ['id', 'note'],
      },
    },
    {
      name: 'backmark_task_ai_doc',
      description: 'Add or update AI-generated documentation for a task',
      inputSchema: {
        type: 'object',
        properties: {
          id: {
            type: 'number',
            description: 'Task ID',
          },
          documentation: {
            type: 'string',
            description: 'AI-generated documentation (Markdown supported)',
          },
        },
        required: ['id', 'documentation'],
      },
    },
    {
      name: 'backmark_task_ai_review',
      description: 'Add or update AI self-review for a task',
      inputSchema: {
        type: 'object',
        properties: {
          id: {
            type: 'number',
            description: 'Task ID',
          },
          review: {
            type: 'string',
            description: 'AI self-review (what works, what to improve, questions)',
          },
        },
        required: ['id', 'review'],
      },
    },
    // Search and overview
    {
      name: 'backmark_search',
      description: 'Search tasks with fuzzy matching',
      inputSchema: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'Search query',
          },
          status: {
            type: 'string',
            description: 'Filter by status',
          },
          priority: {
            type: 'string',
            description: 'Filter by priority',
          },
          assignee: {
            type: 'string',
            description: 'Filter by assignee',
          },
          milestone: {
            type: 'string',
            description: 'Filter by milestone',
          },
          label: {
            type: 'string',
            description: 'Filter by label',
          },
        },
        required: ['query'],
      },
    },
    {
      name: 'backmark_overview',
      description: 'Get project statistics and overview',
      inputSchema: {
        type: 'object',
        properties: {
          milestone: {
            type: 'string',
            description: 'Filter by milestone',
          },
          start: {
            type: 'string',
            description: 'Start date (YYYY-MM-DD)',
          },
          end: {
            type: 'string',
            description: 'End date (YYYY-MM-DD)',
          },
        },
      },
    },
    {
      name: 'backmark_board_show',
      description: 'Get current Kanban board state',
      inputSchema: {
        type: 'object',
        properties: {
          milestone: {
            type: 'string',
            description: 'Filter by milestone',
          },
        },
      },
    },
    // Template management
    {
      name: 'backmark_task_templates_list',
      description: 'List all available task templates (built-in and custom)',
      inputSchema: {
        type: 'object',
        properties: {},
      },
    },
    {
      name: 'backmark_task_template_show',
      description: 'Show the content and metadata of a specific template',
      inputSchema: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: 'Template name (e.g., "feature", "bugfix", "custom:mytemplate")',
          },
        },
        required: ['name'],
      },
    },
    // AI Automation
    {
      name: 'backmark_task_ai_breakdown',
      description:
        'Automatically break down a complex task into subtasks based on AI analysis',
      inputSchema: {
        type: 'object',
        properties: {
          id: {
            type: 'number',
            description: 'Task ID to break down',
          },
        },
        required: ['id'],
      },
    },
    {
      name: 'backmark_task_ai_estimate',
      description: 'Estimate task complexity, duration, and identify risks using AI analysis',
      inputSchema: {
        type: 'object',
        properties: {
          id: {
            type: 'number',
            description: 'Task ID to estimate',
          },
        },
        required: ['id'],
      },
    },
    {
      name: 'backmark_task_ai_review_ready',
      description:
        'Check if a task is ready for review (validates completion criteria, subtasks, dependencies)',
      inputSchema: {
        type: 'object',
        properties: {
          id: {
            type: 'number',
            description: 'Task ID to check',
          },
        },
        required: ['id'],
      },
    },
    // Acceptance Criteria
    {
      name: 'backmark_task_add_criterion',
      description: 'Add an acceptance criterion to a task',
      inputSchema: {
        type: 'object',
        properties: {
          id: {
            type: 'number',
            description: 'Task ID',
          },
          text: {
            type: 'string',
            description: 'Criterion text',
          },
        },
        required: ['id', 'text'],
      },
    },
    {
      name: 'backmark_task_check',
      description: 'Mark an acceptance criterion as completed',
      inputSchema: {
        type: 'object',
        properties: {
          id: {
            type: 'number',
            description: 'Task ID',
          },
          index: {
            type: 'number',
            description: 'Criterion index (0-based)',
          },
        },
        required: ['id', 'index'],
      },
    },
    {
      name: 'backmark_task_uncheck',
      description: 'Mark an acceptance criterion as incomplete',
      inputSchema: {
        type: 'object',
        properties: {
          id: {
            type: 'number',
            description: 'Task ID',
          },
          index: {
            type: 'number',
            description: 'Criterion index (0-based)',
          },
        },
        required: ['id', 'index'],
      },
    },
    // Hierarchy and Dependencies
    {
      name: 'backmark_task_tree',
      description: 'Display task hierarchy tree (parent, current task, subtasks)',
      inputSchema: {
        type: 'object',
        properties: {
          id: {
            type: 'number',
            description: 'Task ID',
          },
        },
        required: ['id'],
      },
    },
    {
      name: 'backmark_task_deps',
      description: 'Show task dependencies and tasks that depend on this one',
      inputSchema: {
        type: 'object',
        properties: {
          id: {
            type: 'number',
            description: 'Task ID',
          },
        },
        required: ['id'],
      },
    },
    {
      name: 'backmark_task_blocked',
      description: 'List all tasks that are currently blocked by dependencies',
      inputSchema: {
        type: 'object',
        properties: {},
      },
    },
    // Configuration
    {
      name: 'backmark_config_list_statuses',
      description: 'List all valid task statuses defined in configuration',
      inputSchema: {
        type: 'object',
        properties: {},
      },
    },
    {
      name: 'backmark_config_list_priorities',
      description: 'List all valid task priorities defined in configuration',
      inputSchema: {
        type: 'object',
        properties: {},
      },
    },
  ];
}

/**
 * Handle tool execution
 */
export async function handleToolCall(
  toolName: string,
  args: Record<string, unknown>
): Promise<{ content: Array<{ type: 'text'; text: string }> }> {
  try {
    const backlog = await Backlog.load();

    switch (toolName) {
      case 'backmark_task_create':
        return await handleTaskCreate(backlog, args as unknown as TaskCreateArgs);
      case 'backmark_task_list':
        return await handleTaskList(backlog, args as unknown as TaskListArgs);
      case 'backmark_task_view':
        return await handleTaskView(backlog, args as unknown as TaskViewArgs);
      case 'backmark_task_edit':
        return await handleTaskEdit(backlog, args as unknown as TaskEditArgs);
      case 'backmark_task_close':
        return await handleTaskClose(backlog, args as unknown as TaskViewArgs);
      case 'backmark_task_ai_plan':
        return await handleTaskAiPlan(backlog, args as unknown as TaskAiPlanArgs);
      case 'backmark_task_ai_note':
        return await handleTaskAiNote(backlog, args as unknown as TaskAiNoteArgs);
      case 'backmark_task_ai_doc':
        return await handleTaskAiDoc(backlog, args as unknown as TaskAiDocArgs);
      case 'backmark_task_ai_review':
        return await handleTaskAiReview(backlog, args as unknown as TaskAiReviewArgs);
      case 'backmark_search':
        return await handleSearch(backlog, args as unknown as SearchArgs);
      case 'backmark_overview':
        return await handleOverview(backlog, args as unknown as OverviewArgs);
      case 'backmark_board_show':
        return await handleBoardShow(backlog, args as unknown as BoardShowArgs);
      // Template management
      case 'backmark_task_templates_list':
        return await handleTemplatesList(backlog);
      case 'backmark_task_template_show':
        return await handleTemplateShow(backlog, args as unknown as TemplateShowArgs);
      // AI Automation
      case 'backmark_task_ai_breakdown':
        return await handleTaskAiBreakdown(backlog, args as unknown as TaskIdArgs);
      case 'backmark_task_ai_estimate':
        return await handleTaskAiEstimate(backlog, args as unknown as TaskIdArgs);
      case 'backmark_task_ai_review_ready':
        return await handleTaskAiReviewReady(backlog, args as unknown as TaskIdArgs);
      // Acceptance Criteria
      case 'backmark_task_add_criterion':
        return await handleTaskAddCriterion(backlog, args as unknown as AcceptanceCriterionArgs);
      case 'backmark_task_check':
        return await handleTaskCheck(backlog, args as unknown as CheckCriterionArgs);
      case 'backmark_task_uncheck':
        return await handleTaskUncheck(backlog, args as unknown as CheckCriterionArgs);
      // Hierarchy and Dependencies
      case 'backmark_task_tree':
        return await handleTaskTree(backlog, args as unknown as TaskIdArgs);
      case 'backmark_task_deps':
        return await handleTaskDeps(backlog, args as unknown as TaskIdArgs);
      case 'backmark_task_blocked':
        return await handleTaskBlocked(backlog);
      // Configuration
      case 'backmark_config_list_statuses':
        return await handleConfigListStatuses(backlog);
      case 'backmark_config_list_priorities':
        return await handleConfigListPriorities(backlog);
      default:
        throw new Error(`Unknown tool: ${toolName}`);
    }
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${error instanceof Error ? error.message : String(error)}`,
        },
      ],
    };
  }
}

// Tool handler implementations
async function handleTaskCreate(
  backlog: Backlog,
  args: TaskCreateArgs
): Promise<{ content: Array<{ type: 'text'; text: string }> }> {
  const priority = (args.priority || 'medium') as TaskPriority;

  const task = await backlog.createTask({
    title: args.title,
    description: args.description || '',
    status: args.status || 'To Do',
    priority,
    assignees: args.assignees || [],
    labels: args.labels || [],
    milestone: args.milestone,
    start_date: args.startDate,
    end_date: args.endDate,
    parent_task: args.parentTask,
    dependencies: args.dependencies || [],
  });

  return {
    content: [
      {
        type: 'text',
        text: `Task created successfully:\n\nID: ${task.id}\nTitle: ${task.title}\nStatus: ${task.status}\nPriority: ${task.priority}\nFile: ${task.filePath}`,
      },
    ],
  };
}

async function handleTaskList(
  backlog: Backlog,
  args: TaskListArgs
): Promise<{ content: Array<{ type: 'text'; text: string }> }> {
  const filters = {
    status: args.status,
    priority: args.priority ? (args.priority as TaskPriority) : undefined,
    assignee: args.assignee,
    label: args.label,
    milestone: args.milestone,
    parent: args.parent,
  };

  const tasks = await backlog.getTasks(filters);

  if (tasks.length === 0) {
    return {
      content: [
        {
          type: 'text',
          text: 'No tasks found.',
        },
      ],
    };
  }

  const taskList = tasks
    .map(
      (task) =>
        `#${task.id} - ${task.title}\n  Status: ${task.status}\n  Priority: ${task.priority}\n  Assignees: ${task.assignees.join(', ') || 'None'}\n  Labels: ${task.labels.join(', ') || 'None'}`
    )
    .join('\n\n');

  return {
    content: [
      {
        type: 'text',
        text: `Found ${tasks.length} task(s):\n\n${taskList}`,
      },
    ],
  };
}

async function handleTaskView(
  backlog: Backlog,
  args: TaskViewArgs
): Promise<{ content: Array<{ type: 'text'; text: string }> }> {
  const task = await backlog.getTaskById(args.id);

  if (!task) {
    throw new Error(`Task #${args.id} not found`);
  }

  let output = `# Task #${task.id}: ${task.title}\n\n`;
  output += `**Status:** ${task.status}\n`;
  output += `**Priority:** ${task.priority}\n`;
  output += `**Assignees:** ${task.assignees.join(', ') || 'None'}\n`;
  output += `**Labels:** ${task.labels.join(', ') || 'None'}\n`;
  if (task.milestone) output += `**Milestone:** ${task.milestone}\n`;
  if (task.start_date) output += `**Start Date:** ${task.start_date}\n`;
  if (task.end_date) output += `**End Date:** ${task.end_date}\n`;
  if (task.parent_task) output += `**Parent Task:** #${task.parent_task}\n`;
  if (task.dependencies?.length)
    output += `**Dependencies:** ${task.dependencies.map((d) => `#${d}`).join(', ')}\n`;
  output += `\n## Description\n\n${task.description}\n`;

  if (task.ai_plan) {
    output += `\n## AI Plan\n\n${task.ai_plan}\n`;
  }

  if (task.ai_notes) {
    output += `\n## AI Notes\n\n${task.ai_notes}\n`;
  }

  if (task.ai_documentation) {
    output += `\n## AI Documentation\n\n${task.ai_documentation}\n`;
  }

  if (task.ai_review) {
    output += `\n## AI Review\n\n${task.ai_review}\n`;
  }

  return {
    content: [
      {
        type: 'text',
        text: output,
      },
    ],
  };
}

async function handleTaskEdit(
  backlog: Backlog,
  args: TaskEditArgs
): Promise<{ content: Array<{ type: 'text'; text: string }> }> {
  const updates: Record<string, unknown> = {};
  if (args.title !== undefined) updates.title = args.title;
  if (args.description !== undefined) updates.description = args.description;
  if (args.status !== undefined) updates.status = args.status;
  if (args.priority !== undefined) updates.priority = args.priority as TaskPriority;
  if (args.assignees !== undefined) updates.assignees = args.assignees;
  if (args.labels !== undefined) updates.labels = args.labels;
  if (args.milestone !== undefined) updates.milestone = args.milestone;
  if (args.startDate !== undefined) updates.start_date = args.startDate;
  if (args.endDate !== undefined) updates.end_date = args.endDate;

  await backlog.updateTask(args.id, updates);

  return {
    content: [
      {
        type: 'text',
        text: `Task #${args.id} updated successfully.`,
      },
    ],
  };
}

async function handleTaskClose(
  backlog: Backlog,
  args: TaskViewArgs
): Promise<{ content: Array<{ type: 'text'; text: string }> }> {
  await backlog.updateTask(args.id, { status: 'Done' });

  return {
    content: [
      {
        type: 'text',
        text: `Task #${args.id} closed successfully.`,
      },
    ],
  };
}

async function handleTaskAiPlan(
  backlog: Backlog,
  args: TaskAiPlanArgs
): Promise<{ content: Array<{ type: 'text'; text: string }> }> {
  await backlog.addAIPlan(args.id, args.plan);

  return {
    content: [
      {
        type: 'text',
        text: `AI plan added to task #${args.id}.`,
      },
    ],
  };
}

async function handleTaskAiNote(
  backlog: Backlog,
  args: TaskAiNoteArgs
): Promise<{ content: Array<{ type: 'text'; text: string }> }> {
  await backlog.addAINote(args.id, args.note);

  return {
    content: [
      {
        type: 'text',
        text: `AI note added to task #${args.id}.`,
      },
    ],
  };
}

async function handleTaskAiDoc(
  backlog: Backlog,
  args: TaskAiDocArgs
): Promise<{ content: Array<{ type: 'text'; text: string }> }> {
  await backlog.addAIDocumentation(args.id, args.documentation);

  return {
    content: [
      {
        type: 'text',
        text: `AI documentation added to task #${args.id}.`,
      },
    ],
  };
}

async function handleTaskAiReview(
  backlog: Backlog,
  args: TaskAiReviewArgs
): Promise<{ content: Array<{ type: 'text'; text: string }> }> {
  await backlog.addAIReview(args.id, args.review);

  return {
    content: [
      {
        type: 'text',
        text: `AI review added to task #${args.id}.`,
      },
    ],
  };
}

async function handleSearch(
  backlog: Backlog,
  args: SearchArgs
): Promise<{ content: Array<{ type: 'text'; text: string }> }> {
  // Simple search implementation: get all tasks with filters and match title/description
  const filters = {
    status: args.status,
    priority: args.priority ? (args.priority as TaskPriority) : undefined,
    assignee: args.assignee,
    milestone: args.milestone,
    label: args.label,
  };

  const allTasks = await backlog.getTasks(filters);
  const query = args.query.toLowerCase();

  const results = allTasks.filter(
    (task) =>
      task.title.toLowerCase().includes(query) || task.description.toLowerCase().includes(query)
  );

  if (results.length === 0) {
    return {
      content: [
        {
          type: 'text',
          text: `No results found for "${args.query}".`,
        },
      ],
    };
  }

  const resultList = results
    .map(
      (task) => `#${task.id} - ${task.title}\n  Status: ${task.status} | Priority: ${task.priority}`
    )
    .join('\n\n');

  return {
    content: [
      {
        type: 'text',
        text: `Found ${results.length} result(s) for "${args.query}":\n\n${resultList}`,
      },
    ],
  };
}

async function handleOverview(
  backlog: Backlog,
  args: OverviewArgs
): Promise<{ content: Array<{ type: 'text'; text: string }> }> {
  const filters: { milestone?: string } = {};
  if (args.milestone) filters.milestone = args.milestone;

  const tasks = await backlog.getTasks(filters);
  const config = await backlog.getConfig();

  // Calculate statistics
  const totalTasks = tasks.length;
  const completedStatuses = config.board?.completedStatuses || ['Done'];
  const completed = tasks.filter((t) => completedStatuses.includes(t.status)).length;
  const inProgress = tasks.filter((t) => t.status === 'In Progress').length;
  const toDo = tasks.filter((t) => t.status === 'To Do').length;
  const completionRate = totalTasks > 0 ? Math.round((completed / totalTasks) * 100) : 0;

  // Group by priority
  const byPriority: Record<string, number> = {};
  for (const task of tasks) {
    byPriority[task.priority] = (byPriority[task.priority] || 0) + 1;
  }

  // Group by assignee
  const byAssignee: Record<string, number> = {};
  for (const task of tasks) {
    for (const assignee of task.assignees) {
      byAssignee[assignee] = (byAssignee[assignee] || 0) + 1;
    }
  }

  let output = '# Project Overview\n\n';
  output += `**Total Tasks:** ${totalTasks}\n`;
  output += `**Completed:** ${completed}\n`;
  output += `**In Progress:** ${inProgress}\n`;
  output += `**To Do:** ${toDo}\n`;
  output += `**Completion Rate:** ${completionRate}%\n`;

  if (Object.keys(byPriority).length > 0) {
    output += '\n## By Priority\n\n';
    for (const [priority, count] of Object.entries(byPriority)) {
      output += `- ${priority}: ${count}\n`;
    }
  }

  if (Object.keys(byAssignee).length > 0) {
    output += '\n## By Assignee\n\n';
    for (const [assignee, count] of Object.entries(byAssignee)) {
      output += `- ${assignee}: ${count}\n`;
    }
  }

  return {
    content: [
      {
        type: 'text',
        text: output,
      },
    ],
  };
}

async function handleBoardShow(
  backlog: Backlog,
  args: BoardShowArgs
): Promise<{ content: Array<{ type: 'text'; text: string }> }> {
  const filters: { milestone?: string } = {};
  if (args.milestone) filters.milestone = args.milestone;

  const tasks = await backlog.getTasks(filters);
  const config = await backlog.getConfig();
  const columns = config.board?.columns || ['To Do', 'In Progress', 'Review', 'Done'];

  let output = '# Kanban Board\n\n';

  for (const columnName of columns) {
    const columnTasks = tasks.filter((t) => t.status === columnName);
    output += `## ${columnName} (${columnTasks.length})\n\n`;
    for (const task of columnTasks) {
      output += `- #${task.id}: ${task.title} [${task.priority}]\n`;
    }
    output += '\n';
  }

  return {
    content: [
      {
        type: 'text',
        text: output,
      },
    ],
  };
}

// ============================================================================
// Template Management Handlers
// ============================================================================

async function handleTemplatesList(
  backlog: Backlog
): Promise<{ content: Array<{ type: 'text'; text: string }> }> {
  const backlogPath = backlog.getBacklogPath();
  const templates = await listTemplates(backlogPath);

  if (templates.length === 0) {
    return {
      content: [
        {
          type: 'text',
          text: 'No templates found.',
        },
      ],
    };
  }

  // Separate built-in and custom templates
  const builtIn = templates.filter((t) => !t.startsWith('custom:'));
  const custom = templates.filter((t) => t.startsWith('custom:'));

  let output = '# Available Task Templates\n\n';

  if (builtIn.length > 0) {
    output += '## Built-in Templates\n\n';
    output +=
      '- **feature**: New feature development with structured AI plan sections\n';
    output += '- **bugfix**: Bug fix with debugging checklist and root cause analysis\n';
    output += '- **refactoring**: Code refactoring with quality metrics and patterns\n';
    output += '- **research**: Research/investigation with comparison matrix\n';
    output += '\n';
  }

  if (custom.length > 0) {
    output += '## Custom Templates\n\n';
    for (const template of custom) {
      output += `- **${template}**: User-defined template\n`;
    }
    output += '\n';
  }

  output += '## Usage\n\n';
  output +=
    'Create a task using a template:\n```\nbackmark_task_create({ title: "...", template: "feature" })\n```\n';

  return {
    content: [
      {
        type: 'text',
        text: output,
      },
    ],
  };
}

async function handleTemplateShow(
  backlog: Backlog,
  args: TemplateShowArgs
): Promise<{ content: Array<{ type: 'text'; text: string }> }> {
  const backlogPath = backlog.getBacklogPath();
  const template = await loadTemplate(args.name, backlogPath);

  let output = `# Template: ${args.name}\n\n`;

  if (Object.keys(template.metadata).length > 0) {
    output += '## Metadata\n\n';
    for (const [key, value] of Object.entries(template.metadata)) {
      if (Array.isArray(value)) {
        output += `- **${key}**: ${value.join(', ')}\n`;
      } else {
        output += `- **${key}**: ${String(value)}\n`;
      }
    }
    output += '\n';
  }

  output += '## Content\n\n';
  output += template.content;

  return {
    content: [
      {
        type: 'text',
        text: output,
      },
    ],
  };
}

// ============================================================================
// AI Automation Handlers
// ============================================================================

async function handleTaskAiBreakdown(
  backlog: Backlog,
  args: TaskIdArgs
): Promise<{ content: Array<{ type: 'text'; text: string }> }> {
  const task = await backlog.getTaskById(args.id);
  if (!task) {
    throw new Error(`Task #${args.id} not found`);
  }

  // Analyze and generate subtasks
  const subtasks = analyzeAndBreakdown(task);

  if (subtasks.length === 0) {
    return {
      content: [
        {
          type: 'text',
          text: `Task #${args.id} is already atomic and doesn't need to be broken down.`,
        },
      ],
    };
  }

  const createdSubtasks: Task[] = [];
  for (const subtask of subtasks) {
    const created = await backlog.createTask(
      {
        title: subtask.title,
        description: subtask.description,
        parent_task: args.id,
        status: 'To Do',
        priority: task.priority,
        milestone: task.milestone,
        assignees: task.assignees,
        labels: [...task.labels, 'auto-generated'],
        dependencies: subtask.dependencies,
      },
      'AI'
    );
    createdSubtasks.push(created);
  }

  let output = `# Task Breakdown Complete\n\n`;
  output += `Task #${args.id} has been broken down into ${createdSubtasks.length} subtasks:\n\n`;

  for (const subtask of createdSubtasks) {
    output += `## #${subtask.id}: ${subtask.title}\n`;
    if (subtask.dependencies.length > 0) {
      output += `Depends on: ${subtask.dependencies.map((d) => `#${d}`).join(', ')}\n`;
    }
    output += '\n';
  }

  return {
    content: [
      {
        type: 'text',
        text: output,
      },
    ],
  };
}

async function handleTaskAiEstimate(
  backlog: Backlog,
  args: TaskIdArgs
): Promise<{ content: Array<{ type: 'text'; text: string }> }> {
  const task = await backlog.getTaskById(args.id);
  if (!task) {
    throw new Error(`Task #${args.id} not found`);
  }

  const estimate = analyzeComplexity(task);

  let output = `# Estimation for Task #${args.id}: "${task.title}"\n\n`;
  output += `**Complexity:** ${estimate.complexity}\n`;
  output += `**Estimated Time:** ${estimate.duration}\n`;
  output += `**Confidence:** ${estimate.confidence}%\n\n`;

  if (estimate.breakdown.length > 0) {
    output += '## Breakdown\n\n';
    for (const item of estimate.breakdown) {
      output += `- ${item}\n`;
    }
    output += '\n';
  }

  if (estimate.risks.length > 0) {
    output += '## Risks & Uncertainties\n\n';
    for (const risk of estimate.risks) {
      output += `- ⚠️ ${risk}\n`;
    }
    output += '\n';
  }

  output += '## Suggestions\n\n';
  output += `- **Priority:** ${estimate.suggestedPriority}\n`;
  if (estimate.suggestedMilestone) {
    output += `- **Milestone:** ${estimate.suggestedMilestone}\n`;
  }

  if (estimate.actions.length > 0) {
    output += '\n## Recommended Actions\n\n';
    for (const action of estimate.actions) {
      output += `- ${action}\n`;
    }
  }

  return {
    content: [
      {
        type: 'text',
        text: output,
      },
    ],
  };
}

async function handleTaskAiReviewReady(
  backlog: Backlog,
  args: TaskIdArgs
): Promise<{ content: Array<{ type: 'text'; text: string }> }> {
  const task = await backlog.getTaskById(args.id);
  if (!task) {
    throw new Error(`Task #${args.id} not found`);
  }

  const readiness = await checkReadiness(task, backlog);
  const isReady = readiness.blockers.length === 0;

  let output = `# Review Readiness Report for Task #${args.id}\n\n`;
  output += isReady ? '**Status:** ✅ Ready for Review\n\n' : '**Status:** ❌ NOT Ready\n\n';

  output += '## Checklist\n\n';
  for (const check of readiness.checklist) {
    const icon = check.passed ? '✓' : '✗';
    output += `${icon} ${check.item}\n`;
  }
  output += '\n';

  if (readiness.blockers.length > 0) {
    output += '## Blocking Issues\n\n';
    for (const blocker of readiness.blockers) {
      output += `- ✗ ${blocker}\n`;
    }
    output += '\n';
  }

  if (readiness.warnings.length > 0) {
    output += '## Warnings\n\n';
    for (const warning of readiness.warnings) {
      output += `- ⚠️ ${warning}\n`;
    }
    output += '\n';
  }

  if (isReady) {
    output += '## Recommendations\n\n';
    output += '- Move to "Review" status\n';
    if (readiness.suggestedReviewers.length > 0) {
      output += `- Suggested reviewers: ${readiness.suggestedReviewers.join(', ')}\n`;
    }
  } else {
    output += '## Next Steps\n\n';
    const steps = generateNextSteps(readiness);
    for (let i = 0; i < steps.length; i++) {
      output += `${i + 1}. ${steps[i]}\n`;
    }
  }

  return {
    content: [
      {
        type: 'text',
        text: output,
      },
    ],
  };
}

// ============================================================================
// Acceptance Criteria Handlers
// ============================================================================

async function handleTaskAddCriterion(
  backlog: Backlog,
  args: AcceptanceCriterionArgs
): Promise<{ content: Array<{ type: 'text'; text: string }> }> {
  const task = await backlog.getTaskById(args.id);
  if (!task) {
    throw new Error(`Task #${args.id} not found`);
  }

  task.acceptance_criteria.push({
    text: args.text,
    checked: false,
  });

  await backlog.updateTask(
    args.id,
    {
      acceptance_criteria: task.acceptance_criteria,
    },
    'AI'
  );

  const index = task.acceptance_criteria.length - 1;

  return {
    content: [
      {
        type: 'text',
        text: `Criterion added to task #${args.id}:\n\n[${index}] ${args.text}`,
      },
    ],
  };
}

async function handleTaskCheck(
  backlog: Backlog,
  args: CheckCriterionArgs
): Promise<{ content: Array<{ type: 'text'; text: string }> }> {
  const task = await backlog.getTaskById(args.id);
  if (!task) {
    throw new Error(`Task #${args.id} not found`);
  }

  if (args.index < 0 || args.index >= task.acceptance_criteria.length) {
    throw new Error(
      `Criterion index ${args.index} out of range (0-${task.acceptance_criteria.length - 1})`
    );
  }

  task.acceptance_criteria[args.index].checked = true;

  await backlog.updateTask(
    args.id,
    {
      acceptance_criteria: task.acceptance_criteria,
    },
    'AI'
  );

  return {
    content: [
      {
        type: 'text',
        text: `✓ Criterion [${args.index}] checked: "${task.acceptance_criteria[args.index].text}"`,
      },
    ],
  };
}

async function handleTaskUncheck(
  backlog: Backlog,
  args: CheckCriterionArgs
): Promise<{ content: Array<{ type: 'text'; text: string }> }> {
  const task = await backlog.getTaskById(args.id);
  if (!task) {
    throw new Error(`Task #${args.id} not found`);
  }

  if (args.index < 0 || args.index >= task.acceptance_criteria.length) {
    throw new Error(
      `Criterion index ${args.index} out of range (0-${task.acceptance_criteria.length - 1})`
    );
  }

  task.acceptance_criteria[args.index].checked = false;

  await backlog.updateTask(
    args.id,
    {
      acceptance_criteria: task.acceptance_criteria,
    },
    'AI'
  );

  return {
    content: [
      {
        type: 'text',
        text: `✗ Criterion [${args.index}] unchecked: "${task.acceptance_criteria[args.index].text}"`,
      },
    ],
  };
}

// ============================================================================
// Hierarchy and Dependencies Handlers
// ============================================================================

async function handleTaskTree(
  backlog: Backlog,
  args: TaskIdArgs
): Promise<{ content: Array<{ type: 'text'; text: string }> }> {
  const task = await backlog.getTaskById(args.id);
  if (!task) {
    throw new Error(`Task #${args.id} not found`);
  }

  let output = `# Task Hierarchy Tree\n\n`;

  // Show parent if exists
  if (task.parent_task) {
    const parent = await backlog.getTaskById(task.parent_task);
    if (parent) {
      output += `**Parent:**\n#${parent.id}: ${parent.title} [${parent.status}]\n\n`;
      output += '│\n';
    }
  }

  // Show current task
  output += `**Current Task:**\n#${task.id}: ${task.title} [${task.status}]\n\n`;

  // Show subtasks
  if (task.subtasks.length > 0) {
    output += '│\n**Subtasks:**\n\n';
    for (let i = 0; i < task.subtasks.length; i++) {
      const subtaskId = task.subtasks[i];
      const subtask = await backlog.getTaskById(subtaskId);
      const isLast = i === task.subtasks.length - 1;
      const prefix = isLast ? '└─' : '├─';

      if (subtask) {
        output += `${prefix} #${subtask.id}: ${subtask.title} [${subtask.status}]\n`;

        // Show sub-subtasks if any
        if (subtask.subtasks.length > 0) {
          for (const subSubId of subtask.subtasks) {
            const subSub = await backlog.getTaskById(subSubId);
            if (subSub) {
              const subPrefix = isLast ? '   ' : '│  ';
              output += `${subPrefix}└─ #${subSub.id}: ${subSub.title} [${subSub.status}]\n`;
            }
          }
        }
      }
    }
  } else {
    output += '\n(No subtasks)\n';
  }

  return {
    content: [
      {
        type: 'text',
        text: output,
      },
    ],
  };
}

async function handleTaskDeps(
  backlog: Backlog,
  args: TaskIdArgs
): Promise<{ content: Array<{ type: 'text'; text: string }> }> {
  const task = await backlog.getTaskById(args.id);
  if (!task) {
    throw new Error(`Task #${args.id} not found`);
  }

  let output = `# Dependencies for Task #${args.id}: ${task.title}\n\n`;

  // Dependencies (tasks this one depends on)
  if (task.dependencies.length > 0) {
    output += '## This task depends on:\n\n';
    for (const depId of task.dependencies) {
      const dep = await backlog.getTaskById(depId);
      if (dep) {
        const icon = dep.status === 'Done' ? '✓' : '○';
        output += `${icon} #${dep.id}: ${dep.title} [${dep.status}]\n`;
      }
    }
  } else {
    output += '## No dependencies\n\n';
  }

  output += '\n';

  // Blocked by
  if (task.blocked_by.length > 0) {
    output += '## Blocked by:\n\n';
    for (const blockerId of task.blocked_by) {
      const blocker = await backlog.getTaskById(blockerId);
      if (blocker) {
        output += `🚫 #${blocker.id}: ${blocker.title} [${blocker.status}]\n`;
      }
    }
    output += '\n';
  }

  // Tasks that depend on this one
  const allTasks = await backlog.getTasks();
  const dependents = allTasks.filter((t) => t.dependencies.includes(args.id));

  if (dependents.length > 0) {
    output += '## Tasks depending on this:\n\n';
    for (const dependent of dependents) {
      output += `#${dependent.id}: ${dependent.title} [${dependent.status}]\n`;
    }
  } else {
    output += '## No tasks depend on this one\n';
  }

  return {
    content: [
      {
        type: 'text',
        text: output,
      },
    ],
  };
}

async function handleTaskBlocked(
  backlog: Backlog
): Promise<{ content: Array<{ type: 'text'; text: string }> }> {
  const blockedTasks = await backlog.getBlockedTasks();

  if (blockedTasks.length === 0) {
    return {
      content: [
        {
          type: 'text',
          text: 'No blocked tasks! 🎉',
        },
      ],
    };
  }

  let output = `# Blocked Tasks (${blockedTasks.length})\n\n`;

  for (const task of blockedTasks) {
    output += `🚫 #${task.id}: ${task.title} [${task.status}]\n`;
    output += `   Blocked by: ${task.blocked_by.map((id) => `#${id}`).join(', ')}\n\n`;
  }

  return {
    content: [
      {
        type: 'text',
        text: output,
      },
    ],
  };
}

// ============================================================================
// Configuration Handlers
// ============================================================================

async function handleConfigListStatuses(
  backlog: Backlog
): Promise<{ content: Array<{ type: 'text'; text: string }> }> {
  const config = await backlog.getConfig();
  const statuses = config.board?.columns || [];

  let output = '# Valid Task Statuses\n\n';

  for (const status of statuses) {
    output += `- ${status}\n`;
  }

  return {
    content: [
      {
        type: 'text',
        text: output,
      },
    ],
  };
}

async function handleConfigListPriorities(
  backlog: Backlog
): Promise<{ content: Array<{ type: 'text'; text: string }> }> {
  const config = await backlog.getConfig();
  const priorities = config.board?.priorities || [];

  let output = '# Valid Task Priorities\n\n';

  for (const priority of priorities) {
    output += `- ${priority}\n`;
  }

  return {
    content: [
      {
        type: 'text',
        text: output,
      },
    ],
  };
}

// ============================================================================
// Helper Functions (imported logic from commands)
// ============================================================================

interface SubtaskBreakdown {
  title: string;
  description: string;
  dependencies?: number[];
}

function analyzeAndBreakdown(task: Task): SubtaskBreakdown[] {
  const subtasks: SubtaskBreakdown[] = [];

  // Skip if already has subtasks
  if (task.subtasks.length > 0) {
    return [];
  }

  const description = task.description.toLowerCase();
  const title = task.title.toLowerCase();

  // Pattern 1: Feature implementation
  if (
    title.includes('implement') ||
    title.includes('add') ||
    title.includes('create') ||
    description.includes('implement')
  ) {
    if (description.includes('api') || description.includes('endpoint')) {
      subtasks.push({
        title: 'Design API endpoints and data models',
        description: 'Define the API contract, request/response schemas, and data models.',
      });
      subtasks.push({
        title: 'Implement backend logic',
        description: 'Create the server-side implementation with business logic and validation.',
        dependencies: [task.id + 1],
      });
      subtasks.push({
        title: 'Add error handling and logging',
        description: 'Implement comprehensive error handling and logging mechanisms.',
        dependencies: [task.id + 2],
      });
      subtasks.push({
        title: 'Write unit and integration tests',
        description: 'Create test suite covering all endpoints and edge cases.',
        dependencies: [task.id + 3],
      });
      subtasks.push({
        title: 'Update API documentation',
        description: 'Document the new endpoints in API docs (OpenAPI/Swagger).',
        dependencies: [task.id + 4],
      });
    } else if (description.includes('ui') || description.includes('component')) {
      subtasks.push({
        title: 'Design component structure and props',
        description: 'Define the component API, props interface, and state management.',
      });
      subtasks.push({
        title: 'Implement component logic',
        description: 'Create the component with business logic and user interactions.',
        dependencies: [task.id + 1],
      });
      subtasks.push({
        title: 'Add styling and responsiveness',
        description: 'Implement CSS/styling and ensure mobile responsiveness.',
        dependencies: [task.id + 2],
      });
      subtasks.push({
        title: 'Write component tests',
        description: 'Create unit tests and visual regression tests.',
        dependencies: [task.id + 3],
      });
      subtasks.push({
        title: 'Update storybook/documentation',
        description: 'Add component examples and usage documentation.',
        dependencies: [task.id + 4],
      });
    } else {
      // Generic implementation
      subtasks.push({
        title: 'Design solution architecture',
        description: 'Define the technical approach and architecture for the implementation.',
      });
      subtasks.push({
        title: 'Implement core functionality',
        description: 'Create the main implementation following the design.',
        dependencies: [task.id + 1],
      });
      subtasks.push({
        title: 'Add tests and validation',
        description: 'Write comprehensive tests and validate the implementation.',
        dependencies: [task.id + 2],
      });
      subtasks.push({
        title: 'Documentation and cleanup',
        description: 'Document the implementation and clean up code.',
        dependencies: [task.id + 3],
      });
    }
  }
  // Pattern 2: Bug fix
  else if (title.includes('fix') || title.includes('bug') || description.includes('bug')) {
    subtasks.push({
      title: 'Reproduce and investigate the bug',
      description: 'Create a reproducible test case and identify the root cause.',
    });
    subtasks.push({
      title: 'Implement the fix',
      description: 'Apply the fix to resolve the root cause.',
      dependencies: [task.id + 1],
    });
    subtasks.push({
      title: 'Add regression tests',
      description: 'Write tests to prevent this bug from recurring.',
      dependencies: [task.id + 2],
    });
    subtasks.push({
      title: 'Verify fix and update documentation',
      description: 'Verify the fix works and update any relevant documentation.',
      dependencies: [task.id + 3],
    });
  }
  // Pattern 3: Refactoring
  else if (
    title.includes('refactor') ||
    title.includes('optimize') ||
    description.includes('refactor')
  ) {
    subtasks.push({
      title: 'Analyze current implementation',
      description: 'Review existing code and identify areas for improvement.',
    });
    subtasks.push({
      title: 'Plan refactoring approach',
      description: 'Design the new structure while maintaining functionality.',
      dependencies: [task.id + 1],
    });
    subtasks.push({
      title: 'Implement refactoring incrementally',
      description: 'Refactor code in small, testable increments.',
      dependencies: [task.id + 2],
    });
    subtasks.push({
      title: 'Verify functionality and performance',
      description: 'Ensure all tests pass and performance is improved.',
      dependencies: [task.id + 3],
    });
  }
  // Pattern 4: Research/Investigation
  else if (
    title.includes('research') ||
    title.includes('investigate') ||
    title.includes('explore')
  ) {
    subtasks.push({
      title: 'Define research scope and questions',
      description: 'Clearly define what needs to be researched and success criteria.',
    });
    subtasks.push({
      title: 'Gather information and evaluate options',
      description: 'Research different approaches, tools, or solutions.',
      dependencies: [task.id + 1],
    });
    subtasks.push({
      title: 'Create proof of concept',
      description: 'Build a small prototype to validate findings.',
      dependencies: [task.id + 2],
    });
    subtasks.push({
      title: 'Document findings and recommendations',
      description: 'Write comprehensive documentation with recommendations.',
      dependencies: [task.id + 3],
    });
  }

  // If task seems simple or atomic, don't break it down
  if (subtasks.length === 0 || task.description.length < 100) {
    return [];
  }

  return subtasks;
}

interface ComplexityEstimate {
  complexity: 'Simple' | 'Moderate' | 'Complex' | 'Very Complex';
  duration: string;
  confidence: number;
  breakdown: string[];
  risks: string[];
  suggestedPriority: 'low' | 'medium' | 'high' | 'critical';
  suggestedMilestone?: string;
  actions: string[];
}

function analyzeComplexity(task: Task): ComplexityEstimate {
  let complexityScore = 0;
  const breakdown: string[] = [];
  const risks: string[] = [];
  const actions: string[] = [];

  // Factor 1: Description length and detail
  if (task.description.length > 500) {
    complexityScore += 2;
    breakdown.push('Detailed requirements (2-3 hours)');
  } else if (task.description.length > 200) {
    complexityScore += 1;
    breakdown.push('Moderate requirements (1-2 hours)');
  } else {
    breakdown.push('Simple requirements (30 min - 1 hour)');
  }

  // Factor 2: Number of acceptance criteria
  if (task.acceptance_criteria.length > 5) {
    complexityScore += 2;
    breakdown.push('Many acceptance criteria (3-4 hours)');
  } else if (task.acceptance_criteria.length > 0) {
    complexityScore += 1;
    breakdown.push('Few acceptance criteria (1-2 hours)');
  } else {
    risks.push('No acceptance criteria defined - may lead to scope creep');
    actions.push('Define acceptance criteria before starting');
  }

  // Factor 3: Dependencies
  if (task.dependencies.length > 3) {
    complexityScore += 2;
    breakdown.push('Multiple dependencies (coordination: 2-3 hours)');
    risks.push('Many dependencies may cause delays');
  } else if (task.dependencies.length > 0) {
    complexityScore += 1;
    breakdown.push('Some dependencies (coordination: 1 hour)');
  }

  // Factor 4: Subtasks
  if (task.subtasks.length > 5) {
    complexityScore += 3;
    breakdown.push('Many subtasks (5-8 hours)');
  } else if (task.subtasks.length > 0) {
    complexityScore += 2;
    breakdown.push('Few subtasks (2-4 hours)');
  }

  // Factor 5: Technology keywords in description
  const techKeywords = [
    'api',
    'database',
    'migration',
    'authentication',
    'security',
    'performance',
    'optimization',
    'integration',
    'deployment',
  ];
  const descLower = task.description.toLowerCase();
  const titleLower = task.title.toLowerCase();
  const foundKeywords = techKeywords.filter(
    (kw) => descLower.includes(kw) || titleLower.includes(kw)
  );

  if (foundKeywords.length > 3) {
    complexityScore += 2;
    breakdown.push('Complex technical requirements (4-6 hours)');
  } else if (foundKeywords.length > 0) {
    complexityScore += 1;
    breakdown.push('Technical implementation (2-3 hours)');
  }

  // Check for high-risk keywords
  if (descLower.includes('migration') || descLower.includes('breaking change')) {
    risks.push('Migration or breaking change - requires careful planning');
    complexityScore += 1;
  }
  if (descLower.includes('security') || descLower.includes('authentication')) {
    risks.push('Security-critical - requires extra testing and review');
    complexityScore += 1;
  }
  if (descLower.includes('performance') || descLower.includes('optimization')) {
    risks.push('Performance work - requires benchmarking and profiling');
  }

  // Factor 6: Current status and AI documentation
  if (task.status === 'In Progress' && !task.ai_plan) {
    risks.push('No AI plan documented yet');
    actions.push('Document implementation plan before continuing');
  }

  if (task.status !== 'To Do' && !task.ai_notes) {
    risks.push('No development notes - progress not documented');
    actions.push('Keep detailed notes during implementation');
  }

  // Determine complexity level
  let complexity: ComplexityEstimate['complexity'];
  let duration: string;
  let confidence: number;

  if (complexityScore <= 2) {
    complexity = 'Simple';
    duration = '2-4 hours';
    confidence = 85;
  } else if (complexityScore <= 5) {
    complexity = 'Moderate';
    duration = '1-2 days';
    confidence = 75;
  } else if (complexityScore <= 8) {
    complexity = 'Complex';
    duration = '3-5 days';
    confidence = 65;
  } else {
    complexity = 'Very Complex';
    duration = '1-2 weeks';
    confidence = 50;
    risks.push('Very complex task - consider breaking down into smaller tasks');
    actions.push('Run `backmark_task_ai_breakdown` to split into subtasks');
  }

  // Add testing time
  breakdown.push('Testing and documentation (1-2 hours)');

  // Suggest priority based on complexity and current priority
  let suggestedPriority: ComplexityEstimate['suggestedPriority'] = task.priority;
  if (complexity === 'Very Complex' && task.priority === 'low') {
    suggestedPriority = 'medium';
    actions.push('Consider increasing priority due to complexity');
  }
  if (risks.length > 2 && task.priority !== 'high') {
    actions.push('Multiple risks identified - consider increasing priority');
  }

  // Suggest milestone if not set
  let suggestedMilestone: string | undefined = task.milestone;
  if (!task.milestone && complexity !== 'Simple') {
    suggestedMilestone = 'Next Sprint';
    actions.push('Assign to a milestone for better tracking');
  }

  return {
    complexity,
    duration,
    confidence,
    breakdown,
    risks,
    suggestedPriority,
    suggestedMilestone,
    actions,
  };
}

interface ReadinessCheck {
  item: string;
  passed: boolean;
}

interface ReadinessReport {
  checklist: ReadinessCheck[];
  blockers: string[];
  warnings: string[];
  suggestedReviewers: string[];
}

async function checkReadiness(task: Task, backlog: Backlog): Promise<ReadinessReport> {
  const checklist: ReadinessCheck[] = [];
  const blockers: string[] = [];
  const warnings: string[] = [];
  const suggestedReviewers: string[] = [];

  // Check 1: All acceptance criteria completed
  const totalCriteria = task.acceptance_criteria.length;
  const completedCriteria = task.acceptance_criteria.filter((c) => c.checked).length;
  const criteriaComplete = totalCriteria === 0 || totalCriteria === completedCriteria;

  checklist.push({
    item: `All acceptance criteria completed (${completedCriteria}/${totalCriteria})`,
    passed: criteriaComplete,
  });

  if (!criteriaComplete) {
    blockers.push(`${totalCriteria - completedCriteria} acceptance criteria still incomplete`);
  }

  // Check 2: All subtasks closed
  const subtasks = await backlog.getSubtasks(task.id);
  const openSubtasks = subtasks.filter((st) => st.status !== 'Done');
  const subtasksComplete = openSubtasks.length === 0;

  checklist.push({
    item: `All subtasks closed (${subtasks.length - openSubtasks.length}/${subtasks.length})`,
    passed: subtasksComplete,
  });

  if (!subtasksComplete) {
    blockers.push(`${openSubtasks.length} subtask(s) still open`);
    for (const st of openSubtasks.slice(0, 3)) {
      blockers.push(`  → Subtask #${st.id}: ${st.title} (${st.status})`);
    }
  }

  // Check 3: No blocking dependencies
  const blockingDeps = await Promise.all(
    task.dependencies.map((depId) => backlog.getTaskById(depId))
  );
  const incompleteDeps = blockingDeps.filter((dep) => dep && dep.status !== 'Done');
  const depsComplete = incompleteDeps.length === 0;

  checklist.push({
    item: `No blocking dependencies (${task.dependencies.length - incompleteDeps.length}/${task.dependencies.length})`,
    passed: depsComplete,
  });

  if (!depsComplete) {
    blockers.push(`${incompleteDeps.length} blocking dependency(ies) not completed`);
    for (const dep of incompleteDeps.slice(0, 3)) {
      if (dep) {
        blockers.push(`  → Task #${dep.id}: ${dep.title} (${dep.status})`);
      }
    }
  }

  // Check 4: Task is not blocked by others
  const notBlocked = task.blocked_by.length === 0;

  checklist.push({
    item: 'Not blocked by other tasks',
    passed: notBlocked,
  });

  if (!notBlocked) {
    warnings.push(`Task is blocking ${task.blocked_by.length} other task(s)`);
  }

  // Check 5: AI documentation present
  const hasAIDoc = !!task.ai_documentation && task.ai_documentation.length > 0;

  checklist.push({
    item: 'AI documentation present',
    passed: hasAIDoc,
  });

  if (!hasAIDoc) {
    warnings.push('No AI documentation - consider adding implementation details');
  }

  // Check 6: AI review completed
  const hasAIReview = !!task.ai_review && task.ai_review.length > 0;

  checklist.push({
    item: 'AI review completed',
    passed: hasAIReview,
  });

  if (!hasAIReview) {
    warnings.push('No AI review - self-review recommended before human review');
  }

  // Check 7: End date set
  const hasEndDate = !!task.end_date;

  checklist.push({
    item: 'End date set',
    passed: hasEndDate,
  });

  if (!hasEndDate) {
    warnings.push('No end date set - consider setting expected completion date');
  }

  // Check 8: Status is appropriate
  const statusOK = task.status === 'In Progress' || task.status === 'Review';

  checklist.push({
    item: 'Status is "In Progress" or "Review"',
    passed: statusOK,
  });

  if (!statusOK) {
    warnings.push(`Current status is "${task.status}" - expected "In Progress" or "Review"`);
  }

  // Suggest reviewers from assignees
  if (task.assignees.length > 0) {
    const nonAI = task.assignees.filter((a) => !a.toLowerCase().includes('ai'));
    if (nonAI.length > 0) {
      suggestedReviewers.push(...nonAI);
    }
  }

  return {
    checklist,
    blockers,
    warnings,
    suggestedReviewers,
  };
}

function generateNextSteps(readiness: ReadinessReport): string[] {
  const steps: string[] = [];

  // Prioritize blockers
  if (readiness.blockers.length > 0) {
    for (const blocker of readiness.blockers.slice(0, 5)) {
      if (!blocker.startsWith('  →')) {
        steps.push(blocker);
      }
    }
  }

  // Add warnings as suggestions
  if (readiness.warnings.length > 0 && steps.length < 5) {
    for (const warning of readiness.warnings.slice(0, 3)) {
      steps.push(warning);
    }
  }

  return steps;
}
