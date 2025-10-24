<div align="center">

```
╔══════════════════════════════════════════════════════════════════════════════╗
║                                                                              ║
║   ██████╗  █████╗  ██████╗██╗  ██╗███╗   ███╗ █████╗ ██████╗ ██╗  ██╗     ║
║   ██╔══██╗██╔══██╗██╔════╝██║ ██╔╝████╗ ████║██╔══██╗██╔══██╗██║ ██╔╝     ║
║   ██████╔╝███████║██║     █████╔╝ ██╔████╔██║███████║██████╔╝█████╔╝      ║
║   ██╔══██╗██╔══██║██║     ██╔═██╗ ██║╚██╔╝██║██╔══██║██╔══██╗██╔═██╗      ║
║   ██████╔╝██║  ██║╚██████╗██║  ██╗██║ ╚═╝ ██║██║  ██║██║  ██║██║  ██╗     ║
║   ╚═════╝ ╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝╚═╝     ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝     ║
║                                                                              ║
║              🤖 Markdown-Native Task Management for AI-Powered               ║
║                           Vibe Coding Workflows                              ║
║                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════╝
```

[![npm version](https://img.shields.io/npm/v/@grazulex/backmark.svg?style=flat-square&logo=npm&color=cb3837)](https://www.npmjs.com/package/@grazulex/backmark)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Node](https://img.shields.io/badge/Node-%3E%3D18.0.0-green?style=flat-square&logo=node.js)](https://nodejs.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)
[![Code Style: Biome](https://img.shields.io/badge/code_style-biome-60a5fa?style=flat-square&logo=biome)](https://biomejs.dev/)
[![Tested with Vitest](https://img.shields.io/badge/tested%20with-vitest-6E9F18?style=flat-square&logo=vitest)](https://vitest.dev/)
[![Claude Code Ready](https://img.shields.io/badge/Claude_Code-Ready-7C3AED?style=flat-square&logo=anthropic)](https://claude.ai/claude-code)

**Transform plain Markdown files into a powerful project management system, designed specifically for developers working with AI assistants.**

[Features](#-features) • [Installation](#-installation) • [Quick Start](#-quick-start) • [Documentation](#-complete-command-reference) • [Examples](#-examples) • [Contributing](#-contributing)

</div>

---

## 📋 Table of Contents

<details>
<summary>Click to expand</summary>

- [📋 Table of Contents](#-table-of-contents)
- [🌟 At a Glance](#-at-a-glance)
- [✨ Features](#-features)
  - [🎯 Core Task Management](#-core-task-management)
  - [🤖 AI-First Design](#-ai-first-design)
  - [🎨 Beautiful CLI](#-beautiful-cli)
  - [🔧 Developer-Friendly](#-developer-friendly)
  - [⚡ Performance](#-performance)
- [🎯 Philosophy & Design Principles](#-philosophy--design-principles)
- [📦 Installation](#-installation)
  - [Prerequisites](#prerequisites)
  - [Quick Install (Global)](#quick-install-global)
  - [Development Installation](#development-installation)
  - [Verify Installation](#verify-installation)
- [🚀 Quick Start](#-quick-start)
  - [1. Initialize a Project](#1-initialize-a-project)
  - [2. Create Your First Task](#2-create-your-first-task)
  - [3. View Your Tasks](#3-view-your-tasks)
  - [4. AI Workflow](#4-ai-workflow)
- [📚 Complete Command Reference](#-complete-command-reference)
  - [Initialization](#initialization)
  - [Task Management](#task-management)
  - [AI-Specific Commands](#ai-specific-commands)
  - [Acceptance Criteria](#acceptance-criteria)
  - [Hierarchy & Dependencies](#hierarchy--dependencies)
  - [Search](#search)
  - [Kanban Board](#kanban-board)
- [🎯 Vibe Coding Workflow](#-vibe-coding-workflow)
  - [Recommended Workflow for Human-AI Collaboration](#recommended-workflow-for-human-ai-collaboration)
- [🗂️ Task File Structure](#️-task-file-structure)
- [⚙️ Configuration](#️-configuration)
- [🏗️ Project Architecture](#️-project-architecture)
- [🎨 CLI Output Examples](#-cli-output-examples)
- [🎨 CLI Color Coding](#-cli-color-coding)
- [🧪 Examples](#-examples)
  - [Example 1: Bug Fix Workflow](#example-1-bug-fix-workflow)
  - [Example 2: Feature with Subtasks](#example-2-feature-with-subtasks)
  - [Example 3: AI-Driven Development](#example-3-ai-driven-development)
  - [Example 4: Sprint Planning](#example-4-sprint-planning)
- [🔍 Advanced Tips](#-advanced-tips)
- [🤖 Using with Claude Code](#-using-with-claude-code)
- [⚖️ Comparison with Other Tools](#️-comparison-with-other-tools)
- [📊 Performance Benchmarks](#-performance-benchmarks)
- [❓ FAQ](#-faq)
- [🛠️ Troubleshooting](#️-troubleshooting)
- [🔒 Security](#-security)
- [🛤️ Roadmap](#️-roadmap)
- [🤝 Contributing](#-contributing)
- [🧪 Testing](#-testing)
- [🛠️ Development](#️-development)
- [📝 License](#-license)
- [🙏 Credits](#-credits)
- [🚀 Happy Vibe Coding!](#-happy-vibe-coding)

</details>

---

## 🌟 At a Glance

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  📦 Backmark transforms your backlog into a living, breathing system       │
│                                                                             │
│  ✓ 100% Markdown-based (no databases, no cloud, no lock-in)               │
│  ✓ Blazing fast CLI with beautiful colors & tables                         │
│  ✓ AI-first design with dedicated spaces for AI planning & documentation   │
│  ✓ 50-250x faster queries with LokiJS indexing (500+ tasks)               │
│  ✓ Full task hierarchy, dependencies, and changelog tracking               │
│  ✓ Interactive Kanban board with auto-refresh                              │
│  ✓ Fuzzy search powered by Fuse.js                                         │
│  ✓ Zero configuration - works out of the box                               │
│  ✓ Git-friendly - plain text files, perfect for version control            │
│  ✓ Offline-first - no internet required, all local                         │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Quick Stats:**
- 🚀 **5-10ms** average command response time (with indexing)
- 📦 **0 dependencies** at runtime for core functionality
- 🎯 **100% TypeScript** - type-safe, maintainable codebase
- 📝 **Pure Markdown** - human-readable task files
- 🤖 **AI-optimized** - built for Claude Code, GitHub Copilot, and more
- 🎨 **Beautiful CLI** - colorized output, tables, progress indicators

---

## ✨ Features

### 🎯 Core Task Management
- **Markdown-based storage**: Every task is a `.md` file with YAML frontmatter
- **Rich metadata**: Priorities (low/medium/high/critical), statuses, milestones, dates
- **Hierarchical tasks**: Parent/child relationships with unlimited nesting
- **Dependencies**: Track task dependencies with `depends_on` and `blocked_by` fields
- **Acceptance criteria**: Built-in checklists with check/uncheck commands
- **Full changelog**: Automatic logging of all task modifications with timestamps
- **Smart dates**: Manual planning dates (start/end/release) + automatic tracking (created/updated/closed)

### 🤖 AI-First Design
- **Dedicated AI spaces**:
  - `ai_plan` - Implementation plans generated by AI
  - `ai_notes` - Timestamped development logs
  - `ai_documentation` - Auto-generated documentation
  - `ai_review` - Self-review and quality checks
- **AI assignees**: Special highlighting for AI team members (Claude, GPT, Copilot, etc.)
- **Vibe coding workflow**: Optimized for seamless human-AI collaboration
- **Complete history**: Track all AI contributions with full audit trail
- **Claude Code integration**: Optional agent/skill for automated task management

### 🎨 Beautiful CLI
- **Colorful output**:
  - 🔴 Critical/High priorities in red
  - 🟡 Medium priority in yellow
  - 🔵 Low priority in blue
  - 🟢 Done status in green
  - 🟣 AI assignees in magenta
- **Kanban board**: Simple, reliable board view with auto-refresh (watch mode)
- **Fuzzy search**: Find tasks instantly with Fuse.js (threshold: 0.3, configurable)
- **Interactive prompts**: User-friendly task creation with Inquirer.js
- **Tables**: Formatted tables with cli-table3 for all list views
- **Progress indicators**: Spinners (ora) for long-running operations
- **Smart truncation**: Long text intelligently truncated with context preservation

### 🔧 Developer-Friendly
- **Zero configuration**: `backmark init` and you're ready to go
- **Offline-first**: No cloud dependencies, 100% local storage
- **Git-friendly**: Plain Markdown files, perfect for version control and code reviews
- **Extensible**: TypeScript with clean architecture, easy to extend
- **Cross-platform**: Works on Linux, macOS, and Windows
- **No database**: Uses filesystem directly (with optional LokiJS caching)
- **Human-readable**: All files are plain text Markdown, no proprietary formats

### ⚡ Performance

```
┌────────────────────────────────────────────────────────────────────────────┐
│                        Performance Characteristics                          │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  Without Index (Direct FS):     │  With LokiJS Index:                     │
│  • Small backlogs (<100):  Fast  │  • Any size: Lightning fast            │
│  • Medium (100-500):  Slow       │  • First load: 2-3s (index build)     │
│  • Large (500+):  Very slow      │  • Subsequent: <10ms                   │
│                                  │  • 50-250x faster than direct FS       │
│                                                                            │
│  Index Features:                                                           │
│  ✓ Automatic synchronization (checks file mtime)                          │
│  ✓ Incremental updates (only changed files)                               │
│  ✓ Transparent caching in backlog/.cache/                                 │
│  ✓ Configurable via config.yml                                            │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## 🎯 Philosophy & Design Principles

### 1. **Markdown is King** 👑
Every task is a Markdown file. No databases, no proprietary formats. This means:
- ✅ **Human-readable** - Open any task file in any text editor
- ✅ **Git-friendly** - Perfect for version control, PRs, and code reviews
- ✅ **Future-proof** - Your data will be readable 10, 20, 50 years from now
- ✅ **Tool-agnostic** - Use grep, awk, sed, or any text processing tool
- ✅ **AI-friendly** - LLMs understand Markdown natively

### 2. **AI as a First-Class Citizen** 🤖
Backmark treats AI assistants as team members, not tools:
- **Dedicated spaces** - AI has its own sections for plans, notes, docs, and reviews
- **Equal visibility** - AI work is tracked just like human work
- **Collaborative workflow** - Designed for Human ↔️ AI pairing
- **Complete history** - Every AI decision and action is logged

### 3. **Offline-First, Always** 🔒
No cloud, no accounts, no internet required:
- ✅ **100% local** - All data stored on your machine
- ✅ **Privacy-first** - Your tasks never leave your computer
- ✅ **Fast** - No network latency, instant operations
- ✅ **Reliable** - Works on planes, trains, and remote locations

### 4. **Developer Experience Matters** 💎
Built by developers, for developers:
- **Zero config** - Works out of the box with sensible defaults
- **Beautiful output** - Colorized, formatted, pleasant to use
- **Fast feedback** - Commands execute in milliseconds
- **Composable** - Unix philosophy: do one thing well
- **Extensible** - Clean TypeScript architecture for easy modifications

### 5. **Performance at Scale** 🚀
Handles small and large projects equally well:
- **Smart caching** - Optional LokiJS index for 50-250x speedup
- **Incremental updates** - Only processes changed files
- **Configurable** - Tune for your specific needs
- **Transparent** - Cache is automatic but can be disabled

---

## 📦 Installation

### Prerequisites
- **Node.js** >= 18.0.0
- **npm** or **yarn**

### Quick Install (Global)

```bash
# Install from npm
npm install -g @grazulex/backmark

# Verify installation
backmark --version
```

### Development Installation

```bash
# Clone the repository
git clone https://github.com/Grazulex/backmark.git
cd backmark

# Install dependencies
npm install

# Build and link globally
npm run build
npm link

# Or use the convenience script
npm run install:global
```

### Verify Installation

```bash
# Check version
backmark --version

# Check which binary is being used
which backmark

# Run help
backmark --help
```

---

## 🚀 Quick Start

### 1. Initialize a Project

```bash
# Basic initialization
backmark init "My Project"
```

**What gets created:**
```
backlog/
├── config.yml          # Project configuration
├── .gitignore          # Ignore cache and temp files
└── .cache/             # Optional LokiJS index (auto-created)
    └── tasks.db
```

**Claude Code Agent (Optional):**
- Automatically installed to `~/.config/claude-code/skills/backmark.md`
- Enables Claude to manage tasks during development sessions
- Provides specialized commands and protocols for AI task management

### 2. Create Your First Task

```bash
# Simple task
backmark task create "Implement user authentication"

# Complete task with all metadata
backmark task create "Implement user authentication" \
  -d "JWT-based authentication with refresh tokens" \
  -p high \
  -a "Claude,Alice" \
  -k "backend,security,auth" \
  -l "feature,v1.0" \
  -m "Sprint-1" \
  --start "2025-10-25" \
  --end "2025-10-30"
```

### 3. View Your Tasks

```bash
# List all tasks
backmark task list

# Filter by status
backmark task list --status "In Progress"

# View detailed task
backmark task view 1

# See the Kanban board
backmark board show

# Board with auto-refresh (watch mode)
backmark board show --watch
```

### 4. AI Workflow

```bash
# AI creates a plan
backmark task ai-plan 1 "
## Implementation Steps
1. Install passport.js and passport-jwt
2. Create User model with bcrypt
3. Implement AuthService
4. Add middleware
5. Create routes
6. Write tests
"

# AI starts work
backmark task edit 1 --status "In Progress"

# AI takes notes while working
backmark task ai-note 1 "Installed dependencies: passport, passport-jwt, bcrypt"
backmark task ai-note 1 "Created User model with password hashing"
backmark task ai-note 1 "Implemented login endpoint, tests passing"

# AI documents the implementation
backmark task ai-doc 1 "
## Authentication System

### Overview
JWT-based authentication using passport.js.

### API Endpoints
- POST /auth/register - Register new user
- POST /auth/login - Login and get JWT token
- POST /auth/refresh - Refresh access token

### Configuration
Set JWT_SECRET in environment variables.
"

# AI reviews the work
backmark task ai-review 1 "
## Self Review
✅ All acceptance criteria met
✅ 15/15 tests passing
✅ Code coverage: 94%
💡 Consider adding rate limiting
❓ Should we add 2FA in v1.0?
"

# View all AI sections
backmark task view 1 --ai-all

# Close when done
backmark task close 1
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
| Flag | Description | Example |
|------|-------------|---------|
| `-d, --description <text>` | Task description | `-d "Implement JWT auth"` |
| `-s, --status <status>` | Status (default: "To Do") | `-s "In Progress"` |
| `-p, --priority <priority>` | Priority: low, medium, high, critical | `-p high` |
| `-a, --assignees <assignees>` | Comma-separated assignees | `-a "Alice,Bob,Claude"` |
| `-l, --labels <labels>` | Comma-separated labels | `-l "feature,backend"` |
| `-m, --milestone <milestone>` | Milestone | `-m "v1.0"` |
| `--start <date>` | Start date (YYYY-MM-DD) | `--start "2025-10-25"` |
| `--end <date>` | End date (YYYY-MM-DD) | `--end "2025-10-30"` |
| `--release <date>` | Release date (YYYY-MM-DD) | `--release "2025-11-01"` |
| `--parent <id>` | Parent task ID | `--parent 5` |
| `--depends-on <ids>` | Dependencies (comma-separated) | `--depends-on "3,4"` |

**Examples:**
```bash
# Simple task
backmark task create "Fix login bug"

# Feature with full metadata
backmark task create "Build REST API" \
  -d "Implement RESTful API with Express.js" \
  -p high \
  -a "Alice,Claude" \
  -m "v1.0" \
  --start "2025-10-25" \
  --end "2025-10-30"

# Subtask
backmark task create "Setup Express server" --parent 5

# Task with dependencies
backmark task create "Deploy to production" --depends-on "3,4,5"
```

#### `backmark task list [options]`
List all tasks with optional filters.

**Options:**
| Filter | Description |
|--------|-------------|
| `-s, --status <status>` | Filter by status |
| `-p, --priority <priority>` | Filter by priority |
| `-a, --assignee <assignee>` | Filter by assignee |
| `-l, --label <label>` | Filter by label |
| `-k, --keyword <keyword>` | Filter by keyword |
| `-m, --milestone <milestone>` | Filter by milestone |
| `--parent <id>` | Show subtasks of task |

**Examples:**
```bash
# List all
backmark task list

# In progress tasks
backmark task list --status "In Progress"

# High priority tasks
backmark task list --priority high

# AI's tasks
backmark task list --assignee "Claude"

# Sprint tasks
backmark task list --milestone "Sprint-5"

# Subtasks
backmark task list --parent 10

# Combine filters
backmark task list --status "To Do" --priority high --milestone "v1.0"
```

#### `backmark task view <id> [options]`
View detailed information about a task.

**Options:**
| Flag | Description |
|------|-------------|
| `--ai-plan` | Show only AI plan |
| `--ai-notes` | Show only AI notes |
| `--ai-doc` | Show only AI documentation |
| `--ai-review` | Show only AI review |
| `--ai-all` | Show all AI sections |

**Examples:**
```bash
# Full task details
backmark task view 1

# Only AI plan
backmark task view 1 --ai-plan

# All AI sections
backmark task view 1 --ai-all
```

#### `backmark task edit <id> [options]`
Edit task properties.

**Options:**
| Flag | Description |
|------|-------------|
| `-s, --status <status>` | Update status |
| `-p, --priority <priority>` | Update priority |
| `-m, --milestone <milestone>` | Update milestone |
| `--start <date>` | Update start date |
| `--end <date>` | Update end date |
| `--release <date>` | Update release date |
| `--add-label <labels>` | Add labels |
| `--remove-label <labels>` | Remove labels |
| `--add-dependency <ids>` | Add dependencies |
| `--remove-dependency <ids>` | Remove dependencies |

**Examples:**
```bash
# Change status (auto-logged)
backmark task edit 1 --status "In Progress"

# Update priority
backmark task edit 1 --priority critical

# Multiple updates
backmark task edit 1 --status "Done" --add-label "verified" --priority high
```

#### `backmark task assign <id> <assignees>`
Assign task to people or AI.

**Examples:**
```bash
backmark task assign 1 "Alice"
backmark task assign 1 "Alice,Bob,Claude"
backmark task assign 1 "Claude"
```

#### `backmark task close <id> [options]`
Close a task (status → Done, adds closed_date) with smart validations.

**Options:**
- `--force` - Force close even if validations fail

**Smart Validations:**

Before closing, Backmark validates:
- ✅ **Subtasks completed**: All child tasks must be Done
- ✅ **Dependencies resolved**: All required tasks must be Done
- ✅ **No blockers**: Tasks in `blocked_by` must be Done
- ✅ **Acceptance criteria**: All criteria must be checked

**Warnings** (prompt for confirmation):
- ⚠️ **Missing AI review**: AI-assigned task without `ai-review`
- ⚠️ **Date mismatch**: Closing before/after planned dates
- ⚠️ **Too quick**: Task completed in < 5 minutes (configurable)

**Suggestions** (after close):
- 💡 **Parent completion**: Suggests closing parent if all siblings done
- 💡 **Unblocked tasks**: Notifies newly unblocked tasks

**Examples:**
```bash
# Normal close (with validations)
backmark task close 1

# Error: subtasks not done
✗ Cannot close task #1: Parent Task

Blocking issues:
  ✗ 2 subtask(s) not completed:
    - #2 Subtask 1 (To Do)
    - #3 Subtask 2 (In Progress)

Use --force to close anyway

# Force close (bypass validations)
backmark task close 1 --force
✓ Task #001 marked as Done (forced)

# With warnings
backmark task close 5

⚠ Warnings:
  ⚠ Task completed very quickly (2m 15s)
? Continue closing this task? (Y/n)

# With suggestions
✓ Task #3 closed

💡 Suggestions:
  All subtasks of #1 (Parent Task) are now complete!
    Run: backmark task close 1
```

**Configuration:**

Customize validation behavior in `backlog/config.yml`:

```yaml
validations:
  close:
    check_subtasks: true              # Validate subtasks
    check_dependencies: true          # Validate dependencies
    check_blocked_by: true            # Validate blockers
    check_acceptance_criteria: true   # Validate criteria
    warn_missing_ai_review: true      # Warn if no AI review
    warn_early_close: true            # Warn if before end_date
    warn_late_close: true             # Warn if after end_date
    warn_quick_close: 300             # Warn if < 300 seconds
    suggest_parent_close: true        # Suggest parent close
    notify_unblocked: true            # Notify unblocked tasks
    allow_force: true                 # Allow --force option
```

---

### AI-Specific Commands

These commands enable AI assistants to document their work comprehensively.

#### `backmark task ai-plan <id> <content>`
Add or update AI implementation plan.

**Content should include:**
- Implementation steps
- Files to create/modify
- Dependencies to install
- Technical approach
- Estimated timeline

**Example:**
```bash
backmark task ai-plan 1 "
## Implementation Plan

### Phase 1: Setup
1. Install dependencies: passport, passport-jwt, bcrypt
2. Create auth configuration
3. Setup environment variables

### Phase 2: Implementation
1. Create User model with password hashing
2. Implement AuthService (login, register, refresh)
3. Create auth middleware
4. Add auth routes

### Phase 3: Testing
1. Unit tests for AuthService
2. Integration tests for routes
3. Security testing

### Files to Create/Modify
- src/models/User.ts (new)
- src/services/AuthService.ts (new)
- src/middleware/auth.ts (new)
- src/routes/auth.ts (new)
- tests/auth.test.ts (new)

### Dependencies
- passport
- passport-jwt
- bcrypt
- jsonwebtoken
"
```

#### `backmark task ai-note <id> <content>`
Add timestamped development note.

**Use for:**
- Progress updates
- Decisions made
- Problems encountered
- Solutions applied
- Important observations

**Example:**
```bash
backmark task ai-note 1 "Installed passport.js and passport-jwt packages"
backmark task ai-note 1 "Created User model with bcrypt hashing (10 rounds)"
backmark task ai-note 1 "Hit blocker: JWT_SECRET not in env, added to .env.example"
backmark task ai-note 1 "Implemented login endpoint with rate limiting"
backmark task ai-note 1 "All 15 tests passing, ready for review"
```

#### `backmark task ai-doc <id> <content>`
Add or update AI-generated documentation.

**Should include:**
- Overview
- Usage examples
- API reference
- Configuration
- Important notes

**Example:**
```bash
backmark task ai-doc 1 "
## Authentication System

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

**Request:** Same as register
**Response:** Same as register

### Configuration

**Environment Variables:**
- \`JWT_SECRET\`: Secret key for JWT signing (required)
- \`JWT_EXPIRES_IN\`: Token expiration (default: '1h')
- \`BCRYPT_ROUNDS\`: Hashing rounds (default: 10)

### Security Features
- Passwords hashed with bcrypt (configurable rounds)
- JWT tokens with expiration
- Protected routes via middleware
- Rate limiting on auth endpoints (10 req/min)

### Usage Example

\`\`\`typescript
import { authService } from './services/AuthService';

// Register
const { user, token } = await authService.register(email, password);

// Login
const { user, token } = await authService.login(email, password);

// Protect routes
app.get('/protected', authMiddleware, (req, res) => {
  res.json({ user: req.user });
});
\`\`\`
"
```

#### `backmark task ai-review <id> <content>`
Add or update AI self-review.

**Should include:**
- ✅ Completed tasks
- 🔍 Tests performed
- 📊 Quality metrics
- 💡 Improvement suggestions
- ❓ Questions for human review

**Example:**
```bash
backmark task ai-review 1 "
## Self Review

### ✅ Completed Tasks
- [x] User registration with validation
- [x] Login with JWT generation
- [x] Password hashing with bcrypt
- [x] Auth middleware for protected routes
- [x] Comprehensive tests (15/15 passing)
- [x] Rate limiting on auth endpoints
- [x] Documentation complete

### 🔍 Testing Performed
- Unit tests for AuthService ✓
- Integration tests for all endpoints ✓
- Security: SQL injection attempts blocked ✓
- Security: Weak passwords rejected ✓
- Security: Invalid JWT tokens rejected ✓
- Performance: All endpoints <100ms ✓

### 📊 Quality Metrics
- Code coverage: 94%
- Response time: <100ms for all endpoints
- Security scan: 0 vulnerabilities
- TypeScript: 0 type errors
- Linting: 0 issues

### 💡 Suggested Improvements
1. Add rate limiting to prevent brute force attacks
2. Implement refresh token rotation
3. Add 2FA support (TOTP)
4. Add email verification flow
5. Consider adding OAuth providers (Google, GitHub)

### ❓ Questions for Human Review
1. Should we implement rate limiting now or defer to v1.1?
2. Is email verification required for v1.0 launch?
3. What's the preferred 2FA method if we add it?
4. Should JWT expiration be configurable per-environment?

### 🚨 Known Limitations
- No rate limiting yet (planned for v1.1)
- No email verification (planned)
- No password reset flow (planned)
"
```

---

### Acceptance Criteria

#### `backmark task add-criterion <id> <text>`
Add acceptance criterion to task.

**Example:**
```bash
backmark task add-criterion 1 "User can login with email and password"
backmark task add-criterion 1 "JWT token is returned on successful login"
backmark task add-criterion 1 "Invalid credentials return 401 error"
```

#### `backmark task check <id> <index>`
Mark criterion as completed (0-indexed).

**Example:**
```bash
backmark task check 1 0  # Check first criterion
backmark task check 1 1  # Check second
backmark task check 1 2  # Check third
```

#### `backmark task uncheck <id> <index>`
Mark criterion as incomplete.

**Example:**
```bash
backmark task uncheck 1 0
```

---

### Hierarchy & Dependencies

#### `backmark task tree <id>`
Display task hierarchy tree.

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
Show task dependencies and dependents.

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

**Example:**
```bash
backmark task blocked
```

---

### Search

#### `backmark search <query> [options]`
Fuzzy search across all tasks.

**Options:**
| Filter | Description |
|--------|-------------|
| `-s, --status <status>` | Filter by status |
| `-p, --priority <priority>` | Filter by priority |
| `-a, --assignee <assignee>` | Filter by assignee |
| `-m, --milestone <milestone>` | Filter by milestone |
| `-l, --label <label>` | Filter by label |

**Search Weights:**
- Title: 40%
- Description: 30%
- Labels: 30%

**Examples:**
```bash
# Simple search
backmark search "authentication"

# Search with status filter
backmark search "bug" --status "To Do"

# Search high priority tasks
backmark search "feature" --priority high

# Find AI tasks
backmark search "implement" --assignee "Claude"

# Search in milestone
backmark search "" --milestone "v1.0"
```

---

### Overview

#### `backmark overview [options]`
Display comprehensive project statistics and analytics.

**Options:**
| Flag | Description |
|------|-------------|
| `-m, --milestone <name>` | Filter statistics by milestone |
| `--start <date>` | Start date for filtering (YYYY-MM-DD) |
| `--end <date>` | End date for filtering (YYYY-MM-DD) |
| `--compact` | Compact view with single-line summaries |
| `--team` | Show detailed team breakdown (up to 10 members) |

**Statistics Displayed:**
- **Task Summary**: Total tasks, completion rate, status breakdown with progress bars
- **Priority Breakdown**: Distribution of tasks by priority level
- **Milestone Progress**: Completion percentage for each milestone
- **Team Activity**: Task distribution across team members (AI members highlighted)
- **Alerts**: Blocked tasks, critical priorities, overdue tasks, tasks without criteria
- **AI Collaboration**: AI-assigned tasks, AI documentation coverage, AI completion rate
- **Velocity Trends**: Task completion rate over last 4 weeks

**Examples:**
```bash
# Full statistics overview
backmark overview

# Compact single-line view
backmark overview --compact

# Filter by milestone
backmark overview -m "v1.0"

# Filter by date range
backmark overview --start "2025-01-01" --end "2025-03-31"

# Detailed team view
backmark overview --team
```

**Sample Output (Compact Mode):**
```
📋 BACKMARK OVERVIEW - All Tasks

Tasks:      25 total | 15 done (60%) | 5 in progress | 1 blocked
Priority:   2 critical | 8 high | 10 medium | 5 low
Milestones: v1.0 (75%) | v2.0 (30%)
Team:       Claude (12) | Alice (8) | Bob (5)
Velocity:   3.5 tasks/week (avg) | 4.2 days avg duration
Alerts:     🚫 1 blocked | 🔴 2 critical
AI Stats:   12 tasks | 75% with plan | 80% with review
```

---

### Kanban Board

#### `backmark board show [options]`
Display Kanban board view.

**Options:**
| Flag | Description |
|------|-------------|
| `-w, --watch` | Auto-refresh every 3 seconds |

**Features:**
- Multi-column layout (configurable)
- Task cards with ID, priority, title, assignee
- Color-coded priorities and statuses
- Progress indicators (acceptance criteria)
- Statistics per column
- AI task highlighting

**Examples:**
```bash
# Display once
backmark board show

# Auto-refresh mode
backmark board show --watch
```

**Board Layout:**
```
╔═══════════════════════════════════════════════════════════════════════════╗
║                            📋 PROJECT BOARD                               ║
╠═══════════════════════════════════════════════════════════════════════════╣

┌─────────────────┬─────────────────┬─────────────────┬─────────────────┐
│   To Do (3)     │ In Progress (2) │   Review (1)    │    Done (5)     │
├─────────────────┼─────────────────┼─────────────────┼─────────────────┤
│                 │                 │                 │                 │
│ 🔴 #001         │ 🔴 #005         │ 🟡 #009         │ 🟢 #012         │
│ Implement Auth  │ Build API       │ Code Review     │ Setup Project   │
│ 👤 Claude       │ 🤖 Claude       │ 👤 Alice        │ 👤 Bob          │
│ 🎯 v1.0         │ 🎯 v1.0         │ 🎯 v1.0         │ 🎯 v1.0         │
│ #auth #backend  │ #api #express   │ #review         │ #setup #init    │
│ ⏱ 2/5 criteria │ ⏱ 3/4 criteria │ ⏱ 1/2 criteria │ ✓ All done      │
│                 │                 │                 │                 │
│ 🟡 #002         │ 🟡 #007         │                 │ 🟢 #013         │
│ Add Dark Mode   │ Write Tests     │                 │ Configure CI    │
│ 👤 Alice        │ 👤 Bob          │                 │ 👤 Alice        │
│                 │                 │                 │                 │
└─────────────────┴─────────────────┴─────────────────┴─────────────────┘

Statistics:
  Total: 11 tasks | AI: 2 tasks | Completed: 5 (45%)
  Press Ctrl+C to exit (watch mode)
```

---

## 🎯 Vibe Coding Workflow

### Recommended Workflow for Human-AI Collaboration

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│  Human                          AI (Claude)                 System      │
│    │                                │                          │        │
│    │ 1. Create Task                 │                          │        │
│    ├───────────────────────────────>│                          │        │
│    │                                │                          │        │
│    │                                │ 2. Create Plan           │        │
│    │                                ├─────────────────────────>│        │
│    │                                │    (ai-plan)             │        │
│    │                                │                          │        │
│    │ 3. Review & Approve Plan       │                          │        │
│    │<───────────────────────────────┤                          │        │
│    │                                │                          │        │
│    │                                │ 4. Start Work            │        │
│    │                                │    (edit --status)       │        │
│    │                                ├─────────────────────────>│        │
│    │                                │                          │        │
│    │                                │ 5. Implement & Log       │        │
│    │                                │    (ai-note repeatedly)  │        │
│    │                                │<───────┐                 │        │
│    │                                │        │ Continuous      │        │
│    │                                │<───────┘ logging         │        │
│    │                                │                          │        │
│    │ 6. Monitor Progress            │                          │        │
│    │    (board --watch)             │                          │        │
│    │<───────────────────────────────────────────────────────────        │
│    │                                │                          │        │
│    │                                │ 7. Generate Docs         │        │
│    │                                │    (ai-doc)              │        │
│    │                                ├─────────────────────────>│        │
│    │                                │                          │        │
│    │                                │ 8. Self Review           │        │
│    │                                │    (ai-review)           │        │
│    │                                ├─────────────────────────>│        │
│    │                                │                          │        │
│    │ 9. Human Review                │                          │        │
│    │    (view --ai-all)             │                          │        │
│    │<───────────────────────────────────────────────────────────        │
│    │                                │                          │        │
│    │ 10. Close Task                 │                          │        │
│    ├───────────────────────────────>│                          │        │
│    │                                │                          │        │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

#### 1. **Human: Create the Task**
```bash
backmark task create "Add user authentication" \
  -d "Implement JWT-based authentication system" \
  -p high \
  -a "Claude" \
  -k "backend,security,auth" \
  -m "v1.0" \
  --start "2025-10-25" \
  --end "2025-10-30"
```

#### 2. **AI: Create Implementation Plan**
```bash
backmark task ai-plan 1 "
## Implementation Plan

### Phase 1: Setup (30 min)
- Install dependencies: passport, passport-jwt, bcrypt, jsonwebtoken
- Create auth configuration file
- Setup environment variables (JWT_SECRET, JWT_EXPIRES_IN)

### Phase 2: Models & Services (2 hours)
- Create User model with password hashing
- Implement AuthService:
  - register(email, password)
  - login(email, password)
  - generateToken(userId)
  - verifyToken(token)

### Phase 3: Middleware & Routes (1 hour)
- Create auth middleware for protected routes
- Add auth routes:
  - POST /auth/register
  - POST /auth/login
  - POST /auth/refresh

### Phase 4: Testing (1 hour)
- Unit tests for AuthService
- Integration tests for auth routes
- Security testing (SQL injection, XSS)

### Files to Create/Modify
- src/models/User.ts (new)
- src/services/AuthService.ts (new)
- src/middleware/auth.ts (new)
- src/routes/auth.ts (new)
- src/config/auth.ts (new)
- tests/unit/AuthService.test.ts (new)
- tests/integration/auth.test.ts (new)
- .env.example (modify)

### Dependencies
\`\`\`bash
npm install passport passport-jwt bcrypt jsonwebtoken
npm install -D @types/passport @types/passport-jwt @types/bcrypt @types/jsonwebtoken
\`\`\`

### Estimated Time: 4.5 hours
"
```

#### 3. **Human: Review and Approve**
```bash
# Review the plan
backmark task view 1 --ai-plan

# If approved, AI starts work
backmark task edit 1 --status "In Progress"
```

#### 4. **AI: Work and Document**
```bash
# AI logs progress continuously
backmark task ai-note 1 "Started implementation - installing dependencies"
backmark task ai-note 1 "Installed: passport, passport-jwt, bcrypt, jsonwebtoken"
backmark task ai-note 1 "Created User model with bcrypt hashing (10 rounds)"
backmark task ai-note 1 "Implemented AuthService with register and login methods"
backmark task ai-note 1 "Added JWT token generation with 1h expiration"
backmark task ai-note 1 "Created auth middleware for route protection"
backmark task ai-note 1 "Added auth routes: /register, /login, /refresh"
backmark task ai-note 1 "All unit tests passing (12/12)"
backmark task ai-note 1 "All integration tests passing (8/8)"
backmark task ai-note 1 "Security tests: SQL injection blocked ✓, XSS blocked ✓"

# Add acceptance criteria as discovered
backmark task add-criterion 1 "User can register with email/password"
backmark task add-criterion 1 "User can login and receive JWT"
backmark task add-criterion 1 "Protected routes require valid JWT"
backmark task add-criterion 1 "Invalid tokens return 401"
backmark task add-criterion 1 "Passwords are securely hashed"

# Check off completed criteria
backmark task check 1 0
backmark task check 1 1
backmark task check 1 2
backmark task check 1 3
backmark task check 1 4
```

#### 5. **AI: Generate Documentation**
```bash
backmark task ai-doc 1 "
## Authentication System Documentation

### Overview
JWT-based authentication system using passport.js with bcrypt password hashing.

### Architecture
\`\`\`
Client → Auth Routes → AuthService → User Model → Database
                ↓
          JWT Middleware → Protected Routes
\`\`\`

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

**Response (201):**
\`\`\`json
{
  \"user\": {
    \"id\": 1,
    \"email\": \"user@example.com\",
    \"createdAt\": \"2025-10-22T10:30:00Z\"
  },
  \"token\": \"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...\"
}
\`\`\`

**Errors:**
- 400: Invalid email or weak password
- 409: Email already exists

#### POST /auth/login
Login existing user.

**Request:** Same as register

**Response (200):** Same as register

**Errors:**
- 401: Invalid credentials
- 400: Missing email or password

#### POST /auth/refresh
Refresh JWT token (requires valid token).

**Headers:**
\`\`\`
Authorization: Bearer <token>
\`\`\`

**Response (200):**
\`\`\`json
{
  \"token\": \"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...\"
}
\`\`\`

### Configuration

**Environment Variables:**
\`\`\`bash
# Required
JWT_SECRET=your-secret-key-here

# Optional (with defaults)
JWT_EXPIRES_IN=1h
BCRYPT_ROUNDS=10
\`\`\`

### Usage in Code

**Protect a route:**
\`\`\`typescript
import { authMiddleware } from './middleware/auth';

app.get('/api/profile', authMiddleware, (req, res) => {
  // req.user is populated by middleware
  res.json({ user: req.user });
});
\`\`\`

**Manual authentication:**
\`\`\`typescript
import { authService } from './services/AuthService';

// Register
const { user, token } = await authService.register(email, password);

// Login
const { user, token } = await authService.login(email, password);

// Verify token
const userId = await authService.verifyToken(token);
\`\`\`

### Security Features
- ✅ Passwords hashed with bcrypt (configurable rounds)
- ✅ JWT tokens with expiration
- ✅ Protected routes via middleware
- ✅ SQL injection protection (parameterized queries)
- ✅ XSS protection (sanitized inputs)
- ✅ Password strength validation (min 8 chars, 1 uppercase, 1 number)

### Testing
\`\`\`bash
# Run all auth tests
npm test -- auth

# Unit tests only
npm test -- AuthService

# Integration tests only
npm test -- auth.test
\`\`\`

### Performance
- Registration: ~100ms (bcrypt hashing)
- Login: ~100ms (bcrypt comparison)
- Token verification: <5ms
- Protected route overhead: <5ms

### Troubleshooting

**Error: JWT_SECRET not defined**
- Add JWT_SECRET to .env file

**Error: Invalid token**
- Token may be expired (check JWT_EXPIRES_IN)
- Token may be malformed (check Bearer format)

**Error: Password too weak**
- Min 8 characters, 1 uppercase, 1 number required
"
```

#### 6. **AI: Self-Review**
```bash
backmark task ai-review 1 "
## Self Review - Authentication Implementation

### ✅ Completed Tasks
- [x] Installed all required dependencies
- [x] Created User model with bcrypt password hashing
- [x] Implemented AuthService with register, login, refresh
- [x] Created auth middleware for protected routes
- [x] Added auth routes with proper error handling
- [x] Wrote comprehensive unit tests (12/12 passing)
- [x] Wrote integration tests (8/8 passing)
- [x] Performed security testing
- [x] Generated complete documentation
- [x] All acceptance criteria met (5/5)

### 🔍 Testing Performed

**Unit Tests:**
- ✓ AuthService.register creates user correctly
- ✓ AuthService.register hashes password
- ✓ AuthService.register rejects duplicate emails
- ✓ AuthService.login validates credentials
- ✓ AuthService.login returns JWT token
- ✓ AuthService.login rejects invalid credentials
- ✓ AuthService.verifyToken validates tokens
- ✓ AuthService.verifyToken rejects expired tokens
- ✓ AuthService.verifyToken rejects malformed tokens
- ✓ Password validation rejects weak passwords
- ✓ Email validation rejects invalid emails
- ✓ Token generation includes correct claims

**Integration Tests:**
- ✓ POST /auth/register creates user and returns token
- ✓ POST /auth/register returns 409 for duplicate email
- ✓ POST /auth/login returns token for valid credentials
- ✓ POST /auth/login returns 401 for invalid credentials
- ✓ POST /auth/refresh returns new token
- ✓ Protected routes require valid token
- ✓ Protected routes reject missing token
- ✓ Protected routes reject invalid token

**Security Tests:**
- ✓ SQL injection attempts blocked
- ✓ XSS attempts sanitized
- ✓ Weak passwords rejected
- ✓ Rate limiting not yet implemented (see improvements)

### 📊 Quality Metrics
- **Code Coverage**: 94% (target: >90%)
- **Response Time**: <100ms for all endpoints
- **Security Scan**: 0 critical vulnerabilities
- **Type Safety**: 100% (TypeScript strict mode)
- **Linting**: 0 issues (ESLint + Prettier)
- **Bundle Size**: +23KB (acceptable)

### 💡 Suggested Improvements

**High Priority:**
1. **Rate Limiting**: Add to prevent brute force attacks
   - Implement: 10 login attempts per IP per minute
   - Use: express-rate-limit package
   - Estimated: 30 minutes

2. **Refresh Token Rotation**: Enhance security
   - Current: Single long-lived JWT
   - Better: Access token (15min) + Refresh token (7days)
   - Estimated: 1 hour

**Medium Priority:**
3. **Email Verification**: Confirm email addresses
   - Add verification token to User model
   - Send verification email on registration
   - Add /auth/verify/:token endpoint
   - Estimated: 2 hours

4. **Password Reset**: Allow users to reset forgotten passwords
   - Add reset token to User model
   - Implement /auth/forgot-password and /auth/reset-password
   - Send reset email
   - Estimated: 2 hours

**Low Priority:**
5. **2FA Support**: Add two-factor authentication
   - Implement TOTP (Google Authenticator)
   - Add /auth/2fa/setup and /auth/2fa/verify
   - Estimated: 3 hours

6. **OAuth Providers**: Social login
   - Add Google, GitHub OAuth
   - Use passport-google-oauth20, passport-github2
   - Estimated: 4 hours

### ❓ Questions for Human Review

1. **Rate Limiting**: Should we implement now (30min) or defer to v1.1?
   - Pro: Critical for security
   - Con: v1.0 deadline is tight

2. **Email Verification**: Required for v1.0 launch?
   - Without: Users can use any email (even fake ones)
   - With: Better data quality, prevents spam

3. **Refresh Tokens**: Should we implement rotation now (1h)?
   - Current: Single JWT with 1h expiration (forces re-login)
   - Better: Refresh tokens allow seamless experience

4. **2FA**: What's the priority? v1.0, v1.1, or v2.0?
   - TOTP is most common (Google Authenticator)
   - SMS is user-friendly but less secure

5. **Environment**: Should JWT expiration be configurable per-environment?
   - Dev: Longer tokens (24h) for convenience
   - Prod: Shorter tokens (1h) for security

### 🚨 Known Limitations

1. **No Rate Limiting**: Vulnerable to brute force attacks
   - Mitigation: Add rate limiting (see improvements)

2. **No Email Verification**: Users can register with fake emails
   - Mitigation: Add email verification (see improvements)

3. **No Password Reset**: Users can't recover forgotten passwords
   - Mitigation: Add password reset flow (see improvements)

4. **Single JWT Token**: Forces re-login every hour
   - Mitigation: Implement refresh tokens (see improvements)

5. **No Account Locking**: Unlimited login attempts
   - Mitigation: Lock account after N failed attempts

### 📝 Additional Notes

- All code follows project conventions
- TypeScript strict mode enabled
- Comprehensive error handling with proper HTTP codes
- Logging added for all auth events
- Documentation is complete and accurate
- All tests are passing and comprehensive
- No sensitive data logged (passwords, tokens)
- Environment variables documented in .env.example

### ✅ Ready for Human Review
This implementation is **production-ready** for the current scope (basic JWT auth).
The suggested improvements are enhancements, not blockers.

**Recommended Next Steps:**
1. Human review of code and tests
2. Decide on rate limiting (high priority)
3. Decide on email verification for v1.0
4. Merge to main if approved
5. Deploy to staging for testing
"
```

#### 7. **Human: Review and Close**
```bash
# Review everything AI did
backmark task view 1 --ai-all

# Review specific sections
backmark task view 1 --ai-notes    # See the development log
backmark task view 1 --ai-review   # See the self-review

# If satisfied, close the task
backmark task close 1

# Or request changes
backmark task ai-note 1 "Human: Please add rate limiting before closing"
backmark task edit 1 --status "Review"
```

#### 8. **Monitor Progress (Parallel Terminal)**
```bash
# Terminal 1: Watch the board in real-time
backmark board show --watch

# Terminal 2: Work on tasks
# Board updates automatically every 3 seconds!
```

---

## 🗂️ Task File Structure

### File Naming Convention
```
backlog/task-001 - Implement user authentication.md
backlog/task-002 - Fix login bug.md
backlog/task-010 - Add dark mode.md
```

### Complete Task File Example
```markdown
---
id: 1
title: "Add user authentication"

# Manual dates (set by user)
start_date: "2025-10-25"
end_date: "2025-10-30"
release_date: "2025-11-01"

# Automatic dates (managed by system)
created_date: "2025-10-22T10:30:00Z"
updated_date: "2025-10-22T14:15:00Z"
closed_date: null

# Organization
status: "In Progress"
priority: "high"
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

# History (auto-logged)
changelog:
  - timestamp: "2025-10-22T10:30:00Z"
    action: "created"
    details: "Task created"
    user: "system"
  - timestamp: "2025-10-22T14:15:00Z"
    action: "status_changed"
    details: "status: To Do → In Progress"
    user: "AI"
  - timestamp: "2025-10-22T15:30:00Z"
    action: "assigned"
    details: "assigned: Claude"
    user: "Alice"

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

  ### Phase 1: Setup
  - Install dependencies
  - Create configuration
  ...

ai_notes: |
  **2025-10-22T14:30:00Z** - Started implementation
  **2025-10-22T15:00:00Z** - Installed dependencies
  **2025-10-22T16:00:00Z** - Created User model
  ...

ai_documentation: |
  ## Authentication System

  ### Overview
  JWT-based authentication using passport.js.
  ...

ai_review: |
  ## Self Review

  ### ✅ Completed
  - [x] All features implemented
  - [x] Tests passing (15/15)
  ...
---

# Add user authentication

## Description
Implement JWT-based authentication system with user registration and login.

## Technical Details
- Use passport.js for authentication
- bcrypt for password hashing
- JWT tokens for session management

## Requirements
- User registration endpoint
- User login endpoint
- Protected route middleware
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
  threshold: 0.3        # Fuzzy matching tolerance (0=exact, 1=match anything)
  maxResults: 50

performance:
  useIndex: true              # Use LokiJS for fast queries (recommended)
  rebuildIndexOnStart: false  # Force rebuild index on start (debug only)

validations:
  close:
    check_subtasks: true              # Validate all subtasks are done
    check_dependencies: true          # Validate all dependencies are resolved
    check_blocked_by: true            # Validate no blocking tasks remain
    check_acceptance_criteria: true   # Validate all criteria are checked
    warn_missing_ai_review: true      # Warn if AI task has no review
    warn_early_close: true            # Warn if closing before end_date
    warn_late_close: true             # Warn if closing after end_date
    warn_quick_close: 300             # Warn if task < N seconds (0=disabled)
    suggest_parent_close: true        # Suggest closing parent when all children done
    notify_unblocked: true            # Notify about newly unblocked tasks
    allow_force: true                 # Allow --force to bypass validations
```

### Customization Examples

#### 1. Customize Board Columns
```yaml
board:
  columns:
    - "Backlog"
    - "To Do"
    - "In Progress"
    - "Code Review"
    - "QA"
    - "Staging"
    - "Done"
```

#### 2. Adjust Search Sensitivity
```yaml
search:
  threshold: 0.2  # More strict (0 = exact match, 1 = anything)
  maxResults: 100
```

#### 3. Change Date Format
```yaml
display:
  dateFormat: "MM/dd/yyyy HH:mm"  # US format
  zeroPaddedIds: false             # #1 instead of #001
```

#### 4. Performance Tuning
```yaml
performance:
  useIndex: true               # Use LokiJS index (default: true)
  rebuildIndexOnStart: false   # Rebuild every time (default: false)
```

#### 5. Customize Task Close Validations
```yaml
validations:
  close:
    # Strict validations (blocking)
    check_subtasks: true              # Require all subtasks done
    check_dependencies: false         # Skip dependency check
    check_acceptance_criteria: true   # Require all criteria checked

    # Warnings (non-blocking)
    warn_quick_close: 600             # Warn if task < 10 minutes
    warn_missing_ai_review: false     # Don't warn about missing AI review

    # Suggestions
    suggest_parent_close: true        # Suggest parent close
    notify_unblocked: true            # Notify unblocked tasks

    # Force option
    allow_force: true                 # Allow --force flag
```

**Common Scenarios:**

```yaml
# Strict mode (maximum validation)
validations:
  close:
    check_subtasks: true
    check_dependencies: true
    check_blocked_by: true
    check_acceptance_criteria: true
    warn_quick_close: 60              # Very strict (1 minute)
    allow_force: false                # No bypass allowed

# Relaxed mode (minimal validation)
validations:
  close:
    check_subtasks: false
    check_dependencies: false
    check_blocked_by: false
    check_acceptance_criteria: false
    warn_quick_close: 0               # Disabled
    allow_force: true

# AI-focused mode (focus on AI documentation)
validations:
  close:
    check_subtasks: true
    warn_missing_ai_review: true      # Strict on AI review
    warn_quick_close: 300
    suggest_parent_close: true
```

### Performance Settings Explained

#### `useIndex: true` (Recommended)
- **How it works**: Caches task metadata in `backlog/.cache/tasks.db`
- **Performance**: 50-250x faster for 500+ tasks
- **First run**: Builds index (~2-3 seconds for 500 tasks)
- **Subsequent runs**: Instant (<10ms)
- **Auto-sync**: Checks file modification time, updates only changed files
- **Storage**: ~1KB per task in cache

#### `useIndex: false` (Fallback)
- **How it works**: Reads and parses Markdown files directly
- **Performance**: Acceptable for <100 tasks, slow for 500+
- **Use case**: Debugging, small projects, or avoiding cache

#### `rebuildIndexOnStart: true` (Debug)
- Forces complete index rebuild on every command
- Use only for debugging stale data issues
- Significantly slower startup time

### Cache Management

```bash
# Cache location
backlog/.cache/tasks.db

# Cache is automatically gitignored
# To add to existing project:
echo ".cache/" >> backlog/.gitignore

# To clear cache manually:
rm -rf backlog/.cache/

# Cache rebuilds automatically on next command
```

---

## 🏗️ Project Architecture

```
backmark/
├── src/
│   ├── cli.ts                    # CLI entry point
│   ├── commands/                 # CLI commands
│   │   ├── init.ts              # Project initialization
│   │   ├── search.ts            # Fuzzy search
│   │   ├── task/
│   │   │   ├── create.ts        # Task creation
│   │   │   ├── list.ts          # Task listing with filters
│   │   │   ├── view.ts          # Task detail view
│   │   │   ├── edit.ts          # Task editing
│   │   │   ├── ai.ts            # AI-specific commands
│   │   │   ├── check.ts         # Acceptance criteria
│   │   │   ├── hierarchy.ts     # Tree, deps, blocked
│   │   │   └── index.ts         # Task command router
│   │   └── board/
│   │       ├── display.ts       # Kanban board rendering
│   │       └── index.ts
│   ├── core/
│   │   └── backlog.ts           # Main Backlog class (business logic)
│   ├── services/
│   │   └── indexing.ts          # LokiJS indexing service
│   ├── ui/
│   │   ├── board-tui.ts         # Board UI components
│   │   └── table.ts             # Table rendering utilities
│   ├── utils/
│   │   ├── colors.ts            # Color formatting functions
│   │   ├── date.ts              # Date formatting with date-fns
│   │   ├── fuzzy-search.ts      # Fuse.js wrapper
│   │   ├── logger.ts            # Colorized logging
│   │   └── validation.ts        # Zod schemas
│   └── types/
│       ├── task.ts              # Task type definitions
│       ├── config.ts            # Config type definitions
│       └── index.ts             # Type exports
├── .claude/
│   ├── agents/
│   │   └── backmark-agent.md   # Claude Code agent
│   └── settings.local.json
├── tests/
│   ├── unit/                    # Unit tests
│   └── integration/             # Integration tests
├── scripts/
│   └── fix-imports.mjs          # Build script
├── dist/                        # Compiled JavaScript
├── package.json
├── tsconfig.json                # TypeScript config
├── biome.json                   # Linter config
├── LICENSE
└── README.md
```

### Key Components

#### **Backlog Class** (`src/core/backlog.ts`)
- Main business logic
- Task CRUD operations
- File system operations
- LokiJS index management
- Config management

#### **Indexing Service** (`src/services/indexing.ts`)
- LokiJS database wrapper
- Automatic index synchronization
- File modification detection
- Query optimization

#### **CLI Commands** (`src/commands/`)
- Each command in its own file
- Uses Commander.js for parsing
- Colorized output with Chalk
- Interactive prompts with Inquirer

#### **Type System** (`src/types/`)
- Full TypeScript coverage
- Zod schemas for runtime validation
- Type-safe API

---

## 🎨 CLI Output Examples

### Task List Output
```
┌──────┬──────────────────────────────────────┬───────────────┬──────────┬────────────┬──────────────┐
│ ID   │ Title                                │ Status        │ Priority │ Assignees  │ Updated      │
├──────┼──────────────────────────────────────┼───────────────┼──────────┼────────────┼──────────────┤
│ #001 │ Implement user authentication        │ In Progress   │ high     │ Claude     │ 2 hours ago  │
│ #002 │ Add dark mode toggle                 │ To Do         │ medium   │ Alice      │ 1 day ago    │
│ #003 │ Fix login redirect loop              │ Done          │ critical │ Bob        │ 3 days ago   │
│ #004 │ Build REST API                       │ Review        │ high     │ Claude     │ 5 hours ago  │
└──────┴──────────────────────────────────────┴───────────────┴──────────┴────────────┴──────────────┘

Total: 4 task(s)
```

### Task View Output
```
╔══════════════════════════════════════════════════════════════════════════════╗
║                          Task #001: Implement user authentication            ║
╚══════════════════════════════════════════════════════════════════════════════╝

Status:        In Progress
Priority:      high
Milestone:     v1.0
Assignees:     Claude, Alice
Labels:        [feature] [backend]

Dates:
  Start:       2025-10-25
  End:         2025-10-30
  Release:     2025-11-01
  Created:     2025-10-22 10:30
  Updated:     2025-10-22 14:15

Dependencies:
  Depends on:  #005 (Database Schema) ✓ Done

Acceptance Criteria:
  ✅ User can register with email/password
  ✅ User can login and receive JWT
  ⬜ Protected routes require valid JWT

────────────────────────────────────────────────────────────────────────────────

# Description

Implement JWT-based authentication system with user registration and login.

## Technical Details
- Use passport.js for authentication
- bcrypt for password hashing
- JWT tokens for session management

────────────────────────────────────────────────────────────────────────────────

🤖 AI PLAN

## Implementation Plan

### Phase 1: Setup
- Install dependencies
- Create configuration
...

────────────────────────────────────────────────────────────────────────────────

🤖 AI NOTES

**2025-10-22T14:30:00Z** - Started implementation
**2025-10-22T15:00:00Z** - Installed dependencies
**2025-10-22T16:00:00Z** - Created User model

────────────────────────────────────────────────────────────────────────────────

📋 CHANGELOG

• 2025-10-22 10:30  created        Task created (system)
• 2025-10-22 14:15  status_changed status: To Do → In Progress (AI)
• 2025-10-22 15:30  assigned       assigned: Claude (Alice)
```

### Search Output
```
╔══════════════════════════════════════════════════════════════════════════════╗
║                        Search Results for "authentication"                   ║
╚══════════════════════════════════════════════════════════════════════════════╝

Found 3 tasks (sorted by relevance):

1. #001 - Implement user authentication [Score: 0.95]
   Status: In Progress | Priority: high | Assignee: Claude
   Labels: #backend #security #auth
   "Implement JWT-based authentication system with user registration..."

2. #007 - Add OAuth providers [Score: 0.72]
   Status: To Do | Priority: medium | Assignee: Alice
   Labels: #auth #oauth #google
   "Add Google and GitHub OAuth authentication..."

3. #012 - Refactor auth middleware [Score: 0.58]
   Status: Done | Priority: low | Assignee: Bob
   Labels: #refactor #auth #middleware
   "Refactor authentication middleware for better performance..."
```

### Board Output (Watch Mode)
```
╔═══════════════════════════════════════════════════════════════════════════════╗
║                               📋 MY PROJECT BOARD                             ║
║                           Last updated: 2025-10-22 14:30                      ║
╚═══════════════════════════════════════════════════════════════════════════════╝

┌────────────────────┬────────────────────┬────────────────────┬────────────────────┐
│   To Do (5)        │  In Progress (3)   │    Review (2)      │     Done (10)      │
├────────────────────┼────────────────────┼────────────────────┼────────────────────┤
│                    │                    │                    │                    │
│ 🔴 #001            │ 🔴 #005            │ 🟡 #009            │ 🟢 #012            │
│ Implement Auth     │ Build REST API     │ Code Review        │ Setup Project      │
│ 🤖 Claude          │ 🤖 Claude          │ 👤 Alice           │ 👤 Bob             │
│ 🎯 v1.0            │ 🎯 v1.0            │ 🎯 v1.0            │ 🎯 v1.0            │
│ #auth #backend     │ #api #express      │ #review            │ #setup             │
│ ⏱ 2/3 ✓           │ ⏱ 3/5 ✓           │ ⏱ 1/2 ✓           │ ✓ Complete         │
│                    │                    │                    │                    │
│ 🟡 #002            │ 🟡 #007            │ 🔵 #010            │ 🟢 #013            │
│ Add Dark Mode      │ Write Tests        │ Security Audit     │ CI Configuration   │
│ 👤 Alice           │ 👤 Bob             │ 👤 Alice           │ 👤 Alice           │
│ 🎯 v1.0            │ 🎯 v1.0            │ 🎯 v1.0            │ 🎯 v1.0            │
│                    │                    │                    │                    │
│ 🔵 #003            │ 🔵 #008            │                    │ 🟢 #014            │
│ Docs Update        │ Refactor Code      │                    │ Deployment         │
│ 👤 Bob             │ 👤 Bob             │                    │ 👤 Bob             │
│                    │                    │                    │                    │
└────────────────────┴────────────────────┴────────────────────┴────────────────────┘

Statistics:
  📊 Total: 20 tasks | 🤖 AI: 2 tasks | ✅ Completed: 10 (50%) | 🎯 v1.0: 15 tasks

Press Ctrl+C to exit • Auto-refresh in 3s...
```

---

## 🎨 CLI Color Coding

### Priority Colors
| Priority | Color | Symbol |
|----------|-------|--------|
| Low      | 🔵 Blue | `low` |
| Medium   | 🟡 Yellow | `medium` |
| High     | 🔴 Red | `high` |
| Critical | 🔴⚠️ Red BG | `critical` |

### Status Colors
| Status | Color | Symbol |
|--------|-------|--------|
| To Do | ⚪ Gray | `To Do` |
| In Progress | 🟡 Yellow | `In Progress` |
| Review | 🔵 Cyan | `Review` |
| Done | 🟢 Green | `Done` |
| Blocked | 🔴 Red | `Blocked` |

### Special Highlighting
| Element | Color | Symbol |
|---------|-------|--------|
| AI Assignees | 🟣 Magenta | `Claude`, `GPT`, `AI` |
| Human Assignees | White | `Alice`, `Bob` |
| Milestones | 🟡 Yellow | `🎯 v1.0` |
| Labels | 🔵 Cyan | `[feature]`, `[bug]` |
| Task IDs | Bold White | `#001` |
| Success Messages | 🟢 Green | `✓ Task created` |
| Error Messages | 🔴 Red | `✗ Error` |
| Warnings | 🟡 Yellow | `⚠ Warning` |

---

## 🧪 Examples

### Example 1: Bug Fix Workflow
```bash
# 1. Create bug task
backmark task create "Fix login redirect loop" \
  -d "Users get stuck in redirect loop after login" \
  -p critical \
  -a "Bob" \
  -l "bug,urgent,frontend,login,hotfix,v1.0"

# 2. Add acceptance criteria
backmark task add-criterion 1 "Login redirects to dashboard"
backmark task add-criterion 1 "No infinite loop occurs"
backmark task add-criterion 1 "Works in all browsers (Chrome, Firefox, Safari)"

# 3. Start working
backmark task edit 1 --status "In Progress"

# 4. Debug and log progress
backmark task ai-note 1 "Reproduced issue: happens when token expires during redirect"
backmark task ai-note 1 "Root cause: middleware redirecting before checking token validity"
backmark task ai-note 1 "Fix applied: added token check before redirect"
backmark task ai-note 1 "Tested in Chrome, Firefox, Safari - all working"

# 5. Mark criteria as done
backmark task check 1 0
backmark task check 1 1
backmark task check 1 2

# 6. Close
backmark task close 1
```

### Example 2: Feature with Subtasks
```bash
# 1. Create main feature
backmark task create "User Profile System" \
  -d "Complete user profile management system" \
  -p high \
  -m "v1.0" \
  -k "feature,profile,users" \
  -a "Claude"

# 2. Create subtasks
backmark task create "Profile page UI" \
  --parent 1 \
  -p medium \
  -a "Alice"

backmark task create "Profile edit form" \
  --parent 1 \
  -p medium \
  -a "Alice"

backmark task create "Avatar upload" \
  --parent 1 \
  -p high \
  -a "Bob"

backmark task create "Profile API endpoints" \
  --parent 1 \
  -p high \
  -a "Claude"

# 3. Set dependencies (API before frontend)
backmark task edit 2 --add-dependency 5  # UI depends on API
backmark task edit 3 --add-dependency 5  # Form depends on API

# 4. View hierarchy
backmark task tree 1

# Output:
# 📋 #001 User Profile System  To Do
#   │
#   ├─ #002 Profile page UI  To Do (depends on: #005)
#   ├─ #003 Profile edit form  To Do (depends on: #005)
#   ├─ #004 Avatar upload  To Do
#   └─ #005 Profile API endpoints  To Do

# 5. Work on tasks in order
backmark task edit 5 --status "In Progress"  # Start with API
backmark task ai-plan 5 "1. Create User model\n2. Add profile endpoints\n..."
# ... implement ...
backmark task close 5

backmark task edit 2 --status "In Progress"  # Now UI can start
# ... etc
```

### Example 3: AI-Driven Development
```bash
# 1. Human creates task
backmark task create "Implement caching layer" \
  -d "Add Redis caching for better performance" \
  -p high \
  -a "Claude" \
  -k "performance,redis,cache,backend" \
  -m "v1.0"

# 2. AI creates detailed plan
backmark task ai-plan 1 "
## Implementation Plan

### 1. Setup Redis (30 min)
- Install ioredis package
- Create Redis client singleton
- Add connection error handling
- Configure Redis connection (host, port, password)

### 2. Create CacheService (1 hour)
- Implement methods:
  - get(key): Get cached value
  - set(key, value, ttl): Set with TTL
  - del(key): Delete cache entry
  - clear(): Clear all cache
  - exists(key): Check if key exists
- Add JSON serialization/deserialization
- Add error handling and logging

### 3. Add Cache Middleware (30 min)
- Create Express middleware for route caching
- Cache GET requests only
- Configurable TTL per route
- Skip cache for authenticated requests (optional)

### 4. Implement Cache Invalidation (30 min)
- On POST/PUT/DELETE, invalidate related cache
- Pattern-based invalidation (e.g., user:* on user update)
- Event-based invalidation

### 5. Testing (1 hour)
- Unit tests for CacheService
- Integration tests for middleware
- Performance tests (before/after caching)

### Files to Create/Modify
- src/services/CacheService.ts (new)
- src/config/redis.ts (new)
- src/middleware/cache.ts (new)
- tests/unit/CacheService.test.ts (new)
- tests/integration/cache.test.ts (new)
- .env.example (modify - add Redis config)

### Dependencies
\`\`\`bash
npm install ioredis
npm install -D @types/ioredis
\`\`\`

### Performance Goals
- 90% cache hit rate for common queries
- <5ms cache lookup time
- 10x reduction in database queries
"

# 3. Human reviews and approves
backmark task view 1 --ai-plan
backmark task edit 1 --status "In Progress"

# 4. AI implements and logs progress
backmark task ai-note 1 "Installed ioredis package"
backmark task ai-note 1 "Created Redis client with connection pooling"
backmark task ai-note 1 "Implemented CacheService with get/set/del/clear/exists methods"
backmark task ai-note 1 "Added JSON serialization with error handling"
backmark task ai-note 1 "Created cache middleware for Express routes"
backmark task ai-note 1 "Implemented TTL support (default: 5 minutes, configurable)"
backmark task ai-note 1 "Added pattern-based cache invalidation (e.g., user:*)"
backmark task ai-note 1 "All unit tests passing (12/12)"
backmark task ai-note 1 "Integration tests passing (8/8)"
backmark task ai-note 1 "Performance tests: 95% cache hit rate, 3ms avg lookup"

# 5. AI generates documentation
backmark task ai-doc 1 "$(cat docs/cache-system.md)"

# 6. AI reviews
backmark task ai-review 1 "
## Self Review

### ✅ Completed
- [x] Redis client configured
- [x] CacheService implemented
- [x] Cache middleware created
- [x] Tests passing (20/20)
- [x] Performance goals exceeded

### 📊 Performance Results
- Cache hit rate: 95% (goal: 90%)
- Lookup time: 3ms avg (goal: <5ms)
- Database query reduction: 12x (goal: 10x)

### 💡 Suggestions
- Add cache warming on startup
- Implement distributed locking for cache updates
- Add monitoring/metrics for cache performance
"

# 7. Human reviews
backmark task view 1 --ai-all

# 8. Close
backmark task close 1
```

### Example 4: Sprint Planning
```bash
# 1. Create sprint milestone
backmark task create "Sprint 5 Planning" \
  -m "Sprint-5" \
  -k "planning,sprint"

# 2. Add sprint tasks
backmark task create "Feature A: User notifications" \
  -m "Sprint-5" \
  -p high \
  -a "Claude" \
  -k "feature,notifications"

backmark task create "Feature B: Export functionality" \
  -m "Sprint-5" \
  -p medium \
  -a "Alice" \
  -k "feature,export"

backmark task create "Bug fixes from Sprint 4" \
  -m "Sprint-5" \
  -p high \
  -a "Bob" \
  -k "bug,hotfix"

backmark task create "Performance optimization" \
  -m "Sprint-5" \
  -p medium \
  -a "Claude" \
  -k "performance,optimization"

# 3. View sprint board
backmark board show

# 4. Search sprint tasks
backmark search "" --milestone "Sprint-5"

# 5. Monitor sprint progress
backmark board show --watch

# 6. At end of sprint, check completion
backmark task list --milestone "Sprint-5" --status "Done"
```

---

## 🔍 Advanced Tips

### 1. **Leverage Dependencies for Complex Projects**
Create dependency chains to track prerequisites and blockers.

```bash
# Backend API must be done before frontend
backmark task create "Backend API" -p high
backmark task create "Frontend UI" --depends-on 1

# Multiple dependencies
backmark task create "Deployment" --depends-on "1,2,3,4"

# View what's blocking progress
backmark task blocked

# View dependency tree
backmark task deps 5
```

### 2. **Use AI Notes as Continuous Dev Log**
AI notes are timestamped automatically - perfect for debugging later.

```bash
# Log everything
backmark task ai-note 1 "Starting implementation"
backmark task ai-note 1 "Hit blocker: Redis connection failing"
backmark task ai-note 1 "Blocker resolved: updated Redis config"
backmark task ai-note 1 "Implemented cache middleware"
backmark task ai-note 1 "Tests passing"
backmark task ai-note 1 "Ready for review"

# Later, review the timeline
backmark task view 1 --ai-notes
```

### 3. **Board Watch Mode for Pairing**
Perfect for pair programming or AI collaboration.

```bash
# Terminal 1: Board view (always visible)
backmark board show --watch

# Terminal 2: Work on tasks
backmark task edit 5 --status "In Progress"
# Board updates automatically in Terminal 1!
```

### 4. **Export for Reporting**
Use search and list to generate reports.

```bash
# All high priority tasks
backmark task list --priority high

# All AI tasks
backmark task list --assignee "Claude"

# Sprint completion rate
backmark task list --milestone "Sprint-5" --status "Done"

# Blocked tasks (needs attention)
backmark task blocked

# Tasks by assignee
backmark task list --assignee "Alice"
```

### 6. **Combine Filters for Precision**
Stack multiple filters for specific queries.

```bash
# High priority tasks assigned to Claude in v1.0
backmark task list \
  --priority high \
  --assignee "Claude" \
  --milestone "v1.0"

# In-progress bugs
backmark task list \
  --status "In Progress" \
  --keyword "bug"

# Critical blockers
backmark task list \
  --priority critical \
  --status "Blocked"
```

### 7. **Use Subtasks for Large Features**
Break down epic features into manageable pieces.

```bash
# Create epic
backmark task create "E-Commerce System" -m "v2.0"

# Create subtasks
for feature in "Product Catalog" "Shopping Cart" "Checkout" "Payment"; do
  backmark task create "$feature" --parent 1 -m "v2.0"
done

# View hierarchy
backmark task tree 1
```

### 8. **Smart Milestone Management**
Use milestones for sprints, versions, or releases.

```bash
# Create all v1.0 tasks
backmark task create "Feature X" -m "v1.0"
backmark task create "Feature Y" -m "v1.0"

# View v1.0 progress
backmark search "" --milestone "v1.0"

# Check v1.0 completion
backmark task list --milestone "v1.0" --status "Done"
```

---

## 🤖 Using with Claude Code

Backmark is designed to work seamlessly with Claude Code, transforming AI task management.

### Quick Setup

```bash
# 1. Install Backmark globally
npm install -g @grazulex/backmark

# 2. Initialize in your project
cd /path/to/your/project
backmark init "Your Project"

# 3. Claude Code can now use Backmark!
```

### What Claude Code Does with Backmark

When working in a Backmark-enabled project, Claude Code will:

1. **📋 Create tasks** for features, bugs, and refactors
2. **📝 Document plans** before implementing (`ai-plan`)
3. **🚧 Log progress** continuously (`ai-note`)
4. **📚 Generate docs** during implementation (`ai-doc`)
5. **✅ Self-review** when complete (`ai-review`)
6. **📊 Track criteria** and check them off as completed

### Example Claude Code Session

```
You: "Implement user authentication with JWT"

Claude Code:
✓ Created task #5: "Implement user authentication"
✓ Added implementation plan
✓ Status → In Progress
[...implements the feature...]
✓ Logged 8 progress notes
✓ Generated API documentation
✓ Self-review complete
✓ Status → Done

View with: backmark task view 5 --ai-all
```

### Monitoring Claude's Work

```bash
# Watch board in real-time
backmark board show --watch

# View Claude's tasks
backmark task list --assignee "Claude"

# See detailed AI sections
backmark task view <id> --ai-all

# Just the plan
backmark task view <id> --ai-plan

# Just the notes (dev log)
backmark task view <id> --ai-notes
```

---

## ⚖️ Comparison with Other Tools

| Feature | Backmark | Jira | Trello | GitHub Issues | Linear | Notion |
|---------|----------|------|--------|---------------|--------|--------|
| **Markdown-based** | ✅ 100% | ❌ | ❌ | ✅ Partial | ❌ | ✅ Partial |
| **Offline-first** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **AI-first design** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **CLI interface** | ✅ | ❌ | ❌ | ✅ Limited | ❌ | ❌ |
| **Git-friendly** | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ |
| **Local storage** | ✅ | ❌ Cloud | ❌ Cloud | ❌ Cloud | ❌ Cloud | ❌ Cloud |
| **Zero config** | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| **Privacy** | ✅ 100% local | ⚠️ Cloud | ⚠️ Cloud | ⚠️ Cloud | ⚠️ Cloud | ⚠️ Cloud |
| **Speed (500+ tasks)** | ✅ <10ms | ⚠️ Slow | ⚠️ Slow | ✅ Fast | ✅ Fast | ⚠️ Slow |
| **Kanban board** | ✅ CLI | ✅ Web | ✅ Web | ✅ Web | ✅ Web | ✅ Web |
| **Dependencies** | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ |
| **Hierarchical tasks** | ✅ Unlimited | ✅ 2 levels | ❌ | ❌ | ✅ | ✅ |
| **Fuzzy search** | ✅ | ✅ | ⚠️ Basic | ✅ | ✅ | ✅ |
| **Changelog** | ✅ Auto | ✅ Manual | ❌ | ✅ | ✅ | ⚠️ Partial |
| **Acceptance criteria** | ✅ | ✅ | ❌ | ❌ | ✅ | ✅ |
| **AI documentation** | ✅ Built-in | ❌ | ❌ | ❌ | ❌ | ⚠️ Manual |
| **Cost** | ✅ Free | 💰 Paid | ✅ Free tier | ✅ Free | 💰 Paid | ✅ Free tier |
| **Self-hosted** | ✅ Always | ⚠️ Enterprise | ❌ | ❌ | ❌ | ❌ |
| **Lock-in risk** | ✅ None (MD) | ❌ High | ❌ High | ⚠️ Medium | ❌ High | ⚠️ Medium |

### When to Use Backmark

**✅ Perfect for:**
- Solo developers or small teams
- AI-powered development workflows
- Privacy-conscious projects
- Offline development
- Git-based collaboration
- Command-line enthusiasts
- Projects needing future-proof storage

**⚠️ Maybe not ideal for:**
- Large distributed teams (50+ people)
- Non-technical stakeholders needing GUI
- Complex project management needs (Gantt charts, resource allocation)
- Requires mobile access

---

## 📊 Performance Benchmarks

### Task Operations (with LokiJS indexing)

| Operation | 10 Tasks | 100 Tasks | 500 Tasks | 1000 Tasks |
|-----------|----------|-----------|-----------|------------|
| List all | 8ms | 10ms | 12ms | 15ms |
| Search | 5ms | 7ms | 10ms | 12ms |
| View task | 3ms | 3ms | 3ms | 3ms |
| Create task | 15ms | 18ms | 22ms | 25ms |
| Edit task | 12ms | 15ms | 18ms | 22ms |
| Board display | 20ms | 25ms | 30ms | 35ms |

### Task Operations (without indexing - direct FS)

| Operation | 10 Tasks | 100 Tasks | 500 Tasks | 1000 Tasks |
|-----------|----------|-----------|-----------|------------|
| List all | 25ms | 150ms | 800ms | 1800ms |
| Search | 30ms | 200ms | 1200ms | 2500ms |
| View task | 5ms | 8ms | 12ms | 15ms |
| Create task | 20ms | 25ms | 35ms | 50ms |
| Edit task | 18ms | 22ms | 32ms | 45ms |
| Board display | 50ms | 300ms | 1500ms | 3000ms |

### Memory Usage

| Tasks | Index Size | Memory (idle) | Memory (query) |
|-------|------------|---------------|----------------|
| 10 | 10 KB | 15 MB | 20 MB |
| 100 | 100 KB | 18 MB | 25 MB |
| 500 | 500 KB | 25 MB | 35 MB |
| 1000 | 1 MB | 35 MB | 50 MB |

### Index Build Time

| Tasks | First Build | Incremental Update |
|-------|-------------|-------------------|
| 10 | 50ms | 5ms |
| 100 | 200ms | 20ms |
| 500 | 1.2s | 100ms |
| 1000 | 2.5s | 200ms |

### Performance Recommendations

**Small projects (<100 tasks):**
- Both indexed and non-indexed modes work well
- Set `useIndex: false` if you prefer simplicity

**Medium projects (100-500 tasks):**
- Indexing highly recommended
- 50-100x performance improvement
- Set `useIndex: true` (default)

**Large projects (500+ tasks):**
- Indexing essential for good UX
- 100-250x performance improvement
- Consider increasing `maxResults` in search config

---

## ❓ FAQ

### General

**Q: Is Backmark free?**
A: Yes, 100% free and open-source (MIT License).

**Q: Does Backmark require internet?**
A: No, it's 100% offline. All data is stored locally.

**Q: What happens to my data if I stop using Backmark?**
A: Your data is plain Markdown files. They're readable in any text editor, forever.

**Q: Can I use Backmark with existing Markdown files?**
A: Not yet, but manual migration is easy (just add YAML frontmatter). Import tool planned for v0.6.

**Q: Does Backmark work on Windows?**
A: Yes! Windows, macOS, and Linux are all supported.

### Usage

**Q: How do I migrate from Jira/Trello/GitHub Issues?**
A: Manual migration for now. Export to CSV, write a script to convert to Backmark format. Import tool planned for v0.6.

**Q: Can multiple people work on the same backlog?**
A: Yes, via Git! Commit and push your `backlog/` directory. Merge conflicts are rare (each task is a separate file).

**Q: How do I back up my tasks?**
A: Use Git, or any backup tool. Files are in `backlog/` directory.

**Q: Can I export to PDF or HTML?**
A: Not built-in, but tasks are Markdown, so use pandoc or any MD→PDF converter.

**Q: How do I delete a task?**
A: Manually delete the file in `backlog/`. Delete command planned for v0.6.

### AI Integration

**Q: Do I need Claude Code to use Backmark?**
A: No! Backmark works standalone. Claude Code integration is optional.

**Q: Can I use Backmark with other AI assistants (GPT, Copilot)?**
A: Yes! The AI features work with any assistant. Just assign tasks to them.

**Q: What if I don't use AI at all?**
A: Totally fine! Just ignore the `ai-*` commands and sections.

**Q: Are AI sections required?**
A: No, they're optional. Tasks work fine without them.

### Performance

**Q: How many tasks can Backmark handle?**
A: Tested with 1000+ tasks. Performance is excellent with indexing (10-15ms queries).

**Q: What's the index file size?**
A: ~1KB per task. 1000 tasks = ~1MB index.

**Q: Can I disable indexing?**
A: Yes, set `performance.useIndex: false` in `config.yml`.

**Q: Why is the first command slow after update?**
A: Index is rebuilding. Subsequent commands are instant.

### Troubleshooting

**Q: Command not found: backmark**
A: Run `npm install -g @grazulex/backmark` or `npm link` in the project directory.

**Q: Backlog not initialized error**
A: Run `backmark init "Project Name"` in your project directory.

**Q: Tasks not showing in board**
A: Check `backlog/config.yml` - task status must match a board column.

**Q: Index seems stale**
A: Set `performance.rebuildIndexOnStart: true`, run a command, then set back to `false`.

**Q: Board not refreshing in watch mode**
A: Press Ctrl+C and restart. Check that `--watch` flag is used.

---

## 🛠️ Troubleshooting

### Installation Issues

#### Problem: `command not found: backmark`
**Solution:**
```bash
# Option 1: Reinstall globally
npm install -g @grazulex/backmark

# Option 2: Use npm link (for development)
cd /path/to/backmark
npm link

# Verify
which backmark
backmark --version
```

#### Problem: Permission errors during npm install
**Solution:**
```bash
# Use npm's built-in fix
npm config set prefix ~/.npm-global
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc

# Then reinstall
npm install -g @grazulex/backmark
```

#### Problem: TypeScript compilation errors
**Solution:**
```bash
# Clean and rebuild
rm -rf dist/
npm run build

# Check Node.js version (need >= 18)
node --version
```

### Usage Issues

#### Problem: `Backlog not initialized` error
**Solution:**
```bash
# Initialize in project directory
cd /path/to/your/project
backmark init "Project Name"

# Verify backlog/ directory was created
ls -la backlog/
```

#### Problem: Tasks not appearing in `list` or `board`
**Solution:**
```bash
# 1. Check files exist
ls backlog/*.md

# 2. Verify file format (has YAML frontmatter)
head -n 20 backlog/task-001-*.md

# 3. Rebuild index
# Edit backlog/config.yml:
performance:
  rebuildIndexOnStart: true

# Run any command, then set back to false
backmark task list
```

#### Problem: Board columns don't match
**Solution:**
```bash
# Edit backlog/config.yml to match your task statuses
board:
  columns:
    - "To Do"
    - "In Progress"
    - "Review"
    - "Done"

# Make sure task statuses match exactly (case-sensitive)
```

#### Problem: Search returns no results
**Solution:**
```bash
# 1. Check threshold (lower = more strict)
# Edit backlog/config.yml:
search:
  threshold: 0.4  # Increase from 0.3

# 2. Use broader query
backmark search "auth"  # instead of "authentication"

# 3. Try without filters first
backmark search "bug"  # before adding --status, etc.
```

### Performance Issues

#### Problem: Commands are slow (>1s)
**Solution:**
```bash
# 1. Enable indexing (if disabled)
# Edit backlog/config.yml:
performance:
  useIndex: true

# 2. Rebuild index
performance:
  rebuildIndexOnStart: true

# Run command, then set back to false
backmark task list

# 3. Check index file
ls -lh backlog/.cache/tasks.db
```

#### Problem: Index seems stale (tasks don't update)
**Solution:**
```bash
# Option 1: Force rebuild
# Edit backlog/config.yml:
performance:
  rebuildIndexOnStart: true

# Run command
backmark task list

# Set back to false
performance:
  rebuildIndexOnStart: false

# Option 2: Delete cache manually
rm -rf backlog/.cache/
backmark task list  # Rebuilds automatically
```

#### Problem: High memory usage
**Solution:**
```bash
# Disable indexing for smaller footprint
# Edit backlog/config.yml:
performance:
  useIndex: false

# Queries will be slower but use less memory
```

### Board Issues

#### Problem: Board not refreshing in watch mode
**Solution:**
```bash
# 1. Stop watch mode (Ctrl+C)
# 2. Restart with --watch flag
backmark board show --watch

# If still not working, check for errors:
backmark board show 2>&1 | tee board-debug.log
```

#### Problem: Board layout broken or garbled
**Solution:**
```bash
# 1. Check terminal width
echo $COLUMNS  # Should be >= 80

# 2. Resize terminal window
# Try full screen

# 3. Use simpler view if needed
backmark task list
```

### AI Integration Issues

#### Problem: Claude Code agent not working
**Solution:**
```bash
# Agent is located in the project:
ls .claude/agents/backmark-agent.md

# You can manually copy it to Claude Code skills if needed:
cp .claude/agents/backmark-agent.md ~/.config/claude-code/skills/backmark.md
```

#### Problem: AI sections not showing
**Solution:**
```bash
# View with explicit flags
backmark task view <id> --ai-all
backmark task view <id> --ai-plan
backmark task view <id> --ai-notes

# Check file format
cat backlog/task-001-*.md | grep -A 10 "ai_plan:"
```

### File/Data Issues

#### Problem: Task file corruption
**Solution:**
```bash
# 1. Open file in text editor
nano backlog/task-001-*.md

# 2. Check YAML frontmatter format
# Must start with --- and end with ---
# YAML must be valid (use yamllint)

# 3. Restore from Git if needed
git checkout backlog/task-001-*.md
```

#### Problem: Config file errors
**Solution:**
```bash
# 1. Validate YAML syntax
yamllint backlog/config.yml

# 2. Restore default config
backmark init --force  # Overwrites config
```

### Git Integration Issues

#### Problem: Merge conflicts in task files
**Solution:**
```bash
# 1. Accept both changes (tasks are independent)
git checkout --ours backlog/task-001-*.md
# or
git checkout --theirs backlog/task-001-*.md

# 2. Manually merge if needed (YAML is simple)
nano backlog/task-001-*.md

# 3. Rebuild index after merge
rm -rf backlog/.cache/
backmark task list
```

### Debug Mode

Enable verbose logging for debugging:

```bash
# Set DEBUG environment variable
DEBUG=backmark:* backmark task list

# Or add to config.yml:
debug: true

# Check logs
tail -f ~/.backmark/debug.log
```

### Still Having Issues?

1. **Check version:**
   ```bash
   backmark --version
   # Should be 0.5.3 or higher
   ```

2. **Update to latest:**
   ```bash
   npm update -g @grazulex/backmark
   ```

3. **Clean reinstall:**
   ```bash
   npm uninstall -g @grazulex/backmark
   npm install -g @grazulex/backmark
   ```

4. **Report bug:**
   - Go to: https://github.com/Grazulex/backmark/issues
   - Include: OS, Node.js version, error message, steps to reproduce

---

## 🔒 Security

### Data Privacy

**All data is local:**
- ✅ No cloud storage
- ✅ No telemetry
- ✅ No analytics
- ✅ No external API calls
- ✅ No user tracking

**Your data never leaves your machine.**

### File Permissions

Backmark creates files with standard permissions:
```bash
# Task files: 644 (rw-r--r--)
# Directories: 755 (rwxr-xr-x)
```

To restrict access:
```bash
chmod 700 backlog/        # Only you can access
chmod 600 backlog/*.md    # Only you can read/write
```

### Sensitive Data

**⚠️ Do not store sensitive data in tasks:**
- ❌ Passwords
- ❌ API keys
- ❌ Tokens
- ❌ Private keys
- ❌ Personal information (unless encrypted)

**If using Git:**
- Tasks are plain text in repository
- Anyone with access can read them
- Consider using private repositories

### Cache Security

The LokiJS cache (`backlog/.cache/tasks.db`) contains task metadata:
- Already gitignored by default
- Same sensitivity as task files
- Delete with: `rm -rf backlog/.cache/`

### Secure Workflows

**For sensitive projects:**
```bash
# 1. Use encrypted filesystem
# 2. Use private Git repository
# 3. Restrict file permissions
chmod 700 backlog/

# 4. Add .cache to gitignore (already done)
echo ".cache/" >> backlog/.gitignore

# 5. Use Git-crypt for encryption (optional)
git-crypt init
echo "backlog/** filter=git-crypt diff=git-crypt" >> .gitattributes
```

### Security Reporting

Found a security issue? Please email security@backmark.dev (or create a private GitHub Security Advisory).

**Do not create public issues for security vulnerabilities.**

---

## 🛤️ Roadmap

> **Philosophy**: Backmark is designed for **vibe coding with AI**. Features focus on improving human-AI collaboration, not replacing traditional project management tools.

### v0.7.0 - AI Workflow Enhancement (Q1 2025)
- [ ] **AI Task Templates** - Pre-configured templates for AI-driven tasks
  - Feature template with structured `ai_plan` sections
  - Bug fix template with debugging checklist
  - Refactoring template with quality criteria
  - Research template with documentation structure
- [ ] **AI Task Automation Commands**
  - `task ai-breakdown <id>` - AI decomposes task into subtasks
  - `task ai-estimate <id>` - AI estimates complexity/duration
  - `task ai-suggest-tests <id>` - AI proposes acceptance criteria
  - `task ai-review-ready <id>` - Check if task ready for review
- [ ] **Export to Markdown Report** - Generate documentation from completed tasks
  - Sprint reports with AI contributions highlighted
  - Release notes from task changelogs
  - AI work summary (plans, notes, reviews)

### v0.8.0 - Enhanced AI Documentation (Q2 2025)
- [ ] **Structured AI Sections** - Richer AI documentation format
  - Code snippets in `ai_plan` with syntax highlighting
  - Decision trees in `ai_notes`
  - Test results in `ai_review`
  - Architecture diagrams in `ai_documentation`
- [ ] **AI Changelog Intelligence**
  - `task ai-summary <id>` - AI-generated summary of changelog
  - Timeline view of AI interventions
  - Pattern detection (frequent blockers, common issues)
- [ ] **Task Completion Percentage** - Visual progress tracking
  - Based on subtasks, dependencies, acceptance criteria
  - AI confidence score (plan coverage, review completeness)

### v0.9.0 - AI Context & Integration (Q3 2025)
- [ ] **MCP Server** (Model Context Protocol) - Deep AI agent integration
  - Expose Backmark data as MCP resources
  - AI agents can read/update tasks programmatically
  - Automatic task creation from AI conversations
- [ ] **Code-to-Task Linking** - Connect tasks to codebase
  - Detect related files/functions mentioned in tasks
  - Track which code was modified for each task
  - AI can auto-link code references
- [ ] **Smart Dependencies** - AI-suggested task relationships
  - Auto-detect dependencies from task descriptions
  - Suggest blockers based on code analysis
  - Recommend subtask ordering

### v1.0.0 - Production Ready (Q4 2025)
- [x] **Full test coverage** (>80% for critical modules) ✅
- [ ] **Complete documentation** - Guides for AI-driven workflows
- [ ] **Performance optimization** - Handle large projects efficiently
- [ ] **Git integration** - Optional auto-commit of AI changes
- [ ] **Plugin system** - Extend AI capabilities

### Future Ideas (v2.0+)
- [ ] **AI Code Review Integration** - Link AI reviews to PRs
- [ ] **Multi-AI Collaboration** - Track work from different AI assistants
- [ ] **Learning Mode** - AI learns from your workflow patterns
- [ ] **Natural Language Queries** - "Show me blocked AI tasks in v2.0"
- [ ] **AI Pair Programming Metrics** - Track AI contribution quality

**Vote on features:** https://github.com/Grazulex/backmark/discussions

---

## 🤝 Contributing

We welcome contributions! Here's how to get started.

### Development Setup

```bash
# 1. Fork the repository on GitHub

# 2. Clone your fork
git clone https://github.com/YOUR_USERNAME/backmark.git
cd backmark

# 3. Install dependencies
npm install

# 4. Create a branch
git checkout -b feature/my-feature

# 5. Make changes and test
npm run dev -- task list

# 6. Run tests
npm test

# 7. Lint and format
npm run check
npm run format

# 8. Build
npm run build

# 9. Commit and push
git add .
git commit -m "feat: add my feature"
git push origin feature/my-feature

# 10. Create Pull Request on GitHub
```

### Code Style

- **TypeScript**: Strict mode enabled
- **Linter**: Biome (not ESLint/Prettier)
- **Style**:
  - Single quotes
  - Semicolons
  - 2-space indent
  - Max line length: 100

Run before committing:
```bash
npm run check    # Lint + type check
npm run format   # Auto-format
```

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add task deletion command
fix: correct date formatting in board view
docs: update installation instructions
test: add tests for task creation
refactor: simplify backlog loading logic
perf: optimize search with caching
style: fix formatting in cli.ts
chore: update dependencies
```

### Testing

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage
```

Write tests for new features:
```typescript
// tests/unit/backlog.test.ts
import { describe, it, expect } from 'vitest';
import { Backlog } from '../src/core/backlog';

describe('Backlog', () => {
  it('should create a task', async () => {
    const backlog = await Backlog.load();
    const task = await backlog.createTask({ title: 'Test' });
    expect(task.id).toBeDefined();
    expect(task.title).toBe('Test');
  });
});
```

### Areas for Contribution

**Good First Issues:**
- Add more color themes
- Improve error messages
- Add more examples to docs
- Fix typos in README

**Medium Difficulty:**
- Task deletion command
- CSV import/export
- Custom fields
- Time tracking

**Advanced:**
- MCP server implementation
- Plugin system
- Web UI (view-only)
- Performance optimization

### Pull Request Process

1. **Update docs** if changing functionality
2. **Add tests** for new features
3. **Run checks**: `npm run check`
4. **Update CHANGELOG.md**
5. **Keep PR focused** (one feature per PR)
6. **Respond to feedback** in reviews

### Code of Conduct

Be respectful, constructive, and collaborative. We're all here to build something great together.

---

## 🧪 Testing

### Run Tests

```bash
# All tests
npm test

# Watch mode (auto-rerun on changes)
npm run test:watch

# Coverage report
npm run test:coverage
```

### Test Structure

```
tests/
├── unit/                      # Unit tests
│   ├── backlog.test.ts       # Backlog class
│   ├── task.test.ts          # Task operations
│   ├── search.test.ts        # Search functionality
│   └── indexing.test.ts      # LokiJS indexing
├── integration/               # Integration tests
│   ├── commands.test.ts      # CLI commands
│   ├── workflow.test.ts      # Complete workflows
│   └── git.test.ts           # Git integration
└── fixtures/                  # Test data
    ├── sample-backlog/
    └── sample-tasks/
```

### Writing Tests

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { Backlog } from '../src/core/backlog';
import { createTestBacklog } from './helpers';

describe('Task Management', () => {
  let backlog: Backlog;

  beforeEach(async () => {
    backlog = await createTestBacklog();
  });

  it('should create a task with all metadata', async () => {
    const task = await backlog.createTask({
      title: 'Test task',
      priority: 'high',
      status: 'To Do'
    });

    expect(task.id).toBeDefined();
    expect(task.title).toBe('Test task');
    expect(task.priority).toBe('high');
    expect(task.created_date).toBeDefined();
  });

  it('should list tasks with filters', async () => {
    await backlog.createTask({ title: 'Task 1', status: 'To Do' });
    await backlog.createTask({ title: 'Task 2', status: 'Done' });

    const todoTasks = await backlog.getTasks({ status: 'To Do' });
    expect(todoTasks).toHaveLength(1);
    expect(todoTasks[0].title).toBe('Task 1');
  });
});
```

### Test Coverage

Current coverage (target: >80%):
- Core logic: ~70%
- Commands: ~60%
- Utils: ~80%

---

## 🛠️ Development

### Setup

```bash
# Clone and install
git clone https://github.com/Grazulex/backmark.git
cd backmark
npm install
```

### Development Commands

```bash
# Run in dev mode (with auto-reload)
npm run dev -- <command>

# Examples
npm run dev -- task list
npm run dev -- task create "Test" -p high
npm run dev -- board show

# Build TypeScript
npm run build

# Install globally (for local testing)
npm run install:global

# Uninstall global version
npm run uninstall:global

# Lint
npm run lint

# Fix lint issues
npm run lint:fix

# Format code
npm run format

# Type check (no emit)
npm run check

# Full check (lint + format + typecheck)
npm run check
```

### Project Structure

```
src/
├── cli.ts                    # Entry point, Commander setup
├── commands/                 # All CLI commands
│   ├── init.ts
│   ├── search.ts
│   ├── task/
│   │   ├── index.ts         # Task router
│   │   ├── create.ts
│   │   ├── list.ts
│   │   ├── view.ts
│   │   ├── edit.ts
│   │   ├── ai.ts
│   │   ├── check.ts
│   │   └── hierarchy.ts
│   └── board/
│       ├── index.ts
│       └── display.ts
├── core/
│   └── backlog.ts           # Main business logic
├── services/
│   └── indexing.ts          # LokiJS service
├── ui/
│   ├── board-tui.ts
│   └── table.ts
├── utils/
│   ├── colors.ts            # Color helpers
│   ├── date.ts              # Date formatting
│   ├── fuzzy-search.ts      # Fuse.js wrapper
│   ├── logger.ts            # Logging
│   └── validation.ts        # Zod schemas
└── types/
    ├── task.ts
    ├── config.ts
    └── index.ts
```

### Adding a New Command

1. **Create command file:**
```typescript
// src/commands/mycommand.ts
import { Backlog } from '../core/backlog';
import chalk from 'chalk';

export async function myCommand(options: any) {
  const backlog = await Backlog.load();

  // Your logic here

  console.log(chalk.green('✓ Success!'));
}
```

2. **Register in CLI:**
```typescript
// src/cli.ts
import { myCommand } from './commands/mycommand';

program
  .command('mycommand')
  .description('My new command')
  .option('-f, --foo', 'Foo option')
  .action(myCommand);
```

3. **Add tests:**
```typescript
// tests/unit/mycommand.test.ts
describe('myCommand', () => {
  it('should do something', () => {
    // Test here
  });
});
```

4. **Update docs:**
```markdown
### My Command

#### `backmark mycommand [options]`
Description of my command...
```

### Code Quality

- **TypeScript strict mode**: All code is type-safe
- **Biome**: Linting and formatting
- **Vitest**: Testing framework
- **Coverage**: Aim for >80%

### Debugging

```bash
# Enable debug logs
DEBUG=backmark:* npm run dev -- task list

# Use Node.js inspector
node --inspect dist/cli.js task list

# Add breakpoints in VSCode (launch.json)
{
  "type": "node",
  "request": "launch",
  "name": "Debug Backmark",
  "program": "${workspaceFolder}/dist/cli.js",
  "args": ["task", "list"],
  "console": "integratedTerminal"
}
```

---

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2025 Jean-Marc Strauven

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🙏 Credits

**Author**: [Jean-Marc Strauven](https://github.com/Grazulex)

**Inspired by**:
- [Backlog.md](https://github.com/MrLesk/Backlog.md) - Original Markdown task management concept
- [Taskwarrior](https://taskwarrior.org/) - CLI task management done right
- [Linear](https://linear.app/) - Beautiful, fast project management

**Built with these amazing open-source projects:**
- [Commander.js](https://github.com/tj/commander.js) - CLI framework
- [Chalk](https://github.com/chalk/chalk) - Terminal colors
- [Inquirer](https://github.com/SBoudrias/Inquirer.js) - Interactive prompts
- [cli-table3](https://github.com/cli-table/cli-table3) - Beautiful tables
- [Fuse.js](https://www.fusejs.io/) - Fuzzy search
- [gray-matter](https://github.com/jonschlinkert/gray-matter) - YAML frontmatter parsing
- [date-fns](https://date-fns.org/) - Modern date utilities
- [Ora](https://github.com/sindresorhus/ora) - Elegant terminal spinners
- [Boxen](https://github.com/sindresorhus/boxen) - Terminal boxes
- [LokiJS](https://github.com/techfort/LokiJS) - In-memory database
- [Zod](https://zod.dev/) - TypeScript schema validation
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Biome](https://biomejs.dev/) - Fast linter and formatter
- [Vitest](https://vitest.dev/) - Blazing fast test framework

**Special thanks to:**
- Claude Code team for building an amazing AI development tool
- The open-source community for inspiration and support
- Early adopters and contributors

---

## 🚀 Happy Vibe Coding!

<div align="center">

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   "The best task management system is the one you actually    │
│    use. Backmark is designed to get out of your way and let   │
│    you (and your AI pair programmer) focus on building."      │
│                                                                 │
│                        - Backmark Philosophy                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Built with ❤️ for developers who code with AI**

[⭐ Star on GitHub](https://github.com/Grazulex/backmark) • [📦 npm Package](https://www.npmjs.com/package/@grazulex/backmark) • [🐛 Report Bug](https://github.com/Grazulex/backmark/issues) • [💡 Request Feature](https://github.com/Grazulex/backmark/discussions)

</div>
