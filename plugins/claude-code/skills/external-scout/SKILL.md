---
name: external-scout
description: Fetch external library and framework documentation. Use when you need current API patterns for npm packages, Python libraries, or other external dependencies. Invokes the external-scout subagent to fetch and cache documentation from Context7 and other sources.
context: fork
agent: external-scout
---

# External Scout Skill

> **Purpose**: Fetch current documentation for external libraries and frameworks. This skill invokes the `external-scout` subagent to retrieve and cache up-to-date API patterns from Context7 and other documentation sources.

---

## When to Use This Skill

Invoke `/external-scout` when you need to:

- **Verify current API patterns** for external packages before implementing
- **Check for breaking changes** in library versions
- **Get up-to-date examples** for framework features
- **Understand correct usage** of third-party libraries
- **Avoid outdated patterns** from training data

**Rule of thumb**: If you're using ANY external package (npm, pip, etc.), fetch current docs FIRST.

---

## Why This Matters

**Training data is outdated.** Libraries change their APIs, deprecate features, and introduce new patterns. Using ExternalScout ensures you're implementing with current, correct patterns.

**Examples of what can go wrong without current docs**:
- Using deprecated API methods that no longer exist
- Missing new features that simplify implementation
- Following old patterns that have been replaced
- Implementing workarounds for bugs that are already fixed

---

## How It Works

This skill runs in the `external-scout` subagent (isolated context) and:

1. **Checks cache** — Is this package/topic already cached and fresh (< 7 days)?
2. **Fetches if needed** — Calls Context7 API or other sources for current docs
3. **Caches results** — Saves to `.tmp/external-context/{package}/{topic}.md`
4. **Returns paths** — You load the cached documentation files

---

## Usage

### Basic Usage

```
/external-scout <package> <topic>
```

**Examples**:
```
/external-scout drizzle schemas
/external-scout react hooks
/external-scout express middleware
/external-scout zod validation
/external-scout prisma queries
```

### With Context

Provide additional context to focus the documentation search:

```
/external-scout drizzle schemas - Building user authentication with PostgreSQL
/external-scout react hooks - Building a form with validation
/external-scout express middleware - Adding JWT authentication
```

---

## What You'll Get Back

The external-scout subagent returns JSON with cached file paths:

### Success Response

```json
{
  "status": "success",
  "package": "drizzle",
  "topic": "schemas",
  "cached": true,
  "files": [
    ".tmp/external-context/drizzle/schemas.md"
  ],
  "metadata": {
    "cachedAt": "2026-02-16T10:30:00Z",
    "source": "context7",
    "age": "fresh"
  },
  "message": "Documentation cached successfully. Load files to access current API patterns."
}
```

### Cache Hit Response

```json
{
  "status": "cache_hit",
  "package": "react",
  "topic": "hooks",
  "cached": true,
  "files": [
    ".tmp/external-context/react/hooks.md"
  ],
  "metadata": {
    "cachedAt": "2026-02-14T15:00:00Z",
    "source": "context7",
    "age": "2 days"
  },
  "message": "Using cached documentation (2 days old). Load files to access API patterns."
}
```

---

## What to Do with Results

### Step 1: Load Cached Documentation

Read the files returned by ExternalScout:

```
Read: .tmp/external-context/drizzle/schemas.md
```

This file contains current API patterns, examples, and best practices.

### Step 2: Apply Patterns to Implementation

Use the loaded documentation to:
- **Verify API signatures** — Ensure you're calling methods correctly
- **Follow current patterns** — Use recommended approaches from docs
- **Check for deprecations** — Avoid deprecated features
- **Use new features** — Take advantage of recent improvements

### Step 3: Implement with Confidence

Now that you have current docs, implement following the verified patterns.

---

## Integration with OAC Workflow

This skill is part of the **6-stage OAC workflow**:

### Stage 1: Analyze & Discover
- **Action**: Invoke `/context-discovery` for internal context
- **Action**: Invoke `/external-scout` for external library docs

### Stage 2: Plan & Approve
- **Action**: Load discovered context files (internal + external)
- **Action**: Create implementation plan
- **Action**: REQUEST APPROVAL before proceeding

### Stage 3: LoadContext
- **Action**: Read all internal context files
- **Action**: Read all external documentation files
- **Action**: Understand standards, patterns, and current APIs

