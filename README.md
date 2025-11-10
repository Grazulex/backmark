<div align="center">

<img src="https://backmark.tech/assets/logo_small.webp" alt="Backmark Logo" width="200">

# Backmark

### 🤖 AI-Powered Task Management for Developers
**100% Markdown • 100% Offline • 100% Yours**

[![npm version](https://img.shields.io/npm/v/@grazulex/backmark.svg?style=flat-square&logo=npm&color=cb3837)](https://www.npmjs.com/package/@grazulex/backmark)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)
[![Watch Demo](https://img.shields.io/badge/▶️_Watch-Demo_Video-red?style=flat-square&logo=youtube)](https://youtu.be/3XtQNpzTE_8)
[![Documentation](https://img.shields.io/badge/📚-Full_Docs-blue?style=flat-square)](https://backmark.tech)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

**Transform plain Markdown files into a powerful task management system designed for AI-powered vibe coding.**

[Watch Demo](#-watch-the-demo) • [Quick Start](#-quick-start) • [Documentation](https://backmark.tech) • [Why Backmark?](#-why-backmark)

</div>

---

## 🎬 Watch the Demo

**New to Backmark?** Watch this 2-minute introduction:

<div align="center">

[![Backmark Introduction Video](https://img.youtube.com/vi/3XtQNpzTE_8/hqdefault.jpg)](https://youtu.be/3XtQNpzTE_8)

**👆 Click to watch on YouTube** • [🌐 Full Documentation](https://backmark.tech)

</div>

---

## ⚡ Quick Start

```bash
# Install globally
npm install -g @grazulex/backmark

# Initialize your project
backmark init "My Awesome Project"

# Create your first task
backmark task create "Build authentication system" \
  --priority high \
  --assignees "Claude"

# Let AI document the implementation plan
backmark task ai-plan 1 "
## Implementation Plan
1. Install JWT libraries
2. Create auth middleware
3. Add protected routes
4. Write tests
"

# View your Kanban board
backmark board
```

**→ [Complete Getting Started Guide](https://backmark.tech/getting-started)**

---

## ✨ Why Backmark?

<table>
<tr>
<td width="50%">

### 🤖 AI-First Design
Four dedicated spaces for AI collaboration:
- **AI Plan** - Implementation strategy
- **AI Notes** - Work log with timestamps
- **AI Documentation** - Generated docs
- **AI Review** - Self-assessment

</td>
<td width="50%">

### 📝 Markdown Native
Tasks are plain `.md` files with YAML frontmatter. No proprietary formats, no vendor lock-in. Your tasks will be readable in 50 years.

</td>
</tr>
<tr>
<td>

### ⚡ Blazing Fast
LokiJS indexing delivers sub-10ms queries even with 1000+ tasks. Fuzzy search, filters, and complex queries run instantly.

</td>
<td>

### 🎨 Beautiful CLI
Interactive Kanban board, colorful tables, intuitive commands. Task management that feels like a modern dev tool.

</td>
</tr>
<tr>
<td>

### 🔒 Privacy First
100% offline, zero telemetry, no cloud dependencies. Your data stays on your machine, under your control.

</td>
<td>

### 🔌 MCP Integration
Seamless integration with Claude Code via Model Context Protocol. AI can read, create, and update tasks directly.

</td>
</tr>
</table>

---

## 🎯 What is Vibe Coding?

Backmark is built for **vibe coding** - a collaborative workflow where humans and AI work together seamlessly:

> *"The AI doesn't just execute commands—it plans, documents its decisions, tracks its progress, and reviews its own work. Backmark provides the shared memory that makes this collaboration possible."*

**Key Principles:**
- 🧑 **Human** defines goals, validates results, makes strategic decisions
- 🤖 **AI** implements, documents, tests, and self-reviews
- 🔄 **Backmark** maintains shared context across sessions

**→ [Learn More About Vibe Coding](https://backmark.tech/vibe-coding)**

---

## 📚 Full Documentation

Complete documentation is available at **[backmark.tech](https://backmark.tech)**

### Essential Guides

| Guide | Description |
|-------|-------------|
| [📖 Installation](https://backmark.tech/install) | Multiple installation methods, troubleshooting |
| [🚀 Getting Started](https://backmark.tech/getting-started) | First steps, basic commands, examples |
| [🤖 AI Workflow](https://backmark.tech/ai-workflow) | Complete guide to AI collaboration patterns |
| [📋 Commands](https://backmark.tech/commands) | Full command reference with examples |
| [⚙️ Configuration](https://backmark.tech/configuration) | Customize workflows, board columns, validations |
| [🔌 MCP Integration](https://backmark.tech/mcp) | Setup Claude Code integration |
| [🏗️ Architecture](https://backmark.tech/architecture) | How Backmark works under the hood |
| [🐛 Troubleshooting](https://backmark.tech/troubleshooting) | Common issues and solutions |

---

## 🎓 Example Workflow

```bash
# 1. Human creates a task
backmark task create "Add user authentication" \
  --template feature \
  --priority high \
  --milestone "v1.0"

# 2. AI reads the task and creates a plan
backmark task ai-plan 1 "$(cat <<'EOF'
## Implementation Steps
1. Install passport.js and JWT libraries
2. Create User model with password hashing
3. Implement /login and /register endpoints
4. Add authentication middleware
5. Write integration tests
EOF
)"

# 3. AI updates status and works on the task
backmark task edit 1 --status "In Progress"

# 4. AI logs progress as it works
backmark task ai-note 1 "Installed passport.js v0.6.0"
backmark task ai-note 1 "Created User model with bcrypt hashing"
backmark task ai-note 1 "Problem: JWT secret not in env. Fixed by adding to .env.example"

# 5. AI generates documentation
backmark task ai-doc 1 "$(cat auth-implementation.md)"

# 6. AI performs self-review
backmark task ai-review 1 "
## Review Summary
✅ All acceptance criteria met
✅ Tests passing (15/15)
✅ Coverage: 94%

⚠️ Recommendation: Add rate limiting before production
"

# 7. Human reviews and approves
backmark task view 1 --ai-all
backmark task edit 1 --status "Done"
```

**→ [See More Workflow Examples](https://backmark.tech/ai-workflow#complete-session-examples)**

---

## 🌟 Key Features

### Task Management
- ✅ Create, edit, list, search tasks
- ✅ Hierarchical tasks (parent/subtasks)
- ✅ Dependencies and blockers
- ✅ Acceptance criteria checklists
- ✅ Milestones and labels
- ✅ Priority levels
- ✅ Automatic changelog

### AI Collaboration
- 🤖 Dedicated AI plan space
- 📓 Timestamped AI work notes
- 📚 AI-generated documentation
- ✅ AI self-review
- 🎯 Task templates for consistency
- 🔍 AI breakdown for complex tasks
- 📊 AI estimation for planning

### User Experience
- 🎨 Interactive Kanban board (terminal UI)
- 🔍 Fuzzy search across all content
- 📊 Project overview with statistics
- 🎯 Powerful filtering (status, priority, labels, milestones)
- 🌈 Colorful, intuitive CLI
- ⚡ Sub-10ms query performance

### Integration
- 🔌 MCP server for Claude Code
- 📝 100% Markdown files
- 🔒 Fully offline
- 🚫 Zero telemetry
- 📦 Git-friendly (plain text)

---

## 🚀 Installation

### npm (Recommended)

```bash
npm install -g @grazulex/backmark
```

### Verify Installation

```bash
backmark --version
# Should output: 1.2.1 or higher
```

### Other Methods

See the [complete installation guide](https://backmark.tech/install) for:
- Local project installation
- npx usage
- Building from source
- Troubleshooting

---

## 🤝 Contributing

Contributions are welcome! Whether it's:
- 🐛 Bug reports
- ✨ Feature requests
- 📝 Documentation improvements
- 🔧 Code contributions

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

## 📊 Comparison

| Feature | Backmark | Jira | Linear | GitHub Issues |
|---------|----------|------|--------|---------------|
| **AI-First Design** | ✅ | ❌ | ❌ | ❌ |
| **Offline-First** | ✅ | ❌ | ❌ | ❌ |
| **Plain Markdown** | ✅ | ❌ | ❌ | ⚠️ |
| **Zero Cost** | ✅ | ❌ | ❌ | ⚠️ |
| **No Vendor Lock-in** | ✅ | ❌ | ❌ | ⚠️ |
| **CLI Native** | ✅ | ❌ | ❌ | ⚠️ |
| **MCP Integration** | ✅ | ❌ | ❌ | ❌ |

**→ [Detailed Comparison](https://backmark.tech/why)**

---

## 🛣️ Roadmap

- ✅ Core task management (v0.1)
- ✅ Kanban board (v0.2)
- ✅ AI workflow spaces (v0.3)
- ✅ MCP server integration (v0.5)
- ✅ Task templates (v0.7)
- ✅ AI automation commands (v0.8)
- 🔄 Export/import (JSON, CSV) (v0.9) - In Progress
- 🔜 Git integration (auto-commit) (v1.0)
- 🔜 Custom workflows (v1.1)
- 🔜 Plugin system (v1.2)

See the [full roadmap](https://backmark.tech/changelog) for details.

---

## 📄 License

MIT © [Jean-Marc Strauven](https://github.com/Grazulex)

---

## 🔗 Links

<div align="center">

**[🌐 Website](https://backmark.tech)** •
**[🎬 YouTube](https://youtu.be/3XtQNpzTE_8)** •
**[💬 Discussions](https://github.com/Grazulex/backmark/discussions)** •
**[🐛 Issues](https://github.com/Grazulex/backmark/issues)** •
**[📦 npm](https://www.npmjs.com/package/@grazulex/backmark)**

---

**Built with ❤️ for developers who vibe code with AI**

*Star this repo if Backmark helps your workflow!* ⭐

</div>
