---
name: context-manager
description: Manage context files, discover context roots, validate structure, and organize project context. Use when adding context from GitHub/worktrees or managing context organization.
context: fork
agent: context-manager
---

# Context Manager Skill

> **Subagent**: context-manager  
> **Purpose**: Manage context files, discover context roots, validate structure, and organize project-specific context for optimal discoverability.

---

## Task

Manage context for: **$ARGUMENTS**

**Operations Available**:
- **discover-root** - Find where context files are stored
- **add-context** - Add context from GitHub, worktrees, local files, or URLs
- **validate** - Validate existing context files
- **update-navigation** - Rebuild navigation files
- **organize** - Reorganize context by category

**Instructions**: Execute the requested context management operation following the guidelines below.

---

## When to Use This Skill

Invoke `/context-manager` when you need to:

- **Set up a new project** with OAC context files
- **Configure context sources** and download preferences
- **Integrate external task systems** (SpecKit, Linear, Jira, custom)
- **Manage personal context** files and templates
- **Troubleshoot context** loading or configuration issues
- **Update or refresh** downloaded context files
- **Configure cleanup** and maintenance settings

**Rule of thumb**: If you're setting up a project or configuring how context works, use this skill.

---

## Context Sources

Context files can come from multiple sources, loaded in priority order:

### 1. Project-Specific Context (Highest Priority)

**Location**: `.opencode/context/` (in your project root)

**Purpose**: Project-specific overrides, custom standards, team conventions

**Use when**:
- Your project has unique coding standards
- You need to override default patterns
- Team-specific workflows or conventions
- Project-specific security requirements

**Example**:
```bash
# Create project-specific override
mkdir -p .opencode/context/core/standards
vim .opencode/context/core/standards/code-quality.md
```

**Priority**: Files here override all other sources

---

### 2. OAC Repository Context (Default)

**Location**: `.opencode/context/` (downloaded from GitHub)

**Purpose**: Standard OAC patterns, workflows, coding standards

**Download via**: `/oac:setup`

**Categories**:
- `core` - Essential standards and workflows
- `openagents-repo` - OAC-specific guides and patterns
- `plugins` - Plugin development guides
- `skills` - Skill creation and usage

**Example**:
```bash
# Download core context only
/oac:setup --core

# Download all context
/oac:setup --all

# Download specific category
/oac:setup --category=standards
```

---

### 3. Personal Context (Global)

**Location**: `~/.opencode/context/` (your home directory)

**Purpose**: Personal templates, preferences, reusable patterns

**Use when**:
- You have personal coding preferences
- Reusable templates across projects
- Personal workflow patterns
- Custom snippets and examples

**Example**:
```bash
# Create personal context
mkdir -p ~/.opencode/context/personal/templates
vim ~/.opencode/context/personal/templates/react-component.md
```

**Priority**: Loaded if not found in project-specific context

---

### 4. External Task Systems

**Location**: Configured via `.oac` file

**Purpose**: Integration with external task management systems

**Supported systems**:
- **SpecKit** - Specification-driven task management
- **Linear** - Issue tracking and project management
- **Jira** - Enterprise project management
- **Custom JSON** - Your own task.json format

**Example**:
```json
{
  "tasks": {
    "source": "speckit",
    "path": "~/projects/specs",
    "sync": true
  }
}
```

---

## Configuration (.oac file)

The `.oac` configuration file controls OAC behavior. It can be placed:

- **Project-level**: `.oac` (in project root) - project-specific settings
- **Global**: `~/.oac` - personal defaults across all projects

**Priority**: Project-level `.oac` overrides global `~/.oac`

### Configuration Schema

```json
{
  "$schema": "https://openagents.dev/schemas/oac-v1.json",
  "version": "1.0.0",
  "project": {
    "name": "my-project",
    "type": "web-app",
    "version": "1.0.0"
  },
  "context": {
    "root": ".opencode/context",
    "auto_download": false,
    "categories": ["core", "openagents-repo"],
    "update_check": true,
    "cache_days": 7,
    "locations": {
      "tasks": "tasks/subtasks",
      "docs": "docs"
    },
    "update": {
      "check_on_start": true,
      "auto_update": false,
      "interval": "1h",
      "strategy": "notify"
    }
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
  },
  "tasks": {
    "source": "local",
    "path": ".tmp/tasks",
    "sync": false
  }
}
```

### Configuration Options

#### Context Settings

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `context.root` | string | `.opencode/context` | Root directory for context files |
| `context.auto_download` | boolean | `false` | Auto-download context on first use |
| `context.categories` | array | `["core", "openagents-repo"]` | Default categories to download |
| `context.update_check` | boolean | `true` | Check for context updates |
| `context.cache_days` | number | `7` | Days to cache external context |

