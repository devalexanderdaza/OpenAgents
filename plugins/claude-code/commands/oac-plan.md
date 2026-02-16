---
name: oac:plan
description: Plan and break down a complex feature into atomic, verifiable subtasks with dependencies
argument-hint: [feature description]
---

# Plan Feature

Break down the following feature into atomic subtasks: **$ARGUMENTS**

---

## What This Command Does

The `/oac:plan` command helps you plan complex features by:

1. **Analyzing requirements** - Understanding scope and complexity
2. **Discovering context** - Finding relevant standards and patterns
3. **Creating task breakdown** - Generating subtask files with dependencies
4. **Presenting plan** - Showing task structure and execution order

This command invokes the **task-manager** subagent to create structured task files in `.tmp/tasks/{feature}/`.

---

## When to Use This Command

Use `/oac:plan` when you need to:

- **Plan a complex feature** requiring multiple steps or files
- **Break down large tasks** into manageable 1-2 hour subtasks
- **Map dependencies** between different components
- **Identify parallel work** that can be executed simultaneously
- **Create a roadmap** before starting implementation

**Examples of features that benefit from planning**:
- User authentication system
- Payment integration
- API rate limiting
- Multi-step workflows
- Features spanning multiple files or services

---

## Usage

### Basic Usage

```bash
# Plan a feature
/oac:plan user authentication system

# Plan with specific focus
/oac:plan API rate limiting with Redis

# Plan with constraints
/oac:plan payment integration (PCI compliance required)
```

### With Context Hints

```bash
# Specify security focus
/oac:plan user authentication (security-critical)

# Specify performance focus
/oac:plan search functionality (performance-critical)

# Specify integration focus
/oac:plan Stripe payment integration (external API)
```

---

## What You'll Get

### Task Files Created

The command creates structured JSON files in `.tmp/tasks/{feature}/`:

#### 1. `task.json` - Feature Metadata
```json
{
  "id": "user-authentication",
  "name": "User Authentication System",
  "status": "active",
  "objective": "Implement JWT-based authentication with refresh tokens",
  "context_files": [
    ".opencode/context/core/standards/code-quality.md",
    ".opencode/context/core/standards/security-patterns.md"
  ],
  "reference_files": [
    "src/middleware/auth.middleware.ts"
  ],
  "exit_criteria": [
    "All tests passing",
    "JWT tokens signed with RS256",
    "Refresh token rotation implemented"
  ],
  "subtask_count": 4,
  "completed_count": 0,
  "created_at": "2026-02-16T10:00:00Z"
}
```

#### 2. `subtask_01.json` - First Subtask
```json
{
  "id": "user-authentication-01",
  "seq": "01",
  "title": "Create JWT service with token generation",
  "status": "pending",
  "depends_on": [],
  "parallel": true,
  "suggested_agent": "CoderAgent",
  "context_files": [
    ".opencode/context/core/standards/security-patterns.md"
  ],
  "reference_files": [],
  "acceptance_criteria": [
    "JWT tokens signed with RS256 algorithm",
    "Access tokens expire in 15 minutes",
    "Refresh tokens expire in 7 days"
  ],
  "deliverables": [
    "src/auth/jwt.service.ts",
    "src/auth/jwt.service.test.ts"
  ]
}
```

#### 3. `subtask_02.json`, `subtask_03.json`, etc.

Additional subtasks with clear dependencies and deliverables.

---

## Output Format

After planning, you'll see a summary:

```
## Task Plan Created

**Feature**: user-authentication
**Location**: .tmp/tasks/user-authentication/
**Files**: task.json + 4 subtasks

### Subtasks

**01: Create JWT service with token generation**
- Parallel: ✅ (can run independently)
- Agent: CoderAgent
- Deliverables: jwt.service.ts, jwt.service.test.ts

**02: Implement auth middleware**
- Parallel: ❌ (depends on subtask 01)
- Agent: CoderAgent
- Deliverables: auth.middleware.ts, auth.middleware.test.ts

**03: Create login endpoint**
- Parallel: ❌ (depends on subtask 01, 02)
- Agent: CoderAgent
- Deliverables: auth.controller.ts, auth.routes.ts

**04: Add refresh token logic**
- Parallel: ❌ (depends on subtask 01)
- Agent: CoderAgent
- Deliverables: refresh-token.service.ts, refresh-token.test.ts

### Execution Order

**Phase 1** (parallel):
- Subtask 01: JWT service

**Phase 2** (after Phase 1):
- Subtask 02: Auth middleware
- Subtask 04: Refresh token logic (parallel with 02)

**Phase 3** (after Phase 2):
- Subtask 03: Login endpoint

### Next Steps

1. Review the task plan
2. Execute subtasks in order using `/code-execution` skill
3. Track progress with task-cli.ts (if available)
4. Mark subtasks complete as you finish them

**Ready to start implementation?**
```

