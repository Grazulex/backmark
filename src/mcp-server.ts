#!/usr/bin/env node

/**
 * Backmark MCP Server Entry Point
 *
 * This server exposes Backmark functionality via the Model Context Protocol (MCP)
 * for integration with Claude Code and other MCP-compatible AI tools.
 *
 * Usage:
 *   node dist/mcp-server.js
 *
 * Or add to your MCP client configuration (e.g., Claude Code):
 *   {
 *     "mcpServers": {
 *       "backmark": {
 *         "command": "node",
 *         "args": ["/path/to/backmark/dist/mcp-server.js"]
 *       }
 *     }
 *   }
 */

import './mcp/server.js';
