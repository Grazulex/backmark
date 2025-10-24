import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface TaskTemplate {
  name: string;
  filePath: string;
  metadata: Record<string, unknown>;
  content: string;
}

/**
 * Get the path to the templates directory
 */
export function getTemplatesDir(): string {
  // In production (dist/), templates are at ../../templates
  // In development (src/), templates are at ../templates
  const isDist = __dirname.includes('/dist/');
  return path.join(__dirname, isDist ? '../../templates' : '../../templates');
}

/**
 * Get the path to user's custom templates directory (in backlog/)
 */
export function getUserTemplatesDir(backlogPath: string): string {
  return path.join(backlogPath, 'templates');
}

/**
 * List all available templates (built-in + user custom)
 */
export async function listTemplates(backlogPath?: string): Promise<string[]> {
  const templates: string[] = [];

  // Built-in templates
  const builtInDir = getTemplatesDir();
  try {
    const files = await fs.readdir(builtInDir);
    const taskTemplates = files
      .filter((f) => f.startsWith('task-') && f.endsWith('.md'))
      .map((f) => f.replace('task-', '').replace('.md', ''));
    templates.push(...taskTemplates);
  } catch (error) {
    // Templates directory might not exist in development
    console.warn('Built-in templates directory not found');
  }

  // User custom templates
  if (backlogPath) {
    const userDir = getUserTemplatesDir(backlogPath);
    try {
      await fs.access(userDir);
      const files = await fs.readdir(userDir);
      const userTemplates = files
        .filter((f) => f.startsWith('task-') && f.endsWith('.md'))
        .map((f) => `custom:${f.replace('task-', '').replace('.md', '')}`);
      templates.push(...userTemplates);
    } catch {
      // User templates directory doesn't exist, that's fine
    }
  }

  return templates;
}

/**
 * Load a template by name
 */
export async function loadTemplate(
  templateName: string,
  backlogPath?: string
): Promise<TaskTemplate> {
  let filePath: string;

  // Check if it's a custom template
  if (templateName.startsWith('custom:')) {
    if (!backlogPath) {
      throw new Error('Backlog path required for custom templates');
    }
    const name = templateName.replace('custom:', '');
    const userDir = getUserTemplatesDir(backlogPath);
    filePath = path.join(userDir, `task-${name}.md`);
  } else {
    // Built-in template
    const templatesDir = getTemplatesDir();
    filePath = path.join(templatesDir, `task-${templateName}.md`);
  }

  try {
    const content = await fs.readFile(filePath, 'utf-8');
    const parsed = matter(content);

    return {
      name: templateName,
      filePath,
      metadata: parsed.data,
      content: parsed.content.trim(),
    };
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      throw new Error(
        `Template "${templateName}" not found. Use 'backmark task templates' to list available templates.`
      );
    }
    throw error;
  }
}

/**
 * Apply template to task data
 * Merges template metadata with user-provided options
 */
export function applyTemplate(
  template: TaskTemplate,
  userOptions: Record<string, unknown>
): {
  metadata: Record<string, unknown>;
  description: string;
} {
  // Merge template metadata with user options (user options take precedence)
  const metadata = {
    ...template.metadata,
    ...userOptions,
  };

  // Merge labels if both exist
  if (template.metadata.labels && userOptions.labels) {
    const templateLabels = Array.isArray(template.metadata.labels)
      ? template.metadata.labels
      : [template.metadata.labels];
    const userLabels = Array.isArray(userOptions.labels)
      ? userOptions.labels
      : [userOptions.labels];
    metadata.labels = [...new Set([...templateLabels, ...userLabels])];
  }

  return {
    metadata,
    description: template.content,
  };
}

/**
 * Create user templates directory if it doesn't exist
 */
export async function ensureUserTemplatesDir(backlogPath: string): Promise<void> {
  const userDir = getUserTemplatesDir(backlogPath);
  try {
    await fs.mkdir(userDir, { recursive: true });
  } catch (error) {
    // Directory might already exist, that's fine
  }
}
