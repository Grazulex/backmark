import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import boxen from 'boxen';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { dump as stringify } from 'js-yaml';
import ora from 'ora';
import { DEFAULT_CONFIG } from '../types/index.js';
import { icons } from '../utils/colors.js';
import { logger } from '../utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function installClaudeAgent(projectPath: string): Promise<boolean> {
  const spinner = ora('Installing Backmark agent for Claude Code...').start();

  try {
    // Find the source files (in the installed package)
    // Go up from dist/commands/init.js to package root
    const packageRoot = path.resolve(__dirname, '..', '..');
    const sourceAgentFile = path.join(packageRoot, '.claude', 'agents', 'backmark-agent.md');
    const sourceSettingsFile = path.join(packageRoot, '.claude', 'settings.local.json');

    // Check if source files exist
    try {
      await fs.access(sourceAgentFile);
    } catch {
      spinner.fail(chalk.red('Agent file not found in package'));
      logger.info(chalk.gray(`Expected location: ${sourceAgentFile}`));
      return false;
    }

    // Create .claude/agents directory in the project
    const claudeDir = path.join(projectPath, '.claude');
    const agentsDir = path.join(claudeDir, 'agents');
    await fs.mkdir(agentsDir, { recursive: true });

    // Target files in project
    const targetAgentFile = path.join(agentsDir, 'backmark-agent.md');
    const targetSettingsFile = path.join(claudeDir, 'settings.local.json');

    // Check if agent already exists
    try {
      await fs.access(targetAgentFile);
      const { overwrite } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'overwrite',
          message: 'Backmark agent already exists in this project. Overwrite?',
          default: false,
        },
      ]);

      if (!overwrite) {
        spinner.info(chalk.yellow('Agent installation skipped'));
        return false;
      }
    } catch {
      // File doesn't exist, we can proceed
    }

    // Copy the agent file
    const agentContent = await fs.readFile(sourceAgentFile, 'utf-8');
    await fs.writeFile(targetAgentFile, agentContent, 'utf-8');

    // Copy the settings file if it exists
    try {
      await fs.access(sourceSettingsFile);
      const settingsContent = await fs.readFile(sourceSettingsFile, 'utf-8');
      await fs.writeFile(targetSettingsFile, settingsContent, 'utf-8');
    } catch {
      // Settings file doesn't exist in package, skip
    }

    spinner.succeed(chalk.green('Backmark agent installed successfully!'));
    logger.info(chalk.gray(`Location: ${targetAgentFile}`));
    logger.info(chalk.cyan('\nYou can now use the backmark-manager agent with Claude Code!'));
    logger.info(chalk.gray('Use /agent backmark-manager to activate it in your project'));

    return true;
  } catch (error) {
    spinner.fail(chalk.red('Failed to install agent'));
    logger.error((error as Error).message);
    return false;
  }
}

interface InitOptions {
  installAgent?: boolean;
}

export async function initCommand(projectName?: string, options?: InitOptions) {
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
          chalk.magenta('  backmark task view 1 --ai-all'),
        {
          padding: 1,
          margin: 1,
          borderStyle: 'round',
          borderColor: 'green',
        }
      )
    );

    // Handle agent installation
    let shouldInstallAgent = options?.installAgent;

    // If option not provided, ask user
    if (shouldInstallAgent === undefined) {
      console.log();
      const { installAgent } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'installAgent',
          message: 'Install Backmark agent for Claude Code?',
          default: true,
        },
      ]);
      shouldInstallAgent = installAgent;
    }

    if (shouldInstallAgent) {
      console.log();
      await installClaudeAgent(cwd);
    }
  } catch (error) {
    spinner.fail(chalk.red('Failed to initialize backlog'));
    logger.error((error as Error).message);
    process.exit(1);
  }
}
