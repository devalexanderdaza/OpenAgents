# OAC Plugin - First-Time Setup Guide

**Version**: 1.0.0  
**Date**: 2026-02-16  
**Audience**: First-time users  
**Time**: 5-10 minutes

---

## 🎯 What You'll Accomplish

By the end of this guide, you'll have:
- ✅ OAC plugin installed and verified
- ✅ Context files downloaded
- ✅ Working development workflow
- ✅ Understanding of the 6-stage process

**No prior experience needed** — just follow the steps in order.

---

## 📋 Prerequisites

Before starting, ensure you have:
- [ ] Claude Code installed and working
- [ ] Internet connection (for downloading context files)
- [ ] A project directory to work in

---

## 🚀 Step-by-Step Setup

### Step 1: Install the Plugin

**Choose ONE method:**

#### Option A: From GitHub Marketplace (Recommended)

```bash
# Add the marketplace
/plugin marketplace add darrenhinde/OpenAgentsControl

# Install the plugin
/plugin install oac
```

**Expected output**:
```
✓ Marketplace added: darrenhinde/OpenAgentsControl
✓ Plugin installed: oac
✓ Location: ~/.claude/plugins/cache/oac/
```

#### Option B: Local Development

```bash
# Navigate to the repo
cd /path/to/OpenAgentsControl

# Start Claude with the plugin
claude --plugin-dir ./plugins/claude-code
```

**Expected output**:
```
✓ Loading plugin from: ./plugins/claude-code
✓ Plugin loaded: oac
```

---

### Step 2: Verify Installation

Run the status command to check everything is working:

```bash
/oac:status
```

**Expected output**:
```
OAC Plugin Status
=================

Plugin Version: 1.0.0
Status: ✅ Installed

Components:
- Subagents: 6 available
  ✓ task-manager
  ✓ context-scout
  ✓ external-scout
  ✓ coder-agent
  ✓ test-engineer
  ✓ code-reviewer

- Skills: 9 available
  ✓ using-oac
  ✓ context-discovery
  ✓ external-scout
  ✓ task-breakdown
  ✓ code-execution
  ✓ test-generation
  ✓ code-review
  ✓ context-manager
  ✓ parallel-execution

- Commands: 4 available
  ✓ /oac:setup
  ✓ /oac:help
  ✓ /oac:status
  ✓ /oac:cleanup

Context Files: ⚠️ Not installed yet
```

**✅ Success indicator**: You should see "Plugin Version: 1.0.0" and all components listed.

