# 📋 Backmark

**Markdown-native task management designed for AI-powered vibe coding**

Backmark is a powerful CLI tool that transforms plain Markdown files into a structured project management system. Built specifically for developers working with AI assistants (Claude, GPT, etc.), it provides dedicated spaces for AI to plan, document, and track its work alongside yours.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)](https://www.typescriptlang.org/)
[![Node](https://img.shields.io/badge/Node-%3E%3D18.0.0-green)](https://nodejs.org/)

---

## ✨ Features

### 🎯 Core Task Management
- **Markdown-based storage**: Every task is a `.md` file with YAML frontmatter
- **Rich metadata**: Priorities, statuses, keywords, milestones, dates
- **Hierarchical tasks**: Parent/child relationships and subtasks
- **Dependencies**: Track task dependencies and blocked tasks
- **Acceptance criteria**: Built-in checklist for each task
- **Full changelog**: Automatic logging of all task modifications

### 🤖 AI-First Design
- **Dedicated AI spaces**: `ai_plan`, `ai_notes`, `ai_documentation`, `ai_review`
- **AI assignees**: Special highlighting for AI team members (Claude, GPT, etc.)
- **Vibe coding workflow**: Optimized for human-AI collaboration
- **Complete history**: Track all AI contributions with timestamps

### 🎨 Beautiful CLI
- **Colorful output**: Priorities, statuses, and AI contributions color-coded
- **Kanban board**: Simple, reliable board view with auto-refresh
- **Fuzzy search**: Find tasks instantly with Fuse.js
- **Interactive prompts**: User-friendly task creation and editing

### 🔧 Developer-Friendly
- **Zero configuration**: Works out of the box
- **Offline-first**: No cloud dependencies, all local
- **Git-friendly**: Plain Markdown files, perfect for version control
- **Extensible**: TypeScript with clean architecture

---

## 📦 Installation

### Prerequisites
- Node.js >= 18.0.0
- npm or yarn

### Install Dependencies
```bash
cd /path/to/Backmark
npm install
```

### Run Development Version
```bash
npm run dev -- <command>
```

### Build for Production
```bash
npm run build
npm link  # Makes 'backmark' available globally
```

---

## 🚀 Quick Start

### 1. Initialize a Project
```bash
backmark init "My Project"
```

This creates:
```
backlog/
├── config.yml       # Project configuration
└── .gitignore       # Ignore logs and temp files
```

**Install Claude Code Agent (Optional)**
```bash
# Install agent during initialization
backmark init "My Project" --install-agent

# You'll be prompted during init if you don't specify the option
```

The agent will be installed to `~/.config/claude-code/skills/backmark.md` and provides specialized task management capabilities for Claude Code.

### 2. Create Your First Task
```bash
backmark task create "Implement user authentication" \
  -p high \
  -a "Claude" \
  -k "backend,security" \
  -m "v1.0"
```

### 3. View Your Tasks
```bash
# List all tasks
backmark task list

# View detailed task
backmark task view 1

# See the Kanban board
backmark board show
```

### 4. AI Workflow
```bash
# AI creates a plan
backmark task ai-plan 1 "1. Setup passport.js\n2. Create auth routes\n3. Add JWT tokens"

# AI takes notes while working
backmark task ai-note 1 "Installed passport.js successfully"

# AI documents the implementation
backmark task ai-doc 1 "## Authentication Flow\n..."

# AI reviews the work
backmark task ai-review 1 "✅ Tests passing\n💡 Consider rate limiting"

# View all AI sections
backmark task view 1 --ai-all
```

---

## 📚 Complete Command Reference

### Initialization

#### `backmark init [name]`
Initialize a new backlog in the current directory.

**Options:**
- `[name]` - Project name (optional, prompts if not provided)

**Example:**
```bash
backmark init "E-Commerce Platform"
```

---

### Task Management

#### `backmark task create <title> [options]`
Create a new task with rich metadata.

**Options:**
- `-d, --description <text>` - Task description
- `-s, --status <status>` - Task status (default: "To Do")
- `-p, --priority <priority>` - Priority: low, medium, high, critical (default: medium)
- `-a, --assignees <assignees>` - Comma-separated assignees
- `-l, --labels <labels>` - Comma-separated labels
- `-k, --keywords <keywords>` - Comma-separated keywords for search
- `-m, --milestone <milestone>` - Associated milestone
- `--start <date>` - Start date (YYYY-MM-DD)
- `--end <date>` - End date (YYYY-MM-DD)
- `--release <date>` - Release date (YYYY-MM-DD)
- `--parent <id>` - Parent task ID (creates a subtask)
- `--depends-on <ids>` - Comma-separated task IDs this depends on

**Examples:**
```bash
# Simple task
backmark task create "Fix login bug"

# Complete task with all metadata
backmark task create "Build REST API" \
  -d "Implement RESTful API with Express.js" \
  -s "To Do" \
  -p high \
  -a "Alice,Claude" \
  -k "backend,api,express" \
  -m "v1.0" \
  --start "2025-10-25" \
  --end "2025-10-30"

# Create a subtask
backmark task create "Setup Express server" --parent 5

# Task with dependencies
backmark task create "Deploy to production" --depends-on "3,4,5"
```

#### `backmark task list [options]`
List all tasks with optional filters.

**Options:**
- `-s, --status <status>` - Filter by status
- `-p, --priority <priority>` - Filter by priority
- `-a, --assignee <assignee>` - Filter by assignee
- `-l, --label <label>` - Filter by label
- `-k, --keyword <keyword>` - Filter by keyword
- `-m, --milestone <milestone>` - Filter by milestone
- `--parent <id>` - Filter by parent task ID (show subtasks)

**Examples:**
```bash
# List all tasks
backmark task list

# Filter by status
backmark task list --status "In Progress"

# Filter by assignee (find AI tasks)
backmark task list --assignee "Claude"

# Filter by milestone
backmark task list --milestone "v1.0"

# Show subtasks of task #5
backmark task list --parent 5

# Combine filters
backmark task list --status "To Do" --priority high --milestone "v1.0"
```

#### `backmark task view <id> [options]`
View detailed information about a task.

**Options:**
- `--ai-plan` - Show only AI plan section
- `--ai-notes` - Show only AI notes section
- `--ai-doc` - Show only AI documentation section
- `--ai-review` - Show only AI review section
- `--ai-all` - Show all AI sections

**Examples:**
```bash
# View full task details
backmark task view 1

# View only AI plan
backmark task view 1 --ai-plan

# View all AI sections
backmark task view 1 --ai-all
```

#### `backmark task edit <id> [options]`
Edit task properties.

**Options:**
- `-s, --status <status>` - Update status
- `-p, --priority <priority>` - Update priority
- `-m, --milestone <milestone>` - Update milestone
- `--start <date>` - Update start date
- `--end <date>` - Update end date
- `--release <date>` - Update release date
- `--add-keyword <keywords>` - Add keywords (comma-separated)
- `--remove-keyword <keywords>` - Remove keywords (comma-separated)
- `--add-label <labels>` - Add labels (comma-separated)
- `--remove-label <labels>` - Remove labels (comma-separated)
- `--add-dependency <ids>` - Add dependencies (comma-separated IDs)
- `--remove-dependency <ids>` - Remove dependencies (comma-separated IDs)

**Examples:**
```bash
# Change status
backmark task edit 1 --status "In Progress"

# Update priority and milestone
backmark task edit 1 --priority critical --milestone "v2.0"

# Add keywords
backmark task edit 1 --add-keyword "urgent,hotfix"

# Remove a label
backmark task edit 1 --remove-label "wontfix"

# Add dependencies
backmark task edit 5 --add-dependency "3,4"

# Combine multiple updates
backmark task edit 1 --status "Done" --add-label "verified"
```

#### `backmark task assign <id> <assignees>`
Assign task to people (or AI).

**Examples:**
```bash
# Assign to a person
backmark task assign 1 "Alice"

# Assign to multiple people
backmark task assign 1 "Alice,Bob,Claude"

# Assign to AI assistant
backmark task assign 1 "Claude"
```

#### `backmark task close <id>`
Close a task (sets status to "Done" and adds closed_date).

**Example:**
```bash
backmark task close 1
```

---

### AI-Specific Commands

These commands are designed for AI assistants to document their work.

#### `backmark task ai-plan <id> <content>`
Add or update the AI implementation plan.

**Example:**
```bash
backmark task ai-plan 1 "## Implementation Plan

1. Setup authentication middleware
2. Create login/logout routes
3. Add JWT token generation
4. Implement refresh token logic
5. Write integration tests"
```

#### `backmark task ai-note <id> <content>`
Add a timestamped AI development note.

Notes are appended with timestamps, creating a development log.

**Example:**
```bash
backmark task ai-note 1 "Installed passport.js and passport-jwt packages"
backmark task ai-note 1 "Created AuthController with login method"
backmark task ai-note 1 "Tests passing, ready for review"
```

#### `backmark task ai-doc <id> <content>`
Add or update AI-generated documentation.

**Example:**
```bash
backmark task ai-doc 1 "## Authentication System

### Overview
This implements JWT-based authentication using passport.js.

### Usage
\`\`\`javascript
const token = await authService.login(email, password);
\`\`\`

### Configuration
Set JWT_SECRET in environment variables."
```

#### `backmark task ai-review <id> <content>`
Add or update AI self-review.

**Example:**
```bash
backmark task ai-review 1 "## Self Review

### ✅ Completed
- [x] Login endpoint working
- [x] JWT tokens generated correctly
- [x] Tests passing (12/12)

### 🔍 Tested
- Login with valid credentials ✓
- Login with invalid credentials ✓
- Token refresh flow ✓

### 💡 Improvements
- Consider adding rate limiting
- Add email verification

### ❓ Questions
- Should we implement 2FA?"
```

---

### Acceptance Criteria

#### `backmark task add-criterion <id> <text>`
Add a new acceptance criterion to a task.

**Example:**
```bash
backmark task add-criterion 1 "User can login with email and password"
backmark task add-criterion 1 "JWT token is returned on successful login"
```

#### `backmark task check <id> <index>`
Mark an acceptance criterion as completed.

**Example:**
```bash
backmark task check 1 0  # Check first criterion (index 0)
backmark task check 1 1  # Check second criterion
```

#### `backmark task uncheck <id> <index>`
Mark an acceptance criterion as incomplete.

**Example:**
```bash
backmark task uncheck 1 0
```

---

### Hierarchy & Dependencies

#### `backmark task tree <id>`
Display the task hierarchy tree.

Shows parent task, current task, and all subtasks in a visual tree.

**Example:**
```bash
backmark task tree 5
```

**Output:**
```
══════════════════════════════════════
Task Hierarchy Tree
══════════════════════════════════════

Parent:
  #002 Backend API  To Do

  │
📋 #005 REST Endpoints  In Progress
  │
  ├─ #006 GET /users  Done
  ├─ #007 POST /users  In Progress
  └─ #008 DELETE /users  To Do
```

#### `backmark task deps <id>`
Show all task dependencies and dependents.

**Example:**
```bash
backmark task deps 5
```

**Output:**
```
═══════════════════════════════════════
🔗 Dependencies for #005: REST Endpoints
═══════════════════════════════════════

This task depends on:
  ✓ #003 Database Schema  Done
  ○ #004 Auth Middleware  In Progress

Tasks depending on this:
  #009 Frontend Integration  To Do
  #010 API Documentation  To Do
```

#### `backmark task blocked`
List all blocked tasks.

Shows tasks that have dependencies in `blocked_by` field.

**Example:**
```bash
backmark task blocked
```

---

### Search

#### `backmark search <query> [options]`
Search tasks with fuzzy matching.

**Options:**
- `-s, --status <status>` - Filter by status
- `-p, --priority <priority>` - Filter by priority
- `-a, --assignee <assignee>` - Filter by assignee
- `-m, --milestone <milestone>` - Filter by milestone
- `-k, --keyword <keyword>` - Filter by keyword
- `-l, --label <label>` - Filter by label

**Search algorithm:**
- Title: 40% weight
- Description: 30% weight
- Keywords: 20% weight
- Labels: 10% weight
- Threshold: 0.3 (fuzzy matching tolerance)

**Examples:**
```bash
# Simple search
backmark search "authentication"

# Search with filters
backmark search "bug" --status "To Do" --priority high

# Search AI tasks
backmark search "implement" --assignee "Claude"

# Search in specific milestone
backmark search "feature" --milestone "v1.0"
```

---

### Kanban Board

#### `backmark board show [options]`
Display a Kanban board view of all tasks.

**Options:**
- `-w, --watch` - Auto-refresh every 3 seconds

**Examples:**
```bash
# Display board once
backmark board show

# Display board with auto-refresh
backmark board show --watch
```

**Features:**
- **Multi-column layout**: Configurable columns (default: To Do, In Progress, Review, Done)
- **Task cards**: Show ID, priority, title, assignee, milestone, keywords, progress
- **Color coding**: Priorities, statuses, and AI assignees color-coded
- **Statistics**: Task count per column, AI tasks count
- **Auto-refresh**: With `--watch`, updates every 3 seconds

**Keyboard shortcuts (watch mode):**
- `Ctrl+C` - Quit

---

## 🎯 Vibe Coding Workflow

### Recommended Workflow for Human-AI Collaboration

#### 1. **Human: Create the Task**
```bash
backmark task create "Add user authentication" \
  -p high \
  -a "Claude" \
  -k "backend,security,auth" \
  -m "v1.0" \
  --start "2025-10-25"
```

#### 2. **AI: Create Implementation Plan**
```bash
backmark task ai-plan 1 "## Implementation Plan

### Phase 1: Setup
- Install dependencies: passport, passport-jwt, bcrypt
- Create auth configuration
- Setup JWT secret in environment

### Phase 2: Implementation
- Create User model with password hashing
- Implement AuthService (login, register, refresh)
- Create auth middleware
- Add auth routes

### Phase 3: Testing
- Unit tests for AuthService
- Integration tests for auth routes
- Security testing

### Files to Create/Modify
- src/models/User.ts
- src/services/AuthService.ts
- src/middleware/auth.ts
- src/routes/auth.ts
- tests/auth.test.ts"
```

#### 3. **Human: Review and Approve**
```bash
backmark task view 1 --ai-plan
# Review the plan, then approve
backmark task edit 1 --status "In Progress"
```

#### 4. **AI: Work and Document**
```bash
# Start working
backmark task ai-note 1 "Installing dependencies..."

# Continue documenting progress
backmark task ai-note 1 "Created User model with bcrypt hashing"
backmark task ai-note 1 "Implemented login endpoint, tests passing"

# Add acceptance criteria
backmark task add-criterion 1 "User can register with email/password"
backmark task add-criterion 1 "User can login and receive JWT"
backmark task add-criterion 1 "Protected routes require valid JWT"

# Check off completed criteria
backmark task check 1 0
backmark task check 1 1
```

#### 5. **AI: Generate Documentation**
```bash
backmark task ai-doc 1 "## Authentication System

### Overview
JWT-based authentication using passport.js and bcrypt for password hashing.

### API Endpoints

#### POST /auth/register
Register a new user.

**Request:**
\`\`\`json
{
  \"email\": \"user@example.com\",
  \"password\": \"SecurePass123\"
}
\`\`\`

**Response:**
\`\`\`json
{
  \"user\": { \"id\": 1, \"email\": \"user@example.com\" },
  \"token\": \"eyJhbGc...\"
}
\`\`\`

#### POST /auth/login
Login existing user.

### Environment Variables
- \`JWT_SECRET\`: Secret key for JWT signing
- \`JWT_EXPIRES_IN\`: Token expiration (default: 1h)

### Security Features
- Passwords hashed with bcrypt (10 rounds)
- JWT tokens with expiration
- Protected routes via middleware"
```

#### 6. **AI: Self-Review**
```bash
backmark task ai-review 1 "## Self Review

### ✅ Completed Tasks
- [x] User registration with validation
- [x] Login with JWT generation
- [x] Password hashing with bcrypt
- [x] Auth middleware for protected routes
- [x] Comprehensive tests (15/15 passing)

### 🔍 Testing Performed
- Unit tests for AuthService ✓
- Integration tests for all endpoints ✓
- Security: SQL injection attempts blocked ✓
- Security: Weak passwords rejected ✓
- Invalid JWT tokens rejected ✓

### 📊 Metrics
- Code coverage: 94%
- Response time: <100ms for all endpoints
- Security scan: 0 vulnerabilities

### 💡 Suggested Improvements
- Add rate limiting to prevent brute force
- Implement refresh token rotation
- Add 2FA support
- Add email verification

### ❓ Questions for Human
- Should we implement rate limiting now or in v1.1?
- Do we need email verification for v1.0?
- What's the preferred 2FA method if we add it?"
```

#### 7. **Human: Review and Close**
```bash
# Review everything
backmark task view 1 --ai-all

# Check remaining criteria
backmark task check 1 2

# Close the task
backmark task close 1
```

#### 8. **Monitor Progress**
```bash
# Terminal 1: Watch the board
backmark board show --watch

# Terminal 2: Work on tasks
# The board updates automatically every 3 seconds!
```

---

## 🗂️ Task File Structure

### File Naming
```
backlog/task-001 - Task Title.md
```

### File Content
```markdown
---
id: 1
title: "Add user authentication"

# Manual dates
start_date: "2025-10-25"
end_date: "2025-10-30"
release_date: "2025-11-01"

# Automatic dates
created_date: "2025-10-22T10:30:00Z"
updated_date: "2025-10-22T14:15:00Z"
closed_date: null

# Organization
status: "In Progress"
priority: "high"
keywords:
  - "backend"
  - "security"
  - "auth"
milestone: "v1.0"

# People and labels
assignees:
  - "Claude"
  - "Alice"
labels:
  - "feature"
  - "backend"

# Hierarchy
parent_task: null
subtasks:
  - 2
  - 3
dependencies:
  - 5
blocked_by: []

# History
changelog:
  - timestamp: "2025-10-22T10:30:00Z"
    action: "created"
    details: "Task created"
    user: "system"
  - timestamp: "2025-10-22T14:15:00Z"
    action: "status_changed"
    details: "status: To Do → In Progress"
    user: "AI"

# Acceptance criteria
acceptance_criteria:
  - text: "User can register with email/password"
    checked: true
  - text: "User can login and receive JWT"
    checked: true
  - text: "Protected routes require valid JWT"
    checked: false

# AI spaces
ai_plan: |
  ## Implementation Plan
  ...

ai_notes: |
  **2025-10-22T14:30:00Z** - Installing dependencies...
  **2025-10-22T15:00:00Z** - Created User model...

ai_documentation: |
  ## Authentication System
  ...

ai_review: |
  ## Self Review
  ...
---

# Add user authentication

## Description
Implement JWT-based authentication system with user registration and login.

## Technical Details
- Use passport.js for authentication
- bcrypt for password hashing
- JWT tokens for session management
```

---

## ⚙️ Configuration

### Location
```
backlog/config.yml
```

### Default Configuration
```yaml
project:
  name: "My Project"
  createdAt: "2025-10-22T10:00:00Z"

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

performance:
  useIndex: true              # Use LokiJS for fast queries (recommended for 100+ tasks)
  rebuildIndexOnStart: false  # Force rebuild index on every start (slower, use for debugging)
```

### Customization

#### Change Board Columns
```yaml
board:
  columns:
    - "Backlog"
    - "To Do"
    - "In Progress"
    - "Review"
    - "QA"
    - "Done"
```

#### Adjust Search Sensitivity
```yaml
search:
  threshold: 0.2  # More strict (0 = exact match, 1 = match anything)
  maxResults: 100
```

#### Change Date Format
```yaml
display:
  dateFormat: "MM/dd/yyyy HH:mm"  # US format
  zeroPaddedIds: false  # #1 instead of #001
```

#### Performance Tuning (500+ Tasks)
```yaml
performance:
  useIndex: true              # Enable LokiJS indexing (default: true)
  rebuildIndexOnStart: false  # Rebuild index every time (default: false)
```

**How it works:**
- **LokiJS Index**: Caches task metadata in `backlog/.cache/tasks.db` for ultra-fast queries
- **Automatic sync**: Index updates automatically when files change (checks modification time)
- **Performance**: 50-250x faster for large backlogs (500+ tasks)
- **Fallback**: Set `useIndex: false` to use direct file system reads (slower but simpler)

**First run after update:**
- Index builds automatically (~2-3 seconds for 500 tasks)
- Subsequent commands are instant (<10ms)
- `.cache/` is gitignored by default (add to existing projects: `echo ".cache/" >> backlog/.gitignore`)

**Troubleshooting:**
- If data seems stale: `performance.rebuildIndexOnStart: true` (then set back to false)
- To disable caching: `performance.useIndex: false`

---

## 🏗️ Project Architecture

```
backmark/
├── src/
│   ├── cli.ts                    # CLI entry point
│   ├── commands/                 # CLI commands
│   │   ├── init.ts
│   │   ├── search.ts
│   │   ├── task/
│   │   │   ├── create.ts
│   │   │   ├── list.ts
│   │   │   ├── view.ts
│   │   │   ├── edit.ts
│   │   │   ├── ai.ts            # AI commands
│   │   │   ├── check.ts         # Acceptance criteria
│   │   │   ├── hierarchy.ts     # Tree, deps, blocked
│   │   │   └── index.ts
│   │   └── board/
│   │       ├── display.ts
│   │       └── index.ts
│   ├── core/                     # Business logic
│   │   └── backlog.ts           # Main Backlog class
│   ├── ui/                       # UI components
│   │   └── board-tui.ts         # Board display (unused with cli-table3)
│   ├── utils/                    # Utilities
│   │   ├── colors.ts            # Color formatting
│   │   ├── date.ts              # Date utilities
│   │   ├── fuzzy-search.ts      # Search with Fuse.js
│   │   └── logger.ts            # Logging
│   └── types/                    # TypeScript types
│       ├── task.ts
│       ├── config.ts
│       └── index.ts
├── tests/                        # Tests (to be added)
├── package.json
├── tsconfig.json
├── biome.json                    # Linting config
└── README.md
```

---

## 🎨 CLI Color Coding

### Priorities
- 🔵 **Low**: Blue
- 🟡 **Medium**: Yellow
- 🔴 **High**: Red
- 🔴⚠️ **Critical**: Red background

### Statuses
- ⚪ **To Do**: Gray
- 🟡 **In Progress**: Yellow
- 🔵 **Review**: Cyan
- 🟢 **Done**: Green
- 🔴 **Blocked**: Red

### Special Highlighting
- 🤖 **AI Assignees**: Magenta (Claude, GPT, AI)
- 🎯 **Milestones**: Yellow
- 🏷️ **Keywords**: Blue with #
- 📋 **Labels**: Cyan with []

---

## 🧪 Examples

### Example 1: Bug Fix Workflow
```bash
# 1. Create bug task
backmark task create "Fix login redirect loop" \
  -p critical \
  -a "Bob" \
  -k "bug,urgent,frontend" \
  --add-label "hotfix"

# 2. Add acceptance criteria
backmark task add-criterion 1 "Login redirects to dashboard"
backmark task add-criterion 1 "No infinite loop"
backmark task add-criterion 1 "Works in all browsers"

# 3. Start working
backmark task edit 1 --status "In Progress"

# 4. Mark criteria as done
backmark task check 1 0
backmark task check 1 1
backmark task check 1 2

# 5. Close
backmark task close 1
```

### Example 2: Feature with Subtasks
```bash
# 1. Create main feature
backmark task create "User Profile System" \
  -p high \
  -m "v1.0" \
  -k "feature,profile,users"

# 2. Create subtasks
backmark task create "Profile page UI" --parent 1
backmark task create "Profile edit form" --parent 1
backmark task create "Avatar upload" --parent 1
backmark task create "Profile API endpoints" --parent 1

# 3. View hierarchy
backmark task tree 1

# 4. Work on subtasks
backmark task edit 2 --status "In Progress"
backmark task edit 2 --status "Done"
backmark task close 2
```

### Example 3: AI-Driven Development
```bash
# 1. Create task assigned to AI
backmark task create "Implement caching layer" \
  -p high \
  -a "Claude" \
  -k "performance,redis,cache" \
  -m "v1.0"

# 2. AI creates plan
backmark task ai-plan 1 "1. Setup Redis\n2. Create CacheService\n3. Add cache middleware\n4. Tests"

# 3. AI works and documents
backmark task edit 1 --status "In Progress"
backmark task ai-note 1 "Installed ioredis package"
backmark task ai-note 1 "Created CacheService with get/set/delete methods"
backmark task ai-note 1 "Added TTL support for auto-expiration"

# 4. AI generates docs
backmark task ai-doc 1 "$(cat cache-docs.md)"

# 5. AI reviews
backmark task ai-review 1 "$(cat self-review.md)"

# 6. Human reviews
backmark task view 1 --ai-all

# 7. Approve and close
backmark task close 1
```

### Example 4: Sprint Planning
```bash
# 1. Create milestone
backmark task create "Sprint 5 Planning" -m "Sprint-5"

# 2. Add all sprint tasks
backmark task create "Feature A" -m "Sprint-5" -p high
backmark task create "Feature B" -m "Sprint-5" -p medium
backmark task create "Bug fixes" -m "Sprint-5" -p high

# 3. View sprint board
backmark board show

# 4. Search sprint tasks
backmark search "" --milestone "Sprint-5"

# 5. Monitor progress
backmark board show --watch
```

---

## 🔍 Advanced Tips

### 1. Use Keywords Strategically
Keywords are indexed for fuzzy search with 20% weight.

```bash
# Good keyword usage
backmark task create "Login bug" -k "bug,auth,login,critical"

# Search by keyword
backmark search "authentication" --keyword "auth"
```

### 2. Leverage Dependencies
Create dependency chains to track prerequisites.

```bash
# Backend must be done before frontend
backmark task create "Backend API" -p high
backmark task create "Frontend UI" --depends-on 1

# View blocked tasks
backmark task blocked
```

### 3. Use AI Notes as a Dev Log
AI notes are timestamped automatically - use them for continuous logging.

```bash
backmark task ai-note 1 "Starting implementation"
backmark task ai-note 1 "Hit a blocker: need Redis setup"
backmark task ai-note 1 "Blocker resolved, continuing"
backmark task ai-note 1 "Implementation complete, starting tests"
```

### 4. Board Watch Mode for Pairing
Use watch mode during pair programming or AI collaboration.

```bash
# Terminal 1: Watch board
backmark board show --watch

# Terminal 2: Work
backmark task edit 5 --status "In Progress"
# Board updates automatically!
```

### 5. Export for Reporting
Use search and list to generate reports.

```bash
# All high priority tasks
backmark task list --priority high

# All AI tasks
backmark task list --assignee "Claude"

# Sprint completion
backmark task list --milestone "Sprint-5" --status "Done"
```

---

## 🤖 Using with Claude Code

Backmark is designed to work seamlessly with Claude Code, allowing AI assistants to manage tasks during development.

### Quick Setup

```bash
# 1. Install Backmark globally
./install.sh

# 2. Initialize in your project
cd /path/to/your/project
backmark init "Your Project"

# 3. Claude Code will automatically use Backmark when working
```

### What Claude Code Does

When you work with Claude Code in a Backmark-enabled project:

1. **Creates tasks** for new features or bugs
2. **Documents plans** before implementing (ai-plan)
3. **Logs progress** as work proceeds (ai-note)
4. **Generates documentation** during implementation (ai-doc)
5. **Self-reviews** when complete (ai-review)
6. **Tracks acceptance criteria** and checks them off

### Example Session

```
You: "Implement user authentication with JWT"

Claude Code:
✅ Created task #5: "Implement user authentication"
✅ Added implementation plan
✅ Started work (status: In Progress)
[...implements the feature...]
✅ Logged 8 progress notes
✅ Generated API documentation
✅ Self-review complete
✅ Task closed

You can review with: backmark task view 5 --ai-all
```

### Monitoring Claude's Work

```bash
# Watch the board in real-time
backmark board show --watch

# View Claude's tasks
backmark task list --assignee "Claude"

# See detailed AI sections
backmark task view <id> --ai-all
```

### Full Setup Guide

See [CLAUDE_CODE_SETUP.md](CLAUDE_CODE_SETUP.md) for detailed installation and configuration instructions.

---

## 🛠️ Development

### Setup
```bash
git clone <repository-url>
cd Backmark
npm install
```

### Development Commands
```bash
# Run in dev mode
npm run dev -- <command>

# Build TypeScript
npm run build

# Install globally (for local development)
npm run install:global

# Uninstall global version
npm run uninstall:global

# Lint
npm run lint

# Format code
npm run format

# Type check
npm run check
```

### Code Quality
- **Linter**: Biome
- **TypeScript**: Strict mode enabled
- **Style**: Single quotes, semicolons, 2-space indent

---

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details.

---

## 🙏 Credits

**Author**: Jean-Marc Strauven

**Inspired by**: [Backlog.md](https://github.com/MrLesk/Backlog.md)

**Built with**:
- [Commander.js](https://github.com/tj/commander.js) - CLI framework
- [Chalk](https://github.com/chalk/chalk) - Terminal colors
- [Inquirer](https://github.com/SBoudrias/Inquirer.js) - Interactive prompts
- [cli-table3](https://github.com/cli-table/cli-table3) - Tables
- [Fuse.js](https://www.fusejs.io/) - Fuzzy search
- [gray-matter](https://github.com/jonschlinkert/gray-matter) - YAML frontmatter
- [date-fns](https://date-fns.org/) - Date utilities

---

## 🚀 Happy Vibe Coding!

Built with ❤️ for AI-powered development workflows.

For issues, questions, or contributions, please visit the project repository.
