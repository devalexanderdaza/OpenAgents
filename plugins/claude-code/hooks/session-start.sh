#!/bin/bash
# SessionStart hook for OAC plugin
# Injects using-oac skill and checks .tmp cleanup, .oac config, and context installation

set -euo pipefail

# Resolve plugin root directory
PLUGIN_ROOT="${CLAUDE_PLUGIN_ROOT:-$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)}"
SKILL_FILE="${PLUGIN_ROOT}/skills/using-oac/SKILL.md"
TMP_SESSIONS_DIR=".tmp/sessions"
CONTEXT_MANIFEST=".context-manifest.json"
OAC_EXAMPLE="${PLUGIN_ROOT}/.oac.example"

# Load using-oac skill content
if [[ ! -f "${SKILL_FILE}" ]]; then
  echo '{"error": "using-oac skill not found at '"${SKILL_FILE}"'"}' >&2
  exit 1
fi

SKILL_CONTENT=$(cat "${SKILL_FILE}")

# Escape for JSON using parameter substitution (fast method)
# Replace backslash, double-quote, newline, tab, carriage return
SKILL_CONTENT="${SKILL_CONTENT//\\/\\\\}"  # Backslash
SKILL_CONTENT="${SKILL_CONTENT//\"/\\\"}"  # Double-quote
SKILL_CONTENT="${SKILL_CONTENT//$'\n'/\\n}"  # Newline
SKILL_CONTENT="${SKILL_CONTENT//$'\t'/\\t}"  # Tab
SKILL_CONTENT="${SKILL_CONTENT//$'\r'/\\r}"  # Carriage return

# Check for .oac configuration
CONFIG_EXISTS=false
CONFIG_LOCATION=""
RECOMMENDATIONS=()

if [[ -f ".oac" ]]; then
  CONFIG_EXISTS=true
  CONFIG_LOCATION="project (.oac)"
elif [[ -f "$HOME/.oac" ]]; then
  CONFIG_EXISTS=true
  CONFIG_LOCATION="global (~/.oac)"
else
  RECOMMENDATIONS+=("Copy .oac.example to .oac to customize settings")
fi

# Check for context installation
CONTEXT_INSTALLED=false
CONTEXT_AGE_DAYS=0
CONTEXT_WARNING=""

if [[ -f "${CONTEXT_MANIFEST}" ]]; then
  CONTEXT_INSTALLED=true
  
  # Check age of context manifest (>30 days = suggest update)
  if [[ "$(uname)" == "Darwin" ]]; then
    # macOS
    MANIFEST_MTIME=$(stat -f %m "${CONTEXT_MANIFEST}" 2>/dev/null || echo 0)
  else
    # Linux
    MANIFEST_MTIME=$(stat -c %Y "${CONTEXT_MANIFEST}" 2>/dev/null || echo 0)
  fi
  
  CURRENT_TIME=$(date +%s)
  CONTEXT_AGE_DAYS=$(( (CURRENT_TIME - MANIFEST_MTIME) / 86400 ))
  
  if [[ ${CONTEXT_AGE_DAYS} -gt 30 ]]; then
    CONTEXT_WARNING="⚠️  Context is ${CONTEXT_AGE_DAYS} days old. Consider running /oac:setup --core to update."
    RECOMMENDATIONS+=("Run /oac:setup --core to update context (${CONTEXT_AGE_DAYS} days old)")
  fi
else
  RECOMMENDATIONS+=("Run /oac:setup --core to download context files")
fi

# Detect first-time user
FIRST_TIME_USER=false
if [[ "${CONFIG_EXISTS}" == "false" ]] && [[ "${CONTEXT_INSTALLED}" == "false" ]]; then
  FIRST_TIME_USER=true
fi

# Check .tmp/ cleanup needs
CLEANUP_SCRIPT="${PLUGIN_ROOT}/scripts/cleanup-tmp.sh"
CLEANUP_WARNING=""

