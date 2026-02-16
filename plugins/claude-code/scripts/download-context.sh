#!/usr/bin/env bash
# download-context.sh - Fetch context files from GitHub repository
# Part of OpenAgents Control (OAC) Claude Code Plugin

set -euo pipefail

# Configuration
GITHUB_REPO="${GITHUB_REPO:-darrenhinde/OpenAgentsControl}"
GITHUB_BRANCH="${GITHUB_BRANCH:-main}"
CONTEXT_DIR="${CLAUDE_PLUGIN_ROOT:-.}/context"
MANIFEST_FILE="${CLAUDE_PLUGIN_ROOT:-.}/.context-manifest.json"
GITHUB_API_BASE="https://api.github.com/repos/${GITHUB_REPO}"
GITHUB_RAW_BASE="https://raw.githubusercontent.com/${GITHUB_REPO}/${GITHUB_BRANCH}"

# Core categories (minimal required set)
CORE_CATEGORIES=(
  "core"
  "openagents-repo"
)

# All available categories
ALL_CATEGORIES=(
  "core"
  "openagents-repo"
  "development"
  "ui"
  "content-creation"
  "data"
  "product"
  "learning"
  "project"
  "project-intelligence"
)

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Usage information
usage() {
  cat <<EOF
Usage: $(basename "$0") [OPTIONS]

Download context files from OpenAgents Control GitHub repository.

OPTIONS:
  --core              Download core categories only (core, openagents-repo)
  --all               Download all available categories
  --category=NAME     Download specific category (can be used multiple times)
  --branch=NAME       Use specific branch (default: main)
  --pr=NUMBER         Download from pull request
  --force             Force re-download even if files exist
  --help              Show this help message

EXAMPLES:
  # Download core context only
  $(basename "$0") --core

  # Download all context
  $(basename "$0") --all

  # Download specific categories
  $(basename "$0") --category=core --category=development

  # Download from a PR
  $(basename "$0") --pr=123 --core

CATEGORIES:
  Core (required):
    - core              Universal standards & workflows
    - openagents-repo   OpenAgents Control repository work

  Optional:
    - development       Software development (all stacks)
    - ui                Visual design & UX
    - content-creation  Content creation (all formats)
    - data              Data engineering & analytics
    - product           Product management
    - learning          Educational content
    - project           Project-specific context
    - project-intelligence  Project intelligence & decisions

EOF
  exit 0
}

# Logging functions
log_info() {
  echo -e "${BLUE}ℹ${NC} $*"
}

log_success() {
  echo -e "${GREEN}✓${NC} $*"
}

log_warning() {
  echo -e "${YELLOW}⚠${NC} $*"
}

log_error() {
  echo -e "${RED}✗${NC} $*" >&2
}

# Check if command exists
command_exists() {
  command -v "$1" >/dev/null 2>&1
}

