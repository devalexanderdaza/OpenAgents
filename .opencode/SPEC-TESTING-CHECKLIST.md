# SPEC System Testing Checklist

## Purpose
This checklist ensures the SPEC Pattern System is working correctly and generating high-quality specifications.

## Pre-Testing Setup

- [ ] Verify all subagent files exist in `.opencode/agent/subagents/spec-system/`:
  - [ ] `prd-writer.md`
  - [ ] `design-writer.md`
  - [ ] `architecture-writer.md`
  - [ ] `task-writer.md`
  - [ ] `spec-validator.md`
  - [ ] `spec-reviewer.md`

- [ ] Verify main orchestrator exists: `.opencode/agent/spec-orchestrator.md`

- [ ] Verify all commands exist in `.opencode/command/spec-system/`:
  - [ ] `create-prd.md`
  - [ ] `create-design.md`
  - [ ] `create-architecture.md`
  - [ ] `create-tasks.md`
  - [ ] `create-full-spec.md`
  - [ ] `validate-spec.md`
  - [ ] `review-spec.md`

- [ ] Verify context files exist in `.opencode/context/spec-system/domain/`:
  - [ ] `spec-pattern-overview.md`
  - [ ] `prd-structure.md`
  - [ ] Other domain files

## Test 1: Create PRD

### Test 1.1: Basic PRD Creation
```bash
/create-prd "Simple user profile feature with name, email, and avatar"
```

**Expected Results:**
- [ ] PRD file created at `specs/prd/user-profile.prd.md`
- [ ] File contains all required sections
- [ ] Frontmatter metadata is complete (type, feature, version, date, status, author)
- [ ] User stories follow "As a/I want/So that" format
- [ ] User stories have acceptance criteria (3-5 per story)
- [ ] Functional requirements are numbered (FR-001, FR-002, etc.)
- [ ] Non-functional requirements categorized
- [ ] Success criteria are measurable with targets
- [ ] Stakeholder table present
- [ ] Out of scope section present
- [ ] Related documents section present
- [ ] Quality score reported (should be 8+/10)

### Test 1.2: PRD with Complex Requirements
```bash
/create-prd "E-commerce checkout with multiple payment methods (credit card, PayPal, Apple Pay), tax calculation, shipping options, promo codes, and order confirmation email"
```

**Expected Results:**
- [ ] PRD handles complex feature with multiple components
- [ ] User stories cover all mentioned features
- [ ] Requirements are broken down logically
- [ ] Success criteria are realistic and measurable
- [ ] Performance requirements included (response time, etc.)
- [ ] Security requirements included for payment handling
- [ ] Quality score 8+/10

## Test 2: Create DESIGN

### Test 2.1: DESIGN from PRD
**Prerequisites:** Complete Test 1.1 first

```bash
/create-design specs/prd/user-profile.prd.md
```

**Expected Results:**
- [ ] DESIGN file created at `specs/design/user-profile.design.md`
- [ ] All PRD user stories have corresponding user flows
- [ ] UI components are defined for user profile display and editing
- [ ] Component states defined (default, hover, active, error)
- [ ] Interaction patterns specified
- [ ] Accessibility requirements present (WCAG AA)
- [ ] Responsive design specifications included
- [ ] Design decisions documented with rationale
- [ ] PRD requirements referenced correctly (FR-001, US-001, etc.)
- [ ] Quality score 8+/10

### Test 2.2: DESIGN Consistency Check
- [ ] All PRD user stories (US-XXX) appear in DESIGN user flows
- [ ] PRD functional requirements (FR-XXX) are addressed in DESIGN
- [ ] No contradictions between PRD and DESIGN
- [ ] Terminology consistent (same terms used in both)

## Test 3: Create ARCHITECTURE

### Test 3.1: ARCHITECTURE from PRD + DESIGN
**Prerequisites:** Complete Tests 1.1 and 2.1 first

```bash
/create-architecture specs/prd/user-profile.prd.md specs/design/user-profile.design.md
```

**Expected Results:**
- [ ] ARCHITECTURE file created at `specs/architecture/user-profile.architecture.md`
- [ ] System architecture diagram present (text-based)
- [ ] Component design section defines all components
- [ ] Data models defined for user profile entity
- [ ] Data model includes fields, types, validation rules
- [ ] API endpoints defined for CRUD operations
- [ ] API endpoints specify request/response formats
- [ ] Security architecture present (auth, authorization)
- [ ] Performance considerations address PRD NFRs
- [ ] Technical decisions documented with rationale
- [ ] PRD and DESIGN requirements referenced
- [ ] Quality score 8+/10

### Test 3.2: ARCHITECTURE Completeness
- [ ] All DESIGN components have corresponding architecture components
- [ ] All PRD functional requirements addressed
- [ ] All PRD non-functional requirements addressed
- [ ] Data models support all user stories
- [ ] APIs cover all DESIGN user flows
- [ ] No contradictions between PRD/DESIGN/ARCHITECTURE

## Test 4: Create TASKS

### Test 4.1: TASK Breakdown
**Prerequisites:** Complete Tests 1.1, 2.1, and 3.1 first

