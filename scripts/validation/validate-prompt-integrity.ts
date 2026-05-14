#!/usr/bin/env bun

/**
 * Prompt Integrity Validator
 * Validates agent/subagent prompt files for structural integrity
 * 
 * Detection scope:
 * - Extra YAML delimiters (--- beyond first block)
 * - Invalid/duplicate frontmatter keys
 * - Duplicated sections (same heading multiple times)
 * - Orphan/partial blocks (incomplete sections)
 * - Invalid OpenCode fields in frontmatter
 * 
 * Exit codes:
 *   0 = All files valid
 *   1 = Validation errors found
 *   2 = Fatal error (missing dependencies, parse error)
 */

import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { globSync } from 'glob'

// Colors
const colors = {
  red: '\x1b[0;31m',
  green: '\x1b[0;32m',
  yellow: '\x1b[1;33m',
  cyan: '\x1b[0;36m',
  bold: '\x1b[1m',
  reset: '\x1b[0m',
}

// Configuration
const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const VALID_FRONTMATTER_KEYS = new Set([
  'name',
  'description',
  'mode',
  'temperature',
  'model',
  'maxSteps',
  'disable',
  'hidden',
  'prompt',
  'tools',
  'permission',
  'skills',
])

// Types
type ValidationError = {
  file: string
  line: number
  type: 'delimiter' | 'frontmatter_key' | 'duplicate_key' | 'duplicate_section' | 'orphan_block'
  message: string
  hint?: string
}

type FrontmatterResult = {
  valid: boolean
  keys: string[]
  duplicates: string[]
  invalidKeys: string[]
  endLine: number
}

// CLI flags
let VERBOSE = false

// Counters
let TOTAL_FILES = 0
let VALID_FILES = 0
let INVALID_FILES = 0

// Errors array
const ERRORS: ValidationError[] = []

// Utility Functions
function printHeader(): void {
  console.log(`${colors.cyan}${colors.bold}`)
  console.log('╔════════════════════════════════════════════════════════════════╗')
  console.log('║                                                                ║')
  console.log('║          Prompt Integrity Validator v1.0.0                    ║')
  console.log('║                                                                ║')
  console.log('╚════════════════════════════════════════════════════════════════╝')
  console.log(`${colors.reset}`)
}

function printSuccess(msg: string): void {
  console.log(`${colors.green}✓${colors.reset} ${msg}`)
}

function printError(msg: string): void {
  console.log(`${colors.red}✗${colors.reset} ${msg}`)
}

function printWarning(msg: string): void {
  console.log(`${colors.yellow}⚠${colors.reset} ${msg}`)
}

function printInfo(msg: string): void {
  console.log(`${colors.cyan}ℹ${colors.reset} ${msg}`)
}

function usage(): void {
  console.log('Usage: bun run scripts/validation/validate-prompt-integrity.ts [OPTIONS] [FILE_OR_GLOB ...]')
  console.log('')
  console.log('Options:')
  console.log('  -v, --verbose       Show detailed validation output')
  console.log('  -h, --help          Show this help message')
  console.log('')
  console.log('Arguments:')
  console.log('  FILE_OR_GLOB        Optional file path(s) or glob pattern(s)')
  console.log('                      Examples:')
  console.log('                        .opencode/agent/subagents/core/externalscout.md')
  console.log('                        .opencode/agent/subagents/**/*.md')
  console.log('')
  console.log('Exit codes:')
  console.log('  0 = All files valid')
  console.log('  1 = Validation errors found')
  console.log('  2 = Fatal error')
  process.exit(0)
}

// Validation Functions
function parseFrontmatter(content: string, filePath: string): FrontmatterResult {
  const lines = content.split('\n')
  const result: FrontmatterResult = {
    valid: true,
    keys: [],
    duplicates: [],
    invalidKeys: [],
    endLine: 0,
  }

  // Check if file starts with ---
  if (lines[0].trim() !== '---') {
    result.valid = false
    return result
  }

  // Find the closing ---
  let endIndex = -1
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim() === '---') {
      endIndex = i
      break
    }
  }

  if (endIndex === -1) {
    result.valid = false
    return result
  }

  result.endLine = endIndex + 1

  // Parse frontmatter keys
  const keyCount = new Map<string, number>()
  
  for (let i = 1; i < endIndex; i++) {
    const line = lines[i]
    const match = line.match(/^([a-zA-Z_][a-zA-Z0-9_]*)\s*:/)
    if (match) {
      const key = match[1]
      keyCount.set(key, (keyCount.get(key) || 0) + 1)
      if (!result.keys.includes(key)) {
        result.keys.push(key)
      }
    }
  }

  // Check for duplicates and invalid keys
  for (const [key, count] of keyCount.entries()) {
    if (count > 1) {
      result.duplicates.push(key)
      result.valid = false
    }
    if (!VALID_FRONTMATTER_KEYS.has(key)) {
      result.invalidKeys.push(key)
      result.valid = false
    }
  }

  return result
}

