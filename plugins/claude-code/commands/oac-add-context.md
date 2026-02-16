---
name: oac:add-context
description: Add context files from GitHub, worktrees, local files, or URLs to your project
argument-hint: [source] [options]
---

# Add Context

Add context files to your project from various sources: **$ARGUMENTS**

---

## What This Command Does

The `/oac:add-context` command helps you add context files from:

1. **GitHub repositories** - Team or company standards
2. **Git worktrees** - Local development branches
3. **Local files** - Project-specific patterns
4. **URLs** - Remote documentation

This command invokes the **context-manager** subagent to:
- Discover your context root location
- Fetch/copy files from the source
- Validate file format and structure
- Update navigation for discoverability
- Verify files are accessible via `/context-discovery`

---

## Supported Sources

### 1. GitHub Repository

**Format**: `github:owner/repo[/path][#ref]`

**Examples**:
```bash
# Add from GitHub repo (main branch)
/oac:add-context github:acme-corp/standards

# Add specific path
/oac:add-context github:acme-corp/standards/security

# Add specific branch/tag
/oac:add-context github:acme-corp/standards#v1.0.0

# Add with category
/oac:add-context github:acme-corp/standards --category=team
```

**What it does**:
- Clones repository (shallow, single branch)
- Copies specified path to context root
- Validates markdown files
- Updates navigation
- Cleans up temporary clone

---

### 2. Git Worktree

**Format**: `worktree:/path/to/worktree[/subdir]`

**Examples**:
```bash
# Add from worktree
/oac:add-context worktree:../team-context

# Add specific subdirectory
/oac:add-context worktree:../team-context/standards

# Add with category
/oac:add-context worktree:../team-context/security --category=team
```

**What it does**:
- Validates worktree exists (.git directory)
- Copies files from worktree
- Validates markdown files
- Updates navigation
- Preserves worktree (no cleanup)

**Use case**: Perfect for team members working on shared context in a separate worktree

---

### 3. Local File or Directory

**Format**: `file:./path/to/file-or-dir`

**Examples**:
```bash
# Add single file
/oac:add-context file:./docs/patterns/auth-flow.md

# Add directory
/oac:add-context file:./docs/patterns/

# Add with category and priority
/oac:add-context file:./docs/security.md --category=custom --priority=critical
```

**What it does**:
- Validates file/directory exists
- Copies to context root
- Validates markdown format
- Updates navigation
- Preserves original files

**Use case**: Add project-specific patterns or documentation to context

---

### 4. URL

**Format**: `url:https://example.com/path/to/file.md`

**Examples**:
```bash
# Add from URL
/oac:add-context url:https://example.com/standards/security.md

# Add with category
/oac:add-context url:https://raw.githubusercontent.com/owner/repo/main/doc.md --category=external
```

**What it does**:
- Downloads file via HTTP/HTTPS
- Validates markdown format
- Saves to context root
- Updates navigation

**Use case**: Add public documentation or standards from the web

---

## Options

### `--category=<name>`

**Purpose**: Specify target category for context files

**Default**: `custom`

**Examples**:
```bash
# Add to team category
/oac:add-context github:acme-corp/standards --category=team

# Add to custom category
/oac:add-context file:./docs/patterns.md --category=custom

# Add to core category (override defaults)
/oac:add-context file:./security.md --category=core
```

**Categories**:
- `core` - Essential standards and workflows
- `team` - Team/company-specific context
- `custom` - Project-specific overrides
- `external` - External library documentation
- `personal` - Personal templates and patterns

---

### `--priority=<level>`

**Purpose**: Set priority level for context files

**Default**: `medium`

**Levels**:
- `critical` - Must-read files for all tasks
- `high` - Strongly recommended files
- `medium` - Optional but helpful files

**Examples**:
```bash
# Mark as critical
/oac:add-context file:./security-policy.md --priority=critical

# Mark as high priority
/oac:add-context github:acme-corp/standards --priority=high
```

**Impact**: Priority affects ranking in `/context-discovery` results

---

### `--overwrite`

**Purpose**: Overwrite existing files with same name

**Default**: `false` (skip existing files)

**Examples**:
```bash
# Overwrite existing files
/oac:add-context github:acme-corp/standards --overwrite

# Skip existing files (default)
/oac:add-context github:acme-corp/standards
```

**Warning**: Use with caution - overwrites local modifications

---

### `--dry-run`

**Purpose**: Preview what would be added without making changes

**Examples**:
```bash
# Preview GitHub addition
/oac:add-context github:acme-corp/standards --dry-run

# Preview worktree addition
/oac:add-context worktree:../team-context --dry-run
```

**Output**:
```
Dry Run: No changes will be made

Would add:
- security-patterns.md → .opencode/context/team/security-patterns.md
- auth-guidelines.md → .opencode/context/team/auth-guidelines.md
- deployment-process.md → .opencode/context/team/deployment-process.md

Would update:
- .opencode/context/team/navigation.md
- .opencode/context/navigation.md

Run without --dry-run to apply changes.
```

