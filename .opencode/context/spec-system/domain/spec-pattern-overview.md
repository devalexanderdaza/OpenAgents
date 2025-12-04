# SPEC Pattern Overview

## What is the SPEC Pattern?

The SPEC pattern is a comprehensive specification methodology that breaks down software projects into four interconnected document types:

1. **PRD** (Product Requirements Document)
2. **DESIGN** (Design Specification)
3. **ARCHITECTURE** (Architecture Specification)
4. **TASK** (Task Breakdown)

Each document type builds on the previous one, creating a clear dependency chain that ensures all stakeholders—from product managers to developers—have the information they need.

## The SPEC Dependency Chain

```
Business Need → PRD → DESIGN → ARCHITECTURE → TASK → Implementation
```

### Dependency Flow
- **PRD** defines WHAT and WHY (business requirements)
- **DESIGN** defines HOW users will interact (UI/UX)
- **ARCHITECTURE** defines HOW the system will work (technical design)
- **TASK** defines HOW to build it (implementation steps)

## Key Principles

### 1. Single Source of Truth
Each document type has a specific purpose and owns specific information:
- PRD owns business requirements and success criteria
- DESIGN owns UI/UX decisions and user flows
- ARCHITECTURE owns technical decisions and system design
- TASK owns implementation planning and work breakdown

### 2. Progressive Elaboration
Each document adds detail and specificity:
- PRD: High-level requirements
- DESIGN: Detailed UI/UX specifications
- ARCHITECTURE: Technical implementation details
- TASK: Granular work items

### 3. Traceability
Requirements flow through all documents:
- Every DESIGN decision references PRD requirements
- Every ARCHITECTURE component implements DESIGN specifications
- Every TASK implements ARCHITECTURE components
- Full traceability from business need to implementation task

### 4. Consistency
All documents must be consistent:
- Terminology aligned across all specs
- No contradictions between documents
- Cross-references are accurate and complete
- Changes propagate through dependent specs

## When to Use SPEC Pattern

### Ideal For:
- ✅ New features requiring coordination across teams
- ✅ Complex projects with multiple stakeholders
- ✅ Projects requiring clear documentation and traceability
- ✅ Features with significant UI/UX and technical components
- ✅ Distributed teams needing shared understanding
- ✅ Projects requiring formal approval processes

### Not Ideal For:
- ❌ Very small bug fixes or trivial changes
- ❌ Emergency hotfixes requiring immediate action
- ❌ Internal tools with single developer
- ❌ Proof-of-concept or experimental work
- ❌ Well-defined, repetitive tasks

## SPEC Workflow Overview

### 1. PRD Creation
**Who**: Product Manager, Business Analyst
**Input**: Business needs, user feedback, market research
**Output**: Product Requirements Document
**Approval**: Stakeholders, Product Leadership

### 2. DESIGN Creation
**Who**: UX Designer, Product Designer
**Input**: Approved PRD
**Output**: Design Specification
**Approval**: Product Manager, Design Lead

### 3. ARCHITECTURE Creation
**Who**: Software Architect, Tech Lead
**Input**: Approved PRD and DESIGN
**Output**: Architecture Specification
**Approval**: Engineering Lead, Architect

### 4. TASK Creation
**Who**: Tech Lead, Development Team
**Input**: Approved ARCHITECTURE
**Output**: Task Breakdown
**Approval**: Engineering Manager

### 5. Implementation
**Who**: Development Team
**Input**: Approved TASK breakdown
**Output**: Working software
**Validation**: Tests pass, specs met

## Benefits of SPEC Pattern

### For Product Teams
- Clear requirements documentation
- Traceability from user needs to features
- Easy stakeholder communication
- Reduced scope creep
- Better prioritization

### For Design Teams
- Requirements context for design decisions
- Design decision documentation
- Clear handoff to engineering
- Reduced ambiguity

### For Engineering Teams
- Complete technical context
- Clear implementation guidance
- Reduced back-and-forth questions
- Better estimation accuracy
- Easier onboarding

### For Organizations
- Better project predictability
- Improved cross-team coordination
- Knowledge retention
- Easier auditing and compliance
- Reduced rework and miscommunication

## Document Relationships

### PRD ← → DESIGN
- DESIGN references specific PRD requirements (FR-001, US-002, etc.)
- DESIGN decisions address PRD user stories and goals
- Changes to PRD may require DESIGN updates

