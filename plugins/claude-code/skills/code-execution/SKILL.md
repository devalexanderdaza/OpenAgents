---
name: code-execution
description: Execute coding subtasks with self-review and quality validation. Use when implementing features, refactoring code, creating new files, or modifying existing code. Invokes the coder-agent subagent for isolated execution.
context: fork
agent: coder-agent
---

# Code Execution Skill

Execute coding subtask: $ARGUMENTS

## Context

You are running in the **coder-agent subagent** with isolated context. The main agent has pre-loaded all necessary context files and created the subtask JSON.

## Your Task

1. **Read the subtask JSON** at the path provided in $ARGUMENTS
2. **Load all context_files** listed in the subtask (standards, patterns, conventions)
3. **Load all reference_files** to understand existing code patterns
4. **Implement deliverables** following acceptance criteria exactly
5. **Run self-review** (type validation, import verification, anti-pattern scan)
6. **Mark subtask complete** using task-cli.ts
7. **Return completion report** to main agent

## Workflow

### Step 1: Read Subtask JSON

The subtask path is: $ARGUMENTS

Read it to understand:
- `title` — What to implement
- `acceptance_criteria` — What defines success
- `deliverables` — Files/endpoints to create
- `context_files` — Standards to apply (pre-discovered by main agent)
- `reference_files` — Existing code to study

### Step 2: Load Context Files

Read each file in `context_files` to understand:
- Project coding standards
- Naming conventions
- Security patterns
- Code quality requirements

### Step 3: Load Reference Files

Read each file in `reference_files` to understand:
- Existing patterns
- Code structure
- Conventions already in use

### Step 4: Update Status

Use `edit` to update the subtask JSON:

```json
"status": "in_progress",
"agent_id": "coder-agent",
"started_at": "2026-02-16T00:00:00Z"
```

### Step 5: Implement Deliverables

For each deliverable:
- Create or modify the specified file
- Follow acceptance criteria exactly
- Apply standards from context_files
- Use patterns from reference_files
- Write clean, modular, functional code

### Step 6: Self-Review (MANDATORY)

Run ALL checks:

**Type & Import Validation**:
- Verify function signatures match usage
- Confirm all imports/exports exist
- Check for missing type annotations
- Verify no circular dependencies

**Anti-Pattern Scan** (use `grep`):
- `console.log` — debug statements
- `TODO` or `FIXME` — unfinished work
- Hardcoded secrets or API keys
- Missing error handling in async functions
- `any` types where specific types required

**Acceptance Criteria Verification**:
- Re-read acceptance_criteria array
- Confirm EACH criterion is met
- Fix any unmet criteria before proceeding

### Step 7: Mark Complete

Update subtask status:

```bash
bash .opencode/skills/task-management/router.sh complete {feature} {seq} "{completion_summary}"
```

Verify completion:

```bash
bash .opencode/skills/task-management/router.sh status {feature}
```

### Step 8: Return Completion Report

Report to main agent:

```
✅ Subtask {feature}-{seq} COMPLETED

Self-Review: ✅ Types clean | ✅ Imports verified | ✅ No debug artifacts | ✅ All acceptance criteria met

Deliverables:
- {file1}
- {file2}
- {file3}

Summary: {completion_summary}
```

## Principles

- **Context first, code second** — Always read context_files before implementing
- **One subtask at a time** — Complete fully before moving on
- **Self-review is mandatory** — Quality gate before signaling done
- **Functional, declarative, modular** — Clean code patterns
- **Return results to main agent** — Report completion for orchestration

## When Main Agent Should Use This Skill

The main agent should invoke this skill when:

- **Implementing new features** — Creating new files, functions, or modules
- **Refactoring existing code** — Improving structure, performance, or maintainability
- **Fixing bugs** — Modifying code to resolve issues
- **Adding functionality** — Extending existing code with new capabilities
- **Creating tests** — Writing unit, integration, or e2e tests (though test-generation skill is preferred)

## What Main Agent Must Do First

Before invoking this skill, the main agent MUST:

1. **Discover context** using context-discovery skill
2. **Create subtask JSON** with all required fields:
   - `title`, `acceptance_criteria`, `deliverables`
   - `context_files` (from context-discovery)
   - `reference_files` (existing code to study)
3. **Get approval** from user for the implementation plan
4. **Pass subtask JSON path** as $ARGUMENTS to this skill

## Example Usage

Main agent workflow:

```
1. User: "Implement JWT authentication"

2. Main agent invokes: /context-discovery "JWT authentication patterns"
   → Returns: security patterns, auth standards, coding conventions

3. Main agent creates: .tmp/tasks/auth-system/subtask_01.json
   → Includes: context_files, acceptance_criteria, deliverables

4. Main agent presents plan and gets approval

5. Main agent invokes: /code-execution ".tmp/tasks/auth-system/subtask_01.json"
   → Coder-agent executes in isolated context
   → Returns completion report

6. Main agent continues orchestration
```

## Notes

- This skill runs in **isolated context** (coder-agent subagent)
- Context files are **pre-loaded** by main agent (no nested ContextScout calls)
- Results are **returned to main agent** for orchestration
- Main agent handles **workflow progression** and **approval gates**
