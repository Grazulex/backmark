# Backmark MCP Server - Quick Start

This file provides a quick start guide for using Backmark with Claude Code via MCP (Model Context Protocol).

## 🚀 Quick Setup

### 1. Build the Project
```bash
npm run build
```

### 2. Configure Claude Code

Add this to your Claude Code settings (`~/.config/claude-code/settings.json`):

```json
{
  "mcpServers": {
    "backmark": {
      "command": "node",
      "args": ["/home/jean-marc-strauven/Dev/Backmark/dist/mcp-server.js"]
    }
  }
}
```

### 3. Test with Your Youtube Project

```bash
cd /home/jean-marc-strauven/Youtube
# If not already initialized:
backmark init "Youtube Project"
```

### 4. Use with Claude

In Claude Code, try:
- "List all my Backmark tasks"
- "Create a new task for video editing"
- "Show me the Kanban board"
- "Search for tasks related to editing"

## 📚 Full Documentation

See [docs/mcp-server.md](docs/mcp-server.md) for complete documentation.

## 🎯 Available Tools

- Task management: create, list, view, edit, close
- AI collaboration: plan, notes, documentation, review
- Project overview: search, statistics, board

## 🔗 Resources

- [Model Context Protocol](https://modelcontextprotocol.io)
- [Claude Code](https://docs.claude.com/claude-code)
- [Backmark Repository](https://github.com/Grazulex/backmark)
