---
name: install-context
description: Install OpenAgents Control context files from registry with interactive profile selection
argument-hint: [--profile=<profile>] [--force] [--dry-run] [--verbose]
---

# Install Context Command

$ARGUMENTS

## Overview

Install context files from the OpenAgents Control registry with interactive profile selection.

**Available profiles**: essential, standard, extended, specialized, all

**Options**:
- `--profile=<profile>` - Install specific profile (skips interactive selection)
- `--force` - Force reinstall even if already installed
- `--dry-run` - Preview what would be installed without installing
- `--verbose` - Show detailed installation progress
- `--categories=<ids>` - Install specific context components (comma-separated)

---

## Usage

### Interactive Mode (Recommended)

```
/install-context
```

This will:
1. Check current installation status
2. Ask which profile to install
3. Confirm before proceeding
4. Run installation
5. Verify files
6. Offer cleanup options

### Direct Mode (With Options)

```
# Install essential profile
/install-context --profile=essential

# Force reinstall standard profile
/install-context --profile=standard --force

# Preview extended profile
/install-context --profile=extended --dry-run

# Install with verbose output
/install-context --profile=standard --verbose

# Install specific components
/install-context --categories=core-standards,openagents-repo
```

---

## How It Works

This command invokes the `install-context` skill which:

1. **Checks current installation** - Shows what's already installed (if any)
2. **Asks for profile** - Interactive selection or uses `--profile` option
3. **Confirms installation** - Shows summary and asks for confirmation
4. **Runs TypeScript installer** - Executes `scripts/install-context.ts`
5. **Verifies installation** - Checks files exist and manifest is created
6. **Offers cleanup** - Asks about cleaning up temporary files

---

## Profile Descriptions

**essential** (Recommended for getting started)
- Minimal components for basic functionality
- ~4 components, ~30 seconds download
- Includes: core patterns, project context, navigation

**standard** (Recommended for most users)
- Standard components for typical use
- ~12 components, ~2 minutes download
- Includes: essential + development workflows + common patterns

**extended** (For advanced features)
- Extended components for advanced features
- ~30 components, ~5 minutes download
- Includes: standard + specialized domains + advanced patterns

**specialized** (For specific domains)
- Specialized components for specific domains
- ~50 components, ~10 minutes download
- Includes: extended + domain-specific contexts (UI, data, product, etc.)

**all** (Complete installation)
- All available context components
- ~191 components, ~20 minutes download
- Includes: Everything in the registry

---

## Examples

### Example 1: First-time Installation

```
User: /install-context