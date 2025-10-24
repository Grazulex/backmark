import boxen from 'boxen';
import chalk from 'chalk';
import Table from 'cli-table3';
import { format } from 'date-fns';
import ora from 'ora';
import { Backlog } from '../core/backlog.js';
import { colorizePriority, colorizeStatus, icons } from '../utils/colors.js';
import { logger } from '../utils/logger.js';
import {
	StatsCalculator,
	createProgressBar,
	formatNumber,
	formatPercentage,
	type StatsFilter,
} from '../utils/stats.js';

interface OverviewOptions {
	milestone?: string;
	start?: string;
	end?: string;
	compact?: boolean;
	team?: boolean;
}

export async function overviewCommand(options: OverviewOptions) {
	const spinner = ora('Calculating statistics...').start();
	let backlog: Backlog | null = null;

	try {
		backlog = await Backlog.load();

		// Get all tasks (using cache if available - super fast!)
		const tasks = await backlog.getTasks({});

		// Build filter
		const filter: StatsFilter = {};
		if (options.milestone) {
			filter.milestone = options.milestone;
		}
		if (options.start) {
			filter.startDate = new Date(options.start);
		}
		if (options.end) {
			filter.endDate = new Date(options.end);
		}

		// Calculate stats
		const calculator = new StatsCalculator(tasks);
		const stats = calculator.calculate(filter);

		spinner.stop();

		// Display based on mode
		if (options.compact) {
			displayCompact(stats, options);
		} else {
			displayFull(stats, options);
		}
	} catch (error) {
		spinner.fail(chalk.red('Failed to generate overview'));
		logger.error((error as Error).message);
		process.exit(1);
	} finally {
		await backlog?.close();
	}
}

function displayFull(stats: any, options: OverviewOptions) {
	const projectName = options.milestone || 'All Tasks';

	// Header
	console.log(
		boxen(
			chalk.bold.blue(`📋 BACKMARK OVERVIEW\n`) +
				chalk.white(`Project: ${projectName}\n`) +
				chalk.gray(`Generated: ${format(new Date(), 'yyyy-MM-dd HH:mm')}`),
			{
				padding: 1,
				margin: 1,
				borderStyle: 'double',
				borderColor: 'blue',
			},
		),
	);

	// Task Statistics
	displayTaskStatistics(stats.summary);

	// Priority Breakdown
	displayPriorityBreakdown(stats.summary.byPriority);

	// Milestone Progress
	if (stats.milestones.length > 0 && !options.milestone) {
		displayMilestones(stats.milestones);
	}

	// Team Activity
	displayTeam(stats.team, options.team || false);

	// Alerts
	if (hasAlerts(stats.alerts)) {
		displayAlerts(stats.alerts);
	}

	// AI Collaboration
	if (stats.ai.total > 0) {
		displayAI(stats.ai);
	}

	// Velocity
	if (stats.velocity.some((v: any) => v.completed > 0)) {
		displayVelocity(stats.velocity, stats.summary.velocity);
	}

	// Quick actions
	displayQuickActions(stats.alerts);
}

function displayCompact(stats: any, options: OverviewOptions) {
	const projectName = options.milestone || 'All Tasks';

	console.log(chalk.bold.blue(`\n📋 BACKMARK OVERVIEW`) + chalk.gray(` - ${projectName}\n`));

	const { summary, alerts, ai } = stats;

	// Summary line
	console.log(
		chalk.white('Tasks:      ') +
			`${summary.total} total | ` +
			chalk.green(`${summary.byStatus.Done || 0} done (${formatPercentage(summary.completionRate)})`) +
			` | ` +
			chalk.yellow(`${summary.byStatus['In Progress'] || 0} in progress`) +
			` | ` +
			chalk.red(`${summary.byStatus.Blocked || 0} blocked`),
	);

	// Priority
	console.log(
		chalk.white('Priority:   ') +
			`${summary.byPriority.critical || 0} critical | ` +
			`${summary.byPriority.high || 0} high | ` +
			`${summary.byPriority.medium || 0} medium | ` +
			`${summary.byPriority.low || 0} low`,
	);

	// Milestones
	if (stats.milestones.length > 0 && !options.milestone) {
		const milestoneStr = stats.milestones
			.slice(0, 3)
			.map((m: any) => `${m.name} (${formatPercentage(m.percentage)})`)
			.join(' | ');
		console.log(chalk.white('Milestones: ') + milestoneStr);
	}

	// Team
	const teamStr = stats.team
		.slice(0, 4)
		.map((t: any) => {
			const name = t.isAI ? chalk.magenta(t.name) : chalk.white(t.name);
			return `${name} (${t.total})`;
		})
		.join(' | ');
	console.log(chalk.white('Team:       ') + teamStr);

	// Velocity
	console.log(
		chalk.white('Velocity:   ') +
			`${formatNumber(summary.velocity)} tasks/week (avg) | ` +
			`${formatNumber(summary.avgDuration)} days avg duration`,
	);

	// Alerts
	if (hasAlerts(alerts)) {
		const alertParts = [];
		if (alerts.blocked > 0) alertParts.push(chalk.red(`🚫 ${alerts.blocked} blocked`));
		if (alerts.critical > 0) alertParts.push(chalk.red(`🔴 ${alerts.critical} critical`));
		if (alerts.overdue > 0) alertParts.push(chalk.yellow(`⏰ ${alerts.overdue} overdue`));

		if (alertParts.length > 0) {
			console.log(chalk.white('Alerts:     ') + alertParts.join(' | '));
		}
	}

	// AI stats
	if (ai.total > 0) {
		console.log(
			chalk.white('AI Stats:   ') +
				chalk.magenta(`${ai.total} tasks | `) +
				`${formatPercentage((ai.withPlan / ai.total) * 100)} with plan | ` +
				`${formatPercentage((ai.withReview / ai.total) * 100)} with review`,
		);
	}

	console.log();
}