function countDelimiters(content: string): { count: number; positions: number[] } {
  const lines = content.split('\n')
  const positions: number[] = []
  let inFence = false
  
  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim()

    if (trimmed.startsWith('```')) {
      inFence = !inFence
      continue
    }

    if (!inFence && trimmed === '---') {
      positions.push(i + 1) // 1-indexed line number
    }
  }
  
  return { count: positions.length, positions }
}

function findDuplicateSections(content: string): Array<{ heading: string; lines: number[] }> {
  const lines = content.split('\n')
  const sectionMap = new Map<string, number[]>()
  let inFence = false
  
  // Match markdown headings (##, ###, etc.)
  const headingRegex = /^(#{1,6})\s+(.+)$/
  
  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim()

    if (trimmed.startsWith('```')) {
      inFence = !inFence
      continue
    }

    if (inFence) continue

    const match = lines[i].match(headingRegex)
    if (match) {
      const heading = match[2].trim().toLowerCase()
      if (!sectionMap.has(heading)) {
        sectionMap.set(heading, [])
      }
      sectionMap.get(heading)!.push(i + 1) // 1-indexed
    }
  }
  
  const duplicates: Array<{ heading: string; lines: number[] }> = []
  for (const [heading, lineNumbers] of sectionMap.entries()) {
    if (lineNumbers.length > 1) {
      duplicates.push({ heading, lines: lineNumbers })
    }
  }
  
  return duplicates
}

function findOrphanBlocks(content: string): Array<{ line: number; type: string; description: string }> {
  const lines = content.split('\n')
  const orphans: Array<{ line: number; type: string; description: string }> = []
  
  // Pattern 1: "OpenCode Agent Configuration" comments appearing mid-file (after frontmatter)
  const configCommentRegex = /^#\s*OpenCode Agent Configuration\s*$/i
  let inFrontmatter = false
  let frontmatterEnded = false
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    
    if (line === '---') {
      if (!inFrontmatter) {
        inFrontmatter = true
      } else if (!frontmatterEnded) {
        frontmatterEnded = true
        inFrontmatter = false
      }
      continue
    }
    
    // Check for orphan configuration comments after frontmatter
    if (frontmatterEnded && configCommentRegex.test(lines[i])) {
      orphans.push({
        line: i + 1,
        type: 'orphan_comment',
        description: 'Orphan "OpenCode Agent Configuration" comment (should only appear once at top or be removed)',
      })
    }
  }
  
  // Pattern 2: Unclosed XML-like tags
  const openTags = new Map<string, number>()
  const closeTags = new Map<string, number>()
  const tagRegex = /<\/?([a-zA-Z_][a-zA-Z0-9_-]*)\s*[^>]*>/g
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    let match
    
    while ((match = tagRegex.exec(line)) !== null) {
      const tagName = match[1].toLowerCase()
      const isClosing = match[0].startsWith('</')
      
      if (isClosing) {
        closeTags.set(tagName, (closeTags.get(tagName) || 0) + 1)
      } else {
        // Check if it's a self-closing tag
        if (!match[0].endsWith('/>')) {
          openTags.set(tagName, (openTags.get(tagName) || 0) + 1)
        }
      }
    }
  }
  
  // Find unclosed tags
  for (const [tagName, openCount] of openTags.entries()) {
    const closeCount = closeTags.get(tagName) || 0
    if (openCount > closeCount) {
      orphans.push({
        line: 0, // We don't know exact line without more complex tracking
        type: 'unclosed_tag',
        description: `Unclosed tag: <${tagName}> (opened ${openCount} times, closed ${closeCount} times)`,
      })
    }
  }
  
  // Pattern 3: Incomplete workflow sections (stage without proper structure)
  const stageStartRegex = /<stage\s+id=["'](\d+)["']/gi
  const stageEndRegex = /<\/stage>/gi
  let stageStarts = 0
  let stageEnds = 0
  let match
  
  while ((match = stageStartRegex.exec(content)) !== null) {
    stageStarts++
  }
  while ((match = stageEndRegex.exec(content)) !== null) {
    stageEnds++
  }
  
  if (stageStarts > 0 && stageStarts !== stageEnds) {
    orphans.push({
      line: 0,
      type: 'incomplete_workflow',
      description: `Incomplete workflow: ${stageStarts} <stage> tags but only ${stageEnds} </stage> tags`,
    })
  }
  
  return orphans
}

