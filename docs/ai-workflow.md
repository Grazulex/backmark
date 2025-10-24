# 🤖 AI Workflow Guide

**The definitive guide to human-AI collaboration with Backmark**

Backmark is built for **vibe coding** - a collaborative workflow where humans and AI work together seamlessly. This guide teaches you patterns, best practices, and advanced techniques for maximizing AI productivity.

---

## 📖 Table of Contents

1. [Philosophy](#-philosophy)
2. [The Four AI Spaces](#-the-four-ai-spaces)
3. [Workflow Patterns](#-workflow-patterns)
4. [Complete Session Examples](#-complete-session-examples)
5. [Best Practices](#-best-practices)
6. [Advanced Techniques](#-advanced-techniques)
7. [Common Pitfalls](#-common-pitfalls)
8. [Integration with Claude Code](#-integration-with-claude-code)

---

## 🎯 Philosophy

### What is Vibe Coding?

**Vibe coding** is a workflow where:
- 🧑 **Human** defines the goal, validates results, makes strategic decisions
- 🤖 **AI** implements, documents, tests, and tracks its own work
- 🔄 **Backmark** provides the shared workspace and memory

### Core Principles

1. **AI as a Partner, Not a Tool**
   - The AI is not just executing commands
   - It plans, documents decisions, and reviews its own work
   - It maintains context across sessions

2. **Explicit is Better than Implicit**
   - Every decision is documented in `ai_plan`
   - Every problem encountered is logged in `ai_notes`
   - Every implementation is explained in `ai_documentation`
   - Every result is reviewed in `ai_review`

3. **Async-First Collaboration**
   - Human and AI don't need to work simultaneously
   - Task state is always clear and resumable
   - Complete history enables context recovery

4. **Trust but Verify**
   - AI provides self-review and test results
   - Human validates critical decisions
   - Both parties learn from mistakes

---

## 📝 The Four AI Spaces

Backmark provides **four dedicated spaces** for AI to document its work:

### 1. 🎯 AI Plan (`ai_plan`)

**Purpose**: Where the AI designs the implementation approach

**When to use**:
- Before starting implementation
- After requirements change
- When blocked and need to pivot

**What to include**:
```markdown
## Implementation Plan

### Analysis
- What we're building
- Why this approach
- Key decisions and trade-offs

### Architecture
- Components to create/modify
- Data flow
- Integration points

### Steps
1. Detailed implementation steps
2. In logical order
3. With time estimates

### Dependencies
- Libraries to install
- External APIs needed
- Other tasks to complete first

### Testing Strategy
- Unit tests needed
- Integration tests
- Manual testing steps

### Risks & Mitigation
- What could go wrong
- How to handle it
```

**Example**:
```markdown
## Implementation Plan for JWT Authentication

### Analysis
Implementing JWT-based authentication for API endpoints.
Chose JWT over sessions because:
- Stateless (scales horizontally)
- Standard (many libraries available)
- Portable (works with mobile apps)

### Architecture
```
┌─────────┐      ┌──────────────┐      ┌──────────┐
│ Client  │─────▶│ Auth Middleware├────▶│ Protected│
└─────────┘      │ (verify JWT)   │     │ Routes   │
                 └──────────────┘      └──────────┘
                         │
                         ▼
                  ┌─────────────┐
                  │ User Model  │
                  │ (bcrypt pwd)│
                  └─────────────┘
```

### Steps
1. Install dependencies (2h)
   - `npm install jsonwebtoken bcryptjs`
   - `npm install --save-dev @types/jsonwebtoken @types/bcryptjs`

2. Create User model (3h)
   - Add password hashing with bcrypt
   - Add password verification method
   - Create database migration

3. Implement auth routes (4h)
   - POST /auth/register
   - POST /auth/login
   - POST /auth/logout (optional - clear client token)

4. Create authentication middleware (2h)
   - Verify JWT token
   - Attach user to request
   - Handle expired tokens

5. Protect routes (1h)
   - Add middleware to protected routes
   - Test with valid/invalid tokens

6. Write tests (3h)
   - Unit tests for password hashing
   - Integration tests for auth flow
   - Test invalid credentials
   - Test expired tokens

### Dependencies
- jsonwebtoken ^9.0.0
- bcryptjs ^2.4.3
- Database must be set up (Task #7)

### Testing Strategy
- Unit: Password hashing/verification
- Integration: Full auth flow (register → login → access protected route)
- Manual: Test with Postman/curl
- Security: Test common attacks (SQL injection, weak passwords)

### Risks & Mitigation
- **Risk**: Passwords stored in plain text if migration fails
  - **Mitigation**: Test migration thoroughly, use transactions
- **Risk**: JWT secret leaked
  - **Mitigation**: Use environment variables, never commit to git
- **Risk**: Token doesn't expire
  - **Mitigation**: Set reasonable expiry (24h), implement refresh tokens later
```

---

### 2. 📓 AI Notes (`ai_notes`)

**Purpose**: Real-time log of decisions, problems, and solutions during implementation

**When to use**:
- Throughout implementation
- When encountering problems
- When making important decisions
- When deviating from the plan

**Format**: Timestamped entries (automatic)

**What to include**:
- Progress updates
- Problems encountered and how solved
- Important decisions made
- Deviations from original plan
- Performance notes
- Security considerations

**Example**:
```markdown
**2025-01-20 14:30** - Starting implementation. Installing dependencies.

**2025-01-20 14:35** - Installed jsonwebtoken and bcryptjs. All dependencies resolved.

**2025-01-20 15:00** - Created User model with password hashing. Decision: Using bcrypt rounds=10 (good balance between security and performance).

**2025-01-20 15:30** - Problem: TypeScript complaining about bcrypt types. Solution: Installed @types/bcryptjs.

**2025-01-20 16:00** - Implemented register endpoint. Added input validation with Zod schema:
- Email must be valid format
- Password minimum 8 characters
- Password must contain uppercase, lowercase, number

**2025-01-20 16:45** - Implemented login endpoint. Returns JWT token valid for 24h. Token includes: userId, email, role.

**2025-01-20 17:00** - Problem: Should we include refresh tokens? Decision: Not in this iteration. Added to backlog as Task #45 for v2.0.

**2025-01-20 17:30** - Created authentication middleware. Tests passing (8/8).

**2025-01-20 18:00** - Protected /api/profile route with auth middleware. Tested with valid/invalid tokens - working correctly.

**2025-01-20 18:30** - Security note: JWT secret is now in environment variable JWT_SECRET. Added to .env.example.

**2025-01-20 19:00** - All tests passing (15/15). Coverage: 92%.
```

---

### 3. 📚 AI Documentation (`ai_documentation`)

**Purpose**: End-user and developer documentation for what was built

**When to use**:
- After implementation is complete
- When creating reusable components
- When the implementation is complex

**What to include**:
- What was built
- How to use it
- API documentation
- Configuration options
- Examples
- Architecture diagrams
- Security considerations

**Example**:
```markdown
# JWT Authentication Implementation

## Overview

Implemented JWT-based authentication for the API. Users can register, login, and access protected routes using bearer tokens.

## API Endpoints

### POST /api/auth/register

Register a new user.

**Request**:
```json
{
  "email": "user@example.com",
  "password": "SecurePass123",
  "name": "John Doe"
}
```

**Response** (201 Created):
```json
{
  "user": {
    "id": "123",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Errors**:
- 400: Invalid email format
- 400: Password too weak
- 409: Email already exists

---

### POST /api/auth/login

Login with existing credentials.

**Request**:
```json
{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

**Response** (200 OK):
```json
{
  "user": {
    "id": "123",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Errors**:
- 401: Invalid credentials
- 404: User not found

---

### Protected Routes

To access protected routes, include the JWT token in the Authorization header:

```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     https://api.example.com/api/profile
```

## Usage Examples

### JavaScript/TypeScript

```typescript
// Register
const response = await fetch('/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'SecurePass123',
    name: 'John Doe'
  })
});
const { token } = await response.json();

// Store token
localStorage.setItem('token', token);

// Access protected route
const profile = await fetch('/api/profile', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

## Configuration

Set these environment variables:

```bash
# .env
JWT_SECRET=your-256-bit-secret-here
JWT_EXPIRY=24h
BCRYPT_ROUNDS=10
```

**Security Note**: Never commit JWT_SECRET to version control!

## Architecture

```
Authentication Flow:
1. User submits credentials
2. Server validates credentials
3. Server generates JWT with user info
4. Client stores JWT
5. Client includes JWT in subsequent requests
6. Middleware verifies JWT and attaches user to request

Token Structure:
{
  "userId": "123",
  "email": "user@example.com",
  "role": "user",
  "iat": 1642684800,  // Issued at
  "exp": 1642771200   // Expires at
}
```

## Security Considerations

1. **Password Storage**: Passwords hashed with bcrypt (10 rounds)
2. **Token Expiry**: Tokens expire after 24 hours
3. **HTTPS Only**: In production, always use HTTPS
4. **Rate Limiting**: Consider adding rate limiting to auth endpoints
5. **Input Validation**: All inputs validated with Zod schemas

## Files Created/Modified

- `src/models/User.ts` - User model with password hashing
- `src/routes/auth.ts` - Authentication routes
- `src/middleware/authenticate.ts` - JWT verification middleware
- `src/utils/jwt.ts` - JWT signing/verification utilities
- `tests/integration/auth.test.ts` - Authentication tests

## Future Improvements

- Add refresh tokens for longer sessions
- Add password reset functionality
- Add email verification
- Add OAuth2 providers (Google, GitHub)
- Add two-factor authentication
```

---

### 4. ✅ AI Review (`ai_review`)

**Purpose**: Self-assessment of work quality before human review

**When to use**:
- Before marking task as "Done"
- Before requesting human review
- When encountering blockers

**What to include**:
```markdown
## Self-Review Checklist

### ✅ Completed
- What was accomplished
- Tests and their results
- Documentation status

### 🧪 Testing
- What was tested
- Test coverage percentage
- Known test gaps

### ⚠️ Concerns
- Edge cases not covered
- Performance considerations
- Security vulnerabilities
- Technical debt introduced

### 💡 Improvements
- What could be better
- Future refactoring opportunities
- Alternative approaches considered

### ❓ Questions for Human
- Decisions that need validation
- Trade-offs to discuss
- Next priorities
```

**Example**:
```markdown
## Self-Review: JWT Authentication Implementation

### ✅ Completed

**Core Functionality**:
- ✅ User registration with password hashing
- ✅ User login with JWT token generation
- ✅ Authentication middleware for protected routes
- ✅ Input validation on all endpoints
- ✅ Error handling with appropriate status codes

**Tests**:
- ✅ 15 tests written, all passing
- ✅ Unit tests for password hashing (3 tests)
- ✅ Integration tests for auth flow (12 tests)
- ✅ Tests for error cases (invalid credentials, weak passwords, etc.)

**Documentation**:
- ✅ API endpoints documented
- ✅ Usage examples provided
- ✅ Configuration documented
- ✅ Security considerations outlined

### 🧪 Testing

**Test Results**:
```
✓ Unit Tests                           3/3
✓ Integration Tests                   12/12
✓ Total                              15/15

Coverage:
  Statements   : 92% (115/125)
  Branches     : 88% (22/25)
  Functions    : 95% (19/20)
  Lines        : 92% (115/125)
```

**What Was Tested**:
- Password hashing and verification
- Registration with valid/invalid inputs
- Login with correct/incorrect credentials
- Token generation and expiry
- Protected route access with valid/invalid/expired tokens
- Error responses

**Test Gaps**:
- Concurrent login attempts (race conditions)
- Token refresh (not implemented yet)
- Email verification flow (not implemented)

### ⚠️ Concerns

**Security**:
- ⚠️ No rate limiting on auth endpoints (vulnerable to brute force)
  - **Recommendation**: Add express-rate-limit middleware
- ⚠️ Tokens don't invalidate on logout (remain valid until expiry)
  - **Recommendation**: Implement token blacklist or use short-lived tokens + refresh

**Performance**:
- ⚠️ Bcrypt hashing is CPU-intensive
  - **Current**: 10 rounds (takes ~100ms per hash)
  - **Impact**: Acceptable for now, but could slow down under high load
  - **Mitigation**: Consider moving to async hashing in worker threads if needed

**Edge Cases**:
- ⚠️ No handling for deleted users with valid tokens
  - **Impact**: Deleted user could still access API until token expires
  - **Fix**: Add user existence check in middleware

### 💡 Improvements

**Short-term** (next sprint):
1. Add rate limiting to prevent brute force attacks
2. Implement token blacklist for logout
3. Add user existence check in authentication middleware

**Medium-term** (next milestone):
1. Add refresh token mechanism for better UX
2. Implement password reset via email
3. Add email verification on registration

**Long-term** (future versions):
1. OAuth2 integration (Google, GitHub)
2. Two-factor authentication
3. Session management dashboard

**Code Quality**:
- Consider extracting validation schemas to separate file
- Could improve error messages to be more user-friendly
- Auth middleware could be split into smaller functions

### 🎯 Acceptance Criteria Review

Original criteria from task:
- ✅ Users can register with email/password
- ✅ Passwords are hashed with bcrypt
- ✅ JWT tokens are generated on login
- ✅ Tokens expire after 24 hours
- ✅ Protected routes require valid token
- ⚠️ Rate limiting on auth endpoints (NOT DONE - added as concern)

**5/6 criteria met** (83%)

### ❓ Questions for Human

1. **Rate Limiting**: Should we add it in this PR or create a follow-up task?
   - Adds ~1 hour of work
   - Important for security
   - My recommendation: Add now while context is fresh

2. **Token Expiry**: 24 hours good, or should we adjust?
   - Current: 24h
   - Alternative: Shorter expiry (1h) + refresh tokens
   - Trade-off: Security vs UX

3. **Password Requirements**: Current requirements are:
   - Min 8 characters, uppercase, lowercase, number
   - Should we also require special characters?
   - Should we check against common passwords list?

4. **Next Priority**: What should I work on next?
   - Option A: Fix the rate limiting concern
   - Option B: Move to next task (#45)
   - Option C: Write more comprehensive tests

### 📊 Metrics

**Time Spent**:
- Planning: 1.5 hours
- Implementation: 4.5 hours
- Testing: 2 hours
- Documentation: 1 hour
- **Total**: 9 hours (estimated: 10 hours) ✅

**Lines of Code**:
- Production: +387 lines
- Tests: +245 lines
- Ratio: 0.63 (good test coverage)

**Files Modified**: 8
**Files Created**: 4
**Dependencies Added**: 2 (jsonwebtoken, bcryptjs)

---

### 🏁 Conclusion

Implementation is **production-ready with minor concerns**. Core functionality works well, tests are comprehensive, and documentation is complete. Main concern is lack of rate limiting, which should be addressed before deploying to production.

**Recommendation**: Add rate limiting (1h), then mark as Done.
```

---

## 🔄 Workflow Patterns

### Pattern 0: Using Task Templates (NEW in v0.7.0)

**Use for**: Quickly creating well-structured tasks for common scenarios

Task templates provide pre-filled task structures with best practices baked in. They're especially useful for AI agents to maintain consistency across tasks.

**Available Templates**:

1. **feature** - New feature development
2. **bugfix** - Bug fixes with debugging workflow
3. **refactoring** - Code improvements with quality metrics
4. **research** - Investigation and technology evaluation

**Basic Usage**:

```bash
# List available templates
backmark task templates

# View template content
backmark task template show feature

# Create task from template
backmark task create "Add user authentication" --template feature \
  -p high \
  -a "Claude" \
  -m "v1.0"
```

**What Templates Provide**:

- ✅ Pre-structured description with sections for planning
- ✅ Default metadata (status, priority, labels)
- ✅ AI-friendly structure (objectives, plan sections, testing checklist)
- ✅ Best practices guidance
- ✅ Consistent format across the team

**Template Workflow Example**:

```bash
# 1. Human creates task from template
backmark task create "Implement payment processing" \
  --template feature \
  -p critical \
  -a "Claude" \
  -l "backend,payment,stripe" \
  -m "v2.0"

# The template provides structure like:
# - 📝 Description: {to be filled}
# - 🎯 Objectives: (checklist of goals)
# - 🤖 AI Plan: (section for implementation plan)
# - 🧪 Testing Strategy: (testing checklist)
# - ⚠️ Risks & Considerations: (potential issues)

# 2. AI fills in the template sections
backmark task view 75  # AI reads the structured template

backmark task ai-plan 75 "$(cat <<'EOF'
## Implementation Plan

Following the template structure:

### Phase 1: Stripe Setup
- Install stripe SDK
- Configure API keys in environment
- Create payment intent endpoint

### Phase 2: Frontend Integration
[... detailed plan based on template structure ...]
EOF
)"

# 3. Continue with standard workflow
# The template provides guardrails and reminders throughout
```

**Custom Templates**:

You can create your own templates for your specific workflows:

```bash
# 1. Create template file in backlog/templates/
mkdir -p backlog/templates
cat > backlog/templates/api-endpoint.md << 'EOF'
---
status: To Do
priority: medium
labels:
  - api
  - backend
---

# API Endpoint Development

## 📝 Endpoint Specification
- **Method**: {GET/POST/PUT/DELETE}
- **Path**: /api/{endpoint}
- **Auth**: {Required/Public}

## 🎯 Request/Response
### Request
```json
{
  "field": "type"
}
```

### Response
```json
{
  "data": {}
}
```

## 🤖 Implementation Plan
- [ ] Create route handler
- [ ] Add input validation (Zod schema)
- [ ] Implement business logic
- [ ] Add error handling
- [ ] Write tests
- [ ] Update API documentation

## 🧪 Testing Checklist
- [ ] Valid input
- [ ] Invalid input (400)
- [ ] Unauthorized (401)
- [ ] Edge cases
EOF

# 2. Use your custom template
backmark task create "Add /api/users endpoint" --template custom:api-endpoint
```

**When to Use Templates**:

✅ **Use templates for**:
- Common, repeatable task types
- Onboarding new team members (AI or human)
- Ensuring best practices are followed
- Maintaining consistency across tasks
- Quick task creation with good structure

❌ **Don't use templates for**:
- Highly unique, one-off tasks
- When you need a completely custom structure
- Very simple tasks that don't need structure

**Tips for AI Agents**:

When using templates, remember to:
1. Read the template structure first
2. Fill in all sections marked with `{placeholders}`
3. Use the provided checklists as your acceptance criteria
4. Follow the suggested implementation phases
5. Update sections as you work (don't leave template text)

---

### Pattern 1: The Standard Flow

**Use for**: Most features and bug fixes

```bash
# 1. Human creates task with requirements
backmark task create "Add user profile page" \
  --description "Users should be able to view and edit their profile" \
  --assignees "Claude" \
  --labels "feature,frontend" \
  --priority high

# 2. AI reviews task and creates plan
backmark task ai-plan 15 "$(cat <<'EOF'
## Implementation Plan

### Components to Create
- ProfilePage.tsx (main component)
- ProfileForm.tsx (edit form)
- useProfile.ts (data fetching hook)

### Steps
1. Create profile page component with view mode
2. Add edit mode with form
3. Connect to API endpoint (already exists)
4. Add validation
5. Add tests
6. Update routing

### Estimated Time: 4-5 hours
EOF
)"

# 3. Human validates plan
backmark task view 15 --ai-plan
# Human: "Looks good, proceed!"

# 4. AI starts work, updates status
backmark task edit 15 --status "In Progress"

# 5. AI logs progress as it works
backmark task ai-note 15 "Created ProfilePage component with basic layout"
backmark task ai-note 15 "Problem: API returns 404. Fixed: endpoint was /api/user not /api/profile"
backmark task ai-note 15 "Added form validation with yup schema"
backmark task ai-note 15 "All tests passing (12/12)"

# 6. AI documents the implementation
backmark task ai-doc 15 "$(cat profile-docs.md)"

# 7. AI does self-review
backmark task ai-review 15 "$(cat <<'EOF'
## Self-Review

### ✅ Completed
- Profile view and edit modes working
- Form validation complete
- Tests: 12/12 passing
- Coverage: 89%

### ⚠️ Concerns
- No image upload yet (out of scope for this task)
- Could add loading states

### 💡 Next Steps
- Add profile picture upload (new task)
EOF
)"

# 8. AI marks as ready for review
backmark task edit 15 --status "Review"

# 9. Human reviews
backmark task view 15 --ai-all
# Human tests the feature
# Human: "Looks great! One small change: add a cancel button"

# 10. AI makes adjustment
backmark task ai-note 15 "Added cancel button as requested. Resets form to original values."

# 11. Human approves
backmark task edit 15 --status "Done"

# 12. Task complete! 🎉
backmark task view 15
```

---

### Pattern 2: The Breakdown Flow

**Use for**: Large, complex tasks that need decomposition

```bash
# 1. Human creates high-level task
backmark task create "Build complete authentication system" \
  --description "Registration, login, password reset, email verification" \
  --assignees "Claude" \
  --priority high \
  --milestone "v1.0"

# 2. AI analyzes and proposes breakdown
backmark task ai-plan 20 "$(cat <<'EOF'
## Analysis

This is a large task. I propose breaking it into 5 subtasks:

1. Core JWT authentication (login/register) - 8h
2. Password reset via email - 4h
3. Email verification - 3h
4. OAuth providers (Google, GitHub) - 6h
5. Two-factor authentication - 5h

Total: ~26 hours

### Recommendation
Start with #1 (core auth), validate with production users, then proceed with #2-5 based on priority.

### Dependencies
- Need email service (Sendgrid/Mailgun) for #2, #3
- Need OAuth apps setup for #4
- Need TOTP library for #5
EOF
)"

# 3. Human reviews and approves
backmark task view 20 --ai-plan
# Human: "Approved! Create the subtasks, start with #1"

# 4. AI creates subtasks
backmark task create "Core JWT authentication" \
  --parent 20 \
  --assignees "Claude" \
  --description "Login and register with JWT tokens"

backmark task create "Password reset via email" \
  --parent 20 \
  --assignees "Claude" \
  --depends-on "21"

backmark task create "Email verification" \
  --parent 20 \
  --assignees "Claude" \
  --depends-on "21"

# ... etc

# 5. AI works through subtasks one by one
# (Using Standard Flow for each)

# 6. When all subtasks done, parent task auto-completes
backmark task view 20  # Shows: 5/5 subtasks complete
```

---

### Pattern 3: The Research Flow

**Use for**: Exploration, proof of concepts, technology evaluation

```bash
# 1. Human creates research task
backmark task create "Research state management solutions for React" \
  --description "Compare Redux, Zustand, Jotai. Recommend one." \
  --assignees "Claude" \
  --labels "research,architecture"

# 2. AI documents research plan
backmark task ai-plan 25 "$(cat <<'EOF'
## Research Plan

### Goals
- Compare 3 state management libraries
- Evaluate based on: bundle size, DX, performance, learning curve
- Create small POC with each
- Make recommendation

### Approach
1. Read documentation for each
2. Build same simple todo app with each
3. Measure bundle size and performance
4. Compare code quality and maintainability
5. Document findings

### Deliverables
- Comparison matrix
- 3 POC repos
- Recommendation with reasoning
EOF
)"

# 3. AI conducts research, logs findings
backmark task ai-note 25 "Redux: 47kb bundle, steep learning curve, most mature ecosystem"
backmark task ai-note 25 "Zustand: 3kb bundle (!), simple API, growing adoption"
backmark task ai-note 25 "Jotai: 5kb bundle, atomic state, good TypeScript support"
backmark task ai-note 25 "Built POC with Redux - lots of boilerplate"
backmark task ai-note 25 "Built POC with Zustand - much simpler, less code"
backmark task ai-note 25 "Built POC with Jotai - interesting atomic approach"

# 4. AI creates comprehensive comparison
backmark task ai-doc 25 "$(cat research-findings.md)"

# 5. AI makes recommendation with reasoning
backmark task ai-review 25 "$(cat <<'EOF'
## Recommendation: Zustand

### Rationale
- **Size**: 3kb vs 47kb (Redux) - matters for performance
- **Simplicity**: Minimal boilerplate, easy to learn
- **DX**: Excellent TypeScript support
- **Performance**: No context, no providers needed
- **Adoption**: Growing rapidly, good community

### Trade-offs
- Less mature than Redux (but stable)
- Smaller ecosystem (but we don't need many extras)
- No time-travel debugging (not needed for our use case)

### Implementation Recommendation
Start with Zustand for new features. If we need advanced features later (time-travel, redux-devtools), we can reconsider.

### Next Steps
1. Add Zustand to dependencies
2. Create initial store structure
3. Migrate current useState to Zustand gradually
EOF
)"

# 6. Human reviews and makes decision
backmark task view 25 --ai-all
# Human: "Great research! Let's go with Zustand."
backmark task edit 25 --status "Done"

# 7. Create implementation task based on research
backmark task create "Implement Zustand for state management" \
  --assignees "Claude" \
  --depends-on "25" \
  --labels "implementation"
```

---

### Pattern 4: The Debug Flow

**Use for**: Bug fixes and troubleshooting

```bash
# 1. Human reports bug
backmark task create "Fix: Users can't login after password reset" \
  --description "Steps to reproduce: Reset password, try to login, get 401 error" \
  --assignees "Claude" \
  --labels "bug,critical" \
  --priority critical

# 2. AI investigates and documents findings
backmark task ai-plan 30 "$(cat <<'EOF'
## Investigation Plan

### Steps
1. Reproduce the bug locally
2. Check logs for errors
3. Debug password reset flow
4. Debug login flow after reset
5. Identify root cause
6. Implement fix
7. Add regression test

### Hypothesis
Possible causes:
- Password hash not updating in database
- Old token not invalidated
- Cache issue
EOF
)"

# 3. AI debugs, logs findings
backmark task ai-note 30 "Reproduced bug locally ✓"
backmark task ai-note 30 "Found error in logs: 'Password hash mismatch'"
backmark task ai-note 30 "ROOT CAUSE: Password reset sets new password but doesn't invalidate existing sessions"
backmark task ai-note 30 "When user resets password, old JWT tokens remain valid and override new password"

# 4. AI implements fix
backmark task ai-note 30 "Fix implemented: Invalidate all user tokens on password reset"
backmark task ai-note 30 "Added token version field to User model"
backmark task ai-note 30 "Increment token version on password change"
backmark task ai-note 30 "Middleware now checks token version"

# 5. AI tests the fix
backmark task ai-note 30 "Manual test: Reset password → login with new password ✓"
backmark task ai-note 30 "Manual test: Old token now returns 401 ✓"
backmark task ai-note 30 "Added regression test to prevent future occurrence"

# 6. AI documents the fix
backmark task ai-doc 30 "$(cat <<'EOF'
## Bug Fix: Password Reset Login Issue

### Root Cause
When users reset their password, the new password was stored but existing JWT tokens remained valid. This caused confusion as the authentication middleware would accept the old token and reject the new password.

### Solution
Implemented token versioning:
1. Added `tokenVersion` field to User model
2. Increment `tokenVersion` on password reset
3. Include `tokenVersion` in JWT payload
4. Middleware validates token version matches user's current version

### Files Modified
- `src/models/User.ts` - Added tokenVersion field
- `src/routes/auth.ts` - Increment version on reset
- `src/middleware/authenticate.ts` - Validate token version
- `src/utils/jwt.ts` - Include version in token payload

### Testing
- Added regression test: tests/auth/password-reset.test.ts
- Manually verified with different scenarios
EOF
)"

# 7. AI reviews fix
backmark task ai-review 30 "$(cat <<'EOF'
## Fix Review

### ✅ Completed
- Root cause identified and fixed
- Regression test added
- Manual testing successful
- Documentation complete

### 🧪 Testing
- Unit test: Token version validation
- Integration test: Full password reset flow
- Manual test: Verified old tokens are invalidated

### ⚠️ Impact
- **Breaking**: Existing tokens will be invalidated on first password change
- **Migration**: Need to add tokenVersion to existing users (default: 1)
- **Deploy**: Requires database migration

### 💡 Additional Improvements
- Could add "logout all devices" feature using same mechanism
- Could track active sessions and show in user dashboard
EOF
)"

# 8. Human approves
backmark task edit 30 --status "Done"
```

---

### Pattern 5: The Refactoring Flow

**Use for**: Code improvements without changing functionality

```bash
# 1. Human or AI identifies technical debt
backmark task create "Refactor authentication middleware" \
  --description "Current auth middleware is 300 lines, hard to test, multiple responsibilities" \
  --assignees "Claude" \
  --labels "refactor,tech-debt" \
  --priority medium

# 2. AI analyzes current code
backmark task ai-plan 35 "$(cat <<'EOF'
## Refactoring Plan

### Current Issues
- Single file with 300 lines
- Mixing concerns: parsing, validation, user loading
- Hard to test (too many dependencies)
- Duplicated error handling

### Proposed Structure
```
src/middleware/auth/
├── index.ts           # Main middleware export
├── parseToken.ts      # Extract JWT from header
├── verifyToken.ts     # Validate JWT signature
├── loadUser.ts        # Load user from database
└── errors.ts          # Centralized error handling
```

### Refactoring Steps
1. Extract token parsing logic
2. Extract token verification logic
3. Extract user loading logic
4. Extract error handling
5. Update tests to test each piece separately
6. Verify no functionality changed (run all tests)

### Safety
- All existing tests must pass
- Add new unit tests for each extracted function
- Keep old file until verified, then delete

### Time Estimate: 3-4 hours
EOF
)"

# 3. AI refactors, tests continuously
backmark task ai-note 35 "Extracted parseToken - tests passing (12/12)"
backmark task ai-note 35 "Extracted verifyToken - tests passing (15/15)"
backmark task ai-note 35 "Extracted loadUser - tests passing (18/18)"
backmark task ai-note 35 "Extracted error handling - tests passing (21/21)"
backmark task ai-note 35 "Integration tests still passing (all 45 tests)"
backmark task ai-note 35 "Code is now modular and easier to test"

# 4. AI documents changes
backmark task ai-doc 35 "$(cat <<'EOF'
## Refactoring Summary

### Before
- 1 file: 300 lines
- Mixed responsibilities
- Hard to test
- Duplicated code

### After
- 5 files: avg 60 lines each
- Single Responsibility Principle
- Easy to test (each function isolated)
- DRY (no duplication)

### Benefits
- **Testability**: Each function can be tested independently
- **Maintainability**: Changes are isolated
- **Readability**: Each file has clear purpose
- **Reusability**: Functions can be used elsewhere

### No Functionality Changed
- All 45 existing tests passing
- Added 12 new unit tests
- Coverage increased from 85% to 94%
EOF
)"

# 5. AI reviews
backmark task ai-review 35 "$(cat <<'EOF'
## Refactoring Review

### ✅ Completed
- Code refactored into logical modules
- All tests passing (45 integration + 12 new unit)
- Coverage improved (85% → 94%)
- No functionality changed

### 💡 Further Improvements
- Could extract JWT configuration to separate file
- Could add caching for user loading
- Could add metrics/logging

### ❓ Next Steps
Should we:
A) Merge this refactoring now
B) Add the additional improvements
C) Do additional improvements in separate task

My recommendation: A (merge now, additional improvements in separate tasks to keep changes small and reviewable)
EOF
)"

# 6. Human approves
backmark task edit 35 --status "Done"
```

---

## 📚 Complete Session Examples

### Example 1: Feature Development Session (2-3 hours)

**Goal**: Add "Mark as favorite" feature to blog posts

```bash
# === MORNING: Human creates task ===

$ backmark task create "Add favorite posts feature" \
    --description "Users should be able to mark posts as favorites and view them on a separate page" \
    --assignees "Claude" \
    --labels "feature,frontend" \
    --priority high \
    --milestone "v2.1"

✓ Task #42 created

# Human reviews task details
$ backmark task view 42

# === AI STARTS WORK ===

# 1. AI reads task, creates plan
$ backmark task ai-plan 42 "$(cat <<'EOF'
## Implementation Plan

### Components Needed
1. FavoriteButton component (star icon, toggle state)
2. FavoritesPage (list of favorited posts)
3. useFavorites hook (API interaction)
4. API endpoints:
   - POST /api/posts/:id/favorite
   - DELETE /api/posts/:id/favorite
   - GET /api/favorites

### Database Changes
- Add favorites table: (user_id, post_id, created_at)
- Add index on (user_id, post_id) for fast lookups

### Steps (Total: 2.5 hours)
1. Database migration (30min)
2. API endpoints (45min)
3. FavoriteButton component (30min)
4. FavoritesPage (30min)
5. Testing (45min)

### Design Decisions
- Use star icon (⭐) for favorite button
- Show count of favorites on each post
- Favorites page uses same PostCard component
- Real-time update (optimistic UI)
EOF
)"

$ backmark task edit 42 --status "In Progress"

# 2. AI implements, logs progress
$ backmark task ai-note 42 "Created database migration for favorites table"

$ backmark task ai-note 42 "Implemented API endpoints. Decision: Using POST/DELETE instead of PUT for REST semantics"

$ backmark task ai-note 42 "FavoriteButton component complete. Used optimistic updates for instant feedback"

$ backmark task ai-note 42 "Problem encountered: Race condition when rapidly clicking favorite button. Solution: Debounced the API call (300ms)"

$ backmark task ai-note 42 "FavoritesPage complete. Reused PostCard component as planned"

$ backmark task ai-note 42 "All tests passing (18/18). Coverage: 91%"

# 3. AI creates documentation
$ backmark task ai-doc 42 "$(cat <<'EOF'
# Favorites Feature

## Usage

### As a User
1. Click the star icon on any post to favorite it
2. View all your favorites at `/favorites`
3. Click the star again to remove from favorites

### As a Developer

**FavoriteButton Component**:
```tsx
import { FavoriteButton } from '@/components/FavoriteButton';

<FavoriteButton postId={post.id} initialFavorited={post.isFavorited} />
```

**useFavorites Hook**:
```tsx
const { favorites, toggleFavorite, isLoading } = useFavorites();

const handleFavorite = async (postId: string) => {
  await toggleFavorite(postId);
};
```

## API Endpoints

- `POST /api/posts/:id/favorite` - Add to favorites
- `DELETE /api/posts/:id/favorite` - Remove from favorites
- `GET /api/favorites` - Get user's favorited posts

## Database Schema

```sql
CREATE TABLE favorites (
  user_id UUID REFERENCES users(id),
  post_id UUID REFERENCES posts(id),
  created_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (user_id, post_id)
);
CREATE INDEX idx_favorites_user ON favorites(user_id);
```

## Files Modified
- `components/FavoriteButton.tsx` (new)
- `pages/favorites.tsx` (new)
- `hooks/useFavorites.ts` (new)
- `pages/api/posts/[id]/favorite.ts` (new)
- `pages/api/favorites.ts` (new)
- `migrations/20250120_add_favorites.sql` (new)
EOF
)"

# 4. AI does self-review
$ backmark task ai-review 42 "$(cat <<'EOF'
## Self-Review

### ✅ Completed
- Favorite button with star icon
- Favorites page showing all favorited posts
- API endpoints working correctly
- Optimistic UI updates
- Database migration successful
- Tests: 18/18 passing, 91% coverage

### 🧪 Testing
- Unit tests for useFavorites hook
- Integration tests for API endpoints
- Component tests for FavoriteButton
- Manual testing: Favorited multiple posts, viewed favorites page

### ⚠️ Potential Improvements
- Could add favorite count to post cards
- Could add "Remove" button on favorites page for bulk actions
- Could add favorite animation (star fill animation)
- Could add notification when post is added to favorites

### 💡 Metrics
- Time spent: 2.5 hours (as estimated)
- Lines of code: +287 production, +156 tests
- Bundle size impact: +3.2kb (acceptable)

### ❓ Questions
1. Should we add a favorite count to each post?
2. Want to add bulk remove on favorites page?

Both are quick additions (30min each) if desired.
EOF
)"

$ backmark task edit 42 --status "Review"

# === HUMAN REVIEWS ===

$ backmark task view 42 --ai-all

# Human tests feature, provides feedback
# "Great work! Add the favorite count to posts. Skip bulk remove for now."

# === AI MAKES ADJUSTMENT ===

$ backmark task ai-note 42 "Adding favorite count to PostCard component as requested"
$ backmark task ai-note 42 "Favorite count added. Shows '⭐ 5' if favorited by 5+ users"
$ backmark task edit 42 --status "Done"

# === SESSION COMPLETE ===
$ backmark task view 42

# Outcome: Feature complete in 3 hours (including feedback iteration)
```

---

### Example 2: Bug Investigation Session (1 hour)

**Goal**: Fix performance issue with slow page load

```bash
# === BUG REPORTED ===

$ backmark task create "Homepage loading very slowly (8+ seconds)" \
    --description "Users reporting homepage takes 8-10 seconds to load. Need to investigate and fix." \
    --assignees "Claude" \
    --labels "bug,performance,critical" \
    --priority critical

✓ Task #55 created

# === AI INVESTIGATES ===

$ backmark task edit 55 --status "In Progress"

$ backmark task ai-plan 55 "$(cat <<'EOF'
## Investigation Plan

### Diagnostic Steps
1. Profile homepage loading with React DevTools
2. Check network tab for slow requests
3. Analyze database queries
4. Check for N+1 queries
5. Review component re-renders

### Common Causes to Check
- N+1 database queries
- Large bundle size
- Unnecessary re-renders
- Missing pagination
- Large images not optimized
EOF
)"

$ backmark task ai-note 55 "Starting investigation with React DevTools profiler"

$ backmark task ai-note 55 "Profiler shows: Initial render takes 6.8 seconds"

$ backmark task ai-note 55 "Network tab: API call to /api/posts takes 5.2 seconds (!)"

$ backmark task ai-note 55 "Database logs: Found N+1 query problem. Loading 50 posts, then making separate query for each author (50 queries). Total: 51 queries"

$ backmark task ai-note 55 "ROOT CAUSE IDENTIFIED: N+1 query on posts list. Not using JOIN to fetch authors."

$ backmark task ai-note 55 "SOLUTION: Modified query to use JOIN. Now 1 query instead of 51."

$ backmark task ai-note 55 "TEST RESULT: Homepage now loads in 1.2 seconds (down from 8+ seconds)"

$ backmark task ai-note 55 "Added database query logging to prevent future N+1 issues"

# AI documents the fix
$ backmark task ai-doc 55 "$(cat <<'EOF'
## Performance Fix: Homepage Load Time

### Problem
Homepage was taking 8-10 seconds to load due to N+1 database queries.

### Root Cause
```sql
-- OLD: 51 queries
SELECT * FROM posts LIMIT 50;
SELECT * FROM users WHERE id = 1;
SELECT * FROM users WHERE id = 2;
... (50 more queries)
```

### Solution
```sql
-- NEW: 1 query
SELECT posts.*, users.name, users.avatar
FROM posts
LEFT JOIN users ON posts.author_id = users.id
LIMIT 50;
```

### Results
- **Before**: 8.2 seconds average load time
- **After**: 1.2 seconds average load time
- **Improvement**: 85% faster (7 seconds saved)

### Files Modified
- `pages/api/posts.ts` - Modified query to use JOIN
- `lib/db/queries.ts` - Added query builder helper

### Prevention
Added query logging in development mode to catch N+1 issues early.

Enable with: `DATABASE_LOG=true npm run dev`
EOF
)"

$ backmark task ai-review 55 "$(cat <<'EOF'
## Fix Review

### ✅ Resolved
- N+1 query eliminated
- Load time: 8.2s → 1.2s (85% improvement)
- No functionality changed
- Query logging added to prevent recurrence

### 🧪 Testing
- Tested with 50 posts ✓
- Tested with 100 posts ✓
- Tested with empty database ✓
- Load testing: 100 concurrent users - no degradation

### ⚠️ Additional Optimizations
Could further improve:
- Add pagination (currently loading all 50)
- Add image lazy loading
- Add caching (Redis)

These are nice-to-haves, not urgent.

### 💡 Estimated Impact
- Affects 100% of homepage visits
- ~1000 visits/day × 7 seconds saved = 7,000 seconds saved daily
- Better user experience, lower bounce rate
EOF
)"

$ backmark task edit 55 --status "Done"

# === BUG FIXED IN 1 HOUR ===
$ backmark overview --label "performance"
```

---

### Example 3: Multi-Day Project Session

**Goal**: Build complete comment system (3 days)

```bash
# === DAY 1: PLANNING & BREAKDOWN ===

$ backmark task create "Build comment system for blog posts" \
    --description "Full-featured commenting: nested replies, voting, moderation" \
    --assignees "Claude" \
    --milestone "v2.0"

$ backmark task ai-plan 60 "$(cat <<'EOF'
## Project Plan: Comment System

### Scope
- Top-level comments on posts
- Nested replies (up to 3 levels)
- Upvote/downvote
- Admin moderation (delete, flag)
- Real-time updates (optional)

### Architecture
```
┌─────────────┐
│   Post      │
└──────┬──────┘
       │
       ▼
┌─────────────┐     ┌──────────────┐
│  Comments   │────▶│ Comment API  │
│  Component  │     │  Endpoints   │
└─────────────┘     └──────────────┘
       │                    │
       ▼                    ▼
┌─────────────┐     ┌──────────────┐
│  Comment    │     │  Database    │
│  Tree       │     │  (Postgres)  │
└─────────────┘     └──────────────┘
```

### Breakdown into Subtasks
1. Database schema & migrations (4h)
2. API endpoints (CRUD + voting) (6h)
3. Comment component (display) (4h)
4. Comment form (submit/edit) (3h)
5. Reply functionality (nested) (4h)
6. Voting UI and logic (3h)
7. Moderation interface (admin) (4h)
8. Testing (6h)
9. Documentation (2h)

**Total Estimate: 36 hours (~3 days)**

### Tech Stack
- Database: PostgreSQL (nested sets for hierarchy)
- API: Next.js API routes
- Frontend: React + TypeScript
- Real-time: Skip for v1, add later

### Risks
- Nested comment performance (mitigation: limit depth to 3)
- Spam (mitigation: rate limiting, CAPTCHA)
- Moderation scalability (mitigation: flag system + auto-hide)
EOF
)"

# Human approves plan
$ backmark task view 60 --ai-plan
# "Plan approved. Create subtasks and start!"

# AI creates subtasks
$ backmark task create "Comments: Database schema" --parent 60 --assignees "Claude"
$ backmark task create "Comments: API endpoints" --parent 60 --assignees "Claude" --depends-on 61
$ backmark task create "Comments: Display component" --parent 60 --assignees "Claude" --depends-on 62
$ backmark task create "Comments: Reply functionality" --parent 60 --assignees "Claude" --depends-on 63
$ backmark task create "Comments: Voting" --parent 60 --assignees "Claude" --depends-on 64
$ backmark task create "Comments: Moderation" --parent 60 --assignees "Claude" --depends-on 65
$ backmark task create "Comments: Testing" --parent 60 --assignees "Claude" --depends-on 66
$ backmark task create "Comments: Documentation" --parent 60 --assignees "Claude" --depends-on 67

# View project structure
$ backmark task tree 60
#60 Build comment system
├── #61 Comments: Database schema
├── #62 Comments: API endpoints (depends on #61)
├── #63 Comments: Display component (depends on #62)
├── #64 Comments: Reply functionality (depends on #63)
├── #65 Comments: Voting (depends on #64)
├── #66 Comments: Moderation (depends on #65)
├── #67 Comments: Testing (depends on #66)
└── #68 Comments: Documentation (depends on #67)

# === DAY 1: Work on subtask #61 (Database) ===

$ backmark task edit 61 --status "In Progress"

$ backmark task ai-plan 61 "$(cat <<'EOF'
## Database Schema Plan

### Comments Table
```sql
CREATE TABLE comments (
  id UUID PRIMARY KEY,
  post_id UUID REFERENCES posts(id),
  user_id UUID REFERENCES users(id),
  parent_id UUID REFERENCES comments(id),  -- NULL for top-level
  content TEXT NOT NULL,
  depth INTEGER DEFAULT 0,  -- For limiting nesting
  path TEXT,  -- Materialized path: '1/5/12'
  votes_up INTEGER DEFAULT 0,
  votes_down INTEGER DEFAULT 0,
  is_deleted BOOLEAN DEFAULT false,
  is_flagged BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_comments_post ON comments(post_id);
CREATE INDEX idx_comments_path ON comments(path);
```

### Comment_Votes Table
```sql
CREATE TABLE comment_votes (
  comment_id UUID REFERENCES comments(id),
  user_id UUID REFERENCES users(id),
  vote INTEGER CHECK (vote IN (-1, 1)),  -- -1 down, 1 up
  created_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (comment_id, user_id)
);
```

### Queries Needed
1. Get comments for post (with user info)
2. Get replies for comment
3. Get comment tree (recursive)
4. Vote on comment
5. Delete comment (soft delete)
EOF
)"

$ backmark task ai-note 61 "Created migration file: 20250120_add_comments.sql"
$ backmark task ai-note 61 "Using materialized path for efficient tree queries"
$ backmark task ai-note 61 "Migration tested on dev database - successful"
$ backmark task ai-note 61 "Created helper functions: getCommentTree(), getCommentReplies()"

$ backmark task ai-doc 61 "$(cat comment-schema.md)"
$ backmark task ai-review 61 "Schema design complete. Tested with sample data."
$ backmark task edit 61 --status "Done"

# === DAY 1 END: View progress ===
$ backmark task view 60
# Shows: 1/8 subtasks complete

# === DAY 2: API endpoints ===
$ backmark task edit 62 --status "In Progress"
# [Similar workflow for task #62]
# ...
$ backmark task edit 62 --status "Done"

# === DAY 2: Display component ===
$ backmark task edit 63 --status "In Progress"
# [Similar workflow for task #63]
# ...

# === DAY 3: Complete remaining subtasks ===
# [Work through tasks #64-68]

# === DAY 3 END: Project complete ===
$ backmark task view 60
# Shows: 8/8 subtasks complete
# Parent task automatically marked as Done

$ backmark overview --milestone "v2.0"
# Shows comment system complete

# === FINAL REVIEW ===
$ backmark task ai-review 60 "$(cat <<'EOF'
## Project Review: Comment System

### ✅ Delivered
- Complete comment system with all planned features
- 8/8 subtasks completed
- 42 tests written, all passing
- Full documentation

### 📊 Metrics
- **Time**: 34 hours actual (36 estimated) - 6% under budget ✅
- **Code**: +2,847 lines production, +1,231 lines tests
- **Coverage**: 89% (target was 85%)
- **Performance**: Comment loading <100ms for 500 comments

### 💡 Learnings
- Materialized path approach worked well for nested comments
- Should have added rate limiting from start (added on day 2)
- Real-time updates not needed yet (validate with users first)

### 🚀 Next Steps
Based on user feedback:
1. Add emoji reactions (fun, low effort)
2. Add edit history (transparency)
3. Add @mentions (engagement)
4. Consider real-time if comment volume increases
EOF
)"
```

---

## 🎯 Best Practices

### For AI

1. **Plan Before Coding**
   - Always create a detailed plan in `ai_plan`
   - Break down large tasks into steps
   - Estimate time for each step
   - Identify risks upfront

2. **Document Decisions**
   - Log important decisions in `ai_notes`
   - Explain *why*, not just *what*
   - Document problems and solutions
   - Track deviations from plan

3. **Write Comprehensive Docs**
   - Assume the next person knows nothing
   - Include usage examples
   - Document edge cases
   - Explain architecture choices

4. **Review Your Own Work**
   - Be honest about concerns
   - Identify what could be better
   - Ask questions when uncertain
   - Provide metrics (time, tests, coverage)

5. **Update Status Religiously**
   - Start: `In Progress`
   - Done coding: `Review`
   - After human approval: `Done`
   - Keep the status current

6. **Test Thoroughly**
   - Write tests as you code
   - Test edge cases
   - Test error handling
   - Provide test results in review

### For Humans

1. **Provide Clear Requirements**
   - Be specific about what you want
   - Provide examples if possible
   - Define success criteria
   - Mention constraints (time, complexity)

2. **Review AI Plans**
   - Read the `ai_plan` before AI starts coding
   - Catch misunderstandings early
   - Provide feedback on approach
   - Approve or suggest changes

3. **Give Timely Feedback**
   - Review tasks regularly
   - Don't let AI work in the dark for days
   - Provide constructive feedback
   - Celebrate good work!

4. **Ask Questions**
   - If something is unclear, ask
   - AI should explain decisions
   - Challenge assumptions
   - Validate critical choices

5. **Close the Loop**
   - Always mark tasks as Done when complete
   - Provide final feedback
   - Document lessons learned
   - Capture what went well/poorly

### General Tips

1. **Use Labels Effectively**
   ```bash
   --labels "feature,frontend,react"
   --labels "bug,critical,security"
   --labels "refactor,tech-debt"
   --labels "research,architecture"
   ```

2. **Set Realistic Milestones**
   - Group related tasks
   - Time-box milestones
   - Review and adjust as needed

3. **Use Dependencies**
   - Make task order explicit
   - Prevent working on blocked tasks
   - Show what's blocking what

4. **Break Down Large Tasks**
   - Keep tasks under 8 hours
   - Use subtasks for big projects
   - Easier to track progress
   - Easier to resume if interrupted

5. **Maintain Context**
   - Read the `ai_notes` to resume work
   - Review recent `changelog` entries
   - Check related tasks
   - Look at `ai_plan` for the strategy

---

## 🔧 Advanced Techniques

### Technique 1: Iterative Refinement

Instead of trying to build the perfect solution in one go, iterate:

```bash
# Iteration 1: Basic functionality
backmark task create "Add search: basic keyword matching" --milestone "v1.0"
# AI implements simple string matching

# Iteration 2: Improve quality
backmark task create "Upgrade search: fuzzy matching" --milestone "v1.1"
# AI adds Fuse.js

# Iteration 3: Add features
backmark task create "Search: filters and facets" --milestone "v1.2"
# AI adds advanced filtering
```

### Technique 2: Spike Tasks

For uncertain or risky work, create a spike (time-boxed research):

```bash
backmark task create "Spike: Evaluate GraphQL vs REST for mobile API" \
  --description "Time-boxed: 4 hours max. Decision needed, not production code." \
  --labels "spike,research"
```

Spikes are about learning, not production code. Document findings in `ai_documentation`.

### Technique 3: Custom Task Templates

Backmark includes built-in templates (feature, bugfix, refactoring, research), but you can create your own for project-specific workflows:

```bash
# Create a custom template in your backlog
mkdir -p backlog/templates
cat > backlog/templates/deployment.md << 'EOF'
---
status: To Do
priority: high
labels:
  - deployment
  - devops
---

# Deployment Task

## 🎯 Deployment Target
- **Environment**: {production/staging/dev}
- **Version**: {version number}
- **Release Date**: {YYYY-MM-DD}

## 📋 Pre-Deployment Checklist
- [ ] All tests passing in CI
- [ ] Code reviewed and approved
- [ ] Database migrations prepared
- [ ] Environment variables configured
- [ ] Rollback plan documented

## 🚀 Deployment Steps
1. [ ] Backup database
2. [ ] Run migrations
3. [ ] Deploy application
4. [ ] Smoke test
5. [ ] Monitor for errors

## ✅ Post-Deployment Verification
- [ ] Health check endpoint responding
- [ ] Key features tested
- [ ] No error spikes in logs
- [ ] Performance metrics acceptable
EOF

# Use your custom template
backmark task create "Deploy v2.0 to production" \
  --template custom:deployment \
  -p critical
```

See [Pattern 0: Using Task Templates](#pattern-0-using-task-templates-new-in-v070) for more details on the template system.

### Technique 4: Pair Programming with AI

Work simultaneously with AI on complex tasks:

```bash
# 1. Human starts task, AI joins
backmark task create "Refactor database layer" --assignees "Human,Claude"

# 2. Human works on part A, AI works on part B
backmark task ai-note 75 "Working on PostgreSQL adapter while human does MySQL"

# 3. Regular sync points
backmark task ai-note 75 "Sync: Both adapters follow same interface, merging now"

# 4. Combined review
backmark task ai-review 75 "Both contributed. Merged successfully. Tests passing."
```

### Technique 5: Context Switching

When interrupted, preserve context for later:

```bash
# You're in the middle of a task, need to context switch
$ backmark task ai-note 42 "PAUSED: Halfway through implementing payment flow. Next: Add Stripe webhook handler"

# Later, resume with full context
$ backmark task view 42 --ai-notes
$ backmark task ai-note 42 "RESUMED: Continuing with Stripe webhook"
```

### Technique 6: Learning Sessions

Document learnings for future reference:

```bash
backmark task create "Learn: New React 19 features" \
  --assignees "Claude" \
  --labels "learning"

# AI documents learnings in ai_documentation
# Can reference later: backmark search "React 19"
```

---

## ⚠️ Common Pitfalls

### Pitfall 1: Vague Requirements

**Bad**:
```bash
backmark task create "Fix the bug" --assignees "Claude"
```

**Good**:
```bash
backmark task create "Fix: Login fails after password reset" \
  --description "Steps: 1) Reset password 2) Try to login 3) Gets 401 error. Expected: Should login successfully." \
  --assignees "Claude"
```

### Pitfall 2: No Planning

**Bad**:
```bash
# AI jumps straight to coding without planning
backmark task edit 50 --status "In Progress"
# starts coding...
# realizes approach was wrong...
# wastes time...
```

**Good**:
```bash
# AI plans first
backmark task ai-plan 50 "Detailed plan..."
# Human reviews plan
# Human: "Looks good!"
# Now AI starts coding with clear direction
```

### Pitfall 3: Silent Failures

**Bad**:
```bash
# AI encounters problem, doesn't document it
# Spends hours stuck
# Human has no visibility
```

**Good**:
```bash
# AI documents problem immediately
backmark task ai-note 55 "BLOCKED: API endpoint returning 500. Investigating..."
backmark task ai-note 55 "ROOT CAUSE: Missing database index. Adding now."
# Human can see progress and help if needed
```

### Pitfall 4: No Testing

**Bad**:
```bash
# AI finishes implementation
# Doesn't test
# Marks as done
# Bugs discovered in production
```

**Good**:
```bash
# AI tests thoroughly before marking done
backmark task ai-note 60 "Implementation complete. Starting testing..."
backmark task ai-note 60 "Unit tests: 12/12 passing"
backmark task ai-note 60 "Integration tests: 5/5 passing"
backmark task ai-note 60 "Manual testing: Tested 10 scenarios, all working"
backmark task ai-review 60 "All tests passing. Ready for review."
```

### Pitfall 5: Poor Documentation

**Bad**:
```bash
# AI writes code, no documentation
# Future developers confused
# Human wastes time understanding code
```

**Good**:
```bash
# AI documents while coding
backmark task ai-doc 70 "
## What This Does
Authentication middleware for API routes.

## How to Use
\`\`\`typescript
import { authenticate } from '@/middleware/auth';
app.use(authenticate);
\`\`\`

## How It Works
1. Extracts JWT from Authorization header
2. Verifies signature with secret
3. Loads user from database
4. Attaches user to request

## Error Handling
- 401 if no token
- 401 if invalid token
- 403 if user doesn't exist
"
```

### Pitfall 6: Massive Tasks

**Bad**:
```bash
backmark task create "Build the entire app" --assignees "Claude"
# Too big, will take weeks
# Hard to track progress
# Easy to get lost
```

**Good**:
```bash
# Break into manageable pieces
backmark task create "Build app - Phase 1: Authentication" --assignees "Claude"
backmark task create "Build app - Phase 2: Core features" --assignees "Claude" --depends-on 100
backmark task create "Build app - Phase 3: Polish" --assignees "Claude" --depends-on 101
```

---

## 🔗 Integration with Claude Code

Backmark has deep integration with [Claude Code](https://claude.com/claude-code):

### Install the Backmark Agent

```bash
# During init, you'll be prompted:
backmark init "My Project"
# > Install Backmark agent for Claude Code? [Y/n]

# Or install manually:
cp node_modules/@grazulex/backmark/.claude/agents/backmark-agent.md \
   .claude/agents/backmark-agent.md
```

### Using Claude Code with Backmark

Once the agent is installed, Claude Code can:

1. **Read task context**:
   ```
   Human: /agent backmark-manager
   Claude: I can now access your Backmark tasks!

   Human: What should I work on next?
   Claude: Let me check your backlog...
   [Reads task list]
   Claude: You have 3 high-priority tasks. The most urgent is #42: "Fix login bug"
   ```

2. **Create tasks**:
   ```
   Human: I need to add a dashboard page

   Claude: I'll create a task for that.
   [Creates task via Backmark CLI]
   Claude: Created task #55: "Add dashboard page"
   ```

3. **Document work automatically**:
   ```
   Claude: [Implementing feature]
   [Automatically updates ai_notes as it works]
   [Adds ai_documentation when complete]
   [Provides ai_review before finishing]
   ```

4. **Resume context from previous sessions**:
   ```
   Human: Continue working on task #55

   Claude: Let me review what we've done so far...
   [Reads ai_plan, ai_notes, ai_documentation]
   Claude: I see we were implementing the dashboard. The authentication is done, now we need to add the widgets. Continuing...
   ```

### Best Practices with Claude Code

1. **Always start with context**:
   ```
   Human: /agent backmark-manager
   Human: What's the current task I'm working on?
   Claude: [Reads Backmark]
   Claude: You're working on #42. Let me check the details...
   ```

2. **Let Claude document**:
   - Don't manually write `ai_plan`
   - Let Claude create it as it thinks through the problem
   - Review and approve before it starts coding

3. **Use Claude for reviews**:
   ```
   Human: Review task #42 and tell me if it's ready to merge

   Claude: [Reads ai_review, runs tests, checks code]
   Claude: Task #42 looks good! All tests passing, documentation complete. Two minor suggestions: [...]
   ```

4. **Natural language task management**:
   ```
   Human: Show me all the bugs assigned to me

   Claude: [Runs: backmark task list --label bug --assignee @you]
   Claude: You have 3 bugs: [lists them]
   ```

---

## 🎓 Next Steps

You're now a Backmark AI workflow expert! Here's what to do next:

1. **Practice**: Start with a small task and follow the Standard Flow
2. **Experiment**: Try different workflow patterns
3. **Iterate**: Find what works for your team
4. **Share**: Document your own patterns
5. **Contribute**: Share improvements with the Backmark community

---

## 📚 Additional Resources

- [Quick Start Guide](quick-start.md) - Basic Backmark usage
- [Troubleshooting](troubleshooting.md) - Common issues
- [GitHub Discussions](https://github.com/Grazulex/backmark/discussions) - Community patterns
- [Examples Repository](https://github.com/Grazulex/backmark-examples) - Real-world workflows

---

**Happy vibe coding! 🚀🤖**

*Remember: The best AI collaboration is when both human and AI learn from each other.*