#### Cleanup Settings

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `cleanup.auto_prompt` | boolean | `true` | Prompt for cleanup on session start |
| `cleanup.session_days` | number | `7` | Days before suggesting session cleanup |
| `cleanup.task_days` | number | `30` | Days before suggesting task cleanup |
| `cleanup.external_days` | number | `7` | Days before suggesting external context cleanup |

#### Workflow Settings

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `workflow.auto_approve` | boolean | `false` | Skip approval gates (DANGEROUS) |
| `workflow.verbose` | boolean | `false` | Show detailed workflow steps |

#### External Scout Settings

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `external_scout.enabled` | boolean | `true` | Enable external documentation fetching |
| `external_scout.cache_enabled` | boolean | `true` | Cache fetched documentation |
| `external_scout.sources` | array | `["context7"]` | Documentation sources to use |

#### Task System Settings

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `tasks.source` | string | `"local"` | Task source: `local`, `speckit`, `linear`, `jira`, `custom` |
| `tasks.path` | string | `.tmp/tasks` | Path to task files |
| `tasks.sync` | boolean | `false` | Sync with external system |

---

## Managing Downloaded Context

### Download Context

Use `/oac:setup` to download context files from the OAC repository:

```bash
# Interactive mode - prompts for options
/oac:setup

# Download core context only (~50 files)
/oac:setup --core

# Download all context (~200 files)
/oac:setup --all

# Download specific category
/oac:setup --category=standards
/oac:setup --category=workflows
/oac:setup --category=openagents-repo
```

**What gets downloaded**:
- Context files to `.opencode/context/`
- Manifest file to `plugins/claude-code/.context-manifest.json`
- Validation and verification

---

### Verify Context

Check what context is installed and available:

```bash
# Check OAC installation status
/oac:status

# Verify specific context files exist
ls .opencode/context/core/standards/
ls .opencode/context/core/workflows/
```

**Status output includes**:
- Context files installed
- Configuration loaded
- Task system status
- External scout cache status

---

### Update Context

Re-run setup to update to the latest version:

```bash
# Update core context
/oac:setup --core

# Force re-download (overwrite existing)
/oac:setup --all --force
```

**Note**: Context files are cached locally. Updates only download changed files.

---

### Custom Context

Add your own context files to project or personal directories:

**Project-specific** (overrides defaults):
```bash
mkdir -p .opencode/context/custom/patterns
vim .opencode/context/custom/patterns/my-pattern.md
```

**Personal** (reusable across projects):
```bash
mkdir -p ~/.opencode/context/personal/templates
vim ~/.opencode/context/personal/templates/my-template.md
```

**Context file format**:
```markdown
<!-- Context: category/subcategory | Priority: critical | Version: 1.0 | Updated: 2026-02-16 -->

# Context Title

**Purpose**: Brief description

---

## Content

Your context content here...
```

---

## Personal Projects & Task Systems

### Local Task Management (Default)

**Configuration**:
```json
{
  "tasks": {
    "source": "local",
    "path": ".tmp/tasks",
    "sync": false
  }
}
```

**Usage**:
- Tasks stored in `.tmp/tasks/{feature}/`
- JSON-based task and subtask files
- No external dependencies
- Managed via `/task-breakdown` skill

**Best for**: Solo developers, simple projects, no external tools

---

### SpecKit Integration

**What is SpecKit**: Specification-driven task management system

**Configuration**:
```json
{
  "tasks": {
    "source": "speckit",
    "path": "~/projects/specs",
    "sync": true,
    "config": {
      "api_key": "${SPECKIT_API_KEY}",
      "project_id": "my-project"
    }
  }
}
```

**Setup**:
1. Install SpecKit CLI: `npm install -g speckit`
2. Configure API key: `export SPECKIT_API_KEY=your-key`
3. Update `.oac` with SpecKit settings
4. Run `/oac:status` to verify connection

**Usage**:
- Tasks synced from SpecKit specs
- Bidirectional sync (local ↔ SpecKit)
- Automatic spec updates on task completion

**Best for**: Specification-driven development, documentation-first workflows

---

### Linear Integration

**What is Linear**: Modern issue tracking and project management

**Configuration**:
```json
{
  "tasks": {
    "source": "linear",
    "sync": true,
    "config": {
      "api_key": "${LINEAR_API_KEY}",
      "team_id": "my-team",
      "project_id": "my-project",
      "sync_interval": "5m"
    }
  }
}
```

**Setup**:
1. Get Linear API key from https://linear.app/settings/api
2. Configure API key: `export LINEAR_API_KEY=your-key`
3. Update `.oac` with Linear settings
4. Run `/oac:status` to verify connection

**Usage**:
- Tasks synced from Linear issues
- Status updates pushed to Linear
- Comments and progress tracked
- Automatic issue linking

**Best for**: Team projects, agile workflows, issue tracking