---

## Integration with OAC Workflow

The `/oac:plan` command fits into the **6-stage OAC workflow**:

### Stage 1: Analyze & Discover
- `/oac:plan` discovers relevant context automatically
- Finds coding standards, security patterns, workflows

### Stage 2: Plan & Approve
- Creates detailed task breakdown
- **Requests approval** before proceeding to implementation

### Stage 3: LoadContext
- Context files already identified in task.json
- Main agent loads them before execution

### Stage 4: Execute
- Execute subtasks in dependency order
- Use `/code-execution` skill for each subtask
- Track progress through subtask status

### Stage 5: Validate
- Verify acceptance criteria for each subtask
- Run tests after each subtask completion

### Stage 6: Complete
- Mark feature as complete
- Update documentation
- Archive task files (optional)

---

## Advanced Usage

### Planning with Specific Context

```bash
# Discover context first, then plan
/context-discovery authentication security patterns
# Review discovered context
/oac:plan user authentication system
```

### Planning with External Dependencies

```bash
# Plan integration with external library
/oac:plan Stripe payment integration

# The task-manager will:
# 1. Discover internal context (security, API patterns)
# 2. Suggest using /external-scout for Stripe docs
# 3. Create subtasks with both internal and external context
```

### Planning with Constraints

```bash
# Specify constraints in the description
/oac:plan user authentication (must use existing database schema)

# The task-manager will:
# 1. Include reference_files for existing schema
# 2. Create subtasks that work within constraints
# 3. Flag potential conflicts or risks
```

---

## Task Management

### Viewing Task Status

```bash
# If task-cli.ts is available
node tasks/task-cli.ts status user-authentication

# Output:
# Feature: user-authentication
# Status: active
# Progress: 2/4 subtasks complete (50%)
# 
# Subtasks:
# ✅ 01: JWT service (completed)
# ✅ 02: Auth middleware (completed)
# ⏳ 03: Login endpoint (in_progress)
# ⏸️  04: Refresh token logic (pending)
```

### Updating Subtask Status

```bash
# Mark subtask as complete
node tasks/task-cli.ts complete user-authentication 01

# Mark subtask as in progress
node tasks/task-cli.ts start user-authentication 03
```

### Listing All Tasks

```bash
# List all active tasks
node tasks/task-cli.ts list

# Output:
# Active Tasks:
# - user-authentication (2/4 complete)
# - api-rate-limiting (0/3 complete)
```

---

## Examples

### Example 1: Simple Feature

**Command**:
```bash
/oac:plan add email validation to user registration
```

**Result**:
```
## Task Plan Created

**Feature**: email-validation
**Location**: .tmp/tasks/email-validation/
**Files**: task.json + 2 subtasks

### Subtasks

**01: Add email validation regex**
- Parallel: ✅
- Agent: CoderAgent
- Deliverables: validation.utils.ts, validation.test.ts

**02: Update registration endpoint**
- Parallel: ❌ (depends on 01)
- Agent: CoderAgent
- Deliverables: registration.controller.ts

### Next Steps
Execute subtasks in order.
```

---

### Example 2: Complex Feature

**Command**:
```bash
/oac:plan complete user authentication system with JWT and refresh tokens
```

