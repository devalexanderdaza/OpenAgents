# ADR-001: Plugin Abilities Lifecycle in OpenAgents

**Date**: 2026-05-13  
**Status**: Decided  
**Owner**: OpenAgents maintainers  
**Related Issues**: #7, #8

## Context

Issue #7 requires a lifecycle decision for `packages/plugin-abilities`: keep it as an integrated workspace package or publish/use it as an external package.

Before this decision/PR, the repository contained `packages/plugin-abilities` with its own architecture, tests, and package manifest, while root workspaces included only `evals/framework`, `packages/cli`, and `packages/compatibility-layer`.

Issue #8 depends on this decision because integration mechanics (workspace wiring, build/test flow, dependency boundaries, and release flow) differ significantly between an internal workspace package and an external dependency.

## Decision

We will treat `packages/plugin-abilities` as an **integrated workspace package** in this repository (not an external package) for Phase 2.

## Rationale

An integrated workspace package gives faster iteration and safer refactors during ongoing architecture changes. It keeps plugin evolution, CLI/evaluator integration, and test feedback in one repository and one CI flow, reducing coordination cost while Phase 2 implementation is still stabilizing.

## Alternatives Considered

| Alternative | Pros | Cons | Why Not Chosen Now |
|-------------|------|------|---------------------|
| Keep as integrated workspace package | Atomic cross-package changes, simpler local development, unified CI/testing, easier debugging during refactor | Larger monorepo surface, tighter coupling to repo release cadence | **Chosen** for current Phase 2 delivery |
| External package (`@openagents/plugin-abilities`) consumed from registry/git | Clear versioned boundary, independent release cycle, potential reuse outside this monorepo | Slower inner-loop development, extra publish/version coordination, harder synchronized changes across #8 implementation | Not chosen for Phase 2 because #8 needs tight, immediate integration changes |

## Trade-offs

- **Positive**: Faster and safer implementation for #8 due to in-repo updates across workspace config, tests, and integration points.
- **Negative**: Increased coupling and temporary monorepo complexity until lifecycle is revisited post-stabilization.
- **Risk**: If boundaries are not enforced, plugin internals could leak into unrelated packages.
- **Mitigation**: Enforce package-level public API usage, keep explicit dependency declarations, and re-evaluate externalization after Phase 2 outcomes.

## Implementation Implications for Issue #8

Issue #8 must implement integration strategy assuming workspace lifecycle:

1. Add `packages/plugin-abilities` to root workspace configuration.
2. Use workspace-local linking/consumption patterns for internal integration points.
3. Add opt-in root build/test commands for `plugin-abilities` and defer mandatory CI workflow validation until package build/test prerequisites are stabilized.
4. Keep package boundaries explicit (consume exports, avoid private file coupling).
5. Defer external publish/release automation until a future ADR revisits externalization.

## Backward Compatibility and Migration Impact

- No immediate migration required for external consumers because external consumption is not the selected lifecycle in this phase.
- Existing in-repo behavior remains compatible while integration is formalized under workspace management.
- Future move to external package remains possible via superseding ADR once integration is stable and boundaries are proven.

## Related

- Issue #7: lifecycle decision for `packages/plugin-abilities`
- Issue #8: implementation of plugin-abilities integration strategy
- `packages/plugin-abilities/ARCHITECTURE.md`
