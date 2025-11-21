# Changelog

All notable changes to Backmark will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.1] - 2025-11-21

### Fixed
- **Board TUI**: Fixed React key duplication warnings when rendering tasks
  - Changed task keys from `task.id` to `${column}-${task.id}-${absoluteIndex}` to ensure uniqueness
  - Prevents warnings: "Encountered two children with the same key"
  - Improves stability when tasks change status during auto-refresh

## [0.8.0] - 2025-10-24

### Added
- **AI Automation Commands** - Intelligent task management assistance
  - `task ai-breakdown <id>` - Automatically decompose complex tasks into logical subtasks
    - Pattern recognition for API, UI, bug fix, refactoring, and research tasks
    - Automatic dependency chain creation
    - Inherits parent metadata (priority, milestone, assignees, labels)
    - Smart skip logic for atomic tasks
  - `task ai-estimate <id>` - Estimate task complexity and duration
    - Analyzes description, criteria, dependencies, subtasks, and keywords
    - Provides complexity level (Simple/Moderate/Complex/Very Complex)
    - Estimates duration with confidence percentage
    - Identifies risk factors and blockers
    - Suggests priority and milestone assignments
    - Recommends next actions
  - `task ai-review-ready <id>` - Validate task readiness for review
    - 8-point validation checklist
    - Checks criteria, subtasks, dependencies, documentation
    - Provides detailed blocking issues and warnings
    - Suggests reviewers from assignees
    - Offers actionable next steps

### Improved
- Enhanced AI workflow documentation with AI automation guidance
  - Added guidance on when to use ai-breakdown, ai-estimate, ai-review-ready
  - Integrated automation commands into Before/After Implementation sections
  - Updated best practices with smart task breakdown patterns
- Expanded README.md with comprehensive AI Automation section
  - Detailed command descriptions with examples
  - Use cases and workflow patterns
  - Sample outputs for each command

### Documentation
- **New**: Complete AI Automation guide (`docs/ai-automation.md`)
  - In-depth explanation of each automation command
  - Pattern detection details and breakdown strategies
  - Complexity scoring algorithm documentation
  - Validation checklist reference
  - Workflow examples and integration patterns
  - Configuration options (future features)
  - Tips, best practices, and troubleshooting
  - FAQs and limitations documentation

### Technical
- New module: `src/commands/task/ai-automation.ts`
  - Pattern-based task analysis
  - Heuristic complexity estimation
  - Validation logic for review readiness
- No external API dependencies - all logic runs locally
- Zero-cost automation (no API calls, no subscriptions)

## [0.7.0-alpha.0] - 2025-10-24

### Added
- **AI Task Templates** - Pre-configured templates for common task types
  - `feature` template - New feature development with structured AI plan sections
  - `bugfix` template - Bug fixes with debugging checklist and root cause analysis
  - `refactoring` template - Code improvements with quality metrics and patterns
  - `research` template - Investigation tasks with comparison matrix and findings
  - Custom template support in `backlog/templates/` directory
  - Template metadata (status, priority, labels) automatically applied to tasks
- **New Commands**
  - `task templates` - List all available templates (built-in and custom)
  - `task template show <name>` - View template content and metadata
  - `task create --template <name>` - Create task from template
- **Template Features**
  - Built-in templates included in npm package
  - User can create custom templates with YAML frontmatter
  - Templates referenced as `custom:<name>` for user templates
  - Template options can be overridden at creation time
  - Automatic label merging between template and user options

### Improved
- Enhanced `applyTemplate()` function to properly filter undefined/null values
- Template metadata merging preserves template defaults when user options are null/undefined
- Better error messages for missing templates with helpful suggestions

### Documentation
- Updated AI workflow documentation with template usage and examples
- Added comprehensive "Pattern 0: Using Task Templates" to AI Workflow Guide
- Updated Quick Start guide with template section and examples
- Enhanced README with complete template reference and examples
- Added template tips and best practices across all documentation

### Testing
- Added comprehensive test suite for templates (`tests/unit/templates.test.ts`)
- 17 new tests covering template loading, applying, and merging
- Tests for built-in templates, error handling, and metadata merging
- All tests passing with full coverage of template functionality

### Technical
- New `src/utils/templates.ts` module for template management
- Template discovery supports both built-in and user directories
- Gray-matter for parsing template frontmatter
- Path resolution works in both development and production builds

## [0.6.2] - 2025-10-24

### Added
- Comprehensive error messages with helpful suggestions and examples
- New error helper module (`src/utils/errors.ts`) for consistent error formatting
- Enhanced `--help` output with usage examples and documentation links
- Better `--version` output with environment information (Node.js, platform, architecture)

### Improved
- Error messages now include:
  - Clear descriptions of what went wrong
  - Helpful suggestions for resolution
  - Example commands demonstrating correct usage
- CLI help output now shows practical examples for common commands
- Documentation links prominently displayed in help output

### Documentation
- Created comprehensive Quick Start guide (`docs/quick-start.md`)
- Created detailed AI Workflow guide (`docs/ai-workflow.md`) with patterns and examples
- Created Troubleshooting guide (`docs/troubleshooting.md`) with FAQs
- Updated README with v0.6.x achievements

### Technical
- Improved error handling in core Backlog class
- Better validation error messages in command files
- Consistent error formatting across all commands

