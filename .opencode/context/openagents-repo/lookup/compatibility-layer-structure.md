# Lookup: Compatibility Layer File Structure

**Purpose**: Quick reference for where files go in the compatibility-layer package

**Last Updated**: 2026-02-04

---

## Package Location

```
packages/compatibility-layer/
```

---

## Directory Structure

```
compatibility-layer/
├── package.json              # Dependencies, scripts, bin config
├── tsconfig.json             # TypeScript config (strict, ES2022)
├── vitest.config.ts          # Test config (80% coverage threshold)
├── .eslintrc.json           # Linting rules
├── .gitignore               # Git ignores
├── README.md                # Package documentation
│
├── src/                     # Source code (TypeScript)
│   ├── types.ts             # Zod schemas + type exports
│   ├── index.ts             # Public API exports
│   │
│   ├── adapters/            # Tool adapters
│   │   ├── BaseAdapter.ts   # Abstract base class
│   │   ├── ClaudeAdapter.ts # Claude Code adapter
│   │   ├── CursorAdapter.ts # Cursor IDE adapter
│   │   └── WindsurfAdapter.ts # Windsurf adapter
│   │
│   ├── core/                # Core services
│   │   ├── AgentLoader.ts   # Load/parse OAC agents
│   │   ├── AdapterRegistry.ts # Adapter management
│   │   ├── TranslationEngine.ts # Orchestrate conversion
│   │   └── CapabilityMatrix.ts # Feature parity tracking
│   │
│   ├── mappers/             # Feature mappers (pure functions)
│   │   ├── ToolMapper.ts    # Tool name mapping
│   │   ├── PermissionMapper.ts # Permission translation
│   │   ├── ModelMapper.ts   # Model ID mapping
│   │   └── ContextMapper.ts # Context path mapping
│   │
│   └── cli/                 # Command-line interface
│       ├── index.ts         # CLI entry point
│       └── commands/
│           ├── convert.ts   # Convert command
│           ├── validate.ts  # Validate command
│           ├── migrate.ts   # Migrate command
│           └── info.ts      # Info command
│
├── tests/                   # Test files
│   ├── unit/
│   │   ├── core/            # AgentLoader, Registry tests
│   │   ├── adapters/        # Adapter tests
│   │   └── mappers/         # Mapper tests
│   ├── integration/         # End-to-end tests
│   └── fixtures/            # Test data
│       ├── agents/          # Sample agent files
│       └── expected/        # Expected outputs
│
├── docs/                    # Documentation
│   ├── migration-guides/    # Migration instructions
│   ├── feature-matrices/    # Feature comparison tables
│   └── api/                 # API documentation
│
└── dist/                    # Compiled output (auto-generated)
```

---

## Key Files

### Configuration Files

| File | Purpose | Lines |
|------|---------|-------|
| package.json | Dependencies, scripts, bin: oac-compat | ~80 |
| tsconfig.json | TypeScript strict mode, ES2022 | ~30 |
| vitest.config.ts | Coverage: 80% lines, 80% functions | ~20 |
| .eslintrc.json | TypeScript + recommended rules | ~15 |

### Source Files (src/)

| File | Purpose | Lines | Status |
|------|---------|-------|--------|
| types.ts | 20+ Zod schemas, type exports | 315 | ✅ Done |
| index.ts | Public API exports | ~50 | 📝 TODO |
| adapters/BaseAdapter.ts | Abstract adapter class | 190 | ✅ Done |
| adapters/ClaudeAdapter.ts | Claude Code support | ~300 | 📝 TODO |
| adapters/CursorAdapter.ts | Cursor IDE support | ~250 | 📝 TODO |
| adapters/WindsurfAdapter.ts | Windsurf support | ~200 | 📝 TODO |
| core/AgentLoader.ts | Load agents from .md files | ~150 | 🔥 Next |
| core/AdapterRegistry.ts | Registry pattern | ~80 | 📝 TODO |
| core/TranslationEngine.ts | Conversion orchestration | ~200 | 📝 TODO |
| core/CapabilityMatrix.ts | Feature comparison | ~120 | 📝 TODO |
| mappers/ToolMapper.ts | Tool name mapping | ~100 | 📝 TODO |
| mappers/PermissionMapper.ts | Permission translation | ~150 | 📝 TODO |
| mappers/ModelMapper.ts | Model ID mapping | ~80 | 📝 TODO |
| mappers/ContextMapper.ts | Context path mapping | ~80 | 📝 TODO |

### CLI Files (src/cli/)

| File | Purpose | Lines | Status |
|------|---------|-------|--------|
| cli/index.ts | Commander.js setup | ~100 | 📝 TODO |
| cli/commands/convert.ts | Convert between formats | ~200 | 📝 TODO |
| cli/commands/validate.ts | Pre-conversion checks | ~150 | 📝 TODO |
| cli/commands/migrate.ts | Batch migration | ~250 | 📝 TODO |
| cli/commands/info.ts | Show capabilities | ~100 | 📝 TODO |

---

## Dependencies

### Production

| Package | Purpose | Version |
|---------|---------|---------|
| zod | Schema validation | ^3.22.0 |
| js-yaml | YAML parsing | ^4.1.0 |
| gray-matter | Frontmatter extraction | ^4.0.3 |
| commander | CLI framework | ^11.1.0 |
| chalk | Terminal colors | ^5.3.0 |
| ora | Loading spinners | ^7.0.1 |

### Development

| Package | Purpose | Version |
|---------|---------|---------|
| typescript | TypeScript compiler | ^5.4.0 |
| vitest | Test framework | ^1.3.0 |
| @vitest/coverage-v8 | Coverage reporting | ^1.3.0 |
| eslint | Linting | ^8.57.0 |
| @typescript-eslint/* | TypeScript linting | ^7.0.0 |

---

## Scripts

```json
{
  "build": "tsc",
  "test": "vitest",
  "test:coverage": "vitest --coverage",
  "lint": "eslint src/**/*.ts",
  "clean": "rm -rf dist"
}
```

---

## Binary

CLI installed as global command:

```bash
npm install -g @openagents/compatibility-layer

# Provides:
oac-compat convert --from oac --to claude agent.md
oac-compat validate agent.md --target cursor
oac-compat migrate . --to claude
oac-compat info --adapter claude
```

---

## Related Packages

- `@openagents/core` - Core OAC functionality
- `@openagents/cli` - Main CLI tool
- `@openagents/plugin-*` - Plugin system

---

## Reference

- **Session Context**: `.tmp/sessions/2026-02-04-compatibility-layer-141/`
- **Task Breakdown**: `.tmp/tasks/compatibility-layer-141/`
- **Related**:
  - concepts/compatibility-layer.md
  - guides/compatibility-layer-workflow.md
  - examples/baseadapter-pattern.md
