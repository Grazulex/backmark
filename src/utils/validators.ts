import chalk from 'chalk';
import type { Task } from '../types/task.js';
import { icons } from './colors.js';

export interface ValidationResult {
	valid: boolean;
	blocking: BlockingIssue[];
	warnings: Warning[];
	suggestions: Suggestion[];
}

export interface BlockingIssue {
	type: 'subtask' | 'dependency' | 'blocked_by' | 'acceptance_criteria';
	message: string;
	tasks?: Array<{ id: number; title: string; status: string }>;
	criteria?: Array<{ text: string; checked: boolean }>;
}

export interface Warning {
	type:
		| 'missing_ai_review'
		| 'early_close'
		| 'late_close'
		| 'quick_close'
		| 'no_description';
	message: string;
	details?: string;
}

export interface Suggestion {
	type: 'parent_close' | 'unblocked_tasks' | 'milestone_progress';
	message: string;
	tasks?: Array<{ id: number; title: string }>;
	command?: string;
}

export interface ValidationConfig {
	check_subtasks: boolean;
	check_dependencies: boolean;
	check_blocked_by: boolean;
	check_acceptance_criteria: boolean;
	warn_missing_ai_review: boolean;
	warn_early_close: boolean;
	warn_late_close: boolean;
	warn_quick_close: number; // seconds, 0 = disabled
	suggest_parent_close: boolean;
	notify_unblocked: boolean;
	allow_force: boolean;
}

export const DEFAULT_VALIDATION_CONFIG: ValidationConfig = {
	check_subtasks: true,
	check_dependencies: true,
	check_blocked_by: true,
	check_acceptance_criteria: true,
	warn_missing_ai_review: true,
	warn_early_close: true,
	warn_late_close: true,
	warn_quick_close: 300, // 5 minutes
	suggest_parent_close: true,
	notify_unblocked: true,
	allow_force: true,
};

export class TaskValidator {
	constructor(private config: ValidationConfig) {}

	/**
	 * Validate if a task can be closed
	 */
	validateClose(
		task: Task,
		allTasks: Task[],
		force = false,
	): ValidationResult {
		const result: ValidationResult = {
			valid: true,
			blocking: [],
			warnings: [],
			suggestions: [],
		};

		// If force is enabled and allowed, skip blocking validations
		if (force && this.config.allow_force) {
			return result;
		}

		// 1. Check subtasks
		if (this.config.check_subtasks) {
			const subtaskIssues = this.checkSubtasks(task, allTasks);
			if (subtaskIssues) {
				result.blocking.push(subtaskIssues);
				result.valid = false;
			}
		}

		// 2. Check dependencies
		if (this.config.check_dependencies) {
			const depIssues = this.checkDependencies(task, allTasks);
			if (depIssues) {
				result.blocking.push(depIssues);
				result.valid = false;
			}
		}

		// 3. Check blocked_by
		if (this.config.check_blocked_by) {
			const blockedIssues = this.checkBlockedBy(task, allTasks);
			if (blockedIssues) {
				result.blocking.push(blockedIssues);
				result.valid = false;
			}
		}

		// 4. Check acceptance criteria
		if (this.config.check_acceptance_criteria) {
			const criteriaIssues = this.checkAcceptanceCriteria(task);
			if (criteriaIssues) {
				result.blocking.push(criteriaIssues);
				result.valid = false;
			}
		}

		// Warnings (don't block)
		if (!force) {
			// 5. Check AI review
			if (this.config.warn_missing_ai_review) {
				const reviewWarning = this.checkAIReview(task);
				if (reviewWarning) {
					result.warnings.push(reviewWarning);
				}
			}

			// 6. Check dates
			if (this.config.warn_early_close || this.config.warn_late_close) {
				const dateWarning = this.checkDates(task);
				if (dateWarning) {
					result.warnings.push(dateWarning);
				}
			}

			// 7. Check duration
			if (this.config.warn_quick_close > 0) {
				const durationWarning = this.checkDuration(task);
				if (durationWarning) {
					result.warnings.push(durationWarning);
				}
			}
		}

		return result;
	}

	/**
	 * Get suggestions after closing a task
	 */
	getSuggestionsAfterClose(
		task: Task,
		allTasks: Task[],
	): ValidationResult['suggestions'] {
		const suggestions: Suggestion[] = [];

		// 1. Suggest parent close if all siblings are done
		if (this.config.suggest_parent_close && task.parent_task) {
			const parentSuggestion = this.checkParentCompletion(task, allTasks);
			if (parentSuggestion) {
				suggestions.push(parentSuggestion);
			}
		}

		// 2. Notify unblocked tasks
		if (this.config.notify_unblocked) {
			const unblockedSuggestion = this.checkUnblockedTasks(task, allTasks);
			if (unblockedSuggestion) {
				suggestions.push(unblockedSuggestion);
			}
		}

		return suggestions;
	}

