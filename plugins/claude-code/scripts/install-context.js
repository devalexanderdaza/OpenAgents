#!/usr/bin/env node
/**
 * install-context.js
 * Simple context installer for OAC Claude Code Plugin
 * 
 * Downloads context files from OpenAgents Control repository
 * Supports profile-based installation (core, full, custom)
 */

const { execSync } = require('child_process');
const { existsSync, mkdirSync, readFileSync, writeFileSync, rmSync } = require('fs');
const { join } = require('path');

// Configuration
const GITHUB_REPO = 'darrenhinde/OpenAgentsControl';
const GITHUB_BRANCH = 'main';
const CONTEXT_SOURCE_PATH = '.opencode/context';
const PLUGIN_ROOT = process.env.CLAUDE_PLUGIN_ROOT || process.cwd();
const CONTEXT_DIR = join(PLUGIN_ROOT, 'context');
const MANIFEST_FILE = join(PLUGIN_ROOT, '.context-manifest.json');

// Installation profiles
const PROFILES = {
  core: {
    name: 'Core',
    description: 'Essential standards and workflows',
    categories: ['core', 'openagents-repo']
  },
  full: {
    name: 'Full',
    description: 'All available context',
    categories: [
      'core',
      'openagents-repo',
      'development',
      'ui',
      'content-creation',
      'data',
      'product',
      'learning',
      'project',
      'project-intelligence'
    ]
  }
};

// Colors for output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

// Logging helpers
const log = {
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  error: (msg) => console.error(`${colors.red}✗${colors.reset} ${msg}`),
};

/**
 * Check if required commands are available
 */
function checkDependencies() {
  const required = ['git'];
  const missing = [];

  for (const cmd of required) {
    try {
      execSync(`command -v ${cmd}`, { stdio: 'ignore' });
    } catch {
      missing.push(cmd);
    }
  }

  if (missing.length > 0) {
    log.error(`Missing required dependencies: ${missing.join(', ')}`);
    log.info('Install with: brew install ' + missing.join(' '));
    process.exit(1);
  }
}

/**
 * Download context using git sparse-checkout
 */
function downloadContext(categories) {
  const tempDir = join(PLUGIN_ROOT, '.tmp-context-download');

  try {
    log.info(`Downloading context from ${GITHUB_REPO}...`);
    log.info(`Categories: ${categories.join(', ')}`);

    // Clean up temp directory if it exists
    if (existsSync(tempDir)) {
      rmSync(tempDir, { recursive: true, force: true });
    }

    // Clone with sparse checkout (no working tree files)
    log.info('Cloning repository...');
    execSync(
      `git clone --depth 1 --filter=blob:none --sparse https://github.com/${GITHUB_REPO}.git "${tempDir}"`,
      { stdio: 'pipe' }
    );

    // Configure sparse checkout for requested categories
    log.info('Configuring sparse checkout...');
    const sparseCheckoutPaths = categories.map(cat => `${CONTEXT_SOURCE_PATH}/${cat}`);
    
    // Also include root navigation
    sparseCheckoutPaths.push(`${CONTEXT_SOURCE_PATH}/navigation.md`);

    execSync(
      `cd "${tempDir}" && git sparse-checkout set ${sparseCheckoutPaths.join(' ')}`,
      { stdio: 'pipe' }
    );

    // Create context directory if it doesn't exist
    if (!existsSync(CONTEXT_DIR)) {
      mkdirSync(CONTEXT_DIR, { recursive: true });
    }

    // Copy files to context directory
    log.info('Copying context files...');
    const sourceContextDir = join(tempDir, CONTEXT_SOURCE_PATH);
    
    if (existsSync(sourceContextDir)) {
      execSync(`cp -r "${sourceContextDir}"/* "${CONTEXT_DIR}"/`, { stdio: 'pipe' });
      log.success('Context files downloaded successfully');
    } else {
      throw new Error('Context directory not found in repository');
    }

    // Count downloaded files
    const fileCount = execSync(`find "${CONTEXT_DIR}" -type f | wc -l`, { encoding: 'utf-8' }).trim();
    log.success(`Downloaded ${fileCount} files`);

    // Clean up temp directory
    rmSync(tempDir, { recursive: true, force: true });

  } catch (error) {
    log.error('Failed to download context');
    if (error instanceof Error) {
      log.error(error.message);
    }
    
    // Clean up on error
    if (existsSync(tempDir)) {
      rmSync(tempDir, { recursive: true, force: true });
    }
    
    process.exit(1);
  }
}

