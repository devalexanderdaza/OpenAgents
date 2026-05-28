#!/usr/bin/env bun

import { existsSync, readdirSync, readFileSync } from "node:fs"
import { join, relative } from "node:path"
import { fileURLToPath } from "node:url"

const repoRoot = join(fileURLToPath(new URL(".", import.meta.url)), "..", "..")

const allowedPackageLockDirs = new Set([
  ".",
  ".opencode",
  "packages/compatibility-layer",
])

const allowedBunLockDirs = new Set([
  ".", // transitional compatibility only (not authority)
  "packages/plugin-abilities",
  ".opencode/plugin",
  ".opencode/tool",
])

const requiredLockfiles = [
  "package-lock.json",
  "packages/plugin-abilities/bun.lock",
  ".opencode/plugin/bun.lock",
  ".opencode/tool/bun.lock",
].sort()

const ignoredDirs = new Set([".git", "node_modules", "dist", "build"])

type LockfileRecord = {
  path: string
  dir: string
  name: "package-lock.json" | "bun.lock" | "yarn.lock" | "pnpm-lock.yaml"
}

function walk(dir: string, out: string[]) {
  const entries = readdirSync(dir, { withFileTypes: true })

  for (const entry of entries) {
    const abs = join(dir, entry.name)
    const rel = relative(repoRoot, abs).replaceAll("\\", "/")

    if (entry.isDirectory()) {
      if (ignoredDirs.has(entry.name)) continue
      walk(abs, out)
      continue
    }

    if (entry.isFile() && ["package-lock.json", "bun.lock", "yarn.lock", "pnpm-lock.yaml"].includes(entry.name)) {
      out.push(rel)
    }
  }
}

function normalizeDir(filePath: string) {
  const lastSlash = filePath.lastIndexOf("/")
  return lastSlash === -1 ? "." : filePath.slice(0, lastSlash)
}

function readRootPackageManager(): string | undefined {
  const packageJsonPath = join(repoRoot, "package.json")
  try {
    const content = JSON.parse(readFileSync(packageJsonPath, "utf8")) as {
      packageManager?: string
    }
    return content.packageManager
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    throw new Error(`Failed to parse root package.json at ${packageJsonPath}: ${message}`)
  }
}

function main() {
  const lockfiles: string[] = []
  walk(repoRoot, lockfiles)
  lockfiles.sort()

  const records: LockfileRecord[] = lockfiles.map((path) => ({
    path,
    dir: normalizeDir(path),
    name: path.endsWith("/bun.lock") || path === "bun.lock"
      ? "bun.lock"
      : path.endsWith("/package-lock.json") || path === "package-lock.json"
        ? "package-lock.json"
        : path.endsWith("/yarn.lock") || path === "yarn.lock"
          ? "yarn.lock"
          : "pnpm-lock.yaml",
  }))

  const violations: string[] = []

  const rootPackageManager = readRootPackageManager()
  if (rootPackageManager && !rootPackageManager.startsWith("npm@")) {
    violations.push(
      `Root package.json "packageManager" must use npm when present; found "${rootPackageManager}".`,
    )
  }

  for (const required of requiredLockfiles) {
    if (!existsSync(join(repoRoot, required))) {
      violations.push(`Missing required lockfile: ${required}`)
    }
  }

  for (const record of records) {
    if (record.name === "package-lock.json" && !allowedPackageLockDirs.has(record.dir)) {
      violations.push(
        `Disallowed package-lock.json location: ${record.path} (allowed dirs: ${Array.from(allowedPackageLockDirs).sort().join(", ")})`,
      )
    }

    if (record.name === "bun.lock" && !allowedBunLockDirs.has(record.dir)) {
      violations.push(
        `Disallowed bun.lock location: ${record.path} (allowed dirs: ${Array.from(allowedBunLockDirs).sort().join(", ")})`,
      )
    }

    if (record.name === "yarn.lock" || record.name === "pnpm-lock.yaml") {
      violations.push(`Disallowed lockfile type: ${record.path} (${record.name} is not permitted)`)
    }
  }

  const byDir = new Map<string, Set<LockfileRecord["name"]>>()
  for (const record of records) {
    const current = byDir.get(record.dir) ?? new Set<LockfileRecord["name"]>()
    current.add(record.name)
    byDir.set(record.dir, current)
  }

  for (const [dir, names] of Array.from(byDir.entries()).sort((a, b) => a[0].localeCompare(b[0]))) {
    if (dir === ".") continue
    if (names.has("package-lock.json") && names.has("bun.lock")) {
      violations.push(`Disallowed mixed lockfiles in same directory: ${dir}`)
    }
  }

  console.log("Package manager policy validation")
  console.log("=================================")
  console.log(`Scanned lockfiles: ${records.length}`)
  console.log(`- package-lock.json: ${records.filter((r) => r.name === "package-lock.json").length}`)
  console.log(`- bun.lock: ${records.filter((r) => r.name === "bun.lock").length}`)

  if (violations.length === 0) {
    console.log("\n✅ PASS: package manager/lockfile policy is compliant.")
    process.exit(0)
  }

  console.log(`\n❌ FAIL: found ${violations.length} policy violation(s):`)
  for (const violation of violations.sort((a, b) => a.localeCompare(b))) {
    console.log(`- ${violation}`)
  }
  process.exit(1)
}

main()
