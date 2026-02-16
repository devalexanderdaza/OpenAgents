# OAC Plugin - Quick Start Guide

**Version**: 1.0.0  
**Date**: 2026-02-16  
**Status**: ✅ Production Ready

---

## 🚀 Getting Started (3 Steps)

### 1. Install the Plugin

```bash
# From GitHub marketplace
/plugin marketplace add darrenhinde/OpenAgentsControl
/plugin install oac

# OR for local development
claude --plugin-dir ./plugins/claude-code
```

### 2. Download Context Files

```bash
# Download core context (recommended)
/oac:setup --core

# OR download everything
/oac:setup --all
```

### 3. Verify Installation

```bash
# Check status
/oac:status

# View help
/oac:help
```

**You're ready!** Start any development task and the `/using-oac` skill will automatically guide you.

---

## 📋 Quick Reference: 9 Skills

### 1. `/using-oac` - Main Workflow Orchestrator
**Auto-invoked on every task** to ensure context-aware development.

**6-Stage Workflow**:
1. **Analyze & Discover** - Understand task, find context files
2. **Plan & Approve** - Present plan, REQUEST APPROVAL
3. **LoadContext** - Pre-load all context files (internal + external)
4. **Execute** - Implement (direct or via task breakdown)
5. **Validate** - Run tests, STOP on failure
6. **Complete** - Update docs, summarize

