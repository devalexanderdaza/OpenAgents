# Concept: Compatibility Layer Architecture

**Purpose**: Enable bidirectional translation between OpenAgents Control and other AI coding tools

**Last Updated**: 2026-02-04

---

## Core Idea

Adapter pattern that translates agent configurations between OAC format and tool-specific formats (Cursor IDE, Claude Code, Windsurf). Enables seamless migration and multi-tool workflows through bidirectional mapping with graceful degradation.

---

## Key Components

**Adapters**: Tool-specific translation classes inheriting from BaseAdapter
- ClaudeAdapter - Claude Code format (.claude/config.json + skills)
- CursorAdapter - Cursor IDE format (.cursorrules single file)
- WindsurfAdapter - Windsurf format (.windsurf/agents/)

**Mappers**: Pure functions for feature translation
- ToolMapper - Tool name mapping (bash → terminal, task → delegate)
- PermissionMapper - Permission translation with degradation
- ModelMapper - Model ID mapping with fallbacks
- ContextMapper - Context file path translation

**Core Services**:
- AgentLoader - Parse OAC markdown files with YAML frontmatter
- AdapterRegistry - Register and retrieve adapters
- TranslationEngine - Orchestrate bidirectional conversion
- CapabilityMatrix - Track feature parity across tools

---

## Architecture Pattern

```
OAC Agent File (.md)
  ↓ (parse)
AgentLoader → OpenAgent object (validated with Zod)
  ↓ (convert)
BaseAdapter.fromOAC()
  ↓ (map features)
Mappers (tools, permissions, models, contexts)
  ↓ (output)
Tool-specific config files
```

**Reverse direction**: Tool config → toOAC() → OpenAgent → OAC .md file

---

## Design Principles

- **Bidirectional**: Convert OAC → Tool AND Tool → OAC where possible
- **Graceful Degradation**: Map unsupported features to closest equivalent with warnings
- **Pure Mappers**: All mapping functions are pure (no side effects)
- **Template Method**: BaseAdapter defines algorithm, subclasses fill details
- **Validation First**: Zod schemas validate before/after conversion

---

## Feature Parity

| Feature | OAC | Claude | Cursor | Windsurf |
|---------|-----|--------|--------|----------|
| Multiple agents | ✅ | ✅ | ❌ Single | ✅ |
| Granular permissions | ✅ | ⚠️ Simplified | ❌ | ⚠️ Partial |
| Temperature | ✅ | ❌ | ⚠️ Partial | ⚠️ Partial |
| Skills | ✅ | ✅ | ❌ | ⚠️ Partial |
| Hooks | ✅ | ✅ | ❌ | ❌ |
| Context files | ✅ | ✅ Skills | ✅ .cursorrules | ✅ |

---

## Quick Example

```typescript
// Load OAC agent
const agent = await AgentLoader.loadAgent('.opencode/agent/openagent.md')

// Get Claude adapter
const adapter = AdapterRegistry.get('claude')

// Convert to Claude format
const result = await adapter.fromOAC(agent)

// Outputs: .claude/config.json, .claude/skills/[...]
console.log(result.configs) // Array of files to write
console.log(result.warnings) // Feature degradation warnings
```

---

## Common Challenges

**Single-File Tools** (Cursor): Merge multiple OAC agents into one .cursorrules file
**Permission Mapping**: OAC granular permissions → simplified tool permissions
**Model IDs**: Different tools use different model identifiers (requires mapping table)
**Context Paths**: OAC uses .opencode/context/, tools use various paths

---

## Reference

- **Implementation**: `packages/compatibility-layer/src/`
- **Issue**: https://github.com/darrenhinde/OpenAgentsControl/issues/141
- **Related**: 
  - examples/baseadapter-pattern.md
  - examples/zod-schema-migration.md
  - lookup/tool-feature-parity.md
  - guides/compatibility-layer-workflow.md
