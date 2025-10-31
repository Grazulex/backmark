import type { ResourceDefinition } from './types.js';
import { Backlog } from '../core/backlog.js';

/**
 * Register all available MCP resources
 */
export function registerResources(): ResourceDefinition[] {
  return [
    {
      uri: 'backmark://config',
      name: 'Backlog Configuration',
      description: 'Current backlog configuration (statuses, priorities, board columns)',
      mimeType: 'application/json',
    },
    {
      uri: 'backmark://tasks/all',
      name: 'All Tasks',
      description: 'List of all tasks in the backlog',
      mimeType: 'application/json',
    },
    {
      uri: 'backmark://docs/workflow',
      name: 'AI Workflow Guide',
      description: 'Guide for AI-assisted task management workflow',
      mimeType: 'text/markdown',
    },
    {
      uri: 'backmark://docs/task-structure',
      name: 'Task Structure Documentation',
      description: 'Complete documentation of task metadata and structure',
      mimeType: 'text/markdown',
    },
    {
      uri: 'backmark://stats/overview',
      name: 'Project Statistics',
      description: 'Current project statistics and metrics',
      mimeType: 'application/json',
    },
  ];
}

/**
 * Handle resource read requests
 */
export async function handleResourceRead(
  uri: string
): Promise<{ contents: Array<{ uri: string; mimeType: string; text: string }> }> {
  try {
    switch (uri) {
      case 'backmark://config':
        return await getConfig();
      case 'backmark://tasks/all':
        return await getAllTasks();
      case 'backmark://docs/workflow':
        return getWorkflowGuide();
      case 'backmark://docs/task-structure':
        return getTaskStructureDoc();
      case 'backmark://stats/overview':
        return await getStats();
      default:
        throw new Error(`Unknown resource: ${uri}`);
    }
  } catch (error) {
    return {
      contents: [
        {
          uri,
          mimeType: 'text/plain',
          text: `Error: ${error instanceof Error ? error.message : String(error)}`,
        },
      ],
    };
  }
}

// Resource handler implementations

async function getConfig(): Promise<{
  contents: Array<{ uri: string; mimeType: string; text: string }>;
}> {
  const backlog = await Backlog.load();
  const config = await backlog.getConfig();

  return {
    contents: [
      {
        uri: 'backmark://config',
        mimeType: 'application/json',
        text: JSON.stringify(config, null, 2),
      },
    ],
  };
}

async function getAllTasks(): Promise<{
  contents: Array<{ uri: string; mimeType: string; text: string }>;
}> {
  const backlog = await Backlog.load();
  const tasks = await backlog.getTasks();

  // Simplified task view for listing
  const simplifiedTasks = tasks.map((task) => ({
    id: task.id,
    title: task.title,
    status: task.status,
    priority: task.priority,
    assignees: task.assignees,
    labels: task.labels,
    milestone: task.milestone,
    created_date: task.created_date,
    updated_date: task.updated_date,
  }));

  return {
    contents: [
      {
        uri: 'backmark://tasks/all',
        mimeType: 'application/json',
        text: JSON.stringify(simplifiedTasks, null, 2),
      },
    ],
  };
}

function getWorkflowGuide(): {
  contents: Array<{ uri: string; mimeType: string; text: string }>;
} {
  const guide = `# AI Workflow Guide for Backmark

## Overview
Backmark is designed for seamless collaboration between humans and AI during vibe coding sessions.

## Recommended Workflow

### 1. Task Creation
When starting work on a feature:
\`\`\`
backmark_task_create({
  title: "Add user authentication",
  description: "Implement JWT-based authentication system",
  priority: "high",
  assignees: ["Claude"],
  labels: ["feature", "auth"]
})
\`\`\`

### 2. Planning Phase
Document your implementation plan:
\`\`\`
backmark_task_ai_plan({
  id: 15,
  plan: \`
## Implementation Plan

### 1. Setup Dependencies
- Install passport.js and jsonwebtoken
- Configure middleware

### 2. Create Auth Routes
- POST /auth/login
- POST /auth/register
- GET /auth/verify

### 3. Add JWT Middleware
- Token generation
- Token validation
- Protected routes

### 4. Tests
- Unit tests for auth functions
- Integration tests for routes
  \`
})
\`\`\`

### 3. Update Status
Mark the task as in progress:
\`\`\`
backmark_task_edit({
  id: 15,
  status: "In Progress"
})
\`\`\`

### 4. Work Notes
Add timestamped notes as you work:
\`\`\`
backmark_task_ai_note({
  id: 15,
  note: "Installed passport.js. Using JWT strategy instead of local strategy for better scalability."
})
\`\`\`

### 5. Documentation
Document your implementation:
\`\`\`
backmark_task_ai_doc({
  id: 15,
  documentation: \`
## Authentication System

### Usage
\\\`\\\`\\\`javascript
const token = await authService.login(username, password);
\\\`\\\`\\\`

### Configuration
Set JWT_SECRET in .env file
  \`
})
\`\`\`

### 6. Self-Review
Review your work before marking as complete:
\`\`\`
backmark_task_ai_review({
  id: 15,
  review: \`
## Completed
- ✓ JWT authentication working
- ✓ Tests passing (12/12)
- ✓ Documentation complete

## Questions for Review
- Should we add refresh token support?
- Rate limiting on login endpoint?
  \`
})
\`\`\`

### 7. Close Task
Mark as complete:
\`\`\`
backmark_task_close({ id: 15 })
\`\`\`

## Best Practices

### For AI
- Always document your plan before implementation
- Add notes for important decisions
- Generate comprehensive documentation
- Perform self-review before closing tasks
- Use clear, descriptive task titles
- Tag tasks with relevant labels

### For Humans
- Review AI plans before implementation starts
- Provide feedback on AI reviews
- Create parent tasks for large features
- Use milestones to group related work
- Regularly check the board for progress

## Useful Commands

### Search
Find tasks quickly:
\`\`\`
backmark_search({ query: "auth", status: "In Progress" })
\`\`\`

### Overview
Check project progress:
\`\`\`
backmark_overview({ milestone: "v1.0" })
\`\`\`

### Board
View Kanban board:
\`\`\`
backmark_board_show({ milestone: "v1.0" })
\`\`\`

## Tips
- Use subtasks for breaking down large features
- Set dependencies to track task relationships
- Assign realistic start and end dates
- Use acceptance criteria for clear success metrics
`;

  return {
    contents: [
      {
        uri: 'backmark://docs/workflow',
        mimeType: 'text/markdown',
        text: guide,
      },
    ],
  };
}

