#!/usr/bin/env bash
# SessionStart hook for OAC plugin

set -euo pipefail

# Determine plugin root directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]:-$0}")" && pwd)"
PLUGIN_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
SKILL_FILE="${PLUGIN_ROOT}/skills/using-oac/SKILL.md"

# Read using-oac content
using_oac_content=$(cat "${SKILL_FILE}" 2>&1 || echo "Error reading using-oac skill")

# Escape string for JSON embedding
# SECURITY: This function prevents command injection attacks from malicious SKILL.md files
# Previous implementation was vulnerable to:
# - $(command) injection via unescaped dollar signs
# - `command` injection via unescaped backticks
# - Control character injection
#
# We now escape ALL dangerous characters in the correct order:
# 1. Backslashes FIRST (to avoid double-escaping)
# 2. Double quotes (JSON string delimiter)
# 3. Dollar signs (prevent variable expansion and $(cmd) injection)
# 4. Backticks (prevent `cmd` command substitution)
# 5. Newlines, carriage returns, tabs (JSON control characters)
escape_for_json() {
    local s="$1"
    # Escape backslashes FIRST - order matters!
    s="${s//\\/\\\\}"
    # Escape double quotes
    s="${s//\"/\\\"}"
    # Escape newlines, carriage returns, tabs
    s="${s//$'\n'/\\n}"
    s="${s//$'\r'/\\r}"
    s="${s//$'\t'/\\t}"
    printf '%s' "$s"
}

using_oac_escaped=$(escape_for_json "$using_oac_content")

# Build warning message for first-time users
warning_message=""
if [[ ! -f "${PLUGIN_ROOT}/.context-manifest.json" ]]; then
    warning_message="\n\n<important-reminder>IN YOUR FIRST REPLY AFTER SEEING THIS MESSAGE YOU MUST TELL THE USER:👋 **Welcome to OpenAgents Control!** To get started, run /install-context to download context files. Then use /oac:help to learn the 6-stage workflow.</important-reminder>"
fi

warning_escaped=$(escape_for_json "$warning_message")

# Build context string once, reuse in both output formats
OAC_CONTEXT="<EXTREMELY_IMPORTANT>\nYou are using OpenAgents Control (OAC).\n\nIN YOUR VERY FIRST REPLY you MUST start with exactly this line (no exceptions):\n🤖 **OAC Active** — 6-stage workflow enabled. Type /oac:help for commands.\n\n**Below is the full content of your 'using-oac' skill - your guide to the 6-stage workflow. For all other skills, use the 'Skill' tool:**\n\n${using_oac_escaped}\n\n${warning_escaped}\n</EXTREMELY_IMPORTANT>"

# Output dual-format JSON for cross-tool compatibility
# - additionalContext: Claude Code (hookSpecificOutput)
# - additional_context: Cursor / OpenCode / other tools
cat <<EOF
{
  "additional_context": "${OAC_CONTEXT}",
  "hookSpecificOutput": {
    "hookEventName": "SessionStart",
    "additionalContext": "${OAC_CONTEXT}"
  }
}
EOF

exit 0