---

### Jira Integration

**What is Jira**: Enterprise project management and issue tracking

**Configuration**:
```json
{
  "tasks": {
    "source": "jira",
    "sync": true,
    "config": {
      "url": "https://your-domain.atlassian.net",
      "email": "your-email@example.com",
      "api_token": "${JIRA_API_TOKEN}",
      "project_key": "PROJ",
      "sync_interval": "10m"
    }
  }
}
```

**Setup**:
1. Generate Jira API token from https://id.atlassian.com/manage-profile/security/api-tokens
2. Configure credentials:
   ```bash
   export JIRA_API_TOKEN=your-token
   ```
3. Update `.oac` with Jira settings
4. Run `/oac:status` to verify connection

**Usage**:
- Tasks synced from Jira issues
- Status updates pushed to Jira
- Work logs and time tracking
- Custom field mapping

**Best for**: Enterprise teams, complex workflows, compliance requirements

---

### Custom Task System

**What is Custom**: Your own task.json format or API

**Configuration**:
```json
{
  "tasks": {
    "source": "custom",
    "path": "/path/to/tasks",
    "sync": true,
    "config": {
      "adapter": "./scripts/task-adapter.js",
      "sync_command": "npm run sync-tasks",
      "format": "json"
    }
  }
}
```

**Setup**:
1. Create task adapter script:
   ```javascript
   // scripts/task-adapter.js
   module.exports = {
     async fetchTasks() {
       // Fetch from your system
     },
     async updateTask(taskId, updates) {
       // Update your system
     }
   };
   ```
2. Update `.oac` with custom settings
3. Test adapter: `node scripts/task-adapter.js`

**Usage**:
- Define your own task format
- Custom sync logic
- Integration with any system
- Full control over behavior

**Best for**: Unique workflows, legacy systems, custom requirements

---

## Integration Examples

### Example 1: Solo Developer Setup

**Scenario**: Individual developer, personal projects, local task management

**Configuration** (`.oac`):
```json
{
  "project": {
    "name": "my-personal-project",
    "type": "web-app"
  },
  "context": {
    "auto_download": true,
    "categories": ["core"]
  },
  "tasks": {
    "source": "local",
    "path": ".tmp/tasks"
  },
  "cleanup": {
    "auto_prompt": true,
    "session_days": 3
  }
}
```

**Setup steps**:
1. Create `.oac` in project root
2. Run `/oac:setup --core`
3. Start coding with `/using-oac`

**Benefits**:
- Minimal setup
- No external dependencies
- Fast and simple
- Full control

---

### Example 2: Team Project Setup

**Scenario**: Team using Linear for issue tracking, shared context

**Configuration** (`.oac`):
```json
{
  "project": {
    "name": "team-project",
    "type": "web-app",
    "version": "1.0.0"
  },
  "context": {
    "auto_download": true,
    "categories": ["core", "openagents-repo"],
    "update_check": true
  },
  "tasks": {
    "source": "linear",
    "sync": true,
    "config": {
      "api_key": "${LINEAR_API_KEY}",
      "team_id": "engineering",
      "project_id": "web-app"
    }
  },
  "workflow": {
    "verbose": true
  }
}
```

**Setup steps**:
1. Team lead creates `.oac` in project root
2. Each developer runs `/oac:setup --all`
3. Configure Linear API key: `export LINEAR_API_KEY=your-key`
4. Verify: `/oac:status`
5. Start workflow: `/using-oac`

**Benefits**:
- Shared context and standards
- Automatic issue sync
- Team visibility
- Consistent workflows

---

### Example 3: Multi-Project Setup

**Scenario**: Developer working on multiple projects with shared personal context

**Global configuration** (`~/.oac`):
```json
{
  "context": {
    "auto_download": true,
    "categories": ["core"],
    "cache_days": 14
  },
  "cleanup": {
    "auto_prompt": true,
    "session_days": 7
  },
  "external_scout": {
    "enabled": true,
    "cache_enabled": true
  }
}
```

**Personal context** (`~/.opencode/context/personal/`):
```
~/.opencode/context/personal/
├── templates/
│   ├── react-component.md
│   ├── api-endpoint.md
│   └── test-suite.md
├── patterns/
│   ├── error-handling.md
│   └── logging.md
└── workflows/
    └── my-workflow.md
```

**Project-specific** (`.oac` in each project):
```json
{
  "project": {
    "name": "project-a",
    "type": "web-app"
  },
  "tasks": {
    "source": "local"
  }
}
```

**Benefits**:
- Reusable personal templates
- Project-specific overrides
- Consistent personal preferences
- Efficient multi-project workflow

---

### Example 4: Custom Task System Integration

**Scenario**: Company with custom task management API