---

## Usage Examples

### Example 1: Add Team Standards from GitHub

**Command**:
```bash
/oac:add-context github:acme-corp/engineering-standards/security --category=team --priority=critical
```

**Process**:
1. Discover context root → `.opencode/context`
2. Clone `acme-corp/engineering-standards` (shallow)
3. Copy `security/` directory
4. Validate markdown files
5. Copy to `.opencode/context/team/security/`
6. Update navigation files
7. Verify discoverability

**Output**:
```
✅ Context root discovered: .opencode/context

✅ Cloned from GitHub: acme-corp/engineering-standards
   Branch: main
   Path: security/

✅ Validation passed:
   - security-policies.md ✅
   - auth-patterns.md ✅
   - data-protection.md ✅

✅ Copied to: .opencode/context/team/security/

✅ Navigation updated:
   - .opencode/context/team/navigation.md
   - .opencode/context/navigation.md

✅ Verification: All files discoverable via /context-discovery

Summary:
- Added 3 context files to team/security/
- Source: github:acme-corp/engineering-standards/security
- Category: team
- Priority: critical
- Discoverable: ✅
```

---

### Example 2: Add from Git Worktree

**Command**:
```bash
/oac:add-context worktree:../team-context/standards --category=team
```

**Process**:
1. Discover context root → `.claude/context` (from .oac config)
2. Validate worktree exists
3. Copy files from `../team-context/standards/`
4. Validate markdown files
5. Copy to `.claude/context/team/standards/`
6. Update navigation
7. Verify discoverability

**Output**:
```
✅ Context root discovered: .claude/context (from .oac config)

✅ Worktree validated: ../team-context/.git exists

✅ Copied from worktree: ../team-context/standards
   Files: 5 markdown files

✅ Validation passed:
   - code-quality.md ✅
   - naming-conventions.md ✅
   - testing-standards.md ✅
   - deployment-process.md ✅
   - review-checklist.md ✅

✅ Copied to: .claude/context/team/standards/

✅ Navigation updated:
   - .claude/context/team/navigation.md
   - .claude/context/navigation.md

✅ Verification: All files discoverable via /context-discovery

Summary:
- Added 5 context files to team/standards/
- Source: worktree:../team-context/standards
- Category: team
- Priority: medium (default)
- Discoverable: ✅
```

---

### Example 3: Add Local Pattern File

**Command**:
```bash
/oac:add-context file:./docs/patterns/auth-flow.md --category=custom --priority=high
```

**Process**:
1. Discover context root → `context` (found in project root)
2. Validate file exists
3. Validate markdown format
4. Copy to `context/custom/patterns/`
5. Update navigation
6. Verify discoverability

**Output**:
```
✅ Context root discovered: context

✅ File validated: ./docs/patterns/auth-flow.md
   Format: markdown ✅
   Structure: valid ✅
   Size: 2.3 KB

✅ Copied to: context/custom/patterns/auth-flow.md

✅ Navigation updated:
   - context/custom/navigation.md
   - context/navigation.md

✅ Verification: File discoverable via /context-discovery

Summary:
- Added 1 context file to custom/patterns/
- Source: file:./docs/patterns/auth-flow.md
- Category: custom
- Priority: high
- Discoverable: ✅
```

---

### Example 4: Add from URL

**Command**:
```bash
/oac:add-context url:https://raw.githubusercontent.com/openagents/standards/main/security.md --category=external --priority=critical
```

**Process**:
1. Discover context root → `.opencode/context`
2. Download file from URL
3. Validate markdown format
4. Save to `.opencode/context/external/`
5. Update navigation
6. Verify discoverability

**Output**:
```
✅ Context root discovered: .opencode/context

✅ Downloaded from URL: https://raw.githubusercontent.com/openagents/standards/main/security.md
   Size: 5.2 KB
   Content-Type: text/plain

✅ Validation passed:
   - security.md ✅

✅ Saved to: .opencode/context/external/security.md

✅ Navigation updated:
   - .opencode/context/external/navigation.md
   - .opencode/context/navigation.md

✅ Verification: File discoverable via /context-discovery

Summary:
- Added 1 context file to external/
- Source: url:https://raw.githubusercontent.com/...
- Category: external
- Priority: critical
- Discoverable: ✅
```

---

## Integration with OAC Workflow

### Stage 1: Analyze & Discover

**Before adding context**:
```bash
# Discover what context you need
/context-discovery authentication security patterns

# If context is missing, add it
/oac:add-context github:acme-corp/security-standards --category=team
```

### Stage 3: LoadContext

**After adding context**:
```bash
# Context is now discoverable
/context-discovery authentication security patterns

# Returns newly added files:
# - .opencode/context/team/security-patterns.md ✅
```

### Stage 6: Complete

**After implementing a feature**:
```bash
# Add learned patterns to context
/oac:add-context file:./docs/new-pattern.md --category=custom

# Now available for future tasks
```

---

## Advanced Usage

### Batch Addition