/**
 * Create manifest file tracking installation
 */
function createManifest(profile, categories) {
  try {
    // Get commit SHA
    const tempDir = join(PLUGIN_ROOT, '.tmp-manifest-check');
    
    if (existsSync(tempDir)) {
      rmSync(tempDir, { recursive: true, force: true });
    }

    execSync(
      `git clone --depth 1 https://github.com/${GITHUB_REPO}.git "${tempDir}"`,
      { stdio: 'pipe' }
    );

    const commitSha = execSync(`cd "${tempDir}" && git rev-parse HEAD`, { encoding: 'utf-8' }).trim();
    
    rmSync(tempDir, { recursive: true, force: true });

    // Count files per category
    const files = {};
    for (const category of categories) {
      const categoryPath = join(CONTEXT_DIR, category);
      if (existsSync(categoryPath)) {
        const count = parseInt(
          execSync(`find "${categoryPath}" -type f | wc -l`, { encoding: 'utf-8' }).trim(),
          10
        );
        files[category] = count;
      }
    }

    // Create manifest
    const manifest = {
      version: '1.0.0',
      profile,
      source: {
        repository: GITHUB_REPO,
        branch: GITHUB_BRANCH,
        commit: commitSha,
        downloaded_at: new Date().toISOString(),
      },
      categories,
      files,
    };

    writeFileSync(MANIFEST_FILE, JSON.stringify(manifest, null, 2));
    log.success(`Created manifest: ${MANIFEST_FILE}`);

  } catch (error) {
    log.warning('Failed to create manifest (non-fatal)');
  }
}

/**
 * Show usage information
 */
function showUsage() {
  console.log(`
Usage: node install-context.js [PROFILE] [OPTIONS]

PROFILES:
  core              Download core context only (default)
                    Categories: core, openagents-repo
  
  full              Download all available context
                    Categories: all domains

  custom            Specify custom categories
                    Use with --category flags

OPTIONS:
  --category=NAME   Add specific category (use with 'custom' profile)
  --force           Force re-download even if context exists
  --help            Show this help message

EXAMPLES:
  # Install core context (default)
  node install-context.js

  # Install full context
  node install-context.js full

  # Install custom categories
  node install-context.js custom --category=core --category=development

  # Force reinstall
  node install-context.js core --force
`);
}

/**
 * Main installation function
 */
function main() {
  const args = process.argv.slice(2);

  // Parse arguments
  let profile = 'core';
  let customCategories = [];
  let force = false;

  for (const arg of args) {
    if (arg === '--help' || arg === '-h') {
      showUsage();
      process.exit(0);
    } else if (arg === '--force') {
      force = true;
    } else if (arg.startsWith('--category=')) {
      customCategories.push(arg.split('=')[1]);
    } else if (arg === 'core' || arg === 'full' || arg === 'custom') {
      profile = arg;
    } else {
      log.error(`Unknown argument: ${arg}`);
      showUsage();
      process.exit(1);
    }
  }

  // Determine categories to install
  let categories;
  if (profile === 'custom') {
    if (customCategories.length === 0) {
      log.error('Custom profile requires --category flags');
      showUsage();
      process.exit(1);
    }
    categories = customCategories;
  } else {
    categories = PROFILES[profile].categories;
  }

  // Check if context already exists
  if (existsSync(MANIFEST_FILE) && !force) {
    log.warning('Context already installed. Use --force to reinstall.');
    log.info('Current installation:');
    try {
      const manifest = JSON.parse(readFileSync(MANIFEST_FILE, 'utf-8'));
      console.log(JSON.stringify(manifest, null, 2));
    } catch {
      log.error('Failed to read manifest');
    }
    process.exit(0);
  }

  // Check dependencies
  checkDependencies();

  // Download context
  console.log('');
  log.info(`Installing ${profile} profile`);
  log.info(`Repository: ${GITHUB_REPO}`);
  log.info(`Branch: ${GITHUB_BRANCH}`);
  console.log('');

  downloadContext(categories);

  // Create manifest
  createManifest(profile, categories);

  console.log('');
  log.success('Context installation complete!');
  log.info(`Context location: ${CONTEXT_DIR}`);
  log.info(`Manifest: ${MANIFEST_FILE}`);
  console.log('');
}

// Run main function
main();