**Configuration** (`.oac`):
```json
{
  "project": {
    "name": "enterprise-app",
    "type": "web-app"
  },
  "context": {
    "categories": ["core", "openagents-repo"]
  },
  "tasks": {
    "source": "custom",
    "sync": true,
    "config": {
      "adapter": "./scripts/company-task-adapter.js",
      "api_url": "https://tasks.company.com/api",
      "api_key": "${COMPANY_TASK_API_KEY}",
      "sync_interval": "5m"
    }
  }
}
```

**Custom adapter** (`scripts/company-task-adapter.js`):
```javascript
const axios = require('axios');

module.exports = {
  async fetchTasks() {
    const response = await axios.get(
      `${process.env.COMPANY_TASK_API_URL}/tasks`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.COMPANY_TASK_API_KEY}`
        }
      }
    );
    
    // Transform to OAC task format
    return response.data.tasks.map(task => ({
      id: task.id,
      title: task.name,
      description: task.description,
      status: task.state,
      assignee: task.assigned_to,
      priority: task.priority_level
    }));
  },
  
  async updateTask(taskId, updates) {
    await axios.patch(
      `${process.env.COMPANY_TASK_API_URL}/tasks/${taskId}`,
      updates,
      {
        headers: {
          'Authorization': `Bearer ${process.env.COMPANY_TASK_API_KEY}`
        }
      }
    );
  }
};
```

**Benefits**:
- Integration with existing systems
- Custom business logic
- Full control over sync
- Company-specific workflows

---

## Troubleshooting

### Context files not found

**Symptom**: `/context-discovery` returns "No context files found"

**Cause**: Context hasn't been downloaded yet

**Solution**:
```bash
# Download core context
/oac:setup --core

# Verify installation
/oac:status

# Check files exist
ls .opencode/context/core/standards/
```

---

### Configuration not loading

**Symptom**: Settings in `.oac` not being applied

**Cause**: Invalid JSON or wrong location

**Solution**:
```bash
# Validate JSON syntax
cat .oac | jq .

# Check file location (should be in project root)
ls -la .oac

# Verify schema
cat .oac | jq '."$schema"'
```

---

### Task system not syncing

**Symptom**: External tasks not appearing or updating

**Cause**: API credentials missing or invalid

**Solution**:
```bash
# Check environment variables
echo $LINEAR_API_KEY
echo $JIRA_API_TOKEN

# Verify configuration
cat .oac | jq '.tasks'

# Test connection
/oac:status

# Check logs
tail -f .tmp/logs/task-sync.log
```

---

### Context priority conflicts

**Symptom**: Wrong context file being loaded

**Cause**: Multiple sources with same file path

**Solution**:
```bash
# Check priority order:
# 1. .opencode/context/ (project-specific)
# 2. ~/.opencode/context/ (personal)
# 3. Downloaded context

# Find which file is being used
find . -name "code-quality.md" -o -path "~/.opencode/context/**/code-quality.md"

# Remove unwanted override
rm .opencode/context/core/standards/code-quality.md
```

---

### Update check failing

**Symptom**: "Failed to check for context updates"

**Cause**: Network issues or GitHub rate limiting

**Solution**:
```bash
# Disable update check temporarily
cat > .oac <<EOF
{
  "context": {
    "update_check": false
  }
}
EOF

# Or update manually
/oac:setup --core --force
```

---

## Best Practices

### ✅ Do

- **Start with core context** - Run `/oac:setup --core` first
- **Use project-specific .oac** - Keep project settings in version control
- **Keep personal context separate** - Use `~/.opencode/context/` for personal templates
- **Version your .oac file** - Commit to git for team consistency
- **Document custom integrations** - Add README for custom task adapters
- **Test configuration changes** - Run `/oac:status` after updates
- **Use environment variables** - Never commit API keys to `.oac`

### ❌ Don't

- **Don't commit API keys** - Use environment variables instead
- **Don't skip context download** - Always run `/oac:setup` first
- **Don't modify downloaded context** - Use project-specific overrides instead
- **Don't enable auto_approve** - It bypasses important safety checks
- **Don't ignore update checks** - Keep context files current
- **Don't mix task systems** - Choose one task source per project

---

## Related Skills

- `/using-oac` - Main OAC workflow (uses context from this skill)
- `/context-discovery` - Find relevant context files
- `/external-scout` - Fetch external library documentation
- `/task-breakdown` - Create task breakdowns (uses task system config)

---

## Related Commands

- `/oac:setup` - Download context files
- `/oac:status` - Check installation status
- `/oac:help` - View available commands
- `/oac:cleanup` - Clean up old files

---

## Success Criteria

✅ Context files downloaded and verified

✅ Configuration file created and valid

✅ Task system integrated (if applicable)

✅ Personal context organized

✅ Project-specific overrides working

✅ Team members can replicate setup

✅ `/oac:status` shows all green
