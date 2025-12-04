---
description: "Create TASK breakdown from ARCHITECTURE specification"
agent: spec-orchestrator
---

# Create TASKS

<command_purpose>
Generate granular implementation task breakdown from ARCHITECTURE specification with acceptance criteria, dependencies, and effort estimates.
</command_purpose>

<usage>
```bash
# Create task breakdown
/create-tasks specs/architecture/user-authentication.architecture.md

# With granularity preference
/create-tasks specs/architecture/shopping-cart.architecture.md --granularity="fine"

# With estimates
/create-tasks specs/architecture/search.architecture.md --estimate=true
```
</usage>

<parameters>
  <granularity>
    - fine: Tasks < 4 hours
    - medium: Tasks 4-8 hours (default)
    - coarse: Tasks 1-2 days
  </granularity>
  <estimate>
    - true: Include effort estimates (default)
    - false: Skip estimates
  </estimate>
</parameters>

<routing>
  Route to: @spec-orchestrator → @task-writer
</routing>

<output>
  TASK specification containing:
  - Task summary by phase
  - Foundation tasks (setup, config)
  - Data layer tasks (schemas, models)
  - API layer tasks (endpoints, validation)
  - Component tasks (UI implementation)
  - Integration tasks (connecting components)
  - Infrastructure tasks (CI/CD, deployment)
  - Testing tasks (unit, integration)
  - Documentation tasks
  - Task dependencies graph
  - Implementation sequence
</output>

<related_commands>
  - `/create-architecture` - Create ARCHITECTURE first
  - `/validate-spec` - Validate TASK quality
  - `/review-spec` - Review task breakdown
</related_commands>
