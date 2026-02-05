# @openagents-control/compatibility-layer

> Compatibility layer for converting OpenAgents Control agents to/from other AI coding tools

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue)](https://www.typescriptlang.org/)
[![Node](https://img.shields.io/badge/Node-%3E%3D18-green)](https://nodejs.org/)

## Overview

This package provides bidirectional conversion between OpenAgents Control (OAC) agent format and various AI coding tools:

- **Cursor IDE** - VSCode-based AI editor
- **Claude Code** - Anthropic's official CLI
- **Windsurf** - AI-powered development environment
- **GitHub Copilot** _(coming soon)_
- **Codeium** _(coming soon)_

## Features

- ✅ **Bidirectional conversion** - Convert OAC ↔ Tool formats
- ✅ **Feature parity tracking** - Know what's supported in each tool
- ✅ **Graceful degradation** - Handle unsupported features intelligently
- ✅ **CLI tool** - Easy conversion from command line
- ✅ **Type-safe** - Full TypeScript with Zod validation
- ✅ **Extensible** - Plugin architecture for new tools

## Installation

```bash
npm install @openagents-control/compatibility-layer
```

Or use directly:

```bash
npx @openagents-control/compatibility-layer convert --from oac --to claude ./agent.md
```

## Quick Start

### CLI Usage

```bash
# Convert OAC agent to Claude format
oac-compat convert --from oac --to claude ./opencoder.md

# Validate compatibility before conversion
oac-compat validate --target cursor ./agent.md

# Migrate entire project
oac-compat migrate --to claude --out ./output/

# Show tool capabilities
oac-compat info --tool cursor
```

### Programmatic Usage

```typescript
import { loadAgent, ClaudeAdapter, registry } from '@openagents-control/compatibility-layer';

// Load an OAC agent
const agent = await loadAgent('./opencoder.md');

// Get adapter
const adapter = registry.getAdapter('claude');

// Convert to Claude format
const result = await adapter.convertAgent(agent);

if (result.success) {
  console.log('Converted files:', result.configs);
  console.log('Warnings:', result.warnings);
}
```

## Supported Tools

| Tool | Read | Write | Features |
|------|------|-------|----------|
| **Cursor** | ✅ | ✅ | Single agent, basic tools |
| **Claude Code** | ✅ | ✅ | Multi-agent, skills, hooks |
| **Windsurf** | ✅ | ✅ | Multi-agent, partial features |
| **Copilot** | 🚧 | 🚧 | Coming soon |
| **Codeium** | 🚧 | 🚧 | Coming soon |

## Feature Parity Matrix

See [docs/feature-matrices/capabilities-overview.md](docs/feature-matrices/capabilities-overview.md) for detailed comparison.

## Migration Guides

- [Cursor → OAC](docs/migration-guides/cursor-to-oac.md)
- [Claude → OAC](docs/migration-guides/claude-to-oac.md)
- [OAC → Cursor](docs/migration-guides/oac-to-cursor.md)
- [OAC → Claude](docs/migration-guides/oac-to-claude.md)
- [OAC → Windsurf](docs/migration-guides/oac-to-windsurf.md)

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Test
npm test

# Test with coverage
npm run test:coverage

# Watch mode
npm run build:watch
```

## Architecture

```
src/
├── core/           # Core conversion logic
├── adapters/       # Tool-specific adapters
├── mappers/        # Feature mapping utilities
└── cli/            # Command-line interface
```

## Contributing

See [CONTRIBUTING.md](../../CONTRIBUTING.md) for guidelines.

## License

MIT © OpenAgents Control Contributors
