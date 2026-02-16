---
name: oac:setup
description: Download OpenAgents Control context files from GitHub repository
argument-hint: "[--core|--all|--category=<name>]"
disable-model-invocation: true
---

# OAC Setup Command

Download context files from the OpenAgents Control repository to enable context-aware development.

## Download Progress

!`bash ${CLAUDE_PLUGIN_ROOT}/scripts/download-context.sh $ARGUMENTS`

## What Was Downloaded

The setup script has downloaded context files to `.opencode/context/` in your project directory.

### Available Options

- `--core` - Download only core context files (standards, workflows, patterns)
- `--all` - Download all context files including examples and guides
- `--category=<name>` - Download specific category (e.g., `--category=standards`)

### Context Categories

- **core** - Essential standards and workflows
- **openagents-repo** - OAC-specific guides and patterns
- **plugins** - Plugin development guides
- **skills** - Skill creation and usage

## Verification

The context files have been validated and a manifest has been created at:
`plugins/claude-code/.context-manifest.json`

## Configuration

You can customize OAC behavior by creating a `.oac` configuration file in your project root or `~/.oac` for global settings.

### Example Configuration

Copy the example config:
```bash
cp ${CLAUDE_PLUGIN_ROOT}/.oac.example .oac
```

### Available Settings

**Context Settings**:
- `context.auto_download` - Auto-download context on first use (default: false)
- `context.categories` - Default categories to download (default: core,openagents-repo)
- `context.update_check` - Check for context updates (default: true)
- `context.cache_days` - Days to cache external context (default: 7)

**Cleanup Settings**:
- `cleanup.auto_prompt` - Prompt for cleanup on session start (default: true)
- `cleanup.session_days` - Days before suggesting session cleanup (default: 7)
- `cleanup.task_days` - Days before suggesting task cleanup (default: 30)
- `cleanup.external_days` - Days before suggesting external context cleanup (default: 7)

**Workflow Settings**:
- `workflow.auto_approve` - Skip approval gates - DANGEROUS (default: false)
- `workflow.verbose` - Show detailed workflow steps (default: false)

**External Scout Settings**:
- `external_scout.enabled` - Enable external documentation fetching (default: true)
- `external_scout.cache_enabled` - Cache fetched documentation (default: true)
- `external_scout.sources` - Documentation sources to use (default: context7)

### Load Configuration

Configuration is automatically loaded on session start. To manually load:
```bash
bash ${CLAUDE_PLUGIN_ROOT}/scripts/load-config.sh
```

## Next Steps

1. **Configure OAC** (optional): Copy `.oac.example` to `.oac` and customize settings
2. **Explore available skills**: Run `/oac:help` to see what OAC can do
3. **Start a workflow**: Use `/using-oac` to begin context-aware development
4. **Check status**: Run `/oac:status` to verify installation

## Troubleshooting

If the download fails:
- Check your internet connection
- Verify GitHub repository access
- Ensure you have write permissions in the project directory
- Try running with `--core` first for minimal setup

## Manual Setup

If automatic download doesn't work, you can manually clone the context:

```bash
git clone --depth 1 --filter=blob:none --sparse \
  https://github.com/darrenhinde/OpenAgentsControl.git temp-oac
cd temp-oac
git sparse-checkout set .opencode/context
cp -r .opencode/context /path/to/your/project/.opencode/
cd ..
rm -rf temp-oac
```

---

**Note**: Context files are cached locally. Re-run this command to update to the latest version.
