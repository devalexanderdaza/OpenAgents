# OAC Plugin - Installation Guide

Quick guide to install and test the OAC (OpenAgents Control) plugin for Claude Code.

## 🚀 Quick Install

### Method 1: From GitHub (After Push)

```bash
# Add the marketplace
/plugin marketplace add darrenhinde/OpenAgentsControl

# Install the plugin
/plugin install oac

# Verify it works
/oac:hello
```

### Method 2: Local Development (Now)

```bash
# Navigate to the repo
cd /path/to/OpenAgentsControl

# Start Claude with the plugin
claude --plugin-dir ./claude-plugin

# In Claude Code, test the plugin
/oac:hello
```

## 📋 Verification Steps

After installation, verify everything works:

1. **Check plugin is loaded**:
   ```bash
   /plugin list
   ```
   You should see "oac" in the list.

2. **Test the hello skill**:
   ```bash
   /oac:hello
   ```
   You should get a friendly response confirming the plugin is working.

3. **Check available commands**:
   ```bash
   /help
   ```
   Look for `/oac:*` commands.

## 🔧 Troubleshooting

### Plugin not found
- Make sure you're in the correct directory
- Check that `claude-plugin/.claude-plugin/plugin.json` exists
- Verify the symlink: `ls -la claude-plugin/context`

### Skill not working
- Check the skill file exists: `claude-plugin/skills/hello/SKILL.md`
- Restart Claude Code
- Try: `claude --plugin-dir ./claude-plugin --verbose`

### Context not loading
- Verify symlink: `cd claude-plugin && ls -la context`
- Should point to: `../.opencode/context`
- Check context files exist: `ls .opencode/context/`

## 📦 What Gets Installed

When you install the plugin, Claude Code copies:

```
~/.claude/plugins/cache/oac/
├── .claude-plugin/plugin.json
├── skills/hello/SKILL.md
├── context/ (symlink content)
├── agents/ (empty for now)
├── hooks/ (empty for now)
└── commands/ (empty for now)
```

## 🎯 Next Steps

After successful installation:

1. **Explore the context**: The plugin has access to all OpenAgents Control context files
2. **Wait for more skills**: Code review, testing, documentation skills coming soon
3. **Contribute**: Add your own skills to `claude-plugin/skills/`

## 🆘 Need Help?

- **Issues**: https://github.com/darrenhinde/OpenAgentsControl/issues
- **Discussions**: https://github.com/darrenhinde/OpenAgentsControl/discussions

---

**Version**: 1.0.0  
**Last Updated**: 2026-02-16
