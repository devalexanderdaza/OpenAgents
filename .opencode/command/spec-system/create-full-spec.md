---
description: "Create complete SPEC package (PRD → DESIGN → ARCHITECTURE → TASK) for a feature"
agent: spec-orchestrator
---

# Create Full SPEC Package

<command_purpose>
Generate a complete specification package with all four SPEC documents (PRD, DESIGN, ARCHITECTURE, TASK) in the correct dependency order.
</command_purpose>

<usage>
```bash
# Create complete spec package from feature description
/create-full-spec "User authentication system with OAuth and MFA"

# Interactive mode
/create-full-spec
```
</usage>

<routing>
  Route to: @spec-orchestrator
  
  Request format:
  {
    action: "create_full_spec",
    feature_description: "{user input}"
  }
</routing>

<workflow>
  Multi-stage workflow executed by spec-orchestrator:
  
  1. **Create PRD** (2-4 minutes)
     - Generate Product Requirements Document
     - Validate PRD quality (8+/10 required)
     - Write to specs/prd/{feature}.prd.md
  
  2. **Create DESIGN** (3-5 minutes)
     - Generate Design Specification from PRD
     - Validate DESIGN quality (8+/10 required)
     - Write to specs/design/{feature}.design.md
  
  3. **Create ARCHITECTURE** (4-6 minutes)
     - Generate Architecture Specification from PRD + DESIGN
     - Validate ARCHITECTURE quality (8+/10 required)
     - Write to specs/architecture/{feature}.architecture.md
  
  4. **Create TASKS** (2-3 minutes)
     - Generate Task Breakdown from ARCHITECTURE
     - Validate TASK quality (8+/10 required)
     - Write to specs/tasks/{feature}.tasks.md
  
  5. **Final Validation** (< 1 minute)
     - Check consistency across all specs
     - Verify cross-references are accurate
     - Confirm dependency chain (PRD → DESIGN → ARCH → TASK)
  
  Total time: 12-18 minutes
</workflow>

<output>
  Complete spec package with 4 documents:
  
  ```
  specs/
  ├── prd/{feature}.prd.md            (Score: X/10)
  ├── design/{feature}.design.md       (Score: X/10)
  ├── architecture/{feature}.architecture.md (Score: X/10)
  └── tasks/{feature}.tasks.md         (Score: X/10)
  
  Overall Package Score: X/10
  ```
  
  Plus summary report with:
  - File locations
  - Quality scores for each spec
  - Cross-reference validation results
  - Next steps (review, implementation)
</output>

<examples>
  <example>
    <title>Authentication System</title>
    <command>/create-full-spec "User authentication with email/password, OAuth (Google/GitHub), and optional MFA"</command>
    <result>
      ✅ PRD: specs/prd/user-authentication.prd.md (Score: 9/10)
      ✅ DESIGN: specs/design/user-authentication.design.md (Score: 8/10)
      ✅ ARCHITECTURE: specs/architecture/user-authentication.architecture.md (Score: 9/10)
      ✅ TASKS: specs/tasks/user-authentication.tasks.md (Score: 8/10)
      
      Package Score: 8.5/10 ✅
      
      All specs consistent. Ready for review and implementation.
    </result>
  </example>
</examples>

<validation>
  - Each spec must score 8+/10 individually
  - Average package score must be 8+/10
  - All cross-references must be valid
  - No contradictions between specs
  - Dependency chain must be intact (PRD → DESIGN → ARCH → TASK)
</validation>

<related_commands>
  - `/create-prd` - Create just the PRD
  - `/create-design` - Create just the DESIGN
  - `/create-architecture` - Create just the ARCHITECTURE
  - `/create-tasks` - Create just the TASK breakdown
  - `/validate-spec` - Validate complete package
  - `/review-spec` - Review package for improvements
</related_commands>

<tips>
  - This creates all 4 specs in one workflow (12-18 minutes)
  - Provide detailed feature description for best results
  - You can edit any spec and regenerate dependent ones
  - Review package before starting implementation
</tips>
