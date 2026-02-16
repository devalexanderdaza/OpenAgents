---
name: parallel-execution
description: Execute multiple independent tasks in parallel using Claude Code's agent teams or multiple subagent invocations. Use when you have independent tasks with no dependencies, need to speed up multi-component features, or when task-manager marks tasks with parallel:true.
---

# Parallel Execution Skill

Execute multiple independent tasks simultaneously to dramatically reduce implementation time for multi-component features.

## When to Use This Skill

Invoke parallel execution when:

- **Multiple independent tasks** — Tasks with no shared files or dependencies
- **Task-manager marks parallel:true** — TaskManager identified parallelizable work
- **Multi-component features** — Frontend + backend + tests can run simultaneously
- **Time-sensitive delivery** — Need to reduce total execution time
- **Isolated work streams** — Different agents working on different areas
- **Batch operations** — Converting multiple files, running multiple tests

## When NOT to Use

Avoid parallel execution when:

- ❌ **Tasks modify the same files** — Will cause merge conflicts
- ❌ **Tasks have dependencies** — One task needs output from another
- ❌ **Shared state or resources** — Database migrations, global config changes
- ❌ **Sequential logic required** — Steps must happen in specific order
- ❌ **Single small task** — Overhead not worth it for simple operations

## How Parallel Execution Works

### Approach A: Multiple Subagent Invocations (Native)

**Claude Code natively supports parallel work via multiple tool calls in one message.**

When you make multiple independent `task()` calls in a single response, Claude Code executes them in parallel:

```markdown
I'll execute these three tasks in parallel:

task(subagent_type="CoderAgent", description="Implement auth service", prompt="...")
task(subagent_type="CoderAgent", description="Implement user service", prompt="...")
task(subagent_type="TestEngineer", description="Create integration tests", prompt="...")
```

**Key points**:
- All three tasks start simultaneously
- Each runs in isolated context
- Main agent waits for ALL to complete before proceeding
- Results are collected and can be integrated

### Approach B: Agent Teams (Experimental)

**Requires**: `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=true`

Agent teams allow multiple agents to collaborate on a shared workspace:

```markdown
I'll create an agent team for this feature:

team(
  name="auth-implementation",
  agents=[
    {type: "CoderAgent", task: "Backend auth service"},
    {type: "OpenFrontendSpecialist", task: "Login UI components"},
    {type: "TestEngineer", task: "E2E auth tests"}
  ],
  shared_context=".tmp/sessions/auth-context.md"
)
```

**Key points**:
- Agents share context file for coordination
- Can communicate via shared state
- More complex but enables tighter integration
- Experimental feature, may change

## Integration with Task-Manager

TaskManager automatically identifies parallel tasks and marks them with `parallel: true`:

### Task Structure Example

**task.json**:
```json
{
  "id": "user-dashboard",
  "subtask_count": 5,
  "context_files": [".opencode/context/core/standards/code-quality.md"]
}
```

**subtask_01.json** (parallel):
```json
{
  "id": "user-dashboard-01",
  "seq": "01",
  "title": "Create user profile API",
  "parallel": true,
  "depends_on": [],
  "suggested_agent": "CoderAgent"
}
```

**subtask_02.json** (parallel):
```json
{
  "id": "user-dashboard-02",
  "seq": "02",
  "title": "Design dashboard UI components",
  "parallel": true,
  "depends_on": [],
  "suggested_agent": "OpenFrontendSpecialist"
}
```

**subtask_03.json** (sequential - depends on 01 and 02):
```json
{
  "id": "user-dashboard-03",
  "seq": "03",
  "title": "Integrate API with UI",
  "parallel": false,
  "depends_on": ["01", "02"],
  "suggested_agent": "CoderAgent"
}
```

### Identifying Parallel Batches

Use the task-management CLI to identify parallel tasks:

```bash
# Show which tasks can run in parallel
bash .opencode/skills/task-management/router.sh parallel user-dashboard
```

**Output**:
```
Batch 1 (Ready now):
- subtask_01.json (parallel: true)
- subtask_02.json (parallel: true)

Batch 2 (After Batch 1):
- subtask_03.json (depends_on: ["01", "02"])
```

### Execution Workflow

**Step 1: Analyze Task Structure**
```markdown
Read .tmp/tasks/{feature}/task.json
Read all subtask_NN.json files
Identify parallel batches using dependency graph
```

