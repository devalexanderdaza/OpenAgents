---
name: task-breakdown
description: Break down complex features into atomic, verifiable subtasks with dependency tracking. Use when implementing multi-step workflows, complex features requiring multiple files, or when the user requests task planning.
context: fork
agent: task-manager
---

# Task Breakdown

Break down this feature into atomic, verifiable subtasks: $ARGUMENTS

## Your Task

Create a structured task breakdown following the JSON schema:

1. **Analyze the feature**:
   - Identify core objective and scope
   - Determine technical risks and dependencies
   - Find natural task boundaries
   - Identify which tasks can run in parallel

2. **Create task plan**:
   - Feature ID (kebab-case)
   - Objective (max 200 chars)
   - Context files (standards to follow)
   - Reference files (source material to study)
   - Exit criteria (completion requirements)

3. **Generate subtasks**:
   - Sequential numbering (01, 02, 03...)
   - Clear title for each
   - Dependencies mapped via `depends_on`
   - Parallel flags set for isolated tasks
   - Suggested agent assigned
   - Acceptance criteria (binary pass/fail)
   - Deliverables (specific file paths or endpoints)

4. **Create JSON files**:
   - `.tmp/tasks/{feature}/task.json` - Feature metadata
   - `.tmp/tasks/{feature}/subtask_01.json` - First subtask
   - `.tmp/tasks/{feature}/subtask_02.json` - Second subtask
   - ... (one file per subtask)

5. **Validate structure**:
   - All JSON files are valid
   - Dependency references exist
   - Context files vs reference files are separated
   - Acceptance criteria are binary
   - Deliverables are specific

## Critical Rules

- **Atomic tasks**: Each subtask completable in 1-2 hours
- **Context separation**: 
  - `context_files` = standards/conventions ONLY
  - `reference_files` = project source files ONLY
  - Never mix them
- **Binary criteria**: Pass/fail only, no ambiguity
- **Parallel identification**: Mark isolated tasks as `parallel: true`
- **Agent assignment**: Suggest appropriate agent for each subtask
  - "CoderAgent" - Implementation tasks
  - "TestEngineer" - Test creation
  - "CodeReviewer" - Review tasks
  - "OpenFrontendSpecialist" - UI/design tasks

## When to Use This Skill

Use task-breakdown when:
- Feature requires multiple files or components
- Implementation has clear sequential steps
- Tasks have dependencies that need tracking
- Work can be parallelized across isolated areas
- User explicitly requests task planning
- Feature is complex enough to benefit from structured breakdown

## Output Format

Return a summary:
```
## Tasks Created

Location: .tmp/tasks/{feature}/
Files: task.json + {N} subtasks

Subtasks:
- 01: {title} (parallel: {true/false}, agent: {suggested_agent})
- 02: {title} (parallel: {true/false}, agent: {suggested_agent})
...

Next Steps:
- Execute subtasks in order
- Parallel tasks can run simultaneously
- Use task-cli.ts for status tracking
```

## Example Task Structure

**task.json**:
```json
{
  "id": "jwt-auth",
  "name": "JWT Authentication System",
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
    "JWT tokens signed with RS256"
  ],
  "subtask_count": 3,
  "completed_count": 0,
  "created_at": "2026-02-16T02:00:00Z"
}
```

**subtask_01.json**:
```json
{
  "id": "jwt-auth-01",
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
    "Access tokens expire in 15 minutes"
  ],
  "deliverables": [
    "src/auth/jwt.service.ts",
    "src/auth/jwt.service.test.ts"
  ]
}
```

## Quality Standards

- Clear objectives: Single, measurable outcome per task
- Explicit deliverables: Specific files or endpoints
- Context references: Reference paths, don't embed content
- Summary length: Max 200 characters for completion_summary
- Dependency tracking: Explicit `depends_on` arrays
- Parallelization: Mark isolated tasks for concurrent execution
