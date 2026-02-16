# OAC - Claude Code Plugin

OpenAgents Control (OAC) - Multi-agent orchestration and automation for Claude Code.

## 🎯 Overview

OpenAgents Control brings powerful multi-agent capabilities to Claude Code, including:

- **Intelligent Code Review** - Automated code quality and security analysis
- **Test Engineering** - TDD-driven test creation and validation
- **Documentation** - Automated documentation generation and maintenance
- **Task Management** - Break down complex features into manageable tasks
- **Context Discovery** - Smart context file discovery and loading

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
claude --plugin-dir ./claude-plugin
```

## 🚀 Quick Start

After installation, test the plugin:

```bash
# Verify installation
/oac:hello
```

## 📚 Available Skills

### Current Skills

- **hello** - Test skill to verify plugin installation

### Coming Soon

- **code-review** - Intelligent code review with security and quality checks
- **test-engineer** - TDD-driven test creation
- **doc-writer** - Documentation generation
- **task-breakdown** - Feature decomposition into tasks
- **context-scout** - Smart context discovery

## 🔧 Configuration

The plugin uses shared context from the main OpenAgents Control repository via symlinks.

### Context Structure

```
claude-plugin/
├── .claude-plugin/plugin.json
├── skills/                    # Claude-specific skills
├── agents/                    # Claude-specific agents
├── hooks/                     # Event-driven automation
├── commands/                  # Custom slash commands
└── context -> ../.opencode/context/  # Symlinked shared context
```

## 🛠️ Development

### Adding New Skills

1. Create skill directory:
   ```bash
   mkdir -p claude-plugin/skills/my-skill
   ```

2. Create `SKILL.md`:
   ```markdown
   # My Skill
   
   Description of what this skill does.
   
   ```claude
   You are a helpful assistant that...
   ```
   ```

3. Test locally:
   ```bash
   claude --plugin-dir ./claude-plugin
   /oac:my-skill
   ```

### Adding Hooks

Create `hooks/hooks.json`:

```json
{
  "hooks": {
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

### Phase 1: Foundation (Current)
- ✅ Plugin structure
- ✅ Marketplace catalog
- ✅ Test skill
- ⬜ Core skills (code-review, test-engineer, doc-writer)

### Phase 2: Advanced Features
- ⬜ Hooks for automation
- ⬜ MCP server integration
- ⬜ Custom commands
- ⬜ Agent delegation

### Phase 3: JSON Config System
- ⬜ Auto-generation from JSON config
- ⬜ Type-safe configuration
- ⬜ Multi-IDE conversion

---

**Version**: 1.0.0  
**Last Updated**: 2026-02-16  
**Status**: Active Development
