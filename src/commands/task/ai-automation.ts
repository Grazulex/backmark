import chalk from 'chalk';
import ora from 'ora';
import { Backlog } from '../../core/backlog';
import type { Task } from '../../types';
import { logger } from '../../utils/logger';

/**
 * AI-Breakdown: Automatically decompose a task into subtasks
 * The AI analyzes the task description and creates logical subtasks
 */
export async function aiBreakdownCommand(taskId: string) {
  const spinner = ora('Analyzing task for breakdown...').start();
  let backlog: Backlog | null = null;

  try {
    backlog = await Backlog.load();
    const id = Number.parseInt(taskId, 10);

    if (Number.isNaN(id)) {
      spinner.fail('Invalid task ID');
      process.exit(1);
    }

    const task = await backlog.getTaskById(id);
    if (!task) {
      spinner.fail(`Task #${id} not found`);
      process.exit(1);
    }

    spinner.text = 'Breaking down task into subtasks...';

    // Analyze task and generate breakdown
    const subtasks = analyzeAndBreakdown(task);

    if (subtasks.length === 0) {
      spinner.info(chalk.yellow('No subtasks needed - task is already atomic'));
      return;
    }

    spinner.text = `Creating ${subtasks.length} subtasks...`;

    const createdSubtasks: Task[] = [];
    for (const subtask of subtasks) {
      const created = await backlog.createTask(
        {
          title: subtask.title,
          description: subtask.description,
          parent_task: id,
          status: 'To Do',
          priority: task.priority,
          milestone: task.milestone,
          assignees: task.assignees,
          labels: [...task.labels, 'auto-generated'],
          dependencies: subtask.dependencies,
        },
        'AI'
      );
      createdSubtasks.push(created);
    }

    spinner.succeed(chalk.green(`✓ Task broken down into ${createdSubtasks.length} subtasks`));

    console.log(chalk.bold.cyan('\n📋 Generated Subtasks:\n'));
    for (const subtask of createdSubtasks) {
      console.log(`  ${chalk.bold(`#${subtask.id}`)} ${subtask.title}`);
      if (subtask.dependencies.length > 0) {
        console.log(
          chalk.gray(`      → Depends on: ${subtask.dependencies.map((d) => `#${d}`).join(', ')}`)
        );
      }
    }

    console.log(chalk.cyan(`\n💡 View hierarchy: ${chalk.white(`backmark task tree ${id}`)}\n`));
  } catch (error) {
    spinner.fail(chalk.red('Failed to breakdown task'));
    logger.error((error as Error).message);
    process.exit(1);
  } finally {
    await backlog?.close();
  }
}

/**
 * AI-Estimate: Estimate task complexity and duration
 */
export async function aiEstimateCommand(taskId: string) {
  const spinner = ora('Analyzing task complexity...').start();
  let backlog: Backlog | null = null;

  try {
    backlog = await Backlog.load();
    const id = Number.parseInt(taskId, 10);

    if (Number.isNaN(id)) {
      spinner.fail('Invalid task ID');
      process.exit(1);
    }

    const task = await backlog.getTaskById(id);
    if (!task) {
      spinner.fail(`Task #${id} not found`);
      process.exit(1);
    }

    spinner.text = 'Estimating complexity and duration...';

    const estimate = analyzeComplexity(task);

    spinner.succeed(chalk.green('✓ Estimation complete'));

    // Display estimation
    console.log(chalk.bold.cyan(`\n📊 Estimation for Task #${id}: "${task.title}"\n`));

    // Complexity
    const complexityColor =
      estimate.complexity === 'Simple'
        ? chalk.green
        : estimate.complexity === 'Moderate'
          ? chalk.yellow
          : estimate.complexity === 'Complex'
            ? chalk.red
            : chalk.magenta;
    console.log(`${chalk.gray('Complexity:')}     ${complexityColor(estimate.complexity)}`);

    // Duration
    console.log(`${chalk.gray('Estimated Time:')} ${chalk.white(estimate.duration)}`);
    console.log(`${chalk.gray('Confidence:')}     ${chalk.white(estimate.confidence)}%`);

    // Breakdown
    if (estimate.breakdown.length > 0) {
      console.log(chalk.bold('\nBreakdown:'));
      for (const item of estimate.breakdown) {
        console.log(`  ${chalk.cyan('•')} ${item}`);
      }
    }

    // Risks
    if (estimate.risks.length > 0) {
      console.log(chalk.bold.yellow('\n⚠️  Risks & Uncertainties:'));
      for (const risk of estimate.risks) {
        console.log(`  ${chalk.yellow('⚠')}  ${risk}`);
      }
    }

    // Suggestions
    console.log(chalk.bold.magenta('\n💡 Suggestions:'));
    console.log(`  ${chalk.gray('Priority:')}   ${estimate.suggestedPriority}`);
    if (estimate.suggestedMilestone) {
      console.log(`  ${chalk.gray('Milestone:')} ${estimate.suggestedMilestone}`);
    }

    // Actions
    if (estimate.actions.length > 0) {
      console.log(chalk.bold('\n📝 Recommended Actions:'));
      for (const action of estimate.actions) {
        console.log(`  ${chalk.cyan('→')} ${action}`);
      }
    }

    console.log(); // Empty line
  } catch (error) {
    spinner.fail(chalk.red('Failed to estimate task'));
    logger.error((error as Error).message);
    process.exit(1);
  } finally {
    await backlog?.close();
  }
}

/**
 * AI-Review-Ready: Check if task is ready for review
 */
export async function aiReviewReadyCommand(taskId: string) {
  const spinner = ora('Checking task readiness...').start();
  let backlog: Backlog | null = null;

  try {
    backlog = await Backlog.load();
    const id = Number.parseInt(taskId, 10);

    if (Number.isNaN(id)) {
      spinner.fail('Invalid task ID');
      process.exit(1);
    }

    const task = await backlog.getTaskById(id);
    if (!task) {
      spinner.fail(`Task #${id} not found`);
      process.exit(1);
    }

    spinner.text = 'Validating task completion...';

    const readiness = await checkReadiness(task, backlog);

    const isReady = readiness.blockers.length === 0;

    if (isReady) {
      spinner.succeed(chalk.green('✅ Task is ready for review!'));
    } else {
      spinner.warn(chalk.yellow('⚠️  Task NOT ready for review'));
    }

    // Display readiness report
    console.log(chalk.bold.cyan(`\n📋 Review Readiness Report for Task #${id}\n`));

    // Status
    if (isReady) {
      console.log(chalk.bold.green('Status: ✅ Ready for Review\n'));
    } else {
      console.log(chalk.bold.yellow('Status: ❌ NOT Ready\n'));
    }

    // Checklist
    console.log(chalk.bold('Checklist:'));
    for (const check of readiness.checklist) {
      const icon = check.passed ? chalk.green('✓') : chalk.red('✗');
      const text = check.passed ? chalk.gray(check.item) : chalk.white(check.item);
      console.log(`  ${icon} ${text}`);
    }

    // Blockers
    if (readiness.blockers.length > 0) {
      console.log(chalk.bold.red('\n🚫 Blocking Issues:'));
      for (const blocker of readiness.blockers) {
        console.log(`  ${chalk.red('✗')} ${blocker}`);
      }
    }

    // Warnings
    if (readiness.warnings.length > 0) {
      console.log(chalk.bold.yellow('\n⚠️  Warnings:'));
      for (const warning of readiness.warnings) {
        console.log(`  ${chalk.yellow('⚠')}  ${warning}`);
      }
    }

    // Recommendations
    if (isReady) {
      console.log(chalk.bold.magenta('\n💡 Recommendations:'));
      console.log(`  ${chalk.cyan('→')} Move to "${chalk.white('Review')}" column`);
      if (readiness.suggestedReviewers.length > 0) {
        console.log(
          `  ${chalk.cyan('→')} Suggested reviewers: ${readiness.suggestedReviewers.join(', ')}`
        );
      }
      console.log(
        `  ${chalk.cyan('→')} Command: ${chalk.white(`backmark task edit ${id} --status Review`)}`
      );
    } else {
      console.log(chalk.bold.magenta('\n📝 Next Steps:'));
      const steps = generateNextSteps(readiness);
      for (let i = 0; i < steps.length; i++) {
        console.log(`  ${chalk.cyan(`${i + 1}.`)} ${steps[i]}`);
      }
    }

    console.log(); // Empty line
  } catch (error) {
    spinner.fail(chalk.red('Failed to check readiness'));
    logger.error((error as Error).message);
    process.exit(1);
  } finally {
    await backlog?.close();
  }
}

// ============================================================================
// Helper Functions
// ============================================================================

interface SubtaskBreakdown {
  title: string;
  description: string;
  dependencies?: number[];
}

/**
 * Analyze task and generate subtask breakdown
 */
function analyzeAndBreakdown(task: Task): SubtaskBreakdown[] {
  const subtasks: SubtaskBreakdown[] = [];

  // Skip if already has subtasks
  if (task.subtasks.length > 0) {
    return [];
  }

  // Analyze description for common patterns
  const description = task.description.toLowerCase();
  const title = task.title.toLowerCase();

  // Pattern 1: Feature implementation
  if (
    title.includes('implement') ||
    title.includes('add') ||
    title.includes('create') ||
    description.includes('implement')
  ) {
    // Check for specific technology/framework patterns
    if (description.includes('api') || description.includes('endpoint')) {
      subtasks.push({
        title: 'Design API endpoints and data models',
        description: 'Define the API contract, request/response schemas, and data models.',
      });
      subtasks.push({
        title: 'Implement backend logic',
        description: 'Create the server-side implementation with business logic and validation.',
        dependencies: [task.id + 1],
      });
      subtasks.push({
        title: 'Add error handling and logging',
        description: 'Implement comprehensive error handling and logging mechanisms.',
        dependencies: [task.id + 2],
      });
      subtasks.push({
        title: 'Write unit and integration tests',
        description: 'Create test suite covering all endpoints and edge cases.',
        dependencies: [task.id + 3],
      });
      subtasks.push({
        title: 'Update API documentation',
        description: 'Document the new endpoints in API docs (OpenAPI/Swagger).',
        dependencies: [task.id + 4],
      });
    } else if (description.includes('ui') || description.includes('component')) {
      subtasks.push({
        title: 'Design component structure and props',
        description: 'Define the component API, props interface, and state management.',
      });
      subtasks.push({
        title: 'Implement component logic',
        description: 'Create the component with business logic and user interactions.',
        dependencies: [task.id + 1],
      });
      subtasks.push({
        title: 'Add styling and responsiveness',
        description: 'Implement CSS/styling and ensure mobile responsiveness.',
        dependencies: [task.id + 2],
      });
      subtasks.push({
        title: 'Write component tests',
        description: 'Create unit tests and visual regression tests.',
        dependencies: [task.id + 3],
      });
      subtasks.push({
        title: 'Update storybook/documentation',
        description: 'Add component examples and usage documentation.',
        dependencies: [task.id + 4],
      });
    } else {
      // Generic implementation
      subtasks.push({
        title: 'Design solution architecture',
        description: 'Define the technical approach and architecture for the implementation.',
      });
      subtasks.push({
        title: 'Implement core functionality',
        description: 'Create the main implementation following the design.',
        dependencies: [task.id + 1],
      });
      subtasks.push({
        title: 'Add tests and validation',
        description: 'Write comprehensive tests and validate the implementation.',
        dependencies: [task.id + 2],
      });
      subtasks.push({
        title: 'Documentation and cleanup',
        description: 'Document the implementation and clean up code.',
        dependencies: [task.id + 3],
      });
    }
  }

  // Pattern 2: Bug fix
  else if (title.includes('fix') || title.includes('bug') || description.includes('bug')) {
    subtasks.push({
      title: 'Reproduce and investigate the bug',
      description: 'Create a reproducible test case and identify the root cause.',
    });
    subtasks.push({
      title: 'Implement the fix',
      description: 'Apply the fix to resolve the root cause.',
      dependencies: [task.id + 1],
    });
    subtasks.push({
      title: 'Add regression tests',
      description: 'Write tests to prevent this bug from recurring.',
      dependencies: [task.id + 2],
    });
    subtasks.push({
      title: 'Verify fix and update documentation',
      description: 'Verify the fix works and update any relevant documentation.',
      dependencies: [task.id + 3],
    });
  }

  // Pattern 3: Refactoring
  else if (
    title.includes('refactor') ||
    title.includes('optimize') ||
    description.includes('refactor')
  ) {
    subtasks.push({
      title: 'Analyze current implementation',
      description: 'Review existing code and identify areas for improvement.',
    });
    subtasks.push({
      title: 'Plan refactoring approach',
      description: 'Design the new structure while maintaining functionality.',
      dependencies: [task.id + 1],
    });
    subtasks.push({
      title: 'Implement refactoring incrementally',
      description: 'Refactor code in small, testable increments.',
      dependencies: [task.id + 2],
    });
    subtasks.push({
      title: 'Verify functionality and performance',
      description: 'Ensure all tests pass and performance is improved.',
      dependencies: [task.id + 3],
    });
  }

  // Pattern 4: Research/Investigation
  else if (
    title.includes('research') ||
    title.includes('investigate') ||
    title.includes('explore')
  ) {
    subtasks.push({
      title: 'Define research scope and questions',
      description: 'Clearly define what needs to be researched and success criteria.',
    });
    subtasks.push({
      title: 'Gather information and evaluate options',
      description: 'Research different approaches, tools, or solutions.',
      dependencies: [task.id + 1],
    });
    subtasks.push({
      title: 'Create proof of concept',
      description: 'Build a small prototype to validate findings.',
      dependencies: [task.id + 2],
    });
    subtasks.push({
      title: 'Document findings and recommendations',
      description: 'Write comprehensive documentation with recommendations.',
      dependencies: [task.id + 3],
    });
  }

  // If task seems simple or atomic, don't break it down
  if (subtasks.length === 0 || task.description.length < 100) {
    return [];
  }

  return subtasks;
}

interface ComplexityEstimate {
  complexity: 'Simple' | 'Moderate' | 'Complex' | 'Very Complex';
  duration: string;
  confidence: number;
  breakdown: string[];
  risks: string[];
  suggestedPriority: 'low' | 'medium' | 'high' | 'critical';
  suggestedMilestone?: string;
  actions: string[];
}

/**
 * Analyze task complexity and provide estimates
 */
function analyzeComplexity(task: Task): ComplexityEstimate {
  let complexityScore = 0;
  const breakdown: string[] = [];
  const risks: string[] = [];
  const actions: string[] = [];

  // Factor 1: Description length and detail
  if (task.description.length > 500) {
    complexityScore += 2;
    breakdown.push('Detailed requirements (2-3 hours)');
  } else if (task.description.length > 200) {
    complexityScore += 1;
    breakdown.push('Moderate requirements (1-2 hours)');
  } else {
    breakdown.push('Simple requirements (30 min - 1 hour)');
  }

  // Factor 2: Number of acceptance criteria
  if (task.acceptance_criteria.length > 5) {
    complexityScore += 2;
    breakdown.push('Many acceptance criteria (3-4 hours)');
  } else if (task.acceptance_criteria.length > 0) {
    complexityScore += 1;
    breakdown.push('Few acceptance criteria (1-2 hours)');
  } else {
    risks.push('No acceptance criteria defined - may lead to scope creep');
    actions.push('Define acceptance criteria before starting');
  }

  // Factor 3: Dependencies
  if (task.dependencies.length > 3) {
    complexityScore += 2;
    breakdown.push('Multiple dependencies (coordination: 2-3 hours)');
    risks.push('Many dependencies may cause delays');
  } else if (task.dependencies.length > 0) {
    complexityScore += 1;
    breakdown.push('Some dependencies (coordination: 1 hour)');
  }

  // Factor 4: Subtasks
  if (task.subtasks.length > 5) {
    complexityScore += 3;
    breakdown.push('Many subtasks (5-8 hours)');
  } else if (task.subtasks.length > 0) {
    complexityScore += 2;
    breakdown.push('Few subtasks (2-4 hours)');
  }

  // Factor 5: Technology keywords in description
  const techKeywords = [
    'api',
    'database',
    'migration',
    'authentication',
    'security',
    'performance',
    'optimization',
    'integration',
    'deployment',
  ];
  const descLower = task.description.toLowerCase();
  const titleLower = task.title.toLowerCase();
  const foundKeywords = techKeywords.filter(
    (kw) => descLower.includes(kw) || titleLower.includes(kw)
  );

  if (foundKeywords.length > 3) {
    complexityScore += 2;
    breakdown.push('Complex technical requirements (4-6 hours)');
  } else if (foundKeywords.length > 0) {
    complexityScore += 1;
    breakdown.push('Technical implementation (2-3 hours)');
  }

  // Check for high-risk keywords
  if (descLower.includes('migration') || descLower.includes('breaking change')) {
    risks.push('Migration or breaking change - requires careful planning');
    complexityScore += 1;
  }
  if (descLower.includes('security') || descLower.includes('authentication')) {
    risks.push('Security-critical - requires extra testing and review');
    complexityScore += 1;
  }
  if (descLower.includes('performance') || descLower.includes('optimization')) {
    risks.push('Performance work - requires benchmarking and profiling');
  }

  // Factor 6: Current status and AI documentation
  if (task.status === 'In Progress' && !task.ai_plan) {
    risks.push('No AI plan documented yet');
    actions.push('Document implementation plan before continuing');
  }

  if (task.status !== 'To Do' && !task.ai_notes) {
    risks.push('No development notes - progress not documented');
    actions.push('Keep detailed notes during implementation');
  }

  // Determine complexity level
  let complexity: ComplexityEstimate['complexity'];
  let duration: string;
  let confidence: number;

  if (complexityScore <= 2) {
    complexity = 'Simple';
    duration = '2-4 hours';
    confidence = 85;
  } else if (complexityScore <= 5) {
    complexity = 'Moderate';
    duration = '1-2 days';
    confidence = 75;
  } else if (complexityScore <= 8) {
    complexity = 'Complex';
    duration = '3-5 days';
    confidence = 65;
  } else {
    complexity = 'Very Complex';
    duration = '1-2 weeks';
    confidence = 50;
    risks.push('Very complex task - consider breaking down into smaller tasks');
    actions.push('Run `backmark task ai-breakdown` to split into subtasks');
  }

  // Add testing time
  breakdown.push('Testing and documentation (1-2 hours)');

  // Suggest priority based on complexity and current priority
  let suggestedPriority: ComplexityEstimate['suggestedPriority'] = task.priority;
  if (complexity === 'Very Complex' && task.priority === 'low') {
    suggestedPriority = 'medium';
    actions.push('Consider increasing priority due to complexity');
  }
  if (risks.length > 2 && task.priority !== 'high') {
    actions.push('Multiple risks identified - consider increasing priority');
  }

  // Suggest milestone if not set
  let suggestedMilestone: string | undefined = task.milestone;
  if (!task.milestone && complexity !== 'Simple') {
    suggestedMilestone = 'Next Sprint';
    actions.push('Assign to a milestone for better tracking');
  }

  return {
    complexity,
    duration,
    confidence,
    breakdown,
    risks,
    suggestedPriority,
    suggestedMilestone,
    actions,
  };
}

interface ReadinessCheck {
  item: string;
  passed: boolean;
}

interface ReadinessReport {
  checklist: ReadinessCheck[];
  blockers: string[];
  warnings: string[];
  suggestedReviewers: string[];
}

/**
 * Check if task is ready for review
 */
async function checkReadiness(task: Task, backlog: Backlog): Promise<ReadinessReport> {
  const checklist: ReadinessCheck[] = [];
  const blockers: string[] = [];
  const warnings: string[] = [];
  const suggestedReviewers: string[] = [];

  // Check 1: All acceptance criteria completed
  const totalCriteria = task.acceptance_criteria.length;
  const completedCriteria = task.acceptance_criteria.filter((c) => c.checked).length;
  const criteriaComplete = totalCriteria === 0 || totalCriteria === completedCriteria;

  checklist.push({
    item: `All acceptance criteria completed (${completedCriteria}/${totalCriteria})`,
    passed: criteriaComplete,
  });

  if (!criteriaComplete) {
    blockers.push(`${totalCriteria - completedCriteria} acceptance criteria still incomplete`);
  }

  // Check 2: All subtasks closed
  const subtasks = await backlog.getSubtasks(task.id);
  const openSubtasks = subtasks.filter((st) => st.status !== 'Done');
  const subtasksComplete = openSubtasks.length === 0;

  checklist.push({
    item: `All subtasks closed (${subtasks.length - openSubtasks.length}/${subtasks.length})`,
    passed: subtasksComplete,
  });

  if (!subtasksComplete) {
    blockers.push(`${openSubtasks.length} subtask(s) still open`);
    for (const st of openSubtasks.slice(0, 3)) {
      blockers.push(`  → Subtask #${st.id}: ${st.title} (${st.status})`);
    }
  }

  // Check 3: No blocking dependencies
  const blockingDeps = await Promise.all(
    task.dependencies.map((depId) => backlog.getTaskById(depId))
  );
  const incompleteDeps = blockingDeps.filter((dep) => dep && dep.status !== 'Done');
  const depsComplete = incompleteDeps.length === 0;

  checklist.push({
    item: `No blocking dependencies (${task.dependencies.length - incompleteDeps.length}/${task.dependencies.length})`,
    passed: depsComplete,
  });

  if (!depsComplete) {
    blockers.push(`${incompleteDeps.length} blocking dependency(ies) not completed`);
    for (const dep of incompleteDeps.slice(0, 3)) {
      if (dep) {
        blockers.push(`  → Task #${dep.id}: ${dep.title} (${dep.status})`);
      }
    }
  }

  // Check 4: Task is not blocked by others
  const notBlocked = task.blocked_by.length === 0;

  checklist.push({
    item: 'Not blocked by other tasks',
    passed: notBlocked,
  });

  if (!notBlocked) {
    warnings.push(`Task is blocking ${task.blocked_by.length} other task(s)`);
  }

  // Check 5: AI documentation present
  const hasAIDoc = !!task.ai_documentation && task.ai_documentation.length > 0;

  checklist.push({
    item: 'AI documentation present',
    passed: hasAIDoc,
  });

  if (!hasAIDoc) {
    warnings.push('No AI documentation - consider adding implementation details');
  }

  // Check 6: AI review completed
  const hasAIReview = !!task.ai_review && task.ai_review.length > 0;

  checklist.push({
    item: 'AI review completed',
    passed: hasAIReview,
  });

  if (!hasAIReview) {
    warnings.push('No AI review - self-review recommended before human review');
  }

  // Check 7: End date set
  const hasEndDate = !!task.end_date;

  checklist.push({
    item: 'End date set',
    passed: hasEndDate,
  });

  if (!hasEndDate) {
    warnings.push('No end date set - consider setting expected completion date');
  }

  // Check 8: Status is appropriate
  const statusOK = task.status === 'In Progress' || task.status === 'Review';

  checklist.push({
    item: 'Status is "In Progress" or "Review"',
    passed: statusOK,
  });

  if (!statusOK) {
    warnings.push(`Current status is "${task.status}" - expected "In Progress" or "Review"`);
  }

  // Suggest reviewers from assignees
  if (task.assignees.length > 0) {
    const nonAI = task.assignees.filter((a) => !a.toLowerCase().includes('ai'));
    if (nonAI.length > 0) {
      suggestedReviewers.push(...nonAI);
    }
  }

  return {
    checklist,
    blockers,
    warnings,
    suggestedReviewers,
  };
}

/**
 * Generate next steps based on readiness report
 */
function generateNextSteps(readiness: ReadinessReport): string[] {
  const steps: string[] = [];

  // Prioritize blockers
  if (readiness.blockers.length > 0) {
    for (const blocker of readiness.blockers.slice(0, 5)) {
      if (!blocker.startsWith('  →')) {
        steps.push(blocker);
      }
    }
  }

  // Add warnings as suggestions
  if (readiness.warnings.length > 0 && steps.length < 5) {
    for (const warning of readiness.warnings.slice(0, 3)) {
      steps.push(warning);
    }
  }

  return steps;
}
