# OAC - Claude Code Plugin

OpenAgents Control (OAC) - Multi-agent orchestration and automation for Claude Code.

## 🎯 Overview

OpenAgents Control brings powerful multi-agent capabilities to Claude Code through a **skills + subagents architecture**:

- **9 Skills** orchestrate workflows and guide the main agent through multi-stage processes
- **6 Subagents** execute specialized tasks (context discovery, task breakdown, code implementation, testing, review)
- **4 Commands** provide setup, status, help, and cleanup functionality
- **Flat delegation hierarchy** - only the main agent can invoke subagents (no nested calls)
- **Context pre-loading** - all standards and patterns loaded upfront to prevent nested discovery
- **6-stage workflow** - ensures context-aware, high-quality code delivery with approval gates

### Key Features

- **Intelligent Context Discovery** - Smart discovery of coding standards, security patterns, and conventions
- **Task Management** - Break down complex features into atomic, verifiable subtasks
- **Code Execution** - Context-aware implementation following project standards
- **Test Engineering** - TDD-driven test creation and validation
- **Code Review** - Automated code quality and security analysis

## 📦 Installation

### Option 1: From Marketplace (Recommended)

```bash
# Add the OpenAgents Control marketplace
/plugin marketplace add darrenhinde/OpenAgentsControl

# Install the plugin
/plugin install oac
```

### Option 2: Local Development

```bash
# Clone the repo
git clone https://github.com/darrenhinde/OpenAgentsControl.git
cd OpenAgentsControl

# Load plugin locally
claude --plugin-dir ./plugins/claude-code
```

## 🚀 Quick Start

After installation, download context files and start using OAC:

```bash
# Download context files from GitHub
/oac:setup

# Verify installation
/oac:status

# Get help and usage guide
/oac:help
```

The **using-oac** skill is automatically invoked when you start a development task, guiding you through the 6-stage workflow.

## 📚 Available Skills

Skills guide the main agent through specific workflows:

### using-oac
Main workflow orchestrator implementing the 6-stage process (Analyze → Plan → LoadContext → Execute → Validate → Complete).

**Auto-invoked**: When you start a development task.

### context-discovery
Guide for discovering and loading relevant context files (coding standards, security patterns, conventions).

**Usage**: `/context-discovery authentication feature`

**Invokes**: `context-scout` subagent via `context: fork`

### external-scout
Guide for fetching external library and framework documentation from Context7 and other sources.

**Usage**: `/external-scout drizzle schemas`

**Invokes**: `external-scout` subagent via `context: fork`

### task-breakdown
Guide for breaking down complex features into atomic subtasks with dependency tracking.

**Usage**: `/task-breakdown user authentication system`

**Invokes**: `task-manager` subagent via `context: fork`

### code-execution
Guide for executing coding tasks with full context awareness and self-review.

**Usage**: `/code-execution implement JWT service`

**Invokes**: `coder-agent` subagent via `context: fork`

### test-generation
Guide for generating comprehensive tests using TDD principles.

**Usage**: `/test-generation authentication service`

**Invokes**: `test-engineer` subagent via `context: fork`

### code-review
Guide for performing thorough code reviews with security and quality analysis.

**Usage**: `/code-review src/auth/`

**Invokes**: `code-reviewer` subagent via `context: fork`

### context-manager
Manage context files, configuration, and project-specific settings. Set up projects, configure context sources, and integrate external task systems.

**Usage**: `/context-manager`

**Use when**: Setting up projects, configuring context sources, managing personal task systems

### parallel-execution
Execute multiple independent tasks in parallel to dramatically reduce implementation time for multi-component features.

**Usage**: Automatically used when task-manager marks tasks with `parallel: true`

**Use when**: Multiple independent tasks with no dependencies, need to speed up multi-component features

## 🤖 Available Subagents

Subagents execute specialized tasks in isolated contexts:

### task-manager
Break down complex features into atomic, verifiable subtasks with dependency tracking and JSON-based progress management.

**Tools**: Read, Write, Glob, Grep  
**Model**: sonnet

### context-scout
Discover relevant context files, standards, and patterns using navigation-driven discovery.

**Tools**: Read, Glob, Grep  
**Model**: haiku

### external-scout
Fetch external library and framework documentation from Context7 API and other sources, with local caching.

**Tools**: Read, Write, Bash  
**Model**: haiku

### coder-agent
Execute coding subtasks with full context awareness, self-review, and quality validation.

**Tools**: Read, Write, Edit, Glob, Grep  
**Model**: sonnet

### test-engineer
Generate comprehensive tests using TDD principles with coverage analysis and validation.

**Tools**: Read, Write, Edit, Bash, Glob, Grep  
**Model**: sonnet

### code-reviewer
Perform thorough code review with security analysis, quality checks, and actionable feedback.

