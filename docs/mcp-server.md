# Backmark MCP Server

## Overview

The Backmark MCP (Model Context Protocol) Server exposes Backmark functionality to Claude Code and other MCP-compatible AI tools. This allows AI assistants to interact with your Backmark backlog directly.

## What is MCP?

MCP (Model Context Protocol) is Anthropic's standard protocol for connecting AI tools to external data sources and APIs. It provides a standardized way for Claude and other AI assistants to:
- Execute actions (via **tools**)
- Access information (via **resources**)

## Installation

### 1. Build the Project

First, ensure Backmark is built:

```bash
cd /home/jean-marc-strauven/Dev/Backmark
npm run build
```

### 2. Install Globally (Optional)

To use the MCP server from anywhere:

```bash
npm run install:global
```

This will make both `backmark` and `backmark-mcp-server` available globally.

## Configuration for Claude Code

### Local Development Setup

Add the Backmark MCP server to your Claude Code configuration:

1. Open Claude Code settings (usually `~/.config/claude-code/settings.json`)
2. Add the Backmark server to the `mcpServers` section:

```json
{
  "mcpServers": {
    "backmark": {
      "command": "node",
      "args": ["/home/jean-marc-strauven/Dev/Backmark/dist/mcp-server.js"],
      "env": {
        "NODE_ENV": "production"
      }
    }
  }
}
```

### Global Installation Setup

If you've installed Backmark globally:

```json
{
  "mcpServers": {
    "backmark": {
      "command": "backmark-mcp-server"
    }
  }
}
```

### Project-Specific Setup

If you want the MCP server to work only in a specific project directory:

```json
{
  "mcpServers": {
    "backmark-youtube": {
      "command": "node",
      "args": ["/home/jean-marc-strauven/Dev/Backmark/dist/mcp-server.js"],
      "cwd": "/home/jean-marc-strauven/Youtube",
      "env": {
        "NODE_ENV": "production"
      }
    }
  }
}
```

## Available Tools

The MCP server exposes the following tools for AI assistants:

### Task Management

- **backmark_task_create** - Create a new task
- **backmark_task_list** - List tasks with filters
- **backmark_task_view** - View detailed task information
- **backmark_task_edit** - Edit an existing task
- **backmark_task_close** - Close a task (set status to Done)

### AI Collaboration Tools

- **backmark_task_ai_plan** - Add/update AI implementation plan
- **backmark_task_ai_note** - Add timestamped AI work note
- **backmark_task_ai_doc** - Add/update AI-generated documentation
- **backmark_task_ai_review** - Add/update AI self-review

### Project Overview

- **backmark_search** - Search tasks with fuzzy matching
- **backmark_overview** - Get project statistics
- **backmark_board_show** - Get current Kanban board state

## Available Resources

The MCP server exposes the following resources for context:

- **backmark://config** - Current backlog configuration
- **backmark://tasks/all** - List of all tasks
- **backmark://docs/workflow** - AI workflow guide
- **backmark://docs/task-structure** - Task structure documentation
- **backmark://stats/overview** - Project statistics

## Usage Examples

### Creating a Task

When working with Claude Code, you can simply say:

> "Create a new Backmark task for implementing authentication with JWT"

Claude will use the `backmark_task_create` tool:

```json
{
  "title": "Implement JWT authentication",
  "description": "Add JWT-based authentication system",
  "priority": "high",
  "assignees": ["Claude"],
  "labels": ["feature", "auth"]
}
```

### AI Workflow

1. **Plan**: Claude documents the implementation plan
   ```
   backmark_task_ai_plan({
     id: 15,
     plan: "## Steps\n1. Install dependencies\n2. Create routes..."
   })
   ```

2. **Work**: Claude adds notes while working
   ```
   backmark_task_ai_note({
     id: 15,
     note: "Installed passport.js, using JWT strategy"
   })
   ```

3. **Document**: Claude generates documentation
   ```
   backmark_task_ai_doc({
     id: 15,
     documentation: "## Usage\n..."
   })
   ```

4. **Review**: Claude performs self-review
   ```
   backmark_task_ai_review({
     id: 15,
     review: "## Completed\n- ✓ Tests passing..."
   })
   ```

### Searching Tasks

> "Search for tasks related to authentication"

```json
{
  "query": "authentication",
  "status": "In Progress"
}
```

### Getting Project Overview

> "Show me the project overview"

```json
{
  "milestone": "v1.0"
}
```

## Testing the MCP Server

### Manual Test

You can test the MCP server manually:

```bash
# Start the server (it will wait for stdio input)
npm run start:mcp
```

The server communicates via stdio (standard input/output), so you won't see any output unless you send it valid MCP protocol messages.

### Test with Claude Code

1. Ensure you have a Backmark backlog initialized in your project:
   ```bash
   cd /home/jean-marc-strauven/Youtube
   backmark init "Youtube Project"
   ```

2. Configure Claude Code as shown above

3. Start Claude Code in the project directory

4. Ask Claude to interact with your backlog:
   > "List all my Backmark tasks"
   > "Create a new task for video editing"
   > "Show me the Kanban board"

## Troubleshooting

### Server Not Starting

If the MCP server doesn't start:

1. Check that the dist directory exists and contains mcp-server.js:
   ```bash
   ls -la /home/jean-marc-strauven/Dev/Backmark/dist/mcp-server.js
   ```

2. Try running the server directly:
   ```bash
   node /home/jean-marc-strauven/Dev/Backmark/dist/mcp-server.js
   ```

3. Check for Node.js errors in the output

### "Backlog not initialized" Error

The MCP server requires a Backmark backlog to be initialized in the working directory:

```bash
cd your-project
backmark init "My Project"
```

### Tools Not Appearing in Claude

1. Restart Claude Code after modifying the configuration
2. Check that the `mcpServers` configuration is valid JSON
3. Look for errors in Claude Code's logs

## Development

### Running in Development Mode

```bash
npm run dev:mcp
```

### Debugging

Add logging to the MCP server by modifying `src/mcp/server.ts`:

```typescript
console.error('MCP Server started'); // Logs to stderr, won't interfere with stdio
```

### Adding New Tools

1. Add tool definition in `src/mcp/tools.ts` (`registerTools` function)
2. Add tool handler in the same file (`handleToolCall` switch statement)
3. Rebuild: `npm run build`
4. Restart Claude Code

### Adding New Resources

1. Add resource definition in `src/mcp/resources.ts` (`registerResources` function)
2. Add resource handler (`handleResourceRead` switch statement)
3. Rebuild: `npm run build`

## Architecture

```
src/mcp/
├── server.ts        # MCP server setup and request handling
├── tools.ts         # Tool definitions and handlers
├── resources.ts     # Resource definitions and handlers
├── types.ts         # TypeScript types for MCP
└── index.ts         # Module exports

src/mcp-server.ts    # Entry point for the MCP server
```

The MCP server:
- Uses stdio transport (standard input/output)
- Loads the Backlog from the current working directory
- Executes commands using the existing Backlog API
- Returns results formatted for MCP clients

## Learn More

- [Model Context Protocol Documentation](https://modelcontextprotocol.io)
- [Claude Code Documentation](https://docs.claude.com/claude-code)
- [Backmark Documentation](https://github.com/Grazulex/backmark)