```bash
# Add multiple sources
/oac:add-context github:acme-corp/standards --category=team
/oac:add-context worktree:../team-context --category=team
/oac:add-context file:./docs/patterns/ --category=custom
```

### Preview Before Adding

```bash
# Dry run to see what would be added
/oac:add-context github:acme-corp/standards --dry-run

# Review output, then add for real
/oac:add-context github:acme-corp/standards --category=team
```

### Update Existing Context

```bash
# Overwrite existing files with latest from GitHub
/oac:add-context github:acme-corp/standards --category=team --overwrite
```

### Add with Specific Branch/Tag

```bash
# Add from specific version
/oac:add-context github:acme-corp/standards#v2.0.0 --category=team

# Add from development branch
/oac:add-context github:acme-corp/standards#develop --category=team
```

---

## Context Root Discovery

The command automatically discovers where to add context:

**Discovery Order**:
1. **Check .oac config** - Read `context.root` setting
2. **Check .claude/context** - Claude Code default
3. **Check context** - Simple root-level directory
4. **Check .opencode/context** - OpenCode/OAC default
5. **Create .opencode/context** - Fallback if none found

**Example .oac config**:
```json
{
  "context": {
    "root": ".claude/context"
  }
}
```

---

## Validation

All added context files are validated:

### Format Validation
- ✅ Valid markdown file
- ✅ UTF-8 encoding
- ✅ No binary content

### Structure Validation
- ✅ Has title (# heading)
- ✅ Has content sections
- ⚠️  Metadata header (optional but recommended)

### Navigation Validation
- ✅ File added to navigation.md
- ✅ Category exists in root navigation
- ✅ Priority set correctly

**Validation Output**:
```
✅ Markdown format valid
✅ Structure valid (title, content)
⚠️  Metadata header missing (recommended but optional)
✅ Navigation entry added

Status: Valid (with warnings)
```

---

## Troubleshooting

### "Source not found"

**Cause**: GitHub repo, worktree, or file doesn't exist

**Solution**:
```bash
# Verify GitHub repo exists
gh repo view acme-corp/standards

# Verify worktree exists
ls -la ../team-context/.git

# Verify local file exists
ls -la ./docs/patterns/auth-flow.md
```

---

### "Validation failed"

**Cause**: File is not valid markdown or has structural issues

**Solution**:
```
Error: Validation failed for security-pattern.md

Issues:
❌ Not a markdown file (detected: text/html)
❌ Missing title (no # heading)
⚠️  No metadata header (recommended)

Fix these issues before adding to context.
```

**Fix**: Convert to markdown, add title, then retry

---

### "Context root not found"

**Cause**: No context directory exists and .oac config missing

**Solution**:
```bash
# Option 1: Let command create default
/oac:add-context github:acme-corp/standards
# Creates .opencode/context automatically

# Option 2: Create .oac config
cat > .oac <<EOF
{
  "context": {
    "root": ".claude/context"
  }
}
EOF

# Option 3: Create directory manually
mkdir -p .opencode/context
```

---

### "Permission denied"

**Cause**: No write access to context directory

**Solution**:
```bash
# Check permissions
ls -la .opencode/

# Fix permissions
chmod -R u+w .opencode/context/
```

---

### "Navigation update failed"

**Cause**: Navigation file is malformed or locked

**Solution**:
```bash
# Backup current navigation
cp .opencode/context/navigation.md .opencode/context/navigation.md.backup

# Let command regenerate navigation
/oac:add-context github:acme-corp/standards --category=team
```

---

## Tips

### ✅ Do

- **Use --dry-run first** - Preview changes before applying
- **Organize by category** - Use appropriate categories (team, custom, external)
- **Set priority correctly** - Critical for must-read files
- **Verify discoverability** - Test with `/context-discovery` after adding
- **Keep worktrees updated** - Pull latest changes before adding
- **Use version tags** - Pin to specific versions for stability

### ❌ Don't

- **Don't add binary files** - Only markdown files are supported
- **Don't skip validation** - Fix validation errors before adding
- **Don't overwrite without backup** - Use --overwrite carefully
- **Don't add sensitive data** - Keep API keys and secrets out of context
- **Don't add too much** - Only add relevant, high-signal context

---

## Related Commands

- `/oac:setup` - Download OAC context from GitHub
- `/oac:status` - Check context installation status
- `/oac:help` - View all available commands
- `/context-discovery` - Discover added context files

## Related Skills

- `/context-manager` - Manage context configuration
- `/using-oac` - Main workflow (uses added context)

---

## Success Criteria

After running `/oac:add-context`, you should have:

- ✅ Context files copied to context root
- ✅ All files validated (format, structure)
- ✅ Navigation updated for discoverability
- ✅ Files accessible via `/context-discovery`
- ✅ Category and priority set correctly

**Test discoverability**:
```bash
/context-discovery [topic related to added context]
# Should return newly added files
```

---

**Version**: 1.0.0  
**Command**: oac:add-context  
**Last Updated**: 2026-02-16
