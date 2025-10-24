import { differenceInDays, differenceInSeconds, startOfWeek, format } from 'date-fns';
import type { Task, TaskPriority, TaskStatus } from '../types/task.js';

export interface OverviewStats {
	summary: {
		total: number;
		byStatus: Record<TaskStatus, number>;
		byPriority: Record<TaskPriority, number>;
		completionRate: number;
		avgDuration: number; // in days
		velocity: number; // tasks per week
	};

	milestones: Array<{
		name: string;
		total: number;
		completed: number;
		percentage: number;
		inProgress: number;
	}>;

	team: Array<{
		name: string;
		total: number;
		completed: number;
		inProgress: number;
		blocked: number;
		isAI: boolean;
	}>;

	alerts: {
		blocked: number;
		critical: number;
		overdue: number;
		dueThisWeek: number;
		noCriteria: number;
	};

	ai: {
		total: number;
		withPlan: number;
		withNotes: number;
		withDoc: number;
		withReview: number;
		completionRate: number;
	};

	velocity: Array<{
		week: string;
		completed: number;
	}>;
}

export interface StatsFilter {
	milestone?: string;
	startDate?: Date;
	endDate?: Date;
}

export class StatsCalculator {
	constructor(private tasks: Task[]) {}

	calculate(filter?: StatsFilter): OverviewStats {
		const filteredTasks = this.filterTasks(filter);

		return {
			summary: this.calculateSummary(filteredTasks),
			milestones: this.calculateMilestones(filteredTasks),
			team: this.calculateTeam(filteredTasks),
			alerts: this.calculateAlerts(filteredTasks),
			ai: this.calculateAI(filteredTasks),
			velocity: this.calculateVelocity(filteredTasks),
		};
	}

	private filterTasks(filter?: StatsFilter): Task[] {
		if (!filter) return this.tasks;

		return this.tasks.filter((task) => {
			if (filter.milestone && task.milestone !== filter.milestone) {
				return false;
			}

			if (filter.startDate || filter.endDate) {
				const taskDate = task.created_date ? new Date(task.created_date) : null;
				if (!taskDate) return false;

				if (filter.startDate && taskDate < filter.startDate) return false;
				if (filter.endDate && taskDate > filter.endDate) return false;
			}

			return true;
		});
	}

	private calculateSummary(tasks: Task[]): OverviewStats['summary'] {
		const total = tasks.length;

		// Count by status
		const byStatus: Record<TaskStatus, number> = {
			'To Do': 0,
			'In Progress': 0,
			Review: 0,
			Done: 0,
			Blocked: 0,
			Cancelled: 0,
		};

		for (const task of tasks) {
			byStatus[task.status] = (byStatus[task.status] || 0) + 1;
		}

		// Count by priority
		const byPriority: Record<TaskPriority, number> = {
			low: 0,
			medium: 0,
			high: 0,
			critical: 0,
		};

		for (const task of tasks) {
			byPriority[task.priority] = (byPriority[task.priority] || 0) + 1;
		}

		// Calculate completion rate
		const completed = byStatus.Done || 0;
		const completionRate = total > 0 ? (completed / total) * 100 : 0;

		// Calculate average duration (for completed tasks)
		const completedTasks = tasks.filter((t) => t.status === 'Done' && t.closed_date);
		let avgDuration = 0;

		if (completedTasks.length > 0) {
			const totalDuration = completedTasks.reduce((sum, task) => {
				if (!task.created_date || !task.closed_date) return sum;
				const start = new Date(task.created_date);
				const end = new Date(task.closed_date);
				return sum + differenceInDays(end, start);
			}, 0);

			avgDuration = totalDuration / completedTasks.length;
		}

		// Calculate velocity (tasks completed per week) - last 4 weeks
		const now = new Date();
		const fourWeeksAgo = new Date(now.getTime() - 28 * 24 * 60 * 60 * 1000);

		const recentlyCompleted = completedTasks.filter((task) => {
			if (!task.closed_date) return false;
			const closedDate = new Date(task.closed_date);
			return closedDate >= fourWeeksAgo && closedDate <= now;
		});

		const velocity = recentlyCompleted.length / 4; // tasks per week

		return {
			total,
			byStatus,
			byPriority,
			completionRate,
			avgDuration,
			velocity,
		};
	}

	private calculateMilestones(tasks: Task[]): OverviewStats['milestones'] {
		const milestoneMap = new Map<
			string,
			{ total: number; completed: number; inProgress: number }
		>();

		for (const task of tasks) {
			const milestone = task.milestone || 'No Milestone';

			if (!milestoneMap.has(milestone)) {
				milestoneMap.set(milestone, { total: 0, completed: 0, inProgress: 0 });
			}

			const stats = milestoneMap.get(milestone)!;
			stats.total++;

			if (task.status === 'Done') {
				stats.completed++;
			} else if (task.status === 'In Progress') {
				stats.inProgress++;
			}
		}

		return Array.from(milestoneMap.entries())
			.map(([name, stats]) => ({
				name,
				total: stats.total,
				completed: stats.completed,
				inProgress: stats.inProgress,
				percentage: stats.total > 0 ? (stats.completed / stats.total) * 100 : 0,
			}))
			.sort((a, b) => b.percentage - a.percentage);
	}