**Result**:
```
## Task Plan Created

**Feature**: user-authentication
**Location**: .tmp/tasks/user-authentication/
**Files**: task.json + 6 subtasks

### Subtasks

**01: Create JWT service**
- Parallel: ✅
- Agent: CoderAgent

**02: Create refresh token service**
- Parallel: ✅
- Agent: CoderAgent

**03: Implement auth middleware**
- Parallel: ❌ (depends on 01)
- Agent: CoderAgent

**04: Create login endpoint**
- Parallel: ❌ (depends on 01, 03)
- Agent: CoderAgent

**05: Create refresh endpoint**
- Parallel: ❌ (depends on 02)
- Agent: CoderAgent

**06: Add logout endpoint**
- Parallel: ❌ (depends on 01, 03)
- Agent: CoderAgent

### Execution Order

**Phase 1** (parallel):
- 01: JWT service
- 02: Refresh token service

**Phase 2** (after Phase 1):
- 03: Auth middleware (depends on 01)
- 05: Refresh endpoint (depends on 02)

**Phase 3** (after Phase 2):
- 04: Login endpoint (depends on 01, 03)
- 06: Logout endpoint (depends on 01, 03)

### Next Steps
Execute 6 subtasks across 3 phases.
```

---

### Example 3: Integration Feature

**Command**:
```bash
/oac:plan Stripe payment integration with webhook handling
```

**Result**:
```
## Task Plan Created

**Feature**: stripe-payment-integration
**Location**: .tmp/tasks/stripe-payment-integration/
**Files**: task.json + 5 subtasks

### Subtasks

**01: Set up Stripe SDK and configuration**
- Parallel: ✅
- Agent: CoderAgent
- External Context: Stripe API docs (use /external-scout)

**02: Create payment intent service**
- Parallel: ❌ (depends on 01)
- Agent: CoderAgent

**03: Implement webhook handler**
- Parallel: ❌ (depends on 01)
- Agent: CoderAgent

**04: Add payment endpoints**
- Parallel: ❌ (depends on 02)
- Agent: CoderAgent

**05: Add webhook verification**
- Parallel: ❌ (depends on 03)
- Agent: CoderAgent

### External Dependencies

⚠️  This feature requires external documentation:
- Run: /external-scout Stripe payment intents
- Run: /external-scout Stripe webhooks

### Next Steps
1. Fetch external docs with /external-scout
2. Execute subtasks in dependency order
```

---

## Tips

### ✅ Do

- **Be specific** - "user authentication with JWT" is better than "auth"
- **Mention constraints** - Include important requirements in the description
- **Review the plan** - Check subtasks and dependencies before executing
- **Use parallel tasks** - Take advantage of tasks that can run simultaneously
- **Track progress** - Update subtask status as you complete them

### ❌ Don't

- **Don't skip planning** - Complex features benefit from upfront planning
- **Don't ignore dependencies** - Follow the execution order
- **Don't modify task files manually** - Use task-cli.ts or let agents update them
- **Don't plan trivial tasks** - Simple 1-file changes don't need planning

---

## Troubleshooting

### "No context found for planning"

**Cause**: Context files haven't been downloaded

**Solution**:
```bash
# Download context first
/oac:setup --core

# Then plan
/oac:plan your feature
```

---

### "Task files already exist"

**Cause**: A task with the same name already exists

**Solution**:
```bash
# Option 1: Use a different name
/oac:plan user-authentication-v2

# Option 2: Delete old task files
rm -rf .tmp/tasks/user-authentication/

# Option 3: Complete the existing task first
node tasks/task-cli.ts complete user-authentication
```

---

### "Subtasks seem too large"

**Cause**: Feature is very complex, subtasks are >2 hours

**Solution**:
- Break down the feature further
- Plan in phases (plan phase 1, execute, then plan phase 2)
- Manually split large subtasks into smaller ones

---

## Related Commands

- `/oac:setup` - Download context files (required before planning)
- `/oac:status` - Check OAC installation status
- `/oac:help` - View all available commands

## Related Skills

- `/context-discovery` - Discover context before planning
- `/task-breakdown` - Alternative way to invoke task-manager
- `/code-execution` - Execute planned subtasks
- `/test-generation` - Generate tests for subtasks

---

## Success Criteria

After running `/oac:plan`, you should have:

- ✅ Task files created in `.tmp/tasks/{feature}/`
- ✅ Clear subtasks with binary acceptance criteria
- ✅ Dependencies mapped correctly
- ✅ Parallel tasks identified
- ✅ Context files referenced
- ✅ Execution order clear

**Ready to implement? Start with the first subtask!**

---

**Version**: 1.0.0  
**Command**: oac:plan  
**Last Updated**: 2026-02-16
