# Lookup: Compatibility Layer Adapters

**Purpose**: Quick reference for implemented adapter details

**Last Updated**: 2026-02-04

---

## Adapter Summary

| Adapter | Lines | Status | Key Features |
|---------|-------|--------|--------------|
| **ClaudeAdapter** | 600 | ✅ Complete | Skills, Hooks, Multi-agent, Binary permissions |
| **CursorAdapter** | 554 | ✅ Complete | Single-file, Agent merging, Limited features |
| **WindsurfAdapter** | 514 | ✅ Complete | Creativity mapping, Multi-agent, JSON config |

**Total**: 1,858 lines of TypeScript

---

## ClaudeAdapter

**Format**: `.claude/config.json` (primary), `.claude/agents/*.md` (subagents)

**Capabilities**:
- ✅ Multiple agents
- ✅ Skills system
- ✅ Hooks (5 types: PreToolUse, PostToolUse, PermissionRequest, AgentStart, AgentEnd)
- ⚠️ Binary permissions (granular → degraded)
- ❌ Temperature not supported

**Key Mappings**:
- Model: `claude-sonnet-4` ↔ `claude-sonnet-4-20250514`
- Permissions: Granular OAC → `permissionMode` (default/acceptEdits/dontAsk/bypassPermissions)
- Contexts → Skills system

---

## CursorAdapter

**Format**: `.cursorrules` (single file in project root)

**Capabilities**:
- ❌ Single agent only (multi-agent → merged)
- ❌ No Skills system (contexts → inlined)
- ❌ No Hooks
- ⚠️ Binary permissions only
- ✅ Temperature support (limited)

**Key Features**:
- `mergeAgents()` method for multi-agent → single-file conversion
- Optional YAML frontmatter
- Context inlining with references

**Key Mappings**:
- Model: `claude-sonnet-4` → `claude-3-sonnet` (fallback to v3)
- Multiple agents → Merged with section headers

---

## WindsurfAdapter

**Format**: `.windsurf/config.json`, `.windsurf/agents/*.json`

**Capabilities**:
- ✅ Multiple agents (`.windsurf/agents/`)
- ⚠️ Partial Skills (→ context references)
- ❌ No Hooks
- ⚠️ Binary permissions only
- ✅ Temperature via creativity setting

**Key Mappings**:
- Model: `claude-sonnet-4` ↔ `claude-4-sonnet`
- Temperature ↔ Creativity: `≤0.4 → low`, `≤0.8 → medium`, `>0.8 → high`
- Priority: `critical/high → high`, `medium/low → low`
- Skills → Context file references in `.windsurf/context/`

---

## Common Patterns

### Bidirectional Conversion
All 3 adapters support:
- `toOAC()`: Tool format → OpenAgent
- `fromOAC()`: OpenAgent → Tool format

### Graceful Degradation
All adapters warn when features are lost:
- Granular permissions → Binary on/off
- Unsupported features → Warning messages
- Feature loss → Clear user notifications

### Type Safety
- All extend `BaseAdapter`
- Full TypeScript strict mode
- Zod schema validation
- 0 compilation errors

---

## Reference

**Implementation**: `packages/compatibility-layer/src/adapters/`
**Issue**: https://github.com/darrenhinde/OpenAgentsControl/issues/141

**Related**:
- concepts/compatibility-layer.md
- examples/baseadapter-implementation.md
- guides/compatibility-layer-development.md
