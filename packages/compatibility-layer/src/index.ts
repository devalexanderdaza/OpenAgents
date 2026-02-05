/**
 * @openagents-control/compatibility-layer
 * 
 * A TypeScript library for converting OpenAgents Control agent definitions
 * to and from other AI coding tool formats (Cursor, Claude, Windsurf, etc.).
 * 
 * @module @openagents-control/compatibility-layer
 * 
 * @example
 * ```typescript
 * import { loadAgent, registry, CursorAdapter } from '@openagents-control/compatibility-layer';
 * 
 * // Load an OAC agent
 * const agent = await loadAgent('.opencode/agent/opencoder.md');
 * 
 * // Convert to Cursor format
 * const cursorAdapter = registry.get('cursor');
 * const result = await cursorAdapter.fromOAC(agent);
 * ```
 */

// ============================================================================
// TYPES & SCHEMAS
// ============================================================================

/**
 * All Zod schemas and TypeScript types for OpenAgents Control.
 * 
 * Includes:
 * - OpenAgent, AgentFrontmatter, AgentMetadata
 * - ToolAccess, PermissionRule, GranularPermission
 * - ContextReference, DependencyReference
 * - ModelIdentifier, TemperatureSchema
 * - SkillReference, HookDefinition
 * - ToolCapabilities, ConversionResult
 */
export * from "./types";

// ============================================================================
// CORE - Agent Loading
// ============================================================================

/**
 * AgentLoader class and convenience functions for loading OAC agent files.
 * 
 * @example
 * ```typescript
 * import { loadAgent, loadAgents } from '@openagents-control/compatibility-layer';
 * 
 * // Load single agent
 * const agent = await loadAgent('.opencode/agent/opencoder.md');
 * 
 * // Load all agents from directory
 * const agents = await loadAgents('.opencode/agent/');
 * ```
 */
export {
  AgentLoader,
  loadAgent,
  loadAgents,
} from "./core/AgentLoader";

/**
 * Error classes from AgentLoader for handling load failures.
 * 
 * - AgentLoadError: Base error for agent loading
 * - FrontmatterParseError: YAML parsing errors
 * - ValidationError: Zod schema validation errors
 */
export {
  AgentLoadError,
  FrontmatterParseError,
  ValidationError,
} from "./core/AgentLoader";

// ============================================================================
// CORE - Adapter Registry
// ============================================================================

/**
 * AdapterRegistry for managing tool adapters.
 * 
 * @example
 * ```typescript
 * import { registry, getAdapter } from '@openagents-control/compatibility-layer';
 * 
 * // Get adapter from registry
 * const adapter = getAdapter('cursor');
 * 
 * // List all adapters
 * const names = registry.list();
 * ```
 */
export {
  AdapterRegistry,
  registry,
  getAdapter,
  listAdapters,
  getAllCapabilities,
} from "./core/AdapterRegistry";

/**
 * Error class for adapter registry operations.
 */
export { AdapterRegistryError } from "./core/AdapterRegistry";

/**
 * Type for adapter information including capabilities.
 */
export type { AdapterInfo } from "./core/AdapterRegistry";

// ============================================================================
// ADAPTERS - Base Class
// ============================================================================

/**
 * BaseAdapter abstract class for creating custom adapters.
 * 
 * @example
 * ```typescript
 * import { BaseAdapter } from '@openagents-control/compatibility-layer';
 * 
 * class MyAdapter extends BaseAdapter {
 *   readonly name = 'my-tool';
 *   readonly displayName = 'My Tool';
 *   
 *   async toOAC(source: string): Promise<OpenAgent> {
 *     // Implementation
 *   }
 *   
 *   async fromOAC(agent: OpenAgent): Promise<ConversionResult> {
 *     // Implementation
 *   }
 * }
 * ```
 */
export { BaseAdapter } from "./adapters/BaseAdapter";

// ============================================================================
// ADAPTERS - Built-in Implementations
// ============================================================================

/**
 * Built-in adapters for popular AI coding tools.
 * 
 * Note: These will be available in Phase 2.
 * For now, they need to be registered manually.
 * 
 * @example
 * ```typescript
 * // Available in Phase 2:
 * // import { CursorAdapter, ClaudeAdapter, WindsurfAdapter } from '@openagents-control/compatibility-layer';
 * ```
 */

// TODO: Uncomment when Phase 2 adapters are implemented
// export { CursorAdapter } from "./adapters/CursorAdapter";
// export { ClaudeAdapter } from "./adapters/ClaudeAdapter";
// export { WindsurfAdapter } from "./adapters/WindsurfAdapter";

// ============================================================================
// VERSION INFO
// ============================================================================

/**
 * Package version (injected at build time)
 */
export const VERSION = "0.1.0";
