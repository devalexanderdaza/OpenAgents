---
name: test-generation
description: Generate comprehensive tests following TDD principles. Use when writing tests for new features, implementing TDD workflows, or adding test coverage to existing code.
context: fork
agent: test-engineer
---

# Test Generation

Generate comprehensive tests following TDD principles and project testing standards.

## When to Use This Skill

Invoke this skill when:
- **After implementation**: Writing tests for newly implemented features
- **TDD workflow**: Writing tests before implementation (test-first development)
- **Coverage gaps**: Adding tests to existing code that lacks coverage
- **Regression testing**: Adding tests to prevent bugs from reoccurring
- **Refactoring**: Ensuring behavior is preserved during code changes

## How It Works

This skill runs in the **test-engineer** subagent with an isolated context. The main agent must:

1. **Pre-load testing standards** before invoking this skill
2. **Specify test requirements** clearly
3. **Review the test plan** before implementation
4. **Receive test results** and integrate them into the workflow

## Usage Pattern

### Step 1: Load Testing Context (Main Agent)

Before invoking this skill, load project testing standards:

```markdown
Read these files to understand testing requirements:
- .opencode/context/core/standards/tests.md
- .opencode/context/core/standards/test-coverage.md
- [project-specific test conventions]
```

### Step 2: Invoke Test Generation

Use this skill with clear requirements:

```markdown
/test-generation

Generate tests for [feature/component]:

**Feature**: [Brief description]

**Acceptance Criteria**:
- [Criterion 1]
- [Criterion 2]
- [Criterion 3]

**Behaviors to Test**:
1. [Behavior 1] - [expected outcome]
2. [Behavior 2] - [expected outcome]
3. [Error handling for X]

**Coverage Requirements**:
- Line coverage: [X]%
- Branch coverage: [X]%
- All critical paths tested

**Testing Standards** (pre-loaded):
- Test framework: [vitest/jest/pytest/etc.]
- Assertion library: [expect/chai/etc.]
- Mock library: [vi/jest.mock/etc.]
- File naming: [*.test.ts / *.spec.ts / test_*.py]
- Test structure: [AAA pattern required]
```

### Step 3: Review Test Plan

The test-engineer will propose a test plan:

```markdown
## Test Plan for [Feature]

### Behaviors to Test
1. [Behavior 1]
   - ✅ Positive: [success case]
   - ❌ Negative: [failure/edge case]
2. [Behavior 2]
   - ✅ Positive: [success case]
   - ❌ Negative: [failure/edge case]

### Mocking Strategy
- [External dependency 1]: Mock with [approach]
- [External dependency 2]: Mock with [approach]

### Coverage Target
- [X]% line coverage
- All critical paths tested
```

**IMPORTANT**: Review and approve the test plan before implementation proceeds.

### Step 4: Receive Test Results

After implementation, the test-engineer returns:

```yaml
status: "success" | "failure"
tests_written: [number]
coverage:
  lines: [percentage]
  branches: [percentage]
  functions: [percentage]
behaviors_tested:
  - name: "[Behavior 1]"
    positive_tests: [count]
    negative_tests: [count]
test_results:
  passed: [count]
  failed: [count]
self_review:
  positive_negative_coverage: "✅ pass"
  aaa_pattern: "✅ pass"
  determinism: "✅ pass"
  code_quality: "✅ pass"
  standards_compliance: "✅ pass"
deliverables:
  - "[path/to/test/file.test.ts]"
```

## Test Requirements Specification

### Minimal Requirements

At minimum, specify:
- **What to test**: Feature/component name and behaviors
- **Acceptance criteria**: What defines success
- **Coverage target**: Percentage or "all critical paths"

### Recommended Requirements

For best results, also specify:
- **Test framework**: vitest, jest, pytest, etc.
- **Mock patterns**: How to handle external dependencies
- **Edge cases**: Specific scenarios to cover
- **Error conditions**: Expected failure modes

### Example: Simple Feature

```markdown
/test-generation

Generate tests for user authentication:

**Feature**: JWT token validation middleware

**Behaviors**:
1. Valid token → allow request
2. Expired token → reject with 401
3. Invalid signature → reject with 401
4. Missing token → reject with 401

**Coverage**: All critical paths
```

### Example: Complex Feature

```markdown
/test-generation

Generate tests for payment processing service:

**Feature**: Stripe payment integration

**Acceptance Criteria**:
- Process successful payments
- Handle declined cards gracefully
- Retry failed network requests (max 3 attempts)
- Log all payment attempts
- Emit payment events for webhooks

**Behaviors to Test**:
1. Successful payment flow
2. Declined card handling
3. Network retry logic
4. Idempotency (duplicate requests)
5. Webhook event emission

**External Dependencies** (must be mocked):
- Stripe API calls
- Database writes
- Event emitter
- Logger

**Coverage Requirements**:
- Line coverage: 90%+
- All error paths tested
- All retry scenarios tested

**Testing Standards**:
- Framework: vitest
- Mocks: vi.mock()
- Assertions: expect()
- Structure: AAA pattern
```