	private calculateTeam(tasks: Task[]): OverviewStats['team'] {
		const teamMap = new Map<
			string,
			{ total: number; completed: number; inProgress: number; blocked: number; isAI: boolean }
		>();

		for (const task of tasks) {
			const assignees = task.assignees.length > 0 ? task.assignees : ['Unassigned'];

			for (const assignee of assignees) {
				if (!teamMap.has(assignee)) {
					const isAI = this.isAIAssignee(assignee);
					teamMap.set(assignee, {
						total: 0,
						completed: 0,
						inProgress: 0,
						blocked: 0,
						isAI,
					});
				}

				const stats = teamMap.get(assignee)!;
				stats.total++;

				if (task.status === 'Done') {
					stats.completed++;
				} else if (task.status === 'In Progress') {
					stats.inProgress++;
				} else if (task.status === 'Blocked') {
					stats.blocked++;
				}
			}
		}

		return Array.from(teamMap.entries())
			.map(([name, stats]) => ({
				name,
				...stats,
			}))
			.sort((a, b) => b.total - a.total);
	}

	private calculateAlerts(tasks: Task[]): OverviewStats['alerts'] {
		const now = new Date();
		const oneWeekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

		return {
			blocked: tasks.filter((t) => t.status === 'Blocked').length,
			critical: tasks.filter((t) => t.priority === 'critical' && t.status !== 'Done').length,
			overdue: tasks.filter((t) => {
				if (!t.end_date || t.status === 'Done') return false;
				return new Date(t.end_date) < now;
			}).length,
			dueThisWeek: tasks.filter((t) => {
				if (!t.end_date || t.status === 'Done') return false;
				const endDate = new Date(t.end_date);
				return endDate >= now && endDate <= oneWeekFromNow;
			}).length,
			noCriteria: tasks.filter(
				(t) =>
					t.status !== 'Done' &&
					(!t.acceptance_criteria || t.acceptance_criteria.length === 0),
			).length,
		};
	}

	private calculateAI(tasks: Task[]): OverviewStats['ai'] {
		const aiTasks = tasks.filter((t) => t.assignees.some((a) => this.isAIAssignee(a)));

		const total = aiTasks.length;
		const withPlan = aiTasks.filter((t) => t.ai_plan && t.ai_plan.trim().length > 0).length;
		const withNotes = aiTasks.filter((t) => t.ai_notes && t.ai_notes.trim().length > 0).length;
		const withDoc = aiTasks.filter(
			(t) => t.ai_documentation && t.ai_documentation.trim().length > 0,
		).length;
		const withReview = aiTasks.filter((t) => t.ai_review && t.ai_review.trim().length > 0).length;

		const completed = aiTasks.filter((t) => t.status === 'Done');

		// Calculate AI velocity (last 4 weeks)
		const now = new Date();
		const fourWeeksAgo = new Date(now.getTime() - 28 * 24 * 60 * 60 * 1000);

		const recentlyCompleted = completed.filter((task) => {
			if (!task.closed_date) return false;
			const closedDate = new Date(task.closed_date);
			return closedDate >= fourWeeksAgo && closedDate <= now;
		});

		const completionRate = recentlyCompleted.length / 4; // per week

		return {
			total,
			withPlan,
			withNotes,
			withDoc,
			withReview,
			completionRate,
		};
	}

	private calculateVelocity(tasks: Task[]): OverviewStats['velocity'] {
		const completedTasks = tasks.filter((t) => t.status === 'Done' && t.closed_date);

		// Group by week
		const weekMap = new Map<string, number>();

		for (const task of completedTasks) {
			if (!task.closed_date) continue;

			const closedDate = new Date(task.closed_date);
			const weekStart = startOfWeek(closedDate, { weekStartsOn: 1 }); // Monday
			const weekKey = format(weekStart, 'yyyy-MM-dd');

			weekMap.set(weekKey, (weekMap.get(weekKey) || 0) + 1);
		}

		// Get last 8 weeks
		const weeks: Array<{ week: string; completed: number }> = [];
		const now = new Date();

		for (let i = 7; i >= 0; i--) {
			const weekDate = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000);
			const weekStart = startOfWeek(weekDate, { weekStartsOn: 1 });
			const weekKey = format(weekStart, 'yyyy-MM-dd');

			weeks.push({
				week: weekKey,
				completed: weekMap.get(weekKey) || 0,
			});
		}

		return weeks;
	}

	private isAIAssignee(assignee: string): boolean {
		const aiNames = ['ai', 'claude', 'gpt', 'copilot', 'assistant'];
		return aiNames.some((name) => assignee.toLowerCase().includes(name));
	}
}

/**
 * Create a progress bar
 */
export function createProgressBar(
	percentage: number,
	width = 20,
	filled = '█',
	empty = '░',
): string {
	const filledWidth = Math.round((percentage / 100) * width);
	const emptyWidth = width - filledWidth;
	return filled.repeat(filledWidth) + empty.repeat(emptyWidth);
}

/**
 * Format percentage
 */
export function formatPercentage(value: number): string {
	return `${Math.round(value)}%`;
}

/**
 * Format number with optional decimal places
 */
export function formatNumber(value: number, decimals = 1): string {
	return value.toFixed(decimals);
}
