---
name: install-context
description: Install context files from registry. Use when user mentions "install context", "download context", or context is missing.
disable-model-invocation: true
---

# Install Context

## Overview

Guide user through installing context files from OpenAgents Control registry with profile selection.

**Announce at start:** "I'm using the install-context skill to set up your context files."

---

## The Process

### Step 1: Check Current Installation

```bash
cat ${CLAUDE_PLUGIN_ROOT}/.context-manifest.json 2>/dev/null
```

**If exists:** Show current profile and ask if they want to change/reinstall.

**If missing:** Proceed to Step 2.

---

### Step 2: Ask Which Profile

Present options, ask user to choose:

```
Available profiles:

essential   - Core patterns only (~4 components, 30s)
standard    - Typical use (~12 components, 2min) [RECOMMENDED]
extended    - Advanced features (~30 components, 5min)
specialized - Domain-specific (~50 components, 10min)
all         - Everything (~191 components, 20min)

Which profile? [standard]
```

Wait for response.

---

### Step 3: Run Installer

```bash
cd ${CLAUDE_PLUGIN_ROOT}/scripts
bun run install-context.ts --profile={selected_profile}
```

**If bun is not available, fallback to:** `node install-context.js --profile={selected_profile}`

**If user provided --force or --dry-run:** Pass those flags.

Show output to user.

---

### Step 4: Verify

```bash
cat ${CLAUDE_PLUGIN_ROOT}/.context-manifest.json
ls ${CLAUDE_PLUGIN_ROOT}/context/
```

Report: "✓ Installed {count} components. Context ready."

---

## CLI Options

If user provides options, skip interactive prompts:

```bash
/install-context --profile=essential
/install-context --force
/install-context --dry-run
/install-context --categories=core-standards,openagents-repo
```

---

## Error Handling

**Git not installed:**
```
✗ Git required. Install: brew install git
```

**Network failure:**
```
✗ Can't reach GitHub. Check connection and retry.
```

**Already installed (without --force):**
```
⚠ Already installed. Use --force to reinstall.
```

---

## Remember

- Keep it simple - just install and verify
- Don't over-explain profiles
- Show progress from installer
- Verify manifest exists
- Done

---

## Related

- `using-oac` - Uses installed context
- `context-discovery` - Discovers from installed context
