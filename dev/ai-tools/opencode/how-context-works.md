# OpenCode File Structure & Reference Guide

## Directory Structure

### Global Config (`~/.config/opencode/`)

```
~/.config/opencode/
├── opencode.json          # Global config
├── AGENTS.md              # Auto-loaded instructions
├── CLAUDE.md              # Auto-loaded instructions
├── agent/                 # Custom agents
│   ├── my-agent.md
│   └── category/
│       └── nested-agent.md
├── command/               # Custom commands
│   └── my-command.md
└── plugin/                # Custom plugins
    └── my-plugin.ts
```

### Local Repo (`.opencode/`)

```
your-repo/
├── opencode.json          # Repo config
├── .opencode/
│   ├── AGENTS.md          # Auto-loaded instructions
│   ├── agent/             # Project-specific agents
│   │   └── my-agent.md
│   ├── command/           # Project-specific commands
│   │   └── my-command.md
│   └── plugin/            # Project-specific plugins
│       └── my-plugin.ts
└── src/
```

## Auto-Loaded Files

**Instruction files** (loaded automatically as system prompts):
- `AGENTS.md` - Custom instructions (global or local)
- `CLAUDE.md` - Legacy Claude instructions
- `CONTEXT.md` - Deprecated, but still works

**Config files** (merged in order):
1. `~/.config/opencode/opencode.json` (global)
2. `opencode.json` files from repo root up to current directory
3. Files from `.opencode/` folders in hierarchy

## Supported Subfolders

| Folder | Files | Purpose |
|--------|-------|---------|
| `agent/` | `*.md` | Custom agents with system prompts |
| `command/` | `*.md` | Custom slash commands |
| `plugin/` | `*.ts`, `*.js` | Custom tools and extensions |

**⚠️ Use singular names only:** `agent/`, NOT `agents/`

## File References with `@` Symbol

**In commands and templates:**

```bash
# Relative to repo root
@README.md
@src/main.ts

# Home directory
@~/my-file.txt

# Absolute path
@/absolute/path/file.txt

# If file doesn't exist, looks for agent
@my-agent
```

**Resolution order:**
1. Check if starts with `~/` → resolve to home directory
2. Check if absolute path → use as-is
3. Otherwise → resolve relative to repo root (`Instance.worktree`)
4. If not found → look for agent with that name

## Custom Instruction Files

**For arbitrary paths, use `instructions` field:**

```json
{
  "instructions": [
    "~/opencode/context/my-context.md",
    "docs/**/*.md",
    ".opencode/context/**/*.md"
  ]
}
```

**Paths can be:**
- Absolute: `/path/to/file.md`
- Home relative: `~/path/to/file.md`
- Repo relative: `docs/instructions.md`
- Glob patterns: `**/*.md`

## Config Merging

**Configs merge with priority** (later overrides earlier):
1. Global config (`~/.config/opencode/`)
2. Repo root configs (from root up)
3. Custom config directories (`.opencode/` folders)
4. Environment variables (`OPENCODE_CONFIG`)

**Agents, commands, and plugins** from all locations are merged together.

## Quick Reference

| What | Where | How |
|------|-------|-----|
| Global agent | `~/.config/opencode/agent/name.md` | Auto-loaded |
| Local agent | `.opencode/agent/name.md` | Auto-loaded |
| Global command | `~/.config/opencode/command/name.md` | Auto-loaded |
| Local command | `.opencode/command/name.md` | Auto-loaded |
| Global instructions | `~/.config/opencode/AGENTS.md` | Auto-loaded |
| Local instructions | `.opencode/AGENTS.md` or `AGENTS.md` | Auto-loaded |
| Custom files | Anywhere | Use `instructions` config or `@` symbol |
