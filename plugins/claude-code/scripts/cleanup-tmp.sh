#!/bin/bash
# cleanup-tmp.sh - Clean old temporary files from .tmp directory
# Usage: cleanup-tmp.sh [--force] [--days=N]

set -euo pipefail

# Default settings
FORCE_MODE=false
SESSION_DAYS=7
TASK_DAYS=30
EXTERNAL_DAYS=7

# Parse arguments
for arg in "$@"; do
  case $arg in
    --force)
      FORCE_MODE=true
      shift
      ;;
    --days=*)
      CUSTOM_DAYS="${arg#*=}"
      SESSION_DAYS=$CUSTOM_DAYS
      TASK_DAYS=$CUSTOM_DAYS
      EXTERNAL_DAYS=$CUSTOM_DAYS
      shift
      ;;
    --session-days=*)
      SESSION_DAYS="${arg#*=}"
      shift
      ;;
    --task-days=*)
      TASK_DAYS="${arg#*=}"
      shift
      ;;
    --external-days=*)
      EXTERNAL_DAYS="${arg#*=}"
      shift
      ;;
    *)
      # Unknown option
      ;;
  esac
done

# Helper function to get directory size
get_dir_size() {
  local dir=$1
  if [[ -d "$dir" ]]; then
    du -sh "$dir" 2>/dev/null | cut -f1
  else
    echo "0B"
  fi
}

# Helper function to find old directories
find_old_dirs() {
  local base_dir=$1
  local days=$2
  
  if [[ ! -d "$base_dir" ]]; then
    return
  fi
  
  find "$base_dir" -mindepth 1 -maxdepth 1 -type d -mtime +$days 2>/dev/null || true
}