# Validate dependencies
check_dependencies() {
  local missing=()
  
  if ! command_exists curl; then
    missing+=("curl")
  fi
  
  if ! command_exists jq; then
    missing+=("jq")
  fi
  
  if [ ${#missing[@]} -gt 0 ]; then
    log_error "Missing required dependencies: ${missing[*]}"
    log_info "Install with: brew install ${missing[*]}"
    exit 1
  fi
}

# Get GitHub authentication token
get_github_token() {
  if [ -n "${GITHUB_TOKEN:-}" ]; then
    echo "$GITHUB_TOKEN"
  elif [ -n "${GH_TOKEN:-}" ]; then
    echo "$GH_TOKEN"
  elif command_exists gh; then
    gh auth token 2>/dev/null || echo ""
  else
    echo ""
  fi
}

# Fetch file from GitHub
fetch_file() {
  local file_path="$1"
  local output_path="$2"
  local token
  token=$(get_github_token)
  
  local url="${GITHUB_RAW_BASE}/.opencode/context/${file_path}"
  
  # Create directory if needed
  mkdir -p "$(dirname "$output_path")"
  
  # Download file
  if [ -n "$token" ]; then
    curl -sf -H "Authorization: token $token" "$url" -o "$output_path"
  else
    curl -sf "$url" -o "$output_path"
  fi
}

# List files in a directory from GitHub
list_github_directory() {
  local dir_path="$1"
  local token
  token=$(get_github_token)
  
  local api_url="${GITHUB_API_BASE}/contents/.opencode/context/${dir_path}?ref=${GITHUB_BRANCH}"
  
  if [ -n "$token" ]; then
    curl -sf -H "Authorization: token $token" "$api_url" | jq -r '.[] | select(.type == "file") | .path' | sed 's|^.opencode/context/||'
  else
    curl -sf "$api_url" | jq -r '.[] | select(.type == "file") | .path' | sed 's|^.opencode/context/||'
  fi
}

# Recursively download directory
download_directory() {
  local category="$1"
  local token
  token=$(get_github_token)
  
  log_info "Downloading category: $category"
  
  # Get all files in the category recursively
  local api_url="${GITHUB_API_BASE}/git/trees/${GITHUB_BRANCH}?recursive=1"
  
  local files
  if [ -n "$token" ]; then
    files=$(curl -sf -H "Authorization: token $token" "$api_url" | \
      jq -r ".tree[] | select(.type == \"blob\" and (.path | startswith(\".opencode/context/${category}/\"))) | .path" | \
      sed 's|^.opencode/context/||')
  else
    files=$(curl -sf "$api_url" | \
      jq -r ".tree[] | select(.type == \"blob\" and (.path | startswith(\".opencode/context/${category}/\"))) | .path" | \
      sed 's|^.opencode/context/||')
  fi
  
  local count=0
  local total
  total=$(echo "$files" | wc -l | tr -d ' ')
  
  while IFS= read -r file; do
    if [ -n "$file" ]; then
      ((count++))
      local output_path="${CONTEXT_DIR}/${file}"
      
      # Show progress
      printf "\r  [%d/%d] %s" "$count" "$total" "$file"
      
      if fetch_file "$file" "$output_path" 2>/dev/null; then
        : # Success, continue
      else
        log_warning "Failed to download: $file"
      fi
    fi
  done <<< "$files"
  
  echo "" # New line after progress
  log_success "Downloaded $count files from $category"
}

# Verify navigation.md files exist
verify_navigation() {
  local categories=("$@")
  local missing=()
  
  log_info "Verifying navigation files..."
  
  for category in "${categories[@]}"; do
    local nav_file="${CONTEXT_DIR}/${category}/navigation.md"
    if [ ! -f "$nav_file" ]; then
      missing+=("$category/navigation.md")
    fi
  done
  
  if [ ${#missing[@]} -gt 0 ]; then
    log_warning "Missing navigation files:"
    for file in "${missing[@]}"; do
      echo "  - $file"
    done
    return 1
  else
    log_success "All navigation files present"
    return 0
  fi
}

# Create context manifest
create_manifest() {
  local categories=("$@")
  
  log_info "Creating context manifest..."
  
  # Get commit SHA
  local token
  token=$(get_github_token)
  
  local commit_sha
  if [ -n "$token" ]; then
    commit_sha=$(curl -sf -H "Authorization: token $token" \
      "${GITHUB_API_BASE}/commits/${GITHUB_BRANCH}" | jq -r '.sha')
  else
    commit_sha=$(curl -sf "${GITHUB_API_BASE}/commits/${GITHUB_BRANCH}" | jq -r '.sha')
  fi
  
  # Create manifest JSON
  cat > "$MANIFEST_FILE" <<EOF
{
  "version": "1.0.0",
  "source": {
    "repository": "${GITHUB_REPO}",
    "branch": "${GITHUB_BRANCH}",
    "commit": "${commit_sha}",
    "downloaded_at": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
  },
  "categories": $(printf '%s\n' "${categories[@]}" | jq -R . | jq -s .),
  "files": {
$(
  for category in "${categories[@]}"; do
    local count
    count=$(find "${CONTEXT_DIR}/${category}" -type f 2>/dev/null | wc -l | tr -d ' ')
    echo "    \"${category}\": ${count},"
  done | sed '$ s/,$//'
)
  }
}
EOF
  
  log_success "Created manifest: $MANIFEST_FILE"
}

# Main download function
download_context() {
  local categories=("$@")
  
  log_info "Starting context download..."
  log_info "Repository: ${GITHUB_REPO}"
  log_info "Branch: ${GITHUB_BRANCH}"
  log_info "Categories: ${categories[*]}"
  echo ""
  
  # Create context directory
  mkdir -p "$CONTEXT_DIR"
  
  # Download each category
  for category in "${categories[@]}"; do
    download_directory "$category"
  done
  
  echo ""
  
  # Verify navigation files
  verify_navigation "${categories[@]}"
  
  # Create manifest
  create_manifest "${categories[@]}"
  
  echo ""
  log_success "Context download complete!"
  log_info "Context location: $CONTEXT_DIR"
  log_info "Manifest: $MANIFEST_FILE"
}

# Parse command line arguments
main() {
  local categories=()
  local download_mode=""
  local force=false
  
  # Parse arguments
  while [[ $# -gt 0 ]]; do
    case $1 in
      --core)
        download_mode="core"
        shift
        ;;
      --all)
        download_mode="all"
        shift
        ;;
      --category=*)
        categories+=("${1#*=}")
        shift
        ;;
      --branch=*)
        GITHUB_BRANCH="${1#*=}"
        shift
        ;;
      --pr=*)
        local pr_number="${1#*=}"
        # Get PR branch
        local token
        token=$(get_github_token)
        if [ -n "$token" ]; then
          GITHUB_BRANCH=$(curl -sf -H "Authorization: token $token" \
            "${GITHUB_API_BASE}/pulls/${pr_number}" | jq -r '.head.ref')
        else
          GITHUB_BRANCH=$(curl -sf "${GITHUB_API_BASE}/pulls/${pr_number}" | jq -r '.head.ref')
        fi
        log_info "Using PR #${pr_number} branch: ${GITHUB_BRANCH}"
        shift
        ;;
      --force)
        force=true
        shift
        ;;
      --help|-h)
        usage
        ;;
      *)
        log_error "Unknown option: $1"
        echo ""
        usage
        ;;
    esac
  done
  
  # Determine categories to download
  if [ "$download_mode" = "core" ]; then
    categories=("${CORE_CATEGORIES[@]}")
  elif [ "$download_mode" = "all" ]; then
    categories=("${ALL_CATEGORIES[@]}")
  elif [ ${#categories[@]} -eq 0 ]; then
    # Default to core if nothing specified
    log_warning "No categories specified, defaulting to --core"
    categories=("${CORE_CATEGORIES[@]}")
  fi
  
  # Check dependencies
  check_dependencies
  
  # Check if context already exists
  if [ -f "$MANIFEST_FILE" ] && [ "$force" = false ]; then
    log_warning "Context already exists. Use --force to re-download."
    log_info "Current manifest:"
    cat "$MANIFEST_FILE" | jq .
    exit 0
  fi
  
  # Download context
  download_context "${categories[@]}"
}

# Run main function
main "$@"
