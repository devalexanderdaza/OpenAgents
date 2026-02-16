---
name: code-review
description: Review code for security, correctness, and quality before commits or after refactoring. Use when you need to validate code changes, check for security vulnerabilities, or ensure code quality standards are met.
context: fork
agent: code-reviewer
---

# Code Review Skill

Review code changes using the specialized code-reviewer subagent. This skill performs comprehensive code analysis for security vulnerabilities, correctness issues, style violations, and maintainability concerns.

## When to Use This Skill

Invoke `/code-review` when:

- **Before committing code** — validate changes meet quality standards
- **After refactoring** — ensure refactored code maintains correctness
- **Security-sensitive changes** — review authentication, authorization, data handling
- **Complex logic changes** — verify correctness of algorithms or business logic
- **Before pull requests** — catch issues before code review
- **After dependency updates** — check for breaking changes or security issues

## How to Use

### Basic Usage

```
/code-review path/to/file.ts
```

### Review Multiple Files

```
/code-review src/auth/*.ts
```

### Review with Specific Focus

```
/code-review src/api/handler.ts --focus security
```

### Review Recent Changes

```
/code-review $(git diff --name-only HEAD~1)
```

## Pre-Loading Context (IMPORTANT)

**Before invoking this skill**, the main agent should load relevant context files:

1. **Code Quality Standards** — `.opencode/context/core/standards/code-quality.md`
2. **Security Patterns** — `.opencode/context/core/standards/security-patterns.md`
3. **TypeScript Standards** — `.opencode/context/core/standards/typescript.md`
4. **Project-Specific Conventions** — Any project naming or style guides

**Example workflow**:
```markdown
1. Read code quality standards
2. Read security patterns
3. Invoke /code-review with file paths
4. Interpret results (see below)
```

## What the Reviewer Checks

The code-reviewer subagent performs a comprehensive analysis:

### 🔴 CRITICAL (Security Vulnerabilities)
- SQL injection risks
- XSS vulnerabilities
- Hardcoded credentials or API keys
- Path traversal risks
- Command injection
- Exposed secrets
- Missing authentication/authorization

### 🟠 HIGH (Correctness Issues)
- Missing error handling (async without try/catch)
- Type mismatches
- Null/undefined handling gaps
- Logic errors (off-by-one, race conditions)
- Missing imports or circular dependencies

### 🟡 MEDIUM (Style & Maintainability)
- Naming convention violations
- Code duplication (DRY violations)
- Poor code organization
- Missing comments on complex logic
- Overly complex functions

### 🟢 LOW (Suggestions)
- Performance optimizations
- Documentation improvements
- Test coverage gaps
- Refactoring opportunities

## Interpreting Results

The code-reviewer returns a structured report:

```markdown
## Code Review: [Feature/File]

### 🔴 CRITICAL Issues (Must Fix)
1. **SQL Injection Risk** — `src/db/query.ts:42`
   - **Problem**: Unparameterized query with user input
   - **Risk**: Database compromise
   - **Fix**: Use parameterized queries
   - **Diff**:
     ```diff
     - db.query(`SELECT * FROM users WHERE id = ${userId}`)
     + db.query('SELECT * FROM users WHERE id = ?', [userId])
     ```

### Summary
- **Total Issues**: 12 (3 Critical, 4 High, 3 Medium, 2 Low)
- **Blocking Issues**: 7
- **Recommendation**: REQUEST CHANGES
```

## Action Based on Results

### If CRITICAL or HIGH issues found:
1. **STOP** — Do not commit or merge
2. **Fix issues** — Apply suggested changes
3. **Re-review** — Run `/code-review` again after fixes
4. **Verify** — Ensure all blocking issues resolved

### If only MEDIUM or LOW issues:
1. **Evaluate** — Decide if fixes should be in this PR or follow-up
2. **Apply fixes** — Address issues that improve code quality
3. **Document** — If deferring fixes, create follow-up tasks
4. **Proceed** — Safe to commit/merge

### If no issues found:
1. **Celebrate** — Code meets quality standards
2. **Commit** — Proceed with confidence
3. **Document** — Note positive patterns for team learning

## Example Workflow

### Scenario: Review authentication changes before commit

```markdown
**Step 1: Load Context**
Read the following files:
- .opencode/context/core/standards/security-patterns.md
- .opencode/context/core/standards/code-quality.md

**Step 2: Invoke Review**
/code-review src/auth/service.ts src/auth/middleware.ts

**Step 3: Analyze Results**
Review report shows:
- 1 CRITICAL: Hardcoded JWT secret
- 2 HIGH: Missing error handling in async functions
- 1 MEDIUM: Inconsistent naming (camelCase vs snake_case)

**Step 4: Take Action**
- Fix CRITICAL: Move JWT secret to environment variable
- Fix HIGH: Add try/catch blocks with proper error logging
- Fix MEDIUM: Standardize naming to camelCase
- Re-run /code-review to verify fixes

**Step 5: Commit**
All blocking issues resolved → Safe to commit
```

## Integration with OAC Workflow

This skill integrates with the OpenAgents Control 6-stage workflow:

- **Stage 4 (Execute)**: After implementing code, invoke `/code-review` before marking complete
- **Stage 5 (Validate)**: Use review results as validation gate
- **Stage 6 (Complete)**: Only proceed if no blocking issues

## Tips for Effective Reviews

1. **Review early and often** — Catch issues before they compound
2. **Focus reviews** — Use `--focus security` for security-sensitive changes
3. **Review incrementally** — Review files as you complete them, not all at once
4. **Learn from findings** — Positive observations highlight good patterns
5. **Pre-load context** — Always load standards before reviewing
6. **Act on results** — Don't ignore CRITICAL or HIGH findings

## What the Reviewer Does NOT Do

- ❌ **Does not modify code** — Provides suggested diffs only
- ❌ **Does not run tests** — Use `/test-generation` skill for testing
- ❌ **Does not deploy** — Review is a quality gate, not deployment
- ❌ **Does not replace human review** — Complements, doesn't replace peer review

## Related Skills

- `/context-discovery` — Find code quality standards before reviewing
- `/test-generation` — Generate tests for reviewed code
- `/code-execution` — Implement fixes suggested by reviewer

---

## Skill Execution

When you invoke `/code-review $ARGUMENTS`, this skill:

1. **Forks to code-reviewer subagent** — Isolated context for focused review
2. **Passes file paths** — `$ARGUMENTS` contains files to review
3. **Expects pre-loaded context** — Main agent should load standards first
4. **Returns structured report** — Findings organized by severity
5. **Exits back to main agent** — Results available for action

**Review the following files**: $ARGUMENTS

**Instructions for code-reviewer subagent**:

1. Read all files specified in the arguments
2. Apply pre-loaded code quality standards, security patterns, and conventions
3. Perform comprehensive analysis:
   - Security scan (HIGHEST PRIORITY)
   - Correctness review
   - Style & convention check
   - Performance & maintainability assessment
4. Structure findings by severity (CRITICAL → HIGH → MEDIUM → LOW)
5. For each finding, provide:
   - Clear problem description
   - Risk/impact assessment
   - Suggested fix with code diff
6. Include positive observations (what was done well)
7. Return structured report with recommendation (APPROVE | REQUEST CHANGES | COMMENT)

**Output format**: Use the structured markdown format defined in the code-reviewer agent (see Step 8 of Review Workflow).
