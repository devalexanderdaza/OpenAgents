#!/usr/bin/env bash
# verify-context.sh - Validate context structure for Claude Code plugin
# Exit codes: 0 (valid), 1 (invalid)

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counters
ERRORS=0
WARNINGS=0

# Get plugin root directory
PLUGIN_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CONTEXT_DIR="${PLUGIN_ROOT}/context"
MANIFEST_FILE="${PLUGIN_ROOT}/.context-manifest.json"

echo "🔍 Verifying context structure..."
echo ""

# Function to report error
error() {
  echo -e "${RED}✗ ERROR:${NC} $1"
  ((ERRORS++))
}

# Function to report warning
warning() {
  echo -e "${YELLOW}⚠ WARNING:${NC} $1"
  ((WARNINGS++))
}

# Function to report success
success() {
  echo -e "${GREEN}✓${NC} $1"
}

# Check 1: Context directory exists
echo "Checking context directory..."
if [[ ! -d "$CONTEXT_DIR" ]]; then
  error "Context directory not found: $CONTEXT_DIR"
else
  success "Context directory exists"
fi

# Check 2: Required top-level categories exist
echo ""
echo "Checking required categories..."
REQUIRED_CATEGORIES=(
  "core"
  "openagents-repo"
  "development"
  "ui"
  "content-creation"
  "data"
  "product"
  "learning"
)

for category in "${REQUIRED_CATEGORIES[@]}"; do
  if [[ ! -d "$CONTEXT_DIR/$category" ]]; then
    warning "Missing category: $category"
  else
    success "Category exists: $category"
  fi
done

# Check 3: Navigation files exist
echo ""
echo "Checking navigation files..."

# Main navigation
if [[ ! -f "$CONTEXT_DIR/navigation.md" ]]; then
  error "Missing main navigation.md"
else
  success "Main navigation.md exists"
  
  # Validate navigation.md structure
  if ! grep -q "^# Context Navigation" "$CONTEXT_DIR/navigation.md"; then
    warning "navigation.md missing expected header"
  fi
fi

# Category navigation files
for category in "${REQUIRED_CATEGORIES[@]}"; do
  NAV_FILE="$CONTEXT_DIR/$category/navigation.md"
  if [[ -d "$CONTEXT_DIR/$category" ]] && [[ ! -f "$NAV_FILE" ]]; then
    warning "Missing navigation.md in $category/"
  fi
done

# Check 4: Core standards exist
echo ""
echo "Checking core standards..."
CORE_STANDARDS=(
  "core/standards/code-quality.md"
  "core/standards/documentation.md"
  "core/standards/test-coverage.md"
)

for standard in "${CORE_STANDARDS[@]}"; do
  if [[ ! -f "$CONTEXT_DIR/$standard" ]]; then
    warning "Missing core standard: $standard"
  else
    success "Found: $standard"
  fi
done

# Check 5: Validate .context-manifest.json
echo ""
echo "Checking .context-manifest.json..."
if [[ ! -f "$MANIFEST_FILE" ]]; then
  warning ".context-manifest.json not found (run download-context.sh first)"
else
  success ".context-manifest.json exists"
  
  # Validate JSON format
  if ! jq empty "$MANIFEST_FILE" 2>/dev/null; then
    error ".context-manifest.json is not valid JSON"
  else
    success ".context-manifest.json is valid JSON"
    
    # Check required fields
    REQUIRED_FIELDS=("version" "source" "updated_at" "categories")
    for field in "${REQUIRED_FIELDS[@]}"; do
      if ! jq -e ".$field" "$MANIFEST_FILE" >/dev/null 2>&1; then
        error ".context-manifest.json missing required field: $field"
      else
        success "Manifest has field: $field"
      fi
    done
  fi
fi

# Check 6: Validate context file metadata
echo ""
echo "Checking context file metadata..."
CONTEXT_FILES=$(find "$CONTEXT_DIR" -name "*.md" -type f 2>/dev/null || true)
CHECKED_FILES=0
INVALID_FILES=0

for file in $CONTEXT_FILES; do
  # Skip navigation files (they have different format)
  if [[ "$file" == *"/navigation.md" ]]; then
    continue
  fi
  
  ((CHECKED_FILES++))
  
  # Check for context metadata comment
  if ! head -n 1 "$file" | grep -q "^<!-- Context:"; then
    ((INVALID_FILES++))
    if [[ $INVALID_FILES -le 5 ]]; then
      warning "Missing context metadata: ${file#$CONTEXT_DIR/}"
    fi
  fi
done

if [[ $CHECKED_FILES -gt 0 ]]; then
  if [[ $INVALID_FILES -eq 0 ]]; then
    success "All $CHECKED_FILES context files have metadata"
  else
    warning "$INVALID_FILES of $CHECKED_FILES files missing metadata"
  fi
fi

# Check 7: Verify no broken internal links
echo ""
echo "Checking for broken internal links..."
BROKEN_LINKS=0

for file in $CONTEXT_FILES; do
  # Extract markdown links
  while IFS= read -r link; do
    # Skip external links
    if [[ "$link" =~ ^https?:// ]]; then
      continue
    fi
    
    # Resolve relative path
    FILE_DIR=$(dirname "$file")
    LINK_PATH="$FILE_DIR/$link"
    
    if [[ ! -f "$LINK_PATH" ]]; then
      ((BROKEN_LINKS++))
      if [[ $BROKEN_LINKS -le 5 ]]; then
        warning "Broken link in ${file#$CONTEXT_DIR/}: $link"
      fi
    fi
  done < <(grep -oP '\[.*?\]\(\K[^)]+' "$file" 2>/dev/null || true)
done

if [[ $BROKEN_LINKS -eq 0 ]]; then
  success "No broken internal links found"
elif [[ $BROKEN_LINKS -gt 5 ]]; then
  warning "Found $BROKEN_LINKS broken links (showing first 5)"
fi

# Summary
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Summary:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [[ $ERRORS -eq 0 ]] && [[ $WARNINGS -eq 0 ]]; then
  echo -e "${GREEN}✓ Context structure is valid${NC}"
  exit 0
elif [[ $ERRORS -eq 0 ]]; then
  echo -e "${YELLOW}⚠ Context structure is valid with $WARNINGS warnings${NC}"
  exit 0
else
  echo -e "${RED}✗ Context structure has $ERRORS errors and $WARNINGS warnings${NC}"
  exit 1
fi