## TDD Workflow

For test-driven development, invoke this skill **before** implementation:

### Step 1: Write Tests First

```markdown
/test-generation

Write tests for [feature] following TDD:

**Feature**: [Description]

**Expected Behavior**:
- [Behavior 1]
- [Behavior 2]

**Note**: Implementation does not exist yet. Write tests that define the expected behavior.
```

### Step 2: Verify Tests Fail

The test-engineer will write tests and verify they fail (since implementation doesn't exist).

### Step 3: Implement Feature

Use the failing tests as a specification to guide implementation.

### Step 4: Verify Tests Pass

After implementation, run tests to confirm they pass.

## What the Test-Engineer Does

The test-engineer subagent will:

1. ✅ **Review pre-loaded testing standards** (provided by main agent)
2. ✅ **Propose a test plan** with positive and negative cases
3. ✅ **Request approval** before implementing tests
4. ✅ **Implement tests** following AAA pattern (Arrange-Act-Assert)
5. ✅ **Mock all external dependencies** (network, time, file system)
6. ✅ **Run tests** and verify they pass
7. ✅ **Self-review** for quality and standards compliance
8. ✅ **Return structured results** to main agent

## What the Test-Engineer Does NOT Do

The test-engineer will NOT:

- ❌ Request additional context (main agent pre-loads standards)
- ❌ Call other subagents (returns results to main agent)
- ❌ Skip negative tests (both positive and negative required)
- ❌ Use real network calls (all external deps mocked)
- ❌ Leave flaky tests (deterministic only)

## Integration with OAC Workflow

### Stage 4: Execute (After Implementation)

```markdown
1. Implement feature using /code-execution skill
2. Generate tests using /test-generation skill
3. Verify tests pass
4. Proceed to Stage 5: Validate
```

### Stage 5: Validate (Test Execution)

```markdown
1. Run test suite
2. Verify coverage meets requirements
3. If tests fail → return to Stage 4
4. If tests pass → proceed to Stage 6
```

## Common Patterns

### Pattern 1: Post-Implementation Testing

```markdown
# After implementing a feature
/test-generation

Generate tests for the authentication service implemented in src/auth/service.ts:

**Behaviors**: [list from acceptance criteria]
**Coverage**: 90%+
```

### Pattern 2: TDD (Test-First)

```markdown
# Before implementing a feature
/test-generation

Write tests for a new user registration endpoint (not yet implemented):

**Expected Behavior**:
- POST /api/register with valid data → 201 + user object
- POST /api/register with duplicate email → 409 error
- POST /api/register with invalid email → 400 error

**Note**: Implementation does not exist. Write tests that define expected behavior.
```

### Pattern 3: Regression Testing

```markdown
# After fixing a bug
/test-generation

Add regression tests for bug #123 (user session expiry):

**Bug**: Sessions not expiring after 24 hours
**Fix**: Added TTL check in session middleware
**Test**: Verify sessions expire correctly after 24 hours (use fake timers)
```

### Pattern 4: Refactoring Safety

```markdown
# Before refactoring
/test-generation

Generate comprehensive tests for the payment service before refactoring:

**Purpose**: Ensure behavior is preserved during refactoring
**Coverage**: 100% of current behavior
**Focus**: All public API methods and edge cases
```

## Tips for Success

1. **Pre-load context**: Always load testing standards before invoking this skill
2. **Be specific**: Clear requirements = better tests
3. **Review test plans**: Approve before implementation to catch gaps early
4. **Specify mocks**: Tell the test-engineer what external dependencies exist
5. **Define coverage**: Set clear coverage targets (percentage or "all critical paths")
6. **Use TDD**: Write tests first when possible — they guide better design

## Troubleshooting

### Issue: Tests don't match project conventions

**Solution**: Ensure testing standards are pre-loaded before invoking this skill:
```markdown
Read .opencode/context/core/standards/tests.md before generating tests.
```

### Issue: Missing edge cases

**Solution**: Specify edge cases explicitly in the requirements:
```markdown
**Edge Cases to Test**:
- Empty input
- Null values
- Extremely large inputs
- Concurrent requests
```

### Issue: Flaky tests

**Solution**: Specify that external dependencies must be mocked:
```markdown
**External Dependencies** (must be mocked):
- API calls to [service]
- Database queries
- Current time (use fake timers)
```

### Issue: Insufficient coverage

**Solution**: Set explicit coverage targets:
```markdown
**Coverage Requirements**:
- Line coverage: 90%+
- Branch coverage: 85%+
- All error paths tested
```

---

## Related Skills

- `/code-execution` - Implement features before testing
- `/code-review` - Review test quality and coverage
- `/context-discovery` - Find testing standards and conventions

## Related Context

- `.opencode/context/core/standards/tests.md` - Testing standards
- `.opencode/context/core/standards/test-coverage.md` - Coverage requirements
- `.opencode/context/core/workflows/review.md` - Test review workflow
