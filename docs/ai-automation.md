# AI Automation Commands

Backmark v0.8.0 introduces powerful AI automation commands that help you manage tasks more intelligently. These commands use pattern recognition and heuristics to analyze tasks and provide actionable insights.

## Overview

The AI automation suite consists of three commands:

1. **`ai-breakdown`** - Automatically decompose complex tasks into manageable subtasks
2. **`ai-estimate`** - Estimate task complexity, duration, and identify risks
3. **`ai-review-ready`** - Validate if a task is ready for human review

These commands are designed to save time, improve task planning, and ensure quality before review.

---

## `backmark task ai-breakdown <id>`

### Purpose

Automatically analyze a task and break it down into logical subtasks with proper dependencies.

### When to Use

- **Complex tasks**: Task description suggests multiple implementation steps
- **Feature development**: New features with frontend, backend, testing components
- **Planning help**: Need guidance on how to structure implementation
- **Team parallelization**: Want to create subtasks that can be assigned to different team members

### How It Works

The command analyzes:
- Task title keywords (implement, add, create, fix, refactor, research)
- Task description content
- Common implementation patterns

Based on the analysis, it generates appropriate subtasks with:
- Logical ordering
- Dependency chains (subtask B depends on subtask A)
- Proper task metadata (inherits priority, milestone, assignees, labels)
- "auto-generated" label for tracking

### Supported Patterns

#### Pattern 1: API/Backend Implementation
Detects: "api", "endpoint", "backend" keywords