```bash
/create-tasks specs/architecture/user-profile.architecture.md
```

**Expected Results:**
- [ ] TASK file created at `specs/tasks/user-profile.tasks.md`
- [ ] Task summary table present with phase breakdown
- [ ] Foundation tasks present (project setup)
- [ ] Data layer tasks present (schema, models)
- [ ] API layer tasks present (endpoints)
- [ ] Component tasks present (UI implementation)
- [ ] Testing tasks present (unit, integration)
- [ ] Documentation tasks present
- [ ] All tasks numbered (TASK-001, TASK-002, etc.)
- [ ] Each task has 3-5 acceptance criteria
- [ ] Task dependencies explicitly stated
- [ ] Dependency graph present and correct (no circular dependencies)
- [ ] Implementation sequence suggested
- [ ] Effort estimates included (if requested)
- [ ] Quality score 8+/10

### Test 4.2: TASK Traceability
- [ ] All ARCHITECTURE components have implementation tasks
- [ ] All ARCHITECTURE data models have schema and model tasks
- [ ] All ARCHITECTURE APIs have endpoint implementation tasks
- [ ] Tasks reference ARCHITECTURE components correctly
- [ ] No tasks for functionality not in ARCHITECTURE

## Test 5: Full Spec Package

### Test 5.1: End-to-End Full Package
```bash
/create-full-spec "User notification system with email, SMS, and push notifications, user preferences for notification types, and delivery tracking"
```

**Expected Results:**
- [ ] All 4 spec files created:
  - [ ] `specs/prd/user-notification.prd.md`
  - [ ] `specs/design/user-notification.design.md`
  - [ ] `specs/architecture/user-notification.architecture.md`
  - [ ] `specs/tasks/user-notification.tasks.md`
- [ ] Each spec scores 8+/10 individually
- [ ] Average package score 8+/10
- [ ] All cross-references between specs are valid
- [ ] No contradictions across specs
- [ ] Dependency chain intact (PRD → DESIGN → ARCH → TASK)
- [ ] Complete workflow completes in 12-18 minutes

### Test 5.2: Package Consistency
- [ ] PRD requirements appear in DESIGN user flows
- [ ] DESIGN components appear in ARCHITECTURE design
- [ ] ARCHITECTURE components appear in TASKS
- [ ] Terminology consistent across all 4 specs
- [ ] Version numbers aligned
- [ ] Feature name consistent across files

## Test 6: Validation

### Test 6.1: Validate Single Spec
```bash
/validate-spec specs/prd/user-profile.prd.md
```

**Expected Results:**
- [ ] Validation report generated
- [ ] Overall score calculated (0-10)
- [ ] All 5 quality dimensions scored:
  - [ ] Structure (0-2)
  - [ ] Completeness (0-2)
  - [ ] Clarity (0-2)
  - [ ] Consistency (0-2)
  - [ ] Metadata (0-2)
- [ ] Issues categorized (critical/major/minor)
- [ ] Specific recommendations provided for each issue
- [ ] Line numbers or sections referenced for issues
- [ ] Next steps are actionable
- [ ] Pass/Fail status determined (PASS if 8+, FAIL if < 8)

### Test 6.2: Validate Package
```bash
/validate-spec specs/*/user-profile.*
```

**Expected Results:**
- [ ] All 4 specs validated
- [ ] Individual scores for each spec
- [ ] Cross-spec consistency checks performed
- [ ] Contradictions identified (if any)
- [ ] Cross-references validated
- [ ] Overall package assessment provided

## Test 7: Review

### Test 7.1: Review Single Spec
```bash
/review-spec specs/prd/user-profile.prd.md
```

**Expected Results:**
- [ ] Comprehensive review report generated
- [ ] Executive summary present
- [ ] Overall assessment provided (good/needs work/major revisions)
- [ ] Readiness status provided
- [ ] Strengths listed (positive aspects)
- [ ] Findings categorized by priority (HIGH/MEDIUM/LOW)
- [ ] Specific recommendations with examples
- [ ] Concrete next steps provided

### Test 7.2: Review Package
```bash
/review-spec specs/*/user-notification.*
```

**Expected Results:**
- [ ] All specs reviewed holistically
- [ ] Package-level consistency check
- [ ] Individual quality assessment for each spec
- [ ] Cross-spec issues identified
- [ ] Prioritized recommendations for package
- [ ] Readiness for implementation assessed

## Test 8: Edge Cases

### Test 8.1: Missing Dependency
```bash
/create-design specs/prd/nonexistent.prd.md
```

**Expected Results:**
- [ ] Error message clearly states PRD file not found
- [ ] Suggests creating PRD first
- [ ] Provides command to create PRD

### Test 8.2: Invalid Spec Type
```bash
/validate-spec specs/prd/user-profile.prd.md INVALID
```

**Expected Results:**
- [ ] Error message states spec type is invalid
- [ ] Lists valid spec types (PRD, DESIGN, ARCHITECTURE, TASK)

### Test 8.3: Validation Failure (< 8/10)
Manually edit a spec to remove required sections, then validate:

```bash
/validate-spec specs/prd/edited-spec.prd.md
```

