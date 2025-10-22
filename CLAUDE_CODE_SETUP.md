# Backmark Setup for Claude Code

This guide explains how to install and use Backmark with Claude Code.

## Prerequisites

- Node.js >= 18.0.0
- npm
- Claude Code installed

## Installation Steps

### 1. Install Backmark Globally

```bash
cd /home/jean-marc-strauven/Dev/Backmark
npm install
npm run install:global
```

This will:
- Install all dependencies
- Build the TypeScript code
- Link `backmark` command globally

### 2. Verify Installation

```bash
backmark --version
# Should output: 0.1.0

which backmark
# Should output: /home/jean-marc-strauven/Dev/Backmark/dist/cli.js
```

### 3. Configure Claude Code Agent

The Backmark agent is already configured in `.claude/agents/backmark-agent.md`.

**⚡ Easiest Way: Use `--install-agent` option**

When initializing a new project, use the `--install-agent` flag:

```bash
cd /path/to/your/project
backmark init "Your Project Name" --install-agent
```

This will automatically install the agent to `~/.config/claude-code/skills/backmark.md`.

If you don't use the flag, you'll be prompted during initialization.

**Manual Installation Options:**

#### Option A: Use as a Skill (Recommended)

Create a skill file to invoke the Backmark agent:

```bash
mkdir -p ~/.config/claude-code/skills
cat > ~/.config/claude-code/skills/backmark.md << 'EOF'
# Backmark Task Manager

You are now using the Backmark task management system.

## Instructions

Load the Backmark agent instructions from:
/home/jean-marc-strauven/Dev/Backmark/.claude/agents/backmark-agent.md

Follow all protocols and best practices defined in that file.

## Quick Reference

### Your Workflow
1. Check existing tasks: `backmark search "<keywords>"`
2. Create task if needed: `backmark task create "..." -a "Claude"`
3. Make plan: `backmark task ai-plan <id> "..."`
4. Start work: `backmark task edit <id> --status "In Progress"`
5. Log progress: `backmark task ai-note <id> "..."`
6. Document: `backmark task ai-doc <id> "..."`
7. Review: `backmark task ai-review <id> "..."`
8. Close: `backmark task close <id>`

### Key Commands
- `backmark task list --assignee "Claude"` - Your tasks
- `backmark task view <id> --ai-all` - View your work
- `backmark board show` - See Kanban board
- `backmark search "<query>"` - Find tasks

Always inform the user which task you're working on!
EOF
```

#### Option B: Reference in Claude Code Config

Add to your Claude Code configuration file (`~/.config/claude-code/config.json`):

```json
{
  "agents": {
    "backmark": {
      "path": "/home/jean-marc-strauven/Dev/Backmark/.claude/agents/backmark-agent.md",
      "description": "Task management agent for Backmark"
    }
  }
}
```

### 4. Initialize Backmark in Your Project

```bash
cd /path/to/your/project
backmark init "Your Project Name"
```

This creates:
```
backlog/
├── config.yml       # Configuration
└── .gitignore       # Ignore logs
```

### 5. Test the Setup

Create a test task:

```bash
backmark task create "Test task for Claude Code" \
  -p medium \
  -a "Claude" \
  -k "test,setup"

# View it
backmark task list

# Try AI commands
backmark task ai-plan 1 "This is a test plan"
backmark task ai-note 1 "Testing the integration"

# View everything
backmark task view 1 --ai-all
```

## Usage with Claude Code

### Starting a Conversation

When you start Claude Code in a project with Backmark:

```
User: "Implement user authentication using passport.js"

Claude Code:
- Creates task: backmark task create "Implement user authentication" -a "Claude"
- Makes plan: backmark task ai-plan 1 "..."
- Starts work: backmark task edit 1 --status "In Progress"
- Logs progress: backmark task ai-note 1 "..."
- Implements the feature
- Documents: backmark task ai-doc 1 "..."
- Reviews: backmark task ai-review 1 "..."
- Closes: backmark task close 1
```

### Monitoring Progress

In a separate terminal, watch the Kanban board:

```bash
backmark board show --watch
```

This updates every 3 seconds automatically!

### Viewing Claude's Work

Check what Claude has documented:

```bash
# List Claude's tasks
backmark task list --assignee "Claude"

# View specific task with all AI sections
backmark task view <id> --ai-all

# Just the plan
backmark task view <id> --ai-plan

# Just the notes
backmark task view <id> --ai-notes
```

## Project Configuration

### Default Configuration

