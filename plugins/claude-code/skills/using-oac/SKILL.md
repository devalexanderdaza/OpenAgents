---
name: using-oac
description: OpenAgents Control workflow for context-aware development. Auto-invokes on every task to ensure proper context discovery, planning, and execution with approval gates.
---

# OpenAgents Control (OAC) Workflow

**Purpose**: Guide Claude through context-aware development using the 6-stage OAC workflow.

**When to use**: Automatically invoked for every development task to ensure proper context discovery, planning, and validation.

---

## 6-Stage Workflow

Execute these stages in order for every development task:

### Stage 1: Analyze & Discover

**Goal**: Understand the task and discover relevant context files.

**Actions**:
1. Analyze the user's request to understand:
   - What they want to build/change
   - Technical scope and complexity
   - Potential risks or dependencies

2. Invoke the `/context-discovery` skill to find relevant context files:
   - Coding standards and conventions
   - Architecture patterns
   - Security guidelines
   - Domain-specific guides

3. Capture the list of context files returned by ContextScout

**Output**: List of context files to load, understanding of task scope

---

### Stage 2: Plan & Approve

**Goal**: Create an execution plan and get user approval before proceeding.

**Actions**:
1. Based on task complexity, create a plan:
   
   **Simple tasks** (1-3 files, <30 min):
   - Direct implementation approach
   - List of files to create/modify
   - Key technical decisions
   
   **Complex tasks** (4+ files, >30 min):
   - High-level breakdown into phases
   - Dependencies between components
   - Suggest using `/task-breakdown` skill for detailed subtasks

2. Present the plan to the user with:
   - Summary of approach
   - Files that will be created/modified
   - Context files that will be loaded
   - Estimated complexity

3. **REQUEST APPROVAL** - Wait for user confirmation before proceeding

**Critical**: NEVER proceed to Stage 3 without explicit user approval.

**Output**: Approved execution plan

---

### Stage 3: LoadContext

**Goal**: Pre-load ALL discovered context files so they're available during execution.

**Actions**:
1. Read EVERY context file discovered in Stage 1:
   - Use the `Read` tool to load each file
   - Load files in priority order (Critical → High → Medium)
   - **Example**: If Stage 1 found 5 files, Stage 3 reads all 5
   - **Important**: Don't skip any files - load everything discovered

2. Internalize the loaded context:
   - Coding standards and patterns
   - Security requirements
   - Naming conventions
   - Architecture constraints
   - Project-specific conventions

**Why This Matters**: This stage prevents nested ContextScout calls during execution. By loading ALL context upfront, subagents invoked in Stage 4 can use the pre-loaded context without needing to call ContextScout themselves. This maintains the flattened delegation hierarchy required by Claude Code.

3. If external libraries are involved, invoke `/external-scout` to fetch current API docs:
   - **Example**: If using Drizzle ORM → `/external-scout drizzle schemas`
   - **Example**: If using React hooks → `/external-scout react hooks`
   - Load the cached documentation files returned by ExternalScout
   - Apply current API patterns from external docs

**Output**: All context loaded (internal + external) and ready for execution

---

### Stage 4: Execute

**Goal**: Implement the solution following loaded context and standards.

**Actions**:

**For Simple Tasks** (direct execution):
1. Implement the solution directly:
   - Follow coding standards from loaded context
   - Apply security patterns
   - Use naming conventions
   - Create tests if required

2. Self-review before completion:
   - Verify all acceptance criteria met
   - Check for type errors or missing imports
   - Scan for debug artifacts (console.log, TODO, etc.)
   - Validate against loaded standards

**For Complex Tasks** (delegated execution):
1. Invoke `/task-breakdown` skill to create detailed subtasks:
   - TaskManager will create JSON task files
   - Each subtask will have clear acceptance criteria
   - Dependencies will be mapped

2. Execute subtasks in order:
   - Use `/code-execution` skill for implementation subtasks
   - Use `/test-generation` skill for test subtasks
   - Use `/code-review` skill for review subtasks

3. Track progress through subtask completion

**Output**: Implementation complete, all deliverables created

---

### Stage 5: Validate

**Goal**: Verify the implementation works correctly.

**Actions**:
1. Run tests (if they exist):
   - Execute test suite
   - Check for failures
   - Verify coverage meets requirements

2. Validate against acceptance criteria:
   - Check each criterion from the plan
   - Verify all deliverables exist
   - Confirm standards were followed

3. **STOP on failure**:
   - If tests fail → fix issues before proceeding
   - If criteria unmet → complete implementation
   - If standards violated → refactor to comply

**Critical**: Do not proceed to Stage 6 if validation fails.

**Output**: Validated, working implementation

---

### Stage 6: Complete

**Goal**: Finalize the task with documentation and cleanup.

