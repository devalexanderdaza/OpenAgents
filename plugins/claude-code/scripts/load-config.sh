#!/bin/bash
# load-config.sh - Load .oac configuration file
# Searches for .oac in current directory, then ~/.oac
# Exports configuration as environment variables

set -euo pipefail

# Find config file
CONFIG_FILE=""
if [[ -f ".oac" ]]; then
  CONFIG_FILE=".oac"
elif [[ -f "${HOME}/.oac" ]]; then
  CONFIG_FILE="${HOME}/.oac"
fi

# If no config file found, return defaults
if [[ -z "$CONFIG_FILE" ]]; then
  cat <<EOF
{
  "status": "no_config",
  "message": "No .oac config file found. Using defaults.",
  "config": {
    "version": "1.0",
    "context": {
      "auto_download": false,
      "categories": ["core", "openagents-repo"],
      "update_check": true,
      "cache_days": 7
    },
    "cleanup": {
      "auto_prompt": true,
      "session_days": 7,
      "task_days": 30,
      "external_days": 7
    },
    "workflow": {
      "auto_approve": false,
      "verbose": false
    },
    "external_scout": {
      "enabled": true,
      "cache_enabled": true,
      "sources": ["context7"]
    }
  }
}
EOF
  exit 0
fi

# Parse config file (simple key-value parsing)
declare -A CONFIG