**When to use**: Automatically invoked (you don't need to call it manually).

---

### 2. `/context-discovery` - Find Relevant Context
Guides the main agent to use the `context-scout` subagent for discovering standards and patterns.

**Usage**:
```
/context-discovery authentication feature
```

**What it does**:
- Searches `.opencode/context/` for relevant files
- Prioritizes by relevance (Critical → High → Medium)
- Returns list of files to load

**Example output**:
```
Critical:
- .opencode/context/core/standards/security.md
- .opencode/context/core/patterns/authentication.md

High:
- .opencode/context/core/standards/typescript.md
```

---

### 3. `/external-scout` - Fetch External Library Docs
Guides the main agent to use the `external-scout` subagent for fetching current API documentation.

**Usage**:
```
/external-scout drizzle schemas
/external-scout react hooks
/external-scout express middleware
```

**What it does**:
- Fetches current documentation from Context7 and other sources
- Caches results in `.tmp/external-context/` (fresh for 7 days)
- Returns file paths to load
- Ensures you're using current API patterns (not outdated training data)

**Example output**:
```json
{
  "status": "success",
  "package": "drizzle",
  "topic": "schemas",
  "files": [".tmp/external-context/drizzle/schemas.md"],
  "message": "Documentation cached. Load file to access current API patterns."
}
```

**Why it matters**: Training data is outdated. External libraries change their APIs, deprecate features, and introduce new patterns. ExternalScout ensures you're implementing with current, correct patterns.

---

### 4. `/task-breakdown` - Decompose Complex Features
Guides the main agent to use the `task-manager` subagent for breaking down complex tasks.

**Usage**:
```
/task-breakdown user authentication system
```

**What it does**:
- Breaks feature into atomic subtasks (1-2 hours each)
- Creates dependency graph
- Generates subtask JSON files in `.tmp/tasks/`
- Enables parallel execution where possible

**Example output**:
```
Subtasks created:
1. JWT service implementation
2. Auth middleware (depends on #1)
3. Login endpoint (depends on #1, #2)
4. Refresh token logic (depends on #1)
5. Integration tests (depends on all)
```

---

### 5. `/code-execution` - Implement Features
Guides the main agent to use the `coder-agent` subagent for implementing code.

**Usage**:
```
/code-execution implement JWT service
```

**What it does**:
- Implements features following loaded context
- Applies coding standards and patterns
- Runs self-review before completion
- Updates subtask status if part of task breakdown

**Self-Review Checks**:
- ✅ Type & import validation
- ✅ Anti-pattern scan (console.log, TODO, hardcoded secrets)
- ✅ Acceptance criteria verification
- ✅ External library verification

---

### 6. `/test-generation` - Create Comprehensive Tests
Guides the main agent to use the `test-engineer` subagent for generating tests.

**Usage**:
```
/test-generation authentication service
```

**What it does**:
- Generates tests following TDD principles
- Covers happy paths, edge cases, error handling
- Follows test standards from context
- Ensures test isolation and clarity

**Test Coverage**:
- Unit tests for individual functions
- Integration tests for workflows
- Edge cases and error scenarios
- Security validation tests

---

### 7. `/code-review` - Review Code Quality
Guides the main agent to use the `code-reviewer` subagent for reviewing code.

**Usage**:
```
/code-review src/auth/
```

**What it does**:
- Reviews code for quality and standards compliance
- Checks security patterns
- Identifies anti-patterns
- Suggests improvements

**Review Areas**:
- Code quality and readability
- Security vulnerabilities
- Performance issues
- Standards compliance
- Test coverage

---

### 8. `/context-manager` - Manage Context & Configuration
Manage context files, configuration, and project-specific settings.

**Usage**:
```
/context-manager
```

**What it does**:
- Set up new projects with OAC context files
- Configure context sources and download preferences
- Integrate external task systems (SpecKit, Linear, Jira, custom)
- Manage personal context files and templates
- Troubleshoot context loading or configuration issues
- Update or refresh downloaded context files

**Use when**:
- Setting up a new project
- Configuring .oac file
- Integrating with external task management
- Managing personal templates and preferences

---

### 9. `/parallel-execution` - Execute Tasks in Parallel
Execute multiple independent tasks simultaneously to reduce implementation time.

**Usage**:
```
# Automatically used when task-manager marks tasks with parallel:true
# Or invoke manually for independent work
```

**What it does**:
- Execute multiple independent tasks simultaneously
- Dramatically reduce implementation time for multi-component features
- Coordinate parallel work streams (frontend + backend + tests)
- Monitor progress and handle failures gracefully

**Use when**:
- Multiple independent tasks with no dependencies
- Multi-component features (frontend + backend + tests)
- Time-sensitive delivery
- Batch operations (converting files, running tests)

**Time savings**: 50-80% reduction for multi-component features

---

## 🎮 Quick Reference: 4 Commands

### 1. `/oac:setup` - Download Context Files

**Usage**:
```bash
/oac:setup                    # Interactive mode
/oac:setup --core             # Core context only (~50 files)
/oac:setup --all              # All context (~200 files)
/oac:setup --category=standards  # Specific category
```

**What it downloads**:
- Coding standards and conventions
- Architecture patterns
- Security guidelines
- Workflow guides
- Domain-specific documentation

**Output**: Creates `.opencode/context/` and `.context-manifest.json`

---

### 2. `/oac:help` - Show Usage Guide

**Usage**:
```bash
/oac:help                     # General help
/oac:help context-discovery   # Skill-specific help
```

**What it shows**:
- 6-stage workflow overview
- Available subagents and when to use them
- Available skills and usage examples
- Available commands
- Quick start examples
- Troubleshooting guide

---

### 3. `/oac:status` - Check Installation Status

**Usage**:
```bash
/oac:status
```

**What it shows**:
- Plugin version
- Context installation status
- Active sessions count
- Available subagents (6)
- Available skills (9)
- Available commands (4)
- Recommendations for cleanup or setup

---

### 4. `/oac:cleanup` - Clean Up Temporary Files

**Usage**:
```bash
/oac:cleanup                          # Interactive mode
/oac:cleanup --force                  # Skip confirmation
/oac:cleanup --session-days=3         # Clean sessions older than 3 days
/oac:cleanup --task-days=14           # Clean tasks older than 14 days
/oac:cleanup --external-days=3        # Clean external context older than 3 days
```

**What it cleans**:
- Old session files from `.tmp/sessions/`
- Completed task files from `.tmp/tasks/`
- Cached external documentation from `.tmp/external-context/`

**Default retention**:
- Sessions: 7 days
- Completed tasks: 30 days
- External context: 7 days

**Example**:
```bash
# Clean with defaults
/oac:cleanup

# Aggressive cleanup
/oac:cleanup --session-days=3 --task-days=14 --external-days=3 --force
```

---

## 💡 Example Workflows

### Example 1: Simple Feature (Direct Implementation)

**Task**: "Add a login endpoint"

**Workflow**:
```
1. Analyze & Discover
   - Understand: Need POST /api/login endpoint
   - Invoke /context-discovery → finds API standards, security patterns

2. Plan & Approve
   - Plan: Create endpoint in src/api/auth.ts
   - Files: auth.ts, auth.test.ts, api-docs.md
   - REQUEST APPROVAL ← User approves

3. LoadContext
   - Read API standards
   - Read security patterns
   - Read TypeScript conventions
   - (If using external libs) Invoke /external-scout for current API docs

4. Execute
   - Implement endpoint directly (simple task)
   - Follow loaded standards

5. Validate
   - Run tests
   - Verify acceptance criteria

6. Complete
   - Update API docs
   - Summarize changes
```

**Time**: ~15-30 minutes

---

### Example 2: Complex Feature (Task Breakdown)

**Task**: "Build a complete authentication system"

**Workflow**:
```
1. Analyze & Discover
   - Understand: Full auth system (JWT, refresh, middleware, endpoints)
   - Invoke /context-discovery → finds security, API, TypeScript standards

2. Plan & Approve
   - Plan: Multi-component system, suggest task breakdown
   - Complexity: 4+ files, >30 min
   - REQUEST APPROVAL ← User approves

3. LoadContext
   - Read security patterns
   - Read API standards
   - Read TypeScript conventions
   - Read test standards
   - Invoke /external-scout for any external libraries (e.g., JWT library, database ORM)

4. Execute
   - Invoke /task-breakdown → creates subtasks:
     * Subtask 1: JWT service (core logic)
     * Subtask 2: Auth middleware (depends on #1)
     * Subtask 3: Login endpoint (depends on #1, #2)
     * Subtask 4: Refresh endpoint (depends on #1)
     * Subtask 5: Integration tests (depends on all)
   
   - For each subtask:
     * Invoke /code-execution
     * Implement following loaded context
     * Run self-review
     * Mark subtask complete

5. Validate
   - Run all integration tests
   - Verify system works end-to-end
   - STOP if any test fails

6. Complete
   - Update API documentation
   - Update security documentation
   - Summarize all changes
```

**Time**: ~2-4 hours (broken into 1-2 hour subtasks)

---

### Example 3: Using Subagents Directly

**Task**: "Review and test the authentication system"

**Workflow**:
```
# Step 1: Discover context
Use the context-scout subagent to find:
- Security review checklists
- Test standards
- Code quality guidelines

# Step 2: Review code
Use the code-reviewer subagent to review:
- src/auth/ directory
- Check security patterns
- Identify issues

# Step 3: Generate tests
Use the test-engineer subagent to create:
- Unit tests for JWT service
- Integration tests for auth flow
- Security validation tests

# Step 4: Verify
Run tests and confirm all pass
```

---

## 🏗️ Architecture: Flattened Delegation

OAC for Claude Code uses a **flattened hierarchy** (no nested subagent calls):

### ❌ Traditional OAC (Not Allowed in Claude Code)
```
Main Agent
  └─> TaskManager
       └─> CoderAgent
            └─> ContextScout (nested - not allowed)
```

### ✅ Claude Code OAC (Flattened)
```
Main Agent (orchestrated by /using-oac skill)
  ├─> task-manager subagent
  ├─> context-scout subagent
  ├─> coder-agent subagent
  ├─> test-engineer subagent
  └─> code-reviewer subagent
```

**How it works**:
1. **Skills** guide the main agent's workflow (when to invoke which subagent)
2. **Main agent** invokes subagents directly (no nesting)
3. **Context** is pre-loaded in Stage 3 (no nested ContextScout calls during execution)
4. **Subagents** return results to main agent for orchestration

---

## 🆘 Troubleshooting

### "Context files not found"
```bash
# Download context
/oac:setup --core

# Verify installation
/oac:status
```

### "Subagent not available"
```bash
# Check status
/oac:status

# Should show 6 subagents
# If missing, reinstall plugin
```

### "Approval not requested"
```bash
# This is a bug - OAC should ALWAYS request approval in Stage 2
# Please report at: https://github.com/darrenhinde/OpenAgentsControl/issues
```

### "Nested subagent call error"
```bash
# Claude Code doesn't support nested calls
# Use skills to orchestrate, not subagents calling subagents
# The /using-oac skill handles this automatically
```

### "Tests failing in Stage 5"
```bash
# This is expected behavior - OAC stops on test failure
# Fix the failing tests before proceeding
# Re-run validation after fixes
```

---

## 🎯 Best Practices

### 1. Context First, Code Second
Always let the workflow discover and load context before implementing. This ensures your code follows project standards.

### 2. Approve Before Execution
Review the plan in Stage 2 carefully. Once approved, OAC will execute automatically.

### 3. Break Down Complex Tasks
For features with 4+ files or >30 min work, use task breakdown for better tracking and parallel execution.

### 4. Trust the Self-Review
CoderAgent runs comprehensive checks before completion. If it passes, the code is ready.

### 5. Use Status Commands
Run `/oac:status` regularly to check installation and active sessions.

---

## 📚 Learn More

- **Installation**: See `INSTALL.md` for detailed setup
- **Full Help**: Run `/oac:help` for comprehensive guide
- **Architecture**: See `README.md` for system overview
- **Context Files**: Explore `.opencode/context/` after running `/oac:setup`

---

## 🔗 Quick Links

| Resource | Command/Link |
|----------|--------------|
| Check Status | `/oac:status` |
| Get Help | `/oac:help` |
| Download Context | `/oac:setup --core` |
| GitHub Issues | https://github.com/darrenhinde/OpenAgentsControl/issues |
| Discussions | https://github.com/darrenhinde/OpenAgentsControl/discussions |

---

**Ready to build!** 🎉

Start any development task and let the `/using-oac` skill guide you through context-aware development.