## [0.6.1] - 2025-10-23

### Added
- Comprehensive test suite with 80%+ coverage for critical modules
- Unit tests for FileSystemRepository (100% coverage)
- Unit tests for LokiIndexedRepository (95%+ coverage)
- Unit tests for logger utility (100% coverage)
- Enhanced integration tests for Backlog with AI features, hierarchy, and dependencies

### Improved
- Test coverage from 27% to 80%+ for functions
- Branch coverage increased to 81%+
- All critical modules now thoroughly tested

### Fixed
- Various edge cases discovered through testing
- Improved error handling in repository layer

## [0.6.0] - 2025-10-20

### Added
- **LokiJS Indexing** for fast queries on large task collections (1000+ tasks)
- **Performance Configuration** in `config.yml`
  - `useIndex: true` - Enable/disable LokiJS indexing
  - `rebuildIndexOnStart: false` - Control index rebuilding
- **Task Validation System** for closing tasks
  - Checks for open subtasks
  - Checks for blocking dependencies
  - Validates acceptance criteria completion
  - Warns about missing AI reviews
- **Acceptance Criteria** management
  - `task check add <id> <text>` - Add criteria
  - `task check done <id> <index>` - Mark as complete
  - `task check undone <id> <index>` - Mark as incomplete
  - `task check list <id>` - View all criteria
- **Task Hierarchy & Dependencies**
  - `task tree <id>` - View task hierarchy
  - `task deps <id>` - View dependencies
  - `task blocked` - List blocked tasks
- **AI Workflow Commands**
  - `task ai-plan <id> <content>` - Add implementation plan
  - `task ai-note <id> <content>` - Add timestamped notes
  - `task ai-doc <id> <content>` - Add documentation
  - `task ai-review <id> <content>` - Add self-review
  - `task view <id> --ai-all` - View all AI sections
- **Enhanced Overview Command**
  - Project statistics and visualizations
  - Milestone tracking
  - Team activity breakdown
  - Priority distribution
  - Attention-required warnings
- **Kanban Board** (Interactive TUI)
  - Real-time board visualization with blessed
  - Keyboard navigation
  - Task status columns
  - `board show` - Interactive board
  - `board export` - Static Markdown export
- **Fuzzy Search**
  - Search across title, description, labels, AI content
  - Combined filters (status, priority, assignee, milestone)
  - Configurable relevance threshold

### Changed
- Migrated from file-based storage to dual repository system
  - FileSystemRepository - Direct Markdown file operations
  - LokiIndexedRepository - In-memory indexed queries
- Improved task metadata structure
- Enhanced changelog tracking with automatic timestamping
- Better date handling (manual vs automatic dates)

### Performance
- 10x faster queries on large task collections with LokiJS
- Materialized path indexing for hierarchy queries
- Incremental sync for file system changes
- Optional index rebuilding on startup

## [0.5.3] - 2025-10-15

### Fixed
- Critical bug in task file parsing
- Issue with task ID generation

## [0.5.0] - 2025-10-10

### Added
- Initial public release
- Basic task CRUD operations
- Status and priority management
- Markdown file storage
- Simple task listing and viewing
- Basic CLI interface

### Features
- Create, edit, and delete tasks
- Task metadata (title, description, status, priority)
- Assignees and labels
- Changelog tracking
- Basic filtering

---

## Release Notes

### v0.6.x Series - Foundation & Polish
The v0.6.x series establishes Backmark as a solid, production-ready task management system designed for AI-powered vibe coding workflows. Key achievements:

- **Comprehensive AI Workflow Support**: Four dedicated AI sections (plan, notes, documentation, review) with specialized commands
- **Performance at Scale**: LokiJS indexing enables efficient handling of 1000+ tasks
- **Robust Testing**: 80%+ test coverage for critical modules ensures reliability
- **Rich Documentation**: Complete guides for Quick Start, AI workflows, and troubleshooting
- **Professional UX**: Enhanced CLI with helpful error messages, examples, and beautiful formatting
- **Advanced Features**: Dependencies, hierarchies, acceptance criteria, validation system

### What's Next?
See the [Roadmap](README.md#️-roadmap) for upcoming features in v0.7.0 and beyond.

---

## Upgrade Notes

### Upgrading to v0.6.0+

**Configuration Migration**
If you have an existing `backlog/config.yml`, Backmark will automatically add new settings:

```yaml
performance:
  useIndex: true
  rebuildIndexOnStart: false

validations:
  close:
    check_subtasks: true
    check_dependencies: true
    check_blocked_by: true
    check_acceptance_criteria: true
    warn_missing_ai_review: true
```

No manual migration is required - Backmark handles this automatically on first run.

**LokiJS Index**
The first time you use v0.6.0+, Backmark will create an index file: `backlog/.backmark-index.db`

This file is automatically regenerated and should be added to `.gitignore` (done automatically during `init`).

---

## Breaking Changes

None in v0.6.x series. Backmark maintains backward compatibility with v0.5.x task files.

---

## Links

- [npm package](https://www.npmjs.com/package/@grazulex/backmark)
- [GitHub Repository](https://github.com/Grazulex/backmark)
- [Issues](https://github.com/Grazulex/backmark/issues)
- [Discussions](https://github.com/Grazulex/backmark/discussions)
