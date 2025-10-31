import type {
  BoardShowArgs,
  OverviewArgs,
  SearchArgs,
  TaskAiDocArgs,
  TaskAiNoteArgs,
  TaskAiPlanArgs,
  TaskAiReviewArgs,
  TaskCreateArgs,
  TaskEditArgs,
  TaskListArgs,
  TaskViewArgs,
  ToolDefinition,
} from './types.js';

// Import core functionality from commands
import { Backlog } from '../core/backlog.js';
import type { TaskPriority } from '../types/index.js';

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
  if (task.dependencies?.length) output += `**Dependencies:** ${task.dependencies.map((d) => `#${d}`).join(', ')}\n`;
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

  const results = allTasks.filter(task =>
    task.title.toLowerCase().includes(query) ||
    task.description.toLowerCase().includes(query)
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
      (task) =>
        `#${task.id} - ${task.title}\n  Status: ${task.status} | Priority: ${task.priority}`
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
  const completed = tasks.filter(t => completedStatuses.includes(t.status)).length;
  const inProgress = tasks.filter(t => t.status === 'In Progress').length;
  const toDo = tasks.filter(t => t.status === 'To Do').length;
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
    const columnTasks = tasks.filter(t => t.status === columnName);
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