**❌ If you see errors**: See [Troubleshooting](#troubleshooting) section below.

---

### Step 3: Download Context Files

Context files contain coding standards, security patterns, and workflow guides that OAC uses to ensure high-quality code.

**Choose ONE option:**

#### Option A: Core Context Only (Recommended for First-Time Users)

```bash
/oac:setup --core
```

**What this downloads**: ~50 essential files (standards, workflows, patterns)  
**Download time**: 30-60 seconds  
**Disk space**: ~2 MB

**Expected output**:
```
Downloading OAC Context Files
==============================

Category: core
Source: https://github.com/darrenhinde/OpenAgentsControl

Downloading files...
✓ .opencode/context/core/standards/code-quality.md
✓ .opencode/context/core/standards/security-patterns.md
✓ .opencode/context/core/standards/typescript.md
✓ .opencode/context/core/workflows/6-stage-workflow.md
... (46 more files)

Summary:
========
✓ Downloaded: 50 files
✓ Location: .opencode/context/
✓ Manifest: plugins/claude-code/.context-manifest.json

Next steps:
- Run /oac:status to verify
- Start coding with /using-oac
```

#### Option B: All Context (For Advanced Users)

```bash
/oac:setup --all
```

**What this downloads**: ~200 files (includes examples, guides, plugin docs)  
**Download time**: 2-3 minutes  
**Disk space**: ~8 MB

---

### Step 4: Verify Context Installation

Check that context files were downloaded successfully:

```bash
/oac:status
```

**Expected output**:
```
OAC Plugin Status
=================

Plugin Version: 1.0.0
Status: ✅ Installed

Context Files: ✅ Installed
- Version: 1.0.0
- Location: .opencode/context/
- Files: 50 (core)
- Last updated: 2026-02-16

Components:
... (same as before)
```

**✅ Success indicator**: "Context Files: ✅ Installed"

**You can also verify manually**:
```bash
# Check that context directory exists
ls .opencode/context/

# Should show:
# core/  openagents-repo/  navigation.md
```

---

### Step 5: View Available Features

Get an overview of what OAC can do:

```bash
/oac:help
```

**Expected output**: A comprehensive guide showing:
- 6-stage workflow overview
- Available skills and when to use them
- Available subagents and their purposes
- Available commands
- Quick start examples

**Take 2 minutes to skim this output** — it's your reference guide.

---

### Step 6: Test the Workflow

Let's test OAC with a simple task to ensure everything works.

**Type this into Claude Code**:
```
Add a hello world function to a new file called utils.ts
```

**What should happen**:

1. **Stage 1: Analyze & Discover**
   ```
   I'll help you add a hello world function. Let me discover relevant context first.
   
   Invoking /context-discovery to find coding standards...
   ```

2. **Stage 2: Plan & Approve**
   ```
   Plan:
   - Create src/utils.ts
   - Add helloWorld() function
   - Follow TypeScript standards from context
   
   Files to create:
   - src/utils.ts
   
   May I proceed with this plan? (yes/no)
   ```
   
   **Type**: `yes`

3. **Stage 3: LoadContext**
   ```
   Loading context files...
   ✓ Read .opencode/context/core/standards/typescript.md
   ✓ Read .opencode/context/core/standards/code-quality.md
   ```

4. **Stage 4: Execute**
   ```
   Creating src/utils.ts...
   ✓ File created with helloWorld() function
   ```

5. **Stage 5: Validate**
   ```
   Validating implementation...
   ✓ TypeScript syntax valid
   ✓ Follows coding standards
   ✓ No anti-patterns detected
   ```

6. **Stage 6: Complete**
   ```
   ✅ Task completed successfully!
   
   Summary:
   - Created src/utils.ts
   - Added helloWorld() function
   - Follows TypeScript standards
   ```

**✅ Success indicator**: You should see all 6 stages complete without errors.

---

## 🎓 Understanding the 6-Stage Workflow

Every task in OAC follows this workflow:

```
┌─────────────────────────────────────────────────────────────┐
│ Stage 1: Analyze & Discover                                 │
│ - Understand what you're asking for                         │
│ - Find relevant context files (standards, patterns)         │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ Stage 2: Plan & Approve                                     │
│ - Present implementation plan                               │
│ - REQUEST APPROVAL before proceeding                        │
│ - Confirm approach with you                                 │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ Stage 3: LoadContext                                        │
│ - Read all discovered context files                         │
│ - Load coding standards, security patterns                  │
│ - Pre-load everything needed for execution                  │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ Stage 4: Execute                                            │
│ - Simple tasks (1-3 files): Direct implementation           │
│ - Complex tasks (4+ files): Break down into subtasks        │
│ - Follow loaded standards and patterns                      │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ Stage 5: Validate                                           │
│ - Run tests and validation                                  │
│ - STOP on failure — fix before proceeding                   │
│ - Verify acceptance criteria met                            │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ Stage 6: Complete                                           │
│ - Update documentation                                      │
│ - Summarize changes                                         │
│ - Return results                                            │
└─────────────────────────────────────────────────────────────┘
```

**Key points**:
- **Approval gate at Stage 2** — You control what gets implemented
- **Context loaded upfront** — Ensures consistent, high-quality code
- **Validation before completion** — Catches issues early
- **Automatic for every task** — You don't need to invoke it manually

---

## 🎯 What's Next?

Now that OAC is set up, you can:

### 1. Start Building Features

Just describe what you want to build:
```
Build a user authentication system with JWT tokens
```

OAC will:
- Discover relevant security patterns
- Break down into subtasks (if complex)
- Implement following best practices
- Generate tests
- Review code quality

### 2. Explore Advanced Features

**Context Manager** — Set up project-specific configuration:
```
/context-manager
```

**Parallel Execution** — Speed up multi-component features:
```
# Automatically used when tasks are independent
# Example: Frontend + Backend + Tests run simultaneously
```

**External Scout** — Fetch current library documentation:
```
/external-scout drizzle schemas
/external-scout react hooks
```

### 3. Learn the Skills

Each skill has a specific purpose:

| Skill | When to Use |
|-------|-------------|
| `/using-oac` | Auto-invoked for every task |
| `/context-discovery` | Find relevant standards and patterns |
| `/external-scout` | Get current library documentation |
| `/task-breakdown` | Break down complex features |
| `/code-execution` | Implement features |
| `/test-generation` | Create comprehensive tests |
| `/code-review` | Review code quality |
| `/context-manager` | Set up projects and configuration |
| `/parallel-execution` | Execute independent tasks simultaneously |

### 4. Read the Documentation

- **Quick Start**: `QUICK-START.md` — Usage examples and workflows
- **Installation**: `INSTALL.md` — Detailed installation guide
- **Full README**: `README.md` — Complete system overview

---

## 🆘 Troubleshooting

### Issue: Plugin not found

**Symptom**: `/oac:status` returns "command not found"

**Solution**:
```bash
# Check plugin list
/plugin list

# Should show "oac" in the list
# If not, reinstall:
/plugin install oac
```

---

### Issue: Context files not downloading

**Symptom**: `/oac:setup --core` fails or times out

**Solution**:
```bash
# Check internet connection
ping github.com

# Try again with verbose output
/oac:setup --core --verbose

# If still failing, check GitHub access
curl https://raw.githubusercontent.com/darrenhinde/OpenAgentsControl/main/README.md
```

---

### Issue: Skills not working

**Symptom**: `/context-discovery` returns "skill not found"

**Solution**:
```bash
# Verify skill files exist
ls ~/.claude/plugins/cache/oac/skills/

# Should show 9 directories
# If missing, reinstall plugin
/plugin uninstall oac
/plugin install oac
```

---

### Issue: Subagents not available

**Symptom**: Error when trying to invoke subagent

**Solution**:
```bash
# Check status
/oac:status

# Should show 6 subagents
# If missing, verify agent files
ls ~/.claude/plugins/cache/oac/agents/

# Should show 6 .md files
# If missing, reinstall plugin
```

---

### Issue: Workflow not auto-starting

**Symptom**: Tasks don't automatically invoke `/using-oac`

**Solution**:
```bash
# Check hooks are installed
ls ~/.claude/plugins/cache/oac/hooks/

# Should show:
# - hooks.json
# - session-start.sh

# Restart Claude Code to reload hooks
```

---

### Issue: Context files exist but not being used

**Symptom**: OAC says "context not found" but files exist

**Solution**:
```bash
# Verify context location
ls .opencode/context/core/standards/

# Should show multiple .md files

# Check manifest
cat plugins/claude-code/.context-manifest.json

# Should show version and file list

# If manifest missing, re-run setup
/oac:setup --core --force
```

---

## ✅ Success Checklist

Before you finish, verify:

- [ ] `/oac:status` shows "Plugin Version: 1.0.0"
- [ ] `/oac:status` shows "Context Files: ✅ Installed"
- [ ] `/oac:status` shows 6 subagents, 9 skills, 4 commands
- [ ] `.opencode/context/` directory exists with files
- [ ] Test task completed successfully (hello world example)
- [ ] You understand the 6-stage workflow
- [ ] You know where to find help (`/oac:help`)

**All checked?** 🎉 **You're ready to build with OAC!**

---

## 📚 Additional Resources

### Quick Reference

| Command | Purpose |
|---------|---------|
| `/oac:status` | Check installation status |
| `/oac:help` | View comprehensive help |
| `/oac:setup --core` | Download context files |
| `/oac:cleanup` | Clean up old temporary files |

### Documentation

- **This guide**: First-time setup (you are here)
- **QUICK-START.md**: Usage examples and workflows
- **INSTALL.md**: Detailed installation guide
- **README.md**: Complete system overview

### Support

- **Issues**: https://github.com/darrenhinde/OpenAgentsControl/issues
- **Discussions**: https://github.com/darrenhinde/OpenAgentsControl/discussions
- **Status Check**: Run `/oac:status` for diagnostic information

---

## 🎉 Welcome to OAC!

You're now ready to build high-quality, context-aware code with OpenAgents Control.

**Remember**:
- OAC automatically guides you through the 6-stage workflow
- Approval gates keep you in control
- Context files ensure consistent, high-quality code
- Skills and subagents handle the complexity

**Happy coding!** 🚀

---

**Version**: 1.0.0  
**Last Updated**: 2026-02-16  
**Status**: Production Ready
