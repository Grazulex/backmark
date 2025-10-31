#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { handleResourceRead, registerResources } from './resources.js';
import { handleToolCall, registerTools } from './tools.js';

/**
 * Backmark MCP Server
 * Exposes Backmark functionality to Claude Code and other MCP clients
 */
class BackmarkMCPServer {
  private server: Server;

  constructor() {
    this.server = new Server(
      {
        name: 'backmark-mcp',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
          resources: {},
        },
      }
    );

    this.setupHandlers();
  }

  private setupHandlers(): void {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: registerTools(),
      };
    });

    // Handle tool execution
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      return await handleToolCall(request.params.name, request.params.arguments);
    });

    // List available resources
    this.server.setRequestHandler(ListResourcesRequestSchema, async () => {
      return {
        resources: registerResources(),
      };
    });

    // Read resource content
    this.server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
      return await handleResourceRead(request.params.uri);
    });
  }

  async run(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);

    // Keep the server running
    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }
}

// Start the server
const server = new BackmarkMCPServer();
server.run().catch((error) => {
  console.error('Failed to start Backmark MCP server:', error);
  process.exit(1);
});