if [[ -x "${CLEANUP_SCRIPT}" ]]; then
  # Check for old .tmp files
  OLD_SESSIONS=0
  OLD_TASKS=0
  OLD_EXTERNAL=0
  
  # Count old sessions (>7 days)
  if [[ -d ".tmp/sessions" ]]; then
    OLD_SESSIONS=$(find ".tmp/sessions" -mindepth 1 -maxdepth 1 -type d -mtime +7 2>/dev/null | wc -l | tr -d ' ')
  fi
  
  # Count old completed tasks (>30 days)
  if [[ -d ".tmp/tasks" ]]; then
    for task_dir in .tmp/tasks/*; do
      if [[ ! -d "$task_dir" ]]; then continue; fi
      
      all_completed=true
      has_subtasks=false
      
      for subtask_file in "$task_dir"/subtask_*.json; do
        if [[ ! -f "$subtask_file" ]]; then continue; fi
        has_subtasks=true
        
        if ! grep -q '"status": "completed"' "$subtask_file" 2>/dev/null; then
          all_completed=false
          break
        fi
        
        if [[ $(find "$subtask_file" -mtime +30 2>/dev/null | wc -l) -eq 0 ]]; then
          all_completed=false
          break
        fi
      done
      
      if [[ "$has_subtasks" == "true" ]] && [[ "$all_completed" == "true" ]]; then
        ((OLD_TASKS++))
      fi
    done
  fi
  
  # Count old external context (>7 days)
  if [[ -d ".tmp/external-context" ]]; then
    OLD_EXTERNAL=$(find ".tmp/external-context" -mindepth 1 -maxdepth 1 -type d -mtime +7 2>/dev/null | wc -l | tr -d ' ')
  fi
  
  TOTAL_OLD=$((OLD_SESSIONS + OLD_TASKS + OLD_EXTERNAL))
  
  if [[ ${TOTAL_OLD} -gt 0 ]]; then
    CLEANUP_WARNING="⚠️  Found ${TOTAL_OLD} old temporary items (${OLD_SESSIONS} sessions, ${OLD_TASKS} tasks, ${OLD_EXTERNAL} external cache). Run cleanup script to review: bash ${CLEANUP_SCRIPT}"
    RECOMMENDATIONS+=("Run cleanup script to remove old temporary files")
  fi
fi

# Build context injection message
CONTEXT_MESSAGE="# OpenAgents Control (OAC) Workflow

**EXTREMELY_IMPORTANT**: This skill is automatically loaded for every development task.

${SKILL_CONTENT}"

# Add first-time user welcome
if [[ "${FIRST_TIME_USER}" == "true" ]]; then
  CONTEXT_MESSAGE="${CONTEXT_MESSAGE}

---

## 👋 Welcome to OpenAgents Control!

This appears to be your first time using OAC. Here's how to get started:

1. **Download context files**: Run \`/oac:setup --core\` to get coding standards and patterns
2. **Customize settings**: Copy \`.oac.example\` to \`.oac\` to configure your preferences
3. **Learn the workflow**: Run \`/oac:help\` to see the 6-stage development workflow

Once context is installed, OAC will automatically discover relevant standards and patterns for every task."
fi

# Add context warning if needed
if [[ -n "${CONTEXT_WARNING}" ]]; then
  CONTEXT_MESSAGE="${CONTEXT_MESSAGE}

---

${CONTEXT_WARNING}"
fi

# Add cleanup warning if needed
if [[ -n "${CLEANUP_WARNING}" ]]; then
  CONTEXT_MESSAGE="${CONTEXT_MESSAGE}

---

${CLEANUP_WARNING}"
fi

# Escape context message for JSON
CONTEXT_MESSAGE="${CONTEXT_MESSAGE//\\/\\\\}"
CONTEXT_MESSAGE="${CONTEXT_MESSAGE//\"/\\\"}"
CONTEXT_MESSAGE="${CONTEXT_MESSAGE//$'\n'/\\n}"
CONTEXT_MESSAGE="${CONTEXT_MESSAGE//$'\t'/\\t}"
CONTEXT_MESSAGE="${CONTEXT_MESSAGE//$'\r'/\\r}"

# Build recommendations JSON array
RECOMMENDATIONS_JSON="["
FIRST_REC=true
for rec in "${RECOMMENDATIONS[@]}"; do
  if [[ "${FIRST_REC}" == "true" ]]; then
    FIRST_REC=false
  else
    RECOMMENDATIONS_JSON="${RECOMMENDATIONS_JSON},"
  fi
  # Escape recommendation for JSON
  REC_ESCAPED="${rec//\\/\\\\}"
  REC_ESCAPED="${REC_ESCAPED//\"/\\\"}"
  RECOMMENDATIONS_JSON="${RECOMMENDATIONS_JSON}\"${REC_ESCAPED}\""
done
RECOMMENDATIONS_JSON="${RECOMMENDATIONS_JSON}]"

# Output JSON with hookSpecificOutput format
cat <<EOF
{
  "hookSpecificOutput": {
    "hookEventName": "SessionStart",
    "additionalContext": "<EXTREMELY_IMPORTANT>OAC workflow is active. Follow 6-stage process: Analyze, Plan & Approve, LoadContext, Execute, Validate, Complete.</EXTREMELY_IMPORTANT>",
    "firstTimeUser": ${FIRST_TIME_USER},
    "contextInstalled": ${CONTEXT_INSTALLED},
    "contextAgeDays": ${CONTEXT_AGE_DAYS},
    "configExists": ${CONFIG_EXISTS},
    "configLocation": "${CONFIG_LOCATION}",
    "recommendations": ${RECOMMENDATIONS_JSON},
    "contextInjection": {
      "priority": "EXTREMELY_IMPORTANT",
      "content": "${CONTEXT_MESSAGE}"
    },
    "tmpCleanup": {
      "oldSessions": ${OLD_SESSIONS:-0},
      "oldTasks": ${OLD_TASKS:-0},
      "oldExternal": ${OLD_EXTERNAL:-0},
      "total": ${TOTAL_OLD:-0},
      "warning": "${CLEANUP_WARNING}"
    }
  }
}
EOF