	private checkSubtasks(task: Task, allTasks: Task[]): BlockingIssue | null {
		if (!task.subtasks || task.subtasks.length === 0) {
			return null;
		}

		const incompleteTasks = allTasks.filter(
			(t) =>
				task.subtasks?.includes(t.id) &&
				t.status !== 'Done' &&
				t.status !== 'Cancelled',
		);

		if (incompleteTasks.length > 0) {
			return {
				type: 'subtask',
				message: `${incompleteTasks.length} subtask(s) not completed`,
				tasks: incompleteTasks.map((t) => ({
					id: t.id,
					title: t.title,
					status: t.status,
				})),
			};
		}

		return null;
	}

	private checkDependencies(
		task: Task,
		allTasks: Task[],
	): BlockingIssue | null {
		if (!task.dependencies || task.dependencies.length === 0) {
			return null;
		}

		const unresolvedDeps = allTasks.filter(
			(t) =>
				task.dependencies?.includes(t.id) &&
				t.status !== 'Done' &&
				t.status !== 'Cancelled',
		);

		if (unresolvedDeps.length > 0) {
			return {
				type: 'dependency',
				message: `${unresolvedDeps.length} dependenc${unresolvedDeps.length > 1 ? 'ies' : 'y'} not resolved`,
				tasks: unresolvedDeps.map((t) => ({
					id: t.id,
					title: t.title,
					status: t.status,
				})),
			};
		}

		return null;
	}

	private checkBlockedBy(task: Task, allTasks: Task[]): BlockingIssue | null {
		if (!task.blocked_by || task.blocked_by.length === 0) {
			return null;
		}

		const blockingTasks = allTasks.filter(
			(t) =>
				task.blocked_by?.includes(t.id) &&
				t.status !== 'Done' &&
				t.status !== 'Cancelled',
		);

		if (blockingTasks.length > 0) {
			return {
				type: 'blocked_by',
				message: `Task is blocked by ${blockingTasks.length} task(s)`,
				tasks: blockingTasks.map((t) => ({
					id: t.id,
					title: t.title,
					status: t.status,
				})),
			};
		}

		return null;
	}

	private checkAcceptanceCriteria(task: Task): BlockingIssue | null {
		if (!task.acceptance_criteria || task.acceptance_criteria.length === 0) {
			return null;
		}

		const unchecked = task.acceptance_criteria.filter((c) => !c.checked);

		if (unchecked.length > 0) {
			const total = task.acceptance_criteria.length;
			const completed = total - unchecked.length;

			return {
				type: 'acceptance_criteria',
				message: `${unchecked.length} acceptance criteri${unchecked.length > 1 ? 'a' : 'on'} not met (${completed}/${total} completed)`,
				criteria: unchecked,
			};
		}

		return null;
	}

	private checkAIReview(task: Task): Warning | null {
		// Check if task is assigned to AI and has no review
		const aiAssignees = ['claude', 'gpt', 'ai', 'copilot'];
		const hasAIAssignee = task.assignees?.some((a) =>
			aiAssignees.includes(a.toLowerCase()),
		);

		if (hasAIAssignee && !task.ai_review) {
			return {
				type: 'missing_ai_review',
				message: 'No AI review found',
				details: `This task was assigned to AI (${task.assignees?.join(', ')}) but has no ai-review section`,
			};
		}

		return null;
	}

