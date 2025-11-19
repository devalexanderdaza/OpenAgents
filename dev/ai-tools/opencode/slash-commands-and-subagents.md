# Clear Guidelines: Main Agent → Slash Command → Subagent

## The Complete Pattern

### Step 1: Create Your Command (Template Only)

```markdown
# .opencode/command/security/scan.md
---
description: "Security vulnerability scan"
# NO agent field - let caller decide
---

Perform security scan on: $ARGUMENTS

@$1
@AGENTS.md
@.cursorrules

Check for:
- SQL injection
- XSS vulnerabilities
- Authentication issues
```

### Step 2: Create Your Subagent

```markdown
# .opencode/agent/security/scanner.md
---
mode: "subagent"
description: "Security vulnerability detection specialist"
tools:
  read: true
  grep: true
---

You are a security expert. Scan code for vulnerabilities.
```

### Step 3: Document in AGENTS.md (CRITICAL)

```markdown
# AGENTS.md

## Slash Commands for Subagents

When you need specialized workflows, use the Task tool with slash commands:

### Pattern

```
Task(
  subagent_type="[subagent-name]",
  prompt="/command-name arguments"
)
```

### Available Commands

**Security:**
- `/security/scan [file]`
  - Use: `Task(subagent_type="security/scanner", prompt="/security/scan auth.ts")`
  - Performs comprehensive security analysis

**Testing:**
- `/test/generate [file]`
  - Use: `Task(subagent_type="testing/generator", prompt="/test/generate service.ts")`
  - Generates unit tests with project patterns

**Refactoring:**
- `/refactor/modernize [file] [context]`
  - Use: `Task(subagent_type="refactor/modernizer", prompt="/refactor/modernize old.js 'use async/await'")`
  - Updates legacy code to modern standards

### When to Use

- User asks for security audit → Use `/security/scan`
- After writing code → Use `/test/generate`
- Legacy code mentioned → Use `/refactor/modernize`
```

## How It Works

```
User: "Check auth.ts for security issues"
    ↓
Main Agent reads AGENTS.md
    ↓
Sees: /security/scan pattern
    ↓
Main Agent calls:
  Task(
    subagent_type="security/scanner",
    prompt="/security/scan auth.ts"
  )
    ↓
System processes /security/scan command:
  - Loads template from command/security/scan.md
  - Replaces $ARGUMENTS with "auth.ts"
  - Attaches @auth.ts file
  - Attaches @AGENTS.md, @.cursorrules
    ↓
Subagent "security/scanner" receives:
  - Full template text
  - All attached files as context
    ↓
Subagent executes → Returns result → Main agent responds to user
```

## Complete Working Example

### Files Structure

```
.opencode/
├── agent/
│   ├── security/
│   │   └── scanner.md
│   ├── testing/
│   │   └── generator.md
│   └── refactor/
│       └── modernizer.md
├── command/
│   ├── security/
│   │   └── scan.md
│   ├── test/
│   │   └── generate.md
│   └── refactor/
│       └── modernize.md
└── AGENTS.md  ← Documents the patterns
```

### 1. Command Template

```markdown
# .opencode/command/test/generate.md
---
description: "Generate comprehensive unit tests"
---

Generate unit tests for: $ARGUMENTS

Target file:
@$1

Existing test patterns:
!`find $(dirname $1) -name "*.test.*" | head -3`

Requirements:
- Test all public methods
- Include edge cases
- Mock external dependencies
- Follow project conventions from @AGENTS.md
```

### 2. Subagent

```markdown
# .opencode/agent/testing/generator.md
---
mode: "subagent"
description: "Use AFTER writing new code to generate comprehensive tests"
tools:
  read: true
  write: true
  grep: true
---

You generate unit tests by:
1. Analyzing the implementation
2. Studying existing test patterns
3. Creating thorough test coverage
4. Following project conventions
```

### 3. AGENTS.md Documentation