function getTaskStructureDoc(): {
  contents: Array<{ uri: string; mimeType: string; text: string }>;
} {
  const doc = `# Task Structure Documentation

## Metadata Fields

### Identifiers
- \`id\`: Unique task identifier (auto-generated)
- \`title\`: Task title (required)
- \`description\`: Detailed description (Markdown supported)

### Dates
#### Manual (user-set)
- \`start_date\`: Planned start date (YYYY-MM-DD)
- \`end_date\`: Planned end date (YYYY-MM-DD)
- \`release_date\`: Target release date (YYYY-MM-DD)

#### Automatic (system-managed)
- \`created_date\`: Creation timestamp (ISO 8601)
- \`updated_date\`: Last modification timestamp (ISO 8601)
- \`closed_date\`: Closure timestamp (ISO 8601, null if open)

### Organization
- \`status\`: Current status (e.g., "To Do", "In Progress", "Done")
- \`priority\`: Priority level (low, medium, high, critical)
- \`milestone\`: Associated milestone (e.g., "v1.0", "Sprint 3")

### Hierarchy & Dependencies
- \`parent_task\`: Parent task ID (for subtasks)
- \`subtasks\`: Array of subtask IDs
- \`dependencies\`: Array of task IDs this task depends on
- \`blocked_by\`: Array of task IDs blocking this task

### People & Labels
- \`assignees\`: Array of assignees (e.g., ["@alice", "@bob", "Claude"])
- \`labels\`: Array of labels/tags

### Change Tracking
- \`changelog\`: Array of change log entries
  - \`timestamp\`: When the change occurred
  - \`action\`: Type of change (created, updated, status_changed, etc.)
  - \`details\`: Change description
  - \`user\`: Who made the change

### Acceptance Criteria
- \`acceptance_criteria\`: Array of criteria with:
  - \`text\`: Criterion description
  - \`checked\`: Boolean completion status

### AI Spaces (for vibe coding)
- \`ai_plan\`: Detailed implementation plan from AI
- \`ai_notes\`: Timestamped work notes from AI
- \`ai_documentation\`: Generated documentation from AI
- \`ai_review\`: Self-review from AI

## File Format

Tasks are stored as Markdown files with YAML frontmatter:

\`\`\`markdown
---
id: 10
title: "Add search functionality"
status: "In Progress"
priority: "high"
assignees:
  - "Claude"
labels:
  - "feature"
  - "search"
milestone: "v1.0"
created_date: "2025-10-31T10:00:00Z"
updated_date: "2025-10-31T14:30:00Z"
ai_plan: |
  ## Implementation Steps
  1. Install Fuse.js
  2. Create search index
  3. Add search command
---

# Task Description

Implement fuzzy search across all tasks using Fuse.js...
\`\`\`

## File Naming Convention

Tasks are named: \`task-{ID} - {Title}.md\`

Example: \`task-10 - Add search functionality.md\`
`;

  return {
    contents: [
      {
        uri: 'backmark://docs/task-structure',
        mimeType: 'text/markdown',
        text: doc,
      },
    ],
  };
}

async function getStats(): Promise<{
  contents: Array<{ uri: string; mimeType: string; text: string }>;
}> {
  const backlog = await Backlog.load();
  const tasks = await backlog.getTasks();
  const config = await backlog.getConfig();

  // Calculate statistics
  const totalTasks = tasks.length;
  const completedStatuses = config.board?.completedStatuses || ['Done'];
  const completed = tasks.filter(t => completedStatuses.includes(t.status)).length;
  const inProgress = tasks.filter(t => t.status === 'In Progress').length;
  const toDo = tasks.filter(t => t.status === 'To Do').length;
  const completionRate = totalTasks > 0 ? Math.round((completed / totalTasks) * 100) : 0;

  const stats = {
    totalTasks,
    completed,
    inProgress,
    toDo,
    completionRate,
  };

  return {
    contents: [
      {
        uri: 'backmark://stats/overview',
        mimeType: 'application/json',
        text: JSON.stringify(stats, null, 2),
      },
    ],
  };
}
