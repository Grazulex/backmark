import chalk from 'chalk';
import ora from 'ora';
import { Backlog } from '../../core/backlog';
import { listTemplates, loadTemplate } from '../../utils/templates';

/**
 * List all available task templates
 */
export async function listTemplatesCommand() {
  const spinner = ora('Loading templates...').start();

  try {
    // Try to load backlog to get custom templates
    let backlogPath: string | undefined;
    try {
      const backlog = await Backlog.load();
      backlogPath = backlog.getBacklogPath();
      await backlog.close();
    } catch {
      // Backlog not initialized, that's fine - just show built-in templates
    }

    const templates = await listTemplates(backlogPath);

    spinner.succeed(chalk.green(`Found ${templates.length} template(s)`));

    if (templates.length === 0) {
      console.log(chalk.yellow('\nNo templates found.'));
      return;
    }

    console.log(chalk.bold('\n📋 Available Task Templates:\n'));

    // Separate built-in and custom templates
    const builtIn = templates.filter((t) => !t.startsWith('custom:'));
    const custom = templates.filter((t) => t.startsWith('custom:'));

    if (builtIn.length > 0) {
      console.log(chalk.bold.cyan('Built-in Templates:'));
      for (const template of builtIn) {
        const emoji = getTemplateEmoji(template);
        const description = getTemplateDescription(template);
        console.log(`  ${emoji}  ${chalk.cyan(template)} - ${chalk.gray(description)}`);
      }
    }

    if (custom.length > 0) {
      console.log(chalk.bold.magenta('\nCustom Templates:'));
      for (const template of custom) {
        const _name = template.replace('custom:', '');
        console.log(`  ✨  ${chalk.magenta(template)} - ${chalk.gray('User-defined template')}`);
      }
    }

    console.log(chalk.gray('\nUsage:'));
    console.log(
      `  ${chalk.cyan('backmark task create "Task title" --template')} ${chalk.yellow('<name>')}`
    );
    console.log(
      `  ${chalk.cyan('backmark task template show')} ${chalk.yellow('<name>')} ${chalk.gray('# View template content')}`
    );

    if (backlogPath) {
      console.log(chalk.gray('\nCustom templates location:'));
      console.log(`  ${chalk.dim(backlogPath)}/templates/`);
    } else {
      console.log(chalk.gray('\nTip: Initialize a backlog to use custom templates'));
      console.log(`  ${chalk.cyan('backmark init "My Project"')}`);
    }
  } catch (error) {
    spinner.fail(chalk.red('Failed to list templates'));
    console.error((error as Error).message);
    process.exit(1);
  }
}

/**
 * Show the content of a specific template
 */
export async function showTemplateCommand(templateName: string) {
  const spinner = ora(`Loading template '${templateName}'...`).start();

  try {
    // Try to load backlog for custom templates
    let backlogPath: string | undefined;
    try {
      const backlog = await Backlog.load();
      backlogPath = backlog.getBacklogPath();
      await backlog.close();
    } catch {
      // Backlog not initialized, that's fine
    }

    const template = await loadTemplate(templateName, backlogPath);

    spinner.succeed(chalk.green(`Template '${templateName}' loaded`));

    console.log(chalk.bold(`\n📄 Template: ${chalk.cyan(templateName)}\n`));

    // Show metadata
    if (Object.keys(template.metadata).length > 0) {
      console.log(chalk.bold('Metadata:'));
      console.log(chalk.gray('─'.repeat(60)));
      for (const [key, value] of Object.entries(template.metadata)) {
        if (key === 'labels' && Array.isArray(value)) {
          console.log(`  ${chalk.yellow(key)}: ${value.map((l) => chalk.cyan(l)).join(', ')}`);
        } else {
          console.log(`  ${chalk.yellow(key)}: ${chalk.white(String(value))}`);
        }
      }
      console.log();
    }

    // Show content
    console.log(chalk.bold('Content:'));
    console.log(chalk.gray('─'.repeat(60)));
    console.log(template.content);
    console.log(chalk.gray('─'.repeat(60)));

    console.log(chalk.gray('\nUsage:'));
    console.log(`  ${chalk.cyan(`backmark task create "Task title" --template ${templateName}`)}`);
  } catch (error) {
    spinner.fail(chalk.red(`Failed to load template '${templateName}'`));
    console.error(chalk.yellow((error as Error).message));
    process.exit(1);
  }
}

/**
 * Get emoji for built-in templates
 */
function getTemplateEmoji(template: string): string {
  const emojis: Record<string, string> = {
    feature: '✨',
    bugfix: '🐛',
    refactoring: '♻️',
    research: '🔍',
  };
  return emojis[template] || '📝';
}

/**
 * Get description for built-in templates
 */
function getTemplateDescription(template: string): string {
  const descriptions: Record<string, string> = {
    feature: 'New feature development',
    bugfix: 'Bug fix with debugging steps',
    refactoring: 'Code refactoring and improvement',
    research: 'Research and investigation',
  };
  return descriptions[template] || 'Task template';
}
