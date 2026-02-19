#!/usr/bin/env bun
/**
 * install-context.ts
 * TypeScript context installer for OAC Claude Code Plugin
 * 
 * Downloads context files from OpenAgents Control repository using git sparse-checkout
 * Supports profile-based installation (essential, standard, extended, specialized, all)
 */

import { existsSync, writeFileSync, readFileSync } from 'fs'
import { join } from 'path'
import type { InstallOptions, InstallResult, Profile } from './types/registry'
import type { Manifest, ManifestComponent } from './types/manifest'
import { fetchRegistry, filterContextByProfile, filterContextByIds, getUniquePaths } from './utils/registry-fetcher'
import { sparseClone, copyFiles, cleanup, checkGitAvailable } from './utils/git-sparse'

// Configuration
const GITHUB_REPO = 'darrenhinde/OpenAgentsControl'
const GITHUB_BRANCH = 'main'
const CONTEXT_SOURCE_PATH = '.opencode/context'
const PLUGIN_ROOT = process.env.CLAUDE_PLUGIN_ROOT || process.cwd()
const CONTEXT_DIR = join(PLUGIN_ROOT, 'context')
const MANIFEST_FILE = join(PLUGIN_ROOT, '.context-manifest.json')

// Colors for output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
}

// Logging helpers
const log = {
  info: (msg: string) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg: string) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  warning: (msg: string) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  error: (msg: string) => console.error(`${colors.red}✗${colors.reset} ${msg}`),
  header: (msg: string) => console.log(`\n${colors.bold}${colors.cyan}${msg}${colors.reset}\n`),
}

/**
 * Main installation function
 */
export async function installContext(options: InstallOptions = {}): Promise<InstallResult> {
  const {
    profile = 'essential',
    customComponents = [],
    dryRun = false,
    force = false,
    verbose = false,
  } = options

  try {
    // Check dependencies
    if (!checkGitAvailable()) {
      throw new Error('Git is not available. Please install git.')
    }

    // Check if already installed
    if (existsSync(MANIFEST_FILE) && !force) {
      log.warning('Context already installed. Use --force to reinstall.')
      const manifest = JSON.parse(readFileSync(MANIFEST_FILE, 'utf-8')) as Manifest
      return {
        success: true,
        manifest: convertManifestToInstallManifest(manifest),
      }
    }

    log.header('Context Installer')
    log.info(`Profile: ${profile}`)
    log.info(`Repository: ${GITHUB_REPO}`)
    log.info(`Branch: ${GITHUB_BRANCH}`)
    log.info(`Dry run: ${dryRun}`)
    console.log('')

    // Fetch registry
    log.info('Fetching registry from GitHub...')
    const registry = await fetchRegistry({
      source: 'github',
      repository: GITHUB_REPO,
      branch: GITHUB_BRANCH,
    })
    log.success(`Registry version: ${registry.version}`)
    log.success(`Context components available: ${registry.components.contexts?.length || 0}`)
    console.log('')

    // Filter components by profile or custom IDs
    let components
    if (customComponents.length > 0) {
      log.info('Filtering by custom component IDs...')
      components = filterContextByIds(registry, customComponents)
    } else {
      log.info(`Filtering by profile: ${profile}`)
      components = filterContextByProfile(registry, profile)
    }

    log.success(`Selected ${components.length} components`)
    
    if (verbose) {
      console.log('')
      log.info('Components to install:')
      for (const component of components) {
        console.log(`  - ${component.id}: ${component.path}`)
      }
    }
    console.log('')

    if (dryRun) {
      log.info('Dry run mode - no files will be downloaded')
      return {
        success: true,
        manifest: {
          version: '1.0.0',
          profile: customComponents.length > 0 ? 'custom' : profile,
          source: {
            repository: GITHUB_REPO,
            branch: GITHUB_BRANCH,
            commit: 'dry-run',
            downloaded_at: new Date().toISOString(),
          },
          context: components.map((c) => ({
            id: c.id,
            name: c.name,
            path: c.path,
            local_path: join(CONTEXT_DIR, c.path.replace(`${CONTEXT_SOURCE_PATH}/`, '')),
            category: c.category,
          })),
        },
      }
    }

    // Get unique directory paths for sparse checkout
    const sparsePaths = getUniquePaths(components)
    
    if (verbose) {
      log.info('Sparse checkout paths:')
      for (const path of sparsePaths) {
        console.log(`  - ${path}`)
      }
      console.log('')
    }

    // Download using git sparse-checkout
    log.info('Downloading context files...')
    const tempDir = join(PLUGIN_ROOT, '.tmp-context-download')
    
    const cloneResult = await sparseClone({
      repository: GITHUB_REPO,
      branch: GITHUB_BRANCH,
      paths: sparsePaths,
      targetDir: tempDir,
      verbose,
    })

    if (!cloneResult.success) {
      throw new Error(`Git sparse clone failed: ${cloneResult.error}`)
    }

    log.success('Files downloaded successfully')
    console.log('')

    // Copy files to context directory
    log.info('Copying files to context directory...')
    const sourceContextDir = join(tempDir, CONTEXT_SOURCE_PATH)
    copyFiles(sourceContextDir, CONTEXT_DIR, verbose)
    log.success(`Files copied to: ${CONTEXT_DIR}`)
    console.log('')

    // Create manifest
    log.info('Creating manifest...')
    const manifestComponents: ManifestComponent[] = components.map((c) => ({
      id: c.id,
      name: c.name,
      path: c.path,
      local_path: join(CONTEXT_DIR, c.path.replace(`${CONTEXT_SOURCE_PATH}/`, '')),
      category: c.category,
    }))

    const manifest: Manifest = {
      version: '1.0.0',
      profile: customComponents.length > 0 ? 'custom' : profile,
      source: {
        repository: GITHUB_REPO,
        branch: GITHUB_BRANCH,
        commit: cloneResult.commit,
        downloaded_at: new Date().toISOString(),
      },
      context: manifestComponents,
    }

    writeFileSync(MANIFEST_FILE, JSON.stringify(manifest, null, 2))
    log.success(`Manifest created: ${MANIFEST_FILE}`)
    console.log('')

    // Clean up temp directory
    cleanup(tempDir, verbose)

    // Verify installation
    log.info('Verifying installation...')
    let filesExist = 0
    let filesMissing = 0

    for (const component of manifestComponents) {
      if (existsSync(component.local_path)) {
        filesExist++
        if (verbose) {
          log.success(`${component.id}: EXISTS`)
        }
      } else {
        filesMissing++
        log.error(`${component.id}: MISSING`)
      }
    }

    console.log('')
    log.success(`Installation complete!`)
    log.info(`Files verified: ${filesExist}/${manifestComponents.length}`)
    
    if (filesMissing > 0) {
      log.warning(`Missing files: ${filesMissing}`)
    }

    return {
      success: true,
      manifest: convertManifestToInstallManifest(manifest),
    }
  } catch (error) {
    log.error('Installation failed')
    log.error(error instanceof Error ? error.message : String(error))
    
    return {
      success: false,
      manifest: {
        version: '1.0.0',
        profile: 'essential',
        source: {
          repository: GITHUB_REPO,
          branch: GITHUB_BRANCH,
          commit: '',
          downloaded_at: new Date().toISOString(),
        },
        context: [],
      },
      errors: [error instanceof Error ? error.message : String(error)],
    }
  }
}

