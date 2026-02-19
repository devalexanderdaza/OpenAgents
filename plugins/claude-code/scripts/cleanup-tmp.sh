#!/usr/bin/env bash
# cleanup-tmp.sh - Clean up old temporary files from .tmp directory

set -euo pipefail

# Defaults
SESSION_DAYS=7
TASK_DAYS=30
EXTERNAL_DAYS=7
FORCE=false

# Parse arguments
for arg in "$@"; do
  case "$arg" in
    --force)           FORCE=true ;;
    --session-days=*)  SESSION_DAYS="${arg#*=}" ;;
    --task-days=*)     TASK_DAYS="${arg#*=}" ;;
    --external-days=*) EXTERNAL_DAYS="${arg#*=}" ;;
  esac
done

# Find old files
SESSION_FILES=$(find .tmp/sessions -maxdepth 1 -mindepth 1 -type d -mtime +${SESSION_DAYS} 2>/dev/null || true)
TASK_FILES=$(find .tmp/tasks -maxdepth 1 -mindepth 1 -type d -mtime +${TASK_DAYS} 2>/dev/null | while read d; do
  # Only include completed tasks (skip active ones)
  if [ -f "$d/task.json" ] && grep -q '"status": "completed"' "$d/task.json" 2>/dev/null; then
    echo "$d"
  fi
done || true)
EXTERNAL_FILES=$(find .tmp/external-context -maxdepth 1 -mindepth 1 -type d -mtime +${EXTERNAL_DAYS} 2>/dev/null || true)

SESSION_COUNT=$(echo "$SESSION_FILES" | grep -c . 2>/dev/null || echo 0)
TASK_COUNT=$(echo "$TASK_FILES" | grep -c . 2>/dev/null || echo 0)
EXTERNAL_COUNT=$(echo "$EXTERNAL_FILES" | grep -c . 2>/dev/null || echo 0)
TOTAL=$((SESSION_COUNT + TASK_COUNT + EXTERNAL_COUNT))

if [ "$TOTAL" -eq 0 ]; then
  echo '{"status":"success","deleted":{"sessions":0,"tasks":0,"external":0},"freed_space":"0 B","summary":"No old temporary files found."}'
  exit 0
fi

# Show what will be deleted
if [ "$FORCE" = false ]; then
  echo "Files to be deleted:"
  [ -n "$SESSION_FILES" ] && echo "$SESSION_FILES" | sed 's/^/  [session] /'
  [ -n "$TASK_FILES"   ] && echo "$TASK_FILES"   | sed 's/^/  [task]    /'
  [ -n "$EXTERNAL_FILES" ] && echo "$EXTERNAL_FILES" | sed 's/^/  [external] /'
  echo ""
  read -r -p "Delete $TOTAL items? [y/N] " confirm
  [[ "$confirm" =~ ^[Yy]$ ]] || { echo "Cancelled."; exit 0; }
fi

# Delete
[ -n "$SESSION_FILES"  ] && echo "$SESSION_FILES"  | xargs rm -rf
[ -n "$TASK_FILES"     ] && echo "$TASK_FILES"     | xargs rm -rf
[ -n "$EXTERNAL_FILES" ] && echo "$EXTERNAL_FILES" | xargs rm -rf

echo "{\"status\":\"success\",\"deleted\":{\"sessions\":${SESSION_COUNT},\"tasks\":${TASK_COUNT},\"external\":${EXTERNAL_COUNT}},\"summary\":\"Cleaned up ${TOTAL} old temporary items.\"}"