### Stage 4: Execute
- **Action**: Implement using loaded context and current API patterns
- **Action**: Follow both internal standards and external library patterns

### Stage 5: Validate
- **Action**: Run tests, verify implementation
- **Action**: STOP on failure

### Stage 6: Complete
- **Action**: Update docs, summarize changes

---

## Common Scenarios

### Scenario 1: Using Drizzle ORM

**You**: "I need to implement database schemas with Drizzle"

**Action**:
```
/external-scout drizzle schemas
```

**Result**: ExternalScout fetches current Drizzle schema API patterns

**Next Steps**:
1. Load `.tmp/external-context/drizzle/schemas.md`
2. Review current API for defining tables and relations
3. Implement schemas following current patterns
4. Avoid outdated patterns from training data

---

### Scenario 2: React Hooks

**You**: "I'm building a form with React hooks"

**Action**:
```
/external-scout react hooks - Building a form with validation
```

**Result**: ExternalScout fetches current React hooks documentation

**Next Steps**:
1. Load `.tmp/external-context/react/hooks.md`
2. Review current patterns for useState, useEffect, custom hooks
3. Implement form following current best practices
4. Use any new hooks introduced since training data

---

### Scenario 3: Express Middleware

**You**: "I need to add JWT authentication middleware to Express"

**Action**:
```
/external-scout express middleware - JWT authentication
```

**Result**: ExternalScout fetches current Express middleware patterns

**Next Steps**:
1. Load `.tmp/external-context/express/middleware.md`
2. Review current middleware API and patterns
3. Implement JWT middleware following current conventions
4. Avoid deprecated middleware patterns

---

## Cache Management

### Cache Freshness

- **Fresh**: < 7 days old (use cached version)
- **Stale**: > 7 days old (re-fetch from source)
- **Missing**: No cache exists (fetch from source)

### Cache Location

```
.tmp/external-context/
├── drizzle/
│   ├── .metadata.json
│   ├── schemas.md
│   └── queries.md
├── react/
│   ├── .metadata.json
│   └── hooks.md
└── express/
    ├── .metadata.json
    └── middleware.md
```

### Cache Cleanup

Cache files are managed by the cleanup script:
- External context older than 7 days is flagged for cleanup
- Run cleanup script to review and remove old cache

---

## Configuration

ExternalScout behavior can be configured via `.oac` config file:

```yaml
# External scout settings
external_scout.enabled: true
external_scout.cache_enabled: true
external_scout.sources: context7
```

**Settings**:
- `external_scout.enabled` - Enable/disable external documentation fetching
- `external_scout.cache_enabled` - Enable/disable caching (always fetch if false)
- `external_scout.sources` - Documentation sources to use (context7, web, etc.)

---

## What NOT to Do

- ❌ **Don't skip external docs** — Always fetch current patterns for external packages
- ❌ **Don't trust training data** — APIs change, training data is outdated
- ❌ **Don't use stale cache** — If cache is > 7 days old, it will be re-fetched
- ❌ **Don't implement before loading docs** — External docs first, code second
- ❌ **Don't assume API patterns** — Verify with current documentation

---

## Troubleshooting

### "External documentation fetch failed"

**Cause**: Context7 API unavailable or network issue

**Solution**: 
1. Check internet connection
2. Try again in a few minutes
3. Use fallback: Visit official documentation manually
4. Cache will be created on next successful fetch

### "Cache is stale, re-fetching"

**Cause**: Cached documentation is > 7 days old

**Solution**: This is normal behavior. ExternalScout will automatically fetch fresh docs.

### "Package not found in Context7"

**Cause**: Package may not be indexed in Context7 yet

**Solution**:
1. Visit official package documentation
2. Check npm/PyPI for package README
3. Review GitHub repository for API docs
4. Manually create cache file if needed

---

## Principles

- **Current docs matter** — Training data is outdated, always fetch current patterns
- **Cache for performance** — Fetch once, use many times (within 7 days)
- **Verify before implement** — Load external docs before writing code
- **Trust the source** — Official docs > training data assumptions
- **Fresh is better** — Re-fetch stale cache to get latest patterns

---

## Task

Fetch external documentation for: **$ARGUMENTS**

Check cache first, fetch if needed, and return file paths for loading.
