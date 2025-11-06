import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import boxen from 'boxen';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { dump as stringify } from 'js-yaml';
import ora from 'ora';
import { DEFAULT_CONFIG } from '../types/index.js';
import { icons } from '../utils/colors.js';
import { logger } from '../utils/logger.js';

export async function initCommand(projectName?: string) {
  console.log(chalk.bold.blue(`\n${icons.task} Backmark Initialization\n`));

  const cwd = process.cwd();
  const backlogPath = path.join(cwd, 'backlog');

  // Check if already initialized
  try {
    await fs.access(backlogPath);
    logger.error('Backlog already initialized in this directory');
    logger.info(`Run ${chalk.cyan('backmark task list')} to see your tasks`);
    return;
  } catch {
    // Directory doesn't exist, we can proceed
  }

  // Prompt for project name if not provided
  let finalProjectName = projectName;
  if (!finalProjectName) {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Project name:',
        default: path.basename(cwd),
      },
    ]);
    finalProjectName = answers.name;
  }

  const spinner = ora('Creating backlog structure...').start();

  try {
    // Create directories
    await fs.mkdir(backlogPath, { recursive: true });

    // Create config
    const config = {
      ...DEFAULT_CONFIG,
      project: {
        name: finalProjectName,
        createdAt: new Date().toISOString(),
      },
    };

    const configPath = path.join(backlogPath, 'config.yml');
    await fs.writeFile(configPath, stringify(config), 'utf-8');

    // Create .gitignore if it doesn't exist
    const gitignorePath = path.join(backlogPath, '.gitignore');
    try {
      await fs.access(gitignorePath);
    } catch {
      await fs.writeFile(gitignorePath, '*.log\n.DS_Store\n.cache/\n', 'utf-8');
    }

    spinner.succeed(chalk.green('Backlog initialized successfully!'));

    // Success message
    console.log(
      boxen(
        chalk.bold(`${icons.milestone} Project: ${chalk.cyan(projectName)}\n\n`) +
          chalk.gray('Structure created:\n') +
          chalk.white('  backlog/\n') +
          chalk.white('  └── config.yml\n\n') +
          chalk.bold.yellow('Quick Start:\n') +
          chalk.cyan('  backmark task create "My first task"\n') +
          chalk.cyan('  backmark task list\n') +
          chalk.cyan('  backmark board show\n\n') +
          chalk.bold.magenta(`${icons.ai} AI-Powered Workflow:\n`) +
          chalk.magenta('  backmark task create "Feature X" --assignees "Claude"\n') +
          chalk.magenta('  backmark task ai-plan 1 "Implementation plan..."\n') +
          chalk.magenta('  backmark task view 1 --ai-all\n\n') +
          chalk.bold.cyan(`${icons.ai} MCP Integration:\n`) +
          chalk.cyan('  Add backmark-mcp-server to your MCP settings\n') +
          chalk.cyan('  npx @grazulex/backmark mcp-server'),
        {
          padding: 1,
          margin: 1,
          borderStyle: 'round',
          borderColor: 'green',
        }
      )
    );
  } catch (error) {
    spinner.fail(chalk.red('Failed to initialize backlog'));
    logger.error((error as Error).message);
    process.exit(1);
  }
}
