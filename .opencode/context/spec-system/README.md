# SPEC System Context Files

This directory contains organized context files that provide domain knowledge, processes, standards, and templates for the SPEC Pattern System.

## Directory Structure

```
context/spec-system/
├── domain/          # Core concepts and knowledge
├── processes/       # Workflows and procedures
├── standards/       # Quality criteria and rules
└── templates/       # Document templates
```

## Domain Knowledge (`domain/`)

Core concepts and structural knowledge about the SPEC pattern methodology.

### Available Files

- **`spec-pattern-overview.md`** - Complete SPEC methodology overview
  - What is SPEC pattern
  - Dependency chain (PRD → DESIGN → ARCHITECTURE → TASK)
  - Key principles (single source of truth, traceability, consistency)
  - When to use SPEC pattern
  - Benefits for teams
  - Document relationships
  - Version management
  - Status workflow
  - Best practices and common pitfalls

- **`prd-structure.md`** - PRD (Product Requirements Document) structure guide
  - All 15 required sections detailed with examples
  - Frontmatter metadata specifications
  - User story format and acceptance criteria
  - Functional and non-functional requirements
  - Success criteria definition
  - Quality checklist
  - Common mistakes to avoid
  - PRD length guidelines

### To Be Added (Optional Expansions)

- `design-structure.md` - DESIGN specification structure guide
- `architecture-structure.md` - ARCHITECTURE specification structure guide
- `task-structure.md` - TASK breakdown structure guide
- `spec-relationships.md` - Detailed dependency and relationship rules

## Process Knowledge (`processes/`)

Workflows and procedures for creating and managing specifications.

### Files to Add (As Needed)

- `spec-creation-workflow.md` - End-to-end spec creation process
- `prd-to-design-flow.md` - How to derive DESIGN from PRD
- `design-to-architecture-flow.md` - How to create ARCHITECTURE from DESIGN
- `architecture-to-tasks-flow.md` - How to break down ARCHITECTURE into TASKS
- `spec-review-process.md` - Review and validation workflow
- `spec-update-process.md` - How to update existing specs and propagate changes

## Standards (`standards/`)

Quality criteria, validation rules, and consistency requirements.

### Files to Add (As Needed)

- `prd-quality-criteria.md` - Quality standards specific to PRD documents
- `design-quality-criteria.md` - Quality standards for DESIGN specifications
- `architecture-quality-criteria.md` - Quality standards for ARCHITECTURE specs
- `task-quality-criteria.md` - Quality standards for TASK breakdowns
- `validation-rules.md` - Comprehensive validation rules across all spec types
- `consistency-checks.md` - Cross-spec consistency requirements
- `quality-best-practices.md` - General quality guidelines

## Templates (`templates/`)

Document templates for each specification type with examples.

### Files to Add (As Needed)

- `prd-template.md` - Complete PRD template with all sections
- `design-template.md` - Complete DESIGN template with all sections
- `architecture-template.md` - Complete ARCHITECTURE template with all sections
- `task-template.md` - Complete TASK template with all sections
- `spec-checklist.md` - Completion checklist for each spec type

## How Agents Use Context Files

### PRD Writer
Loads:
- `domain/spec-pattern-overview.md` - Understanding of SPEC methodology
- `domain/prd-structure.md` - PRD structure and requirements
- `templates/prd-template.md` (when added) - Template to follow
- `standards/prd-quality-criteria.md` (when added) - Quality standards

### Design Writer
Loads:
- `domain/spec-pattern-overview.md` - SPEC methodology understanding
- `domain/design-structure.md` (when added) - DESIGN structure
- `processes/prd-to-design-flow.md` (when added) - How to derive from PRD
- `templates/design-template.md` (when added) - Template to follow

### Architecture Writer
Loads:
- `domain/spec-pattern-overview.md` - SPEC methodology
- `domain/architecture-structure.md` (when added) - ARCHITECTURE structure
- `processes/design-to-architecture-flow.md` (when added) - Derivation process
- `templates/architecture-template.md` (when added) - Template

### Task Writer
Loads:
- `domain/spec-pattern-overview.md` - SPEC methodology
- `domain/task-structure.md` (when added) - TASK structure
- `processes/architecture-to-tasks-flow.md` (when added) - Breakdown process
- `templates/task-template.md` (when added) - Template

### Spec Validator
Loads:
- `domain/spec-pattern-overview.md` - Understanding of all spec types
- `standards/validation-rules.md` (when added) - Validation criteria
- `standards/*-quality-criteria.md` (when added) - Type-specific standards
- `standards/consistency-checks.md` (when added) - Cross-spec rules

### Spec Reviewer
Loads:
- `domain/spec-pattern-overview.md` - Complete SPEC understanding
- `standards/quality-best-practices.md` (when added) - Best practices
- `standards/consistency-checks.md` (when added) - Consistency rules
- All structure guides for holistic review

## Context File Best Practices

### Writing Context Files

1. **Keep files focused** (50-200 lines ideal)
2. **Use clear headings** for easy navigation
3. **Include examples** where applicable
4. **Be specific** and actionable
5. **Avoid duplication** across files
6. **Document dependencies** between files

### File Size Guidelines

- **Overview files**: 150-300 lines (comprehensive but not overwhelming)
- **Structure guides**: 200-400 lines (detailed with examples)
- **Process files**: 100-200 lines (step-by-step workflows)
- **Standard files**: 100-200 lines (clear criteria and rules)
- **Template files**: 150-300 lines (complete template with examples)

### Content Guidelines

**Do Include**:
- ✅ Specific, actionable guidance
- ✅ Concrete examples
- ✅ Clear requirements and criteria
- ✅ Common mistakes to avoid
- ✅ Best practices with rationale

**Avoid**:
- ❌ Generic advice without specifics
- ❌ Duplication of content from other files
- ❌ Subjective opinions without justification
- ❌ Outdated information

## Current Status

### Implemented (2 files)
✅ `domain/spec-pattern-overview.md` - Complete methodology overview (69 lines)
✅ `domain/prd-structure.md` - Comprehensive PRD guide (334 lines)

### Ready for Expansion (Optional)

The system is **production-ready** with current context files. Additional files can be added as needed to provide more detailed guidance:

**Priority 1 (Recommended)**:
- `domain/design-structure.md` - DESIGN structure guide
- `domain/architecture-structure.md` - ARCHITECTURE structure guide
- `domain/task-structure.md` - TASK structure guide

**Priority 2 (Helpful)**:
- `templates/prd-template.md` - PRD template
- `templates/design-template.md` - DESIGN template
- `templates/architecture-template.md` - ARCHITECTURE template
- `templates/task-template.md` - TASK template

**Priority 3 (Nice to Have)**:
- Process files for each transformation (PRD→DESIGN→ARCH→TASK)
- Detailed quality criteria files for each spec type
- Comprehensive validation and consistency rules

## Expanding Context

To add new context files:

1. **Choose appropriate directory** (domain/processes/standards/templates)
2. **Follow naming conventions** (lowercase-with-hyphens.md)
3. **Use clear structure** with headings and examples
4. **Keep file focused** (single purpose, 50-200 lines)
5. **Reference from agents** in their context loading logic
6. **Test thoroughly** to ensure agents use context correctly

## Questions?

For understanding how context works:
- See `SPEC-SYSTEM-GUIDE.md` for system overview
- See `SPEC-DELIVERY-SUMMARY.md` for complete component list
- Check individual agent files to see what context they load

The current context files are sufficient for production use. Additional files enhance the system but are not required for core functionality.