**Tools**: Read, Bash, Glob, Grep  
**Model**: sonnet

## 📝 Available Commands

User-invocable commands for setup and status:

### /oac:setup
Download context files from the OpenAgents Control GitHub repository.

**Usage**: `/oac:setup [--core|--all|--category=<name>]`

**Options**:
- `--core` - Download only core context files (standards, workflows, patterns)
- `--all` - Download all context files including examples and guides
- `--category=<name>` - Download specific category (e.g., `--category=standards`)

### /oac:help
Show usage guide for OAC workflow, skills, subagents, and commands.

**Usage**: 
- `/oac:help` - Show general help
- `/oac:help <skill-name>` - Show help for specific skill

### /oac:status
Show plugin status, installed context version, and available components.

**Usage**: `/oac:status`

**Shows**:
- Plugin version
- Installed context version
- Available subagents and skills
- Context file count

### /oac:cleanup
Clean up old temporary files from `.tmp` directory.

**Usage**: `/oac:cleanup [--force] [--session-days=N] [--task-days=N] [--external-days=N]`

**Options**:
- `--force` - Skip confirmation and delete immediately
- `--session-days=N` - Clean sessions older than N days (default: 7)
- `--task-days=N` - Clean completed tasks older than N days (default: 30)
- `--external-days=N` - Clean external context older than N days (default: 7)

**Cleans**:
- Old session files from `.tmp/sessions/`
- Completed task files from `.tmp/tasks/`
- Cached external documentation from `.tmp/external-context/`

**Example**:
```bash
# Clean with defaults
/oac:cleanup

# Clean aggressively (3 days for sessions)
/oac:cleanup --session-days=3 --force
```

## 🔄 How It Works

### 6-Stage Workflow

OAC implements a structured workflow for every development task:

#### Stage 1: Analyze & Discover
- Understand requirements and scope
- Invoke `/context-discovery` to find relevant context files
- Identify project standards, patterns, and conventions

#### Stage 2: Plan & Approve
- Present implementation plan
- **REQUEST APPROVAL** before proceeding
- Confirm approach with user

#### Stage 3: LoadContext
- Read all discovered context files
- Load coding standards, security patterns, naming conventions
- Pre-load context for execution stage (prevents nested discovery)

#### Stage 4: Execute
- **Simple tasks** (1-3 files): Direct implementation
- **Complex tasks** (4+ files): Invoke `/task-breakdown` to decompose into subtasks
- Follow loaded standards and patterns

#### Stage 5: Validate
- Run tests and validation
- **STOP on failure** - fix before proceeding
- Verify acceptance criteria met

#### Stage 6: Complete
- Update documentation
- Summarize changes
- Return results

### Architecture: Skills Invoke Subagents via `context: fork`

**OAC Pattern** (nested - NOT supported in Claude Code):
```
Main Agent → TaskManager → CoderAgent → ContextScout
```

**Claude Code Pattern** (flat - CORRECT):
```
Main Agent → /context-discovery skill → context-scout subagent
Main Agent → /task-breakdown skill → task-manager subagent
Main Agent → /code-execution skill → coder-agent subagent
```

**Key Principle**: Only the main agent can invoke subagents. Skills guide the orchestration, subagents execute specialized tasks in isolated contexts (`context: fork`).

### Context Pre-Loading

**Why**: Prevents nested ContextScout calls during execution.

**How**: Stage 3 loads ALL context upfront, so execution stages (4-6) have everything they need.

**Example**:
```
Stage 1: Discover context files → [standards.md, security.md, patterns.md]
Stage 3: Load all files → Read standards.md, Read security.md, Read patterns.md
Stage 4: Execute with loaded context → No nested discovery needed
```

### Approval Gates

**Critical checkpoints**:
- **Stage 2 → Stage 3**: User must approve the plan
- **Stage 5 → Stage 6**: Validation must pass

**Never skip approval** - it prevents wasted work and ensures alignment.

## 🔧 Configuration

The plugin uses context files from the main OpenAgents Control repository.

### Context Structure

```
plugins/claude-code/
├── .claude-plugin/
│   └── plugin.json              # Plugin metadata
├── agents/                      # Custom subagents (6 files)
│   ├── task-manager.md
│   ├── context-scout.md
│   ├── external-scout.md
│   ├── coder-agent.md
│   ├── test-engineer.md
│   └── code-reviewer.md
├── skills/                      # Workflow skills (9 files)
│   ├── using-oac/SKILL.md
│   ├── context-discovery/SKILL.md
│   ├── external-scout/SKILL.md
│   ├── task-breakdown/SKILL.md
│   ├── code-execution/SKILL.md
│   ├── test-generation/SKILL.md
│   ├── code-review/SKILL.md
│   ├── context-manager/SKILL.md
│   └── parallel-execution/SKILL.md
├── commands/                    # User commands (4 files)
│   ├── oac-setup.md
│   ├── oac-help.md
│   ├── oac-status.md
│   └── oac-cleanup.md
├── hooks/                       # Event-driven automation
│   ├── hooks.json
│   └── session-start.sh
├── scripts/                     # Utility scripts
│   ├── download-context.sh
│   └── verify-context.sh
└── .context-manifest.json       # Downloaded context tracking
```

