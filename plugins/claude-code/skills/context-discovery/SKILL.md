---
name: context-discovery
description: Discover context files for a task. Use when you need coding standards, security patterns, workflows, or project-specific context before implementing a feature. Invokes the context-scout subagent to find and rank relevant files from .opencode/context/.
context: fork
agent: context-scout
---

# Context Discovery Skill

> **Purpose**: Discover and load context files before implementing features. This skill invokes the `context-scout` subagent to find relevant standards, patterns, and workflows from `.opencode/context/`.

---

## When to Use This Skill

Invoke `/context-discovery` when you need to:

- **Find coding standards** before writing code
- **Discover security patterns** before implementing auth, data handling, or user input
- **Locate workflow guides** before breaking down complex tasks
- **Find project-specific context** before modifying existing features
- **Identify naming conventions** before creating new files or modules
- **Understand architectural patterns** before designing new components

**Rule of thumb**: If you're about to write code or create a plan, discover context FIRST.

---

## How It Works

This skill runs in the `context-scout` subagent (isolated context) and:

1. **Analyzes your request** — Understands what context you need
2. **Follows navigation** — Discovers files via `.opencode/context/navigation.md`
3. **Ranks results** — Returns Critical → High → Medium priority files
4. **Returns to main agent** — You load the recommended files

---

## Usage

### Basic Usage

```
/context-discovery [what you're implementing]
```

**Examples**:
```
/context-discovery authentication system
/context-discovery React component with animations
/context-discovery task breakdown workflow
/context-discovery TypeScript coding standards
```

### What You'll Get Back

The context-scout subagent returns a ranked list of context files:

```markdown
# Context Files Found

## Critical Priority

**File**: `.opencode/context/core/standards/code-quality.md`
**Contains**: Code quality standards, functional patterns, error handling
**Why**: Defines coding patterns you must follow for all implementations

## High Priority

**File**: `.opencode/context/core/standards/security-patterns.md`
**Contains**: Security best practices, auth patterns, data protection
**Why**: Important for secure implementation

## Medium Priority

**File**: `.opencode/context/core/workflows/approval-gates.md`
**Contains**: When to request approval before execution
**Why**: Helps you know when to pause for approval

---

**Summary**: Found 3 context files. Start with Critical priority files.
```

---

## What to Do with Results

### Step 1: Load Critical Priority Files

Read every file marked as **Critical Priority** before proceeding:

```
Read: .opencode/context/core/standards/code-quality.md
Read: .opencode/context/core/standards/security-patterns.md
```

These files contain **must-follow** standards and patterns.

### Step 2: Load High Priority Files

Read **High Priority** files for important context:

```
Read: .opencode/context/core/workflows/approval-gates.md
```

These files provide **strongly recommended** guidance.

### Step 3: Load Medium Priority Files (Optional)

Read **Medium Priority** files if you need additional context:

```
Read: .opencode/context/project-intelligence/architecture.md
```

These files are **helpful but not required**.

### Step 4: Apply Context to Your Work

- **Follow standards** from loaded files
- **Apply patterns** to your implementation
- **Check workflows** before executing
- **Use naming conventions** from context

---

## Passing Results to Other Subagents

When you need to delegate work to another subagent (e.g., `coder-agent`, `task-manager`), include the discovered context files in your delegation:

### Example: Task Breakdown with Context

```markdown
Invoke task-manager subagent:

**Task**: Break down authentication system into subtasks

**Context to load first**:
- .opencode/context/core/standards/code-quality.md
- .opencode/context/core/standards/security-patterns.md
- .opencode/context/core/workflows/task-delegation-basics.md

**Instructions**: Create subtask files following the task.json schema. Apply security patterns from context.
```

### Example: Code Implementation with Context

```markdown
Invoke coder-agent subagent:

**Task**: Implement JWT authentication service

**Context to load first**:
- .opencode/context/core/standards/code-quality.md
- .opencode/context/core/standards/security-patterns.md
- .opencode/context/core/standards/typescript.md

**Instructions**: Follow functional patterns and security best practices from loaded context.
```

---

## Integration with OAC Workflow

This skill is part of the **6-stage OAC workflow**:

### Stage 1: Analyze & Discover (YOU ARE HERE)
- **Action**: Invoke `/context-discovery` to find relevant context
- **Output**: Ranked list of context files

### Stage 2: Plan & Approve
- **Action**: Load discovered context files
- **Action**: Create implementation plan
- **Action**: REQUEST APPROVAL before proceeding

### Stage 3: LoadContext
- **Action**: Read all Critical and High priority files
- **Action**: Understand standards, patterns, workflows

### Stage 4: Execute
- **Simple tasks**: Implement directly
- **Complex tasks**: Invoke `/task-breakdown` to create subtasks

### Stage 5: Validate
- **Action**: Run tests, verify implementation
- **Action**: STOP on failure

### Stage 6: Complete
- **Action**: Update docs, summarize changes

---

## Common Scenarios

### Scenario 1: Starting a New Feature

**You**: "I need to implement user authentication"

**Action**:
```
/context-discovery user authentication
```

**Result**: Context-scout finds security patterns, coding standards, auth workflows

**Next Steps**:
1. Load Critical priority files
2. Create implementation plan
3. Request approval
4. Implement following loaded standards

---

### Scenario 2: Unclear Project Patterns

**You**: "I'm not sure how to structure this React component"

**Action**:
```
/context-discovery React component patterns
```

**Result**: Context-scout finds UI patterns, React standards, component structure guides

**Next Steps**:
1. Load recommended files
2. Apply patterns to component design
3. Implement following standards

---

### Scenario 3: Before Task Breakdown

**You**: "I need to break down a complex feature"

**Action**:
```
/context-discovery task breakdown workflow
```

**Result**: Context-scout finds task delegation guides, subtask schemas, workflow patterns

**Next Steps**:
1. Load workflow guides
2. Invoke `/task-breakdown` with context
3. Create subtasks following schema

---

## What NOT to Do

- ❌ **Don't skip context discovery** — Always discover context before implementing
- ❌ **Don't ignore Critical priority files** — These are mandatory, not optional
- ❌ **Don't assume you know the standards** — Training data is outdated, context is current
- ❌ **Don't implement before loading context** — Context first, code second
- ❌ **Don't pass unverified file paths** — Only use paths returned by context-scout

---

## Troubleshooting

### "No context files found"

**Cause**: Context hasn't been downloaded yet

**Solution**: Run `/oac:setup` to download context from GitHub

### "Context-scout returned too many files"

**Cause**: Request was too broad

**Solution**: Be more specific in your request (e.g., "TypeScript coding standards" instead of "coding")

### "Not sure which files to load"

**Cause**: Unclear prioritization

**Solution**: Always start with Critical priority files, then High, then Medium if needed

---

## Principles

- **Context first, code second** — Always discover context before implementing
- **Follow navigation** — Context-scout uses navigation.md files to find relevant context
- **Prioritize wisely** — Critical files are mandatory, High are recommended, Medium are optional
- **Pass context forward** — When delegating to subagents, include discovered context files
- **Verify paths** — Only use file paths returned by context-scout (they're verified to exist)

---

## Task

Discover context files for: **$ARGUMENTS**

Follow the navigation-driven discovery process and return ranked recommendations.