### DESIGN ← → ARCHITECTURE
- ARCHITECTURE implements DESIGN components and user flows
- ARCHITECTURE defines technical approach to support DESIGN
- Changes to DESIGN may require ARCHITECTURE updates

### ARCHITECTURE ← → TASK
- TASK breaks down ARCHITECTURE components into work items
- Each task implements specific ARCHITECTURE elements
- Changes to ARCHITECTURE may require TASK updates

### Cross-Document Consistency
All documents share:
- Common terminology and definitions
- Consistent feature naming
- Aligned success criteria
- Synchronized versioning

## Version Management

### Version Numbering
- **Major version** (1.0, 2.0): Significant changes requiring re-review
- **Minor version** (1.1, 1.2): Clarifications or small additions
- **Patch version** (1.1.1): Typo fixes or formatting only

### Version Synchronization
When updating one spec:
1. Identify dependent specs
2. Update dependent specs as needed
3. Bump versions appropriately
4. Document changes in version history

## Status Workflow

### Document Status Progression
1. **Draft**: Initial creation, work in progress
2. **In Review**: Submitted for stakeholder review
3. **Approved**: Stakeholders have approved
4. **In Progress**: Implementation started (TASK only)
5. **Complete**: Implementation finished (TASK only)

### Approval Requirements
- **PRD**: Product stakeholders, business owners
- **DESIGN**: Product manager, design lead
- **ARCHITECTURE**: Tech lead, architect
- **TASK**: Engineering manager

## Best Practices

### For All Specs
1. Use clear, unambiguous language
2. Define all technical terms and acronyms
3. Include concrete examples
4. Number items for easy reference
5. Keep documents up-to-date
6. Version all changes
7. Document decisions with rationale

### For PRD
- Focus on WHAT and WHY, not HOW
- Make success criteria measurable
- Include user personas
- Define scope explicitly (in/out)

### For DESIGN
- Show, don't just tell (use diagrams, flows)
- Consider all user states (happy path, errors, edge cases)
- Specify accessibility requirements
- Document design decisions with rationale

### For ARCHITECTURE
- Balance detail with readability
- Document trade-offs and alternatives considered
- Consider non-functional requirements
- Make it buildable by team

### For TASK
- Keep tasks small and estimable
- Include clear acceptance criteria
- Identify dependencies explicitly
- Account for testing and documentation

## Common Pitfalls to Avoid

1. **Skipping Specs**: Jumping to ARCHITECTURE without PRD/DESIGN
2. **Inconsistent Terminology**: Using different terms across specs
3. **Missing Cross-References**: Not linking specs together
4. **Over-Specification**: Too much detail too early
5. **Under-Specification**: Not enough detail to implement
6. **Stale Docs**: Not updating specs when requirements change
7. **No Traceability**: Can't trace requirement to implementation
8. **Missing Rationale**: Not explaining why decisions were made

## Quick Reference

### File Structure
```
specs/
├── prd/
│   └── {feature-name}.prd.md
├── design/
│   └── {feature-name}.design.md
├── architecture/
│   └── {feature-name}.architecture.md
└── tasks/
    └── {feature-name}.tasks.md
```

### Cross-Reference Format
- PRD Requirements: `FR-001`, `NFR-002`, `US-003`
- DESIGN Components: `DESIGN/Component Name`
- ARCHITECTURE Components: `ARCHITECTURE/Component Name`
- Tasks: `TASK-001`, `TASK-002`

### Document Metadata
```yaml
---
type: PRD | DESIGN | ARCHITECTURE | TASK
feature: feature-name-slug
version: 1.0
date: YYYY-MM-DD
status: Draft | In Review | Approved | In Progress | Complete
author: Name or Team
related_docs:
  prd: path/to/prd.md
  design: path/to/design.md
  architecture: path/to/architecture.md
---
```

## Resources

- PRD Structure: See `context/spec-system/domain/prd-structure.md`
- DESIGN Structure: See `context/spec-system/domain/design-structure.md`
- ARCHITECTURE Structure: See `context/spec-system/domain/architecture-structure.md`
- TASK Structure: See `context/spec-system/domain/task-structure.md`
- Templates: See `context/spec-system/templates/`