**Expected Results:**
- [ ] Validation score < 8
- [ ] Status: FAIL
- [ ] Critical issues identified
- [ ] Specific sections flagged as missing/incomplete
- [ ] Recommendations provided for achieving passing score

## Test 9: Quality Standards

### Test 9.1: PRD Quality Requirements
Review generated PRDs for:
- [ ] No technical implementation details (no database schemas, APIs)
- [ ] No UI/UX details (no button colors, layouts)
- [ ] Focus on WHAT and WHY, not HOW
- [ ] All requirements testable and measurable
- [ ] Language accessible to non-technical stakeholders

### Test 9.2: DESIGN Quality Requirements
Review generated DESIGNs for:
- [ ] No technical implementation (no code, database, APIs)
- [ ] Focus on UI/UX and user experience
- [ ] All user flows complete (happy path + errors)
- [ ] Accessibility requirements present (WCAG AA)
- [ ] Design decisions justified

### Test 9.3: ARCHITECTURE Quality Requirements
Review generated ARCHITECTUREs for:
- [ ] All PRD NFRs addressed (performance, security, scalability)
- [ ] Data models complete with validation rules
- [ ] APIs cover all DESIGN user flows
- [ ] Security architecture comprehensive
- [ ] Technical decisions documented with trade-offs

### Test 9.4: TASK Quality Requirements
Review generated TASKs for:
- [ ] Tasks are appropriately sized (< 8 hours for "medium")
- [ ] All tasks have acceptance criteria
- [ ] Dependencies are explicit
- [ ] No circular dependencies
- [ ] Testing and documentation tasks included

## Test 10: Performance

### Test 10.1: Creation Time
Measure time for each operation:
- [ ] PRD creation: 2-4 minutes ✓ / ✗ (Actual: _____ minutes)
- [ ] DESIGN creation: 3-5 minutes ✓ / ✗ (Actual: _____ minutes)
- [ ] ARCHITECTURE creation: 4-6 minutes ✓ / ✗ (Actual: _____ minutes)
- [ ] TASK creation: 2-3 minutes ✓ / ✗ (Actual: _____ minutes)
- [ ] Full package: 12-18 minutes ✓ / ✗ (Actual: _____ minutes)

### Test 10.2: Quality Consistency
Generate 3 PRDs for different features and verify:
- [ ] All score 8+/10
- [ ] Similar structure and completeness
- [ ] Consistent formatting

## Test 11: Real-World Scenarios

### Test 11.1: Simple Feature (Bug Fix Extension)
```bash
/create-prd "Add password strength indicator to registration form"
```
- [ ] PRD is concise but complete
- [ ] Appropriate scope (not over-specified)
- [ ] Scores 8+/10

### Test 11.2: Medium Complexity Feature
```bash
/create-full-spec "User commenting system with threaded replies, reactions, moderation tools, and notification preferences"
```
- [ ] All 4 specs created and consistent
- [ ] Appropriate level of detail for medium feature
- [ ] Package score 8+/10

### Test 11.3: Complex Feature
```bash
/create-full-spec "Multi-tenant SaaS billing system with subscription plans, usage-based pricing, invoicing, payment retries, dunning management, tax calculation, and revenue analytics dashboard"
```
- [ ] System handles complex multi-component feature
- [ ] All aspects covered across specs
- [ ] No information loss between specs
- [ ] Package score 8+/10

## Test 12: Error Recovery

### Test 12.1: Retry After Validation Failure
1. Generate spec that scores < 8/10 (may need to manually break it)
2. Run validation to identify issues
3. Manually fix issues
4. Re-validate

**Expected:**
- [ ] Can identify and fix issues
- [ ] Re-validation shows improved score
- [ ] Achieves 8+/10 after fixes

### Test 12.2: Update and Propagate
1. Create full spec package
2. Edit PRD (add new requirement)
3. Regenerate DESIGN from updated PRD
4. Verify DESIGN reflects PRD changes

**Expected:**
- [ ] Updated DESIGN includes new requirement
- [ ] Maintains consistency with other PRD requirements
- [ ] Scores 8+/10

## Success Criteria

System passes testing if:
- ✅ All creation commands work (Tests 1-5)
- ✅ All specs score 8+/10 individually
- ✅ Validation and review commands work (Tests 6-7)
- ✅ Edge cases handled gracefully (Test 8)
- ✅ Quality standards maintained (Test 9)
- ✅ Performance targets met (Test 10)
- ✅ Real-world scenarios handled well (Test 11)

## Failure Indicators

System needs fixes if:
- ❌ Any spec scores < 8/10 consistently
- ❌ Missing required sections
- ❌ Cross-spec inconsistencies
- ❌ Commands fail with errors
- ❌ Creation times exceed targets significantly
- ❌ Quality varies greatly between runs

## Testing Notes

**Date Tested**: _____________
**Tester**: _____________
**Version**: _____________

**Overall Result**: PASS ✓ / FAIL ✗

**Issues Found**:
1. _____________________
2. _____________________
3. _____________________

**Recommendations**:
1. _____________________
2. _____________________
3. _____________________