### Context Files

Context files are downloaded from the main repository via `/oac:setup`:

```
.opencode/context/
├── core/                        # Core standards and workflows
│   ├── standards/
│   ├── workflows/
│   └── patterns/
├── openagents-repo/             # OAC-specific guides
│   ├── guides/
│   ├── standards/
│   └── concepts/
└── navigation.md                # Context discovery navigation
```

## 🛠️ Development

### Adding New Skills

1. Create skill directory:
   ```bash
   mkdir -p plugins/claude-code/skills/my-skill
   ```

2. Create `SKILL.md` with frontmatter:
   ```markdown
   ---
   name: my-skill
   description: What this skill does
   context: fork
   agent: my-subagent
   ---
   
   # My Skill
   
   Instructions for the main agent...
   ```

3. Test locally:
   ```bash
   claude --plugin-dir ./plugins/claude-code
   /my-skill
   ```

### Adding New Subagents

1. Create subagent file:
   ```bash
   touch plugins/claude-code/agents/my-subagent.md
   ```

2. Add frontmatter:
   ```markdown
   ---
   name: my-subagent
   description: What this subagent does
   tools: Read, Write, Glob, Grep
   model: sonnet
   ---
   
   # MySubagent
   
   Instructions for the subagent...
   ```

3. Create skill to invoke it:
   ```markdown
   ---
   name: my-workflow
   description: Workflow description
   context: fork
   agent: my-subagent
   ---
   ```

### Adding Hooks

Create `hooks/hooks.json`:

```json
{
  "hooks": {
    "SessionStart": [{
      "type": "command",
      "command": "${CLAUDE_PLUGIN_ROOT}/hooks/session-start.sh",
      "timeout": 5
    }],
    "PostToolUse": [{
      "matcher": "Write|Edit",
      "hooks": [{
        "type": "command",
        "command": "${CLAUDE_PLUGIN_ROOT}/scripts/format.sh",
        "timeout": 30
      }]
    }]
  }
}
```

## 🔗 Related Projects

- **OpenAgents Control** - Main repository (OpenCode native)
- **OAC CLI** - Command-line tool for multi-IDE management (coming soon)

## 📖 Documentation

- [Installation Guide](INSTALL.md)
- [Quick Start Guide](QUICK-START.md)
- [Main Documentation](../.opencode/docs/)
- [Context System](../docs/context-system/)
- [Planning Documents](../docs/planning/)

## 🤝 Contributing

Contributions welcome! See the main [OpenAgents Control repository](https://github.com/darrenhinde/OpenAgentsControl) for contribution guidelines.

## 📄 License

MIT License - see [LICENSE](../LICENSE) for details.

## 🆘 Support

- **Issues**: [GitHub Issues](https://github.com/darrenhinde/OpenAgentsControl/issues)
- **Discussions**: [GitHub Discussions](https://github.com/darrenhinde/OpenAgentsControl/discussions)

## 🗺️ Roadmap

### Phase 1: Foundation ✅ COMPLETE
- ✅ Plugin structure
- ✅ 6 custom subagents (task-manager, context-scout, external-scout, coder-agent, test-engineer, code-reviewer)
- ✅ 9 workflow skills (using-oac, context-discovery, external-scout, task-breakdown, code-execution, test-generation, code-review, context-manager, parallel-execution)
- ✅ 4 user commands (/oac:setup, /oac:help, /oac:status, /oac:cleanup)
- ✅ SessionStart hook for auto-loading using-oac skill
- ✅ Context download and verification scripts
- ✅ Flat delegation hierarchy (skills invoke subagents via context: fork)

### Phase 2: Advanced Features ✅ COMPLETE
- ✅ External library documentation fetching (ExternalScout subagent + skill)
- ✅ .tmp cleanup automation (/oac:cleanup command)
- ✅ .oac configuration file support (context-manager skill)
- ✅ Context management and personal task systems (context-manager skill)
- ✅ Parallel subtask execution tracking (parallel-execution skill)
- ⬜ MCP server integration (future)

### Phase 3: JSON Config System
- ⬜ Auto-generation from JSON config
- ⬜ Type-safe configuration
- ⬜ Multi-IDE conversion

---

**Version**: 1.0.0  
**Last Updated**: 2026-02-16  
**Status**: Production Ready
