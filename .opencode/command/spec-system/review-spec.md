---
description: "Review SPEC documents for quality and get improvement suggestions"
agent: spec-orchestrator
---

# Review SPEC

<command_purpose>
Conduct comprehensive review of SPEC documents, identify issues, and provide prioritized improvement suggestions with examples.
</command_purpose>

<usage>
```bash
# Review single spec
/review-spec specs/prd/user-authentication.prd.md

# Review multiple specs
/review-spec specs/prd/cart.prd.md specs/design/cart.design.md

# Review complete package
/review-spec specs/*/shopping-cart.*

# Quick review (high-level only)
/review-spec specs/architecture/search.architecture.md --depth=quick

# Comprehensive review (deep dive)
/review-spec specs/*/auth.* --depth=comprehensive
```
</usage>

<parameters>
  <depth>
    - quick: High-level review, major issues only
    - standard: Thorough review (default)
    - comprehensive: Deep dive with detailed analysis
  </depth>
  <focus>
    - clarity: Focus on language and communication
    - completeness: Focus on missing information
    - feasibility: Focus on implementation practicality
    - consistency: Focus on cross-spec alignment
    - quality: Focus on overall quality
  </focus>
</parameters>

<routing>
  Route to: @spec-orchestrator → @spec-reviewer
</routing>

<output>
  Comprehensive review report containing:
  - Executive summary with overall assessment
  - Readiness status (ready/needs work/major revisions)
  - Strengths (what's done well)
  - Findings categorized by priority:
    - HIGH: Must address before implementation
    - MEDIUM: Should address soon
    - LOW: Nice to have improvements
  - Specific recommendations with examples
  - Consistency check results
  - Quality assessment by spec type
  - Actionable next steps
</output>

<examples>
  <example>
    <title>Single Spec Review</title>
    <command>/review-spec specs/prd/user-authentication.prd.md</command>
    <outcome>
      Review Report:
      - Overall: Good quality (8/10)
      - Readiness: Ready with minor improvements
      - HIGH: 1 issue (clarify performance percentiles)
      - MEDIUM: 2 issues (define acronyms, add version history)
      - LOW: 3 suggestions (journey map, risk assessment)
      - Next Steps: Address 1 high-priority finding
    </outcome>
  </example>

  <example>
    <title>Package Review</title>
    <command>/review-spec specs/*/user-authentication.*</command>
    <outcome>
      Package Review:
      - PRD Quality: 8/10
      - DESIGN Quality: 8/10
      - ARCHITECTURE Quality: 9/10
      - TASK Quality: 7/10
      - Consistency: ✅ All specs aligned
      - Readiness: Ready for implementation
      - Recommendations: 5 improvements (2 high, 3 medium)
    </outcome>
  </example>
</examples>

<related_commands>
  - `/validate-spec` - Get validation scores
  - `/create-prd` - Create new PRD
  - `/create-full-spec` - Create complete package
</related_commands>

<tips>
  - Review helps identify ambiguities before implementation
  - Use before stakeholder review to ensure quality
  - Comprehensive depth recommended for critical features
  - Review package together for consistency check
</tips>