/**
 * Convert Manifest to InstallManifest format
 */
function convertManifestToInstallManifest(manifest: Manifest): InstallResult['manifest'] {
  return manifest as InstallResult['manifest']
}

/**
 * Show usage information
 */
function showUsage(): void {
  console.log(`
${colors.bold}Usage:${colors.reset} bun run install-context.ts [OPTIONS]

${colors.bold}OPTIONS:${colors.reset}
  --profile=PROFILE       Installation profile (default: essential)
                          Options: essential, standard, extended, specialized, all
  
  --component=ID          Install specific component by ID (can be used multiple times)
                          Example: --component=core-standards --component=openagents-repo
  
  --dry-run               Show what would be installed without downloading
  --force                 Force reinstall even if context exists
  --verbose               Show detailed output
  --help                  Show this help message

${colors.bold}PROFILES:${colors.reset}
  essential               Minimal components for basic functionality
  standard                Standard components for typical use
  extended                Extended components for advanced features
  specialized             Specialized components for specific domains
  all                     All available context

${colors.bold}EXAMPLES:${colors.reset}
  # Install essential profile (default)
  bun run install-context.ts

  # Install standard profile
  bun run install-context.ts --profile=standard

  # Install specific components
  bun run install-context.ts --component=core-standards --component=openagents-repo

  # Dry run to see what would be installed
  bun run install-context.ts --profile=extended --dry-run

  # Force reinstall
  bun run install-context.ts --force --verbose
`)
}

/**
 * CLI entry point
 */
async function main(): Promise<void> {
  const args = process.argv.slice(2)

  // Parse arguments
  let profile: Profile = 'essential'
  const customComponents: string[] = []
  let dryRun = false
  let force = false
  let verbose = false

  for (const arg of args) {
    if (arg === '--help' || arg === '-h') {
      showUsage()
      process.exit(0)
    } else if (arg === '--dry-run') {
      dryRun = true
    } else if (arg === '--force') {
      force = true
    } else if (arg === '--verbose' || arg === '-v') {
      verbose = true
    } else if (arg.startsWith('--profile=')) {
      profile = arg.split('=')[1] as Profile
    } else if (arg.startsWith('--component=')) {
      customComponents.push(arg.split('=')[1])
    } else {
      log.error(`Unknown argument: ${arg}`)
      showUsage()
      process.exit(1)
    }
  }

  // Run installation
  const result = await installContext({
    profile,
    customComponents,
    dryRun,
    force,
    verbose,
  })

  if (!result.success) {
    process.exit(1)
  }
}

// Run main function
main().catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
})