	private checkDates(task: Task): Warning | null {
		const now = new Date();

		// Check early close
		if (this.config.warn_early_close && task.end_date) {
			const endDate = new Date(task.end_date);
			if (now < endDate) {
				const daysEarly = Math.ceil(
					(endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
				);
				return {
					type: 'early_close',
					message: `Task closed ${daysEarly} day(s) before planned end date`,
					details: `End date: ${task.end_date}`,
				};
			}
		}

		// Check late close
		if (this.config.warn_late_close && task.end_date) {
			const endDate = new Date(task.end_date);
			if (now > endDate) {
				const daysLate = Math.ceil(
					(now.getTime() - endDate.getTime()) / (1000 * 60 * 60 * 24),
				);
				return {
					type: 'late_close',
					message: `Task closed ${daysLate} day(s) after planned end date`,
					details: `End date: ${task.end_date}`,
				};
			}
		}

		return null;
	}

	private checkDuration(task: Task): Warning | null {
		if (!task.created_date) {
			return null;
		}

		const created = new Date(task.created_date);
		const now = new Date();
		const durationSeconds = (now.getTime() - created.getTime()) / 1000;

		if (durationSeconds < this.config.warn_quick_close) {
			const minutes = Math.floor(durationSeconds / 60);
			const seconds = Math.floor(durationSeconds % 60);

			return {
				type: 'quick_close',
				message: `Task completed very quickly (${minutes}m ${seconds}s)`,
				details:
					task.priority === 'critical' || task.priority === 'high'
						? `This is a ${task.priority} priority task`
						: undefined,
			};
		}

		return null;
	}

	private checkParentCompletion(
		task: Task,
		allTasks: Task[],
	): Suggestion | null {
		if (!task.parent_task) {
			return null;
		}

		const parent = allTasks.find((t) => t.id === task.parent_task);
		if (!parent || parent.status === 'Done') {
			return null;
		}

		// Check if all siblings are done
		const siblings = allTasks.filter(
			(t) => t.parent_task === task.parent_task && t.id !== task.id,
		);
		const allSiblingsDone = siblings.every(
			(s) => s.status === 'Done' || s.status === 'Cancelled',
		);

		if (allSiblingsDone) {
			return {
				type: 'parent_close',
				message: `All subtasks of #${parent.id} (${parent.title}) are now complete!`,
				command: `backmark task close ${parent.id}`,
			};
		}

		return null;
	}

	private checkUnblockedTasks(
		task: Task,
		allTasks: Task[],
	): Suggestion | null {
		// Find tasks that were blocked by this task
		const unblockedTasks = allTasks.filter(
			(t) =>
				t.blocked_by?.includes(task.id) &&
				t.status !== 'Done' &&
				t.status !== 'Cancelled',
		);

		if (unblockedTasks.length > 0) {
			return {
				type: 'unblocked_tasks',
				message: `${unblockedTasks.length} task(s) unblocked`,
				tasks: unblockedTasks.map((t) => ({ id: t.id, title: t.title })),
			};
		}

		return null;
	}
}

/**
 * Format validation result for display
 */
export function formatValidationResult(
	result: ValidationResult,
	taskId: number,
	taskTitle: string,
): string {
	const lines: string[] = [];

	if (!result.valid) {
		lines.push(
			chalk.red(`✗ Cannot close task #${taskId}: ${chalk.bold(taskTitle)}`),
		);
		lines.push('');

		if (result.blocking.length > 0) {
			lines.push(chalk.bold.red('Blocking issues:'));

			for (const issue of result.blocking) {
				lines.push(`  ${icons.error} ${issue.message}:`);

				if (issue.tasks) {
					for (const t of issue.tasks) {
						lines.push(
							`    - ${chalk.cyan(`#${t.id}`)} ${t.title} ${chalk.gray(`(${t.status})`)}`,
						);
					}
				}

				if (issue.criteria) {
					for (const c of issue.criteria) {
						lines.push(`    ☐ ${c.text}`);
					}
				}

				lines.push('');
			}

			lines.push(chalk.gray('Use --force to close anyway'));
		}
	}

	return lines.join('\n');
}

/**
 * Format warnings for display
 */
export function formatWarnings(warnings: Warning[]): string {
	if (warnings.length === 0) {
		return '';
	}

	const lines: string[] = [];
	lines.push(chalk.yellow(`\n⚠ Warnings:`));

	for (const warning of warnings) {
		lines.push(`  ${icons.warning} ${warning.message}`);
		if (warning.details) {
			lines.push(chalk.gray(`    ${warning.details}`));
		}
	}

	return lines.join('\n');
}

/**
 * Format suggestions for display
 */
export function formatSuggestions(suggestions: Suggestion[]): string {
	if (suggestions.length === 0) {
		return '';
	}

	const lines: string[] = [];
	lines.push(chalk.cyan(`\n💡 Suggestions:`));

	for (const suggestion of suggestions) {
		lines.push(`  ${suggestion.message}`);

		if (suggestion.tasks) {
			for (const t of suggestion.tasks) {
				lines.push(`    - ${chalk.cyan(`#${t.id}`)} ${t.title}`);
			}
		}

		if (suggestion.command) {
			lines.push(chalk.gray(`    Run: ${chalk.cyan(suggestion.command)}`));
		}
	}

	return lines.join('\n');
}
