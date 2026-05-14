# Package Manager and Lockfile Policy

## Why this policy exists

This repository contains a mix of npm-managed workspaces and Bun-managed runtime/tooling islands.
To keep installs reproducible and CI behavior stable, we define one clear authority model and explicit exceptions.

## Authority model

### Root repository authority

- **Package manager authority (root):** `npm`
- **Lockfile authority (root):** `package-lock.json`

Contributors must run dependency install/update flows from the root with npm (`npm install`, `npm ci`, `npm update`) when changing root/workspace dependencies.

### Allowed Bun islands (explicit exceptions)

The following paths are intentionally Bun-managed today:

- `packages/plugin-abilities` (current mixed-reality package)
- `.opencode/plugin`
- `.opencode/tool`

These locations are allowed to use `bun.lock`.

### Transitional root Bun lockfile

`bun.lock` may exist at repository root as a compatibility/transitional artifact, but it is **not** the root authority lockfile.
Root dependency truth remains `package-lock.json`.

## Allowed combinations

### Allowed

- Root `package.json` + root `package-lock.json`
- `packages/plugin-abilities/package.json` + `packages/plugin-abilities/bun.lock`
- `.opencode/plugin/package.json` + `.opencode/plugin/bun.lock`
- `.opencode/tool/package.json` + `.opencode/tool/bun.lock`
- Existing npm lockfiles at approved npm locations (`.`, `.opencode`, `packages/compatibility-layer`)

### Disallowed

- Adding `bun.lock` in directories not approved above
- Adding `package-lock.json` in directories not approved above
- Having both `package-lock.json` and `bun.lock` in the same non-root directory
- Declaring root `packageManager` as non-npm (if field is present)

## Contributor workflow

### When changing root/workspace dependencies

1. Update dependency declarations (`package.json`, workspace manifests as needed)
2. Regenerate lockfile with npm
   - `npm install` (or `npm ci` for clean installs)
3. Run policy enforcement
   - `npm run validate:package-manager-policy`
4. Commit both manifest and lockfile changes together

### When changing Bun island dependencies

1. Update dependency declarations in the Bun island package
2. Regenerate `bun.lock` in that same directory
3. Run policy enforcement from root
   - `npm run validate:package-manager-policy`
4. Commit manifest + lockfile together

## Remediation guidance

- **Unexpected `bun.lock` detected:** remove it or move dependency management to an approved Bun island.
- **Unexpected `package-lock.json` detected:** remove it and regenerate lockfiles using the authority package manager for that path.
- **Mixed lockfiles in one non-root dir:** keep only the lockfile required by policy for that location.
- **Missing required lockfile:** regenerate it using the package manager authority for that location.

## Automation

Policy enforcement is automated by:

- `scripts/validation/validate-package-manager-policy.ts`
- `npm run validate:package-manager-policy`
- PR CI integration in `.github/workflows/pr-checks.yml`
