---
name: oac:status
description: Show OpenAgents Control plugin installation status and context
---

# OpenAgents Control Status

## Plugin Information

**Plugin**: OpenAgents Control (OAC)
**Version**: !`cat plugins/claude-code/.claude-plugin/plugin.json | grep '"version"' | sed 's/.*: "\(.*\)".*/\1/'`
**Repository**: https://github.com/darrenhinde/OpenAgentsControl

---

## Context Installation Status

!`if [ -f "plugins/claude-code/.context-manifest.json" ]; then
  echo "✅ **Context Installed**"
  echo ""
  echo "### Manifest Details"
  cat plugins/claude-code/.context-manifest.json | sed 's/^/    /'
  echo ""
  echo "### Installed Context Files"
  if [ -d ".opencode/context" ]; then
    echo ""
    echo "**Core Context**:"
    find .opencode/context/core -type f -name "*.md" 2>/dev/null | wc -l | xargs -I {} echo "  - {} files"
    echo ""
    echo "**OpenAgents Repository Context**:"
    find .opencode/context/openagents-repo -type f -name "*.md" 2>/dev/null | wc -l | xargs -I {} echo "  - {} files"
    echo ""
    echo "**Categories**:"
    find .opencode/context -type d -mindepth 2 -maxdepth 2 2>/dev/null | sed 's|.opencode/context/||' | sed 's/^/  - /'
  fi
else
  echo "❌ **Context Not Installed**"
  echo ""
  echo "Run \`/oac:setup\` to download context files from GitHub."
fi`

---

## Active Sessions

!`if [ -d ".tmp/sessions" ]; then
  SESSION_COUNT=$(find .tmp/sessions -maxdepth 1 -type d ! -path .tmp/sessions | wc -l | tr -d ' ')
  if [ "$SESSION_COUNT" -gt 0 ]; then
    echo "**Active Sessions**: $SESSION_COUNT"
    echo ""
    find .tmp/sessions -maxdepth 1 -type d ! -path .tmp/sessions -exec basename {} \; | sed 's/^/  - /'
  else
    echo "**Active Sessions**: None"
  fi
else
  echo "**Active Sessions**: None"
fi`

---

## Available Components

### Custom Subagents
- `task-manager` - Break down complex features into atomic subtasks
- `context-scout` - Discover relevant context files for tasks
- `coder-agent` - Execute coding subtasks with context awareness
- `test-engineer` - Generate comprehensive test suites
- `code-reviewer` - Review code for quality and standards

### Skills
- `/using-oac` - Main 6-stage workflow orchestrator
- `/context-discovery` - Guide context discovery process
- `/task-breakdown` - Guide task breakdown process
- `/code-execution` - Guide code execution process
- `/test-generation` - Guide test generation process
- `/code-review` - Guide code review process

### Commands
- `/oac:setup` - Download context files from GitHub
- `/oac:help` - Show usage guide and available skills
- `/oac:status` - Show this status information

---

## Recommendations

!`if [ ! -f "plugins/claude-code/.context-manifest.json" ]; then
  echo "⚠️  **Action Required**: Run \`/oac:setup\` to install context files"
elif [ -d ".tmp/sessions" ]; then
  SESSION_COUNT=$(find .tmp/sessions -maxdepth 1 -type d ! -path .tmp/sessions | wc -l | tr -d ' ')
  if [ "$SESSION_COUNT" -gt 5 ]; then
    echo "💡 **Cleanup Suggested**: You have $SESSION_COUNT active sessions. Consider cleaning up old sessions in \`.tmp/sessions/\`"
  else
    echo "✅ **All Good**: Plugin is properly configured and ready to use"
  fi
else
  echo "✅ **All Good**: Plugin is properly configured and ready to use"
fi`

---

## Quick Start

To start using OpenAgents Control:

1. **Ensure context is installed**: Run `/oac:setup` if not already done
2. **Invoke the main workflow**: Use `/using-oac` or let Claude auto-invoke it
3. **Get help**: Run `/oac:help` for detailed usage guide

For more information, see the [README](../README.md) or visit the [repository](https://github.com/darrenhinde/OpenAgentsControl).
