/**
 * Git Sparse Checkout Utilities
 * Handles git sparse-checkout operations for downloading specific paths
 */

import { execSync } from 'child_process'
import { existsSync, rmSync, mkdirSync } from 'fs'
import { join } from 'path'

export interface GitSparseOptions {
  repository: string
  branch: string
  paths: string[]
  targetDir: string
  verbose?: boolean
}

export interface GitSparseResult {
  success: boolean
  commit: string
  error?: string
}

/**
 * Clone repository with sparse checkout
 */
export async function sparseClone(
  options: GitSparseOptions
): Promise<GitSparseResult> {
  const { repository, branch, paths, targetDir, verbose } = options

  try {
    // Clean up target directory if it exists
    if (existsSync(targetDir)) {
      rmSync(targetDir, { recursive: true, force: true })
    }

    // Create parent directory
    const parentDir = join(targetDir, '..')
    if (!existsSync(parentDir)) {
      mkdirSync(parentDir, { recursive: true })
    }

    // Clone with sparse checkout (no working tree files)
    if (verbose) {
      console.log(`Cloning ${repository}...`)
    }

    execSync(
      `git clone --depth 1 --filter=blob:none --sparse --branch ${branch} https://github.com/${repository}.git "${targetDir}"`,
      { stdio: verbose ? 'inherit' : 'pipe' }
    )

    // Configure sparse checkout for requested paths
    if (verbose) {
      console.log('Configuring sparse checkout...')
    }

    const sparseCheckoutPaths = paths.join(' ')
    execSync(`cd "${targetDir}" && git sparse-checkout set ${sparseCheckoutPaths}`, {
      stdio: verbose ? 'inherit' : 'pipe',
    })

    // Get commit SHA
    const commit = execSync(`cd "${targetDir}" && git rev-parse HEAD`, {
      encoding: 'utf-8',
    }).trim()

    if (verbose) {
      console.log(`Downloaded commit: ${commit}`)
    }

    return {
      success: true,
      commit,
    }
  } catch (error) {
    return {
      success: false,
      commit: '',
      error: error instanceof Error ? error.message : String(error),
    }
  }
}

/**
 * Copy files from sparse checkout to target location
 */
export function copyFiles(
  sourceDir: string,
  targetDir: string,
  verbose?: boolean
): void {
  if (!existsSync(sourceDir)) {
    throw new Error(`Source directory not found: ${sourceDir}`)
  }

  // Create target directory if it doesn't exist
  if (!existsSync(targetDir)) {
    mkdirSync(targetDir, { recursive: true })
  }

  // Copy files
  if (verbose) {
    console.log(`Copying files from ${sourceDir} to ${targetDir}...`)
  }

  execSync(`cp -r "${sourceDir}"/* "${targetDir}"/`, {
    stdio: verbose ? 'inherit' : 'pipe',
  })
}

/**
 * Clean up temporary directory
 */
export function cleanup(dir: string, verbose?: boolean): void {
  if (existsSync(dir)) {
    if (verbose) {
      console.log(`Cleaning up ${dir}...`)
    }
    rmSync(dir, { recursive: true, force: true })
  }
}

/**
 * Check if git is available
 */
export function checkGitAvailable(): boolean {
  try {
    execSync('command -v git', { stdio: 'ignore' })
    return true
  } catch {
    return false
  }
}
