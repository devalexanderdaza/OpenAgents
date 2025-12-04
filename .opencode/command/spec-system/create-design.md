---
description: "Create DESIGN specification from an approved PRD"
agent: spec-orchestrator
---

# Create DESIGN

<command_purpose>
Generate a comprehensive DESIGN specification that defines UI/UX, user flows, components, and interaction patterns based on an approved PRD.
</command_purpose>

<usage>
```bash
# Create DESIGN from PRD
/create-design specs/prd/user-authentication.prd.md

# With design preferences
/create-design specs/prd/shopping-cart.prd.md --ui="Material Design, responsive, mobile-first"
```
</usage>

<routing>
  Route to: @spec-orchestrator → @design-writer
</routing>

<workflow>
  1. Load and parse PRD
  2. Extract user stories and requirements
  3. Generate user flows for each story
  4. Define UI components and states
  5. Specify interaction patterns
  6. Document accessibility requirements
  7. Validate DESIGN quality (8+/10)
  8. Write to specs/design/{feature}.design.md
</workflow>

<output>
  DESIGN specification containing:
  - Design principles and approach
  - User flows for all PRD user stories
  - UI component specifications
  - Layout and screen definitions
  - Interaction patterns
  - Visual design guidelines
  - Accessibility requirements (WCAG AA)
  - Responsive design specifications
  - Design decisions with rationale
</output>

<related_commands>
  - `/create-prd` - Create PRD first
  - `/create-architecture` - Create ARCHITECTURE from PRD + DESIGN
  - `/validate-spec` - Validate DESIGN quality
</related_commands>
