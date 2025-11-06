# 🚀 Quick Start Guide

Get started with Backmark in 5 minutes! This guide will walk you through installation, creating your first task, and using the basic features.

---

## 📦 Installation

### Option 1: Global Installation (Recommended)

```bash
npm install -g @grazulex/backmark
```

Verify installation:
```bash
backmark --version
# Should output: 0.6.1 or higher
```

### Option 2: Local Installation

```bash
# In your project directory
npm install @grazulex/backmark

# Use with npx
npx backmark --version
```

---

## 🎯 Initialize Your First Backlog

Navigate to your project directory and initialize Backmark:

```bash
cd my-project
backmark init "My Awesome Project"
```

This creates:
```
my-project/
└── backlog/
    ├── config.yml      # Configuration
    └── .gitignore      # Ignore cache files
```

**Note**: For deeper AI integration, configure the Backmark MCP server in your Claude Code settings. See [Using with Claude Code](../README.md#-using-with-claude-code-mcp-integration) in the main README.

---

## ✨ Create Your First Task

### Simple Task Creation

```bash
backmark task create "Add user authentication"
```

You'll be prompted for a description (optional). Press Enter to skip or add details.

### Task Creation with Options

```bash
backmark task create "Fix login bug" \
  --description "Users can't login with special characters in password" \
  --status "To Do" \
  --priority high \
  --assignees "@alice,@bob" \
  --labels "bug,security" \
  --milestone "v1.0"
```

**Output Example:**
```
✓ Task created successfully!

──────────────────────────────────────────────────────────────────────
Task Created: #001 Fix login bug
──────────────────────────────────────────────────────────────────────
● Status:       To Do
🔥 Priority:    HIGH
🏁 Milestone:   v1.0
👤 Assignees:   @alice, @bob
🏷️  Labels:      bug, security

Dates:
   Created:     2025-01-20 14:30:00
──────────────────────────────────────────────────────────────────────
File: /path/to/backlog/task-001 - Fix login bug.md
──────────────────────────────────────────────────────────────────────
```

---

## 📋 Using Task Templates (NEW in v0.7.0)

Task templates provide pre-structured tasks for common scenarios, making it faster to create well-organized tasks.

### Available Templates

Backmark includes 4 built-in templates:
- **feature** - New feature development
- **bugfix** - Bug fixes with debugging workflow
- **refactoring** - Code improvements with quality metrics
- **research** - Investigation and technology evaluation

### List Templates

```bash
backmark task templates
```

Output:
```
📋 Available Task Templates:

Built-in Templates:
  ✨  feature - New feature development
  🐛  bugfix - Bug fix with debugging steps
  ♻️  refactoring - Code refactoring and improvement
  🔍  research - Research and investigation

Usage:
  backmark task create "Task title" --template <name>
  backmark task template show <name> # View template content
```

### View Template Content

```bash
backmark task template show feature
```

### Create Task from Template

```bash
backmark task create "Add user authentication" \
  --template feature \
  --priority high \
  --assignees "Claude" \
  --milestone "v1.0"
```

The template provides a pre-structured description with:
- 📝 Feature description section
- 🎯 Objectives checklist
- 🤖 AI plan section
- 🧪 Testing strategy
- ⚠️ Risks and considerations

**Pro tip**: Templates are especially useful when working with AI agents, as they provide consistent structure for planning and documentation.

### Custom Templates

Create your own templates in `backlog/templates/`:

```bash
mkdir -p backlog/templates
cat > backlog/templates/my-template.md << 'EOF'
---
status: To Do
priority: medium
labels:
  - custom
---

# My Custom Template

## Description
{Add description here}

## Checklist
- [ ] Step 1
- [ ] Step 2
EOF

# Use custom template
backmark task create "My task" --template custom:my-template
```

See the [AI Workflow Guide](ai-workflow.md#pattern-0-using-task-templates-new-in-v070) for more details on templates.

---

## 📋 List Your Tasks

### Basic Listing

```bash
backmark task list
```

Output:
```
┌─────┬──────────────────────┬─────────────┬──────────┬───────────┬─────────────┐
│ ID  │ Title                │ Status      │ Priority │ Assignees │ Updated     │
├─────┼──────────────────────┼─────────────┼──────────┼───────────┼─────────────┤
│ #001│ Fix login bug        │ To Do       │ HIGH     │ @alice    │ 2 hours ago │
│ #002│ Add user auth        │ In Progress │ MEDIUM   │ @bob      │ 1 hour ago  │
└─────┴──────────────────────┴─────────────┴──────────┴───────────┴─────────────┘

Total: 2 task(s)
```

### Filtered Listing

```bash
# By status
backmark task list --status "In Progress"

# By priority
backmark task list --priority high

# By assignee
backmark task list --assignee "@alice"

# By milestone
backmark task list --milestone "v1.0"

# By label
backmark task list --label "bug"

# Combine filters
backmark task list --status "To Do" --priority high --label "security"
```

---

## 🔍 View Task Details

```bash
backmark task view 1
```

This shows:
- Full task details
- Changelog history
- Dependencies and subtasks
- AI plan/notes (if any)
- Acceptance criteria

---

## ✏️ Edit a Task

### Update Task Status

```bash
backmark task edit 1 --status "In Progress"
```

### Update Multiple Fields

```bash
backmark task edit 1 \
  --status "Done" \
  --priority low \
  --assignees "@charlie"
```

### Add to Existing Fields

```bash
# Add a new label
backmark task edit 1 --labels "bug,security,urgent"

# Add an assignee
backmark task edit 1 --assignees "@alice,@bob,@charlie"
```

---

## 📊 Kanban Board

View your tasks in a visual Kanban board:

```bash
backmark board
```

This opens an **interactive terminal UI** where you can:
- See tasks organized by status columns
- Navigate with arrow keys
- Press `q` to quit

### Board Export

Generate a Markdown snapshot of your board:

```bash
backmark board export
```

---

## 🔗 Task Hierarchy

### Create Subtasks

```bash
# Create parent task
backmark task create "User Management System"

# Create subtasks
backmark task create "Add login endpoint" --parent 1
backmark task create "Add logout endpoint" --parent 1
backmark task create "Add password reset" --parent 1
```

### View Task Tree

```bash
backmark task tree 1
```

Output:
```
#001 User Management System
├── #002 Add login endpoint
├── #003 Add logout endpoint
└── #004 Add password reset
```

---

## 🔗 Task Dependencies

### Create Task with Dependencies

```bash
# Task 5 depends on tasks 2 and 3
backmark task create "Deploy authentication" --depends-on "2,3"
```

### View Dependencies

```bash
backmark task deps 5
```

### View Blocked Tasks

```bash
backmark task blocked
```

Lists all tasks that are blocked by dependencies.

---

## 🤖 AI Workflow Basics

Backmark is designed for **human-AI collaboration**. Here's a quick intro:

### Assign AI to a Task

```bash
backmark task create "Implement JWT authentication" \
  --assignees "Claude" \
  --labels "feature,backend"
```

### Add AI Plan

```bash
backmark task ai-plan 1 "
## Implementation Plan

1. Install jsonwebtoken library
2. Create JWT signing/verification functions
3. Add authentication middleware
4. Protect routes with middleware
5. Add tests
"
```

### Add AI Notes During Work

```bash
backmark task ai-note 1 "Installed jsonwebtoken v9.0.0"
backmark task ai-note 1 "Created auth middleware in src/middleware/auth.ts"
```

### Add AI Documentation

```bash
backmark task ai-doc 1 "$(cat docs/auth-implementation.md)"
```

### Add AI Review

```bash
backmark task ai-review 1 "
## Review

✅ Completed:
- JWT implementation working
- All tests passing (12/12)
- Documentation updated

⚠️ Notes:
- Token expiry set to 24h (configurable)
- Used HS256 algorithm

💡 Suggestions:
- Consider adding refresh token support
- Add rate limiting for auth endpoints
"
```

### View AI Sections

```bash
# View all AI sections
backmark task view 1 --ai-all

# View specific sections
backmark task view 1 --ai-plan
backmark task view 1 --ai-notes
backmark task view 1 --ai-doc
backmark task view 1 --ai-review
```

---

## 🔍 Search Tasks

### Fuzzy Search

```bash
backmark search "authentication"
```

This searches across:
- Task titles
- Descriptions
- Labels
- AI content

### Search with Filters

```bash
backmark search "bug" --status "To Do" --priority high
```

---

## 📈 Overview & Statistics

Get a bird's-eye view of your project:

```bash
backmark overview
```

Output:
```
╔══════════════════════════════════════════════════════════════════╗
║                     📊 PROJECT OVERVIEW                          ║
╚══════════════════════════════════════════════════════════════════╝

Project: My Awesome Project

📋 TASKS BY STATUS
   To Do:        15 tasks (45%)
   In Progress:   8 tasks (24%)
   Review:        5 tasks (15%)
   Done:          5 tasks (16%)
   ─────────────────────────────
   Total:        33 tasks

🔥 PRIORITY BREAKDOWN
   Critical:      2 tasks
   High:          8 tasks
   Medium:       18 tasks
   Low:           5 tasks

🏁 MILESTONES
   v1.0:         12 tasks (8 done, 4 remaining)
   v1.1:          6 tasks (0 done, 6 remaining)

🤖 AI COLLABORATION
   Tasks with AI: 15 (45%)
   AI Plans:      12
   AI Reviews:     8

🚧 BLOCKERS
   Blocked tasks: 3
   Need attention: 2
```

### Overview by Milestone

```bash
backmark overview --milestone "v1.0"
```

---

## 📝 Acceptance Criteria

### Add Acceptance Criteria

```bash
backmark task check add 1 "Users can login with email"
backmark task check add 1 "Password is hashed with bcrypt"
backmark task check add 1 "JWT token is returned on success"
```

### Check Off Criteria

```bash
backmark task check done 1 1  # Mark first criterion as done
```

### View Checklist

```bash
backmark task check list 1
```

---

## ⚙️ Configuration

Your backlog configuration is stored in `backlog/config.yml`:

```yaml
project:
  name: "My Awesome Project"
  createdAt: "2025-01-20T10:00:00Z"

board:
  columns:
    - "To Do"
    - "In Progress"
    - "Review"
    - "Done"

display:
  dateFormat: "YYYY-MM-DD HH:mm"
  zeroPaddedIds: true    # Use #001 instead of #1

performance:
  useIndex: true              # Use LokiJS index for fast queries
  rebuildIndexOnStart: false  # Rebuild index on startup

validations:
  close:
    check_subtasks: true           # Warn if closing with open subtasks
    check_dependencies: true       # Warn if blocking other tasks
    check_acceptance_criteria: true # Warn if criteria not met
    warn_missing_ai_review: true   # Warn if no AI review
```

You can edit this file directly or use commands to update settings.

---

## 🎓 Next Steps

Now that you know the basics, explore more:

1. **AI Workflow**: Read [AI Workflow Guide](ai-workflow.md) for advanced AI collaboration
2. **Best Practices**: Learn task organization patterns
3. **MCP Integration**: Set up the Backmark MCP server for seamless AI integration with Claude Code
4. **Troubleshooting**: Check [Troubleshooting Guide](troubleshooting.md) if you encounter issues

---

## 📚 Quick Reference

### Most Used Commands

```bash
# Initialize
backmark init "Project Name"

# Create task
backmark task create "Title" --status "To Do" --priority high

# Create task from template
backmark task create "Title" --template feature --priority high

# List templates
backmark task templates

# View template
backmark task template show feature

# List tasks
backmark task list --status "In Progress"

# View task
backmark task view <id>

# Edit task
backmark task edit <id> --status "Done"

# Board view
backmark board

# Search
backmark search "keyword"

# Overview
backmark overview

# AI workflow
backmark task ai-plan <id> "plan content"
backmark task ai-note <id> "note"
backmark task view <id> --ai-all
```

---

## 💡 Tips

1. **Use templates**: Start with templates (feature, bugfix, refactoring, research) for consistent task structure
2. **Use filters**: Combine `--status`, `--priority`, `--label` to narrow down task lists
3. **AI assignees**: Use "Claude", "AI", or any AI name to track AI work
4. **Labels**: Use labels for cross-cutting concerns (bug, feature, security, etc.)
5. **Milestones**: Group tasks by release version or sprint
6. **Dependencies**: Use `--depends-on` to track task relationships
7. **Subtasks**: Break down complex tasks into smaller, manageable pieces
8. **Acceptance criteria**: Define done-ness criteria upfront
9. **AI documentation**: Document AI decisions and implementations as you go
10. **Custom templates**: Create project-specific templates in `backlog/templates/`

---

## 🆘 Getting Help

```bash
# General help
backmark --help

# Command-specific help
backmark task --help
backmark task create --help
```

For more help:
- 📖 [Full Documentation](../README.md)
- 🤖 [AI Workflow Guide](ai-workflow.md)
- 🐛 [Troubleshooting](troubleshooting.md)
- 💬 [GitHub Discussions](https://github.com/Grazulex/backmark/discussions)
- 🐛 [Report Issues](https://github.com/Grazulex/backmark/issues)

---

**Happy tasking! 🚀**