function validateFile(filePath: string): ValidationError[] {
  const errors: ValidationError[] = []
  const relPath = filePath.replace(`${REPO_ROOT}/`, '')
  
  let content: string
  try {
    content = readFileSync(filePath, 'utf-8')
  } catch (error) {
    errors.push({
      file: relPath,
      line: 0,
      type: 'orphan_block',
      message: `Cannot read file: ${error}`,
    })
    return errors
  }
  
  // Check 1: Count delimiters (should be exactly 2 for one frontmatter block)
  const delimiterInfo = countDelimiters(content)
  if (delimiterInfo.count < 2) {
    errors.push({
      file: relPath,
      line: 1,
      type: 'delimiter',
      message: 'Missing frontmatter closing delimiter (---)',
      hint: 'Frontmatter must be enclosed in --- at start and --- at end',
    })
  } else if (delimiterInfo.count > 2) {
    // Report extra delimiters with line numbers
    for (let i = 2; i < delimiterInfo.positions.length; i++) {
      errors.push({
        file: relPath,
        line: delimiterInfo.positions[i],
        type: 'delimiter',
        message: `Extra YAML delimiter found (only one frontmatter block allowed)`,
        hint: `Remove this --- delimiter at line ${delimiterInfo.positions[i]}`,
      })
    }
  }
  
  // Check 2: Parse frontmatter
  const frontmatter = parseFrontmatter(content, filePath)
  
  if (!frontmatter.valid && frontmatter.keys.length === 0) {
    errors.push({
      file: relPath,
      line: 1,
      type: 'frontmatter_key',
      message: 'Invalid or missing frontmatter',
      hint: 'File must start with valid YAML frontmatter',
    })
  } else {
    // Check for duplicate keys
    for (const dupKey of frontmatter.duplicates) {
      errors.push({
        file: relPath,
        line: 1,
        type: 'duplicate_key',
        message: `Duplicate frontmatter key: "${dupKey}"`,
        hint: `Remove duplicate "${dupKey}" - each key should appear only once`,
      })
    }
    
    // Check for invalid keys
    for (const invalidKey of frontmatter.invalidKeys) {
      errors.push({
        file: relPath,
        line: 1,
        type: 'frontmatter_key',
        message: `Invalid frontmatter key: "${invalidKey}"`,
        hint: `Valid keys: ${Array.from(VALID_FRONTMATTER_KEYS).join(', ')}`,
      })
    }
  }
  
  // Check 3: Find duplicate sections
  const duplicateSections = findDuplicateSections(content)
  for (const dup of duplicateSections) {
    errors.push({
      file: relPath,
      line: dup.lines[0],
      type: 'duplicate_section',
      message: `Duplicate section heading: "## ${dup.heading}"`,
      hint: `Found at lines: ${dup.lines.join(', ')} - merge or rename sections`,
    })
  }
  
  // Check 4: Find orphan blocks
  const orphanBlocks = findOrphanBlocks(content)
  for (const orphan of orphanBlocks) {
    errors.push({
      file: relPath,
      line: orphan.line || 1,
      type: 'orphan_block',
      message: orphan.description,
    })
  }
  
  return errors
}

function discoverFiles(patterns?: string[]): string[] {
  if (patterns && patterns.length > 0) {
    const discovered = new Set<string>()

    for (const pattern of patterns) {
      if (!pattern) continue

      // Treat plain file path as exact target when it exists
      const exactPath = join(REPO_ROOT, pattern)
      if (existsSync(exactPath)) {
        discovered.add(exactPath)
        continue
      }

      // Otherwise treat as glob pattern
      const globPattern = join(REPO_ROOT, pattern)
      const matches = globSync(globPattern, { nodir: true })
      for (const match of matches) {
        discovered.add(match)
      }
    }

    return Array.from(discovered)
  }
  
  // Default: scan agents/subagents only (issue #5 scope)
  const targetDirs = [
    '.opencode/agent/**/*.md',
  ]
  
  const files: string[] = []
  for (const dirPattern of targetDirs) {
    const globPattern = join(REPO_ROOT, dirPattern)
    const matches = globSync(globPattern, { nodir: true })
    files.push(...matches)
  }
  
  return files
}