Located at `backlog/config.yml`:

```yaml
project:
  name: "Your Project"
  createdAt: "2025-10-22T..."

board:
  columns:
    - "To Do"
    - "In Progress"
    - "Review"
    - "Done"

display:
  dateFormat: "yyyy-MM-dd HH:mm"
  zeroPaddedIds: true
  theme: "default"

search:
  threshold: 0.3
  maxResults: 50
```

### Customization

Edit `backlog/config.yml` to customize:

- Board columns
- Date format
- Search sensitivity
- Display preferences

## Workflow Examples

### Example 1: Feature Implementation

```bash
# Claude creates task
backmark task create "Add dark mode toggle" -p high -a "Claude" -m "v1.0"

# Claude makes plan
backmark task ai-plan 1 "
1. Create theme context
2. Add toggle component
3. Update CSS variables
4. Persist preference
"

# Claude adds acceptance criteria
backmark task add-criterion 1 "Toggle switches themes"
backmark task add-criterion 1 "Preference persisted"
backmark task add-criterion 1 "All components updated"

# Claude starts work
backmark task edit 1 --status "In Progress"

# Claude logs progress
backmark task ai-note 1 "Created ThemeContext with light/dark modes"
backmark task ai-note 1 "Added toggle button to header"
backmark task ai-note 1 "Updated CSS variables for both themes"

# Claude checks off criteria
backmark task check 1 0
backmark task check 1 1
backmark task check 1 2

# Claude documents
backmark task ai-doc 1 "## Dark Mode Implementation
Usage: Import ThemeContext and use theme state..."

# Claude reviews
backmark task ai-review 1 "✅ All tests passing
✅ Works in all browsers
💡 Consider adding system preference detection"

# Claude closes
backmark task close 1
```

### Example 2: Bug Fix

```bash
# User reports bug, Claude creates task
backmark task create "Fix login redirect loop" -p critical -a "Claude" -k "bug,urgent"

# Claude investigates and plans
backmark task ai-plan 2 "
1. Reproduce the issue
2. Debug auth middleware
3. Fix redirect logic
4. Add test to prevent regression
"

# Claude works and logs
backmark task ai-note 2 "Reproduced: happens when token expires during redirect"
backmark task ai-note 2 "Root cause: middleware redirecting before checking token validity"
backmark task ai-note 2 "Fixed: added token check before redirect"
backmark task ai-note 2 "Added integration test"

# Close
backmark task close 2
```

## Troubleshooting

### Command Not Found

```bash
# Reinstall
cd /home/jean-marc-strauven/Dev/Backmark
npm run install:global
```

### Backlog Not Initialized

```bash
# In your project directory
backmark init "Project Name"
```

### Permission Errors

```bash
# Make sure dist/cli.js is executable
chmod +x /home/jean-marc-strauven/Dev/Backmark/dist/cli.js
```

### Updates Not Showing in Board

```bash
# Reload backlog data
backmark board show --watch
```

## Uninstallation

```bash
cd /home/jean-marc-strauven/Dev/Backmark
npm run uninstall:global
```

## Tips for Effective Use

### 1. Always Assign to Claude

When Claude works on tasks, assign them:
```bash
backmark task assign <id> "Claude"
```

### 2. Use Watch Mode

Keep a terminal open with:
```bash
backmark board show --watch
```

### 3. Frequent Notes

Log progress frequently for better tracking:
```bash
backmark task ai-note <id> "Small progress update"
```

### 4. Detailed Reviews

Claude's self-reviews should be thorough:
- What was completed
- What was tested
- Quality metrics
- Suggestions for improvement
- Questions for human review

### 5. Search Before Creating

Avoid duplicate tasks:
```bash
backmark search "authentication"
```

## Integration with Git

While Backmark doesn't have Git integration, tasks are stored as Markdown files, so:

```bash
# Commit task changes
git add backlog/
git commit -m "Update task status"

# Share tasks with team
git push
```

## Next Steps

1. ✅ Install Backmark globally
2. ✅ Configure Claude Code agent
3. ✅ Initialize Backmark in your project
4. ✅ Create a test task
5. 🚀 Start vibe coding with Claude!

## Support

- Documentation: `/home/jean-marc-strauven/Dev/Backmark/README.md`
- Agent Instructions: `/home/jean-marc-strauven/Dev/Backmark/.claude/agents/backmark-agent.md`
- Issues: Check project repository

---

**Happy vibe coding with Backmark and Claude Code!** 🚀
