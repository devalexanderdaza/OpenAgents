# OAC Plugin - Installation Guide

Complete guide to install and configure the OAC (OpenAgents Control) plugin for Claude Code.

## 🚀 Quick Install

### Method 1: From GitHub (Recommended)

```bash
# Add the marketplace
/plugin marketplace add darrenhinde/OpenAgentsControl

# Install the plugin
/plugin install oac
```

### Method 2: Local Development

```bash
# Navigate to the repo
cd /path/to/OpenAgentsControl

# Start Claude with the plugin
claude --plugin-dir ./plugins/claude-code
```

## 📥 Setup Context Files

**IMPORTANT**: After installation, download context files to enable context-aware development.

### Option 1: Download Core Context (Recommended)

```bash
/oac:setup --core
```

Downloads essential standards and workflows (~50 files).

### Option 2: Download All Context

```bash
/oac:setup --all
```

Downloads all context including examples and guides (~200 files).

### Option 3: Download Specific Category

```bash
/oac:setup --category=standards
```

Available categories:
- `core` - Essential standards and workflows
- `openagents-repo` - OAC-specific guides and patterns
- `plugins` - Plugin development guides
- `skills` - Skill creation and usage

## ✅ Verification

After installation and setup, verify everything works:

### 1. Check Plugin Status

```bash
/oac:status
```

You should see:
- ✅ Plugin version
- ✅ Context installed
- ✅ Available subagents (6)
- ✅ Available skills (9)
- ✅ Available commands (4)

### 2. View Available Features

```bash
/oac:help
```

Shows the complete usage guide with all skills, subagents, and commands.

### 3. Test the Workflow

```bash
# Start a simple task to test the workflow
"Add a hello world function"
```

Claude should automatically invoke the `/using-oac` skill and guide you through the 6-stage workflow.

## 📦 What Gets Installed

When you install the plugin, Claude Code sets up:

```
~/.claude/plugins/cache/oac/
├── .claude-plugin/plugin.json       # Plugin manifest
├── agents/                           # 6 custom subagents
│   ├── task-manager.md
│   ├── context-scout.md
│   ├── external-scout.md
│   ├── coder-agent.md
│   ├── test-engineer.md
│   └── code-reviewer.md
├── skills/                           # 9 workflow skills
│   ├── using-oac/SKILL.md
│   ├── context-discovery/SKILL.md
│   ├── external-scout/SKILL.md
│   ├── task-breakdown/SKILL.md
│   ├── code-execution/SKILL.md
│   ├── test-generation/SKILL.md
│   ├── code-review/SKILL.md
│   ├── context-manager/SKILL.md
│   └── parallel-execution/SKILL.md
├── commands/                         # 4 user commands
│   ├── oac-setup.md
│   ├── oac-help.md
│   ├── oac-status.md
│   └── oac-cleanup.md
├── hooks/                            # SessionStart automation
│   ├── hooks.json
│   └── session-start.sh
└── scripts/                          # Utility scripts
    ├── download-context.sh
    └── verify-context.sh
```

After running `/oac:setup`, context files are downloaded to your project:

```
your-project/
└── .opencode/
    └── context/
        ├── core/                     # Standards, workflows, patterns
        ├── openagents-repo/          # OAC-specific guides
        ├── plugins/                  # Plugin development
        └── skills/                   # Skill creation
```

## 🏗️ Architecture Overview

OAC uses a **flattened delegation hierarchy** optimized for Claude Code:

### Traditional OAC (Nested)
```
Main Agent
  └─> TaskManager
       └─> CoderAgent
            └─> ContextScout (❌ Not allowed in Claude Code)
```

### Claude Code OAC (Flattened)
```
Main Agent (orchestrated by /using-oac skill)
  ├─> task-manager subagent
  ├─> context-scout subagent
  ├─> coder-agent subagent
  ├─> test-engineer subagent
  └─> code-reviewer subagent
```

**Key Difference**: 
- Skills guide the main agent's workflow
- Main agent invokes subagents directly (no nesting)
- Context is pre-loaded in Stage 3 (no nested ContextScout calls)

## 🔧 Troubleshooting

### Plugin not found
```bash
# Check plugin list
/plugin list

# Verify installation directory
ls ~/.claude/plugins/cache/oac/
```

### Context not installed
```bash
# Check status
/oac:status

# If context missing, run setup
/oac:setup --core
```

### Skills not working
```bash
# Verify skill files exist
ls ~/.claude/plugins/cache/oac/skills/

# Restart Claude Code
# Try with verbose logging
claude --plugin-dir ./plugins/claude-code --verbose
```

### Subagents not available
```bash
# Check status
/oac:status

# Verify agent files
ls ~/.claude/plugins/cache/oac/agents/

# Should show 6 .md files
```

### Download fails
```bash
# Try core context first (smaller)
/oac:setup --core

# Check internet connection
# Verify GitHub access

# Manual fallback (see /oac:setup output for instructions)
```

## 🎯 Next Steps

After successful installation:

1. **Read the Quick Start**: See `QUICK-START.md` for usage examples
2. **Explore the help**: Run `/oac:help` for detailed workflow guide
3. **Start building**: Let the `/using-oac` skill guide your development
4. **Review context**: Explore `.opencode/context/` to understand available standards

## 🆘 Need Help?

- **Issues**: https://github.com/darrenhinde/OpenAgentsControl/issues
- **Discussions**: https://github.com/darrenhinde/OpenAgentsControl/discussions
- **Status Check**: Run `/oac:status` for diagnostic information

---

**Version**: 1.0.0  
**Last Updated**: 2026-02-16