**Actions**:
1. Update documentation (if needed):
   - Update README if new features added
   - Add inline documentation for complex logic
   - Update API docs if endpoints changed

2. Summarize what was done:
   - List files created/modified
   - Highlight key technical decisions
   - Note any follow-up tasks needed

3. Cleanup (if applicable):
   - Remove temporary files
   - Clean up debug code
   - Archive session files (for complex tasks)

4. Present completion summary to user

**Output**: Task complete, documented, and summarized

---

## Key Principles

### Flat Delegation Hierarchy

**OAC Pattern** (nested - NOT supported in Claude Code):
```
Main Agent → TaskManager → CoderAgent → ContextScout
```

**Claude Code Pattern** (flat - CORRECT):
```
Main Agent → ContextScout (via /context-discovery)
Main Agent → TaskManager (via /task-breakdown)
Main Agent → CoderAgent (via /code-execution)
```

**Rule**: Only the main agent can invoke subagents. Subagents cannot call other subagents.

### Context Pre-Loading

**Why**: Prevents nested ContextScout calls during execution.

**How**: Stage 3 loads ALL context upfront, so execution stages (4-6) have everything they need.

### Approval Gates

**Critical checkpoints**:
- **Stage 2 → Stage 3**: User must approve the plan
- **Stage 5 → Stage 6**: Validation must pass

**Never skip approval** - it prevents wasted work and ensures alignment.

### Progressive Complexity

**Simple tasks**: Stages 1-2-3-4-5-6 executed inline by main agent

**Complex tasks**: Stages 1-2-3 by main agent, Stage 4 delegated to TaskManager + specialists

---

## Skill Invocations

Use these skills at the appropriate stages:

| Skill | When to Invoke | Purpose |
|-------|----------------|---------|
| `/context-discovery` | Stage 1 | Find relevant context files |
| `/external-scout` | Stage 3 | Fetch external library documentation |
| `/task-breakdown` | Stage 4 (complex tasks) | Create detailed subtasks |
| `/code-execution` | Stage 4 (subtasks) | Implement code subtasks |
| `/test-generation` | Stage 4 (subtasks) | Create test subtasks |
| `/code-review` | Stage 4 (subtasks) | Review code subtasks |

---

## Example Workflow

### Simple Task: "Add email validation to user registration"

**Stage 1**: Analyze → Invoke `/context-discovery` → Get validation patterns, security standards

**Stage 2**: Plan → "Add email regex validation to registration endpoint" → Request approval

**Stage 3**: Load context → Read validation patterns, security standards

**Stage 4**: Execute → Implement validation, add tests, self-review

**Stage 5**: Validate → Run tests, verify criteria met

**Stage 6**: Complete → Update API docs, summarize changes

### Complex Task: "Build user authentication system"

**Stage 1**: Analyze → Invoke `/context-discovery` → Get auth patterns, security standards, architecture guides

**Stage 2**: Plan → "Multi-phase: JWT service, middleware, endpoints, tests" → Request approval

**Stage 3**: Load context → Read all discovered context files

**Stage 4**: Execute → Invoke `/task-breakdown` → TaskManager creates subtasks → Execute subtasks using `/code-execution`, `/test-generation`, `/code-review`

**Stage 5**: Validate → Run full test suite, verify all acceptance criteria

**Stage 6**: Complete → Update docs, summarize implementation, archive session

---

## Anti-Patterns to Avoid

❌ **Skipping Stage 1** - Coding without context discovery leads to inconsistent patterns

❌ **Skipping Stage 2 approval** - Implementing without user buy-in wastes effort

❌ **Nested subagent calls** - Subagents calling other subagents (not supported in Claude Code)

❌ **Context discovery during execution** - Should be done in Stage 1, loaded in Stage 3

❌ **Proceeding with failed validation** - Stage 5 failures must be fixed before Stage 6

---

## Session Management (Complex Tasks)

For complex tasks requiring TaskManager delegation:

**Session Location**: `.tmp/sessions/{YYYY-MM-DD}-{task-slug}/`

**Session Files**:
- `context.md` - Task context, discovered files, requirements
- `progress.md` - Execution progress tracking

**Cleanup**: After Stage 6, ask user if session files should be deleted

---

## Related Skills

- `context-discovery` - Stage 1 context discovery
- `external-scout` - Stage 3 external library documentation
- `task-breakdown` - Stage 4 complex task delegation
- `code-execution` - Stage 4 code implementation
- `test-generation` - Stage 4 test creation
- `code-review` - Stage 4 code review

---

## Success Criteria

✅ Every task follows all 6 stages in order

✅ Context discovered before execution

✅ User approval obtained before implementation

✅ All context pre-loaded (no nested discovery)

✅ Validation passes before completion

✅ Documentation updated and task summarized