while IFS= read -r line; do
  # Skip comments and empty lines
  if [[ "$line" =~ ^[[:space:]]*# ]] || [[ -z "$line" ]]; then
    continue
  fi
  
  # Parse key: value pairs
  if [[ "$line" =~ ^([a-z_\.]+):[[:space:]]*(.+)$ ]]; then
    key="${BASH_REMATCH[1]}"
    value="${BASH_REMATCH[2]}"
    
    # Trim quotes from value
    value="${value#\"}"
    value="${value%\"}"
    value="${value# }"
    value="${value% }"
    
    CONFIG["$key"]="$value"
  fi
done < "$CONFIG_FILE"

# Helper function to get config value with default
get_config() {
  local key=$1
  local default=$2
  echo "${CONFIG[$key]:-$default}"
}

# Helper function to convert string to boolean JSON
to_bool() {
  local value=$1
  if [[ "$value" == "true" ]] || [[ "$value" == "yes" ]] || [[ "$value" == "1" ]]; then
    echo "true"
  else
    echo "false"
  fi
}

# Helper function to convert comma-separated string to JSON array
to_array() {
  local value=$1
  local items=()
  
  IFS=',' read -ra items <<< "$value"
  
  local json_array="["
  local first=true
  for item in "${items[@]}"; do
    item="${item# }"
    item="${item% }"
    if [[ "$first" == "true" ]]; then
      first=false
    else
      json_array+=", "
    fi
    json_array+="\"$item\""
  done
  json_array+="]"
  
  echo "$json_array"
}

# Extract configuration values
VERSION=$(get_config "version" "1.0")

# Context settings
CONTEXT_AUTO_DOWNLOAD=$(to_bool "$(get_config "context.auto_download" "false")")
CONTEXT_CATEGORIES=$(to_array "$(get_config "context.categories" "core,openagents-repo")")
CONTEXT_UPDATE_CHECK=$(to_bool "$(get_config "context.update_check" "true")")
CONTEXT_CACHE_DAYS=$(get_config "context.cache_days" "7")

# Cleanup settings
CLEANUP_AUTO_PROMPT=$(to_bool "$(get_config "cleanup.auto_prompt" "true")")
CLEANUP_SESSION_DAYS=$(get_config "cleanup.session_days" "7")
CLEANUP_TASK_DAYS=$(get_config "cleanup.task_days" "30")
CLEANUP_EXTERNAL_DAYS=$(get_config "cleanup.external_days" "7")

# Workflow settings
WORKFLOW_AUTO_APPROVE=$(to_bool "$(get_config "workflow.auto_approve" "false")")
WORKFLOW_VERBOSE=$(to_bool "$(get_config "workflow.verbose" "false")")

# External scout settings
EXTERNAL_SCOUT_ENABLED=$(to_bool "$(get_config "external_scout.enabled" "true")")
EXTERNAL_SCOUT_CACHE_ENABLED=$(to_bool "$(get_config "external_scout.cache_enabled" "true")")
EXTERNAL_SCOUT_SOURCES=$(to_array "$(get_config "external_scout.sources" "context7")")

# Validate configuration
VALIDATION_ERRORS=()

# Validate version
if [[ "$VERSION" != "1.0" ]]; then
  VALIDATION_ERRORS+=("Invalid version: $VERSION (expected 1.0)")
fi

# Validate numeric values
if ! [[ "$CONTEXT_CACHE_DAYS" =~ ^[0-9]+$ ]]; then
  VALIDATION_ERRORS+=("Invalid context.cache_days: must be a number")
fi

if ! [[ "$CLEANUP_SESSION_DAYS" =~ ^[0-9]+$ ]]; then
  VALIDATION_ERRORS+=("Invalid cleanup.session_days: must be a number")
fi

if ! [[ "$CLEANUP_TASK_DAYS" =~ ^[0-9]+$ ]]; then
  VALIDATION_ERRORS+=("Invalid cleanup.task_days: must be a number")
fi

if ! [[ "$CLEANUP_EXTERNAL_DAYS" =~ ^[0-9]+$ ]]; then
  VALIDATION_ERRORS+=("Invalid cleanup.external_days: must be a number")
fi

# If validation errors, output error JSON
if [[ ${#VALIDATION_ERRORS[@]} -gt 0 ]]; then
  ERRORS_JSON="["
  first=true
  for error in "${VALIDATION_ERRORS[@]}"; do
    if [[ "$first" == "true" ]]; then
      first=false
    else
      ERRORS_JSON+=", "
    fi
    ERRORS_JSON+="\"$error\""
  done
  ERRORS_JSON+="]"
  
  cat <<EOF
{
  "status": "validation_error",
  "message": "Configuration validation failed",
  "errors": $ERRORS_JSON,
  "configFile": "$CONFIG_FILE"
}
EOF
  exit 1
fi

# Export as environment variables
export OAC_CONTEXT_AUTO_DOWNLOAD="$CONTEXT_AUTO_DOWNLOAD"
export OAC_CONTEXT_CATEGORIES="$(get_config "context.categories" "core,openagents-repo")"
export OAC_CONTEXT_UPDATE_CHECK="$CONTEXT_UPDATE_CHECK"
export OAC_CONTEXT_CACHE_DAYS="$CONTEXT_CACHE_DAYS"

export OAC_CLEANUP_AUTO_PROMPT="$CLEANUP_AUTO_PROMPT"
export OAC_CLEANUP_SESSION_DAYS="$CLEANUP_SESSION_DAYS"
export OAC_CLEANUP_TASK_DAYS="$CLEANUP_TASK_DAYS"
export OAC_CLEANUP_EXTERNAL_DAYS="$CLEANUP_EXTERNAL_DAYS"

export OAC_WORKFLOW_AUTO_APPROVE="$WORKFLOW_AUTO_APPROVE"
export OAC_WORKFLOW_VERBOSE="$WORKFLOW_VERBOSE"

export OAC_EXTERNAL_SCOUT_ENABLED="$EXTERNAL_SCOUT_ENABLED"
export OAC_EXTERNAL_SCOUT_CACHE_ENABLED="$EXTERNAL_SCOUT_CACHE_ENABLED"
export OAC_EXTERNAL_SCOUT_SOURCES="$(get_config "external_scout.sources" "context7")"

# Output JSON with loaded config
cat <<EOF
{
  "status": "success",
  "message": "Configuration loaded successfully",
  "configFile": "$CONFIG_FILE",
  "config": {
    "version": "$VERSION",
    "context": {
      "auto_download": $CONTEXT_AUTO_DOWNLOAD,
      "categories": $CONTEXT_CATEGORIES,
      "update_check": $CONTEXT_UPDATE_CHECK,
      "cache_days": $CONTEXT_CACHE_DAYS
    },
    "cleanup": {
      "auto_prompt": $CLEANUP_AUTO_PROMPT,
      "session_days": $CLEANUP_SESSION_DAYS,
      "task_days": $CLEANUP_TASK_DAYS,
      "external_days": $CLEANUP_EXTERNAL_DAYS
    },
    "workflow": {
      "auto_approve": $WORKFLOW_AUTO_APPROVE,
      "verbose": $WORKFLOW_VERBOSE
    },
    "external_scout": {
      "enabled": $EXTERNAL_SCOUT_ENABLED,
      "cache_enabled": $EXTERNAL_SCOUT_CACHE_ENABLED,
      "sources": $EXTERNAL_SCOUT_SOURCES
    }
  }
}
EOF