```markdown
# AGENTS.md

## Build/Test Commands
- Run tests: `npm test`
- Single test: `npm test -- path/to/test.ts`

## Code Standards
- TypeScript strict mode
- camelCase for functions
- PascalCase for classes

## Slash Commands with Subagents

Use Task tool to invoke specialized workflows:

### Testing Workflow

After writing new code, generate tests:

```
Task(
  subagent_type="testing/generator",
  prompt="/test/generate src/services/payment.ts"
)
```

### Security Workflow

Before deploying authentication code:

```
Task(
  subagent_type="security/scanner",
  prompt="/security/scan src/auth/*.ts"
)
```

### Refactoring Workflow

When updating legacy code:

```
Task(
  subagent_type="refactor/modernizer",
  prompt="/refactor/modernize src/legacy/util.js 'convert to TypeScript with async/await'"
)
```

### Pattern Summary

1. Identify the workflow need
2. Use Task tool with appropriate subagent_type
3. Pass slash command as the prompt
4. Command loads template + context
5. Subagent executes with full context
```

## Real Conversation Example

```
User: "I just wrote a new payment service. Can you add tests?"

Main Agent (reads AGENTS.md, sees testing workflow):
  "I'll generate comprehensive tests for the payment service."
  
  [Calls Task tool:]
  Task(
    description="Generate payment service tests",
    subagent_type="testing/generator",
    prompt="/test/generate src/services/payment.ts"
  )

Command System:
  - Loads .opencode/command/test/generate.md
  - Replaces $1 with "src/services/payment.ts"
  - Attaches payment.ts file
  - Finds existing test files in same directory
  - Attaches AGENTS.md for conventions

Subagent (testing/generator):
  - Receives full context
  - Analyzes payment.ts implementation
  - Studies existing test patterns
  - Generates comprehensive tests
  - Returns result

Main Agent:
  "✅ Generated comprehensive tests in src/services/payment.test.ts
  - Tests all public methods
  - Includes edge cases for failed payments
  - Mocks payment gateway
  - Follows project test conventions"
```

## Template for Your AGENTS.md

```markdown
# AGENTS.md

## Project Commands
[Your build/test commands]

## Code Standards
[Your standards]

## Automated Workflows

I have specialized workflows accessible via slash commands.
Use the Task tool to invoke them with appropriate subagents.

### Pattern

```
Task(
  subagent_type="[subagent-name]",
  prompt="/[command-name] [arguments]"
)
```

### Security Analysis

**When:** Before deploying auth/payment code
**Command:** `/security/scan [file]`
**Subagent:** `security/scanner`
**Example:**

```
Task(
  subagent_type="security/scanner",
  prompt="/security/scan src/auth/jwt.ts"
)
```

### Test Generation

**When:** After writing new code
**Command:** `/test/generate [file]`
**Subagent:** `testing/generator`
**Example:**

```
Task(
  subagent_type="testing/generator",
  prompt="/test/generate src/services/payment.ts"
)
```

### Code Modernization

**When:** Refactoring legacy code
**Command:** `/refactor/modernize [file] [instructions]`
**Subagent:** `refactor/modernizer`
**Example:**

```
Task(
  subagent_type="refactor/modernizer",
  prompt="/refactor/modernize src/old-api.js 'convert to TypeScript with async/await'"
)
```

### Quick Reference

| Task | Command | Subagent |
|------|---------|----------|
| Security scan | `/security/scan` | `security/scanner` |
| Generate tests | `/test/generate` | `testing/generator` |
| Modernize code | `/refactor/modernize` | `refactor/modernizer` |

## Notes

- Commands are templates that attach context files automatically
- Subagents receive full context and execute specialized workflows
- Always specify subagent_type when using Task tool with slash commands
```

## Key Points

1. **Commands are templates** - They don't execute anything, they just format context
2. **Subagents do the work** - They receive the processed template + attached files
3. **AGENTS.md is the bridge** - It tells main agent HOW to connect commands to subagents
4. **Pattern is always:** `Task(subagent_type="X", prompt="/command args")`
5. **Main agent decides** which subagent to use based on your documentation

## Checklist

- ✅ Create command templates (no agent field)
- ✅ Create specialized subagents (mode: "subagent")
- ✅ Document pattern in AGENTS.md with examples
- ✅ Include "When to use" triggers
- ✅ Show exact Task tool syntax
- ✅ Test with: "Can you [task description]"

That's it! Main agent reads AGENTS.md, sees the patterns, and knows how to invoke slash commands through subagents.