function displayTaskStatistics(summary: any) {
	const lines = [
		'',
		chalk.white(`  Total Tasks:        ${chalk.bold(summary.total)}`),
		'',
		chalk.green(
			`  Completed:          ${summary.byStatus.Done || 0} (${formatPercentage(summary.completionRate)})  ${createProgressBar(summary.completionRate, 25)}`,
		),
		chalk.yellow(
			`  In Progress:        ${summary.byStatus['In Progress'] || 0} (${formatPercentage((summary.byStatus['In Progress'] / summary.total) * 100)})  ${createProgressBar((summary.byStatus['In Progress'] / summary.total) * 100, 25)}`,
		),
		chalk.cyan(
			`  Review:             ${summary.byStatus.Review || 0} (${formatPercentage((summary.byStatus.Review / summary.total) * 100)})  ${createProgressBar((summary.byStatus.Review / summary.total) * 100, 25)}`,
		),
	];

	if (summary.byStatus.Blocked > 0) {
		lines.push(
			chalk.red(
				`  Blocked:            ${summary.byStatus.Blocked} (${formatPercentage((summary.byStatus.Blocked / summary.total) * 100)})  ${createProgressBar((summary.byStatus.Blocked / summary.total) * 100, 25)}`,
			),
		);
	}

	lines.push('');
	lines.push(
		chalk.gray(`  Average Duration:   ${formatNumber(summary.avgDuration)} days`),
		chalk.gray(`  Completion Rate:    ${formatNumber(summary.velocity)} tasks/week`),
		'',
	);

	console.log(
		boxen(lines.join('\n'), {
			title: chalk.bold('📊 TASK STATISTICS'),
			padding: { left: 1, right: 1, top: 0, bottom: 0 },
			borderStyle: 'round',
			borderColor: 'cyan',
		}),
	);
}

function displayPriorityBreakdown(byPriority: any) {
	const total = Object.values(byPriority).reduce((sum: number, val: any) => sum + (val as number), 0) as number;

	const lines = [
		'',
		`  ${chalk.bold.red('Critical:')}   ${byPriority.critical || 0}   ${createProgressBar(((byPriority.critical || 0) / total) * 100, 30)}`,
		`  ${chalk.red('High:')}       ${byPriority.high || 0}   ${createProgressBar(((byPriority.high || 0) / total) * 100, 30)}`,
		`  ${chalk.yellow('Medium:')}     ${byPriority.medium || 0}   ${createProgressBar(((byPriority.medium || 0) / total) * 100, 30)}`,
		`  ${chalk.blue('Low:')}        ${byPriority.low || 0}   ${createProgressBar(((byPriority.low || 0) / total) * 100, 30)}`,
		'',
	];

	console.log(
		boxen(lines.join('\n'), {
			title: chalk.bold('⚡ PRIORITY BREAKDOWN'),
			padding: { left: 1, right: 1, top: 0, bottom: 0 },
			borderStyle: 'round',
			borderColor: 'yellow',
		}),
	);
}

function displayMilestones(milestones: any[]) {
	const filtered = milestones.filter((m) => m.name !== 'No Milestone').slice(0, 5);

	if (filtered.length === 0) return;

	const lines = [''];

	for (const milestone of filtered) {
		const bar = createProgressBar(milestone.percentage, 25);
		lines.push(
			`  ${chalk.yellow(milestone.name.padEnd(15))} ${milestone.completed}/${milestone.total} (${formatPercentage(milestone.percentage)})  ${bar}`,
		);
	}

	lines.push('');

	console.log(
		boxen(lines.join('\n'), {
			title: chalk.bold('🎯 MILESTONE PROGRESS'),
			padding: { left: 1, right: 1, top: 0, bottom: 0 },
			borderStyle: 'round',
			borderColor: 'yellow',
		}),
	);
}

