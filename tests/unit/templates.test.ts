import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  applyTemplate,
  getTemplatesDir,
  getUserTemplatesDir,
  listTemplates,
  loadTemplate,
} from '../../src/utils/templates';

describe('templates.ts', () => {
  let tmpDir: string;
  let backlogPath: string;

  beforeEach(async () => {
    // Create temporary directory for testing
    tmpDir = path.join('/tmp', `backmark-test-${Date.now()}`);
    backlogPath = path.join(tmpDir, 'backlog');
    await fs.mkdir(tmpDir, { recursive: true });
    await fs.mkdir(backlogPath, { recursive: true });
  });

  afterEach(async () => {
    // Cleanup
    try {
      await fs.rm(tmpDir, { recursive: true, force: true });
    } catch {
      // Ignore cleanup errors
    }
  });

  describe('getTemplatesDir', () => {
    it('should return built-in templates directory path', () => {
      const dir = getTemplatesDir();
      expect(dir).toContain('templates');
      expect(path.isAbsolute(dir)).toBe(true);
    });
  });

  describe('getUserTemplatesDir', () => {
    it('should return user templates directory path', () => {
      const dir = getUserTemplatesDir(backlogPath);
      expect(dir).toBe(path.join(backlogPath, 'templates'));
    });
  });

  describe('listTemplates', () => {
    it('should list built-in templates', async () => {
      const templates = await listTemplates();
      expect(templates).toContain('feature');
      expect(templates).toContain('bugfix');
      expect(templates).toContain('refactoring');
      expect(templates).toContain('research');
      expect(templates.length).toBeGreaterThanOrEqual(4);
    });

    it('should handle missing user templates directory', async () => {
      const templates = await listTemplates(backlogPath);
      // Should still return built-in templates
      expect(templates).toContain('feature');
      expect(templates.length).toBeGreaterThanOrEqual(4);
    });

    // Note: Custom template tests are integration-level and require real filesystem setup
    // These are tested manually and via integration tests
  });

  describe('loadTemplate', () => {
    it('should load built-in feature template', async () => {
      const template = await loadTemplate('feature');
      expect(template.name).toBe('feature');
      expect(template.content).toBeTruthy();
      expect(template.metadata).toHaveProperty('status');
      expect(template.metadata).toHaveProperty('priority');
      expect(template.metadata).toHaveProperty('labels');
    });

    it('should load built-in bugfix template', async () => {
      const template = await loadTemplate('bugfix');
      expect(template.name).toBe('bugfix');
      expect(template.content).toBeTruthy();
      expect(template.metadata).toHaveProperty('labels');
      expect(template.metadata.labels).toContain('bug');
    });

    it('should load built-in refactoring template', async () => {
      const template = await loadTemplate('refactoring');
      expect(template.name).toBe('refactoring');
      expect(template.content).toBeTruthy();
      expect(template.metadata).toHaveProperty('labels');
    });

    it('should load built-in research template', async () => {
      const template = await loadTemplate('research');
      expect(template.name).toBe('research');
      expect(template.content).toBeTruthy();
      expect(template.metadata).toHaveProperty('labels');
    });

    it('should throw error for non-existent built-in template', async () => {
      await expect(loadTemplate('nonexistent')).rejects.toThrow();
    });

    // Note: Custom template loading tests are integration-level
    // These tests require real filesystem operations with proper timing
    // They are tested manually and should be added as integration tests later
  });

  describe('applyTemplate', () => {
    it('should merge template metadata with user options', () => {
      const template = {
        name: 'test',
        filePath: '/path/to/template.md',
        metadata: {
          status: 'To Do',
          priority: 'medium',
          labels: ['feature'],
        },
        content: '# Template content',
      };

      const userOptions = {
        priority: 'high', // Override
        milestone: 'v1.0', // Add new
      };

      const result = applyTemplate(template, userOptions);

      expect(result.metadata.status).toBe('To Do'); // From template
      expect(result.metadata.priority).toBe('high'); // Overridden by user
      expect(result.metadata.milestone).toBe('v1.0'); // Added by user
      expect(result.metadata.labels).toEqual(['feature']); // From template
      expect(result.description).toBe('# Template content');
    });

    it('should merge labels arrays', () => {
      const template = {
        name: 'test',
        filePath: '/path/to/template.md',
        metadata: {
          labels: ['feature', 'backend'],
        },
        content: '# Content',
      };

      const userOptions = {
        labels: ['urgent', 'backend'], // 'backend' is duplicate
      };

      const result = applyTemplate(template, userOptions);

      // Should merge and deduplicate
      expect(result.metadata.labels).toContain('feature');
      expect(result.metadata.labels).toContain('backend');
      expect(result.metadata.labels).toContain('urgent');
      expect(result.metadata.labels.length).toBe(3); // Deduped
    });

    it('should handle user options with no template metadata', () => {
      const template = {
        name: 'test',
        filePath: '/path/to/template.md',
        metadata: {},
        content: '# Content',
      };

      const userOptions = {
        status: 'In Progress',
        priority: 'high',
      };

      const result = applyTemplate(template, userOptions);

      expect(result.metadata.status).toBe('In Progress');
      expect(result.metadata.priority).toBe('high');
    });

    it('should handle template with no user options', () => {
      const template = {
        name: 'test',
        filePath: '/path/to/template.md',
        metadata: {
          status: 'To Do',
          priority: 'medium',
        },
        content: '# Content',
      };

      const result = applyTemplate(template, {});

      expect(result.metadata.status).toBe('To Do');
      expect(result.metadata.priority).toBe('medium');
    });

    it('should preserve template content', () => {
      const template = {
        name: 'test',
        filePath: '/path/to/template.md',
        metadata: {},
        content: '# My Template\n\n## Section 1\nContent here.',
      };

      const result = applyTemplate(template, {});

      expect(result.description).toBe('# My Template\n\n## Section 1\nContent here.');
    });

    it('should handle undefined user options', () => {
      const template = {
        name: 'test',
        filePath: '/path/to/template.md',
        metadata: { status: 'To Do' },
        content: '# Content',
      };

      const result = applyTemplate(template, { status: undefined });

      expect(result.metadata.status).toBe('To Do'); // Template value preserved
    });

    it('should handle null user options', () => {
      const template = {
        name: 'test',
        filePath: '/path/to/template.md',
        metadata: { status: 'To Do' },
        content: '# Content',
      };

      const result = applyTemplate(template, { status: null });

      expect(result.metadata.status).toBe('To Do'); // Template value preserved
    });

    it('should override all template metadata when user provides values', () => {
      const template = {
        name: 'test',
        filePath: '/path/to/template.md',
        metadata: {
          status: 'To Do',
          priority: 'low',
          milestone: 'v1.0',
        },
        content: '# Content',
      };

      const userOptions = {
        status: 'In Progress',
        priority: 'critical',
        milestone: 'v2.0',
      };

      const result = applyTemplate(template, userOptions);

      expect(result.metadata.status).toBe('In Progress');
      expect(result.metadata.priority).toBe('critical');
      expect(result.metadata.milestone).toBe('v2.0');
    });
  });
});
