---
description: "Validate SPEC document quality and consistency"
agent: spec-orchestrator
---

# Validate SPEC

<command_purpose>
Validate SPEC documents (PRD, DESIGN, ARCHITECTURE, TASK) against quality standards, check completeness, and verify cross-spec consistency.
</command_purpose>

<usage>
```bash
# Validate single spec
/validate-spec specs/prd/user-authentication.prd.md

# Validate with type specified
/validate-spec specs/design/user-authentication.design.md DESIGN

# Validate multiple specs for consistency
/validate-spec specs/prd/user-authentication.prd.md specs/design/user-authentication.design.md

# Validate complete package (glob pattern)
/validate-spec specs/*/user-authentication.*
```
</usage>

<routing>
  Route to: @spec-orchestrator → @spec-validator
  
  Request format:
  {
    action: "validate_spec",
    spec_paths: ["{path1}", "{path2}", ...],
    spec_type: "PRD | DESIGN | ARCHITECTURE | TASK | AUTO"
  }
</routing>

<validation_criteria>
  5 quality dimensions scored 0-2 points each:
  
  1. **Structure** (2 points)
     - Valid markdown formatting
     - Complete frontmatter metadata
     - All required sections present
     - Proper heading hierarchy
  
  2. **Completeness** (2 points)
     - No placeholder content
     - Sufficient detail in all sections
     - All references defined
     - Numbering sequences valid
  
  3. **Clarity** (2 points)
     - Clear, unambiguous language
     - Technical terms defined
     - Logical flow and organization
     - Actionable content
  
  4. **Consistency** (2 points)
     - Aligned with related specs
     - Cross-references accurate
     - No contradictions
     - Terminology consistent
  
  5. **Metadata** (2 points)
     - Version number present
     - Date in correct format
     - Status specified
     - Author identified
  
  Total: 0-10 points (8+ required to pass)
</validation_criteria>

<output>
  Validation report in YAML format:
  
  ```yaml
  validation_report:
    spec_path: "specs/prd/user-authentication.prd.md"
    spec_type: "PRD"
    overall_score: 8/10
    status: "PASS"  # or "FAIL"
    
    scores:
      structure: 2/2
      completeness: 1/2
      clarity: 2/2
      consistency: 2/2
      metadata: 1/2
    
    issues:
      critical:  # Must fix (prevents passing)
        - section: "Success Criteria"
          issue: "Criteria lack measurable targets"
          recommendation: "Add specific numbers and timeframes"
      
      major:  # Should fix
        - section: "Metadata"
          issue: "Missing status field"
          recommendation: "Add 'status: Draft'"
      
      minor:  # Nice to fix
        - section: "Problem Statement"
          issue: "Acronym 'MFA' undefined"
          recommendation: "Define on first use"
    
    next_steps:
      - "Fix 1 critical issue to pass"
      - "Address major issues before review"
  ```
</output>

<examples>
  <example>
    <title>Single Spec Validation</title>
    <command>/validate-spec specs/prd/user-authentication.prd.md</command>
    <outcome>
      Validation Report:
      - Score: 9/10 (PASS)
      - 1 minor issue: Define acronym "MFA"
      - Ready for stakeholder review
    </outcome>
  </example>

  <example>
    <title>Package Validation</title>
    <command>/validate-spec specs/*/user-authentication.*</command>
    <outcome>
      Package Validation:
      - PRD: 9/10 ✅
      - DESIGN: 8/10 ✅
      - ARCHITECTURE: 7/10 ❌ (missing security section)
      - TASK: 8/10 ✅
      
      Fix ARCHITECTURE to achieve passing package score.
    </outcome>
  </example>
</examples>

<related_commands>
  - `/review-spec` - Get detailed review with improvement suggestions
  - `/create-prd` - Create new PRD
  - `/create-full-spec` - Create complete spec package
</related_commands>