**Step 2: Execute Parallel Batch**
```markdown
For Batch 1 (subtasks 01 and 02 are parallel):

task(
  subagent_type="CoderAgent",
  description="Execute subtask 01",
  prompt="Read .tmp/tasks/user-dashboard/subtask_01.json and implement..."
)

task(
  subagent_type="OpenFrontendSpecialist",
  description="Execute subtask 02",
  prompt="Read .tmp/tasks/user-dashboard/subtask_02.json and implement..."
)

Wait for both to complete...
```

**Step 3: Verify Batch Completion**
```bash
bash .opencode/skills/task-management/router.sh status user-dashboard
```

**Step 4: Execute Next Batch**
```markdown
Once Batch 1 is complete, proceed to Batch 2:

task(
  subagent_type="CoderAgent",
  description="Execute subtask 03",
  prompt="Read .tmp/tasks/user-dashboard/subtask_03.json and integrate..."
)
```

## Practical Examples

### Example 1: Converting Multiple Subagents in Parallel

**Scenario**: Convert 5 subagent files from old format to new format

```markdown
I'll convert these subagents in parallel:

task(subagent_type="CoderAgent", description="Convert auth-agent", 
     prompt="Convert .opencode/agent/subagents/auth-agent.md to new format...")

task(subagent_type="CoderAgent", description="Convert user-agent",
     prompt="Convert .opencode/agent/subagents/user-agent.md to new format...")

task(subagent_type="CoderAgent", description="Convert payment-agent",
     prompt="Convert .opencode/agent/subagents/payment-agent.md to new format...")

task(subagent_type="CoderAgent", description="Convert notification-agent",
     prompt="Convert .opencode/agent/subagents/notification-agent.md to new format...")

task(subagent_type="CoderAgent", description="Convert analytics-agent",
     prompt="Convert .opencode/agent/subagents/analytics-agent.md to new format...")
```

**Time savings**: 5 tasks × 10 min each = 50 min sequential → ~10 min parallel (80% faster)

### Example 2: Running Tests in Parallel

**Scenario**: Run unit tests, integration tests, and E2E tests simultaneously

```markdown
I'll run all test suites in parallel:

task(subagent_type="TestEngineer", description="Run unit tests",
     prompt="Execute unit test suite for src/auth/...")

task(subagent_type="TestEngineer", description="Run integration tests",
     prompt="Execute integration test suite for src/api/...")

task(subagent_type="TestEngineer", description="Run E2E tests",
     prompt="Execute E2E test suite for user flows...")
```

**Time savings**: 3 suites × 5 min each = 15 min sequential → ~5 min parallel (67% faster)

### Example 3: Implementing Independent Features

**Scenario**: Build authentication system with parallel work streams

```markdown
I'll implement these independent components in parallel:

task(subagent_type="CoderAgent", description="JWT service",
     prompt="Create JWT token generation and validation service...")

task(subagent_type="CoderAgent", description="Password hashing",
     prompt="Implement bcrypt password hashing utilities...")

task(subagent_type="CoderAgent", description="Session storage",
     prompt="Create Redis-based session storage layer...")

task(subagent_type="OpenFrontendSpecialist", description="Login UI",
     prompt="Design and implement login form components...")
```

**Time savings**: 4 components × 30 min each = 120 min sequential → ~30 min parallel (75% faster)

## Best Practices

### 1. Avoid File Conflicts

**✅ Good** (isolated files):
```markdown
task(CoderAgent, "Create src/auth/service.ts")
task(CoderAgent, "Create src/user/service.ts")
task(CoderAgent, "Create src/payment/service.ts")
```

**❌ Bad** (same file):
```markdown
task(CoderAgent, "Add auth function to src/utils/helpers.ts")
task(CoderAgent, "Add validation function to src/utils/helpers.ts")
```

### 2. Size Tasks Appropriately

**✅ Good** (balanced tasks):
```markdown
task(CoderAgent, "Implement user CRUD API (30 min)")
task(CoderAgent, "Implement auth middleware (30 min)")
```

**❌ Bad** (unbalanced):
```markdown
task(CoderAgent, "Implement entire backend (2 hours)")
task(CoderAgent, "Add one import statement (1 min)")
```

### 3. Monitor Progress

After delegating parallel tasks, track completion:

```bash
# Check status periodically
bash .opencode/skills/task-management/router.sh status {feature}

# Look for:
# - subtask_01.json: status: "completed" ✓
# - subtask_02.json: status: "completed" ✓
# - subtask_03.json: status: "in_progress" ...
```

### 4. Handle Failures Gracefully

If one parallel task fails:

```markdown
Batch 1 Results:
- Task 01: ✅ Completed
- Task 02: ❌ Failed (missing dependency)
- Task 03: ✅ Completed

Action: Fix Task 02 before proceeding to Batch 2
```

### 5. Coordinate Shared Context

When tasks need shared information:

**✅ Good** (pre-load context):
```markdown
# Load context BEFORE parallel execution
Read .opencode/context/core/standards/code-quality.md
Read .opencode/context/core/standards/security-patterns.md

# Now all parallel tasks have same context
task(CoderAgent, "Implement auth service...")
task(CoderAgent, "Implement user service...")
```

**❌ Bad** (each task discovers context):
```markdown
# Each task will call ContextScout separately (slower)
task(CoderAgent, "Discover context and implement auth...")
task(CoderAgent, "Discover context and implement user...")
```

## Troubleshooting

### Issue: Tasks completing out of order

**Problem**: Task 02 finishes before Task 01, but Task 03 depends on both

**Solution**: Use dependency tracking in subtask JSON:
```json
{
  "id": "feature-03",
  "depends_on": ["01", "02"],
  "parallel": false
}
```

Don't start Task 03 until BOTH 01 and 02 are marked `status: "completed"`.

### Issue: File conflicts during parallel execution

**Problem**: Two tasks tried to modify the same file

**Solution**: 
1. Review task breakdown - ensure true isolation
2. If tasks MUST touch same file, mark `parallel: false`
3. Sequence dependent tasks properly

### Issue: One task blocked waiting for another

**Problem**: Task 01 needs output from Task 02, but both marked parallel

**Solution**: Fix dependency graph:
```json
{
  "id": "feature-01",
  "depends_on": ["02"],  // Add dependency
  "parallel": false      // Mark sequential
}
```

### Issue: Parallel tasks not actually running in parallel

**Problem**: Tasks executing sequentially despite parallel flags

**Solution**: Ensure you're making multiple `task()` calls in SAME message:

**✅ Correct**:
```markdown
I'll execute these in parallel:

task(...)
task(...)
task(...)
```

**❌ Wrong** (sequential):
```markdown
I'll execute task 1:
task(...)

[Wait for response]

Now I'll execute task 2:
task(...)
```

## Performance Impact

### Time Savings by Parallelization

| Scenario | Sequential | Parallel | Savings |
|----------|-----------|----------|---------|
| 3 independent components (30 min each) | 90 min | 30 min | 67% |
| 5 file conversions (10 min each) | 50 min | 10 min | 80% |
| 4 test suites (15 min each) | 60 min | 15 min | 75% |
| Frontend + Backend + Tests | 120 min | 40 min | 67% |

### Optimal Batch Sizes

- **2-4 tasks**: Ideal for most scenarios
- **5-8 tasks**: Good if truly independent
- **9+ tasks**: Consider breaking into multiple batches

## Related Skills

- `/task-breakdown` — Creates task structure with parallel flags
- `/context-discovery` — Load shared context before parallel execution
- `/code-review` — Review all parallel outputs together

## Advanced: Agent Teams

For complex features requiring tight coordination, use agent teams (experimental):

```markdown
team(
  name="e-commerce-checkout",
  agents=[
    {
      type: "CoderAgent",
      role: "backend",
      tasks: ["Payment API", "Order processing", "Inventory check"]
    },
    {
      type: "OpenFrontendSpecialist", 
      role: "frontend",
      tasks: ["Checkout UI", "Payment form", "Order confirmation"]
    },
    {
      type: "TestEngineer",
      role: "qa",
      tasks: ["Integration tests", "E2E checkout flow"]
    }
  ],
  shared_context: ".tmp/sessions/checkout-context.md",
  coordination: "async"  // Agents coordinate via shared context file
)
```

**Benefits**:
- Agents can update shared context as they progress
- Enables async coordination without blocking
- Better for complex features with evolving requirements

**Drawbacks**:
- Experimental feature
- More complex to debug
- Requires careful context management

---

## Summary

Parallel execution is a powerful technique for reducing implementation time when:
1. Tasks are truly independent (no shared files/state)
2. TaskManager marks tasks with `parallel: true`
3. You make multiple `task()` calls in same message

**Key takeaways**:
- ✅ Use for independent components, file conversions, test suites
- ✅ Pre-load shared context before parallel execution
- ✅ Monitor completion with task-management CLI
- ❌ Avoid for tasks with dependencies or shared files
- ❌ Don't parallelize tasks that modify same file

**Time savings**: 50-80% reduction in execution time for multi-component features.
