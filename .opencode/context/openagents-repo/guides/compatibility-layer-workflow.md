# Guide: Compatibility Layer Development Workflow

**Purpose**: Step-by-step process for extending the compatibility layer to support new AI coding tools

**Last Updated**: 2026-02-04

---

## When to Use This Guide

- Adding support for a new AI coding tool (e.g., Codeium, GitHub Copilot)
- Extending existing adapter capabilities
- Understanding the development phases for compatibility work

---

## Development Phases

### Phase 1: Foundation (8h)

**Objective**: Set up project infrastructure and core types

1. **Project Setup** (1.5h)
   - Create `packages/compatibility-layer/package.json`
   - Configure TypeScript with strict mode
   - Set up Vitest with 80%+ coverage thresholds
   - Install dependencies: zod, gray-matter, commander, chalk

2. **Type System** (1.5h)
   - Create `src/types.ts` with Zod schemas
   - Define `OpenAgentSchema`, `AgentFrontmatterSchema`
   - Define `ToolCapabilities`, `ConversionResult`
   - Export TypeScript types with `z.infer<>`

3. **Base Adapter** (1.5h)
   - Create `src/adapters/BaseAdapter.ts` abstract class
   - Define abstract methods: `toOAC()`, `fromOAC()`, `getCapabilities()`
   - Implement shared utilities: `warn()`, `error()`, `safeParseJSON()`

4. **Agent Loader** (1.5h)
   - Create `src/core/AgentLoader.ts`
   - Implement `loadAgent()`, `loadAgents()`, `parseAgentFile()`
   - Use gray-matter for YAML frontmatter parsing

5. **Adapter Registry** (1h)
   - Create `src/core/AdapterRegistry.ts`
   - Implement registry pattern with `Map<string, BaseAdapter>`
   - Methods: `register()`, `get()`, `list()`, `has()`

6. **Public API** (1h)
   - Create `src/index.ts`
   - Export all public APIs
   - Re-export types, adapters, core modules

**Validation**: `npm run build` compiles without errors

---

### Phase 2: Adapter Migration (12h)

**Objective**: Migrate existing adapters to TypeScript

7. **Claude Adapter** (3h)
   - Migrate `ClaudeAdapter.js` → `ClaudeAdapter.ts`
   - Implement `toOAC()` - Parse .claude/config.json → OpenAgent
   - Implement `fromOAC()` - Convert OpenAgent → Claude format
   - Define capabilities (multi-agent, hooks, skills)

8. **Cursor Adapter** (3h)
   - Migrate `CursorAdapter.js` → `CursorAdapter.ts`
   - Implement single-file .cursorrules parsing
   - Handle multi-agent merge for OAC → Cursor
   - Define limited capabilities

9. **Windsurf Adapter** (3h)
   - Migrate `WindsurfAdapter.js` → `WindsurfAdapter.ts`
   - Implement Windsurf format parsing/generation
   - Handle partial feature support

10-12. **Adapter Unit Tests** (3h total)
   - Test each adapter's `toOAC()` and `fromOAC()`
   - Test roundtrip conversion where possible
   - Test graceful degradation and warnings
   - Target: 80%+ coverage per adapter

---

### Phase 3: Mappers & Translation (10h)

**Objective**: Implement feature mapping logic

13. **Tool Mapper** (1.5h)
   - Create `src/mappers/ToolMapper.ts`
   - Map tool names: bash → terminal, task → delegate
   - Pure functions with fallback logic

14. **Permission Mapper** (2h)
   - Create `src/mappers/PermissionMapper.ts`
   - Map granular OAC permissions → simplified tool permissions
   - Generate warnings for degradation

15. **Model Mapper** (1.5h)
   - Create `src/mappers/ModelMapper.ts`
   - Map model IDs across tools
   - Provide fallbacks for unsupported models

16. **Context Mapper** (1.5h)
   - Create `src/mappers/ContextMapper.ts`
   - Map context file paths (.opencode → .claude → .cursorrules)

17. **Translation Engine** (2h)
   - Create `src/core/TranslationEngine.ts`
   - Orchestrate mapper calls
   - Collect warnings from all mappers

18. **Capability Matrix** (1.5h)
   - Create `src/core/CapabilityMatrix.ts`
   - Generate feature comparison reports
   - Identify incompatibilities before conversion