# Helper function to find completed tasks older than N days
find_old_completed_tasks() {
  local base_dir=$1
  local days=$2
  
  if [[ ! -d "$base_dir" ]]; then
    return
  fi
  
  # Find task directories with completed subtasks
  for task_dir in "$base_dir"/*; do
    if [[ ! -d "$task_dir" ]]; then
      continue
    fi
    
    # Check if all subtasks are completed and older than N days
    local all_completed=true
    local has_subtasks=false
    
    for subtask_file in "$task_dir"/subtask_*.json; do
      if [[ ! -f "$subtask_file" ]]; then
        continue
      fi
      
      has_subtasks=true
      
      # Check if subtask is completed
      if ! grep -q '"status": "completed"' "$subtask_file" 2>/dev/null; then
        all_completed=false
        break
      fi
      
      # Check if file is older than N days
      if [[ $(find "$subtask_file" -mtime +$days 2>/dev/null | wc -l) -eq 0 ]]; then
        all_completed=false
        break
      fi
    done
    
    # If all subtasks are completed and old, include this task directory
    if [[ "$has_subtasks" == "true" ]] && [[ "$all_completed" == "true" ]]; then
      echo "$task_dir"
    fi
  done
}

# Collect cleanup candidates
declare -a SESSION_DIRS
declare -a TASK_DIRS
declare -a EXTERNAL_DIRS

# Find old sessions
while IFS= read -r dir; do
  SESSION_DIRS+=("$dir")
done < <(find_old_dirs ".tmp/sessions" "$SESSION_DAYS")

# Find old completed tasks
while IFS= read -r dir; do
  TASK_DIRS+=("$dir")
done < <(find_old_completed_tasks ".tmp/tasks" "$TASK_DAYS")

# Find old external context
while IFS= read -r dir; do
  EXTERNAL_DIRS+=("$dir")
done < <(find_old_dirs ".tmp/external-context" "$EXTERNAL_DAYS")

# Calculate totals
TOTAL_ITEMS=$((${#SESSION_DIRS[@]} + ${#TASK_DIRS[@]} + ${#EXTERNAL_DIRS[@]}))

# If nothing to clean, exit early
if [[ $TOTAL_ITEMS -eq 0 ]]; then
  cat <<EOF
{
  "status": "success",
  "message": "No old temporary files found",
  "cleaned": {
    "sessions": 0,
    "tasks": 0,
    "external": 0
  },
  "totalSize": "0B"
}
EOF
  exit 0
fi

# Build cleanup report
CLEANUP_REPORT=""
TOTAL_SIZE=0

if [[ ${#SESSION_DIRS[@]} -gt 0 ]]; then
  CLEANUP_REPORT+="## Sessions (older than ${SESSION_DAYS} days)\n\n"
  for dir in "${SESSION_DIRS[@]}"; do
    size=$(get_dir_size "$dir")
    CLEANUP_REPORT+="- $(basename "$dir") - $size\n"
  done
  CLEANUP_REPORT+="\n"
fi

if [[ ${#TASK_DIRS[@]} -gt 0 ]]; then
  CLEANUP_REPORT+="## Completed Tasks (older than ${TASK_DAYS} days)\n\n"
  for dir in "${TASK_DIRS[@]}"; do
    size=$(get_dir_size "$dir")
    CLEANUP_REPORT+="- $(basename "$dir") - $size\n"
  done
  CLEANUP_REPORT+="\n"
fi

if [[ ${#EXTERNAL_DIRS[@]} -gt 0 ]]; then
  CLEANUP_REPORT+="## External Context Cache (older than ${EXTERNAL_DAYS} days)\n\n"
  for dir in "${EXTERNAL_DIRS[@]}"; do
    size=$(get_dir_size "$dir")
    CLEANUP_REPORT+="- $(basename "$dir") - $size\n"
  done
  CLEANUP_REPORT+="\n"
fi

# If not in force mode, ask for approval
if [[ "$FORCE_MODE" != "true" ]]; then
  echo "# Cleanup Report"
  echo ""
  echo -e "$CLEANUP_REPORT"
  echo "Total items to clean: $TOTAL_ITEMS"
  echo ""
  echo "Run with --force to proceed with cleanup"
  echo "Run with --days=N to customize age threshold"
  echo ""
  
  cat <<EOF
{
  "status": "approval_required",
  "message": "Cleanup requires approval. Run with --force to proceed.",
  "preview": {
    "sessions": ${#SESSION_DIRS[@]},
    "tasks": ${#TASK_DIRS[@]},
    "external": ${#EXTERNAL_DIRS[@]},
    "total": $TOTAL_ITEMS
  }
}
EOF
  exit 0
fi

# Perform cleanup
CLEANED_SESSIONS=0
CLEANED_TASKS=0
CLEANED_EXTERNAL=0

# Clean sessions
for dir in "${SESSION_DIRS[@]}"; do
  if rm -rf "$dir" 2>/dev/null; then
    ((CLEANED_SESSIONS++))
  fi
done

# Clean tasks
for dir in "${TASK_DIRS[@]}"; do
  if rm -rf "$dir" 2>/dev/null; then
    ((CLEANED_TASKS++))
  fi
done

# Clean external context
for dir in "${EXTERNAL_DIRS[@]}"; do
  if rm -rf "$dir" 2>/dev/null; then
    ((CLEANED_EXTERNAL++))
  fi
done

TOTAL_CLEANED=$((CLEANED_SESSIONS + CLEANED_TASKS + CLEANED_EXTERNAL))

# Output JSON result
cat <<EOF
{
  "status": "success",
  "message": "Cleanup completed successfully",
  "cleaned": {
    "sessions": $CLEANED_SESSIONS,
    "tasks": $CLEANED_TASKS,
    "external": $CLEANED_EXTERNAL,
    "total": $TOTAL_CLEANED
  },
  "thresholds": {
    "sessionDays": $SESSION_DAYS,
    "taskDays": $TASK_DAYS,
    "externalDays": $EXTERNAL_DAYS
  }
}
EOF
