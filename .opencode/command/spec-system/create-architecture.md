---
description: "Create ARCHITECTURE specification from PRD and DESIGN"
agent: spec-orchestrator
---

# Create ARCHITECTURE

<command_purpose>
Generate a comprehensive ARCHITECTURE specification defining system design, components, data models, APIs, and infrastructure.
</command_purpose>

<usage>
```bash
# Create from PRD and DESIGN
/create-architecture specs/prd/user-auth.prd.md specs/design/user-auth.design.md

# With technical constraints
/create-architecture specs/prd/cart.prd.md specs/design/cart.design.md --stack="Node.js, PostgreSQL, Redis"
```
</usage>

<routing>
  Route to: @spec-orchestrator → @architecture-writer
</routing>

<output>
  ARCHITECTURE specification containing:
  - System architecture and component design
  - Data models and schemas
  - API design and endpoints
  - Infrastructure and deployment
  - Security architecture
  - Performance considerations
  - Technical decisions with rationale
</output>

<related_commands>
  - `/create-design` - Create DESIGN first
  - `/create-tasks` - Create TASKS from ARCHITECTURE
  - `/validate-spec` - Validate ARCHITECTURE quality
</related_commands>