19. **Mapper Tests** (2h)
   - Test each mapper with edge cases
   - Test degradation warnings
   - Test bidirectional mapping

---

### Phase 4: CLI Tool (8h)

**Objective**: Build command-line interface

20. **CLI Scaffolding** (1.5h)
   - Create `src/cli/index.ts` with Commander.js
   - Define commands: convert, validate, migrate, info
   - Set up chalk for colored output, ora for spinners

21. **Convert Command** (2h)
   - Implement `commands/convert.ts`
   - Usage: `oac-compat convert --from oac --to claude agent.md`
   - Support batch conversion

22. **Validate Command** (1.5h)
   - Implement `commands/validate.ts`
   - Check compatibility before conversion
   - Report warnings and incompatibilities

23. **Migrate Command** (2h)
   - Implement `commands/migrate.ts`
   - Migrate entire projects (all agents + context)
   - Generate migration report

24. **Info Command** (1h)
   - Implement `commands/info.ts`
   - Show tool capabilities and feature matrices
   - Display adapter list

25. **CLI Integration Tests** (2h)
   - Test each command end-to-end
   - Test error handling
   - Test output formatting

---

### Phase 5: Documentation (6h)

**Objective**: Create migration guides and API docs

26-30. **Migration Guides** (4h total)
   - `docs/migration-guides/cursor-to-oac.md`
   - `docs/migration-guides/claude-to-oac.md`
   - `docs/migration-guides/oac-to-cursor.md`
   - `docs/migration-guides/oac-to-claude.md`
   - `docs/migration-guides/oac-to-windsurf.md`

31. **Feature Matrices** (1h)
   - Generate comparison tables
   - Document degradation patterns
   - Update lookup/tool-feature-parity.md

32. **API Documentation** (1h)
   - Document programmatic API usage
   - Add examples for each adapter
   - Update main README.md

---

## Adding a New Tool Adapter

### Step-by-Step

1. **Research Tool Format**
   - Study tool's configuration file structure
   - Identify supported features
   - Note limitations vs OAC

2. **Create Adapter Class**
   ```typescript
   export class NewToolAdapter extends BaseAdapter {
     name = 'newtool'
     displayName = 'New Tool'
     
     async toOAC(source: string): Promise<OpenAgent> { /* ... */ }
     async fromOAC(agent: OpenAgent): Promise<ConversionResult> { /* ... */ }
     getConfigPath(): string { /* ... */ }
     getCapabilities(): ToolCapabilities { /* ... */ }
     validateConversion(agent: OpenAgent): string[] { /* ... */ }
   }
   ```

3. **Implement toOAC()**
   - Parse tool's config format
   - Map to OpenAgent schema
   - Use mappers for feature translation

4. **Implement fromOAC()**
   - Convert OpenAgent to tool format
   - Apply degradation rules
   - Generate warnings for unsupported features

5. **Register Adapter**
   ```typescript
   AdapterRegistry.register(new NewToolAdapter())
   ```

6. **Write Tests**
   - Test parsing (toOAC)
   - Test generation (fromOAC)
   - Test roundtrip where possible

7. **Document**
   - Add to feature parity matrix
   - Create migration guide
   - Update README

---

## Success Criteria

After each phase:

**Phase 1**:
- [ ] All files compile without errors
- [ ] Zod schemas validate correctly
- [ ] BaseAdapter provides shared utilities

**Phase 2**:
- [ ] All 3 adapters migrate to TypeScript
- [ ] Unit tests pass with 80%+ coverage
- [ ] Adapters inherit from BaseAdapter

**Phase 3**:
- [ ] All mappers are pure functions
- [ ] Graceful degradation works
- [ ] Warnings generated for feature loss

**Phase 4**:
- [ ] CLI commands work end-to-end
- [ ] Error handling is comprehensive
- [ ] Output is user-friendly

**Phase 5**:
- [ ] Migration guides cover all tools
- [ ] API docs are complete
- [ ] Examples demonstrate usage

---

## Reference

- **Session Context**: `.tmp/sessions/2026-02-04-compatibility-layer-141/context.md`
- **Task Breakdown**: `.tmp/tasks/compatibility-layer-141/task.json`
- **Related**:
  - concepts/compatibility-layer.md
  - examples/baseadapter-pattern.md
  - lookup/tool-feature-parity.md