function displayTeam(team: any[], detailed: boolean) {
	const lines = [''];

	const topTeam = team.slice(0, detailed ? 10 : 5);

	for (const member of topTeam) {
		const name = member.isAI ? chalk.magenta(member.name) : chalk.white(member.name);
		const nameStr = `${name}`.padEnd(20);
		const count = `${member.total} tasks`.padEnd(15);
		const bar = createProgressBar((member.total / team[0].total) * 100, 25);

		lines.push(`  ${nameStr} ${count} ${bar}`);
	}

	lines.push('');

	console.log(
		boxen(lines.join('\n'), {
			title: chalk.bold('👥 TEAM ACTIVITY'),
			padding: { left: 1, right: 1, top: 0, bottom: 0 },
			borderStyle: 'round',
			borderColor: 'green',
		}),
	);
}

function displayAlerts(alerts: any) {
	const lines = [''];

	if (alerts.blocked > 0) {
		lines.push(`  ${icons.blocked} Blocked Tasks:        ${chalk.red.bold(alerts.blocked)}`);
	}
	if (alerts.critical > 0) {
		lines.push(`  🔴 Critical Priority:    ${chalk.red.bold(alerts.critical)}`);
	}
	if (alerts.overdue > 0) {
		lines.push(`  ⏰ Overdue:              ${chalk.yellow.bold(alerts.overdue)}`);
	}
	if (alerts.dueThisWeek > 0) {
		lines.push(`  📅 Due This Week:        ${chalk.yellow(alerts.dueThisWeek)}`);
	}
	if (alerts.noCriteria > 0) {
		lines.push(`  📋 No Criteria:          ${chalk.gray(alerts.noCriteria)}`);
	}

	lines.push('');

	console.log(
		boxen(lines.join('\n'), {
			title: chalk.bold('🚨 ATTENTION REQUIRED'),
			padding: { left: 1, right: 1, top: 0, bottom: 0 },
			borderStyle: 'round',
			borderColor: 'red',
		}),
	);
}

function displayAI(ai: any) {
	const lines = [
		'',
		`  AI Tasks:               ${chalk.magenta.bold(ai.total)}`,
		`  With AI Plan:           ${ai.withPlan} (${formatPercentage((ai.withPlan / ai.total) * 100)})`,
		`  With AI Notes:          ${ai.withNotes} (${formatPercentage((ai.withNotes / ai.total) * 100)})`,
		`  With AI Doc:            ${ai.withDoc} (${formatPercentage((ai.withDoc / ai.total) * 100)})`,
		`  With AI Review:         ${ai.withReview} (${formatPercentage((ai.withReview / ai.total) * 100)})`,
		`  AI Completion Rate:     ${formatNumber(ai.completionRate)} tasks/week`,
		'',
	];

	console.log(
		boxen(lines.join('\n'), {
			title: chalk.bold('🤖 AI COLLABORATION'),
			padding: { left: 1, right: 1, top: 0, bottom: 0 },
			borderStyle: 'round',
			borderColor: 'magenta',
		}),
	);
}

function displayVelocity(velocity: any[], avgVelocity: number) {
	const lines = [''];

	// Show last 4 weeks
	const recent = velocity.slice(-4);
	const maxTasks = Math.max(...recent.map((v) => v.completed), 1);

	for (const week of recent) {
		const weekDate = format(new Date(week.week), 'MMM dd');
		const bar = createProgressBar((week.completed / maxTasks) * 100, 20, '█', ' ');
		lines.push(
			`  ${chalk.gray(weekDate)}:  ${bar} ${chalk.white(week.completed)} ${week.completed === recent[recent.length - 1].completed ? chalk.cyan('← Current') : ''}`,
		);
	}

	lines.push('');
	lines.push(`  ${chalk.gray('Average:')} ${chalk.white.bold(formatNumber(avgVelocity))} tasks/week`);
	lines.push('');

	console.log(
		boxen(lines.join('\n'), {
			title: chalk.bold('📈 VELOCITY TRENDS (Last 4 Weeks)'),
			padding: { left: 1, right: 1, top: 0, bottom: 0 },
			borderStyle: 'round',
			borderColor: 'cyan',
		}),
	);
}

function displayQuickActions(alerts: any) {
	const actions = [];

	if (alerts.blocked > 0) {
		actions.push(
			`   ${chalk.cyan('•')} backmark task list --status "Blocked"      ${chalk.gray('→ View blocked tasks')}`,
		);
	}
	if (alerts.critical > 0) {
		actions.push(
			`   ${chalk.cyan('•')} backmark task list --priority critical     ${chalk.gray('→ Critical tasks')}`,
		);
	}
	if (alerts.overdue > 0) {
		actions.push(
			`   ${chalk.cyan('•')} backmark task list --overdue                ${chalk.gray('→ Overdue tasks')}`,
		);
	}

	actions.push(
		`   ${chalk.cyan('•')} backmark board show                        ${chalk.gray('→ Open Kanban board')}`,
	);

	if (actions.length > 0) {
		console.log(chalk.bold.cyan('\n💡 Quick Actions:\n'));
		console.log(actions.join('\n'));
		console.log();
	}
}

function hasAlerts(alerts: any): boolean {
	return (
		alerts.blocked > 0 ||
		alerts.critical > 0 ||
		alerts.overdue > 0 ||
		alerts.dueThisWeek > 0 ||
		alerts.noCriteria > 0
	);
}
