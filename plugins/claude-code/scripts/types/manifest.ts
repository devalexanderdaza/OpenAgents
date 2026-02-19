/**
 * Manifest Type Definitions
 * Schema for .context-manifest.json
 */

import { z } from 'zod'
import type { Profile } from './registry'

// Manifest component schema
export const ManifestComponentSchema = z.object({
  id: z.string(),
  name: z.string(),
  path: z.string(),
  local_path: z.string(),
  category: z.string(),
})

export type ManifestComponent = z.infer<typeof ManifestComponentSchema>

// Manifest schema
export const ManifestSchema = z.object({
  version: z.string(),
  profile: z.union([
    z.literal('essential'),
    z.literal('standard'),
    z.literal('extended'),
    z.literal('specialized'),
    z.literal('all'),
    z.literal('custom'),
  ]),
  source: z.object({
    repository: z.string(),
    branch: z.string(),
    commit: z.string(),
    downloaded_at: z.string(),
  }),
  context: z.array(ManifestComponentSchema),
})

export type Manifest = z.infer<typeof ManifestSchema>

// Manifest creation options
export interface CreateManifestOptions {
  profile: Profile | 'custom'
  repository: string
  branch: string
  commit: string
  components: ManifestComponent[]
}