Generated subtasks:
1. Design API endpoints and data models
2. Implement backend logic (depends: #1)
3. Add error handling and logging (depends: #2)
4. Write unit and integration tests (depends: #3)
5. Update API documentation (depends: #4)

#### Pattern 2: UI/Component Implementation
Detects: "ui", "component", "frontend" keywords

Generated subtasks:
1. Design component structure and props
2. Implement component logic (depends: #1)
3. Add styling and responsiveness (depends: #2)
4. Write component tests (depends: #3)
5. Update storybook/documentation (depends: #4)

#### Pattern 3: Bug Fix
Detects: "fix", "bug" keywords

Generated subtasks:
1. Reproduce and investigate the bug
2. Implement the fix (depends: #1)
3. Add regression tests (depends: #2)
4. Verify fix and update documentation (depends: #3)

#### Pattern 4: Refactoring
Detects: "refactor", "optimize" keywords

Generated subtasks:
1. Analyze current implementation
2. Plan refactoring approach (depends: #1)
3. Implement refactoring incrementally (depends: #2)
4. Verify functionality and performance (depends: #3)

#### Pattern 5: Research/Investigation
Detects: "research", "investigate", "explore" keywords

Generated subtasks:
1. Define research scope and questions
2. Gather information and evaluate options (depends: #1)
3. Create proof of concept (depends: #2)
4. Document findings and recommendations (depends: #3)

#### Pattern 6: Generic Implementation
Fallback for tasks that don't match specific patterns:

Generated subtasks:
1. Design solution architecture
2. Implement core functionality (depends: #1)
3. Add tests and validation (depends: #2)
4. Documentation and cleanup (depends: #3)

### Smart Skip Logic

The command will NOT create subtasks if:
- Task already has subtasks
- Task description is very short (<100 characters)
- Task seems atomic/simple

In these cases, you'll see:
```
ℹ No subtasks needed - task is already atomic
```

### Example Usage

```bash
# Create a complex task
backmark task create "Implement user authentication system" \
  -d "Add JWT-based authentication with login, register, and password reset functionality. \
      Include security best practices, rate limiting, and comprehensive tests." \
  -p high \
  -m "v1.0"

# Task ID: 1

# Break it down automatically
backmark task ai-breakdown 1

# Output:
# ✓ Task broken down into 5 subtasks
#
# 📋 Generated Subtasks:
#
#   #2 Design API endpoints and data models
#   #3 Implement backend logic
#       → Depends on: #2
#   #4 Add error handling and logging
#       → Depends on: #3
#   #5 Write unit and integration tests
#       → Depends on: #4
#   #6 Update API documentation
#       → Depends on: #5
#
# 💡 View hierarchy: backmark task tree 1
```

### View the Result

```bash
# See the hierarchy
backmark task tree 1

# List all subtasks
backmark task list --parent 1

# View on Kanban board
backmark board show
```

---

## `backmark task ai-estimate <id>`

### Purpose

Get an AI-powered estimation of task complexity, duration, and potential risks.

### When to Use

- **Sprint planning**: Estimate story points or time for tasks
- **Risk assessment**: Identify potential blockers before starting
- **Priority setting**: Get suggestions on task priority based on complexity
- **Resource planning**: Understand time investment needed

### What It Analyzes

#### Complexity Factors

1. **Description length**
   - <200 chars: Simple
   - 200-500 chars: Moderate
   - >500 chars: Complex

2. **Acceptance criteria count**
   - 0: Risk (no criteria defined)
   - 1-5: Normal
   - >5: Complex

3. **Dependencies**
   - 0: No coordination needed
   - 1-3: Some coordination
   - >3: High coordination complexity

4. **Subtasks**
   - 0: Atomic task
   - 1-5: Moderate breakdown
   - >5: Very complex

5. **Technical keywords**
   - API, database, migration, authentication, security, performance, optimization, integration, deployment
   - More keywords = Higher complexity

6. **Risk keywords**
   - "migration", "breaking change" → High risk
   - "security", "authentication" → Extra testing needed
   - "performance", "optimization" → Benchmarking required

### Complexity Levels

| Complexity | Score | Duration | Confidence |
|------------|-------|----------|------------|
| Simple | 0-2 | 2-4 hours | 85% |
| Moderate | 3-5 | 1-2 days | 75% |
| Complex | 6-8 | 3-5 days | 65% |
| Very Complex | 9+ | 1-2 weeks | 50% |

### Output

The estimate provides:

1. **Complexity level** (Simple/Moderate/Complex/Very Complex)
2. **Estimated duration** (hours to weeks range)
3. **Confidence level** (50-85%)
4. **Breakdown** - Time breakdown by work phase
5. **Risks** - Identified risk factors
6. **Suggestions** - Priority and milestone recommendations
7. **Actions** - Recommended next steps

### Example Usage

```bash
backmark task ai-estimate 1

# Output:
# 📊 Estimation for Task #1: "Implement user authentication system"
#
# Complexity:     Complex
# Estimated Time: 3-5 days
# Confidence:     65%
#
# Breakdown:
#   • Detailed requirements (2-3 hours)
#   • Many acceptance criteria (3-4 hours)
#   • Multiple dependencies (coordination: 2-3 hours)
#   • Complex technical requirements (4-6 hours)
#   • Testing and documentation (1-2 hours)
#
# ⚠️  Risks & Uncertainties:
#   ⚠  Security-critical - requires extra testing and review
#   ⚠  Migration or breaking change - requires careful planning
#   ⚠  No AI plan documented yet
#
# 💡 Suggestions:
#   Priority:   high
#   Milestone:  v1.0
#
# 📝 Recommended Actions:
#   → Document implementation plan before continuing
#   → Run `backmark task ai-breakdown` to split into subtasks
#   → Consider increasing priority due to complexity
```

### Using Estimates for Planning

```bash
# Estimate all tasks in a milestone
for id in $(backmark task list --milestone "v1.0" | grep -oP '#\K\d+'); do
  echo "Estimating task #$id..."
  backmark task ai-estimate $id
done

# Estimate tasks before sprint planning
backmark task list --status "To Do" | grep -oP '#\K\d+' | \
  xargs -I {} backmark task ai-estimate {}
```

---

## `backmark task ai-review-ready <id>`

### Purpose

Validate whether a task meets all criteria to be reviewed by a human, with a detailed checklist and actionable feedback.

### When to Use

- **Before closing task**: Ensure nothing is forgotten
- **Before requesting review**: Validate task is complete
- **Quality gate**: Automated pre-review validation
- **Self-check**: Verify your work meets standards

### Validation Checklist

The command checks 8 criteria:

#### 1. ✓ All acceptance criteria completed
- Counts completed vs total criteria
- **Blocks review if incomplete**

#### 2. ✓ All subtasks closed
- Checks if all child tasks have status "Done"
- Lists open subtasks by name
- **Blocks review if incomplete**

#### 3. ✓ No blocking dependencies
- Verifies dependencies have status "Done"
- Lists incomplete dependencies
- **Blocks review if incomplete**

#### 4. ✓ Not blocked by other tasks
- Checks `blocked_by` field
- **Warning only** (doesn't block review)

#### 5. ✓ AI documentation present
- Checks if `ai_documentation` field has content
- **Warning only**

#### 6. ✓ AI review completed
- Checks if `ai_review` field has content
- **Warning only**

#### 7. ✓ End date set
- Checks if `end_date` field is set
- **Warning only**

#### 8. ✓ Status is appropriate
- Expects "In Progress" or "Review"
- **Warning only**

### Output Format

#### Case 1: Task is Ready ✅

```bash
backmark task ai-review-ready 1

# ✅ Task is ready for review!
#
# 📋 Review Readiness Report for Task #1
#
# Status: ✅ Ready for Review
#
# Checklist:
#   ✓ All acceptance criteria completed (3/3)
#   ✓ All subtasks closed (5/5)
#   ✓ No blocking dependencies (0/0)
#   ✓ Not blocked by other tasks
#   ✓ AI documentation present
#   ✓ AI review completed
#   ✓ End date set
#   ✓ Status is "In Progress" or "Review"
#
# 💡 Recommendations:
#   → Move to "Review" column
#   → Suggested reviewers: @alice, @bob
#   → Command: backmark task edit 1 --status Review
```

#### Case 2: Task is NOT Ready ❌

```bash
backmark task ai-review-ready 1

# ⚠️  Task NOT ready for review
#
# 📋 Review Readiness Report for Task #1
#
# Status: ❌ NOT Ready
#
# Checklist:
#   ✗ All acceptance criteria completed (2/3)
#   ✗ All subtasks closed (4/5)
#   ✓ No blocking dependencies (0/0)
#   ✓ Not blocked by other tasks
#   ✗ AI documentation present
#   ✓ AI review completed
#   ✓ End date set
#   ✓ Status is "In Progress" or "Review"
#
# 🚫 Blocking Issues:
#   ✗ 1 acceptance criteria still incomplete
#   ✗ 1 subtask(s) still open
#     → Subtask #5: Update API documentation (In Progress)
#   ✗ No AI documentation field is empty
#
# ⚠️  Warnings:
#   ⚠  Task is blocking 2 other task(s)
#
# 📝 Next Steps:
#   1. Complete subtask #5
#   2. Add documentation in ai_documentation
#   3. Complete remaining acceptance criteria
```

### Integration with Workflow

#### Pre-Commit Hook
```bash
#!/bin/bash
# .git/hooks/pre-commit

# Check if any tasks are marked as Review but not validated
tasks=$(backmark task list --status Review | grep -oP '#\K\d+')
for id in $tasks; do
  if ! backmark task ai-review-ready $id | grep -q "✅"; then
    echo "ERROR: Task #$id marked as Review but validation fails"
    exit 1
  fi
done
```

#### CI/CD Integration
```yaml
# .github/workflows/validate-tasks.yml
name: Validate Tasks
on: [pull_request]
jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: npm install -g @grazulex/backmark
      - name: Check review-ready tasks
        run: |
          backmark task list --status Review | grep -oP '#\K\d+' | \
            xargs -I {} backmark task ai-review-ready {}
```

---

## Workflow Examples

### Example 1: Full AI-Powered Workflow

```bash
# 1. Create complex task
backmark task create "Build REST API for blog system" \
  -d "Implement CRUD operations for posts, comments, and users. Include auth." \
  -p high \
  -m "v2.0"

# Task #10 created

# 2. Estimate complexity
backmark task ai-estimate 10
# → Complexity: Very Complex, 1-2 weeks

# 3. Break down into subtasks
backmark task ai-breakdown 10
# → Creates 5 subtasks (#11-#15)

# 4. View hierarchy
backmark task tree 10

# 5. Work on subtasks...
backmark task edit 11 --status "In Progress"
# ... implement ...
backmark task close 11

# 6. After completing all subtasks, validate
backmark task ai-review-ready 10
# → Shows checklist

# 7. If ready, move to review
backmark task edit 10 --status Review

# 8. Close after human review
backmark task close 10
```

### Example 2: Sprint Planning

```bash
# Get all "To Do" tasks for next sprint
backmark task list --status "To Do" --milestone "Sprint 3"

# Estimate each one
backmark task ai-estimate 20
backmark task ai-estimate 21
backmark task ai-estimate 22

# Break down complex ones
backmark task ai-breakdown 20  # Very Complex → 6 subtasks

# Now you have better sprint planning data!
```

### Example 3: Quality Gate Before Review

```bash
# Developer finishes task
backmark task edit 15 --status "In Progress"

# Before requesting review, validate
backmark task ai-review-ready 15

# Output shows missing AI documentation
# Developer adds it
backmark task ai-doc 15 "$(cat implementation-notes.md)"

# Validate again
backmark task ai-review-ready 15
# ✅ Ready!

# Move to review
backmark task edit 15 --status Review
```

---

## Configuration

AI automation commands work out of the box with no configuration needed. However, you can customize behavior by:

### Custom Patterns (Future Feature)

In a future version, you'll be able to define custom breakdown patterns:

```yaml
# backlog/config.yml
ai_automation:
  breakdown:
    patterns:
      - name: "microservice"
        keywords: ["microservice", "service"]
        subtasks:
          - "Define service contract and API"
          - "Implement core business logic"
          - "Add service tests"
          - "Deploy to staging"
```

### Estimation Weights (Future Feature)

Adjust complexity scoring:

```yaml
ai_automation:
  estimate:
    weights:
      description_length: 1.0
      acceptance_criteria: 2.0
      dependencies: 1.5
      subtasks: 2.5
      technical_keywords: 1.2
```

---

## Tips & Best Practices

### 1. Use Estimates Early
Run `ai-estimate` during task creation to understand scope before committing.

### 2. Break Down "Very Complex" Tasks
If estimate shows "Very Complex" (1-2 weeks), always run `ai-breakdown` to create manageable pieces.

### 3. Validate Before Requesting Review
Make `ai-review-ready` part of your workflow to ensure quality.

### 4. Review Generated Subtasks
AI-generated subtasks are suggestions. Feel free to edit, remove, or add more.

### 5. Combine with Templates
Use task templates AND ai-breakdown together:
```bash
backmark task create "Add payment gateway" --template feature
backmark task ai-breakdown 1
```

### 6. Document After Breakdown
After breaking down a complex task, add a plan to each subtask:
```bash
for id in $(backmark task list --parent 10 | grep -oP '#\K\d+'); do
  backmark task ai-plan $id "Plan for subtask $id"
done
```

### 7. Track Estimation Accuracy
Keep notes on actual vs estimated time to improve future estimates.

---

## Limitations

### Current Limitations

1. **Pattern-based**: Uses predefined patterns, not true AI/ML
2. **English only**: Keywords detection works best with English
3. **Heuristic-based**: Estimates are approximations, not guarantees
4. **No learning**: Doesn't learn from past tasks (yet)

### What AI Automation Does NOT Do

- ❌ Write code for you
- ❌ Execute tests
- ❌ Modify existing subtasks
- ❌ Change task status automatically
- ❌ Assign tasks automatically

### Future Improvements

We're planning to add:
- 🔮 Machine learning-based estimation
- 🔮 Historical data analysis
- 🔮 Custom pattern definitions
- 🔮 LLM integration (optional)
- 🔮 Auto-assignment suggestions
- 🔮 Velocity tracking

---

## Troubleshooting

### Problem: `ai-breakdown` creates too many subtasks

**Solution**: Edit the task description to be more specific and atomic. Remove generic phrases.

### Problem: `ai-estimate` shows very low confidence

**Reason**: Task has insufficient information (short description, no criteria, no dependencies).

**Solution**: Add more details to the task before estimating.

### Problem: `ai-review-ready` says task not ready but all criteria are met

**Check**: Look at the "Warnings" section. These are suggestions, not blockers.

### Problem: Subtasks have wrong dependencies

**Solution**: Manually edit dependencies with:
```bash
backmark task edit <id> --remove-dependency <old_id>
backmark task edit <id> --add-dependency <new_id>
```

---

## FAQs

**Q: Does this use GPT/Claude API?**
A: No, these commands use local heuristics and pattern matching. No external API calls.

**Q: Will it cost money?**
A: No, completely free. All logic runs locally.

**Q: Can I customize the patterns?**
A: Not yet, but it's on the roadmap for v0.9.0.

**Q: What if I disagree with the estimate?**
A: Estimates are suggestions. Use them as a starting point for discussion.

**Q: Can I undo an `ai-breakdown`?**
A: Yes, delete the generated subtasks manually with `rm backlog/task-*.md`.

**Q: Does `ai-review-ready` auto-approve tasks?**
A: No, it only validates criteria. Human review is still required.

---

## Related Documentation

- [AI Workflow Guide](./ai-workflow.md) - Complete AI collaboration patterns
- [Quick Start](./quick-start.md) - Getting started with Backmark
- [Troubleshooting](./troubleshooting.md) - Common issues and solutions

---

**Version**: v0.8.0
**Last Updated**: 2025-10-24
**Status**: Stable