function printSummary(): boolean {
  console.log('')
  console.log(`${colors.bold}═══════════════════════════════════════════════════════════════${colors.reset}`)
  console.log(`${colors.bold}Validation Summary${colors.reset}`)
  console.log(`${colors.bold}═══════════════════════════════════════════════════════════════${colors.reset}`)
  console.log('')
  console.log(`Total files checked:    ${colors.cyan}${TOTAL_FILES}${colors.reset}`)
  console.log(`Valid files:            ${colors.green}${VALID_FILES}${colors.reset}`)
  console.log(`Invalid files:          ${colors.red}${INVALID_FILES}${colors.reset}`)
  console.log(`Total errors:           ${colors.red}${ERRORS.length}${colors.reset}`)
  console.log('')
  
  if (ERRORS.length > 0) {
    printError(`Found ${ERRORS.length} validation error(s)`)
    console.log('')
    
    // Group errors by file
    const errorsByFile = new Map<string, ValidationError[]>()
    for (const error of ERRORS) {
      if (!errorsByFile.has(error.file)) {
        errorsByFile.set(error.file, [])
      }
      errorsByFile.get(error.file)!.push(error)
    }
    
    for (const [file, fileErrors] of errorsByFile.entries()) {
      console.log(`${colors.bold}${file}:${colors.reset}`)
      for (const error of fileErrors) {
        const lineInfo = error.line > 0 ? `:${error.line}` : ''
        console.log(`  ${colors.red}✗${colors.reset} [${error.type}]${lineInfo} ${error.message}`)
        if (error.hint) {
          console.log(`    ${colors.yellow}→${colors.reset} ${error.hint}`)
        }
      }
      console.log('')
    }
    
    console.log('Please fix these issues before proceeding.')
    return false
  } else {
    printSuccess('All prompt files passed integrity validation!')
    if (VERBOSE) {
      console.log('')
      printInfo('Files checked:')
      const files = discoverFiles()
      for (const file of files) {
        const relPath = file.replace(`${REPO_ROOT}/`, '')
        console.log(`  ${colors.green}✓${colors.reset} ${relPath}`)
      }
    }
    return true
  }
}

// Main
function main(): void {
  // Parse arguments
  const args = process.argv.slice(2)
  const patterns: string[] = []
  
  for (const arg of args) {
    switch (arg) {
      case '-v':
      case '--verbose':
        VERBOSE = true
        break
      case '-h':
      case '--help':
        usage()
        break
      default:
        if (!arg.startsWith('-')) {
          patterns.push(arg)
        } else {
          console.log(`${colors.red}Unknown option: ${arg}${colors.reset}`)
          usage()
        }
    }
  }
  
  printHeader()
  
  // Discover files
  printInfo('Discovering agent/subagent files...')
  const files = discoverFiles(patterns.length > 0 ? patterns : undefined)
  
  if (files.length === 0) {
    printError('No markdown files found to validate')
    process.exit(2)
  }
  
  printInfo(`Found ${files.length} file(s) to validate`)
  console.log('')
  
  // Validate each file
  printInfo('Validating prompt integrity...')
  console.log('')
  
  TOTAL_FILES = files.length
  
  for (const file of files) {
    const relPath = file.replace(`${REPO_ROOT}/`, '')
    const fileErrors = validateFile(file)
    
    if (fileErrors.length > 0) {
      INVALID_FILES++
      ERRORS.push(...fileErrors)
      
      if (VERBOSE) {
        printError(`${relPath}: ${fileErrors.length} error(s) found`)
        for (const error of fileErrors) {
          const lineInfo = error.line > 0 ? `:${error.line}` : ''
          console.log(`  ${colors.red}✗${colors.reset} [${error.type}]${lineInfo} ${error.message}`)
        }
        console.log('')
      }
    } else {
      VALID_FILES++
      if (VERBOSE) {
        printSuccess(`${relPath}: OK`)
      }
    }
  }
  
  // Print summary and exit
  if (printSummary()) {
    process.exit(0)
  } else {
    process.exit(1)
  }
}

main()
